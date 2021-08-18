---
title: Azure Functions language runtime support policy 
description: Learn about Azure Functions language runtime support policy 
ms.topic: conceptual
ms.date: 06/14/2021
---

# Language runtime support policy

This article explains Azure functions language runtime support policy. 

## Retirement process

Azure Functions runtime is built around various components, including operating systems, the Azure Functions host, and language-specific workers. To maintain full support coverages for function apps, Azure Functions uses a phased reduction in support as programming language versions reach their end-of-life dates. For most language versions, the retirement date coincides with the community end-of-life date. 

### Notification phase

We'll send notification emails to function app users about upcoming language version retirements. The notifications will be at least one year prior to the date of retirement. Upon the notification, you should prepare to upgrade the language version that your functions apps use to a supported version.

### Retirement phase

* __Phase 1:__ On the end-of-life date for a language version, you can no longer create new function apps targeting that language version. For at least 60 days after this date, existing function apps can continue to run on that language version and and are updated. During this phase, you're highly encouraged to upgrade the language version of your affected function apps to a supported version.

* __Phase 2:__ At a minimum of 60 days after the language end-of-life date, we no longer can guaranteed that function apps targeting this language version will continue to run on the platform. 


## Retirement policy exceptions

There are few exceptions to the retirement policy outlined above. Here is a list of languages that are approaching or have reached their end-of-life dates but continue to be supported on the platform until further notice. When these languages versions reach their end-of-life dates, they are no longer updated or patched. Because of this, we discourage you from developing and running your function apps on these language versions.

|Language Versions                        |EOL Date         |Expected Retirement Date|
|-----------------------------------------|-----------------|----------------|
|.NET 5|February 2022|TBA|
|Node 6|30 April 2019|TBA| 
|Node 8|31 December 2019|TBA| 
|Node 10|30 April 2021|TBA| 
|PowerShell Core 6| 4 September 2020|TBA|
|Python 3.6 |23 December 2021|TBA| 
 

## Language version support timeline

To learn more about specific language version support policy timeline, visit the following external resources:
* .NET - [dotnet.microsoft.com](https://dotnet.microsoft.com/platform/support/policy/dotnet-core)
* Node - [github.com](https://github.com/nodejs/Release#release-schedule)
* Java - [azul.com](https://www.azul.com/products/azul-support-roadmap/)
* PowerShell - [dotnet.microsoft.com](/powershell/scripting/powershell-support-lifecycle?view=powershell-7.1&preserve-view=true#powershell-releases-end-of-life)
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
