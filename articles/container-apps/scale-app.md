---
title: Set scaling rules in Azure Container Apps
description: Learn how to scale applications up and down with Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Set scaling rules in Azure Container Apps

Autoscaling and scaling are the same thing

Azure Container Apps manages horizontal scaling for you. (what does horizontal scaling mean -> add more instances)

Support a large number of scale triggers

## HTTP autoscale

http for web APIs
set a default number of concurrent requests: default 50
scale instances when a single replica goes over 50 requests

min replicas: 0 (default)
max replicas: 25 max (check for default value)
concurrentNumberRequest: 50 (no max value, min 1) 
    target, not a guarantee
        try to scale to this number
        if set to 1 there is guarantee of thread safety

to avoid coldstart have more than 0 replicas
    billed more for replicas
    charged as "idle charge" -> memory consumption

some apps, may need to go to 100
    keep scaling until as replicas are needed

can scale to zero

### Example

## Event-driven autoscale

events: for queues, Kafka messages

properties
    min
    max
    additional fields depending on event source
        in the KEDA docs https://keda.sh/docs/2.4/scalers/

need to know both your app and its consumption capabilities & message bus technology
    send to KEDA docs for schemas
schema in container apps is json, not yaml
keda uses dashes, and CA camel cases property names

custom configuration section uses KEDA schema

can scale to zero
    not billed when not used

### Example

Azure Storage Queue

this is just an example, many scalers available

## CPU/memory autoscale

physical resources for background processing (CPU usage, etc.)

does not allow you to scale to zero
    if scaled to 0, it would no longer exists

https://keda.sh/docs/2.4/scalers/cpu/
https://keda.sh/docs/2.4/scalers/memory/

### Example


## Go wrong

scaler definition wrong
    look at logs to see what happened

connection to event source
    forget to update connection string
    change connectivity to storage account and you can't reach it
        changes outside the system

query that targets scaling issues

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
