<properties 
   pageTitle="Manage: Load Balancer Distribution Mode (Source IP Affinity)"
   description="Management features for the Azure load balancer distribution mode" 
   services="virtual-network" 
   documentationCenter="" 
   authors="telmosampaio" 
   manager="adinah" 
   editor=""
   />

<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/20/2015"
   ms.author="telmos"
   />
   
# Manage virtual network: Load balancer distribution mode (Source IP Affinity)
**Source IP Affinity** (also known as **session affinity** or **client IP affinity**), an Azure load balancer distribution mode, ties connections from a single client to a single Azure-hosted server, rather than distributing each client connection dynamically to different Azure-hosted servers (the default load balancer behavior).

Using Source IP Affinity, the Azure load balancer can be configured to use a 2-tuple combination (Source IP, Destination IP) or a 3-tuple combination (Source IP, Destination IP, Protocol) to map traffic to the pool of available Azure-hosted servers. When using Source IP Affinity, connections initiated from the same client computer are handled by a single DIP endpoint (a single Azure-hosted server).

## Service origin

Source IP affinity solves a previous [incompatibility between the Azure Load Balancer and RD Gateway (DOC)](http://go.microsoft.com/fwlink/p/?LinkId=517389).

## Implementation

Source IP Affinity can be configured for: 

* [Virtual machine endpoints](virtual-machines-set-up-endpoints.md)
* [Load-balanced endpoint sets](http://msdn.microsoft.com/library/azure/dn655055.aspx)
* [Web roles](http://msdn.microsoft.com/library/windowsazure/ee758711.aspx)
* [Worker roles](http://msdn.microsoft.com/library/windowsazure/ee758711.aspx)

## Scenarios
1. Remote Desktop Gateway cluster using a single cloud service
2. Media upload (i.e. UDP for data, TCP for control)
  * Client initiates a TCP session to the Azure-hosted load-balanced public IP address
  * Client request is directed to a DIP by the load balancer; this channel remains active to monitor connection health
  * Client initiates a UDP session to the same Azure-hosted load-balanced public IP address
  * The Azure load balancer directs the request to the same DIP endpoint as the TCP connection
  * Client uploads media with higher UDP throughput while maintaining the control channel over TCP for reliability
  
## Caveats
* If the load-balanced set changes (i.e. adding or removing a virtual machine), client channel distribution is recomputed; new connections from existing clients may be handled by a different server than was used originally
* Using Source IP Affinity may result in an unequal distribution of traffic across Azure-hosted servers
* Clients that route their traffic through a proxy may be seen as a single client by the Azure load balancer

## PowerShell examples
Please download [the latest Azure PowerShell release](https://github.com/Azure/azure-sdk-tools/releases) for best results.

### Add an Azure endpoint to a Virtual Machine and set load balancer distribution mode

    Get-AzureVM -ServiceName "mySvc" -Name "MyVM1" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 8080 –LoadBalancerDistribution “sourceIP”| Update-AzureVM  

    Get-AzureVM -ServiceName "mySvc" -Name "MyVM1" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 8080 â€“LoadBalancerDistribution â€œsourceIPâ€�| Update-AzureVM  

LoadBalancerDistribution can be set to sourceIP for 2-tuple (source IP, Destination IP) load balancing, sourceIPProtocol for 3-tuple (source IP, Destination IP, protocol) load balancing, or none if you want the default behavior (5-tuple load balancing).  

### Retrieve an endpoint load balancer distribution mode configuration
    PS C:\> Get-AzureVM –ServiceName "mySvc" -Name "MyVM1" | Get-AzureEndpoint
    
    VERBOSE: 6:43:50 PM - Completed Operation: Get Deployment
    LBSetName : MyLoadBalancedSet
    LocalPort : 80
    Name : HTTP
    Port : 80
    Protocol : tcp
    Vip : 65.52.xxx.xxx
    ProbePath :
    ProbePort : 80
    ProbeProtocol : tcp
    ProbeIntervalInSeconds : 15
    ProbeTimeoutInSeconds : 31
    EnableDirectServerReturn : False
    Acl : {}
    InternalLoadBalancerName :
    IdleTimeoutInMinutes : 15
    LoadBalancerDistribution : sourceIP

If the LoadBalancerDistribution element is not present then the Azure Load balancer uses the default 5-tuple algorithm

### Set the Distribution mode on a load balanced endpoint set

    Set-AzureLoadBalancedEndpoint -ServiceName "MyService" -LBSetName "LBSet1" -Protocol tcp -LocalPort 80 -ProbeProtocolTCP -ProbePort 8080 –LoadBalancerDistribution "sourceIP"

    Set-AzureLoadBalancedEndpoint -ServiceName "MyService" -LBSetName "LBSet1" -Protocol tcp -LocalPort 80 -ProbeProtocolTCP -ProbePort 8080 â€“LoadBalancerDistribution "sourceIP"
    
If endpoints are part of a load balanced endpoint set, the distribution mode must be set on the load balanced endpoint set.

## Cloud Service Examples

You can leverage the Azure SDK for .NET to update your Cloud Service

Endpoint settings for Cloud Services are made in the .csdef. In order to update the load balancer distribution mode for a Cloud Services deployment, a deployment upgrade is required.

Here is an example of .csdef changes for endpoint settings:

    <WorkerRole name="worker-role-name" vmsize="worker-role-size" enableNativeCodeExecution="[true|false]">
      <Endpoints>
        <InputEndpoint name="input-endpoint-name" protocol="[http|https|tcp|udp]" localPort="local-port-number" port="port-number" certificate="certificate-name" loadBalancerProbe="load-balancer-probe-name" loadBalancerDistribution="sourceIP" />
      </Endpoints>
    </WorkerRole>
    <NetworkConfiguration>
      <VirtualNetworkSite name="VNet"/>
      <AddressAssignments>
        <InstanceAddress roleName="VMRolePersisted">
          <PublicIPs>
            <PublicIP name="public-ip-name" idleTimeoutInMinutes="timeout-in-minutes"/>
          </PublicIPs>
        </InstanceAddress>
      </AddressAssignments>
    </NetworkConfiguration>
    
## API examples

Developers can configure the load balancer distribution using the service management API.  Make sure to add the x-ms-version header is set to version 2014-09-01 or higher.

### Update the configuration of the specified load-balanced set in a deployment

#### Request

    POST https://management.core.windows.net/<subscription-id>/services/hostedservices/<cloudservice-name>/deployments/<deployment-name>?comp=UpdateLbSet 
    
    x-ms-version: 2014-09-01 
    
    Content-Type: application/xml 
    
    <LoadBalancedEndpointList xmlns="http://schemas.microsoft.com/windowsazure" xmlns:i="http://www.w3.org/2001/XMLSchema-instance"> 
      <InputEndpoint> 
        <LoadBalancedEndpointSetName> endpoint-set-name </LoadBalancedEndpointSetName> 
        <LocalPort> local-port-number </LocalPort> 
        <Port> external-port-number </Port> 
        <LoadBalancerProbe> 
          <Port> port-assigned-to-probe </Port> 
          <Protocol> probe-protocol </Protocol> 
          <IntervalInSeconds> interval-of-probe </IntervalInSeconds> 
          <TimeoutInSeconds> timeout-for-probe </TimeoutInSeconds> 
        </LoadBalancerProbe> 
        <Protocol> endpoint-protocol </Protocol> 
        <EnableDirectServerReturn> enable-direct-server-return </EnableDirectServerReturn> 
        <IdleTimeoutInMinutes>idle-time-out</IdleTimeoutInMinutes> 
        <LoadBalancerDistribution>sourceIP</LoadBalancerDistribution> 
      </InputEndpoint> 
    </LoadBalancedEndpointList>

The value of LoadBalancerDistribution can be sourceIP for 2-tuple affinity, sourceIPProtocol for 3-tuple affinity or none (for no affinity. i.e. 5-tuple)

#### Response

    HTTP/1.1 202 Accepted 
    Cache-Control: no-cache 
    Content-Length: 0 
    Server: 1.0.6198.146 (rd_rdfe_stable.141015-1306) Microsoft-HTTPAPI/2.0 
    x-ms-servedbyregion: ussouth2 
    x-ms-request-id: 9c7bda3e67c621a6b57096323069f7af 
    Date: Thu, 16 Oct 2014 22:49:21 GMT
