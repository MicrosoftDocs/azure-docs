---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 03/28/2024
ms.author: mahender
---

The `Program.cs` file will replace any file that has the `FunctionsStartup` attribute, which is typically a `Startup.cs` file. In places where your `FunctionsStartup` code would reference `IFunctionsHostBuilder.Services`, you can instead add statements within the `.ConfigureServices()` method of the `HostBuilder` in your `Program.cs`. To learn more about working with `Program.cs`, see [Start-up and configuration](../articles/azure-functions/dotnet-isolated-process-guide.md#start-up-and-configuration) in the isolated worker model guide.

The default `Program.cs` examples above include setup of [Application Insights integration for the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#application-insights). In your `Program.cs`, you must also configure any log filtering that should apply to logs coming from code in your project. In the isolated worker model, the `host.json` file only controls events emitted by the Functions host runtime. If you don't configure filtering rules in `Program.cs`, you may see differences in the log levels present for various categories in your telemetry.

Although you can register custom configuration sources as part of the `HostBuilder`, note that these similarly apply only to code in your project. Trigger and binding configuration is also needed by the platform, and this should be provided through the [application settings](../articles/app-service/configure-common.md#configure-app-settings), [Key Vault references](../articles/app-service/app-service-key-vault-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json), or [App Configuration references](../articles/app-service/app-service-configuration-references.md?toc=%2Fazure%2Fazure-functions%2Ftoc.json) features.

Once you have moved everything from any existing `FunctionsStartup` to the `Program.cs` file, you can delete the `FunctionsStartup` attribute and the class it was applied to.