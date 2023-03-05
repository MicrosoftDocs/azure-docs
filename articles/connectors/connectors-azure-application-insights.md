---
title: Connect to Azure Monitor Application Insights
description: Connect to Azure Application Insights to query telemetry data as part of a workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/31/2022
tags: connectors
---

# Connect to Azure Monitor Application Insights from workflows in Azure Logic Apps

Do you find yourself repeatedly running the same queries on your telemetry data to check whether your service is functioning properly? Are you looking to automate these queries for finding trends and anomalies and then build your own workflows around them? The [Application Insights connector](/connectors/applicationinsights/) for Azure Logic Apps is the right tool for this purpose.

> [!NOTE]
> The Application Insights connector is replaced by the [Azure Monitor connector](../connectors/connectors-azure-monitor-logs.md), which you can also use to retrieve data from a Log Analytics workspace. 
> Rather than require an API key, the Azure Monitor connector is integrated with Azure Active Directory. 

With this integration, you can automate numerous processes without writing a single line of code. You can create a logic app workflow with the Application Insights connector to quickly automate any Application Insights process.

You can also add other actions. Azure Logic Apps provides hundreds of connectors with other actions. For example, by creating a logic app workflow, you can automatically send an email notification or create a bug in Azure DevOps. If you're creating a Consumption logic app workflow, you can also use one of the many available [templates](../logic-apps/logic-apps-create-logic-apps-from-templates.md) to help speed up the process of creating your workflow.

This how-to guide describes how to build a workflow using the connector.

## Create a logic app workflow for Application Insights

In this tutorial, you learn how to create a logic app that uses the Log Analytics autocluster algorithm to group attributes in the data for a web application. The flow automatically sends the results by email. This example shows how you can use Application Insights analytics and Logic Apps together.

### Create a logic app
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** > **Web** > **Logic App**. For this example, make sure that you create a Consumption logic app workflow. If you create a Standard logic app, your designer experience will differ and not all steps apply.

    ![Screenshot that shows the New resource window with Web and Logic App selected.](./media/connectors-azure-application-insights/1createlogicapp.png)

### Add a trigger for your workflow
1. In the **Logic Apps Designer** window, under **Start with a common trigger**, select **Recurrence**.

   ![Screenshot that shows the Logic Apps Designer window with the common triggers gallery and the Recurrence trigger selected.](./media/connectors-azure-application-insights/2logicappdesigner.png)

1. In the **Interval** box, enter **1**. In the **Frequency** box, select **Day**.

   ![Screenshot that shows the Consumption workflow designer and the Recurrence trigger with Interval and Frequency recurrence properties.](./media/connectors-azure-application-insights/3recurrence.png)

### Add an Application Insights action

1. Select **New step**.

1. In the **Choose an action** search box, enter **Application Insights**.

1. Under **Actions**, select **Visualize Analytics query - Azure Application Insights**.

   ![Screenshot that shows the Choose an operation search box and the Visualize Analytics query action selected.](./media/connectors-azure-application-insights/4visualize.png)

### Connect to an Application Insights resource

For this step, you need an application ID and an API key for your resource.

1. In the Azure portal, open your Application Insights resource.

1. On the resource menu, under **Configure**, select **API Access**. On the toolbar, select **Create API key**.

   ![Screenshot that shows the Azure portal and Application Insights resource with API Access page and the Create API key button selected.](./media/connectors-azure-application-insights/5apiaccess.png)

   ![Screenshot that shows the Create API key pane with key description and permissions for other apps selected.](./media/connectors-azure-application-insights/6apikey.png)

1. Provide a connection name, the application ID, and the API key.

   ![Screenshot that shows the Consumption workflow with the Azure Application Insights connection information.](./media/connectors-azure-application-insights/7connection.png)

### Specify the Log Analytics query and chart type
In the following example, the query selects the failed requests within the last day and correlates them with exceptions that occurred as part of the operation. Log Analytics correlates the failed requests based on the `operation_Id` identifier. The query then segments the results by using the autocluster algorithm.

When you create your own queries, verify that they're working properly in Log Analytics before you add them to your flow.

1. In the **Query** box, add the following Log Analytics query:

    ```
    requests
    | where timestamp > ago(1d)
    | where success == "False"
    | project name, operation_Id
    | join ( exceptions
        | project problemId, outerMessage, operation_Id
    ) on operation_Id
    | evaluate autocluster()
    ```

1. In the **Chart Type** box, select **Html Table**.

   ![Screenshot that shows the Log Analytics query configuration window.](./media/connectors-azure-application-insights/8query.png)

### Add an action to send email

1. Select **New step**.

1. In the search box, enter **Office 365 Outlook**.

1. Select **Send an email - Office 365 Outlook**.

   ![Screenshot that shows the Office 365 Outlook actions and the Send an email action selected.](./media/connectors-azure-application-insights/9sendemail.png)

1. In the **Send an email** action, set up the following properties:

   1. Enter the email address of the recipient.
   1. Enter a subject for the email.
   1. In the **Body** box, select anywhere inside. When the **Dynamic content** list appears. under **Visualize Analytics query**, select **Body**.
   1. From the **Add new parameter** list, select **Attachments** and **Is HTML**.

      ![Screenshot that shows the Send an email action, the Body property, and the Dynamic content list to the right side with the Body output selected.](./media/connectors-azure-application-insights/10emailbody.png)

      ![Screenshot that shows the Send an email action with the Add new parameter list open and the Attachments and Is HTML checkboxes selected.](./media/connectors-azure-application-insights/11emailparameter.png)

   The **Send an email** action now includes the **Attachments Name**, **Attachments Content**, and **IsHtml** properties.

   1. For the new properties, follow these steps:

    1. In the **Attachment Name** box, from the dynamic content list that appears, select the **Attachment Name** output.
    1. In the **Attachment Content** box, from the dynamic content list that appears, select the **Attachment Content** output.
    1. In the **Is HTML** box, select **Yes**.

       ![Screenshot that shows the configured Send an email action.](./media/connectors-azure-application-insights/12emailattachment.png)

### Save and test your logic app workflow

1. On the designer toolbar, select **Save** to save your changes.

   You can wait for the trigger to run the workflow, or you can immediately run the workflow by selecting **Run Trigger** > **Run**.

   ![Screenshot that shows the Consumption workflow designer with the Save button selected.](./media/connectors-azure-application-insights/13save.png)

   When your workflow runs, the specified email recipients receive an email that looks like the following example:

   ![Screenshow that shows an email message generated by the example Consumption workflow with a query result set.](./media/connectors-azure-application-insights/email-generated-by-logic-app-generated-email.png)

    > [!NOTE]
   > The logic app workflow generates an email with a JPG file that depicts the query result set. If your query doesn't return results, the workflow won't create a JPG file.

## Next steps

Learn more about:
- [Log Analytics queries](../azure-monitor/logs/get-started-queries.md)
- [Azure Logic Apps](../logic-apps/logic-apps-overview.md)
- [Application Insights connector](/connectors/applicationinsights/)
