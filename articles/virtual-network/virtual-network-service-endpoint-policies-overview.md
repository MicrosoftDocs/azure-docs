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
ms.date: 09/05/2018
ms.author: anithaa
ms.custom: 
---

# Virtual Network Service Endpoint Policies (Preview)

Virtual Network(VNet) service endpoint policies allow you to filter Virtual Network (VNet) traffic to Azure services, allowing only specific Azure service resources, over service endpoints. Endpoint policies provide granualar access control for VNet traffic to Azure services.

This feature is available in __preview__ for following Azure services and regions:

__Azure Storage__: WestCentralUS, WestUS2.

For most up-to-date notifications for the preview, check the [Azure Virtual Network updates](https://azure.microsoft.com/updates/?product=virtual-network) page.

>[!NOTE]
During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Key Benefits

Service endpoint policies provide following benefits:

- __Improved security for your Virtual Network traffic to Azure Services__

  With [Azure Service tags for NSGs.](https://aka.ms/servicetags), VNet outbound traffic can be restricted to specific Azure services. However, this allows traffic to any resources of that Azure service. 
  With endpoint policies, you can now restrict VNet outbound access to only specific Azure resources. This gives much granular security controls to protect your data accessed in your Virtual Network (VNet).

- __Scalable, highly available policies to filter Azure service traffic__

 Endpoint policies provide horizontally scalable, highly available solution to filter Azure service traffic from VNets, over service endpoints. No additional overload to maintain central network appliances for this traffic in your VNets.

## Configuration

- You can configure the endpoint policies to restrict VNet traffic to specific Azure services. For preview, we support endpoint policies for Azure Storage. 

- Endpoint policy is configured on a subnet in a VNet. Service endpoints should be enabled on the subnet to apply the policy, for all Azure services listed in the policy.

- Service endpoint policy allows you to whitelist specific Azure service resources, using resourceID format. You can restrict access to all resources in a subscription or resource group. You can also restric access to specific resources. 

- By default, if no policies are attached to a subnet with endpoints, you can access all resources in the service. Once a policy is configured on that subnet, only the resources specified in the policy can be accessed from compute instances in that subnet. Access to all other resources, for the specific service, will be denied. 

- You can filter traffic to Azure service resources in the regions where service endpoint is configured. Access to service resources in other regions will be allowed, by default. 

[!NOTE] To fully lock down VNet outbound access to Azure resources in service endpoint regions, you will also need NSG rules configured to allow traffic only to the service endpoint regions, using [Azure Service tags for NSGs.](https://aka.ms/servicetags).

- You can apply multiple policies to a subnet. When multiple policies are associated to the subnet, for the same service, VNet traffic to resources specified across any of these policies will be allowed. Access to all other service resources, not specified in any of the policies, will be denied. 

[!NOTE] Policy only allows access to listed service resources from VNet. All other traffic to the service will be denied automatically, when you add specific resources to the policy. Please ensure all service resource dependencies for your applications can be identified and listed in the policy.

[!WARNING] Azure services deployed into your VNet, such as Azure HDInsight, access other Azure services, such as Azure Storage, for infrastructure requirements. Restricting endpoint policy to specific resources could break access to these infrastructure resources for [services deployed in your VNet.] (#Limitations) During preview, service endpoint policies are not supported for any managed Azure services that are deployed into your VNet. 

- For Azure Storage: 
    - You can restrict access by listing ARM resourceId of the storage account. This covers traffic to blobs, tables, queues and files. 

    - Only storage accounts using the Azure Resource Model can be specified in the endpoint policy.  

    [!NOTE] Access to classic storage accounts will be blocked with endpoint policies.

    - Primary location for the account listed should be in the geo-pair regions of the service endpoint, for the subnet. 

      [!NOTE] Policies will allow service resources from other regions to be specified. VNet access to the Azure services is only filtered for the geo-pair regions. If NSGs are not restricted to the geo-pair regions for Azure storage, VNet can access all storage accounts outside the geo-pair regions. 

    - RA-GRS access to secondary will be automatically allowed if the primary account is listed. 

    - VNet access to Azure Data Lake Storage Gen2 will not be covered by the endpoint policy and so, will be blocked if the storage account is whitelisted in the policy.

    - Storage accounts can be in the same or a different subscription or Azure AD tenant as the VNet. 

## Limitations

- The feature can only be configured on VNets deployed using Azure Resource Manager deployment model.

- VNets should be in the same region as the service endpoint policy. 

- Policy can only be applied on a subnet if service endpoints are configured for the Azure services listed in the policy.

- Endpoint policies cannot be used for traffic from your on-premises to Azure services. 

- Endpoint policies should not be applied to subnets with managed Azure services, with dependency on Azure services for infrastructure requirements. 

  [!WARNING] Azure services deployed into your VNet, such as Azure HDInsight, access other Azure services, such as Azure Storage, for infrastructure requirements. Restricting endpoint policy to specific resources could break access to these infrastructure resources for tje Azure services deployed in your VNet.

  Certain Azure services can be deployed into subnets with other compute instances. Please ensure endpoint policies are not applied to the subnet, if managed services listed below are deployed into the subnet.
    
      Azure HDInsight
      Azure Batch (Azure Resource Model), 
      Azure Application Gateway (Azure Resource Model)
      Azure VPN Gateway (Azure Resource Model)
      Azure Firewall
      
    Certain Azure services are deployed into dedicated subnets. Endpoint policies are blocked on all such services, listed below, during preview. 

      Azure App Service Environment
      Azure Rediscache
      Azure API Management
      Azure SQL Managed Instance
      Azure Active Directory Domain Services
      Azure Application Gateway (Classic)
      Azure VPN Gateway (Classic)

- Azure Storage: 
     - Classic storage accounts are not supported in endpoint policies. Policies will deny access to all classic storage accounts, by default. If your application needs access to ARM and classic storage accounts, policies can't be used. 
- 
## NSGs with Service Endpoint Policies

  - By default, NSGs allow outbound Internet traffic. This also includes VNet traffic to Azure services.

  - If you want to deny all outbound Internet traffic and allow only traffic to specific Azure service resources: 

      (a) Configure NSGs to allow outbound traffic only to Azure services in endpoint regions, using __“Azure service tags”__. For more information, see [Azure Service tags for NSGs.](https://aka.ms/servicetags)
      
      Example, NSG rules to restrict access to only endpoint regions
       
        Allow AzureStorage.WestUS2, 
        Allow AzureStorage.WestCentralUS, 
        Deny all

      (b) Applying service endpoint policy with access to only specific Azure service resources.

       
  [!WARNING] If the NSG is not configured to limit VNet's Azure service access to endpoint regions, you can access service resources in other regions, even if the service endpoint policy is applied. 


## Scenarios

- Peered, connected or multiple VNets:

To filter traffic in peered VNets, endpoint policies should be applied individually to these VNets. 


- Filtering Internet traffic with Network Appliances or Azure Firewall: 

To filter Azure service traffic with policies, over endpoints, and filter rest of the Internet or Azure traffic via appliances or Azure Firewall. 

- Filtering traffic on Azure services deployed into Virtual Networks
 
 During preview, service endpoint policies are not supported for any managed Azure services that are deployed into your VNet. 
 For specific services, refer to #Limitations.

- Filtering traffic to Azure services from on-premises

  Service endpoint policies only apply to the traffic from subnets associated to the policies. To allow access to specific Azure service resources from on-premises, traffic should be filtered using Network Virtual Appliances or firewalls.

## Logging and troubleshooting
No centralized logging for the policies available. 

Refer to [Service Endpoints logging] for service dignostics logs. (virtual-network-service-endpoints-overview.md?toc=%2fSecuring-Azure-services-to-virtual-networks%2ftoc.json#Logging-and-troubleshooting)

Troubleshooting scenarios: 
- Access allowed to Storage accounts not listed in the endpoint policies

    Network Security Groups (NSGs) may be allowing access to Internet or Azure Storage accounts in other regions.

    NSGs should be configured to deny all outbound Internet traffic and allow only traffic to specific Azure storage regions. See (NSGs with Endpoint Policies)[#NSGs with Endpoint Policies] secion for more details. 

- Access is denied for accounts listed in the endpoint policies
   
   Network Security Groups (NSGs) or firewall filtering could be blocking access.
   
   If removing/re-applying the policy results in connectivity loss: 
  - Validate if Azure service is configured to allow access from the virtual network, over endpoints or the default policy for the resource is set to "Allow All" 
  
    [!NOTE] Service resources need not be secured to Virtual Networks to get access over endpoint policies. However, as a security best practice, we recommend that the service resources are secured to your trusted networks, i.e. your Azure virtual networks via service endpoints, and on-premises, via IP firewall. 
   
  - Validating that the service diagnostics show the traffic over endpoints

  - Check if NSG flow logs show the access and Storage logs show the access, as expected, over service endpoints

  - Contact Azure Support

- Access is denied for accounts not listed in the endpoint policies 

  Network Security Groups (NSGs) or firewall filtering could be blocking access. Ensure "Azure Storage" service tag is allowed, for the endpoint regions.

  See ("Limitations")[#Limitations] section for policy restrictions. Example, classic storage accounts are denied access on apply the policy. 

  Validate if Azure service is configured to allow access from the virtual network, over endpoints or the default policy for the resource is set to "Allow All" 

## Provisioning

Service endpoint policies can be configured on subnets by a user with write access to a virtual network. 

Learn more about [built-in roles](../role-based-access-control/built-in-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and assigning specific permissions to [custom roles](../role-based-access-control/custom-roles.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Virtual networks and Azure service resources can be in the same or different subscriptions, or Azure AD tenants. 

## Pricing and Limits

There is no additional charge for using service endpoint policies. Current pricing model for Azure services (Azure Storage) applies as is today, over service endpoints.

To learn more about limits on number of endpoint policies in a subscription, endpoint policies per subnet and number of service resources per endpoint policy definition, refer to  [Azure networking limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). 


## Next Steps

- Learn [how to configure VNet service endpoint policies](virtual-network-service-endpoint-policies-configure.md)
- Learn more about [VNet Service Endpoints](virtual-network-service-endpoints-overview.md)

