---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: functions
ms.topic: include
ms.date: 09/21/2018
ms.author: glenga
ms.custom: include file
---

When you develop functions locally, you can install the extensions you need by using the Azure Functions Core Tools from the Terminal or from a command prompt.

After you have updated your *function.json* file to include all the bindings that your function needs, run the following command in the project folder.

```bash
func extensions install
```

The command reads the *function.json* file to see which packages you need, installs them, and rebuilds the extensions project. It adds any new bindings at the current version but does not update existing bindings. Use the `--force` option to update existing bindings to the latest version when installing new ones.

If you want to install a particular version of a package or you want to install packages before editing the *function.json* file, use the `func extensions install` command with the name of the package, as shown in the following example:

```bash
func extensions install --package Microsoft.Azure.WebJobs.ServiceBus --version <target_version>
```

Replace `<target_version>` with a specific version of the package, such as `3.0.0-beta5`. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org).
