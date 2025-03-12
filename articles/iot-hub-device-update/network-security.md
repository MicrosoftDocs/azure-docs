---
title: Azure Device Update for IoT Hub network security
description: Understand how Azure Device Update for IoT Hub uses service tags and private endpoints for network security when managing updates.
author: darkoa-msft
ms.author: darkoa
ms.date: 01/15/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub network security

This article describes how Azure Device Update for IoT Hub uses the following network security features to manage updates:

- Service tags in network security groups and Azure Firewall
- Private endpoints in Azure Virtual Network

> [!IMPORTANT]
> Device Update doesn't support disabling public network access in the linked IoT hub.

## Service tags

A service tag represents a group of IP address prefixes from a specific Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. For more information about service tags, see [Service tags overview](/azure/virtual-network/service-tags-overview).

You can use service tags to define network access controls on [network security groups](/azure/virtual-network/network-security-groups-overview#security-rules) or [Azure Firewall](/azure/firewall/service-tags). Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name, for example, `AzureDeviceUpdate`, in the appropriate `source` or `destination` field of a rule, you can allow or deny the traffic for the corresponding service.

| Service tag | Purpose | Inbound or outbound? | Can be regional? | Can use with Azure Firewall? |
| --- | -------- |:---:|:---:|:---:|
| AzureDeviceUpdate | Azure Device Update for IoT Hub | Both | No | Yes |

### Regional IP ranges

Because Azure IoT Hub IP rules don't support service tags, you must use `AzureDeviceUpdate` service tag IP prefixes instead. The tag is global, so the following table provides regional IP ranges for convenience.

The following IP prefixes are unlikely to change, but you should review the list monthly. **Location** means the location of the Device Update resources.

| Location | IP ranges |
| --- | --- |  
| Australia East | 20.211.71.192/26, 20.53.47.16/28, 20.70.223.192/26, 104.46.179.224/28, 20.92.5.128/25, 20.92.5.128/26 |
| East US | 20.119.27.192/26,  20.119.28.128/26,  20.62.132.240/28, 20.62.135.128/27, 20.62.135.160/28, 20.59.77.64/26, 20.59.81.64/26, 20.66.3.208/28 |
| East US 2 | 20.119.155.192/26, 20.62.59.16/28, 20.98.195.192/26, 20.40.229.32/28, 20.98.148.192/26, 20.98.148.64/26 |
| East US 2 EUAP | 20.47.236.192/26, 20.47.237.128/26, 20.51.20.64/28, 20.228.1.0/26, 20.45.241.192/26, 20.46.11.192/28 |
| North Europe | 20.223.64.64/26, 52.146.136.16/28, 52.146.141.64/26, 20.105.211.0/26, 20.105.211.192/26, 20.61.102.96/28, 20.86.93.128/26 |
| South Central US | 20.65.133.64/28, 20.97.35.64/26, 20.97.39.192/26, 20.125.162.0/26, 20.49.119.192/28, 20.51.7.64/26 |
| Southeast Asia | 20.195.65.112/28, 20.195.87.128/26, 20.212.79.64/26, 20.195.72.112/28, 20.205.49.128/26, 20.205.67.192/26 |
| Sweden Central | 20.91.144.0/26, 51.12.46.112/28, 51.12.74.192/26, 20.91.11.64/26, 20.91.9.192/26, 51.12.198.96/28 |
| UK South | 20.117.192.0/26, 20.117.193.64/26, 51.143.212.48/28, 20.58.67.0/28, 20.90.38.128/26, 20.90.38.64/26 |
| West Europe | 20.105.211.0/26, 20.105.211.192/26, 20.61.102.96/28, 20.86.93.128/26, 20.223.64.64/26, 52.146.136.16/28, 52.146.141.64/26 |
| West US 2 | 20.125.0.128/26, 20.125.4.0/25, 20.51.12.64/26, 20.83.222.128/26, 20.69.0.112/28, 20.69.4.128/26, 20.69.4.64/26, 20.69.8.192/26 |
| West US 3 | 20.118.138.192/26, 20.118.141.64/26, 20.150.244.16/28, 20.119.27.192/26, 20.119.28.128/26, 20.62.132.240/28, 20.62.135.128/27, 20.62.135.160/28 |

## Private endpoints

A [private endpoint](/azure/private-link/private-endpoint-overview) is a special network interface for an Azure service in your virtual network. A private endpoint allows secure traffic from your virtual network to your Device Update accounts over a [private link](/azure/private-link/private-link-overview), without going through the public internet.

A private endpoint for your Device Update account provides secure connectivity between clients on your virtual network and your Device Update account. The private endpoint is assigned an IP address from the IP address range of your virtual network. The connection between the private endpoint and Device Update services uses a secure private link.

![Diagram that shows the Device Update architecture using a private endpoint.](./media/network-security/architecture-diagram.png)

You can use private endpoints for your Device Update resources to:

- Securely access your Device Update account from a virtual network over the Microsoft backbone network instead of the public internet.
- Securely connect from on-premises networks that connect to the virtual network using virtual private network (VPN) or Azure ExpressRoute with private peering.

Creating a private endpoint for a Device Update account in your virtual network sends a consent request for approval to the resource owner. If the user requesting the creation of the private endpoint also owns the account, this consent request is automatically approved. Otherwise, the connection is in **Pending** state until approved.

Applications in the virtual network can connect to the Device Update service over the private endpoint seamlessly, using their usual hostname and authorization mechanisms. Account owners can manage consent requests and private endpoints in the Azure portal on the **Private access** tab in the **Networking** page for the resource.

### Connect to private endpoints

Clients on a virtual network that uses the private endpoint should use the same account hostname and authorization mechanisms as clients connecting to the public endpoint. Domain Name System (DNS) resolution automatically routes connections from the virtual network to the account over a private link.

By default, Device Update creates a [private DNS zone](/azure/dns/private-dns-overview) attached to the virtual network with the necessary update for the private endpoints. If you use your own DNS server, you might need to make changes to your DNS configuration.

### DNS changes for private endpoints

When you create a private endpoint, the DNS CNAME record for the resource updates to an alias in a subdomain with the prefix `privatelink`. By default, a private DNS zone is created that corresponds to the private link's subdomain.

When the account endpoint URL with the private endpoint is accessed from outside the virtual network, it resolves to the public endpoint of the service. The following DNS resource records for account `contoso`, when accessed from outside the virtual network that hosts the private endpoint, resolve to the following values:

| Resource record                                          | Type      | Resolved value                                         |
| --------------------------------------------- | ----------| --------------------------------------------- |  
| `contoso.api.adu.microsoft.com`             | CNAME     | `contoso.api.privatelink.adu.microsoft.com` |
| `contoso.api.privatelink.adu.microsoft.com` | CNAME     | [Azure Traffic Manager profile](/azure/traffic-manager/traffic-manager-overview) |

When accessed from within the virtual network hosting the private endpoint, the account endpoint URL resolves to the private endpoint's IP address. The DNS resource records for the account `contoso`, when resolved from inside the virtual network hosting the private endpoint, are as follows:

| Resource record                                          | Type      | Resolved value                                         |
| --------------------------------------------- | ----------| --------------------------------------------- |  
| `contoso.api.adu.microsoft.com`             | CNAME     | `contoso.api.privatelink.adu.microsoft.com` |
| `contoso.api.privatelink.adu.microsoft.com` | CNAME     | `10.0.0.5` |

This approach enables access to the account both for clients on the virtual network that hosts the private endpoint, and clients outside the virtual network.

If you use a custom DNS server on your network, clients can resolve the fully qualified domain name (FQDN) for the device update account endpoint to the private endpoint IP address. Configure your DNS server to delegate your private link subdomain to the private DNS zone for the virtual network, or configure the A records for `accountName.api.privatelink.adu.microsoft.com` with the private endpoint IP address. The recommended DNS zone name is `privatelink.adu.microsoft.com`.

### Private endpoints and Device Update management

This section applies only to Device Update accounts that have public network access disabled and private endpoint connections manually approved. The following table describes the various private endpoint connection states and the effects on device update management, such as importing, grouping, and deploying.

| Connection state   |  Can manage device updates |
| ------------------ | -------------------------------|
| Approved           | Yes                            |
| Rejected           | No                             |
| Pending            | No                             |
| Disconnected       | No                             |

For update management to be successful, the private endpoint connection state must be **Approved**. If a connection is rejected, it can't then be approved using the Azure portal. You must delete the connection and create a new one.

## Related content

- [Configure private endpoints](configure-private-endpoints.md)
- [Device Update security model](device-update-security.md)
