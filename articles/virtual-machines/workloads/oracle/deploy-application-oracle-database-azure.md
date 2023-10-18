---
title: Architectures for Oracle applications with database on Azure Virtual Machines 
description: Learn about architectures for Oracle applications with database on Azure Virtual Machines. 
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: oracle
ms.topic: article
ms.date: 08/23/2023
---

# Architectures for Oracle applications with database on Azure Virtual Machines

This article provides reference architecture to deploy Oracle application on Azure IaaS where the Oracle database also resides or is colocated. 

Oracle workloads comprise not only Oracle databases, but also of Oracle first-party applications such as Siebel, PeopleSoft, JD Edwards, E-Business Suite, or customized WebLogic server applications. Deploying Oracle applications on Azure Infrastructure as a Service (IaaS) is a common scenario for organizations looking to use the cloud for their Oracle workloads along with [Oracle database](oracle-reference-architecture.md). Microsoft offers reference architectures and best practices to ease this process. 

## General application migration guidelines

As Oracle applications move on Azure IaaS, there are common design considerations, which must be followed irrespective of type of applications. Some considerations are specific to applications. In this section, we're listing common design considerations of all applications, and any application specific considerations are covered under each application.

### Network and security 

The provided network settings for Oracle Applications on Azure cover various aspects of network and security considerations. Here's a breakdown of the recommended network settings:

- Single sign-on (SSO) with Azure AD and SAML: Use [Azure AD for single sign-on (SSO)](https://learn.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on) using the Security Assertions Markup Language (SAML) protocol. This SSO allows users to authenticate once and access multiple services seamlessly.
- Azure AD Application Proxy: Consider using [Azure AD Application Proxy](https://learn.microsoft.com/azure/active-directory/app-proxy/application-proxy), especially for remote users. This proxy allows you to securely access on-premises applications from outside your network.
- Routing Internal Users through [ExpressRoute](https://learn.microsoft.com/azure/expressroute/expressroute-introduction): For internal users, route traffic through Azure ExpressRoute for a dedicated, private connection to Azure services, ensuring low-latency and secure communication.
- Azure Firewall: If necessary, you can configure [Azure Firewall](https://learn.microsoft.com/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall) in front of your application for added security. Azure Firewall helps protect your resources from unauthorized access and threats.
- Application Gateway for External Users: When external users need to access your application, consider using [Azure Application Gateway](https://learn.microsoft.com/azure/application-gateway/overview). It supplies Web Application Firewall (WAF) capabilities for protecting your web applications and Layer 7 load balancing to distribute traffic.
- Network Security Groups (NSG): Secure your subnets by using [Network Security Groups](https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview) (NSG). NSGs allow you to control inbound and outbound traffic to network interfaces, Virtual Machines, and subnets by defining security rules.
- Role-Based Access Control (RBAC): To grant access to specific individuals or roles, use Azure Role-Based Access Control (RBAC). [RBAC](https://learn.microsoft.com/azure/role-based-access-control/overview) provides fine-grained access control to Azure resources based on roles and permissions.
- Bastion Host for SSH Access: Use a [Bastion host](https://learn.microsoft.com/azure/bastion/bastion-overview) as a jump box to enhance security for SSH access. A Bastion host acts as a secure gateway for administrators to access Virtual Machines in the virtual network. This host provides an added layer of security.
- More considerations:
  - Data Encryption: Ensure that data at rest and in transit is encrypted. Azure provides tools like Azure Disk Encryption and SSL/TLS for this purpose.
  - Patch Management: Regularly update and patch your EBS environment to protect against known vulnerabilities.
  - Monitoring and Logging: Implement [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/overview) and [Azure Defender](https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction) for security to continuously check your environment for security threats and anomalies. Set up logging for auditing and forensic analysis.

  
- In summary, these network and security settings aim to provide a robust and secure environment for hosting Oracle applications on Azure IaaS. They incorporate best practices for authentication, access control, and network security, both for internal and external users. They also consider the need for SSH access to Application servers. These recommendations can help you set up a mature security posture for your Oracle applications deployment on Azure IaaS.

**Web Tier**: The web tier load balances the requests and sends the requests accordingly to the application tier, database tier and/or backup.

**Application tier:** The application tier typically involves application servers and shared file systems. 

For autoscaling, [Virtual Machine Scale Sets](https://learn.microsoft.com/azure/virtual-machine-scale-sets/overview) can be a great choice for scale-out multiple Virtual Machines based on demand with custom scaling rules to adapt to your workload. 

Collaborate with Azure Subject Matter Experts (SMEs) to perform a thorough assessment of your architecture. They can help you determine the most suitable Azure services based on your specific requirements, including performance, availability, and scalability. Remember to consider factors like cost, data security, compliance, and disaster recovery when designing your architecture.

 It's also essential to check and optimize your Azure resources continuously to ensure efficiency and cost-effectiveness.

Load Balancing and Throughput: It's important to evaluate the workload characteristics of application servers. Some servers handle more tasks and create higher throughput than others. This information is crucial when designing your Azure Virtual machine Scale Sets and load balancing configuration to ensure that resources are allocated effectively

Database Tier: HA architectures are recommended with Oracle Data Guard for Oracle on Azure IaaS. Applications require specific type of HA setup and are listed under each application.

Backup - [Backups](https://learn.microsoft.com/azure/backup/backup-azure-vms-introduction) are sent from the application tier and the database tier. It's just one of many reasons why those two tiers shouldn't be separated into two different vendors.  Backups of the database are performed by [Azure Backup Volume Snapshot](https://techcommunity.microsoft.com/t5/data-architecture-blog/azure-backup-volume-snapshots-for-oracle-is-now-ga/ba-p/2820032) on Premium Files to the secondary region.

Disaster Recovery - There are different solutions you can choose from. It very much depends on your requirements. The architecture is built to be highly available. For replicating the application tier, you can use [Azure Site Recovery](https://learn.microsoft.com/azure/site-recovery/site-recovery-overview). Another solution you can choose is [Redundancy options for managed disks.](https://learn.microsoft.com/azure/virtual-machines/disks-redundancy) Both solutions replicate your data. Redundancy options for managed disks are a solution that can simplify the architecture but also comes with a few limitations.

## Siebel on Azure

Oracle Siebel CRM continues to be a preferred enterprise grade CRM solution by many enterprises. It's one of the most complex applications in Oracle's portfolio delivering a combination of transactional, analytical, and engagements features to manage customer facing operations.

Here's the recommended architecture of a Siebel application deployment on Azure Virtual Machines for Innovation Pack 16 and earlier:

:::image type="content" source="media/oracle-database-architecture/on-premises-network-external-users.png" alt-text="Diagram showing the recommended architecture of a Siebel application deployment on Azure Virtual Machines for Innovation Pack 16 and earlier." lightbox="media/oracle-database-architecture/on-premises-network-external-users.png":::


 The following diagram is architecture of a Siebel application deployment on Azure Virtual Machines for Innovation Pack 17 and earlier:


:::image type="content" source="media/oracle-database-architecture/on-premises-network-internal-users.png" alt-text="Diagram showing the recommended architecture of a Siebel application deployment on Azure Virtual Machines for Innovation Pack 17 and earlier." lightbox="media/oracle-database-architecture/on-premises-network-internal-users.png":::


### Oracle Siebel design considerations

- Network & Security:  The network settings for Oracle Siebel on Azure required to follow the general network & security considerations, additionally. 

- Migration must be done using Siebel Tool subnet.

**Application Tier** 

- Version 17 or higher – configurations of certain server and utilities on the application and database is required.

**Database Tier**

- Ensure Database and Siebel version match.
- Primary and replicated to a secondary using Data Guard based recommended [Oracle reference architecture](oracle-reference-architecture.md).

## E-Business suite on Azure

Oracle E-Business Suite (EBS) is a suite of applications including Supply Chain Management (SCM) and Customer Relationship Management (CRM). As EBS is an SCM and CRM system, it usually has many interfaces to third-party systems. The below architecture is built to be highly available within one region.

We assume that external users don't cross the corporate network in the following diagram.

:::image type="content" source="media/oracle-database-architecture/on-premises-network-and-external-users.png" alt-text="Diagram showing on-premises network where external users don't cross the corporate network." lightbox="media/oracle-database-architecture/on-premises-network-and-external-users.png":::

### Oracle EBS design considerations 

Database Tier - Primary & secondary database should be within one datacenter, the synchronous configuration should be used. If you install your application across datacenters, you should configure Data Guard in Asynchronous mode.

## JD Edwards on Azure

Oracle's JD Edwards is an integrated applications suite of comprehensive enterprise resource planning software. We have seen JDE used in Supply chain, Warehouse Management, Logistics, Manufacturing resource planning and more. Because of the use of the application, we see that interfaces to other systems are important as well.

The following architecture is built to being highly available. We assumed that external users aren't accessing over the corporate network. If an external user accesses the application using corporate network, the architecture can be simplified on networking as follows.
:::image type="content" source="media/oracle-database-architecture/on-premises-network-and-internal-users.png" alt-text="Diagram showing on-premises network and external users." lightbox="media/oracle-database-architecture/on-premises-network-and-internal-users.png":::

### JD Edwards design considerations

Web Tier: The application web tier typically consists of multiple application servers. In JD Edwards, rules are often saved on these application web servers.

- Presentation Tier: Each instance in the presentation tier is associated with storage. Cutting dependencies between instances can lead to high latencies, so it's crucial to assess them carefully.

- Server Performance Variation: Some servers can handle more tasks and create higher throughput than others. During the design phase, it's essential to evaluate this throughput variation to ensure that your infrastructure can handle peak workloads efficiently.
- Rearchitecture: Using Azure Virtual machine Scale Sets for autoscaling doesn't require a rearchitecture of your JD Edwards setup. It's a scalable solution that can be implemented without significant changes to your application's architecture.

Database Tier - Primary and secondary stay within one datacenter, the synchronous configuration should be used. If you install your application across datacenters, you should configure Data Guard in Asynchronous mode. Data from the database tier are sent directly to an Azure Storage. The Storage is dependent on your current architecture setup.

## PeopleSoft on Azure

Oracle's PeopleSoft application suite contains software for human resources and financial management. The application suite is multi-tiered, and the applications include human resource management systems (HRMS), customer relationship management (CRM), financials and supply chain management (FSCM), and enterprise performance management (EPM).

:::image type="content" source="media/oracle-database-architecture/on-premises-network-and-internal-users-express-route.png" alt-text="Diagram showing on-premises network and internal users with expressroute." lightbox="media/oracle-database-architecture/on-premises-network-and-internal-users-express-route.png":::

### PeopleSoft design considerations

Application Tier: The application tier contains several tasks and servers. It runs the business logic and processes but also maintains the connection to the database. As soon as this dependency is cut, it causes latencies.

- Dependency between Application and Database Tiers: It's important to minimize latency between the application and database tiers. By placing the application and database-tier in the same cloud provider (Azure, in this case), you reduce network latency. Azure provides various networking options and services like Virtual Network (VNet) peering or ExpressRoute to ensure low-latency connections between tiers.

- Operating System Considerations: If the Process Scheduler specifically requires Windows operating systems, you can still run it on Azure Virtual Machines. Azure supports various Windows Server versions, allowing you to choose the one that meets your application's requirements.

- Architecture Evaluation: Carefully evaluate your architecture requirements, including scalability, availability, and performance. Consider setting up multiple application server instances in a load-balanced configuration to ensure high availability and scalability.

Database Tier - The primary and replicated to a secondary should stay within one datacenter, the synchronous configuration should be used. If you install your application across datacenters, you should configure Data Guard in Asynchronous mode.

**Next steps**
 
[Reference architectures for Oracle Database](oracle-reference-architecture.md)  

[Migrate Oracle workload to Azure Virtual Machines](oracle-migration.md)

