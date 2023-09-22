---
title: Azure Functions language runtime support policy
description: Learn about Azure Functions language runtime support policy
ms.topic: conceptual
ms.date: 07/18/2023
---

# Language runtime support policy

This article explains Azure functions language runtime support policy.

## Retirement process

Azure Functions runtime is built around various components, including operating systems, the Azure Functions host, and language-specific workers. To maintain full-support coverages for function apps, Functions support aligns with end-of-life support for a given language. To achieve this goal, Functions implements a phased reduction in support as programming language versions reach their end-of-life dates. For most language versions, the retirement date coincides with the community end-of-life date.

### Notification phase

The Functions team sends notification emails to function app users about upcoming language version retirements. The notifications are sent at least one year before the date of retirement. When you receive the notification, you should prepare to upgrade functions apps to use to a supported version.

### Retirement phase

After the language end-of-life date, function apps that use retired language versions can still be created and deployed, and they continue to run on the platform. However your apps aren't eligible for new features, security patches, and performance optimizations until you upgrade them to a supported language version.

> [!IMPORTANT]
>You're highly encouraged to upgrade the language version of your affected function apps to a supported version.
>If you're running functions apps using an unsupported runtime or language version, you may encounter issues and performance implications and will be required to upgrade before receiving support for your function app.


## Retirement policy exceptions

There are few exceptions to the retirement policy outlined above. Here's a list of languages that are approaching or have reached their end-of-life (EOL) dates but continue to be supported on the platform until further notice. When these languages versions reach their end-of-life dates, they're no longer updated or patched. Because of this, we discourage you from developing and running your function apps on these language versions.

|Language Versions                        |EOL Date         |Retirement Date|
|-----------------------------------------|-----------------|----------------|
|Python 3.7|27 June 2023|30 September 2023|
|Node 14|30 April 2023|30 June 2024|
|Node 16|11 September 2023|30 June 2024|


## Language version support timeline

To learn more about specific language version support policy timeline, visit the following external resources:
* .NET - [dotnet.microsoft.com](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)
* Node - [github.com](https://github.com/nodejs/Release#release-schedule)
* Java - [Microsoft technical documentation](/azure/developer/java/fundamentals/java-support-on-azure)
* PowerShell - [Microsoft technical documentation](/powershell/scripting/powershell-support-lifecycle#powershell-end-of-support-dates)
* Python - [devguide.python.org](https://devguide.python.org/#status-of-python-branches)

## Configuring language versions

|Language                         | Configuration guides         |
|-----------------------------------------|-----------------|
|C# (in-process model) |[link](./functions-dotnet-class-library.md#supported-versions)|
|C# (isolated worker model) |[link](./dotnet-isolated-process-guide.md#supported-versions)|
|Node |[link](./functions-reference-node.md#setting-the-node-version)|
|PowerShell |[link](./functions-reference-powershell.md#changing-the-powershell-version)|
|Python |[link](./functions-reference-python.md#python-version)|

## Retired runtime versions

This historical table shows the highest language level for specific Azure Functions runtime versions that are no longer supported: 

|Language                                 |2.x | 3.x | 
|-----------------------------------------|---| --- | 
|[C#](functions-dotnet-class-library.md)|GA (.NET Core 2.1)| GA (.NET Core 3.1 & .NET 5<sup>*</sup>) | 
|[JavaScript/TypeScript](functions-reference-node.md?tabs=javascript)|GA (Node.js 10 & 8)| GA (Node.js 14, 12, & 10) | 
|[Java](functions-reference-java.md)|GA (Java 8)| GA (Java 11 & 8)| 
|[PowerShell](functions-reference-powershell.md) |N/A|N/A| 
|[Python](functions-reference-python.md#python-version)|GA (Python 3.7)| GA (Python 3.9, 3.8, 3.7)| 
|[TypeScript](functions-reference-node.md?tabs=typescript) |GA| GA | 

<sup>*</sup>.NET 5 was only supported for C# apps running in the [isolated worker model](dotnet-isolated-process-guide.md). 

For the language levels currently supported by Azure Functions, see [Languages by runtime version](supported-languages.md#languages-by-runtime-version). 

## Next steps

To learn more about how to upgrade your functions apps language versions, see the following resources:


+ [Currently supported language versions](./supported-languages.md#languages-by-runtime-version)
