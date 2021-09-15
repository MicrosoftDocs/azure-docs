---
title: Configure autoscaling for Service Fabric managed cluster nodes
description: Learn how to configure autoscaling policies on Service Fabric managed cluster.
ms.topic: how-to
ms.date: 9/16/2021
---

# Introduction to Auto Scaling on Service Fabric managed clusters
[Auto scaling](../azure-monitor/autoscale/autoscale-overview.md) is an additional capability of a Service Fabric managed cluster to dynamically scale your resources based on the usage of resources. Auto scaling gives great elasticity and enables provisioning of additional or reduction of instances on demand. Auto scaling is an automated and transparent capability supported for secondary node types eliminating any need for manual scaling operations. Auto scaling can be enabled at any time for a secondary node type that is configured and available.

Requirements and supported Metrics:
* In order to use auto scaling on managed clusters, you need to be using API version `2021-07-01-preview` or higher. 
* Only the Service Fabric managed cluster standard SKU is supported for auto scale.
* Auto scaling is supported for both containers and regular Service Fabric services as it's based on resource usage of the underlying resources. 
* Supported auto scale rules are based on [Azure Monitor published metrics](../azure-monitor/essentials/metrics-supported.md)

A common scenario where auto-scaling is useful is when the load on a particular service varies over time. For example, a service such as a gateway can scale based on the amount of resources necessary to handle incoming requests. Let's take a look at an example of what those scaling rules could look like:
* If all instances of my gateway are using more than 70% on average, then scale the gateway service out by adding two more instance. Do this every hour, but never have more than twenty instances in total.
* If all instances of my gateway are using less than 40% cores on average, then scale the service in by removing one instance. Do this every hour, but never have fewer than three instances in total.

The rest of this article describes an example deployment, how to enable or disable auto scaling, and set example auto scale policies.

## Example auto scale deployment

This example will walk through: 
* Creating a Standard SKU Service Fabric managed cluster with two node types on one availability zone. 
* Adding auto scale rules to the secondary node type

>![NOTE] 
> Auto-scale of the node type is done based on managed VMSS CPU host metrics. 
> VMSS resource is auto-resolved in the template. 

The following steps will take you step by step through an end to end setup of a cluster with auto scale configured.

1) Create resource group in a region

   ```powershell 
   Login-AzAccount
   Select-AzSubscription -SubscriptionId $subscriptionid
   New-AzResourceGroup -Name $myresourcegroup -Location $location
   ```

2) Create cluster resource

   Download this sample [[Standard SKU Service Fabric managed cluster sample](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-2-NT) and edit the parameters as necessary. 
   Execute this command to deploy the cluster resource:

   ```powershell
   New-AzResourceGroupDeployment -Name "deploy_cluster" -ResourceGroupName $resourceGroupName -TemplateFile .\azuredeploy.json -TemplateParameterObject .\azuredeploy.parameters.json -Verbose
   ```

3) Configure auto scale rules on a secondary node type
 
   Download the [SF-Managed-Standard-SKU-autoscale sample template](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/SF-Managed-Standard-SKU-autoscale) that you will use to configure auto scaling with the following commands:

   ```powershell
   $parameters = @{ 
       clusterName = $clusterName
       SecondaryNodeTypeName = $secondaryNodeTypeName
    } 
   New-AzResourceGroupDeployment -Name "deploy_autoscale" -ResourceGroupName $resourceGroupName -TemplateFile .\sfmc-autoscale-enable.json -TemplateParameterObject $parameters -Verbose 
   ```

>![NOTE]
> After this deployment completes, future deployments should use -1 for secondary node types that have auto scale rules enabled. This will avoid cluster deployments conflicting with auto scale.


## Enable or disable auto scaling in a managed cluster

Service Fabric managed clusters do not configure auto scaling to be enabled by default for secondary node types. Auto scaling can be enabled or disabled at any time for a secondary node types that is configured and available<fixme reasource has to be 'ready' status>. 

To enable this feature configure the `enabled` property under the type `Microsoft.Insights/autoscaleSettings` for the cluster deployment as shown below:

```JSON
    "resources": [
        ...
        {
        "type": "Microsoft.Insights/autoscaleSettings",
        "apiVersion": "2015-04-01",
        "name": "[concat('Autoscale-', parameters('vmNodeType1Name'))]",
        "location": "[resourceGroup().location]",
        "dependsOn": [
            "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterDnsName'), '/nodetypes/', parameters('vmNodeType1Name'))]"
        ],
        "properties": {
            "name": "[concat('Autoscale-', parameters('vmNodeType1Name'))]",
            "targetResourceUri": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/',  resourceGroup().name, '/providers/Microsoft.ServiceFabric/managedclusters/', parameters('clusterDnsName'), '/nodetypes/', parameters('vmNodeType1Name'))]",
            "enabled": true,
            ...
```

To disable auto scaling, set the value to `false`

## Set policies for auto scaling

Service Fabric managed clusters do not configure any [policies for auto scaling](../azure-monitor/autoscale/autoscale-understanding-settings.md) by default. You can create and assign policies to secondary node types on a Service Fabric managed cluster resource at initial deployment or anytime after with an additional cluster deployment.

The following example will set a policy for `VmNodeType1Name` to be at least 3 nodes, but allow scaling up to 50 nodes. It will trigger scaling up off of average CPU usage being 70% over a 5 minute window using 1 minute granularity. It will also trigger to scale down if... xyz

```JSON
    "resources": [
            {
            "type": "Microsoft.Insights/autoscaleSettings",
            "apiVersion": "2015-04-01",
            "name": "[concat('Autoscale-', parameters('vmNodeType1Name'))]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "[concat('Microsoft.ServiceFabric/managedclusters/', parameters('clusterDnsName'), '/nodetypes/', parameters('vmNodeType1Name'))]"
            ],
            "properties": {
                "name": "[concat('Autoscale-', parameters('vmNodeType1Name'))]",
                "targetResourceUri": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/',  resourceGroup().name, '/providers/Microsoft.ServiceFabric/managedclusters/', parameters('clusterDnsName'), '/nodetypes/', parameters('vmNodeType1Name'))]",
                "enabled": "[parameters('enableAutoScale')]",
                "profiles": [
                    {
                        "name": "Autoscale by percentage based on CPU usage",
                        "capacity": {
                            "minimum": "3",
                            "maximum": "50",
                            "default": "3"
                        },
                        "rules": [
                            {
                                "metricTrigger": {
                                  "metricName": "Percentage CPU",
                                  "metricNamespace": "",
                                  "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/<this_vmss_name>",
                                  "timeGrain": "PT5M",
                                  "statistic": "Average",
                                  "timeWindow": "PT30M",
                                  "timeAggregation": "Average",
                                  "operator": "GreaterThan",
                                  "threshold": 70
                                },
                                "scaleAction": {
                                  "direction": "Increase",
                                  "type": "ChangeCount",
                                  "value": "5",
                                  "cooldown": "PT5M"
                                }
                            },
                            {
                                "metricTrigger": {
                                  "metricName": "Percentage CPU",
                                  "metricNamespace": "",
                                  "metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachineScaleSets/<this_vmss_name>",
                                  "timeGrain": "PT5M",
                                  "statistic": "Average",
                                  "timeWindow": "PT30M",
                                  "timeAggregation": "Average",
                                  "operator": "LessThan",
                                  "threshold": 40
                                },
                                "scaleAction": {
                                  "direction": "Decrease",
                                  "type": "ChangeCount",
                                  "value": "5",
                                  "cooldown": "PT5M"
                                }
                            }
                            ]
                        }
                    ]
                }
            }
        
    ]                           
```

## View and configure the scale definition of your managed cluster secondary node resource

We recommend using [Azure Resource Explorer](https://resources.azure.com/) to view and configure autoscale settings for a secondary node type as an alternative to ARM templates.

1) Go to [Azure Resource Explorer](https://resources.azure.com/)

2) Navigate to subscriptionID -> SFMC resource group created above -> microsoft.insights -> autoscalesettings -> Auto Scale policy 'Name'. You'll see the following `autoscalesettings` under Microsoft.Insights node.

<screenshot>

On the right-hand side, you can view the full definition of this autoscale setting. In this example, auto scale is configured with a CPU% based scale-out and scale-in rule.

<screenshot>

3) You can [edit auto scale settings based on specific requirements by following this walkthrough](../azure-monitor/autoscale/autoscale-virtual-machine-scale-sets.md). To understand profiles and rules in autoscale, review [Autoscale Best Practices](../azure-monitor/autoscale/autoscale-best-practices.md).

4) Any changes made will be reflected after you save them.


## Next steps
[Autoscale a scale set with with an Azure template](../virtual-machine-scale-sets/tutorial-autoscale-template.md)
[Autoscale a scale set with Azure Powershell](../virtual-machine-scale-sets/tutorial-autoscale-powershell.md)
[Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)