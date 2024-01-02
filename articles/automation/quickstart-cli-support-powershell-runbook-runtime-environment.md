---
title: Add support for Azure CLI in PowerShell 7.2 runbooks in Runtime environment
titleSuffix: Azure Automation
description: This article shows how to add support for Azure CLI in PowerShell 7.2 runbooks in Runtime environment.
services: automation
ms.date: 01/02/2024
ms.topic: conceptual
---

# Run Azure CLI commands 7.2 runbooks

You can run Azure CLI commands in runbooks linked with PowerShell 7.2 Runtime environment.

> [!NOTE]
> Azure CLI commands version 2.52.0 are available as a default package in PowerShell 7.2 Runtime environment.

## Prerequisites

 - An Azure Automation account (in any supported Public regions except Central India, Germany North, Italy North, Israel Central, Poland Central, UAE Central, and Government clouds).
 
 
## Create Runtime environment

1. Sign in to the Azure [portal](https://portal.azure.com) and select your Automation account.
1. Under **Process Automation**, select **Runtime Environments (preview)** and then select **Create**.
1. On **Basics** tab, provide the following details:
    1. Provide **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** dropdown list, select  **PowerShell**.
    1. In **Runtime version** for scripting language, select 7.2
    1. Provide appropriate **Description**.
1. On **Packages** tab, in the **Package version** dropdown list, you would see **Az version 8.3** and **Azure CLI version 2.52.0** already present.
1. Select **+Add from gallery** to add more packages from gallery and select **Next**.
1. On **Review + create** tab, review the entries and select **Create**.

   A notification appears to confirm that a runtime environment is successfully created.

## Create Runbook

You can create a new PowerShell runbook that supports Azure CLI commands and is associated with PowerShell 7.2 Runtime environment.

To create a runbook, follow these steps:

In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select **Create**.
1. In the **Basics** tab, you can either create a new runbook or upload a file from your local computer or from PowerShell gallery.
   1. Provide a **Name** for the runbook. It must begin with a letter and can contain only letters, numbers, underscores, and dashes.
   1. From the **Runbook type** dropdown, select the type of runbook that you want to create.
   1. Select PowerShell 7.2 Runtime environment created earlier.
   1. Provide appropriate **Description**.
   
      :::image type="content" source="./media/manage-runtime-environment/create-runbook.png" alt-text="Screenshot shows how to create runbook in runtime environment." lightbox="./media/manage-runtime-environment/create-runbook.png":::

1. Add runbook code on the **Edit Runbook page** and select **Save**.
 
1. **Test** runbook execution in Test pane. After you confirm the results, select **Publish** to publish the runbook and execute it.
 
## Next steps

1. See [manage runtime environment](automation-manage-send-joblogs-log-analytics.md) to view the various operations through portal and REST API.
