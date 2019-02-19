---
title: How to use Android map control in Azure Maps | Microsoft Docs
description: Use Android map control in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 02/12/2019
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
---

# How to use Azure Maps Android SDK

The Azure Maps Android SDK is a vector maps library for Android. This article will guide you through the process of installing the Azure Maps Android SDK, loading a map, and placing a pin on it.

## Prerequisites to get started

### Create an Azure Maps account 

To follow steps in this guide, you first need to see [manage account and keys](how-to-manage-account-keys.md) to create and manage your account subscription with S1 pricing tier.

### Download Android studio

You can download [Android Studio](https://developer.android.com/studio/) for free from Google. In order to install the Azure Maps Android SDK, you'll need to first download Android Studio and create a project with an empty activity.

## Create a project in Android Studio

You'll need to create a new project with an empty activity. Follow the steps below to create a new Android Studio project:

1. Under *Choose your project*, check "Phone and Tablet" as form factor that your application will run on.
2. Click *Empty  Activity* under form factor and click **Next**.
3. Under *Configure your project*, select `API 21: Android 5.0.0 (Lollipop)` as the minimum SDK. This is the lowest version supported by Azure Maps Android SDK.
4. Accept the default `Activity Name` and `Layout Name` and click **Finish**

See [Android Studio documentation](https://developer.android.com/studio/intro/) for more help installing Android Studio and Creating a new project.

![create a new project](./media/how-to-use-android-map-control-library/form-factor-android.png)

## Set up a virtual device

Android Studio lets you set up a virtual Android device on your computer. Which can help to test your application while you develop. To set up a virtual device click on the Android Virtual Device (AVD) Manager icon on the top right of your project screen. Then click the **Create Virtual Device** button. You can also get to the manager via **Tools > Android > AVD Manager** in the toolbar. From the **Phones** category, select **Nexus 5X** and click **Next**.

Learn more about setting up an AVD in the [Android Studio documentation](https://developer.android.com/studio/run/managing-avds).

![Android Emulator](./media/how-to-use-android-map-control-library/android-emulator.png)

## Install Azure Maps Android SDK

Before you move forward towards building your application, follow the steps below to install Azure Maps Android SDK. 

1. Add the following to the **all projects**, repositories block in your **build.gradle** file.

    ```
    maven {
            url "https://atlas.microsoft.com/sdk/android"
    }
    ```

2. Update your **app/build.gradle** and add the following to it:

    1. Add the following to the Android block:

        ```
        compileOptions {
            sourceCompatibility JavaVersion.VERSION_1_8
            targetCompatibility JavaVersion.VERSION_1_8
        }
        ```
    2. Update your dependencies block and add the following to it:

        ```
        implementation "com.microsoft.azure.maps:mapcontrol:0.1"
        ```

3. Set up permissions by adding the following to your **AndroidManifest.xml**

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <manifest>
        ...
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        ...
    </manifest>
    ```

4. Edit **res > layout > activity_main.xml**, so it looks like the XML below:
    
    ```XML
    <?xml version="1.0" encoding="utf-8"?>
    <FrameLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        >

        <com.microsoft.azure.maps.mapcontrol.MapControl
            android:id="@+id/mapcontrol"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            app:mapcontrol_cameraTargetLat="47.64"
            app:mapcontrol_cameraTargetLng="-122.33"
            app:mapcontrol_cameraZoom="12"
            />

    </FrameLayout>
    ```

5. Edit **MainActivity.java** to create a map view activity class. After editing it should look like the class below:

    ```java
    package com.example.myapplication;

    import android.support.v7.app.AppCompatActivity;
    import android.os.Bundle;
    import com.microsoft.azure.maps.mapcontrol.AzureMaps;
    import com.microsoft.azure.maps.mapcontrol.MapControl;
    import com.microsoft.azure.maps.mapcontrol.layer.SymbolLayer;
    import com.microsoft.azure.maps.mapcontrol.options.MapStyle;
    import com.microsoft.azure.maps.mapcontrol.source.DataSource;

    public class MainActivity extends AppCompatActivity {
        
        static {
            AzureMaps.setSubscriptionKey("{subscription-key}");
        }

        MapControl mapControl;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            mapControl = findViewById(R.id.mapcontrol);

            mapControl.onCreate(savedInstanceState);

        }

        @Override
        public void onResume() {
            super.onResume();
            mapControl.onResume();
        }

        @Override
        public void onPause() {
            super.onPause();
            mapControl.onPause();
        }

        @Override
        public void onStop() {
            super.onStop();
            mapControl.onStop();
        }

        @Override
        public void onLowMemory() {
            super.onLowMemory();
            mapControl.onLowMemory();
        }

        @Override
        protected void onDestroy() {
            super.onDestroy();
            mapControl.onDestroy();
        }

        @Override
        protected void onSaveInstanceState(Bundle outState) {
            super.onSaveInstanceState(outState);
            mapControl.onSaveInstanceState(outState);
        }

    }

    ```

## Import Classes

After completing the steps above, you will most likely get warnings from Android Studio on some of the text in the code. To resolve these warnings, import the classes being referenced in `MainActivity.java`.

You can automatically import these classes by pressing `Alt`+`Enter`(`Option`+`Return` on Mac). 

Click the **Run 'App'** button (or `Control`+`R` on a Mac) to build your application.

![Click Run](./media/how-to-use-android-map-control-library/run-app.png)

It will take a few seconds for android studio to build the application. After the build is finish you can test your application in the emulated Android device. You will see a map like the one below.

![Android map](./media/how-to-use-android-map-control-library/android-map.png)

## Add a marker to the map

In order to add a marker on to your map, Add `mapView.getMapAsync()` function to the `MainActivity.java`. The final `MainActivity.java` should look like the following:

```java
package com.example.myapplication;

import android.app.Activity;
import android.os.Bundle;
import com.mapbox.geojson.Feature;
import com.mapbox.geojson.Point;
import com.microsoft.azure.maps.mapcontrol.AzureMaps;
import com.microsoft.azure.maps.mapcontrol.MapControl;
import com.microsoft.azure.maps.mapcontrol.layer.SymbolLayer;
import com.microsoft.azure.maps.mapcontrol.source.DataSource;
import static com.microsoft.azure.maps.mapcontrol.options.SymbolLayerOptions.iconImage;
public class MainActivity extends AppCompatActivity {
    
    static{
            AzureMaps.setSubscriptionKey("{subscription-key}");
        }

    MapControl mapControl;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapControl = findViewById(R.id.mapcontrol);

        mapControl.onCreate(savedInstanceState);

        mapControl.getMapAsync(map -> {
            DataSource dataSource = new DataSource();
            dataSource.add(Feature.fromGeometry(Point.fromLngLat(-122.33, 47.64)));

            SymbolLayer symbolLayer = new SymbolLayer(dataSource);
            symbolLayer.setOptions(iconImage("my-icon"));

            map.images.add("my-icon", R.drawable.mapcontrol_marker_red);
            map.sources.add(dataSource);
            map.layers.add(symbolLayer);
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        mapControl.onStart();
    }

    @Override
    public void onResume() {
        super.onResume();
        mapControl.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mapControl.onPause();
    }

    @Override
    public void onStop() {
        super.onStop();
        mapControl.onStop();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapControl.onLowMemory();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapControl.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapControl.onSaveInstanceState(outState);
    }
}
```

Rerun your application and you should see a marker on the map like the one below.

![Android map pin](./media/how-to-use-android-map-control-library/android-map-pin.png)