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

Service Fabric applications and services are recommended to be deployed onto your Service Fabric cluster via Azure Resource Manager(ARM). This allows to describe applications and services in JSON and deploy them in the same Resource Manager template as your cluster. There is no need to wait for cluster to be ready compared to deploying and managing applications via PowerShell or CLI. The process of application registration, provisioning, and deployment all happens in one step. This is the recommended and best practice to manage application lifecycle management in your cluster. Best practices([https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code#azure-service-fabric-resources])

When applicable, manage your applications as Resource Manager resources to improve:
* Audit trail: Resource Manager audits every operation and keeps a detailed *Activity Log* that can help you trace any changes made to these applications and your cluster.
* Role-based access control (RBAC): Managing access to clusters as well as applications deployed on the cluster can be done via the same Resource Manager template.
* Azure Resource Manager (via Azure portal) becomes a one-stop-shop for managing your cluster and critical application deployments.



##Samples 


In this document, you will learn how to:

> [!div class="checklist"]
> * Deploy application resources using ARM 
> * Upgrade application resoruce using ARM
> * Delete Application resource 

## Deploy application resources using ARM  
       To deploy applicaiton and its services using ARM application resource model, you need to package application code, upload teh application package codeand then reference the location of package in ARM template as an application resource. Here is how to package an application[https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg]
          
          Then create ARM template , update parameters file with appliction details and then deploy it on the Service Fabric cluster . Refere to samples here
           
           
          
          
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
     Applications already deployed to SErvice Fabric cluster will be upgraded for below reasons,
     i) To add new service to application
     ii) To upgrade existing service
     
## Delete application resources
      Applications deployed using application resource model in ARM can be deleted from cluster using below methods
           i) delete applicaiton resoruce using Azure Remove
           ii) delete applicaiton type
           
## 

## Next steps


Information about App Resource Model.

https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-model
https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-and-service-manifests
