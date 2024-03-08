---
title: Operating system functionality in Azure App Service
description: Learn what types of file, network, and registry access your Windows app gets when it runs in Azure App Service. 
author: msangapu-msft
ms.author: msangapu
ms.assetid: 39d5514f-0139-453a-b52e-4a1c06d8d914
ms.topic: article
ms.date: 01/21/2022
ms.custom: UpdateFrequency3

---
# Operating system functionality in Azure App Service

This article describes the baseline operating system functionality that's available to all Windows apps running in [Azure App Service](./overview.md). This functionality includes file, network, and registry access, along with diagnostics logs and events.

> [!NOTE]
> [Linux apps](overview.md#app-service-on-linux) in App Service run in their own containers. You have root access to the container but no access to the host operating system. Likewise, for [apps running in Windows containers](quickstart-custom-container.md?pivots=container-windows), you have administrative access to the container but no access to the host operating system.

<a id="tiers"></a>

## App Service plan tiers

App Service runs customer apps in a multitenant hosting environment. Apps deployed in the Free and Shared tiers run in worker processes on shared virtual machines (VMs). Apps deployed in the Standard and Premium tiers run on VMs dedicated specifically for the apps associated with a single customer.

[!INCLUDE [app-service-dev-test-note](../../includes/app-service-dev-test-note.md)]

Because App Service supports a seamless scaling experience between tiers, the security configuration enforced for App Service apps remains the same. This configuration ensures that apps don't suddenly behave differently and fail in unexpected ways when an App Service plan switches from one tier to another.

<a id="developmentframeworks"></a>

## Development frameworks

App Service pricing tiers control the amount of compute resources (CPU, disk storage, memory, and network egress) available to apps. However, the breadth of framework functionality available to apps remains the same regardless of the scaling tiers.

App Service supports various development frameworks, including ASP.NET, classic ASP, Node.js, PHP, and Python. To simplify and normalize security configuration, App Service apps typically run the development frameworks with their default settings. The frameworks and runtime components that the platform provides are updated regularly to satisfy security and compliance requirements. For this reason, we don't guarantee specific minor/patch versions. We recommend that customers target major versions as needed.

The following sections summarize the general kinds of operating system functionality available to App Service apps.

<a id="FileAccess"></a>

## File access

Various drives exist within App Service, including local drives and network drives.

<a id="LocalDrives"></a>

### Local drives

At its core, App Service is a service running on top of the Azure platform as a service (PaaS) infrastructure. As a result, the local drives that are associated with a virtual machine are the same drive types available to any worker role running in Azure. They include:

- An operating system drive (`%SystemDrive%`) whose size depends on the size of the VM.
- A resource drive (`%ResourceDrive%`) that App Service uses internally.

A best practice is to always use the environment variables `%SystemDrive%` and `%ResourceDrive%` instead of hard-coded file paths.  The root path returned from these two environment variables has shifted over time from `d:\` to `c:\`.  However, older applications hard-coded with file path references to `d:\` continue to work because App Service automatically remaps `d:\` to point at `c:\`. As noted earlier, we highly recommend that you always use the environment variables when building file paths and avoid confusion over platform changes to the default root file path.

It's important to monitor your disk utilization as your application grows. Reaching the disk quota can have adverse effects on your application. For example:

- The app might throw an error that indicates there's not enough space on the disk.
- You might see disk errors when browsing to the Kudu console.
- Deployment from Azure DevOps or Visual Studio might fail with `ERROR_NOT_ENOUGH_DISK_SPACE: Web deployment task failed. (Web Deploy detected insufficient space on disk)`.
- Your app might have slow performance.

<a id="NetworkDrives"></a>

### Network drives (UNC shares)

One of the unique aspects of App Service that make app deployment and maintenance straightforward is that all content shares are stored on a set of UNC shares. This model maps well to the common pattern of content storage used by on-premises web hosting environments that have multiple load-balanced servers.

Within App Service, UNC shares are created in each datacenter. A percentage of the user content for all customers in each datacenter is allocated to each UNC share. Each customer's subscription has a reserved directory structure on a specific UNC share in a datacenter. A customer might have multiple apps created in a specific datacenter, so all of the directories that belong to a single customer subscription are created on the same UNC share.

Because of the way that Azure services work, the specific virtual machine responsible for hosting a UNC share changes over time. UNC shares are mounted by different virtual machines as they're brought up and down during the normal course of Azure operations. For this reason, apps should never make hard-coded assumptions that the machine information in a UNC file path will remain stable over time. Instead, they should use the convenient *faux* absolute path `%HOME%\site` that App Service provides.

The faux absolute path is a portable method for referring to your own app. It's not specific to any app or user. By using `%HOME%\site`, you can transfer shared files from app to app without having to configure a new absolute path for each transfer.

<a id="TypesOfFileAccess"></a>

### Types of file access granted to an app

The `%HOME%` directory in an app maps to a content share in Azure Storage dedicated for that app. Your [pricing tier](https://azure.microsoft.com/pricing/details/app-service/) defines its size. It might include directories such as those for content, error and diagnostic logs, and earlier versions of the app that source control created. These directories are available to the app's application code at runtime for read and write access. Because the files aren't stored locally, they're persistent across app restarts.

On the system drive, App Service reserves `%SystemDrive%\local` for app-specific temporary local storage. Changes to files in this directory are *not* persistent across app restarts. Although an app has full read and write access to its own temporary local storage, that storage isn't intended for direct use by the application code. Rather, the intent is to provide temporary file storage for IIS and web application frameworks.

App Service limits the amount of storage in `%SystemDrive%\local` for each app to prevent individual apps from consuming excessive amounts of local file storage. For Free, Shared, and Consumption (Azure Functions) tiers, the limit is 500 MB. The following table lists other tiers:

| Tier | Local file storage |
| - | - |
| B1/S1/P1 | 11 GB |
| B2/S2/P2 | 15 GB |
| B3/S3/P3 | 58 GB |
| P0v3 | 11 GB |
| P1v2/P1v3/P1mv3/Isolated1/Isolated1v2 | 21 GB |
| P2v2/P2v3/P2mv3/Isolated2/Isolated2v2 | 61 GB |
| P3v2/P3v3/P3mv3/Isolated3/Isolated3v2 | 140 GB |
| Isolated4v2 | 276 GB|
| P4mv3 | 280 GB |
| Isolated5v2 | 552 GB|
| P5mv3 | 560 GB |
| Isolated6v2 | 1,104 GB|

Two examples of how App Service uses temporary local storage are the directory for temporary ASP.NET files and the directory for IIS compressed files. The ASP.NET compilation system uses the `%SystemDrive%\local\Temporary ASP.NET Files` directory as a temporary compilation cache location. IIS uses the `%SystemDrive%\local\IIS Temporary Compressed Files` directory to store compressed response output. Both of these types of file usage (along with others) are remapped in App Service to per-app temporary local storage. This remapping helps ensure that functionality continues as expected.

Each app in App Service runs as a random, unique, low-privileged worker process identity called the [application pool identity](/iis/manage/configuring-security/application-pool-identities). Application code uses this identity for basic read-only access to the operating system drive. This access means that application code can list common directory structures and read common files on the operating system drive. Although this level of access might seem to be broad, the same directories and files are accessible when you provision a worker role in an Azure-hosted service and read the drive contents.

<a name="multipleinstances"></a>

### File access across multiple instances

The content share (`%HOME%`) directory contains an app's content, and application code can write to it. If an app runs on multiple instances, the `%HOME%` directory is shared among all instances so that all instances see the same directory. For example, if an app saves uploaded files to the `%HOME%` directory, those files are immediately available to all instances.

The temporary local storage (`%SystemDrive%\local`) directory is not shared between instances. It's also not shared between the app and its [Kudu app](resources-kudu.md).

<a id="NetworkAccess"></a>

## Network access

Application code can use TCP/IP and UDP-based protocols to make outbound network connections to internet-accessible endpoints that expose external services. Apps can use these same protocols to connect to services within Azure--for example, by establishing HTTPS connections to Azure SQL Database.

There's also a limited capability for apps to establish one local loopback connection and have an app listen on that local loopback socket. This feature enables apps that listen on local loopback sockets as part of their functionality. Each app has a private loopback connection. One app can't listen to a local loopback socket that another app established.

Named pipes are also supported as a mechanism for interprocess communication between processes that collectively run an app. For example, the IIS FastCGI module relies on named pipes to coordinate the individual processes that run PHP pages.

<a id="Code"></a>

## Code execution, processes, and memory

As noted earlier, apps run inside low-privileged worker processes by using a random application pool identity. Application code has access to the memory space associated with the worker process, along with any child processes that CGI processes or other applications might spawn. However, one app can't access the memory or data of another app, even if it's on the same virtual machine.

Apps can run scripts or pages written with supported web development frameworks. App Service doesn't configure any web framework settings to more restricted modes. For example, ASP.NET apps running in App Service run in full trust, as opposed to a more restricted trust mode. Web frameworks, including both classic ASP and ASP.NET, can call in-process COM components (like ActiveX Data Objects) that are registered by default on the Windows operating system. Web frameworks can't call out-of-process COM components.

An app can spawn and run arbitrary code, open a command shell, or run a PowerShell script. However, executable programs and scripts are still restricted to the privileges granted to the parent application pool. For example, an app can spawn an executable program that makes an outbound HTTP call, but that executable program can't try to unbind the IP address of a virtual machine from its network adapter. Making an outbound network call is allowed for low-privileged code, but trying to reconfigure network settings on a virtual machine requires administrative privileges.

<a id="Diagnostics"></a>

## Diagnostics logs and events

Log information is another set of data that some apps try to access. The types of log information available to code running in App Service include diagnostic and log information that an app generates and can easily access.

For example, app-generated W3C HTTP logs are available either:

- In a log directory in the network share location that you created for the app
- In blob storage if you set up W3C logging to storage

The latter option enables apps to gather large amounts of logs without exceeding the file storage limits associated with a network share.

Similarly, real-time diagnostics information from .NET apps can be logged through the .NET tracing and diagnostics infrastructure. You can then write the trace information to either the app's network share or a blob storage location.

Areas of diagnostics logging and tracing that aren't available to apps are Windows Event Tracing for Windows (ETW) events and common Windows event logs (for example, system, application, and security event logs). Because ETW trace information can potentially be viewable across a machine (with the right access control lists), read access and write access to ETW events are blocked. API calls to read and write ETW events and common Windows event logs might seem to work, but in reality, the application code has no access to this event data.

<a id="RegistryAccess"></a>

## Registry access

Apps have read-only access to much (though not all) of the registry of the virtual machine that they're running on. This access means that apps can access registry keys that allow read-only access to the Local Users group. One area of the registry that's currently not supported for either read or write access is the `HKEY\_CURRENT\_USER` hive.

Write access to the registry is blocked, including access to any per-user registry keys. From the app's perspective, it can't rely on write access to the registry in the Azure environment because apps can be migrated across virtual machines. The only persistent writeable storage that an app can depend on is the per-app content directory structure stored on the App Service UNC shares.

## Remote desktop access

App Service doesn't provide remote desktop access to the VM instances.

## More information

For the most up-to-date information about the execution environment of App Service, see the [Azure App Service sandbox](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox). The App Service development team maintains this page.
