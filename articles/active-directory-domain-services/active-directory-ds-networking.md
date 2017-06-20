---
title: 'Azure AD Domain Services: Networking guidelines | Microsoft Docs'
description: Networking considerations for Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: 23a857a5-2720-400a-ab9b-1ba61e7b145a
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/06/2017
ms.author: maheshu

---
# Networking considerations for Azure AD Domain Services
## How to select an Azure virtual network
The following guidelines help you select a virtual network to use with Azure AD Domain Services.

### Type of Azure virtual network
* You can enable Azure AD Domain Services in a classic Azure virtual network.
* Azure AD Domain Services **cannot be enabled in virtual networks created using Azure Resource Manager**.
* You can connect a Resource Manager-based virtual network to a classic virtual network in which Azure AD Domain Services is enabled. Thereafter, you can use Azure AD Domain Services in the Resource Manager-based virtual network. For more information, see the [Network connectivity](active-directory-ds-networking.md#network-connectivity) section.
* **Regional Virtual Networks**: If you plan to use an existing virtual network, ensure that it is a regional virtual network.

  * Virtual networks that use the legacy affinity groups mechanism cannot be used with Azure AD Domain Services.
  * To use Azure AD Domain Services, [migrate legacy virtual networks to regional virtual networks](../virtual-network/virtual-networks-migrate-to-regional-vnet.md).

### Azure region for the virtual network
* Your Azure AD Domain Services managed domain is deployed in the same Azure region as the virtual network you choose to enable the service in.
* Select a virtual network in an Azure region supported by Azure AD Domain Services.
* See the [Azure services by region](https://azure.microsoft.com/regions/#services/) page to know the Azure regions in which Azure AD Domain Services is available.

### Requirements for the virtual network
* **Proximity to your Azure workloads**: Select the virtual network that currently hosts/will host virtual machines that need access to Azure AD Domain Services.
* **Custom/bring-your-own DNS servers**: Ensure that there are no custom DNS servers configured for the virtual network.
* **Existing domains with the same domain name**: Ensure that you do not have an existing domain with the same domain name available on that virtual network. For instance, assume you have a domain called 'contoso.com' already available on the selected virtual network. Later, you try to enable an Azure AD Domain Services managed domain with the same domain name (that is 'contoso.com') on that virtual network. You encounter a failure when trying to enable Azure AD Domain Services. This failure is due to name conflicts for the domain name on that virtual network. In this situation, you must use a different name to set up your Azure AD Domain Services managed domain. Alternately, you can de-provision the existing domain and then proceed to enable Azure AD Domain Services.

> [!WARNING]
> You cannot move Domain Services to a different virtual network after you have enabled the service.
>
>

## Network Security Groups and subnet design
A [Network Security Group (NSG)](../virtual-network/virtual-networks-nsg.md) contains a list of Access Control List (ACL) rules that allow or deny network traffic to your VM instances in a Virtual Network. NSGs can be associated with either subnets or individual VM instances within that subnet. When an NSG is associated with a subnet, the ACL rules apply to all the VM instances in that subnet. In addition, traffic to an individual VM can be restricted further by associating an NSG directly to that VM.

![Recommended subnet design](./media/active-directory-domain-services-design-guide/vnet-subnet-design.png)

### Best practices for choosing a subnet
* Deploy Azure AD Domain Services to a **separate dedicated subnet** within your Azure virtual network.
* Do not apply NSGs to the dedicated subnet for your managed domain. If you must apply NSGs to the dedicated subnet, ensure you **do not block the ports required to service and manage your domain**.
* Do not overly restrict the number of IP addresses available within the dedicated subnet for your managed domain. This restriction prevents the service from making two domain controllers available for your managed domain.
* **Do not enable Azure AD Domain Services in the gateway subnet** of your virtual network.

> [!WARNING]
> When you associate an NSG with a subnet in which Azure AD Domain Services is enabled, you may disrupt Microsoft's ability to service and manage the domain. Additionally, synchronization between your Azure AD tenant and your managed domain is disrupted. **The SLA does not apply to deployments where an NSG has been applied that blocks Azure AD Domain Services from updating and managing your domain.**
>
>

### Ports required for Azure AD Domain Services
The following ports are required for Azure AD Domain Services to service and maintain your managed domain. Ensure that these ports are not blocked for the subnet in which you have enabled your managed domain.

| Port number | Purpose |
| --- | --- |
| 443 |Synchronization with your Azure AD tenant |
| 3389 |Management of your domain |
| 5986 |Management of your domain |
| 636 |Secure LDAP (LDAPS) access to your managed domain |

## Network connectivity
An Azure AD Domain Services managed domain can be enabled only within a single classic virtual network in Azure. Virtual networks created using Azure Resource Manager are not supported.

### Scenarios for connecting Azure networks
Connect Azure virtual networks to use the managed domain in any of the following deployment scenarios:

#### Use the managed domain in more than one Azure classic virtual network
You can connect other Azure classic virtual networks to the Azure classic virtual network in which you have enabled Azure AD Domain Services. This VPN connection enables you to use the managed domain with your workloads deployed in other virtual networks.

![Classic virtual network connectivity](./media/active-directory-domain-services-design-guide/classic-vnet-connectivity.png)

#### Use the managed domain in a Resource Manager-based virtual network
You can connect a Resource Manager-based virtual network to the Azure classic virtual network in which you have enabled Azure AD Domain Services. This connection enables you to use the managed domain with your workloads deployed in the Resource Manager-based virtual network.

![Resource Manager to classic virtual network connectivity](./media/active-directory-domain-services-design-guide/classic-arm-vnet-connectivity.png)

### Network connection options
* **VNet-to-VNet connections using site-to-site VPN connections**: Connecting a virtual network to another virtual network (VNet-to-VNet) is similar to connecting a virtual network to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE.

    ![Virtual network connectivity using VPN Gateway](./media/active-directory-domain-services-design-guide/vnet-connection-vpn-gateway.jpg)

    [More information - connect virtual networks using VPN gateway](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md)
* **VNet-to-VNet connections using virtual network peering**: Virtual network peering is a mechanism that connects two virtual networks in the same region through the Azure backbone network. Once peered, the two virtual networks appear as one for all connectivity purposes. They are still managed as separate resources, but virtual machines in these virtual networks can communicate with each other directly by using private IP addresses.

    ![Virtual network connectivity using peering](./media/active-directory-domain-services-design-guide/vnet-peering.png)

    [More information - virtual network peering](../virtual-network/virtual-network-peering-overview.md)

<br>

## Related Content
* [Azure virtual network peering](../virtual-network/virtual-network-peering-overview.md)
* [Configure a VNet-to-VNet connection for the classic deployment model](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md)
* [Azure Network Security Groups](../virtual-network/virtual-networks-nsg.md)
