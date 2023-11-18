---
title: Azure Application Gateway infrastructure configuration
description: This article describes how to configure the Azure Application Gateway infrastructure.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 07/05/2023
ms.author: greglin
---

# Application Gateway infrastructure configuration

The Azure Application Gateway infrastructure includes the virtual network, subnets, network security groups (NSGs), and user-defined routes (UDRs).

## Virtual network and dedicated subnet

An application gateway is a dedicated deployment in your virtual network. Within your virtual network, a dedicated subnet is required for the application gateway. You can have multiple instances of a specific Application Gateway deployment in a subnet. You can also deploy other application gateways in the subnet. But you can't deploy any other resource in the Application Gateway subnet. You can't mix v1 and v2 Application Gateway SKUs on the same subnet.

> [!NOTE]
> [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

### Size of the subnet

Application Gateway uses one private IP address per instance, plus another private IP address if a private frontend IP is configured.

Azure also reserves five IP addresses in each subnet for internal use. They're the first four addresses and the last IP addresses. For example, consider 15 Application Gateway instances with no private frontend IP. You need at least 20 IP addresses for this subnet. You need 5 for internal use and 15 for the Application Gateway instances.

Consider a subnet that has 27 Application Gateway instances and an IP address for a private frontend IP. In this case, you need 33 IP addresses. You need 27 for the Application Gateway instances, one for the private frontend, and 5 for internal use.

Application Gateway (Standard or WAF SKU) can support up to 32 instances (32 instance IP addresses + 1 private frontend IP configuration + 5 Azure reserved). We recommend a minimum subnet size of /26.

Application Gateway (Standard_v2 or WAF_v2 SKU) can support up to 125 instances (125 instance IP addresses + 1 private frontend IP configuration + 5 Azure reserved). We recommend a minimum subnet size of /24.

To determine the available capacity of a subnet that has existing application gateways provisioned, take the size of the subnet and subtract the five reserved IP addresses of the subnet reserved by the platform. Next, take each gateway and subtract the maximum instance count. For each gateway that has a private frontend IP configuration, subtract one more IP address per gateway.

For example, here's how to calculate the available addressing for a subnet with three gateways of varying sizes:

- **Gateway 1**: Maximum of 10 instances. Uses a private frontend IP configuration.
- **Gateway 2**: Maximum of 2 instances. No private frontend IP configuration.
- **Gateway 3**: Maximum of 15 instances. Uses a private frontend IP configuration.
- **Subnet size**: /24
    - Subnet size /24 = 256 IP addresses - 5 reserved from the platform = 251 available addresses
    - **251**: Gateway 1 (10) - 1 private frontend IP configuration = 240
    - **240**: Gateway 2 (2) = 238
    - **238**: Gateway 3 (15) - 1 private frontend IP configuration = 222

> [!IMPORTANT]
> Although a /24 subnet isn't required per Application Gateway v2 SKU deployment, we highly recommend it. A /24 subnet ensures that Application Gateway v2 has sufficient space for autoscaling expansion and maintenance upgrades.
>
> You should ensure that the Application Gateway v2 subnet has sufficient address space to accommodate the number of instances required to serve your maximum expected traffic. If you specify the maximum instance count, the subnet should have capacity for at least that many addresses. For capacity planning around instance count, see [Instance count details](understanding-pricing.md#instance-count).

The subnet named `GatewaySubnet` is reserved for VPN gateways. The Application Gateway v1 resources using the `GatewaySubnet` subnet need to be moved to a different subnet or migrated to the v2 SKU before September 30, 2023, to avoid control plane failures and platform inconsistencies. For information on changing the subnet of an existing Application Gateway instance, see [Frequently asked questions about Application Gateway](application-gateway-faq.yml#can-i-change-the-virtual-network-or-subnet-for-an-existing-application-gateway).

> [!TIP]
> IP addresses are allocated from the beginning of the defined subnet space for gateway instances. As instances are created and removed because of creation of gateways or scaling events, it can become difficult to understand what the next available address is in the subnet. To be able to determine the next address to use for a future gateway and have a contiguous addressing theme for frontend IPs, consider assigning frontend IP addresses from the upper half of the defined subset space. 
>
> For example, if the subnet address space is 10.5.5.0/24, consider setting the private frontend IP configuration of your gateways starting with 10.5.5.254 and then following with 10.5.5.253, 10.5.5.252, 10.5.5.251, and so forth for future gateways.

It's possible to change the subnet of an existing Application Gateway instance within the same virtual network. To make this change, use Azure PowerShell or the Azure CLI. For more information, see [Frequently asked questions about Application Gateway](application-gateway-faq.yml#can-i-change-the-virtual-network-or-subnet-for-an-existing-application-gateway).

### DNS servers for name resolution

The virtual network resource supports [DNS server](../virtual-network/manage-virtual-network.md#view-virtual-networks-and-settings-using-the-azure-portal) configuration, which allows you to choose between Azure-provided default or custom DNS servers. The instances of your application gateway also honor this DNS configuration for any name resolution. After you change this setting, you must restart ([Stop](/powershell/module/az.network/Stop-AzApplicationGateway) and [Start](/powershell/module/az.network/start-azapplicationgateway)) your application gateway for these changes to take effect on the instances.

> [!NOTE]
> If you use custom DNS servers in the Application Gateway virtual network, the DNS server must be able to resolve public internet names. Application Gateway requires this capability.

### Virtual network permission

The Application Gateway resource is deployed inside a virtual network, so we also perform a check to verify the permission on the provided virtual network resource. This validation is performed during both creation and management operations.

Check your [Azure role-based access control](../role-based-access-control/role-assignments-list-portal.md) to verify that the users (and service principals) that operate application gateways also have at least **Microsoft.Network/virtualNetworks/subnets/join/action** permission on the virtual network or subnet. This validation also applies to the [managed identities for Application Gateway Ingress Controller](./tutorial-ingress-controller-add-on-new.md#deploy-an-aks-cluster-with-the-add-on-enabled).

You can use the built-in roles, such as [Network contributor](../role-based-access-control/built-in-roles.md#network-contributor), which already support this permission. If a built-in role doesn't provide the right permission, you can [create and assign a custom role](../role-based-access-control/custom-roles-portal.md). Learn more about [managing subnet permissions](../virtual-network/virtual-network-manage-subnet.md#permissions).

> [!NOTE]
> You might have to allow sufficient time for [Azure Resource Manager cache refresh](../role-based-access-control/troubleshooting.md?tabs=bicep#symptom---role-assignment-changes-are-not-being-detected) after role assignment changes.

#### Identify affected users or service principals for your subscription

By visiting Azure Advisor for your account, you can verify if your subscription has any users or service principals with insufficient permission. The details of that recommendation are:

**Title**: Update VNet permission of Application Gateway users </br>
**Category**: Reliability </br>
**Impact**: High </br>

#### Use temporary Azure Feature Exposure Control (AFEC) flag

As a temporary extension, we introduced a subscription-level [Azure Feature Exposure Control (AFEC)](../azure-resource-manager/management/preview-features.md?tabs=azure-portal). You can register for the AFEC and use it until you fix the permissions for all your users and service principals. Register for the feature by following the same steps as a [preview feature registration](../azure-resource-manager/management/preview-features.md?#required-access) for your Azure subscription.

**Name**: Microsoft.Network/DisableApplicationGatewaySubnetPermissionCheck </br>
**Description**: Disable Application Gateway Subnet Permission Check </br>
**ProviderNamespace**: Microsoft.Network </br>
**EnrollmentType**: AutoApprove </br>

> [!NOTE]
> We suggest using the AFEC provision only as interim mitigation until you assign the correct permission. You must prioritize fixing the permissions for all the applicable users (and service principals) and then unregister this AFEC flag to reintroduce the permission verification on the virtual network resource. We recommend that you don't depend on this AFEC method permanently because it will be removed in the future.

## Azure Virtual Network Manager

Azure Virtual Network Manager is a management service that allows you to group, configure, deploy, and manage virtual networks globally across subscriptions. With Virtual Network Manager, you can define network groups to identify and logically segment your virtual networks. After that, you can determine the connectivity and security configurations you want and apply them across all the selected virtual networks in network groups at once.

Azure Virtual Network Manager's security admin rule configuration allows you to define security policies at scale and apply them to multiple virtual networks at once.

> [!NOTE]
> Security admin rules of Azure Virtual Network Manager apply to Application Gateway subnets that only contain application gateways that have [Network Isolation](Application-gateway-private-deployment.md) enabled. Subnets that have any application gateway that doesn't have [Network Isolation](Application-gateway-private-deployment.md) enabled won't have security admin rules.

## Network security groups

You can use NSGs for your Application Gateway subnet, but be aware of some key points and restrictions.

> [!IMPORTANT]
> These NSG limitations are relaxed when you use [Private Application Gateway deployment (preview)](application-gateway-private-deployment.md#network-security-group-control).

### Required security rules

To use an NSG with your application gateway, you need to create or retain some essential security rules. You may set their priority in the same order.

#### Inbound rules

**Client traffic**: Allow incoming traffic from the expected clients (as source IP or IP range), and for the destination as your application gateway's entire subnet IP prefix and inbound access ports. For example, if you have listeners configured for ports 80 and 443, you must allow these ports. You can also set this rule to `Any`.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|`<as per need>`|Any|`<Subnet IP Prefix>`|`<listener ports>`|TCP|Allow|

After you configure *active public and private listeners* (with rules) *with the same port number*, your application gateway changes the **Destination** of all inbound flows to the frontend IPs of your gateway. This change occurs even for listeners that aren't sharing any port. You must include your gateway's frontend public and private IP addresses in the **Destination** of the inbound rule when you use the same port configuration.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|`<as per need>`|Any|`<Public and Private<br/>frontend IPs>`|`<listener ports>`|TCP|Allow|

**Infrastructure ports**: Allow incoming requests from the source as the **GatewayManager** service tag and **Any** destination. The destination port range differs based on SKU and is required for communicating the status of the backend health. These ports are protected/locked down by Azure certificates. External entities can't initiate changes on those endpoints without appropriate certificates in place.

- **V2**: Ports 65200-65535
- **V1**: Ports 65503-65534

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|GatewayManager|Any|Any|`<as per SKU given above>`|TCP|Allow|

**Azure Load Balancer probes**: Allow incoming traffic from the source as the **AzureLoadBalancer** service tag. This rule is created by default for [NSGs](../virtual-network/network-security-groups-overview.md). You must not override it with a manual **Deny** rule to ensure smooth operations of your application gateway.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|AzureLoadBalancer|Any|Any|Any|Any|Allow|

You can block all other incoming traffic by using a **Deny All** rule.

#### Outbound rules

**Outbound to the internet**: Allow outbound traffic to the internet for all destinations. This rule is created by default for [NSGs](../virtual-network/network-security-groups-overview.md). You must not override it with a manual **Deny** rule to ensure smooth operations of your application gateway. Outbound NSG rules that deny any outbound connectivity must not be created.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|Any|Any|Internet|Any|Any|Allow|

## Supported user-defined routes

Fine-grain control over the Application Gateway subnet via route table rules is possible in public preview. For more information, see [Private Application Gateway deployment (preview)](application-gateway-private-deployment.md#route-table-control).

With current functionality, there are some restrictions:

> [!IMPORTANT]
> Using UDRs on the Application Gateway subnet might cause the health status in the [backend health view](application-gateway-backend-health.md) to appear as **Unknown**. It also might cause generation of Application Gateway logs and metrics to fail. We recommend not using UDRs on the Application Gateway subnet so that you can view the backend health, logs, and metrics.

For the v1 SKU, UDRs are supported on the Application Gateway subnet if they don't alter end-to-end request/response communication. For example, you can set up a UDR in the Application Gateway subnet to point to a firewall appliance for packet inspection. But you must make sure that the packet can reach its intended destination after inspection. Failure to do so might result in incorrect health-probe or traffic-routing behavior. Learned routes or default 0.0.0.0/0 routes that are propagated by Azure ExpressRoute or VPN gateways in the virtual network are also included.

For the v2 SKU, there are supported and unsupported scenarios.

### v2 supported scenarios

> [!WARNING]
> An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Ensure that all management/control plane traffic is sent directly to the internet and not through a virtual appliance. Logging, metrics, and CRL checks could also be affected.

**Scenario 1:** UDR to disable Border Gateway Protocol (BGP) route propagation to the Application Gateway subnet

Sometimes the default gateway route (0.0.0.0/0) is advertised via the ExpressRoute or VPN gateways associated with the Application Gateway virtual network. This behavior breaks management plane traffic, which requires a direct path to the internet. In such scenarios, you can use a UDR to disable BGP route propagation.

To disable BGP route propagation:

1. Create a route table resource in Azure.
1. Disable the **Virtual network gateway route propagation** parameter.
1. Associate the route table to the appropriate subnet.

Enabling the UDR for this scenario shouldn't break any existing setups.

**Scenario 2:** UDR to direct 0.0.0.0/0 to the internet

You can create a UDR to send 0.0.0.0/0 traffic directly to the internet.

**Scenario 3:** UDR for Azure Kubernetes Service (AKS) with kubenet

If you're using kubenet with AKS and Application Gateway Ingress Controller, you need a route table to allow traffic sent to the pods from Application Gateway to be routed to the correct node. You don't need to use a route table if you use Azure Container Networking Interface.

To use the route table to allow kubenet to work:

1. Go to the resource group created by AKS. The name of the resource group should begin with `MC_`.
1. Find the route table created by AKS in that resource group. The route table should be populated with the following information:
  
   - Address prefix should be the IP range of the pods you want to reach in AKS.
   - Next hop type should be virtual appliance.
   - Next hop address should be the IP address of the node hosting the pods.
1. Associate this route table to the Application Gateway subnet.

### v2 unsupported scenarios

**Scenario 1:** UDR for virtual appliances

Any scenario where 0.0.0.0/0 needs to be redirected through a virtual appliance, a hub/spoke virtual network, or on-premises (forced tunneling) isn't supported for v2.

## Next steps

- [Learn about frontend IP address configuration](configuration-frontend-ip.md)
- [Learn about private Application Gateway deployment](application-gateway-private-deployment.md)
