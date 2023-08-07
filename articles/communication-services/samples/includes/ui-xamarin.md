---
title: include file
description: include file
services: azure-communication-services
author: garchiro7
manager: anujbh
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/15/2022
ms.topic: include
ms.custom: include file
ms.author: jorgegarc
---

## Azure Communication UI Mobile Library for Xamarin

This project demonstrates the integration of Azure Communication UI library into Xamarin Forms application. It utilizes Azure Communication Services and the native Azure Communication Services UI library to build a calling experience that features both voice and video calling.

### Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-xamarin).

### Features

Refer to the native [UI Library overview](../../concepts/ui-library/ui-library-overview.md)

### Prerequisites

- Visual Studio [Setup Instructions](/xamarin/get-started/installation/?pivots=macos)
- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- iOS [Requirements](https://github.com/Azure/communication-ui-library-ios#requirements)
- Android [Requirements](https://github.com/Azure/communication-ui-library-android#prerequisites)
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running the [Authentication Endpoint](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.

### Run sample app

Clone repo and open `CommunicationCallingXamarinSampleApp.sln` in Visual Studio

#### For Android
1. Navigate to `/XamarinAndroidBindings/` and in this directory in terminal run `sh downloadJarScript` [Learn More](https://github.com/Azure-Samples/communication-services-ui-library-xamarin/blob/main/XamarinAndroidBindings/README.md)
2. Set `CommunicationCallingXamarinSampleApp.Android` as start up project, build solution and select a device or emulator to run application.

#### For iOS

It's recommended that you build the binding libraries on macOS first.
First navigate to `XamariniOSindins/CommunicationUIProxy.Binding` and build the `CommunicationUIProxy.Binding.sln`.
This will generate `CommunicationUIProxy.Binding\bin` folder where it will have `NativeLibrary.dll` for you to use.
Open `CommunicationCallingXamarinSampleApp.sln`. Under the `CommunicationCallingXamarinSampleApp.iOS/References` right click and `Add Reference`. In the `.Net Assembly` tab, we can browse to where the `.dll` of our binding library and add it as a reference.
Now you can include the library into your project by adding `using Xam.CommunicationUIProxy.iOS;` at the top of your `.cs` files.
Set `CommunicationCallingXamarinSampleApp.iOS` as startup project, build, and select a device or emulator to run application.

### Highlights and feedback

Visit [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-xamarin#key-sample-highlights) to learn more and discover more capabilities and share your valuable feedback.