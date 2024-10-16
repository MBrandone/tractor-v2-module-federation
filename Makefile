build-all:
	cd app-shell && npm run build && cd .. && \
	cd checkout && npm run build && cd .. && \
	cd decide && npm run build && cd .. && \
	cd explore && npm run build && cd ..

deploy-all:
	gcloud storage cp -r app-shell/dist/** gs://tractor-v2-module-federation/app-shell --cache-control='no-store' && \
	gcloud storage cp -r checkout/dist/** gs://tractor-v2-module-federation/checkout --cache-control='no-store' && \
	gcloud storage cp -r decide/dist/** gs://tractor-v2-module-federation/decide --cache-control='no-store' && \
	gcloud storage cp -r explore/dist/** gs://tractor-v2-module-federation/explore --cache-control='no-store'

delete-all:
	gcloud storage rm -r gs://tractor-v2-module-federation/app-shell && \
	gcloud storage rm -r gs://tractor-v2-module-federation/checkout && \
	gcloud storage rm -r gs://tractor-v2-module-federation/decide && \
	gcloud storage rm -r gs://tractor-v2-module-federation/explore

dev-all:
	npx concurrently \
    		--names "app-shell,checkout,decide,explore" \
    		-c "bgBlue.bold,bgMagenta.bold,bgGreen.bold,bgRed.bold" \
    		"cd app-shell && npm run dev" "cd checkout && npm run dev" "cd decide && npm run dev" "cd explore && npm run dev"
