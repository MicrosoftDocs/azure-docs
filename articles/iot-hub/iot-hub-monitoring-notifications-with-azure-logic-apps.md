---
title: Tutorial - Monitor devices, notify with Azure Logic Apps
titleSuffix: Azure IoT Hub
description: Tutorial - Use Azure Logic Apps to monitor IoT temperature data in IoT hub and send email notifications to your mailbox for any anomalies detected.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: tutorial
ms.date: 02/07/2024
---

# Tutorial: Monitor IoT devices and send notifications with Azure Logic Apps

Use Azure Logic Apps to monitor incoming device telemetry from IoT Hub and send notifications when alerts are triggered.

![End-to-end diagram](media/iot-hub-monitoring-notifications-with-azure-logic-apps/iot-hub-e2e-logic-apps.png)

[Azure Logic Apps](../logic-apps/index.yml) can help you orchestrate workflows across on-premises and cloud services, multiple enterprises, and various protocols. A logic app begins with a trigger, which is then followed by one or more actions that can be sequenced using built-in controls, such as conditions and iterators. This flexibility makes Logic Apps an ideal IoT solution for IoT monitoring scenarios. For example, the arrival of data from a device at an IoT Hub endpoint can initiate logic app workflows to warehouse the data in an Azure Storage blob, send email alerts to warn of data anomalies, schedule a technician visit if a device reports a failure, and so on.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
> Create a Service Bus queue.
> Create a route in your IoT hub that sends messages to the Service Bus queue if the messages contain anomalous temperature readings.
> Create a logic app that watches for messaging arriving in the queue and sends an email alert.

The client code running on your device sets an application property, `temperatureAlert`, on every telemetry message it sends to your IoT hub. When the client code detects a temperature above a given threshold, it sets this property to `true`; otherwise, it sets the property to `false`.

Messages arriving at your IoT hub look similar to the following, with the telemetry data contained in the body and the `temperatureAlert` property contained in the application properties (system properties aren't shown):

```json
{
  "body": {
    "messageId": 18,
    "deviceId": "Raspberry Pi Web Client",
    "temperature": 27.796111770668457,
    "humidity": 66.77637926438427
  },
  "applicationProperties": {
    "temperatureAlert": "false"
  }
}
```

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

Prepare the following prerequisites before beginning this tutorial.

* An active Azure subscription.
* An IoT hub in your subscription.
* A client app that sends temperature data to your Azure IoT hub. This tutorial filters device-to-cloud messages based on a message property called `temperatureAlert`. Some samples that generate messages with this property include:

  * .NET SDK: [SimulatedDevice](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/samples/getting%20started/SimulatedDevice/Program.cs)
  * Java SDK: [send-event](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/send-event/README.md)
  * Node.js SDK: [simple_sample_device](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device.js)
  * C SDK: [iothub_II_client_shared_sample](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/samples/iothub_ll_client_shared_sample/iothub_ll_client_shared_sample.c)
  * Codeless: [Raspberry Pi online simulator](raspberry-pi-get-started.md)

## Create Service Bus namespace and queue

Create a Service Bus namespace and queue. Later in this article, you create a routing rule in your IoT hub to direct messages that contain a temperature alert to the Service Bus queue. A logic app monitors the queue for incoming messages and sends a notification for each alert.

### Create a Service Bus namespace

1. On the [Azure portal](https://portal.azure.com/), use the search bar to search for and select **Service Bus**.

1. Select **Create** to create a service bus namespace.

1. On the **Create namespace** pane, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Choose the same subscription that contains your IoT hub. |
   | **Resource group** | Choose the same resource group that contains your IoT hub. |
   | **Namespace name** | Provide a name for your service bus namespace. The namespace must be unique across Azure. |
   | **Location** | Choose the same location that your IoT hub uses. |
   | **Pricing tier** | Select **Basic** from the drop-down list. The Basic tier is sufficient for this tutorial. |

1. Select **Review + create**.

1. Select **Create**.

1. Wait for the deployment to complete, then select **Go to resource**.

### Add a Service Bus queue to the namespace

1. On the **Overview** page of your Service Bus namespace, select **Queue**.

   :::image type="content" source="./media/iot-hub-monitoring-notifications-with-azure-logic-apps/namespace-add-queue.png" alt-text="Screenshot of the namespace overview page to add a queue.":::

1. In the **Name** field, provide a name for the queue. Accept the default values for the other fields and select **Create**.

1. In your Service Bus namespace, select **Shared access policies** from the **Settings** section of the resource menu.

1. Select the **RootManageSharedAccessKey** policy to open its details.

1. Copy the value of **Primary connection string** and save it to use later in this tutorial when you configure the logic app.

## Add a custom endpoint and routing rule to your IoT hub

Add a custom endpoint for the Service Bus queue to your IoT hub. Then, create a message routing rule to direct messages that contain a temperature alert to that endpoint, where they're picked up by your logic app. The routing rule uses a routing query, `temperatureAlert = "true"`, to forward messages based on the value of the `temperatureAlert` application property set by the client code running on the device. To learn more, see [Message routing query based on message properties](./iot-hub-devguide-routing-query-syntax.md#query-based-on-message-properties).

### Add a custom endpoint and route

1. In the Azure portal, go to your IoT hub.

1. In the resource menu under **Hub settings**,  select **Message routing** then select **Add**.

   :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

1. On the **Endpoint** tab, create an endpoint for your Service Bus queue by providing the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Service Bus queue**. |
   | **Endpoint name** | Provide a name for the new endpoint that maps to your Service Bus queue. |
   | **Service Bus namespace** | Use the drop-down menu to select the Service Bus namespace that you created in the previous section. |
   | **Service Bus queue** | Use the drop-down menu to select the Service Bus queue that you created in your namespace. |

   :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/add-a-route-endpoint.png" alt-text="Screenshot that shows how to create a service bus queue endpoint for your route.":::

1. Select **Create + next**.

1. On the **Route** tab, enter the following information to create a route that points to your Service Bus queue endpoint:

   | Parameter | Value |
   | --------- | ----- |
   | **Name** | Provide a unique name for the route. |
   | **Data source** | Keep the default **Device Telemetry Message** data source. |
   | **Routing query** | Enter `temperatureAlert = "true"` as the query string. |

   :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/add-a-route-route.png" alt-text="Screenshot that shows adding a route with a query.":::

1. Select **Create + skip enrichments**.

## Configure Logic Apps for notifications

In the preceding section, you set up your IoT hub to route messages containing a temperature alert to your Service Bus queue. Now, you set up a logic app to monitor the Service Bus queue and send an e-mail notification whenever a message is added to the queue.

### Create a logic app

1. In the Azure portal, search for and select **Logic Apps**.

1. Select **Add** to create a new logic app.

1. Enter the following information on the **Basics** tab of **Create Logic App**:

   | Parameter | Value |
   | --------- | ----- |
   | **Resource group** | Select the same resource group that contains your IoT hub. |
   | **Name** | Provide a name for your logic app. |
   | **Region** | Select a location close to you. |
   | **Plan type** | Select **Consumption**, which is sufficient for this tutorial. |

   :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/create-a-logic-app.png" alt-text="Screenshot that shows creating a logic app in the Azure portal.":::

1. Select **Review + create**.

1. Select **Create**.

1. After the deployment completes, select **Go to resource** to open your logic app.

### Configure the logic app trigger

1. On your logic app resource page in the Azure portal, open the **Logic app designer** from the **Development Tools** section of the resource menu.

1. In the designer, scroll down to **Templates** and select **Blank Logic App**.

   :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/designer-blank-logic-app.png" alt-text="Screenshot that shows selecting the Blank Logic App template.":::

1. Select the **All** tab to show all connectors and triggers, then select **Service Bus**.

   ![Select Service Bus to start creating your logic app in the Azure portal.](media/iot-hub-monitoring-notifications-with-azure-logic-apps/6-select-service-bus-when-creating-blank-logic-app-azure-portal.png)

1. Under **Triggers**, select **When one or more messages arrive in a queue (auto-complete)**.

   ![Select the trigger for your logic app in the Azure portal.](media/iot-hub-monitoring-notifications-with-azure-logic-apps/select-service-bus-trigger.png)

1. Create a service bus connection.

   1. Provide a **Connection name** and then paste the **Connection string** that you copied from your Service Bus namespace.

   1. Select **Create**.

   1. On the next screen, use the drop-down menu to select the queue that you created in your Service Bus namespace. Then, enter `175` for **Maximum message count**.

      :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/designer-queue-settings.png" alt-text="Screenshot that shows configuring queue settings in the Logic app designer.":::

1. Select **Save** on the logic app designer menu to save your changes.

### Configure the logic app action

1. Select **New step** in the logic app designer.

1. Create an SMTP service connection.

   1. Search for and select **SMTP**.

      :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/designer-smtp-connection.png" alt-text="Screenshot that shows selecting an SMTP connection in the logic app designer.":::

   1. Select **Send Email (V3)** as the action for this step.

   1. Provide a **Connection name**, then fill out the rest of the fields with the SMTP information for the email account you want to use to send the notification messages.

      Use the following links to find your SMTP information, depending on your mail provider:

      * [Hotmail/Outlook.com](https://support.microsoft.com/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040)
      * [Gmail](https://support.google.com/a/answer/176600?hl=en)
      * [Yahoo Mail](https://help.yahoo.com/kb/SLN4075.html).

      > [!NOTE]
      > You may need to disable TLS/SSL to establish the connection. If this is the case and you want to re-enable TLS after the connection has been established, see the optional step at the end of this section.

      :::image type="content" source="media/iot-hub-monitoring-notifications-with-azure-logic-apps/designer-smtp-settings.png" alt-text="Screenshot that shows configuring the SMTP connection settings in the logic app designer.":::

   1. Select **Create**.

1. Configure the **Send Email** action.

   1. From the **Add new parameter** drop-down on the **Send Email** step, select the following parameters:

      * **From**
      * **To**
      * **Subject**
      * **Body**

      Click or tap anywhere on the screen to close the selection box.

      ![Choose SMTP connection email fields to include in email.](media/iot-hub-monitoring-notifications-with-azure-logic-apps/smtp-connection-choose-fields.png)

   1. Enter the following information for the email parameters you selected in the previous step:

      | Parameter | Value |
      | --------- | ----- |
      | **From** | The email address that you configured for the SMTP connection. |
      | **To** | The email address or addresses where you want to send notification emails. |
      | **Subject** | `High temperature detected`. |
      | **Body** | `High temperature detected`. |

      If the **Add dynamic content** dialog opens, select **Hide** to close it. You don't use dynamic content in this tutorial.

      ![Provide details for SMTP connection email fields.](media/iot-hub-monitoring-notifications-with-azure-logic-apps/fill-in-smtp-connection-fields.png)

1. Select **Save** to save the SMTP connection.

1. (Optional) If you had to disable TLS to establish a connection with your email provider and want to re-enable it, follow these steps:

   1. On the **Logic app** pane, under **Development Tools**, select **API connections**.

   1. From the list of API connections, select the SMTP connection.

   1. On the **smtp API Connection** pane, under **General**, select **Edit API connection**.

   1. On the **Edit API Connection** pane, select **Enable SSL?**, reenter the password for your email account, and select **Save**.

      ![Edit SMTP API connection in your logic app in the Azure portal.](media/iot-hub-monitoring-notifications-with-azure-logic-apps/re-enable-smtp-connection-ssl.png)

Your logic app is now ready to process temperature alerts from the Service Bus queue and send notifications to your email account.

## Test the logic app

Start sending temperature messages from your IoT device to test the monitoring and notification pipeline.

1. Start the client application on your device. The client code randomly outputs telemetry messages, and sets the `temperatureAlert` property to `true` when the temperature exceeds 30 C.

1. You should begin receiving email notifications sent by the logic app.

   > [!NOTE]
   > Your email service provider may need to verify the sender identity to make sure it is you who sends the email.

## Clean up resources

If you don't need the resources that you created in this tutorial any longer, delete it and the resource group in the portal. To do so, select the resource group that contains your IoT hub and select **Delete**.

Alternatively, use the CLI:

```azurecli-interactive
# Delete your resource group and its contents
az group delete --name <RESOURCE_GROUP_NAME>
```

## Next steps

In this tutorial, you created a logic app that connects your IoT hub and your mailbox for temperature monitoring and notifications.

[!INCLUDE [iot-hub-get-started-next-steps](../../includes/iot-hub-get-started-next-steps.md)]