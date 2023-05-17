---
title: Using and managing discovery
description: Using and managing discovery - Microsoft Defender External Attack Surface Management (Defender EASM) relies on our proprietary discovery technology to continuously define your organization’s unique Internet-exposed attack surface. 
author: danielledennis
ms.author: dandennis
ms.service: defender-easm
ms.date: 07/14/2022
ms.topic: how-to
---

# Using and managing discovery

## Overview

Microsoft Defender External Attack Surface Management (Defender EASM) relies on our proprietary discovery technology to continuously define your organization’s unique Internet-exposed attack surface. Discovery scans the internet for assets owned by your organization to uncover previously unknown and unmonitored properties. Discovered assets are indexed in a customer’s inventory, providing a dynamic system of record of web applications, third party dependencies, and web infrastructure under the organization’s management through a single pane of glass.

Before you run a custom discovery, see the [What is discovery?](what-is-discovery.md) article to understand key concepts mentioned in this article.

## Accessing your automated attack surface

Microsoft has pre-emptively configured the attack surfaces of many organizations, mapping their initial attack surface by discovering infrastructure that’s connected to known assets. It's recommended that all users search for their organization’s attack surface before creating a custom attack surface and running other discoveries. This process enables users to quickly access their inventory as Defender EASM refreshes the data, adding additional assets and recent context to your Attack Surface.

When first accessing your Defender EASM instance, select “Getting Started” in the “General” section to search for your organization in the list of automated attack surfaces. Then select your organization from the list and click “Build my Attack Surface”.

:::image type="content" source="media/Discovery_1.png" alt-text="Screenshot of preconfigured attack surface selection screen."::: 

At this point, the discovery runs in the background. If you selected a preconfigured Attack Surface from the list of available organizations, you will be redirected to the Dashboard Overview screen where you can view insights into your organization’s infrastructure in Preview Mode. Review these dashboard insights to become familiar with your Attack Surface as you wait for more assets to be discovered and populated in your inventory. See the [Understanding dashboards](understanding-dashboards.md) article for more information on how to derive insights from these dashboards.

If you notice any missing assets or have other entities to manage that may not be discovered through infrastructure that is clearly linked to your organization, elect to run customized discoveries to detect these outlier assets.

## Customizing discovery

Custom discoveries are ideal for organizations that require deeper visibility into infrastructure that may not be immediately linked to their primary seed assets. By submitting a larger list of known assets to operate as discovery seeds, the discovery engine returns a wider pool of assets. Custom discovery can also help organizations find disparate infrastructure that may relate to independent business units and acquired companies.

### Discovery groups

Custom discoveries are organized into Discovery Groups. They are independent seed clusters that comprise a single discovery run and operate on their own recurrence schedules. Users can elect to organize their Discovery Groups to delineate assets in whatever way best benefits their company and workflows. Common options include organizing by responsible team/business unit, brands or subsidiaries.

### Creating a discovery group

1. Select the **Discovery** panel under the **Manage** section in the left-hand navigation column.

     :::image type="content" source="media/Discovery_2.png" alt-text="Screenshot of EASM instance from overview page with manage section highlighted.":::

2. This Discovery page shows your list of Discovery Groups by default. This list will be empty when you first access the platform. To run your first discovery, click **Add Discovery Group**.

     :::image type="content" source="media/Discovery_3.png" alt-text="Screenshot of Discovery screen with “add disco group” highlighted.":::

3. First, name your new discovery group and add a description. The **Recurring Frequency** field allows you to schedule discovery runs for this group, scanning for new assets related to the designated seeds on a continuous basis. The default recurrence selection is **Weekly**; Microsoft recommends this cadence to ensure that your organization’s assets are routinely monitored and updated. For a single, one-time discovery run, select **Never**. However, we recommend that users keep the **Weekly** default cadence and instead turn off historical monitoring within their Discovery Group settings if they later decide to discontinue recurrent discovery runs.

    Select **Next: Seeds >**

    :::image type="content" source="media/Discovery_4.png" alt-text="Screenshot of first page of disco group setup.":::

4. Next, select the seeds that you’d like to use for this Discovery Group. Seeds are known assets that belong to your organization; the Defender EASM platform scans these entities, mapping their connections to other online infrastructure to create your Attack Surface.

    :::image type="content" source="media/Discovery_5.png" alt-text="Screenshot of seed selection page of disco group setup."::: 

    The **Quick Start** option lets you search for your organization in a list of pre-populated Attack Surfaces. You can quickly create a Discovery Group based on the known assets belonging to your organization.

    :::image type="content" source="media/Discovery_6.png" alt-text="Screenshot of pre-baked attack surface selection page, then output in seed list."::: 
    
    :::image type="content" source="media/Discovery_7.png" alt-text="Screenshot of pre-baked attack surface selection page.":::

    Alternatively, users can manually input their seeds. Defender EASM accepts organization names, domains, IP blocks, hosts, email contacts, ASNs, and WhoIs organizations as seed values. You can also specify entities to exclude from asset discovery to ensure they aren't added to your inventory if detected. For example, exclusions are useful for organizations that have subsidiaries that will likely be connected to their central infrastructure, but do not belong to your organization.

    Once your seeds have been selected, select **Review + Create**.

5. Review your group information and seed list, then select **Create & Run**.

    :::image type="content" source="media/Discovery_8.png" alt-text="Screenshot of review + create screen."::: 

    You'll then be taken back to the main Discovery page that displays your Discovery Groups. Once your discovery run is complete, you'll see new assets added to your Approved Inventory.

### Viewing and editing discovery groups

Users can manage their discovery groups from the main “Discovery” page. The default view displays a list of all your discovery groups and some key data about each one. From the list view, you can see the number of seeds, recurrence schedule, last run date and created date for each group.

:::image type="content" source="media/Discovery_9.png" alt-text="Screenshot of discovery groups screen."::: 

Click on any discovery group to view more information, edit the group, or immediately kickstart a new discovery process.

### Run history

The discovery group details page contains the run history for the group. Once expanded, this section displays key information about each discovery run that has been performed on the specific group of seeds. The Status column indicates whether the run is “In Progress”, “Complete,” or “Failed”. This section also includes “started” and “completed” timestamps and counts of the total number of assets versus new assets discovered.

Run history is organized by the seed assets scanned during the discovery run. To see a list of the applicable seeds, click “Details”. This action opens a right-hand pane that lists all the seeds and exclusions by kind and name.

:::image type="content" source="media/Discovery_10.png" alt-text="Screenshot of run history for disco group screen."::: 

### Viewing seeds and exclusions

The Discovery page defaults to a list view of Discovery Groups, but users can also view lists of all seeds and excluded entities from this page. Simply click either tab to view a list of all the seeds or exclusions that power your discovery groups.

### Seeds

The seed list view displays seed values with three columns: type, source name, and discovery group. The “type" field displays the category of the seed asset; the most common seeds are domains, hosts and IP blocks, but you can also use email contacts, ASNs, certificate common names or WhoIs organizations. The source name is simply the value that was inputted in the appropriate type box when creating the discovery group. The final column shows a list of discovery groups that use the seed; each value is clickable, taking you to the details page for that discovery group.

:::image type="content" source="media/Discovery_11.png" alt-text="Screenshot of seeds view of discovery page."::: 

### Exclusions

Similarly, you can click the “Exclusions” tab to see a list of entities that have been excluded from the discovery group. This means that these assets will not be used as discovery seeds or added to your inventory. It's important to note that exclusions only impact future discovery runs for an individual discovery group. The “type" field displays the category of the excluded entity. The source name is the value that was inputted in the appropriate type box when creating the discovery group. The final column shows a list of discovery groups where this exclusion is present; each value is clickable, taking you to the details page for that discovery group.

## Next steps

- [Discovering your attack surface](discovering-your-attack-surface.md)
- [Understanding asset details](understanding-asset-details.md)
- [Understanding dashboards](understanding-dashboards.md)
