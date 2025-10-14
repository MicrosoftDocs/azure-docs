---
title: Tutorial - Use IoT Hub events to trigger Azure Logic Apps
description: This tutorial shows how to use the event routing service of Azure Event Grid, create automated processes to perform Azure Logic Apps actions based on IoT Hub events.
author: SoniaLopezBravo
ms.service: azure-iot-hub
ms.topic: tutorial
ms.date: 08/08/2025
ms.author: sonialopez
ms.custom: devx-track-azurecli
---

# Tutorial: Send email notifications about Azure IoT Hub events using Event Grid and Logic Apps

Azure Event Grid enables you to react to events in IoT Hub by triggering actions in your downstream business applications.

This article walks through a sample configuration that uses IoT Hub and Event Grid. At the end, you have an Azure logic app set up to send a notification email every time a device connects or disconnects to your IoT hub. Event Grid can be used to get timely notification about critical devices disconnecting. Metrics and Diagnostics can take several minutes (such as 20 minutes or more) to show up in logs / alerts. Longer processing times might be unacceptable for critical infrastructure.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

* An email account from any email provider supported by Azure Logic Apps, such as Office 365 Outlook or Outlook.com. This email account is used to send the event notifications.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create an IoT hub

You can quickly create a new IoT hub using the Azure Cloud Shell terminal in the portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the upper right of the page, select the Cloud Shell button.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/portal-cloud-shell.png" alt-text="Screenshot of how to open the Azure Cloud Shell from the Azure portal." lightbox="./media/publish-iot-hub-events-to-logic-apps/portal-cloud-shell.png":::

1. Run the following command to create a new resource group:

   ```azurecli
   az group create --name {your resource group name} --location westus
   ```
    
1. Run the following command to create an IoT hub:

   ```azurecli
   az iot hub create --name {your iot hub name} --resource-group {your resource group name} --sku S1 
   ```

1. Minimize the Cloud Shell terminal. You return to the shell later in the tutorial.

## Create a logic app

Next, create a logic app and add an HTTP Event Grid trigger that processes requests from IoT hub. 

### Create a logic app resource

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**, then type "logic app" in the search box and press Enter. Select **Logic App** from the results.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/select-logic-app.png" alt-text="Screenshot of how to select the logic app from a list of resources." lightbox="./media/publish-iot-hub-events-to-logic-apps/select-logic-app.png":::

1. On the next screen, select **Create**. 

1. On the **Create Logic App** page, select **Consumption (Multi-tenant)**, and then select **Select**.

1. On the **Create Logic App (Multi-tenant)** page, give your logic app a unique name in your subscription, then select the same subscription, resource group, and location as your IoT hub. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/create-logic-app-fields.png" alt-text="Screenshot of how to configure your logic app." lightbox="./media/publish-iot-hub-events-to-logic-apps/create-logic-app-fields.png":::

1. Select **Review + create**.

1. Verify your settings and then select **Create**.

1. Once the resource is created, select **Go to resource**. 

1. In the resource menu, select **Logic app templates** under **Development Tools**.

1. In the working pane, choose **Blank workflow** so that you can start from an empty workflow.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/logic-app-designer-template.png" alt-text="Screenshot of the logic app templates." lightbox="./media/publish-iot-hub-events-to-logic-apps/logic-app-designer-template.png":::

### Select a trigger

A trigger is a specific event that starts your logic app. For this tutorial, the trigger that sets off the workflow is receiving a request over HTTP.  

1. In the workflow designer, select **Add a trigger**.

1. In the connectors and triggers search bar, type **HTTP**.

1. Scroll through the results and select **Request - When an HTTP request is received** as the trigger. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/http-request-trigger.png" alt-text="Screenshot of the Add a trigger pane in the workflow designer." lightbox="./media/publish-iot-hub-events-to-logic-apps/http-request-trigger.png":::

1. In the trigger configuration box, select **Use sample payload to generate schema**. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/sample-payload.png" alt-text="Screenshot of the trigger information box." lightbox="./media/publish-iot-hub-events-to-logic-apps/sample-payload.png":::

1. Copy the following `json` and replace the placeholder values `<>` with your own.

1. Paste the *Device connected event schema* JSON into the **Enter or paste a sample JSON payload.** text box, then select **Done**:

   ```json
     [{  
      "id": "f6bbf8f4-d365-520d-a878-17bf7238abd8",
      "topic": "/SUBSCRIPTIONS/<azure subscription ID>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/<hub name>",
      "subject": "devices/LogicAppTestDevice",
      "eventType": "Microsoft.Devices.DeviceConnected",
      "eventTime": "2018-06-02T19:17:44.4383997Z",
      "data": {
          "deviceConnectionStateEventInfo": {
            "sequenceNumber":
              "000000000000000001D4132452F67CE200000002000000000000000000000001"
          },
        "hubName": "<hub name>",
        "deviceId": "LogicAppTestDevice",
        "moduleId" : "DeviceModuleID"
      }, 
      "dataVersion": "1",
      "metadataVersion": "1"
    }]
   ```
 
   > [!IMPORTANT]
   > Be sure to paste the JSON snippet into the box provided by the **Use sample payload to generate schema** link and not directly into the **Request Body JSON Schema** box. The sample payload link provides a way to generate the JSON content based on the JSON snippet. The final JSON that ends up in the request body is different than the JSON snippet.

   This event publishes when a device is connected to an IoT hub.

1. On the designer toolbar, select **Save**.

   > [!NOTE]
   > You might receive a pop-up notification that says, **Remember to include a Content-Type header set to application/json in your request.** You can safely ignore this suggestion, and move on to the next section. 

1. Close the trigger information box.

### Create an action

Actions are any steps that occur after the trigger starts the logic app workflow. For this tutorial, the action is to send an email notification from your email provider. 

1. On the designer, select the plus sign (+) under the trigger, and then select **Add an action**.

1. In the **Add an action** box, search for **Outlook**.

1. Based on your email provider, find and select the matching connector. This tutorial uses Outlook.com as its email provider. To use the corresponding connector, select the **Send an email (V2)** action under **Outlook.com**. The steps for other email providers are similar. Alternatively, you can use Office 365 Outlook to skip the sign-in step.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/outlook-step.png" alt-text="Screenshot of the Add an action box." lightbox="./media/publish-iot-hub-events-to-logic-apps/outlook-step.png":::

1. Select **Sign in** and sign in to your email account. Select **Yes** to let the app access your info.

1. Build your email template. 

   * **To**: Enter the email address to receive the notification emails. For this tutorial, use an email account that you can access for testing. 

   * **Subject**: Fill in the text for the subject. When you select the **Subject** text box, you can either select the function icon displayed next to the text box or type the slash (/) character and select the **Insert dynamic content** list option to include dynamic content. For example, this tutorial uses `IoT Hub alert: {eventType}`. 

   After selecting `eventType`, you'll see the email form output so far. Select the **Send and email (V2)** to edit the body of your email.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/send-email.png" alt-text="Screenshot of the condensed body output form." lightbox="./media/publish-iot-hub-events-to-logic-apps/send-email.png":::

   * **Body**: Write the text for your email. Select JSON properties from the selector tool to include dynamic content based on event data. If you can't see the selector tool, select the **Body** text box and then select the function icon displayed next to the text box to include expressions and dynamic content. If it doesn't show you the fields you want, select *See more* in the Dynamic content screen to include the fields from the previous action.

   Your email template might look like this example:

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/email-content.png" alt-text="Screenshot of how to create an event email in the template." lightbox="./media/publish-iot-hub-events-to-logic-apps/email-content.png":::

1. Select **Save** in the workflow designer.  

### Copy the HTTP URL

Before you leave the workflow designer, copy the URL that your logic app is listening to for a trigger. You use this URL to configure Event Grid. 

1. Expand the **When an HTTP request is received** trigger configuration box by selecting it. 

1. Copy the value of **HTTP URL** by selecting the copy button next to it. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/copy-url.png" alt-text="Screenshot of how to copy the HTTP URL for the trigger." lightbox="./media/publish-iot-hub-events-to-logic-apps/copy-url.png":::

1. Save this URL so that you can refer to it in the next section. 

## Configure subscription for IoT Hub events

In this section, you configure your IoT hub to publish events as they occur. 

1. In the Azure portal, navigate to your IoT hub. You can find your IoT hub by selecting **IoT Hub** from your Azure dashboard, then  select your IoT hub instance from the list of resources.

1. Select **Events**.

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/select-events.png" alt-text="Screenshot of the service menu for your IoT hub in the Azure portal, highlighting the Events command." lightbox="./media/publish-iot-hub-events-to-logic-apps/select-events.png":::

1. Select **Event subscription**. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/event-subscription.png" alt-text="Screenshot of the working pane for your IoT hub in the Azure portal, highlighting the Event Subscription command in the command bar." lightbox="./media/publish-iot-hub-events-to-logic-apps/event-subscription.png":::

1. Create the event subscription with the following values: 

   1. In the **EVENT SUBSCRIPTION DETAILS** section:
      1. Provide a **name** for the event subscription. 
      2. Select **Event Grid Schema** for **Event Schema**. 
   2. In the **TOPIC DETAILS** section:
      1. Confirm that the **Topic type** is set to **IoT Hub**. 
      2. Confirm that the name of the IoT hub is set as the value for the **Source Resource** field. 
      3. Enter a name for the **system topic** to be created for you. To learn about system topics, see [System topics in Azure Event Grid](system-topics.md).
   3. In the **EVENT TYPES** section:
      1. Select the **Filter to Event Types** drop-down.
      1. Deselect the **Device Created** and **Device Deleted** checkboxes, leaving only the **Device Connected** and **Device Disconnected** checkboxes selected.

         :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/subscription-event-types.png" alt-text="Screenshot of your 'Create Event Subscription' page in the Azure portal, showing the Event Types section." lightbox="./media/publish-iot-hub-events-to-logic-apps/subscription-event-types.png":::
   
   4. In the **ENDPOINT DETAILS** section: 
       1. Select **Endpoint Type** as **Web Hook**.
       2. Select **select an endpoint**, paste the URL that you copied from your logic app, and confirm selection.

         :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/endpoint-webhook.png" alt-text="Screenshot of your 'Create Event Subscription' page in the Azure portal, showing the Endpoint Details section." lightbox="./media/publish-iot-hub-events-to-logic-apps/endpoint-webhook.png":::

      When you're done, the pane should look like the following example: 

      :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/subscription-form.png" alt-text="Screenshot of your 'Create Event Subscription' page in the Azure portal." lightbox="./media/publish-iot-hub-events-to-logic-apps/subscription-form.png":::

1.  Select **Create**.

## Simulate a new device connecting and sending telemetry

Test your logic app by quickly simulating a device connection using the Azure CLI. 

1. Select the Cloud Shell button to reopen your terminal.

1. Run the following command to create a simulated device identity:

    ```azurecli 
    az iot hub device-identity create --device-id simDevice --hub-name {YourIoTHubName}
    ```

   The processing could take a minute. You see a JSON printout in your console once processing is complete.

1. Run the following command to simulate connecting your device to IoT Hub and sending telemetry:

    ```azurecli
    az iot device simulate -d simDevice -n {YourIoTHubName}
    ```

1. When the simulated device connects to IoT Hub, you receive an email notifying you of a "DeviceConnected" event.

1. When the simulation completes, you receive an email notifying you of a "DeviceDisconnected" event. 

   :::image type="content" source="./media/publish-iot-hub-events-to-logic-apps/alert-mail.png" alt-text="Screenshot of the email you should receive." lightbox="./media/publish-iot-hub-events-to-logic-apps/alert-mail.png":::

## Clean up resources

This tutorial used resources that incur charges on your Azure subscription. When you're finished trying out the tutorial and testing your results, disable or delete resources that you don't want to keep. 

To delete all of the resources created in this tutorial, delete the resource group. 

1. Select **Resource groups**, then select the resource group you created for this tutorial.

2. On the Resource group pane, select **Delete resource group**. You're prompted to enter the resource group name, and then you can delete it. All of the resources contained therein are also removed.

## Next steps

* Learn more about [Reacting to IoT Hub events by using Event Grid to trigger actions](../iot-hub/iot-hub-event-grid.md).
* [Learn how to order device connected and disconnected events](../iot-hub/iot-hub-how-to-order-connection-state-events.md)
* Learn about what else you can do with [Event Grid](overview.md).

For a complete list of supported Logic App connectors, see:

> [!div class="nextstepaction"]
> [Connectors overview](/connectors/overview).
