---
title: "Tutorial: Create a .NET MAUI shell app, add MSAL, and include an image resource"
description: This tutorial demonstrates how to create a .NET MAUI shell app, add MSALClient, and include an image resource.
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.topic: tutorial
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.date: 06/05/2023
---

# Tutorial: Create a .NET MAUI shell app

This tutorial demonstrates how to create a .NET Multi-platform App UI (.NET MAUI) shell app. You'll also add a custom Microsoft Authentication Library (MSAL) client helper to initialize the MSAL SDK, install required libraries and include an image resource.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a .NET MAUI shell app.
> - Add MSAL SDK support using MSAL helper classes.
> - Install required packages.
> - Add image resource.

## Prerequisites

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Visual Studio 2022](https://aka.ms/vsdownloads) with the MAUI workload installed:
  - [Instructions for Windows](/dotnet/maui/get-started/installation?tabs=vswin)
  - [Instructions for macOS](/dotnet/maui/get-started/installation?tabs=vsmac)

## Create .NET MAUI shell app

1. In the start window of Visual Studio 2022, select **Create a new project**.
1. In the **Create a new project** window, select **MAUI** in the All project types drop-down, select the **.NET MAUI App** template, and select **Next**.
1. In the **Configure your new project** window, **Project name** must be set to _SignInMaui_. Update the **Solution name**  to _sign-in-maui_ and select **Next**.
1. In the **Additional information** window, choose **.NET 7.0** and select **Create**.

Wait for the project to be created and its dependencies to be restored.

## Add MSAL SDK support using MSAL helper classes

MSAL client enables developers to acquire security tokens from Microsoft Entra ID for customers tenant to authenticate and access secured web APIs. In this section, you download files that makes up MSALClient.

Download the following files into a folder in your computer:

- [AzureAdConfig.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/AzureAdConfig.cs) - This file gets and sets the Microsoft Entra app unique identifiers from your app configuration file.
- [DownStreamApiConfig.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/DownStreamApiConfig.cs) - This file gets and sets the scopes for Microsoft Graph call.
- [DownstreamApiHelper.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/DownstreamApiHelper.cs) - This file handles the exceptions that occur when calling the downstream API.
- [Exception.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/Exception.cs) - This file offers a few extension method related to exception throwing and handling.
- [IdentityLogger.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/IdentityLogger.cs) - This file handles shows how to use MSAL.NET logging.
- [MSALClientHelper.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/MSALClientHelper.cs) - This file contains methods to initialize MSAL SDK.
- [PlatformConfig.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/PlatformConfig.cs) - This file contains methods to handle specific platform. For example, Windows.
- [PublicClientSingleton.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/PublicClientSingleton.cs) - This file contains a singleton implementation to wrap the MSALClient and associated classes to support static initialization model for platforms.
- [WindowsHelper.cs](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/MSALClient/WindowsHelper.cs) - This file contains methods to retrieve window handle.

> [!IMPORTANT]
> Don't skip downloading the MSALClient files, they're required to complete this tutorial.

### Move the MSALClient files with Visual Studio

1. In the **Solution Explorer** pane, right-click on the **SignInMaui** project and select **Add** > **New Folder**. Name the folder _MSALClient_.
1. Right-click on **MSALClient** folder, select **Add** > **Existing Item...**.
1. Navigate to the folder that contains the downloaded MSALClient files that you downloaded earlier.
1. Select all of the MSALClient files you downloaded, then select **Add**

## Install required packages

You need to install the following packages:

- _Microsoft.Identity.Client_ - This package contains the binaries of the Microsoft Authentication Library for .NET (MSAL.NET).
- _Microsoft.Extensions.Configuration.Json_ - This package contains JSON configuration provider implementation for Microsoft.Extensions.Configuration.
- _Microsoft.Extensions.Configuration.Binder_ - This package contains functionality to bind an object to data in configuration providers for Microsoft.Extensions.Configuration.
- _Microsoft.Extensions.Configuration.Abstractions_ - This package contains abstractions of key-value pair based configuration.
- _Microsoft.Identity.Client.Extensions.MSAL_ - This package contains extensions to Microsoft Authentication Library for .NET (MSAL.NET).

### NuGet Package Manager

To use the **NuGet Package Manager** to install the _Microsoft.Identity.Client_ package in Visual Studio, follow these steps:

1. Select **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution...**.
1. From the **Browse** tab, search for _Microsoft.Identity.Client_.
1. Select **Microsoft.Identity.Client** in the list.
1. Select **SignInMaui** in the **Project** list pane.
1. Select **Install**.
1. If you're prompted to verify the installation, select **OK**.

Repeat the process to install the remaining required packages.

## Add image resource

In this section, you download an image that you use in your app to enhance how users interact with it.

Download the following image:

- [Icon: Microsoft Entra ID](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/blob/main/1-Authentication/2-sign-in-maui/Resources/Images/azure_active_directory.png) - This image is used as icon in the main page.

### Move the image with Visual Studio

1. In the **Solution Explorer** pane of Visual Studio, expand the **Resources** folder, which reveals the **Images** folder.
1. Right-click on **Images** and select **Add** > **Existing Item...**.
1. Navigate to the folder that contains the downloaded images.
1. Change the filter to file type filter to **Image Files**.
1. Select the image you downloaded.
1. Select **Add**.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Sign in users in .NET MAUI shell app](tutorial-mobile-app-maui-sign-in-sign-out.md)
