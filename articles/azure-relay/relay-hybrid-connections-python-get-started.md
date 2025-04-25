---
title: Azure Relay Hybrid Connections - WebSocket requests in Python
description: Write a Python console application for Azure Relay Hybrid Connections WebSocket requests.
ms.topic: tutorial
ms.date: 01/30/2025
ms.custom: devx-track-Python, mode-ui, mode-api, devx-track-extended-Python
---

# Get started with Relay Hybrid Connections WebSocket requests in Python

[!INCLUDE [relay-selector-hybrid-connections](./includes/relay-selector-hybrid-connections.md)]

In this quickstart, you create Python sender and receiver applications that send and receive messages by using the WebSocket protocol. The applications use Hybrid Connections feature of Azure Relay. To learn about Azure Relay in general, see [Azure Relay](relay-what-is-it.md). 

In this quickstart, you take the following steps:

1. Create a Relay namespace by using the Azure portal.
1. Create a hybrid connection in that namespace by using the Azure portal.
1. Generate a config.json properties file to store connection details
1. Develop a relaylib.py for helper functions (SAS tokens, URLs)
1. Write a server (listener) script to receive messages.
1. Write a client (sender) script to send messages.
1. Execute the server (listener) script and optionally the client (sender) script.

## Prerequisites
- [Python](https://www.python.org/). Ensure that you're running Python 3.10+
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a namespace using the Azure portal
[!INCLUDE [relay-create-namespace-portal](./includes/relay-create-namespace-portal.md)]

## Create a hybrid connection using the Azure portal
[!INCLUDE [relay-create-hybrid-connection-portal](./includes/relay-create-hybrid-connection-portal.md)]

## Create a server application (listener)
To listen and receive messages from the Relay, write a Python WebSocket Server script.

[!INCLUDE [relay-hybrid-connections-python-get-started-server](./includes/relay-hybrid-connections-websocket-requests-python-get-started-server.md)]

## Create a client application (sender)

To send messages to the Relay, you can use any HTTP or WebSocket client, the sample included is a python implementation.

[!INCLUDE [relay-hybrid-connections-python-get-started-client](./includes/relay-hybrid-connections-websocket-requests-python-get-started-client.md)]

## Run the applications

1. Run the server application: from a command prompt type `python3 listener.py`.
2. Run the client application: from a command prompt type `python3 sender.py`.

Congratulations, you have created an end-to-end Hybrid Connections application using Python!

## Next steps
In this quickstart, you created Python client and server applications that used WebSockets to send and receive messages. The Hybrid Connections feature of Azure Relay also supports using HTTP to send and receive messages. To learn how to use HTTP with Azure Relay Hybrid Connections, see the [HTTP quickstart](relay-hybrid-connections-node-get-started.md).

In this quickstart, you used Python to create client and server applications. To learn how to write client and server applications using .NET Framework, see the [.NET HTTP quickstart](relay-hybrid-connections-dotnet-get-started.md) or the [.NET HTTP quickstart](relay-hybrid-connections-http-requests-dotnet-get-started.md).
