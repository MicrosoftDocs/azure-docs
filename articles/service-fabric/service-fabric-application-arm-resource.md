---
title: Deploy and upgrade applications and services with Azure Resource Manager | Microsoft Docs
description: Learn how to deploy applications and services to a Service Fabric cluster using an Azure Resource Manager template.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/06/2017
ms.author: dekapur

---
# Manage applications and services as Azure Resource Manager resources

You can deploy applications and services onto your Service Fabric cluster via Azure Resource Manager. This means that instead of deploying and managing applications via PowerShell or CLI after having to wait for the cluster to be ready, you can now express applications and services in JSON and deploy them in the same Resource Manager template as your cluster. The process of application registration, provisioning, and deployment all happens in one step.

This is the recommended way for you to deploy any setup, governance, or cluster management applications that you require in your cluster. This includes the [Patch Orchestration Application](service-fabric-patch-orchestration-application.md), Watchdogs, or any applications that need to be running in your cluster before other applications or services are deployed. 

When applicable, manage your applications as Resource Manager resources to improve:
* Audit trail: Resource Manager audits every operation and keeps a detailed *Activity Log* that can help you trace any changes made to these applications and your cluster.
* Role-based access control (RBAC): Managing access to clusters as well as applications deployed on the cluster can be done via the same Resource Manager template.
* Azure Resource Manager (via Azure portal) becomes a one-stop-shop for managing your cluster and critical application deployments.

The following snippet shows the different kinds of resources that can be managed via a template:

```json
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applications",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
    "location": "[variables('clusterLocation')]",
},
{
    "apiVersion": "2017-07-01-preview",
    "type": "Microsoft.ServiceFabric/clusters/applications/services",
    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
    "location": "[variables('clusterLocation')]"
}
```


## Add a new application to your Resource Manager template

1. Prepare your cluster's Resource Manager template for deployment. See [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md) for more information on this.
2. Think about some of the applications you plan on deploying in the cluster. Are there any that will always be running that other applications may take dependencies on? Do you plan on deploying any cluster governance or setup applications? These sorts of applications are best managed via a Resource Manager template, as discussed above. 
3. Once you have figured out what applications you want to be deployed this way, the applications have to be packaged, zipped, and put on a file share. The share needs to be accessible through a REST endpoint for Azure Resource Manager to consume during deployment.
4. In your Resource Manager template, below your cluster declaration, describe each application's properties. These properties include replica or instance count and any dependency chains between resources (other applications or services). For a list of comprehensive properties, see the [REST API Swagger Spec](https://aka.ms/sfrpswaggerspec). Note that this does not replace the Application or Service manifests, but rather describes some of what is in them as part of the cluster's Resource Manager template. Here is a sample template that includes deploying a stateless service *Service1* and a stateful service *Service2* as part of *Application1*:

   ```json
   {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "clusterName": {
        "type": "string",
        "defaultValue": "Cluster",
        "metadata": {
          "description": "Name of your cluster - Between 3 and 23 characters. Letters and numbers only."
        }
      },
      "applicationTypeName": {
        "type": "string",
        "defaultValue": "ApplicationType",
        "metadata": {
          "description": "The application type name."
        }
      },
      "applicationTypeVersion": {
        "type": "string",
        "defaultValue": "1",
        "metadata": {
          "description": "The application type version."
        }
      },
      "appPackageUrl": {
        "type": "string",
        "metadata": {
          "description": "The URL to the application package sfpkg file."
        }
      },
      "applicationName": {
        "type": "string",
        "defaultValue": "Application1",
        "metadata": {
          "description": "The name of the application resource."
        }
      },
      "serviceName": {
        "type": "string",
        "defaultValue": "Application1~Service1",
        "metadata": {
          "description": "The name of the service resource in the format of {applicationName}~{serviceName}."
        }
      },
      "serviceTypeName": {
        "type": "string",
        "defaultValue": "Service1Type",
        "metadata": {
          "description": "The name of the service type."
        }
      },
      "serviceName2": {
        "type": "string",
        "defaultValue": "Application1~Service2",
        "metadata": {
          "description": "The name of the service resource in the format of {applicationName}~{serviceName}."
        }
      },
      "serviceTypeName2": {
        "type": "string",
        "defaultValue": "Service2Type",
        "metadata": {
          "description": "The name of the service type."
        }
      }
    },
    "variables": {
      "clusterLocation": "[resourcegroup().location]"
    },
    "resources": [
      {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters/applicationTypes",
        "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'))]",
        "location": "[variables('clusterLocation')]",
        "dependsOn": [],
        "properties": {
          "provisioningState": "Default"
        }
      },
      {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters/applicationTypes/versions",
        "name": "[concat(parameters('clusterName'), '/', parameters('applicationTypeName'), '/', parameters('applicationTypeVersion'))]",
        "location": "[variables('clusterLocation')]",
        "dependsOn": [
          "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applicationTypes/', parameters('applicationTypeName'))]"
        ],
        "properties": {
          "provisioningState": "Default",
          "appPackageUrl": "[parameters('appPackageUrl')]"
        }
      },
      {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters/applications",
        "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
        "location": "[variables('clusterLocation')]",
        "dependsOn": [
          "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applicationTypes/', parameters('applicationTypeName'), '/versions/', parameters('applicationTypeVersion'))]"
        ],
        "properties": {
          "provisioningState": "Default",
          "typeName": "[parameters('applicationTypeName')]",
          "typeVersion": "[parameters('applicationTypeVersion')]",
          "parameters": {},
          "upgradePolicy": {
            "upgradeReplicaSetCheckTimeout": "01:00:00.0",
            "forceRestart": "false",
            "rollingUpgradeMonitoringPolicy": {
              "healthCheckWaitDuration": "00:02:00.0",
              "healthCheckStableDuration": "00:05:00.0",
              "healthCheckRetryTimeout": "00:10:00.0",
              "upgradeTimeout": "01:00:00.0",
              "upgradeDomainTimeout": "00:20:00.0"
            },
            "applicationHealthPolicy": {
              "considerWarningAsError": "false",
              "maxPercentUnhealthyDeployedApplications": "50",
              "defaultServiceTypeHealthPolicy": {
                "maxPercentUnhealthyServices": "50",
                "maxPercentUnhealthyPartitionsPerService": "50",
                "maxPercentUnhealthyReplicasPerPartition": "50"
              }
            }
          }
        }
      },
      {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters/applications/services",
        "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName'))]",
        "location": "[variables('clusterLocation')]",
        "dependsOn": [
          "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applications/', parameters('applicationName'))]"
        ],
        "properties": {
          "provisioningState": "Default",
          "serviceKind": "Stateless",
          "serviceTypeName": "[parameters('serviceTypeName')]",
          "instanceCount": "-1",
          "partitionDescription": {
            "partitionScheme": "Singleton"
          },
          "correlationScheme": [],
          "serviceLoadMetrics": [],
          "servicePlacementPolicies": []
        }
      },
      {
        "apiVersion": "2017-07-01-preview",
        "type": "Microsoft.ServiceFabric/clusters/applications/services",
        "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'), '/', parameters('serviceName2'))]",
        "location": "[variables('clusterLocation')]",
        "dependsOn": [
          "[concat('Microsoft.ServiceFabric/clusters/', parameters('clusterName'), '/applications/', parameters('applicationName'))]"
        ],
        "properties": {
          "provisioningState": "Default",
          "serviceKind": "Stateful",
          "serviceTypeName": "[parameters('serviceTypeName2')]",
          "targetReplicaSetSize": "3",
          "minReplicaSetSize": "2",
          "replicaRestartWaitDuration": "00:01:00.0",
          "quorumLossWaitDuration": "00:02:00.0",
          "standByReplicaKeepDuration": "00:00:30.0",
          "partitionDescription": {
            "partitionScheme": "UniformInt64Range",
            "count": "5",
            "lowKey": "1",
            "highKey": "5"
          },
          "hasPersistedState": "true",
          "correlationScheme": [],
          "serviceLoadMetrics": [],
          "servicePlacementPolicies": [],
          "defaultMoveCost": "Low"
        }
      }
    ]
   }
   ```

   > [!NOTE] 
   > The *apiVersion* must be set to `"2017-07-01-preview"`. This template can also be deployed independently of the cluster, as long as the cluster has already been deployed.

5. Deploy! 

## Remove Service Fabric Resource Provider Application resource
The following will trigger the app package to be un-provisioned from the cluster, and this will clean up the disk space used:
```powershell
Get-AzureRmResource -ResourceId /subscriptions/{sid}/resourceGroups/{rg}/providers/Microsoft.ServiceFabric/clusters/{cluster}/applicationTypes/{apptType}/versions/{version} -ApiVersion "2017-07-01-preview" | Remove-AzureRmResource -Force -ApiVersion "2017-07-01-preview"
```
Simply removing Microsoft.ServiceFabric/clusters/application from your ARM template will not unprovision the Application

>[!NOTE]
> Once the removal is complete you should not see the package version in SFX or ARM anymore. You cannot delete the application type version resource that the application is running with; ARM/SFRP will prevent this. If you try to unprovision the running package, SF runtime will prevent it.


## Manage an existing application via Resource Manager

If your cluster is already up and some applications that you would like to manage as Resource Manager resources are already deployed on it, instead of removing the applications and redeploying them, you can use a PUT call using the same APIs to have the applications get acknowledged as Resource Manager resources. 

> [!NOTE]
> To allow a cluster upgrade to ignore unhealthy apps the customer can specify “maxPercentUnhealthyApplications: 100” in the “upgradeDescription/healthPolicy” section; detailed descriptions for all settings are in [Service Fabrics REST API Cluster Upgrade Policy documentation](https://docs.microsoft.com/rest/api/servicefabric/sfrp-model-clusterupgradepolicy).

## Next steps

* Use the [Service Fabric CLI](service-fabric-cli.md) or [PowerShell](service-fabric-deploy-remove-applications.md) to deploy other applications to your cluster. 
* [Upgrade your Service Fabric cluster](service-fabric-cluster-upgrade.md)

