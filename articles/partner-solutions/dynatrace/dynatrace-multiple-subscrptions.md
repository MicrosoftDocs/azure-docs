---
title: How to monitor multiple subscriptions with Azure Native Dynatrace Service
description: This article describes how to setup Dynatrace to monitor mulitple subscriptions using the Azure portal. 

ms.topic: how-to
ms.date: 08/27/2024

#CustomerIntent: As a web developer, I want use Dynatrace so that I can use multiple subscriptions with one Dynatrace resource.
---

# Use one Dynatrace resource with multiple subscriptions

You can now monitor all your subscriptions through a single Dynatrace resource using **Monitored Subscriptions**. Your experience is simplified because you don\'t have to set up a Dynatrace resource in every subscription that you intend to monitor. You can monitor multiple subscriptions by linking them to a single Dynatrace resource that is tied to a Dynatrace environment. This provides a single pane view for all resources across multiple subscriptions.

## Prerequisites

TODO: List the prerequisites

## Setup multiple subscriptions

1. To manage multiple subscriptions that you want to monitor, select **Monitored Subscriptions** in the **Dynatrace environment configurations** section of the Resource menu.

<!-- ![](media/image1.png){width="6.5in" height="2.1666666666666665in"} -->

1. From **Monitored Subscriptions** in the Resource menu, select the **Add Subscriptions**. The **Add Subscriptions** experience that opens and shows the subscriptions you have *Owner* role assigned to and any Dynatrace resource created in those subscriptions that is already linked to the same Dynatrace environment as the current resource.

1. If the subscription you want to monitor has a resource already linked to the same Dynatrace org, we recommend that you delete the Dynatrace resources to avoid shipping duplicate data and incurring double the charges.

1. Select the subscriptions you want to monitor through the Dynatrace resource and select **Add**.

<!-- ![](media/image2.png){width="6.5in" height="3.375in"} -->

1. If the list doesn't get updated automatically, select **Refresh** to view the subscriptions and their monitoring status. You might see an intermediate status of *In Progress* while a subscription gets added. When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

<!-- \<Screenshot TBD\> -->

The set of tag rules for metrics and logs defined for the Dynatrace resource applies to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn\'t supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the Dynatrace resource.

If you have existing Dynatrace resources that are linked to the account for monitoring, you can end up with duplication of logs that can result in added charges. Ensure you delete redundant Dynatrace resources that are already linked to the account. You can view the list of connected resources and delete the redundant ones. We recommend consolidating subscriptions into the same Dynatrace resource where possible.

## Related content

- [Manage the Dynatrace resource](dynatrace-how-to-manage.md)
- Get started with Azure Native Dynatrace Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Dynatrace.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview)
