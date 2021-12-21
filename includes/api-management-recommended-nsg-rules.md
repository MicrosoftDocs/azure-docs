---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/15/2021
ms.author: danlep
---

## Configure NSG rules

Configure custom network rules in the API Management subnet to filter traffic to and from your API Management instance. We recommend the following minimum NSG rules to ensure proper operation and access to your instance. 

  * For most scenarios, use the indicated [service tags](../articles/virtual-network/service-tags-overview.md) instead of service IP addresses to specify network sources and destinations. 
  * Set the priority of these rules higher than that of the default rules.
  * Depending on your use of monitoring and other features, you may need to configure additional rules. For detailed settings, see [Virtual network configuration reference](../articles/api-management/virtual-network-reference.md#required-ports).

### [stv2](#tab/stv2)

| Source / Destination Port(s) | Direction          | Transport protocol |   Service tags <br> Source / Destination   | Purpose                                                  | VNet type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | INTERNET / VIRTUAL_NETWORK            | Client communication to API Management                   | External only          |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VIRTUAL_NETWORK       | Management endpoint for Azure portal and PowerShell        | External & Internal  |
| * / 6390                       | Inbound            | TCP                | AZURE_LOAD_BALANCER / VIRTUAL_NETWORK | Azure Infrastructure Load Balancer (required for Premium service tier)                        | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | Dependency on Azure Storage                             | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VIRTUAL_NETWORK / SQL                 | Access to Azure SQL endpoints                           | External & Internal  |
| * / 443                     | Outbound           | TCP                | VIRTUAL_NETWORK / AzureKeyVault                | Access to Azure Key Vault                         | External & Internal  |

### [stv1](#tab/stv1)

| Source / Destination Port(s) | Direction          | Transport protocol |   Service tags <br> Source / Destination   | Purpose                                                  | VNet type |
|------------------------------|--------------------|--------------------|---------------------------------------|-------------------------------------------------------------|----------------------|
| * / [80], 443                  | Inbound            | TCP                | INTERNET / VIRTUAL_NETWORK            | Client communication to API Management                   | External only          |
| * / 3443                     | Inbound            | TCP                | ApiManagement / VIRTUAL_NETWORK       | Management endpoint for Azure portal and PowerShell        | External & Internal  |
| * / *                       | Inbound            | TCP                | AZURE_LOAD_BALANCER / VIRTUAL_NETWORK | Azure Infrastructure Load Balancer (required for Premium service tier)                          | External & Internal  |
| * / 443                  | Outbound           | TCP                | VIRTUAL_NETWORK / Storage             | Dependency on Azure Storage                             | External & Internal  |
| * / 1433                     | Outbound           | TCP                | VIRTUAL_NETWORK / SQL                 | Access to Azure SQL endpoints                           | External & Internal  |

---