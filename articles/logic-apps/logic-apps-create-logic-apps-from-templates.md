---
title: Create workflows from templates - Azure Logic Apps | Microsoft Docs
description: Build workflows faster by using logic app templates in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
ms.topic: article
ms.assetid: 3656acfb-eefd-4e75-b5d2-73da56c424c9
ms.date: 10/15/2017
---

# Create logic app workflows from prebuilt templates

To get you started creating workflows more quickly, 
Logic Apps provides templates, which are prebuilt 
logic apps that follow commonly used patterns. 
Use these templates as provided or edit them to fit your scenario.

Here are some template categories:

| Template type | Description | 
| ------------- | ----------- | 
| Enterprise cloud templates | For integrating Azure Blob, Dynamics CRM, Salesforce, Box, and includes other connectors for your enterprise cloud needs. For example, you can use these templates to organize business leads or back up your corporate file data. | 
| Personal productivity templates | Improve personal productivity by setting daily reminders, turning important work items into to-do lists, and automating lengthy tasks down to a single user approval step. | 
| Consumer cloud templates | For integrating social media services such as Twitter, Slack, and email. Useful for strengthening social media marketing initiatives. These templates also include tasks such as cloud copying, which increases productivity by saving time on traditionally repetitive tasks. | 
| Enterprise integration pack templates | For configuring VETER (validate, extract, transform, enrich, route) pipelines, receiving an X12 EDI document over AS2 and transforming to XML, and handling X12, EDIFACT, and AS2 messages. | 
| Protocol pattern templates | For implementing protocol patterns such as request-response over HTTP and integrations across FTP and SFTP. Use these templates as provided, or build on them for complex protocol patterns. | 
||| 

If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/) before you begin. For more information about building a logic app, see [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create logic apps from templates

1. If you haven't already, sign in to the 
[Azure portal](https://portal.azure.com "Azure portal").

2. From the main Azure menu, choose 
**Create a resource** > **Enterprise Integration** > **Logic App**.

   ![Azure portal, New, Enterprise Integration, Logic App](./media/logic-apps-create-logic-apps-from-templates/azure-portal-create-logic-app.png)

3. Create your logic app with the settings in the table under this image:

   ![Provide logic app details](./media/logic-apps-create-logic-apps-from-templates/logic-app-settings.png)

   | Setting | Value | Description | 
   | ------- | ----- | ----------- | 
   | **Name** | *your-logic-app-name* | Provide a unique logic app name. | 
   | **Subscription** | *your-Azure-subscription-name* | Select the Azure subscription that you want to use. | 
   | **Resource group** | *your-Azure-resource-group-name* | Create or select an [Azure resource group](../azure-resource-manager/resource-group-overview.md) for this logic app and to organize all resources associated with this app. | 
   | **Location** | *your-Azure-datacenter-region* | Select the datacenter region for deploying your logic app, for example, West US. | 
   | **Log Analytics** | **Off** (default) or **On** | Turn on [diagnostic logging](../logic-apps/logic-apps-monitor-your-logic-apps.md#turn-on-diagnostics-logging-for-your-logic-app) for your logic app through [Azure Log Analytics](../log-analytics/log-analytics-overview.md). Requires that you already have a Log Analytics workspace. | 
   |||| 

4. When you're ready, select **Pin to dashboard**. 
That way, your logic app automatically appears on 
your Azure dashboard and opens after deployment. 
Choose **Create**.

   > [!NOTE]
   > If you don't want to pin your logic app, 
   > you must manually find and open your logic app 
   > after deployment so you can continue.

   After Azure deploys your logic app, the Logic Apps Designer 
   opens and shows a page with an introduction video. 
   Under the video, you can find templates for common logic app patterns. 

5. Scroll past the introduction video and common triggers to **Templates**. 
Choose a prebuilt template. For example:

   ![Choose a logic app template](./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png)

   > [!TIP]
   > To create your logic app from scratch, choose **Blank Logic App**.

   When you select a prebuilt template, 
   you can view more information about that template. 
   For example:

   ![Choose a prebuilt template](./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png)

6. To continue with the selected template, 
choose **Use this template**. 

7. Based on the connectors in the template, 
you are prompted to perform any of these steps:

   * Sign in with your credentials to systems or services 
   that are referenced by the template.

   * Create connections for any services or systems 
   referenced by the template. To create a connection, 
   provide a name for your connection, and if necessary, 
   select the resource that you want to use. 

   * If you already set up these connections, 
   choose **Continue**.

   For example:

   ![Create connections](./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection.png)

   When you're done, your logic app opens 
   and appears in the Logic Apps Designer.

   > [!TIP]
   > To return to the template viewer, choose **Templates** 
   > on the designer toolbar. This action discards any unsaved changes, 
   > so a warning message appears to confirm your request.

8. Continue building your logic app.

   > [!NOTE] 
   > Many templates include connectors that might 
   > already have prepopulated required properties. 
   > However, some templates might still require that you provide 
   > values before you can properly deploy the logic app. 
   > If you try to deploy without completing the missing property fields, 
   > you get an error message. 

## Update logic apps with templates

1. In the [Azure portal](https://portal.azure.com "Azure portal"), 
find and open your logic app in th Logic App Designer.

2. On the designer toolbar, choose **Templates**. 
This action discards any unsaved changes, 
so a warning message appears so you can confirm 
that you want to continue. To confirm, choose **OK**. 
For example:

   ![Choose "Templates"](./media/logic-apps-create-logic-apps-from-templates/logic-app-update-existing-with-template.png)

3. Scroll past the introduction video and common triggers to **Templates**. 
Choose a prebuilt template. For example:

   ![Choose a logic app template](./media/logic-apps-create-logic-apps-from-templates/choose-logic-app-template.png)

   When you select a prebuilt template, 
   you can view more information about that template. 
   For example:

   ![Choose a prebuilt template](./media/logic-apps-create-logic-apps-from-templates/logic-app-choose-prebuilt-template.png)

4. To continue with the selected template, 
choose **Use this template**. 

5. Based on the connectors in the template, 
you are prompted to perform any of these steps:

   * Sign in with your credentials to systems or 
   services that are referenced by the template.

   * Create connections for any services or systems 
   referenced by the template. To create a connection, 
   provide a name for your connection, and if necessary, 
   select the resource that you want to use. 

   * If you already set up these connections, 
   choose **Continue**.

   ![Create connections](./media/logic-apps-create-logic-apps-from-templates/logic-app-create-connection.png)

   Your logic app now opens and appears in the Logic Apps Designer.

8. Continue building your logic app. 

   > [!TIP]
   > If you haven't saved your changes, you can discard your work 
   > and return to your previous logic app. On the designer toolbar, 
   > choose **Discard**.

> [!NOTE] 
> Many templates include connectors that might have 
> already pre-populated required properties. 
> However, some templates might still require that you provide 
> values before you can properly deploy the logic app. 
> If you try to deploy without completing the missing property fields, 
> you get an error message.

## Deploy logic apps built from templates

After you make your changes to the template, 
you can save your changes. This action also 
automatically publishes your logic app.

On the designer toolbar, choose **Save**.

![Save and publish your logic app](./media/logic-apps-create-logic-apps-from-templates/logic-app-save.png)  

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

Learn about building logic apps through examples, 
scenarios, customer stories, and walkthroughs.

> [!div class="nextstepaction"]
> [Review logic app examples, scenarios, and walkthroughs](../logic-apps/logic-apps-examples-and-scenarios.md)