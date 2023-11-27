---
title: Update PowerShell runbook in Azure Runtime environment
titleSuffix: Azure Automation
description: This article shows how to update a runbook from PowerShell 5.1 to PowerShell 7.2 in Runtime environment.
services: automation
ms.date: 11/27/2023
ms.topic: conceptual
---

# Update a runbook from PowerShell 5.1 to PowerShell 7.2 in Azure Runtime environment

Using the Runtime environment, you can upgrade a runbook from one version to the other by creating a different runtime environment and then link the runbook.

> [!NOTE]
> A runbook can be mapped to a single runtime environment, while a specific runtime environment can be mapped to multiple runbooks.

## Prerequisites

 1. An Azure Automation account.
 1. A runbook in Azure Automation using the Azure portal or PowerShell.
 
## Create Runtime environment

1. Sign in to the Azure [portal](https://portal.azure.com) and select your Automation account.
1. Under **Process Automation**, select **Runtime Environments (preview)** and then select **Create**.
1. On **Basics** tab, provide the following details:
    1. Provide **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** dropdown list, select  **PowerShell**.
    1. In **Runtime version** for scripting language, select 7.2 (preview).
    1. Provide appropriate **Description**.
1. On **Packages** tab, in the **Package version** dropdown list, select 8.0.0
1. Select **+Add from gallery** to add a module from gallery and select **Next**.
1. On **Review + create** tab, review the entries and select **Create**.

   A notification appears to confirm that a runtime environment is successfully created.

## Create a runbook

1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. In the **Create a runbook** page, you can upload the file or browse the gallery. Here, provide the following details:
    1. Select **Create new**.
    1. In **Name**, enter the name of the runbook. The runbook name must start with a letter and can contain letters, numbers, underscores, and dashes
    1. From the **Runbook type** dropdown list,  select PowerShell. [Learn more](automation-runbook-types.md) on Runbook types. 
    1. Select the option **Select from existing** to view the compatible runtime environments and select your Runtime environment.
    1. In the **Runtime Environment**, you can view the properties
    1. Enter applicable **Description**
1. Select **Create**.

## Update Runtime environment of runbook

1. In the Automation account | Runbooks page, select **Update**.
1. In the **Update Runtime Environment** pop-up window, select **Runtime environment** to view the list of compatible runtime environments that you can link to the runbook. Here, select the Runtime environment that you created in [step 1](#create-runtime-environment) - PowerShell 7.2(preview).

   In the **Automation | Runbooks** page, you can view the details under the **Runtime environment** column.

 
## Next steps

1. See [manage-runtime-environment](automation-manage-send-joblogs-log-analytics.md) to view the various operations through portal and REST API.
