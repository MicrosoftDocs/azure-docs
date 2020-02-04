---
title: Azure virtual network service endpoint policies | Microsoft Docs
description: Learn how to filter Virtual Network traffic to Azure service resources using Service Endpoint Policies
services: virtual-network
documentationcenter: na
author: Raman Deep Singh
ms.service: virtual-network
ms.devlang: NA
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/03/2020
ms.author: rdhillon
---

# Virtual network service endpoint policies for Azure Storage

Virtual Network (VNet) service endpoint policies allow you to filter egress virtual network traffic to Azure Storage accounts over service endpoint, and allow data exfiltration to only specific Azure Storage accounts. Endpoint policies provide granular access control for virtual network traffic to Azure Storage when connecting over service endpoint.

![Securing Virtual network outbound traffic to Azure Storage accounts](.\Media\virtual-network-service-endpoint-policies-overview\vnet-service-endpoint-policies-overview.png)

This feature is generally available for __Azure Storage__ in __all public Azure regions__.

For most up-to-date notifications, refer to [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

## Key benefits

Virtual network service endpoint policies provide following benefits:

- __Improved security for your Virtual Network traffic to Azure Storage__

  [Azure service tags for network security groups](https://aka.ms/servicetags) allow you to restrict virtual network outbound traffic to specific Azure Storage regions. However, this allows traffic to any account within selected Azure Storage region.
  
  Endpoint policies allow you to specify the Azure Storage accounts that are allowed virtual network outbound access and restricts access to all the other storage accounts. This gives much more granular security control for protecting data exfiltration from your virtual network.

- __Scalable, highly available policies to filter Azure service traffic__

   Endpoint policies provide horizontally scalable, highly available solution to filter Azure service traffic from virtual networks, over service endpoints. No additional overhead is required to maintain central network appliances for this traffic in your virtual networks.

- __Controlled access for managed Azure services via “Aliases”__

   Azure service __"aliases”__ group together the Azure Storage accounts that are used by corresponding Azure services. Service Endpoint policies enable customers to control VNet outbound traffic for managed Azure services in customer subnets by specifying all the aliases that they want to allow and restrict all others.

  > [!NOTE]  
  > Not allowing any aliases would limit the functionality for the corresponding managed Azure services to reach Azure Storage and might result in disruption of service for them.

## Azure Managed Service "Aliases"
__Aliases__ are a way to group together all the internal Azure Storage accounts used by Azure managed services. Aliases provide an easy way for the customers to whitelist the corresponding Azure Services for VNet outbound traffic used for purposes like Management of those instances, telemetry etc.

When added to the `Global` scope section in a Service endpoint policy, an alias expands to the list of all known accounts that the service depends upon and whitelists all of those dependencies to ensure uninterrupted service.

Aliases for managed Azure services are represented as `/services/Azure/<Service Alias>`, while a higher level Alias `/services/Azure` covers all the available aliases and will expand into __all__ the known Azure storage accounts for all the tagged services.

## JSON Object for Service Endpoint policies and Aliases
Let's take a quick look at the Service Endpoint Policy object and Aliases.

```json
"serviceEndpointPolicyDefinitions": [
    {
            "description": null,
            "name": "MySEP-Definition",
            "resourceGroup": "MySEPDeployment",
            "service": "Microsoft.Storage",
            "serviceResources": [ 
                    "/subscriptions/subscriptionID/resourceGroups/MySEPDeployment/providers/Microsoft.Storage/storageAccounts/mystgacc1"
            ],
            "type": "Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions"
    },
    {
            "description": null,
            "name": "MySEP-Definition2",
            "resourceGroup": "MySEPDeployment",
            "service": "Global",
            "serviceResources": [
                    "/services/Azure/DataFactory",
                    "/services/Azure/Batch"
            ],
            "type": "Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions"
    }
]
```

## Configuration

-	You can configure the endpoint policies to restrict virtual network traffic to specific Azure Storage accounts.
-	Endpoint policy is configured on a subnet in a virtual network. Service endpoints for Azure Storage should be enabled on the subnet to apply the policy.
-	Endpoint policy allows you to whitelist specific Azure Storage accounts, using the resourceID format. You can restrict access to
    - all storage accounts in a subscription<br>
      `E.g. /subscriptions/subscriptionId`

    - all storage accounts in a resource group<br>
      `E.g. subscriptions/subscriptionId/resourceGroups/resourceGroupName`
     
    - an individual storage account by listing the corresponding Azure Resource Manager resourceId. This covers traffic to blobs, tables, queues, files and Azure Data Lake Storage Gen2. <br>
    `E.g. /subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.Storage/storageAccounts/storageAccountName`
-	By default, if no policies are attached to a subnet with endpoints, you can access all storage accounts in the service. Once a policy is configured on that subnet, only the resources specified in the policy can be accessed from compute instances in that subnet. Access to all other storage accounts will be denied.
-	When applying Service Endpoint policies on a subnet, the Azure Storage Service Endpoint scope gets upgraded from regional to global. This means that all the traffic to Azure Storage is secured over service endpoint thereafter. Also, the Service endpoint policies are applicable globally, so any Storage accounts not explicitly whitelisted will be denied access. Please refer to [Global Tags for Azure Storage](https://aka.ms/AzStorageGlobalTags) for more context.
-	You can apply multiple policies to a subnet. When multiple policies are associated to the subnet, virtual network traffic to resources specified across any of these policies will be allowed. Access to all other service resources, not specified in any of the policies, will be denied.

    > [!NOTE]  
    > Service endpoint policies are **whitelisting policies**, so apart from the specified resources, all other resources are restricted. Please ensure that all service resource dependencies  for your applications are identified and listed in the policy.

    > [!WARNING]  
    > Some of the managed Azure services are not yet supported with Azure Service Endpoint Policies. The services currently supported via Aliases are: 
    __ActiveDirectory, AKS, ApiManagement, Backup, Batch, Databricks, DataFactory, Firewall, HDI, LogicApps, ManagedInstance, RedisCache, WebPI__
    >
    >Any other managed Azure services in your subnet might experience connectivity disruption if Service Endpoint policies are applied to this subnet.
    >
    >For updates regarding the supported Azure services, refer to [Limitations](#limitations).

- When applying aliases, you can opt to use a higher level Alias `/services/Azure` to allow all services, or explicitly add an alias for all the known injected services in your subnet to ensure unrestricted function.<br>
  > [!NOTE]  
  > A service endpoint policy with only aliases will not be effective unless a specific Storage account is also added in the policy definition.
  
- Only storage accounts using the Azure Resource Model can be specified in the endpoint policy.  

  > [!NOTE]  
  > Access to classic storage accounts is blocked with endpoint policies.

- RA-GRS secondary access will be automatically allowed if the primary account is listed.
- Storage accounts can be in the same or a different subscription or Azure Active Directory tenant as the virtual network.

## Limitations

- You can only deploy service endpoint policies on virtual networks deployed through the Azure Resource Manager deployment model.
- Virtual networks must be in the same region as the service endpoint policy.
- You can only apply service endpoint policy on a subnet if service endpoints are configured for the Azure services listed in the policy.
- You can't use service endpoint policies for traffic from your on-premises network to Azure services.
- Endpoint policies can be applied to subnets with managed Azure services whose Aliases are listed below, please do not use service endpoint policies for other managed services to ensure uninterrupted infrastructure connectivity.
  - /services/Azure/AKS
  - /services/Azure/ApiManagement
  - /services/Azure/Backup
  - /services/Azure/Batch
  - /services/Azure/Databricks
  - /services/Azure/DataFactory
  - /services/Azure/Firewall
  - /services/Azure/LogicApps
  - /services/Azure/ManagedInstances  (*SqlMI*)
  - /services/Azure/RedisCache
  - /services/Azure/WebPI
  - (***Preview***) /services/Azure/ActiveDirectory
  - (***Preview***) /services/Azure/HDI
  

- Some Azure services are deployed into dedicated subnets. Endpoint policies are blocked on all such services, listed below.
  - Azure App Service Environment
  - Azure Rediscache
  - Azure API Management
  - Azure SQL Managed Instance
  - Azure Active Directory Domain Services
  - Azure Application Gateway (Classic)
  - Azure VPN Gateway (Classic)

- Classic storage accounts are not supported in endpoint policies. Policies will deny access to all classic storage accounts, by default. If your application needs access to Azure Resource Manager and classic storage accounts, endpoint policies should not be used for this traffic.

## Scenarios

- **Peered, connected or multiple virtual networks**: To filter traffic in peered virtual networks, endpoint policies should be applied individually to these virtual networks.
- **Filtering Internet traffic with Network Appliances or Azure Firewall**: Filter Azure service traffic with policies, over service endpoints, and filter rest of the Internet or Azure traffic via appliances or Azure Firewall. 
- **Filtering traffic on Azure services deployed into Virtual Networks**: Filter Azure managed services for outbound traffic via the corresponding Aliases. Specify the aliases for allowed services, restricting all others. 
 For specific services, see [limitations.](#limitations)
- **Filtering traffic to Azure services from on-premises**:
Service endpoint policies only apply to the traffic from subnets associated to the policies. To allow access to specific Azure service resources from on-premises, traffic should be filtered using network virtual appliances or firewalls.

## Logging and troubleshooting
No centralized logging is available for service endpoint policies. For service diagnostic logs, see [Service endpoints logging](virtual-network-service-endpoints-overview.md#logging-and-troubleshooting).

### Troubleshooting scenarios
- Access denied to storage accounts that were working in preview (not in geo-paired region)
  - With Azure Storage upgrading to use Global Service Tags, the scope of Service ENdpoint and thus Service Endpoint policies is now Global. So any traffic to Storage is encrypted over Service Endpoints and only whitelisted Storage accounts are allowed access.
  - Explicitly whitelist all the required Storage accounts to restore access.  
  - Contact Azure support.
- Access is denied for accounts listed in the endpoint policies
  - Network security groups or firewall filtering could be blocking access
  - If removing/re-applying the policy results in connectivity loss:
    - Validate whether the Azure service is configured to allow access from the virtual network, over endpoints, or that the default policy for the resource is set to *Allow All*.
    - Validate that the service diagnostics show the traffic over endpoints.
    - Check whether network security group flow logs show the access and that storage logs show the access, as expected, over service endpoints.
    - Contact Azure support.
- Access is denied for accounts not listed in the service endpoint policies
  - Validate whether Azure Storage is configured to allow access from the virtual network, over endpoints, or whether the default policy for the resource is set to *Allow All*.
  - Ensure the accounts are not **classic storage accounts** with service endpoint policies on the subnet.
- A managed Azure Service stopped working after applying a Service Endpoint Policy over the subnet
  - Validate that the Managed service is listed above and has an Alias defined for it.
  - Validate that either all the Azure SErvice Aliases or the Alias corresponding to the affected service is added in the Global section of the service Endpoint Policy.
  - Contact Azure support and request assistance for the affected service.

## Provisioning

Service endpoint policies can be configured on subnets by a user with write access to a virtual network. Learn more about Azure [built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Virtual networks and Azure Storage accounts can be in the same or different subscriptions, or Azure Active Directory tenants.

## Pricing and limits

There is no additional charge for using service endpoint policies. The current pricing model for Azure services (such as, Azure Storage) applies as is today, over service endpoints.

Following limits are enforced on service endpoint policies: 

 |Resource | Default limit |
 |---------|---------------|
 |ServiceEndpointPoliciesPerSubscription |500 |
 |ServiceEndpintPoliciesPerSubnet|100 |
 |ServiceResourcesPerServiceEndpointPolicyDefinition|200 |

## Next Steps

- Learn [how to configure virtual network service endpoint policies](virtual-network-service-endpoint-policies-portal.md)
- Learn more about [Virtual network Service Endpoints](virtual-network-service-endpoints-overview.md)
