---
title: Create Dynatrace for Azure resource - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Dynatrace.
ms.topic: quickstart
author: flang-msft
ms.author: franlanglois
ms.date: 10/12/2022

---

# QuickStart: Get started with Dynatrace

In this quickstart, you create a new instance of Dynatrace for Azure. You can either create a new Dynatrace environment or [link to an existing Dynatrace environment](dynatrace-link-to-existing.md#link-to-existing-dynatrace-environment).

When you use the integrated Dynatrace experience in Azure portal, the following entities are created and mapped for monitoring and billing purposes.

:::image type="content" source="media/dynatrace-create/dynatrace-entities.png" alt-text="Flowchart showing three entities: Marketplace S A A S connecting to Dynatrace resource, connecting to Dynatrace environment.":::

- **Dynatrace resource in Azure** - Using the Dynatrace resource, you can manage the Dynatrace environment in Azure. The resource is created in the Azure subscription and resource group that you select during the create process or linking process.
- **Dynatrace environment** - This is the Dynatrace environment on Dynatrace _Software as a Service_ (SaaS). When you create a new environment, the environment on Dynatrace SaaS is automatically created, in addition to the Dynatrace resource in Azure.
- **Marketplace SaaS resource** - The SaaS resource is created automatically, based on the plan you select from the Dynatrace Marketplace offer. This resource is used for billing purposes.

## Prerequisites

Before you link the subscription to a Dynatrace environment,[complete the pre-deployment configuration.](dynatrace-link-to-existing.md).

### Find Offer

Use the Azure portal to find Dynatrace for Azure application.

1. Go to the [Azure portal](https://portal.azure.com) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/dynatrace-create/dynatrace-search-marketplace.png" alt-text="Screenshot showing a search for Marketplace in the Azure portal.":::

1. In the Marketplace, search for _Dynatrace_.

    :::image type="content" source="media/dynatrace-create/dynatrace-subscribe.png" alt-text="Screenshot showing Dynatrace in the working pane to create a subscription.":::

1. Select **Subscribe**.

## Create a Dynatrace resource in Azure

1. When creating a Dynatrace resource, you see two options: one to create a new Dynatrace environment, and another to link Azure subscription to an existing Dynatrace environment.

    :::image type="content" source="media/dynatrace-create/dynatrace-create.png" alt-text="Screenshot offering to create a Dynatrace resource.":::

1. If you want to create a new Dynatrace environment, select **Create** action under the **Create a new Dynatrace environment** option
    :::image type="content" source="media/dynatrace-create/dynatrace-create-new-link-existing.png" alt-text="Screenshot showing two options: new Dynatrace or existing Dynatrace.":::

1. You see a form to create a Dynatrace resource in the working pane.

    :::image type="content" source="media/dynatrace-create/dynatrace-basic-properties.png" alt-text="Screenshot of basic properties needed for new Dynatrace instance.":::

1. Provide the following values:

    | **Property** |   **Description** |
    |--------------|-------------------|
    | Subscription | Select the Azure subscription you want to use for creating the Dynatrace resource. You must have owner or contributor access.|
    | Resource group | Specify whether you want to create a new resource group or use an existing one. A [resource group](/azure-resource-manager/management/overview.md) is a container that holds related resources for an Azure solution. |
    | Resource name   | Specify a name for the Dynatrace resource. This name will be the friendly name of the new Dynatrace environment.|
    | Location        | Select the region. Select the region where the Dynatrace resource in Azure and the Dynatrace environment is created.|
    | Pricing plan    | Select from the list of available plans. |

### Configure metrics and logs

1. Your next step is to configure metrics and logs.  When creating the Dynatrace resource, you can set up automatic log forwarding for two types of logs:

    :::image type="content" source="media/dynatrace-create/dynatrace-metrics-and-logs.png" alt-text="Screenshot showing options for metrics and logs.":::

    - **Subscription activity logs** - These logs provide insight into the operations on your resources at the [control plane](/azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service-health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

    - **Azure resource logs** - These logs provide insight into operations that were taken on an Azure resource at the [data plane](/azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

1. To send subscription level logs to Dynatrace, select **Send subscription activity logs**. If this option is left unchecked, none of the subscription level logs are sent to Dynatrace.

1. To send Azure resource logs to Dynatrace, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure-monitor/essentials/resource-logs-categories.md).

   When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources. To filter the set of Azure resources sending logs to Dynatrace, use inclusion and exclusion rules and set the Azure resource tags:

    - All Azure resources with tags defined in include Rules send logs to Dynatrace.
    - All Azure resources with tags defined in exclude rules don't send logs to Dynatrace.
    - If there's a conflict between an inclusion and exclusion rule, the exclusion rule applies.

   The logs sent to Dynatrace are charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

   > [!NOTE]
   > Metrics for virtual machines and App Services can be collected by installing the Dynatrace OneAgent after the Dynatrace resource has been created.

1. Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

### Configure single sign-on

1. You can establish single sign-on to Dynatrace from the Azure portal when your organization uses Azure Active Directory as its identity provider. If your organization uses a different identity provider or you don't want to establish single sign-on at this time, you can skip this section.

     :::image type="content" source="media/dynatrace-create/dynatrace-single-sign-on.png" alt-text="Screenshot showing options for single sign-on.":::

1. To establish single sign-on through Azure Active directory, select the checkbox for **Enable single sign-on through Azure Active Directory**.

   The Azure portal retrieves the appropriate Dynatrace application from Azure Active Directory. The app matches the Enterprise app you provided in an earlier step.

## Next steps

- [Manage the Dynatrace resource](dynatrace-how-to-manage.md)
