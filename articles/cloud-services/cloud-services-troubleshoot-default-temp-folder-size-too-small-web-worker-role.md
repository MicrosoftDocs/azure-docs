---
title: Default TEMP folder size is too small for a role | Microsoft Docs
description: A cloud service role has a limited amount of space for the TEMP folder. This article provides some suggestions on how to avoid running out of space.
ms.topic: troubleshooting
ms.service: cloud-services
ms.date: 10/14/2020
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: 
---

# Default TEMP folder size is too small on a cloud service (classic) web/worker role

> [!IMPORTANT]
> [Azure Cloud Services (extended support)](../cloud-services-extended-support/overview.md) is a new Azure Resource Manager based deployment model for the Azure Cloud Services product. With this change, Azure Cloud Services running on the Azure Service Manager based deployment model have been renamed as Cloud Services (classic) and all new deployments should use [Cloud Services (extended support)](../cloud-services-extended-support/overview.md).

The default temporary directory of a cloud service worker or web role has a maximum size of 100 MB, which may become full at some point. This article describes how to avoid running out of space for the temporary directory.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Why do I run out of space?
The standard Windows environment variables TEMP and TMP are available to code that is running in your application. Both TEMP and TMP point to a single directory that has a maximum size of 100 MB. Any data that is stored in this directory is not persisted across the lifecycle of the cloud service; if the role instances in a cloud service are recycled, the directory is cleaned.

## Suggestion to fix the problem
Implement one of the following alternatives:

* Configure a local storage resource, and access it directly instead of using TEMP or TMP. To access a local storage resource from code that is running within your application, call the [RoleEnvironment.GetLocalResource](/previous-versions/azure/reference/ee772845(v=azure.100)) method.
* Configure a local storage resource, and point the TEMP and TMP directories to point to the path of the local storage resource. This modification should be performed within the [RoleEntryPoint.OnStart](/previous-versions/azure/reference/ee772851(v=azure.100)) method.

The following code example shows how to modify the target directories for TEMP and TMP from within the OnStart method:

```csharp
using System;
using Microsoft.WindowsAzure.ServiceRuntime;

namespace WorkerRole1
{
    public class WorkerRole : RoleEntryPoint
    {
        public override bool OnStart()
        {
            // The local resource declaration must have been added to the
            // service definition file for the role named WorkerRole1:
            //
            // <LocalResources>
            //    <LocalStorage name="CustomTempLocalStore"
            //                  cleanOnRoleRecycle="false"
            //                  sizeInMB="1024" />
            // </LocalResources>

            string customTempLocalResourcePath =
            RoleEnvironment.GetLocalResource("CustomTempLocalStore").RootPath;
            Environment.SetEnvironmentVariable("TMP", customTempLocalResourcePath);
            Environment.SetEnvironmentVariable("TEMP", customTempLocalResourcePath);

            // The rest of your startup code goes here…

            return base.OnStart();
        }
    }
}
```

## Next steps
Read a blog that describes [How to increase the size of the Azure Web Role ASP.NET Temporary Folder](/archive/blogs/kwill/how-to-increase-the-size-of-the-windows-azure-web-role-asp-net-temporary-folder).

View more [troubleshooting articles](/visualstudio/azure/vs-azure-tools-debugging-cloud-services-overview) for cloud services.

To learn how to troubleshoot cloud service role issues by using Azure PaaS computer diagnostics data, view [Kevin Williamson's blog series](/archive/blogs/kwill/windows-azure-paas-compute-diagnostics-data).