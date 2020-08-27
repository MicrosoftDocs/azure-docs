---
title: Create automated tasks to manage Azure resources
description: Automate tasks to help manage Azure resources and costs
services: logic-apps
ms.suite: integration
ms.reviewer: logicappspm
ms.topic: conceptual
ms.date: 09/10/2020
---

# Manage Azure resources by creating automation tasks (preview)

To help you manage Azure resources more easily, you can create and automate management tasks for a specific resource or resource group by using automation task templates, which vary based on the resource type. For example, for a virtual machine resource in the Azure portal, you can set up an automated task that sends you the monthly cost for that virtual machine or that can turn on and turn off that virtual machine. Currently, here are the available task templates available in this preview:

* All Azure resources

* Azure resource groups

* Azure virtual machines

* Azure Storage accounts

When you create an automation task for a specific Azure resource, you do so from that specific resource in the Azure portal, for example, the actual virtual machine resource or storage account. However, behind the scenes, an automation task is actually run as a workflow by the [Azure Logic Apps](../logic-apps/logic-apps-overview.md) service. After an automation task runs, you can review the status, history, inputs, and outputs for that specific run instance. You can also open and edit the task template in the Logic App Designer so that you can customize the template.

This article shows how to complete the following tasks:

* Create an automation task for a specific Azure resource.

* Review the status, history, inputs, and outputs for a specific run instance.

* Open and edit the task template in the Logic App Designer.

## How do automation tasks differ from Azure Automation?

Currently, you can create automation tasks only at the resource level, view their run history, and edit the task templates.

while [Azure Automation](../automation/automation-intro.md) is a cloud-based automation and configuration service that supports consistent management across your Azure and non-Azure environments. The service comprises [process automation for orchestrating processes](../automation/automation-intro.md#process-automation) by using [runbooks](../automation/automation-runbook-execution.md), configuration management with [change tracking and inventory](../automation/change-tracking.md), update management, shared capabilities, and heterogeneous features. Automation gives you complete control during deployment, operations, and decommissioning of workloads and resources.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Azure resource that you want to manage. This article uses a virtual machine as the example.

## Create an automation task

1. In the [Azure portal](https://portal.azure.com), find the resource that you want to manage.

1. On the resource's menu, under **Settings**, select **Automation tasks** > **Add** so that you can select a task template.

1. On the **Add a Task** pane, under **Select a template**, select the task template that you want to use.

1. Under **Authentication**, asdfadfsadsfljasfd, select **Next**.

1. Under **Configuration**, provide a name for the task and if necessary, the email address that you want to use for the notification. Select **Create**.

1. Provide the information that's required by the task, and select **Create**.

   The task is automatically live and starts running immediately.

## Review the task status and history

## Customize the task



## Next steps