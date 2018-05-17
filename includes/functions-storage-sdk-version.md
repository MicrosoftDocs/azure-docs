---
title: include file
description: include file
services: functions
author: tdykstra
manager: cfowler
ms.service: functions
ms.topic: include
ms.date: 05/17/2018
ms.author: tdykstra
ms.custom: include file
---

### Azure Storage SDK version

The [Microsoft.Azure.WebJobs](http://www.nuget.org/packages/Microsoft.Azure.WebJobs) package includes the Azure Storage SDK ([WindowsAzure.Storage](http://www.nuget.org/packages/WindowsAzure.Storage)) as a dependency. If you use the Storage SDK directly in your code, we recommend that you reference the same Storage SDK version that the Functions runtime does.

The Storage SDK version used by the Functions runtime is shown in the dependency list for the `Microsoft.Azure.WebJobs` package. For example, [Microsoft.Azure.WebJobs 2.2](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/2.2.0) (Functions 1.x) depends on Storage SDK version 7.2.1, and [Microsoft.Azure.WebJobs 3.0.0-beta5](https://www.nuget.org/packages/Microsoft.Azure.WebJobs/3.0.0-beta5) (Functions 2.x) depends on Storage SDK version 8.6.
