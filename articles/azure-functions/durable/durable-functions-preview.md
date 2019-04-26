---
title: Durable Functions preview features - Azure
description: Learn about preview features for Durable Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.date: 04/23/2019
ms.author: azfuncdf
---

# Durable Functions preview features (Azure Functions)

*Durable Functions* is an extension of [Azure Functions](functions-overview.md) and [Azure WebJobs](../app-service/web-sites-create-web-jobs.md) that lets you write stateful functions in a serverless environment. The extension manages state, checkpoints, and restarts for you. If you are not already familiar with Durable Functions, please see the [overview documentation](durable-functions-overview.md).

Durable Functions is a GA (Generally Available) feature of Azure Functions, but also contains several sub-features which are currently in public preview. This article describes newly released preview features and goes into details on how they work and how you can start using them.

TODO: Mention how to get the Durable Functions 2.0 bits.

# Entity functions (Preview)

Entity functions define operations for reading and updating small pieces of state, known as *durable entities*. Like orchestrator functions, entity functions are functions with a special trigger type, *entity trigger*. Unlike orchestrator functions, entity functions do not have any specific code constraints. Entity functions also manage state explicitly rather than implicitly representing state via control flow.

The following is an example lf a simple entity function which defines a *Counter* entity. The function defines three operations, `add`, `remove`, and `reset`, each of which update an integer value, `currentValue`.

```csharp
public static async Task Counter(
    [EntityTrigger(EntityClassName = "Counter")] IDurableEntityContext ctx)
{
    int currentValue = ctx.GetState<int>();
    int operand = ctx.GetInput<int>();

    switch (ctx.OperationName)
    {
        case "add":
            currentValue += operand;
            break;
        case "subtract":
            currentValue -= operand;
            break;
        case "reset":
            await SendResetNotificationAsync();
            currentValue = 0;
            break;
    }

    ctx.SetState(currentValue);
}
```

Entity *instances* are accessed via a unique identifier, the *entity id*. An entity id is simply a pair of strings that uniquely identifies an entity instance. It consists of:

1. an **entity name**: a name that identifies the type of the entity (e.g. "Counter")
2. an **entity key**: a string that uniquely identifies the the entity among all other entities of the same name (e.g. a GUID)

For example, a *counter* entity function might be used for keeping score in an online game. Each instance of the game will have a unique entity ID, such as `@Counter@Game1`, `@Counter@Game2`, and so on.

### Comparison with virtual actors
The design of durable entities is heavily influenced by the [actor model](https://en.wikipedia.org/wiki/Actor_model). If you are already familiar with actors, then the concepts behind durable entities should be somewhat familiar to you. There are some important differences, however, that are worth noting:

* Durable entities are modeled as pure functions. This is different from many modern actor frameworks, which model actors using language-specific constructs such as classes, properties, and methods.
* Durable entities prioritize *durability* over *latency*, and thus may not be appropriate for applications with strict latency requirements.
* Durable entities can be used to implement distributed locks in orchestrations, which is described later in this article.

In many ways, durable entities remain however similar to virtual actors:

* Durable entities are addressable via an *entity ID*.
* Durable entity operations are synchronized to prevent race conditions.
* Durable entities are created automatically when they are invoked.
* When not executing operations, durable entities are silently unloaded from memory.

It's also worth noting that durable entities only support one-way messaging (a.k.a. "signaling"). This is because all messaging between entities uses queues behind the scenes. Request / response messaging patterns are therefore not supported, except when interacting with entities in the context of durable orchestrations.

### Durable Entity APIs
TODO

### Invoking durable entities
Durable entities can be invoked from ordinary functions via the `orchestrationClient` binding (`IDurableOrchestrationClient` in .NET), from orchestrator functions via the `IDurableOrchestrationContext` interface in .NET, or via other entity functions using the `IDurableActorContext` interface in .NET.

The supported methods are:

* **SignalActor**: sends a one-way message to a durable entity instance.
* **CallActor**: sends a request/response message to a durable entity instance (available only to orchestrations).
* **GetActorState**: returns the latest state of an actor (available only to client functions and orchestrator functions).

### Locking durable entities
TODO