---
title: Configure autoscaling for Service Fabric managed cluster nodes
description: Learn how to configure autoscaling policies on Service Fabric managed cluster.
ms.topic: how-to
ms.date: 9/16/2021
---

# Introduction to Auto Scaling on Service Fabric managed clusters
[Auto scaling](../architecture/best-practices/auto-scaling.md) is an additional capability of Service Fabric to dynamically scale your services based on the load that services are reporting, or based on their usage of resources. Auto scaling gives great elasticity and enables provisioning of additional instances or partitions of your service on demand. The entire auto scaling process is automated and transparent, and once you set up your policies on a 
service there is no need for manual scaling operations at the service level. Auto scaling can be turned on either at service creation 
time, or at any time by updating the service.

A common scenario where auto-scaling is useful is when the load on a particular service varies over time. For example, a service such as a gateway can scale based on the amount of resources necessary to handle incoming requests. Let's take a look at an example of what those scaling rules could look like:
* If all instances of my gateway are using more than two cores on average, then scale the gateway service out by adding one more instance. Do this every hour, but never have more than seven instances in total.
* If all instances of my gateway are using less than 0.5 cores on average, then scale the service in by removing one instance. Do this every hour, but never have fewer than three instances in total.

Auto scaling is supported for both containers and regular Service Fabric services. In order to use auto scaling on managed clusters, you need to be using API version `2021-07-01-preview` or higher. 

The rest of this article describes how to enable or disable auto scaling, set policies, and walks through a full example.

## Describing auto scaling
Auto scaling policies can be defined for each service in a Service Fabric cluster. Each scaling policy consists of two parts:
* **Scaling trigger** describes when scaling of the service will be performed. Conditions that are defined in the trigger are checked against the conditions you configure to determine if a service should be scaled or not. 

* **Scaling mechanism** describes how scaling will be performed when it is triggered. Mechanism is only applied when the conditions from the trigger are met.

<fixme All triggers that are currently supported work either with [logical load metrics](service-fabric-cluster-resource-manager-metrics.md), or 
with physical metrics like CPU or memory usage. Either way, Service Fabric will monitor the reported load for the metric, and will 
evaluate the trigger periodically to determine if scaling is needed. >

<fixme There are two mechanisms that are currently supported for auto scaling. The first one is meant for stateless services or for containers 
where auto scaling is performed by adding or removing [instances](service-fabric-concepts-replica-lifecycle.md). For both stateful and 
stateless services, auto scaling can also be performed by adding or removing named [partitions](service-fabric-concepts-partitioning.md) 
of the service.>

> [!NOTE]
> Currently there is only support for policies based on metrics emitted from VMSS and only one scaling trigger per scaling policy.


## Example auto scale deployment

In this example we'll use this [ARM template sample](url) which will create a SFMC cluster with two node types. One primary and one secondary in one availability zone.

Auto-scale of the node type is done based on managed VMSS CPU host metrics. 
VMSS resource is auto-resolved in the template. 

The following steps will take you step by step through an end to end setup of a cluster with auto scale configured.

1) Create resource group in a region

   ```powershell 
   Login-AzAccount
   Select-AzSubscription -SubscriptionId $subscriptionid
   New-AzResourceGroup -Name $myresourcegroup -Location $location
   ```

2) Create cluster resource

   Using the template you downloaded above, execute these commands:

   ```powershell
   $parameters = @{ 
       clusterDnsName = "mycluster" 
      } 
   New-AzResourceGroupDeployment -Name "deploy_cluster" -ResourceGroupName $resourceGroupName -TemplateFile .\cluster.json -TemplateParameterObject $parameters -Verbose
   ```

3) Configure auto scale rules on a secondary node type
 
   Download this [sample ARM template](url) that you will use to configure auto scaling with the following commands:

   ```powershell
   $parameters = @{ 
       clusterName = $clusterName 
       SecondaryNodeTypeName = $SecondaryNodeTypeName
    } 
   New-AzResourceGroupDeployment -Name "deploy_autoscale" -ResourceGroupName $resourceGroupName -TemplateFile .\cluster.json -TemplateParameterObject $parameters -Verbose 
   ```

>![NOTE]
>After this deployment completes, future deployments should use -1 for secondary node types that have auto scale rules enabled. This will avoid cluster deployments conflicting with auto scale.


## Enable or disable auto scaling in a managed cluster

Service Fabric managed clusters do not configure auto scaling to be enabled by default. You can enable or disable auto scaling on secondary node types on a Service Fabric managed cluster resource at initial deployment or anytime after with an additional cluster deployment. Only the Service Fabric managed cluster standard SKU is supported for auto scale.

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

<fix sample to include both scale up and down>

```JSON
    "resources": [
        ...
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
                                "metricResourceUri": "[concat('/subscriptions/', subscription().subscriptionId, '/resourceGroups/SFC_', reference(parameters('clusterDnsName')).clusterId,'/providers/Microsoft.Compute/virtualMachineScaleSets/', parameters('vmNodeType1Name'))]",
                                "timeGrain": "PT1M",
                                "statistic": "Average",
                                "timeWindow": "PT5M",
                                "timeAggregation": "Average",
                                "operator": "LessThan",
                                "threshold": 70
                            },
                            "scaleAction": {
                                "direction": "Increase",
                                "type": "ChangeCount",
                                "value": "20",
                                "cooldown": "PT1M"
                            }
```


## Review deployed auto scale rules

Todo: Document how to visualize
To visualize your settings
https://resources.azure.com navigate to subscription -> SFMC resource group -> microsoft.insights -> autoscalesettings -> Auto Scale policy 'Name'

Use ARM client (powershell examples). Retrieve via what commands


## Next steps
[Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)