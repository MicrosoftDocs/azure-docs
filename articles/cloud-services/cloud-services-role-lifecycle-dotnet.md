---
title: Handle Cloud Service lifecycle events | Microsoft Docs
description: Learn how the lifecycle methods of a Cloud Service role can be used in .NET
services: cloud-services
documentationcenter: .net
author: jpconnock
manager: timlt
editor: ''

ms.assetid: 39b30acd-57b9-48b7-a7c4-40ea3430e451
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2017
ms.author: jeconnoc

---
# Customize the Lifecycle of a Web or Worker role in .NET
When you create a worker role, you extend the [RoleEntryPoint](/previous-versions/azure/reference/ee758619(v=azure.100)) class which provides methods for you to override that let you respond to lifecycle events. For web roles this class is optional, so you must use it to respond to lifecycle events.

## Extend the RoleEntryPoint class
The [RoleEntryPoint](/previous-versions/azure/reference/ee758619(v=azure.100)) class includes methods that are called by Azure when it **starts**, **runs**, or **stops** a web or worker role. You can optionally override these methods to manage role initialization, role shutdown sequences, or the execution thread of the role. 

When extending **RoleEntryPoint**, you should be aware of the following behaviors of the methods:

* The [OnStart](/previous-versions/azure/reference/ee772851(v=azure.100)) and [OnStop](/previous-versions/azure/reference/ee772844(v=azure.100)) methods return a boolean value, so it is possible to return **false** from these methods.
  
   If your code returns **false**, the role process is abruptly terminated, without running any shutdown sequence you may have in place. In general, you should avoid returning **false** from the **OnStart** method.
* Any uncaught exception within an overload of a **RoleEntryPoint** method is treated as an unhandled exception.
  
   If an exception occurs within one of the lifecycle methods, Azure will raise the [UnhandledException](/dotnet/api/system.appdomain.unhandledexception) event, and then the process is terminated. After your role has been taken offline, it will be restarted by Azure. When an unhandled exception occurs, the [Stopping](/previous-versions/azure/reference/ee758136(v=azure.100)) event is not raised, and the **OnStop** method is not called.

If your role does not start, or is recycling between the initializing, busy, and stopping states, your code may be throwing an unhandled exception within one of the lifecycle events each time the role restarts. In this case, use the [UnhandledException](/dotnet/api/system.appdomain.unhandledexception) event to determine the cause of the exception and handle it appropriately. Your role may also be returning from the [Run](/previous-versions/azure/reference/ee772746(v=azure.100)) method, which causes the role to restart. For more information about deployment states, see [Common Issues Which Cause Roles to Recycle](cloud-services-troubleshoot-common-issues-which-cause-roles-recycle.md).

> [!NOTE]
> If you are using the **Azure Tools for Microsoft Visual Studio** to develop your application, the role project templates automatically extend the **RoleEntryPoint** class for you, in the *WebRole.cs* and *WorkerRole.cs* files.
> 
> 

## OnStart method
The **OnStart** method is called when your role instance is brought online by Azure. While the OnStart code is executing, the role instance is marked as **Busy** and no external traffic will be directed to it by the load balancer. You can override this method to perform initialization work, such as implementing event handlers and starting [Azure Diagnostics](cloud-services-how-to-monitor.md).

If **OnStart** returns **true**, the instance is successfully initialized and Azure calls the **RoleEntryPoint.Run** method. If **OnStart** returns **false**, the role terminates immediately, without executing any planned shutdown sequences.

The following code example shows how to override the **OnStart** method. This method configures and starts a diagnostic monitor when the role instance starts and sets up a transfer of logging data to a storage account:

```csharp
public override bool OnStart()
{
    var config = DiagnosticMonitor.GetDefaultInitialConfiguration();

    config.DiagnosticInfrastructureLogs.ScheduledTransferLogLevelFilter = LogLevel.Error;
    config.DiagnosticInfrastructureLogs.ScheduledTransferPeriod = TimeSpan.FromMinutes(5);

    DiagnosticMonitor.Start("DiagnosticsConnectionString", config);

    return true;
}
```

## OnStop method
The **OnStop** method is called after a role instance has been taken offline by Azure and before the process exits. You can override this method to call code required for your role instance to cleanly shut down.

> [!IMPORTANT]
> Code running in the **OnStop** method has a limited time to finish when it is called for reasons other than a user-initiated shutdown. After this time elapses, the process is terminated, so you must make sure that code in the **OnStop** method can run quickly or tolerates not running to completion. The **OnStop** method is called after the **Stopping** event is raised.
> 
> 

## Run method
You can override the **Run** method to implement a long-running thread for your role instance.

Overriding the **Run** method is not required; the default implementation starts a thread that sleeps forever. If you do override the **Run** method, your code should block indefinitely. If the **Run** method returns, the role is automatically gracefully recycled; in other words, Azure raises the **Stopping** event and calls the **OnStop** method so that your shutdown sequences may be executed before the role is taken offline.

### Implementing the ASP.NET lifecycle methods for a web role
You can use the ASP.NET lifecycle methods, in addition to those provided by the **RoleEntryPoint** class, to manage initialization and shutdown sequences for a web role. This may be useful for compatibility purposes if you are porting an existing ASP.NET application to Azure. The ASP.NET lifecycle methods are called from within the **RoleEntryPoint** methods. The **Application\_Start** method is called after the **RoleEntryPoint.OnStart** method finishes. The **Application\_End** method is called before the **RoleEntryPoint.OnStop** method is called.

## Next steps
Learn how to [create a cloud service package](cloud-services-model-and-package.md).

