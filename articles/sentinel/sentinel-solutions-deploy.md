---
title: Discover and deploy Microsoft Sentinel out-of-the-box content from Content hub
description: Learn how to find and deploy Sentinel packaged solutions containing data connectors, analytics rules, hunting queries, workbooks, and other content.
author: austinmccollum
ms.topic: how-to
ms.date: 09/29/2023
ms.author: austinmc
---

# Discover and manage Microsoft Sentinel out-of-the-box content

The Microsoft Sentinel Content hub is your centralized location to discover and manage out-of-the-box (built-in) content. There you'll find packaged solutions for end-to-end products by domain or industry. You'll also have access to the vast number of standalone contributions hosted in our GitHub repository and feature blades.

- Discover solutions and standalone content with a consistent set of filtering capabilities based on status, content type, support, provider and category.

- Install content in your workspace all at once or individually. 

- View content in list view and quickly see which solutions have updates. Update solutions all at once while standalone content updates automatically.

- Manage a solution to install its content types and get the latest changes.

- Configure standalone content to create new active items based on the most up-to-date template.

If you're a partner who wants to create your own solution, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solution authoring and publishing.

## Prerequisites

In order to install, update and delete standalone content or solutions in content hub, you need the **Microsoft Sentinel Contributor** role at the resource group level. In addition, the **Template Spec Contributor** role is still required for some edge cases. See [Azure RBAC built in roles](../role-based-access-control/built-in-roles.md#template-spec-contributor) for details on this role. 

This is in addition to Sentinel specific roles. For more information about other roles and permissions supported for Microsoft Sentinel, see [Permissions in Microsoft Sentinel](roles.md).
  

## Discover content

The content hub offers the best way to find new content or manage the solutions you already have installed.

1. From the Microsoft Sentinel navigation menu, under **Content management**, select **Content hub**.

1. The **Content hub** page displays a searchable grid or list of solutions and standalone content.

    Filter the list displayed, either by selecting specific values from the filters, or entering any part of a content name or description in the **Search** field.

    For more information, see [Categories for Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions.md#categories-for-microsoft-sentinel-out-of-the-box-content-and-solutions).

    > [!TIP]
    > If a solution that you've deployed has updates since you deployed it, the list view will have a blue up arrow in the status column, and will be included in the **Updates** blue up arrow count at the top of the page.
    >

Each content item shows categories that apply to it, and solutions show the types of content included.

For example, in the following image, the **Cisco Umbrella** solution lists one of its categories as **Security - Cloud Security**, and indicates it includes a data connector, analytics rules, hunting queries, playbooks, and more.

:::image type="content" source="./media/sentinel-solutions-deploy/solutions-list.png" alt-text="Screenshot of the Microsoft Sentinel content hub.":::


## Install or update content

Standalone content and solutions can be installed individually or all together in bulk. For more information on bulk operations, see [Bulk install and update content](#bulk-install-and-update-content) in the next section. Here's an example showing the install of an individual solution.

1. In the content hub, to view more information about a solution switch to **Card view**. 

1. Then select **View details** to initiate steps for installation. 

1. On the solution details page, select **Create** or **Update** to start the solution wizard. On the **Basics** tab, enter the subscription, resource group, and workspace to deploy the solution. For example:

    :::image type="content" source="media/sentinel-solutions-deploy/wizard-basics.png" alt-text="Screenshot of a solution installation wizard, showing the Basics tab.":::

1. Select **Next** to cycle through the remaining tabs (corresponding to the components included in the solution), where you can learn about, and in some cases configure, each of the content components.

    > [!NOTE]
    > The tabs displayed for you correspond with the content offered by the solution. Different solutions may have different types of content, so you may not see all the same tabs in every solution.
    >
    > You may also be prompted to enter credentials to a third party service so that Microsoft Sentinel can authenticate to your systems. For example, with playbooks, you may want to take response actions as prescribed in your system.
    >

1. Finally, in the **Review + create** tab, wait for the `Validation Passed` message, then select **Create** or **Update** to deploy the solution. You can also select the **Download a template for automation** link to deploy the solution as code.

1. Each content type within the solution may require additional steps to configure. For more information, see [Enable content items in a solution](#enable-content-items-in-a-solution). 

## Bulk install and update content

Content hub supports a list view in addition to the default card view. Multiple solutions and standalone content can be selected with this view to install and update them all at once. Standalone content is kept up-to-date automatically. Any active or 
custom content created based on solutions or standalone content installed from content hub remains untouched.

1. To install and/or update items in bulk, change to the list view.

1. The list view is paginated, so choose a filter to ensure the content you want to bulk install are in view. Select their checkboxes and click the **Install/Update** button.
    :::image type="content" source="media/sentinel-solutions-deploy/bulk-install-update.png" alt-text="Screenshot of solutions list view with multiple solutions selected and in progress for installation." lightbox="media/sentinel-solutions-deploy/bulk-install-update.png":::

1. The content hub interface will indicate *in progress* for installs and updates. Azure notifications will also indicate the action taken. If a solution or standalone content that was already installed or updated was selected, no action will be taken on that item and it won't interfere with the update and install of the other items.

1. Check each installed solution's **Manage** view. Content types within the solution may require additional steps to configure. For more information, see [Enable content items in a solution](#enable-content-items-in-a-solution). 

## Enable content items in a solution

Centrally manage content items for installed solutions from the content hub.

1. In the content hub, select an installed solution where the version is 2.0.0 or higher.
1. On the solutions details page, select **Manage**.

    :::image type="content" source="media/sentinel-solutions-deploy/content-hub-manage-option.png" alt-text="Screenshot of manage button on details page of the Azure Activity content hub solution." lightbox="media/sentinel-solutions-deploy/content-hub-manage-option.png":::

1. Review the list of content items.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-azure-activity.png" alt-text="Screenshot of solution description and list of content items for Azure Activity solution." lightbox="media/sentinel-solutions-deploy/manage-solution-azure-activity.png":::

1. Select a content item to get started. 

### Management options for each content type
Below are some tips on how to interact with various content types when managing a solution. 

#### Data connector
1. Select **Open connector page**. 
1. Complete the data connector configuration steps. 

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-data-connector-open-connector.png" alt-text="Screenshot of data connector content item for Azure Activity solution where status is disconnected.":::

1. After you configure the data connector and logs are detected, the status will change to **Connected**.

#### Analytics rule 
1. View the template in the analytics template gallery. 
1. If the template hasn't been used yet, select **Open** > **Create rule** and follow the steps to enable the analytics rule. 
1. Once created, the number of active rules created from the template is shown in the **Created content** column. 
1. Click the active rules link, in this example **2 items**, to edit the existing rule.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-analytics-rule.png" alt-text="Screenshot of analytics rule content item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-analytics-rule.png"::: 

#### Hunting query
1. To start searching right away, select **Run query** from the details page for quick results. 

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-hunting-query.png" alt-text="Screenshot of cloned hunting query content item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-hunting-query.png":::

1. To customize your hunting query, select the link, in this case **Common deployed resources**, in the **Content name** column.
1. This brings you to the hunting gallery where you can create a clone of the read-only hunting query template by accessing the ellipses menu. Hunting queries created in this way will display as items in the content hub **Created content** column.

#### Workbook
1. Select **View template** to open the workbook and see the visualizations. 
1. To create an instance of the workbook template select **Save**. 
1. View your saved customizable workbook by selecting **View saved workbook**.
1. From the content hub, select the **1 item** link in the **Created content** column to manage the workbook.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-workbook.png" alt-text="Screenshot of saved workbook item in solution for Azure Activity." lightbox="media/sentinel-solutions-deploy/manage-solution-workbook.png" :::

#### Parser 
When a solution is installed, any parsers included are added as workspace functions in Log Analytics.
1. Select **Load the function code** to open Log Analytics and view or run the function code. 
1. Select **Use in editor** to open Log Analytics with the parser name ready to add to your custom query.

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-parser.png" alt-text="Screenshot of parser content type in a solution." lightbox="media/sentinel-solutions-deploy/manage-solution-parser.png":::

#### Playbook
1. Select the **Content name** link of the playbook, in this example **BatchImportToSentinel**.
1. This playbook template will populate the search field. From the results choose the template and select **Create playbook**.
1. Once created, the active playbook is shown in the **Created content** column.
1. Click the active playbook **1 item** link to manage the playbook. 

    :::image type="content" source="media/sentinel-solutions-deploy/manage-solution-playbook.png" alt-text="Screenshot of playbook type content type in a solution." lightbox="media/sentinel-solutions-deploy/manage-solution-playbook.png":::


## Find the support model for your content

Each solution and standalone content item explains its support model on its details pane, in the **Support** box, where either **Microsoft** or a partner's name is listed. For example:

:::image type="content" source="media/sentinel-solutions-deploy/find-support-details.png" alt-text="Screenshot of where you can find your support model for your solution." lightbox="media/sentinel-solutions-deploy/find-support-details.png":::

When contacting support, you may need other details about your solution, such as a publisher, provider, and plan ID values. You can find each of these on the details page, on the **Usage information & support** tab. For example:

:::image type="content" source="media/sentinel-solutions-deploy/usage-support.png" alt-text="Screenshot of usage and support details for a solution.":::

## Next steps

In this document, you learned how to find and deploy built-in solutions and standalone content for Microsoft Sentinel.

- Learn more about [Microsoft Sentinel solutions](sentinel-solutions.md).
- See the full Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel).
- Find domain specific solutions in the [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md).
- [Delete installed Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-delete.md)

Many solutions include data connectors that you'll need to configure so that you can start ingesting your data into Microsoft Sentinel. Each data connector will have its own set of requirements, detailed on the data connector page in Microsoft Sentinel. 

For more information, see [Connect your data source](data-connectors-reference.md).