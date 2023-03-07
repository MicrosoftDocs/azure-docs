---
title: Automate Azure Application Insights processes by using Logic Apps
description: Learn how you can quickly automate repeatable processes by adding the Application Insights connector to your logic app.
ms.topic: conceptual
ms.date: 07/31/2022
author: guywild
ms.author: guywild
ms.reviewer: yossi-y
---

# Automate Application Insights processes by using Logic Apps

Do you find yourself repeatedly running the same queries on your telemetry data to check whether your service is functioning properly? Are you looking to automate these queries for finding trends and anomalies and then build your own workflows around them? The Azure Application Insights connector  for Logic Apps is the right tool for this purpose.

> [!NOTE]
> The Azure Application Insights connector has been replaced by the [Azure Monitor connector](../logs/logicapp-flow-connector.md), which is integrated with Azure Active Directory instead of requiring an API key and also allows you to retrieve data from a Log Analytics workspace.

With this integration, you can automate numerous processes without writing a single line of code. You can create a logic app with the Application Insights connector to quickly automate any Application Insights process. 

You can also add other actions. The Logic Apps feature of Azure App Service makes hundreds of actions available. For example, by using a logic app, you can automatically send an email notification or create a bug in Azure DevOps. You can also use one of the many available [templates](../../logic-apps/logic-apps-create-logic-apps-from-templates.md) to help speed up the process of creating your logic app. 

## Create a logic app for Application Insights

In this tutorial, you learn how to create a logic app that uses the Analytics autocluster algorithm to group attributes in the data for a web application. The flow automatically sends the results by email, just one example of how you can use Application Insights Analytics and Logic Apps together. 

### Step 1: Create a logic app
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** > **Web + Mobile** > **Logic App**.

    ![Screenshot that shows the New logic app window.](./media/automate-with-logic-apps/1createlogicapp.png)

### Step 2: Create a trigger for your logic app
1. In the **Logic Apps Designer** window, under **Start with a common trigger**, select **Recurrence**.

    ![Screenshot that shows the Logic App Designer window.](./media/automate-with-logic-apps/2logicappdesigner.png)

1. In the  **Interval** box, type **1** and then,**Frequency** box, select **Day**.

    ![Screenshot that shows the Logic Apps Designer "Recurrence" window.](./media/automate-with-logic-apps/3recurrence.png)

### Step 3: Add an Application Insights action
1. Select **New step**.

1. In the **Choose an action** search box, type **Azure Application Insights**.

1. Under **Actions**, select **Azure Application Insights - Visualize Analytics query**.

    ![Screenshot that shows the Logic App Designer "Choose an action" window.](./media/automate-with-logic-apps/4visualize.png)

### Step 4: Connect to an Application Insights resource

To complete this step, you need an application ID and an API key for your resource:

1. Select **API access** > **Create API key**:

    ![Screenshot shows the API Access page in the Azure portal with the Create API key button selected.](./media/automate-with-logic-apps/5apiaccess.png)
    
    ![Screenshot that shows the Application ID in the Azure portal.](./media/automate-with-logic-apps/6apikey.png)

1. Provide a name for your connection, the application ID, and the API key.

    ![Screenshot that shows the Logic App Designer flow connection window.](./media/automate-with-logic-apps/7connection.png)

### Step 5: Specify the Analytics query and chart type
In the following example, the query selects the failed requests within the last day and correlates them with exceptions that occurred as part of the operation. Analytics correlates the failed requests, based on the operation_Id identifier. The query then segments the results by using the autocluster algorithm. 

When you create your own queries, verify that they're working properly in Analytics before you add it to your flow.

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

    ![Screenshot that shows the Analytics query configuration window.](./media/automate-with-logic-apps/8query.png)

### Step 6: Configure the logic app to send email

1. Select **New step**.

1. In the search box, type **Office 365 Outlook**.

1. Select **Office 365 Outlook - Send an email**.

    ![Screenshot that shows the Send an email button on the Office 365 Outlook screen.](./media/automate-with-logic-apps/9sendemail.png)

1. In the **Send an email** window:

   a. Type the email address of the recipient.

   b. Type a subject for the email.

   c. Select anywhere in the **Body** box and then, on the dynamic content menu that opens at the right, select **Body**.
    
   d. Select the **Add new parameter** dropdown and select Attachments and Is HTML.

      ![Screenshot that shows the Send an email window with the Body box highlighted and the Dynamic content menu with Body highlighted on the right side.](./media/automate-with-logic-apps/10emailbody.png)

      ![Screenshot that shows the Add new parameter dropdown in the Send an email window with the Attachments and Is HTML checkboxes selected](./media/automate-with-logic-apps/11emailparameter.png)

1. On the dynamic content menu:

    a. Select **Attachment Name**.

    b. Select **Attachment Content**.
    
    c. In the **Is HTML** box, select **Yes**.

      ![Screenshot that shows the Office 365 email configuration screen.](./media/automate-with-logic-apps/12emailattachment.png)

### Step 7: Save and test your logic app

1. Select **Save** to save your changes.

    You can wait for the trigger to run the logic app, or you can run the logic app immediately by selecting **Run**.
    
    ![Screenshot that shows the Save button on the Logic Apps Designer screen](./media/automate-with-logic-apps/13save.png)
    
    When your logic app runs, the recipients you specified in the email list will receive an email that looks like this:
    
    ![Image showing email message generated by logic app with query result set](./media/automate-with-logic-apps/email-generated-by-logic-app-generated-email.png)

    > [!NOTE]
    > The log app generates an email with a JPG file that depicts the query result set. If your query doesn't return results, the logic app won't create a JPG file.    
    
## Next steps

- Learn more about creating [Analytics queries](../logs/get-started-queries.md).
- Learn more about [Logic Apps](../../logic-apps/logic-apps-overview.md).



