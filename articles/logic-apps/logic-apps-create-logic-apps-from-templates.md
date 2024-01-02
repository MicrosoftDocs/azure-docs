---
title: Create Consumption workflows faster with prebuilt templates
description: To quickly build a Consumption logic app workflow, start with a prebuilt template in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/19/2022
#Customer intent: As an Azure Logic Apps developer, I want to build a logic app workflow from a template so that I can reduce development time.
---

# Create a Consumption logic app workflow from a prebuilt template

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To get you started creating workflows quickly, Azure Logic Apps provides prebuilt templates for logic app workflows that follow commonly used patterns.

> [!NOTE]
>
> Workflow templates and the workflow template gallery are currently available only for Consumption logic app workflows.

This how-to guide shows how to use these templates as provided or edit them to fit your scenario.

## Template categories

| Template type | Description |
| ------------- | ----------- |
| Enterprise cloud | For integrating Azure Blob Storage, Dynamics CRM, Salesforce, and Box. Also includes other connectors for your enterprise cloud needs. For example, you can use these templates to organize business leads or back up your corporate file data. |
| Personal productivity | For improving personal productivity. You can use these templates to set daily reminders, turn important work items into to-do lists, and automate lengthy tasks down to a single user-approval step. |
| Consumer cloud | For integrating social media services such as Twitter, Slack, and email. Useful for strengthening social media marketing initiatives. These templates also include tasks such as cloud copying, which increases productivity by saving time on traditionally repetitive tasks. |
| Enterprise integration pack | For configuring validate, extract, transform, enrich, and route (VETER) pipelines. Also for receiving an X12 EDI document over AS2 and transforming it to XML, and for handling X12, EDIFACT, and AS2 messages. |
| Protocol pattern | For implementing protocol patterns such as request-response over HTTP and integrations across FTP and SFTP. Use these templates as provided, or build on them for complex protocol patterns. |

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Basic understanding about how to build a logic app workflow. For more information, see [Create an example Consumption logic app workflow](quickstart-create-example-consumption-workflow.md).

## Create a Consumption workflow from a template

1. In the [Azure portal](https://portal.azure.com), from the home page, select **Create a resource** > **Integration** > **Logic App**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/azure-portal-create-logic-app.png" alt-text="Screenshot showing the Azure portal. On the navigation menu, 'Integration' is selected. Under 'Popular Azure services', 'Logic App' is selected.":::

1. On the **Create Logic App** page, enter the following values:

   | Setting | Value | Description |
   | ------- | ----- | ----------- |
   | **Subscription** | <*your-Azure-subscription-name*> | Select the Azure subscription that you want to use. |
   | **Resource Group** | <*your-Azure-resource-group-name*> | Create or select an [Azure resource group](../azure-resource-manager/management/overview.md) for this logic app resource and its associated resources. |
   | **Logic App name** | <*your-logic-app-name*> | Provide a unique logic app resource name. |
   | **Region** | <*your-Azure-datacenter-region*> | Select the datacenter region for deploying your logic app, for example, **West US**. |
   | **Enable log analytics** | **No** (default) or **Yes** | To set up [diagnostic logging](monitor-workflows-collect-diagnostic-data.md) for your logic app resource by using [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md), select **Yes**. This selection requires that you already have a Log Analytics workspace. |
   | **Plan type** | **Consumption** or **Standard** | Select **Consumption** to create a Consumption logic app workflow from a template. |
   | **Zone redundancy** | **Disabled** (default) or **Enabled** | If this option is available, select **Enabled** if you want to protect your logic app resource from a regional failure. But first [check that zone redundancy is available in your Azure region](./set-up-zone-redundancy-availability-zones.md?tabs=consumption#considerations). |

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-settings.png" alt-text="Screenshot showing the 'Create Logic App' page with example property values provided and the 'Consumption' plan type selected.":::

1. Select **Review + Create**.

1. Review the values, and then select **Create**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/create-logic-app.png" alt-text="Screenshot of the 'Create Logic App' page. The name, subscription, and other values are visible, and the 'Create' button is highlighted.":::

1. When deployment is complete, select **Go to resource**. The designer opens and shows a page with an introduction video. Under the video, you can find templates for common logic app workflow patterns.

1. Scroll past the introduction video and common triggers to **Templates**. Select a prebuilt template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png" alt-text="Screenshot showing the designer. Under 'Templates,' three templates are visible. The templated named 'Delete old Azure blobs' is selected.":::

   When you select a prebuilt template, you can view more information about that template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png" alt-text="Screenshot showing information about the 'Delete old Azure blobs' template, including a description and a diagram that shows a recurring schedule.":::

1. To continue with the selected template, select **Use this template**.

1. Based on the connectors in the template, you're prompted to perform any of these steps:

   - Sign in with your credentials to systems or services that are referenced by the template.

   - Create connections for any systems or services that are referenced by the template. To create a connection, provide a name for your connection, and if necessary, select the resource that you want to use.

   > [!NOTE]
   >
   > Many templates include connectors that have required properties that are prepopulated. Other templates 
   > require that you provide values before you can properly deploy the logic app resource. If you try to 
   > deploy without completing the missing property fields, you get an error message.

1. After you set up the required connections, select **Continue**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection.png" alt-text="Screenshot showing designer with connection to Azure Blob Storage. The 'Continue' button is selected.":::

   The designer opens and displays your workflow.

   > [!TIP]
   >
   > To return to the template viewer, select **Templates** on the designer toolbar. This action 
   > discards any unsaved changes, so a warning message appears to confirm your request.

1. Continue building your workflow.

1. When you're ready, save your workflow, which automatically publishes your logic app resource live to Azure. On the designer toolbar, select **Save**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-save.png" alt-text="Screenshot showing the designer with top part of a workflow. On the toolbar, 'Save' is selected.":::

## Update a Consumption workflow with a template

1. In the [Azure portal](https://portal.azure.com), go to your Consumption logic app resource.

1. On the resource navigation menu, select **Logic app designer**.

1. On the designer toolbar, select **Templates**. This action discards any unsaved changes, so a warning message appears. To confirm that you want to continue, select **OK**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-update-existing-with-template.png" alt-text="Screenshot showing the designer with top part of a workflow visible. On the toolbar, 'Templates' is selected.":::

1. Scroll past the introduction video and common triggers to **Templates**. Select a prebuilt template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png" alt-text="Screenshot showing the template gallery. Under 'Templates,' three templates are visible. The template named 'Delete old Azure blobs' is selected.":::

   When you select a prebuilt template, you can view more information about that template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png" alt-text="Screenshot showing information about the 'Delete old Azure blobs' template with a description and diagram that shows a recurring schedule.":::

1. To continue with the selected template, select **Use this template**.

1. Based on the connectors in the template, you're prompted to perform any of these steps:

   - Sign in with your credentials to systems or services that are referenced by the template.

   - Create connections for any systems or services that are referenced by the template. To create a connection, provide a name for your connection, and if necessary, select the resource that you want to use.

   > [!NOTE]
   >
   > Many templates include connectors that have required properties that are prepopulated. Other templates 
   > require that you provide values before you can properly deploy the logic app resource. If you try to 
   > deploy without completing the missing property fields, you get an error message.

1. After you set up your required connections, select **Continue**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection-designer.png" alt-text="Screenshot showing the designer with a connection to Azure Blob Storage. The 'Continue' button is selected.":::

   The designer opens and displays your workflow.

1. Continue building your workflow.

   > [!TIP]
   >
   > If you haven't saved your changes, you can discard your work and return to 
   > your previous workflow. On the designer toolbar, select **Discard**.

1. When you're ready, save your workflow, which automatically publishes your logic app resource live to Azure. On the designer toolbar, select **Save**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-save.png" alt-text="Screenshot showing the designer with top part of a workflow visible. On the toolbar, 'Save' is selected.":::

## Next steps

Learn about building logic app workflows through examples, scenarios, customer stories, and walkthroughs.

> [!div class="nextstepaction"]
> [Review logic app examples, scenarios, and walkthroughs](../logic-apps/logic-apps-examples-and-scenarios.md)