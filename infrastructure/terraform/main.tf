provider "google" {
  project = "future-function-456309-j0"
  region  = "europe-west3" # Nearest region to Paris
}

# Static Website Bucket
resource "google_storage_bucket" "static_website" {
  name                        = "tractor-v2-module-federation"
  location                    = "EU" # Use multi-region EU for storage
  force_destroy               = true
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "app-shell/index.html"
  }
}

# Public Access to Bucket Objects
resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.static_website.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Reserve a Global IP Address
resource "google_compute_global_address" "static_ip" {
  name = "static-website-ip"
}

# SSL Certificate
resource "google_compute_managed_ssl_certificate" "ssl_cert" {
  name = "static-website-cert"
  managed {
    domains = ["brm.ovh"]
  }
}

# Backend Bucket
resource "google_compute_backend_bucket" "backend" {
  name        = "static-website-backend"
  bucket_name = google_storage_bucket.static_website.name
}

# URL Map
resource "google_compute_url_map" "url_map" {
  name            = "static-website-url-map"
  default_service = google_compute_backend_bucket.backend.id
}

# Target HTTPS Proxy
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "static-website-https-proxy"
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_cert.id]
  url_map          = google_compute_url_map.url_map.id
}

# Forwarding Rule
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name        = "static-website-https-rule"
  ip_address  = google_compute_global_address.static_ip.address
  port_range  = "443"
  target      = google_compute_target_https_proxy.https_proxy.id
}
