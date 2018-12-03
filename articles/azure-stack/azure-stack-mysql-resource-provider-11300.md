---
title: Azure Stack MySQL resource provider 1.1.30.0 release notes | Microsoft Docs
description: Learn about what's in the latest Azure Stack MySQL resource provider update, including any known issues, and where to download it.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:  
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/14/2018
ms.author: jeffgilb
ms.reviewer: quying

---
# MySQL resource provider 1.1.30.0  release notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and known issues in MySQL resource provider version 1.1.30.0.

## Build reference
Download the MySQL resource provider binary and then run the self-extractor to extract the contents to a temporary directory. The resource provider has a minimum corresponding Azure Stack build. The minimum Azure Stack release version required to install this version of the MySQL resource provider is listed below:

> |Minimum Azure Stack version|MySQL resource provider version|
> |-----|-----|
> |Azure Stack 1808 update (1.1808.0.97)|[1.1.30.0](https://aka.ms/azurestackmysqlrp11300)|
> |     |     |

> [!IMPORTANT]
> Apply the minimum supported Azure Stack update to your Azure Stack integrated system or deploy the latest Azure Stack Development Kit (ASDK) before deploying the latest version of the MySQL resource provider.

## New features and fixes
This version of the Azure Stack MySQL resource provider includes the following improvements and fixes:

- **Telemetry enabled for MySQL resource provider deployments**. Telemetry collection has been enabled for MySQL resource provider deployments. Telemetry collected includes resource provider deployment, start and stop times, exit status, exit messages, and error details (if applicable).

- **TLS 1.2 encryption update**. Enabled TLS 1.2-only support for resource provider communication with internal Azure Stack components. 

### Fixes

- **MySQL resource provider Azure Stack PowerShell compatability**. The MySQL resource provider has been updated to work with the Azure Stack 2018-03-01-hybrid PowerShell profile and to provide compatibility with AzureRM 1.3.0 and later.

- **MySQL login change password blade**. Fixed an issue where the password can’t be changed on the change password blade. Removed links from password change notifications.

## Known issues 

- **MySQL SKUs can take up to an hour to be visible in the portal**. It can take up to an hour for newly created SKUs to be visible for use when creating new MySQL databases. 

    **Workaround**: None.

- **Reused MySQL logins**. Attempting to create a new MySQL login with the same username as an existing login under the same subscription will result in reusing the same login and the existing password. 

    **Workaround**: Use different usernames when creating new logins under the same subscription or create logins with the same username under different subscriptions.


### Known issues for Cloud Admins operating Azure Stack
Refer to the documentation in the [Azure Stack Release Notes](azure-stack-servicing-policy.md).

## Next steps
[Learn more about the MySQL resource provider](azure-stack-mysql-resource-provider.md).

[Prepare to deploy the MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md#prerequisites).

[Upgrade the MySQL resource provider from a previous version](azure-stack-mysql-resource-provider-update.md). 