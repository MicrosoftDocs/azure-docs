---
title: 'AADCloudSyncTools PowerShell Module for Azure AD Connect Cloud Sync'
description: This article describes how to install the Azure AD Connect cloud provisioning agent.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/16/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# AADCloudSyncTools PowerShell Module for Azure AD Connect Cloud Sync

With the release of public preview refresh 2, Microsoft has introduced the AADCloudSyncTools PowerShell Module.  This module provides a set of useful tools that you can use to help manage your Azure AD Connect Cloud Sync deployments.

## Pre-requisites
The following pre-requisites are required:
- This module uses MSAL authentication, so it requires MSAL.PS module installed. It no longer depends on Azure AD or Azure AD Preview.   To verify this, in an Admin PowerShell window execute `Get-module MSAL.PS`. If the module is installed correctly you will get a response.  You can use `Install-AADCloudSyncToolsPrerequisites` to install the latest version of MSAL.PS
- The AzureAD PowerShell module.  Some of the cmdlets rely on pieces of the AzureAD PowerShell module to accomplish their tasks.  To verify this is installed you can in an Admin PowerShell window execute `Get-module AzureAD`. If the module is installed correctly you will get a response.  You can use `Install-AADCloudSyncToolsPrerequisites` to install the latest version of the AzureAD PowerShell module.
- Installing modules from PowerShell may enforce using TLS 1.2.  To ensure you can install modules, set the following: \
`[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 `

## Install the AADCloudSyncTools PowerShell module
To install and use the AADCloudSyncTools module use the following steps:

1.  Open Windows PowerShell with administrative priviledges
2.  Type `[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12` and hit enter.
3.  Type or copy and paste the following: 
	``` powershell
	Import-module -Name "C:\Program Files\Microsoft Azure Active Directory Connect Provisioning Agent\Utility\AADCloudSyncTools"
	```
3.  Hit enter.
4.  To verify the module was installed, enter or copy and paste the following"
	```powershell
	Get-module AADCloudSyncTools
	```
5.  You should now see information about the module.
6.  Next run
	``` powershell
	Install-AADCloudSyncToolsPrerequisites
	```
7.  This will install the PowerShell Get modules.  Close the PowerShell Window.
8.  Open Windows PowerShell with administrative priviledges
9.  Import the module again using step 3.
10. Run `Install-AADCloudSyncToolsPrerequisites` to install the MSAL and AzureAD modules
11. All pre-reqs should be successfully installed
 ![Install module](media/reference-powershell/install-1.png)



## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)

