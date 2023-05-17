---
title: Azure Web PubSub basic concepts about hubs, groups, and connections
description: Understand the basic concepts and terms used in Azure Web PubSub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 04/28/2023
ms.custom: mode-other
---

# Azure Web PubSub basic concepts

Azure Web PubSub service helps you build real-time messaging web applications. The clients connect to the service using the [standard WebSocket protocol](https://datatracker.ietf.org/doc/html/rfc6455), and the service exposes [REST APIs](/rest/api/webpubsub) and SDKs for you to manage these clients.

## Terms

Here are some important terms used by the service:

[!INCLUDE [Terms](includes/terms.md)]

> [!IMPORTANT]
> `Hub`, `Group`, `UserId` are important roles when you manage clients and send messages. They will be required parameters in different REST API calls as plain text. So __DO NOT__ put sensitive information in these fields. For example, credentials or bearer tokens which will have high leak risk.

## Workflow

A typical workflow using the service is shown as below:

![Diagram showing the Web PubSub service workflow.](./media/concept-service-internals/workflow.png)

As illustrated by the above workflow graph:

1. A *client* connects to the service `/client` endpoint using WebSocket transport. Service forward every WebSocket frame to the configured upstream(server). The WebSocket connection can connect with any custom subprotocol for the server to handle, or it can connect with the service-supported subprotocols (e.g. `json.webpubsub.azure.v1`) that enable the clients to do pub/sub directly. Details are described in [client protocols](concept-service-internals.md#client-protocol).

2. The service invokes the server using **CloudEvents protocol** on different client events. [**CloudEvents**](https://github.com/cloudevents/spec/blob/v1.0.1/spec.md) is a standardized and protocol-agnostic definition of the structure and metadata description of events hosted by the Cloud Native Computing Foundation (CNCF). Details are described in [server protocol](concept-service-internals.md#server-protocol).

3. Server can invoke the service using REST API to send messages to clients or to manage the connected clients. Details are described in [server protocol](concept-service-internals.md#server-protocol)
