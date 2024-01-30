---
title: Create an iOS app
description: Steps to create an Azure Maps account and the first iOS App.
author: sinnypan
ms.author: sipa
ms.date: 11/23/2021
ms.topic: quickstart
ms.service: azure-maps
services: azure-maps
ms.custom: mode-other
---

# Create an iOS app (Preview)

This article shows you how to add the Azure Maps to an iOS app. It walks you through these basic steps:

* Set up your development environment.
* Create your own Azure Maps account.
* Get your primary Azure Maps key to use in the app.
* Reference the Azure Maps libraries from the project.
* Add an Azure Maps control to the app.

## Prerequisites

If you don't have an Azure subscription, create a [free account] before you begin.

* An [Azure Maps account]
* A [subscription key]
* [‎Xcode]

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Create an Azure Maps account

Create a new Azure Maps account with the following steps:

1. In the upper left-hand corner of the [Azure portal], select **Create a resource**.

2. In the _Search the Marketplace_ box, type **Azure Maps**.

3. From the _Results_, select **Azure Maps**, then select the **Create** button that appears below the map.

4. On the **Create Maps Account** page, enter the following values:

   * The _Subscription_ that you want to use for this account.
   * The _Resource group_ name for this account. You may choose to _Create new_ or _Use existing_ resource group.
   * The _Name_ of your new account.
   * The _Pricing tier_ for this account.
   * Read the _License_ and _Privacy Statement_, and check the checkbox to accept the terms.
   * Select the **Create** button.

    ![Create an Azure maps account.](./media/shared/create-account.png)

## Get the subscription key for your account

Once your Maps account is successfully created, retrieve the primary key that enables you to query the Maps APIs.

1. Open your Maps account in the portal.

2. In the settings section, select **Authentication**.

3. Copy the **Primary Key** to your clipboard. Save it locally to use later in this tutorial.

>[!NOTE]
> This quickstart uses [Shared Key authentication] for demonstration purposes, but the preferred approach for any production environment is to use [Microsoft Entra authentication].
<!--
> If you use the Azure subscription key instead of the Azure Maps primary key, your map won't render properly. Also, for security purposes, it is recommended that you rotate between your primary and secondary keys. To rotate keys, update your app to use the secondary key, deploy, then press the cycle/refresh button beside the primary key to generate a new primary key. The old primary key will be disabled. For more information on key rotation, see [Set up Azure Key Vault with key rotation and auditing](../key-vault/secrets/tutorial-rotation-dual.md)
-->
:::image type="content" border="false" source="./media/shared/get-key.png" alt-text="Screenshot showing your Azure Maps subscription key in the Azure portal." lightbox="./media/shared/get-key.png":::

## Create a project in Xcode

First, create a new iOS App project. Complete these steps to create an Xcode project:

1. Under **File**, select **New** -> **Project**.

2. On the **iOS** tab, select **App**, and then **Next**.

3. Enter app name, bundle ID then select **Next**.

See the [Creating an Xcode Project for an App] for more help with creating a new project.

![Create the first iOS application.](./media/ios-sdk/quick-ios-app/create-app.png)

## Install the Azure Maps iOS SDK

The next step in building your application is to install the Azure Maps iOS SDK. Complete these steps to install the SDK:

1. With the desired Xcode iOS project selected in the **Project navigator**, select the **+** button to **Add package dependency**.

   ![Add package dependency.](./media/ios-sdk/quick-ios-app/xcode-add-package-dependency.png)

2. Enter the following values in the resulting dialog:
   * Enter `https://github.com/Azure/azure-maps-ios-sdk-distribution.git` in the search bar that appears in the top right corner.
   * Select `Up to Next Major Version` in the **Dependency Rule** field.
   * Enter `1.0.0-pre.3` into the **Dependency Rule** version field.

   ![Add dependency rule to an iOS project.](./media/ios-sdk/quick-ios-app/xcode-dependency-rule.png)

3. Once the package alongside its dependencies is resolved, select the **Add Package** button to complete the dependency setup.

   ![Add package to an iOS project.](./media/ios-sdk/quick-ios-app/xcode-add-package.png)

## Add MapControl view

1. Add custom `UIView` to view controller

1. Select `MapControl` class from `AzureMapsControl` module

   ![Add an Azure maps control.](./media/ios-sdk/quick-ios-app/add-map-control.png)

1. In the **AppDelegate.swift** file:

   * add import for the Azure Maps SDK
   * set your Azure Maps authentication information

By setting the authentication information on the AzureMaps class globally using the `AzureMaps.configure(subscriptionKey:)` or `AzureMaps.configure(aadClient:aadAppId:aadTenant:)`, you don't need to add your authentication information on every view.

1. Select the run button, as shown in the following graphic (or press `CMD` + `R`), to build your application.

   ![Run the iOS application.](./media/ios-sdk/quick-ios-app/run.png)

Xcode takes a few seconds to build the application. After the build is complete, you can test your application in the simulated iOS device. You should see a map like this one:

![Your first map on an iOS application.](./media/ios-sdk/quick-ios-app/example.png)

## Access map functionality

You can start customizing map functionality by getting hold to `AzureMap` instance in a `mapView.onReady` handler. Once the `MapControl` view is added, your sample `ViewController` should look similar to the following code:

```swift
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        let mapView = self.view.subviews.first as? MapControl;
        mapView?.onReady({ map in
            // customize your map here
            // map.sources.add()
            // map.layers.insertLayer()
        })
    }
}
```

Proceed to [Add a polygon layer to the map in the iOS SDK] for one such example.

## Clean up resources

Take these steps to clean up the resources created in this quickstart:

1. Close Xcode and delete the project you created.

2. If you tested the application on an external device, uninstall the application from that device.

If you don't plan on continuing to develop with the Azure Maps iOS SDK:

1. Navigate to the Azure portal page. Select **All resources** from the main portal page. Or, select the menu icon in the upper left-hand corner, then **All resources**.

2. Select your Azure Maps account. At the top of the page, select **Delete**.

3. Optionally, if you don't plan to continue developing iOS apps, uninstall Xcode.

## Additional information

See the following articles for more code examples:

* [Manage authentication in Azure Maps]
* [Change map styles in iOS maps]
* [Add a symbol layer]
* [Add a line layer]
* [Add a polygon layer]

<!--## Next steps

In this quickstart, you created your Azure Maps account and created a demo application. Take a look at the following tutorials to learn more about Azure Maps:

> [!div class="nextstepaction"]

> [Load GeoJSON data into Azure Maps](tutorial-load-geojson-file-ios.md)-->

[Add a line layer]: add-line-layer-map-ios.md
[Add a polygon layer to the map in the iOS SDK]: add-polygon-layer-map-ios.md
[Add a polygon layer]: add-polygon-layer-map-ios.md
[Add a symbol layer]: add-symbol-layer-ios.md
[Azure Active Directory authentication]: azure-maps-authentication.md#azure-ad-authentication
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure portal]: https://portal.azure.com
[Change map styles in iOS maps]: set-map-style-ios-sdk.md
[Creating an Xcode Project for an App]: https://developer.apple.com/documentation/xcode/creating-an-xcode-project-for-an-app
[free account]: https://azure.microsoft.com/free/
[manage authentication in Azure Maps]: how-to-manage-authentication.md
[Shared Key authentication]: azure-maps-authentication.md#shared-key-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[‎Xcode]: https://apps.apple.com/cz/app/xcode/id497799835?mt=12
