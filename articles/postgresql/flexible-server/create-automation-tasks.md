---
# Required metadata
		# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
		# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Stop/Start - Automation tasks - Azure Database for PostgreSQL Flexible Server
description: This article describes how to Stop/Start Azure Database for PostgreSQL Flexible Server instance using the Automation tasks.
author: varun-dhawan # GitHub alias
ms.author: varundhawan # Microsoft alias
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: quickstart
ms.date: 07/13/2023
---

# Stop/Start an Azure Database for PostgreSQL - Flexible Server using automation tasks (preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To help you manage Azure Database for PostgreSQL Flexible Server resources more efficiently, you can create automation tasks for your Flexible Server. One example of such tasks can be starting or stopping the PostgreSQL Flexible Server on a predefined schedule.

For an Azure Database for PostgreSQL Flexible Server, you can create an automation task that starts or stops the server on a predefined schedule. You can set this task to automatically start or stop the server a specific number of times every day, week, or month by setting the Interval and Frequency values on the task's Configure tab. The automation task continues to work until you delete or disable the task.

## How do automation tasks differ from Azure Automation?

Automation tasks are more basic and lightweight than Azure Automation. Currently, you can create an automation task only at the Azure resource level. An automation task is actually a logic app resource that runs a workflow, powered by the multi-tenant Azure Logic Apps service. You can view and edit the underlying workflow by opening the task in the workflow designer after it has completed at least one run.

In contrast, Azure Automation is a comprehensive cloud-based automation and configuration service that provides consistent management across your Azure and non-Azure environments. 

## Pricing

Creating an automation task doesn't immediately incur charges. Underneath, an automation task is powered by a workflow in a logic app resource hosted in multi-tenant Azure Logic Apps, thus the Consumption pricing model applies to automation tasks. Metering and billing are based on the trigger and action executions in the underlying logic app workflow. 


## Prerequisites
* An Azure account and subscription.
* Azure Database for PostgreSQL Flexible Server that you want to manage.

## Create an automation task

1. In the Azure portal, find the PostgreSQL Flexible Server resource that you want to manage.
2. On the resource navigation menu, in the Automation section, select Tasks (preview).
3. On the Tasks pane, select Add a task to select a task template.
4. Under Select a template, select the task for starting or stopping your PostgreSQL Flexible Server.
5. Under Authenticate, in the Connections section, select Create for every connection that appears in the task so that you can provide authentication credentials for all the connections.
6. After you authenticate all the connections, select Next: Configure.
7. Under Configure, provide a name for the task and any other information required for the task. When you're done, select Review + create.



