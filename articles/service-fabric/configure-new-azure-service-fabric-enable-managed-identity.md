---
title: Azure Service Fabric - Configure New Service Fabric cluster to Enable Managed Identity Token Service | Microsoft Docs
description: This article shows you how to create a new Service Fabric cluster with Managed Identity enabled
services: service-fabric
author: athinanthny

ms.service: service-fabric
ms.topic: article
ms.date: 07/25/2019
ms.author: atsenthi
---

# Configure New Azure Service Fabric cluster to enable Managed Identity Token Service

To support Service Fabric applications with managed identities, first the cluster needs to be configured to enable **Managed Identity Token Service** system service.
When the service is enabled, you can see it from Service Fabric Explorer with name  **fabric:/System/ManagedIdentityTokenService** next to other system services in the left tree view under **System** section.

  
## Prerequisites

To enable **Managed Identity Token Service**, the cluster needs to be running with Service Fabric 6.5.658.9590 or above version.  

## Create Azure Service Fabric cluster with Managed Identity Token Service enabled
Creation of an Azure Service Fabric cluster can be done via Azure Resource Manager template deployment. Use the Azure Resource Manager template sample here to create a cluster with Managed Identity token service enabled.
      
* You can find the Service Fabric version from Azure portal by opening the cluster resource and check the **Service Fabric version** property in the **Essentials** section.

* If your cluster is on **Manual** upgrade mode, you need to first upgrade it to 6.5.658.9590 or above.

## Upgrade Azure Service Fabric cluster to Enable Managed Identity Token Service
You can enable **Managed Identity Token Service** through Azure Resource Manager template deployment, by adding following section in the fabricSettings  section for the cluster resource:

    "fabricSettings": [
        {
            "name": "ManagedIdentityTokenService",
            "parameters": [
                {
                    "name": "IsEnabled",
                    "value": "true"
                }
            ]
        }
    ]

If you are enabling the **Managed Identity Token Service** on an existing cluster, you also need to include an upgrade policy with **forceRestart** flag in the cluster resource:

    "upgradeDescription": {
        "forceRestart": true,
        "healthCheckRetryTimeout": "00:45:00",
        "healthCheckStableDuration": "00:05:00",
        "healthCheckWaitDuration": "00:05:00",
        "upgradeDomainTimeout": "02:00:00",
        "upgradeReplicaSetCheckTimeout": "1.00:00:00",
        "upgradeTimeout": "12:00:00"
    }

###Troubleshooting 

##Errors
If the deployment fails with this message, it means the cluster is not on the required Service Fabric version:

    {
        "code": "ParameterNotAllowed",
        "message": "Section 'ManagedIdentityTokenService' and Parameter 'IsEnabled' is not allowed."
    }

## Next steps

Link to how to enable application to use managed identity.