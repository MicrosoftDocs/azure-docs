---
title: Visualize data with enrichment widgets
description: This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 10/24/2023
---

# Visualize data with enrichment widgets in Microsoft Sentinel 

This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.

Enrichment widgets are components that help you retrieve, visualize, and understand more information about entities. These widgets take data presentation to the next level by integrating external content, enhancing your ability to make informed decisions quickly.

> [!IMPORTANT]
>
> Enrichment widgets are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

Learn more about enrichment widgets (link to entity pages doc?)
 
## Enable enrichment widgets 

Widgets require using credentials to access and maintain connections to their data sources. These credentials can be in the form of API keys, username/password, or other secrets, and they are stored in a dedicated Azure Key Vault that you create for this purpose.

You must have the **Contributor** role for the workspace’s resource group to create this Key Vault in your environment. 

Microsoft Sentinel has automated the process of creating a Key Vault for enrichment widgets. To enable the widgets experience, take the following two steps: 

1. **Create a dedicated Key Vault to store credentials.**

    1. From the Microsoft Sentinel navigation menu, select **Entity behavior**.
    1. On the **Entity behavior** page, select **Enrichment widgets (preview)** from the toolbar.
        :::image type="content" source="media/enable-enrichment-widgets/entity-behavior-page.png" alt-text="Screenshot of the entity behavior page.":::
    1. On the **Widgets Onboarding Page**, select **Create Key Vault**.
        :::image type="content" source="media/enable-enrichment-widgets/widgets-onboarding-page.png" alt-text="Screenshot of widget onboarding page.":::
        You will see an Azure portal notification when the Key Vault deployment is in progress, and again when it has completed.

1. **Add relevant credentials to your widgets' Key Vault.**

    The data sources accessed by all the available widgets are listed on the **Widgets Onboarding Page**. You need to add their credentials individually. To do so, take the following steps for each data source:

    1. Select the **Find your credentials** link for a given data source. This will redirect you to specific instructions for finding or creating credentials for that data source. When you have the credentials, copy them aside and proceed to the next step.
    1. Select **Add credentials** for that data source. The **Custom deployment** wizard will open in a side panel on the right side of the page.  
    The **Subscription**, **Resource group**, **Region**, and **Key Vault name** fields are all pre-populated, and there should be no reason for you to edit them.
    1. Enter the credentials you saved into the relevant fields in the **Custom deployment** wizard (**API key**, **Username**, **Password**, and so on).
    1. Select **Review + create**.   

## Next steps

In this article, you learned how to enable widgets for data visualization on entity pages. For more information about entity pages and other places where entity information appears:

- [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md)
- [Understand Microsoft Sentinel's incident investigation and case management capabilities](incident-investigation.md)
