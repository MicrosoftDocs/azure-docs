---
title: Frequently asked questions of Azure Web PubSub chat
description: Frequently asked questions about the Azure Web PubSub chat hub, covering how it works, when to use it, and how it can be combined with standard Web PubSub hubs in real-world applications.
author: kevinguo-ed
ms.author: kevinguo
ms.service: azure-web-pubsub
ms.topic: faq
ms.date: 06/01/2026
---

# Frequently asked questions about Web PubSub chat

Frequently asked questions about the Azure Web PubSub chat, covering how it works, when to use it, and how it can be combined with standard Web PubSub hubs in real-world applications.

## Can I use a chat hub and a standard hub together?

Yes. You can use a chat hub and a standard hub in the same application.

The chat hub is built on top of Azure Web PubSub. This architecture enables you to combine:

* Chat-specific abstractions, such as rooms, messages, and members
* Low-level real-time messaging for custom or non-chat scenarios

You can choose the right level of abstraction for each part of your application.

### Common mixed usage scenarios

Using both hubs together is useful when:

* Your application includes chat alongside other real-time features, such as live notifications or dashboards.
* You need custom real-time events that don’t map cleanly to chat concepts.
* You want to incrementally adopt chat hub features while keeping existing Web PubSub logic.

For example, you might:

* Use the chat hub for conversations and message history.
* Use the standard hub for system events, analytics updates, or collaboration signals.
* Share the same Web PubSub service and infrastructure.

Because both hubs are backed by the same Web PubSub service:

* Connections scale consistently.
* Geo-replication and reliability behave the same way.
* Security, networking, and access policies apply uniformly.

You don't need to run separate real-time systems or duplicate configuration.

### A layered real-time architecture

Many applications naturally evolve toward a layered real-time design:

* A chat layer for user conversations
* An event layer for application-specific real-time signals

The chat hub works alongside the standard hub, so you can extend your real-time capabilities without locking your application into a single abstraction.

## How can I use Web PubSub chat hub to build a conversational AI, like an AI chatbot?

Use Web PubSub chat hub as the real-time conversation layer and [Foundry Agent Service](https://learn.microsoft.com/azure/foundry/what-is-foundry) as the intelligence layer behind your chatbot.

In this architecture:

- Web PubSub chat hub manages rooms, messages, members, and real-time delivery.
- Foundry Agent Service generates intelligent responses and orchestrates AI workflows.

A common pattern looks like this:

1. A user sends a message to a chat room. The client application can distinguish whether the message is intended for other room members or for an AI agent. For example, it might detect a special trigger such as `@agent`. If the message is intended for the AI, the client sends it to a backend API endpoint.
2. The backend receives the request and forwards the message to an agent hosted in Foundry Agent Service.
3. The agent processes the input, optionally calls tools or retrieves knowledge, and generates a response.
4. The backend sends the agent's response back to the same chat room by using the chat hub.

This architecture cleanly separates responsibilities:

- The chat hub handles real-time communication, scaling, and message distribution.
- Foundry Agent Service handles reasoning, memory, orchestration, and tool use.

Have questions about building an AI chatbot with Web PubSub chat hub? Connect with the product team to discuss your scenario.

> [!div class="nextstepaction"]
> [Let's have a chat](https://forms.office.com/r/rLZCLyXFSL)