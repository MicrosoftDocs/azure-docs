---
title: Azure Fluid Relay overview
description: Overview of the Fluid Framework and Azure Fluid Relay.
ms.date: 08/19/2021
ms.topic: overview
ms.service: azure-fluid
---

# Azure Fluid Relay overview

The [Fluid Framework](https://fluidframework.com/) is an open source, platform independent framework. [Azure Fluid Relay](../overview/overview.md) is a managed offering for the Fluid Framework that helps developers build real-time collaborative experiences and replicate state across connected JavaScript clients in real-time.

## What is the Fluid Framework?

Fluid Framework is a collection of client libraries for distributing and synchronizing shared state. These libraries allow multiple clients to simultaneously create and operate on shared data structures using coding patterns similar to those used to work with local data.

More documentation on the [FluidFramework.com](https://fluidframework.com).

## Why Fluid?

Because building low-latency, collaborative experiences is hard!

Fluid Framework offers:

- Client-centric application model with data persistence requiring no custom server code.
- Distributed data structures with familiar programming patterns.
- Very low latency.

The developers at Microsoft have built collaboration into many applications, but many required application specific server-side logic to manage the collaborative experience. The Fluid Framework is the result of Microsoft's investment in reducing the complexity of creating collaborative applications.

What if you didn't have to invest in server code at all? Imagine if you could use a general purpose server that was designed to be lightweight and low cost. Imagine if all your development was focused on the client experience and data sync was handled for you. That is the promise of Fluid.

## Focused on the client developer

Applications built with Fluid Framework require zero custom code on the server to enable sophisticated data sync scenarios such as real-time typing across text editors. Client developers can focus on customer experiences while letting Fluid do the work of keeping data in sync.

Fluid Framework works with your application framework of choice. Whether you prefer straight JavaScript or a framework like React, Angular, or Vue, Fluid Framework makes building collaborative experiences simple and flexible.

## How Fluid works

Fluid was designed to deliver collaborative experiences with blazing performance. To achieve this goal, the team kept the server logic as simple and lightweight as possible. This approach helped ensure virtually instant syncing across clients with low server costs.

To keep the server simple, each Fluid client is responsible for its own state. While previous systems keep a source of truth on the server, the Fluid service is responsible for taking in data operations, sequencing the operations, and returning the sequenced operations to the clients. Each client is able to use that sequence to independently and accurately produce the current state regardless of the order it receives operations.

The following steps are a typical flow.

1. Client code changes data locally.
1. Fluid runtime sends that change to the Fluid service.
1. Fluid service sequences that operation and broadcasts it to all clients.
1. Fluid runtime incorporates that operation into local data and raises a "valueChanged" event.
1. Client code handles that event (updates view, runs business logic).
