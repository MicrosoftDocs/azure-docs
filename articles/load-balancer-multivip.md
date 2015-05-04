<properties 
   pageTitle="Mutiple VIPs per cloud service"
   description="Overview of multiVIP and how to set multiple VIPs on a cloud service"
   services="load-balancer"
   documentationCenter="na"
   authors="telmosampaio"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="04/22/2015"
   ms.author="telmos" />

# Multiple VIPs per cloud service
You can access Azure cloud services over the public Internet by using an IP address provided by Azure. THis public IP address is referred to as a VIP (virtual IP) since it is linked to the Azure load balancer, and not really the VM instances within the cloud service. You can access any VM instance within a cloud service by using a single VIP. 

However, there are scenarios in which you may need more than one VIP as an entry point to the same cloud service. For instance, your cloud service may host multiple websites that requires SSL connectivity using the default SLSL port of 443, each site being hosted for a different customer, or tenant. In such a scenario, you need to have a different public facing IP address for each website. The diagram below shows a typical multi-tenant web hosting with a need for multiple SSL certificates on the same public port.

![Multi VIP SSL scenario](./media/load-balancer-multivip/Figure1.png)

In the above scenario, all VIPs use the same public port (443) and traffic is redirected to one or more load balanced VMs on a unique private port for the internal IP address of the cloud service hosting all the websites. 

>[AZURE.NOTE] Another scenario for the use the multiple VIPs is hosting multiple SQL AlwaysOn availability group listeners on the same set of Virtual Machines.

VIPs are dynamic by default, which means that the actual IP address assigned to the cloud service may change over time. TO prevent that from happening, you can reserve a VIP for your service. To learn more about reserved VIPs, see [Reserved Public IP](../virtual-networks-reserved-public-ip).

>[AZURE.NOTE] Please see [IP Address pricing](http://azure.microsoft.com/pricing/details/ip-addresses/) for information on pricing on VIPs and reserved IPs.

You can use PowerShell to verify the VIPs used by your cloud services, as well as add and remove VIPs, associate a VIP to an endpoint, and configure load balancing on a specific VIP. 

## How to add a VIP to a cloud service
To add a VIP to your service, run the following PowerShell command:

    Add-AzureVirtualIP -VirtualIPName Vip3 -ServiceName myService

The command above will display a result similar to the sample below:

    OperationDescription OperationId                          OperationStatus
    -------------------- -----------                          ---------------
    Add-AzureVirtualIP   4bd7b638-d2e7-216f-ba38-5221233d70ce Succeeded

## How to remove a VIP from a cloud service
To remove the VIP added to your service in the example above, run the following PowerShell command:    

    Remove-AzureVirtualIP -VirtualIPName Vip3 -ServiceName myService

>[AZURE.IMPORTANT] You can only remove a VIP if it has no endpoints associated to it.

## How to retrieve VIP information from a Cloud Service
To retrieve the VIPs associated with a cloud service, run the following PowerShell script:

    $deployment = Get-AzureService -ServiceName myService
    $deployment.VirtualIPs

The script above will display a result similar to the sample below:

    Address         : 191.238.74.148
    IsDnsProgrammed : True
    Name            : Vip1
    ReservedIPName  :
    ExtensionData   :

    Address         :
    IsDnsProgrammed :
    Name            : Vip2
    ReservedIPName  :
    ExtensionData   :

    Address         :
    IsDnsProgrammed :
    Name            : Vip3
    ReservedIPName  :
    ExtensionData   :

In this example, the cloud service has 3 VIPs:

- **Vip1** is the default VIP, you know that because the value for IsDnsProgrammedName is set to true.
- **Vip2** and **Vip3** are not used as they don’t have any IP addresses. They will only be used if you associate an endpoint to the VIP.

>[AZURE.NOTE] Your subscription will only be charged for extra VIPs once they are associated with an endpoint. For more information on pricing, see XXX.

## How to associate a VIP to an endpoint
To associate a VIP on a cloud service to an endpoint, runt he following PowerShell command:

    Get-AzureVM -ServiceName myService -Name myVM1 `
    | Add-AzureEndpoint -Name myEndpoint -Protocol tcp -LocalPort 8080 -PublicPort 80 -VirtualIPName Vip2 `
    | Update-AzureVM

The command above creates and endpoint linked to the VIP called *Vip2* on port *80*, and links it to the VM named *myVM1* in a cloud service named *myService* using *TCP* on port *8080*.

To verify the configuration, run the following PowerShell command:

    $deployment = Get-AzureService -ServiceName myService
    $deployment.VirtualIPs

And the output will look similar to the results below:

    Address         : 191.238.74.148
    IsDnsProgrammed : True
    Name            : Vip1
    ReservedIPName  :
    ExtensionData   :

    Address         : 191.238.74.13
    IsDnsProgrammed :
    Name            : Vip2
    ReservedIPName  :
    ExtensionData   :

    Address         :
    IsDnsProgrammed :
    Name            : Vip3
    ReservedIPName  :
    ExtensionData   :

## How to enable load balancing on a specific VIP
You can associate a single VIP with multiple virtual machines for load balancing purposes. For instance, suppose you have a cloud service named *myService*, and two virtual machines named *myVM1* and *myVM2*. And your cloud service has multiple VIPs, one of them named *Vip2*. If you want to ensure that all traffic to port *81* on *Vip2* is balanced between *myVM1* and *myVM2* on port *8181*, run the following PowerShell script: 

    Get-AzureVM -ServiceName myService -Name myVM1 `
    | Add-AzureEndpoint -Name myEndpoint -LoadBalancedEndpointSetName myLBSet `
        -Protocol tcp -LocalPort 8181 -PublicPort 81 -VirtualIPName Vip2  -DefaultProbe `
    | Update-AzureVM

    Get-AzureVM -ServiceName myService -Name myVM2 `
    | Add-AzureEndpoint -Name myEndpoint -LoadBalancedEndpointSetName myLBSet `
        -Protocol tcp -LocalPort 8181 -PublicPort 81 -VirtualIPName Vip2  -DefaultProbe `
    | Update-AzureVM

You can also update your load balancer to use a different VIP. For instance, if you run the PowerShell command below, you will change the load balancing set to use a VIP named Vip1:

    Set-AzureLoadBalancedEndpoint -ServiceName myService -LBSetName myLBSet -VirtualIPName Vip1

## See Also

[Internet facing load balancer overview](../load-balancer-internet-overview.md)

[Get started on Internet facing load balancer](../load-balancer-internet-getstarted.md)

[Virtual Network Overview](https://msdn.microsoft.com/library/azure/jj156007.aspx)

[Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx)
