---
title: Troubleshoot known issues with Azure Update Manager while migrating from Automation Update Management
description: This article provides details on known issues and how to troubleshoot any problems when migrating from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 08/13/2024
ms.author: sudhirsneha
---

# Troubleshoot issues during automated migration

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article describes the errors that might occur when you use migration portal experience or scripts, and how to resolve them.

## Required PowerShell modules for executing prerequisite script aren't installed

### Cause

When the required PowerShell modules aren't installed for executing the prerequisite scripts, you may see the following errors:

:::image type="content" source="./media/migration-troubleshoot/error-prerequisite-scripts.png" alt-text="Screenshot that shows the error code when PowerShell modules aren't installed. " lightbox="./media/migration-troubleshoot/error-prerequisite-scripts.png":::

:::image type="content" source="./media/migration-troubleshoot/error-migration-prerequisite-scripts.png" alt-text="Screenshot that shows the error code when the required PowerShell modules aren't installed. " lightbox="./media/migration-troubleshoot/error-migration-prerequisite-scripts.png":::

### Resolution

Ensure you successfully execute the command `Install-Module -Name Az -Repository PSGallery -Force`

## Unable to acquire token for tenant organizations 

### Issue

Encountering a warning as - unable to acquire token `organizations` with error `InteractiveBrowserCredential authentication failed: Method not found: 'Void Microsoft.Identity.Client.Extensions.Msal.MsalCacheHelper.RegisterCache(Microsoft.Identity.Client.ITokenCa)`

### Cause

This is part of one of the documented [issues](https://github.com/Azure/azure-powershell/issues/25005) with Az.Accounts 3.0.0 module. [Learn more](https://learn.microsoft.com/answers/questions/1342970/warning-unable-to-acquire-token-for-tenant-organiz)

### Resolution

Execute command `Update-AzConfig -EnableLoginByWam $false` in an elevated PowerShell Session.

### Issue

:::image type="content" source="./media/migration-troubleshoot/warning-token-organization.png" alt-text="Screenshot that shows the warning message when tokens aren't acquired for tenant organizations. " lightbox="./media/migration-troubleshoot/warning-token-organization.png":::

### Cause

Your organization requires to use `Connect-AzAccount`  with `DeviceCode` parameter to login to Azure.

### Resolution

- Modify this [line](https://github.com/azureautomation/Preqrequisite-for-Migration-from-Azure-Automation-Update-Management-to-Azure-Update-Manager/blob/1750c1758cf9be93153a24b6eb9bfccc174ce66b/MigrationPrerequisites.ps1) in the Prerequisite script where it has the Connect-AzAccount Command to use the - [UseDeviceAuthentication](/powershell/module/az.accounts/connect-azaccount) Parameter.


## Encountering exception message

### Issue

:::image type="content" source="./media/migration-troubleshoot/exception-message.png" alt-text="Screenshot that shows the exception message when the operational insights module isn't installed. " lightbox="./media/migration-troubleshoot/exception-message.png":::

### Cause

[Operational Insights](/powershell/module/az.operationalinsights/) module isn't installed. 

### Resolution

Execute Command `Install-Module-Name Az.OperationalInsights`

## Couldn't convert string to DateTimeOffset: 1719675651. Path 'expires_on', line 1, position 1608.

### Cause

This error can come up while executing the Migration/Deboarding Runbook in Azure. This can happen if you have custom Az Modules in your automation account, which are outdated.

### Resolution

Delete custom Az Modules and ensure that default Az Module is updated to 8.0.0 for PowerShell 5.1

