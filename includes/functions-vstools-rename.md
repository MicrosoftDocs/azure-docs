---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/28/2021
ms.author: glenga
---

## Rename the function

The `FunctionName` method attribute sets the name of the function, which by default is generated as `Function1`. Since the tooling doesn't let you override the default function name when you create your project, take a minute to create a better name for the function class, file, and metadata.

1. In **File Explorer**, right-click the Function1.cs file and rename it to `HttpExample.cs`.

1. In the code, rename the Function1 class to `HttpExample`.

1. In the `HttpTrigger` method named `Run`, rename the `FunctionName` method attribute to `HttpExample`. Also, rename the value passed to the `GetLogger` method.

Your function definition should now look like the following code: