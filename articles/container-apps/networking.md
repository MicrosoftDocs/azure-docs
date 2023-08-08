---
title: Networking environment in Azure Container Apps
description: Learn how to configure virtual networks in Azure Container Apps.
services: container-apps
author: cachai
ms.service: container-apps
ms.topic:  conceptual
ms.date: 08/07/2023
ms.author: cachai
---

# Networking environment in Azure Container Apps

Azure Container Apps run in the context of an [environment](environment.md), with its own virtual network (VNet). By default, your Container App environment is created with a VNet that is automatically generated for you. For fine-grained control over your network, you can provide an existing VNet when you create an environment. Once you create an environment with either a generated or existing VNet, the network type can't be changed.

Generated VNets are inaccessible to you as they're created in Microsoft's tenant. The VNet is publicly accessible over the internet, can only reach internet accessible endpoints, and only supports a limited subset of networking capabilities such as ingress IP restrictions and container app level ingress controls.

Use an existing VNet if you need more Azure networking features such as:

- Integration with Application Gateway
- Network Security Groups
- Communicating with resources behind private endpoints in your virtual network

The features available depend on your environment selection.

## Environment selection

Container Apps features two [environment types](environment.md#types), which share many of the same networking characteristics with some key differences.

| Environment type | Description | Plan type |
|---|---|---|
| Workload profiles | Supports user defined routes (UDR) and egress through NAT Gateway. The minimum required subnet size is `/27`. | Consumption or dedicated |
| Consumption only | Doesn't support user defined routes (UDR) and egress through NAT Gateway. The minimum required subnet size is `/23`. | Consumption |

## Accessibility levels

You can configure whether your container app allows public ingress or only ingress from within your VNet at the environment level.

| Accessibility level | Description |
|---|---|
| [External](vnet-custom.md) | Allows your container app to accept public requests. External environments are deployed with a virtual IP on an external, public facing IP address. |
| [Internal](vnet-custom-internal.md) | Internal environments have no public endpoints and are deployed with a virtual IP (VIP) mapped to an internal IP address. The internal endpoint is an Azure internal load balancer (ILB) and IP addresses are issued from the custom VNet's list of private IP addresses. |

## Custom VNet configuration

As you create a custom VNet, keep in mind the following situations:

- If you want your container app to restrict all outside access, create an [internal Container Apps environment](vnet-custom-internal.md).

- When you provide your own VNet, you need to provide a subnet that is dedicated to the Container App environment you deploy. This subnet isn't available to other services.

- Network addresses are assigned from a subnet range you define as the environment is created.

  - You can define the subnet range used by the Container Apps environment.

  - You can restrict inbound requests to the environment exclusively to the VNet by deploying the environment as [internal](vnet-custom-internal.md).

> [!NOTE]
> When you provide your own virtual network, additional [managed resources](networking.md#managed-resources) are created, which incur billing.

As you begin to design the network around your container app, refer to [Plan virtual networks](../virtual-network/virtual-network-vnet-plan-design-arm.md).

:::image type="content" source="media/networking/azure-container-apps-virtual-network.png" alt-text="Diagram of how Azure Container Apps environments use an existing V NET, or you can provide your own.":::

> [!NOTE]
> Moving VNets among different resource groups or subscriptions is not supported if the VNet is in use by a Container Apps environment.

## HTTP edge proxy behavior

Azure Container Apps uses the [Envoy proxy](https://www.envoyproxy.io/) as an edge HTTP proxy. TLS is terminated on the edge and requests are routed based on their traffic splitting rules and routes traffic to the correct application.

HTTP applications scale based on the number of HTTP requests and connections. Envoy routes internal traffic inside clusters. Downstream connections support HTTP1.1 and HTTP2 and Envoy automatically detects and upgrades the connection if the client connection requires an upgrade. Upstream connections are defined by setting the `transport` property on the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) object.

### Ingress configuration

Under the [ingress](azure-resource-manager-api-spec.md#propertiesconfiguration) section, you can configure the following settings:

- **Accessibility level**: You can set your container app as externally or internally accessible in the environment. An environment variable `CONTAINER_APP_ENV_DNS_SUFFIX` is used to automatically resolve the fully qualified domain name (FQDN) suffix for your environment. When communicating between Container Apps within the same environment, you may also use the app name. For more information on how to access your apps, see [Ingress in Azure Container Apps](./ingress-overview.md#domain-names).

- **Traffic split rules**: You can define traffic splitting rules between different revisions of your application.  For more information, see [Traffic splitting](traffic-splitting.md).

For more information about different networking scenarios, see [Ingress in Azure Container Apps](ingress-overview.md).

## Portal dependencies

For every app in Azure Container Apps, there are two URLs.

The Container Apps runtime initially generates a fully qualified domain name (FQDN) used to access your app. See the *Application Url* in the *Overview* window of your container app in the Azure portal for the FQDN of your container app.

A second URL is also generated which grants access to the log streaming service and the console. If necessary, you may need to add `https://azurecontainerapps.dev/` to the allowlist of your firewall or proxy.

## Ports and IP addresses

The following ports are exposed for inbound connections.

| Use | Port(s) |
|--|--|
| HTTP/HTTPS | 80, 443 |

IP addresses are broken down into the following types:

| Type | Description |
|--|--|
| Public inbound IP address | Used for traffic in an external deployment, and management traffic in both internal and external deployments. |
| Outbound public IP | Used as the "from" IP for outbound connections that leave the virtual network. These connections aren't routed down a VPN. Outbound IPs aren't guaranteed and may change over time. Using a NAT gateway or other proxy for outbound traffic from a Container App environment is only supported on the workload profile environment. |
| Internal load balancer IP address | This address only exists in an internal deployment. |

## Subnet

Virtual network integration depends on a dedicated subnet. How IP addresses are allocated in a subnet and what subnet sizes are supported depends on which plan you're using in Azure Container Apps. Selecting an appropriately sized subnet for the scale of your Container Apps is important as subnet sizes can't be modified post creation in Azure.

- Workload profiles environment:

  - `/27` is the minimum subnet size required for virtual network integration.

  - The subnet you're integrating your container app with must be delegated to `Microsoft.App/environments`.

  - Container Apps automatically reserves 11 IP addresses for integration with the subnet. When your apps are running on workload profiles, the number of IP addresses required for infrastructure integration doesn't vary based on the scale of your container apps.

    - More IP addresses are allocated depending on your Container App's workload profile:

      - When you're using the Dedicated workload profile for your container app, each node has 1 IP address assigned.

      - When you're using Consumption workload profiles for your container app, the IP address assignment behaves the same as when running on the Consumption only environment. As your app scales, a new IP address is allocated for each new replica.

- Consumption only environment:

  - `/23` is the minimum subnet size required for virtual network integration.

  - Container Apps reserves a minimum of 60 IPs for infrastructure in your VNet, and the amount may increase up to 256 addresses as your container environment scales.

  - As your app scales, a new IP address is allocated for each new replica.

As a Container Apps environment is created, you provide resource IDs for a single subnet.

If you're using the CLI, the parameter to define the subnet resource ID is `infrastructure-subnet-resource-id`. The subnet hosts infrastructure components and user app containers.

In addition, if you're using the Azure CLI with a Consumption only environment and the [platformReservedCidr](vnet-custom-internal.md#networking-parameters) range is defined, both subnets must not overlap with the IP range defined in `platformReservedCidr`.

### Subnet address range restrictions

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

## Routes

User Defined Routes (UDR) and controlled egress through a NAT Gateway are only supported in the workload profiles environment.

### User defined routes (UDR) - preview

> [!NOTE]
> When using UDR with Azure Firewall in Azure Container Apps, you need to add certain FQDN's and service tags to the allowlist for the firewall. To learn more, see [configuring UDR with Azure Firewall](./networking.md#configuring-udr-with-azure-firewall---preview).

- You can use UDR a workload profile to restrict outbound traffic from your container app through Azure Firewall or other network appliances.
- Configuring UDR is done outside of the Container Apps environment scope.
- UDR isn't supported for external environments.

:::image type="content" source="media/networking/udr-architecture.png" alt-text="Diagram of how UDR is implemented for Container Apps.":::

Azure creates a default route table for your virtual networks upon create. By implementing a user-defined route table, you can control how traffic is routed within your virtual network. For example, you can create a UDR that routes all traffic to the firewall.

#### Configuring UDR with Azure Firewall - preview:

UDR is only supported on the workload profiles environment. The following application and network rules must be added to the allowlist for your firewall depending on which resources you're using.

> [!NOTE]
> For a guide on how to setup UDR with Container Apps to restrict outbound traffic with Azure Firewall, visit the [how to for Container Apps and Azure Firewall](./user-defined-routes.md).

##### Application rules

Application rules allow or deny traffic based on the application layer. The following outbound firewall application rules are required based on scenario.

| Scenarios | FQDNs | Description |
|--|--|--|
| All scenarios | `mcr.microsoft.com`, `*.data.mcr.microsoft.com` | These FQDNs for Microsoft Container Registry (MCR) are used by Azure Container Apps and either these application rules or the network rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | *Your-ACR-address*, `*.blob.windows.net` | These FQDNs are required when using Azure Container Apps with ACR and Azure Firewall. |
| Azure Key Vault | *Your-Azure-Key-Vault-address*, `login.microsoft.com` | These FQDNs are required in addition to the service tag required for the network rule for Azure Key Vault. |
| Docker Hub Registry | `hub.docker.com`, `registry-1.docker.io`, `production.cloudflare.docker.com` | If you're using [Docker Hub registry](https://docs.docker.com/desktop/allow-list/) and want to access it through the firewall, you need to add these FQDNs to the firewall. |

##### Network rules

Network rules allow or deny traffic based on the network and transport layer. The following outbound firewall network rules are required based on scenario.

| Scenarios | Service Tag | Description |
|--|--|--|
| All scenarios | *MicrosoftContainerRegistry*, *AzureFrontDoorFirstParty*  | These Service Tags for Microsoft Container Registry (MCR) are used by Azure Container Apps and either these network rules or the application rules for MCR must be added to the allowlist when using Azure Container Apps with Azure Firewall. |
| Azure Container Registry (ACR) | *AzureContainerRegistry* | When using ACR with Azure Container Apps, you need to configure these application rules used by Azure Container Registry. |
| Azure Key Vault | *AzureKeyVault*, *AzureActiveDirectory* | These service tags are required in addition to the FQDN for the application rule for Azure Key Vault. |

> [!NOTE]
> For Azure resources you are using with Azure Firewall not listed in this article, please refer to the [service tags documentation](../virtual-network/service-tags-overview.md#available-service-tags).

### NAT gateway integration - preview

You can use NAT Gateway to simplify outbound connectivity for your outbound internet traffic in your virtual network on the workload profiles environment. NAT Gateway is used to provide a static public IP address, so when you configure NAT Gateway on your Container Apps subnet, all outbound traffic from your container app is routed through the NAT Gateway's static public IP address.

### Environment security

:::image type="content" source="media/networking/locked-down-network.png" alt-text="Diagram of how to fully lock down your network for Container Apps.":::

With the workload profiles environment, you can fully secure your ingress/egress networking traffic. To do so, you should use the following features:

- Create your internal container app environment in a workload profiles environment. For steps, refer to [Manage workload profiles with the Azure CLI](./workload-profiles-manage-cli.md).

- Integrate your Container Apps with an [Application Gateway](./waf-app-gateway.md).

- Configure UDR to route all traffic through [Azure Firewall](./user-defined-routes.md).

## <a name="mtls"></a> Environment level network encryption - preview

Azure Container Apps supports environment level network encryption using mutual transport layer security (mTLS). When end-to-end encryption is required, mTLS encrypts data transmitted between applications within an environment. Applications within a Container Apps environment are automatically authenticated. However, the Container Apps runtime doesn't support authorization for access control between applications using the built-in mTLS.

When your apps are communicating with a client outside of the environment, two-way authentication with mTLS is supported. To learn more see [configure client certificates](client-certificate-authorization.md).

> [!NOTE]
> Enabling mTLS for your applications may increase response latency and reduce maximum throughput in high-load scenarios.

# [Azure CLI](#tab/azure-cli)

You can enable mTLS using the following commands.

On create:

```azurecli
az containerapp env create \
    --name <environment-name> \
    --resource-group <resource-group> \
    --location <location> \
    --enable-mtls
```

For an existing container app:

```azurecli
az containerapp env update \
    --name <environment-name> \
    --resource-group <resource-group> \
    --enable-mtls
```

# [ARM template](#tab/arm-template)

You can enable mTLS in the ARM template for Container Apps environments using the following configuration.

```json
{
  ...
  "properties": {
       "peerAuthentication":{
            "mtls": {
                "enabled": "true|false"
            }
        }
  ...
}
```

---

## DNS

- **Custom DNS**: If your VNet uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. [Azure recursive resolvers](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) uses this IP address to resolve requests. When configuring your NSG or Firewall, don't block the `168.63.129.16` address, otherwise, your Container Apps environment won't function.

- **VNet-scope ingress**: If you plan to use VNet-scope [ingress](ingress-overview.md) in an internal Container Apps environment, configure your domains in one of the following ways:

    1. **Non-custom domains**: If you don't plan to use custom domains, create a private DNS zone that resolves the Container Apps environment's default domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server.  If you use Azure Private DNS, create a Private DNS Zone named as the Container App environment’s default domain (`<UNIQUE_IDENTIFIER>.<REGION_NAME>.azurecontainerapps.io`), with an `A` record. The A record contains the name `*<DNS Suffix>` and the static IP address of the Container Apps environment.

    1. **Custom domains**: If you plan to use custom domains, use a publicly resolvable domain to [add a custom domain and certificate](./custom-domains-certificates.md#add-a-custom-domain-and-certificate) to the container app. Additionally, create a private DNS zone that resolves the apex domain to the static IP address of the Container Apps environment. You can use [Azure Private DNS](../dns/private-dns-overview.md) or your own DNS server. If you use Azure Private DNS, create a Private DNS Zone named as the apex domain, with an `A` record that points to the static IP address of the Container Apps environment.

The static IP address of the Container Apps environment can be found in the Azure portal in  **Custom DNS suffix** of the container app page or using the Azure CLI `az containerapp env list` command.

## Managed resources

When you deploy an internal or an external environment into your own network, a new resource group is created in the Azure subscription where your environment is hosted. This resource group contains infrastructure components managed by the Azure Container Apps platform, and it shouldn't be modified.

### Consumption only environment

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `MC_` by default, and the resource group name *can't* be customized during container app creation. The resource group contains Public IP addresses used specifically for outbound connectivity from your environment and a load balancer.

In addition to the [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for egress. If you need more IPs for egress due to SNAT issues, [open a support ticket to request an override](https://azure.microsoft.com/support/create-ticket/).

- Two standard [Load Balancers](https://azure.microsoft.com/pricing/details/load-balancer/) if using an internal environment, or one standard [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) if using an external environment. Each load balancer has fewer than six rules. The cost of data processed (GB) includes both ingress and egress for management operations.

### Workload profiles environment

The name of the resource group created in the Azure subscription where your environment is hosted is prefixed with `ME_` by default, and the resource group name *can* be customized during container app environment creation. For external environments, the resource group contains a public IP address used specifically for inbound connectivity to your external environment and a load balancer. For internal environments, the resource group only contains a Load Balancer.

In addition to the [Azure Container Apps billing](./billing.md), you're billed for:

- One standard static [public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) for ingress in external environments and one standard [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).

- The cost of data processed (GB) includes both ingress and egress for management operations.

## Next steps

- [Deploy with an external environment](vnet-custom.md)
- [Deploy with an internal environment](vnet-custom-internal.md)
