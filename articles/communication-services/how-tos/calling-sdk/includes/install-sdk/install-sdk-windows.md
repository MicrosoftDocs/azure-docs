---
author: jowang
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/30/2023
ms.author: jowang
---
## Set up your system

### Create the Visual Studio project

For a UWP app, in Visual Studio 2022, create a new **Blank App (Universal Windows)** project. After you enter the project name, feel free to choose any Windows SDK later than 10.0.17763.0.

For a WinUI 3 app, create a new project with the **Blank App, Packaged (WinUI 3 in Desktop)** template to set up a single-page WinUI 3 app. [Windows App SDK version 1.3](/windows/apps/windows-app-sdk/stable-channel#version-13) or later is required.

### Install the package and dependencies by using NuGet Package Manager

The Calling SDK APIs and libraries are publicly available via a NuGet package.

The following steps exemplify how to find, download, and install the Calling SDK NuGet package:

1. Open NuGet Package Manager by selecting **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution**.
2. Select **Browse**, and then enter `Azure.Communication.Calling.WindowsClient` in the search box.
3. Make sure that the **Include prerelease** check box is selected.
4. Select the `Azure.Communication.Calling.WindowsClient` package, and then select `Azure.Communication.Calling.WindowsClient` [1.4.0-beta.1](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.4.0-beta.1) or a newer version.
5. Select the checkbox that corresponds to the Communication Services project on the right-side tab.
6. Select the **Install** button.
