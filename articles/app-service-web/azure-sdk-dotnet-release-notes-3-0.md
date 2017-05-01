---
title: Azure SDK for .NET 3.0 Release Notes | Microsoft Docs 
description: Azure SDK for .NET 3.0 Release Notes
services: app-service\web
documentationcenter: .net
author: chrissfanos
editor: ''

ms.assetid: c83d815b-fc19-4260-821e-7d2a7206dffc
ms.service: app-service
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 03/07/2017
ms.author: juliako;mikhegn

---
# Azure SDK for .NET 3.0 release notes

This topic includes release notes for version 3.0 of the Azure SDK for .NET.

##Azure SDK for .NET 3.0 release summary

Release date: 03/07/2017
 
No breaking changes to the Azure SDK 3.0 have been introduced in this release. There is also no upgrade process needed to leverage this SDK with existing Cloud Service projects. To allow use of the Azure SDK 3.0 without requiring an upgrade process, Azure SDK 3.0 installs to the same directories as Azure SDK 2.9. Most the components did not change the major version from 2.9 but instead just updated the build number.

## Visual Studio 2017 RTW

- In Visual Studio 2017, this release of the Azure SDK for .NET is built in to the Azure Workload. All the tools you need to do Azure development will be part of Visual Studio 2017 going forward. For Visual Studio 2015 the SDK will still be available through WebPI. We have discontinued Azure SDK for .NET releases for Visual Studio 2013 now that Visual Studio 2017 has been released.

### Azure Diagnostics

- Changed the behavior to only store a partial connection string with the key replaced by a token for Cloud Services diagnostics storage connection string. The actual storage key is now stored in the user profile folder so its access can be controlled. Visual Studio will read the storage key from user profile folder for local debugging and publishing process. 
- In response to the change described above, Visual Studio Online team enhanced the Azure Cloud Services deployment task template so users could specify the storage key for setting diagnostics extension when publishing to Azure in Continuous Integration and Deployment.
- We’ve made it possible to store secure connection string and tokenization for Azure Diagnostics (WAD), to help you solve problems with configuration across environements.
 
### Windows Server 2016 virtual machines

- Visual Studio now supports deploying Cloud Services to OS Family 5 (Windows Server 2016) virtual machines. For existing cloud services, you can change your settings to target the new OS Family. When creating new cloud services, if you choose to create the service using .net 4.6 or higher, it will default the service to use OS Family 5.  For more information, you can review the [Guest OS Family support table](../cloud-services/cloud-services-guestos-update-matrix.md).

### Known issues

- Azure .NET SDK 3.0 introduced an issue when removing Visual Studio 2017 in a side by side configuration with Visual Studio 2015.  If you have the Azure SDK installed for Visual Studio 2015, the Microsoft Azure Storage Emulator and Microsoft Azure Compute Emulator will be removed if you uninstall Visual Studio 2017.  This will produce an error when creating and debugging new Cloud services projects in Visual Studio 2015. In order to fix this issue,  reinstall the Azure SDK from the Web Platform Installer.  The issue will be resolved in a future Visual Studio 2017 update.  .

 
### Azure In-Role Cache 

- Support for Azure In-Role Cache ended on November 30, 2016. For more details, click [here](https://azure.microsoft.com/blog/azure-managed-cache-and-in-role-cache-services-to-be-retired-on-11-30-2016/).




