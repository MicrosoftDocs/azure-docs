---
title: Service Fabric Application Resource Model  | Microsoft Docs
description: This article is an overview of managing a Service Fabric application with Azure Resource Manager
services: service-fabric
author: athinanthny 

ms.service: service-fabric
ms.topic: conceptual 
ms.date: 07/25/2019
ms.author: atsenthi 
---

# What is  Service Fabric Application Resource Model?

It is recommended that Service Fabric applications are deployed onto your Service Fabric cluster via Azure Resource Manager. This method makes it possible to describe applications and services in JSON and deploy them in the same Resource Manager template as your cluster. As opposed to deploying and managing applications via Powershell or Azure CLI, there is no need to wait for the cluster to be ready. The process of application registration, provisioning, and deployment all happens in one step. This is the best practice to manage application life cycle in your cluster. For more information, look at [best practices](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-best-practices-infrastructure-as-code#azure-service-fabric-resources)


When applicable, manage your applications as Resource Manager resources to improve:
* Audit trail: Resource Manager audits every operation and keeps a detailed *Activity Log* that can help you trace any changes made to these applications and your cluster.
* Role-based access control: Managing access to clusters as well as applications deployed on the cluster can be done via the same Resource Manager template.
* Azure Resource Manager (via Azure portal) becomes a one-stop-shop for managing your cluster and critical application deployments.



##Samples 


In this document, you will learn how to:

> [!div class="checklist"]
> * Deploy application resources using Azure Resource Manager 
> * Upgrade application resoruce using Azure Resource Manager
> * Delete Application resource 

## Deploy application resources using Azure Resource Manager  
       To deploy an application and its services using the Azure Resource Manager application resource model, you need to package application code, upload the package, and then reference the location of package in an Azure Resource Manager template as an application resource. Steps to package an application can be found (here).[https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-package-apps#create-an-sfpkg]
          
       Then, create an Azure Resource Manager template, update the parameters file with application details, and deploy it on the Service Fabric cluster. Refer to samples here
           
           
          
          
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

    Applications already deployed to a Service Fabric cluster will be upgraded for below reasons,
    i) To add new service to application
    ii) To upgrade existing service
     
## Delete application resources
    Applications deployed using the application resource model in Azure Resource Manager can be deleted from cluster using below methods
    i) delete application resources using Azure Remove
    ii) delete application type
           
## Next steps

Information about App Resource Model.

https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-model
https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-and-service-manifests
