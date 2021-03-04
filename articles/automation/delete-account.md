---
title: Delete your Azure Automation account
description: This article tells how to delete your Automation account across the different configuration scenarios.
services: automation
ms.service: automation
ms.subservice: process-automation
ms.date: 03/03/2021
ms.topic: conceptual
---

# How to delete your Azure Automation account

After you enable an Azure Automation account to help automate IT or business process, or enable its other features to support operations management of your Azure and non-Azure machines such as Update Management, you may decide to stop using the Automation account. If you have enabled features that depend on integration with an Azure Monitor Log Analytics workspace, there are additional steps required to complete this action.

Removing your Automation account can be done using one of the following methods based on the supported deployment models:

* Delete the resource group containing the Automation account.
* Delete the resource group containing the Automation account and linked Azure Monitor Log Analytics workspace, if:

    * The account and workspace is dedicated to supporting Update Management, Change Tracking and Inventory, and/or Start/Stop VMs during off-hours.
    * The account is dedicated to process automation and integrated with a workspace to send runbook job status and job streams.

* Unlink the Log Analytics workspace from the Automation account and delete the Automation account.
* Delete the feature from your linked workspace, unlink the account from the workspace, and then delete the Automation account.

This article tells you how to completely remove your Automation account through the Azure portal, PowerShell, the Azure CLI, or the REST API.

## Delete the dedicated resource group

To delete your Automation account, and also the Log Analytics workspace if linked to the account, created in the same resource group dedicated to the account, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md) article.

