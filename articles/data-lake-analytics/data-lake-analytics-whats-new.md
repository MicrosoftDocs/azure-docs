---
title: Data Lake Analytics recent changes
description: This article provides an ongoing list of recent changes that are made to Data Lake Analytics. 
services: data-lake-analytics
author: xujiang1
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: overview
ms.author: xujiang1
ms.date: 07/31/2020
---

# What's new in Data Lake Analytics?

Azure Data Lake Analytics is updated on an aperiodic basis for certain components. To stay updated with the most recent update, this article provides you with information about:

- The notification of key component beta preview
- The important component version information, e.g.: the list of the component available versions, the current default version and so on.


## Notification of key component beta preview

There is no key component beta version available for preview. 

## U-SQL runtime

The Azure Data Lake U-SQL runtime, including the compiler, optimizer, and job manager, is what processes your U-SQL code.

When you submit the Azure Data Lake analytics job from any tools, your job will use the currently available default runtime in production environment. 

The runtime version will be updated aperiodically. And the previous runtime will be kept available for some time. When a new Beta version is ready for preview, it will be also available there.

The following are the currently available runtime versions.

- release-20200124live_adl_16283022_2 --> **the current default version**
- release_20200124live_adl_16283022
- release_20200124_adl_14480125
- release_20190904_adl_10236248_1
- release_20190904_adl_10236248
- release_20190904_adl_9225818

To get understanding how to troubleshoot U-SQL runtime failures, refer to [Troubleshoot U-SQL runtime failures](runtime-troubleshoot.md).

## .NET Framework

Azure Data Lake Analytics now is using the **.NET Framework v4.7.2**. 

If your Azure Data Lake Analytics U-SQL script code uses custom assemblies, and those custom assemblies use .NET libraries, validate your code to check if there is any breakings.

To get understanding how to troubleshoot a .NET upgrade using [Troubleshoot a .NET upgrade](runtime-troubleshoot.md).

## Release note

For recent update details, refer to the [Azure Data Lake Analytics release note](https://github.com/Azure/AzureDataLake/tree/master/docs/Release_Notes).


## Next steps

* Get Started with Data Lake Analytics using [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) | [CLI](data-lake-analytics-get-started-cli.md)

