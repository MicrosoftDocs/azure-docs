---
title: 'Disable PTA when using Azure AD Connect "Do not configure" | Microsoft Docs'
description: This article describes how to disable PTA if the do not configure feature of Azure AD Connect is being used.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.date: 04/15/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Disable PTA when using Azure AD Connect "Do not configure"

If you are using Pass-through Authentication with Azure AD Connect and you have it set to "Do not configure", you can disable it.Disabling PTA can be done using the following cmdlets. 

## Prerequistes
The following prerequisties are required:
- Any windows machine that has the PTA agent installed. 
- Agent must be at version 1.5.1742.0 or later. 

>[!NOTE]
> If your agent is older then it may not have the cmdlets required to complete this operation. You can get a new agent from Azure Portal an install it on any windows machine and provide admin credentials. (Installing the agent does not affect the PTA status in the cloud)

> [!IMPORTANT]
> If you are using the Azure Government cloud then you will have to pass in the ENVIRONMENTNAME parameter with the following value. 
>
>| Environment Name | Cloud |
>| - | - |
>| AzureUSGovernment | US Gov|


## To disable PTA
From within a PowerShell session, use the following to disable PTA:
1. PS C:\Program Files\Microsoft Azure AD Connect Authentication Agent> `Import-Module .\Modules\PassthroughAuthPSModule`
2. `Get-PassthroughAuthenticationEnablementStatus` or `Get-PassthroughAuthenticationEnablementStatus -EnvironmentName <identifier>`
3. `Disable-PassthroughAuthentication  -Feature PassthroughAuth` or `Disable-PassthroughAuthentication -Feature PassthroughAuth -EnvironmentName <identifier>`

## If you don't have acces to an agent

If you don't have access to an agent machine you can use following command to install an agent but not register it

1. Download the latest Auth Agent from portal.azure.com.
2. Install the feature: `.\AADConnectAuthAgentSetup.exe` or `.\AADConnectAuthAgentSetup.exe ENVIRONMENTNAME=<identifier>`


## Next steps

- [User sign-in with Azure Active Directory Pass-through Authentication](how-to-connect-pta.md)