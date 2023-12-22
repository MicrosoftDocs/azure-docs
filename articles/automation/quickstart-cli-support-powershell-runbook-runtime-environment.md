---
title: Add support for Azure CLI in PowerShell 7.2 runbooks in Runtime environment
titleSuffix: Azure Automation
description: This article shows how add support for Azure CLI in PowerShell 7.2 runbooks in Runtime environment.
services: automation
ms.date: 12/22/2023
ms.topic: conceptual
---

# Run Azure CLI in PowerShell 7.2 runbooks in Runtime environment

Using the Runtime environment, you can run Azure CLI commands in PowerShell 7.2 runbooks.

> [!NOTE]
> Azure CLI commands version 2.52.0 are available as a default package in PowerShell 7.2 Runtime environment.

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

## Update Runtime environment of runbook

1. In the **Automation account | Runbooks** page, select **Update**.
1. In the **Update Runtime Environment** pop-up window, select **Runtime environment** to view the list of compatible runtime environments that you can link to the runbook. Here, select the Runtime environment - PowerShell 7.2 (preview) that you created in [Runtime environment](#create-runtime-environment).

   In the **Automation | Runbooks** page, you can view the details under the **Runtime environment** column.

 
## Next steps

1. See [manage-runtime-environment](automation-manage-send-joblogs-log-analytics.md) to view the various operations through portal and REST API.
