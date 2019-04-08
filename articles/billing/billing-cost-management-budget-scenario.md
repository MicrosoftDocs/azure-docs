---
title: Azure billing and cost management budget scenario | Microsoft Docs
description: Learn how to use Azure automation to shut down VMs based on specific budget thresholds.
services: 'billing'
documentationcenter: ''
author: Erikre
manager: dougeby
editor: ''
tags: billing

ms.assetid: db93f546-6b56-4b51-960d-1a5bf0274fc8
ms.service: billing
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: billing
ms.date: 03/13/2019
ms.author: erikre

---

# Manage costs with Azure Budgets

Cost control is a critical component to maximizing the value of your investment in the cloud. There are several scenarios where cost visibility, reporting, and cost-based orchestration are critical to continued business operations. [Azure Cost Management APIs](https://docs.microsoft.com/rest/api/consumption/) provide a set of APIs to support each of these scenarios. The APIs provide usage details, allowing you to view granular instance level costs.

Budgets are commonly used as part of cost control. Budgets can be scoped in Azure. For instance, you could narrow your budget view based on subscription, resource groups, or a collection of resources. In addition to using the budgets API to notify you via email when a budget threshold is reached, you can use [Azure Monitor action groups](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-action-groups) to trigger an orchestrated set of actions as a result of a budget event.

A common budgets scenario for a customer running a non-critical workload could occur when they want to manage against a budget and also get to a predictable cost when looking at the monthly invoice. This scenario requires some cost-based orchestration of resources that are part of the Azure environment. In this scenario, a monthly budget of $1000 for the subscription is set. Also, notification thresholds are set to trigger a few orchestrations. This scenario starts with an 80% cost threshold, which will stop all VMs in the resource group **Optional**. Then, at the 100% cost threshold, all VM instances will be stopped.
To configure this scenario, you will complete the following actions by following the steps provided in each section of this tutorial.

These actions included in this tutorial allow you to:

- Create an Azure Automation Runbook to stop VMs by using webhooks.
- Create an Azure Logic App to be triggered based on the budget threshold value and call the runbook with the right parameters.
- Create an Azure Monitor Action Group that will be configured to trigger the Azure Logic App when the budget threshold is met.
- Create the Azure budget with the desired thresholds and wire it to the action group.

## Create an Azure Automation Runbook

[Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro) is a service that enables you to script most of your resource management tasks and run those tasks as either scheduled or on-demand. As part of this scenario, you will create an [Azure Automation runbook](https://docs.microsoft.com/azure/automation/automation-runbook-types) that will be used to stop VMs. You will use the [Stop Azure V2 VMs](https://gallery.technet.microsoft.com/scriptcenter/Stop-Azure-ARM-VMs-1ba96d5b) graphical runbook from the [gallery](https://docs.microsoft.com/azure/automation/automation-runbook-gallery) to build this scenario. By importing this runbook into your Azure account and publishing it, you will be able to stop VMs when a budget threshold is reached.

### Create an Azure Automation account

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account credentials.
2. Click the **Create a resource** button found on the upper left corner of Azure.
3. Select **Management Tools** > **Automation**.
   > [!NOTE]
   > If you don’t have an Azure account, you can create a [free account](https://azure.microsoft.com/free/).
4. Enter your account information. For **Create Azure Run As account**, choose **Yes** to automatically enable the settings needed to simplify authentication to Azure.
5. When complete, click **Create**, to start the Automation account deployment.

### Import the Stop Azure V2 VMs runbook

Using an [Azure Automation runbook](https://docs.microsoft.com/azure/automation/automation-runbook-types), import the [Stop Azure V2 VMs](https://gallery.technet.microsoft.com/scriptcenter/Stop-Azure-ARM-VMs-1ba96d5b) graphical runbook from the gallery.

1.	Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account credentials.
2.	Open your Automation account by selecting **All services** > **Automation Accounts**. Then, select your Automation Account.
3.	Click **Runbooks gallery** from the **Process Automation** section.
4.	Set the **Gallery Source** to **Script Center** and select **OK**.
5.	Locate and select the [Stop Azure V2 VMs](https://gallery.technet.microsoft.com/scriptcenter/Stop-Azure-ARM-VMs-1ba96d5b) gallery item within the Azure portal.
6.	Click the **Import** button to display the **Import** blade and select **OK**. The runbook overview blade will be displayed.
7.	Once the runbook has completed the import process, select **Edit** to display the graphical runbook editor and publishing option.

    ![Azure - Edit graphical runbook](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-01.png)
8.	Click the **Publish** button to publish the runbook and then select **Yes** when prompted. When you publish a runbook, you override any existing published version with the draft version. In this case, you have no published version because you have created the runbook.

    For more information about publishing a runbook, see [Create a graphical runbook](https://docs.microsoft.com/azure/automation/automation-first-runbook-graphical).

## Create webhooks for the runbook

Using the [Stop Azure V2 VMs](https://gallery.technet.microsoft.com/scriptcenter/Stop-Azure-ARM-VMs-1ba96d5b) graphical runbook, you will create two Webhooks to start the runbook in Azure Automation through a single HTTP request. The first webhook will invoke the runbook at an 80% budget threshold with the resource group name as a parameter, allowing the optional VMs to be stopped. Then, second webhook will invoke the runbook with no parameters (at 100%), which will stop all remaining VM instances.

1. From the **Runbooks** page in the [Azure portal](https://portal.azure.com/), click the **StopAzureV2Vm** runbook that displays the runbook’s overview blade.
2. Click **Webhook** at the top of the page to open the **Add Webhook** blade.
3. Click **Create new webhook** to open the **Create a new webhook** blade.
4. Set the **Name** of the Webhook to **Optional**. The **Enabled** property must be **Yes**. The **Expires** value does not need to be changed. For more information about Webhook properties, see [Details of a webhook](https://docs.microsoft.com/azure/automation/automation-webhooks#details-of-a-webhook).
5. Next to the URL value, click the copy icon to copy the URL of the webhook.
   > [!IMPORTANT]
   > Save the URL of the webhook named **Optional** in a safe place. You will use the URL later in this tutorial. For security reasons, once you create the webhook, you cannot view or retrieve the URL again.
6. Click **OK** to create the new webhook.
7. Click **Configure parameters and run settings** to view parameter values for the runbook.
   > [!NOTE]
   > If the runbook has mandatory parameters, then you are not able to create the webhook unless values are provided.
8. Click **OK** to accept the webhook parameter values.
9. Click **Create** to create the webhook.
10.	Next, follow the steps above to create a second webhook named **Complete**.
    > [!IMPORTANT]
    > Be sure to save both webhook URLs to use later in this tutorial. For security reasons, once you create the webhook, you cannot view or retrieve the URL again.

You should now have two configured webhooks that are each available using the URLs that you saved.

![Webhooks - Optional and Complete](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-02.png)

You’re now done with the Azure Automation setup. You can test the webhooks with a simple Postman test to validate that the webhook works. Next, you must create the Logic App for orchestration.

## Create an Azure Logic App for orchestration

Logic Apps help you build, schedule, and automate processes as workflows so you can integrate apps, data, systems, and services across enterprises or organizations. In this scenario, the [Logic App](https://docs.microsoft.com/azure/logic-apps/) you create will do a little more than just call the automation webhook you created.

Budgets can be set up to trigger a notification when a specified threshold is met. You can provide multiple thresholds to be notified at and the Logic App will demonstrate the ability for you to perform different actions based on the threshold met. In this example, you will set up a scenario where you get a couple of notifications, the first notification is for when 80% of the budget has been reached and the second notification is when 100% of the budget has been reached. The logic app will be used to shut down all VMs in the resource group. First, the **Optional** threshold will be reached at 80%, then the second threshold will be reached where all VMs in the subscription will be shut down.

Logic apps allow you to provide a sample schema for the HTTP trigger, but require you to set the **Content-Type** header. Because the action group does not have custom headers for the webhook, you must parse out the payload in a separate step. You will use the **Parse** action and provide it with a sample payload.

### Create the logic app

The logic app will perform several actions. The following list provides a high-level set of actions that the logic app will perform:
- Recognizes when an HTTP request is received
- Parse the passed in JSON data to determine the threshold value that has been reached
- Use a conditional statement to check whether the threshold amount has reached 80% or more of the budget range, but not greater than or equal to 100%.
    - If this threshold amount has been reached, send an HTTP POST using the webhook named **Optional**. This action will shut down the VMs in the "Optional" group.
- Use a conditional statement to check whether the threshold amount has reached or exceeded 100% of the budget value.
    - If the threshold amount has been reached, send an HTTP POST using the webhook named **Complete**. This action will shut down all remaining VMs.

The following steps are needed to create the logic app that will perform the above steps:

1.	In the [Azure portal](https://portal.azure.com/), select **Create a resource** > **Integration** > **Logic App**.

    ![Azure - Select the Logic App resource](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-03.png)
2.	In the **Create logic app** blade, provide the details need to create your logic app, select **Pin to dashboard**, and click **Create**.

    ![Azure - Create a Logic App](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-03a.png)

After Azure deploys your logic app, the **Logic Apps Designer** opens and shows a blade with an introduction video and commonly used triggers.

### Add a trigger

Every logic app must start with a trigger, which fires when a specific event happens or when a specific condition is met. Each time the trigger fires, the Logic Apps engine creates a logic app instance that starts and runs your workflow. Actions are all the steps that happen after the trigger.

1.	Under **Templates** of the **Logic Apps Designer** blade, choose **Blank Logic App**.
2.	Add a [trigger](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview#logic-app-concepts) by entering "http request" in the **Logic Apps Designer** search box to find and select the trigger named **Request – When an HTTP request is received**.

    ![Azure - Logic app - Http trigger](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-04.png)
3.	Select **New step** > **Add an action**.

    ![Azure - New step - Add an action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-05.png)
4.	Search for "parse JSON" in the **Logic Apps Designer** search box to find and select the **Data Operations - Parse JSON** [action](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview#logic-app-concepts).

    ![Azure - Logic app - Add parse JSON action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-06.png)
5.	Enter "Payload" as the **Content** name for the Parse JSON payload or use the "Body" tag from dynamic content.
6.	Select the **Use sample payload to generate schema** option in the **Parse JSON** box.

    ![Azure - Logic app - Use sample JSON data to generate schema](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-07.png)
7.	Paste the following JSON sample payload into the textbox:
    `{"schemaId":"AIP Budget Notification","data":{"SubscriptionName":"CCM - Microsoft Azure Enterprise - 1","SubscriptionId":"<GUID>","SpendingAmount":"100","BudgetStartDate":"6/1/2018","Budget":"50","Unit":"USD","BudgetCreator":"email@contoso.com","BudgetName":"BudgetName","BudgetType":"Cost","ResourceGroup":"","NotificationThresholdAmount":"0.8"}}`

    The textbox will appear as the following:

    ![Azure - Logic app - The sample JSON payload](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-08.png)
8.	Click **Done**.

### Add the first conditional action

Use a conditional statement to check whether the threshold amount has reached 80% or more of the budget range, but not greater than or equal to 100%. If this threshold amount has been reached, send an HTTP POST using the webhook named **Optional**. This action will shut down the VMs in the **Optional** group.

1.	Select **New step** > **Add a condition**.

    ![Azure - Logic app - Add a condition](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-09.png)
2.	In the **Condition** box, click the textbox containing **Choose a value** to display a list of available values.

    ![Azure - Logic app - Condition box](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-10.png)

3.	Click **Expression** at the top of the list and enter the following expression in the expression editor:
    `float()`

    ![Azure - Logic app - Float expression](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-11.png)

4.	Select **Dynamic content**, place the cursor inside the parenthesis (), and select **NotificationThresholdAmount** from the list to populate the complete expression.

    The expression will be the following:<br>
    `float(body('Parse_JSON')?['data']?['NotificationThresholdAmount'])`

5.	Select **OK** to set the expression.
6.	Select **is greater than or equal to** in the dropdown box of the **Condition**.
7.	In the **Choose a value** box of the condition enter `.8`.

    ![Azure - Logic app - Float expression with a value](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-12.png)

8.	Click **Add** > **Add row** within the Condition box to add an additional part of the condition.
9.	In the **Condition** box, click the textbox containing **Choose a value**.
10.	Click **Expression** at the top of the list and enter the following expression in the expression editor:
    `float()`
11.	Select **Dynamic content**, place the cursor inside the parenthesis (), and select **NotificationThresholdAmount** from the list to populate the complete expression.
12.	Select **OK** to set the expression.
13.	Select **is less than** in the dropdown box of the **Condition**.
14.	In the **Choose a value** box of the condition enter `1`.

    ![Azure - Logic app - Float expression with a value](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-13.png)

15.	In the **If true** box, select **Add an action**. You will add an HTTP POST action that will shut down optional VMs.

    ![Azure - Logic app - Add an action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-14.png)

16.	Enter **HTTP** to search for the HTTP action and select the **HTTP – HTTP** action.

    ![Azure - Logic app - Add HTTP action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-15.png)

17.	Select **Post** as the for the **Method** value.
18.	Enter the URL for the webhook named **Optional** that you created earlier in this tutorial as the **Uri** value.

    ![Azure - Logic app - HTTP action URI](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-16.png)

19.	Select **Add an action** in the **If true** box. You will add an email action that will send an email notifying the recipient that the optional VMs have been shut down.
20.	Search for "send email" and select a *send email* action based on the email service you use.

    ![Azure - Logic app - Send email action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-17.png)

    For personal Microsoft accounts, select **Outlook.com**. For Azure work or school accounts, select **Office 365 Outlook**. If you don't already have a connection, you're asked to sign in to your email account. Logic Apps creates a connection to your email account.

    You will need to allow the Logic App to access your email information.

    ![Azure - Logic app - Access notice](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-18.png)

21.	Add the **To**, **Subject**, and **Body** text for the email that notifies the recipient that the optional VMs have been shut down. Use the **BudgetName** and the **NotificationThresholdAmount** dynamic content to populate the subject and body fields.

    ![Azure - Logic app - Email details](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-19.png)

### Add the second conditional action

Use a conditional statement to check whether the threshold amount has reached or exceeded 100% of the budget value. If the threshold amount has been reached, send an HTTP POST using the webhook named **Complete**. This action will shut down all remaining VMs.

1.	Select **New step** > **Add a Condition**.

    ![Azure - Logic app - Add action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-20.png)

2.	In the **Condition** box, click the textbox containing **Choose a value** to display a list of available values.
3.	Click **Expression** at the top of the list and enter the following expression in the expression editor:
    `float()`
4.	Select **Dynamic content**, place the cursor inside the parenthesis (), and select **NotificationThresholdAmount** from the list to populate the complete expression.

    The expression will be the following:<br>
    `float(body('Parse_JSON')?['data']?['NotificationThresholdAmount'])`

5.	Select **OK** to set the expression.
6.	Select **is greater than or equal to** in the dropdown box of the **Condition**.
7.	In the **Choose a value box** of the condition enter `1`.

    ![Azure - Logic app - Set condition value](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-21.png)

8.	In the **If true** box, select **Add an action**. You will add an HTTP POST action that will shut down all the remaining VMs.

    ![Azure - Logic app - Add an action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-22.png)

9.	Enter **HTTP** to search for the HTTP action and select the **HTTP – HTTP** action.
10.	Select **Post** as the for the **Method** value.
11.	Enter the URL for the webhook named **Complete** that you created earlier in this tutorial as the **Uri** value.

    ![Azure - Logic app - Add an action](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-23.png)

12.	Select **Add an action** in the **If true** box. You will add an email action that will send an email notifying the recipient that the remaining VMs have been shut down.
13.	Search for "send email" and select a *send email* action based on the email service you use.
14.	Add the **To**, **Subject**, and **Body** text for the email that notifies the recipient that the optional VMs have been shut down. Use the **BudgetName** and the **NotificationThresholdAmount** dynamic content to populate the subject and body fields.

    ![Azure - Logic app - Send email details](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-24.png)

15.	Click **Save** at the top of the **Logic App Designer** blade.

### Logic App summary

Here’s what your Logic App looks like once you’re done. In the most basic of scenarios where you don’t need any threshold-based orchestration, you could directly call the automation script from **Monitor** and skip the **Logic App** step.

   ![Azure - Logic app - Complete view](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-25.png)

When you saved your logic app, a URL was generated that you will be able to call. You’ll use this URL in the next section of this tutorial.

## Create an Azure Monitor Action Group

An action group is a collection of notification preferences that you define. When an alert is triggered, a specific action group can receive the alert by being notified. An Azure alert proactively raises a notification based on specific conditions and provides the opportunity to take action. An alert can use data from multiple sources, including metrics and logs.

Action groups are the only endpoint that you will integrate with your budget. You can set up notifications in a number of channels, but for this scenario you will focus on the Logic App you created earlier in this tutorial.

### Create an action group in Azure Monitor

When you create the action group, you will point to the Logic App that you created earlier in this tutorial.

1.	If you are not already signed-in to the [Azure portal](https://portal.azure.com/), sign-in and select **All services** > **Monitor**.
2.	Select **Actions groups** from the **Setting** section.
3.	Select **Add an action group** from the **Action groups** blade.
4.	Add and verify the following items:
    - Action group name
    - Short name
    - Subscription
    - Resource group

    ![Azure - Logic app - Add an action group](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-26.png)

5.	Within the **Add action group** pane, add a LogicApp action. Name the action **Budget-BudgetLA**. In the **Logic App** pane, select the **Subscription** and the **Resource group**. Then, select the **Logic app** that you created earlier in this tutorial.
6.	Click **OK** to set the Logic App. Then, select **OK** in the **Add action group** pane to create the action group.

You’re done with all the supporting components needed to effectively orchestrate your budget. Now all you need to do is create the budget and configure it to use the action group you created.

## Create the Azure Budget

You can create a budget in the Azure portal using the [Budget feature](../cost-management/tutorial-acm-create-budgets.md) in Cost Management. Or, you can create a budget using REST APIs, Powershell cmdlets, or use the CLI. The following procedure uses the REST API. Before calling the REST API, you will need an authorization token. To create an authorization token, you can use the [ARMClient](https://github.com/projectkudu/ARMClient) project. The **ARMClient** allows you to authenticate yourself to the Azure Resource Manager and get a token to call the APIs.

### Create an authentication token

1.	Navigate to the [ARMClient](https://github.com/projectkudu/ARMClient) project on GitHub.
2.	Clone the repo to get a local copy.
3.	Open the project in Visual Studio and build it.
4.	Once the build is successful, the executable should be in the *\bin\debug* folder.
5.	Run the ARMClient. Open a command prompt and navigate to the *\bin\debug* folder from the project root.
6.	To login and authenticate, enter the following command at the command prompt:<br>
    `ARMClient login prod`
7.	Copy the **subscription guid** from the output.
8.	To copy an authorization token to your clipboard, enter the following command at the command prompt, but sure to use the copied subscription ID from the step above: <br>
    `ARMClient token <subscription GUID from previous step>`

    Once you have completed the step above, you will see the following:<br>
    **Token copied to clipboard successfully.**
9.	Save the token to be used for steps in the next section of this tutorial.

### Create the Budget

Next, you will configure **Postman** to create a budget by calling the Azure Consumption REST APIs. Postman is an API Development environment. You will import environment and collection files into Postman. The collection contains grouped definitions of HTTP requests that call Azure Consumption REST APIs. The environment file contains variables that are used by the collection.

1.	Download and open the [Postman REST client](https://www.getpostman.com/) to execute the REST APIs.
2.	In Postman, create a new request.

    ![Postman - Create a new request](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-27.png)

3.	Save the new request as a collection, so that the new request has nothing on it.

    ![Postman - Save the new request](./media/billing-cost-management-budget-scenario/billing-cost-management-budget-scenario-28.png)

4.	Change the request from a `Get` to a `Put` action.
5.	Modify the following URL by replacing `{subscriptionId}` with the **Subscription ID** that you used in the previous section of this tutorial. Also, modify the URL to include "SampleBudget" as the value for `{budgetName}`:
    `https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Consumption/budgets/{budgetName}?api-version=2018-03-31`
6.	Select the **Headers** tab within Postman.
7.	Add a new **Key** named "Authorization".
8.	Set the **Value** to the token that was created using the ArmClient at the end of the last section.
9.	Select **Body** tab within Postman.
10.	Select the **raw** button option.
11.	In the textbox, paste in the below sample budget definition, however you must replace the **subscriptionid**, **budgetname**, and **actiongroupname** parameters with your subscription ID, a unique name for your budget, and the action group name you created in both the URL and the request body:

    ```
        {
            "properties": {
                "category": "Cost",
                "amount": 100.00,
                "timeGrain": "Monthly",
                "timePeriod": {
                "startDate": "2018-06-01T00:00:00Z",
                "endDate": "2018-10-31T00:00:00Z"
                },
                "filters": {
                },
            "notifications": {
                "Actual_GreaterThan_80_Percent": {
                    "enabled": true,
                    "operator": "GreaterThan",
                    "threshold": 80,
                    "contactEmails": [
                    ],
                    "contactRoles": [
                    ],
                    "contactGroups": [
                    "/subscriptions/{subscriptionid}/resourceGroups/{resourcegroupname}/providers/microsoft.insights/actionGroups/{actiongroupname}
                    ]
                },
            "Actual_EqualTo_100_Percent": {
                    "operator": "EqualTo",
                    "threshold": 100,
                    "contactGroups": [
                "/subscriptions/{subscriptionid}/resourceGroups/{resourcegroupname}/providers/microsoft.insights/actionGroups/{actiongroupname}"
                    ]
                }
            }
        }
    ```
12.	Press **Send** to send the request.

You now have all the pieces you need to call the [budgets API](https://docs.microsoft.com/rest/api/consumption/budgets). The budgets API reference has additional details on the specific requests, including the following:
    - **budgetName** - Multiple budgets are supported.  Budget names must be unique.
    - **category** - Must be either **Cost** or **Usage**. The API supports both cost and usage budgets.
    - **timeGrain** - A monthly, quarterly, or yearly budget. The amount resets at the end of the period.
    - **filters** - Filters allow you to narrow the budget to a specific set of resources within the selected scope. For example, a filter could be a collection of resource groups for a subscription level budget.
    - **notifications** – Determines the notification details and thresholds. You can set up multiple thresholds and provide an email address or an action group to receive a notification.

## Summary

By following this tutorial, you learned:
- How to create an Azure Automation Runbook to stop VMs.
- How to create an Azure Logic App that is triggered based on the budget threshold values and call the related runbook with the right parameters.
- How to create an Azure Monitor Action Group that will was configured to trigger the Azure Logic App when the budget threshold is met.
- How to create the Azure budget with the desired thresholds and wire it to the action group.

You now have a fully functional budget for your subscription that will shut down your VMs when you reach your configured budget thresholds.

## Next steps

- For more information about Azure billing scenarios, see [Billing and cost management automation scenarios](billing-cost-management-automation-scenarios.md).
