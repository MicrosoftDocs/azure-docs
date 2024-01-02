---
title: Link Azure Native New Relic Service to an existing account
description: Learn how to link to an existing New Relic account.

ms.topic: quickstart
ms.date: 02/16/2023
---


# Quickstart: Link to an existing New Relic account

In this quickstart, you link an Azure subscription to an existing New Relic account. You can then monitor the linked Azure subscription and the resources in that subscription by using the New Relic account.

> [!NOTE]
> You can link New Relic accounts that you previously created by using Azure Native New Relic Service.

When you use Azure Native New Relic Service in the Azure portal for linking, and both the organization and the account at New Relic were created through the Azure Native New Relic Service, your billing and monitoring for the following entities are tracked in the portal.

:::image type="content" source="media/new-relic-link-to-existing/new-relic-subscription.png" alt-text="Diagram that shows Azure subscriptions related to an Azure account.":::

- **New Relic resource in Azure**: By using the New Relic resource, you can manage the New Relic account on Azure. The resource is created in the Azure subscription and resource group that you select during the linking process.
- **New Relic account**: When you choose to link an existing account on New Relic software as a service (SaaS), a New Relic resource is created on Azure.
- **New Relic organization**: The New Relic organization on New Relic SaaS is used for user management and billing.
- **Azure Marketplace SaaS resource**: The SaaS resource is used for billing. The SaaS resource typically resides in a different Azure subscription from where the New Relic account was created.

> [!NOTE]
> The Azure Marketplace SaaS resource is set up only if you created the New Relic organization by using Azure Native New Relic Service. If you created your New Relic organization directly from the New Relic portal, the Azure Marketplace SaaS resource doesn't exist, and New Relic will manage your billing.

## Find an offer

1. Use the Azure portal to find Azure Native New Relic Service. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you visited Azure Marketplace in a recent session, select the icon from the available options. Otherwise, search for **marketplace** and then select the **Marketplace** result under **Services**.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-search.png" alt-text="Screenshot that shows the word Marketplace typed in a search box.":::

1. In Azure Marketplace, search for **new relic**.

1. When you find Azure Native New Relic Service on the working pane, select **Subscribe**.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-service-monitoring.png" alt-text="Screenshot that shows Azure Native New Relic Service and Cloud Monitoring in Azure Marketplace.":::

## Link to an existing New Relic account

1. When you're creating a New Relic resource, you have two options. One creates a New Relic account, and the other links an Azure subscription to an existing New Relic account. When you complete this process, you create a New Relic resource on Azure that links to an existing New Relic account.

    For this example, use the **Link an existing New Relic resource** option and select **Create**.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-create.png" alt-text="Screenshot that shows two options for creating a New Relic resource on Azure.":::

1. A form to create the New Relic resource appears on the **Basics** tab. Select an existing in account in **New Relic account**.

    :::image type="content" source="media/new-relic-link-to-existing/new-relic-account.png" alt-text="Screenshot that shows the tab for basic information about linking an existing New Relic account.":::

1. Provide the following values:

    |Property |  Description |
    |---|---|
    | **Subscription**  | Select the Azure subscription that you want to use for creating the New Relic resource. This subscription is linked to the New Relic account for monitoring purposes.|
    | **Resource group**  | Specify whether you want to create a new resource group or use an existing one. A [resource group](../../azure-resource-manager/management/overview.md) is a container that holds related resources for an Azure solution.|
    | **Resource name**  | Specify a name for the New Relic resource.|
    | **Region**  | Select the Azure region where the New Relic resource should be created.|
    | **New Relic account**  | The Azure portal displays a list of existing accounts that can be linked. Select the desired account from the available options.|

1. After you select an account from New Relic, the New Relic billing details appear for your reference. The user who is performing the linking action should have global administrator permissions on the New Relic account that's being linked.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-form.png" alt-text="Screenshot that shows the Basics tab and New Relic account details in a red box.":::

1. If the New Relic account you selected has a parent New Relic organization that was created from New Relic portal, your billing is managed by New Relic and continues to be managed by New Relic.

   > [!NOTE]
   > Linking requires:
   >
   > - The account and the New Relic resource reside in the same Azure region
   > - The user who is linking the account and resource must have Global administrator permissions on the New Relic account being linked
   >
   > If the account that you want to link to does not appear in the dropdown list, verify that these conditions are satisfied.

1. Select **Next**.

## Configure metrics and logs

Your next step is to configure metrics and logs on the **Metrics + Logs** tab. When you're linking an existing New Relic account, you can set up automatic log forwarding for two types of logs:

- **Send subscription activity logs**: These logs provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). The logs also include updates on service-health events.

  Use the activity log to determine what, who, and when for any write operations (`PUT`, `POST`, `DELETE`). There's a single activity log for each Azure subscription.

- **Azure resource logs**: These logs provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a key vault is a data plane operation. Making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

:::image type="content" source="media/new-relic-link-to-existing/new-relic-metrics.png" alt-text="Screenshot that shows the tab for metrics and logs, with actions to complete.":::

1. To send Azure resource logs to New Relic, select **Send Azure resource logs for all defined resources**. The types of Azure resource logs are listed in [Azure Monitor resource log categories](../../azure-monitor/essentials/resource-logs-categories.md).

1. When the checkbox for Azure resource logs is selected, logs are forwarded for all resources by default. To filter the set of Azure resources that are sending logs to New Relic, use inclusion and exclusion rules and set the Azure resource tags:

   - All Azure resources with tags defined in include rules send logs to New Relic.
   - All Azure resources with tags defined in exclude rules don't send logs to New Relic.
   - If there's a conflict between inclusion and exclusion rules, the exclusion rule applies.

   Azure charges for logs sent to New Relic. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

   > [!NOTE]
   > You can collect metrics for virtual machines and app services by installing the New Relic agent after you create the New Relic resource and link an existing New Relic account to it.
``
1. After you finish configuring metrics and logs, select **Next**.

## Add tags

1. On the **Tags** tab, you can add tags for your New Relic resource. Provide name/value pairs for the tags to apply to the New Relic resource.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-tags.png" alt-text="Screenshot that shows the tab for adding tags, with names and values to complete.":::

1. When you finish adding tags, select **Next**.

## Review and create

1. On the **Review + Create** tab, review your selections and the terms of use.

   :::image type="content" source="media/new-relic-link-to-existing/new-relic-link-create.png" alt-text="Screenshot that shows the tab for reviewing and creating a New Relic resource, with a summary of completed information.":::

1. After validation finishes, select **Create**. Azure deploys the New Relic resource. When that process finishes, select **Go to resource** to see the New Relic resource.

## Next steps

- [Manage the New Relic resource](new-relic-how-to-manage.md)
- [Quickstart: Get started with New Relic](new-relic-create.md)
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
