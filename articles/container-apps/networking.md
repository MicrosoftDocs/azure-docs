---
title: Networking in Azure Container Apps environment
description: Learn how to configure virtual networks in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - ignite-2024
ms.topic:  conceptual
ms.date: 08/29/2023
ms.author: cshoe
---

# Networking in Azure Container Apps environment

Azure Container Apps run in the context of an [environment](environment.md), with its own virtual network (VNet).

By default, your Container App environment is created with a VNet that is automatically generated for you. For fine-grained control over your network, you can provide an [existing VNet](vnet-custom.md) when you create an environment. Once you create an environment with either a generated or existing VNet, the network type can't be changed.

Generated VNets take on the following characteristics.

They are:

- inaccessible to you as they're created in Microsoft's tenant
- publicly accessible over the internet
- only able to reach internet accessible endpoints

Further, they only support a limited subset of networking capabilities such as ingress IP restrictions and container app level ingress controls.

Use an existing VNet if you need more Azure networking features such as:

- Integration with Application Gateway
- Network Security Groups
- Communication with resources behind private endpoints in your virtual network

The available VNet features depend on your environment selection.

## Environment selection

Container Apps has two different [environment types](environment.md#types), which share many of the same networking characteristics with some key differences.

| Environment type | Supported plan types | Description | 
|---|---|---|
| Workload profiles | Consumption, Dedicated | Supports user defined routes (UDR), egress through NAT Gateway, and creating private endpoints on the container app environment. The minimum required subnet size is `/27`. | 
| Consumption only | Consumption | Doesn't support user defined routes (UDR), egress through NAT Gateway, peering through a remote gateway, or other custom egress. The minimum required subnet size is `/23`. | 

## Virtual IP

Depending on your virtual IP configuration, you can control whether your container app environment allows public ingress or ingress only from within your VNet at the environment level. This configuration cannot be changed after your environment is created.

| Accessibility level | Description |
|---|---|
| External | Allows your container app to accept public requests. External environments are deployed with a virtual IP on an external, internet-accessible IP address. |
| Internal | Internal environments have no public endpoints and are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the custom VNet's list of private IP addresses. |

## Custom VNet configuration

As you create a custom VNet, keep in mind the following situations:

- If you want your container app to restrict all outside access, create an internal Container Apps environment.

- If you use your own VNet, you need to provide a subnet that is dedicated exclusively to the Container App environment you deploy. This subnet isn't available to other services.

- Network addresses are assigned from a subnet range you define as the environment is created.

  - You can define the subnet range used by the Container Apps environment.

  - You can restrict inbound requests to the environment exclusively to the VNet by deploying the environment as internal.

> [!NOTE]
> When you provide your own virtual network, additional [managed resources](networking.md#managed-resources) are created. These resources incur costs at their associated rates.

As you begin to design the network around your container app, refer to [Plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md).

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Diagram of how Azure Container Apps environments use an existing V NET, or you can provide your own.":::

> [!NOTE]
> Moving VNets among different resource groups or subscriptions is not allowed if the VNet is in use by a Container Apps environment.

## HTTP edge proxy behavior

Azure Container Apps uses the [Envoy proxy](https://www.envoyproxy.io/) as an edge HTTP proxy. Transport Layer Security (TLS) is terminated on the edge and requests are routed based on their traffic splitting rules and routes traffic to the correct application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters.

Downstream connections support HTTP1.1 and HTTP2 and Envoy automatically detects and upgrades connections if the client connection requires an upgrade.

Upstream connections are defined by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

### Ingress configuration

Under the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- **Accessibility level**: You can set your container app as externally or internally accessible in the environment. An environment variable `CONTAINER_APP_ENV_DNS_SUFFIX` is used to automatically resolve the fully qualified domain name (FQDN) suffix for your environment. When communicating between container apps within the same environment, you may also use the app name. For more information on how to access your apps, see [Ingress in Azure Container Apps](./ingress-overview.md#domain-names).

- **Traffic split rules**: You can define traffic splitting rules between different revisions of your application.  For more information, see [Traffic splitting](traffic-splitting.md).

For more information about different networking scenarios, see [Ingress in Azure Container Apps](ingress-overview.md).

## Portal dependencies

For every app in Azure Container Apps, there are two URLs.

The Container Apps runtime initially generates a fully qualified domain name (FQDN) used to access your app. See the *Application Url* in the *Overview* window of your container app in the Azure portal for the FQDN of your container app.

A second URL is also generated for you. This location grants access to the log streaming service and the console. If necessary, you may need to add `https://azurecontainerapps.dev/` to the allowlist of your firewall or proxy.

## Ports and IP addresses

The following ports are exposed for inbound connections.

| Protocol | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |

IP addresses are broken down into the following types:

| Type | Description |
|--|--|
| Public inbound IP address | Used for application traffic in an external deployment, and management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. Outbound IPs may change over time. Using a NAT gateway or other proxy for outbound traffic from a Container Apps environment is only supported in a [workload profiles environment](workload-profiles-overview.md). |
| Internal load balancer IP address | This address only exists in an [internal environment](#virtual-ip). |

## Subnet

Virtual network integration depends on a dedicated subnet. How IP addresses are allocated in a subnet and what subnet sizes are supported depends on which [plan](plans.md) you're using in Azure Container Apps.

Select your subnet size carefully. Subnet sizes can't be modified after you create a Container Apps environment.

Different environment types have different subnet requirements:

# [Workload profiles environment](#tab/workload-profiles-env)

- `/27` is the minimum subnet size required for virtual network integration.

- Your subnet must be delegated to `Microsoft.App/environments`.

- When using an external environment with external ingress, inbound traffic routes through the infrastructure’s public IP rather than through your subnet.

- Container Apps automatically reserves 12 IP addresses for integration with the subnet. The number of IP addresses required for infrastructure integration doesn't vary based on the scale demands of the environment. Additional IP addresses are allocated according to the following rules depending on the type of workload profile you are using more IP addresses are allocated depending on your environment's workload profile:

  - [Dedicated workload profile](workload-profiles-overview.md#profile-types): As your container app scales out, each node has one IP address assigned.

  - [Consumption workload profile](workload-profiles-overview.md#profile-types): Each IP address may be shared among multiple replicas. When planning for how many IP addresses are required for your app, plan for 1 IP address per 10 replicas. 

- When you make a [change to a revision](revisions.md#revision-scope-changes) in single revision mode, the required address space is doubled for a short period of time in order to support zero downtime deployments. This affects the real, available supported replicas or nodes for a given subnet size. The following table shows both the maximum available addresses per CIDR block and the effect on horizontal scale.

    | Subnet Size | Available IP Addresses<sup>1</sup> | Max nodes (Dedicated workload profile)<sup>2</sup>| Max replicas (Consumption workload profile)<sup>2</sup> |
    |--|--|--|--|
    | /23 | 500 | 250 | 2,500 |
    | /24 | 244 | 122 | 1,220 |
    | /25 | 116 | 58 | 580 |
    | /26 | 52 | 26 | 260 |
    | /27 | 20 | 10 | 100 |
    
    <sup>1</sup> The available IP addresses are the size of the subnet minus the 12 IP addresses required for Azure Container Apps infrastructure.  
    <sup>2</sup> This is accounting for apps in single revision mode.  

# [Consumption only environment](#tab/consumption-only-env)

- `/23` is the minimum subnet size required for virtual network integration.

- Your subnet must not be delegated to any services.

- The Container Apps runtime reserves a minimum of 60 IPs for infrastructure in your VNet. The reserved amount may increase up to 256 addresses as apps in your environment scale.

- As your apps scale, a new IP address is allocated for each new replica.

- When you make a [change to a revision](revisions.md#revision-scope-changes) in single revision mode, the required address space is doubled for a short period of time in order to support zero downtime deployments. This affects the real, available supported replicas for a given subnet size.

---


### Subnet address range restrictions

# [Workload profiles environment](#tab/workload-profiles-env)

Subnet address ranges can't overlap with the following ranges reserved by Azure Kubernetes Services:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

In addition, a workload profiles environment reserves the following addresses:

- 100.100.0.0/17
- 100.100.128.0/19
- 100.100.160.0/19
- 100.100.192.0/19

# [Consumption only environment](#tab/consumption-only-env)

Subnet address ranges can't overlap with the following ranges reserved by Azure Kubernetes Services:

- 169.254.0.0/16
- 172.30.0.0/16
- 172.31.0.0/16
- 192.0.2.0/24

If you created your container apps environment with a custom service CIDR, make sure your container app's subnet (or any peered subnet) doesn't conflict with your custom service CIDR range.

---

### Subnet configuration with CLI

As a Container Apps environment is created, you provide resource IDs for a single subnet.

If you're using the CLI, the parameter to define the subnet resource ID is `infrastructure-subnet-resource-id`. The subnet hosts infrastructure components and user app containers.

If you're using the Azure CLI with a Consumption only environment and the [platformReservedCidr](vnet-custom.md#networking-parameters) range is defined, the subnet must not overlap with the IP range defined in `platformReservedCidr`.

## Routes

<a name="udr"></a>

### User defined routes (UDR)

User Defined Routes (UDR) and controlled egress through NAT Gateway are supported in the workload profiles environment. In the Consumption only environment, these features aren't supported.

> [!NOTE]
> When using UDR with Azure Firewall in Azure Container Apps, you need to add certain FQDNs and service tags to the allowlist for the firewall. To learn more, see [configuring UDR with Azure Firewall](./networking.md#configuring-udr-with-azure-firewall).

- You can use UDR with workload profiles environments to restrict outbound traffic from your container app through Azure Firewall or other network appliances.

- Configuring UDR is done outside of the Container Apps environment scope.

:::image type="content" source="media/networking/udr-architecture.png" alt-text="Diagram of how UDR is implemented for Container Apps.":::

Azure creates a default route table for your virtual networks upon create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. For example, you can create a UDR that routes all traffic to the firewall.

#### Configuring UDR with Azure Firewall

User defined routes are only supported in a workload profiles environment. The following application and network rules must be added to the allowlist for your firewall depending on which resources you're using.

> [!NOTE]
> For a guide on how to set up UDR with Container Apps to restrict outbound traffic with Azure Firewall, visit the [how to for Container Apps and Azure Firewall](./user-defined-routes.md).

##### Application rules

Application rules allow or deny traffic based on the application layer. The following outbound firewall application rules are required based on scenario.

| Scenarios | FQDNs | Description |
|--|--|--|
| All scenarios | `mcr.microsoft.com`, `*.data.mcr.microsoft.com` | These FQDNs for Microsoft Container Registry (MCR) are used by Azure Container Apps and either these application rules or the network rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | *Your-ACR-address*, `*.blob.core.windows.net`, `login.microsoft.com` | These FQDNs are required when using Azure Container Apps with ACR and Azure Firewall. |
| Azure Key Vault | *Your-Azure-Key-Vault-address*, `login.microsoft.com` | These FQDNs are required in addition to the service tag required for the network rule for Azure Key Vault. |
| Managed Identity | `*.identity.azure.net`, `login.microsoftonline.com`, `*.login.microsoftonline.com`, `*.login.microsoft.com` | These FQDNs are required when using managed identity with Azure Firewall in Azure Container Apps.
| Docker Hub Registry | `hub.docker.com`, `registry-1.docker.io`, `production.cloudflare.docker.com` | If you're using [Docker Hub registry](https://docs.docker.com/desktop/allow-list/) and want to access it through the firewall, you need to add these FQDNs to the firewall. |

##### Network rules

Network rules allow or deny traffic based on the network and transport layer. The following outbound firewall network rules are required based on scenario.

| Scenarios | Service Tag | Description |
|--|--|--|
| All scenarios | `MicrosoftContainerRegistry`, `AzureFrontDoorFirstParty`  | These Service Tags for Microsoft Container Registry (MCR) are used by Azure Container Apps and either these network rules or the application rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | `AzureContainerRegistry`, `AzureActiveDirectory` | When using ACR with Azure Container Apps, you need to configure these application rules used by Azure Container Registry. |
| Azure Key Vault | `AzureKeyVault`, `AzureActiveDirectory` | These service tags are required in addition to the FQDN for the application rule for Azure Key Vault. |
| Managed Identity | `AzureActiveDirectory` | When using Managed Identity with Azure Container Apps, you'll need to configure these application rules used by Managed Identity. | 

> [!NOTE]
> For Azure resources you are using with Azure Firewall not listed in this article, please refer to the [service tags documentation](../virtual-network/service-tags-overview.md#available-service-tags).

<a name="nat"></a>

### NAT gateway integration

You can use NAT Gateway to simplify outbound connectivity for your outbound internet traffic in your virtual network in a workload profiles environment.

When you configure a NAT Gateway on your subnet, the NAT Gateway provides a static public IP address for your environment. All outbound traffic from your container app is routed through the NAT Gateway's static public IP address.

### <a name="public-network-access"></a>Public network access (preview)

The public network access setting determines whether your container apps environment is accessible from the public Internet. Whether you can change this setting after creating your environment depends on the environment's virtual IP configuration. The following table shows valid values for public network access, depending on your environment's virtual IP configuration.

| Virtual IP | Supported public network access | Description |
|--|--|--|
| External | `Enabled`, `Disabled`  | The container apps environment was created with an Internet-accessible endpoint. The public network access setting determines whether traffic is accepted through the public endpoint or only through private endpoints, and the public network access setting can be changed after creating the environment. |
| Internal | `Disabled` | The container apps environment was created without an Internet-accessible endpoint. The public network access setting cannot be changed to accept traffic from the Internet. |

In order to create private endpoints on your Azure Container App environment, public network access must be set to `Disabled`.

Azure networking policies are supported with the public network access flag.

### <a name="private-endpoint"></a>Private endpoint (preview)

> [!NOTE]
> This feature is supported for all public regions. Government and China regions are not supported.

Azure private endpoint enables clients located in your private network to securely connect to your Azure Container Apps environment through Azure Private Link. A private link connection eliminates exposure to the public internet. Private endpoints use a private IP address in your Azure virtual network address space. 

This feature is supported for both Consumption and Dedicated plans in workload profile environments.

#### Tutorials
- To learn more about how to configure private endpoints in Azure Container Apps, see the [Use a private endpoint with an Azure Container Apps environment](how-to-use-private-endpoint.md) tutorial.
- Private link connectivity with Azure Front Door is supported for Azure Container Apps. Refer to [create a private link with Azure Front Door](how-to-integrate-with-azure-front-door.md) for more information.

#### Considerations
- Private endpoints on Azure Container Apps only support inbound HTTP traffic. TCP traffic is not supported.
- To use a private endpoint with a custom domain and an *Apex domain* as the *Hostname record type*, you must configure a private DNS zone with the same name as your public DNS. In the record set, configure your private endpoint's private IP address instead of the container app environment's IP address. When you configure your custom domain with CNAME, the setup is unchanged. For more information, see [Set up custom domain with existing certificate](custom-domains-certificates.md).
- Your private endpoint's VNet can be separate from the VNet integrated with your container app.
- You can add a private endpoint to both new and existing workload profile environments.

In order to connect to your container apps through a private endpoint, you must configure a private DNS zone.

| Service | subresource | Private DNS zone name |
|--|--|--|
| Azure Container Apps (Microsoft.App/ManagedEnvironments) | managedEnvironment | private link.{regionName}.azurecontainerapps.io |

### Environment security

> [!NOTE]
> To control ingress traffic, you can also [use private endpoints with a private connection to Azure Front Door](how-to-integrate-with-azure-front-door.md) in place of Application Gateway. This feature is in preview.

:::image type="content" source="media/networking/locked-down-network.png" alt-text="Diagram of how to fully lock down your network for Container Apps.":::

You can fully secure your ingress and egress networking traffic workload profiles environment by taking the following actions:

- Create your internal container app environment in a workload profiles environment. For steps, refer to [Manage workload profiles with the Azure CLI](./workload-profiles-manage-cli.md#create).

- Integrate your Container Apps with an [Application Gateway](./waf-app-gateway.md).

- Configure UDR to route all traffic through [Azure Firewall](./user-defined-routes.md).

## <a name="peer-to-peer-encryption"></a> Peer-to-peer encryption in the Azure Container Apps environment

Azure Container Apps supports peer-to-peer TLS encryption within the environment. Enabling this feature encrypts all network traffic within the environment with a private certificate that is valid within the Azure Container Apps environment scope. These certificates are automatically managed by Azure Container Apps. 

> [!NOTE]
> By default, peer-to-peer encryption is disabled. Enabling peer-to-peer encryption for your applications may increase response latency and reduce maximum throughput in high-load scenarios.

The following example shows an environment with peer-to-peer encryption enabled.
:::image type="content" source="media/networking/peer-to-peer-encryption-traffic-diagram.png" alt-text="Diagram of how traffic is encrypted/decrypted with peer-to-peer encryption enabled.":::

<sup>1</sup> Inbound TLS traffic is terminated at the ingress proxy on the edge of the environment.

<sup>2</sup> Traffic to and from the ingress proxy within the environment is TLS encrypted with a private certificate and decrypted by the receiver. 

<sup>3</sup> Calls made from app A to app B's FQDN are first sent to the edge ingress proxy, and are TLS encrypted. 

<sup>4</sup> Calls made from app A to app B using app B's app name are sent directly to app B and are TLS encrypted. Calls between apps and [Java components](./java-overview.md#java-components-support) are treated in the same way as app to app communication and TLS encrypted.

Applications within a Container Apps environment are automatically authenticated. However, the Container Apps runtime doesn't support authorization for access control between applications using the built-in peer-to-peer encryption.

When your apps are communicating with a client outside of the environment, two-way authentication with mTLS is supported. To learn more, see [configure client certificates](client-certificate-authorization.md).

# [Azure CLI](#tab/azure-cli)

You can enable peer-to-peer encryption using the following commands.

On create:

```azurecli
az containerapp env create \
    --name <environment-name> \
    --resource-group <resource-group> \
    --location <location> \
    --enable-peer-to-peer-encryption
```

For an existing container app:

```azurecli
az containerapp env update \
    --name <environment-name> \
    --resource-group <resource-group> \
    --enable-peer-to-peer-encryption
```

# [ARM template](#tab/arm-template)

You can enable mTLS in the ARM template for Container Apps environments using the following configuration.

```json
{
  ...
  "properties": {
       "peerTrafficConfiguration":{
            "encryption": {
                "enabled": "true|false"
            }
        }
  ...
}
```

---

## DNS

- **Custom DNS**: If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. [Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses this IP address to resolve requests. When configuring your NSG or firewall, don't block the `168.63.129.16` address, otherwise, your Container Apps environment won't function correctly.

- **VNet-scope ingress**: If you plan to use VNet-scope [ingress](ingress-overview.md) in an internal environment, configure your domains in one of the following ways:

    1. **Non-custom domains**: If you don't plan to use a custom domain, create a private DNS zone that resolves the Container Apps environment's default domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server. If you use Azure Private DNS, create a private DNS Zone named as the Container App environment’s default domain (`<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`), with an `A` record. The `A` record contains the name `*<DNS Suffix>` and the static IP address of the Container Apps environment. For more information see [Create and configure an Azure Private DNS zone](waf-app-gateway.md#create-and-configure-an-azure-private-dns-zone).

    1. **Custom domains**: If you plan to use custom domains and are using an external Container Apps environment, use a publicly resolvable domain to [add a custom domain and certificate](./custom-domains-certificates.md#add-a-custom-domain-and-certificate) to the container app. If you are using an internal Container Apps environment, there is no validation for the DNS binding, as the cluster can only be accessed from within the virtual network. Additionally, create a private DNS zone that resolves the apex domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server. If you use Azure Private DNS, create a Private DNS Zone named as the apex domain, with an `A` record that points to the static IP address of the Container Apps environment.

The static IP address of the Container Apps environment is available in the Azure portal in  **Custom DNS suffix** of the container app page or using the Azure CLI `az containerapp env list` command.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform. Don't modify the services in this group or the resource group itself.

### Workload profiles environment

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `ME_` by default, and the resource group name *can* be customized as you create your container app environment.

For external environments, the resource group contains a public IP address used specifically for inbound connectivity to your external environment and a load balancer. For internal environments, the resource group only contains a [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress if using an internal or external environment, plus one standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for ingress if using an external environment. If you need more public IPs for egress due to SNAT issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- One standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

- The cost of data processed (in GBs) includes both ingress and egress for management operations.

### Consumption only environment

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `MC_` by default, and the resource group name *can't* be customized when you create a container app. The resource group contains public IP addresses used specifically for outbound connectivity from your environment and a load balancer.

In addition to the standard [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress. If you need more IPs for egress due to Source Network Address Translation (SNAT) issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- Two standard [load balancers](https://azure.microsoft.com/pricing/details/load-balancer/) if using an internal environment, or one standard [load balancer](https://azure.microsoft.com/pricing/details/load-balancer/) if using an external environment. Each load balancer has fewer than six rules. The cost of data processed (in GBs) includes both ingress and egress for management operations.

## Next steps

- [Use a custom virtual network](vnet-custom.md)
