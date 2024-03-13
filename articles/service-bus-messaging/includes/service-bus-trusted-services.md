---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 03/31/2023
ms.author: spelluru
ms.custom: "include file"

---

## Trusted Microsoft services
When you enable the **Allow trusted Microsoft services to bypass this firewall** setting, the following services are granted access to your Service Bus resources.

| Trusted service | Supported usage scenarios | 
| --------------- | ------------------------- | 
| Azure Event Grid | Allows Azure Event Grid to send events to queues or topics in your Service Bus namespace. You also need to do the following steps: <ul><li>Enable system-assigned identity for a topic or a domain</li><li>Add the identity to the Azure Service Bus Data Sender role on the Service Bus namespace</li><li>Then, configure the event subscription that uses a Service Bus queue or topic as an endpoint to use the system-assigned identity.</li></ul> <p>For more information, see [Event delivery with a managed identity](../../event-grid/managed-service-identity.md)</p>|
| Azure Stream Analytics | Allows an Azure Stream Analytics job to output data to Service Bus [queues]( ../../stream-analytics/service-bus-queues-output.md) to [topics]( ../../stream-analytics/service-bus-topics-output.md). <p>**Important**: The Stream Analytics job should be configured to use a **managed identity** to access the Service Bus namespace. Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace. </p>|
| Azure IoT Hub | Allows an IoT hub to send messages to queues or topics in your Service Bus namespace. You also need to do the following steps: <ul><li>[Enable system-assigned or user assigned managed identity for your IoT hub](../../iot-hub/iot-hub-managed-identity.md).</li><li>[Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace](../../role-based-access-control/role-assignments-portal.md).</li><li>[Configure the IoT Hub that uses a Service Bus entity as an endpoint to use the identity-based authentication](../../iot-hub/iot-hub-managed-identity.md#configure-message-routing-with-managed-identities).</li></ul> |
| Azure API Management | <p>The API Management service allows you to send messages to a Service Bus queue/topic in your Service Bus Namespace.</p><ul><li>You can trigger custom workflows by sending messages to your Service Bus queue/topic when an API is invoked by using the [send-request policy](../../api-management/api-management-sample-send-request.md).</li><li>You can also treat a Service Bus queue/topic as your backend in an API. For a sample policy, see [Authenticate using a managed identity to access a Service Bus queue or topic](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Authenticate%20using%20Managed%20Identity%20to%20access%20Service%20Bus.xml). You also need to do the following steps:<ol><li>Enable system-assigned identity on the API Management instance. For instructions, see [Use managed identities in Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md).</li><li>Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace</li></ol></li></ul> | 
| Azure IoT Central | <p>Allows IoT Central to export data to Service Bus queues or topics in your Service Bus namespace. You also need to do the following steps:</p><ul><li>Enable system-assigned identity for your IoT Central application</li><li>Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace. </li><li>Then, configure the Service Bus [export destination on your IoT Central application](../../iot-central/core/howto-export-data.md) to use identity-based authentication. </li>
| Azure Digital Twins | Allows Azure Digital Twins to egress data to Service Bus topics in your Service Bus namespace. You also need to do the following steps: <p><ul><li>Enable system-assigned identity for your Azure Digital Twins instance.</li><li>Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace.</li><li>Then, configure an Azure Digital Twins endpoint or Azure Digital Twins data history connection that uses the system-assigned identity to authenticate. For more information about configuring endpoints and event routes to Service Bus resources from Azure Digital Twins, see [Route Azure Digital Twins events](../../digital-twins/concepts-route-events.md) and [Create endpoints in Azure Digital Twins](../../digital-twins/how-to-create-endpoints.md). </li></ul> |
| Azure Monitor (Diagnostic Settings and Action Groups) | Allows Azure Monitor to send diagnostic information and alert notifications to Service Bus in your Service Bus namespace. Azure Monitor can read from and write data to the Service Bus namespace.|
| Azure Synapse | Allows Azure Synapse to connect to the service bus using the Synapse Workspace Managed Identity. Add the Azure Service Bus Data Sender, Receiver or Owner role to the identity on the Service Bus namespace. | 

The other trusted services for Azure Service Bus can be found below: 
-	Azure Data Explorer
-	Azure Health Data Services
-	Azure Arc
-	Azure Kubernetes 
- Azure Machine Learning
- Microsoft Purview

