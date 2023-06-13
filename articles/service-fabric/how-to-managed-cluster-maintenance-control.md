---
title: Configure maintenance control for Service Fabric managed cluster
description: Learn how to configure maintenance control for Service Fabric managed cluster
ms.topic: how-to
ms.author: ashank
author: ashank
ms.service: service-fabric
services: service-fabric
ms.date: 05/31/2023
---

# (Preview) Introduction to MaintenanceControl on Service Fabric managed clusters
Service Fabric managed clusters have multiple background operations which are necessary to the keep all the cluster entities updated, thus ensuring security and reliability. Even though these operations are critical, but executing in the background can create interruptions to the workloads, as the service replica
can move to different nodes as a result of the maintenance operations. This results in undesired failovers if the maintenance operation executes during peak business hours.
With the support for MaintenanceControl in Service Fabric managed clusters, customers would be able to define a recurring (daily, weekly, monthly) and custom maintenance window for their SFMC cluster resource, as per their needs and all background maintenance operations will ony be allowed to execute during this maintenance window.
MaintenanceControl will be specifically applicable to these background operations:
1. AutoOSUpgrade
2. Automatic extension upgrade
3. Automatic SF runtime version updates
4. Automatic cluster certificate update


![Overview][overviewimage]

**Requirements:**
* Maintenance window configuration needs to be defined only for the Service Fabric managed cluster resource
* The minimum supported window size is 5hours

>[!NOTE]
> This feature is in Preview right now and should not be used in Production deployments
> This should only be enabled in the regions listed below. In all other regions, defining this will not have any impact on the maintenance operations. There is work underway to block creation of maintenance configuration for SFMC, where they are not supported right now.
> Supported Regions:

##How is Maintenance configuration done. what is required

>[!NOTE] Known Issues
> There should be atmost one maintenance config resource assigned to a Service Fabric managed cluster. There is work underway to prevent assignment of more than one maintenance config. Until then users are expected to not do multiple config assignments.
> Deleting just the maintenance config resource will not disable MaintenanceControl. To disable MaintenanceControl, you have to specifically delete the configAssignment for the cluster first, before deleting the maintenance config resource.

- Details about Maintenance configuration. step by step

A common scenario where autoscaling is useful is when the load on a particular service varies over time. For example, a service such as a gateway can scale based on the amount of resources necessary to handle incoming requests. Let's take a look at an example of what those scaling rules could look like and we'll use them later in the article:
* If all instances of my gateway are using more than 70% on average, then scale the gateway service out by adding two more instances. Do this every 30 minutes, but never have more than twenty instances in total.
* If all instances of my gateway are using less than 40% cores on average, then scale the service in by removing one instance. Do this every 30 minutes, but never have fewer than three instances in total.

## Example deployment

The following will take you step by step through setup of a cluster with maintenance control.

1) Create resource group in a region

   ```powershell
   Login-AzAccount
   Select-AzSubscription -SubscriptionId $subscriptionid
   New-AzResourceGroup -Name $myresourcegroup -Location $location
   ```

2) Create cluster resource

   Download this sample [Standard SKU Service Fabric managed cluster sample](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Autoscale/azuredeploy.json)
   Execute this command to deploy the cluster resource:

   ```powershell
   $parameters = @{
   clusterName = $clusterName
   adminPassword = $VmAdminPassword
   clientCertificateThumbprint = $clientCertificateThumbprint
   }
   New-AzResourceGroupDeployment -Name "deploy_cluster" -ResourceGroupName $resourceGroupName -TemplateFile .\azuredeploy.json -TemplateParameterObject $parameters -Verbose
   ```

3) Configure and enable maintenance control on the cluster using the following maintenance configuration:

## Create maintenance configuration using the template deployment

This maintenance configuration defined a schedule for updates to happen everyday startign 10PM PST, starting 30-05-2023.
The startDateTime needs to be specifed as an ISO8601 value.

```JSON
    "resources": [
        {
            "type": "Microsoft.Maintenance/maintenanceConfigurations",
            "apiVersion": "2022-07-01-preview",
            "name": "mc1",
            "location": "[parameters('location')]",
            "properties": {
                "maintenanceScope": "Resource",
                "extensionProperties": {
                   "maintenanceSubScope": "SFMC"
                },
                "maintenanceWindow": {
                    "startDateTime": "2023-05-30 22:00",
                    "duration": "05:00",
                    "timeZone": "Pacific Standard Time",
                    "expirationDateTime": null,
                    "recurEvery": "1Day"
                }
            }
        }
```

## Enable maintenance on the SFMC cluster by assigning the above define maintenance config

```JSON
    "resources": [
        { 
           "type": "Microsoft.Resources/deployments",
            "apiVersion": "2022-09-01",
            "name": "ConfigurationAssignmentsName",
            "dependsOn": [
                "[concat('Microsoft.Maintenance/maintenanceConfigurations/', 'mc1')]",
                "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]"
            ],
            "properties": {
                "mode": "Incremental",
                "template": {
                    "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "resources": [
                        {
                            "apiVersion": "2022-07-01-preview",
                            "type": "Microsoft.Maintenance/configurationAssignments",
                            "name": "mc1Assignment",
                            "location": "[parameters('location')]",
                            "scope": "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterName'))]",
                            "tags": {},
                            "properties": {
                                "maintenanceConfigurationId": "/subscriptions/13ad2c84-84fa-4798-ad71-e70c07af873f/resourcegroups/testrg09/providers/microsoft.maintenance/maintenanceconfigurations/mc1"
                            }
                        }
                    ]
                }
            },
            "subscriptionId": "13ad2c84-84fa-4798-ad71-e70c07af873f",
            "resourceGroup": "testrg09"
        }
```

To disable the maintenance control on this cluster, delete the assignment defined above.

You can download this [ARM Template to enable autoscale](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT-Autoscale/sfmc-deploy-autoscale.json) which contains the above example

[overviewimage]: ./media/maintenance-control-sfmc/overview.png

