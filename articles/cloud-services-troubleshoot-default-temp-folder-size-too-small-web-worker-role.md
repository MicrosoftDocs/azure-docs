<properties 
   pageTitle="Default TEMP Folder Size is too Small on Web/Worker role"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/12/2015"
   ms.author="adegeo" />

## Default TEMP Folder Size is too Small on Web/Worker role

**Applies to**: Azure SDK 1.0 through SDK1.4 using Web and Worker Roles

**Symptom**:  The temporary directory for the hosted service runs out of space or you need data to persist in the temporary directory across the lifecycle of the hosted service.

**Cause**: The standard Windows environment variables TEMP and TMP are available to code running in your application. Both TEMP and TMP point to a single directory that has a maximum size of 100 MB. Any data stored in this directory is not persisted across the lifecycle of the hosted service; if the role instances in a hosted service are recycled, the directory is cleaned.

**Resolution**: Implement one of the following alternatives:

- Configure a local storage resource, and access it directly instead of using TEMP or TMP. To access a local storage resource from code running within your application, call the [RoleEnvironment.GetLocalResource](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.getlocalresource.aspx) method. For more information about setting up local storage resources, see [Configure Local Storage Resources](https://msdn.microsoft.com/library/ee758708).

- Configure a local storage resource, and point the TEMP and TMP directories to point to the path of the local storage resource. This modification should be performed within the [RoleEntryPoint.OnStart](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx) method.

The following code example shows how to modify the target directories for TEMP and TMP from within the OnStart method:

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

### See Also

[Known Issues in Azure Cloud Services](https://msdn.microsoft.com/library/gg508668)

