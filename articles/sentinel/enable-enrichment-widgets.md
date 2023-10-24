---
title: Enable enrichment widgets
description: This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 10/24/2023
---

# Enable enrichment widgets in Microsoft Sentinel 

This article shows you how to enable the enrichment widgets experience, allowing you to better visualize entity data and insights and make better, faster decisions.

Enrichment widgets are components that help you retrieve, visualize, and understand more information about entities. These widgets take data presentation to the next level by integrating external content, enhancing your ability to make informed decisions quickly.

Visualize data with enrichment widgets 

 

In this article: 

About Enrichment Widgets  

Widgets onboarding guide  

FAQ 

Next steps  

Top of Form 

 

 

In the fast-moving, high-pressure environment of your Security Operations Center, data visualization is a key capability for your SIEM to utilize to help you quickly and effectively find usable information within the vast sea of data that constantly confronts you. Microsoft Sentinel uses widgets to present you with its most relevant findings. 

Widgets in Sentinel are visible today in the IP Entity Page and for entities that appear in Incident pages. In those widgets you can get extra valuable information about the entities from internal 1st and external 3rd party sources. 

Widgets are already available in Microsoft Sentinel today. They currently appear for IP entities, both on their full entity pages and on their entity info panels that appear in Incident pages. 

What makes widgets essential in Microsoft Sentinel: 

Real-time Updates: In the ever-evolving landscape of cybersecurity, real-time data is paramount. Widgets provide live updates, ensuring analysts are always looking at the most recent data. 

Integration: Widgets are seamlessly integrated into Microsoft Sentinel data sources, drawing from their vast reservoir of logs, alerts, and intelligence. This means the visual insights are backed by the robust analytical power of Microsoft Sentinel. 

In essence, widgets are more than just visual aids. They are powerful analytical tools that, when used effectively, can greatly enhance the speed and efficiency of threat detection, investigation, and response. 

_________________________________________________________________________________ 

 

Enable enrichment widgets 

To enable the new widgets experience, take the following two steps: 

 Create a dedicated Key Vault to store the credentials for your widgets. 

Each widget requires certain credentials to access its data source. These credentials can be in the form of API keys, user name and password, or other secrets. These credentials are stored in a dedicated Azure Key Vault.  

 

You must have the Contributor role for the workspace’s resource group to deploy this Key Vault in your environment. 

 

To deploy the Key Vault and onboard the service: 

From the Microsoft Sentinel navigation menu, select Entity behavior.  

On the Entity behavior page, select Enrichment widgets (preview) from the toolbar.  

 

 

Add relevant credentials to your widgets Key Vault. 

Widgets require credentials to access their external data sources. Add credentials for each listed data source.  

Note: Not all widgets require special credentials.  

For each widgets source in the UI please take the following steps: 

Go to the Widgets onboarding page  

Deploy your widgets Key Vault as described in step 1. 

Move to step 2 to add the credentials to the relevant widgets’ sources. 

Click on the ‘Add credentials’ button for each widget as it seems in the sources table at the bottom of the page. 

A side panel will open on the right side of the page, please go over the Custom deployment wizard and fill the relevant fields (API key, Username & Password, other secrets). 

Click on the Review + create button.   

 

 

























As Microsoft Sentinel collects logs and alerts from all of its connected data sources, it analyzes them and builds baseline behavioral profiles of your organization’s entities (such as users, hosts, IP addresses, and applications) across time and peer group horizon. Using a variety of techniques and machine learning capabilities, Microsoft Sentinel can then identify anomalous activity and help you determine if an asset has been compromised. Learn more about [UEBA](identify-threats-with-entity-behavior-analytics.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

To enable or disable this feature (these prerequisites are not required to use the feature):

- Your user must be assigned the **Global Administrator** or **Security Administrator** roles in Microsoft Entra ID.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Microsoft Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md).

> [!NOTE]
> - No special license is required to add UEBA functionality to Microsoft Sentinel, and there's no additional cost for using it.
> - However, since UEBA generates new data and stores it in new tables that UEBA creates in your Log Analytics workspace, **additional data storage charges** will apply. 

## How to enable User and Entity Behavior Analytics

1. Go to the **Entity behavior configuration** page. There are three ways to get to this page:

    - Select **Entity behavior** from the Microsoft Sentinel navigation menu, then select **Entity behavior settings** from the top menu bar.

    - Select **Settings** from the Microsoft Sentinel navigation menu, select the **Settings** tab, then under the **Entity behavior analytics** expander, select **Set UEBA**.

    - From the Microsoft 365 Defender data connector page, select the **Go the UEBA configuration page** link.

1. On the **Entity behavior configuration** page, switch the toggle to **On**.

    :::image type="content" source="media/enable-entity-behavior-analytics/ueba-configuration.png" alt-text="Screenshot of UEBA configuration settings.":::

1. Mark the check boxes next to the Active Directory source types from which you want to synchronize user entities with Microsoft Sentinel.

    - **Active Directory** on-premises (Preview)
    - **Microsoft Entra ID**

    To sync user entities from on-premises Active Directory, your Azure tenant must be onboarded to Microsoft Defender for Identity (either standalone or as part of Microsoft 365 Defender) and you must have the MDI sensor installed on your Active Directory domain controller. See [Microsoft Defender for Identity prerequisites](/defender-for-identity/prerequisites) for more information.

1. Mark the check boxes next to the data sources on which you want to enable UEBA.

    > [!NOTE]
    >
    > Below the list of existing data sources, you will see a list of UEBA-supported data sources that you have not yet connected. 
    >
    > Once you have enabled UEBA, you will have the option, when connecting new data sources, to enable them for UEBA directly from the data connector pane if they are UEBA-capable.

1. Select **Apply**. If you accessed this page through the **Entity behavior** page, you will be returned there.

## Next steps

In this article, you learned how to enable and configure User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel. For more information about UEBA:

> [!div class="nextstepaction"]
>>[Configure data retention and archive](configure-data-retention-archive.md)
