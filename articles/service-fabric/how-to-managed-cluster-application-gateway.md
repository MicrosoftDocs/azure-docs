---
title: Use Application Gateway in a Service Fabric managed cluster
description: This article describes how to use Application Gateway in a Service Fabric managed cluster.
ms.topic: how-to
ms.author: ankurjain
author: ankurjain
ms.service: service-fabric
ms.custom: devx-track-azurepowershell
services: service-fabric
ms.date: 09/05/2023
---

# Use Azure Application Gateway in a Service Fabric managed cluster

[Azure Application Gateway](../application-gateway/overview.md) is a web traffic load balancer that enables you to manage traffic to your web applications. There are [several benefits to using Application Gateway](https://azure.microsoft.com/products/application-gateway/#overview). Service Fabric managed cluster supports Azure Application Gateway and allows you to connect your node types to an Application Gateway. You can [create an Azure Application Gateway](../application-gateway/quick-create-portal.md) and pass the resource ID to the service fabric managed cluster ARM template. 


## How to use Application Gateway in a Service Fabric managed cluster

### Requirements 

  Use Service Fabric API version 2022-08-01-Preview (or newer).

### Steps 

The following section describes the steps that should be taken to use Azure Application Gateway in a Service Fabric managed cluster:

1. Follow the steps in the [Quickstart: Direct web traffic using the portal - Azure Application Gateway](../application-gateway/quick-create-portal.md). Note the resource ID for use in a later step. 

2. Link your Application Gateway to the node type of your Service Fabric managed cluster. To do this, you must grant SFMC permission to join the application gateway. This permission is granted by assigning SFMC the “Network Contributor” role on the application gateway resource as described in steps below:

   A.    Get the service `Id` from your subscription for Service Fabric Resource Provider application.

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


   B.    The [sample ARM deployment template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-DDoSNwProtection)             adds a role assignment to the application gateway with contributor access. For more information on Azure roles, see [Azure built-in roles - Azure RBAC](../role-based-access-control/built-in-roles.md#all). This role assignment is defined in the resources section of template with PrincipalId and a role definition ID                   determined from the first step. 


      ```json
      "variables": {
        "sfApiVersion": "2022-08-01-preview",
        "networkApiVersion": "2020-08-01",
        "clusterResourceId": "[resourceId('Microsoft.ServiceFabric/managedclusters', parameters('clusterName'))]",
        "rgRoleAssignmentId": "[guid(resourceGroup().id, 'SFRP-NetworkContributor')]",
        "auxSubnetName": "AppGateway",
        "auxSubnetNsgName": "AppGatewayNsg",
        "auxSubnetNsgID": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('auxSubnetNsgName'))]",
        "frontendIPName": "[concat(parameters('clusterName'), '-AppGW-IP')]",
        "appGatewayName": "[concat(parameters('clusterName'), '-AppGW')]",
        "appGatewayDnsName": "[concat(parameters('clusterName'), '-appgw')]",
        "appGatewayResourceId": "[resourceId('Microsoft.Network/applicationGateways', variables('appGatewayName'))]",
        "appGatewayFrontendPort": 80,
        "appGatewayBackendPort": 8000,
        "appGatewayBackendPool": "AppGatewayBackendPool",
        "frontendConfigAppGateway": [
          {
            "applicationGatewayBackendAddressPoolId": "[resourceId('Microsoft.Network/applicationGateways/backendAddressPools', variables('appGatewayName'), variables('appGatewayBackendPool'))]"
          }
        ],
        "primaryNTFrontendConfig": "[if(parameters('enableAppGateway'), variables('frontendConfigAppGateway'), createArray())]",
        "secondaryNTFrontendConfig": "[if(parameters('enableAppGateway'), variables('frontendConfigAppGateway'), createArray())]"
      },
      "resources": [
        {
          "type": "Microsoft.Authorization/roleAssignments",
          "apiVersion": "2020-04-01-preview",
          "name": "[variables('rgRoleAssignmentId')]",
          "properties": {
            "roleDefinitionId": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7')]",
            "principalId": "[parameters('sfrpPrincipalId')]"
          }
        },
   ```


      or you can also add role assignment via PowerShell using PrincipalId determined from the first step and role definition name as "Contributor" where applicable.

   ```powershell
   New-AzRoleAssignment -PrincipalId "sfrpPrincipalId" `
   -RoleDefinitionId "4d97b98b-1d4f-4787-a291-c67834d212e7" `
   -ResourceName <resourceName> `
   -ResourceType <resourceType> `
   -ResourceGroupName <resourceGroupName>
   ```

4.	Use a [sample ARM deployment template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-DDoSNwProtection) that assigns roles and adds application gateway configuration as part of the service fabric managed cluster creation. Update the template with `principalId`, `appGatewayName`, and `appGatewayBackendPoolId` obtained above.
5.	You can also modify your existing ARM template and add new property `appGatewayBackendPoolId` under Microsoft.ServiceFabric/managedClusters resource that takes the resource ID of the application gateway.

  	   #### ARM template:
         
   ```JSON
        "frontendConfigurations": [ 
          { 
            "applicationGatewayBackendAddressPoolId": "<appGatewayBackendPoolId>" 
          } 
        ]
   ```
