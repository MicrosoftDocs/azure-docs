---
title: Setup Azure Spatial Anchors for Unreal
description: Configure an Unreal project to use Azure Spatial Anchors
author: jacksonf
services: azure-spatial-anchors

ms.author: jacksonf
ms.date: 04/20/2022
ms.topic: how-to
ms.service: azure-spatial-anchors
---

# Configuring Azure Spatial Anchors in an Unreal project

This guide will show you how to get started with the Azure Spatial Anchors SDK in your Unreal project.

## Configure a project - Plugins
# [HoloLens OpenXR](#tab/PluginsHoloLens)
> [!NOTE] 
> The Microsoft OpenXR plugin must be installed from the <a href="https://www.unrealengine.com/marketplace/en-US/product/ef8930ca860148c498b46887da196239" target="_blank">Unreal Marketplace</a>.

Open **Edit > Plugins** and enable the following plugins:
- Microsoft OpenXR
- Azure Spatial Anchors

# [HoloLens WMR](#tab/PluginsHoloLensWMR)
> [!NOTE] 
> OpenXR is the recommended platform to build HoloLens applications in Unreal.

Open **Edit > Plugins** and enable the following plugins:
- Microsoft Windows Mixed Reality
- Azure Spatial Anchors
- Azure Spatial Anchors for WMR

# [Android](#tab/PluginsAndroid)
Open **Edit > Plugins** and enable the following plugins:
- Azure Spatial Anchors
- Azure Spatial Anchors for ARCore
- Android Runtime Permission

# [iOS](#tab/PluginsIOS)
> [!NOTE] 
> To build an Unreal application for iOS, you will need to use Unreal on a Mac and have an Apple developer account.

Open **Edit > Plugins** and enable the following plugins:
- Azure Spatial Anchors
- Azure Spatial Anchors for ARKit
- Mobile Location Services Blueprints library
- Mobile Location Services - IOS Implementation

## Configure a project - Build Settings
# [HoloLens](#tab/BuildSettingsHoloLens)
Follow <a href="https://docs.microsoft.com/en-us/windows/mixed-reality/develop/unreal/tutorials/unreal-uxt-ch6" target="_blank">these steps</a> to package and deploy a HoloLens application.

# [Android](#tab/BuildSettingsHoloLens)
Follow <a href="https://docs.unrealengine.com/4.26/en-US/SharingAndReleasing/Mobile/Android/PackagingAndroidProject/" target="_blank">these steps</a> to package and deploy an Android application.

# [iOS](#tab/BuildSettingsHoloLens)
Follow <a href="https://docs.unrealengine.com/4.27/en-US/SharingAndReleasing/Mobile/iOS/PackagingiOSProject/" target="_blank">these steps</a> to package and deploy an iOS application.

iOS development in Unreal also requires configuring Unreal with your Apple developer account.

First find your Apple Developer Account Team ID by logging into **developer.apple.com**.  Navigate to the **Membership** tab and search for **Team ID**.

In Unreal, open **Project Settings > iOS** and navigate to the **Build** section.

Enable the **Automatic Signing** checkbox.

Then populate the **IOS Team ID** with the Team ID you found on your Apple developer account earlier.

## Capabilities
# [HoloLens](#tab/CapabilitiesHoloLens)
Open **Project Settings > HoloLens** and navigate to the **Capabilities** section.

Enable the following capabilities:
- Internet Client
- Internet Client Server
- Private Network Client Server
- WiFiControl
- Spatial Perception

# [Android](#tab/CapabilitiesAndroid)
Open **Project Settings > Android** and naviage to the **Advanced APK Packaging / Extra Permissions** section.

Add the following Permissions:
- android.permission.ACCESS_WIFI_STATE
- android.permission.CHANGE_WIFI_STATE
- android.permission.INTERNET
- android.permission.BLUETOOTH
- android.permission.BLUETOOTH_ADMIN
- android.permission.ACCESS_COARSE_LOCATION
- android.permission.ACCESS_FINE_LOCATION
- android.permission.CAMERA

*Before* starting an Azure Spatial Anchors session, you must also prompt a permission dialogue to request access for these features.  To do this, you must call **Request Android Permissions** in any blueprint, or **UAndroidPermissionFunctionLibrary::AcquirePermissions** from any game code.  Include the same permissions in the input to this function.


# [iOS](#tab/CapabilitiesIOS)
*Before* starting an Azure Spatial Anchors session, you must prompt a permission dialogue to request access for the iOS location services.  To do this, you must call **Init Location Services** followed by **Start Location Services** from any blueprint, or **ULocationServices::InitLocationServices** followed by **ULocationServices::StartLocationServices** from any game code.

