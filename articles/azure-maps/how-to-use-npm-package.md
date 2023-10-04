---
title: How to use the Azure Maps map control npm package
titleSuffix: Microsoft Azure Maps
description: Learn how to add maps to node.js applications by using the map control npm package in Azure Maps. 
author: sinnypan
ms.author: sipa
ms.date: 07/04/2023
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom: devx-track-js
---

# Use the azure-maps-control npm package

The [azure-maps-control] npm package is a client-side library that allows you to embed the Azure Maps map control into your node.js applications using JavaScript or TypeScript. This library makes it easy to use the Azure Maps REST services and lets you customize interactive maps with your content and imagery.

## Prerequisites

To use the npm package in an application, you must have the following prerequisites:

* An [Azure Maps account]
* A [subscription key] or Azure Active Directory (Azure AD) credentials. For more information, see [authentication options].

## Installation

Install the latest [azure-maps-control] package.
  
```powershell
npm install azure-maps-control
```

This package includes a minified version of the source code, CSS Style Sheet, and the TypeScript definitions for the Azure Maps map control.

You would also need to embed the CSS Style Sheet for various controls to display correctly. If you're using a JavaScript bundler to bundle the dependencies and package your code, refer to your bundler's documentation on how it's done. For [Webpack], it's commonly done via a combination of `style-loader` and `css-loader` with documentation available at [style-loader].

To begin, install `style-loader` and `css-loader`:

```powershell
npm install --save-dev style-loader css-loader
```

Inside your source file, import _atlas.min.css_:

```js
import "azure-maps-control/dist/atlas.min.css";
```

Then add loaders to the module rules portion of the Webpack config:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

Refer to the following section for a complete example.

## Create a map in a node.js application

Embed a map in a web page using the map control npm package.

1. Create a new project

    ```powershell
    npm init
    ```

    `npm init` is a command that helps you create a _package.json_ file for your node project. It asks you some questions and generates the file based on your answers. You can also use `-y` or `–yes` to skip the questions and use the default values. The _package.json_ file contains information about your project, such as its name, version, dependencies, scripts, etc.

2. Install the latest [azure-maps-control] package.
  
    ```powershell
    npm install azure-maps-control
    ```

3. Install Webpack and other dev dependencies.

    ```powershell
    npm install --save-dev webpack webpack-cli style-loader css-loader
    ```

4. Update _package.json_ by adding a new script for `"build": "webpack"`. The file should now look something like the following:

    ```js
    {
      "name": "azure-maps-npm-demo",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "azure-maps-control": "^2.3.1"
      },
      "devDependencies": {
        "css-loader": "^6.8.1",
        "style-loader": "^3.3.3",
        "webpack": "^5.88.1",
        "webpack-cli": "^5.1.4"
      }
    }
    ```

5. Create a Webpack config file named _webpack.config.js_ in the project's root folder. Include these settings in the config file.

    ```js
    module.exports = {
      entry: "./src/js/main.js",
      mode: "development",
      output: {
        path: `${__dirname}/dist`,
        filename: "bundle.js"
      },
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"]
          }
        ]
      }
    };
    ```

6. Add a new JavaScript file at _./src/js/main.js_ with this code.
    
    ```js
    import * as atlas from "azure-maps-control";
    import "azure-maps-control/dist/atlas.min.css";
    
    const onload = () => {
      // Initialize a map instance.
      const map = new atlas.Map("map", {
        view: "Auto",
        // Add authentication details for connecting to Azure Maps.
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: "<Your Azure Maps Key>"
        }
      });
    };
    
    document.body.onload = onload;
    ```

7. Add a new HTML file named _index.html_ in the project's root folder with this content:

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Azure Maps demo</title>
        <script src="./dist/bundle.js" async></script>
        <style>
          html,
          body,
          #map {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
    ```

    Your project should now have the following files:

    ```
    ├───node_modules
    ├───index.html
    ├───package-lock.json
    ├───package.json
    ├───webpack.config.js
    └───src
        └───js
            └───main.js
    ```

8. Run the following command to generate a JavaScript file at _./dist/bundle.js_

    ```powershell
    npm run build
    ```

9. Open the file _index.html_ in your web browser and view the rendered map. It should look like the following image:

   :::image type="content" source="./media/how-to-use-npm-package/map-of-the-world.png" alt-text="A screenshot showing a map of the world.":::

## Use other Azure Maps npm packages

Azure Maps offers other modules as npm packages that can be integrated into your application. These modules include:
- [azure-maps-drawing-tools]
- [azure-maps-indoor]
- [azure-maps-spatial-io]

The following sample shows how to import a module and use it in your application. This sample uses [azure-maps-spatial-io] to read a `POINT(-122.34009 47.60995)` string as GeoJSON and renders it on the map using a bubble layer.

1. Install the npm package.
  
    ```powershell
    npm install azure-maps-spatial-io
    ```

2. Then, use an import declaration to add the module to a source file:

    ```js
    import * as spatial from "azure-maps-spatial-io";
    ```

3. Use `spatial.io.ogc.WKT.read()` to parse the text.

    ```js
    import * as atlas from "azure-maps-control";
    import * as spatial from "azure-maps-spatial-io";
    import "azure-maps-control/dist/atlas.min.css";
    
    const onload = () => {
      // Initialize a map instance.
      const map = new atlas.Map("map", {
        center: [-122.34009, 47.60995],
        zoom: 12,
        view: "Auto",
        // Add authentication details for connecting to Azure Maps.
        authOptions: {
          authType: "subscriptionKey",
          subscriptionKey: "<Your Azure Maps Key>"
        }
      });
    
      // Wait until the map resources are ready.
      map.events.add("ready", () => {
        // Create a data source and add it to the map.
        const datasource = new atlas.source.DataSource();
        map.sources.add(datasource);
    
        // Create a layer to render the data
        map.layers.add(new atlas.layer.BubbleLayer(datasource));
    
        // Parse the point string.
        var point = spatial.io.ogc.WKT.read("POINT(-122.34009 47.60995)");
    
        // Add the parsed data to the data source.
        datasource.add(point);
      });
    };
    
    document.body.onload = onload;
    ```

4. Webpack 5 may throw errors about not being able to resolve some node.js core modules. Add these settings to your Webpack config file to fix the problem.

   ```js
   module.exports = {
     // ...
     resolve: {
       fallback: { "crypto": false, "worker_threads": false }
     }
   };
   ```

This image is a screenshot of the sample’s output.

:::image type="content" source="./media/how-to-use-npm-package/map-of-seattle.png" alt-text="A screenshot showing a map of Seattle with a blue dot.":::


## Next steps

Learn how to create and interact with a map:

> [!div class="nextstepaction"]
> [Create a map](map-create.md)

Learn how to style a map:

> [!div class="nextstepaction"]
> [Choose a map style](choose-map-style.md)

Learn best practices and see samples:

> [!div class="nextstepaction"]
> [Best practices](web-sdk-best-practices.md)

> [!div class="nextstepaction"]
> [Code samples](/samples/browse/?products=azure-maps)

[azure-maps-control]: https://www.npmjs.com/package/azure-maps-control
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[authentication options]: /javascript/api/azure-maps-control/atlas.authenticationoptions
[Webpack]: https://webpack.js.org/
[style-loader]: https://webpack.js.org/loaders/style-loader/
[azure-maps-drawing-tools]: ./set-drawing-options.md
[azure-maps-indoor]: ./how-to-use-indoor-module.md
[azure-maps-spatial-io]: ./how-to-use-spatial-io-module.md
