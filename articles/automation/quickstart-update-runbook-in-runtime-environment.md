---
title: Update PowerShell runbook in Azure Runtime environment
titleSuffix: Azure Automation
description: This article shows how to update a runbook from PowerShell 5.1 to PowerShell 7.2 in Runtime environment.
services: automation
ms.date: 01/02/2024
ms.topic: conceptual
---

# Update a runbook from PowerShell 5.1 to PowerShell 7.2 in Azure Runtime environment

Using the Runtime environment, you can upgrade a runbook from one Runtime version to the other by creating a different Runtime environment and then linking the runbook to it.

> [!NOTE]
> A runbook can be mapped to a single Runtime environment, while a specific Runtime environment can be mapped to multiple runbooks.

## Prerequisites

 1. An Azure Automation account (in any supported Public regions except Central India, Germany North, Italy North, Israel Central, Poland Central, UAE Central, and Government clouds).
 1. A PowerShell 5.1 runbook in Azure Automation.
 
## Create Runtime environment

> [!NOTE]
> This is optional if you are updating the runbook to System-generated PowerShell-7.2 runtime environment.

1. Sign in to the Azure [portal](https://portal.azure.com) and select your Automation account.
1. Under **Process Automation**, select **Runtime Environments (preview)**. If you don't find Runtime Environments (preview) in the list, select **Try Runtime environment experience** to switch to the new portal interface.
1. Select **Create** to create a new PowerShell 7.2 Runtime.
1. On **Basics** tab, provide the following details:
    1. Provide **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** dropdown list, select  **PowerShell**.
    1. In **Runtime version** for scripting language, select 7.2.
    1. Provide appropriate **Description**.
1. On **Packages** tab, in the **Package version** dropdown list, you would see **Az version 8.3.0** and **Azure CLI version 2.52.0** packages already present.
1. Select **+Add from gallery** to add more packages from gallery and select **Next**.
1. On **Review + create** tab, review the entries and select **Create**.

   A notification appears to confirm that a runtime environment is successfully created.


## Update Runtime environment of runbook

1. In the **Automation account | Runbooks** page, select the runbook linked to PowerShell 5.1 Runtime environment that you want to update.
1. Select **Update**.
1. Select **Runtime environment**  from the dropdown to view the list of compatible Runtime environments that you can link to the runbook. Here, select the Runtime environment that you created in [Runtime environment](#create-runtime-environment) for PowerShell 7.2.
1. Make changes in the runbook code to ensure compatibility with PowerShell 7.2.
1. Select **Test pane** to test the upgraded runbook before you publish it.
1. After confirmation that the test results are as expected, select **Publish** to publish the runbook to production.
    On the **Runbooks** list page, you can see the same runbook linked to PowerShell 7.2 Runtime environment.
 
 
## Next steps

1. See [manage-runtime-environment](automation-manage-send-joblogs-log-analytics.md) to view the various operations through portal and REST API.
