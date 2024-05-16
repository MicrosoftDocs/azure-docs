---
title: Azure Relay Hybrid Connections - Websocket requests in Python
description: Write a Python console application for Azure Relay Hybrid Connections Websocket requests.
ms.topic: tutorial
ms.date: 05/16/2024
ms.custom: devx-track-Python, mode-ui, mode-api, devx-track-extended-Python
---

# Get started with Relay Hybrid Connections Websocket requests in Python

[!INCLUDE [relay-selector-hybrid-connections](./includes/relay-selector-hybrid-connections.md)]

In this quickstart, you create Python sender and receiver applications that send and receive messages by using the Websocket protocol. The applications use Hybrid Connections feature of Azure Relay. To learn about Azure Relay in general, see [Azure Relay](relay-what-is-it.md). 

In this quickstart, you take the following steps:

1. Create a Relay namespace by using the Azure portal.
2. Create a hybrid connection in that namespace by using the Azure portal.
3. Generate a config.json properties file to store connection details
4. Develop a relaylib.py for helper functions (SAS tokens, URLs)
3. Write a server (listener) script to receive messages.
4. Write a client (sender) script to send messages.
5. Execute the server (listener) script and optionally the client (sender) script.

## Prerequisites
- [Python](https://www.Python.com/en/). Ensure that you're running Python 3.10+
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a namespace using the Azure portal
[!INCLUDE [relay-create-namespace-portal](./includes/relay-create-namespace-portal.md)]

## Create a hybrid connection using the Azure portal
[!INCLUDE [relay-create-hybrid-connection-portal](./includes/relay-create-hybrid-connection-portal.md)]

## Create a config.json properties file
[!INCLUDE [relay-configuration-file](./includes/relay-configuration-file)] 

## Develop a helper functions script
[!INCLUDE [relay-python-helper-functions](./includes/relay-python-helper-functions)]

## Create a server application (listener)
To listen and receive messages from the Relay, write a Python Websocket Server script.

[!INCLUDE [relay-hybrid-connections-Python-get-started-server](./includes/relay-hybrid-connections-websocket-requests-Python-get-started-server.md)]

## Create a client application (sender)

To send messages to the Relay, you can use any HTTP or Websocket client, the sample included is a python implementation.

[!INCLUDE [relay-hybrid-connections-Python-get-started-client](./includes/relay-hybrid-connections-websocket-requests-Python-get-started-client.md)]

## Run the applications

1. Run the server application: from a command prompt type `python3 listener.py`.
2. Run the client application: from a command prompt type `python3 sender.py`.

Congratulations, you have created an end-to-end Hybrid Connections application using Python!

## Next steps
In this quickstart, you created Python client and server applications that used Websockets to send and receive messages. The Hybrid Connections feature of Azure Relay also supports using HTTP to send and receive messages. To learn how to use HTTP with Azure Relay Hybrid Connections, see the [HTTP quickstart](relay-hybrid-connections-node-get-started.md).

In this quickstart, you used Python to create client and server applications. To learn how to write client and server applications using .NET Framework, see the [.NET HTTP quickstart](relay-hybrid-connections-dotnet-get-started.md) or the [.NET HTTP quickstart](relay-hybrid-connections-http-requests-dotnet-get-started.md).
