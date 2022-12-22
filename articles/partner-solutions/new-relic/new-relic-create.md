---
title: Creating an instance Azure Native New Relic Service 
description: Learn how to create a resource using the Azure Native New Relic Service.

ms.topic: quickstart
ms.date: 12/31/2022
---

# QuickStart: Get started with New Relic

In this QuickStart, you create a new instance of Azure Native New Relic Service. You can either create a New Relic account or link to an existing New Relic account.
<!-- create link to exising resource when created -->

When you use the integrated New Relic experience in Azure portal using the Azure Native New Relic Service, the following entities are created and mapped for monitoring and billing purposes.

:::image type="content" source="media/new-relic-create/new-relic-subscription.png" alt-text="Conceptual diagram showing relationship between Azure and New Relic.":::

- New Relic resource in Azure: Using the New Relic resource, you can manage the New Relic account in Azure. The resource is created in the Azure subscription and resource group that you select during the create process or linking process.

- New Relic organization: The New Relic organization on New Relic Software as a Service (SaaS) which is used for user management and billing.

- New Relic account: The New Relic account on New Relic Software as a Service (SaaS) which is used to store and process telemetry data.

- Marketplace SaaS resource: When you set up a new account and organization on New Relic using the Azure Native New Relic Service, the SaaS resource is created automatically, based on the plan you select from the Azure New Relic Marketplace offer. This resource is used for billing purposes.

## Prerequisites

Before you link the subscription to New Relic, complete the pre-deployment configuration. For more information, see [Configure pre-deployment for Azure Native New Relic Service](new-relic-how-to-configure-prereqs.md).

## Find Offer

Use the Azure portal to find Azure Native New Relic Service application.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the Azure **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for Marketplace.

   :::image type="content" source="media/new-relic-create/new-relic-search.jpg" alt-text="Screenshot showing Marketplace in search box.":::

1. In the Marketplace, search for _New Relic_.

   :::image type="content" source="media/new-relic-create/new-relic-marketplace.png" alt-text="Screenshot showing New Relic in the Marketplace.":::

  1. Select **Subscribe**.

## Create a New Relic resource in Azure

1. When creating a New Relic resource, you see two options: one is to create a New Relic account, and another to link Azure subscription to an existing New Relic account. Select **Create** under the Create a New Relic resource option.

   :::image type="content" source="media/new-relic-create/new-relic-create.png" alt-text="Screenshot showing New Relic resources.":::


    You see a form to create a New Relic resource in the working pane.

   :::image type="content" source="media/new-relic-create/new-relic-basics.png" alt-text="Screenshot showing the Basics tab of New Relic resource.":::

1. Provide the following values:

   |  Property | Description |
   |--|--|
   |  **Subscription**   |  Select the Azure subscription you want to use for creating the New Relic resource. You must have owner access.|
   |  **Resource group**  |Specify whether you want to create a new resource group or use an existing one. A [resource group](/azure/azure-resource-manager/management/overview) is a container that holds related resources for an Azure solution.|
   |  **Resource name**  |Specify a name for the New Relic resource. This name will be the friendly name of the New Relic account.|
   |  **Region**         |Select the region. Select the region where the New Relic resource in Azure and the New Relic account is created.|

   When choosing the organization under which to create the New Relic account, you have two options: one is to create a new organization, and another is to select an already existing organization to link the newly created account

1. If you opt to create a new organization, you can choose a plan from the list of available plans by selecting **Change Plan** in the working pane.

    :::image type="content" source="media/new-relic-create/new-relic-change-plan.png" alt-text="Screenshot of change plan.":::

1. If you opt to associate with an existing organization, the corresponding billing information that got set up at the time of creation of organization is shared with you for review. 

   :::image type="content" source="media/new-relic-create/new-relic-create-existing.png" alt-text="Screenshot showing the basics tab with information for existing organization.":::

## Configure metrics and logs

Your next step is to configure metrics and logs. When creating the New Relic resource, you can set up automatic log forwarding for two types of logs:

- **Subscription activity logs** 
    - These logs provide insight into the operations on your resources at the [control plane](/azure/azure-resource-manager/management/control-plane-and-data-plane). Updates on service-health events are also included. Use the activity log to determine what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

- **Azure resource logs**
    - These logs provide insight into operations that were taken on an Azure resource at the [data plane](/azure/azure-resource-manager/management/control-plane-and-data-plane). For example, getting a secret from a Key Vault is a data plane operation. Or making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

   :::image type="content" source="media/new-relic-create/new-relic-metrics.png" alt-text="Screenshot of Metrics and logs tab of the New Relic resource.":::

1. To send subscription level logs to New Relic, check **Subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to New Relic.

1. To send Azure resource logs to New Relic, select **Azure resource logs** for all supported resource types. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories).

1. When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources. To filter the set of Azure resources sending logs to New Relic, use inclusion and exclusion rules and set the Azure resource tags:

   - All Azure resources with tags defined in include Rules send logs to New Relic.
   - All Azure resources with tags defined in exclude rules don't send logs to New Relic.
   - If there's a conflict between an inclusion and exclusion rule, the exclusion rule applies.
    
1. The logs sent to New Relic are charged by Azure. For more information, see the [pricing of platform logs](/azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

> [!NOTE]
> Metrics for virtual machines and App Services can be collected by installing the New Relic Agent after the New Relic resource has been created.

1. Once you have completed configuring metrics and logs, select **Next**.

## Setup resource tags

1. In the 'Tags' tab, you can choose to set up tags for the New Relic resource. 

    :::image type="content" source="media/new-relic-create/new-relic-tags.png" alt-text="Screenshot of Tags tab of the New Relic resource.":::

1. You can also skip this step and go directly to **Review and Create**.

## Review and Create

1. Review the resource setup information presented in the **Review and Create**. 

:::image type="content" source="media/new-relic-create/new-relic-review.png" alt-text="Screenshot of Review and create tab of the New Relic resource.":::

1. Ensure that the validation passed and select **Create** to begin the resource deployment. 


## Next steps

- Manage the New Relic resource
