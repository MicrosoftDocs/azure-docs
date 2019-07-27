---
title: Service Fabric Application Resource Model  | Microsoft Docs
description: This article is an overview of the managing Service Fabric Application through ARM(Azure Resource Manager).
services: service-fabric
author: atsenthi 

ms.service: service-fabric
ms.topic: conceptual 
ms.date: 07/25/2019
ms.author: atsenthi 
---

# What is  Service Fabric Application Resource Model?

Service Fabric applications and services are recommended to be deployed onto your Service Fabric cluster via Azure Resource Manager(ARM). This means that instead of deploying and managing applications via PowerShell or CLI after having to wait for the cluster to be ready, you can describe applications and services in JSON and deploy them in the same Resource Manager template. The process of application registration, provisioning, and deployment all happens in one step. This is best practice for managing application lifecycle. 

## \<details about App Resource Model\>

Information about App Resource Model.

https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-model
https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-and-service-manifests


In this document, you will earn how to:

> [!div class="checklist"]
> * Deploy application resources using ARM 
> * Upgrade application resoruce using 
> * Delete Application resource 

## Deploy application resources using ARM  
          Package an application[https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg]
          Create arm template , update parameters file with appliction details
          
          
```json
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2019-03-01",
    "type": "Microsoft.ServiceFabric/clusters/applications/services",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
    "location": "[variables('clusterLocation')]"
}
```



## Upgrade Application resources

## Delete application resources

## 

## Next steps
