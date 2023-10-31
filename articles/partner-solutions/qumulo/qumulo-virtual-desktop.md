---
title: Using Azure Native Qumulo Scalable File Service with a virtual desktop.
description: In this quickstart, learn how to create to use Azure Native Qumulo with a virtual desktop.

ms.topic: quickstart 
ms.date: 10/31/2023

---

# Quickstart: How to setup a multi-region Azure Virtual Desktop with Azure Native Qumulo?

This article describes a solution that delivers highly-available Azure Virtual Desktop services to on-prem and/or remote users. The solution described in this article is distributed across two separate Azure regions in an active-active configuration. ANQ and AVD can also be deployed to a single region if high availability is not required.

Remote workers require secure access to critical resources and data from anywhere. A remote desktop solution can offer high security and a low total cost of ownership. Users can experience short login times and better overall user productivity when using AVD with ANQ. This solution combines multi-region deployments with failover capabilities for both regions. The benefits of this deployment model include:

- Ensuring the lowest possible latency for users, regardless of location.
- Ensuring high-availability.
- Ensuring support for a full complement of remote users, even in the event of an Azure region outage.

|Benefits of Multi-region Azure Virtual Desktop with Azure Native Qumulo|Details|
|---------|---------|
| Scalability |This solution can grow to virtually any size to support new remote workers. Azure offers nearly unlimited compute capacity for new desktops, and a single ANQ instance can scale to exabyte size and beyond in a single namespace.|
| Cost efficiency | ANQ offers a highly cost effective storage solution. Customers pay only for the capacity and throughput they use, while they use it.|
| Performance |ANQ supports high performance throughput for remote desktop profiles, so AVD users benefit from reduced login times. At the IT level, enterprises benefit from ANQ’s scalability that supports exabyte-plus file services in a single namespace.|
| Global reach |The solution can be deployed into any two Azure regions for a high-availability virtual desktop solution that minimizes latency for all users.|
| Security and compliance |This solution simplifies the process of enforcing compliance with enterprise security policies, legal requirements, or other regulatory/industry frameworks as needed, resulting in tighter security of critical systems and data.
Business continuity Provides failover capability and service resiliency in the event of an outage in another Azure region or in customer’s on-prem facilities.|
| Management simplicity | ANQ has  support for exabyte-scale file services simplifies the process of managing user profile storage. The solution as a whole streamlines the process of enabling access for remote users and simplifies enforcement of enterprise security and software-usage policies.|

## Architecture

The Azure Virtual Desktop solution with Azure Native Qumulo file storage is deployed across two separate regions on Azure. Remote desktop services are provided by Azure Virtual Desktop combined with Nerdio Enterprise Manager for connection services, AVD resource pool and desktop image management. User authentication services are delivered using Azure Active Directory / Microsoft Entra ID. User profile connections are managed by FSLogix, and profile storage is provided by the ANQ service instance, and accessed via SMB, as shown in the following diagram(s).

### Solution Architecture

:::image type="content" source="media/qumulo-how-to-manage-qumulo-avd/solution-architecture-qumulo-avd.png" alt-text="Screenshot of solution architecture Azure virtual desktop with Qumulo.":::

## Solution Workflow

1. Users can access the solution from any location, whether on-premises or remote, via RDP using any compatible client.
2. Authentication services are provided by Azure Active Directory / Microsoft Entra ID.
3. Once authenticated, each user is connected to an available virtual desktop machine via Nerdio Connection Manager.
4. As part of the desktop login process, FSLogix Profile Containers connect each AVD user to their assigned profile on the ANQ storage
5. Application-tier services and client software can be deployed either via application streaming or as part of the base AVD image.
6. AVD resource pools, desktop images, applications and service monitoring are managed by Nerdio Manager.
7. The ANQ service used in the solution is deployed in Qumulo’s Azure tenant.
8. Access to the ANQ service is enabled via VNet injection from a dedicated subnet in the customer’s Azure tenant that connects to the customer’s dedicated ANQ service instance in the Qumulo tenant. Note: Qumulo has no access to any customer-facing data on any ANQ instance.
9. All user profiles on the ANQ service instance in each Azure region are replicated to the ANQ service instance in the other Azure region via Qumulo Continuous Replication service.
10. In the event of an AVD service interruption in one Azure region, all AVD services, including AVD resource pools, Nerdio connection and resource management, FSLogix Profile management, and user profiles on the ANQ service instance will fail over to the designated secondary Azure region.

### Process Workflow

:::image type="content" source="media/qumulo-how-to-manage-qumulo-avd/process-workflow-qumulo-avd.png" alt-text="Screenshot showing the process workflow for Azure virtual desktop with Qumulo.":::

## Components

The solution architecture comprises the following components:

- [Azure Native Qumulo (ANQ)](https://qumulo.com/azure) to host the individual VHD-based profiles of each desktop user. In this solution, a separate ANQ instance has been deployed in each region.
- [Qumulo Continuous Replication](https://care.qumulo.com/hc/articles/360018873374-Replication-Continuous-Replication-with-2-11-2-and-above), configured to replicate user profile data from each region’s local ANQ service instance to the ANQ instance in the other region, ensuring that user profile services will still be available in the event of a regional failover.
- [Azure Virtual Desktop](/azure/virtual-desktop/overview), deployed in two Azure regions, with a separate pool of users assigned to each region’s AVD resources as their primary site, and each region set up as the secondary site for the other region in the event of a regional service interruption.
- [Nerdio Manager](https://getnerdio.com/nerdio-manager-for-enterprise/) to simplify and streamline the process of managing AVD-related services: resource pools, connectivity, security, desktop images, applications, and service monitoring.
- [FSLogix Profile](/fslogix/overview-what-is-fslogix) [Containers](/fslogix/concepts-container-types#profile-container) to connect each AVD user to their assigned profile on the ANQ storage as part of the login process.
- [Microsoft Entra Domain Services](/azure/active-directory-domain-services/overview) (formerly Azure Active Directory) to provide user authentication and manage access to Azure-based resources.
- [Azure Virtual Networking](/azure/virtual-network/virtual-networks-overview)
- [VNet Injection](/azure/spring-apps/how-to-deploy-in-azure-virtual-network?tabs=azure-portal) to connect each region’s ANQ instance to the customer’s own Azure subscription resources.

## Considerations

Enterprises planning a highly-available Azure Virtual Desktop solution that uses Azure Native Qumulo deployment for desktop profile storage should factor the following considerations in their planning and design processes.
Potential use cases
This solution can be used by enterprises that are looking to satisfy any or all of the following applicable scenarios.

- Remote end users: As today’s enterprises make increased use of a globally distributed workforce, a multi-region AVD deployment can be leveraged to minimize latency when accessing enterprise resources from anywhere in the world.
- Workforce elasticity: In some cases, organizations may need to bring a large number of workers online quickly, e.g. for seasonal help, as part of a merger / acquisition process, or in response to external events that have shuttered physical facilities and sent users home. An AVD solution can deliver corporate desktop services quickly and reliably, and be made available even to end users whose client hardware is not up to corporate / enterprise standards.
- Desktop image management: The use of ephemeral desktops that are created right before a user connects, and then destroyed as the user logs off a few hours later, means that the process of updating operating system versions and images, can be rolled out across an entire enterprise within days by simply updating the relevant base image and redeploying to a new resource pool.
- Software management: AVD also simplifies the process of deploying new enterprise software applications, maintaining licensing compliance on existing software agreements, and preventing the installation of unauthorized software by rogue users.
- Security and compliance: In heavily-regulated environments, such as healthcare, government, education, or the financial sector, an AVD solution can be easily configured via policy to enhance compliance with relevant corporate standards, as well as any applicable legal and regulatory requirements. These policies and standards can be  more difficult to enforce on physical client hardware, e.g. preventing data theft via USB drive, or deactivating enterprise antivirus/monitoring tools.

### Scalability and Performance

A high-availability AVD solution designed to provide desktop services to a large number of geographically-dispersed users should factor the following considerations into the solution’s capacity and design:

- Capacity and growth: ANQ service instance can be easily scaled as needed in response to an increased user count or to a higher space allocation per user, enterprises can improve the overall TCO of the solution by not over-provisioning file capacity before it’s needed.
- Performance: The overall architecture of the solution anticipates the possibility of a failover event, in which users and desktops from both regions are suddenly dependent on a single region for both data and compute services. The solution should include a rapid-response plan for increasing available resources within the solution’s designated recovery-time objective (RTO) to ensure acceptable performance.
- Throughput: ANQ can scale throughput as needed to meet heavier short-term performance needs (e.g. burst processing, or a high number of concurrent user logins. The overall solution design should include the ability to add capacity and throughput in response to changing needs.
- Latency: When assigning users to one region or the other, the user’s location relative to one region’s access point vs. the others should be a key factor.

### Security

The high-availability AVD solution can be connected to enterprise resources on-prem or in other public clouds via either ExpressRoute or VPN, and to other Azure-based enterprise resources via Azure Virtual Network connectivity.

Depending on the specific configuration of your enterprise, authentication can be provided via Microsoft Entra ID or by your own Active Directory.

Since this solution provides user-facing services, antivirus, anti-malware, and other enterprise software monitoring tools should be incorporated into each virtual desktop to safeguard critical systems and data from malicious attacks.

### Cost optimization

Cost optimization refers to minimizing unnecessary expenses while maximizing the value of the actual costs incurred by the solution. For more information, visit the [Overview of the cost optimization pillar page](/azure/well-architected/cost/overview).

- Azure Native Qumulo is available in multiple tiers, giving you a choice of multiple capacity-to-throughput options to meet your specific workload needs.
- Different users within the solution may have different requirements for the overall availability and performance of their virtual machines. If so, consider a tiered approach that ensures all workers have what they need for optimal productivity.

### Availability

Different organizations can have different availability and recoverability requirements even for the same application. The term availability refers to the solution’s ability to continuously deliver the service at the level of performance for which it was built.

### Data and storage availability

The ANQ deployment includes built-in redundancy at the data level to ensure data availability against failure of the underlying hardware. To protect the data against accidental deletion, corruption, malware or other cyberattack, ANQ includes the ability to take snapshots at any level within the file system to create point-in-time, read-only copies of your data.

Replicated user profiles are read-only under normal circumstances. The solution’s RTO should include the time needed to fail over to the secondary ANQ instance (e.g. break the replication relationship and make all profiles writable) before connecting users from the remote region to AVD instances.

ANQ also supports any file-based backup solution to enable external data protection.
Resource Tier Availability
For specific information about the availability and recovery options for the AVD service layer, for Nerdio Enterprise Manager, and for FSLogix, please consult the relevant documentation for each.

## Deploy this scenario

- To deploy Azure Native Qumulo Scalable File Service, visit [our website](https://qumulo.com/product/azure/).
- For more information regarding the deployment of Azure Virtual Desktop, visit the [Azure Virtual Desktop](/azure/virtual-desktop/) documentation page.
- For more information regarding FSLogix, refer to the [FSLogix](/fslogix/) documentation page.
- To learn more about the use of Nerdio Manager for Enterprises or Managed Service Providers, visit the [Nerdio](https://getnerdio.com/) website.

## Next steps

- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)
