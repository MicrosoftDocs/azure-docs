<properties
   pageTitle="Relationship of Service Fabric Node Types to Virtual Machine Scale Set (VMSS) | Microsoft Azure"
   description="Relationship of Service Fabric Node Types to Virtual Machine Scale Set (VMSS), Learn how to RDP into a Virtual Machine Scale Set (VMSS) instance or a Cluster Nodes."
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
   ms.date="02/12/2016"
   ms.author="chackdan"/>


#Relationship of Service Fabric Node Types to Virtual Machine Scale Set (VMSS)
 
Every Node type that is defined in a cluster, is setup as separate VMSS, so that the Node Types can be scaled up or down independently, have different sets of ports open and can have different capacity metrics. 

Here is a Screen shot of a cluster that has two Node types.- FrontEnd and BackEnd, each of them having 5 nodes each.

![Screen shot of a cluster that has two Node Types][NodeTypes]

### Mapping of the VMSS Instances to the Nodes

As you can see above, the VMSS instances start from instance 0 and then goes up. These are reflected in the names. For example BackEnd_0 is instance 0 of the BackEnd VMSS. This particular VMSS has five instances, named BackEnd_0, BackEnd_1, BackEnd_2, BackEnd_3 and BackEnd_4.

When you scale up a VMSS, then a new instance is created, the new VMSS instance name will typically be the VMSS name + the next instance number. In our example, it will be BackEnd_5.
 

### Mapping of the VMSS Load Balancers for each of the Nodetype/VMSS

If you have deployed your cluster from the portal or have used the sample ARM template that we provided, then when you get a list of all resources under a Resource Group, then you will see the LoadBalancers for each of your VMSS/Node Type.

The name would something like this  **LB-&lt;NodeType name&gt;**


![Resources][Resources]


## RDP into a Virtual Machine Scale Set (VMSS) instance or a Cluster Nodes.
Every Node type that is defined in a cluster, is setup as a separate VMSS, so that the Node Types can be scaled up or down independently and can be made of different VM SKUs. Unlike single instance VMs, the VMSS instances do not get a VIP of their own, so it can be a bit challenging when you are looking for an IP address and port that you can use to RDP into a specific instance. 

Here are the steps you can follow to discover them.

####Step 1 : Find out the VIP for the Node type and then Inbound NAT rules for RDP.

In order to get that, you need to get the "inboundNatPools" values that were defined as a part of the the resource definition for **Microsoft.Network/loadBalancers**.

**Step 1.1** On the portal, now navigate to the LoadBalancer blade and go to its Settings.

![LBBlade][LBBlade]


**Step 1.2** once you are on the Settings blade, click on the "Inbound NAT rules". you should now see something like this.

This now gives you the IP address and Port that you can use to RDP in to the first VMSS instance. In the screenshot below, it is **104.42.106.156** and **3389**

![NATRules][NATRules]

####Step 2 : Find out the Port that you can use to RDP into the specific VMSS instance /Node.

Earlier in this document, I talked about how the VMSS Instances map to the Nodes. We will use that to figure out the exact port. 

The ports are allocated in ascending order of the VMSS instance. so in my example for the FrontEnd node type, the ports for each of the five instances will be the following. you now need to do the same mapping for your VMSS instance.

|**VMSS Instance**|**Port**|
|-----------------------|--------------------------|
|FrontEnd_0|3389|
|FrontEnd_1|3390|
|FrontEnd_2|3391|
|FrontEnd_3|3392|
|FrontEnd_4|3393|
|FrontEnd_5|3394|


####Step 3 : you are now ready to RDP into the specific VMSS instance

In the screenshot below I am RDPing into the FrontEnd_1 


![RDP][RDP]
 


## How to change the RDP port range values

####Before Cluster deployment 

When you are setting up the cluster using an ARM template, you can just specify the range in the inboundNatPools.

Go to the resource definition for **Microsoft.Network/loadBalancers** . under that you will find the description for "inboundNatPools".  

replace the "frontendPortRangeStart" and "frontendPortRangeEnd" values.

![InboundNatPools][InboundNatPools]


####After Cluster deployment
This is a bit more involved and may result in the VMs getting recycled. You will now have to set new values using Azure powershell. Make sure that Azure PowerShell 1.0+ is installed on your machine. If you have not done this before, I strongly suggest that you follow the steps outlined in [How to install and configure Azure PowerShell.](../powershell-install-configure.md)


Sign in to your Azure account. If this PowerShell command fails for some reason, you should check whether you have Azure PowerShell installed correctly.

```
Login-AzureRmAccount
```
Run the following to get details on you load balancer. and you will see the values for you will find the  description for "inboundNatPools"

```
Get-AzureRmResource -ResourceGroupName <RGname> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load balancer name> 

```

Now set the frontendPortRangeEnd and frontendPortRangeStart to the value you want.

```
$PropertiesObject = @{
	#Property = value;
}
Set-AzureRmResource -PropertyObject $PropertiesObject -ResourceGroupName <RG name> -ResourceType Microsoft.Network/loadBalancers -ResourceName <load Balancer name> -ApiVersion <use the API version that get returned> -Force
```


## Next steps

- [Cluster security](service-fabric-cluster-security.md)
- [ Service Fabric SDK and getting started](service-fabric-get-started.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and Runas](service-fabric-application-runas-security.md)
- [Overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md)

<!--Image references-->
[NodeTypes]: ./media/service-fabric-cluster-nodetypes/NodeTypes.png
[Resources]: ./media/service-fabric-cluster-nodetypes/Resources.png
[InboundNatPools]: ./media/service-fabric-cluster-nodetypes/InboundNatPools.png
[LBBlade]: ./media/service-fabric-cluster-nodetypes/LBBlade.png
[NATRules]: ./media/service-fabric-cluster-nodetypes/NATRules.png
[RDP]: ./media/service-fabric-cluster-nodetypes/RDP.png