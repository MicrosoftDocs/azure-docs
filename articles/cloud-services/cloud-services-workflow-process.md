---
title: Workflow of Windows Azure VM Architecture | Microsoft Docs
description: This article provides overview of the workflow processes when you deploy a service.
ms.topic: article
ms.service: cloud-services
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Workflow of Windows Azure classic VM Architecture 

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

This article provides an overview of the workflow processes that occur when you deploy or update an Azure resource such as a virtual machine. 

> [!NOTE]
>Azure has two different deployment models for creating and working with resources: Resource Manager and classic. This article covers using the classic deployment model.

The following diagram presents the architecture of Azure resources.

:::image type="content" source="./media/cloud-services-workflow-process/workflow.jpg" alt-text="<alt The image about Azure workflow>":::

## Workflow basics
   
**A**. RDFE / FFE is the communication path from the user to the fabric. RDFE (RedDog Front End) is the publicly exposed API that is the front end to the Management Portal and the Service Management API such as Visual Studio, Azure MMC, and so on.  All requests from the user go through RDFE. FFE (Fabric Front End) is the layer that translates requests from RDFE into fabric commands. All requests from RDFE go through the FFE to reach the fabric controllers.

**B**. The fabric controller is responsible for maintaining and monitoring all the resources in the data center. It communicates with fabric host agents on the fabric OS sending information such as the Guest OS version, service package, service configuration, and service state.

**C**. The Host Agent lives on the Host OS and is responsible for setting up Guest OS and communicating with Guest Agent (WindowsAzureGuestAgent) in order to update the role toward an intended goal state and do heartbeat checks with the Guest agent. If Host Agent does not receive heartbeat response for 10 minutes, Host Agent restarts the Guest OS.

**C2**. WaAppAgent is responsible for installing, configuring, and updating WindowsAzureGuestAgent.exe.

**D**.  WindowsAzureGuestAgent is responsible for the following:

1. Configuring the Guest OS including firewall, ACLs, LocalStorage resources, service package and configuration, and certificates.
2. Setting up the SID for the user account that the role will run under.
3. Communicating the role status to the fabric.
4. Starting WaHostBootstrapper and monitoring it to make sure that the role is in goal state.

**E**. WaHostBootstrapper is responsible for:

1. Reading the role configuration, and starting all the appropriate tasks and processes to configure and run the role.
2. Monitoring all its child processes.
3. Raising the StatusCheck event on the role host process.

**F**. IISConfigurator runs if the role is configured as a Full IIS web role. It is responsible for:

1. Starting the standard IIS services
2. Configuring the rewrite module in the web configuration
3. Setting up the AppPool for the configured role in the service model
4. Setting up IIS logging to point to the DiagnosticStore LocalStorage folder
5. Configuring permissions and ACLs
6. The website resides in %roleroot%:\sitesroot\0, and the AppPool points to this location to run IIS. 

**G**. Startup tasks are defined by the role model and started by WaHostBootstrapper. Startup tasks can be configured to run in the background asynchronously, and the host bootstrapper will start the startup task and then continue on to other startup tasks. Startup tasks can also be configured to run in Simple (default) mode in which the host bootstrapper will wait for the startup task to finish running and return a success (0) exit code before continuing to the next startup task.

**H**. These tasks are part of the SDK and are defined as plugins in the role’s service definition (.csdef). When expanded into startup tasks, the **DiagnosticsAgent** and **RemoteAccessAgent** are unique in that they each define two startup tasks, one regular and one that has a **/blockStartup** parameter. The normal startup task is defined as a Background startup task so that it can run in the background while the role itself is running. The **/blockStartup** startup task is defined as a Simple startup task so that WaHostBootstrapper waits for it to exit before continuing. The **/blockStartup** task waits for the regular task to finish initializing, and then it exits and allow the host bootstrapper to continue. This is done so that diagnostics and RDP access can be configured before the role processes start (this is done through the /blockStartup task). This also allows diagnostics and RDP access to continue running after the host bootstrapper has finished the startup tasks (this is done through the Normal task).

**I**. WaWorkerHost is the standard host process for normal worker roles. This host process  hosts all the role’s DLLs and entry point code, such as OnStart and Run.

**J**. WaIISHost is the host process for role entry point code for web roles that use Full IIS. This process loads the first DLL that is found that uses the **RoleEntryPoint** class and executes the code from this class (OnStart, Run, OnStop). Any **RoleEnvironment** events (such as StatusCheck and Changed) that are created in the RoleEntryPoint class are raised in this process.

**K**. W3WP is the standard IIS worker process that is used if the role is configured to use Full IIS. This runs the AppPool that is configured from IISConfigurator. Any RoleEnvironment events (such as StatusCheck and Changed) that are created here are raised in this process. Note that RoleEnvironment events will fire in both locations (WaIISHost and w3wp.exe) if you subscribe to events in both processes.

## Workflow processes

1. A user makes a request, such as uploading ".cspkg" and ".cscfg" files, telling a resource to stop or making a configuration change, and so on. This can be done through the Azure portal or a tool that uses the Service Management API, such as the Visual Studio Publish feature. This request goes to RDFE to do all the subscription-related work and then communicate the request to FFE. The rest of these workflow steps are to deploy a new package and start it.
2. FFE finds the correct machine pool (based on customer input such, as affinity group or geographical location plus input from the fabric, such as machine availability) and communicates with the master fabric controller in that machine pool.
3. The fabric controller finds a host that has available CPU cores (or spins up a new host). The service package and configuration is copied to the host, and the fabric controller communicates with the host agent on the host OS to deploy the package (configure DIPs, ports, guest OS, and so on).
4. The host agent starts the Guest OS and communicates with the guest agent (WindowsAzureGuestAgent). The host sends heartbeats to the guest to make sure that the role is working towards its goal state.
5. WindowsAzureGuestAgent sets up the guest OS (firewall, ACLs, LocalStorage, and so on), copies a new XML configuration file to c:\Config, and then starts the WaHostBootstrapper process.
6. For Full IIS web roles, WaHostBootstrapper starts IISConfigurator and tells it to delete any existing AppPools for the web role from IIS.
7. WaHostBootstrapper reads the **Startup** tasks from E:\RoleModel.xml and begins executing startup tasks. WaHostBootstrapper waits until all Simple startup tasks have finished and returned a “success” message.
8. For Full IIS web roles, WaHostBootstrapper tells IISConfigurator to configure the IIS AppPool and points the site to `E:\Sitesroot\<index>`, where `<index>` is a zero-based index into the number of `<Sites>` elements defined for the service.
9. WaHostBootstrapper will start the host process depending on the role type:
    1. **Worker Role**: WaWorkerHost.exe is started. WaHostBootstrapper executes the OnStart() method. After it returns,  WaHostBootstrapper starts to execute the Run() method, and then simultaneously marks the role as Ready and puts it into the load balancer rotation (if InputEndpoints are defined). WaHostBootsrapper then goes into a loop of checking the role status.
    2. **Full IIS Web Role**: aIISHost is started. WaHostBootstrapper executes the OnStart() method. After it returns, it starts to execute the Run() method, and then simultaneously marks the role as Ready and puts it into the load balancer rotation. WaHostBootsrapper then goes into a loop of checking the role status.
10. Incoming web requests to a Full IIS web role triggers IIS to start the W3WP process and serve the request, the same as it would in an on-premises IIS environment.

## Log File locations

**WindowsAzureGuestAgent**

- C:\Logs\AppAgentRuntime.Log.  
This log contains changes to the service including starts, stops, and new configurations. If the service does not change, you can expect to see large gaps of time in this log file.
- C:\Logs\WaAppAgent.Log.  
This log contains status updates and heartbeat notifications and is updated every 2-3 seconds.  This log contains a historic view of the status of the instance and will tell you when the instance was not in the Ready state.
 
**WaHostBootstrapper**

`C:\Resources\Directory\<deploymentID>.<role>.DiagnosticStore\WaHostBootstrapper.log`
 
**WaIISHost**

`C:\Resources\Directory\<deploymentID>.<role>\WaIISHost.log`
 
**IISConfigurator**

`C:\Resources\Directory\<deploymentID>.<role>\IISConfigurator.log`
 
**IIS logs**

`C:\Resources\Directory\<guid>.<role>.DiagnosticStore\LogFiles\W3SVC1`
 
**Windows Event logs**

`D:\Windows\System32\Winevt\Logs`
