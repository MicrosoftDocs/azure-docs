---
title: The Azure Maps Android SDK migration guide
titleSuffix: Microsoft Azure Maps
description: Find out how to migrate your Azure Maps Android SDK applications to the Web SDK using a WebView.
author: sinnypan
ms.author: sipa
ms.date: 02/20/2024
ms.topic: how-to
ms.service: azure-maps
---

# The Azure Maps Android SDK migration guide

Migrating from the Azure Maps Android SDK to the Web SDK in a WebView involves transitioning your existing map view from a native implementation to a web-based map using the Azure Maps Web SDK. This guide shows you how to migrate your code and features from the Android SDK to the Web SDK.

> [!NOTE]
>
> **Azure Maps Android SDK retirement**
>
> The Azure Maps Native SDK for Android is now deprecated and will be retired on 3/31/25. To avoid service disruptions, migrate to the Azure Maps Web SDK by 3/31/25.

## Prerequisites

To use the Map Control in a web page, you must have one of the following prerequisites:

* An [Azure Maps account].
* A [subscription key] or Microsoft Entra credentials. For more information, see [authentication options].

## Create a WebView

Add a WebView if your Android application doesn't have one. Do so by adding the `WebView` element to your layout XML or programmatically in your Java code. Be sure it's configured to occupy the desired area of your layout.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

Enable internet access by adding permissions in _AndroidManifest.xml_.

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

In your activity or fragment, initialize the `WebView` and enable JavaScript by updating the settings. Load the HTML file that contains the Web SDK code. You can either load it from the assets folder or from a remote URL.

```java
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        webView = findViewById(R.id.webView);

        // Enable JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load local HTML file from /src/main/assets/map.html
        webView.loadUrl("file:///android_asset/map.html");
    }
}
```

## Set up a map with Azure Maps Web SDK

In your HTML file, initialize a map with your subscription key. Replace `<YOUR_SUBSCRIPTION_KEY>` with your actual key.

 ```html
<!DOCTYPE html>
<html>
    <head>
        <title>Azure Maps</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <!-- Add references to the Azure Maps Map control JavaScript and CSS files. -->
        <link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" type="text/css"/>
        <script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js"></script>
        <style>
            html,
            body,
            #map {
                margin: 0;
                height: 100%;
                width: 100%;
            }
            body {
                display: flex;
                flex-direction: column;
            }
            main {
                flex: 1 1 auto;
            }
        </style>
        <script type="text/javascript">
            // Create an instance of the map control.
            function InitMap() {
                var map = new atlas.Map("map", {
                    center: [-122.33, 47.6],
                    zoom: 12,
                    authOptions: {
                        authType: "subscriptionKey",
                        subscriptionKey: "<YOUR_SUBSCRIPTION_KEY>"
                    }
                });

                // Wait until the map resources are ready.
                map.events.add("ready", function () {
                    // Resize the map to fill the container.
                    map.resize();
                });
            }
        </script>
    </head>
    <body onload="InitMap()">
        <main>
            <div id="map"></div>
        </main>
    </body>
</html>
```

Save and run the app. A map will appear within a WebView. Add any required features or functionality from the Web SDK. For more information, see [Azure Maps Documentation] and [Azure Maps Samples].

:::image type="content" source="./media/android-sdk-migration-guide/maps-android.png" alt-text="A screenshot of a map in a WebView.":::

## Communication between native code and WebView (optional)

To enable communication between your Android application and the WebView, you can use the WebView's `addJavascriptInterface` method to expose a Java object to the JavaScript running in the WebView. It allows you to call Java methods from your JavaScript code. For more information, see [WebView] in the Android documentation.

## Clean Up Native Map Implementation

Remove code related to the native Azure Maps Android SDK, including dependencies and initialization code related to `com.azure.android:azure-maps-control`.

## Testing

Test your application thoroughly to ensure the migration was successful. Check for issues related to map functionality, user interactions, and performance.

## Next steps

Learn how to add maps to web and mobile applications using the Map Control client-side JavaScript library in Azure Maps:

> [!div class="nextstepaction"]
> [Use the Azure Maps map control]

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[authentication options]: /javascript/api/azure-maps-control/atlas.authenticationoptions
[Azure Maps Documentation]: how-to-use-map-control.md
[Azure Maps Samples]: https://samples.azuremaps.com/
[WebView]: https://developer.android.com/reference/android/webkit/WebView
[Use the Azure Maps map control]: how-to-use-map-control.md
