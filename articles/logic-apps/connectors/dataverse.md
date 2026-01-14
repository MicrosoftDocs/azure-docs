---
title: Connect workflows to Microsoft Dataverse
description: Learn to access Dataverse databases from workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/20/2025
ms.custom: engagement-fy23
---

# Connect to Microsoft Dataverse from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../../includes/logic-apps-sku-consumption-standard.md)]

To automate tasks that work with your [Microsoft Dataverse database](/power-apps/maker/data-platform/data-platform-intro), you can use the [Microsoft Dataverse connector](/connectors/commondataserviceforapps/) with workflows in [Azure Logic Apps](../logic-apps-overview.md).

For example, you can build workflows that create rows, update rows, and perform other operations. You can also get information from your Dataverse database and make the output available for other actions to use in your workflows. For example, when a row is added, updated, or deleted in your Dataverse database, you can send an email by using the Office 365 Outlook connector.

The Dataverse connector was previously known as the Common Data Service 2.0 connector and originally known as the Dynamics 365 connector. You can use the Dataverse connector to access Microsoft Dataverse for Microsoft Dynamics 365 Sales, Microsoft Dynamics 365 Customer Service, Microsoft Dynamics 365 Field Service, Microsoft Dynamics 365 Customer Insights - Journeys, and Microsoft Dynamics 365 Project Service Automation.

This article shows how to add a Dataverse trigger or action to your workflow and how parameter options work.

> [!IMPORTANT]
>
> Since October 2023, new workflows must use the current Dataverse connector operations. 
> Legacy Dataverse connector operations are no longer available for use in new workflows.
>
> To support backward compatibility, legacy Dataverse connector operations had one year 
> from the deprecation announcement date to continue working in existing workflows. 
> Although no specific shutdown date exists, make sure that you promptly update existing 
> workflows to use the current connector operations. For more information, see 
> [Microsoft Dataverse (legacy) connector for Azure Logic Apps will be deprecated and replaced with another connector](/power-platform/important-changes-coming#microsoft-dataverse-legacy-connector-for-azure-logic-apps-will-be-deprecated-and-replaced-with-another-connector).

## Connector reference

For technical information based on the connector's Swagger description, such as operations, limits, and other details, see the [managed connector reference page](/connectors/commondataserviceforapps/).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* A [Dataverse Data Service environment and database](/power-platform/admin/environments-overview), which is where your organization stores, manages, and shares business data in a Dataverse database. For more information, see the following resources:

  * [Learn: Create and manage Dataverse environments](/training/modules/create-manage-environments/)

  * [Power Platform - Environments overview](/power-platform/admin/environments-overview)

* Basic knowledge about Azure Logic Apps along with the Consumption or Standard logic app resource and workflow from where you want to access your Dataverse database. To use a Dataverse trigger, you need a blank workflow. To use a Dataverse action, you need a workflow that starts with any trigger appropriate for your scenario.

  For more information, see the following resources:

  * [Create an example Consumption logic app workflow](../quickstart-create-example-consumption-workflow.md)

  * [Create an example Standard logic app workflow](../create-single-tenant-workflows-azure-portal.md)

## Add a Dataverse trigger

Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the resource sidebar, under **Development Tools**, select the designer to open the workflow.

1. On the designer, follow the [general steps to add the **Microsoft Dataverse** trigger for your scenario](../add-trigger-action-workflow.md?tabs=consumption#add-trigger) to your workflow.

   This example continues with the trigger named [**When a row is added, modified or deleted**](/connectors/commondataserviceforapps/#when-a-row-is-added,-modified-or-deleted).

1. At the prompt, sign in to your Dataverse environment or database.

1. In the trigger information box, provide the necessary trigger values.

   The following example shows the sample trigger:

   :::image type="content" source="media/dataverse/dataverse-trigger-example.png" alt-text="Screenshot shows Consumption workflow designer and example trigger." lightbox="media/dataverse/dataverse-trigger-example.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

1. Now add at least one action for your workflow to perform when the trigger fires.

   For example, you can add a Dataverse action or an action that sends email based on the outputs from the trigger.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**, and then select your workflow.

1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow the [general steps to add the **Microsoft Dataverse** trigger for your scenario](../add-trigger-action-workflow.md?tabs=standard#add-trigger) to your workflow.

   This example continues with the trigger named [**When a row is added, modified or deleted**](/connectors/commondataserviceforapps/#when-a-row-is-added,-modified-or-deleted).

1. At the prompt, sign in to your Dataverse environment or database.

1. In the trigger information box, provide the necessary trigger values.

   The following example shows the sample trigger:

   :::image type="content" source="media/dataverse/dataverse-trigger-example.png" alt-text="Screenshot shows Standard workflow designer and example trigger." lightbox="media/dataverse/dataverse-trigger-example.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

1. Now add at least one action for your workflow to perform when the trigger fires. For example, you can add a Dataverse action or an action that sends email based on the outputs from the trigger.

---

## Add a Dataverse action

Based on whether you have a Consumption or Standard logic app workflow, follow the corresponding steps:

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app resource.

1. On the resource sidebar, under **Development Tools**, select the designer to open the workflow.

1. On the designer, follow these [general steps to add the **Microsoft Dataverse** action for your scenario](../add-trigger-action-workflow.md?tabs=consumption#add-action) to your workflow.

   This example continues with the action named [**Add a new row**](/connectors/commondataserviceforapps/#add-a-new-row).

1. At the prompt, sign in to your Dataverse environment or database.

1. In the action information box, provide the necessary action values.

   The following example shows the sample action:

   :::image type="content" source="media/dataverse/dataverse-action-example.png" alt-text="Screenshot shows Consumption workflow designer and example action." lightbox="media/dataverse/dataverse-action-example.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

1. Continue adding more actions, if you want.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**, and then select your workflow.

1. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow these [general steps to add the **Microsoft Dataverse** action for your scenario](../create-workflow-with-trigger-or-action.md?tabs=standard#add-action) to your workflow.

   This example continues with the action named [**Add a new row**](/connectors/commondataserviceforapps/#add-a-new-row).

   :::image type="content" source="media/dataverse/dataverse-action-example.png" alt-text="Screenshot shows Standard workflow designer and example action." lightbox="media/dataverse/dataverse-action-example.png":::

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

1. Continue adding more actions, if you want.

---

## Test your workflow

To run your workflow, follow these steps:

1. On the designer toolbar, select **Run** > **Run**.

1. Reproduce the conditions that the trigger requires for your workflow to run.

## Return rows based on a filter

For actions that return rows, such as the **List rows** action, you can use an ODATA query that returns rows based on the specified filter. For example, you can set up the action to return only rows for active accounts.

1. On the designer, in the action, open the **Advanced parameters** list, and select the **Filter rows** parameter.

   :::image type="content" source="media/dataverse/dataverse-action-filter-rows.png" alt-text="Screenshot shows workflow and parameter named Filter rows." lightbox="media/dataverse/dataverse-action-filter-rows.png":::

1. In the **Filter rows** parameter that now appears in the action, enter an ODATA query expression, for example:

   `statuscode eq 1`

   :::image type="content" source="media/dataverse/dataverse-action-filter-rows-query.png" alt-text="Screenshot shows Standard workflow and parameter named Filter rows with ODATA query." lightbox="media/dataverse/dataverse-action-filter-rows-query.png":::

For more information, see the following documentation:

- [List rows](/connectors/commondataserviceforapps/#list-rows)
- [`$filter` system query options](/power-apps/developer/data-platform/webapi/query-data-web-api#filter-results)

## Return rows based on a sort order

For actions that return rows, such as the **List rows** action, you can use an ODATA query that returns rows in a specific sequence, which varies based on the rows that the action returns. For example, you can set up the action to return rows organized by the account name.

1. On the designer, in the action, open the **Advanced parameters** list, and select the **Sort By** parameter.

   :::image type="content" source="media/dataverse/dataverse-action-sort-by.png" alt-text="Screenshot shows workflow, a Dataverse action, and Sort By parameter." lightbox="media/dataverse/dataverse-action-sort-by.png":::

1. In the **Sort By** parameter that now appears in the action, enter the column name to use for sorting, for example, **name**:

   :::image type="content" source="media/dataverse/dataverse-action-sort-by-column.png" alt-text="Screenshot shows workflow, a Dataverse action, and Sort By parameter with column name." lightbox="media/dataverse/dataverse-action-sort-by-column.png":::

For more information, see the following documentation:

- [List rows](/connectors/commondataserviceforapps/#list-rows)
- [`$orderby` system query options](/power-apps/developer/data-platform/webapi/query-data-web-api#sort-by)

## Field data types

In a trigger or action, a field value's data type must match the field's required data type. This requirement applies whether you manually enter the value or select the value from the dynamic content list.

For example, suppose that you have a table named **Tasks**. This table has fields that apply only to that table, while other tables have their own fields. For the example **Tasks** table, the following table describes some sample field types and the data types that those fields require for their values.

| Field | Data type | Description |
|-------|-----------|-------------|
| Text field | Single line of text | Requires either a single line of text or dynamic content that has the text data type, for example, these properties: <br><br>- **Description** <br>- **Category** |
| Integer field | Whole number | Requires either an integer or dynamic content that has the integer data type, for example, these properties: <br><br>- **Percent Complete** <br>- **Duration** |
| Date field | Date and Time | Requires either a date in MM/DD/YYY format or dynamic content that has the date data type, for example, these properties: <br><br>- **Created On** <br>- **Start Date** <br>- **Actual Start** <br>- **Actual End** <br>- **Due Date** |
| Field that references another entity row | Primary key | Requires both a row ID, such as a GUID, and a lookup type, which means that values from the dynamic content list won't work, for example, these properties: <br><br>- **Owner**: Must be a valid user ID or a team row ID. <br>- **Owner Type**: Must be a lookup type such as `systemusers` or `teams`, respectively. <br><br>- **Regarding**: Must be a valid row ID such as an account ID or a contact row ID. <br>- **Regarding Type**: Must be a lookup type such as `accounts` or `contacts`, respectively. <br><br>- **Customer**: Must be a valid row ID such as an account ID or contact row ID. <br>- **Customer Type**: Must be the lookup type, such as `accounts` or `contacts`, respectively. |

For the example **Tasks** table, suppose you use the **Add a new row** action to create a new row that's associated with other entity rows, specifically a user row and an account row. So, in this action, you must specify the IDs and lookup types for those entity rows by using values that match the expected data types for the relevant properties.

* Based on the **Owner** property, which specifies a user ID, and the **Owner Type** property, which specifies the `systemusers` lookup type, the action associates the new row with a specific user.

* Based on the **Regarding** property, which specifies a row ID, and the **Regarding Type** property, which specifies the `accounts` lookup type, the action associates the new row with a specific account.

The resulting action looks like the following example:

:::image type="content" source="media/dataverse/add-new-row-task-properties.png" alt-text="Screenshot shows workflow code view, Add a new row action, and new tasks row associated with IDs and lookup types." lightbox="media/dataverse/add-new-row-task-properties.png":::

## Troubleshooting problems

### Calls from multiple environments

The Dataverse connector stores information about the logic app workflows that get and require notifications about database entity changes by using the `callbackregistrations` entity in your Dataverse database. If you copy a Dataverse organization, any webhooks are copied too. If you copy your organization before you disable workflows that are mapped to your organization, any copied webhooks also point at the same logic app workflows, which then get notifications from multiple organizations.

To stop unwanted notifications, delete the `callbackregistrations` entity from the organization that sends those notifications by following these steps:

1. Identify and sign in to the Dataverse organization from where you want to remove notifications.

1. In the Chrome browser, find the callback registration that you want to delete.

   1. Review the generic list for all the callback registrations at the following OData URI so that you can view the data inside the `callbackregistrations` entity:

      `https://{organization-name}.crm{instance-number}.dynamics.com/api/data/v9.0/callbackregistrations`:

      > [!NOTE]
      >
      > If no values are returned, you might not have permissions to view this entity type, 
      > or you might not have signed in to the correct organization.

   1. Filter on the triggering entity's logical name `entityname` and the notification event that matches your logic app workflow (message). Each event type is mapped to the message integer as follows:

      | Event type | Message integer |
      |------------|-----------------|
      | Create | 1 |
      | Delete | 2 |
      | Update | 3 |
      | CreateOrUpdate | 4 |
      | CreateOrDelete | 5 |
      | UpdateOrDelete | 6 |
      | CreateOrUpdateOrDelete | 7 |

      The following example shows how you can filter for `Create` notifications on an entity named `nov_validation` by using the following OData URI for a sample organization:

      `https://fabrikam-preprod.crm1.dynamics.com/api/data/v9.0/callbackregistrations?$filter=entityname eq 'nov_validation' and message eq 1`

      :::image type="content" source="media/dataverse/find-callback-registrations.png" alt-text="Screenshot shows browser window and OData URI in address bar." lightbox="media/dataverse/find-callback-registrations.png":::

      > [!NOTE]
      >
      > If multiple triggers exist for the same entity or event, you can filter the list by using additional filters such as 
      > the `createdon` and `_owninguser_value` attributes. The owner user's name appears under `/api/data/v9.0/systemusers({id})`.

   1. After you find the ID for the callback registration that you want to delete, follow these steps:
   
      1. In your Chrome browser, open the Chrome Developer Tools (Keyboard: F12).

      1. In the window, at the top, select the **Console** tab.

      1. On the command-line prompt, enter this command, which sends a request to delete the specified callback registration:

         `fetch('http://{organization-name}.crm{instance-number}.dynamics.com/api/data/v9.0/callbackregistrations({ID-to-delete})', { method: 'DELETE'})`

         > [!IMPORTANT]
         >
         > Make sure that you make the request from a non-Unified Client Interface (UCI) page, for example, from the 
         > OData or API response page itself. Otherwise, logic in the app.js file might interfere with this operation.

   1. To confirm that the callback registration no longer exists, check the callback registrations list.

### Duplicate 'callbackregistrations' entity

In Standard workflows, under specific conditions such as instance reallocation or application restart, the Microsoft Dataverse trigger starts a duplicate run, which creates a duplicate `callbackregistrations` entity in your Dataverse database. If you edit a Standard workflow that starts with a Dataverse trigger, check whether this `callbackregistrations` entity is duplicated. If the duplicate exists, manually delete the duplicate `callbackregistrations` entity.

## Related content

* [Managed connectors for Azure Logic Apps](../../connectors/managed.md)
* [Built-in connectors for Azure Logic Apps](../../connectors/built-in.md)
* [What are connectors in Azure Logic Apps](../../connectors/introduction.md)
