---
title: Use a Public IP address prefix in a Service Fabric managed cluster
description: This article describes how to use Azure DDoS Protection in a Service Fabric managed cluster.
ms.topic: how-to
ms.author: ankurjain
author: ankurjain
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 09/05/2023
---

# Use Azure DDoS Protection in a Service Fabric managed cluster

[Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md), combined with application design best practices, provides enhanced DDoS mitigation features to defend against [Distributed denial of service (DDoS) attacks](https://www.microsoft.com/en-us/security/business/security-101/what-is-a-ddos-attack). It's automatically tuned to help protect your specific Azure resources in a virtual network. There are a [number of benefits to using Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md#key-benefits).

Service Fabric managed cluster supports Azure DDoS Network Protection and allows you to associate your VMSS with [Azure DDoS Network Protection Plan](../ddos-protection/ddos-protection-sku-comparison#ddos-network-protection). The plan is created by the customer, and they pass the resource id of the plan in managed cluster arm template.

## Use DDoS Protection in a Service Fabric managed cluster

### Requirements

Use Service Fabric API version 2023-07-01-preview or later.

### Steps

The following section describes the steps that should be taken to use DDoS Network Protection in a Service Fabric managed cluster: 

1. Follow the steps in the [Quickstart: Create and configure Azure DDoS Network Protection](../ddos-protection/manage-ddos-protection) to create a DDoS Network Protection plan through Portal, [Azure PowerShell](../ddos-protection/manage-ddos-protection-powershell), or Azure CLI. Note the ddosProtectionPlanName and ddosProtectionPlanId for use in a later step. 

2. Link your DDoS Protection plan to the virtual network that the Service Fabric managed cluster manages for you. To do this, you must grant SFMC permission to join your DDoS Protection plan with the virtual network. This permission is granted by assigning SFMC the “Network Contributor” Azure role as described in steps below:

A. Get the service `Id` from your subscription for Service Fabric Resource Provider application.
   ```powershell
   Login-AzAccount
   Select-AzSubscription -SubscriptionId <SubId>
   Get-AzADServicePrincipal -DisplayName "Azure Service Fabric Resource Provider"
   ```

   > [!NOTE]
   > Make sure you are in the correct subscription, the principal ID will change if the subscription is in a different tenant.

   ```powershell
   ServicePrincipalNames : {74cb6831-0dbb-4be1-8206-fd4df301cdc2}
   ApplicationId         : 74cb6831-0dbb-4be1-8206-fd4df301cdc2
   ObjectType            : ServicePrincipal
   DisplayName           : Azure Service Fabric Resource Provider
   Id                    : 00000000-0000-0000-0000-000000000000
   ```

   Note the **Id** of the previous output as **principalId** for use in a later step

   |Role definition name|Role definition ID|
   |----|-------------------------------------|
   |Network Contributor|4d97b98b-1d4f-4787-a291-c67834d212e7|

   Note the `Role definition name` and `Role definition ID` property values for use in a later step


       
B. The [sample ARM deployment template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-PIPrefix) adds a role assignment to the DDoS Protection Plan with contributor access. For more information on Azure roles, see [Azure built-in roles - Azure RBAC](../role-based-access-control/built-in-roles#all). This role assignment is defined in the resources section of template         with Principal ID and a role definition ID determined from the first step. 


```json
        "variables": { 
          "sfApiVersion": "2023-07-01-preview", 
          "ddosProtectionPlanName": "YourDDoSProtectionPlan", 
          "ddosProtectionPlanId": "[concat('/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sampleRg/providers/Microsoft.Network/ddosProtectionPlans/', variables('ddosProtectionPlanName'))]", 
          "sfrpPrincipalId": "00000000-0000-0000-0000-000000000000",
          "ddosProtectionPlanRoleAssignmentID": "[guid(variables('ddosProtectionPlanId'), 'SFRP-Role')]" 
        }, 
         "resources": [ 
      { 
            "type": "Microsoft.Authorization/roleAssignments", 
            "apiVersion": "2020-04-01-preview", 
            "name": "[variables('ddosProtectionPlanRoleAssignmentID')]", 
            "scope": "[concat('Microsoft.Network/ddosProtectionPlans/', variables('ddosProtectionPlanName'))]", 
            "properties": { 
              "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '4d97b98b-1d4f-4787-a291-c67834d212e7')]", 
              "principalId": "[variables('sfrpPrincipalId')]" 
            } 
          } 
          ]
```

or you can also add role assignment via PowerShell using Principal ID determined from the first step and role definition name as "Contributor" where applicable.

   ```powershell
New-AzRoleAssignment -PrincipalId "sfrpPrincipalId" `
-RoleDefinitionId "4d97b98b-1d4f-4787-a291-c67834d212e7" `
-ResourceName <resourceName> `
-ResourceType <resourceType> `
-ResourceGroupName <resourceGroupName>
   ```

3.	Use a [sample ARM deployment template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-PIPrefix) that assigns roles and adds DDoS Protection configuration as part of the service fabric managed cluster creation. Update the template with `principalId`, `ddosProtectionPlanName` and `ddosProtectionPlanId` obtained above.
4.	You can also modify your existing ARM template and add new property `ddosProtectionPlanId` under Microsoft.ServiceFabric/managedClusters resource that takes the resource ID of the DDoS Protection Network Protection Plan.

#### ARM Template:

```json
      {
      "apiVersion": "2023-07-01-preview",
      "type": "Microsoft.ServiceFabric/managedclusters",
      },
      "properties":  {
      "ddosProtectionPlanId": "[parameters('ddosProtectionPlanId')]"
      }
```
