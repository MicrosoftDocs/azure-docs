---
title: Serialization in Durable Functions - Azure
description: Learn how the Durable Functions extension for Azure Functions serializes data for persistence.
author: comcmaho
ms.topic: conceptual
ms.date: 16/11/2020
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand what data is serialized by Durable Functions, how that data is serialized, and how
# I can customize it when it doesn't work the way my app needs it to.
---

# Serialization

Durable Functions persists state to a backend service (by default Azure Storage) in order to provide the reliability guarantees of stateful workflows.

To ensure your workflows persist data correctly, you will need to understand what data is serialized, how it is serialized, and how to customize serialization.

## Serialized Data

Durable Functions requires that the following pieces of data are serializable:

- Orchestration inputs and outputs
- Activity inputs and outputs
- Entity State
- Exceptions thrown by Activity and Orchestrator Functions

## Serialization Algorithm

Durable Functions uses [Newtonsoft.Json](https://www.newtonsoft.com/json/help/html/Introduction.htm) to serialize data. The default settings are below:

**Inputs, Outputs and State:**

```csharp
new JsonSerializerSettings
{
    TypeNameHandling = TypeNameHandling.None,
    DateParseHandling = DateParseHandling.None,
}
```

**Exceptions:**

```csharp
new JsonSerializerSettings
{
    ContractResolver = new ExceptionResolver(),
    TypeNameHandling = TypeNameHandling.Objects,
    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
}
```

Read more detailed documentation about `JsonSerializerSettings` [here](https://www.newtonsoft.com/json/help/html/SerializationSettings.htm).

## Customizing Serialization

The Durable Functions team selected the above default settings to cover a broad variety of types while balancing performance and serialization size. However, these defaults may not work for all of the types used by your application. Applications that meet all of the below requirements can use Dependency Injection (DI) to customize how data and exceptions are serialized.

- The application uses C# (class library) for a programming language
- The application is on Functions V3

The sample classes below show how you can utilize DI to override these settings.

```csharp
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;

/**
** A factory that provides the serialization for all inputs and outputs for activities and
** orchestrations, as well as entity state.
**/
public class CustomMessageSerializerSettingsFactory : IMessageSerializerSettingsFactory
{
    public JsonSerializerSettings CreateJsonSerializerSettings() 
    {
        // Put your custom JsonSerializerSettings here
    }
}
```

```csharp
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;

/**
** A factory that provides the serialization for all exceptions thrown by activities
** and orchestrations
**/
public class CustomErrorSerializerSettingsFactory : IErrorSerializerSettingsFactory
{
    public JsonSerializerSettings CreateJsonSerializerSettings()
    {
        // Put your custom JsonSerializerSettings here
    }
}
```

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;

[assembly: FunctionsStartup(typeof(MyApplication.Startup))]

namespace MyApplication
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IMessageSerializerSettingsFactory, CustomMessageSerializerSettingFactory>();
            builder.Services.AddSingleton<IErrorSerializerSettingsFactory, CustomErrorSerializerSettingsFactory>();
        }
    }
}
```

## Customizing Serialization for non-.NET languages

If your application is unable to utilize Dependency Injection, the recommendation is to manually serialize data types into strings, and pass around the data as strings.