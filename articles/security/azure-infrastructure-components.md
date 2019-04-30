---
title: Azure information system components and boundaries
description: This article provides a general description of the Microsoft Azure architecture and management.
services: security
documentationcenter: na
author: TerryLanfear
manager: barbkess
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2018
ms.author: terrylan

---

# Azure information system components and boundaries
This article provides a general description of the Azure architecture and management. The Azure system environment is made up of the following networks:

- Microsoft Azure production network (Azure network)
- Microsoft corporate network (corpnet)

Separate IT teams are responsible for operations and maintenance of these networks.

## Azure architecture
Azure is a cloud computing platform and infrastructure for building, deploying, and managing applications and services through a network of datacenters. Microsoft manages these datacenters. Based on the number of resources you specify, Azure creates virtual machines (VMs) based on resource need. These VMs run on an Azure hypervisor, which is designed for use in the cloud and is not accessible to the public.

On each Azure physical server node, there is a hypervisor that runs directly over the hardware. The hypervisor divides a node into a variable number of guest VMs. Each node also has one root VM, which runs the host operating system. Windows Firewall is enabled on each VM. You define which ports are addressable by configuring the service definition file. These ports are the only ones open and addressable, internally or externally. All traffic and access to the disk and network is mediated by the hypervisor and root operating system.

At the host layer, Azure VMs run a customized and hardened version of the latest Windows Server. Azure uses a version of Windows Server that includes only those components necessary to host VMs. This improves performance and reduces attack surface. Machine boundaries are enforced by the hypervisor, which doesn’t depend on the operating system security.

### Azure management by fabric controllers

In Azure, VMs running on physical servers (blades/nodes) are grouped into clusters of about 1000. The VMs are independently managed by a scaled-out and redundant platform software component called the fabric controller (FC).

Each FC manages the lifecycle of applications running in its cluster, and provisions and monitors the health of the hardware under its control. It runs autonomic operations, such as reincarnating VM instances on healthy servers when it determines that a server has failed. The FC also performs application-management operations, such as deploying, updating, and scaling out applications.

The datacenter is divided into clusters. Clusters isolate faults at the FC level, and prevent certain classes of errors from affecting servers beyond the cluster in which they occur. FCs that serve a particular Azure cluster are grouped into an FC cluster.

### Hardware inventory

The FC prepares an inventory of Azure hardware and network devices during the bootstrap configuration process. Any new hardware and network components entering the Azure production environment must follow the bootstrap configuration process. The FC is responsible for managing the entire inventory listed in the datacenter.xml configuration file.

### FC-managed operating system images

The operating system team provides images, in the form of Virtual Hard Disks, deployed on all host and guest VMs in the Azure production environment. The team constructs these base images through an automated offline build process. The base image is a version of the operating system in which the kernel and other core components have been modified and optimized to support the Azure environment.

There are three types of fabric-managed operating system images:

- Host: A customized operating system that runs on host VMs.
- Native: A native operating system that runs on tenants (for example, Azure Storage). This operating system does not have any hypervisor.
- Guest: A guest operating system that runs on guest VMs.

The host and native FC-managed operating systems are designed for use in the cloud, and are not publicly accessible.

#### Host and native operating systems

Host and native are hardened operating system images that host the fabric agents, and run on a compute node (runs as first VM on the node) and storage nodes. The benefit of using optimized base images of host and native is that it reduces the surface area exposed by APIs or unused components. These can present high security risks and increase the footprint of the operating system. Reduced-footprint operating systems only include the components necessary to Azure.

#### Guest operating system

Azure internal components running on guest operating system VMs have no opportunity to run Remote Desktop Protocol. Any changes to baseline configuration settings must go through the change and release management process.

## Azure datacenters
The Microsoft Cloud Infrastructure and Operations (MCIO) team manages the physical infrastructure and datacenter facilities for all Microsoft online services. MCIO is primarily responsible for managing the physical and environmental controls within the datacenters, as well as managing and supporting outer perimeter network devices (such as edge routers and datacenter routers). MCIO is also responsible for setting up the bare minimum server hardware on racks in the datacenter. Customers have no direct interaction with Azure.

## Service management and service teams
Various engineering groups, known as service teams, manage the support of the Azure service. Each service team is responsible for an area of support for Azure. Each service team must make an engineer available 24x7 to investigate and resolve failures in the service. Service teams do not, by default, have physical access to the hardware operating in Azure.

The service teams are:

- Application Platform
- Azure Active Directory
- Azure Compute
- Azure Net
- Cloud Engineering Services
- ISSD: Security
- Multifactor Authentication
- SQL Database
- Storage

## Types of users
Employees (or contractors) of Microsoft are considered to be internal users. All other users are considered to be external users. All Azure internal users have their employee status categorized with a sensitivity level that defines their access to customer data (access or no access). User privileges to Azure (authorization permission after authentication takes place) are described in the following table:

| Role | Internal or external | Sensitivity level | Authorized privileges and functions performed | Access type
| --- | --- | --- | --- | --- |
| Azure datacenter engineer | Internal | No access to customer data | Manage the physical security of the premises. Conduct patrols in and out of the datacenter, and monitor all entry points. Escort into and out of the datacenter certain non-cleared personnel who provide general services (such as dining or cleaning) or IT work within the datacenter. Conduct routine monitoring and maintenance of network hardware. Perform incident management and break-fix work by using a variety of tools. Conduct routine monitoring and maintenance of the physical hardware in the datacenters. Access to environment on demand from property owners. Capable to perform forensic investigations, log incident reports, and require mandatory security training and policy requirements. Operational ownership and maintenance of critical security tools, such as scanners and log collection. | Persistent access to the environment. |
| Azure incident triage (rapid response engineers) | Internal | Access to customer data | Manage communications among MCIO, support, and engineering teams. Triage platform incidents, deployment issues, and service requests. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure deployment engineers | Internal | Access to customer data | Deploy and upgrade platform components, software, and scheduled configuration changes in support of Azure. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure customer outage support (tenant) | Internal | Access to customer data | Debug and diagnose platform outages and faults for individual compute tenants and Azure accounts. Analyze faults. Drive critical fixes to the platform or customer, and drive technical improvements across support. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure live site engineers (monitoring engineers) and incident | Internal | Access to customer data | Diagnose and mitigate platform health by using diagnostic tools. Drive fixes for volume drivers, repair items resulting from outages, and assist outage restoration actions. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
|Azure customers | External | N/A | N/A | N/A |

Azure uses unique identifiers to authenticate organizational users and customers (or processes acting on behalf of organizational users). This applies to all assets and devices that are part of the Azure environment.

### Azure internal authentication

Communications between Azure internal components are protected with TLS encryption. In most cases, the X.509 certificates are self-signed. Certificates with connections that can be accessed from outside the Azure network are an exception, as are certificates for the FCs. FCs have certificates issued by a Microsoft Certificate of Authority (CA) that is backed by a trusted root CA. This allows FC public keys to be rolled over easily. Additionally, Microsoft developer tools use FC public keys. When developers submit new application images, the images are encrypted with an FC public key in order to protect any embedded secrets.

### Azure hardware device authentication

The FC maintains a set of credentials (keys and/or passwords) used to authenticate itself to various hardware devices under its control. Microsoft uses a system to prevent access to these credentials. Specifically, the transport, persistence, and use of these credentials is designed to prevent Azure developers, administrators, and backup services and personnel access to sensitive, confidential, or private information.

Microsoft uses encryption based on the FC’s master identity public key. This occurs at FC setup and FC reconfiguration times, to transfer the credentials used to access networking hardware devices. When the FC needs the credentials, the FC retrieves and decrypts them.

### Network devices

The Azure networking team configures network service accounts to enable an Azure client to authenticate to network devices (routers, switches, and load balancers).

## Secure service administration
Azure operations personnel are required to use secure admin workstations (SAWs). Customers can implement similar controls by using privileged access workstations. With SAWs, administrative personnel use an individually assigned administrative account that is separate from the user's standard user account. The SAW builds on that account separation practice by providing a trustworthy workstation for those sensitive accounts.

## Next steps
To learn more about what Microsoft does to help secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](azure-physical-security.md)
- [Azure infrastructure availability](azure-infrastructure-availability.md)
- [Azure network architecture](azure-infrastructure-network.md)
- [Azure production network](azure-production-network.md)
- [Azure SQL Database security features](azure-infrastructure-sql.md)
- [Azure production operations and management](azure-infrastructure-operations.md)
- [Azure infrastructure monitoring](azure-infrastructure-monitoring.md)
- [Azure infrastructure integrity](azure-infrastructure-integrity.md)
- [Azure customer data protection](azure-protection-of-customer-data.md)
