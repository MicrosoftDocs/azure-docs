---
title: Automate Azure Application Insights processes by using Logic Apps
description: Learn how you can quickly automate repeatable processes by adding the Application Insights connector to your logic app.
ms.topic: conceptual
ms.date: 03/11/2019

---

# Automate Application Insights processes by using Logic Apps

Do you find yourself repeatedly running the same queries on your telemetry data to check whether your service is functioning properly? Are you looking to automate these queries for finding trends and anomalies and then build your own workflows around them? The Azure Application Insights connector  for Logic Apps is the right tool for this purpose.

> [!NOTE]
> The Azure Application Insights connector has been replaced with the [Azure Monitor connector](../platform/logicapp-flow-connector.md) that is integrated with Azure Active Directory instead of requiring an API key and also allows you to retrieve data from a Log Analytics workspace.

With this integration, you can automate numerous processes without writing a single line of code. You can create a logic app with the Application Insights connector to quickly automate any Application Insights process. 

You can add additional actions as well. The Logic Apps feature of Azure App Service makes hundreds of actions available. For example, by using a logic app, you can automatically send an email notification or create a bug in Azure DevOps. You can also use one of the many available [templates](https://docs.microsoft.com/azure/logic-apps/logic-apps-use-logic-app-templates) to help speed up the process of creating your logic app. 

## Create a logic app for Application Insights

In this tutorial, you learn how to create a logic app that uses the Analytics autocluster algorithm to group attributes in the data for a web application. The flow automatically sends the results by email, just one example of how you can use Application Insights Analytics and Logic Apps together. 

### Step 1: Create a logic app
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click **Create a resource**, select **Web + Mobile**, and then select **Logic App**.

    ![New logic app window](./media/automate-with-logic-apps/1createlogicapp.png)

### Step 2: Create a trigger for your logic app
1. In the **Logic App Designer** window, under **Start with a common trigger**, select **Recurrence**.

    ![Logic App Designer window](./media/automate-with-logic-apps/2logicappdesigner.png)

1. In the  **Interval** box, type **1** and then,**Frequency** box, select **Day**.

    ![Logic App Designer "Recurrence" window](./media/automate-with-logic-apps/3recurrence.png)

### Step 3: Add an Application Insights action
1. Click **New step**.

1. In the **Choose an action** search box, type **Azure Application Insights**.

1. Under **Actions**, click **Azure Application Insights - Visualize Analytics query**.

    ![Logic App Designer "Choose an action" window](./media/automate-with-logic-apps/4visualize.png)

### Step 4: Connect to an Application Insights resource

To complete this step, you need an application ID and an API key for your resource. You can retrieve them from the Azure portal, as shown in the following diagram:

![Application ID in the Azure portal](./media/automate-with-logic-apps/5apiaccess.png)

![Application ID in the Azure portal](./media/automate-with-logic-apps/6apikey.png)

Provide a name for your connection, the application ID, and the API key.

![Logic App Designer flow connection window](./media/automate-with-logic-apps/7connection.png)

### Step 5: Specify the Analytics query and chart type
In the following example, the query selects the failed requests within the last day and correlates them with exceptions that occurred as part of the operation. Analytics correlates the failed requests, based on the operation_Id identifier. The query then segments the results by using the autocluster algorithm. 

When you create your own queries, verify that they are working properly in Analytics before you add it to your flow.

1. In the **Query** box, add the following Analytics query:

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

    ![Analytics query configuration window](./media/automate-with-logic-apps/8query.png)

### Step 6: Configure the logic app to send email

1. Click **New step**.

1. In the search box, type **Office 365 Outlook**.

1. Click **Office 365 Outlook - Send an email**.

    ![Office 365 Outlook selection](./media/automate-with-logic-apps/9sendemail.png)

1. In the **Send an email** window, do the following:

   a. Type the email address of the recipient.

   b. Type a subject for the email.

   c. Click anywhere in the **Body** box and then, on the dynamic content menu that opens at the right, select **Body**.
    
   d. Click the **Add new parameter** drop down and select Attachments and Is HTML.

      ![Office 365 Outlook configuration](./media/automate-with-logic-apps/10emailbody.png)

      ![Office 365 Outlook configuration](./media/automate-with-logic-apps/11emailparameter.png)

1. On the dynamic content menu, do the following:

    a. Select **Attachment Name**.

    b. Select **Attachment Content**.
    
    c. In the **Is HTML** box, select **Yes**.

      ![Office 365 email configuration screen](./media/automate-with-logic-apps/12emailattachment.png)

### Step 7: Save and test your logic app
* Click **Save** to save your changes.

You can wait for the trigger to run the logic app, or you can run the logic app immediately by selecting **Run**.

![Logic app creation screen](./media/automate-with-logic-apps/13save.png)

When your logic app runs, the recipients you specified in the email list will receive an email that looks like the following:

![Logic app email message](./media/automate-with-logic-apps/flow9.png)

## Next steps

- Learn more about creating [Analytics queries](../../azure-monitor/log-query/get-started-queries.md).
- Learn more about [Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-what-are-logic-apps).



<!--Link references-->





