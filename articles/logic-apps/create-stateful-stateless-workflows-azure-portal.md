---
title: Create Logic Apps Preview workflows in the Azure portal
description: Build and run workflows for automation and integration scenarios with Azure Logic Apps Preview in the Azure portal.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm, az-logic-apps-dev
ms.topic: conceptual
ms.date: 03/08/2021
---

# Create stateful and stateless workflows in the Azure portal with Azure Logic Apps Preview

> [!IMPORTANT]
> This capability is in public preview, is provided without a service level agreement, and is not recommended for production workloads. 
> Certain features might not be supported or might have constrained capabilities. For more information, see 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With [Azure Logic Apps Preview](logic-apps-overview-preview.md), you can build automation and integration solutions across apps, data, cloud services, and systems by creating and running logic apps that include [*stateful* and *stateless* workflows](logic-apps-overview-preview.md#stateful-stateless) in the Azure portal by starting with the new **Logic App (Preview)** resource type. With this new logic app type, you can build multiple workflows that are powered by the redesigned Azure Logic Apps Preview runtime, which provides portability, better performance, and flexibility for deploying and running in various hosting environments, not only Azure, but also Docker containers. To learn more about the new logic app type, see [Overview for Azure Logic Apps Preview](logic-apps-overview-preview.md).

![Screenshot that shows the Azure portal with the workflow designer for the "Logic App (Preview)" resource.](./media/create-stateful-stateless-workflows-azure-portal/azure-portal-logic-apps-overview.png)

In the Azure portal, you can start by creating a new **Logic App (Preview)** resource. While you can also start by [creating a project in Visual Studio Code with the Azure Logic Apps (Preview) extension](create-stateful-stateless-workflows-visual-studio-code.md), both approaches provide the capability for you to deploy and run your logic app in the same kinds of hosting environments.

Meanwhile, you can still create the original logic app type. Although the development experiences in the portal differ between the original and new logic app types, your Azure subscription can include both types. You can view and access all the deployed logic apps in your Azure subscription, but the apps are organized into their own categories and sections.

This article shows how to build your logic app and workflow in the Azure portal by using the **Logic App (Preview)** resource type and performing these high-level tasks:

* Create the new logic app resource and add a blank workflow.

* Add a trigger and action.

* Trigger a workflow run.

* View the workflow's run and trigger history.

* Enable or open the Application Insights after deployment.

* Enable run history for stateless workflows.

> [!NOTE]
> For information about current known issues, review the [Logic Apps Public Preview Known Issues page in GitHub](https://github.com/Azure/logicapps/blob/master/articles/logic-apps-public-preview-known-issues.md).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An [Azure Storage account](../storage/common/storage-account-overview.md) because the **Logic App (Preview)** resource is powered by Azure Functions and has [storage requirements that are similar to function apps](../azure-functions/storage-considerations.md). You can use an existing storage account, or you can create a storage account in advance or during logic app creation.

  > [!NOTE]
  > [Stateful logic apps](logic-apps-overview-preview.md#stateful-stateless) perform storage transactions, such as 
  > using queues for scheduling and storing workflow states in tables and blobs. These transactions incur 
  > [Azure Storage charges](https://azure.microsoft.com/pricing/details/storage/). For more information about 
  > how stateful logic apps store data in external storage, see [Stateful versus stateless](logic-apps-overview-preview.md#stateful-stateless).

* To deploy to a Docker container, you need an existing Docker container image. For example, you can create this image through [Azure Container Registry](../container-registry/container-registry-intro.md), [App Service](../app-service/overview.md), or [Azure Container Instance](../container-instances/container-instances-overview.md). 

* To build the same example logic app in this article, you need an Office 365 Outlook email account that uses a Microsoft work or school account to sign in.

  If you choose to use a different [email connector that's supported by Azure Logic Apps](/connectors/), such as Outlook.com or [Gmail](../connectors/connectors-google-data-security-privacy-policy.md), you can still follow the example, and the general overall steps are the same, but your user interface and options might differ in some ways. For example, if you use the Outlook.com connector, use your personal Microsoft account instead to sign in.

* To test the example logic app that you create in this article, you need a tool that can send calls to the Request trigger, which is the first step in example logic app. If you don't have such a tool, you can download, install, and use [Postman](https://www.postman.com/downloads/).

* If you create your logic app with settings that support using [Application Insights](../azure-monitor/app/app-insights-overview.md), you can optionally enable diagnostics logging and tracing for your logic app. You can do so either when you create your logic app or after deployment. You need to have an Application Insights instance, but you can create this resource either [in advance](../azure-monitor/app/create-workspace-resource.md), when you create your logic app, or after deployment.

## Create the logic app resource

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

1. In the Azure portal search box, enter `logic app preview`, and select **Logic App (Preview)**.

   ![Screenshot that shows the Azure portal search box with the "logic app preview" search term and the "Logic App (Preview)" resource selected.](./media/create-stateful-stateless-workflows-azure-portal/find-logic-app-resource-template.png)

1. On the **Logic App (Preview)** page, select **Add**.

1. On the **Create Logic App (Preview)** page, on the **Basics** tab, provide this information about your logic app.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for your logic app. |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | The Azure resource group where you create your logic app and related resources. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <p><p>This example creates a resource group named `Fabrikam-Workflows-RG`. |
   | **Logic app name** | Yes | <*logic-app-name*> | The name to use for your logic app. This resource name must be unique across regions and can contain only letters, numbers, hyphens (**-**), underscores (**_**), parentheses (**()**), and periods (**.**). <p><p>This example creates a logic app named `Fabrikam-Workflows`. <p><p>**Note**: Your logic app's name automatically gets the suffix, `.azurewebsites.net`, because the **Logic App (Preview)** resource is powered by Azure Functions, which uses the same app naming convention. |
   | **Publish** | Yes | <*deployment-environment*> | The deployment destination for your logic app. You can deploy to Azure by selecting **Workflow** or **Docker Container**. <p><p>This example uses **Workflow**, which deploys the **Logic App (Preview)** resource to the Azure portal. <p><p>**Note**: Before you select **Docker Container**, make sure that create your Docker container image. For example, you can create this image through [Azure Container Registry](../container-registry/container-registry-intro.md), [App Service](../app-service/overview.md), or [Azure Container Instance](../container-instances/container-instances-overview.md). That way, after you select **Docker Container**, you can [specify the container that you want to use in your logic app's settings](#set-docker-container). |
   | **Region** | Yes | <*Azure-region*> | The Azure region to use when creating your resource group and resources. <p><p>This example uses **West US**. |
   |||||

   Here's an example:

   ![Screenshot that shows the Azure portal and "Create Logic App (Preview)" page.](./media/create-stateful-stateless-workflows-azure-portal/create-logic-app-resource-portal.png)

1. Next, on the **Hosting** tab, provide this information about the storage solution and hosting plan to use for your logic app.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Storage account** | Yes | <*Azure-storage-account-name*> | The [Azure Storage account](../storage/common/storage-account-overview.md) to use for storage transactions. This resource name must be unique across regions and have 3-24 characters with only numbers and lowercase letters. Either select an existing account or create a new account. <p><p>This example creates a storage account named `fabrikamstorageacct`. |
   | **Plan type** | Yes | <*Azure-hosting-plan*> | The [hosting plan](../app-service/overview-hosting-plans.md) to use for deploying your logic app, which is either [**Functions Premium**](../azure-functions/functions-premium-plan.md) or [**App service plan** (Dedicated)](../azure-functions/dedicated-plan.md). Your choice affects the capabilities and pricing tiers that are later available to you. <p><p>This example uses the **App service plan**. <p><p>**Note**: Similar to Azure Functions, the **Logic App (Preview)** resource type requires a hosting plan and pricing tier. Consumption plans aren't supported nor available for this resource type. For more information, review these topics: <p><p>- [Azure Functions scale and hosting](../azure-functions/functions-scale.md) <br>- [App Service pricing details](https://azure.microsoft.com/pricing/details/app-service/) <p><p>For example, the Functions Premium plan provides access to networking capabilities, such as connect and integrate privately with Azure virtual networks, similar to Azure Functions when you create and deploy your logic apps. For more information, review these topics: <p><p>- [Azure Functions networking options](../azure-functions/functions-networking-options.md) <br>- [Azure Logic Apps Running Anywhere - Networking possibilities with Azure Logic Apps Preview](https://techcommunity.microsoft.com/t5/integrations-on-azure/logic-apps-anywhere-networking-possibilities-with-logic-app/ba-p/2105047) |
   | **Windows Plan** | Yes | <*plan-name*> | The plan name to use. Either select an existing plan or provide the name for a new plan. <p><p>This example uses the name `Fabrikam-Service-Plan`. |
   | **SKU and size** | Yes | <*pricing-tier*> | The [pricing tier](../app-service/overview-hosting-plans.md) to use for hosting your logic app. Your choices are affected by the plan type that you previously chose. To change the default tier, select **Change size**. You can then select other pricing tiers, based on the workload that you need. <p><p>This example uses the free **F1 pricing tier** for **Dev / Test** workloads. For more information, review [App Service pricing details](https://azure.microsoft.com/pricing/details/app-service/). |
   |||||

1. Next, if your creation and deployment settings support using [Application Insights](../azure-monitor/app/app-insights-overview.md), you can optionally enable diagnostics logging and tracing for your logic app.

   1. On the **Monitoring** tab, under **Application Insights**, set **Enable Application Insights** to **Yes** if not already selected.

   1. For the **Application Insights** setting, either select an existing Application Insights instance, or if you want to create a new instance, select **Create new** and provide the name that you want to use.

1. After Azure validates your logic app's settings, on the **Review + create** tab, select **Create**.

   For example:

   ![Screenshot that shows the Azure portal and new logic app resource settings.](./media/create-stateful-stateless-workflows-azure-portal/check-logic-app-resource-settings.png)

   > [!TIP]
   > If you get a validation error after you select **Create**, open and review the error details. 
   > For example, if your selected region reaches a quota for resources that you're trying to create, 
   > you might have to try a different region.

   After Azure finishes deployment, your logic app is automatically live and running but doesn't do anything yet because no workflows exist.

1. On the deployment completion page, select **Go to resource** so that you can start building your workflow. If you selected **Docker Container** for deploying your logic app, continue with the [steps to provide information about that Docker container](#set-docker-container).

   ![Screenshot that shows the Azure portal and the finished deployment.](./media/create-stateful-stateless-workflows-azure-portal/logic-app-completed-deployment.png)

<a name="set-docker-container"></a>

## Specify Docker container for deployment

Before you start these steps, you need a Docker container image. For example, you can create this image through [Azure Container Registry](../container-registry/container-registry-intro.md), [App Service](../app-service/overview.md), or [Azure Container Instance](../container-instances/container-instances-overview.md). You can then provide information about your Docker container after you create your logic app.

1. In the Azure portal, go to your logic app resource.

1. On the logic app menu, under **Settings**, select **Deployment Center**.

1. On the **Deployment Center** pane, follow the instructions for providing and managing the details for your Docker container.

<a name="add-workflow"></a>

## Add a blank workflow

1. After Azure opens the resource, on your logic app's menu, select **Workflows**. On the **Workflows** toolbar, select **Add**.

   ![Screenshot that shows the logic app resource menu with "Workflows" selected, and then hen on the toolbar, "Add" is selected.](./media/create-stateful-stateless-workflows-azure-portal/logic-app-add-blank-workflow.png)

1. After the **New workflow** pane opens, provide a name for your workflow, and choose either the [**Stateful** or **Stateless**](logic-apps-overview-preview.md#stateful-stateless) workflow type. When you're done, select **Create**.

   This example adds a blank stateful workflow named `Fabrikam-Stateful-Workflow`. By default, the workflow is enabled but doesn't do anything until you add a trigger and actions.

   ![Screenshot that shows the newly added blank stateful workflow "Fabrikam-Stateful-Workflow".](./media/create-stateful-stateless-workflows-azure-portal/logic-app-blank-workflow-created.png)

1. Next, open the blank workflow in the designer so that you can add a trigger and an action.

   1. From the workflow list, select the blank workflow.

   1. On the workflow menu, under **Developer**, select **Designer**.

      On the designer surface, the **Choose an operation** prompt already appears and is selected by default so that the **Add a trigger** pane also appears open.

      ![Screenshot that shows the opened workflow designer with "Choose an operation" selected on the designer surface.](./media/create-stateful-stateless-workflows-azure-portal/opened-logic-app-designer-blank-workflow.png)

<a name="add-trigger-actions"></a>

## Add a trigger and an action

This example builds a workflow that has these steps:

* The built-in [Request trigger](../connectors/connectors-native-reqres.md), **When a HTTP request is received**, which receives inbound calls or requests and creates an endpoint that other services or logic apps can call.

* The [Office 365 Outlook action](../connectors/connectors-create-api-office365-outlook.md), **Send an email**.

* The built-in [Response action](../connectors/connectors-native-reqres.md), which you use to send a reply and return data back to the caller.

### Add the Request trigger

Before you can add a trigger to a blank workflow, make sure that the workflow designer is open and that the **Choose an operation** prompt is selected on the designer surface.

1. Next to the designer surface, in the **Add a trigger** pane, under the **Choose an operation** search box, check that the **Built-in** tab is selected. This tab shows triggers that run natively in Azure Logic Apps.

1. In the **Choose an operation** search box, enter `when a http request`, and select the built-in Request trigger that's named **When a HTTP request is received**.

   ![Screenshot that shows the designer and **Add a trigger** pane with "When a HTTP request is received" trigger selected.](./media/create-stateful-stateless-workflows-azure-portal/find-request-trigger.png)

   When the trigger appears on the designer, the trigger's details pane opens to show the trigger's properties, settings, and other actions.

   ![Screenshot that shows the designer with the "When a HTTP request is received" trigger selected and trigger details pane open.](./media/create-stateful-stateless-workflows-azure-portal/request-trigger-added-to-designer.png)

   > [!TIP]
   > If the details pane doesn't appear, makes sure that the trigger is selected on the designer.

1. If you need to delete an item from the designer, [follow these steps for deleting items from the designer](#delete-from-designer).

1. To save your work, on the designer toolbar, select **Save**.

   When you save a workflow for the first time, and that workflow starts with a Request trigger, the Logic Apps service automatically generates a URL for an endpoint that's created by the Request trigger. Later, when you test your workflow, you send a request to this URL, which fires the trigger and starts the workflow run.

### Add the Office 365 Outlook action

1. On the designer, under the trigger that you added, select **New step**.

   The **Choose an operation** prompt appears on the designer, and the **Add an action** pane reopens so that you can select the next action.

   > [!NOTE]
   > If the **Add an action** pane shows the error message, 'Cannot read property 'filter' of undefined`, 
   > save your workflow, reload the page, reopen your workflow, and try again.

1. In the **Add an action** pane, under the **Choose an operation** search box, select **Azure**. This tab shows the managed connectors that are available and deployed in Azure.

   > [!NOTE]
   > If the **Add an action** pane shows the error message, `The access token expiry UTC time '{token-expiration-date-time}' is earlier than current UTC time '{current-date-time}'`, 
   > save your workflow, reload the page, reopen your workflow, and try adding the action again.

   This example uses the Office 365 Outlook action named **Send an email (V2)**.

   ![Screenshot that shows the designer and the **Add an action** pane with the Office 365 Outlook "Send an email" action selected.](./media/create-stateful-stateless-workflows-azure-portal/find-send-email-action.png)

1. In the action's details pane, on the **Create Connection** tab, select **Sign in** so that you can create a connection to your email account.

   ![Screenshot that shows the designer and the "Send an email (V2)" details pane with "Sign in" selected.](./media/create-stateful-stateless-workflows-azure-portal/send-email-action-sign-in.png)

1. When you're prompted for consent to access your email account, sign in with your account credentials.

   > [!NOTE]
   > If you get the error message, `Failed with error: 'The browser is closed.'. Please sign in again`, 
   > check whether your browser blocks third-party cookies. If these cookies are blocked, 
   > try adding `https://portal.azure.com` to the list of sites that can use cookies. 
   > If you're using incognito mode, make sure that third-party cookies aren't blocked while working in that mode.
   > 
   > If necessary, reload the page, open your workflow, add the email action again, and try creating the connection.

   After Azure creates the connection, the **Send an email** action appears on the designer and is selected by default. If the action isn't selected, select the action so that its details pane is also open.

1. In the action's details pane, on the **Parameters** tab, provide the required information for the action, for example:

   ![Screenshot that shows the designer and the "Send an email" details pane with the "Parameters" tab selected.](./media/create-stateful-stateless-workflows-azure-portal/send-email-action-details.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **To** | Yes | <*your-email-address*> | The email recipient, which can be your email address for test purposes. This example uses the fictitious email, `sophiaowen@fabrikam.com`. |
   | **Subject** | Yes | `An email from your example workflow` | The email subject |
   | **Body** | Yes | `Hello from your example workflow!` | The email body content |
   ||||

   > [!NOTE]
   > When making any changes in the details pane on the **Settings**, **Static Result**, or **Run After** tabs, 
   > make sure that you select **Done** to commit those changes before you switch tabs or change focus to the designer. 
   > Otherwise, the designer won't keep your changes.

1. Save your work. On the designer toolbar, select **Save**.

1. If your environment has strict network requirements or firewalls that limit traffic, you have to set up permissions for any trigger or action connections that exist in your workflow. To find the fully qualified 

   Otherwise, to test your workflow, [manually trigger a run](#trigger-workflow).

<a name="firewall-setup"></a>

##  Find domain names for firewall access

Before you deploy your logic app and run your workflow in the Azure portal, if your environment has strict network requirements or firewalls that limit traffic, you have to set up network or firewall permissions for any trigger or action connections in the workflows that exist in your logic app.

To find the fully qualified domain names (FQDNs) for these connections, follow these steps:

1. On your logic app menu, under **Workflows**, select **Connections**. On the **API Connections** tab, select the connection's resource name, for example:

   ![Screenshot that shows the Azure portal and logic app menu with the "Connections" and "offic365" connection resource name selected.](./media/create-stateful-stateless-workflows-azure-portal/logic-app-connections.png)

1. Expand your browser wide enough so that when **JSON View** appears in the browser's upper right corner, select **JSON View**.

   ![Screenshot that shows the Azure portal and API Connection pane with "JSON View" selected.](./media/create-stateful-stateless-workflows-azure-portal/logic-app-connection-view-json.png)

1. Find, copy, and save the `connectionRuntimeUrl` property value somewhere safe so that you can set up your firewall with this information.

   ![Screenshot that shows the "connectionRuntimeUrl" property value selected.](./media/create-stateful-stateless-workflows-azure-portal/logic-app-connection-runtime-url.png)

1. For each connection, repeat the relevant steps.

<a name="trigger-workflow"></a>

## Trigger the workflow

In this example, the workflow runs when the Request trigger receives an inbound request, which is sent to the URL for the endpoint that's created by the trigger. When you saved the workflow for the first time, the Logic Apps service automatically generated this URL. So, before you can send this request to trigger the workflow, you need to find this URL.

1. On the workflow designer, select the Request trigger that's named **When a HTTP request is received**.

1. After the details pane opens, on the **Parameters** tab, find the **HTTP POST URL** property. To copy the generated URL, select the **Copy Url** (copy file icon), and save the URL somewhere else for now. The URL follows this format:

   `http://<logic-app-name>.azurewebsites.net:443/api/<workflow-name>/triggers/manual/invoke?api-version=2020-05-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=<shared-access-signature>`

   ![Screenshot that shows the designer with the Request trigger and endpoint URL in the "HTTP POST URL" property.](./media/create-stateful-stateless-workflows-azure-portal/find-request-trigger-url.png)

   For this example, the URL looks like this:

   `https://fabrikam-workflows.azurewebsites.net:443/api/Fabrikam-Stateful-Workflow/triggers/manual/invoke?api-version=2020-05-01-preview&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xxxxxXXXXxxxxxXXXXxxxXXXXxxxxXXXX`

   > [!TIP]
   > You can also find the endpoint URL on your logic app's **Overview** pane in the **Workflow URL** property.
   >
   > 1. On the resource menu, select **Overview**.
   > 1. On the **Overview** pane, find the **Workflow URL** property.
   > 1. To copy the endpoint URL, move your pointer over the end of the endpoint URL text, 
   >    and select **Copy to clipboard** (copy file icon).

1. To test the URL by sending a request, open [Postman](https://www.postman.com/downloads/) or your preferred tool for creating and sending requests.

   This example continues by using Postman. For more information, see [Postman Getting Started](https://learning.postman.com/docs/getting-started/introduction/).

   1. On the Postman toolbar, select **New**.

      ![Screenshot that shows Postman with New button selected](./media/create-stateful-stateless-workflows-azure-portal/postman-create-request.png)

   1. On the **Create New** pane, under **Building Blocks**, select **Request**.

   1. In the **Save Request** window, under **Request name**, provide a name for the request, for example, `Test workflow trigger`.

   1. Under **Select a collection or folder to save to**, select **Create Collection**.

   1. Under **All Collections**, provide a name for the collection to create for organizing your requests, press Enter, and select **Save to <*collection-name*>**. This example uses `Logic Apps requests` as the collection name.

      Postman's request pane opens so that you can send a request to the endpoint URL for the Request trigger.

      ![Screenshot that shows Postman with the opened request pane](./media/create-stateful-stateless-workflows-azure-portal/postman-request-pane.png)

   1. On the request pane, in the address box that's next to the method list, which currently shows **GET** as the default request method, paste the URL that you previously copied, and select **Send**.

      ![Screenshot that shows Postman and endpoint URL in the address box with Send button selected](./media/create-stateful-stateless-workflows-azure-portal/postman-test-endpoint-url.png)

      When the trigger fires, the example workflow runs and sends an email that appears similar to this example:

      ![Screenshot that shows Outlook email as described in the example](./media/create-stateful-stateless-workflows-azure-portal/workflow-app-result-email.png)

<a name="view-run-history"></a>

## Review run history

For a stateful workflow, after each workflow run, you can view the run history, including the status for the overall run, for the trigger, and for each action along with their inputs and outputs. In the Azure portal, run history and trigger histories appear at the workflow level, not the logic app level. To review the trigger histories outside the run history context, see [Review trigger histories](#view-trigger-histories).

1. In the Azure portal, on your workflow's menu, select **Monitor**.

   The **Monitor** pane shows the run history for that workflow.

   ![Screenshot that shows the workflow's "Monitor" pane and run history.](./media/create-stateful-stateless-workflows-azure-portal/find-run-history.png)

   > [!TIP]
   > If the most recent run status doesn't appear, on the **Monitor** pane toolbar, select **Refresh**. 
   > No run happens for a trigger that's skipped due to unmet criteria or finding no data.

   | Run status | Description |
   |------------|-------------|
   | **Aborted** | The run stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | The run was triggered and started but received a cancel request. |
   | **Failed** | At least one action in the run failed. No subsequent actions in the workflow were set up to handle the failure. |
   | **Running** | The run was triggered and is in progress, but this status can also appear for a run that is throttled due to [action limits](logic-apps-limits-and-config.md) or the [current pricing plan](https://azure.microsoft.com/pricing/details/logic-apps/). <p><p>**Tip**: If you set up [diagnostics logging](monitor-logic-apps-log-analytics.md), you can get information about any throttle events that happen. |
   | **Succeeded** | The run succeeded. If any action failed, a subsequent action in the workflow handled that failure. |
   | **Timed out** | The run timed out because the current duration exceeded the run duration limit, which is controlled by the [**Run history retention in days** setting](logic-apps-limits-and-config.md#run-duration-retention-limits). A run's duration is calculated by using the run's start time and run duration limit at that start time. <p><p>**Note**: If the run's duration also exceeds the current *run history retention limit*, which is also controlled by the [**Run history retention in days** setting](logic-apps-limits-and-config.md#run-duration-retention-limits), the run is cleared from the runs history by a daily cleanup job. Whether the run times out or completes, the retention period is always calculated by using the run's start time and *current* retention limit. So, if you reduce the duration limit for an in-flight run, the run times out. However, the run either stays or is cleared from the runs history based on whether the run's duration exceeded the retention limit. |
   | **Waiting** | The run hasn't started or is paused, for example, due to an earlier workflow instance that's still running. |
   |||

1. To review the status for each step in a run, select the run that you want to review.

   The run details view opens and shows the status for each step in the run.

   ![Screenshot that shows the run details view with the status for each step in the workflow.](./media/create-stateful-stateless-workflows-azure-portal/review-run-details.png)

   Here are the possible statuses that each step in the workflow can have:

   | Action status | Icon | Description |
   |---------------|------|-------------|
   | **Aborted** | ![Icon for "Aborted" action status][aborted-icon] | The action stopped or didn't finish due to external problems, for example, a system outage or lapsed Azure subscription. |
   | **Cancelled** | ![Icon for "Cancelled" action status][cancelled-icon] | The action was running but received a cancel request. |
   | **Failed** | ![Icon for "Failed" action status][failed-icon] | The action failed. |
   | **Running** | ![Icon for "Running" action status][running-icon] | The action is currently running. |
   | **Skipped** | ![Icon for "Skipped" action status][skipped-icon] | The action was skipped because the immediately preceding action failed. An action has a `runAfter` condition that requires that the preceding action finishes successfully before the current action can run. |
   | **Succeeded** | ![Icon for "Succeeded" action status][succeeded-icon] | The action succeeded. |
   | **Succeeded with retries** | ![Icon for "Succeeded with retries" action status][succeeded-with-retries-icon] | The action succeeded but only after one or more retries. To review the retry history, in the run history details view, select that action so that you can view the inputs and outputs. |
   | **Timed out** | ![Icon for "Timed out" action status][timed-out-icon] | The action stopped due to the timeout limit specified by that action's settings. |
   | **Waiting** | ![Icon for "Waiting" action status][waiting-icon] | Applies to a webhook action that's waiting for an inbound request from a caller. |
   ||||

   [aborted-icon]: ./media/create-stateful-stateless-workflows-azure-portal/aborted.png
   [cancelled-icon]: ./media/create-stateful-stateless-workflows-azure-portal/cancelled.png
   [failed-icon]: ./media/create-stateful-stateless-workflows-azure-portal/failed.png
   [running-icon]: ./media/create-stateful-stateless-workflows-azure-portal/running.png
   [skipped-icon]: ./media/create-stateful-stateless-workflows-azure-portal/skipped.png
   [succeeded-icon]: ./media/create-stateful-stateless-workflows-azure-portal/succeeded.png
   [succeeded-with-retries-icon]: ./media/create-stateful-stateless-workflows-azure-portal/succeeded-with-retries.png
   [timed-out-icon]: ./media/create-stateful-stateless-workflows-azure-portal/timed-out.png
   [waiting-icon]: ./media/create-stateful-stateless-workflows-azure-portal/waiting.png

1. To review the inputs and outputs for a specific step, select that step.

   ![Screenshot that shows the inputs and outputs in the selected "Send an email" action.](./media/create-stateful-stateless-workflows-azure-portal/review-step-inputs-outputs.png)

1. To further review the raw inputs and outputs for that step, select **Show raw inputs** or **Show raw outputs**.

<a name="view-trigger-histories"></a>

## Review trigger histories

For a stateful workflow, you can review the trigger history for each run, including the trigger status along with inputs and outputs, separately from the [run history context](#view-run-history). In the Azure portal, trigger history and run history appear at the workflow level, not the logic app level. To find this historical data, follow these steps:

1. In the Azure portal, on your workflow's menu, under **Developer**, select **Trigger Histories**.

   The **Trigger Histories** pane shows the trigger histories for your workflow's runs.

1. To review a specific trigger history, select the ID for that run.

<a name="enable-open-application-insights"></a>

## Enable or open Application Insights after deployment

During workflow execution, your logic app emits telemetry along with other events. You can use this telemetry to get better visibility into how well your workflow runs and how the Logic Apps runtime works in various ways. You can monitor your workflow by using [Application Insights](../azure-monitor/app/app-insights-overview.md), which provides near real-time telemetry (live metrics). This capability can help you investigate failures and performance problems more easily when you use this data to diagnose issues, set up alerts, and build charts.

If your logic app's creation and deployment settings support using [Application Insights](../azure-monitor/app/app-insights-overview.md), you can optionally enable diagnostics logging and tracing for your logic app. You can do so either when you create your logic app in the Azure portal or after deployment. You need to have an Application Insights instance, but you can create this resource either [in advance](../azure-monitor/app/create-workspace-resource.md), when you create your logic app, or after deployment.

To enable Application Insights on a deployed logic app or open the Application Insights dashboard if already enabled, follow these steps:

1. In the Azure portal, find your deployed logic app.

1. On the logic app menu, under **Settings**, select **Application Insights**.

1. If Application Insights isn't enabled, on the **Application Insights** pane, select **Turn on Application Insights**. After the pane updates, at the bottom, select **Apply**.

   If Application Insights is enabled, on the **Application Insights** pane, select **View Application Insights data**.

After Application Insights opens, you can review various metrics for your logic app. For more information, review these topics:

* [Azure Logic Apps Running Anywhere - Monitor with Application Insights - part 1](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-monitor-with-application/ba-p/1877849)
* [Azure Logic Apps Running Anywhere - Monitor with Application Insights - part 2](https://techcommunity.microsoft.com/t5/integrations-on-azure/azure-logic-apps-running-anywhere-monitor-with-application/ba-p/2003332)

<a name="enable-run-history-stateless"></a>

## Enable run history for stateless workflows

To debug a stateless workflow more easily, you can enable the run history for that workflow, and then disable the run history when you're done. Follow these steps for the Azure portal, or if you're working in Visual Studio Code, see [Create stateful and stateless workflows in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#enable-run-history-stateless).

1. In the [Azure portal](https://portal.azure.com), find and open your **Logic App (Preview)** resource.

1. On the logic app's menu, under **Settings**, select **Configuration**.

1. On the **Application Settings** tab, select **New application setting**.

1. On the **Add/Edit application setting** pane, in the **Name** box, enter this operation option name: 

   `Workflows.{yourWorkflowName}.OperationOptions`

1. In the **Value** box, enter the following value: `WithStatelessRunHistory`

   For example:

   ![Screenshot that shows the Azure portal and Logic App (Preview) resource with the "Configuration" > "New application setting" < "Add/Edit application setting" pane open and the "Workflows.{yourWorkflowName}.OperationOptions" option set to "WithStatelessRunHistory".](./media/create-stateful-stateless-workflows-azure-portal/stateless-operation-options-run-history.png)

1. To finish this task, select **OK**. On the **Configuration** pane toolbar, select **Save**.

1. To disable the run history when you're done, either set the `Workflows.{yourWorkflowName}.OperationOptions`property to `None`, or delete the property and its value.

<a name="delete-from-designer"></a>

## Delete items from the designer

To delete an item in your workflow from the designer, follow any of these steps:

* Select the item, open the item's shortcut menu (Shift+F10), and select **Delete**. To confirm, select **OK**.

* Select the item, and press the delete key. To confirm, select **OK**.

* Select the item so that details pane opens for that item. In the pane's upper right corner, open the ellipses (**...**) menu, and select **Delete**. To confirm, select **OK**.

  ![Screenshot that shows a selected item on designer with the opened details pane plus the selected ellipses button and "Delete" command.](./media/create-stateful-stateless-workflows-azure-portal/delete-item-from-designer.png)

  > [!TIP]
  > If the ellipses menu isn't visible, expand your browser window wide enough so that the details 
  > pane shows the ellipses (**...**) button in the upper right corner.

<a name="troubleshoot"></a>

## Troubleshoot problems and errors

<a name="missing-triggers-actions"></a>

### New triggers and actions are missing from the designer picker for previously created workflows

Azure Logic Apps Preview supports built-in actions for Azure Function Operations, Liquid Operations, and XML Operations, such as **XML Validation** and **Transform XML**. However, for previously created logic apps, these actions might not appear in the designer for you to select if your logic app uses an outdated version of the extension bundle, `Microsoft.Azure.Functions.ExtensionBundle.Workflows`.

To fix this problem, follow these steps to delete the outdated version so that the extension bundle can automatically update to the latest version.

> [!NOTE]
> This specific solution applies only to **Logic App (Preview)** resources that you create using 
> the Azure portal, not the logic apps that you create and deploy using Visual Studio Code and the 
> Azure Logic Apps (Preview) extension. See [Supported triggers and actions are missing from the designer in Visual Studio Code](create-stateful-stateless-workflows-visual-studio-code.md#missing-triggers-actions).

1. In the Azure portal, stop your logic app.

   1. On your logic app menu, select **Overview**.

   1. On the **Overview** pane's toolbar, select **Stop**.

1. On your logic app menu, under **Development Tools**, select **Advanced Tools**.

1. On the **Advanced Tools** pane, select **Go**, which opens the Kudu environment for your logic app.

1. On the Kudu toolbar, open the **Debug console** menu, and select **CMD**. 

   A console window opens so that you can browse to the bundle folder using the command prompt. Or, you can browse the directory structure that appears the console window.

1. Browse to the following folder, which contains versioned folders for the existing bundle:

   `...\home\data\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows`

1. Delete the version folder for the existing bundle. In the console window, you can run this command where you replace `{bundle-version}` with the existing version:

   `rm -rf {bundle-version}`

   For example: `rm -rf 1.1.3`

   > [!TIP]
   > If you get an error such as "permission denied" or "file in use", refresh the page in your browser, 
   > and try the previous steps again until the folder is deleted.

1. In the Azure portal, return to your logic app's **Overview** page, and select **Restart**.

   The portal automatically gets and uses the latest bundle.

## Next steps

We'd like to hear from you about your experiences with this public preview!

* For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
* For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/lafeedback).
