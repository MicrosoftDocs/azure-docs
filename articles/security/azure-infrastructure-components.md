---
title: Azure information system components and boundaries
description: The article provides a general description of Microsoft Azure by identifying the system's purpose, capabilities, users, information data flow, and network connections.
services: security
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: TomSh

ms.assetid: 61e95a87-39c5-48f5-aee6-6f90ddcd336e
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/25/2018
ms.author: terrylan

---

# Azure information system components and boundaries
This article provides a general description of Microsoft Azure by identifying the system's purpose, capabilities, users, information data flow, and network connections. The Azure system environment is made up of the following networks:

- Microsoft Azure production network (Azure network)
- Microsoft Corporate network (Corpnet network)

Separate IT teams are responsible for operations and maintenance of the Azure network and CorpNet networks.

## Azure architecture
Azure is a cloud computing platform and infrastructure created by Microsoft for building, deploying, and managing applications and services through a network of Microsoft managed datacenters. Based on the number of resources specified by customers, Azure creates VMs based on resource need. These VMs in turn run on a Hypervisor that is specifically designed for use in the cloud (the Microsoft Azure Hypervisor) and is not accessible to the public.

On each Azure physical server (node), there is a Hypervisor that runs directly over the hardware, and divides a node into a variable number of guest virtual machines (VMs). Each node also has one special “Root” VM, which runs the Host OS. Windows Firewall is enabled on each VM and the only ports open and addressable (internally or externally) are those explicitly defined in the Service Definition file configured by the customer. All traffic and access to disk and network is mediated by the Hypervisor and Root OS.

At the host layer, Azure VMs run a customized and hardened version of the latest Windows Server. Microsoft Azure uses a stripped-down version of Windows Server that includes only those components necessary to host VMs. This is done both to improve performance and to reduce attack surface. Machine boundaries are enforced by the Hypervisor which doesn’t depend on the operating system security.

**Azure Management by Fabric Controllers (FCs)**: In Azure, VMs running on physical servers (blades/nodes) are grouped into “clusters” of about 1000 . The VMs are independently managed by a scaled-out and redundant platform software component called the FC.

Each FC manages the lifecycle of applications running in its cluster, and provisions and monitors the health of the hardware under its control. It executes both autonomic operations, such as reincarnating VM instances on healthy servers when it determines that a server has failed. The FC also performs application-management operations such as deploying, updating and scaling out applications.

Dividing the datacenter into clusters isolates faults at the FC level and prevents certain classes of errors from affecting servers beyond the cluster in which they occur. FCs that serve a particular Azure cluster are grouped into an FC Cluster.

**Inventory of Hardware**: An inventory of Azure hardware and network devices is prepared during the bootstrap configuration process and documented in the datacenter.xml configuration file. Any new hardware and network components entering the Azure production environment must follow the bootstrap configuration process. The FC is responsible for managing the entire inventory listed in the datacenter.xml configuration file.

**FC Managed OS**: The OS team provides OS images in the form of Virtual Hard Disks (VHD) that are deployed on all Host and Guest VMs in the Azure production environment. The OS team constructs these “Base Images” through an automated offline build process. The Base Image is a version of the operating system in which the kernel and other core components have been modified and optimized to support the Azure environment.

There are three types of Fabric-managed OS images:

- Host OS – Host OS is a customized operating system that runs on Host VMs
- Native OS – Native OS that runs on tenants (for example, Azure Storage) that does not have any Hypervisor
- Guest OS – Guest OS that runs on Guest VMs

The Host and Native FC-managed operating systems are specifically designed for use in the cloud and are not publicly accessible.

**Host and Native OS**: Host OS and Native OS are hardened OS images that host the Fabric Agents (FA) and run on a compute node (runs as first VM on the node) and storage nodes. The benefits of using optimized Base Images of Host and Native OS is that it reduces the surface area exposed by APIs or unused components that present high security risks and increase the footprint of the OS. These reduced-footprint operating systems only include the components necessary to Azure. This improves performance and reduces the attack surface.

**Guest OS**: Azure internal components running on Guest OS VMs have no opportunity to run Remote Desktop Protocol (RDP) unlike external customers. Any changes to baseline configuration settings would be required to go through the change and release management process.

## Azure datacenters
The Microsoft Cloud Infrastructure and Operations (MCIO) team manages Microsoft’s physical infrastructure and datacenter facilities for all Microsoft online services. MCIO is primarily responsible for managing the physical and environmental controls within the datacenters  , as well as managing and supporting outer perimeter network devices (Edge Routers and Datacenter Routers). MCIO is also responsible for setting up the bare minimum server hardware on racks in the datacenter. Customers have no direct interaction with Azure.

## Service management & service teams
Support of the Azure service is managed by a number of engineering groups known as ‘Service Teams’. Each of the Service Teams is responsible for an area of support for Azure. Each Service Team must make an engineer available 24x7 to investigate and resolve failures in the service. Service Teams do not, by default, have physical access to the hardware operating in Azure.

Service teams are:

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
All Azure internal users have their employee status categorized with a sensitivity level that defines their access to customer data (access or no access). Employees (or contractors) of Microsoft are considered Internal Users. All other users are considered External Users. User privileges to Azure (authorization permission after authentication takes place) are described in the table that follows:

| Role | Internal or External | Sensitivity Level | Authorized Privileges and Functions Performed | Access Type
| --- | --- | --- | --- | --- |
| Azure Datacenter Engineer | Internal | No access to customer data | Manage the physical security of the premises; Conduct patrols in and out of the datacenter and monitor all entry points; Perform escort services into and out of the datacenter for certain non-cleared personnel who provide general services (dining, cleaning) or IT work within the datacenter; Conduct routne monitoring and maintenance of network hardware; Perform incident management and break-fix work using a variety of tools; Conduct routine monitoring and maintenance of the physical hardware in the datacenters; Access to environment on demand from property owners. Capable to perform forensic investigations, logging incident report, and require mandatory security training & policy requirements; Operational ownership and maintenance of critical security tools such as scanners and log collection. | Persistent access to the environment |
| Microsoft Azure Incident Triage (Rapid Response Engineers) | Internal | Access to customer data | Manage communications between Infrastructure Operations, Support and Azure Engineering teams; Triage platform incidents, deployment issues, and service requests. | Just in time access to the environment - with limited persistent access to non-customer systems |
| Microsoft Azure Deployment Engineers | Internal | Access to customer data | Perform deployment/upgrades of platform components, software and scheduled configuration changes in support of Microsoft Azure. | Just in time access to the environment - with limited persistent access to non-customer systems |
| Microsoft Azure Customer Outage Support (Tenant) | Internal | Access to customer data | Debug and diagnose platform outages and faults for individual compute tenants and Microsoft Azure accounts; Analyze faults and drive critical fixes to platform/customer, drive technical improvements across support. | Just in time access to the environment - with limited persistent access to non-customer systems |
| Microsoft Azure Live Site Engineers (Monitoring Engineers) & Incident | Internal | Access to customer data | Accountable for diagnosing and mitigating platform health by using diagnostic tools; Drive fixes for volume drivers, repair items resulting from outages and assist outage restoration actions. | Just in time access to the environment - with limited persistent access to non-customer systems |
|Microsoft Azure Customers | External | N/A | N/A | N/A |

Azure uses unique identifiers to authenticate organizational users and customers (or processes acting on behalf of organizational users) to all assets/devices that are part of the Azure environment.

**Microsoft Azure Internal Authentication**: Communications between Azure internal components are protected with TLS encryption. In most cases, the X.509 certificates are self-signed. Exceptions are made for certificates with connections that could be accessed from outside the Azure network, and for the FCs. FCs have certificates issued by a Microsoft Certificate of Authority (CA) that is backed by a trusted root CA. This allows FC public keys to be rolled over easily. Additionally, FC public keys are used by Microsoft developer tools so that when developers submit new application images, they are encrypted with a FC public key in order to protect any embedded secrets.

**Microsoft Azure Hardware Device Authentication**: The FC maintains a set of credentials (keys and/or passwords) used to authenticate itself to various hardware devices under its control. The system used for transporting, persisting, and use of these credentials is designed to prevent Azure developers, administrators, and backup services/personnel access to sensitive, confidential, or private information.

Encryption based on the FC’s master identity public key is used at FC setup and FC reconfiguration times to transfer the credentials used to access networking hardware devices. Credentials are retrieved and decrypted by the FC when it needs them.

**Network Devices**: Network service accounts are configured by the Azure Networking team to enable a Microsoft Azure client to authenticate to network devices (routers, switches, and load balancers).

## Secure service administration
Microsoft Azure operations personnel are required to use secure admin workstations (SAWs; customers may implement similar controls by using Privileged Access Workstations, or PAWs). The SAW approach is an extension of the well-established recommended practice to use separate admin and user accounts for administrative personnel. This practice uses an individually assigned administrative account that is completely separate from the user's standard user account. SAW builds on that account separation practice by providing a trustworthy workstation for those sensitive accounts.

## Next steps
