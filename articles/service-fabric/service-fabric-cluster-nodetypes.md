<properties
   pageTitle="Service Fabric node types and VM Scale Sets | Microsoft Azure"
   description="Describes how Service Fabric node types relate to VM Scale Sets and how to remote connect to a VM Scale Set instance or a cluster node."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/02/2016"
   ms.author="chackdan"/>


# The relationship between Service Fabric node types and Virtual Machine Scale Sets

Virtual Machine Scale Sets are an Azure Compute resource you can use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in a Service Fabric cluster is setup as a separate VM Scale Set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics.

The following screen shot shows a cluster that has two node types: FrontEnd and BackEnd.  Each node type has five nodes each.

![Screen shot of a cluster that has two Node Types][NodeTypes]

## Mapping VM Scale Set instances to nodes

As you can see above, the VM Scale Set instances start from instance 0 and then goes up. The numbering is reflected in the names. For example BackEnd_0 is instance 0 of the BackEnd VM Scale Set. This particular VM Scale Set has five instances, named BackEnd_0, BackEnd_1, BackEnd_2, BackEnd_3 and BackEnd_4.

When you scale up a VM Scale Set a new instance is created. The new VM Scale Set instance name will typically be the VM Scale Set name + the next instance number. In our example, it will be BackEnd_5.


## Mapping VM scale set load balancers to each node type/VM Scale Set

If you have deployed your cluster from the portal or have used the sample ARM template that we provided, then when you get a list of all resources under a Resource Group then you will see the load balancers for each VM Scale Set or node type.

The name would something like: **LB-&lt;NodeType name&gt;**. For example, LB-sfcluster4doc-0, as shown in this screenshot:


![Resources][Resources]


## Remote connect to a VM Scale Set instance or a cluster node
Every Node type that is defined in a cluster is setup as a separate VM Scale Set.  That means the node types can be scaled up or down independently and can be made of different VM SKUs. Unlike single instance VMs, the VM Scale Set instances do not get a virtual IP address of their own. So it can be a bit challenging when you are looking for an IP address and port that you can use to remote connect to a specific instance.

Here are the steps you can follow to discover them.

### Step 1: Find out the virtual IP address for the node type and then Inbound NAT rules for RDP

In order to get that, you need to get the inbound NAT rules values that were defined as a part of the resource definition for **Microsoft.Network/loadBalancers**.

In the portal, navigate to the Load balancer blade and then **Settings**.

![LBBlade][LBBlade]


In **Settings**, click on **Inbound NAT rules**. This now gives you the IP address and port that you can use to remote connect to the first VM Scale Set instance. In the screenshot below, it is **104.42.106.156** and **3389**

![NATRules][NATRules]

### Step 2: Find out the port that you can use to remote connect to the specific VM Scale Set instance/node

Earlier in this document, I talked about how the VM Scale Set instances map to the nodes. We will use that to figure out the exact port.

The ports are allocated in ascending order of the VM Scale Set instance. so in my example for the FrontEnd node type, the ports for each of the five instances will be the following. you now need to do the same mapping for your VM Scale Set instance.

|**VM Scale Set Instance**|**Port**|
|-----------------------|--------------------------|
|FrontEnd_0|3389|
|FrontEnd_1|3390|
|FrontEnd_2|3391|
|FrontEnd_3|3392|
|FrontEnd_4|3393|
|FrontEnd_5|3394|


### Step 3: Remote connect to the specific VM Scale Set instance

In the screenshot below I use Remote Desktop Connection to connect to the FrontEnd_1:

![RDP][RDP]

## How to change the RDP port range values

### Before cluster deployment

When you are setting up the cluster using an ARM template, you can specify the range in the **inboundNatPools**.

Go to the resource definition for **Microsoft.Network/loadBalancers**. Under that you will find the description for **inboundNatPools**.  Replace the *frontendPortRangeStart* and *frontendPortRangeEnd* values.

![InboundNatPools][InboundNatPools]


### After cluster deployment
This is a bit more involved and may result in the VMs getting recycled. You will now have to set new values using Azure PowerShell. Make sure that Azure PowerShell 1.0 or later is installed on your machine. If you have not done this before, I strongly suggest that you follow the steps outlined in [How to install and configure Azure PowerShell.](../powershell-install-configure.md)

Sign in to your Azure account. If this PowerShell command fails for some reason, you should check whether you have Azure PowerShell installed correctly.

```
Login-AzureRmAccount
```

Run the following to get details on your load balancer and you will see the values for you will find the description for **inboundNatPools**:

```
Get-AzureRmResource -ResourceGroupName <RGname> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load balancer name>
```

Now set *frontendPortRangeEnd* and *frontendPortRangeStart* to the values you want.

```
$PropertiesObject = @{
	#Property = value;
}
Set-AzureRmResource -PropertyObject $PropertiesObject -ResourceGroupName <RG name> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load Balancer name> -ApiVersion <use the API version that get returned> -Force
```


## Next steps

- [Overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md)
- [Cluster security](service-fabric-cluster-security.md)
- [ Service Fabric SDK and getting started](service-fabric-get-started.md)


<!--Image references-->
[NodeTypes]: ./media/service-fabric-cluster-nodetypes/NodeTypes.png
[Resources]: ./media/service-fabric-cluster-nodetypes/Resources.png
[InboundNatPools]: ./media/service-fabric-cluster-nodetypes/InboundNatPools.png
[LBBlade]: ./media/service-fabric-cluster-nodetypes/LBBlade.png
[NATRules]: ./media/service-fabric-cluster-nodetypes/NATRules.png
[RDP]: ./media/service-fabric-cluster-nodetypes/RDP.png
