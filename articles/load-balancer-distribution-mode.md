<properties 
   pageTitle="Configure Load Balancer distribution mode | Microsoft Azure"
   description="How to configure Azure load balancer distribution mode to support source IP affinity also known as sticky sessions "
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/01/2015"
   ms.author="joaoma" />


# Overview

We have introduced a new distribution mode called Source IP Affinity (also known as session affinity or client IP affinity). Azure Load Balancer can be configured to use a 2 tuple (Source IP, Destination IP) or 3 tuple (Source IP, Destination IP, Protocol) to map traffic to the available servers. By using Source IP affinity, connections initiated from the same client computer goes to the same DIP endpoint.

![hash based load balancer](./media/load-balancer-distribution-mode/load-balancer-session-affinity.png)

Source IP affinity solves an incompatibility between the Azure Load Balancer and RD Gateway. Now you can build a RD gateway farm in a single cloud service.
Another usage scenario is media upload where the real data upload happens through UDP but wherein the control plane is achieved through TCP:

- A client first initiates a TCP session to the load balanced public address, gets directed to a specific DIP, this channel is left active to monitor the connection health
- A new UDP session from the same client computer is initiated to the same load balanced public endpoint, the expectation here is that this connection is also directed to the same DIP endpoint as the previous TCP connection so that media upload can be executed at high throughput while also maintaining a control channel through TCP.
 
Note that if the load-balanced set changes (removing or adding a virtual machine), the distribution of client requests is recomputed. You cannot depend on new connections from existing client sessions ending up at the same server. Additionally, using source IP affinity distribution mode may cause an unequal distribution of traffic. Clients running behind proxies may be seen as one unique client application.

The distribution algorithm used is a 5 tuple (source IP, source port, destination IP, destination port, protocol type) hash to map traffic to available servers. It provides stickiness only within a transport session. Packets in the same TCP or UDP session will be directed to the same datacenter IP (DIP) instance behind the load balanced endpoint. When the client closes and re-opens the connection or starts a new session from the same source IP, the source port changes and causes the traffic to go to a different DIP endpoint.

![hash based load balancer](./media/load-balancer-distribution-mode/load-balancer-distribution.png)


## Configuring Source IP affinity settings for load balancer
 
For virtual machines, you can use powershell to change timeout settings:
 
Add an Azure endpoint to a Virtual Machine and set load balancer distribution mode

	Get-AzureVM -ServiceName "mySvc" -Name "MyVM1" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 8080 –LoadBalancerDistribution “sourceIP”| Update-AzureVM

>[AZURE.NOTE] LoadBalancerDistribution can be set to sourceIP for 2-tuple (source IP, Destination IP) load balancing, sourceIPProtocol for 3-tuple (source IP, DestinaDestination IP, protocol) load balancing or none if you want the default behavior of 5-tuple load balancing


Retrieve an endpoint load balancer distribution mode configuration

	PS C:\> Get-AzureVM –ServiceName “MyService” –Name “MyVM” | Get-AzureEndpoint

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
 
If the LoadBalancerDistribution element is not present then the Azure Load balancer uses the default 5-tuple algorithm.

 
### Set the Distribution mode on a load balanced endpoint set

If endpoints are part of a load balanced endpoint set, the distribution mode must be set on the load balanced endpoint set:

	Set-AzureLoadBalancedEndpoint -ServiceName "MyService" -LBSetName "LBSet1" -Protocol tcp -LocalPort 80 -ProbeProtocolTCP -ProbePort 8080 –LoadBalancerDistribution "sourceIP"

### Cloud Service configuration to change distribution mode

You can leverage the Azure SDK for .NET 2.5 (to be released in November) to update your Cloud Service
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


## API example

You can configure the load balancer distribution using the service management API
Make sure to add the x-ms-version header is set to version 2014-09-01 or higher.
 
Update the configuration of the specified load-balanced set in a deployment

Request example

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

	Response

	HTTP/1.1 202 Accepted 
	Cache-Control: no-cache 
	Content-Length: 0 
	Server: 1.0.6198.146 (rd_rdfe_stable.141015-1306) Microsoft-HTTPAPI/2.0 
	x-ms-servedbyregion: ussouth2 
	x-ms-request-id: 9c7bda3e67c621a6b57096323069f7af 
	Date: Thu, 16 Oct 2014 22:49:21 GMT

## Next Steps

[Internal load balancer overview](load-balancer-internal-overview.md)

[Get started Configuring an Internet facing load balancer](load-balancer-internet-getstarted.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)