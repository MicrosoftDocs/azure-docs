---
title: Enable and configure autoscaling for Service Fabric managed cluster nodes
description: Learn how to enable and configure autoscaling policies on Service Fabric managed cluster.
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

## Enable or disable auto scaling in a managed cluster

Service Fabric managed clusters do not configure auto scaling to be enabled by default. You can enable or disable auto scaling on non-primary/secondary node types on a Service Fabric managed cluster resource at initial deployment or anytime after with an additional cluster deployment.

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

The following example will set a policy for `VmNodeType1Name` to be at least 3 nodes, but allow scaling up to 50 nodes. It will trigger off of average CPU usage being 70% over a 5 minute window using 1 minute granularity.

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


## Example auto scale deployment
In this example the following Topology will be created:
3 AvailabilityZones for a zonal redundant cluster
1 IP 
1 LB

With the following node types
FE - primary node type
BE - regular node type - 1 auto-scale rule  
BESL - stateless node type - 1 auto-scale rule 
BEMPG - high capacity node type - 1 auto-scale rule 

 
In this example we'll be executing the following steps:
1) Do two ARM template deployments 
2) 1st deployment will deploy the cluster with the auto-scale rules disabled in same template. 
3) 2nd deployment will enable auto-scale rules 
 
Auto-scale of the node type is done based on managed VMSS CPU host metrics. 
VMSS resource is auto-resolved in the template. 


Steps: 

1) Copy template to a local folder. 

Full sample template <here> <<cluster.json>>

2) Create resource group in a region

   ```powershell 
   $location = "eastus2" 
   $resourceGroupName = "myrg" 
 
   New-AzResourceGroup -Name $resourceGroupName -Location $location 
   ```

3) Create cluster with auto-scale rules disabled

   ```powershell
   $clusterDnsName = "mycluster" 
   ```
   This deployment will have:
    - the default VM counts will apply 
    - Autoscale disabled 

   ```powershell
   $parameters = @{ 
       clusterDnsName = $clusterDnsName 
       adminPassword = "<password>" 
       sku="Standard" 
       clientAdminCertThumbrint="123BDACDCDFB2C7B250192C6078E47D1E1DB119B" 
   } 
 
   $deploymentname="deploy_cluster1" 

   New-AzResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile .\cluster.json -TemplateParameterObject $parameters -Verbose 
   ```

4) Enable Auto Scale
 
```powershell
$parameters = @{ 
    clusterDnsName = $clusterDnsName 
    adminPassword = "<password>" 
    sku="Standard" 
    clientAdminCertThumbrint="123BDACDCDFB2C7B250192C6078E47D1E1DB119B" 
    enableAutoScale=$true 
    nt1InstanceCount=-1 
    nt2InstanceCount=-1 
    nt3InstanceCount=-1 
} 

$deploymentname="deploy_cluster2" 

New-AzResourceGroupDeployment -Name $deploymentName -ResourceGroupName $resourceGroupName -TemplateFile .\cluster.json -TemplateParameterObject $parameters -Verbose 
```


## Next steps
[Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)