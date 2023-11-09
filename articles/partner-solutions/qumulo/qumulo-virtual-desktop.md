---
title: Azure Native Qumulo Scalable File Service with a virtual desktop
description: In this article, learn about the use case for Azure Native Qumulo Scalable File Service with a virtual desktop.

ms.topic: overview
ms.date: 11/15/2023

---

# What is Azure Native Qumulo Scalable File Service with a virtual desktop?

Azure Native Qumulo (ANQ) allows users to use Azure Virtual Desktop (AVD) services to on-premises and remote users. This article describes a solution that is distributed across two separate Azure regions in an active-active configuration. ANQ and AVD can also be deployed to a single region if high availability isn't required.

Remote workers require secure access to critical resources and data from anywhere. A remote desktop solution can offer high security and a low total cost of ownership. Users can experience short sign in times and better overall user productivity when using AVD with ANQ. This solution combines multi-region deployments with failover capabilities for both regions.

The benefits you provide with this deployment model include:

- low latency for users, regardless of location
- high-availability
- support for remote users, even if there's an Azure region outage

## Architecture

The Azure Virtual Desktop solution with Azure Native Qumulo file storage is deployed across two separate regions on Azure. Remote desktop services are provided by Azure Virtual Desktop combined with Nerdio Enterprise Manager for connection services, AVD resource pool and desktop image management. User authentication services are delivered using  Microsoft Entra ID. User profile connections are managed by FSLogix, and profile storage is provided by the ANQ service instance, and accessed through SMB, as shown in the following diagram(s).

## Solution architecture

Azure Native Qumulo for with Azure Virtual desktop is a solution that is distributed across two separate Azure regions in an active-active configuration.

:::image type="content" source="media/qumulo-virtual-desktop/solution-architecture-qumulo-virtual-desktop.png" alt-text="Conceptual diagram that shows the solution architecture Azure virtual desktop with Qumulo." lightbox="media/qumulo-virtual-desktop/solution-architecture-qumulo-virtual-desktop-2.png":::

### Solution workflow

1. Users can access the solution from any location, whether on-premises or remote, through RDP using any compatible client.

1. Authentication services are provided by Microsoft Entra ID.

1. Once authenticated, each user is connected to an available virtual desktop machine through Nerdio Connection Manager.

1. As part of the desktop sign in process, FSLogix Profile Containers connect each AVD user to their assigned profile on the ANQ storage

1. Application-tier services and client software can be deployed either through application streaming or as part of the base AVD image.

1. AVD resource pools, desktop images, applications and service monitoring are managed by Nerdio Manager.

1. The ANQ service used in the solution is deployed in Qumulo’s Azure tenant.

1. Access to the ANQ service is enabled through virtual network (VNet) injection from a dedicated subnet in the customer’s Azure tenant that connects to the customer’s dedicated ANQ service instance in the Qumulo tenant.
    > [!NOTE]
    >  Qumulo has no access to any of your data on any ANQ instance.

1. All user profiles on the ANQ service instance in each Azure region are replicated to the ANQ service instance in the other Azure region through Qumulo Continuous Replication service.

1. If there's an AVD service interruption in one Azure region, all AVD services, including AVD resource pools, Nerdio connection and resource management, FSLogix Profile management, and user profiles on the ANQ service instance failover to the designated secondary Azure region.

### Process workflow

The process flow for Azure Native Qumulo for with Azure Virtual desktop is depicted here:

:::image type="content" source="media/qumulo-virtual-desktop/process-workflow-qumulo-virtual-desktop.png" alt-text="Conceptual diagram that shows the process workflow for Azure virtual desktop with Qumulo." lightbox="media/qumulo-virtual-desktop/process-workflow-qumulo-virtual-desktop-2.png":::

## Components

The solution architecture comprises the following components:

- [Azure Native Qumulo (ANQ)](https://qumulo.com/azure) to host the individual VHD-based profiles of each desktop user. In this solution, a separate ANQ instance has been deployed in each region.
- [Qumulo Continuous Replication](https://care.qumulo.com/hc/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above), configured to replicate user profile data from each region’s local ANQ service instance to the ANQ instance in the other region, ensuring that user profile services are available if there's a regional failover.
- [Azure Virtual Desktop](/azure/virtual-desktop/overview), deployed in two Azure regions, with a separate pool of users assigned to each region’s AVD resources as their primary site, and each region set up as the secondary site for the other region if there's a regional service interruption.
- [Nerdio Manager](https://getnerdio.com/nerdio-manager-for-enterprise/) to manage the AVD-related services: resource pools, connectivity, security, desktop images, applications, and service monitoring.
- [FSLogix Profile](/fslogix/overview-what-is-fslogix) [Containers](/fslogix/concepts-container-types#profile-container) to connect each AVD user to their assigned profile on the ANQ storage as part of the sign-in process.
- [Microsoft Entra Domain Services](/azure/active-directory-domain-services/overview) to provide user authentication and manage access to Azure-based resources.
- [Azure Virtual Networking](/azure/virtual-network/virtual-networks-overview)
- [VNet Injection](/azure/spring-apps/how-to-deploy-in-azure-virtual-network?tabs=azure-portal) to connect each region’s ANQ instance to the customer’s own Azure subscription resources.

## Considerations

When planning a highly available Azure Virtual Desktop solution that uses Azure Native Qumulo deployment for desktop profile storage, consider these factors in your planning and design processes.

### Potential use cases

Your enterprise can use this solution if you're looking to satisfy any or all of the following applicable scenarios.

- Remote end users:
  - Enterprises that employ a globally distributed workforce can use a multi-region AVD deployment to minimize latency when accessing enterprise resources from anywhere in the world.

- Workforce elasticity:
  - An AVD solution delivers corporate desktop services quickly and reliably, even to end users whose client hardware isn't up to corporate or enterprise standards. ANQ with AVD allows organizations to bring a large number of workers online quickly. For example:
    - for seasonal help,
    - as part of a merger and acquisition process
    - in response to external events that have shuttered physical facilities and sent users home.

- Desktop image management:
  - The use of ephemeral desktops that are created right before a user connects, and then destroyed when the user sign out a few hours later, means that the process of updating operating system versions and images, can be rolled out across an entire enterprise within days by updating the relevant base image and redeploying to a new resource pool.

- Software management:
  - AVD also simplifies the process of deploying new enterprise software applications, maintaining licensing compliance on existing software agreements, and preventing the installation of unauthorized software by rogue users.

- Security and compliance:
  - In heavily regulated environments, such as healthcare, government, education, or the financial sector, an AVD solution can be configured through policy to enhance compliance with relevant corporate standards, and any applicable legal and regulatory requirements. These policies and standards can be difficult to enforce on physical client hardware, for example preventing data theft through USB drive, or deactivating enterprise antivirus/monitoring tools.

### Scalability and performance

When planning a high-availability AVD solution designed to provide desktop services to a large number of geographically dispersed users, consider the following factors for capacity and design:

- Capacity and growth:
  - the ANQ service instance can be scaled as needed in response to an increased user count or to a higher space allocation per user. Your enterprises can improve the overall TCO of the solution by not over-provisioning file capacity before it’s needed.
- Performance:
  - The overall architecture of the solution anticipates the possibility of a failover event, in which users and desktops from both regions are suddenly dependent on a single region for both data and compute services. The solution should include a rapid-response plan for increasing available resources within the solution’s designated recovery-time objective (RTO) to ensure acceptable performance.
- Throughput:
  - ANQ can scale throughput as needed to meet heavier short-term performance needs, for example, burst processing, or a high number of concurrent user logins. The overall solution design should include the ability to add capacity and throughput in response to changing needs.
- Latency:
  - A user’s location relative to one region’s access point as compared to location of the others should be a key factor when you assign users to one region or the other.

### Security

The high-availability AVD solution can be connected to enterprise resources on-premises or in other public clouds through either ExpressRoute or VPN, and to other Azure-based enterprise resources through Azure Virtual Network connectivity.

Depending on the specific configuration of your enterprise, authentication can be provided through Microsoft Entra ID or by your own Active Directory.

Since this solution provides user-facing services, antivirus, anti-malware, and other enterprise software monitoring tools should be incorporated into each virtual desktop to safeguard critical systems and data from malicious attacks.

### Cost optimization

Cost optimization refers to minimizing unnecessary expenses while maximizing the value of the actual costs incurred by the solution. For more information, visit the [Overview of the cost optimization pillar page](/azure/well-architected/cost/overview).

- Azure Native Qumulo is available in multiple tiers, giving you a choice of multiple capacity-to-throughput options to meet your specific workload needs.

- Different users within the solution might have different requirements for the overall availability and performance of their virtual machines. If so, consider a tiered approach that ensures all workers have what they need for optimal productivity.

### Availability

Different organizations can have different availability and recoverability requirements even for the same application. The term availability refers to the solution’s ability to continuously deliver the service at the level of performance for which it was built.

### Data and storage availability

The ANQ deployment includes built-in redundancy at the data level to ensure data availability against failure of the underlying hardware. To protect the data against accidental deletion, corruption, malware or other cyber attack, ANQ includes the ability to take snapshots at any level within the file system to create point-in-time, read-only copies of your data.

Replicated user profiles are read-only under normal circumstances. The solution’s RTO should include the time needed to fail over to the secondary ANQ instance (for example break the replication relationship and make all profiles writable) before connecting users from the remote region to AVD instances.

ANQ also supports any file-based backup solution to enable external data protection.

### Resource tier availability

For specific information about the availability and recovery options for the AVD service layer, for Nerdio Enterprise Manager, and for FSLogix, consult the relevant documentation for each.

## Deployment

- To deploy Azure Native Qumulo Scalable File Service, see [our website](https://qumulo.com/product/azure/).

- For more information regarding the deployment of Azure Virtual Desktop, visit the [Azure Virtual Desktop](/azure/virtual-desktop/) documentation page.

- For more information regarding FSLogix, see [FSLogix](/fslogix/).

- To learn more about the use of Nerdio Manager for Enterprises or Managed Service Providers, see [Nerdio](https://getnerdio.com/) website.

## Next steps

- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
