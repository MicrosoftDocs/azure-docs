---
title: include file
description: include file
services: azure-communication-services
author: iaulakh
manager: james.cheng
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/09/2023
ms.topic: include
ms.custom: include file
ms.author: iaulakh
---

## Azure Communication UI Mobile Library for .NET MAUI

This project demonstrates the integration of Azure Communication UI library into .NET MAUI application. It utilizes Azure Communication Services and the native Azure Communication Services UI library to build a calling experience that features both voice and video calling.

### Download code

Find the project for this sample on [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-maui).

### Features

Refer to the native [UI Library overview](../../concepts/ui-library/ui-library-overview.md)

### Prerequisites

- Visual Studio [Setup Instructions](/dotnet/maui/get-started/installation)
- An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- iOS [Requirements](https://github.com/Azure/communication-ui-library-ios#requirements)
- Android [Requirements](https://github.com/Azure/communication-ui-library-android#prerequisites)
- An Azure Communication Services resource. For details, see [Create an Azure Communication Services resource](../../quickstarts/create-communication-resource.md).
- An Azure Function running the [Authentication Endpoint](../../tutorials/trusted-service-tutorial.md) to fetch access tokens.

### Run sample app

Clone [repo](https://github.com/Azure-Samples/communication-services-ui-library-maui).

#### For Android

##### Visual Studio Mac/Windows 2022

1. Navigate to `/AndroidMauiBindings` and in this directory in terminal run `./downloadJarScript.sh`. `GitBash` or `Windows Subsystem for Linux (WSL)` should be enabled to run `.sh` on Windows.
2. Open `CommunicationCallingSampleMauiApp/CommunicationCallingSampleMauiApp.sln` in Visual Studio
3. Edit `CommunicationCallingSampleMauiApp/CommunicationCallingSampleMauiApp.csproj` and set `<TargetFrameworks>net7.0-android</TargetFrameworks>`.
4. Select android device/emulator in visual studio and run `CommunicationCallingSampleMauiApp` app.

#### For iOS

##### Visual Studio Mac 2022

1. Navigate to `communication-services-ui-library-maui/iOSMauiBindings/ProxyLibs/CommunicationUI-Proxy` and in this directory in terminal run `./iOSFramework.sh -d`.
2. Open `CommunicationCallingSampleMauiApp/CommunicationCallingSampleMauiApp.sln` in Visual Studio
3. Edit `CommunicationCallingSampleMauiApp/CommunicationCallingSampleMauiApp.csproj` and set `<TargetFrameworks>net7.0-ios</TargetFrameworks>`.
4. Select iOS device/simulator in visual studio and run `CommunicationCallingSampleMauiApp` app.

### Highlights and feedback

Visit [GitHub](https://github.com/Azure-Samples/communication-services-ui-library-maui#key-sample-highlights) to learn more and discover more capabilities and share your valuable feedback.

