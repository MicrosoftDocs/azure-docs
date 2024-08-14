---
author: anaharris-ms
ms.service: container-registry
ms.topic: include
ms.date: 07/29/2024
ms.author: anaharris
---

## Consideration for private endpoint

Azure Private Link provides private connectivity from a virtual network to [Azure platform as a service (PaaS), customer-owned, or Microsoft partner services](/azure/private-link/private-endpoint-overview). Private Link simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet.

For a successful recreation of your resource in the target region, the VNet and Subnet must be created before the actual recreation occurs.

### Considerations for Azure Private Endpoint DNS integration

It’s important to correctly configure your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) of the connection string.

Existing Microsoft Azure services might already have a DNS configuration for a public endpoint. This configuration must be overridden to connect using your private endpoint.

The network interface associated with the private endpoint contains the information to configure your DNS. The network interface information includes FQDN and private IP addresses for your private link resource.

You can use the following options to configure your DNS settings for private endpoints:

- **Use the host file (only recommended for testing)**. You can use the host file on a virtual machine to override the DNS.
- **Use a private DNS zone.** You can use private DNS zones to override the DNS resolution for a private endpoint. A private DNS zone can be linked to your virtual network to resolve specific domains.
- **Use your DNS forwarder (optional).** You can use your DNS forwarder to override the DNS resolution for a private link resource. Create a DNS forwarding rule to use a private DNS zone on your DNS server hosted in a virtual network.