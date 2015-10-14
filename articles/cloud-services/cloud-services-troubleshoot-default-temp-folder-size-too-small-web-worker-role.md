<properties 
   pageTitle="Default TEMP folder size is too small for a role | Microsoft Azure"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="kevingw"
   manager="jroley"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="10/14/2015"
   ms.author="kwill" />

# Default TEMP folder size is too small on a Cloud Service Web/Worker role

>[AZURE.NOTE] This only applies to Azure SDK 1.0 through SDK1.4 using Web and Worker Roles.

The default temporary directory has a maximum size of 100 MB, which may become full at some point. This article describes how to avoid running out of space for the temporary directory.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Cause
The standard Windows environment variables TEMP and TMP are available to code running in your application. Both TEMP and TMP point to a single directory that has a maximum size of 100 MB. Any data stored in this directory is not persisted across the lifecycle of the hosted service; if the role instances in a hosted service are recycled, the directory is cleaned.

## Resolution
Implement one of the following alternatives:

- Configure a local storage resource, and access it directly instead of using **TEMP** or **TMP**. To access a local storage resource from code running within your application, call the [RoleEnvironment.GetLocalResource](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.getlocalresource.aspx) method. For more information about setting up local storage resources, see [Configure Local Storage Resources](cloud-services-configure-local-storage-resources.md).

- Configure a local storage resource, and point the TEMP and TMP directories to point to the path of the local storage resource. This modification should be performed within the [RoleEntryPoint.OnStart](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx) method.

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

View more [troubleshooting articles](/documentation/articles/?tag=top-support-issue&service=cloud-services) for cloud services.

