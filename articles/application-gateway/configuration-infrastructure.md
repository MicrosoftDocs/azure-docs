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

The application gateway infrastructure includes the virtual network, subnets, network security groups, and user defined routes.

## Virtual network and dedicated subnet

An application gateway is a dedicated deployment in your virtual network. Within your virtual network, a dedicated subnet is required for the application gateway. You can have multiple instances of a given application gateway deployment in a subnet. You can also deploy other application gateways in the subnet. But you can't deploy any other resource in the application gateway subnet. You can't mix v1 and v2 Azure Application Gateway SKUs on the same subnet.

> [!NOTE]
> [Virtual network service endpoint policies](../virtual-network/virtual-network-service-endpoint-policies-overview.md) are currently not supported in an Application Gateway subnet.

### Size of the subnet

Application Gateway uses one private IP address per instance, plus another private IP address if a private frontend IP is configured.

Azure also reserves five IP addresses in each subnet for internal use: the first four and the last IP addresses. For example, consider 15 application gateway instances with no private frontend IP. You need at least 20 IP addresses for this subnet: five for internal use and 15 for the application gateway instances.

Consider a subnet that has 27 application gateway instances and an IP address for a private frontend IP. In this case, you need 33 IP addresses: 27 for the application gateway instances, one for the private front end, and five for internal use.

Application Gateway (Standard or WAF) SKU can support up to 32 instances (32 instance IP addresses + 1 private frontend IP configuration + 5 Azure reserved) – so a minimum subnet size of /26 is recommended

Application Gateway (Standard_v2 or WAF_v2 SKU) can support up to 125 instances (125 instance IP addresses + 1 private frontend IP configuration + 5 Azure reserved). A minimum subnet size of /24 is recommended.

To determine the available capacity of a subnet that has existing Application Gateways provisioned, take the size of the subnet and subtract the five reserved IP addresses of the subnet reserved by the platform.  Next, take each gateway and subtract the max-instance count.  For each gateway that has a private frontend IP configuration, subtract one additional IP address per gateway as well.

For example, here's how to calculate the available addressing for a subnet with three gateways of varying sizes:
- Gateway 1: Maximum of 10 instances; utilizes a private frontend IP configuration
- Gateway 2: Maximum of 2 instances; no private frontend IP configuration
- Gateway 3: Maximum of 15 instances; utilizes a private frontend IP configuration
- Subnet Size: /24

Subnet Size /24 = 256 IP addresses - 5 reserved from the platform = 251 available addresses.
251 - Gateway 1 (10) - 1 private frontend IP configuration = 240
240 - Gateway 2 (2) = 238
238 - Gateway 3 (15) - 1 private frontend IP configuration = 222

> [!IMPORTANT]
> Although a /24 subnet isn't required per Application Gateway v2 SKU deployment, it is highly recommended. This is to ensure that Application Gateway v2 has sufficient space for autoscaling expansion and maintenance upgrades. You should ensure that the Application Gateway v2 subnet has sufficient address space to accommodate the number of instances required to serve your maximum expected traffic. If you specify the maximum instance count, then the subnet should have capacity for at least that many addresses. For capacity planning around instance count, see [instance count details](understanding-pricing.md#instance-count).

> [!IMPORTANT]
> The subnet named "GatewaySubnet" is reserved for VPN gateways. The Application Gateway V1 resources using the "GatewaySubnet" subnet need to be moved to a different subnet  or migrated to V2 SKU before September 30, 2023 to avoid control plane failures and platform inconsistencies. For changing the subnet of an existing Application gateway, see [steps here](application-gateway-faq.yml#can-i-change-the-virtual-network-or-subnet-for-an-existing-application-gateway).

> [!TIP]
> IP addresses are allocated from the beginning of the defined subnet space for gateway instances. As instances are created and removed due to creation of gateways or scaling events, it can become difficult to understand what the next available address is in the subnet. To be able to determine the next address to use for a future gateway and have a contiguous addressing theme for frontend IPs, consider assigning frontend IP addresses from the upper half of the defined subset space. For example, if my subnet address space is 10.5.5.0/24, consider setting the private frontend IP configuration of your gateways starting with 10.5.5.254 and then following with 10.5.5.253, 10.5.5.252, 10.5.5.251, and so forth for future gateways.

> [!TIP]
> It is possible to change the subnet of an existing Application Gateway within the same virtual network. You can do this using Azure PowerShell or Azure CLI. For more information, see [Frequently asked questions about Application Gateway](application-gateway-faq.yml#can-i-change-the-virtual-network-or-subnet-for-an-existing-application-gateway)

### DNS Servers for name resolution

The virtual network resource supports [DNS server](../virtual-network/manage-virtual-network.md#view-virtual-networks-and-settings-using-the-azure-portal) configuration, allowing you to choose between Azure-provided default or Custom DNS servers. The instances of your application gateway also honor this DNS configuration for any name resolution. Thus, after you change this setting, you must restart ([Stop](/powershell/module/az.network/Stop-AzApplicationGateway) and [Start](/powershell/module/az.network/start-azapplicationgateway)) your application gateway for these changes to take effect on the instances.

> [!NOTE]
> If you use custom DNS servers in the Application Gateway VNet, the DNS server must be able to resolve public Internet names. This is required by Application Gateway.

### Virtual network permission 

Since the application gateway resource is deployed inside a virtual network, we also perform a check to verify the permission on the provided virtual network resource. This validation is performed during both creation and management operations. You should check your [Azure role-based access control](../role-based-access-control/role-assignments-list-portal.md) to verify the users (and service principals) that operate application gateways also have at least **Microsoft.Network/virtualNetworks/subnets/join/action** permission on the Virtual Network or Subnet. This validation also applies to the [Managed Identities for Application Gateway Ingress Controller](./tutorial-ingress-controller-add-on-new.md#deploy-an-aks-cluster-with-the-add-on-enabled).

You may use the built-in roles, such as [Network contributor](../role-based-access-control/built-in-roles.md#network-contributor), which already support this permission. If a built-in role doesn't provide the right permission, you can [create and assign a custom role](../role-based-access-control/custom-roles-portal.md). Learn more about [managing subnet permissions](../virtual-network/virtual-network-manage-subnet.md#permissions). 

> [!NOTE] 
> You may have to allow sufficient time for [Azure Resource Manager cache refresh](../role-based-access-control/troubleshooting.md?tabs=bicep#symptom---role-assignment-changes-are-not-being-detected) after role assignment changes.

#### Identifying affected users or service principals for your subscription
By visiting Azure Advisor for your account, you can verify if your subscription has any users or service principals with insufficient permission. The details of that recommendation are as follows:

**Title**: Update VNet permission of Application Gateway users </br>
**Category**: Reliability </br>
**Impact**: High </br>

#### Using temporary Azure Feature Exposure Control (AFEC) flag

As a temporary extension, we have introduced a subscription-level [Azure Feature Exposure Control (AFEC)](../azure-resource-manager/management/preview-features.md?tabs=azure-portal) that you can register for until you fix the permissions for all your users and/or service principals. Register for the given feature by following the same steps as a [preview feature registration](../azure-resource-manager/management/preview-features.md?#required-access) for your Azure subscription.

**Name**: Microsoft.Network/DisableApplicationGatewaySubnetPermissionCheck </br>
**Description**: Disable Application Gateway Subnet Permission Check </br>
**ProviderNamespace**: Microsoft.Network </br>
**EnrollmentType**: AutoApprove </br>

> [!NOTE]
> We suggest using this feature control (AFEC) provision only as interim mitigation until you assign the correct permission. You must prioritize fixing the permissions for all the applicable Users (and Service Principals) and then unregister this AFEC flag to reintroduce the permission verification on the Virtual Network resource. It is recommended not to permanently depend on this AFEC method, as it will be removed in the future.

## Azure Virtual Network Manager

Azure Virtual Network Manager is a management service that allows you to group, configure, deploy, and manage virtual networks globally across subscriptions. With Virtual Network Manager, you can define network groups to identify and logically segment your virtual networks. After that, you can determine the connectivity and security configurations you want and apply them across all the selected virtual networks in network groups at once. Azure Virtual Network Manager's security admin rule configuration allows you to define security policies at scale and apply them to multiple virtual networks at once. 

> [!NOTE]
> Security admin rules of Azure Virtual Network Manager apply to Application Gateway subnets that  only contain Application Gateways that have ["Network Isolation"](Application-gateway-private-deployment.md) enabled. Subnets that have any Application Gateway that  does not  have ["Network Isolation"](Application-gateway-private-deployment.md) enabled, will not have security admin rules.


## Network security groups

You can use Network security groups (NSGs) for your Application Gateway's subnet, but you should note some key points and restrictions.

> [!IMPORTANT]
> These NSG limitations are relaxed when using [Private Application Gateway deployment (Preview)](application-gateway-private-deployment.md#network-security-group-control).

### Required security rules

To use NSG with your application gateway, you will need to create or retain some essential security rules. You may set their priority in the same order.

**Inbound rules**

1. **Client traffic** - Allow incoming traffic from the expected clients (as source IP or IP range), and for the destination as your application gateway's entire subnet IP prefix and inbound access ports. (Example: If you have listeners configured for ports 80 & 443, you must allow these ports. You can also set this to Any).

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|`<as per need>`|Any|`<Subnet IP Prefix>`|`<listener ports>`|TCP|Allow|

Upon configuring **active public and private listeners** (with Rules) **with the same port number**, your application gateway changes the "Destination" of all inbound flows to the frontend IPs of your gateway. This is true even for the listeners not sharing any port. You must thus include your gateway's frontend Public and Private IP addresses in the Destination of the inbound rule when using the same port configuration.


| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|`<as per need>`|Any|`<Public and Private<br/>frontend IPs>`|`<listener ports>`|TCP|Allow|

2. **Infrastructure ports** - Allow incoming requests from the source as GatewayManager service tag and any destination. The destination port range differs based on SKU and is required for communicating the status of the Backend Health. (These ports are protected/locked down by Azure certificates. External entities can't initiate changes on those endpoints without appropriate certificates in place).
	- V2: Ports 65200-65535
	- V1: Ports 65503-65534 

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|GatewayManager|Any|Any|`<as per SKU given above>`|TCP|Allow|

3. **Azure Load Balancer probes** - Allow incoming traffic from the source as AzureLoadBalancer service tag. This rule is created by default for [network security group](../virtual-network/network-security-groups-overview.md), and you must not override it with a manual Deny rule to ensure smooth operations of your application gateway.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|AzureLoadBalancer|Any|Any|Any|Any|Allow|

You may block all other incoming traffic by using a deny-all rule.

**Outbound rules**

1. **Outbound to the Internet** - Allow outbound traffic to the Internet for all destinations. This rule is created by default for [network security group](../virtual-network/network-security-groups-overview.md), and you must not override it with a manual Deny rule to ensure smooth operations of your application gateway. Outbound NSG rules that deny any outbound connectivity must not be created.

| Source  | Source ports | Destination | Destination ports | Protocol | Access |
|---|---|---|---|---|---|
|Any|Any|Internet|Any|Any|Allow|

## Supported user-defined routes 

Fine grain control over the Application Gateway subnet via Route Table rules is possible in public preview. More details can be found [here](application-gateway-private-deployment.md#route-table-control).

With current functionality there are some restrictions: 

> [!IMPORTANT]
> Using UDRs on the Application Gateway subnet might cause the health status in the [backend health view](application-gateway-backend-health.md) to appear as **Unknown**. It also might cause generation of Application Gateway logs and metrics to fail. We recommend that you don't use UDRs on the Application Gateway subnet so that you can view the backend health, logs, and metrics.

- **v1**

   For the v1 SKU, user-defined routes (UDRs) are supported on the Application Gateway subnet, as long as they don't alter end-to-end request/response communication. For example, you can set up a UDR in the Application Gateway subnet to point to a firewall appliance for packet inspection. But you must make sure that the packet can reach its intended destination after inspection. Failure to do so might result in incorrect health-probe or traffic-routing behavior. This includes learned routes or default 0.0.0.0/0 routes that are propagated by Azure ExpressRoute or VPN gateways in the virtual network.

- **v2**

   For the v2 SKU, there are supported and unsupported scenarios:

   **v2 supported scenarios**
   > [!WARNING]
   > An incorrect configuration of the route table could result in asymmetrical routing in Application Gateway v2. Ensure that all management/control plane traffic is sent directly to the Internet and not through a virtual appliance. Logging, metrics, and CRL checks could also be affected.


  **Scenario 1**: UDR to disable Border Gateway Protocol (BGP) Route Propagation to the Application Gateway subnet

   Sometimes the default gateway route (0.0.0.0/0) is advertised via the ExpressRoute or VPN gateways associated with the Application Gateway virtual network. This breaks management plane traffic, which requires a direct path to the Internet. In such scenarios, a UDR can be used to disable BGP route propagation. 

   To disable BGP route propagation, use the following steps:

   1. Create a Route Table resource in Azure.
   2. Disable the **Virtual network gateway route propagation** parameter. 
   3. Associate the Route Table to the appropriate subnet. 

   Enabling the UDR for this scenario shouldn't break any existing setups.

  **Scenario 2**: UDR to direct 0.0.0.0/0 to the Internet

   You can create a UDR to send 0.0.0.0/0 traffic directly to the Internet. 

  **Scenario 3**: UDR for Azure Kubernetes Service with kubenet

  If you're using kubenet with Azure Kubernetes Service (AKS) and Application Gateway Ingress Controller (AGIC), you'll need a route table to allow traffic sent to the pods from Application Gateway to be routed to the correct node. This won't be necessary if you use Azure CNI. 

  To use the route table to allow kubenet to work, follow the steps below:

  1. Go to the resource group created by AKS (the name of the resource group should begin with "MC_")
  2. Find the route table created by AKS in that resource group. The route table should be populated with the following information:
     - Address prefix should be the IP range of the pods you want to reach in AKS. 
     - Next hop type should be Virtual Appliance. 
     - Next hop address should be the IP address of the node hosting the pods.
  3. Associate this route table to the Application Gateway subnet. 
    
  **v2 unsupported scenarios**

  **Scenario 1**: UDR for Virtual Appliances

  Any scenario where 0.0.0.0/0 needs to be redirected through any virtual appliance, a hub/spoke virtual network, or on-premises (forced tunneling) isn't supported for V2.

## Next steps

- [Learn about frontend IP address configuration](configuration-frontend-ip.md).
- [Learn about private Application Gateway deployment](application-gateway-private-deployment.md).
