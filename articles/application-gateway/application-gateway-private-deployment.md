---
title: Private Application Gateway deployment (preview)
titleSuffix: Azure Application Gateway
description: Learn how to restrict access to Application Gateway
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: how-to
ms.date: 01/26/2023
ms.author: greglin
#Customer intent: As an administrator, I want to evaluate Azure Private Application Gateway
---

# Private Application Gateway deployment (preview)

## Introduction

Historically, Application Gateway v2 SKUs, and to a certain extend v1, has required public IP addressing to enable management of the service.  This has required several limitations in using fine-grain controls in Network Security Groups and Route Tables.  Specifically, the following challenges have been observed:

1. All Application Gateways v2 deployments must contain public facing frontend IP configuration to enable communication to the **Gateway Manager** service tag.
2. Network Security Group associations require rules to allow inbound access from GatewayManager and Outbound access to Internet.
3. When introducing a default route (0.0.0.0/0) to forward traffic anywhere other than the Internet, metrics, monitoring, and updates of the gateway result in a failed status.

Application Gateway v2 can now address each of these items to further eliminate risk of data exfiltration and control privacy of communication from within the virtual network. These changes include the following capabilities:

1. Private IP address only frontend IP configuration
   - No public IP address resource required
2. Elimination of inbound traffic from GatewayManager service tag via Network Security Group
3. Ability to define a _Deny All_ outbound NSG rule to restrict egress traffic to the Internet
4. Ability to override the default route to the internet (0.0.0.0/0)
5. DNS resolution via defined resolvers on the virtual network [Learn more](../virtual-network/manage-virtual-network.md#change-dns-servers), including private link private DNS zones.

Each of these features can be enabled independently. For example, a public IP address can be used to allow traffic inbound from the Internet and you can define a **_Deny All_** outbound rule in the network security group configuration to prevent data exfiltration. This is a valid configuration.

## Onboard to public preview

The functionality of the new controls of private IP frontend configuration, control over NSG rules, and control over route tables, are currently in public preview.  To join the public preview, you can opt-in to the experience using Azure PowerShell, Azure CLI, or REST API.

When you join the preview, all new gateways will begin to provision with the ability to enable any combination of the NSG, Route Table, or private IP configuration features.  If you wish to offboard from the new functionality and return to the current generally available functionality of Application Gateway, you may do so by [unregistering from the preview](#unregister-from-the-preview).

## Register to the preview

# [Azure Portal](#tab/portal)

Use the following steps to enroll into the public preview for the enhanced Application Gateway network controls via the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the search box, enter _subscriptions_ and select **Subscriptions**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/search.png" alt-text="Azure portal search.":::

3. Select the link for your subscription's name.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/subscriptions.png" alt-text="Select Azure subscription.":::

4. From the left menu, under **Settings** select **Preview features**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-menu.png" alt-text="Azure preview features menu.":::

5. You see a list of available preview features and your current registration status.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-list.png" alt-text="Azure portal list of preview features.":::

6. From **Preview features** type into the filter box **EnableApplicationGatewayNetworkIsolation**, check the feature, and click **Register**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/filter.png" alt-text="Azure portal filter preview features.":::

# [Azure PowerShell](#tab/powershell)

To enroll into the public preview for the enhanced Application Gateway network controls via Azure PowerShell, the following commands can be referenced:

```azurepowershell
Register-AzProviderFeature -FeatureName "EnableApplicationGatewayNetworkIsolation" -ProviderNamespace "Microsoft.Network"
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
FeatureName                                ProviderName        RegistrationState
-----------                                ------------        -----------------
EnableApplicationGatewayNetworkIsolation   Microsoft.Network   Registered
```

# [Azure CLI](#tab/cli)

To enroll into the public preview for the enhanced Application Gateway network controls via Azure CLI, the following commands can be referenced:

```azurecli
az feature register --name EnableApplicationGatewayNetworkIsolation --namespace Microsoft.Network
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
Name                                                        RegistrationState
----------------------------------------------------------  -------------------
Microsoft.Network/EnableApplicationGatewayNetworkIsolation  Registered
```

A list of all Azure CLI references for Private Link Configuration on Application Gateway can be found here: [Azure CLI CLI - Private Link](/cli/azure/network/application-gateway/private-link)

---

For more information about registering preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md)

## Unregister from the preview

# [Azure Portal](#tab/portal)

To opt-out of the public preview for the enhanced Application Gateway network controls via Portal, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the search box, enter _subscriptions_ and select **Subscriptions**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/search.png" alt-text="Azure portal search.":::

3. Select the link for your subscription's name.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/subscriptions.png" alt-text="Select Azure subscription.":::

4. From the left menu, under **Settings** select **Preview features**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-menu.png" alt-text="Azure preview features menu.":::

5. You see a list of available preview features and your current registration status.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/preview-features-list.png" alt-text="Azure portal list of preview features.":::

6. From **Preview features** type into the filter box **EnableApplicationGatewayNetworkIsolation**, check the feature, and click **Unregister**.

    :::image type="content" source="../azure-resource-manager/management/media/preview-features/filter.png" alt-text="Azure portal filter preview features.":::

# [Azure PowerShell](#tab/powershell)

To opt-out of the public preview for the enhanced Application Gateway network controls via Azure PowerShell, the following commands can be referenced:

```azurepowershell
Unregister-AzProviderFeature -FeatureName "EnableApplicationGatewayNetworkIsolation" -ProviderNamespace "Microsoft.Network"
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
FeatureName                                ProviderName        RegistrationState
-----------                                ------------        -----------------
EnableApplicationGatewayNetworkIsolation   Microsoft.Network   Unregistered
```

# [Azure CLI](#tab/cli)

To opt-out of the public preview for the enhanced Application Gateway network controls via Azure CLI, the following commands can be referenced:

```azurecli
az feature unregister --name EnableApplicationGatewayNetworkIsolation --namespace Microsoft.Network
```

To view registration status of the feature, use the Get-AzProviderFeature cmdlet.
```Output
Name                                                        RegistrationState
----------------------------------------------------------  -------------------
Microsoft.Network/EnableApplicationGatewayNetworkIsolation  Unregistered
```

A list of all Azure CLI references for Private Link Configuration on Application Gateway can be found here: [Azure CLI CLI - Private Link](/cli/azure/network/application-gateway/private-link)

---

For more information about registering preview features with Azrue CLI, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md)

## Regions and availability

The following regions are available for public preview.  Provisioning in regions outside of the list will result in error / failure:
-	Australia East
-	Australia Southeast
-	Brazil South
-	Canada Central
-	Canada East
-	Central India
-	Central US
-	East Asia
-	East US
-	East US 2
-	Japan East
-	North Central US
-	North Europe
-	Southeast Asia
-	South Central US
-	Switzerland North
-	UK South
-	West Central US
-	West Europe
-	West US
-	West US 2

## Configuration of network controls

After registration in to the public preview, configuration of NSG / Route Table / and private IP frontend configuration can be conducted via all experiences (REST API, ARM Template, Bicep deployment, Terraform, PowerShell, CLI, or Portal).  No API or command changes are introduced with this public preview.

## Resource Changes
Upon provisioning of your gateway, you will notice a resource tag is automatically provisioned with the name of **EnhancedNetworkControl** and value of **True**.
//Add Image Reference
The resource tag is cosmetic to confirm the gateway has been provisioned with the capabilities to configure any combination of the private only gateway features. Modification or deletion of the tag or value does not change any functional workings of the gateway. The tag can be helpful when existing Application Gateways were deployed in the subscription prior to feature enablement and you would like to differentiate which gateway can utilize the new functionality.	

## Network Security Group Control

Network security groups associated to an Application Gateway subnet no longer require inbound rules for GatewayManager, nor require outbound access to the internet.  The only required rule is Allow inbound from AzureLoadBalancer to ensure health probes can reach the gateway.

Here is an example of the most restrictive set of inbound rules, denying all traffic but Azure health probes.  In addition to the defined rules, explicit rules are defined to allow client traffic to reach the listener of the gateway.

// Add image reference

> [!Note]
> Application Gateway will provide an error asking to ensure the allow LoadBalanceRule is specified if a DenyAll rule inadvertently restricts access to health probes.


## Route Table Control

In the current offering of Application Gateway, association of a route table with a rule (or creation of rule) defined as 0.0.0.0/0 with a next hop as virtual appliance is unsupported to ensure proper management of Application Gateway.

After registration of the public preview feature, the ability to forward traffic to a virtual appliance is now possible via definition of a route table rule defining 0.0.0.0/0 with a next hop to Virtual Appliance.

Forced Tunneling, learning of 0.0.0.0/0 route through BGP advertising, will not affect Application Gateway health and be honored for traffic flow. This scenario may be applicable when using VPN, ExpressRoute, Route Server, or Virtual WAN.

## Limitations / Known Issues

While in public preview, the following limitations are known.

### Private link configuration (preview)

[Private link configuration](private-link.md) support for tunneling traffic through private endpoints to Application Gateway is unsupported with private only gateway.

### Private Endpoint Network Policy is unsupported

[Private endpoint network policy](../private-link/disable-private-endpoint-network-policy.md) applied to subnets containing Private Endpoints is unsupported for this preview.  If enabled, traffic from Application Gateway to Private Endpoints may be dropped, resulting in unhealthy backend health.  If the subnet is enabled for private endpoint network policy, you will need to provision a new subnet with private endpoint network policy disabled. Changed Enabled to Disabled on an existing subnet will still result in private endpoints dropping traffic.

### Private Endpoint connectivity via Global VNet Peering

If Application Gateway has a backend target or key vault reference to a private endpoint located in a vnet that is accessible via global vnet peering, traffic will be dropped and result in unhealthy status.

### Private IP frontend configuration only with AGIC

AGIC does not currently support private IP frontend only deployments.

### Backend Health status typo

If backend health is unknown due to DNS resolution or other reason, the error message will erroneously state that you need an NSG and to eliminate route tables. The message to require NSG rules or eliminate the UDR is incorrect and can be ignored. This issue will be fixed in a future release.

### Tags in Route Table Rules
If a tag is defined via Route Table, this may lead to provisioning failure of Application Gateway.

## Next steps

- See [Azure security baseline for Application Gateway](/security/benchmark/azure/baselines/application-gateway-security-baseline.md) for more security best practices.

