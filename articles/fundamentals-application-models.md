<properties 
	pageTitle="Compute Hosting Options Provided by Azure" 
	description="Learn about Azure compute hosting options and how they work: Virtual Machines, Websites, Cloud Services, and others." 
	headerExpose="" 
	footerExpose="" 
	services="cloud-services,virtual-machines"
	authors="Thraka" 
	documentationCenter=""
	manager="timlt"/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="adegeo"/>




# Compute Hosting Options Provided by Azure

Azure provides different hosting models for running applications. Each one provides a different set of services, and so which one you choose depends on exactly what you're trying to do. This article looks at the options, describing each technology and giving examples of when you'd use it.

## Virtual Machines
Azure Virtual Machines lets developers, IT operations people, and others create and use virtual machines in the cloud. Providing what's known as *Infrastructure as a Service (IaaS)*, this technology can be used in variety of ways. Figure 1 shows its basic components.

<a name="fig2"></a>
![01_CreatingVMs][01_CreatingVMs]

**Figure 1: Azure Virtual Machines provides Infrastructure as a Service.**

As the figure shows, you can create virtual machines using either the Azure Management Portal or the REST-based Azure Service Management API. The Management Portal can be accessed from any popular browser, including Internet Explorer, Mozilla, and Chrome. For the REST API, Microsoft provides client scripting tools for Windows, Linux, and Macintosh systems. Other software is also free to use this interface.

However you access the platform, creating a new VM requires choosing a virtual hard disk (VHD) for the VM's image. These VHDs are stored in [Azure blobs](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/unstructured-blob-storage). 

To get started you have two choices 

1. Upload your own VHD 
2. Use VHDs provided by Microsoft and its partners in the Azure Virtual Machines gallery or on the Microsoft open source [VMDepot](http://vmdepot.msopentech.com/) website. 

The VHDs in the gallery and on VMDepot include clean Microsoft and Linux operating system images as well as images that include Microsoft and other third party products installed on them.  The options are growing all the time. Examples include various versions, editions and configurations of:
 
-	Windows Server 
-	Linux servers such as Suse, Ubuntu and CentOS
-	SQL Server
-	BizTalk Server 
-	SharePoint Server

Along with a VHD, you specify the size of your new VM.  The full stats for each size are listed [in the Azure library](http://msdn.microsoft.com/library/windowsazure/dn197896.aspx).  

-	**Extra Small**, with a shared core and 768MB  of memory.
-	**Small**, with 1 core and 1.75GB  of memory.
-	**Medium**, with 2 cores and 3.5GB  of memory.
-	**Large**, with 4 cores and 7GB of memory.
-	**Extra Large**, with 8 cores and 14GB of memory.
-	**A6**, with 4 cores and 28GB of memory.
-	**A7**, with 8 cores and 56GB of memory.

Finally, you choose which Azure datacenter your new VM should run in, whether in the US, Europe, or Asia. 

Once a VM is running, you pay for each hour it runs, and you stop paying when you remove that VM. The amount you pay doesn't depend on how much your VM is used -- it's based solely on wall-clock time. A VM that sits idle for an hour costs the same as one that's heavily loaded. 

Each running VM has an associated *OS disk*, kept in a blob. When you create a VM using a gallery VHD, that VHD is copied to your VM's OS disk. Any changes you make to the operating system of your running VM are stored here. For example, if you install an application that modifies the Windows registry, that change will be stored in your VM's OS disk. The next time you create a VM from that OS disk, the VM continues running in the same state you left it in. For VHDs stored in the gallery, Microsoft applies updates when needed, such as operating system patches. For the VHDs in your own OS disks, however, you're responsible for applying these updates (although Windows Update is turned on by default).

Running VMs can also be modified and then captured using the sysprep tool. Sysprep removes specifics like the machine name so that a VHD image can be used to create additional VMs with the same general configuration. These images are stored in the Management portal alongside your uploaded images so they can be used as a starting point for additional VMs. 

Virtual Machines also monitors the hardware hosting each VM you create. If a physical server running a VM fails, the platform notices this and starts the same VM on another machine. And assuming you have the right licensing, you can copy a changed VHD out of your OS disk, then run it someplace else, such as in your own on-premises datacenter or at another cloud provider. 

Along with its OS disk, your VM has one or more data disks. Even though each of these looks like a mounted disk drive to your VM, the contents of each one is in fact stored in a blob. Every write made to a data disk is stored persistently in the underlying blob. As with all blobs, Azure replicates these both within a single datacenter and across datacenters to guard against failures.

Running VMs can be managed using the Management Portal, PowerShell and other scripting tools, or directly through the REST API. (In fact, whatever you can do through the Management Portal can be done programmatically through this API.) Microsoft partners such as RightScale and ScaleXtreme also provide management services that rely on the REST API.

Azure Virtual Machines can be used in a variety of ways. The primary scenarios that Microsoft targets include these:

- **VMs for development and test.** Development groups commonly need VMs with specific configurations for creating applications. Azure Virtual Machines provides a straightforward and economical way to create these VMs, use them, then remove them when they're no longer needed.
- **Running applications in the cloud.** For some applications, running on the public cloud makes economic sense. Think about an application with large spikes in demand, for example. It's always possible to buy enough machines for your own datacenter to run this application, but most of those machines are likely to sit unused much of the time. Running this application on Azure lets you pay for extra VMs only when you need them, shutting them down when a demand spike has ended. Or suppose you're a start-up that needs on-demand computing resources quickly and with no commitment. Once again, Azure can be the right choice.
- **Extending your own datacenter into the public cloud.** With Azure Virtual Network, your organization can create a virtual network (VNET) that makes a group of Azure VMs appear to be part of your own on-premises network. This allows running applications such as SharePoint and others on Azure, an approach that might be easier to deploy and/or less expensive than running them in your own datacenter. You can also run [SQL Server on VMs](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/data-storage-options/#sqliaas) if that meets your needs better than Azure SQL Database.  
- **Disaster recovery.** Rather than paying continuously for a backup datacenter that's rarely used, IaaS-based disaster recovery lets you pay for the computing resources you need only when you really need them.  For example, if your primary datacenter goes down, you can create VMs running on Azure to run essential applications, then shut them down when they're no longer needed.

These aren't the only possibilities, but they're good examples of how you might use Azure Virtual Machines.  

## Websites

Azure Virtual Machines can handle a wide range of cloud hosting tasks. But creating and managing a VM infrastructure requires specialized skills and substantial effort. If you don't need complete control over the VMs that run your website or compute workload, there's an easier (and cheaper) solution: *Platform as a Service* (PaaS). With PaaS, Azure handles most of the management work for the VMs that run your applications. Azure Websites is a fully managed PaaS offering that allows you to build, deploy, and scale enterprise-grade web apps in seconds.

Websites is the best Azure Compute choice for many kinds of web apps and compute workloads. A corporation might want to build or migrate a commercial website that can handle millions of hits a week and is deployed in several data centers across the globe. The same corporation might also have a line-of-business app that tracks expense reports for authenticated users from the corporate Active Directory. The expense reports might require periodic background jobs to calculate and summarize large volumes of information. An IT consultant might adapt a popular open source application to set up a content management system for a small business. Figure 2 shows some of the kinds of web apps that can run in Azure Websites.

<a name="fig2"></a>
![05_Websites][05_Websites]
 
**Figure 2: Azure Websites supports static websites, popular web applications, and custom web applications built with various technologies. You can also run non-web compute workloads using the WebJobs feature.** 

The Azure Websites service is not only for web applications: you can run any kind of compute workload on Websites using the [WebJobs](websites-webjobs-resources.md) feature. 

Websites gives you the option of running on shared VMs that contain multiple websites created by multiple users, or on VMs that are used only by you. VMs are a part of a pool of resources managed by Azure Websites and thus allow for high reliability and fault tolerance.

Getting started is easy. With Azure Websites, users can select from a range of applications, frameworks and template and create a website in seconds. They can then use their favorite development tools (WebMatrix, Visual Studio, any other editor) and source control options to set up continuous integration and develop as a team. Applications that rely on a MySQL DB can consume a MySQL service provided for Azure by ClearDB, a Microsoft partner.

Developers can create large, scalable web applications with Websites. The technology supports creating applications using ASP.NET, PHP, Node.js and Python. Applications can use sticky sessions, for example, and many existing web applications can be moved to this cloud platform with no changes. Applications built on Websites are free to use other aspects of Azure, such as Service Bus, SQL Database, and Blob Storage. You can also run multiple copies of an application in different VMs, with Websites automatically load balancing requests across them. And because new Websites instances are created in VMs that already exist, starting a new application instance happens very quickly; it's significantly faster than waiting for a new VM to be created.

As [Figure 2](#fig2) shows, you can publish code and other web content into Websites in several ways. You can use FTP, FTPS, or Microsoft's WebDeploy technology. Websites also supports publishing code from source control systems, including Git, GitHub, CodePlex, BitBucket, Dropbox, Mercurial, Team Foundation Server, and the cloud-based Team Foundation Service.


## Cloud Services

The third compute option, Cloud Services, is another example of Platform-as-a-Service (PaaS). Like Websites, this technology is designed to support applications that are scalable, reliable, and cheap to operate. Like Websites, Cloud Services relies on VMs, but gives you more control over the VMs than you get with Websites. You can install your own software on Cloud Service VMs and you can remote into them. Figure 3 illustrates the idea.

<a name="fig3"></a>
![06_CloudServices2][06_CloudServices2] 

**Figure 3: Azure Cloud Services provides Platform as a Service.**

More control also means less ease of use; unless you need the  additional control options, it's typically quicker and easier to get a web application up and running in Websites compared to Cloud Services. 

The technology provides two slightly different VM options: instances of *web roles* run a variant of Windows Server with IIS, while instances of *worker roles* run the same Windows Server variant without IIS. A Cloud Services application relies on some combination of these two options. 

For example, a simple application might use just a web role, while a more complex application might use a web role to handle incoming requests from users, then pass the work those requests create to a worker role for processing. (This communication could use [Service Bus](fundamentals-service-bus-hybrid-solutions.md) or [Azure Queues](storage-introduction.md).)

As the figure suggests, all of the VMs in a single application run in the same cloud service. Because of this, users access the application through a single public IP address, with requests automatically load balanced across the application's VMs. The platform will deploy the VMs in a Cloud Services application in a way that avoids a single point of hardware failure.

Even though applications run in virtual machines, it's important to understand that Cloud Services provides PaaS, not IaaS. Here's one way to think about it: With IaaS, such as Azure Virtual Machines, you first create and configure the environment your application will run in, then deploy your application into this environment. You're responsible for managing much of this world, doing things such as deploying new patched versions of the operating system in each VM. In PaaS, by contrast, it's as if the environment already exists. All you have to do is deploy your application. Management of the platform it runs on, including deploying new versions of the operating system, is handled for you.

With Cloud Services, you don't create virtual machines. Instead, you provide a configuration file that tells Azure how many of each you'd like, such as three web role instances and two worker role instances, and the platform creates them for you.  You still choose what size those VMs should be -- the options are the same as with Azure VMs -- but you don't explicitly create them yourself. If your application needs to handle a greater load, you can ask for more VMs, and Azure will create those instances. If the load decreases, you can shut those instances down and stop paying for them.

A Cloud Services application is typically made available to users via a two-step process. A developer first uploads the application to the platform's staging area. When the developer is ready to make the application live, she uses the Azure Management Portal to request that it be put into production. This switch between staging and production can be done with no downtime, which lets a running application be upgraded to a new version without disturbing its users. 

Cloud Services also provides monitoring. Like Azure Virtual Machines, it will detect a failed physical server and restart the VMs that were running on that server on a new machine. But Cloud Services also detects failed VMs and applications, not just hardware failures. Unlike Virtual Machines, it has an agent inside each web and worker role, and so it's able to start new VMs and application instances when failures occur.

The PaaS nature of Cloud Services has other implications, too. One of the most important is that applications built on this technology should be written to run correctly when any web or worker role instance fails. To achieve this, a Cloud Services application shouldn't maintain state in the file system of its own VMs. Unlike VMs created with Azure Virtual Machines, writes made to Cloud Services VMs aren't persistent; there's nothing like a Virtual Machines data disk. Instead, a Cloud Services application should explicitly write all state to SQL Database, blobs, tables, or some other external storage. Building applications this way makes them easier to scale and more resistant to failure, both important goals of Cloud Services.


## Other Options

Azure also offers other compute hosting models for more specialized purposes, such as the following:

* [Mobile Services](/services/mobile-services/). Optimized to provide a cloud back-end for apps that run on mobile devices.
* [Batch](/services/batch/) (currently in Preview). Optimized for processing large volumes of similar tasks, ideally workloads which lend themselves to running as parallel tasks on multiple computers.
* [HDInsight (Hadoop)](/services/hdinsight/). Optimized for running [MapReduce](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/data-storage-options/#hadoop) jobs on Hadoop clusters. 

## What Should I Use? Making a Choice

All three of the general purpose Azure compute hosting models let you build scalable, reliable applications in the cloud. Given this essential similarity, which one should you use?

Azure Websites is the best choice for most web apps. Deployment and management are integrated into the platform, sites can scale quickly to handle high traffic loads, and the built-in load balancing and traffic manager provide high availability. You can move existing sites to Azure Websites easily with an [online migration tool](https://www.migratetoazure.net/), use an open-source app from the Web Application Gallery, or create a new site using the framework and tools of your choice. The [WebJobs](http://go.microsoft.com/fwlink/?linkid=390226) feature makes it easy to add background job processing to your app, or even run a compute workload that isn't a web app at all. 

If you need more control over the web server environment, such as the ability to remote into your server or configure server startup tasks, Azure Cloud Services is typically the best option.

If you have an existing application that would require substantial modifications to run in Azure Websites or Azure Cloud Services, you could choose Azure Virtual Machines in order to simplify migrating to the cloud. However, correctly configuring, securing, and maintaining VMs requires much more time and IT expertise compared to Azure Websites and Cloud Services. If you are considering Azure Virtual Machines, make sure you take into account the ongoing maintenance effort required to patch, update, and manage your VM environment.

Sometimes, no single option is right. In situations like this, it's perfectly legal to combine options. For example, suppose you're building an application where you'd like the management benefits of Cloud Services web roles, but you also need to use standard SQL Server for compatibility or performance reasons. In this case, the best option is to combine compute hosting options, as Figure 4 shows.

<a name="fig4"></a>
![07_CombineTechnologies][07_CombineTechnologies] 
 
**Figure 4: A single application can use multiple hosting options.**

As the figure illustrates, the Cloud Services VMs run in a separate cloud service from the Virtual Machines VMs. Still, the two can communicate quite efficiently, so building an app this way is sometimes the best choice.

For more information about how to choose the hosting option or options for your scenario, see [Azure Websites, Cloud Services, and Virtual Machines comparison](../choose-web-site-cloud-service-vm/).


[01_CreatingVMs]: ./media/fundamentals-application-models/ExecModels_01_CreatingVMs.png
[02_CloudServices]: ./media/fundamentals-application-models/ExecModels_02_CloudServices.png
[03_AppUsingSQLServer]: ./media/fundamentals-application-models/ExecModels_03_AppUsingSQLServer.png
[04_SharePointFarm]: ./media/fundamentals-application-models/ExecModels_04_SharePointFarm.png
[05_Websites]: ./media/fundamentals-application-models/ExecModels_05_Websites.png
[06_CloudServices2]: ./media/fundamentals-application-models/ExecModels_06_CloudServices2.png
[07_CombineTechnologies]: ./media/fundamentals-application-models/ExecModels_07_CombineTechnologies.png


