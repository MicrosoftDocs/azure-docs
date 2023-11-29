---
title: Azure Relay Hybrid Connections - HTTP requests in Java
description: Write a Java console application for Azure Relay Hybrid Connections HTTP requests.
ms.topic: tutorial
ms.date: 06/21/2022
ms.custom: devx-track-java, mode-ui, mode-api
---

# Get started with Relay Hybrid Connections HTTP requests in Java

[!INCLUDE [relay-selector-hybrid-connections](./includes/relay-selector-hybrid-connections.md)]

In this quickstart, you create Java sender and receiver applications that send and receive messages by using the HTTP protocol. The applications use Hybrid Connections feature of Azure Relay. To learn about Azure Relay in general, see [Azure Relay](relay-what-is-it.md). 

In this quickstart, you take the following steps:

1. Create a Relay namespace by using the Azure portal.
2. Create a hybrid connection in that namespace by using the Azure portal.
3. Write a server (listener) console application to receive messages.
4. Write a client (sender) console application to send messages.
5. Run applications.

## Prerequisites
- [Java](https://www.java.com/en/). Please ensure that you are running JDK 1.8+
- [Maven](https://maven.apache.org/install.html). Please ensure that you have Maven installed
- [Azure Relay SDK](https://github.com/Azure/azure-relay-java). Review Java SDK
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Create a namespace using the Azure portal
[!INCLUDE [relay-create-namespace-portal](./includes/relay-create-namespace-portal.md)]

## Create a hybrid connection using the Azure portal
[!INCLUDE [relay-create-hybrid-connection-portal](./includes/relay-create-hybrid-connection-portal.md)]

## Create a server application (listener)
To listen and receive messages from the Relay, write a Java console application.

[!INCLUDE [relay-hybrid-connections-java-get-started-server](./includes/relay-hybrid-connections-http-requests-java-get-started-server.md)]

## Create a client application (sender)

To send messages to the Relay, you can use any HTTP client, or write a Java console application.

[!INCLUDE [relay-hybrid-connections-java-get-started-client](./includes/relay-hybrid-connections-http-requests-java-get-started-client.md)]

## Run the applications

1. Run the server application: from a Java command prompt or application type `java -cp <jar_dependency_path> com.example.listener.Listener.java`.
2. Run the client application: from a Java command prompt or application type `java -cp <jar_dependency_path> com.example.sender.Sender.java`, and enter some text.
3. Ensure that the server application console outputs the text that was entered in the client application.

Congratulations, you have created an end-to-end Hybrid Connections application using Java!

## Next steps
In this quickstart, you created Java client and server applications that used HTTP to send and receive messages. The Hybrid Connections feature of Azure Relay also supports using WebSockets to send and receive messages. To learn how to use WebSockets with Azure Relay Hybrid Connections, see the [WebSockets quickstart](relay-hybrid-connections-node-get-started.md).

In this quickstart, you used Java to create client and server applications. To learn how to write client and server applications using .NET Framework, see the [.NET WebSockets quickstart](relay-hybrid-connections-dotnet-get-started.md) or the [.NET HTTP quickstart](relay-hybrid-connections-http-requests-dotnet-get-started.md).
