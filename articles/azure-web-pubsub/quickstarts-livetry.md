---
title: Use LiveTry to try out the capabilities of Azure Web PubSub
description: How to use LiveTry to explore service capabilities without setting up a code project
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: overview
ms.date: 05/27/2025
---

# Use LiveTry to explore Azure Web PubSub capabilities

**LiveTry** is a browser-based tool that helps you use Azure Web PubSub’s real-time messaging features—no code or local setup required. With just a few clicks, you can create clients, join groups, and send messages using both client-side and server-side APIs.

This guide walks you through two common messaging scenarios in LiveTry, while helping you understand important concepts like **connections**, **groups**, and **messages**.

## What you learn

You explore two messaging patterns often used in real-time applications:

- **Server-to-group messaging**: Using the `sendToGroup` API to broadcast messages to all clients in a group.
- **Client-to-group messaging**: Azure Web PubSub supports a capability that allows a client in a group to send messages directly to other clients in the same group—**without routing through your app server**—reducing latency.

## Key concepts

Before we get started, here’s a quick refresher on core Azure Web PubSub concepts that you interact with in LiveTry:

- **Hub**: A logical unit used to isolate and organize messaging logic. Clients always connect to a hub. With LiveTry, real traffic goes through the resource. For this tutorial, we recommend specifying a test hub name that doesn’t overlap with your production traffic.
- **Connection**: A persistent WebSocket connection between a client and the Azure Web PubSub service.
- **Group**: A server-managed subset of connections. Messages sent to a group are delivered only to the connections within that group.
- **Messages**: The payloads exchanged between clients and the service. Messages can be broadcast to all, targeted to groups, or directed to individual connections.

## Scenario 1: Send a message to a group from the server

In this scenario, you simulate server-side broadcasting using the `sendToGroup` REST API. This scenario demonstrates how the service routes a message from your backend to all clients in a specified group.

### Steps
1. In the Azure portal, navigate to your Azure Web PubSub resource.  
2. Open the **LiveTry** blade.  
3. Click **+ Add Client** to create multiple connections.  
4. Assign each client to a group (for example, `group1`).  
5. Under the **Server** tab in the "Publish messages" section, select **Send to group**.  
6. Enter the group name (`group1`), a sample message, and invoke the `sendToGroup` API.  
7. Switch to the **Client** tab and observe the message appear in each client's message log.

### What you’re learning
You send messages to a group of clients using RESTful APIs. LiveTry demonstrates how server-to-group communication works without needing to deploy a backend. Azure Web PubSub also provides server SDKs for C#, JavaScript, Java, and Python.

To visualize message broadcasting in action, try repeating the steps with multiple clients. LiveTry supports up to five concurrent simulated clients.

## Scenario 2: Send a message to a group from a client

In this scenario, you create a client sending a message to other clients in the same group—similar to a user posting a message in a chat room.

### Steps
1. In **LiveTry**, add two or more clients and specify the same value for the `Initial Groups` field.  
2. For the client that sends the message, select **Allow client to send to all groups**.  
3. Switch to that client’s panel, specify the group name, enter a message, and click **Invoke**.  
4. The other clients in the group receive the message in real time.

### What you’re learning
This scenario showcases **client-to-group messaging**, which is ideal in applications where server round-trips introduce unnecessary latency. It's a core part of Web PubSub’s **client publish/subscribe model**.

> [!TIP]
> Open multiple browser tabs to simulate multiple users or devices.
> Try combining more operations like `joinGroup`, `leaveGroup`, or `sendToConnection`.
> Use clear group names to better organize your experiments.

## Next steps

- Learn more about [key concepts](./key-concepts.md) in Azure Web PubSub  
- To build a local sample, follow the [Quickstart guide](./quickstarts-pubsub-among-clients.md)   
- Explore guides under "How-to guides" for common tasks when developing with Azure Web PubSub