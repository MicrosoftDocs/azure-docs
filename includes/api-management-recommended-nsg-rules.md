---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 04/17/2025
ms.author: danlep
---

## Configure NSG rules

Configure custom network rules in the API Management subnet to filter traffic to and from your API Management instance. We recommend the following *minimum* NSG rules to ensure proper operation and access to your instance. Review your environment carefully to determine more rules that might be needed. 

> [!IMPORTANT] 
> Depending on your use of caching and other features, you may need to configure additional NSG rules beyond the minimum rules in the following table. For detailed settings, see [Virtual network configuration reference](../articles/api-management/virtual-network-reference.md#required-ports). 

  * For most scenarios, use the indicated [service tags](../articles/virtual-network/service-tags-overview.md) instead of service IP addresses to specify network sources and destinations. 
  * Set the priority of these rules higher than that of the default rules.


| Direction | Source service tag | Source port ranges | Destination service tag | Destination port ranges | Protocol |  Action | Purpose | VNet type |
|-------|--------------|----------|---------|------------|-----------|-----|--------|-----|
| Inbound | Internet | * | VirtualNetwork | [80], 443   | TCP            | Allow | Client communication to API Management                   | External only          |
| Inbound | ApiManagement | * | VirtualNetwork | 3443    | TCP | Allow     | Management endpoint for Azure portal and PowerShell        | External & Internal  |
| Inbound | AzureLoadBalancer | * | VirtualNetwork | 6390      | TCP                | Allow | Azure Infrastructure Load Balancer             | External & Internal  |
| Inbound | AzureTrafficManager | * | VirtualNetwork | 443 | TCP | Allow | Azure Traffic Manager routing for multi-region deployment | External only |
| Outbound | VirtualNetwork | * | Storage | 443                  |  TCP | Allow  | Dependency on Azure Storage for core service functionality                            | External & Internal  |
| Outbound | VirtualNetwork| * | SQL | 1433                     | TCP           | Allow | Access to Azure SQL endpoints for core service functionality                          | External & Internal  |
| Outbound | VirtualNetwork | * | AzureKeyVault | 443                     | TCP                | Allow                | Access to Azure Key Vault for core service functionality                         | External & Internal  |
| Outbound | VirtualNetwork | * | AzureMonitor | 1886, 443                     |  TCP                | Allow         | Publish [Diagnostics Logs and Metrics](../articles/api-management/api-management-howto-use-azure-monitor.md), [Resource Health](/azure/service-health/resource-health-overview), and [Application Insights](../articles/api-management/api-management-howto-app-insights.md)                  | External & Internal  |

