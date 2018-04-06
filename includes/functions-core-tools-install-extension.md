---
title: include file
description: include file
services: functions
author: ggailey777
ms.service: functions
ms.topic: include
ms.date: 04/06/2018
ms.author: glenga
ms.custom: include file
---

When you develop functions locally, you can install the extensions you need by using the Azure Functions Core Tools from the Terminal or from a command prompt. The following `func extensions install` command installs the Azure Cosmos DB binding extension:

```
func extensions install --package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version <target_version>
```

Replace `<taget_version>` with a specific version of the package. Valid versions are listed on the individual package pages at [NuGet.org](https://nuget.org).
