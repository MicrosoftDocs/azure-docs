---
title: Automate Azure Application Insights processes with an Azure Logic App.
description: Learn how you can quickly automate repeatable processes by adding the Application Insights connector to your Azure Logic App.
services: application-insights
documentationcenter: ''
author: CFreemanwa
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 06/29/2017
ms.author: cfreeman
---

# Automate Application Insights processes with an Azure Logic App

Do you find yourself repeatedly running the same queries on your telemetry data to check that
your service is functioning properly? Looking to automate these queries for finding trends and
anomalies and build your own workflows around them? Well, Application Insights Connector (preview) for Azure Logic Apps is just what you need!
With this integration, numerous processes can now be automated without writing a single line of code. You can create your Logic App with the Application Insights connector to quickly automate any Application Insights process. You can add additional actions as well. Logic Apps makes hundreds of actions available. For example, you can automatically send an email notification, or create a bug in Visual Studio Team Services as part of your Logic App. You can also use one of the many [templates](https://docs.microsoft.com/azure/logic-apps/logic-apps-use-logic-app-templates) available for Logic Apps. These templates speed up the process of creating your Logic App. 

## Tutorial for creating an Azure Logic App for Application Insights

In this tutorial, you learn how to create an Azure Logic App that uses the Analytics auto-cluster algorithm to group attributes in the data for a web application. The flow automatically sends the results by email. This is just one example of how you can use Application Insights Analytics and Azure Logic Apps together. 

### Step 1: Create a Logic App
1. Sign in at:  https://portal.azure.com.
2. Create a new Logic App from the New/Web + Mobile menu.

![New Logic App screen](./media/automate-with-logic-apps/logicapp1.png)

### Step 2: Create a trigger for your Logic App
1.	In the Logic App Designer, under Start with a common trigger, choose Recurrence.
2.	Set the Frequency to Day with an Interval of 1.

![Logic App trigger dialog](./media/automate-with-logic-apps/logicapp2.png)

![Logic App frequency dialog](./media/automate-with-logic-apps/step2b.png)

### Step 3: Add an Azure Application Insights action
1. Click **New step** and then on **Add an action**.
2. Search for Azure Application Insights.
3. Click Azure Application Insights – Visualize Analytics query Preview.

![Run Analytics query screen](./media/automate-with-logic-apps/flow2.png)

### Step 4: Connect to an Application Insights resource

**Prerequisite**

You need an Application ID and an API Key for your resource to complete this step. You can retrieve them from the Azure portal as demonstrated in the following diagram:

![Application ID in the Azure portal](./media/automate-with-logic-apps/appid.png) 

- Provide a name for your connection along with the Application ID and API Key.

![Flow connection screen](./media/automate-with-logic-apps/flow3.png)

### Step 5: Specify the Analytics query and chart type
This example selects the failed requests within the last day and correlates them with exceptions that occurred as part of the operation. Analytics correlates based on the operation_Id identifier. The query then segments the results using the autocluster algorithm. 
When creating your own queries, make sure to verify that they are working properly in Analytics before adding it to your flow.

- Add the following Analytics query and select the Html table chart type. 

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
![Analytics query configuration screen](./media/automate-with-logic-apps/flow4.png)

### Step 6: Configure the app to send email

1. Click **New step** and then select **Add an action**.
2. Search for Office 365 Outlook.
3. Click Office 365 Outlook – Send an email.
![Office 365 Outlook selection](./media/automate-with-logic-apps/flow2b.png)

4. In the email action add the following data:
 - Specify the email address of the recipient
 - Provide a subject for the email
 - Place your cursor in the **Body** field, and from the dynamic content menu that opens on the right, select **Body**.
 - Click on **Show advanced options**.

 ![Office 365 Outlook configuration](./media/automate-with-logic-apps/flow5.png)

5. From the dynamic content menu do the following:
- Select **Attachment Name**
- Select **Attachment Content**
- Select **Yes** in the **Is HTML** field

![Office 365 email configuration screen](./media/automate-with-logic-apps/flow7.png)
### Step 7: Save and test your Logic App
1. Click **Save** to save your changes.
1. You can either wait for the trigger to run the Logic App, or you can run it immediately by choosing **Run**.

![Logic App creation screen](./media/automate-with-logic-apps/step7.png)

When your Logic App runs the recipients you specified in the email list will receive an email that looks like the following:

![Logic App email](./media/automate-with-logic-apps/flow9.png)

## Next steps

- Learn more about creating [Analytics queries](app-insights-analytics-using.md).
- Learn more about [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-what-are-logic-apps).



<!--Link references-->





