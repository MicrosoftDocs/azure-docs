---
title: Getting started with web map control in Azure Maps | Microsoft Docs 
description: Learn how to use the Azure Maps Map Control client-side Javascript library.
author: walsehgal
ms.author: v-musehg
ms.date: 10/08/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Use the Azure Maps Map Control

The Map Control client-side Javascript library allows you to render maps and embedded Azure Maps functionality into your web or mobile application.

## Create a new map in a web page

You can embed a map in a web page by using the Map Control client-side Javascript library.

1. Create a new HTML file.

2. Load in the Azure Maps Web SDK. This can be done using one of two options;

    a. Use the globally hosted CDN version of the Azure Maps Web SDK by adding the URL endpoints to the stylesheet and script references in the `<head>` element of the file:

    ```HTML
    <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css">
    <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
    ```

    b. Alternatively, load the Azure Maps Web SDK source code locally using the [azure-maps-control](https://www.npmjs.com/package/azure-maps-control) NPM package and host it with your app. This package also includes TypeScript definitions.

    > npm install azure-maps-control

    Then add references to the Azure Maps stylesheet and script source references to the `<head>` element of the file:

    ```HTML
    <link rel="stylesheet" href="node_modules/azure-maps-control/dist/css/atlas.min.css" type="text/css">
    <script src="node_modules/azure-maps-control/dist/js/atlas.min.js"></script>
    ```

3. To render the map so that it fills the full body of the page, add the following `<style>` element to the `<head>` element.

    ```HTML
    <style>
        html, body {
            margin: 0;
        }

        #myMap {
            height: 100vh;
            width: 100vw;
        }
    </style>
    ```

4. In the body of the page, add a `<div>` element and give it an `id` of **myMap**.

    ```HTML
    <body>
        <div id="myMap"></div>
    </body>
    ```

5. To initialize the map control, define a new section in the html body and create a script. Pass in the `id` of the map `<div>` or an `HTMLElement` (for example, `document.getElementById('myMap')`) as the first parameter when creating an instance of the `Map` class. Use your own Azure Maps account key or Azure Active Directory (AAD) credentials to authenticate the map using [authentication options](https://docs.microsoft.com/javascript/api/azure-maps-control/atlas.authenticationoptions). If you need to create an account or find your key, see [How to manage your Azure Maps account and keys](how-to-manage-account-keys.md). The **language** option specifies the language to be used for map labels and controls. For more information on supported languages, see [supported languages](supported-languages.md). If using a subscription key for authentication.

    ```HTML
    <script type="text/javascript">
        var map = new atlas.Map('myMap', {
            center: [-122.33, 47.6],
            zoom: 12,
            language: 'en-US',
            authOptions: {
                authType: 'subscriptionKey',
                subscriptionKey: '<Your Azure Maps Key>'
            }
        });
    </script>
    ```

    If using Azure Active Directory (AAD) for authentication:

    ```HTML
    <script type="text/javascript">
        var map = new atlas.Map('myMap', {
            center: [-122.33, 47.6],
            zoom: 12,
            language: 'en-US',
            authOptions: {
                authType: 'aad',
                clientId: '<Your AAD Client Id>',
                aadAppId: '<Your AAD App Id>',
                aadTenant: 'msft.ccsctp.net'
            }
        });
    </script>
    ```

    For more information, see [Authentication with Azure Maps](azure-maps-authentication.md) for more details.

6. Optionally, you may find adding the following meta tag elements to the head of your page helpful:

    ```HTML
    <!-- Ensures that IE and Edge uses the latest version and doesn't emulate an older version -->
    <meta http-equiv="x-ua-compatible" content="IE=Edge">

    <!-- Ensures the web page looks good on all screen sizes. -->
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    ```

7. Putting it all together your HTML file should look something like the following code:

    ```HTML
    <!DOCTYPE html>
    <html>
    <head>
        <title></title>

        <meta charset="utf-8">

        <!-- Ensures that IE and Edge uses the latest version and doesn't emulate an older version -->
        <meta http-equiv="x-ua-compatible" content="IE=Edge">

        <!-- Ensures the web page looks good on all screen sizes. -->
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css">
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>

        <style>
            html, body {
                margin: 0;
            }

            #myMap {
                height: 100vh;
                width: 100vw;
            }
        </style>
    </head>
    <body>
        <div id="myMap"></div>

        <script type="text/javascript">
            //Create an instance of the map control and set some options.
            var map = new atlas.Map('myMap', {
                center: [-122.33, 47.6],
                zoom: 12,
                language: 'en-US',
                authOptions: {
                    authType: 'subscriptionKey',
                    subscriptionKey: '<Your Azure Maps Key>'
                }
            });
        </script>
    </body>
    </html>
    ```

8. Open the file in your web browser and view the rendered map. It should look like the following code:

    <iframe height="700" style="width: 100%;" scrolling="no" title="How to use the map control" src="//codepen.io/azuremaps/embed/yZpEYL/?height=557&theme-id=0&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">See the Pen <a href='https://codepen.io/azuremaps/pen/yZpEYL/'>How to use the map control</a> by Azure Maps(<a href='https://codepen.io/azuremaps'>@azuremaps</a>) on <a href='https://codepen.io'>CodePen</a>.
    </iframe>

## Next steps

Learn how to create and interact with a map:

> [!div class="nextstepaction"]
> [Create a map](map-create.md)

Learn how to style a map:

> [!div class="nextstepaction"]
> [Choose a map style](choose-map-style.md)
