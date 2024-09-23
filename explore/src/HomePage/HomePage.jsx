import * as React from "react";
import data from "../data/db.json";
import { src, srcset } from "../js/utils";
import './HomePage.css'
import Recommendations from "../Recommendations/Recommendations";

const HomePage = () => {
  const skus = ["CL-01-GY", "AU-07-MT"];

  return (
    <div data-boundary-page="explore">
      <main className="e_HomePage">
        {data.teaser.map(({ title, image, url }, i) => (
          <a className="e_HomePage__categoryLink" href={url} key={i}>
            <img
              src={src(image, 500)}
              srcSet={srcset(image, [500, 1000])}
              sizes="100vw, (min-width: 500px) 50vw"
              alt=""
            />
            {title}
          </a>
        ))}
        <div className="e_HomePage__recommendations">
          <Recommendations skus={skus}/>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
