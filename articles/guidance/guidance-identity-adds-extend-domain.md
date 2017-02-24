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
ms.date: 11/28/2016
ms.author: telmos

---
# Extending Active Directory Domain Services (AD DS) to Azure

[!INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for extending your Active Directory environment to Azure to provide distributed authentication services using [Active Directory Domain Services (AD DS)][active-directory-domain-services]. This architecture extends the architectures described in  [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

> [!NOTE]
> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

AD DS is used to authenticate user, computer, application, or other identities that are included in a security domain. It can be hosted on-premises, but if your application is hosted partly on-premises and partly in Azure, it may be more efficient to replicate this functionality in Azure. This can reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

There are two ways to host your directory services in Azure: 

* Use [Azure Active Directory][azure-active-directory] (Azure AD) to create an Active Directory domain, using [Azure AD Connect][azure-ad-connect] to integrate your on-premises AD directories with Azure AD. This approach is described in [Integrating on-premises Active Directory domains with Azure AD][guidance-identity-aad].

* Extend your existing on-premises Active Directory infrastructure to Azure by deploying a VM that runs AD DS as a domain controller. Depending on your security requirements, the AD installation in the cloud can be part of the same domain as that held on-premises, a new domain within a shared forest, or a separate forest.

This article describes the second option, extending an on-premises infrastructure by deploying an AD DS domain controller to Azure, with both using the same domain. 

This architecture is commonly used when the on-premises network and the Azure virtual network are connected by a VPN or ExpressRoute connection. This architecture also supports bidirectional replication, meaning changes can be made either on-premises or in the cloud, and both sources will be kept consistent. Typical uses for this architecture include hybrid applications in which functionality is distributed between on-premises and Azure, and applications and services that perform authentication using Active Directory.


## Architecture diagram

The following diagram highlights the important components in this architecture. 

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "Identity - ADDS (same domain)" page.
> 
> 

![[0]][0] 

* **On-premises network**. The on-premises network includes local Active Directory servers that can perform authentication and authorization for components located on-premises.
* **Active Directory servers**. These are domain controllers implementing directory services (AD DS) running as VMs in the cloud. These servers can provide authentication of components running in your Azure virtual network.
* **Active Directory subnet**. The AD DS servers are hosted in a separate subnet. Network security group (NSG) rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.
* **Azure Gateway and Active Directory synchronization**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. All synchronization requests between the Active Directory servers in the cloud and on-premises pass through the gateway. User-defined routes (UDRs) handle routing for on-premises traffic that passes to Azure. Traffic to and from the Active Directory servers does not pass through the network virtual appliances (NVAs) used in this scenario.

For more information about the parts of the architecture that are not related to AD DS, read [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture]. 

## Recommendations

The following recommendations apply for most scenarios. Follow these recommendations unless you have a specific requirement that overrides them. 

### VM recommendations

Determine your [VM size][vm-windows-sizes] requirements based on the expected volume of authentication requests. Use the specifications of the machines hosting AD DS on premises as a starting point, and match them with the Azure VM sizes. Once deployed, monitor utilization and scale up or down based on the actual load on the VMs. For more information about sizing AD DS domain controllers, see [Capacity Planning for Active Directory Domain Services][capacity-planning-for-adds].

Create a separate virtual data disk for storing the database, logs, and SYSVOL for Active Directory. Do not store these items on the same disk as the operating system. Note that by default, data disks that are attached to a VM use write-through caching. However, this form of caching can conflict with the requirements of AD DS. For this reason, set the *Host Cache Preference* setting on the data disk to *None*. For more information, see [Placement of the Windows Server AD DS database and SYSVOL][adds-data-disks].

Deploy at least two VMs running AD DS as domain controllers and add them to an [availability set][availability-set].

### Networking recommendations

Configure the VM network interface (NIC) for each AD DS server with a static private IP address for full domain name service (DNS) support. For more information, see [How to set a static private IP address in the Azure portal][set-a-static-ip-address].

> [!NOTE]
> Do not configure the VM NIC for any AD DS with a public IP address. See [Security considerations][security-considerations] for more details.
> 
> 

The Active Directory subnet NSG requires rules to permit incoming traffic from on-premises. For detailed information on the ports used by AD DS, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports]. Also, ensure the UDR tables do not route AD DS traffic through the NVAs used in this architecture. 

### Active Directory site

In AD DS, a site represents a physical location, network, or collection of devices. AD DS sites are used to manage AD DS database replication by grouping together AD DS objects that are located close to one another and are connected by a high speed network. AD DS includes logic to select the best strategy for replacating the AD DS database between sites.

We recommend that you create an AD DS site including the subnets defined for your application in Azure. Then, configure a site link between your on-premises AD DS sites, and AD DS will automatically perform the most efficent database replication possible. Note that this database replication requires little beyond the initial configuration.

### Active Directory operations masters

The operations masters role can be assigned to AD DS domain controllers to support consistency checking between instances of replicated AD DS databases. There are five operations master roles: schema master, domain naming master, relative identifier master, primary domain controller master emulator, and infrastructure master. For more information about these roles, see [What are Operations Masters?][ad-ds-operations-masters].

We recommend you do not assign operations masters roles to the domain controllers deployed in Azure.

### Monitoring

Monitor the resources of the domain controller VMs as well as the AD DS Services and create a plan to quickly correct any problems. For more information, see [Monitoring Active Directory][monitoring_ad]. You can also install tools such as [Microsoft Systems Center][microsoft_systems_center] on the monitoring server (see the architecture diagram) to help perform these tasks.  

## Scalability considerations

AD DS is designed for scalability. You don't need to configure a load balancer or traffic controller to direct requests to AD DS domain controllers. The only scalability consideration is to configure the VMs running AD DS with the correct size for your network load requirements, monitor the load on the VMs, and scale up or down as necessary.

## Availability considerations

Deploy the VMs running AD DS into an [availability set][availability-set]. Also, consider assigning the role of [standby operations master][standby-operations-masters] to at least one server, and possibly more depending on your requirements. A standby operations master is an active copy of the operations master that can be used in place of the primary operations masters server during fail over.

## Manageability considerations

Perform regular AD DS backups. Don't simply copy the VHD files of domain controllers instead of performing regular backups, because the AD DS database file on the VHD may not be in a consistent state when it's copied, making it impossible to restart the database.

Do not shut down a domain controller VM using Azure portal. Instead, shut down and restart from the guest operating system. Shuting down through the portal causes the VM to be deallocated, which resets both the `VM-GenerationID` and the `invocationID` of the Active Directory repository. This discards the AD DS relative identifier (RID) pool and marks SYSVOL as nonauthoritative, and may require reconfiguration of the domain controller.

## Security considerations

AD DS servers provide authentication services and are an attractive target for attacks. To secure them, prevent direct Internet connectivity by placing the AD DS servers in a separate subnet with an NSG acting as a firewall. Close all ports on the AD DS servers except those necessary for authentication, authorization, and server synchronization. For more information, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports].

Consider implementing an additional security perimeter around servers with a pair of subnets and NVAs, as described in [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

Use either BitLocker or Azure disk encryption to encrypt the disk hosting the AD DS database.

## Solution deployment

A solution is available on [Github][github] to deploy this reference architecture. You will need the latest version of the [Azure CLI][azure-powershell] to run the Powershell script that deploys the solution. To deploy the reference architecture, follow these steps:

1. Download or clone the solution folder from [Github][github] to your local machine.

2. Open the Azure CLI and navigate to the local solution folder.

3. Run the following command:
    ```Powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> <mode>
    ```
    Replace `<subscription id>` with your Azure subscription ID.
    For `<location>`, specify an Azure region, such as `eastus` or `westus`.
    The `<mode>` parameter controls the granularity of the deployment, and can be one of the following values:
    * `Onpremise`: deploys the simulated on-premises environment.
    * `Infrastructure`: deploys the VNet infrastructure and jump box in Azure.
    * `CreateVpn`: deploys the Azure virtual network gateway and connects it to the simulated on-premises network.
    * `AzureADDS`: deploys the VMs acting as AD DS servers, deploys Active Directory to these VMs, and deploys the domain in Azure.
    * `Workload`: deploys the public and private DMZs and the workload tier.
    * `All`: deploys all of the preceding deployments. **This is the recommended option if If you do not have an existing on-premises network but you want to deploy the complete reference architecture described above for testing or evaluation.**

4. Wait for the deployment to complete. If you are deploying the `All` deployment, it will take several hours.

## Next steps

* Learn the best practices for [creating an AD DS resource forest][adds-resource-forest] in Azure.
* Learn the best practices for [creating an Active Directory Federation Services (AD FS) infrastructure][adfs] in Azure.

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
[azure-powershell]: /powershell/azureps-cmdlets-docs
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[capacity-planning-for-adds]: http://social.technet.microsoft.com/wiki/contents/articles/14355.capacity-planning-for-active-directory-domain-services.aspx
[GitHub]: https://github.com/mspnp/reference-architectures/tree/master/guidance-ra-identity-adds
[guidance-identity-aad]: guidance-identity-aad.md
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