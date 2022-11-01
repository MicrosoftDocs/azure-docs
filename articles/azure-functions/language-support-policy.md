---
title: Azure Functions language runtime support policy
description: Learn about Azure Functions language runtime support policy
ms.topic: conceptual
ms.date: 08/17/2021
---

# Language runtime support policy

This article explains Azure functions language runtime support policy.

## Retirement process

Azure Functions runtime is built around various components, including operating systems, the Azure Functions host, and language-specific workers. To maintain full-support coverages for function apps, Functions support aligns with end-of-life support for a given language. To achieve this, Functions implements a phased reduction in support as programming language versions reach their end-of-life dates. For most language versions, the retirement date coincides with the community end-of-life date.

### Notification phase

We'll send notification emails to function app users about upcoming language version retirements. The notifications will be at least one year before the date of retirement. Upon the notification, you should prepare to upgrade the language version that your functions apps use to a supported version.

### Retirement phase

After the language end-of-life date, function apps that use retired language versions can still be created and deployed, and they continue to run on the platform. However your apps won't be eligible for new features, security patches, and performance optimizations until you upgrade them to a supported language version.

> [!IMPORTANT]
>You're highly encouraged to upgrade the language version of your affected function apps to a supported version.
>If you're running functions apps using an unsupported language version, you'll be required to upgrade before receiving support for your function app.


## Retirement policy exceptions

There are few exceptions to the retirement policy outlined above. Here is a list of languages that are approaching or have reached their end-of-life (EOL) dates but continue to be supported on the platform until further notice. When these languages versions reach their end-of-life dates, they are no longer updated or patched. Because of this, we discourage you from developing and running your function apps on these language versions.

|Language Versions                        |EOL Date         |Retirement Date|
|-----------------------------------------|-----------------|----------------|
|PowerShell Core 6| 4 September 2020|30 September 2022|
|Python 3.6 |23 December 2021|30 September 2022|

## Language version support timeline

To learn more about specific language version support policy timeline, visit the following external resources:
* .NET - [dotnet.microsoft.com](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)
* Node - [github.com](https://github.com/nodejs/Release#release-schedule)
* Java - [azul.com](https://www.azul.com/products/azul-support-roadmap/)
* PowerShell - [Microsoft technical documentation](/powershell/scripting/powershell-support-lifecycle#powershell-end-of-support-dates)
* Python - [devguide.python.org](https://devguide.python.org/#status-of-python-branches)

## Configuring language versions

|Language                         | Configuration guides         |
|-----------------------------------------|-----------------|
|C# (class library) |[link](./functions-dotnet-class-library.md#supported-versions)|
|Node |[link](./functions-reference-node.md#setting-the-node-version)|
|PowerShell |[link](./functions-reference-powershell.md#changing-the-powershell-version)|
|Python |[link](./functions-reference-python.md#python-version)|


## Next steps

To learn more about how to upgrade your functions apps language versions, see the following resources:


+ [Currently supported language versions](./supported-languages.md#languages-by-runtime-version)
