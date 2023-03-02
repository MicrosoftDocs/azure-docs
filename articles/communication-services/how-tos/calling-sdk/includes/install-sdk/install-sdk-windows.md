---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/08/2021
ms.author: rifox
---
## Setting up

### Creating the Visual Studio project

For UWP app, in Visual Studio 2019, create a new `Blank App (Universal Windows)` project. After entering the project name, feel free to pick any Windows SDK greater than `10.0.17134`. 

For WinUI 3 app, create a new project with the `Blank App, Packaged (WinUI 3 in Desktop)` template to set up a single-page WinUI 3 app. [Windows App SDK version 1.2 preview 2](https://learn.microsoft.com/windows/apps/windows-app-sdk/preview-channel#version-12-preview-2-120-preview2) and above is required.
### Install the package and dependencies with NuGet Package Manager

The Calling SDK APIs and libraries are publicly available via a NuGet package.
The following steps exemplify how to find, download, and install the Calling SDK NuGet package.

1. Open NuGet Package Manager (`Tools` -> `NuGet Package Manager` -> `Manage NuGet Packages for Solution`)
2. Click on `Browse` and then type `Azure.Communication.Calling` in the search box.
3. Make sure that `Include prerelease` check box is selected.
4. Click on the `Azure.Communication.Calling` package, select `Azure.Communication.Calling` [1.0.0-beta.33](https://www.nuget.org/packages/Azure.Communication.Calling/1.0.0-beta.33) or newer version.
5. Select the checkbox corresponding to the CS project on the right-side tab.
6. Click on the `Install` button.