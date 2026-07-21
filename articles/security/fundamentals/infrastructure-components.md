---
title: Azure information system components and boundaries
description: Learn about Microsoft Azure architecture, system components, boundaries, management, internal authentication, and secure service administration.
services: security
author: msmbaldwin

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted

---

# Azure information system components and boundaries

This article provides a general description of the Azure architecture and management. The Azure system environment is made up of the following networks:

- Microsoft Azure production network (Azure network)
- Microsoft corporate network (corpnet)

Separate IT teams operate and maintain these networks.

## Azure architecture

Azure is a cloud computing platform and infrastructure for building, deploying, and managing applications and services through a network of datacenters. Microsoft manages these datacenters. Based on the number of resources you specify, Azure creates virtual machines (VMs) based on resource needs. These VMs run on an Azure hypervisor that Microsoft designs for use in the cloud and doesn't make accessible to the public.

On each Azure physical server node, there's a hypervisor that runs directly over the hardware. The hypervisor divides a node into a variable number of guest VMs. Each node also has one root VM, which runs the host operating system. Azure enables Windows Firewall on each VM. You define which ports are addressable by configuring the service definition file. These ports are the only ones open and addressable, internally or externally. The hypervisor and root operating system mediate all traffic and access to the disk and network.

At the host layer, Azure VMs run a customized and hardened version of the latest Windows Server. Azure uses a version of Windows Server that includes only those components necessary to host VMs. This configuration improves performance and reduces attack surface. The hypervisor enforces machine boundaries and doesn't depend on the operating system security.

### Azure management by fabric controllers

Azure groups VMs running on physical servers (blades/nodes) into clusters of about 1,000. A scaled-out and redundant platform software component called the fabric controller (FC) independently manages the VMs.

Each FC manages the lifecycle of applications running in its cluster, and provisions and monitors the health of the hardware under its control. It runs autonomic operations, such as reincarnating VM instances on healthy servers when it determines that a server fails. The FC also performs application-management operations, such as deploying, updating, and scaling out applications.

Azure divides the datacenter into clusters. Clusters isolate faults at the FC level, and prevent certain classes of errors from affecting servers beyond the cluster in which they occur. Azure groups FCs that serve a particular Azure cluster into an FC cluster.

### Hardware inventory

The FC prepares an inventory of Azure hardware and network devices during the bootstrap configuration process. Any new hardware and network components entering the Azure production environment must follow the bootstrap configuration process. The FC manages the entire inventory listed in the datacenter.xml configuration file.

### FC-managed operating system images

The operating system team provides virtual hard disk images for all host and guest VMs in the Azure production environment. The team constructs these base images through an automated offline build process. The base image is a version of the operating system in which Microsoft modifies and optimizes the kernel and other core components to support the Azure environment.

Three types of fabric-managed operating system images exist:

- Host: A customized operating system that runs on host VMs.
- Native: A native operating system that runs on tenants (for example, Azure Storage). This operating system doesn't have any hypervisor.
- Guest: A guest operating system that runs on guest VMs.

Microsoft designs the host and native FC-managed operating systems for use in the cloud and doesn't make them publicly accessible.

#### Host and native operating systems

The host and native operating systems are hardened operating system images that host the fabric agents and run on compute and storage nodes. Optimized base images of host and native operating systems reduce the surface area exposed by APIs or unused components. These APIs and components can present high security risks and increase the footprint of the operating system. Reduced-footprint operating systems include only the components necessary for Azure.

#### Guest operating system

Azure internal components that run on guest operating system VMs can't use Remote Desktop Protocol. Any changes to baseline configuration settings must go through the change and release management process.

## Azure datacenters

The Microsoft Cloud Infrastructure and Operations (MCIO) team manages the physical infrastructure and datacenter facilities for all Microsoft online services. MCIO is primarily responsible for managing the physical and environmental controls within the datacenters, as well as managing and supporting outer perimeter network devices (such as edge routers and datacenter routers). MCIO is also responsible for setting up the minimum server hardware on racks in the datacenter. Azure customers have no direct interaction with Azure infrastructure.

## Service management and service teams

Various engineering groups, known as service teams, manage the support of the Azure service. Each service team is responsible for an area of support for Azure. Each service team must make an engineer available 24/7 to investigate and resolve failures in the service. Service teams don't, by default, have physical access to the hardware operating in Azure.

The service teams are:

- Application Platform
- Microsoft Entra ID
- Azure Compute
- Azure Net
- Cloud Engineering Services
- ISSD: Security
- Multifactor Authentication
- SQL Database
- Storage

## Types of users

Microsoft employees and contractors are internal users. All other users are external users. All Azure internal users have their employee status categorized with a sensitivity level that defines their access to customer data (access or no access). User privileges to Azure (authorization permission after authentication takes place) are described in the following table:

| Role | Internal or external | Sensitivity level | Authorized privileges and functions performed | Access type |
| --- | --- | --- | --- | --- |
| Azure datacenter engineer | Internal | No access to customer data | Manage the physical security of the premises. Conduct patrols in and out of the datacenter, and monitor all entry points. Escort certain noncleared personnel who provide general services (such as dining or cleaning) or IT work into and out of the datacenter. Conduct routine monitoring and maintenance of network hardware. Perform incident management and break-fix work by using various tools. Conduct routine monitoring and maintenance of the physical hardware in the datacenters. Access the environment on demand from property owners. Perform forensic investigations, log incident reports, and complete mandatory security training and policy requirements. Own and maintain critical security tools, such as scanners and log collection. | Persistent access to the environment. |
| Azure incident triage (rapid response engineers) | Internal | Access to customer data | Manage communications among MCIO, support, and engineering teams. Triage platform incidents, deployment problems, and service requests. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure deployment engineers | Internal | Access to customer data | Deploy and upgrade platform components, software, and scheduled configuration changes in support of Azure. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure customer outage support (tenant) | Internal | Access to customer data | Debug and diagnose platform outages and faults for individual compute tenants and Azure accounts. Analyze faults. Drive critical fixes to the platform or customer, and drive technical improvements across support. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure live site engineers (monitoring engineers) and incident | Internal | Access to customer data | Diagnose and mitigate platform health by using diagnostic tools. Drive fixes for volume drivers, repair items resulting from outages, and assist with outage restoration actions. | Just-in-time access to the environment, with limited persistent access to non-customer systems. |
| Azure customers | External | N/A | N/A | N/A |

Azure uses unique identifiers to authenticate organizational users and customers (or processes acting on behalf of organizational users). This approach applies to all assets and devices that are part of the Azure environment.

### Azure internal authentication

TLS encryption protects communications between Azure internal components. In most cases, the X.509 certificates are self-signed. Certificates with connections that are accessible from outside the Azure network are an exception, as are certificates for the FCs. A Microsoft certificate authority (CA) backed by a trusted root CA issues certificates for FCs. This configuration allows FC public keys to be rolled over. Microsoft developer tools also use FC public keys. When developers submit new application images, Microsoft encrypts the images with an FC public key to protect any embedded secrets.

### Azure hardware device authentication

The FC maintains a set of credentials (keys or passwords) used to authenticate itself to various hardware devices under its control. Microsoft uses a system to prevent access to these credentials. Specifically, Microsoft designs the transport, persistence, and use of these credentials to prevent Azure developers, administrators, backup services, and personnel from accessing sensitive, confidential, or private information.

Microsoft uses encryption based on the FC's master identity public key. This encryption occurs at FC setup and FC reconfiguration times to transfer the credentials used to access networking hardware devices. When the FC needs the credentials, the FC retrieves and decrypts them.

### Network devices

The Azure networking team configures network service accounts to allow an Azure client to authenticate to network devices (routers, switches, and load balancers).

## Secure service administration

Azure operations personnel must use secure admin workstations (SAWs). Use privileged access workstations to implement similar controls. By using SAWs, administrative personnel use an individually assigned administrative account separate from the user's standard user account. The SAW builds on that account separation practice by providing a trustworthy workstation for those sensitive accounts.

## Next steps

To learn more about what Microsoft does to help secure the Azure infrastructure, see:

- [Azure facilities, premises, and physical security](physical-security.md)
- [Azure infrastructure availability](infrastructure-availability.md)
- [Azure network architecture](infrastructure-network.md)
- [Azure production network](production-network.md)
- [Azure SQL Database security features](infrastructure-sql.md)
- [Azure production operations and management](infrastructure-operations.md)
- [Azure infrastructure monitoring](infrastructure-monitoring.md)
- [Azure infrastructure integrity](infrastructure-integrity.md)
- [Azure customer data protection](protection-customer-data.md)
