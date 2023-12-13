---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 03/31/2023
ms.author: spelluru
ms.custom: "include file"
---

## Trusted Microsoft services

When you enable the **Allow trusted Microsoft services to bypass this firewall** setting, the following services within the same tenant are granted access to your Event Hubs resources.

| Trusted service | Supported usage scenarios | 
| --------------- | ------------------------- | 
| Azure Event Grid | Allows Azure Event Grid to send events to event hubs in your Event Hubs namespace. You also need to do the following steps: <ul><li>Enable system-assigned identity for a topic or a domain</li><li>Add the identity to the Azure Event Hubs Data Sender role on the Event Hubs namespace</li><li>Then, configure the event subscription that uses an event hub as an endpoint to use the system-assigned identity.</li></ul> <p>For more information, see [Event delivery with a managed identity](../../event-grid/managed-service-identity.md)</p>|
| Azure Stream Analytics | Allows an Azure Stream Analytics job to read data from ([input](../../stream-analytics/stream-analytics-add-inputs.md)) or write data to ([output](../../stream-analytics/event-hubs-output.md)) event hubs in your Event Hubs namespace. <p>**Important**: The Stream Analytics job should be configured to use a **managed identity** to access the event hub. For more information, see [Use managed identities to access the event hub from an Azure Stream Analytics job (Preview)](../../stream-analytics/event-hubs-managed-identity.md). </p>|
| Azure IoT Hub | Allows IoT Hub to send messages to event hubs in your Event Hubs namespace. You also need to do the following steps: <ul><li>Enable system-assigned identity for your IoT hub</li><li>Add the identity to the Azure Event Hubs Data Sender role on the Event Hubs namespace.</li><li>Then, configure the IoT Hub that uses an event hub as a custom endpoint to use the identity-based authentication.</li></ul>
| Azure API Management | <p>The API Management service allows you to send events to an event hub in your Event Hubs namespace.</p> <ul><li>You can trigger custom workflows by sending events to your event hub when an API is invoked by using the [send-request policy](../../api-management/api-management-sample-send-request.md).</li><li>You can also treat an event hub as your backend in an API. For a sample policy, see [Authenticate using a managed identity to access an event hub](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Authenticate%20using%20Managed%20Identity%20to%20access%20Event%20Hub.xml). You also need to do the following steps:<ol><li>Enable system-assigned identity on the API Management instance. For instructions, see [Use managed identities in Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md).</li><li>Add the identity to the **Azure Event Hubs Data Sender** role on the Event Hubs namespace</li></ol></li></ul> | 
| Azure Monitor (Diagnostic Settings and Action Groups) | Allows Azure Monitor to send diagnostic information and alert notifications to event hubs in your Event Hubs namespace. Azure Monitor can read from the event hub and also write data to the event hub. |
| Azure Synapse | Allows Azure Synapse to connect to the event hub using the Synapse Workspace Managed Identity. Add the Azure Event Hubs Data Sender, Receiver or Owner role to the identity on the Event Hubs namespace. | 
| Azure Data Explorer | Allows Azure Data Explorer to receive events from the event hub using the Managed Identity of the cluster. You need to do the following steps: <ul><li>[Configure](/azure/data-explorer/configure-managed-identities-cluster) the Managed Identity on Azure Data Explorer</li><li>Grant the **Azure Event Hubs Data Receiver** role to the identity, on the event hub.</li></ul>  |
| Azure IoT Central | <p>Allows IoT Central to export data to event hubs in your Event Hubs namespace. You also need to do the following steps:</p><ul><li>Enable system-assigned identity for your IoT Central application.</li><li>Add the identity to the **Azure Event Hubs Data Sender** role on the Event Hubs namespace.</li><li>Then, configure the Event Hubs [export destination on your IoT Central application](../../iot-central/core/howto-export-to-event-hubs.md) to use identity-based authentication.</li></ul>
| Azure Health Data Services | Allows Healthcare APIs IoT connector to ingest medical device data from your Event Hubs namespace and persist data in your configured [Fast Healthcare Interoperability Resources (FHIR®) service](../../healthcare-apis/fhir/overview.md). The IoT connector should be configured to use a managed identity to access the event hub. For more information, see [Get started with the IoT connector - Azure Healthcare APIs](../../healthcare-apis/iot/get-started.md). | 
| Azure Digital Twins | Allows Azure Digital Twins to egress data to event hubs in your Event Hubs namespace. You also need to do the following steps: <p><ul><li>Enable system-assigned identity for your Azure Digital Twins instance.</li><li>Add the identity to the **Azure Event Hubs Data Sender** role on the Event Hubs namespace.</li><li>Then, configure an Azure Digital Twins endpoint or Azure Digital Twins data history connection that uses the system-assigned identity to authenticate. For more information about configuring endpoints and event routes to Event Hubs resources from Azure Digital Twins, see [Route Azure Digital Twins events](../../digital-twins/concepts-route-events.md) and [Create endpoints in Azure Digital Twins](../../digital-twins/how-to-create-endpoints.md). </li></ul> |

The other trusted services for Azure Event Hubs can be found below: 
- Azure Arc
- Azure Kubernetes 
- Azure Machine Learning
- Microsoft Purview
