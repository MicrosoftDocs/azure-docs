---
author: jowang
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/30/2023
ms.author: jowang
---
## Setting up

### Creating the Visual Studio project

For UWP app, in Visual Studio 2022, create a new `Blank App (Universal Windows)` project. After entering the project name, feel free to pick any Windows SDK greater than `10.0.17763.0`. 

For WinUI 3 app, create a new project with the `Blank App, Packaged (WinUI 3 in Desktop)` template to set up a single-page WinUI 3 app. [Windows App SDK version 1.3](/windows/apps/windows-app-sdk/stable-channel#version-13) and above is required.
### Install the package and dependencies with NuGet Package Manager

The Calling SDK APIs and libraries are publicly available via a NuGet package.
The following steps exemplify how to find, download, and install the Calling SDK NuGet package.

1. Open NuGet Package Manager (`Tools` -> `NuGet Package Manager` -> `Manage NuGet Packages for Solution`)
2. Click on `Browse` and then type `Azure.Communication.Calling.WindowsClient` in the search box.
3. Make sure that `Include prerelease` check box is selected.
4. Click on the `Azure.Communication.Calling.WindowsClient` package, select `Azure.Communication.Calling.WindowsClient` [1.2.0-beta.1](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient/1.2.0-beta.1) or newer version.
5. Select the checkbox corresponding to the CS project on the right-side tab.
6. Click on the `Install` button.
