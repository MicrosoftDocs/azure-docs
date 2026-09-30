---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 03/28/2024
ms.author: mahender
---

#### JSON serialization

By default, the isolated worker model uses *System.Text.Json* for JSON serialization. To customize serializer options or switch to JSON.NET (*Newtonsoft.Json*), see [Customizing JSON serialization](../articles/azure-functions/dotnet-isolated-process-guide.md#customizing-json-serialization).

Because the in-process model used *Newtonsoft.Json*, also check the serialization attributes on any types your functions bind to. *System.Text.Json* ignores attributes such as `[JsonProperty]` and `[JsonIgnore]` from *Newtonsoft.Json*. It binds the affected property to its default value without reporting an error. Either replace them with their *System.Text.Json* equivalents, such as `[JsonPropertyName]`, or configure *Newtonsoft.Json* for the layer that handles the payload.

#### Application Insights log levels and filtering

Logs can be sent to Application Insights from both the Functions host runtime and code in your project. The *host.json* allows you to configure rules for host logging, but to control logs coming from your code, you need to configure filtering rules as part of your *Program.cs*. See [Managing log levels in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#managing-log-levels) for details on how to filter these logs.
