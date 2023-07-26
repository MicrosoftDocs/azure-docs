---
title: Get started guide for Azure IT operators | Microsoft Docs
description: Get started guide for Azure IT operators
author: RicksterCDN
ms.author: rclaus
tags: azure-resource-manager
ms.custom: devx-track-arm-template
ms.service: azure
ms.topic: overview
ms.workload: infrastructure
ms.date: 08/24/2018
---

# Get started for Azure IT operators

This guide introduces core concepts related to the deployment and management of a Microsoft Azure infrastructure. If you are new to cloud computing, or Azure itself, this guide helps quickly get you started with concepts, deployment, and management details. Many sections of this guide discuss an operation such as deploying a virtual machine, and then provide a link for in-depth technical detail.

## Cloud computing overview

Cloud computing provides a modern alternative to the traditional on-premises datacenter. Public cloud vendors provide and manage all computing infrastructure and the underlying management software. These vendors provide a wide variety of cloud services. A cloud service in this case might be a virtual machine, a web server, or cloud-hosted database engine. As a cloud provider customer, you lease these cloud services on an as-needed basis. In doing so, you convert the capital expense of hardware maintenance into an operational expense. A cloud service also provides these benefits:

- Rapid deployment of large compute environments

- Rapid deallocation of systems that are no longer required

- Easy deployment of traditionally complex systems like load balancers

- Ability to provide flexible compute capacity or scale when needed

- More cost-effective computing environments

- Access from anywhere with a web-based portal or programmatic automation

- Cloud-based services to meet most compute and application needs

With on-premises infrastructure, you have complete control over the hardware and software that is deployed. Historically, this has led to hardware procurement decisions that focus on scaling up. An example is purchasing a server with more cores to meet peak performance needs. Unfortunately, this infrastructure might be underutilized outside a demand window. With Azure, you can deploy only the infrastructure that you need, and adjust this up or down at any time. This leads to a focus on scaling out through the deployment of additional compute nodes to satisfy a performance need. Scaling out cloud services is more cost-effective than scaling up through expensive hardware.

Microsoft has deployed many Azure datacenters around the globe, with more planned. Additionally, Microsoft is increasing sovereign clouds in regions like China and Germany. Only the largest global enterprises can deploy datacenters in this manner, so using Azure makes it easy for enterprises of any size to deploy their services close to their customers.

For small businesses, Azure allows for a low-cost entry point, with the ability to scale rapidly as demand for compute increases. This prevents a large up-front capital investment in infrastructure, and it provides the flexibility to architect and re-architect systems as needed. The use of cloud computing fits well with the scale-fast and fail-fast model of startup growth.

For more information on the available Azure regions, see [Azure regions](https://azure.microsoft.com/regions/).

### Cloud computing model

Azure uses a cloud computing model based on categories of service provided to customers. The three categories of service include Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS). Vendors share some or all of the responsibility for components in the computing stack in each of these categories. Let's take a look at each of the categories for cloud computing.
![Cloud Computing Stack Comparison](./media/cloud-computing-comparison.png)

#### IaaS: Infrastructure as a service

An IaaS cloud vendor runs and manages all physical compute resources and the required software to enable computer virtualization. A customer of this service deploys virtual machines in these hosted datacenters. Although the virtual machines are located in an offsite datacenter, the IaaS consumer has control over the configuration and management of the operating system leaving the underlying infrastructure to the cloud vendor.

Azure includes several IaaS solutions including virtual machines, virtual machine scale sets, and the related networking infrastructure. Virtual machines are a popular choice for initially migrating services to Azure because it enables a "lift and shift" migration model. You can configure a VM like the infrastructure currently running your services in your datacenter, and then migrate your software to the new VM. You might need to make configuration updates, such as URLs to other services or storage, but you can migrate many applications in this way.

Virtual machine scale sets are built on top of Azure Virtual Machines and provide an easy way to deploy clusters of identical VMs. Virtual machine scale sets also support autoscaling so that new VMs can be deployed automatically when required. This makes virtual machine scale sets an ideal platform to host higher-level microservice compute clusters, such as Azure Service Fabric and Azure Container Service.

#### PaaS: Platform as a service

With PaaS, you deploy your application into an environment that the cloud service vendor provides. The vendor does all of the infrastructure management so you can  focus on application development and data management.

Azure provides several PaaS compute offerings, including the Web Apps feature of Azure App Service and Azure Cloud Services (web and worker roles). In either case, developers have multiple ways to deploy their application without knowing anything about the nuts and bolts that support it. Developers don't have to create virtual machines (VMs), use Remote Desktop Protocol (RDP) to sign in to each one, or install the application. They just hit a button (or close to it), and the tools provided by Microsoft provision the VMs and then deploy and install the application on them.

#### SaaS: Software as a service

SaaS is software that is centrally hosted and managed. It's usually based on a multitenant architecture—a single version of the application is used for all customers. It can be scaled out to multiple instances to ensure the best performance in all locations. SaaS software typically is licensed through a monthly or annual subscription. SaaS software vendors are responsible for all components of the software stack so all you manage is the services provided.

Microsoft 365 is a good example of a SaaS offering. Subscribers pay a monthly or annual subscription fee, and they get Microsoft Exchange, Microsoft OneDrive, and the rest of the Microsoft Office suite as a service. Subscribers always get the most recent version and the Exchange server is managed for you. Compared to installing and upgrading Office every year, this is less expensive and requires less effort.

## Azure services

Azure offers many services in its cloud computing platform. These services include the following.

### Compute services

Services for hosting and running application workload:

- Azure Virtual Machines—both Linux and Windows

- App Services (Web Apps, Mobile Apps, Logic Apps, API Apps, and Function Apps)

- Azure Batch (for large-scale parallel and batch compute jobs)

- Azure Service Fabric

- Azure Container Service

### Data services

Services for storing and managing data:

- Azure Storage (comprises the Azure Blob, Queue, Table, and File services)

- Azure SQL Database

- Azure Cosmos DB

- Microsoft Azure StorSimple

- Azure Cache for Redis

### Application services

Services for building and operating applications:

- Azure Active Directory (Azure AD)

- Azure Service Bus for connecting distributed systems

- Azure HDInsight for processing big data

- Azure Logic Apps for integration and orchestration workflows

- Azure Media Services

### Network services

Services for networking both within Azure and between Azure and on-premises datacenters:

- Azure Virtual Network

- Azure ExpressRoute

- Azure-provided DNS

- Azure Traffic Manager

- Azure Content Delivery Network

For detailed documentation on Azure services, see [Azure service documentation](/azure).

## Azure key concepts

### Datacenters and regions

Azure is a global cloud platform that is generally available in many regions around the world. When you provision a service, application, or VM in Azure, you are asked to select a region. The selected region represents a specific datacenter where your application runs. For more information, see [Azure regions](https://azure.microsoft.com/regions/).

One of the benefits of using Azure is that you can deploy your applications into various datacenters around the globe. The region you choose can affect the performance of your application. It's optimal to choose a region that is closer to most your customers, to reduce latency in network requests. You might also select a region to meet the legal requirements for distributing your app in certain countries/regions.

### Azure portal

The Azure portal is a web-based application that can be used to create, manage, and remove Azure resources and services. The Azure portal is located at [portal.azure.com](https://portal.azure.com). It includes a customizable dashboard and tooling for managing Azure resources. It also provides billing and subscription information. For more information, see [Microsoft Azure portal overview](../../azure-portal/azure-portal-overview.md) and [Manage Azure resources through portal](../../azure-resource-manager/management/manage-resources-portal.md).

### Resources

Azure resources are individual compute, networking, data, or app hosting services that have been deployed into an Azure subscription. Some common resources are virtual machines, storage accounts, or SQL databases. Azure services often consist of several related Azure resources. For instance, an Azure virtual machine might include a VM, storage account, network adapter, and public IP address. These resources can be created, managed, and deleted individually or as a group. Azure resources are covered in more detail later in this guide.

### Resource groups

An Azure resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only resources that you want to manage as a group. Azure resource groups are covered in more detail later in this guide.

### Resource Manager templates

An Azure Resource Manager template is a JavaScript Object Notation (JSON) file that defines one or more resources to deploy to a resource group. It also defines the dependencies between deployed resources. Resource Manager templates are covered in more detail later in this guide.

### Automation

In addition to creating, managing, and deleting resources by using the Azure portal, you can automate these activities by using PowerShell or the Azure CLI.

#### Azure PowerShell

Azure PowerShell is a set of modules that provide cmdlets for managing Azure. You can use the cmdlets to create, manage, and remove Azure services. The cmdlets can help you can achieve consistent, repeatable, and hands-off deployments. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

#### Azure CLI

The Azure CLI provides a command-line experience for creating, managing, and deleting Azure resources. The Azure CLI is available for Windows, Linux, and macOS. For more information and technical details, see [Install the Azure CLI](/cli/azure/install-azure-cli).

#### REST APIs

Azure is built on a set of REST APIs that support the Azure portal UI. Most of these REST APIs are also supported to let you programmatically provision and manage your Azure resources and apps from any Internet-enabled device. For more information, see the [Azure REST SDK Reference](/rest/api/index).

### Azure Cloud Shell

Administrators can access Azure PowerShell and Azure CLI through a browser-accessible experience called Azure Cloud Shell. This interactive interface provides a flexible tool for Linux and Windows administrators to use their command-line interface of choice, either Bash or PowerShell. Azure Cloud Shell can be access through the portal, as a stand-alone web interface at [shell.azure.com](https://shell.azure.com), or from a number of other access points. For more information, see [Overview of Azure Cloud Shell](../../cloud-shell/overview.md).

## Azure subscriptions

A subscription is a logical grouping of Azure services that is linked to an Azure account. A single Azure account can contain multiple subscriptions. Billing for Azure services is done on a per-subscription basis. Azure subscriptions have an Account Administrator, who has full control over the subscription, and a Service Administrator, who has control over all services in the subscription. For information about classic subscription administrators, see [Add or change Azure subscription administrators](../../cost-management-billing/manage/add-change-subscription-administrator.md). In addition to administrators, individual accounts can be granted detailed control of Azure resources using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

### Select and enable an Azure subscription

Before you can work with Azure services, you need a subscription. Several subscription types are available.

**Free accounts**: The link to sign up for a free account is on the [Azure website](https://azure.microsoft.com/). This gives you a credit over the course of 30 days to try any combination of resources in Azure. If you exceed your credit amount, your account is suspended. At the end of the trial, your services are decommissioned and will no longer work. You can upgrade to a pay-as-you-go subscription at any time.

**MSDN subscriptions**: If you have an MSDN subscription, you get a specific amount in Azure credit each month. For example, if you have a Microsoft Visual Studio Enterprise with MSDN subscription, you get \$150 per month in Azure credit.

If you exceed the credit amount, your service is disabled until the next month starts. You can turn off the spending limit and add a credit card to be used for the additional costs. Some of these costs are discounted for MSDN accounts. For example, you pay the Linux price for VMs running Windows Server, and there is no additional charge for Microsoft servers such as Microsoft SQL Server. This makes MSDN accounts ideal for development and test scenarios.

**BizSpark accounts**: The Microsoft BizSpark program provides many benefits to startups. One of those benefits is access to all the Microsoft software for development and test environments for up to five MSDN accounts. You get $150 in Azure credit for each of those five MSDN accounts, and you pay reduced rates for several of the Azure services, such as Virtual Machines.

**Pay-as-you-go**: With this subscription, you pay for what you use by attaching a credit card or debit card to the account. If you are an organization, you can also be approved for invoicing.

**Enterprise agreements**: With an enterprise agreement, you commit to using a certain number of services in Azure over the next year, and you pay that amount ahead of time. The commitment that you make is consumed throughout the year. If you exceed the commitment amount, you can pay the overage in arrears. Depending on the amount of the commitment, you get a discount on the services in Azure.

### Grant administrative access to an Azure subscription

Azure RBAC has several built-in roles that you can use to assign permissions. To make a user an administrator of an Azure subscription, assign them the [Owner](../../role-based-access-control/built-in-roles.md#owner) role at the subscription scope. The Owner role gives the user full access to all resources in the subscription, including the right to delegate access to others.

For more information, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

### View billing information in the Azure portal

An important component of using Azure is the ability to view billing information. The Azure portal provides detailed insight into Azure billing information.

For more information, see [How to download your Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md).

### Get billing information from billing APIs

In addition to viewing the billing in the portal, you can access the billing information by using a script or program through the Azure Billing REST APIs:

- You can use the Azure Usage API to retrieve your usage data. You can fine-tune the billing usage information by tagging related Azure resources. For example, you can tag each of the resources in a resource group with a department name or project name, and then track the costs specifically for that one tag.

- You can use the [Cost Management automation overview](../../cost-management-billing/automate/automation-overview.md) to list all the available resources, along with the metadata. For more information on prices, see [Azure Retail Prices overview](/rest/api/cost-management/retail-prices/azure-retail-prices).

### Forecast cost with the pricing calculator

The pricing for each service in Azure is different. Many Azure services provide Basic, Standard, and Premium tiers. Usually, each tier has several price and performance levels. By using the [online pricing calculator](https://azure.microsoft.com/pricing/calculator), you can create pricing estimates. The calculator includes flexibility to estimate cost on a single resource or a group of resources.

## Azure Resource Manager

Azure Resource Manager is a deployment, management, and organization mechanism for Azure resources. By using Resource Manager, you can put many individual resources together in a resource group.

Resource Manager also includes deployment capabilities that allow for customizable deployment and configuration of related resources. For instance, by using Resource Manager, you can deploy an application that consists of multiple virtual machines, a load balancer, and a database in Azure SQL Database as a single unit. You develop these deployments by using a Resource Manager template.

Resource Manager provides several benefits:

- You can deploy, manage, and monitor all the resources for your solution as a group, rather than handling these resources individually.

- You can repeatedly deploy your solution throughout the development lifecycle and have confidence that your resources are deployed in a consistent state.

- You can manage your infrastructure through declarative templates rather than scripts.

- You can define the dependencies between resources so they are deployed in the correct order.

- You can apply access control to all services in your resource group because Azure RBAC is natively integrated into the management platform.

- You can apply tags on resources to logically organize all the resources in your subscription.

- You can clarify your organization's billing by viewing costs for a group of resources that share the same tag.

### Tips for creating resource groups

When you're making decisions about your resource groups, consider these tips:

- All the resources in a resource group should have the same lifecycle.

- You can assign a resource to only one group at a time.

- You can add or remove a resource from a resource group at any time. Every resource must belong to a resource group. So if you remove a resource from one group, you must add it to another.

- You can move most types of resources to a different resource group at any time.

- The resources in a resource group can be in different regions.

- You can use a resource group to control access for the resources in it.

### Building Resource Manager templates

Resource Manager templates declaratively define the resources and resource configurations that will be deployed into a single resource group. You can use Resource Manager templates to orchestrate complex deployments without the need for excess scripting or manual configuration. After you develop a template, you can deploy it multiple times—each time with an identical outcome.

A Resource Manager template consists of four sections:

- **Parameters**: These are inputs to the deployment. Parameter values can be provided by a human or an automated process. An example parameter might be an admin user name and password for a Windows VM. The parameter values are used throughout the deployment when they're specified.

- **Variables**: These are used to hold values that are used throughout the deployment. Unlike parameters, a variable value is not provided at deployment time. Instead, it's hard coded or dynamically generated.

- **Resources**: This section of the template defines the resources to be deployed, such as virtual machines, storage accounts, and virtual networks.

- **Output**: After a deployment has finished, Resource Manager can return data such as dynamically generated connection strings.

The following mechanisms are available for deployment automation:

- **Functions**: You can use several functions in Resource Manager templates. These include operations such as converting a string to lowercase, deploying multiple instances of a defined resource, and dynamically returning the target resource group. Resource Manager functions help build dynamic deployments.

- **Resource dependencies**: When you're deploying multiple resources, some resources will have a dependency on others. To facilitate deployment, you can use a dependency declaration so that dependent resources are deployed before the others.

- **Template linking**: From within one Resource Manager template, you can link to another template. This allows deployment decomposition into a set of targeted, purpose-specific templates.

You can build Resource Manager templates in any text editor. However, the Azure SDK for Visual Studio includes tools to help you. By using Visual Studio, you can add resources to the template through a wizard, then deploy and debug the template directly from within Visual Studio. For more information, see [Authoring Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md).

Finally, you can convert existing resource groups into a reusable template from the Azure portal. This can be helpful if you want to create a deployable template of an existing resource group, or you just want to examine the underlying JSON. To export a resource group, select the **Automation Script** button from the resource group's settings.

## Security of Azure resources (Azure RBAC)

You can grant operational access to user accounts at a specified scope: subscription, resource group, or individual resource. This means you can deploy a set of resources into a resource group, such as a virtual machine and all related resources, and grant permissions to a specific user or group. This approach limits access to only the resources that belong to the target resource group. You can also grant access to a single resource, such as a virtual machine or a virtual network.

To grant access, you assign a role to the user or user group. There are many predefined roles. You can also define your own custom roles.

Here are a few examples of [built-in roles in Azure](../../role-based-access-control/built-in-roles.md):

- **Owner**: A user with this role can manage everything, including access.

- **Reader**: A user with this role can read resources of all types (except secrets) but can't make changes.

- **Virtual Machine Contributor**: A user with this role can manage virtual machines but can't manage the virtual network to which they are connected or the storage account where the VHD file resides.

- **SQL DB Contributor**: A user with this role can manage SQL databases but not their security-related policies.

- **SQL Security Manager**: A user with this role can manage the security-related policies of SQL servers and databases.

- **Storage Account Contributor**: A user with this role can manage storage accounts but cannot manage access to the storage accounts.

For more information, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Azure Virtual Machines

Azure Virtual Machines is one of the central IaaS services in Azure. Azure Virtual Machines supports the deployment of Windows or Linux virtual machines in a Microsoft Azure datacenter. With Azure Virtual Machines, you have total control over the VM configuration and are responsible for all software installation, configuration, and maintenance.

When you're deploying an Azure VM, you can select an image from the Azure Marketplace, or you can provide you own generalized image. This image is used to apply the operating system and initial configuration. During the deployment, Resource Manager will handle some configuration settings, such as assigning the computer name, administrative credentials, and network configuration. You can use Azure virtual machine extensions to further automate configurations such as software installation, antivirus configuration, and monitoring solutions.

You can create virtual machines in many different sizes. The size of virtual machine dictates resource allocation such as processing, memory, and storage capacity. In some cases, specific features such as RDMA-enabled network adapters and SSD disks are available only with certain VM sizes. For a complete list of VM sizes and capabilities, see "Sizes for virtual machines in Azure" for [Windows](../../virtual-machines/sizes.md) and [Linux](../../virtual-machines/sizes.md).

### Use cases

Because Azure virtual machines offer complete control over configuration, they are ideal for a wide range of server workloads that do not fit into a PaaS model. Server workloads such as database servers (SQL Server, Oracle, or MongoDB), Windows Server Active Directory, Microsoft SharePoint, and many more become possible to run on the Microsoft Azure platform. If desired, you can move such workloads from an on-premises datacenter to one or more Azure regions, without a large amount of reconfiguration.

### Deployment of virtual machines

You can deploy Azure virtual machines by using the Azure portal, by using automation with the Azure PowerShell module, or by using automation with the cross-platform CLI.

#### Portal

Deploying a virtual machine by using the Azure portal requires only an active Azure subscription and access to a web browser. You can select many different operating system images with varying configurations. All storage and networking requirements are configured during the deployment. For more information, see "Create a virtual machine in the Azure portal" for [Windows](../../virtual-machines/windows/quick-create-portal.md) and [Linux](../../virtual-machines/linux/quick-create-portal.md).

In addition to deploying a virtual machine from the Azure portal, you can deploy an Azure Resource Manager template from the portal. This will deploy and configure all resources as defined in the template. For more information, see [Deploy resources with Resource Manager templates and Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

#### PowerShell

Deploying an Azure virtual machine by using PowerShell allows for complete deployment automation of all related virtual machine resources, including storage and networking. For more information, see [Create a Windows VM using Resource Manager and PowerShell](../../virtual-machines/windows/quick-create-powershell.md).

In addition to deploying Azure compute resources individually, you can use the Azure PowerShell module to deploy an Azure Resource Manager template. For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md).

#### Command-line interface (CLI)

As with the PowerShell module, the Azure CLI provides deployment automation and can be used on Windows, OS X, or Linux systems. When you're using the Azure CLI **vm quick-create** command, all related virtual machine resources (including storage and networking) and the virtual machine itself are deployed. For more information, see [Create a Linux VM in Azure by using the CLI](../../virtual-machines/linux/quick-create-cli.md).

Likewise, you can use the Azure CLI to deploy an Azure Resource Manager template. For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../../azure-resource-manager/templates/deploy-cli.md).

### Access and security for virtual machines

Accessing a virtual machine from the Internet requires the associated network interface, or load balancer if applicable, to be configured with a public IP address. The public IP address includes a DNS name that will resolve to the virtual machine or load balancer. For more information, see [IP addresses in Azure](../../virtual-network/ip-services/public-ip-addresses.md).

You manage access to the virtual machine over the public IP address by using a network security group (NSG) resource. An NSG acts like a firewall and allows or denies traffic across the network interface or subnet on a set of defined ports. For instance, to create a Remote Desktop session with an Azure VM, you need to configure the NSG to allow inbound traffic on port 3389. For more information, see [Opening ports to a VM in Azure using the Azure portal](../../virtual-machines/windows/nsg-quickstart-portal.md).

Finally, as with the management of any computer system, you should provide security for an Azure virtual machine at the operating system by using security credentials and software firewalls.

## Azure storage
Azure provides Azure Blob storage, Azure Files, Azure Table storage, and Azure Queue storage to address a variety of different storage use cases, all with high durability, scalability, and redundancy guarantees. Azure storage services are managed through an Azure storage account that can be deployed as a resource to any resource group by using any resource deployment method. 

### Use cases
Each storage type has a different use case.

#### Blob storage
The word *blob* is an acronym for *binary large object*. Blobs are unstructured files like those that you store on your computer. Blob storage can store any type of text or binary data, such as a document, media file, or application installer. Blob storage is also referred to as object storage.

Azure Blob storage supports three kinds of blobs:

- **Block blobs** are used to hold ordinary files up to 195 GiB in size (4 MiB × 50,000 blocks). The primary use case for block blobs is the storage of files that are read from beginning to end, such as media files or image files for websites. They are named block blobs because files larger than 64 MiB must be uploaded as small blocks. These blocks are then consolidated (or committed) into the final blob.

- **Page blobs** are used to hold random-access files up to 1 TiB in size. Page blobs are used primarily as the backing storage for the VHDs that provide durable disks for Azure Virtual Machines, the IaaS compute service in Azure. They are named page blobs because they provide random read/write access to 512 byte pages.

- **Append blobs** consist of blocks like block blobs, but they are optimized for append operations. These are frequently used for logging information from one or more sources to the same blob. For example, you might write all of your trace logging to the same append blob for an application that's running on multiple VMs. A single append blob can be up to 195 GiB.

For more information, see [What is Azure Blob storage](../../storage/blobs/storage-blobs-overview.md).

#### Azure Files
Azure Files offers fully managed file shares in the cloud that are accessble via the industry standard Server Message Block (SMB) or Network File System (NFS) protocols. The service supports both SMB 3.1.1, SMB 3.0, SMB 2.1, NFS 4.1. With Azure Files, you can migrate applications that rely on file shares to Azure quickly and without costly rewrites. Applications running on Azure virtual machines, in cloud services, or from on-premises clients can mount a file share in the cloud.

Because a Azure file shares expose a standard SMB or NFS endpoints, applications running in Azure can access data in the share via file system I/O APIs. Developers can therefore use their existing code and skills to migrate existing applications. IT pros can use PowerShell cmdlets to create, mount, and manage Azure file shares as part of the administration of Azure applications.

For more information, see [What is Azure Files](../../storage/files/storage-files-introduction.md).

#### Table storage
Azure Table storage is a service that stores structured NoSQL data in the cloud. Table storage is a key/attribute store with a schema-less design. Because Table storage is schema-less, it's easy to adapt your data as the needs of your application evolve. Access to data is fast and cost-effective for all kinds of applications. Table storage is typically significantly lower in cost than traditional SQL for similar volumes of data.

You can use Table storage to store flexible datasets, such as user data for web applications, address books, device information, and any other type of metadata that your service requires. You can store any number of entities in a table. A storage account can contain any number of tables, up to the capacity limit of the storage account.

For more information, see [Get started with Azure Table storage](../../cosmos-db/tutorial-develop-table-dotnet.md).

#### Queue storage
Azure Queue storage provides cloud messaging between application components. In designing applications for scale, application components are often decoupled so that they can scale independently. Queue storage delivers asynchronous messaging for communication between application components, whether they are running in the cloud, on the desktop, on an on-premises server, or on a mobile device. Queue storage also supports managing asynchronous tasks and building process workflows.

For more information, see [Get started with Azure Queue storage](/azure/storage/queues/storage/queues/storage-quickstart-queues-dotnet?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli).

### Deploying a storage account

There are several options for deploying a storage account.

#### Portal

Deploying a storage account by using the Azure portal requires only an active Azure subscription and access to a web browser. You can deploy a new storage account into a new or existing resource group. After you've created the storage account, you can create a blob container or file share by using the portal. You can create Table and Queue storage entities programmatically. For more information, see [Create a storage account](../../storage/common/storage-account-create.md).

In addition to deploying a storage account from the Azure portal, you can deploy an Azure Resource Manager template from the portal. This will deploy and configure all resources as defined in the template, including any storage accounts. For more information, see [Deploy resources with Resource Manager templates and Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

#### PowerShell

Deploying an Azure storage account by using PowerShell allows for complete deployment automation of the storage account. For more information, see [Using Azure PowerShell with Azure Storage](/powershell/module/az.storage/).

In addition to deploying Azure resources individually, you can use the Azure PowerShell module to deploy an Azure Resource Manager template. For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/templates/deploy-powershell.md).

#### Command-line interface (CLI)

As with the PowerShell module, the Azure CLI provides deployment automation and can be used on Windows, macOS, or Linux systems. You can use the Azure CLI **storage account create** command to create a storage account. For more information, see [Using the Azure CLI with Azure Storage.](../../storage/blobs/storage-quickstart-blobs-cli.md)

Likewise, you can use the Azure CLI to deploy an Azure Resource Manager template. For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../../azure-resource-manager/templates/deploy-cli.md).

### Access and security for Azure storage services

Azure storage services are accessed in various ways, including though the Azure portal, during VM creation and operation, and from Storage client libraries.

#### Virtual machine disks

When you're deploying a virtual machine, you also need to create a storage account to hold the virtual machine operating system disk and any additional data disks. You can select an existing storage account or create a new one. Because the maximum size of a blob is 1,024 GiB, a single VM disk has a maximum size of 1,023 GiB. To configure a larger data disk, you can present multiple data disks to the virtual machine and pool them together as a single logical disk. For more information, see "Manage Azure disks" for [Windows](../../virtual-machines/windows/tutorial-manage-data-disk.md) and [Linux](../../virtual-machines/linux/tutorial-manage-disks.md).

#### Storage tools

Azure storage accounts can be accessed through many different storage explorers, such as Visual Studio Cloud Explorer. These tools let you browse through storage accounts and data. For more information and a list of available storage explorers, see [Azure Storage client tools](../../storage/common/storage-explorers.md).

#### Storage API

Storage resources can be accessed by any language that can make HTTP/HTTPS requests. Additionally, the Azure storage service offer programming libraries for several popular languages. These libraries simplify working with the Azure storage platform by handling details such as synchronous and asynchronous invocation, batching of operations, exception management, and automatic retries. For more information, see [Azure storage services REST API reference](/rest/api/storageservices/Azure-Storage-Services-REST-API-Reference).

#### Storage access keys

Each storage account has two authentication keys, a primary and a secondary. Either can be used for storage access operations. These storage keys are used to help secure a storage account and are required for programmatically accessing data. There are two keys to allow occasional rollover of the keys to enhance security. It is critical to keep the keys secure because their possession, along with the account name, allows unlimited access to any data in the storage account.

#### Shared access signatures

If you need to allow users to have controlled access to your storage resources, you can create a shared access signature. A shared access signature is a token that can be appended to a URL that enables delegated access to a storage resource. Anyone who possesses the token can access the resource that it points to with the permissions that it specifies, for the period of time that it's valid. For more information, see [Using shared access signatures](../../storage/common/storage-sas-overview.md).

## Azure Virtual Network

Virtual networks are necessary to support communications between virtual machines. You can define subnets, custom IP address, DNS settings, security filtering, and load balancing. Azure supports different uses cases: cloud-only networks or hybrid virtual networks.

### Cloud-only virtual networks

An Azure virtual network, by default, is accessible only to resources stored in Azure. Resources connected to the same virtual network can communicate with each other. You can associate virtual machine network interfaces and load balancers with a public IP address to make the virtual machine accessible over the Internet. You can help secure access to the publicly exposed resources by using a network security group.

![Azure Virtual Network for a 2-tier Web Application](/azure/load-balancer/media/load-balancer-internal-overview/ic744147.png)

### Hybrid virtual networks

You can connect an on-premises network to an Azure virtual network by using ExpressRoute or a site-to-site VPN connection. In this configuration, the Azure virtual network is essentially a cloud-based extension of your on-premises network.

Because the Azure virtual network is connected to your on-premises network, cross-premises virtual networks must use a unique portion of the address space that your organization uses. In the same way that different corporate locations are assigned a specific IP subnet, Azure becomes another location as you extend your network.
There are several options for deploying a virtual network.

- [Portal](../..//virtual-network/quick-create-portal.md)

- [PowerShell](../../virtual-network/quick-create-powershell.md)

- [Command-Line Interface (CLI)](../../virtual-network/quick-create-cli.md)

- Azure Resource Manager Templates

> **When to use**: Anytime you are working with VMs in Azure, you will work with virtual networks. This allows for segmenting your VMs into public-facing and private subnets similar on-premises datacenters.
>
> **Get started**: Deploying an Azure virtual network by using the Azure portal requires only an active Azure subscription and access to a web browser. You can deploy a new virtual network into a new or existing resource group. When you're creating a new virtual machine from the portal, you can select an existing virtual network or create a new one. Get started and [Create a virtual network using the Azure portal](../../virtual-network/quick-create-portal.md).

### Access and security for virtual networks

You can help secure Azure virtual networks by using a network security group. NSGs contain a list of access control list (ACL) rules that allow or deny network traffic to your VM instances in a virtual network. You can associate NSGs with either subnets or individual VM instances within that subnet. When you associate an NSG with a subnet, the ACL rules apply to all the VM instances in that subnet. In addition, you can further restrict traffic to an individual VM by associating an NSG directly with that VM. For more information, see [Filter network traffic with network security groups](../../virtual-network/network-security-groups-overview.md).

## Next steps

- [Create a Windows VM](../../virtual-machines/windows/quick-create-portal.md)
- [Create a Linux VM](../../virtual-machines/linux/quick-create-portal.md)
