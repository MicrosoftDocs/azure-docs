
<properties 
   pageTitle="Azure SDK for .NET 2.8 Release Notes" 
   description="Azure SDK for .NET 2.8 Release Notes" 
   services="app-service\web" 
   documentationCenter=".net" 
   authors="Juliako" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="11/18/2015"
   ms.author="juliako"/>

# Azure SDK for .NET 2.8

##Overview
 
This article contains the release notes (that includes known issues and breaking changes) for the Azure SDK for .NET 2.8 release. 

For complete list of new features and updates made in this release, see the [Azure SDK 2.8 for Visual Studio 2013 and Visual Studio 2015](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/) announcement. 

## Download Azure SDK for .NET 2.8

[Azure SDK for .NET 2.8 for Visual Studio 2015](http://go.microsoft.com/fwlink/?LinkId=699285) 

[Azure SDK for .NET 2.8 for Visual Studio 2013](http://go.microsoft.com/fwlink/?LinkId=699287)
 
## .NET 4.5.2 support 

###Known issues

Starting with Azure .NET SDK 2.8, customers can start creating .NET 4.5.2 Cloud Service packages. For compatibility testing, .NET 4.5.2 framework will be available in Guest OS images with November 201511-02 Guest OS Release. .NET 4.5.2 will not be installed in the default Guest OS images until January 2016 Guest OS release. Customers can choose to use the November 201511-02 Release image by specifying the OS Release string value in the .Cscfg. To find the correct configuration string, refer to [Azure Guest OS Releases and SDK Compatibility Matrix](https://azure.microsoft.com/documentation/articles/cloud-services-guestos-update-matrix/).

##Azure Data Factory

###Known issues 

During a **Data Factory Template** project creation involving sample data, azure power shell script may fail if azure power shell version installed on the machine is after 0.9.8.

In order to successfully create this type of project, you must install [azure power shell version  0.9.8](https://github.com/Azure/azure-powershell/releases/download/v0.9.8-September2015/azure-powershell.0.9.8.msi).


## Azure Resource Manager Tools 

###Breaking changes

The PowerShell script provided by the Azure Resource Group project has been updated in this release to work with the new Azure PowerShell cmdlets version 1.0.  This new script will not work from with Visual Studio when using a version of the SDK prior to 2.8.  

Scripts from projects created in earlier versions of the SDK will not run from within Visual Studio when using the 2.8 SDK.  All scripts will continue to work outside of Visual Studio with the appropriate version of the Azure PowerShell cmdlets.  

The 2.8 SDK requires version 1.0 of the Azure PowerShell cmdlets.  All other versions of the SDK require version 0.9.8 of the Azure PowerShell cmdlets.  For more information see [this](http://go.microsoft.com/fwlink/?LinkID=623011) blog.


##Web Tools Extensions

###Known issues

The following known issues will be addressed in the following release.

- App Service related Cloud and Server Explorer gestures for non-production Azure environments (like Azure China or Azure Stack customers) do not work in the current release. 

- Customers may see errors during App Service creation when the App Insights instance to which they are deploying is in a region other than East US. 

##Also see

[Azure SDK 2.8 announcement post](https://azure.microsoft.com/blog/announcing-the-azure-sdk-2-8-for-net/)

[Support and Retirement Information for the Azure SDK for .NET and APIs](https://msdn.microsoft.com/library/azure/dn479282.aspx)

