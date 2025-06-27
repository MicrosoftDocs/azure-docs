---
title: Add Support for Azure CLI in PowerShell 7.2 Runbooks in Runtime Environment
titleSuffix: Azure Automation
description: This article shows how to add support for Azure CLI in PowerShell 7.2 runbooks in Runtime environment.
services: automation
ms.date: 06/27/2025
ms.topic: quickstart
ms.custom: references_regions, devx-track-azurecli
ms.author: v-jasmineme
author: jasminemehndir
---

# Run Azure CLI commands in PowerShell 7.4 runbooks

You can run Azure CLI commands in runbooks linked with PowerShell 7.4 Runtime environment.

> [!NOTE]
> Azure CLI commands version 2.64.0 are available as a default package in PowerShell 7.4 Runtime environment.

## Prerequisites

 - An Azure Automation account (in any supported Public regions except Brazil Southeast and Gov clouds).
 
 
## Create Runtime environment

#### [Azure portal](#tab/create-runtime-env-portal)

To create Runtime environment in Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select your Automation account.
1. In the **Overview** page, select Try Runtime Environment experience, if not already in the new experience.
1. Under **Process Automation**, select **Runtime Environments (preview)** and then select **Create**.
1. On the **Basics** tab, provide the following details:
    1. Enter **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** dropdown list, select  **PowerShell**.
    1. In **Runtime version** for scripting language, select 7.4
    1. Enter appropriate **Description**.
1. On the **Packages** tab, in the **Package version** dropdown list, you would see **Az version 12.3.0** and **Azure CLI version 2.64.0** already present.
1. Select **+Add from gallery** to add more packages from gallery and select **Next**.
1. On the **Review + create** tab, review the entries and select **Create**.
      
   A notification appears to confirm that a Runtime environment is successfully created.


#### [REST API](#tab/create-runtime-env-rest)



```rest
PUT
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runtimeEnvironments/<runtimeEnvironmentName>?api-version=2024-10-23
{ 
  "properties": { 
    "runtime": { 
        "language": "PowerShell",  
        "version": "7.4" 
        }, 
        "defaultPackages": { 
            "Az": "12.3.0",
            "Azure CLI": "2.64.0"
        } 
     }, 
    "name": "<runtimeEnvironmentName>"
}
```
---

## Create Runbook

#### [Azure portal](#tab/create-runbook-portal)

You can create a new PowerShell runbook that supports Azure CLI commands and is associated with PowerShell 7.4 Runtime environment.

To create a runbook, follow these steps:

1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select **Create**.
1. On the **Basics** tab, you can either create a new runbook or upload a file from your local computer or from PowerShell gallery.
   1. Enter a **Name** for the runbook. It must begin with a letter and can contain only letters, numbers, underscores, and dashes.
   1. From the **Runbook type** dropdown, select the type of runbook that you want to create.
   1. Select PowerShell 7.4 Runtime environment created earlier.
   1. Enter appropriate **Description**.


1. Add runbook code on the **Edit Runbook** page and select **Save**.
 
1. **Test** runbook execution in Test pane. After you confirm the results, select **Publish** to publish the runbook and execute it.

#### [REST API](#tab/create-runbook-rest)



```rest

PUT 
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Automation/automationAccounts/<accountName>/runbooks/<runbookName>?api-version=2024-10-23


{ 
  "properties": { 
        "runbookType": "PowerShell", 
        "runtimeEnvironment": <runtimeEnvironmentName>, 
        "publishContentLink": { 
            "uri": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-automation-runbook-getvms/Runbooks/Get-AzureVMTutorial.ps1" 
        } 
    }, 
   "location": "East US"
}
```
---

## Next steps
- See [Manage Runtime environment](manage-runtime-environment.md) to view the various operations through portal and REST API.
