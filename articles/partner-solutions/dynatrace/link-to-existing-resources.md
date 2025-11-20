---
title: Link to an Existing Azure Native Dynatrace Service Resource
description: Learn how to use the Azure portal to link to an existing instance of Dynatrace.
ms.topic: quickstart
ms.date: 09/15/2025

---

# Quickstart: Link to an existing Dynatrace environment

In this quickstart, you link an Azure subscription to an existing Dynatrace environment. After linking to the Dynatrace environment, you can monitor the linked Azure subscription and the resources in that subscription by using the Dynatrace environment.

> [!NOTE]
> You can only link Dynatrace environments that have been previously created via Dynatrace for Azure.

When you use the integrated experience for Dynatrace in the Azure portal, your billing and monitoring for the following entities is tracked in the portal.

:::image type="content" source="media/dynatrace-link-to-existing/dynatrace-entities-linking.png" alt-text="Flowchart showing three entities: subscription 1 connected to subscription 2 and Dynatrace SaaS." lightbox="media/dynatrace-link-to-existing/dynatrace-entities-linking.png":::

- **Dynatrace resource on Azure**. By using the Dynatrace resource, you can manage the Dynatrace environment on Azure. The resource is created in the Azure subscription and resource group that you select during the linking process.
- **Dynatrace environment**. The Dynatrace environment on Dynatrace SaaS. When you link an existing environment, a new Dynatrace resource is created in Azure. The Dynatrace environment and the Dynatrace resource must reside in the same region.
- **Marketplace SaaS resource**. The SaaS resource is used for billing purposes. The SaaS resource typically doesn't reside in the Azure subscription where the Dynatrace environment was first created.

## Subscribe to Dynatrace

1. Go to the [Azure portal](https://portal.azure.com) and sign in.

1. Search for **Marketplace**.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-search-marketplace.png" alt-text="Screenshot showing a search for Marketplace." lightbox="media/dynatrace-link-to-existing/dynatrace-search-marketplace.png":::

1. In Azure Marketplace, search for **Dynatrace**, and select the **Dynatrace – An Azure Native ISV Service** tile.

1. On the **Dynatrace – An Azure Native ISV Service** page, select **Subscribe**.    

   :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-subscribe.png" alt-text="Screenshot showing the Subscribe button." lightbox="media/dynatrace-link-to-existing/dynatrace-subscribe.png":::

## Link to an existing Dynatrace environment

1. When you create a Dynatrace resource, you see two options: one to create a new Dynatrace environment, and another to link an Azure subscription to an existing Dynatrace environment.

1. If you're linking the Azure subscription to an existing Dynatrace environment, select **Create** under the **Link Azure subscription to an existing Dynatrace environment** option.

1. A new Dynatrace resource is created on Azure and linked to an existing Dynatrace environment that's hosted on Azure. A form opens for creating the resource.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-create-new-link-existing.png" alt-text="Screenshot that shows the Link Azure subscription to an existing Dynatrace environment pane." lightbox="media/dynatrace-link-to-existing/dynatrace-create-new-link-existing.png":::

1. Provide the following values.

    |**Property**   | **Action**  |
    |---------|---------|
    | **Subscription** | Select the Azure subscription that you want to use for creating the Dynatrace resource. This subscription will be linked to environment for monitoring purposes. |
    | **Resource group** | Specify whether you want to create a new resource group or use an existing one. A [resource group](../../azure-resource-manager/management/overview.md#resource-groups) is a container that holds related resources for an Azure solution. |
    | **Resource name** | Specify a name for the Dynatrace resource. |
    | **Region** | Select the Azure region where the Dynatrace resource should be created. |
    | **Dynatrace environment**| The Azure portal shows a list of existing environments that can be linked to. Select the environment that you want. |

    > [!NOTE]
    > Linking requires that the environment and the Dynatrace resource reside in the same Azure region. The user that's performing the linking action should have administrator permissions on the Dynatrace environment being linked to. If the environment that you want to link to doesn't appear in the dropdown list, check to ensure that these conditions are met.

1. Select **Next: Metrics and logs**.

### Configure metrics and logs

1. The next step is to configure metrics and logs. When linking an existing Dynatrace environment, you can set up automatic log forwarding for two types of logs:

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-metrics-and-logs.png" alt-text="Screenshot that shows the Metrics and logs tab." lightbox="media/dynatrace-link-to-existing/dynatrace-metrics-and-logs.png":::

    - **Subscription activity logs**. These logs provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service-health events are also included. Use the activity log to get information about write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

    - **Azure resource logs**. These logs provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a key vault is a data plane operation. Making a request to a database is also a data plane operation. The content of resource logs varies, depending on the Azure service and resource type.

1. To send Azure resource logs to Dynatrace, select **Send Azure resource logs**. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories).

    When the checkbox for Azure resource logs is selected, by default, logs are forwarded for all resources. To filter the set of Azure resources sending logs to Dynatrace, use inclusion and exclusion rules and set the Azure resource tags:

    - All Azure resources with tags defined in include rules send logs to Dynatrace.
    - Azure resources with tags defined in exclude rules don't send logs to Dynatrace.
    - If there's a conflict between an inclusion and exclusion rule, the exclusion rule applies.
  
    The logs sent to Dynatrace are charged by Azure. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

    You can collect metrics for virtual machines and app services by installing the Dynatrace OneAgent after the Dynatrace resource is created and an existing Dynatrace environment is linked to it.

1. After you finish configuring metrics and logs, select **Next: Single sign-on**.

### Configure single sign-on

> [!NOTE]
> You can't set up single sign-on when linking a Dynatrace resource to an existing Dynatrace environment. You can do so after creating the Dynatrace resource. For more information, see [Reconfigure single sign-on](dynatrace-how-to-manage.md#reconfigure-single-sign-on).

Select **Next: Tags**.

### Add tags

1. You can add tags for your new Dynatrace resource. Provide name/value pairs for the tags that you want to apply to the Dynatrace resource.

   :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-custom-tags.png" alt-text="Screenshot showing tags for a Dynatrace resource." lightbox="media/dynatrace-link-to-existing/dynatrace-custom-tags.png":::

1. When you're done adding tags, select **Next: Review+Create.**

### Review and create

1. Review your selections and the terms of use. After validation completes, select **Create**.

    :::image type="content" source="media/dynatrace-link-to-existing/dynatrace-review-and-create.png" alt-text="Screenshot showing form to review and create a link to a Dynatrace environment." lightbox="media/dynatrace-link-to-existing/dynatrace-review-and-create.png":::

1. Azure deploys the Dynatrace resource. When the process completes, select **Go to resource** to see the resource.

## Next steps

- [Manage the Dynatrace resource](dynatrace-how-to-manage.md)
- Get started with Azure Native Dynatrace Service on:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview)
