<properties
	pageTitle="Azure AD Domain Services: Networking guidelines | Microsoft Azure"
	description="Networking for Azure Active Directory Domain Services (Preview)"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/16/2016"
	ms.author="maheshu"/>

# Networking considerations for Azure AD Domain Services

## Select an Azure virtual network
The following guidelines help you select a virtual network to use with Azure AD Domain Services.

### Type of Azure virtual network

- You can enable Azure AD Domain Services in a classic Azure virtual network.

- Azure AD Domain Services **cannot be enabled in Azure Resource Manager (ARM-based) virtual networks**.

- You can connect an ARM-based virtual network to a classic virtual network in which Azure AD Domain Services is enabled. Thereafter, you can use Azure AD Domain Services in the ARM-based virtual network.

- If you plan to use an existing virtual network, ensure that it is a **regional virtual network**.
    - Virtual networks that use the legacy affinity groups mechanism cannot be used with Azure AD Domain Services.

	- To use Azure AD Domain Services, [migrate legacy virtual networks to regional virtual networks](../virtual-network/virtual-networks-migrate-to-regional-vnet.md).


### Azure region for the virtual network

- Your Azure AD Domain Services managed domain is deployed in the same Azure region as the virtual network you choose to enable the service in.

- Select a virtual network in an Azure region supported by Azure AD Domain Services.

- See the [Azure services by region](https://azure.microsoft.com/regions/#services/) page to know the Azure regions in which Azure AD Domain Services is available.


### Requirements for the virtual network

- **Custom/bring-your-own DNS servers**: Ensure that there are no custom DNS servers configured for the virtual network.

- **Existing domains with the same domain name**: Ensure that you do not have an existing domain with the same domain name available on that virtual network. For instance, assume you have a domain called 'contoso.com' already available on the selected virtual network. Later, you try to enable an Azure AD Domain Services managed domain with the same domain name (that is 'contoso.com') on that virtual network. You encounter a failure when trying to enable Azure AD Domain Services. This failure is due to name conflicts for the domain name on that virtual network. In this situation, you must use a different name to set up your Azure AD Domain Services managed domain. Alternately, you can de-provision the existing domain and then proceed to enable Azure AD Domain Services.

- **Proximity to your Azure workloads**: Select the virtual network that currently hosts/will host virtual machines that need access to Azure AD Domain Services.

- You will not be able to move Domain Services to a different virtual network after you have enabled the service.

<br>

## Network connectivity
An Azure AD Domain Services managed domain can be enabled only within a single classic virtual network in Azure. ARM-based virtual networks are not supported.

You need to connect virtual networks to use the managed domain in any of the following deployment scenarios:

#### To use the managed domain in more than one Azure classic virtual network.

    ![Classic virtual network connectivity](./media/active-directory-domain-services-design-guide/classic-vnet-connectivity.png)

#### To use the managed domain in an ARM-based virtual network.


- You can [connect a classic virtual network to an ARM-based virtual network](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md), to use Azure AD Domain Services in a virtual network created using Azure Resource Manager.


<br>

## Related Content

- [Azure virtual network peering](../virtual-network/virtual-network-peering-overview.md)

- [Configure a VNet-to-VNet connection for the classic deployment model](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md)
