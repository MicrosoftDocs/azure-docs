---
title: Azure Service Fabric Application and Cluster Best Practices | Microsoft Docs
description: Best practices for managing Service Fabric clusters and applications.
services: service-fabric
documentationcenter: .net
author: pepogors
manager: chackdan
editor: ''

ms.assetid: 19ca51e8-69b9-4952-b4b5-4bf04cded217
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: 
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 1/10/2019
ms.author: pepogors

---
### Link to a production ready ARM Template!!!

## Azure Service Fabric Application and Cluster Best Practices
To manage Azure Service Fabric applications and clusters successfully, there are conditional operations that we highly recommend you preform, to optimize for the reliability of your production environment.

## Security 
For more information about [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/) please check out [Azure Service Fabric security best practices](https://docs.microsoft.com/azure/security/azure-service-fabric-security-best-practices)
### KeyVault
[Azure KeyVault](https://docs.microsoft.com/azure/key-vault/) is the recommended secrets management service for Azure Service Fabric applications and clusters.
> [!NOTE]
> Azure KeyVault and compute resources must be co-located in the same region.  
-- Portal Blade Common Name Cert Generation
#### Reliably Deploy KeyVault Certificates to your Service Fabric Cluster's Virtual Machine Scale Sets
[Microsoft.Compute/virtualMachineScaleSet.properties.virtualMachineProfile.osProfile](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) is how you reliably deploy KeyVault certificates to your Service Fabric Cluster's Virtual Machine Scale Sets, and the following is the Resource Manager template properties that you will use: 
```json
"secrets": [
   {
       "sourceVault": {
           "id": "[parameters('sourceVaultValue')]"
       },
       "vaultCertificates": [
          {
              "certificateStore": "[parameters('certificateStoreValue')]",
              "certificateUrl": "[parameters('certificateUrlValue')]"
          }
       ]
   }
]
```
### CommonName Certificates
#### ACL Certificate to your Service Fabric Cluster
[Virtual Machine Scale Set extensions](https://docs.microsoft.com/cli/azure/vmss/extension?view=azure-cli-latest) publisher   Microsoft.Azure.ServiceFabric is how your ACL certificates to your Service Fabric Cluster, and the following is the Resource Manager template properties that you will use:
```json
"certificate": {
   "commonNames": [
       "[parameters('certificateCommonName')]"
   ],
   "x509StoreName": "[parameters('certificateStoreValue')]"
}
```
-- SF Cluster Resource Common Name properties
-- Provide context around bringing your own custom domain
### Encrypting Secret Values 
-- PowerShell way
-- OpenSSL way
### Azure Active Directory (AAD) for client identity
-- ARM properties for enabling AAD
### Compute Managed Service Identity (MSI)
-- VMSS MSI enable system assign, link to user assigned docs
-- Code snippet consuming
### Security Policies
-- XML manifest for run as 
### Windows Defender 
-- Windows defender for VMSS extension, and whitelist properties

## Networking
For more information about networking
### Network Security Group (NSG)
-- ARM template with port rules, link to the portal
### Subnets 
-- Each scale set has its own subnet \
-- Show a snippet of a subnet and IP configuration - Network profile of VMSS 
### Azure Traffic Manager and Azure Load Balancer
-- You should provision a Traffic Manager, to ensure that you have a naming service to any backend
-- 1 TM to Multiple LBs, TM Profile
-- Link to DNS aliasing for TM and for LB

## Capacity Planning and Scaling
Before creating any Azure Service Fabric cluster it is important to [plan for capacity](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity) by considering many items during the process.
* The number of node types your cluster needs to start out with
* The properties of each of node type (size, primary, internet facing, number of VMs, etc.)
* The reliability and durability characteristics of the cluster

> [!NOTE]
> Scaling compute resources to source your application work load requires intentional planning, will nearly always take longer than an hour to complete for a production environment

### Vertical 
[Vertical scaling](https://docs.microsoft.com/en-us/azure/service-fabric/virtual-machine-scale-set-scale-node-type-scale-out#upgrade-the-size-and-operating-system-of-the-primary-node-type-vms) of a Node Type in Azure Service Fabric requires a number of steps and considerations that must be taken. 
* The cluster must be healthy before scaling, otherwise you will only destabilize cluster further.
* THE VM SKU of a scale set/node type should be at **Silver durability or greater**.
 
When adding a new VMSS resource to the cluster for Vertical Scaling you must create a new VMSS and add it to an existing Node Type. This can be done in the Resource Manager Template for [Microsoft.Compute/virtualMachineScaleSet.properties.virtualMachineProfile](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile)   under  properties->virtualMachineProfile->extensionProfile->extensions->properties->settings->nodeTypeRef setting.
```json
"settings": {
   "nodeTypeRef": ["[parameters('vmNodeType0Name')]"]
}
```

### Horizontal Scaling 
Horizontal Scaling in Service Fabric can be done either [maunally](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-scale-up-down) or [programmatically](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-programmatic-scaling).
#### Scaling Out
Scaling out of a Service Fabric cluster can simply be done by increasing the instance count for a particular VMSS. You can scale out programmatically by using the AzureClient and the id for the desired scale set to increase the capacity.
```c#
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);
var newCapacity = (int)Math.Min(MaximumNodeCount, scaleSet.Capacity + 1);
scaleSet.Update().WithCapacity(newCapacity).Apply(); 
```
To scale out manually you can update the capactity in the SKU property of the desired [Virtual Machine Scale Set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.
```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```
#### Scaling In
Scaling In requires more consideration than scaling out. 
* The service fabric system services run in the Primary node type in your cluster. So should never shut down or scale down the number of instances in that node types less than what the reliability tier warrants. 
* For a stateful service, you need a certain number of nodes to be always up to maintain availability and preserve state of your service. At the very minimum, you need the number of nodes equal to the target replica set count of the partition/service.

To scale in manually requires the completion of the following steps:
1. Run [Disable-ServiceFabricNode](https://docs.microsoft.com/powershell/module/servicefabric/disable-servicefabricnode?view=azureservicefabricps) with intent ‘RemoveNode’ to disable the node you’re going to remove (the highest instance in that node type).
2. Run [Get-ServiceFabricNode](https://docs.microsoft.com/en-us/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) to make sure that the node has indeed transitioned to disabled. If not, wait until the node is disabled. You cannot hurry this step.
3. Decrease the instance count to the desired number of nodes in the SKU property of the desired [Virtual Machine Scale Set](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate#virtualmachinescalesetosprofile) resource.
```json
"sku": {
    "name": "[parameters('vmNodeType0Size')]",
    "capacity": "[parameters('nt0InstanceCount')]",
    "tier": "Standard"
}
```
4. Repeat steps 1 through 3 as needed, but never scale down the number of instances in the primary node types less than what the reliability tier warrants. Refer to the [details on reliability tiers here](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity).

To scale in programatically requires preparing the node for shutdown involves finding the node to be removed (the most recently added virtual machine scale set instance) and deactivating it. 
```c#
using (var client = new FabricClient())
{
    var mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync())
        .Where(n => n.NodeType.Equals(NodeTypeToScale, StringComparison.OrdinalIgnoreCase))
        .Where(n => n.NodeStatus == System.Fabric.Query.NodeStatus.Up)
        .OrderByDescending(n =>
        {
            var instanceIdIndex = n.NodeName.LastIndexOf("_");
            var instanceIdString = n.NodeName.Substring(instanceIdIndex + 1);
            return int.Parse(instanceIdString);
        })
        .FirstOrDefault();
```

Once the node to be removed is found, it can be deactivated and removed using the same FabricClient instance and the IAzure instance from earlier.
```c#
var scaleSet = AzureClient.VirtualMachineScaleSets.GetById(ScaleSetId);

// Remove the node from the Service Fabric cluster
ServiceEventSource.Current.ServiceMessage(Context, $"Disabling node {mostRecentLiveNode.NodeName}");
await client.ClusterManager.DeactivateNodeAsync(mostRecentLiveNode.NodeName, NodeDeactivationIntent.RemoveNode);

// Wait (up to a timeout) for the node to gracefully shutdown
var timeout = TimeSpan.FromMinutes(5);
var waitStart = DateTime.Now;
while ((mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Up || mostRecentLiveNode.NodeStatus == System.Fabric.Query.NodeStatus.Disabling) &&
        DateTime.Now - waitStart < timeout)
{
    mostRecentLiveNode = (await client.QueryManager.GetNodeListAsync()).FirstOrDefault(n => n.NodeName == mostRecentLiveNode.NodeName);
    await Task.Delay(10 * 1000);
}

// Decrement VMSS capacity
var newCapacity = (int)Math.Max(MinimumNodeCount, scaleSet.Capacity - 1); // Check min count 

scaleSet.Update().WithCapacity(newCapacity).Apply();
```

### Durability and Reliability Levels
-- Provide the code snippets of the setting of these levels - VM extension, SF resource
-- You should use Silver of greater for your needs. PrimaryNodeType is stateful, if your services running on other node types are also stateful they should be silver. 
## Infrastructure as Code 
-- Sample repo link and API documentation. Modify these samples for these needs.
-- Portal should not be used to provision a production ready cluster.
-- deployment using AZ CLI and Powershell
-- The create SF powershell cmdlet should only be used for dev test
### Service Fabric ARM Resources 
-- JSON Snippet of the types of SF 
-- Cluster, Application, Application Version, Application Type, Service Version, Service Type
-- Link to packaging, explicity put Zip File create from directory. Need to do this to use this resource type. If you are on Linux use a different ZIP file utility. Put the Python snippet.

## Monitoring and Diagnostics
[Monitoring and diagnostics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-overview) are critical to developing, testing, and deploying workloads in any cloud environment. For example, you can track how your applications are used, the actions taken by the Service Fabric platform, your resource utilization with performance counters, and the overall health of your cluster. You can use this information to diagnose and correct issues, and prevent them from occurring in the future.
### Application Monitoring
Application monitoring tracks how features and components of your application are being used. You want to monitor your applications to make sure issues that impact users are caught. The responsibility of application monitoring is on the users developing an application and its services since it is unique to the business logic of your application. It is recommended that you set up application monitoring with [Application Insights](https://docs.microsoft.com/azure/service-fabric/service-fabric-tutorial-monitoring-aspnet).
### Cluster Monitoring
One of Service Fabric's goals is to keep applications resilient to hardware failures. This goal is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But in this particular case, what if the system services themselves have issues? Or if in attempting to deploy or move a workload, rules for the placement of services are violated? Service Fabric provides diagnostics for these and more to make sure you are informed about activity taking place in your cluster. It is recommended that you set up cluster monitoring with [Diagnostics Agent](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-diagnostics-event-aggregation-wad) and [Log Analytics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-setup).
### Infrastructure Monitoring
[Log Analytics](https://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-oms-agent) is our recommendation to monitor cluster level events.

## Next steps

* Create a cluster on VMs or computers running Windows Server: [Service Fabric cluster creation for Windows Server](service-fabric-cluster-creation-for-windows-server.md)
* Create a cluster on VMs or computers running Linux: [Create a Linux cluster](service-fabric-cluster-creation-via-portal.md)
* Learn about [Service Fabric support options](service-fabric-support.md)

