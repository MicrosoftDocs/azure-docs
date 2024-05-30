---
title: Collect information for a site
titleSuffix: Azure Private 5G Core
description: Learn about the information you need to create a site in an existing private mobile network.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 02/07/2022
ms.custom: template-how-to
zone_pivot_groups: ase-pro-version
---

# Collect the required information for a site

Azure Private 5G Core private mobile networks include one or more sites. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. This how-to guide takes you through the process of collecting the information you need to create a new site.

You can use this information to create a site in an existing private mobile network using the [Azure portal](create-a-site.md). You can also use it as part of an ARM template to [deploy a new private mobile network and site](deploy-private-mobile-network-with-site-arm-template.md), or [add a new site to an existing private mobile network](create-site-arm-template.md).

## Prerequisites

- Complete the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Make a note of the resource group that contains your private mobile network that was collected in [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md). We recommend that the mobile network site resource you create in this procedure belongs to the same resource group.
- Ensure you have the relevant permissions on your account if you want to give Azure role-based access control (Azure RBAC) to storage accounts.

## Choose a service plan

Choose the service plan that best fits your requirements and verify pricing and charges. See [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/).

## Collect mobile network site resource values

Collect all the values in the following table for the mobile network site resource that represents your site.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to create the mobile network site resource. You must use the same subscription for all resources in your private mobile network deployment.                  |**Project details: Subscription**|
   |The Azure resource group in which to create the mobile network site resource. We recommend that you use the same resource group that already contains your private mobile network.                |**Project details: Resource group**|
   |The name for the site.           |**Instance details: Name**|
   |The region in which you deployed the private mobile network.                         |**Instance details: Region**|
   |The packet core in which to create the mobile network site resource.                         |**Instance details: Packet core name**|
   |The [region code name](region-code-names.md) of the region in which you deployed the private mobile network. </br></br>You only need to collect this value if you're going to create your site using an ARM template.                         |Not applicable.|
   |The mobile network resource representing the private mobile network to which you’re adding the site. </br></br>You only need to collect this value if you're going to create your site using an ARM template.                         |Not applicable.|
   |The service plan for the site. See [Azure Private 5G Core pricing](https://azure.microsoft.com/pricing/details/private-5g-core/). |**Instance details: Service plan**|

## Collect packet core configuration values

Collect all the values in the following table for the packet core instance that runs in the site.

:::zone pivot="ase-pro-gpu"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The core technology type the packet core instance should support: 5G, 4G, or combined 4G and 5G. |**Technology type**|
   | The Azure Stack Edge resource representing the Azure Stack Edge Pro device in the site. You created this resource as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> If you're going to create your site using the Azure portal, collect the name of the Azure Stack Edge resource.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the Azure Stack Edge resource. You can do this by navigating to the Azure Stack Edge resource, selecting **JSON View**, and copying the contents of the **Resource ID** field. | **Azure Stack Edge device** |
   |The custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. You commissioned the AKS-HCI cluster as part of the steps in [Commission the AKS cluster](commission-cluster.md).</br></br> If you're going to create your site using the Azure portal, collect the name of the custom location.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the custom location. You can do this by navigating to the Custom location resource, selecting **JSON View**, and copying the contents of the **Resource ID** field.|**Custom location**|
   | The virtual network name on port 6 on your Azure Stack Edge Pro GPU device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface; for combined 4G and 5G, it's the N6/SGi interface. | **ASE N6 virtual subnet** (for 5G) or **ASE SGi virtual subnet** (for 4G), or **ASE N6/SGi virtual subnet** (for combined 4G and 5G). |
:::zone-end
:::zone pivot="ase-pro-2"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The core technology type the packet core instance should support: 5G, 4G, or combined 4G and 5G. |**Technology type**|
   | The Azure Stack Edge resource representing the Azure Stack Edge Pro device in the site. You created this resource as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> If you're going to create your site using the Azure portal, collect the name of the Azure Stack Edge resource.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the Azure Stack Edge resource. You can do this by navigating to the Azure Stack Edge resource, selecting **JSON View**, and copying the contents of the **Resource ID** field. | **Azure Stack Edge device** |
   |The custom location that targets the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on the Azure Stack Edge Pro device in the site. You commissioned the AKS-HCI cluster as part of the steps in [Commission the AKS cluster](commission-cluster.md).</br></br> If you're going to create your site using the Azure portal, collect the name of the custom location.</br></br> If you're going to create your site using an ARM template, collect the full resource ID of the custom location. You can do this by navigating to the Custom location resource, selecting **JSON View**, and copying the contents of the **Resource ID** field.|**Custom location**|
   | The virtual network name on port 4 on your Azure Stack Edge Pro 2 device corresponding to the user plane interface on the data network. For 5G, this interface is the N6 interface; for 4G, it's the SGi interface; for combined 4G and 5G, it's the N6/SGi interface. |  **ASE N6 virtual subnet** (for 5G) or **ASE SGi virtual subnet** (for 4G), or **ASE N6/SGi virtual subnet** (for combined 4G and 5G). |
   | The gateway for the IP address configured for the N6 interface | SGi/N6 gateway | 
:::zone-end

## Collect RADIUS values

If you have a Remote Authentication Dial-In User Service (RADIUS) authentication, authorization and accounting (AAA) server in your network, you can optionally configure the packet core to use it to authenticate UEs on attachment to the network and session establishment. If you want to use RADIUS, collect all the values in the following table.

|Value  |Field name in Azure portal  |
|---------|---------|
|IP address for the RADIUS AAA server. |RADIUS server address |
|IP address for the network access servers (NAS). |RADIUS NAS address |
|Authentication port to use on the RADIUS AAA server. |RADIUS server port |
|The names of one or more data networks that require RADIUS authentication. |RADIUS Auth applies to DNs |
|Whether to use: </br></br>- the default username and password, defined in your Azure Key Vault </br></br>- the International Mobile Subscriber Identity (IMSI) as the username, with the password defined in your Azure Key Vault. |RADIUS authentication username. |
|URL of the secret used to secure communication between the packet core and AAA server, stored in your Azure Key Vault. |Shared secret |
|URL of the default username secret, stored in your Azure Key Vault. Not required if using IMSI. |Secret URI for the default username |
|URL of the default password secret, stored in your Azure Key Vault. |Secret URI for the default password |

To add the secrets to Azure Key Vault, see [Quickstart: Set and retrieve a secret from Azure Key Vault using the Azure portal](../key-vault/secrets/quick-create-portal.md).

## Collect access network values

Collect all the values in the following table to define the packet core instance's connection to the access network over the control plane and user plane interfaces. The field name displayed in the Azure portal depends on the value you have chosen for **Technology type**, as described in [Collect packet core configuration values](#collect-packet-core-configuration-values).

:::zone pivot="ase-pro-gpu"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface; for combined 4G and 5G, it's the N2/S1-MME interface. |**ASE N2 interface** (for 5G), **ASE S1-MME interface** (for 4G), or **ASE S1-MME/N2 interface** (for combined 4G and 5G). |
   | The IP address for the control plane interface on the access network. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#order-and-set-up-your-azure-stack-edge-pro-devices).  </br></br> For an HA deployment, this IP address MUST NOT be in any control plane or user plane subnets; it's used as the destination of routes in the access network gateway routers. | **ASE N2 virtual IP address** (for 5G), **ASE S1-MME virtual IP address** (for 4G), or **ASE S1-MME/N2 virtual IP address** (for combined 4G and 5G). |
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface; for combined 4G and 5G, it's the N3/S1-U interface. |**ASE N3 interface** (for 5G), **ASE S1-U interface** (for 4G), or **ASE S1-U/N3 interface** (for combined 4G and 5G). |
   | The IP address for the control plane interface on the access network. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> For an HA deployment, this IP address MUST NOT be in any control plane or user plane subnets; it's used as the destination of routes in the access network gateway routers.  | **ASE N3 virtual IP address** (for 5G), **ASE S1-U virtual IP address** (for 4G), or **ASE S1-U/N3 virtual IP address** (for combined 4G and 5G). |
   | The ID number of the VLAN for the N2 network | S1-MME/N2 VLAN ID |
   | The subnet for the IP address configured for the N2 interface e.g. 10.232.44.0/24 | S1-MME/N2 subnet |
   | The gateway for the IP address configured for the N2 interface e.g. 10.232.44.1. If the subnet does not have a default gateway, use another IP address in the subnet which will respond to ARP requests (such as one of the RAN IP addresses). If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway. | S1-MME/N2 gateway |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | S1-MME/N2 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | S1-MME/N2 gateway BFD endpoint 2 |
   | The virtual network name on port 5 on your Azure Stack Edge Pro device corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface; for combined 4G and 5G, it's the N3/S1-U interface. </br></br> For an HA deployment, this IP address MUST NOT be in any control plane or user plane subnets; it's used as the destination of routes in the access network gateway routers. | **ASE N3 virtual subnet** (for 5G), **ASE S1-U virtual subnet** (for 4G), or **ASE N3/S1-U virtual subnet** (for combined 4G and 5G). |
   | The ID number of the VLAN for the N3 network | S1-U/N3 VLAN ID |
   | The local IP address for the N3 interface | S1-U/N3 address |
   | The subnet for the IP address configured for the N3 interface e.g. 10.232.44.0/24 | S1-U/N3 subnet |
   | The gateway for the IP address configured for the N3 interface e.g. 10.232.44.1. If the subnet does not have a default gateway, use another IP address in the subnet which will respond to ARP requests (such as one of the RAN IP addresses). If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway. | S1-U/N3 gateway |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | S1-U/N3 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | S1-U/N3 gateway BFD endpoint 2 |
:::zone-end
:::zone pivot="ase-pro-2"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the control plane interface on the access network. For 5G, this interface is the N2 interface; for 4G, it's the S1-MME interface; for combined 4G and 5G, it's the N2/S1-MME interface. |**ASE N2 interface** (for 5G), **ASE S1-MME interface** (for 4G), or **ASE S1-MME/N2 interface** (for combined 4G and 5G). |
   | The IP address for the control plane interface on the access network. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#order-and-set-up-your-azure-stack-edge-pro-devices).  </br></br> For an HA deployment, this IP address MUST NOT be in any control plane or user plane subnets; it's used as the destination of routes in the access network gateway routers. | **ASE N2 virtual IP address** (for 5G), **ASE S1-MME virtual IP address** (for 4G), or **ASE S1-MME/N2 virtual IP address** (for combined 4G and 5G). |
   | The virtual network name on port 3 on your Azure Stack Edge Pro 2 corresponding to the user plane interface on the access network. For 5G, this interface is the N3 interface; for 4G, it's the S1-U interface; for combined 4G and 5G, it's the N3/S1-U interface. |**ASE N3 interface** (for 5G), **ASE S1-U interface** (for 4G), or **ASE S1-U/N3 interface** (for combined 4G and 5G). |
   | The IP address for the control plane interface on the access network. You identified this address in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br> This IP address must match the value you used when deploying the AKS-HCI cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Order and set up your Azure Stack Edge Pro devices](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#order-and-set-up-your-azure-stack-edge-pro-devices).</br></br> For an HA deployment, this IP address MUST NOT be in any control plane or user plane subnets; it's used as the destination of routes in the access network gateway routers.  | **ASE N3 virtual IP address** (for 5G), **ASE S1-U virtual IP address** (for 4G), or **ASE S1-U/N3 virtual IP address** (for combined 4G and 5G). |
   | The ID number of the VLAN for the N2 network | S1-MME/N2 VLAN ID |
   | The subnet for the IP address configured for the N2 interface e.g. 10.232.44.0/24 | S1-MME/N2 subnet |
   | The gateway for the IP address configured for the N2 interface e.g. 10.232.44.1. If the subnet does not have a default gateway, use another IP address in the subnet which will respond to ARP requests (such as one of the RAN IP addresses). If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway. | S1-MME/N2 gateway |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | S1-MME/N2 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | S1-MME/N2 gateway BFD endpoint 2 |
   | The ID number of the VLAN for the N3 network | S1-U/N3 VLAN ID |
   | The local IP address for the N3 interface | S1-U/N3 address |
   | The subnet for the IP address configured for the N3 interface e.g. 10.232.44.0/24 | S1-U/N3 subnet |
   | The gateway for the IP address configured for the N3 interface e.g. 10.232.44.1. If the subnet does not have a default gateway, use another IP address in the subnet which will respond to ARP requests (such as one of the RAN IP addresses). If there's more than one gNB connected via a switch, choose one of the IP addresses for the gateway. | S1-U/N3 gateway |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | S1-U/N3 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of access network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | S1-U/N3 gateway BFD endpoint 2 |
:::zone-end

## Collect UE usage tracking values

If you want to configure UE usage tracking for your site, collect all the values in the following table to define the packet core instance's associated Event Hubs instance. See [Monitor UE usage with Event Hubs](ue-usage-event-hub.md) for more information.

> [!NOTE]
> You must already have an [Azure Event Hubs instance](/azure/event-hubs) with an associated user assigned managed identity with the **Resource Policy Contributor** role before you can collect the information in the following table.

> [!NOTE]
> Azure Private 5G Core does not support Event Hubs with a [log compaction delete cleanup policy](/azure/event-hubs/log-compaction?source=recommendations).

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The namespace for the Azure Event Hubs instance that your site uses for UE usage tracking. |**Azure Event Hub Namespace**|
   |The name of the Azure Event Hubs instance that your site uses for UE usage tracking.|**Event Hub name**|
   |The user assigned managed identity that has the **Resource Policy Contributor** role for the Event Hubs instance. <br /> **Note:** The managed identity must be assigned to the Packet Core Control Plane for the site and assigned to the Event Hubs instance via the instance's **Identity and Access Management (IAM)** blade. <br /> **Note:** Only assign one managed identity to the site. This managed identity must be used for any UE usage tracking for the site after upgrade and site configuration modifications.<br /><br /> See [Use a user-assigned managed identity to capture events](/azure/event-hubs/event-hubs-capture-managed-identity) for more information on managed identities.  |**User Assigned Managed Identity**|

## Collect data network values

You can configure up to ten data networks per site. During site creation, you'll be able to choose whether to attach an existing data network or create a new one.

For each data network that you want to configure, collect all the values in the following table. These values define the packet core instance's connection to the data network over the user plane interface, so you need to collect them whether you're creating the data network or using an existing one.

:::zone pivot="ase-pro-gpu"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name of the data network. This could be an existing data network or a new one you'll create during packet core configuration.                 |**Data network name**|
   | The ID number of the VLAN for the data network | SGi/N6 VLAN ID |
   | The IP address of the N6 interface | SGi/N6 address |
   | The gateway for the IP address configured for the N6 interface | SGi/N6 gateway | 
   | The IP address of one of a redundant pair of data network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | SGi/N6 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of data network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | SGi/N6 gateway BFD endpoint 2 |
   | The network address of the subnet from which dynamic IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You don't need this address if you don't want to support dynamic IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`192.0.2.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Dynamic UE IP pool prefixes**|
   | The network address of the subnet from which static IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You don't need this address if you don't want to support static IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`203.0.113.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Static UE IP pool prefixes**|
   | The Domain Name System (DNS) server addresses to be provided to the UEs connected to this data network. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-gpu#allocate-subnets-and-ip-addresses). </br></br>This value might be an empty list if you don't want to configure a DNS server for the data network. In this case, UEs in this data network will be unable to resolve domain names. | **DNS Addresses** |
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses. </br></br>When NAPT is disabled, static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network must be configured in the data network router. </br></br>If you want to use [UE-to-UE traffic](private-5g-core-overview.md#ue-to-ue-traffic) in this data network, keep NAPT disabled.   |**NAPT**|
:::zone-end
:::zone pivot="ase-pro-2"
   |Value  |Field name in Azure portal  |
   |---------|---------|
   | The name of the data network. This could be an existing data network or a new one you'll create during packet core configuration.                 |**Data network name**|
   | The ID number of the VLAN for the data network | SGi/N6 VLAN ID |
   | The IP address of the N6 interface | SGi/N6 address |
   | The gateway for the IP address configured for the N6 interface | SGi/N6 gateway |
   | The IP address of one of a redundant pair of data network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down. | SGi/N6 gateway BFD endpoint 1 |
   | The IP address of one of a redundant pair of data network gateway routers in a highly available (HA) deployment. Used to establish a BFD session between the packet core and each router to maintain service if one router goes down.   | SGi/N6 gateway BFD endpoint 2 |
   | The network address of the subnet from which dynamic IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You don't need this address if you don't want to support dynamic IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`192.0.2.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Dynamic UE IP pool prefixes**|
   | The network address of the subnet from which static IP addresses must be allocated to user equipment (UEs), given in CIDR notation. You don't need this address if you don't want to support static IP address allocation for this site. You identified this in [Allocate user equipment (UE) IP address pools](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-user-equipment-ue-ip-address-pools). The following example shows the network address format. </br></br>`203.0.113.0/24` </br></br>Note that the UE subnets aren't related to the access subnet.    |**Static UE IP pool prefixes**|
   | The Domain Name System (DNS) server addresses to be provided to the UEs connected to this data network. You identified this in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md?pivots=ase-pro-2#allocate-subnets-and-ip-addresses). </br></br>This value might be an empty list if you don't want to configure a DNS server for the data network. In this case, UEs in this data network will be unable to resolve domain names. | **DNS Addresses** |
   |Whether Network Address and Port Translation (NAPT) should be enabled for this data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses. </br></br>When NAPT is disabled, static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network must be configured in the data network router. </br></br>If you want to use [UE-to-UE traffic](private-5g-core-overview.md#ue-to-ue-traffic) in this data network, keep NAPT disabled.   |**NAPT**|
:::zone-end

## Collect values for diagnostics package gathering

You can use a storage account and user assigned managed identity, with write access to the storage account, to gather diagnostics packages for the site.

If you don't want to configure diagnostics package gathering at this stage, you don't need to collect anything. You can configure this after site creation.

If you want to configure diagnostics package gathering during site creation, see [Collect values for diagnostics package gathering](gather-diagnostics.md#set-up-a-storage-account).

## Choose the authentication method for local monitoring tools

Azure Private 5G Core provides dashboards for monitoring your deployment and a web GUI for collecting detailed signal traces. You can access these tools using [Microsoft Entra ID](../active-directory/authentication/overview-authentication.md) or a local username and password. We recommend setting up Microsoft Entra authentication to improve security in your deployment.

If you want to access your local monitoring tools using Microsoft Entra ID, after creating a site follow the steps in [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md).

If you want to access your local monitoring tools using local usernames and passwords, you don't need to set any additional configuration. After deploying the site, set up your username and password by following [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards).

You'll be able to change the authentication method later by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

> [!NOTE]
> While in [disconnected mode](disconnected-mode.md), you won't be able to change the local monitoring authentication method or sign in using Microsoft Entra ID. If you expect to need access to your local monitoring tools while the ASE is disconnected, consider using the local username and password authentication method instead.

## Collect local monitoring values

You can use a self-signed or a custom certificate to secure access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) at the edge. We recommend that you provide your own HTTPS certificate signed by a globally known and trusted certificate authority (CA), as this provides additional security to your deployment and allows your browser to recognize the certificate signer.

If you don't want to provide a custom HTTPS certificate at this stage, you don't need to collect anything. You'll be able to change this configuration later by following [Modify the local access configuration in a site](modify-local-access-configuration.md).

If you want to provide a custom HTTPS certificate at site creation:

   1. Either [create an Azure Key Vault](../key-vault/general/quick-create-portal.md) or choose an existing one to host your certificate. Ensure the key vault is configured with **Azure Virtual Machines for deployment** resource access.
   1. Ensure your certificate is stored in your key vault. You can either [generate a Key Vault certificate](../key-vault/certificates/create-certificate.md) or [import an existing certificate to your Key Vault](../key-vault/certificates/tutorial-import-certificate.md?tabs=azure-portal#import-a-certificate-to-your-key-vault). Your certificate must:

      - Be signed by a globally known and trusted CA.
      - Use a private key of type RSA or EC to ensure it's exportable (see [Exportable or non-exportable key](../key-vault/certificates/about-certificates.md) for more information).

      We also recommend setting a DNS name for your certificate.

   1. If you want to configure your certificate to renew automatically, see [Tutorial: Configure certificate auto-rotation in Key Vault](../key-vault/certificates/tutorial-rotate-certificates.md) for information on enabling auto-rotation.

      > [!NOTE]
      >
      > - Certificate validation is always performed against the latest version of the local access certificate in the Key Vault.
      > - If you enable auto-rotation, it might take up to four hours for certificate updates in the Key Vault to synchronize with the edge location.

   1. Decide how you want to provide access to your certificate. You can use a Key Vault access policy or Azure role-based access control (RBAC).

      - [Assign a Key Vault access policy](../key-vault/general/assign-access-policy.md?tabs=azure-portal). Provide **Get** and **List** permissions under **Secret permissions** and **Certificate permissions** to the **Azure Private MEC** service principal.
      - [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control (RBAC)](../key-vault/general/rbac-guide.md?tabs=azure-cli). Provide **Key Vault Reader** and **Key Vault Secrets User** permissions to the **Azure Private MEC** service principal.
      - If you want to, assign the Key Vault access policy or Azure RBAC to a [user-assigned identity](../active-directory/managed-identities-azure-resources/overview.md).

          - If you have an existing user-assigned identity configured for diagnostic collection you can modify it.
          - Otherwise, you can create a new user-assigned identity.

   1. Collect the values in the following table.

       |Value  |Field name in Azure portal  |
       |---------|---------|
       |The name of the Azure Key Vault containing the custom HTTPS certificate.|**Key vault**|
       |The name of the CA-signed custom HTTPS certificate within the Azure Key Vault. |**Certificate**|

## Next steps

Use the information you've collected to create the site:

- [Create a site - Azure portal](create-a-site.md)
- [Create a site - ARM template](create-site-arm-template.md)
