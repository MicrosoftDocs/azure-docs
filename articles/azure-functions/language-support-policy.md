---
title: Azure Functions language stack support policy
description: Learn about the support policy for the various language stacks that Azure Functions supports.
ms.topic: conceptual
ms.date: 08/05/2024
---

# Azure Functions language stack support policy

This article explains the support policy for the language stacks supported by Azure Functions.

## Retirement process

The Azure Functions runtime includes the Azure Functions host and programming language-specific workers. To maintain full-support coverage when running your functions in Azure, Functions support aligns with end-of-life support for a given language. To help you keep your apps up-to-date and supported, Functions implements a phased reduction in support as language stack versions reach their end-of-life dates. Generally, the retirement date coincides with the community end-of-life date of the given language.

+ **Notification phase**: 

    The Functions team sends you notification emails about upcoming language version retirements that affect your function apps. When you receive this notification, you should prepare to upgrade these apps to use to a supported version.

+ **Retirement phase**:

    After the language end-of-life date, function apps that use retired language versions can still be created and deployed, and they continue to run on the platform. However, these apps aren't eligible for new features, security patches, and performance optimizations until after you upgrade them to a supported language version.

    > [!IMPORTANT]
    >If you're running function apps using an unsupported runtime or language version, you may encounter issues and performance implications and are required to upgrade before receiving support for your function app. Because of this, you're highly encouraged to upgrade the language version of such an app to a supported version. TO learn how, see [Update language stack versions in Azure Functions](./update-language-versions.md).

## Retirement policy exceptions

Any Functions-supported exceptions to language-specific retirement policies are documented here:  

> There are currently no exceptions to the general retirement policy.

## Language version support timeline

To learn more about specific language version support policy timeline, visit the following external resources:
* .NET - [dotnet.microsoft.com](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)
* Node - [github.com](https://github.com/nodejs/Release#release-schedule)
* Java - [Microsoft technical documentation](/azure/developer/java/fundamentals/java-support-on-azure)
* PowerShell - [Microsoft technical documentation](/powershell/scripting/powershell-support-lifecycle#powershell-end-of-support-dates)
* Python - [devguide.python.org](https://devguide.python.org/#status-of-python-branches)

## Configuring language versions

|Language stack | Configuration guides         |
|-----------------------------------------|-----------------|
|C# (isolated worker model) |[link](./dotnet-isolated-process-guide.md#supported-versions)|
|C# (in-process model) |[link](./functions-dotnet-class-library.md#supported-versions)|
|Java |[link](./update-language-versions.md#update-the-stack-configuration)|
|Node |[link](./functions-reference-node.md#setting-the-node-version)|
|PowerShell |[link](./functions-reference-powershell.md#changing-the-powershell-version)|
|Python |[link](./functions-reference-python.md#python-version)|

## Retired runtime versions

This historical table shows the highest language stack level for no-longer-supported versions of the Functions runtime: 

|Language stack  |2.x | 3.x | 
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


+ [Update language stack versions](./update-language-versions.md)
+ [Currently supported language versions](./supported-languages.md#languages-by-runtime-version)
