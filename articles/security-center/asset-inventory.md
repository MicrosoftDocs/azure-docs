---
title: Azure Security Center's asset inventory  
description: Learn about Azure Security Center's asset management experience providing full visibility over all your Security Center monitored resources.
author: memildin
manager: rkarlin
services: security-center
ms.author: memildin
ms.date: 08/11/2020
ms.service: security-center
ms.topic: conceptual
---

# Explore and manage your resources with asset inventory and management tools

The asset inventory page of Azure Security Center provides a single page for viewing the security posture of the resources you've connected to Security Center. 

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

When any resource has outstanding recommendations, they'll appear in the inventory.

Use this view and its filters to address such questions as:

- Which of my standard tier subscriptions has outstanding recommendations?
- Which of my machines with the tag 'Production' are missing the Log Analytics agent?
- How many of my machines, tagged with a specific tag have outstanding recommendations?
- How many resources in a specific resource group have security findings from a vulnerability assessment service?

The asset management possibilities for this tool are substantial and continue to grow. 


## Availability

|Aspect|Details|
|----|:----|
|Release state:|Preview|
|Pricing:|Free|
|Required roles and permissions:|All users|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||


## What are the key features of asset inventory?

The inventory page provides the following tools:

- **Summaries** - Before you define any filters, a prominent strip of values at the top of the inventory view shows:

    - **Total resources**: The total number of resources connected to Security Center.
    - **Unhealthy resources**: Resources with active security recommendations. [Learn more about security recommendations](https://docs.microsoft.com/azure/security-center/security-center-recommendations).
    - **Unmonitored resources**: Resources with agent monitoring issues - they have the Log Analytics agent deployed, but the agent isn't sending data or has other health issues.

- **Filters** - The multiple filters at the top of the page provide a way to quickly refine the list of resources according to the question you're trying to answer. For example, if you wanted to answer the question *Which of my machines with the tag 'Production' are missing the Log Analytics agent?* you could combine the **Agent monitoring** filter with the **Tags** filter as shown in the following clip:

    ![Filtering to production resources that aren't monitored](./media/asset-inventory/filtering-to-prod-unmonitored.gif)

    As soon as you've applied filters, the summary values are updated to relate to the query results. 

- **Export options** - Inventory provides the option to export the results of your selected filter options to a CSV file. In addition, you can export the query itself to Azure Resource Graph Explorer to further refine, save, or modify the KQL query.

    ![Inventory's export options](./media/asset-inventory/inventory-export-options.png)

    > [!TIP]
    > The KQL documentation provides a database with some sample data together with some simple queries to get the "feel" for the language. [Learn more in this KQL tutorial](https://docs.microsoft.com/azure/data-explorer/kusto/query/tutorial?pivots=azuredataexplorer).

- **Asset management options** - Inventory lets you perform complex discovery queries. When you've found the resources that match your queries, inventory provides shortcuts for operations such as:

    - Assign tags to the filtered resources - select the checkboxes alongside the resources you want to tag
    - Onboard new servers to Security Center - use the **Add non-Azure servers** toolbar button


## How does asset inventory work?

Asset inventory utilizes [Azure Resource Graph (ARG)](https://docs.microsoft.com/azure/governance/resource-graph/), an Azure service that provides the ability to query Security Center's security posture data across multiple subscriptions.

ARG is designed to provide efficient resource exploration with the ability to query at scale.

Using the [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/), asset inventory can quickly produce deep insights by cross-referencing ASC data with other resource properties.


## How to use asset inventory

1. From Security Center's sidebar, select **Inventory**.

1. Optionally, to display a specific resource enter the name in the **Filter by name** box.

1. Select the relevant options in the filters to create the specific query you want to perform.

    ![Inventory's filters](./media/asset-inventory/inventory-filters.png)

    By default, the resources are sorted by the number of active security recommendations.

    > [!IMPORTANT]
    > The options in each filter are specific to the resources in the currently selected subscriptions **and** your selections in the other filters.
    >
    > For example, if you've selected only one subscription, and the subscription has no resources with outstanding security recommendations to remediate (0 Unhealthy Resources), the **Recommendations** filter will have no options. 

1. To use the **Security findings contain** filter, enter free text from the ID, security check, or CVE name of a vulnerability finding to filter to the affected resources:

    !["Security findings contain" filter](./media/asset-inventory/security-findings-contain-elements.png)

    > [!TIP]
    > The **Security findings contain** and **Tags** filters only accept a single value. To filter by more than one, use **Add filters**.

1. To use the **Pricing tier** filter, select one or more options (Free, Partial, or Standard):

    - **Free** - Resources that are on the free pricing tier
    - **Standard** - Resources that are on the standard pricing tier
    - **Partial** - This applies to subscriptions that are on the standard pricing tier but have some of the optional security plans disabled. For example, the following subscription is on the standard tier but has five elements of the standard tier disabled. 

        ![Subscription on standard(partial) pricing tier](./media/asset-inventory/pricing-tier-partial.png)

1. To further examine the results of your query, select the resources that interest you.

1. Optionally, select **View in resource graph explorer** to open the query in Resource Graph Explorer.

    ![Inventory query in ARG](./media/asset-inventory/inventory-query-in-resource-graph-explorer.png)

1. If you've defined some filters and left the page open, Security Center won't update the results automatically. Any changes to resources won't impact the displayed results unless you manually reload the page or select **Refresh**.


## FAQ - Inventory

### Why aren't all of my subscriptions, machines, storage accounts, etc. shown?

The inventory view lists your resources from a Cloud Security Posture Management (CSPM) perspective. The filters don't return every resource in your environment; only the ones with outstanding (or 'active') recommendations. 

For example, if you have nine subscriptions but only eight currently have recommendations, when you filter by **Resource type = Subscriptions** you will only see the eight subscriptions with active recommendations:

![Not all subs returned when there are no active recommendations](./media/asset-inventory/filtered-subscriptions-some.png)


### Why do some of my resources show blank values in the pricing or agent monitoring columns?

Not all Security Center monitored resources have agents. For example, Azure Storage accounts or PaaS resources such as disks, Logic Apps, Data Lake Analysis, and Event Hub.

When pricing or agent monitoring isn't relevant for a resource, nothing will be shown in those columns of inventory.

![Some resources show blank info in agent monitoring or pricing columns](./media/asset-inventory/agent-pricing-blanks.png)



## Next steps

This article described the asset inventory page of Azure Security Center.

For more information on related tools, see the following pages:

- [Azure Resource Graph (ARG)](https://docs.microsoft.com/azure/governance/resource-graph/)

- [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/data-explorer/kusto/query/)