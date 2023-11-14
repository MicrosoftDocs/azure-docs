---
title: Create pre and post events using a webhook with Automation runbooks.
description: In this tutorial, you learn how to create the pre and post events using webhook with Automation runbooks.
ms.service: azure-update-manager
ms.date: 11/12/2023
ms.topic: tutorial 
author: SnehaSudhirG
ms.author: sudhirsneha
#Customer intent: As an IT admin, I want  create pre and post events using a webhook with Automation runbooks.
---

# Tutorial: Create pre and post events using a webhook with Automation

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure VMs :heavy_check_mark: Azure Arc-enabled servers.
 
Pre and post events, also known as pre/post-scripts, allow you to execute user-defined actions before and after the schedule patch installation. One of the most common scenarios is to start and stop a VM. With pre-events, you can run a prepatching script to start the VM before initiating the schedule patching process. Once the schedule patching is complete, and the server is rebooted, a post-patching script can be executed to safely shut down the VM

This tutorial explains how to create pre and post events to start and stop a VM in a schedule patch workflow using a webhook.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create and publish Automation runbook
> - Add webhooks
> - Create an event subscription


## Create and publish Automation runbook

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your **Azure Automation** account.
1. [Create](../automation/manage-runbooks.md#create-a-runbook) and [Publish](../automation/manage-runbooks.md#publish-a-runbook) an Automation runbook. Alternatively, you can use either your existing script or use the following two sample scripts to customize.


## Add webhooks

[Add webhooks](../automation/automation-webhooks.md#create-a-webhook) to the above published runbooks and copy the webhooks URLs. 

> [!NOTE]
> Ensure to copy the URL after you create a webhook as you cannot retrieve the URL again.
 
## Create an Event subscription

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configuration**.
1. On the **Maintenance Configuration** page, select the configuration. 
1. Under **Settings**, select **Events**. 
1. Select **+Event Subscription** to create a pre/post maintenance event.
1. On the **Create Event Subscription** page, enter the following details:
    1. In the **Event Subscription Details** section, provide an appropriate name. 
    1. Keep the schema as **Event Grid Schema**.
    1. In the **Event Types** section, **Filter to Event Types**. 
        1. Select **Pre Maintenance Event** for a pre-event.
           - In the **Endpoint details** section, select the **Webhook** endpoint and select **Configure and Endpoint**.
           - Provide the appropriate details such as pre-event webhook **URL** to trigger the event.
        1. Select **Post Maintenance Event** for a post-event.
            - In the **Endpoint details** section, the **Webhook** endpoint and select **Configure and Endpoint**.
            - Provide the appropriate details such as post-event webhook **URL** to trigger the event.
1. Select **Create**.

## Next steps
Learn about [managing multiple machines](manage-multiple-machines.md).
 
