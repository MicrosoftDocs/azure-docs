---
title: Update PowerShell Runbook in Azure Runtime Environment
titleSuffix: Azure Automation
description: This article shows how to update a runbook from PowerShell 5.1 to PowerShell 7.2 in Runtime environment.
services: automation
ms.date: 06/27/2025
ms.topic: quickstart
ms.custom: references_regions
ms.author: v-jasmineme
author: jasminemehndir
---

# Update runbook from PowerShell 7.1 to PowerShell 7.4

Using the Runtime environment, you can upgrade a runbook from one Runtime version to the other by creating a different Runtime environment and then linking the runbook to it. You can follow similar steps for updating Python runbooks. 

> [!NOTE]
> PowerShell versions 7.1 and 7.2 and Python versions 2.7 and 3.8 are no longer supported by their respective parent products PowerShell and Python. We recommend that you update outdated runbooks to latest supported versions using Runtime environment.

## Prerequisites

 - An Azure Automation account (in any supported Public regions except Brazil Southeast and Gov clouds).
 - A PowerShell 7.1 runbook in Azure Automation.
 
## Create Runtime environment

To create a Runtime environment, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select your Automation account.
1. Under **Process Automation**, select **Runtime Environments**. If you don't find Runtime Environments in the list, select **Try Runtime environment experience** in the **Overview** page to switch to the new portal interface.
1. Select **Create** to create a new PowerShell 7.4 Runtime.
1. On the **Basics** tab, provide the following details:
    1. Enter **Name** for the Runtime environment. It must begin with alphabet and can contain only alphabets, numbers, underscores, and dashes.  
    1. From the **Language** dropdown list, select  **PowerShell**.
    1. In **Runtime version** for scripting language, select 7.4.
    1. Enter appropriate **Description**.
1. On the **Packages** tab, in the **Package version** dropdown list, you would see default **Az** and **Azure CLI** packages already present.
1. Select **+Add from gallery** to add more packages from gallery and select **Next**.
1. On the **Review + create** tab, review the entries and select **Create**.

   A notification appears to confirm that a Runtime environment is successfully created.


## Update Runtime environment of runbook

To update Runtime environment of runbook, follow these steps:  

1. In the **Automation account | Runbooks** page, select the runbook linked to PowerShell 7.1 Runtime environment that you want to update.

    :::image type="content" source="./media/quickstart-update-runbook-in-runtime-environment/update-runtime-environment.png" alt-text="Screenshot shows how to update the runtime environment." lightbox="./media/quickstart-update-runbook-in-runtime-environment/update-runtime-environment.png":::    

1. Select **Edit in portal**.
1. Select **Runtime environment**  from the dropdown to view the list of compatible Runtime environments that you can link to the runbook. Here, select the Runtime environment that you created in [Runtime environment](#create-runtime-environment) for PowerShell 7.4.

    :::image type="content" source="./media/quickstart-update-runbook-in-runtime-environment/edit-runbooks-runtime-environment.png" alt-text="Screenshot shows how to edit runbooks in the runtime environment." lightbox="./media/quickstart-update-runbook-in-runtime-environment/update-runtime-environment.png":::

1. Make changes in the runbook code to ensure compatibility with PowerShell 7.4.
1. Select **Test pane** to test the upgraded runbook before you publish it.
1. After confirmation that the test results are as expected, select **Publish** to publish the runbook to production.
    On the **Runbooks** list page, you can see the same runbook linked to PowerShell 7.4 Runtime environment.


## Next steps

- See [Manage Runtime environment](manage-runtime-environment.md) to view the various operations through portal and REST API.
