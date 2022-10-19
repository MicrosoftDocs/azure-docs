---
title: Create logic app workflows faster with prebuilt templates
description: Quickly build logic app workflows with prebuilt templates in Azure Logic Apps, and find out about available templates.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 10/12/2022
#Customer intent: As an Azure Logic Apps developer, I want to build a logic app workflow from a template so that I can reduce development time.
---

# Create a logic app workflow from a prebuilt template

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To get you started creating workflows quickly, Azure Logic Apps provides templates, which are prebuilt logic app workflows that follow commonly used patterns. 

This how-to guide shows how to use these templates as provided or edit them to fit your scenario.

Here are some template categories:

| Template type | Description | 
| ------------- | ----------- | 
| Enterprise cloud | For integrating Azure Blob Storage, Dynamics CRM, Salesforce, and Box. Also includes other connectors for your enterprise cloud needs. For example, you can use these templates to organize business leads or back up your corporate file data. | 
| Personal productivity | For improving personal productivity. You can use these templates to set daily reminders, turn important work items into to-do lists, and automate lengthy tasks down to a single user-approval step. | 
| Consumer cloud | For integrating social media services such as Twitter, Slack, and email. Useful for strengthening social media marketing initiatives. These templates also include tasks such as cloud copying, which increases productivity by saving time on traditionally repetitive tasks. | 
| Enterprise integration pack | For configuring validate, extract, transform, enrich, and route (VETER) pipelines. Also for receiving an X12 EDI document over AS2 and transforming it to XML, and for handling X12, EDIFACT, and AS2 messages. | 
| Protocol pattern | For implementing protocol patterns such as request-response over HTTP and integrations across FTP and SFTP. Use these templates as provided, or build on them for complex protocol patterns. | 
||| 

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A basic understanding of how to build a logic app workflow. For more information, see [Create a Consumption logic app workflow](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create a logic app workflow from a template

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Create a resource** > **Integration** > **Logic App**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/azure-portal-create-logic-app.png" alt-text="Screenshot of the Azure portal. Under 'Popular Azure services,' 'Logic App' is highlighted. On the navigation menu, 'Integration' is highlighted.":::

1. In the **Create Logic App** page, enter the following values:

   | Setting | Value | Description | 
   | ------- | ----- | ----------- | 
   | **Subscription** | <*your-Azure-subscription-name*> | Select the Azure subscription that you want to use. |
   | **Resource Group** | <*your-Azure-resource-group-name*> | Create or select an [Azure resource group](../azure-resource-manager/management/overview.md) for this logic app resource and its associated resources. |
   | **Logic App name** | <*your-logic-app-name*> | Provide a unique logic app resource name. |
   | **Region** | <*your-Azure-datacenter-region*> | Select the datacenter region for deploying your logic app, for example, **West US**. |
   | **Enable log analytics** | **No** (default) or **Yes** | To set up [diagnostic logging](../logic-apps/monitor-logic-apps-log-analytics.md) for your logic app resource by using [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md), select **Yes**. This selection requires that you already have a Log Analytics workspace. |
   | **Plan type** | **Consumption** or **Standard** | Select **Consumption** to create a Consumption logic app workflow. |
   | **Zone redundancy** | **Disabled** (default) or **Enabled** | If this option is available, select **Enabled** if you want to protect your logic app resource from a regional failure. But first [check that zone redundancy is available in your Azure region](/azure/logic-apps/set-up-zone-redundancy-availability-zones?tabs=consumption#considerations). |
   ||||

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-settings.png" alt-text="Screenshot of the 'Create Logic App' page. The 'Consumption' plan type is selected, and values are visible in other input fields.":::

1. Select **Review + Create**.

1. Review the values, and then select **Create**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/create-logic-app.png" alt-text="Screenshot of the 'Create Logic App' page. The name, subscription, and other values are visible, and the 'Create' button is highlighted.":::

1. When deployment is complete, select **Go to resource**. The designer opens and shows a page with an introduction video. Under the video, you can find templates for common logic app workflow patterns. 

1. Scroll past the introduction video and common triggers to **Templates**. Select a prebuilt template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png" alt-text="Screenshot of the designer. Under 'Templates,' three templates are visible. One called 'Delete old Azure blobs' is highlighted.":::

   When you select a prebuilt template, you can view more information about that template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png" alt-text="Screenshot that shows information about the 'Delete old Azure blobs' template, including a description and a diagram that shows a recurring schedule.":::

1. To continue with the selected template, select **Use this template**. 

1. Based on the connectors in the template, you're prompted to perform any of these steps:

   * Sign in with your credentials to systems or services that are referenced by the template.

   * Create connections for any systems or services that are referenced by the template. To create a connection, provide a name for your connection, and if necessary, select the resource that you want to use. 

   > [!NOTE] 
   > Many templates include connectors that have required properties that are prepopulated. Other templates require that you provide values before you can properly deploy the logic app workflow. If you try to deploy without completing the missing property fields, you get an error message.

1. After you set up your required connections, select **Continue**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection.png" alt-text="Screenshot of the designer. A connection for Azure Blob Storage is visible, and the 'Continue' button is highlighted.":::

   The designer opens and displays your logic app workflow.

   > [!TIP]
   > To return to the template viewer, select **Templates** on the designer toolbar. This action discards any unsaved changes, so a warning message appears to confirm your request.

1. Continue building your logic app workflow.

## Update a logic app workflow with a template

1. In the [Azure portal](https://portal.azure.com), go to your logic app resource.

1. On the logic app navigation menu, select **Logic app designer**.

1. On the designer toolbar, select **Templates**. This action discards any unsaved changes, so a warning message appears. To confirm that you want to continue, select **OK**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-update-existing-with-template.png" alt-text="Screenshot of the designer. The top part of a logic app workflow is visible. On the toolbar, 'Templates' is highlighted.":::

1. Scroll past the introduction video and common triggers to **Templates**. Select a prebuilt template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png" alt-text="Screenshot of the designer. Under 'Templates,' three templates are visible. One template called 'Delete old Azure blobs' is highlighted.":::

   When you select a prebuilt template, you can view more information about that template.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png" alt-text="Screenshot that shows information about the 'Delete old Azure blobs' template. A description and diagram that shows a recurring schedule are visible.":::

1. To continue with the selected template, select **Use this template**. 

1. Based on the connectors in the template, you're prompted to perform any of these steps:

   * Sign in with your credentials to systems or services that are referenced by the template.

   * Create connections for any systems or services that are referenced by the template. To create a connection, provide a name for your connection, and if necessary, select the resource that you want to use.

   > [!NOTE]
   > Many templates include connectors that have required properties that are prepopulated. Other templates require that you provide values before you can properly deploy the logic app workflow. If you try to deploy without completing the missing property fields, you get an error message.

1. After you set up your required connections, select **Continue**.

   :::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection-designer.png" alt-text="Screenshot of the designer, with a connection for Azure Blob Storage. The 'Continue' button is highlighted.":::

   The designer opens and displays your logic app workflow.

1. Continue building your logic app workflow.

   > [!TIP]
   > If you haven't saved your changes, you can discard your work and return to your previous workflow. On the designer toolbar, select **Discard**.

## Deploy a logic app workflow built from a template

After you make your changes to the template, you can save your changes. This action automatically publishes your logic app workflow.

On the designer toolbar, select **Save**.

:::image type="content" source="./media/logic-apps-create-logic-apps-from-templates/logic-app-save.png" alt-text="Screenshot of the designer. The top part of a logic app workflow is visible. On the toolbar, the 'Save' button is highlighted."::: 

## Get support

* For questions, go to the [Microsoft Q&A question page for Azure Logic Apps](/answers/topics/azure-logic-apps.html).
* To submit or vote on feature ideas, go to the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

Learn about building logic app workflows through examples, scenarios, customer stories, and walkthroughs.

> [!div class="nextstepaction"]
> [Review logic app examples, scenarios, and walkthroughs](../logic-apps/logic-apps-examples-and-scenarios.md)
