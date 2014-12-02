<properties title="Operating System Functionality Available to Applications on Azure Websites" pageTitle="Operating System Functionality Available to Applications on Azure Websites" description="Learn about the OS functionality available to web applications on Azure Websites" metaKeywords="Azure,Web Sites,web applications,operating system functionality" services="web-sites" solutions="web" documentationCenter="" authors="cephalin" manager="wpickett" editor="mollybos" videoId="" scriptId="" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/11/2014" ms.author="cephalin" />

# Operating System Functionality Available to Applications on Azure Websites #

This article describes the common baseline operating system functionality that is available to all applications running on Azure Websites. This functionality includes file, network, and registry access, and diagnostics logs and events. 

##Table of Contents

* [Web Site Modes](#websitemodes)
* [Development Frameworks](#developmentframeworks)
* [File Access](#FileAccess)
	* [Local drives](#LocalDrives)
	* [Network drives (aka UNC shares)](#NetworkDrives)
	* [File across multiple instances](#multipleinstances)
	* [Types of file access granted to a web application](#TypesOfFileAccess)
* [Network Access](#NetworkAccess)
* [Code Execution, Processes and Memory](#Code)
* [Diagnostics Logs and Events](#Diagnostics)
* [Registry Access](#RegistryAccess)

<a id="websitemodes"></a>
<h2>Website Modes</h2>
Azure Websites runs customer websites in a multi-tenant hosting environment. Websites deployed in the Free and Shared website scaling modes run in worker processes on shared virtual machines, while websites deployed in the Standard website scaling mode run on virtual machine(s) dedicated specifically for the websites associated with a single customer.

Because Azure Websites supports a seamless scaling experience between different modes, the security configuration enforced for websites remains the same. This ensures that web applications don't suddenly behave differently, failing in unexpected ways, when a website switches between one website mode and another.

<a id="developmentframeworks"></a>
<h2>Development Frameworks</h2>

Website modes control the amount of compute resources (CPU, disk storage, memory, and network egress) available to websites. However, the breadth of framework functionality available to applications remains the same regardless of the website mode.

Azure Websites supports a variety of development frameworks, including ASP.NET, classic ASP, node.js, PHP and python - all of which run as extensions within IIS. In order to simplify and normalize security configuration, Azure Websites typically runs the various development frameworks with their default settings. One approach to configuring Azure Websites could have been to customize the API surface area and functionality for each individual development framework. Azure Websites instead takes a more generic approach by enabling a common baseline of operating system functionality regardless of a website's application development framework.

The following sections summarize the general kinds of operating system functionality available to websites on Azure.


<a id="FileAccess"></a>
<h2>File Access</h2>

Various drives exist within Azure Websites, including local drives and network drives.

<a id="LocalDrives"></a>
<h3>Local drives</h3>

At its core, Azure Websites is a service running on top of the Azure PaaS (platform as a service) infrastructure. As a result, the local drives that are "attached" to a virtual machine are the same drive types available to any worker role running in Azure. This includes an operating system drive (the D:\ drive), an application drive that contains Azure Package cspkg files used exclusively by Azure Websites (and inaccessible to customers), and a "user" drive (the C:\ drive), whose size varies depending on the size of the VM.

<a id="NetworkDrives"></a>
<h3>Network drives (aka UNC shares)</h3>

One of the unique aspects of Azure Websites that makes web application deployment and maintenance straightforward is that all user content is stored on a set of UNC shares. This model maps very nicely to the common pattern of content storage used by on-premises web hosting environments that have multiple load-balanced servers. 

Within Azure Websites there are number of UNC shares created in each data center. A percentage of the user content for all customers in each data center is allocated to each UNC share. Furthermore, all of the file content for a single customer's subscription is always placed on the same UNC share. 

Note that due to how cloud services work, the specific virtual machine responsible for hosting a UNC share will change over time. It is guaranteed that UNC shares will be mounted by different virtual machines as they are brought up and down during the normal course of cloud operations. For this reason, web applications should never make hard-coded assumptions that the machine information in a UNC file path will remain stable over time. Instead, they should use the convenient *faux* absolute path **D:\home\site** that Azure Websites provides. This faux absolute path provides a portable, site-and-user-agnostic method for referring to one's own site. By using **D:\home\site**, one can transfer shared files from site to site without having to configure a new absolute path for each transfer.

<a id="TypesOfFileAccess"></a>
<h3>Types of file access granted to a web application</h3>

Each customer's subscription has a reserved directory structure on a specific UNC share within a data center. A customer may have multiple websites created within a specific data center, so all of the directories belonging to a single customer subscription are created on the same UNC share. The share may include directories such as those for content, error and diagnostic logs, and earlier versions of the website created by source control. As expected, a customer's website directories are available for read and write access at runtime by a website's application code.

On the local drives attached to the virtual machine that runs a website, Azure Websites reserves a chunk of space on the C:\ drive for website-specific temporary local storage. Although a website has full read/write access to its own temporary local storage, that storage really isn't intended to be used directly by application code. Rather, the intent is to provide temporary file storage for IIS and web application frameworks. Azure Websites also limits the amount of temporary local storage available to each website to prevent individual sites from consuming excessive amounts of local file storage.

Two examples of how Azure Websites uses temporary local storage are the directory for temporary ASP.NET files and the directory for IIS compressed files. The ASP.NET compilation system uses the "Temporary ASP.NET Files" directory as a temporary compilation cache location. IIS uses the "IIS Temporary Compressed Files" directory to store compressed response output. Both of these types of file usage (as well as others) are remapped in Azure Websites to per-website temporary local storage. This remapping ensures that functionality continues as expected.

Each website in Azure Websites runs as a random unique low-privileged worker process identity called the "application pool identity", described further here: [http://www.iis.net/learn/manage/configuring-security/application-pool-identities](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Application code uses this identity for basic read-only access to the operating system drive (the D:\ drive). This means application code can list common directory structures and read common files on operating system drive. Although this might appear to be a somewhat broad level of access, the same directories and files are accessible when you provision a worker role in an Azure hosted service and read the drive contents. 

<a name="multipleinstances"></a>
### File access across multiple instances

The home directory contains a site's content, and web applications can write to it. If a website runs on multiple instances, the home directory is shared among all instances so that all instances see the same directory. So, for example, if a website saves uploaded files to the home directory, those files are immediately available to all instances. 

<a id="NetworkAccess"></a>
<h2>Network Access</h2>
Application code can use TCP/IP and UDP based protocols to make outbound network connections to Internet accessible endpoints that expose external services. Applications can use these same protocols to connect to services within Azure&#151;for example, by establishing HTTPS connections to SQL Azure.

There is also a limited capability for applications to establish one local loopback connection, and have an application listen on that local loopback socket. This feature exists primarily to enable applications that listen on local loopback sockets as part of their functionality. Note that each customer's application sees a "private" loopback connection; application "A" cannot listen to a local loopback socket established by application "B".

Named pipes are also supported as an inter-process communication (IPC) mechanism between different processes that collectively run a website. For example, the IIS FastCGI module relies on named pipes to coordinate the individual processes that run PHP pages.


<a id="Code"></a>
<h2>Code Execution, Processes and Memory</h2>
As noted earlier, websites run inside of low-privileged worker processes using a random application pool identity. Application code has access to the memory space associated with the worker process, as well as any child processes that may be spawned by CGI processes or other applications. However, applications from one website cannot access the memory or data of another customer's website even if it is on the same virtual machine.

Applications can run scripts or pages written with supported web application development frameworks. Azure Websites doesn't configure any web application framework settings to more restricted modes. For example, ASP.NET sites running on Azure Websites run in "full" trust as opposed to a more restricted trust mode. Application frameworks, including both classic ASP and ASP.NET, can call in-process COM components (but not out of process COM components) like ADO (ActiveX Data Objects) that are registered by default on the Windows operating system.

Web applications can spawn and run arbitrary code. It is allowable for a web application to do things like spawn a command shell or run a PowerShell script. However, even though arbitrary code and processes can be spawned from a web application, executable programs and scripts are still restricted to the privileges granted to the parent application pool. For example, a website can spawn an executable that makes an outbound HTTP call, but that same executable cannot attempt to unbind the IP address of a virtual machine from its NIC. Making an outbound network call is allowed to low-privileged code, but attempting to reconfigure network settings on a virtual machine requires administrative privileges.


<a id="Diagnostics"></a>
<h2>Diagnostics Logs and Events</h2>
Log information is another set of data that some web applications attempt to access. The types of log information available to code running in Azure Websites includes diagnostic and log information generated by a website that is also easily accessible to a website. 

For example, W3C HTTP logs generated by an active website are available either on a log directory in the network share location created for the website, or available in blob storage if a customer has set up W3C logging to storage. The latter option enables large quantities of logs to be gathered without the risk of exceeding the file storage limits associated with a network share.

In a similar vein, real-time diagnostics information from .NET applications can also be logged using the .NET tracing and diagnostics infrastructure, with options to write the trace information to either the website's network share, or alternatively to a blob storage location.

Areas of diagnostics logging and tracing that aren't available to web applications on Azure are Windows ETW events, and common Windows event logs (e.g. System, Application and Security event logs). Since ETW trace information can potentially be viewable machine-wide (with the right ACLs), read and write access to ETW events are blocked. Developers might notice that API calls to read and write ETW events and common Windows event logs appear to work, but that is because Azure Websites is "faking" the calls so that they appear to succeed. In reality, website application code has no access to this event data.

<a id="RegistryAccess"></a>
<h2>Registry Access</h2>
Applications have read-only access to much (though not all) of the registry of the virtual machine they are running on. In practice, this means registry keys that allow read-only access to the local Users group are accessible by web applications. One area of the registry that is currently not supported for either read or write access is the HKEY\_CURRENT\_USER hive.

Write-access to the registry is blocked, including access to any per-user registry keys. From an application perspective, write access to the registry should never be relied upon in a cloud environment since applications can (and do) get migrated across different virtual machines. The only persistent writeable storage that can be depended on by a web application is the per-website content directory structure stored on the Azure Websites UNC shares. 
