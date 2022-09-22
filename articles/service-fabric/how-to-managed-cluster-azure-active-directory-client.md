---
title: How to configure Azure Service Fabric managed cluster for Azure active directory client access
description: Learn how to configure an Azure Service Fabric managed cluster for Azure active directory client access
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# How to configure Azure Service Fabric managed cluster for Active Directory client access

Cluster security is configured when the cluster is first set up and can't be changed later. Before setting up a cluster, read [Service Fabric cluster security scenarios](service-fabric-cluster-security.md). In Azure, Service Fabric uses x509 certificate to secure your cluster and its endpoints, authenticate clients, and encrypt data. Azure Active Directory is also recommended to secure access to management endpoints. Azure AD tenants and users must be created before creating the cluster. For more information, read Set up Azure AD to authenticate clients.

You add the Azure AD configuration to a cluster resource manager template by referencing the key vault that contains the certificate keys. Add those Azure AD parameters and values in a Resource Manager template parameters file (*azuredeploy.parameters.json*). 

> [!NOTE]
> On Azure AD tenants and users must be created before creating the cluster.  For more information, read [Set up Azure AD to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

```json
{
"type": "Microsoft.ServiceFabric/managedClusters",
"apiVersion": "2022-01-01",
"properties": {
      "azureActiveDirectory": {
      "tenantId": "[parameters('aadTenantId')]",
      "clusterApplication": "[parameters('aadClusterApplicationId')]",
      "clientApplication": "[parameters('aadClientApplicationId')]"
    },
   }
}
```
      
