<properties umbracoNaviHide="0" pageTitle="Application Model" metaKeywords="Azure, Azure, application model, Azure application model, development model, Azure development model, hosted service, Azure hosted service, web role, worker role" description="Learn about the Azure hosted service application model. Understand core concepts, design considerations, defining and configuring your application, and scaling." urlDisplayName="Application Model" headerExpose="" footerExpose="" disqusComments="1" title="Application Model" authors="robb" manager="johndaw" />

<tags ms.service="multiple" ms.workload="multiple" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="robb" />



#Azure Execution Models

Azure provides different execution models for running applications. Each one provides a different set of services, and so which one you choose depends on exactly what you're trying to do. This article looks at three, describing each technology and giving examples of when you'd use it.

##Table of Contents

- [Virtual Machines](#VMachine)
- [Web Sites](#WebSites)
- [Cloud Services](#CloudServices)
- [What Should I Use? Making a Choice](#WhatShouldIUse)

<h2><a id="VMachine"></a>Virtual Machines</h2>
Azure Virtual Machines lets developers, IT operations people, and others create and use virtual machines in the cloud. Providing what's known as *Infrastructure as a Service (IaaS)*, this technology can be used in variety of ways. [Figure 1](#Fig1) shows its basic components.

<a name="Fig1"></a>![01_CreatingVMs][01_CreatingVMs]

**Figure 1: Azure Virtual Machines provides Infrastructure as a Service.**

As the figure shows, you can create virtual machines using either the Azure Management Portal or the REST-based Azure Service Management API. The Management Portal can be accessed from any popular browser, including Internet Explorer, Mozilla, and Chrome. For the REST API, Microsoft provides client scripting tools for Windows, Linux, and Macintosh systems. Other software is also free to use this interface.

However you access the platform, creating a new VM requires choosing a virtual hard disk (VHD) for the VM's image. These VHDs are stored in Azure blobs. 

To get started you have two choices 

1. Upload your own VHD 
2. Use VHDs provided by Microsoft and its partners in the Azure Virtual Machines gallery or on the Microsoft open source [VMDepot](http://vmdepot.msopentech.com/) website. 

The VHDs in the gallery and on VMDepot include clean Microsoft and Linux operating system images as well as images that include Microsoft and other third party products installed on them.  The options are growing all the time. Examples include various versions, editions and configurations of:
 
-	Windows Server 
-	Linux servers such as Suse, Ubuntu and CentOS
-	SQL Server
-	BizTalk Server 
-	SharePoint Server



Along with a VHD, you specify the size of your new VM.  The full stats for each size are listed [in the Azure library](http://msdn.microsoft.com/en-us/library/windowsazure/dn197896.aspx).  

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
- **Extending your own datacenter into the public cloud.** With Azure Virtual Network, your organization can create a virtual network (VNET) that makes a group of Azure VMs appear to be part of your own on-premises network. This allows running applications such as SharePoint and others on Azure, an approach that might be easier to deploy and/or less expensive than running them in your own datacenter.
- **Disaster recovery.** Rather than paying continuously for a backup datacenter that's rarely used, IaaS-based disaster recovery lets you pay for the computing resources you need only when you really need them.  For example, if your primary datacenter goes down, you can create VMs running on Azure to run essential applications, then shut them down when they're no longer needed. 

These aren't the only possibilities, but they're good examples of how you might use Azure Virtual Machines.  


###Grouping VMs: Cloud Services 

When you create a new VM with Azure Virtual Machines, you can choose to run it standalone or make it part of a group of VMs running together in a *cloud service*. (Despite the similar names, don't confuse this concept with Cloud Services, the name of Azure's PaaS technology; the two aren't the same.)  Each standalone VM is assigned its own public IP address, while all of the VMs in the same cloud service are accessed through a single public IP address. [Figure 2](#Fig2) shows how this looks.
 
<a name="Fig2"></a>![02_CloudServices][02_CloudServices]

**Figure 2: Each standalone VM has its own public IP address, while VMs grouped into a cloud service are exposed via a single public IP address.**

For example, if you were creating a virtual machine to create and test a simple application, you'd probably use a standalone VM. If you're creating a multi-tier application, though, with a web front end, a database, and maybe even a middle tier, you'd most likely connect multiple VMs into a cloud service, as Figure 2 suggests.

Grouping VMs into a cloud service lets you use other options as well. Azure provides load balancing for VMs in the same cloud service, spreading user requests across them. VMs connected in this way can also communicate directly with one another over the local network within an Azure datacenter. 

VMs in the same cloud service can also be grouped into one or more *availability sets*. To understand why this is important, think about a web application that runs multiple front-end VMs. If all of these VMs are deployed on the same physical machine or even in the same rack of machines, a single hardware failure can make them all inaccessible. If these VMs are grouped into an availability set, however, Azure will deploy them across the datacenter so that none of them share a single point of failure.

###Scenario: Running an Application with SQL Server

To get a better sense of how Azure Virtual Machines works, it's useful to look at a couple of scenarios in a little more detail. Suppose, for example, that you want to create a reliable and scalable web application running on Azure. One way to do this is to run the application's logic in one or more Azure VMs, then use SQL Server for data management. [Figure 3](#Fig3) shows how this looks.

<a name="Fig3"></a>![03_AppUsingSQLServer][03_AppUsingSQLServer]

**Figure 3: An application running in Azure Virtual Machines can use SQL Server for storage.**

In this example, both kinds of VMs are created from standard VHDs in the gallery. The application's logic runs on Windows Server 2008 R2, so the developer creates three VMs from this VHD, then installs his application in each one. Since all of these VMs are in the same cloud service, he can configure hardware load balancing to spread requests across them. The developer also creates two VMs from the gallery's VHD containing SQL Server 2012. Once they're running, he configures SQL Server in each instance to use database mirroring with automatic failover. This isn't required -- the application could use just a single SQL Server instance -- but taking this approach improves reliability. 

###Scenario: Running a SharePoint Farm 

Suppose an organization wishes to create a SharePoint farm but doesn't want to run the farm in its own datacenter. Maybe the on-premises datacenter is short of resources, or perhaps the business unit creating the farm doesn't want to deal with its internal IT group. In cases like these, running SharePoint on Azure Virtual Machines can make sense. [Figure 4](#Fig4) shows how this looks.

<a name="Fig4"></a>![04_SharePointFarm][04_SharePointFarm]
 
**Figure 4: Azure Virtual Machines allows running a SharePoint farm in the cloud.**

A SharePoint farm has several components, each running in an Azure VM created from a different VHD. What's needed is the following:

- Microsoft SharePoint. There are trial images in the gallery or the organization provides its own VHD.
- Microsoft SQL Server. SharePoint depends on SQL Server, so the organization creates VMs running SQL Server 2012 from a standard gallery VHD.
- Windows Server Active Directory. SharePoint also requires Active Directory, so the organization creates domain controllers in the cloud using a Windows Server image from the gallery. This isn't strictly required -- it's also possible to use on-premises domain controllers -- but SharePoint interacts frequently with Active Directory, and so the approach shown here will have better performance.

Although it's not shown in the figure, this SharePoint farm is probably connected to an on-premises network using Azure Virtual Network. This lets the VMs -- and the applications they contain -- appear to be local to the people using that network.

As these examples show, you can use Azure Virtual Machines to create and run new applications in the cloud, to run existing applications, or in other ways. Whatever option you choose, the technology's goal is the same: providing a general-purpose foundation for public cloud computing.



<h2><a id="WebSites"></a>Websites</h2>

People use web technologies in many different ways. A corporation may need to migrate or setup a presence website that can handle millions of hits a week and be deployed in several data centers across the globe. A web design agency might work with a team of developers to build a custom web application capable of handling thousands of users. A corporate developer may need to setup an application to track expense reports in the Cloud for authenticated users from his corporate Active Directory. An IT consultant might use a popular open source application to set up a content management system for a small business.
All of these things could be accomplished using Azure Virtual Machines. But creating and managing raw VMs requires some skill and takes effort. If you need to implement a website or web application, there's an easier (and cheaper) solution: the approach commonly known as Platform as a Service (PaaS). As Figure 5 shows, Azure provides this with Websites.


<a name="Fig5"></a>![05_Websites][05_Websites]
 
**Figure 5: Azure Websites supports static websites, popular web applications, and custom web applications built with various technologies.** 

Azure Websites is built on top of Azure Cloud Services to create a Platform as a Service solution optimized for running web applications. As the figure shows, Websites runs on a set of single VMs that may contain multiple websites created by multiple users as well as standard VMs that belong to an individual user. VMs are a part of a pool of resources managed by Azure Websites and thus allow for high reliability and fault tolerance.
Getting started is easy. With Azure Websites, users can select from a range of applications, frameworks and template and create a website in seconds. They can then use their favorite development tools (WebMatrix, Visual Studio, any other editor) and source control options to setup continuous integration and develop as a team. Applications that rely on a MySQL DB can consume a MySQL service provided for Azure by ClearDB, a Microsoft partner.
Developers can create large, scalable web applications with Websites. The technology supports creating applications using ASP.NET, PHP, Node.js and Python. Applications can use sticky sessions, for example, and existing web applications can be moved to this cloud platform with no changes. Applications built on Websites are free to use other aspects of Azure, such as Service Bus, SQL Database, and Blob Storage. You can also run multiple copies of an application in different VMs, with Websites automatically load balancing requests across them. And because new Websites instances are created in VMs that already exist, starting a new application instance happens very quickly; it's significantly faster than waiting for a new VM to be created.
As [Figure 5](#Fig5) shows, you can publish code and other web content into Websites in several ways. You can use FTP, FTPS, or Microsoft's WebDeploy technology. Websites also supports publishing code from source control systems, including Git, GitHub, CodePlex, BitBucket, Dropbox, Mercurial, Team Foundation Server, and the cloud-based Team Foundation Service.


<h2><a id="CloudServices"></a>Cloud Services</h2>

Azure Virtual Machines provides IaaS, while Azure Websites provides web hosting. The third compute option, Cloud Services, provides *Platform as a Service (PaaS)*. This technology is designed to support applications that are scalable, reliable, and cheap to operate. It's also meant to free developers from worrying about managing the platform they're using, letting them focus entirely on their applications. [Figure 6](#Fig6) illustrates the idea.

<a name="Fig6"></a>![06_CloudServices2][06_CloudServices2] 

**Figure 6: Azure Cloud Services provides Platform as a Service.**

Like the other Azure compute options, Cloud Services relies on VMs. The technology provides two slightly different VM options: instances of *web roles* run a variant of Windows Server with IIS, while instances of *worker roles* run the same Windows Server variant without IIS. A Cloud Services application relies on some combination of these two options. 

For example, a simple application might use just a web role, while a more complex application might use a web role to handle incoming requests from users, then pass the work those requests create to a worker role for processing. (This communication could use Service Bus or Azure Queues.)

As the figure suggests, all of the VMs in a single application run in the same cloud service, as described earlier with Azure Virtual Machines. Because of this, users access the application through a single public IP address, with requests automatically load balanced across the application's VMs. And as with cloud services created using Azure Virtual Machines, the platform will deploy the VMs in a Cloud Services application in a way that avoids a single point of hardware failure.

Even though applications run in virtual machines, it's important to understand that Cloud Services provides PaaS, not IaaS. Here's one way to think about it: With IaaS, such as Azure Virtual Machines, you first create and configure the environment your application will run in, then deploy your application into this environment. You're responsible for managing much of this world, doing things such as deploying new patched versions of the operating system in each VM. In PaaS, by contrast, it's as if the environment already exists. All you have to do is deploy your application. Management of the platform it runs on, including deploying new versions of the operating system, is handled for you.

With Cloud Services, you don't create virtual machines. Instead, you provide a configuration file that tells Azure how many of each you'd like, such as three web role instances and two worker role instances, and the platform creates them for you.  You still choose what size those VMs should be -- the options are the same as with Azure VMs -- but you don't explicitly create them yourself. If your application needs to handle a greater load, you can ask for more VMs, and Azure will create those instances. If the load decreases, you can shut those instances down and stop paying for them.

A Cloud Services application is typically made available to users via a two-step process. A developer first uploads the application to the platform's staging area. When the developer is ready to make the application live, she uses the Azure Management Portal to request that it be put into production. This switch between staging and production can be done with no downtime, which lets a running application be upgraded to a new version without disturbing its users. 

Cloud Services also provides monitoring. Like Azure Virtual Machines, it will detect a failed physical server and restart the VMs that were running on that server on a new machine. But Cloud Services also detects failed VMs and applications, not just hardware failures. Unlike Virtual Machines, it has an agent inside each web and worker role, and so it's able to start new VMs and application instances when failures occur.

The PaaS nature of Cloud Services has other implications, too. One of the most important is that applications built on this technology should be written to run correctly when any web or worker role instance fails. To achieve this, a Cloud Services application shouldn't maintain state in the file system of its own VMs. Unlike VMs created with Azure Virtual Machines, writes made to Cloud Services VMs aren't persistent; there's nothing like a Virtual Machines data disk. Instead, a Cloud Services application should explicitly write all state to SQL Database, blobs, tables, or some other external storage. Building applications this way makes them easier to scale and more resistant to failure, both important goals of Cloud Services.


<h2><a id="WhatShouldIUse"></a>What Should I Use? Making a Choice</h2>

All three Azure execution models let you build scalable, reliable applications in the cloud. Given this essential similarity, which one should you use? The answer depends on what you're trying to do.

Virtual Machines provides the most general solution. If you want the most control possible, or if you need generic VMs, such as for development and test, this is the best option. Virtual Machines is also the best choice for running off-the-shelf on-premises applications in the cloud, as illustrated by the SharePoint example described earlier. And because the VMs you create with this technology can look just like your on-premises VMs, it's also likely to be the best choice for disaster recovery. The trade-off, of course, is that with great power comes great responsibility -- IaaS requires you to take on some administrative work.  

Websites is the right option when you want to create a simple website. This is especially true if your site will be based on an existing application such as Joomla, WordPress, or Drupal. Websites is also a good choice for creating a low-administration web application, even one that must be quite scalable, or moving an existing IIS web app to the public cloud. It provides fast deployment as well. A new instance of your application can start running almost immediately, while deploying a new VM with either Virtual Machines or Cloud Services can take several minutes. 

Cloud Services, which was the initial execution model provided by Azure, is an explicitly PaaS approach. While the line between PaaS and web hosting is blurry, Cloud Services differs in some important ways from Websites, including the following:

- Unlike Websites, Cloud Services gives you administrative access to your application's VMs. This lets you install arbitrary software that your application needs, something that's not possible with Websites.
- Because Cloud Services offers both web roles and worker roles, it's a better choice than Websites for multi-tier applications that need separate VMs for their business logic.
- Cloud Services provides separate staging and production environments, making application updates somewhat smoother than Websites. 
- Unlike Websites, you can use networking technologies such as Azure Virtual Network and Azure Connect to hook on-premises computers to Cloud Services applications. 
- Cloud Services lets you use Remote Desktop to connect directly to an application's VMs, something that's not possible with Websites.

Because it's PaaS, Cloud Services also offers some advantages over Azure Virtual Machines. More management tasks are done for you, for instance, such as deploying operating system updates, and so your operations costs are likely to be lower than with the IaaS approach of Azure Virtual Machines.

All three Azure execution models have pros and cons. Making the best choice requires understanding these, knowing what you're trying to accomplish, then choosing the one that's the best fit.

Sometimes, no single execution model is right. In situations like this, it's perfectly legal to combine options. For example, suppose you're building an application where you'd like the management benefits of Cloud Services web roles, but you also need to use standard SQL Server for compatibility or performance reasons. In this case, the best option is to combine execution models, as [Figure 7](#Fig7) shows.

<a name="Fig7"></a>![07_CombineTechnologies][07_CombineTechnologies] 
 
**Figure 7: A single application can use multiple execution models.**

As the figure illustrates, the Cloud Services VMs run in a separate cloud service from the Virtual Machines VMs. Still, the two can communicate quite efficiently, so building an app this way is sometimes the best option.

Azure provides different execution models because cloud platforms need to support many different scenarios. Anybody who wants to use this platform effectively -- and if you've read this far, that probably includes you -- needs to understand each one.

[01_CreatingVMs]: ./media/fundamentals-application-models/ExecModels_01_CreatingVMs.png
[02_CloudServices]: ./media/fundamentals-application-models/ExecModels_02_CloudServices.png
[03_AppUsingSQLServer]: ./media/fundamentals-application-models/ExecModels_03_AppUsingSQLServer.png
[04_SharePointFarm]: ./media/fundamentals-application-models/ExecModels_04_SharePointFarm.png
[05_Websites]: ./media/fundamentals-application-models/ExecModels_05_Websites.png
[06_CloudServices2]: ./media/fundamentals-application-models/ExecModels_06_CloudServices2.png
[07_CombineTechnologies]: ./media/fundamentals-application-models/ExecModels_07_CombineTechnologies.png


