---
title: Reference - Python Client-side SDK for Azure Web PubSub
description: This reference describes the Python client-side SDK for Azure Web PubSub service.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.custom: devx-track-python
ms.topic: conceptual 
ms.date: 07/17/2023
---

# Azure Web PubSub client library for Python

> [!NOTE]
> Details about the terms used here are described in [key concepts](./key-concepts.md) article.

The client-side SDK aims to speed up developer's workflow; more specifically,
- simplifies managing client connections
- simplifies sending messages among clients
- automatically retries after unintended drops of client connection
- **reliably** deliveries messages in number and in order after recovering from connection drops

As shown in the diagram, your clients establish WebSocket connections with your Web PubSub resource. 

:::image type="content" source="./media/reference-client-sdk-python/flow-overview.png" alt-text="Screenshot showing clients establishing WebSocket connection with a Web PubSub resource":::

## Getting started

### Prerequisites
- [Python 3.7+](https://www.python.org/downloads/)
- An Azure subscription
- A Web PubSub resource

### 1. Install the `azure-messaging-webpubsubclient` package

```bash
pip install azure-messaging-webpubsubclient
```

### 2. Connect with your Web PubSub resource

A client uses a `Client Access URL` to connect and authenticate with the service, which follows a pattern of `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. A client can have a few ways to obtain the `Client Access URL`. For this quick start, you can copy and paste one from Azure portal shown.

:::image type="content" source="./media/reference-client-sdk-python/get-client-access-url.png" alt-text="Screenshot showing how to get Client Access Url on Azure portal":::

As shown in the diagram, the client has the permissions to send messages to and join a specific group named **`group1`**. 

```python
from azure.messaging.webpubsubclient import WebPubSubClient

client = WebPubSubClient("<<client-access-url>>")
with client:
    # The client can join/leave groups, send/receive messages to and from those groups all in real-time
    ...
```

### 3. Join groups

A client can only receive messages from groups that it has joined and you need to add a callback to specify the logic when receiving messages.

```python
# ...continues the code snippet from above

# Registers a listener for the event 'group-message' early before joining a group to not miss messages
group_name = "group1";
client.on("group-message", lambda e: print(f"Received message: {e.data}"));

# A client needs to join the group it wishes to receive messages from
client.join_group(groupName);
```

### 4. Send messages to a group

```python
# ...continues the code snippet from above

# Send a message to a joined group
client.send_to_group(group_name, "hello world", "text");

# In the Console tab of your developer tools found in your browser, you should see the message printed there.
```

## Examples
### Add callbacks for `connected`, `disconnected` and `stopped` events
1. When a client is successfully connected to your Web PubSub resource, the `connected` event is triggered.

    ```python
    client.on("connected", lambda e: print(f"Connection {e.connection_id} is connected"))
    ```

2. When a client is disconnected and fails to recover the connection, the `disconnected` event is triggered.

    ```python
    client.on("disconnected", lambda e: print(f"Connection disconnected: {e.message}"))
    ```

3. The `stopped` event is triggered when the client is disconnected **and** the client stops trying to reconnect. This usually happens after the `client.stop()` is called, or `auto_reconnect` is disabled or a specified limit to trying to reconnect has reached. If you want to restart the client, you can call `client.start()` in the stopped event.

    ```python
    client.on("stopped", lambda : print("Client has stopped"))
    ```

### A client consumes messages from the application server or joined groups

A client can add callbacks to consume messages from your application server or groups. Note, for `group-message` event the client can _only_ receive group messages that it has joined.

  ```python
  # Registers a listener for the "server-message". The callback is invoked when your application server sends message to the connectionID, to or broadcast to all connections.
  client.on("server-message", lambda e: print(f"Received message {e.data}"))

  # Registers a listener for the "group-message". The callback is invoked when the client receives a message from the groups it has joined.
  client.on("group-message", lambda e: print(f"Received message from {e.group}: {e.data}"))
  ```
---
### Handle rejoin failure
When a client is disconnected and fails to recover, all group contexts are cleaned up in your Web PubSub resource. This means when the client reconnects, it needs to rejoin groups. By default, the client has `auto_rejoin_groups` option enabled. 

However, you should be aware of `auto_rejoin_groups`'s limitations. 
- The client can only rejoin groups that it's originally joined **by the client code _not_ by the server side code**. 
- "rejoin group" operations may fail due to various reasons, for example, the client doesn't have permission to join the groups. In such cases, you need to add a callback to handle this failure.

```python
# By default auto_rejoin_groups=True. You can disable it by setting to False.
client = WebPubSubClient("<client-access-url>", auto_rejoin_groups=True);

# Registers a listener to handle "rejoin-group-failed" event
client.on("rejoin-group-failed", lambda e: print(f"Rejoin group {e.group} failed: {e.error}"))
```

### Operation and retry

By default, the operation such as `client.join_group()`, `client.leave_group()`, `client.send_to_group()`, `client.send_event()` has three retries. You can configure through the key-word arguments. If all retries have failed, an error is thrown. You can keep retrying by passing in the same `ack_id` as previous retries so that the Web PubSub service can deduplicate the operation.

```python
try:
  client.join_group(group_name)
except SendMessageError as e:
  client.join_group(group_name, ack_id=e.ack_id)
```

## Troubleshooting
### Enable logs
You can set the following environment variable to get the debug logs when using this library.

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).

### Live Trace
Use [Live Trace tool](./howto-troubleshoot-resource-logs.md#capture-resource-logs-by-using-the-live-trace-tool) from Azure portal to inspect live message traffic through your Web PubSub resource.
