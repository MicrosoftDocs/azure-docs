---
title: Azure Stack SQL resource provider 1.1.30.0 release notes | Microsoft Docs
description: Learn about what's in the latest Azure Stack SQL resource provider update, including any known issues and where to download it.
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
# SQL resource provider 1.1.30.0 release notes

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

These release notes describe the improvements and known issues in SQL resource provider version 1.1.30.0.

## Build reference
Download the SQL resource provider binary and then run the self-extractor to extract the contents to a temporary directory. The resource provider has a minimum corresponding Azure Stack build. The minimum Azure Stack release version required to install this version of the SQL resource provider is listed below:

> |Minimum Azure Stack version|SQL resource provider version|
> |-----|-----|
> |Version 1808 (1.1808.0.97)|[1.1.30.0](https://aka.ms/azurestacksqlrp11300)|
> |     |     |

> [!IMPORTANT]
> Apply the minimum supported Azure Stack update to your Azure Stack integrated system or deploy the latest Azure Stack Development Kit (ASDK) before deploying the latest version of the SQL resource provider.

## New features and fixes
This version of the Azure Stack SQL resource provider includes the following improvements and fixes:

- **Telemetry enabled for SQL resource provider deployments**. Telemetry collection has been enabled for SQL resource provider deployments. Telemetry collected includes resource provider deployment, start and stop times, exit status, exit messages, and error details (if applicable).

- **TLS 1.2 encryption update**. Enabled TLS 1.2-only support for resource provider communication with internal Azure Stack components. 

### Fixes

- **SQL resource provider Azure Stack PowerShell compatability**. The SQL resource provider has been updated to work with the Azure Stack 2018-03-01-hybrid PowerShell profile and to provide compatibility with AzureRM 1.3.0 and later.

- **SQL login change password blade**. Fixed an issue where the password can’t be changed on the change password blade. Removed links from password change notifications.

- **SQL hosting server settings blade update**. Fixed an issue where the settings blade was incorrectly titled as “Password”.

## Known issues 

- **SQL SKUs can take up to an hour to be visible in the portal**. It can take up to an hour for newly created SKUs to be visible for use when creating new SQL databases. 

    **Workaround**: None.

- **Reused SQL logins**. Attempting to create a new SQL login with the same username as an existing login under the same subscription will result in reusing the same login and the existing password. 

    **Workaround**: Use different usernames when creating new logins under the same subscription or create logins with the same username under different subscriptions.

- **Shared SQL logins cause data inconsistency**. If a SQL login is shared for multiple SQL databases under the same subscription, changing the login password will cause data inconsistency.

    **Workaround**: Always use different logins for different databases under the same subscription.

### Known issues for Cloud Admins operating Azure Stack
Refer to the documentation in the [Azure Stack Release Notes](azure-stack-servicing-policy.md).

## Next steps
[Learn more about the SQL resource provider](azure-stack-sql-resource-provider.md).

[Prepare to deploy the SQL resource provider](azure-stack-sql-resource-provider-deploy.md#prerequisites).

[Upgrade the SQL resource provider from a previous version](azure-stack-sql-resource-provider-update.md). 