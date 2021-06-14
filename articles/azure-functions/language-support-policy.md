---
title: Language Runtime Support Policy
description: Learn about Azure Functions language runtime support policy 
ms.topic: conceptual
ms.date: 06/14/2021
---

# Language runtime support policy

This article explains Azure functions language runtime support policy. 

## Retirement process

Azure Functions runtime is built around various components, including operating systems, Azure Functions Host and language-specific workers. To ensure full support coverages for function apps, Azure Functions will retire its support for programming language versions that reach their End-Of-Life dates in phases. For most language versions, retirement date will coincide with the community End-Of-Life date. 

### Notification phase

We'll send notification emails to function app users about upcoming language version retirements. The notifications will be at least one year prior to the date of retirement. Upon the notification, you should prepare to upgrade the language version that your functions apps use to a supported version.

### Retirement phase

* __Phase 1:__ On the date of EOL of a language, users will no longer be able to create new functions app using the language. For at least the next 60 days after EOL date, existing function apps that are affected could still run on the platform and be updated. During this phase, you're highly encouraged to upgrade the language version of your affected function apps to a supported version.

* __Phase 2:__ After the first phase, it is not guaranteed that function apps using retired languages will be able to run on the platform. 


## Retirement policy exceptions

There are few exceptions to the retirement policy outlined above. Here is a list of languages that have reached or are approaching their EOL dates but still supported on the platform until further notice. When these languages reach their EOL dates, there will be no update or security patch. So, developing and running your function apps with these languages are highly discouraged.

|Language Versions                        |EOL Date         |Expected Retirement Date|
|-----------------------------------------|-----------------|----------------|
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
* PowerShell - [dotnet.microsoft.com](https://docs.microsoft.com/powershell/scripting/powershell-support-lifecycle?view=powershell-7.1#powershell-releases-end-of-life)
* Python - [devguide.python.org](https://devguide.python.org/#status-of-python-branches)

## Next steps

To learn more about how to upgrade your functions apps language versions, see the following resources:

+ How to target specific language version - TODO
+ [Currently supported language versions](./supported-languages.md#languages-by-runtime-version)

