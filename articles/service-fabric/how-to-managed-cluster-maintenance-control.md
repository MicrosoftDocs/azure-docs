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
1. Automatic OSUpgrade
2. Automatic extension upgrade
3. Automatic SF runtime version updates
4. Automatic cluster certificate update

>[!NOTE]
>This feature is in Preview right now and should not be used in Production deployments

![Overview][overviewimage]

**Requirements:**
* Maintenance window configuration needs to be defined only for the Service Fabric managed cluster resource
* The minimum supported window size is 5 hours

>[!NOTE]
>* This should only be enabled in the regions listed below. In all other regions, configuring this will not have any impact on the maintenance operations. There is work underway to block creation of maintenance configuration for SFMC, where it is not supported right now.
>* Supported Regions: eastus, eastus2, westus, westus2, westus3, soutncentralus, centralus, westeurope, northeurope, ukwest, uksouth, australiaeast, australiasoutheast, northcentralus, eastasia, southeastasia, japaneast, japanwest, southindia, westindia, centralindia, brazilsouth, koreacentral, koreasouth, centralcanada, eastcanada, francecentral, francesouth, australiacentral, australiacentral2, southafricawest, southafricanorth, uaecentral, uaenorth, switzerlandwest, switzerlandnorth, germanynorth, germanywestcentral, norwayeast, norwaywest, brazilsoutheast, jioindiawest, jioindiacentral, swedensouth, swedencentral, qatarcentral, polandcentral

## How does MaintenanceControl work for SFMC
* Customers need to define a maintenance configuration which contains the schedule and the recurrence rule for the maintenance window, by creating a maintenance configuration resource with the maintenance RP. [More details](https://learn.microsoft.com/azure/virtual-machines/maintenance-and-updates)
* Using this maintenance configuration, an assignment resource is created to assign the maintenance configuration to the SFMC cluster resource, thus linking the two.
* When this assignment resource is created, the maintenance RP notifies the ServiceFabric RP about the link and the maintenance control is then enabled on the SFMC cluster. All background maintenance operations are blocked outside the maintenance window.
* Whenever the maintenance window is activated as per the schedule in the maintenance configuraiton, the maintenance RP notifies the ServiceFabric RP which activates the maintenance window on corresponding SFMC cluster. All background operations are allowed to execute during this window.

>[!NOTE]
> The maintenance resources and the SFMC cluster resource should be created in the same region.

>[!NOTE]
>Known Issues:
>* There should be atmost one maintenance config resource assigned to a Service Fabric managed cluster. There is work underway to prevent assignment of more than one maintenance config. Until then users are expected to not do multiple config assignments.
>* Deleting just the maintenance config resource will not disable MaintenanceControl. To disable MaintenanceControl, you have to specifically delete the configAssignment for the cluster first, before deleting the maintenance config resource.

## Example deployment

The following is a step by step process to setup a cluster with maintenance control.
Download this sample which contains all the required resources. [Standard SKU Service Fabric managed cluster sample](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-1-NT-mrp/sfmc-deploy-autoscale.json)

1) Create resource group in a region

   ```powershell
   Login-AzAccount
   Select-AzSubscription -SubscriptionId $subscriptionid
   New-AzResourceGroup -Name $myresourcegroup -Location $location
   ```

2) Create cluster resource

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

This maintenance configuration defines a schedule for updates to happen everyday from 10PM PST, for 5hours, starting 30-05-2023. [More details about configuration](https://learn.microsoft.com/azure/templates/microsoft.maintenance/maintenanceconfigurations?pivots=deployment-language-arm-template)

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

>[!NOTE]
> As shown above, the maintenance configuration for SFMC cluster resource should have maintenanceScope: 'Resource' and maintenanceSubScope: 'SFMC'.

After the maintenance configuration is created, it has to be attached to the SFMC cluster, using the assignment resource. [More details about assignment](https://learn.microsoft.com/azure/templates/microsoft.maintenance/configurationassignments?pivots=deployment-language-arm-template)

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
                                "maintenanceConfigurationId": "/subscriptions/<subId>/resourcegroups/<rgName>/providers/microsoft.maintenance/maintenanceconfigurations/mc1"
                            }
                        }
                    ]
                }
            },
            "subscriptionId": "<subId>",
            "resourceGroup": "<rgName>"
        }
```

>[!NOTE]
>To disable the maintenance control on this cluster, delete the assignment defined above.

[overviewimage]: ./media/maintenance-control-sfmc/overview.png

