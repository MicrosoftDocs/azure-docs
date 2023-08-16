---
title: 'Routing MQTT Messages in Azure Event Grid'
description: 'An overview of Routing MQTT Messages and how to configure it.'
ms.topic: conceptual
ms.date: 05/23/2023
author: george-guirguis
ms.author: geguirgu
---
# Routing MQTT Messages in Azure Event Grid

Event Grid allows you to route your MQTT messages to Azure services or webhooks for further processing. Accordingly, you can build end-to-end solutions by leveraging your IoT data for data analysis, storage, and visualizations, among other use cases. 

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)]

:::image type="content" source="media/mqtt-overview/routing-high-res.png" alt-text="Diagram of the MQTT message routing." border="false":::

## How can I use the routing feature?

Routing the messages from your clients to an Azure service or your custom endpoint enables you to maximize the benefits of this data. The following are some of many use cases to take advantage of this feature:

- Data Analysis: extract and analyze the routed messages from your clients to optimize your solution. For example, analyze your machines' telemetry to predict when to schedule maintenance before failures happen to avoid delays and further damage.
- Serverless applications: trigger a serverless function based on the routed messages from your clients. For example, when a motion sensor detects a motion, send a notification to security personnel to address it.
- Data Visualizations: build visualizations of the routed data from your clients to easily represent and understand the data as well as highlight trends and outliers.

## Routing configuration:

The routing configuration enables you to send all your messages from your clients to an [Event Grid custom topic](custom-topics.md), and configuring [Event Grid event subscriptions](subscribe-through-portal.md) to route the messages from that custom topic to the [supported event handlers](event-handlers.md). Use the following high-level steps to achieve this configuration:

- [Create an Event Grid custom topic](custom-event-quickstart-portal.md) where all MQTT messages will be routed. This topic needs to fulfill the [Event Grid custom topic requirements for routing](#event-grid-custom-topic-requirements-for-routing)
- Create an [Event Grid event subscription](subscribe-through-portal.md) to route these messages to one of the supported Azure services or a custom endpoint.
- Set the routing configuration as detailed below referring to the topic that you created in the first step.

### Event Grid custom topic requirements for routing

The Event Grid custom topic that is used for routing need to fulfill the following requirements:
- It needs to be set to use the Cloud Event Schema v1.0
- It needs to be in the same region as the namespace.
- You need to assign "Event Grid Data Sender" role to yourself on the Event Grid custom topic.
    - In the portal, go to the created Event Grid topic resource.
    - In the "Access control (IAM)" menu item, select "Add a role assignment".
    - In the "Role" tab, select "Event Grid Data Sender", then select "Next".
    - In the "Members" tab, select +Select members, then type your AD user name in the "Select" box that will appear (for example, [user@contoso.com](mailto:user@contoso.com)).
    - Select your AD user name, then select "Review + assign"

### Azure portal configuration

Use the following steps to configure routing:

- Go to your namespace in the Azure portal.
- Under Routing, Check Enable Routing.
- Under routing topic, select the Event Grid topic that you have created where all MQTT messages will be routed.
    - This topic needs to fulfill the [Event Grid custom topic requirements for routing](#event-grid-custom-topic-requirements-for-routing)
- Select Apply.

:::image type="content" source="./media/mqtt-routing/routing-portal-configuration.png" alt-text="Screenshot showing the routing configuration through the portal.":::

For enrichments configuration instructions, go to [Enrichment portal configuration](mqtt-routing-enrichment.md#azure-portal-configuration).

### Azure CLI configuration

```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces --id /subscriptions/<Subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.EventGrid/namespaces/<Namespace Name> --is-full-object --api-version 2023-06-01-preview --properties @./resources/NS.json
```
**NS.json**
```json
"properties": {
	"inputSchema": "CloudEventSchemaV1_0",
	"topicSpacesConfiguration": {
	    "state": "Enabled",           
	    "routeTopicResourceId": "/subscriptions/<Subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.EventGrid/topics/<Event Grid topic name>",
	}
}
```

For enrichments configuration instructions, go to [Enrichment CLI configuration](mqtt-routing-enrichment.md#azure-cli-configuration).

## Next steps:

Use the following articles to learn more about routing:

### QuickStart:

- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)

### Concepts:

- [Routing Event Schema](mqtt-routing-event-schema.md)
- [Routing Filtering](mqtt-routing-filtering.md)
- [Routing Enrichments](mqtt-routing-enrichment.md)