---
title: Discover and deploy Microsoft Sentinel out-of-the-box content from Content hub
description: Learn how to find and deploy Sentinel packaged solutions containing data connectors, analytics rules, hunting queries, workbooks, and other content.
author: cwatson-cat
ms.topic: how-to
ms.date: 01/14/2025
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal.


#Customer intent: As a security operations administrator, I want to discover, install, and centrally manage out-of-the-box content so that I can efficiently enhance and maintain my security monitoring capabilities.

---

# Discover and manage Microsoft Sentinel out-of-the-box content

The Microsoft Sentinel Content hub is your centralized location to discover and manage out-of-the-box (built-in) content. There you find packaged solutions for end-to-end products by domain or industry. You have access to the vast number of standalone contributions hosted in our GitHub repository and feature blades.

- Discover solutions and standalone content with a consistent set of filtering capabilities based on status, content type, support, provider, and category.

- Install content in your workspace all at once or individually. 

- View content in list view and quickly see which solutions have updates. Update solutions all at once while standalone content updates automatically.

- Manage a solution to install its content types and get the latest changes.

- Configure standalone content to create new active items based on the most up-to-date template.

If you're a partner who wants to create your own solution, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solution authoring and publishing.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

In order to install, update, and delete standalone content or solutions in content hub, you need the **Microsoft Sentinel Contributor** role at the resource group level.

For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).
  

## Discover content

The content hub offers the best way to find new content or manage the solutions you already installed.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**.<br> For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

    The **Content hub** page displays a searchable grid or a list of solutions and standalone content.

1. Search for the solutions or standalone content items that you need. Either select specific values from the filters, or enter a search term into the **Search** box. Searches use AI to support fuzzy searches and approximate vocabulary.

    When searching, make sure to press **ENTER** to start the search. The number of search results is limited to 50 items, including both solutions and content items found within solutions. If you don't find what you're looking for, try refining the search expression or use different filters.

    For more information, see [Categories for Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions.md#categories-for-microsoft-sentinel-out-of-the-box-content-and-solutions).

1. In the list view (:::image type="icon" source="media/sentinel-solutions-deploy/list-view.png" border="false":::), select a solution from the list to view information about the solution as well as the types of content items it includes.

    Expand a solution in the search or filter results to view the list of content items it includes. The information pane on the side presents detailed information about the content item.

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="./media/sentinel-solutions-deploy/solutions-list.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Azure portal.":::

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="./media/sentinel-solutions-deploy/solutions-list-defender.png" alt-text="Screenshot of the Microsoft Sentinel content hub in the Defender portal.":::

    ----

    Alternately, select the card view (:::image type="icon" source="media/sentinel-solutions-deploy/card-view.png" border="false":::) to view solutions presented in a grid. Each card shows the solution name, description, and categories. Select a card to view more information about the solution on the side.

To use a content item that's part of a solution, you must install the entire solution. If you've selected a specific content item in the list view, select **Install solution** in the details pane on the side to install the relevant solution.

For more information, see [Categories for Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions.md#categories-for-microsoft-sentinel-out-of-the-box-content-and-solutions).


## Install or update content

Install standalone content and solutions individually or all together in bulk. For more information on bulk operations, see [Bulk install and update content](#bulk-install-and-update-content) in the next section. 

If a solution that you deployed has updates since you last deployed it, the list view shows **Update** in the status column. The solution is also included in the **Updates** count at the top of the page.

Here's an example showing the install of an individual solution.

1. In the **Content hub**, search for and select the solution.

1. On the solutions details pane, from the bottom right-hand side, select **View details**.

1. Select **Create** or **Update**.
1. On the **Basics** tab, enter the subscription, resource group, and workspace to deploy the solution. For example:

    :::image type="content" source="media/sentinel-solutions-deploy/wizard-basics.png" alt-text="Screenshot of a solution installation wizard, showing the Basics tab.":::

1. Select **Next** to go through the remaining tabs to learn about, and in some cases configure, each of the content components.

    The tabs correspond with the content offered by the solution. Different solutions might have different types of content, so you might not see the same tabs in every solution.

    You might also be prompted to enter credentials to a non-Microsoft service so that Microsoft Sentinel can authenticate to your systems. For example, with playbooks, you might want to take response actions as prescribed in your system.

1. In the **Review + create** tab, wait for the `Validation Passed` message.
1. Select **Create** or **Update** to deploy the solution. You can also select the **Download a template for automation** link to deploy the solution as code.

### Install with dependencies

Some solutions have dependencies to install, including many [domain solutions](sentinel-solutions-catalog.md#domain-solutions) and solutions that use the unified AMA connectors for [CEF, Syslog](cef-syslog-ama-overview.md), or [custom logs](connect-custom-logs-ama.md). 

In such cases, select **Install with dependencies** to ensure that the required data connectors are also installed. From there, select one or more of the dependencies to install them along with the original solution. The original solution you chose to install is always selected by default. 

If one or more of the dependency solutions is already installed, but has updates, use the **Install/Update** button to both install and update all selected solutions in bulk. For example:

:::image type="content" source="media/sentinel-solutions-deploy/install-update-dependencies.png" alt-text="Screenshot of installing multiple solution dependencies in bulk." lightbox="media/sentinel-solutions-deploy/install-update-dependencies.png":::

After you install a solution, each content type within the solution might require more steps to configure. For more information, see [Enable content items in a solution](#enable-content-items-in-a-solution). 

## Bulk install and update content

Content hub supports a list view in addition to the default card view. Select the list view to install multiple solutions and standalone content all at once. Standalone content is kept up-to-date automatically. Any active or custom content created based on solutions or standalone content installed from content hub remains untouched.

1. To install or update items in bulk, change to the list view.
1. Search for or filter to find the content that you want to install or update in bulk.
1. Select the checkbox for each solution or standalone content that you want to install or update.
1. Select the **Install/Update** button.
    :::image type="content" source="media/sentinel-solutions-deploy/bulk-install-update.png" alt-text="Screenshot of solutions list view with multiple solutions selected and in progress for installation." lightbox="media/sentinel-solutions-deploy/bulk-install-update.png":::

   If a solution or standalone content you selected was already installed or updated, no action is taken on that item. It doesn't interfere with the update and install of the other items.

1. Select **Manage** for each solution you installed. Content types within the solution might require more information for you to configure. For more information, see [Enable content items in a solution](#enable-content-items-in-a-solution). 



## Enable content items in a solution

Centrally manage content items for installed solutions from the content hub.

1. In the content hub, select an installed solution where the version is 2.0.0 or higher.
1. On the solutions details page, select **Manage**.

    :::image type="content" source="media/sentinel-solutions-deploy/content-hub-manage-option.png" alt-text="Screenshot of manage button on details page of the Azure Activity content hub solution." lightbox="media/sentinel-solutions-deploy/content-hub-manage-option.png":::

1. Review the list of content items.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-azure-activity.png" alt-text="Screenshot of solution description and list of content items for Azure Activity solution." lightbox="media/sentinel-solutions-deploy/manage-solution-azure-activity.png":::

1. Select a content item to get started. 

### Manage each content type

The following sections provide some tips on how to work with the different content types as you manage a solution.

#### Data connector

To connect a data connector, complete the configuration steps.
1. Select **Open connector page**. 
1. Complete the data connector configuration steps. 

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-data-connector-open-connector.png" alt-text="Screenshot of data connector content item for Azure Activity solution where status is disconnected.":::

   After you configure the data connector and logs are detected, the status changes to **Connected**.

#### Analytics rule 

Create a rule from a template or edit an existing rule.

1. View the template in the analytics template gallery.
1. If the template isn't used yet, select **Open** > **Create rule** and follow the steps to enable the analytics rule.

   After you create a rule, the number of active rules created from the template is shown in the **Created content** column.
1. Select the active rules link to edit the existing rule. For example, the active rule link in the following image is under **Content created** and shows **2 items**.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-analytics-rule.png" alt-text="Screenshot of analytics rule content item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-analytics-rule.png":::

#### Hunting query

Run the provided hunting query or customize it.

1. To start searching right away, select **Run query** from the details page for quick results.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-hunting-query.png" alt-text="Screenshot of cloned hunting query content item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-hunting-query.png":::

1. To customize your hunting query, select the link in the **Content name** column.

   From the hunting gallery, you can create a clone of the read-only hunting query template by going to the ellipses menu. Hunting queries created in this way display as items in the content hub **Created content** column.

#### Workbook

To customize a workbook created from a template, create an instance of a workbook.

1. Select **View template** to open the workbook and see the visualizations.
1. Select **Save** to create an instance of the workbook template.
1. View your saved customizable workbook by selecting **View saved workbook**.
1. From the content hub, select the **1 item** link in the **Created content** column to manage the workbook.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-workbook.png" alt-text="Screenshot of saved workbook item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-workbook.png" :::

#### Parser

When a solution is installed, any parsers included are added as workspace functions in Log Analytics.

1. Select **Load the function code** to open Log Analytics and view or run the function code.
1. Select **Use in editor** to open Log Analytics with the parser name ready to add to your custom query.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-parser.png" alt-text="Screenshot of parser content type in a solution." lightbox="media/sentinel-solutions-deploy/manage-solution-parser.png":::

#### Playbook

Create a playbook from a template.

1. Select the **Content name** link of the playbook.
1. Choose the template and select **Create playbook**.
1. After the playbook is created, the active playbook is shown in the **Created content** column.
1. Select the active playbook **1 item** link to manage the playbook.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-playbook.png" alt-text="Screenshot of playbook type content type in a solution." lightbox="media/sentinel-solutions-deploy/manage-solution-playbook.png":::

## Find the support model for your content

Each solution and standalone content item explains its support model on its details pane, in the **Support** box, where either **Microsoft** or a partner's name is listed. For example:

:::image type="content" source="media/sentinel-solutions-deploy/find-support-details.png" alt-text="Screenshot of where you can find your support model for your solution." lightbox="media/sentinel-solutions-deploy/find-support-details.png":::

When contacting support, you might need other details about your solution, such as a publisher, provider, and plan ID values. Find this information on the details page in the **Usage information & support** tab.

:::image type="content" source="media/sentinel-solutions-deploy/usage-support.png" alt-text="Screenshot of usage and support details for a solution.":::

## Next steps

In this document, you learned how to find and deploy built-in solutions and standalone content for Microsoft Sentinel.

- Learn more about [Microsoft Sentinel solutions](sentinel-solutions.md).
- See the full Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel).
- Find domain specific solutions in the [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md).
- [Delete installed Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-delete.md).

Many solutions include data connectors that you need to configure so that you can start ingesting your data into Microsoft Sentinel. Each data connector has its own set of requirements that are detailed on the data connector page in Microsoft Sentinel. 

For more information, see [Connect your data source](data-connectors-reference.md).

