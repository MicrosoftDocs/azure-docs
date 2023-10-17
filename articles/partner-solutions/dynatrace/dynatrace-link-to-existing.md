---
title: Linking to an existing Azure Native Dynatrace Service resource
description: This article describes how to use the Azure portal to link to an instance of Dynatrace.

ms.topic: quickstart
ms.date: 02/02/2023

---

# Quickstart: Link to an existing Dynatrace environment

In this quickstart, you link an Azure subscription to an existing Dynatrace environment. After linking to the Dynatrace environment, you can monitor the linked Azure subscription and the resources in that subscription using the Dynatrace environment.

> [!NOTE]
> You can only link Dynatrace environments that have been previously created via Dynatrace for Azure.

When you use the integrated experience for Dynatrace in the Azure portal, your billing and monitoring for the following entities is tracked in the portal.

:::image type="content" source="media/dynatrace-link-to-existing/dynatrace-entities-linking.png" alt-text="Flowchart showing three entities: subscription 1 connected to subscription 1 and Dynatrace S A A S.":::

- **Dynatrace resource in Azure** - Using the Dynatrace resource, you can manage the Dynatrace environment in Azure. The resource is created in the Azure subscription and resource group that you select during the linking process.
- **Dynatrace environment** - the Dynatrace environment on Dynatrace SaaS. When you choose to link an existing environment, a new Dynatrace resource is created in Azure. The Dynatrace environment and the Dynatrace resource must reside in the same region.
- **Marketplace SaaS resource** - the SaaS resource is used for billing purposes. The SaaS resource typically resides in a different Azure subscription from where the Dynatrace environment was first created.

## Find Offer

1. Use the Azure portal to find Dynatrace.

1. Go to the [Azure portal](https://portal.azure.com) and sign in.

1. If you've visited the Marketplace in a recent session, select the icon from the available options. Otherwise, search for Marketplace.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-search-marketplace.png" alt-text="Screenshot showing a search for Dynatrace in Marketplace.":::

1. In the Marketplace, search for _Dynatrace_.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-subscribe.png" alt-text="Screenshot showing Dynatrace in the working pane to create a subscription.":::

1. In the working pane, select **Subscribe**.

## Link to existing Dynatrace environment

1. When creating a Dynatrace resource, you see two options: one to create a new Dynatrace environment, and another to link Azure subscription to an existing Dynatrace environment.

1. If you're linking the Azure subscription to an existing Dynatrace environment, select **Create** under the **Link Azure subscription to an existing Dynatrace environment** option.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-create-new-link-existing.png" alt-text="Screenshot where creating a link to an existing Dynatrace environment is highlighted.":::

1. The process creates a new Dynatrace resource in Azure and links it to an existing Dynatrace environment hosted on Azure. You see  a form to create the Dynatrace resource in the working pane.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-create-new-link-existing.png" alt-text="Screenshot showing highlight around link Azure subscription to an existing Dynatrace environment.":::

1. Provide the following values.

    |**Property**   | **Description**  |
    |---------|---------|
    | Subscription | Select the Azure subscription you want to use for creating   the Dynatrace resource. This subscription will be linked to environment for monitoring purposes. |
    | Resource Group | Specify whether you want to create a new resource group or use an existing one. A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
    | Resource name | Specify a name for the Dynatrace resource. |
    | Region | Select the Azure region where the Dynatrace resource should be created. |
    | Dynatrace | The Azure portal displays a list of existing environments that can be linked. Select the desired environment from the available options. |

    > [!NOTE]
    > Linking requires that the environment and the Dynatrace resource reside in the   same Azure region. The user that is performing the linking action should have   administrator permissions on the Dynatrace environment being linked. If the   environment that you want to link to does not appear in the dropdown list, check if   any of these conditions are not satisfied.

Select **Next: Metrics and logs** to configure metrics and logs.

### Configure metrics and logs

1. Your next step is to configure metrics and logs. When linking an existing Dynatrace environment, you can set up automatic log forwarding for two types of logs:

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-metrics-and-logs.png" alt-text="Screenshot showing options for metrics and logs.":::

    - **Subscription activity logs** - These logs provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service-health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There\'s a single activity log for each Azure subscription.

    - **Azure resource logs** - These logs provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

1. To send Azure resource logs to Dynatrace, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md).

    When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources. To filter the set of Azure resources sending logs to Dynatrace, use inclusion and exclusion rules and set the Azure resource tags:

    - All Azure resources with tags defined in include Rules send logs to Dynatrace.
    - All Azure resources with tags defined in exclude rules don't send logs to Dynatrace.
    - If there's a conflict between an inclusion and exclusion rule, the exclusion rule applies.
  
    The logs sent to Dynatrace are charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

    Metrics for virtual machines and App Services can be collected by installing the Dynatrace OneAgent after the Dynatrace resource has been created and an existing Dynatrace environment has been linked to it.

Once you have completed configuring metrics and logs, select **Next: Single sign-on**.

### Configure single sign-on

> [!NOTE]
> You cannot set up single sign-on when linking the Dynatrace resource to an existing Dynatrace environment. You can do so after creating the Dynatrace resource. For more information, see [Reconfigure single sign-on](dynatrace-how-to-manage.md#reconfigure-single-sign-on).

Select **Next: Tags**.

### Add tags

1. You can add tags for your new Dynatrace resource. Provide name and value pairs for the tags to apply to the Dynatrace resource.

   :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-custom-tags.png" alt-text="Screenshot showing list of tags for a Dynatrace resource.":::

When you've finished adding tags, select **Next: Review+Create.**

### Review and create

1. Review your selections and the terms of use. After validation completes, select **Create.**

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-review-and-create.png" alt-text="Screenshot showing form to review and create a link to a Dynatrace environment.":::

1. Azure deploys the Dynatrace resource. When the process completes, select **Go to resource** to see the Dynatrace resource.

## Next steps

- [Manage the Dynatrace resource](dynatrace-how-to-manage.md)
- Get started with Azure Native Dynatrace Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview)
