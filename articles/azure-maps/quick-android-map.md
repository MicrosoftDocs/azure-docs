---
title: 'Quickstart: Create an Android app with Azure Maps'
titleSuffix:  Microsoft Azure Maps
description: 'Quickstart: Learn how to create an Android app using the Azure Maps Android SDK.'
author: sinnypan
ms.author: sipa
ms.date: 09/22/2022
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
ms.custom: mvc, mode-other
zone_pivot_groups: azure-maps-android
---

# Quickstart: Create an Android app with Azure Maps

This article shows you how to add the Azure Maps to an Android app. It walks you through these basic steps:

* Set up your development environment.
* Create your own Azure Maps account.
* Get your primary Azure Maps key to use in the app.
* Reference the Azure Maps libraries from the project.
* Add an Azure Maps control to the app.

## Prerequisites

1. A subscription to [Microsoft Azure](https://azure.microsoft.com). If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

1. [Android Studio](https://developer.android.com/studio/). If you don't have Android Studio, you can get it for free from Google.

> [!NOTE]
> Many of the instructions in this quickstart were created using Android Studio Arctic Fox (2020.3.1). If you use a different version of Android Studio, the steps specific to Android Studio may vary.

## Create an Azure Maps account

Create a new Azure Maps account using the following steps:

1. In the upper left-hand corner of the [Azure portal](https://portal.azure.com), select **Create a resource**.
2. In the *Search the Marketplace* box, type **Azure Maps**, then select **Azure Maps** from the search results.
3. Select the **Create** button.
4. On the **Create Maps Account** page, enter the following values:
    * The *Subscription* that you want to use for this account.
    * The *Resource group* name for this account. You may choose to *Create new* or *Use existing* resource group.
    * The *Name* of your new account.
    * The *Pricing tier* for this account. Select *Gen2*.
    * Read the *Terms*, and check the checkbox to confirm that you have read and agree to the License and Privacy Statement.
    * Select the **Review + create** button.
    * Once you've ensured that everything is correct in the **Review + create** page, select the **Create** button.

    :::image type="content" source="./media/shared/create-account.png" alt-text="A screenshot that shows the Create Maps account pane in the Azure portal.":::

## Get the subscription key for your account

Once your Azure Maps account is successfully created, retrieve the subscription key that enables you to query the Maps APIs.

1. Open your Azure Maps account in the portal.
2. In the left pane, select **Authentication**.
3. Copy the **Primary Key** and save it locally to use later in this tutorial.

>[!NOTE]
> For security purposes, it is recommended that you rotate between your primary and secondary keys. To rotate keys, update your app to use the secondary key, deploy, then press the cycle/refresh button beside the primary key to generate a new primary key. The old primary key will be disabled. For more information on key rotation, see [Set up Azure Key Vault with key rotation and auditing](../key-vault/secrets/tutorial-rotation-dual.md)

:::image type="content" source="./media/quick-android-map/get-key.png" alt-text="A screenshot showing the Azure Maps Primary key in the Azure portal.":::

## Create a project in Android Studio

Complete the following steps to create a new project with an empty activity in Android Studio:

1. Start Android Studio and select **New** from the **File** menu, then **New Project...**

1. In the **New Project**  screen, select **Phone and Tablet** from the **Templates** list on the left side of the screen.

    :::image type="content" source="./media/quick-android-map/2-new-project.png" alt-text="A screenshot that shows the New Project screen in Android Studio.":::

1. Select **Empty Activity** from the list of templates, then **Next**.

    :::image type="content" source="./media/quick-android-map/3-empty-activity.png" alt-text="A screenshot that shows the Create an Empty Activity screen in Android Studio.":::

1. In the **Empty Activity** screen you'll need to enter values for the following fields:
    * **Name**. Enter **AzureMapsApp**.
    * **Package name**. Use the default **com.example.azuremapsapp**.
    * **Save location**. Use the default or select a new location to save your project files. Avoid using spaces in the path or filename due to potential problems with the NDK tools.
    * **Language**. Select Kotlin or Java.
    * **Minimum SDK**. Select `API 21: Android 5.0.0 (Lollipop)` as the minimum SDK. It's the earliest version supported by the Azure Maps Android SDK.
1. Select **Finish** to create your new project.

See the [Android Studio documentation](https://developer.android.com/studio/intro/) for more help with installing Android Studio and creating a new project.

## Set up a virtual device

Android Studio lets you set up a virtual Android device on your computer. Doing so can help you test your application during development.

To set up an Android Virtual Device (AVD):

1. Select **AVD  Manager** in the **Tools** menu.
1. The **Android Virtual Device Manager** appears. Select **Create Virtual Device**.
1. In the **Phones** category, select **Nexus 5X**, and then select **Next**.

You can learn more about setting up an AVD in the [Android Studio documentation](https://developer.android.com/studio/run/managing-avds).

:::image type="content" source="./media/quick-android-map/4-avd-select-hardware.png" alt-text="A screenshot that shows the Select Hardware screen in Android Virtual Device Manager when creating a new Virtual Device.":::

## Install the Azure Maps Android SDK

The next step in building your application is to install the Azure Maps Android SDK. Complete these steps to install the SDK:

1. Open the project settings file **settings.gradle** and add the following code to the **repositories** section:

    ```gradle
    maven {url "https://atlas.microsoft.com/sdk/android"}
    ```

2. In the same project settings file **settings.gradle**, change repositoriesMode to `PREFER_SETTINGS`:

    ```gradle
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    ```

   Your project settings file should now appear as follows:

   :::image type="content" source="./media/quick-android-map/project-settings-file.png" alt-text="A screenshot of the project settings file in Android Studio.":::

3. Open the project's **gradle.properties** file, verify that `android.useAndroidX` and `android.enableJetifier` are both set to `true`.
   
   If the **gradle.properties** file doesn't include `android.useAndroidX` and `android.enableJetifier`, add the next two lines to the end of the file:
   
   ```gradle
   android.useAndroidX=true
   android.enableJetifier=true
   ```
   

4. Open the application **build.gradle** file and do the following:

    1. Verify your project's **minSdk** is **21** or higher.

    2. Ensure that your `compileOptions` in the `Android` section are as follows:

       ```gradle
       compileOptions {
           sourceCompatibility JavaVersion.VERSION_1_8
           targetCompatibility JavaVersion.VERSION_1_8
       }
       ```

    3. Update your dependencies block and add a new implementation dependency for the latest Azure Maps Android SDK:

       ```gradle
       implementation 'com.azure.android:azure-maps-control:1.+'
       ```

    4. Select **Sync Project with Gradle Files** from the **File** menu.

      :::image type="content" source="./media/quick-android-map/build-gradle-file.png" alt-text="A screenshot showing the application build dot gradle file in Android Studio.":::

5. Add a map fragment to the main activity:

    ```xml
    <com.azure.android.maps.control.MapControl
        android:id="@+id/mapcontrol"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        />
    ```

   To update the main activity, select  app > res > layout > **activity_main.xml** in the **Project navigator**:

      :::image type="content" source="./media/quick-android-map/project-navigator-activity-main.png" alt-text="A screenshot showing the activity_main.xml file in the Project navigator pane in Android Studio.":::

::: zone pivot="programming-language-java-android"

6. In the **MainActivity.java** file you'll need to:

    * Add imports for the Azure Maps SDK.
    * Set your Azure Maps authentication information.
    * Get the map control instance in the **onCreate** method.

    > [!TIP]
    > By setting the authentication information globally in the `AzureMaps` class using the `setSubscriptionKey` or `setAadProperties` methods, you won't need to add your authentication information in every view.

    The map control contains its own lifecycle methods for managing Android's OpenGL lifecycle. These lifecycle methods must be called directly from the containing Activity. To correctly call the map control's lifecycle methods, override the following lifecycle methods in the Activity that contains the map control, then call the respective map control method.

    * `onCreate(Bundle)`
    * `onDestroy()`
    * `onLowMemory()`
    * `onPause()`
    * `onResume()`
    * `onSaveInstanceState(Bundle)`
    * `onStart()`
    * `onStop()`

    Edit the **MainActivity.java** file as follows:

    ```java
    package com.example.azuremapsapp;
    
    import androidx.appcompat.app.AppCompatActivity;
    import android.os.Bundle;
    import com.azure.android.maps.control.AzureMaps;
    import com.azure.android.maps.control.MapControl;
    import com.azure.android.maps.control.layer.SymbolLayer;
    import com.azure.android.maps.control.options.MapStyle;
    import com.azure.android.maps.control.source.DataSource;
    
    public class MainActivity extends AppCompatActivity {
        
    static {
        AzureMaps.setSubscriptionKey("<Your-Azure-Maps-Primary-Subscription-Key>");

        //Alternatively use Azure Active Directory authenticate.
        //AzureMaps.setAadProperties("<Your-AAD-clientId>", "<Your-AAD-appId>", "<Your-AAD-tenant>");
    }

    MapControl mapControl;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mapControl = findViewById(R.id.mapcontrol);

        mapControl.onCreate(savedInstanceState);

        //Wait until the map resources are ready.
        mapControl.onReady(map -> {

            //Add your post map load code here.

        });
    }

    @Override
    public void onResume() {
        super.onResume();
        mapControl.onResume();
    }

    @Override
    protected void onStart(){
        super.onStart();
        mapControl.onStart();
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
    }}
    ```

::: zone-end

::: zone pivot="programming-language-kotlin"

7. In the **MainActivity.kt** file you'll need to:

    * add imports for the Azure Maps SDK
    * set your Azure Maps authentication information
    * get the map control instance in the **onCreate** method

    > [!TIP]
    > By setting the authentication information globally in the `AzureMaps` class using the `setSubscriptionKey` or `setAadProperties` methods, you won't need to add your authentication information in every view.

    The map control contains its own lifecycle methods for managing Android's OpenGL lifecycle. These lifecycle methods must be called directly from the containing Activity. To correctly call the map control's lifecycle methods, override the following lifecycle methods in the Activity that contains the map control. And, you must call the respective map control method.

    * `onCreate(Bundle)`
    * `onDestroy()`
    * `onLowMemory()`
    * `onPause()`
    * `onResume()`
    * `onSaveInstanceState(Bundle)`
    * `onStart()`
    * `onStop()`

    Edit the **MainActivity.kt** file as follows:

    ```kotlin
    package com.example.azuremapsapp;

    import androidx.appcompat.app.AppCompatActivity
    import android.os.Bundle
    import com.azure.android.maps.control.AzureMap
    import com.azure.android.maps.control.AzureMaps
    import com.azure.android.maps.control.MapControl
    import com.azure.android.maps.control.events.OnReady
    
    class MainActivity : AppCompatActivity() {
    
        companion object {
            init {
                AzureMaps.setSubscriptionKey("<Your-Azure-Maps-Primary-Subscription-Key>");
    
                //Alternatively use Azure Active Directory authenticate.
                //AzureMaps.setAadProperties("<Your-AAD-clientId>", "<Your-AAD-appId>", "<Your-AAD-tenant>");
            }
        }
    
        var mapControl: MapControl? = null
    
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)
    
            mapControl = findViewById(R.id.mapcontrol)
    
            mapControl?.onCreate(savedInstanceState)
    
            //Wait until the map resources are ready.
            mapControl?.onReady(OnReady { map: AzureMap -> })
        }
    
        public override fun onStart() {
            super.onStart()
            mapControl?.onStart()
        }
    
        public override fun onResume() {
            super.onResume()
            mapControl?.onResume()
        }
    
        public override fun onPause() {
            mapControl?.onPause()
            super.onPause()
        }
    
        public override fun onStop() {
            mapControl?.onStop()
            super.onStop()
        }
    
        override fun onLowMemory() {
            mapControl?.onLowMemory()
            super.onLowMemory()
        }
    
        override fun onDestroy() {
            mapControl?.onDestroy()
            super.onDestroy()
        }
    
        override fun onSaveInstanceState(outState: Bundle) {
            super.onSaveInstanceState(outState)
            mapControl?.onSaveInstanceState(outState)
        }
    }
    ```

    <!-------------------------------------------------------------------------------------------------------
    If you need a map with no borders, such as is shown in the screenshot of the map used in this article,
    replace 'mapControl?.onReady(OnReady { map: AzureMap ->})' in the above code sample with the following:
     mapControl?.onReady(OnReady { map: AzureMap ->
        var layers = map.layers.layerIds.toString();
        var transitLayer = map.layers.getById("transit");
        map.layers.remove(transitLayer);
     })
    ----------------------------------------------------------------------------------------------------------->

::: zone-end

8. Select the run button from the toolbar, as shown in the following image (or press `Control` + `R` on a Mac), to build your application.

    :::image type="content" source="media/quick-android-map/run-app.png" alt-text="A screenshot showing the run button in Android Studio.":::

Android Studio takes a few seconds to build the application. After the build is complete, you can test your application in the emulated Android device. You should see a map like this one:

:::image type="content" source="media/quick-android-map/quickstart-android-map.png" alt-text="A screenshot showing Azure Maps in an Android application.":::

> [!TIP]
> By default, Android reloads the activity when the orientation changes or the keyboard is hidden. This results in the map state being reset (reload the map which resets the view and reloads data to initial state). To prevent this from happening, add the following to the mainfest: `android:configChanges="orientation|keyboardHidden"`. This will stop the activity from reloading and instead call `onConfigurationChanged()` when the orientation has changed or the keyboard is hidden.

## Clean up resources

>[!WARNING]
> The tutorials listed in the [Next Steps](#next-steps) section detail how to use and configure Azure Maps with your account. Don't clean up the resources created in this quickstart if you plan to continue to the tutorials.

If you don't plan to continue to the tutorials, take these steps to clean up the resources:

1. Close Android Studio and delete the application you created.
2. If you tested the application on an external device, uninstall the application from that device.

If you don't plan on continuing to develop with the Azure Maps Android SDK:

1. Navigate to the Azure portal page. Select **All resources** from the main portal page.
2. Select your Azure Maps account. At the top of the page, select **Delete**.
3. Optionally, if you don't plan to continue developing Android apps, uninstall Android Studio.

For more code examples, see these guides:

* [Manage authentication in Azure Maps](how-to-manage-authentication.md)
* [Change map styles in Android maps](set-android-map-styles.md)
* [Add a symbol layer](how-to-add-symbol-to-android-map.md)
* [Add a line layer](android-map-add-line-layer.md)
* [Add a polygon layer](how-to-add-shapes-to-android-map.md)

## Next steps

In this quickstart, you created your Azure Maps account and created a demo application. Take a look at the following tutorial to learn more about Azure Maps:

> [!div class="nextstepaction"]
> [Load GeoJSON data into Azure Maps](tutorial-load-geojson-file-android.md)
