---
title: Extending Active Directory Domain Services (AD DS) to Azure | Microsoft Docs
description: How to implement a secure hybrid network architecture with Active Directory authorization in Azure.
services: guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: azure-resource-manager

ms.assetid: 4821d1de-1473-4748-a599-ada73323fdb2
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/27/2016
ms.author: telmos

---
# Extending Active Directory Domain Services (AD DS) to Azure
[!INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for extending your Active Directory (AD) environment to Azure to provide distributed authentication services using [Active Directory Domain Services (AD DS)][active-directory-domain-services]. This architecture extends that described in the articles [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

> [!NOTE]
> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

AD DS is used to authenticate user, computer, application, or other identities that are included in a security domain. AD DS can be hosted on-premises, but if your application is a hybrid in which some parts are implemented in Azure it may be more efficient to replicate this functionality and the AD repository in the cloud. This can reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

There are two ways to host your directory services in Azure:

1. You can use [Azure Active Directory (AAD)][azure-active-directory] to create a new AD domain in the cloud and link it to an on-premises AD domain. Then setup [Azure AD Connect][azure-ad-connect] on-premises to replicate the on-premises repository to Azure.
   
   > [!NOTE]
   > Note that the directory in the cloud is a copy and not an extension of the on-premises system. Changes made to identities on-premises are copied to the cloud, but changes made in the cloud are not replicated back to the on-premises domain. For example, password resets must be performed on-premises and be copied to the cloud using Azure AD Connect. Also, note that the same instance of AAD can be linked to more than one instance of AD DS; AAD will contain the identities of each AD repository to which it is linked.
   > 
   > 
   
    AAD is useful for situations in which the on-premises network and Azure virtual network hosting the cloud resources are not directly linked by a VPN tunnel or ExpressRoute circuit. Although this solution is simple, it might not be suitable for systems where components could migrate across the on-premises/cloud boundary as this could require reconfiguration of AAD. Also, AAD only handles user authentication rather than computer authentication. Some applications and services, such as SQL Server, may require computer authentication in which case this solution is not appropriate.
2. An existing on-premises AD infrastructure can by extended by deploying a VM running AD DS as a domain controller in Azure. This architecture is commonly used in scenarios in which the on-premises network and Azure virtual network are connected by a VPN and/or ExpressRoute connection. This architecture also supports bi-directional replication and changes can be made either on-premises or in the cloud and both sources will be kept consistent. Depending on your security requirements, the AD installation in the cloud can be part of the same domain as that held on-premises, a new domain within a shared forest, or a separate forest.

This architecture focuses on extending an on-premises infrastructure by deploying an AD DS domain controller to Azure, with both using the same domain. Typical use cases for this architecture include hybrid applications in which functionality is distributed between on-premises and Azure, and applications and services that perform authentication using Active Directory.

## Architecture diagram
The following diagram highlights the important components in this architecture. 

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Identity - ADDS (same domain)" page.
> 
> 

[![0]][0]

* **On-premises network.** The on-premises network includes local AD servers that can perform authentication and authorization for components located on-premises.
* **AD Servers.** These are domain controllers implementing directory services (AD DS)running as VMs in the cloud. These servers can provide authentication of components running in your Azure virtual network.
* **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.
* **Azure Gateway and AD synchronization.**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. All synchronization requests between the AD servers in the cloud and on-premises pass through the gateway. User-defined routes (UDRs) handle routing for synchronization traffic which passes directly to the AD server in the cloud and does not pass through the existing network virtual appliances (NVAs) used in this scenario.

For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture]. For more information about the non-AD DS parts of the architecture, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

## Recommendations
This section summarizes recommendations for implementing AD DS in Azure, covering:

* VM recommendations.
* Networking recommendations.
* Active Directory Site recommendations.
* Active Directory Operations Masters recommendations.
* Monitoring recommendations.

> [!NOTE]
> The document [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains more detailed information on many of these points.
> 
> 

### VM recommendations
Determine your [VM size][vm-windows-sizes] requirements based on the expected volume of authentication requests. You can use the specifications of the machines hosting AD DS on premises as a starting point and match them with the Azure VM sizes. Once deployed, monitor the resource utilization and scale up or down based on the actual resource utilization on the VMs. For more information about sizing AD DS domain controllers, see [Capacity Planning for Active Directory Domain Services][capacity-planning-for-adds].

Create a separate virtual data disk for storing the database, logs, and SYSVOL for AD. Do not store these items on the same disk as the operating system. Note that by default, data disks that are attached to a VM use write-through caching. However, this form of caching can conflict with the requirements of AD DS. For this reason, set the *Host Cache Preference* setting on the data disk to *None*. For more information, see [Placement of the Windows Server AD DS database and SYSVOL][adds-data-disks].

Deploy at least two VMs running AD DS as domain controllers and add them to an [availability set][availability-set].

### Networking recommendations
Configure the VM NIC for each AD DS server with a static private IP address for full DNS support. For more information, see [How to set a static private IP address in the Azure portal][set-a-static-ip-address].

> [!NOTE]
> Do not configure the VM NIC for any AD DS with a public IP address. See [Security considerations][security-considerations] for more details.
> 
> 

The AD subnet NSG requires rules to permit incoming traffic from on-premises, and for detailed information on the ports used by AD DS see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports]. Also, ensure the UDR tables do not route AD DS traffic through the NVAs used in this architecture. 

### Active Directory Site recommendations
In AD DS, a site represents a physical location, network, or collection of devices. AD DS sites are used to manage AD DS database replication by grouping together AD DS objects that are located close to one another and are connected by a high speed network. AD DS includes logic to select the best strategy for replacating the AD DS database between sites.

We recommend that you create an AD DS site including the subnets defined for your application in Azure. Then, configure a site link between your on-premises AD DS sites, and AD DS will automatically perform the most efficent database replication possible. Note that this database replication requires little beyond the initial configuration.

### Active Directory Operations Masters recommendations
The Operations Masters role can be assigned to AD DS domain controllers to support consistency checking between instances of replicated AD DS databases. There are five Operations Master roles: schema master, domain naming master, relative identifier master, primary domain controller master emulator, and infrastructure master. Detailed information about these roles is available in the [Operations Masters documentation][ad-ds-operations-masters].

We recommend you do not assign Operations Masters roles to the domain controllers deployed in Azure.

### Monitoring recommendations
Monitor the resources of the domain controller VMs as well as the AD DS Services and create a plan to quickly correct any problems. For more information, see [Monitoring Active Directory][monitoring_ad]. You can also install tools such as [Microsoft Systems Center][microsoft_systems_center] on the monitoring server (see the [architecture diagram](#Architecture-diagram)) to help perform these tasks.  

## Scalability considerations
AD DS is designed for scalability and does not require a specific architecture. You do not need to configure traditional scalability resources such as a load balancer or traffic controller to direct requests to AD DS domain controllers. The only scalability consideration is to ensure you configured your AD DS VMs with the correct size for your network load requirements, monitor the load on the VMs, and scale up or down as necessary.

## Availability considerations
As mentioned earlier, deploy your AD DS VMS into an [availability set][availability-set]. 
Also, consider designating one or more server as a [standby operations master][standby-operations-masters]. A standby operations master is an active copy of the operations master that can be used in place of the primary Operations Masters server during fail over.

## Manageability considerations
Do not substitute a simple remote copy operation on the domain controller VM VHD files for performing a regular AD DS backup. The AD DS database file on the VHD may or may not be in a consistent state when it's copied and restarting the database might not be possible.

Do not shut down a domain controller VM using Azure Portal. Instead, shut down and restart from the guest operating system. An Azure Portal shut down causes the VM causes to be deallocated, which resets both the `VM-GenerationID` and the `invocationID` of the AD repository. The discards the AD DS RID pool and marks SYSVOL as non-authoritative and may require reconfiguration of the domain controller.

## Security considerations
AD DS servers provide authentication services and are an attractive target for attacks. To secure them, prevent direct internet connectivity by placing the AD DS servers in a separate subnet with an NSG acting as a firewall. Close all ports on the AD DS servers except those necessary for authentication, authorization, and server synchronization. For more information, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports].

Consider implementing an additional security perimeter around servers with a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

Use either BitLocker or Azure disk encryption to encrypt the disk hosting the AD DS database.

## Deployment
The sample solution has the following prerequsites:

* You have already configured your on-premises domain, and that you have configured DNS, and installed Routing and Remote Access services to support a VPN connect to the Azure VPN gateway.
* You have installed and configured the latest version of the [Azure Powershell](../powershell-install-configure.md). 
* Download the reference architecture deployment files from [Github](https://github.com/mspnp/reference-architectures/tree/master/guidance-ra-identity-adds).

> [!NOTE]
> If you don't have access to an existing on-premises domain, you can create a test environment using the [Deploy-ReferenceArchitecture.ps1](https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-ra-identity-adds/Deploy-ReferenceArchitecture.ps1) Powershell script. This script creates a network and VM in the cloud that simulates a very basic on-premises setup. To install, execute the following Powershell command in the root folder of the reference architecture deployment files:
> 
> 

    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscriptionID> <region> Onpremise
    ```

To deploy, you must run the powershell script several times using different parameters. First, execute the Powershell script with the following parameters:

```powershell
 .\Deploy-ReferenceArchitecture.ps1 <subscriptionID> <region> Infrastructure
```

Wait for the deployment to complete. Then, execute the powershell script again with the following parameters:

```powershell
.\Deploy-ReferenceArchitecture.ps1 <subscriptionID> <region> CreateVpn
```

Wait for the deployment to complete. Then, execute the powershell script again with the following parameters:

```powershell
.\Deploy-ReferenceArchitecture.ps1 <subscriptionID> <region> AzureADDS
```
Wait for the deployment to complete. Then, execute the powershell script again with the following parameters:

```powershell
.\Deploy-ReferenceArchitecture.ps1 <subscriptionID> <region> Workload
```
Once this Powershell script has finished, the deployment is complete.

## Next steps
* Learn the best practices for [creating an AD DS resource forest][adds-resource-forest] in Azure.
* Learn the best practices for [creating an AD FS infrastructure][adfs] in Azure.

<!-- links -->

[active-directory-domain-services]: https://technet.microsoft.com/library/dd448614.aspx
[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[adds-data-disks]: https://msdn.microsoft.com/library/azure/jj156090.aspx#BKMK_PlaceDB
[ad-ds-operations-masters]: https://technet.microsoft.com/library/cc779716(v=ws.10).aspx
[ad-ds-ports]: https://technet.microsoft.com/library/dd772723(v=ws.11).aspx
[adds-resource-forest]: ./guidance-identity-adds-resource-forest.md
[adfs]: ./guidance-identity-adfs.md
[availability-set]: ../virtual-machines/virtual-machines-windows-create-availability-set.md
[azure-active-directory]: ../active-directory-domain-services/active-directory-ds-overview.md
[azure-ad-connect]: ../active-directory/active-directory-aadconnect.md
[azure-expressroute]: https://azure.microsoft.com/documentation/articles/expressroute-introduction/
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[capacity-planning-for-adds]: http://social.technet.microsoft.com/wiki/contents/articles/14355.capacity-planning-for-active-directory-domain-services.aspx
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[microsoft_systems_center]: https://www.microsoft.com/server-cloud/products/system-center-2016/
[monitoring_ad]: https://msdn.microsoft.com/library/bb727046.aspx
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[security-considerations]: #security-considerations
[set-a-static-ip-address]: https://azure.microsoft.com/documentation/articles/virtual-networks-static-private-ip-arm-pportal/
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[vm-windows-sizes]: ../virtual-machines/virtual-machines-windows-sizes.md

[0]: ./media/guidance-iaas-ra-secure-vnet-ad/figure1.png "Secure hybrid network architecture with Active Directory"
