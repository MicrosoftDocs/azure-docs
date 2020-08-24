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

* Azure storage accounts

When you create automation tasks for a specific Azure resource in the Azure portal, you do so from that particular resource, for example, from the actual resource for the virtual machine and Azure portal page for that resource. Virtual Machines or Azure Storage accounts. these tasks are actually powered and run by [Azure Logic Apps](../logic-apps/logic-apps-overview.md). This underlying platform makes possible for you to examine the run history for a task and also the capability to edit or customize the task to your needs.

This article shows how to create automation tasks based on a specific Azure resource and 

## How do automation tasks differ from Azure Automation?

Currently, you can create automation tasks only at the resource level. [Azure Automation](../automation/automation-intro.md) is a more comprehensive service that 

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Azure resource that you want to manage

## Create an automated task

1. In the [Azure portal](https://portal.azure.com), find the resource that you want to manage.

1. On the resource's menu, under **Settings**, select **Automation tasks** > **Add** so that you can select a task template.

1. On the **Add a Task** pane, under **Select a template**, select the task that you want to create.

## Review the task status and history

## Customize the task



## Next steps