---
title: Azure Functions Scenarios 
description: Identify key scenarios that leverage Azure Functions to provide serverless compute resources in aa Azur cloud-based topology. 
ms.topic: conceptual
ms.date: 03/23/2023
---

# Azure Functions scenarios

In many cases, a function [integrates with an array of cloud services](./functions-triggers-bindings.md) to provide feature-rich implementations.

The following are a common, _but by no means exhaustive_, set of scenarios for Azure Functions.

## Build a web API

Implement an endpoint for your web applications using the [HTTP trigger](./functions-bindings-http-webhook.md)

## Process file uploads

Run code when a file is uploaded or changed in [blob storage](./functions-bindings-storage-blob.md)

## Build a serverless workflow

Create an event-driven workflow from a series of functions using [durable functions](./durable/durable-functions-overview.md) 

## Respond to database changes

Run custom logic when a document is created or updated in [Azure Cosmos DB](./functions-bindings-cosmosdb-v2.md) 

## Run scheduled tasks 

Execute code on [pre-defined timed intervals](./functions-bindings-timer.md) 

## Create reliable message systems 

Process message queues using [Queue Storage](./functions-bindings-storage-queue.md), [Service Bus](./functions-bindings-service-bus.md), or [Event Hubs](./functions-bindings-event-hubs.md) 

## Analyze IoT data streams

Collect and process [data from IoT devices](./functions-bindings-event-iot.md) 

## Process data in real time 

Use [Functions and SignalR](./functions-bindings-signalr-service.md) to respond to data in the moment 

## Next steps

