<properties 
	pageTitle="SharePoint 2010 Deployment on Azure Virtual Machines" 
	description="Understand the supported scenarios for using SharePoint 2010 on Azure virtual machines." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="JoeDavies-MSFT" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/16/2015" 
	ms.author="josephd"/>




<h1>SharePoint 2010 Deployment on Azure Virtual Machines</h1>
<h2>Executive Summary</h2>

Microsoft SharePoint Server 2010 provides rich deployment flexibility, which can help organizations determine the right deployment scenarios to align with their business needs and objectives. Hosted and managed in the cloud, the Azure Virtual Machines offering provides complete, reliable, and available infrastructure to support various on-demand application and database workloads, such as Microsoft SQL Server and SharePoint deployments.


While Azure Virtual Machines support multiple workloads, this paper focuses on SharePoint deployments. Azure Virtual Machines enable organizations to create and manage their SharePoint infrastructure quickly-provisioning and accessing nearly any host universally. It allows full control and management over processors, RAM, CPU ranges, and other resources of SharePoint virtual machines (VMs).

Azure Virtual Machines mitigate the need for hardware, so organizations can turn attention from handling high upfront cost and complexity to building and managing infrastructure at scale. This means that they can innovate, experiment, and iterate in hours-as opposed to days and weeks with traditional deployments.

<h3>Who Should Read This Paper?</h3>

This paper is intended for IT professionals. Furthermore, technical decision makers, such as architects and system administrators, can use this information and the provided scenarios to plan and design a virtualized SharePoint infrastructure on Azure.

<h3>Why Read This Paper?</h3>

This paper explains how organizations can set up and deploy SharePoint within Azure Virtual Machines. It also discusses why this type of deployment can be beneficial to organizations of many sizes.

<h2>Shift to Cloud Computing</h2>

According to Gartner, cloud computing is defined as a "style of computing where massively scalable IT-enabled capabilities are delivered 'as a service' to external customers using Internet technologies." The significant words in this definition are scalable, service, and Internet. In short, cloud computing can be defined as IT services that are <strong>deployed and delivered over the Internet</strong> and are <strong>scalable on demand</strong>.

Undeniably, cloud computing represents a major shift happening in IT today. Yesterday, the conversation was about consolidation and cost. Today, it's about the new class of benefits that cloud computing can deliver. It's all about transforming the way IT serves organizations by harnessing a new breed of power. Cloud computing is fundamentally changing the world of IT, impacting every role-from service providers and system architects to developers and end users.

Research shows that agility, focus, and economics are three top drivers for cloud adoption:

<ul>
<li><p><strong>Agility</strong>: Cloud computing can speed an organization's ability to capitalize on new opportunities and respond to changes in business demands.</p></li>
<li><p><strong>Focus</strong>: Cloud computing enables IT departments to cut infrastructure costs dramatically. Infrastructure is abstracted and resources are pooled, so IT runs more like a utility than a collection of complicated services and systems. Plus, IT now can be transitioned to more innovative and strategic roles.</p></li>
<li><p><strong>Economics</strong>: Cloud computing reduces the cost of delivering IT and increases the utilization and efficiency of the data center. Delivery costs go down because with cloud computing, applications and resources become self-service, and use of those resources becomes measurable in new and precise ways. Hardware utilization also increases because infrastructure resources (storage, compute, and network) are now pooled and abstracted.</p></li>
</ul>

<h2>Delivery Models for Cloud Services</h2>

In simple terms, cloud computing is the abstraction of IT services. These services can range from basic infrastructure to complete applications. End users request and consume abstracted services without the need to manage (or even completely know about) what constitutes those services. Today, the industry recognizes three delivery models for cloud services, each providing a distinct trade-off between control/flexibility and total cost:

<ul>
<li><p><strong>Infrastructure as a Service</strong> (IaaS): Virtual infrastructure that hosts virtual machines and mostly existing applications.</p></li>
<li><p><strong>Platform as a Service</strong> (PaaS): Cloud application infrastructure that provides an on-demand application-hosting environment.</p></li>
<li><p><strong>Software as a Service</strong> (SaaS): Cloud services model where an application is delivered over the Internet and customers pay on a per-use basis (for example, Microsoft Office 365 or Microsoft CRM Online).</p></li>
</ul>

Figure 1 depicts the cloud services taxonomy and how it maps to the components in an IT infrastructure. With an on-premises model, the customer is responsible for managing the entire stack-ranging from network connectivity to applications. With IaaS, the lower levels of the stack are managed by a vendor, while the customer is responsible for managing the operating system through applications. With PaaS, a platform vendor provides and manages everything from network connectivity through runtime. The customer only needs to manage applications and data. (The Azure offering best fits in this model.) Finally, with SaaS, a vendor provides the applications and abstracts all services from all underlying components.

<p class="caption">Figure 1: Cloud services taxonomy</p>

![azure-sharepoint-wp-1](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-1.png)

<h2>Azure Virtual Machines</h2>

Azure Virtual Machines introduce functionality that allows full control and management of VMs, along with extensive virtual networking. This offering can provide organizations with robust benefits, such as:

<ul>
<li><p><strong>Management</strong>: Centrally manage VMs in the cloud with full control to configure and maintain the infrastructure.</p></li>
<li><p><strong>Application mobility</strong>: Move virtual hard drives (VHDs) back and forth between on-premises and cloud-based environments. There is no need to rebuild applications to run in the cloud.</p></li>
<li><p><strong>Access to Microsoft server applications</strong>: Run the same on-premises applications and infrastructure in the cloud, including Microsoft SQL Server, SharePoint Server, Windows Server, and Active Directory.</p></li>
</ul>

Azure Virtual Machines is an easy, open and flexible, and powerful platform that allows organizations to deploy and run Windows Server and Linux VMs in minutes:

<ul>
<li><p><strong>Easy</strong>: With Azure Virtual Machines, it is easy and simple to build, migrate, deploy, and manage VMs in the cloud. Organizations can migrate workloads to Azure without having to change existing code, or they can set up new VMs in Azure in only a few clicks. The offering also provides assistance for new cloud application development by integrating the IaaS and PaaS functionalities of Azure.</p></li>

<li><p><strong>Open and flexible</strong>: Azure is an open platform that gives organizations flexibility. They can start from a prebuilt image in the image library, or they can create and use customized and on-premises VHDs and upload them to the image library. Community and commercial versions of Linux also are available.</p></li>

<li><p><strong>Powerful</strong>: Azure is an enterprise-ready cloud platform for running applications such as SQL Server, SharePoint Server, or Active Directory in the cloud. Organizations can create hybrid on-premises and cloud solutions with VPN connectivity between the Azure data center and their own networks.</p></li>
</ul>

<h2>SharePoint on Azure Virtual Machines</h2>

SharePoint 2010 flexibly supports most of the workloads in an Azure Virtual Machines deployment. Azure Virtual Machines are an optimal fit for FIS (SharePoint Server for Internet Sites) and development scenarios. Likewise, core SharePoint workloads are also supported. If an organization wants to manage and control its own SharePoint 2010 implementation while capitalizing on options for virtualization in the cloud, Azure Virtual Machines are ideal for deployment.

The Azure Virtual Machines offering is hosted and managed in the cloud. It provides deployment flexibility and reduces cost by mitigating capital expenditures due to hardware procurement. With increased infrastructure agility, organizations can deploy SharePoint Server in hours-as opposed to days or weeks. Azure Virtual Machines also enables organizations to deploy SharePoint workloads in the cloud using a "pay-as-you-go" model. As SharePoint workloads grow, an organization can rapidly expand infrastructure; then, when computing needs decline, it can return the resources that are no longer needed'thereby paying only for what is used.

<h3>Shift in IT Focus</h3>

Many organizations contract out the common components of their IT infrastructure and management, such as hardware, operating systems, security, data storage, and backup-while maintaining control of mission-critical applications, such as SharePoint Server. By delegating all non-mission-critical service layers of their IT platforms to a virtual provider, organizations can shift their IT focus to core, mission-critical SharePoint services and deliver business value with SharePoint projects, instead of spending more time on setting up infrastructure.

<h3>Faster Deployment</h3>

Supporting and deploying a large SharePoint infrastructure can hamper IT's ability to move rapidly to support business requirements. The time that is required to build, test, and prepare SharePoint servers and farms and deploy them into a production environment can take weeks or even months, depending on the processes and constraints of the organization. Azure Virtual Machines allow organizations to quickly deploy their SharePoint workloads without capital expenditures for hardware. In this way, organizations can capitalize on infrastructure agility to deploy in hours instead of days or weeks.

<h3>Scalability</h3>

Without the need to deploy, test, and prepare physical SharePoint servers and farms, organizations can expand and contract compute capacity on demand, at a moment's notice. As SharePoint workload requirements grow, an organization can rapidly expand its infrastructure in the cloud. Likewise, when computing needs decrease, the organization can diminish resources, paying only for what it uses. Azure Virtual Machines reduces upfront expenses and long-term commitments, enabling organizations to build and manage SharePoint infrastructures at scale. Again, this means that these organizations can innovate, experiment, and iterate in hours-as opposed to days and weeks with traditional deployments.

<h3>Metered Usage</h3>

Azure Virtual Machines provide computing power, memory, and storage for SharePoint scenarios, whose prices are typically based on resource consumption. Organizations pay only for what they use, and the service provides all capacity needed for running the SharePoint infrastructure. For more information on pricing and billing, go to <a href="/pricing/details/">Azure Pricing Details</a>. Note that there are nominal charges for storage and data moving out of the Azure cloud from an on-premises network. However, Azure does not charge for uploading data.

<h3>Flexibility</h3>

Azure Virtual Machines provide developers with the flexibility to pick their desired language or runtime environment, with official support for .NET, Node.js, Java, and PHP. Developers also can choose their tools, with support for Microsoft Visual Studio, WebMatrix, Eclipse, and text editors. Further, Microsoft delivers a low-cost, low-risk path to the cloud and offers cost-effective, easy provisioning and deployment for cloud reporting needs-providing access to business intelligence (BI) across devices and locations. Finally, with the Azure offering, users not only can move VHDs to the cloud, but also can copy a VHD back down and run it locally or through another cloud provider, as long as they have the appropriate license.

<h2>Provisioning Process</h2>

This subsection discusses the basic strong in Azure. The <strong>image library</strong> in Azure provides the list of available preconfigured VMs. Users can publish SharePoint Server, SQL Server, Windows Server, and other ISO/VHDs to the image library. To simplify the creation of VMs, base images are created and published to the library. Authorized users can use these images to generate the desired VM. For more information, go to <a href="/manage/windows/tutorials/virtual-machine-from-gallery/">Create a Virtual Machine Running Windows Server 2008 R2</a> on the Azure site. Figure 2 shows the basic steps for creating a VM using the Azure Management Portal:

<p class="caption">Figure 2: Overview of steps for creating a VM</p>
![azure-sharepoint-wp-2](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-2.png)

Users also can upload a sysprepped image on the Azure Management Portal. For more information, go to <a href="/manage/windows/common-tasks/upload-a-vhd/">Creating and Uploading a Virtual Hard Disk</a>. Figure 3 shows the basic steps for uploading an image to create a VM:

<p class="caption">Figure 3: Overview of steps for uploading an image</p>
![azure-sharepoint-wp-3](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-3.png)

<h3>Deploying SharePoint 2010 on Azure</h3>

You can deploy SharePoint 2010 on Azure by following these steps:

<ol>
<li>Log on to the <a href="http://manage.windowsazure.com/">Azure Management Portal</a> through your Azure subscription account.
<ul>

<li>If you do not have an Azure account, <a href="http://www.windowsazure.com/pricing/free-trial/">sign up for a free trial of Azure</a>.</li>
</ul>
</li>

<li>To create a VM with the base operating system, on the Azure Management Portal, click <strong>NEW > COMPUTE > VIRTUAL MACHINE > FROM GALLERY</strong>.</li>

<li>The <strong>Choose an image</strong> dialog box appears. Click the <strong>Windows Server 2008 R2 SP1</strong> platform image, and then click the right arrow.</li>

<li>The <strong><em>Virtual machine configuration </em></strong>dialog box appears. Provide the following information:

<ul>
<li>Enter a <strong>VIRTUAL MACHINE NAME</strong>.
</li>
<li>Select the appropriate <strong>SIZE</strong>.
<ul>
<li>For a production environment (SharePoint application server and database), it is recommended to use A3 <em>(4 Core, 7GB memory)</em>.</li>
</ul>
</li>
<li>In <strong>NEW USER NAME</strong>, type a local administrator account name.</li>
<li>In the <strong>NEW PASSWORD</strong> box, type a strong password.</li>
<li>In the <strong>CONFIRM</strong> box, retype the password, and then click the right arrow.</li>
</ul>
<li>The second <strong>Virtual machine configuration</strong> dialog box appears. Provide the following information:
<ul>
<li>In the <strong>CLOUD SERVICE</strong> box, choose one of the following:
<ul>
<li><strong>Create a new cloud service</strong>, in which case you must also provide a cloud service DNS name.</li>
<li>Select an existing cloud service.</li>
</ul>
<li>In the <strong>REGION/AFFINITY GROUP/VIRTUAL NETWORK </strong>box, select the region where the virtual image will be hosted.</li>
<li>In the <strong>STORAGE ACCOUNT </strong>box, choose one of the following:
<ul>
<li><strong>Use an automatically generated storage account</strong>.</li>
<li>Select an existing storage account name.</li>
<ul>
<li>Only one storage account per region is automatically created. All other VMs created with this setting are located in this storage account.</li>
<li>You are limited to 20 storage accounts.</li>
<li>For more information, go to <a href="/manage/windows/common-tasks/upload-a-vhd/#createstorage">Create a Storage Account in Azure</a>.</li>
</ul>
</li>
<li>In the <strong>AVAILABILITY SET</strong> box, select <STRONG>(none)</STRONG>, and then click the right arrow.</li>
</ul>
</li>
</ul>
</li>
<li>In the third <strong>Virtual machine configuration </strong>dialog box, click the checkmark to create the VM.</li>


<li>To connect to the VM:
<ul>
<li>Open the VM using Remote Desktop.</li>
<li>On the Azure Management Portal, select your VM, and then select the <strong>DASHBOARD</strong> page.</li>
<li>Click <strong>Connect</strong>.</li>
</ul>
</li>
<li>Build the SQL Server VM using any of the following options:
<ul>
<li>Create a SQL Server 2012 VM by following steps 1 to 7 above-except in <strong>step 3</strong>, use the SQL Server 2012 image instead of the Windows Server 2008 R2 SP1 image. For more information, go to <a href="/manage/windows/common-tasks/install-sql-server/">Provisioning a SQL Server Virtual Machine on Azure</a>.
<ul>
<li>When you choose this option, the provisioning process keeps a copy of SQL Server 2012 setup files in the <em>C:\SQLServer_11.0_Full</em> directory path so that you can customize the installation. For example, you can convert the evaluation installation of SQL Server 2012 to a licensed version by using your license key.</li>
</ul>
</li>
<li>Use the SQL Server System Preparation (SysPrep) tool to install SQL Server on the VM with base operating system (as shown above in steps 1 to 7). For more information, go to <a href="http://msdn.microsoft.com/library/ee210664.aspx">Install SQL Server 2012 Using SysPrep</a>.</li>
<li>Use the Command Prompt to install SQL Server. For more information, go to <a href="http://msdn.microsoft.com/library/ms144259.aspx#SysPrep">Install SQL Server 2012 from the Command Prompt</a>.</li>
<li>Use supported SQL Server media and your license key to install SQL Server on the VM with base operating system (as shown above in steps 1 to 7).</li>
</ul>
</li>
<li>Build the SharePoint farm using the following substeps:
<ul>
<li>Substep 1: Configure the Azure subscription using script files.</li>
<li>Substep 2: Provision SharePoint servers by creating another VM with base operating system (as shown above in steps 1 to 7). To build a SharePoint server on this VM, choose one of the following options:
<ul>
<li>Provision using SharePoint GUI:
<ul>
<li>To create and provision a SharePoint farm, go to <a href="http://technet.microsoft.com/library/ee805948.aspx#CreateConfigure">Create a Microsoft SharePoint Server Farm</a>.</li>
<li>To add a web or application server to the farm, go to <a href="http://technet.microsoft.com/library/cc261752.aspx">Add a Web or Application Server to the Farm (SharePoint Server 2010)</a>.</li>
<li>
<p>To add a database server to an existing farm, go to <a href="http://technet.microsoft.com/library/cc262781">Add a Database Server to an Existing Farm</a>.</p>
<ul>
<li>To use SQL Server 2012 for your SharePoint farm, you must download and install Service Pack 1 for SharePoint Server 2010 after installing the application and choosing not to configure the server. For more information, go to <a href="http://www.microsoft.com/download/details.aspx?id=26623">Service Pack 1 for SharePoint Server 2010</a>.</li>
<li>To take advantage of SQL Server BI features, it is recommended to install SharePoint Server as a server farm instead of a standalone server. For more information, go to <a href="http://technet.microsoft.com/library/hh231681(v=sql.110).aspx">Install SQL Server 2012 Business Intelligence Features</a>.</li>
</ul>
</li>
</ul>
</li>
<li>Provision using Microsoft Windows PowerShell: You can use the Psconfig command-line tool as an alternative interface to perform several operations that control how SharePoint 2010 products are provisioned. For more information, go to <a href="http://technet.microsoft.com/library/cc263093.aspx">Psconfig Command-line Reference</a>.</li>
</ul>
</li>
<li>Substep 3: Configure SharePoint. After each SharePoint VM is in the ready state, configure SharePoint Server on each server by using one of the following options:
<ul>
<li>Configure SharePoint from the GUI.</li>
<li>Configure SharePoint using Windows PowerShell. For more information, go to <a href="http://technet.microsoft.com/library/cc262839.aspx">Install SharePoint Server 2010 by Using Windows PowerShell</a>.
<ul>
<li>You also can use the CodePlex Project's AutoSPInstaller, which consists of Windows PowerShell scripts, an XML input file, and a standard Microsoft Windows batch file. AutoSPInstaller provides a framework for a SharePoint 2010 installation script based on Windows PowerShell. For more information, go to <a href="http://autospinstaller.codeplex.com/">CodePlex: AutoSPInstaller</a>.

<strong>Note</strong>: Be sure to configure security on the Management Portal endpoint and set an inbound port on the VM's Windows Firewall. Then, confirm that you can start a remote Windows PowerShell session to one of the SharePoint application servers by opening a Windows PowerShell session with Administrator credentials.
</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>After the script gets completed, connect to the VM using the VM Dashboard.</li>
<li>Verify SharePoint configuration: Log on to the SharePoint server, and then use Central Administration to verify the configuration.</li>
</ol>

<h3>Creating and Uploading a Virtual Hard Disk</h3>

You also can create your own images and upload them to Azure as a VHD file. To create and upload a VHD file on Azure, follow these steps:

<ol>
<li>Create the Hyper-V-enabled image: Use Hyper-V Manager to create the Hyper-V-enabled VHD. For more information, go to <a href="http://technet.microsoft.com/library/cc742509">Create Virtual Hard Disks</a>.</li>
<li>Create a storage account in Azure: A storage account in Azure is required to upload a VHD file that can be used for creating a VM. This account can be created using the Azure Management Portal. For more information, go to <a href="/manage/windows/common-tasks/upload-a-vhd/">Create a Storage Account in Azure</a>.</li>
<li>Prepare the image to be uploaded: Before the image can be uploaded to Azure, it must be generalized using the SysPrep command. For more information, go to <a href="http://technet.microsoft.com/library/bb457073.aspx">How to Use SysPrep: An Introduction</a>.</li>
<li>Upload the image to Azure: To upload an image contained in a VHD file, you must create and install a management certificate. Obtain the thumbprint of the certificate and the subscription ID. Set the connection and upload the VHD file using the CSUpload command-line tool. For more information, go to <a href="/manage/windows/common-tasks/upload-a-vhd/">Upload the Image to Azure</a>.</li>
</ol>

<h2>Usage Scenarios</h2>

This section discusses some leading customer scenarios for SharePoint deployments using Azure Virtual Machines. Each scenario is divided into two parts-a brief description about the scenario followed by steps for getting started.

<h3>Scenario 1: Simple SharePoint Development and Test Environment</h3>

<h4>Description</h4>

Organizations are looking for more agile ways to create SharePoint applications and set up SharePoint environments for onshore/offshore development and testing. Fundamentally, they want to shorten the time required to set up SharePoint application development projects, and decrease cost by increasing the use of their test environments. For example, an organization might want to perform on-demand load testing on SharePoint Server and execute user acceptance testing (UAT) with more concurrent users in different geographic locations. Similarly, integrating onshore/offshore teams is an increasingly important business need for many of today's organizations.

This scenario explains how organizations can use preconfigured SharePoint farms for development and test workloads. A SharePoint deployment topology looks and feels exactly as it would in an on-premises virtualized deployment. Existing IT skills translate 1:1 to an Azure Virtual Machines deployment, with the major benefit being an almost complete cost shift from capital expenditures to operational expenditures-no upfront physical server purchase is required. Organizations can eliminate the capital cost for server hardware and achieve flexibility by greatly reducing the provisioning time required to create, set up, or extend a SharePoint farm for a testing and development environment. IT can dynamically add and remove capacity to support the changing needs of testing and development. Plus, IT can focus more on delivering business value with SharePoint projects and less on managing infrastructure.

To fully utilize load-testing machines, organizations can configure SharePoint virtualized development and test machines on Azure with operating system support for Windows Sever 2008 R2. This enables development teams to create and test applications and easily migrate to on-premises or cloud production environments without code changes. The same frameworks and toolsets can be used on premises and in the cloud, allowing distributed team access to the same environment. Users also can access on-premises data and applications by establishing a direct VPN connection.

<h4>Getting Started</h4>

Figure 4 shows a SharePoint development and testing environment in an Azure VM. To build this deployment, start by using the same on-premises SharePoint development and testing environment used to develop applications. Then, upload and deploy the applications to the Azure VM for testing and development. If your organization decides to move the application back on-premises, it can do so without having to modify the application.

<p class="caption">Figure 4: SharePoint development and testing environment in Azure Virtual Machines</p>

![azure-sharepoint-wp-11](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-11.png)

<h4>Setting Up the Scenario Environment</h4>

To implement a SharePoint development and testing environment on Azure, follow these steps:

<ol>
<li><em>Provision</em>: First, provision a VPN connection between on-premises and Azure using Azure Virtual Network. (Because Active Directory is not being used here, a VPN tunnel is needed.) For more information, go to <a href="http://msdn.microsoft.com/library/windowsazure/jj156007.aspx">Azure Virtual Network (Design Considerations and Secure Connection Scenarios)</a>. Then, use the Management Portal to provision a new VM using a stock image from the image library.
<ul>
<li>You can upload the on-premises SharePoint development and testing VMs to your Azure storage account and reference those VMs through the image library for building the required environment.</li>
<li>You can use the SQL Server 2012 image instead of the Windows Server 2008 R2 SP1 image. For more information, go to <a href="/manage/windows/common-tasks/install-sql-server/">Provisioning a SQL Server Virtual Machine on Azure</a>.</li>
</ul>
</li>
<li><em>Install</em>: Install SharePoint Server, Visual Studio, and SQL Server on the VMs using a Remote Desktop connection.
<ul>
<li>Choose an option for installing SharePoint Server:
<ul>
<li>Use the SharePoint 2010 Easy Setup Script to build a SharePoint developer machine. For more information, go to <a href="http://www.microsoft.com/download/details.aspx?id=23415">SharePoint 2010 Easy Setup Script</a>.</li>
<li>Use Windows PowerShell. For more information, go to <a href="http://technet.microsoft.com/library/cc262839.aspx">Install SharePoint Server 2010 by Using Windows PowerShell</a>.</li>
<li>Use the CodePlex Project's AutoSPInstaller. For more information, go to <a href="http://autospinstaller.codeplex.com/">CodePlex: AutoSPInstaller</a>.</li>
</ul>
</li>
<li>Install Visual Studio. For more information, go to <a href="http://msdn.microsoft.com/library/e2h7fzkw.aspx">Visual Studio Installation</a>.</li>
<li>Install SQL Server. For more information, go to <a href="http://msdn.microsoft.com/library/ee210664.aspx">Install SQL Server Using SysPrep</a>.
<ul>
<li>Refer to the hands-on lab for creating and configuring SQL Server 2012 for a SharePoint farm deployment: <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingSQLServerForSharePoint">Configuring SQL Server 2012 for SharePoint in Azure</a>.</li>
<li>Refer to the hands-on lab for creating a SharePoint farm by configuring Active Directory and using a single SQL Server database: <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeploySharePointVMs">Deploying a SharePoint Farm with Azure Virtual Machines</a>.</li>
</ul>
</li>
</ul>
</li>
<li><em>Develop deployment packages and scripts for applications and databases</em>: If you plan to use an available VM from the image library, the desired on-premises applications and databases can be deployed on Azure Virtual Machines:
<ul>
<li>Create deployment packages for the existing on-premises applications and databases using SQL Server Data Tools and Visual Studio.</li>
<li>Use these packages to deploy the applications and databases on Azure Virtual Machines.</li>
</ul>
</li>
<li><em>Deploy SharePoint applications and databases</em>:
<ul>
<li>Configure security on the Management Portal endpoint and set an inbound port in the VM's Windows Firewall.</li>
<li>Deploy SharePoint applications and databases to Azure Virtual Machines using the deployment packages and scripts created in step 3.</li>
<li>Test deployed applications and databases.</li>
</ul>
</li>
<li><em>Manage VMs</em>:
<ul>
<li>Monitor the VMs using the Management Portal.</li>
<li>Monitor the applications using Visual Studio and SQL Server Management Studio.</li>
<li>You also can monitor and manage the VMs using on-premises management software, like Microsoft System Center - Operations Manager.</li>
</ul>
</li>
</ol>
<h3>Scenario 2: Public-facing SharePoint Farm with Customization</h3>

<h4>Description</h4>

Organizations want to create an Internet presence that is hosted in the cloud and is easily scalable based on need and demand. They also want to create partner extranet websites for collaboration and implement an easy process for distributed authoring and approval of website content. Finally, to handle increasing loads, these organizations want to provide capacity on demand to their websites.

In this scenario, SharePoint Server is used as the basis for hosting a public-facing website. It enables organizations to rapidly deploy, customize, and host their business websites on a secure, scalable cloud infrastructure. With SharePoint public-facing websites on Azure, organizations can scale as traffic grows and pay only for what they use. Common tools, similar to those used on premises, can be used for content authoring, workflow, and approval with SharePoint on Azure.

Further, using Azure Virtual Machines, organizations can easily configure staging and production environments running on VMs. SharePoint public-facing VMs created in Azure can be backed up to virtual storage. In addition, for disaster recovery purposes, the Continuous Geo-Replication feature allows organizations to automatically back up VMs operating in one data center to another data center miles away. (For more information on geo-replication, go to <a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2011/09/15/introducing-geo-replication-for-windows-azure-storage.aspx">Introducing Geo-replication for Azure Storage</a>).

VMs in Azure infrastructure are validated and supported for working with other Microsoft products, such as SQL Server and SharePoint Server. Azure and SharePoint Server are better together: Both are part of the Microsoft family and are thoroughly integrated, supported, and tested together to provide an optimal experience. They both have a single point of support for the SharePoint application and the Azure infrastructure.

<h4>Getting Started</h4>

In this scenario, more front-end web servers for SharePoint Server must be added to support extra traffic. These servers require enhanced security and Active Directory Domain Services domain controllers to support user authentication and authorization. Figure 5 shows the layout for this scenario.

<p class="caption">Figure 5: Public-facing SharePoint farm with customization</p>
![azure-sharepoint-wp-12](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-12.png)

<h4>Setting Up the Scenario Environment</h4>

To implement a public-facing SharePoint farm on Azure, follow these steps:

<ol>
<li><em>Deploy Active Directory</em>: The fundamental requirements for deploying Active Directory on Azure Virtual Machines are similar"but not identical"to deploying it on VMs (and, to some extent, physical machines) on-premises. For more information about the differences, as well as guidelines and other considerations, go to <a href="http://msdn.microsoft.com/library/windowsazure/jj156090">Guidelines for Deploying Active Directory on Azure Virtual Machines</a>. To deploy Active Directory in Azure:
<ul>
<li>Define and create a virtual network where the VMs can be assigned to specific subnets. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectory/blob/master/HOL.md">Configure Virtual Networking</a>.</li>
<li>Use the Management Portal to create and deploy the domain controller on a new VM on Azure. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectory/blob/master/HOL.md">Deploying and Creating the Domain Controller</a>.
<ul>
<li>You also can refer to the Windows PowerShell script to deploy a stand-alone domain in the cloud using Azure Virtual Machines and Virtual Network. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectoryPS">Deploying Active Directory in Azure (Windows PowerShell)</a>.</li>
<li>For more information about creating a new Active Directory forest on a VM on Azure Virtual Network, go to <a href="/manage/services/networking/active-directory-forest/">Install a New Active Directory Forest in Azure</a>.</li>
</ul>
</li>
</ul>
</li>
<li><em>Provision a VM</em>: Use the Management Portal to provision a new VM from a stock image in the image library.</li>
<li><em>Deploy a SharePoint farm</em>:
<ul>
<li>Use the newly provisioned VM to install SharePoint and generate a reusable image. For more information about installing SharePoint Server, go to <a href="http://technet.microsoft.com/library/cc262839.aspx">Install and Configure SharePoint Server 2010 by Using Windows PowerShell</a> or <a href="http://autospinstaller.codeplex.com/">CodePlex: AutoSPInstaller</a>.</li>
<li>Configure the SharePoint VM to create and connect to the SharePoint farm.</li>
<li>Use the Management Portal to configure the load balancing.
<ul>
<li>Configure the VM endpoints, select the option to load balance traffic on an existing endpoint, and then specify the name of the load-balanced VM.</li>
<li>Add another front-end web VM to the existing SharePoint farm for extra traffic.</li>
</ul>
</li>
</ul>
</li>
<li><em>Manage VMs</em>:
<ul>
<li>Monitor the VMs using the Management Portal.</li>
<li>Monitor the SharePoint farm using Central Administration.</li>
</ul>
</li>
</ol>

<h3>Scenario 3: Scaled-out Farm for Additional BI Services</h3>

<h4>Description</h4>

Business intelligence is essential to gaining key insights and making rapid, sound decisions. As organizations transition from an on-premises approach, they do not want to make changes to the BI environment while deploying existing BI applications to the cloud. They want to host reports from SQL Server Analysis Services (SSAS) or SQL Server Reporting Services (SSRS) in a highly durable and available environment, while keeping full control of the BI application-all without spending much time and budget on maintenance.

This scenario describes how organizations can use Azure Virtual Machines to host mission-critical BI applications. Organizations can deploy SharePoint farms in Azure Virtual Machines and scale out the application server VM's BI components, like SSRS or Excel Services. By scaling resource-intensive components in the cloud, they can better and more easily support specialized workloads. Note that SQL Server in Azure Virtual Machines performs well, as it is easy to scale SQL Server instances, ranging from small to extra-large installations. This provides elasticity, enabling organizations to dynamically provision (expand) or deprovision (shrink) BI instances based on immediate workload requirements.

Migrating existing BI applications to Azure provides better scaling. With the power of SSAS, SSRS, and SharePoint Server, organizations can create powerful BI and reporting applications and dashboards that scale up or down. These applications and dashboards also can be more securely integrated with on-premises data and applications. Azure ensures data center compliance with support for ISO 27001. For more information, go to the <a href="/support/trust-center/compliance/">Azure Trust Center</a>.

<h4>Getting Started</h4>

To scale out the deployment of BI components, a new application server with services such as PowerPivot, Power View, Excel Services, or PerformancePoint Services must be installed. Or, SQL Server BI instances like SSAS or SSRS must be added to the existing farm to support additional query processing. The server can be added as a new Azure VM with SharePoint 2010 Server or SQL Server installed. Then, the BI components can be installed, deployed, and configured on that server (Figure 6).

<p class="caption">Figure 6: Scaled-out SharePoint farm for additional BI services</p>

![azure-sharepoint-wp-13](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-13.png)

<h4>Setting Up the Scenario Environment</h4>

To scale out a BI environment on Azure, follow these steps:

<ol>
<li><em>Provision</em>:
<ul>
<li>Provision a VPN connection between on premises and Azure using Azure Virtual Network. For more information, go to <a href="http://msdn.microsoft.com/library/windowsazure/jj156007.aspx">Azure Virtual Network (Design Considerations and Secure Connection Scenarios)</a>.</li>
<li>Use the Management Portal to provision a new VM from a stock image in the image library.
<ul>
<li>You can upload SharePoint Server or SQL Server BI workload images to the image library, and any authorized user can pick those BI component VMs to build the scaled-out environment.</li>
</ul>
</li>
</ul>
</li>
<li><em>Install</em>: If your organization does not have prebuilt images of SharePoint Server or SQL Server BI components, install SharePoint Server and SQL Server on the VMs using a Remote Desktop connection.
<ul>
<li>For more information about installing SharePoint, go to <a href="http://technet.microsoft.com/library/cc262839.aspx">Install SharePoint Server 2010 by Using Windows PowerShell</a> or <a href="http://autospinstaller.codeplex.com/">CodePlex: AutoSPInstaller</a>.</li>
<li>For more information about installing SQL Server, go to <a href="http://msdn.microsoft.com/library/ee210664.aspx">Install SQL Server using SysPrep</a>.</li>
<li>Refer to the hands-on lab for creating and configuring SQL Server 2012 for a SharePoint farm deployment: <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingSQLServerForSharePoint">Configuring SQL Server 2012 for SharePoint in Azure</a>.</li>
<li>Refer to the hands-on lab for creating a SharePoint farm by configuring Active Directory and using a single SQL Server database: <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeploySharePointVMs">Deploying a SharePoint Farm with Azure Virtual Machines</a>.</li>
</ul>
</li>
<li><em>Add the BI VM</em>:
<ul>
<li>Configure security on the Management Portal endpoint and set an inbound port in the VM's Windows Firewall.</li>
<li>Add the newly created BI VM to the existing SharePoint or SQL Server farm.</li>
</ul>
</li>
<li><em>Manage VMs</em>:
<ul>
<li>Monitor the VMs using the Management Portal.</li>
<li>Monitor the SharePoint farm using Central Administration.</li>
<li>Monitor and manage the VMs using on-premises management software like Microsoft System Center - Operations Manager.</li>
</ul>
</li>
</ol>
<h3>Scenario 4: Completely Customized SharePoint-based Website</h3>

<h4>Description</h4>

Increasingly, organizations want to create fully customized SharePoint websites in the cloud. They need a highly durable and available environment that offers full control to maintain complex applications running in the cloud, but they do not want to spend a large amount of time and budget.

In this scenario, an organization can deploy its entire SharePoint farm in the cloud and dynamically scale all components to get additional capacity, or it can extend its on-premises deployment to the cloud to increase capacity and improve performance, when needed. The scenario focuses on organizations that want the full "SharePoint experience" for application development and enterprise content management. The more complex sites also can include enhanced reporting, Power View, PerformancePoint, PowerPivot, in-depth charts, and most other SharePoint site capabilities for end-to-end, full functionality.

Organizations can use Azure Virtual Machines to host customized applications and associated components on a cost-effective and highly secure cloud infrastructure. They also can use on-premises Microsoft System Center as a common management tool for on-premises and cloud applications.

<h4>Getting Started</h4>

To implement a completely customized SharePoint website on Azure, an organization must deploy an Active Directory domain in the cloud and provision new VMs into this domain. Then, a VM running SQL Server 2012 must be created and configured as part of a SharePoint farm. Finally, the SharePoint farm must be created, load balanced, and connected to Active Directory and SQL Server (Figure 7).

<p class="caption">Figure 7: Completely customized SharePoint-based website</p>

![azure-sharepoint-wp-14](./media/virtual-machines-deploy-sharepoint-2010/azure-sharepoint-wp-14.png)

<h4>Setting Up the Scenario Environment</h4>

The following steps show how to create a customized SharePoint farm environment from prebuilt images available in the image library. Note, however, that you also can upload SharePoint farm VMs to the image library, and authorized users can choose those VMs to build the required SharePoint farm on Azure.

<ol>
<li>Deploy Active Directory<em>: The fundamental requirements for deploying Active Directory on Azure Virtual Machines are similar"but not identical"to deploying it on VMs (and, to some extent, physical machines) on premises. For more information about the differences, as well as guidelines and other considerations, go to <a href="http://msdn.microsoft.com/library/windowsazure/jj156090">Guidelines for Deploying Active Directory on Azure Virtual Machines</a>. To deploy Active Directory in Azure:</em>
<ul>
<li>Define and create a virtual network where the VMs can be assigned to specific subnets. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectory/blob/master/HOL.md">Configure Virtual Networking</a>.</li>
<li>Use the Management Portal to create and deploy the domain controller on a new VM on Azure. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectory/blob/master/HOL.md">Deploying and Creating the Domain Controller</a>.
<ul>
<li>You also can refer to the Windows PowerShell script to deploy a stand-alone domain in the cloud using Azure Virtual Machines and Virtual Network. For more information, go to <a href="https://github.com/WindowsAzure-TrainingKit/HOL-DeployingActiveDirectoryPS">Deploying Active Directory in Azure (Windows PowerShell)</a>.</li>
<li>For more information about creating a new Active Directory forest on a VM on Azure Virtual Network, go to <a href="/manage/services/networking/active-directory-forest/">Install a New Active Directory Forest in Azure</a>.</li>
</ul>
</li>
</ul>
</li>
<li><em>Deploy SQL Server</em>:
<ul>
<li>Use the Management Portal to provision a new VM from a stock image in the image library.</li>
<li>Configure SQL Server on the VM. For more information, go to <a href="http://msdn.microsoft.com/library/ee210664.aspx">Install SQL Server Using SysPrep</a>.</li>
<li>Join the VM to the newly created Active Directory domain.</li>
</ul>
</li>
<li><em>Deploy a multiserver SharePoint farm</em>:
<ul>
<li>Create a virtual network. For more information, go to <a href="http://msdn.microsoft.com/library/windowsazure/jj156007.aspx">Azure Virtual Network (Design Considerations and Secure Connection Scenarios)</a>.
<ul>
<li>When deploying the SharePoint VMs, you need subnets provided for SharePoint Server so that the DNS addresses in the local Active Directory box are available during provisioning.</li>
</ul>
</li>
<li>Use the Management Portal to create a VM.</li>
<li>Install SharePoint Server on this VM and generate a reusable image. For more information about installing SharePoint Server, go to <a href="http://technet.microsoft.com/library/cc262839.aspx">Install and Configure SharePoint Server 2010 by Using Windows PowerShell</a> or <a href="http://autospinstaller.codeplex.com/">CodePlex: AutoSPInstaller</a>.</li>
<li>Configure the SharePoint VM to create and connect to the SharePoint farm using the <a href="http://technet.microsoft.com/library/ff607979.aspx">Join-SharePointFarm</a> command.</li>
<li>Use the Management Portal to configure the load balancing:
<ul>
<li>Configure the VM endpoints, select the option to load balance traffic on an existing endpoint, and then specify the name of the load-balanced VM.
<ul>
<li>For more information about deploying SharePoint farms on Azure Virtual Machines, view this <a href="http://channel9.msdn.com/Events/TechEd/NorthAmerica/2012/AZR327">TechEd North America 2012 video</a>.</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li><em>Manage the SharePoint farm through System Center</em>:
<ul>
<li>Use the Operations Manager agent and new Azure Integration Pack to connect your on-premises System Center to Azure Virtual Machines.</li>
<li>Use on-premises App Controller and Orchestrator for management functions.</li>
</ul>
</li>
</ol>

<h2>Conclusion</h2>
Cloud computing is transforming the way IT serves organizations. This is because cloud computing can harness a new class of benefits, including dramatically decreased cost coupled with increased IT focus, agility, and flexibility. Azure is leading the way in cloud computing by delivering easy, open, flexible, and powerful virtual infrastructure. Azure Virtual Machines mitigate the need for hardware, so organizations can reduce cost and complexity by building infrastructure at scale-with full control and streamlined management.

Azure Virtual Machines provide a full continuum of SharePoint deployments. It is fully supported and tested to provide an optimal experience with other Microsoft applications. As such, organizations can easily set up and deploy SharePoint Server within Azure, either to provision infrastructure for a new SharePoint deployment or to expand an existing one. As business workloads grow, organizations can rapidly expand their SharePoint infrastructure. Likewise, if workload needs decline, organizations can contract resources on demand, paying only for what they use. Azure Virtual Machines deliver an exceptional infrastructure for a wide range of business requirements, as shown in the four SharePoint-based scenarios discussed in this paper.

Successful deployment of SharePoint Server on Azure Virtual Machines requires solid planning, especially considering the range of critical farm architecture and deployment options. The insights and best practices outlined in this paper can help to guide decisions for implementing an informed SharePoint deployment.

<h2>Additional Resources</h2>

<ul>
<li>
<p>SharePoint on Azure Infrastructure Services</p>
<p><a href="http://msdn.microsoft.com/library/dn275955.aspx">http://msdn.microsoft.com/library/dn275955.aspx</a></p>
</li>
<li>
<p>Getting Started with Azure PowerShell</p>
<p><a href="http://msdn.microsoft.com/library/windowsazure/jj156055">http://msdn.microsoft.com/library/windowsazure/jj156055</a></p>
</li>
<li>
<p>Azure Management Cmdlets</p>
<p><a href="http://msdn.microsoft.com/library/windowsazure/jj152841">http://msdn.microsoft.com/library/windowsazure/jj152841</a></p>
</li>
<li>
<p>Command-line Tools and PowerShell Cmdlets for Different Operating Systems</p>
<p><a href="/manage/downloads/">https://www.windowsazure.com/manage/downloads/</a></p>
</li>
<li>
<p>How-to Guides and Best Practices Documentation</p>
<p><a href="/manage/windows/">https://www.windowsazure.com/manage/windows/</a></p>
</li>
</ul>

