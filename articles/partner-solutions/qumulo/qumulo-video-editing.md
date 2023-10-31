---
title: how to use Azure Native Qumulo Scalable File Service for video editing usecase ?
description: In this how to guide, how to setup Azure Native Qumulo Scalable File Service for video editing usecase.

ms.topic: conceptual 
ms.date: 10/31/2023

---

This article describes a solution that provides a cloud-based remote video editing environment for 2K/ 4K / 8K content, and which has been engineered to deliver high-performance editorial capabilities using Azure-based Adobe Premiere Pro VMs with high-performance storage services provided by Azure Native Qumulo (ANQ).ANQ enables content creators, editors, and artists to work remotely on video editing projects with the high speed and efficiency.  

|Benefits of Video Editorial with Azure Native Qumulo|Details|
|---------|---------|
|Scalability |A single ANQ instance can scale to exabyte size and beyond in a single namespace. More content creators can be supported simply by provisioning new environments for them.|
|Cost efficiency | Customers pay only for the capacity and throughput they use, while they use it.The elasticity of cloud resources means that content creators can add more power temporarily to meet critical deadlines, rather than paying for high-end compute capacity that isn’t needed for most projects.|
|Performance |Azure enables creators to temporarily increase compute power if needed to meet critical deadlines or to scale new projects quickly. ANQ also supports temporarily increased throughput as needed for burst processing.|
|Global reach |The solution can be deployed in one or more Azure regions worldwide.|
|Security and compliance | Content creators can easily secure data in transit with built-in, end-to-end encryption.|
|Management simplicity|Using Azure-based compute services for video editorial, rather than high-end graphics workstations eliminates the need for purchasing, supporting and tracking per-user assets, simplifying operations overall.|

## Architecture

The solution is deployed on Azure with selectable performance options and combines Qumulo’s file data platform and HP Anyware PCoIP services for creative teams to store, manage, and create projects with Adobe Premiere Pro, as shown in the following diagram. Data services are hosted on the ANQ service and accessed via SMB.

NOTE: Qumulo has no access to customer data on any ANQ deployment.

### Solution Architecture

1. This solution is deployed into an Azure customer tenant in a single Azure region, with customer resources, including a virtual network gateway for incoming client connections, a Leostream connection broker for connecting each authenticated user to a dedicated resource group, and a Media Asset Manager virtual machine.
2. Resource groups for video editorial workflows are connected to the core resource group via VNet Peering.
3. The ANQ service instance used in the solution is deployed in Qumulo’s Azure tenant.
4. Access to the ANQ service instance is enabled via VNet injection from a dedicated subnet in the customer’s Azure tenant. All data on the ANQ service instance is accessible only via the network interfaces in the customer’s delegated subnet. Note: Qumulo has no access to any data on any ANQ instance.

:::image type="content" source="media/qumulo-video-editing/solution-architecture-qumulo-video-editing.png" alt-text="solution architecture for video editing using Qumulo.":::

### Solution Workflow

1. The user connects with the solution via HP Anyware PCoIP client, which comes in multiple versions: thin clients, mobile clients, and Windows / Mac / Linux clients.
2. Access between the HP Anyware client software and the Azure-based environment can be via Azure VPN Gateway or through an ExpressRoute connection.
3. User credentials and resource access are verified via Azure Active Directory / Microsoft Entra ID.
4. Once authenticated, each user is connected to a dedicated resource group, containing one or more workstation virtual machines running Adobe Premiere Pro, connected via SMB to the Azure Native Qumulo instance.
5. Content is saved to the ANQ service instance, and tracked / managed by the customer’s Media Asset Manager software.

## Components

The solution architecture comprises the following components:

- [Azure Native Qumulo Scalable File Service (ANQ)](https://qumulo.com/azure) to provide consolidated, cloud-based VNA archive services
- [Leostream](https://leostream.com/media-entertainment/) connection Broker for connecting incoming clients to resource groups within the solution
- [GPU-optimized virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-gpu)
- Media Asset Manager for tracking and organizing content
- Adobe Premiere Pro video-editing software, running on virtual machines in the customer’s Azure tenant
- [HP Anyware](https://www.teradici.com/partners/cloud-partners/microsoft) (formerly Teradici)
- [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
- [VNet ExpressRoute](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction)
- [Azure VPN Gateway](https://learn.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways)

## Considerations

Enterprises planning a video editorial solution using Azure Native Qumulo with Adobe Premiere Pro and HP Anyware clients should include the following considerations in their planning and design processes.

### Potential use cases

Here are some  use cases:

- Video Editing and Post-Production:
  - Video editors can access high-resolution video files stored on ANQ directly from their local client using HP Anyware. This allows for seamless editing without the need to transfer large files locally. The scalability of Azure and ANQ ensures that as the project grows, the storage capacity dynamically expands without disrupting the workflow.
- Remote and Collaborative Editing:
  - With ANQ, multiple editors or team members can collaborate on video projects from different locations. They can work on the same project simultaneously, share assets, review edits, and provide feedback in real-time.
- Flexibility and Mobility:
  Video editors can access their projects and tools from anywhere with an internet connection. They can access the video editing farm from various devices, including laptops, tablets, or thin clients, without compromising performance or security.

### Scalability and Performance

When planning a video editing solution using Qumulo and Adobe Premiere Pro, enterprise architects and other stakeholders may want to include the following into the solution:

- Capacity and growth: ANQ scales easily on demand, allowing you to add as much capacity as needed simply by creating or migrating data.
- Performance: Azure provides scalable compute and storage as needed, allowing you to easily adjust the computing resources allocated to your Adobe Premiere Pro workstation VMs.
- Throughput: ANQ allows you to adjust throughput on demand, in 1GB/s increments, to ensure the availability of throughput you need at all times.  Use and pay only for the throughput required by the number of Adobe Premiere editors using ANQ.
- Latency: Latency between the Adobe Premiere Pro workstation VMs and the ANQ storage is minimal for editing purposes. Latency between the user’s local client and the Azure environment can be optimized via the HP Anyware client.

### Security

The Azure Native Qumulo Scalable File Service connects to your Azure environment using VNet Injection, which is fully routable, secure, and visible only to your resources. No IP space coordination between your environment and the ANQ service instance is required.

HP Anyware offers secure end-to-end encryption for remote access to VMs. This helps protect sensitive video footage and intellectual property, ensuring that only authorized users can access and edit the content.

Care should be taken during design and implementation to ensure that the security of the solution complies with industry best practices, internal enterprise policies, and any applicable legal/regulatory requirements.

For all other aspects of the solution, customers are responsible for planning, implementing, and maintaining the security of the solution to satisfy all applicable legal and regulatory requirements for their industry and location.

### Cost optimization

Cost optimization refers to minimizing unnecessary expenses while maximizing the value of the actual costs incurred by the solution. For more information, visit the [Overview of the cost optimization pillar](https://learn.microsoft.com/en-us/azure/well-architected/cost/overview) page.

- Azure’s pay-as-you-go model allows you to optimize costs by scaling resources to use the capacity when needed. This helps you manage costs efficiently without over-provisioning resources.
- The cost of the Qumulo depends on the amount of data on the Azure Native Qumulo Scalable File Service and the performance consumed. For details, see [Azure Native Qumulo Scalable File Services pricing](https://azure.qumulo.com/calculator?_gl=1*zfn19v*_ga*MTk1NTg5NjYwNy4xNjM4Mzg3MjE1*_ga_NMLSHVWEN3*MTY5NTQyMTcyNi4zMDkuMS4xNjk1NDIxNzMwLjU2LjAuMA..*_gcl_au*Njk2NjE4MjQ4LjE2ODc3OTI1NzM.).
- Refer to Adobe’s solution documentation for specific guidance on virtual machine sizing and performance of the editing workstation VMs.

### Availability

Different organizations can have different availability and recoverability requirements even for the same application. The term availability refers to the solution’s ability to continuously deliver the service at the level of performance for which it was built.

#### Data and storage availability

The ANQ deployment includes built-in redundancy at the data level to ensure data availability against failure of the underlying hardware. To protect the data against accidental deletion, corruption, malware or other cyberattack, ANQ includes the ability to take snapshots at any level within the file system to create point-in-time, read-only copies of your data.
ANQ supports replication of the data to a secondary Qumulo storage instance, which can be hosted in Azure, in another cloud, or on-premises. ANQ is compatible with file-based backup solutions to enable external data protection.

## Deploy this scenario

- To deploy Azure Native Qumulo Scalable File Service, visit [our website](https://qumulo.com/product/azure/).
- For more information regarding inbound and outbound networking, [Required Networking Ports for Qumulo Core](https://docs.qumulo.com/administrator-guide/networking/required-networking-ports.html)
- For more information regarding Adobe Premiere Pro, see [Best practices for Creative Cloud deployment on VDI](https://helpx.adobe.com/enterprise/using/creative-cloud-deployment-on-vdi.html)
- For more information regarding HPE Anyware, see [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/teradici.hp_anyware?tab=Overview).

## Next steps

- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
