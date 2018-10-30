---
title: Azure virtual network service endpoint policies | Microsoft Docs
description: Learn how to filter Virtual Network traffic to Azure service resources using Service Endpoint Policies
services: virtual-network
documentationcenter: na
author: anithaa
manager: narayan
editor: ''

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/18/2018
ms.author: anithaa
ms.custom: 
---

# Virtual network service endpoint policies (Preview)

Virtual Network (VNet) service endpoint policies allow you to filter virtual network traffic to Azure services, allowing only specific Azure service resources, over service endpoints. Endpoint policies provide granular access control for virtual network traffic to Azure services.

This feature is available in __preview__ for following Azure services and regions:

__Azure Storage__: WestCentralUS, WestUS2.

For most up-to-date notifications for preview, refer to [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

> [!NOTE]  
> During preview, virtual network service endpoint policies may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key benefits

Virtual network service endpoint policies provide following benefits:

- __Improved security for your Virtual Network traffic to Azure Services__

  [Azure service tags for network security groups](https://aka.ms/servicetags) allow you to restrict virtual network outbound traffic to specific Azure services. However, this allows traffic to any resources of that Azure service. 
  
  With endpoint policies, you can now restrict virtual network outbound access to only specific Azure resources. This gives much more granular security control for protecting data accessed in your virtual network. 

- __Scalable, highly available policies to filter Azure service traffic__

   Endpoint policies provide horizontally scalable, highly available solution to filter Azure service traffic from virtual networks, over service endpoints. No additional overhead is required to maintain central network appliances for this traffic in your virtual networks.

## Configuration

- You can configure the endpoint policies to restrict virtual network traffic to specific Azure service resources. For preview, we support endpoint policies for Azure Storage. 
- Endpoint policy is configured on a subnet in a virtual network. Service endpoints should be enabled on the subnet to apply the policy, for all Azure services listed in the policy.
- Endpoint policy allows you to whitelist specific Azure service resources, using the resourceID format. You can restrict access to all resources in a subscription or resource group. You can also restrict access to specific resources. 
- By default, if no policies are attached to a subnet with endpoints, you can access all resources in the service. Once a policy is configured on that subnet, only the resources specified in the policy can be accessed from compute instances in that subnet. Access to all other resources, for the specific service, will be denied. 
- You can filter traffic to Azure service resources in the regions where service endpoint is configured. Access to service resources in other regions will be allowed, by default. 

  > [!NOTE]  
  > To fully lock down virtual network outbound access to Azure resources in service endpoint regions, you also need network security group rules configured to allow traffic only to the service endpoint regions, using [service tags](security-overview.md#service-tags).

- You can apply multiple policies to a subnet. When multiple policies are associated to the subnet, for the same service, virtual network traffic to resources specified across any of these policies will be allowed. Access to all other service resources, not specified in any of the policies, will be denied. 

  > [!NOTE]  
  > Policy only allows access to listed service resources from a virtual network. All other traffic to the service is denied automatically, when you add specific resources to the policy. Ensure that all service resource dependencies for your applications can be identified and listed in the policy.

  > [!WARNING]  
  > Azure services deployed into your virtual network, such as Azure HDInsight, access other Azure services, such as Azure Storage, for infrastructure requirements. Restricting endpoint policy to specific resources could break access to these infrastructure resources for services deployed in your virtual network. For specific services, refer to [Limitations](#limitations) During preview, service endpoint policies are not supported for any managed Azure services that are deployed into your virtual network.

- For Azure Storage: 
  -  You can restrict access by listing the Azure Resource Manager *resourceId* of the storage account. This covers traffic to blobs, tables, queues, files and Azure Data Lake Storage Gen2.

     Example, Azure storage accounts could be listed in the endpoint policy definition as below :
    
     To allow specific storage account:         
     `subscriptions/subscriptionId/resourceGroups/resourceGroup/providers/Microsoft.Storage/storageAccounts/storageAccountName`
      
     To allow all accounts in a subscription and resource group:
     `/subscriptions/subscriptionId/resourceGroups/resourceGroup`
     
     To allow all accounts in a subscription:
     `/subscriptions/subscriptionId`
    
- Only storage accounts using the Azure Resource Model can be specified in the endpoint policy.  

  > [!NOTE]  
  > Access to classic storage accounts is blocked with endpoint policies.

- The primary location for the account listed should be in the geo-pair regions of the service endpoint, for the subnet. 

  > [!NOTE]  
  > Policies allow service resources from other regions to be specified. Virtual network access to the Azure services is only filtered for the geo-pair regions. If network security groups are not restricted to the geo-pair regions for Azure Storage, the virtual network can access all storage accounts outside the geo-pair regions.

- RA-GRS secondary access will be automatically allowed if the primary account is listed. 
- Storage accounts can be in the same or a different subscription or Azure Active Directory tenant as the virtual network. 

## Limitations

- You can only deploy service endpoint policies on virtual networks deployed through the Azure Resource Manager deployment model.
- Virtual networks must be in the same region as the service endpoint policy.
- You can only apply service endpoint policy on a subnet if service endpoints are configured for the Azure services listed in the policy.
- You can't use service endpoint policies for traffic from your on-premises network to Azure services.
- Endpoint policies should not be applied to subnets with managed Azure services, with dependency on Azure services for infrastructure requirements. 

  > [!WARNING]  
  > Azure services deployed into your virtual network, such as Azure HDInsight, access other Azure services, such as Azure Storage, for infrastructure requirements. Restricting endpoint policy to specific resources could break access to these infrastructure resources for the Azure services deployed in your virtual network.
  
  - Some Azure services can be deployed into subnets with other compute instances. Please ensure endpoint policies are not applied to the subnet, if managed services listed below are deployed into the subnet.
   
    - Azure HDInsight
    - Azure Batch (Azure Resource Manager)
    - Azure Active Directory Domain Services (Azure Resource Manager)
    - Azure Application Gateway (Azure Resource Manager)
    - Azure VPN Gateway (Azure Resource Manager)
    - Azure Firewall

  - Some Azure services are deployed into dedicated subnets. Endpoint policies are blocked on all such services, listed below, during preview. 

     - Azure App Service Environment
     - Azure Rediscache
     - Azure API Management
     - Azure SQL Managed Instance
     - Azure Active Directory Domain Services
     - Azure Application Gateway (Classic)
     - Azure VPN Gateway (Classic)

- Azure Storage: Classic storage accounts are not supported in endpoint policies. Policies will deny access to all classic storage accounts, by default. If your application needs access to Azure Resource Manager and classic storage accounts, endpoint policies should not be used for this traffic. 

## NSGs with Service Endpoint Policies
- By default, NSGs allow outbound Internet traffic, including virtual network traffic to Azure services.
- If you want to deny all outbound Internet traffic and allow only traffic to specific Azure service resources: 

  Step 1: Configure NSGs to allow outbound traffic only to Azure services in endpoint regions, using *Azure service tags*. For more information, see [service tags for NSGs](https://aka.ms/servicetags)
      
  For example, network security group rules that restrict access to only endpoint regions look like the following example:

  ```
  Allow AzureStorage.WestUS2,
  Allow AzureStorage.WestCentralUS,
  Deny all
  ```

  Step 2: Apply the service endpoint policy with access to only specific Azure service resources.

  > [!WARNING]  
  > If network security group is not configured to limit a virtual network's Azure service access to endpoint regions, you can access service resources in other regions, even if the service endpoint policy is applied.

## Scenarios

- **Peered, connected or multiple virtual networks**: To filter traffic in peered virtual networks, endpoint policies should be applied individually to these virtual networks.
- **Filtering Internet traffic with Network Appliances or Azure Firewall**: Filter Azure service traffic with policies, over endpoints, and filter rest of the Internet or Azure traffic via appliances or Azure Firewall. 
- **Filtering traffic on Azure services deployed into Virtual Networks**: During preview, service endpoint policies are not supported for any managed Azure services that are deployed into your virtual network. 
 For specific services, see [limitations.](#Limitations)
- **Filtering traffic to Azure services from on-premises**:
Service endpoint policies only apply to the traffic from subnets associated to the policies. To allow access to specific Azure service resources from on-premises, traffic should be filtered using network virtual appliances or firewalls.

## Logging and troubleshooting
No centralized logging is available for service endpoint policies. For service diagnostic logs, see [Service endpoints logging](virtual-network-service-endpoints-overview.md#logging-and-troubleshooting).

### Troubleshooting scenarios
- Access allowed to storage accounts not listed in the endpoint policies
  - Network security groups may be allowing access to the Internet or Azure Storage accounts in other regions.
  - Network security groups should be configured to deny all outbound Internet traffic and allow only traffic to specific Azure Storage regions. For details, see [Network security groups](#network-security-groups).
- Access is denied for accounts listed in the endpoint policies
  - Network security groups or firewall filtering could be blocking access
  - If removing/re-applying the policy results in connectivity loss:
   - Validate whether the Azure service is configured to allow access from the virtual network, over endpoints, or that the default policy for the resource is set to *Allow All*.
      > [!NOTE]      
      > Service resources need not be secured to virtual networks to get access over endpoint policies. However, as a security best practice, we recommend that the service resources are secured to your trusted networks, such as your Azure virtual networks, via service endpoints, and on-premises, via an IP firewall.
  
   - Validate that the service diagnostics show the traffic over endpoints.
    - Check whether network security group flow logs show the access and that storage logs show the access, as expected, over service endpoints.
    - Contact Azure support.
- Access is denied for accounts not listed in the service endpoint policies
  - Network security groups or firewall filtering could be blocking access. Ensure that the *Azure Storage* service tag is allowed for the endpoint regions. For policy restrictions, see [limitations](#limitations).
  For example, classic storage accounts are denied access if a policy is applied.
  - Validate whether the Azure service is configured to allow access from the virtual network, over endpoints, or whether the default policy for the resource is set to *Allow All*.

## Provisioning

Service endpoint policies can be configured on subnets by a user with write access to a virtual network. Learn more about Azure [built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Virtual networks and Azure service resources can be in the same or different subscriptions, or Azure Active Directory tenants. 

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

