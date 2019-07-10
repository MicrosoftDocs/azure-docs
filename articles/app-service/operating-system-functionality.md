---
title: Operating system functionality in App Service - Azure
description: Learn about the OS functionality available to web apps, mobile app backends, and API apps on Azure App Service
services: app-service
documentationcenter: ''
author: cephalin
manager: erikre
editor: mollybos

ms.assetid: 39d5514f-0139-453a-b52e-4a1c06d8d914
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/30/2018
ms.author: cephalin
ms.custom: seodec18

---
# Operating system functionality on Azure App Service
This article describes the common baseline operating system functionality that is available to all Windows apps running on [Azure App Service](https://go.microsoft.com/fwlink/?LinkId=529714). This functionality includes file, network, and registry access, and diagnostics logs and events. 

> [!NOTE] 
> [Linux apps](containers/app-service-linux-intro.md) in App Service run in their own containers. No access to the host operating system is allowed, you do have root access to the container. Likewise, for [apps running in Windows containers](app-service-web-get-started-windows-container.md), you have administrative access to the container but no access to the host operating system. 
>

<a id="tiers"></a>

## App Service plan tiers
App Service runs customer apps in a multi-tenant hosting environment. Apps deployed in the **Free** and **Shared** tiers run in worker processes on shared virtual machines, while apps deployed in the **Standard** and **Premium** tiers run on virtual machine(s) dedicated specifically for the apps associated with a single customer.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

Because App Service supports a seamless scaling experience between different tiers, the security configuration enforced for App Service apps remains the same. This ensures that apps don't suddenly behave differently, failing in unexpected ways, when App Service plan switches from one tier to another.

<a id="developmentframeworks"></a>

## Development frameworks
App Service pricing tiers control the amount of compute resources (CPU, disk storage, memory, and network egress) available to apps. However, the breadth of framework functionality available to apps remains the same regardless of the scaling tiers.

App Service supports a variety of development frameworks, including ASP.NET, classic ASP, node.js, PHP, and Python - all of which run as extensions within IIS. In order to simplify and normalize security configuration, App Service apps typically run the various development frameworks with their default settings. One approach to configuring apps could have been to customize the API surface area and functionality for each individual development framework. App Service instead takes a more generic approach by enabling a common baseline of operating system functionality regardless of an app's development framework.

The following sections summarize the general kinds of operating system functionality available to App Service apps.

<a id="FileAccess"></a>

## File access
Various drives exist within App Service, including local drives and network drives.

<a id="LocalDrives"></a>

### Local drives
At its core, App Service is a service running on top of the Azure PaaS (platform as a service) infrastructure. As a result, the local drives that are "attached" to a virtual machine are the same drive types available to any worker role running in Azure. This includes:

- An operating system drive (the D:\ drive)
- An application drive that contains Azure Package cspkg files used exclusively by App Service (and inaccessible to customers)
- A "user" drive (the C:\ drive), whose size varies depending on the size of the VM. 

It is important to monitor your disk utilization as your application grows. If the disk quota is reached, it can have adverse effects to your application. For example: 

- The app may throw an error indicating not enough space on the disk.
- You may see disk errors when browsing to the Kudu console.
- Deployment from Azure DevOps or Visual Studio may fail with `ERROR_NOT_ENOUGH_DISK_SPACE: Web deployment task failed. (Web Deploy detected insufficient space on disk)`.
- Your app may suffer slow performance.

<a id="NetworkDrives"></a>

### Network drives (aka UNC shares)
One of the unique aspects of App Service that makes app deployment and maintenance straightforward is that all user content is stored on a set of UNC shares. This model maps well to the common pattern of content storage used by on-premises web hosting environments that have multiple load-balanced servers. 

Within App Service, there is a number of UNC shares created in each data center. A percentage of the user content for all customers in each data center is allocated to each UNC share. Furthermore, all of the file content for a single customer's subscription is always placed on the same UNC share. 

Due to how Azure services work, the specific virtual machine responsible for hosting a UNC share will change over time. It is guaranteed that UNC shares will be mounted by different virtual machines as they are brought up and down during the normal course of Azure operations. For this reason, apps should never make hard-coded assumptions that the machine information in a UNC file path will remain stable over time. Instead, they should use the convenient *faux* absolute path **D:\home\site** that App Service provides. This faux absolute path provides a portable, app-and-user-agnostic method for referring to one's own app. By using **D:\home\site**, one can transfer shared files from app to app without having to configure a new absolute path for each transfer.

<a id="TypesOfFileAccess"></a>

### Types of file access granted to an app
Each customer's subscription has a reserved directory structure on a specific UNC share within a data center. A customer may have multiple apps created within a specific data center, so all of the directories belonging to a single customer subscription are created on the same UNC share. The share may include directories such as those for content, error and diagnostic logs, and earlier versions of the app created by source control. As expected, a customer's app directories are available for read and write access at runtime by the app's application code.

On the local drives attached to the virtual machine that runs an app, App Service reserves a chunk of space on the C:\ drive for app-specific temporary local storage. Although an app has full read/write access to its own temporary local storage, that storage really isn't intended to be used directly by the application code. Rather, the intent is to provide temporary file storage for IIS and web application frameworks. App Service also limits the amount of temporary local storage available to each app to prevent individual apps from consuming excessive amounts of local file storage.

Two examples of how App Service uses temporary local storage are the directory for temporary ASP.NET files and the directory for IIS compressed files. The ASP.NET compilation system uses the "Temporary ASP.NET Files" directory as a temporary compilation cache location. IIS uses the "IIS Temporary Compressed Files" directory to store compressed response output. Both of these types of file usage (as well as others) are remapped in App Service to per-app temporary local storage. This remapping ensures that functionality continues as expected.

Each app in App Service runs as a random unique low-privileged worker process identity called the "application pool identity", described further here: [https://www.iis.net/learn/manage/configuring-security/application-pool-identities](https://www.iis.net/learn/manage/configuring-security/application-pool-identities). Application code uses this identity for basic read-only access to the operating system drive (the D:\ drive). This means application code can list common directory structures and read common files on operating system drive. Although this might appear to be a somewhat broad level of access, the same directories and files are accessible when you provision a worker role in an Azure hosted service and read the drive contents. 

<a name="multipleinstances"></a>

### File access across multiple instances
The home directory contains an app's content, and application code can write to it. If an app runs on multiple instances, the home directory is shared among all instances so that all instances see the same directory. So, for example, if an app saves uploaded files to the home directory, those files are immediately available to all instances. 

<a id="NetworkAccess"></a>

## Network access
Application code can use TCP/IP and UDP-based protocols to make outbound network connections to Internet accessible endpoints that expose external services. Apps can use these same protocols to connect to services within Azure&#151;for example, by establishing HTTPS connections to SQL Database.

There is also a limited capability for apps to establish one local loopback connection, and have an app listen on that local loopback socket. This feature exists primarily to enable apps that listen on local loopback sockets as part of their functionality. Each app sees a "private" loopback connection. App "A" cannot listen to a local loopback socket established by app "B".

Named pipes are also supported as an inter-process communication (IPC) mechanism between different processes that collectively run an app. For example, the IIS FastCGI module relies on named pipes to coordinate the individual processes that run PHP pages.

<a id="Code"></a>

## Code execution, processes, and memory
As noted earlier, apps run inside of low-privileged worker processes using a random application pool identity. Application code has access to the memory space associated with the worker process, as well as any child processes that may be spawned by CGI processes or other applications. However, one app cannot access the memory or data of another app even if it is on the same virtual machine.

Apps can run scripts or pages written with supported web development frameworks. App Service doesn't configure any web framework settings to more restricted modes. For example, ASP.NET apps running on App Service run in "full" trust as opposed to a more restricted trust mode. Web frameworks, including both classic ASP and ASP.NET, can call in-process COM components (but not out of process COM components) like ADO (ActiveX Data Objects) that are registered by default on the Windows operating system.

Apps can spawn and run arbitrary code. It is allowable for an app to do things like spawn a command shell or run a PowerShell script. However, even though arbitrary code and processes can be spawned from an app, executable programs and scripts are still restricted to the privileges granted to the parent application pool. For example, an app can spawn an executable that makes an outbound HTTP call, but that same executable cannot attempt to unbind the IP address of a virtual machine from its NIC. Making an outbound network call is allowed to low-privileged code, but attempting to reconfigure network settings on a virtual machine requires administrative privileges.

<a id="Diagnostics"></a>

## Diagnostics logs and events
Log information is another set of data that some apps attempt to access. The types of log information available to code running in App Service includes diagnostic and log information generated by an app that is also easily accessible to the app. 

For example, W3C HTTP logs generated by an active app are available either on a log directory in the network share location created for the app, or available in blob storage if a customer has set up W3C logging to storage. The latter option enables large quantities of logs to be gathered without the risk of exceeding the file storage limits associated with a network share.

In a similar vein, real-time diagnostics information from .NET apps can also be logged using the .NET tracing and diagnostics infrastructure, with options to write the trace information to either the app's network share, or alternatively to a blob storage location.

Areas of diagnostics logging and tracing that aren't available to apps are Windows ETW events and common Windows event logs (for example, System, Application, and Security event logs). Since ETW trace information can potentially be viewable machine-wide (with the right ACLs), read and write access to ETW events are blocked. Developers might notice that API calls to read and write ETW events and common Windows event logs appear to work, but that is because App Service is "faking" the calls so that they appear to succeed. In reality, the application code has no access to this event data.

<a id="RegistryAccess"></a>

## Registry access
Apps have read-only access to much (though not all) of the registry of the virtual machine they are running on. In practice, this means registry keys that allow read-only access to the local Users group are accessible by apps. One area of the registry that is currently not supported for either read or write access is the HKEY\_CURRENT\_USER hive.

Write-access to the registry is blocked, including access to any per-user registry keys. From the app's perspective, write access to the registry should never be relied upon in the Azure environment since apps can (and do) get migrated across different virtual machines. The only persistent writeable storage that can be depended on by an app is the per-app content directory structure stored on the App Service UNC shares. 

## Remote desktop access

App Service doesn't provide remote desktop access to the VM instances.

## More information

[Azure App Service sandbox](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox) - The most up-to-date information about the execution environment of App Service. This page is 
maintained directly by the App Service development team.

