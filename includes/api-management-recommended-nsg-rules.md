---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/15/2021
ms.author: danlep
---

## Configure NSG rules

Configure custom network rules in the API Management subnet to filter traffic to and from your API Management instance. We recommend the following minimum NSG rules to ensure proper operation and access to your instance. 

> [!IMPORTANT] 
> Depending on your use of monitoring and other features, you may need to configure additional NSG rules beyond the minimum rules in the following table. For detailed settings, see [Virtual network configuration reference](../articles/api-management/virtual-network-reference.md#required-ports). 

  * For most scenarios, use the indicated [service tags](../articles/virtual-network/service-tags-overview.md) instead of service IP addresses to specify network sources and destinations. 
  * Set the priority of these rules higher than that of the default rules.

### [stv2](#tab/stv2)

| Source / Destination Port(s) | Direction          | Transport protocol |   Service tags <br> Source / Destination   | Purpose                                                  | VNet type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | Internet / VirtualNetwork            | Client communication to API Management                   | External only          |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VirtualNetwork       | Management endpoint for Azure portal and PowerShell        | External & Internal  |
| * / 6390                       | Inbound            | TCP                | AzureLoadBalancer / VirtualNetwork | Azure Infrastructure Load Balancer                        | External & Internal  |
| * / 443                  | Outbound           | TCP                | VirtualNetwork / Storage             | Dependency on Azure Storage                             | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VirtualNetwork / SQL                 | Access to Azure SQL endpoints                           | External & Internal  |
| * / 443                     | Outbound           | TCP                | VirtualNetwork / AzureKeyVault                | Access to Azure Key Vault                         | External & Internal  |

### [stv1](#tab/stv1)

| Source / Destination Port(s) | Direction          | Transport protocol |   Service tags <br> Source / Destination   | Purpose                                                  | VNet type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | Internet / VirtualNetwork            | Client communication to API Management                   | External only          |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VirtualNetwork       | Management endpoint for Azure portal and PowerShell        | External & Internal  |
| * / *                       | Inbound            | TCP                | AzureLoadBalancer / VirtualNetwork | Azure Infrastructure Load Balancer (required for Premium service tier)                          | External & Internal  |
| * / 443                  | Outbound           | TCP                | VirtualNetwork / Storage             | Dependency on Azure Storage                             | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VirtualNetwork / SQL                 | Access to Azure SQL endpoints                           | External & Internal  |

---
