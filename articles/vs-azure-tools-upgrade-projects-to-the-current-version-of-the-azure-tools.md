<properties
   pageTitle="How to upgrade projects to the current version of the Azure tools | Microsoft Azure"
   description="Learn how to upgrade an Azure project in Visual Studio to the current version of the Azure tools"
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="04/18/2016"
   ms.author="tarcher" />

# How to upgrade projects to the current version of the Azure Tools for Visual Studio

## Overview

After you install the current release of the Azure Tools (or a previous release that's newer than 1.6), any projects that were created by using a Azure Tools release before 1.6 (November 2011) will be automatically upgraded as soon as you open them. If you created projects by using the 1.6 (November 2011) release of those tools and you still have that release installed, you can open those projects in the older release and decide later whether to upgrade them.

## How your project changes when you upgrade it

If a project is automatically upgraded or you specify that you want to upgrade it, your project is modified to work with current versions of certain assemblies, and some properties are also changed as this section describes. If your project requires other changes to be compatible with the newer version of the tools, you must make those changes manually.

- The web.config file for web roles and the app.config file for worker roles are updated to reference the newer version of Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitoirTraceListener.dll.

- The Microsoft.WindowsAzure.StorageClient.dll, Microsoft.WindowsAzure.Diagnostics.dll, and Microsoft.WindowsAzure.ServiceRuntime.dll assemblies are upgraded to the new versions.

- Publish profiles that were stored in the Azure project file (.ccproj) are moved to a separate file, with the extension .azurePubXml, in the **Publish** subdirectory.

- Some properties in the publish profile are updated to support new and changed features. **AllowUpgrade** is replaced by **DeploymentReplacementMethod** because you can update a deployed cloud service simultaneously or incrementally.

- The property **UseIISExpressByDefault** is added and set to false so that the web server that’s used for debugging won’t automatically change from Internet Information Services (IIS) to IIS Express. IIS Express is the default web server for projects that are created with the newer releases of the tools.

- If Azure Caching is hosted in one or more of your project’s roles, some properties in the service configuration (.cscfg file) and service definition (.csdef file) are changed when a project is upgraded. If the project uses the Azure Caching NuGet package, the project is upgraded to the most recent version of the package. You should open the web.config file and verify that the client configuration was maintained properly during the upgrade process. If you added the references to Azure Caching client assemblies without using the NuGet package, these assemblies won't be updated; you must manually update these references to the new versions.

>[AZURE.IMPORTANT] For F# projects, you must manually update references to Azure assemblies so that they reference the newer versions of those assemblies.

### How to upgrade an Azure project to the current release

1. Install the current version of the Azure Tools into the installation of Visual Studio that you want to use for the upgraded project, and then open the project that you want to upgrade. If the project was created with a Azure Tools release before 1.6 (November 2011), the project is automatically upgraded to the current version. If the project was created with the November 2011 release and that release is still installed, the project opens in that release.

1. In Solution Explorer, open the shortcut menu for the project node, choose **Properties**, and then choose the **Application** tab of the dialog box that appears.

    The **Application** tab shows the tools version that’s associated with the project. If the current version of Azure Tools appears, the project has already been upgraded. If you've installed a newer version of the tools than what the tab shows, an **Upgrade** button appears.

1. Choose the **Upgrade** button to upgrade a project to the current version of the tools.

1. Build the project, and then address any errors that result from API changes. For information about how to modify your code for the new version, see the documentation for the specific API.
