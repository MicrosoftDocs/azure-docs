---
 title: include file
 description: include file
 services: event-grid
 author: robece
 ms.service: event-grid
 ms.topic: include
 ms.date: 05/08/2024
 ms.author: robece
ms.custom: include file, build-2024
---

## Subscribe to partner events

At this point, Microsoft Graph API events should be arriving on your activated partner topic whenever three are changes to the resources specified when your created the Microsoft Graph API subscription. In order to process the events, you must create an event subscription that forwards the events to an event handler like a webhook or any of the [supported Azure services](../event-handlers.md).

>[!IMPORTANT]
>In this section you find a way to receive events using a sample application, the [Event Grid Viewer](https://github.com/Azure-Samples/azure-event-grid-viewer). This application helps you test the data pipeline to receive events before you create your own application to handle the events according to your business requirements. When you are ready to build your application, see the complete [application samples](../subscribe-to-graph-api-events.md#samples-with-detailed-instructions).

### Deploy the Event viewer application

To test your partner topic, deploy the [Event Viewer](https://github.com/Azure-Samples/azure-event-grid-viewer), which is a prebuilt web app. The Event Viewer app displays all events delivered to it. The deployed solution includes an App Service plan, an App Service web app, and source code from GitHub.

1. Select **Deploy to Azure** to deploy the solution to your Azure subscription. In the Azure portal, provide values for the parameters.

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json":::

2. On the **Custom deployment** page, do the following steps: 
    1. Select a **Resource group** where the application is deployed.  
    2. For **Site Name**, enter a name for the web app.
    3. For **Hosting plan name**, enter a name for the App Service plan to use for hosting the web app.
    5. Select **Review + create**. 

        :::image type="content" source="../media/blob-event-quickstart-portal/template-deploy-parameters.png" alt-text="Screenshot showing the Custom deployment page.":::
1. On the **Review + create** page, select **Create**. 
1. The deployment takes a few minutes to complete. Select Alerts (bell icon) in the portal, and then select **Go to resource group**. 

    :::image type="content" source="../media/blob-event-quickstart-portal/navigate-resource-group.png" alt-text="Screenshot showing the successful deployment message with a link to navigate to the resource group.":::
4. On the **Resource group** page, in the list of resources, select the web app that you created. You also see the App Service plan and any other resource you have in the resource group.

    :::image type="content" source="../media/blob-event-quickstart-portal/resource-group-resources.png" alt-text="Screenshot that shows the Resource Group page with the deployed resources.":::
5. On the **App Service** page for your web app, select the URL to navigate to the web site. The URL should be in this format: `https://<your-site-name>.azurewebsites.net`.
    
    :::image type="content" source="../media/blob-event-quickstart-portal/web-site.png" alt-text="Screenshot that shows the App Service page with the link to the site highlighted.":::
6. Confirm that you see the site but no events are posted to it yet.

    :::image type="content" source="../media/blob-event-quickstart-portal/view-site.png" alt-text="Screenshot that shows the Event Grid Viewer sample app.":::    

### Create an event subscription

You subscribe to an Event Grid partner topic to tell Event Grid which events you want to track, and where to send the events.

1. Now, on the **Event Grid Partner Topic** Overview page, select **+ Event Subscription** on the toolbar.

2. On the **Create Event Subscription** page, follow these steps:
    1. Enter a **name** for the event subscription.
    3. Select **Web Hook** for the **Endpoint type**. 
    4. Choose **Select an endpoint**. 

        :::image type="content" source="../media/custom-event-quickstart-portal/provide-subscription-values.png" alt-text="Provide event subscription values":::
    5. For the web hook endpoint, provide the URL of your web app and add `api/updates` to the home page URL. Select **Confirm Selection**.

        :::image type="content" source="../media/custom-event-quickstart-portal/provide-endpoint.png" alt-text="Provide endpoint URL":::
    6. Back on the **Create Event Subscription** page, select **Create**.

3. View your web app again, and you should see a new subscription validation event. Select the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can verify that it wants to receive event data. The web app includes code to validate the subscription.

    :::image type="content" source="../media/custom-event-quickstart-portal/view-subscription-event.png" alt-text="Screenshot of the Event Grid Viewer app with the Subscription Validated event.":::
