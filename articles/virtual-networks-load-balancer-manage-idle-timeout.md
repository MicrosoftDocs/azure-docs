<properties 
   authors="danielceckert" 
   documentationCenter="dev-center-name" 
   editor=""
   manager="jefco" 
   pageTitle="Manage: Load Balancer Idle Timeout" 
   description="Management features for the Azure load balancer idle timeout" 
   services="virtual-network" 
   />

<tags
   ms.author="danecke"
   ms.date="02/20/2015"
   ms.devlang="na"
   ms.service="virtual-network"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   /> 
   
# Manage virtual network: Load balancer TCP idle timeout

**TCP idle timeout** allows a developer to specify a guaranteed threshold for inactivity during client-server sessions involving the Azure load balancer.  A TCP idle timeout value of 4 minutes (the default for the Azure load balancer) means that if there is a period of inactivity lasting longer than 4 minutes during a client-server session involving the Azure load balancer, the connection will be closed.

When a client-server connection is closed, the client application will get an error message similar to “The underlying connection was closed: A connection that was expected to be kept alive was closed by the server”.

[TCP Keep-Alive](http://tools.ietf.org/html/rfc1122#page-101) is a common practice to maintain connections during a long otherwise-inactive period [(MSDN example)](http://msdn.microsoft.com/library/system.net.servicepoint.settcpkeepalive.aspx). When TCP Keep-Alive is used, simple packets are sent periodically by a client (typically with a frequency period shorter than the server's idle timeout threshold).  The server considers these transmissions as evidence of connection activity even when no other activity occurs -- thus the idle timeout value is never met and the connection can be maintained over a long period of time.

While TCP Keep-Alive works well, it is generally not an option for mobile applications since it consumes limited power resources on mobile devices. A mobile application that uses TCP Keep-Alive will exhaust the device battery more quickly since it is continuously drawing power for network usage.

To support mobile device scenarios, the Azure load balancer supports a configurable TCP idle timeout. Developers can set the TCP idle timeout for any duration between 4 minutes and 30 minutes for inbound connections (configurable TCP idle timeout does not apply to outbound connections). This allows clients to maintain a much longer session with a server with long periods of inactivity.  An application on a mobile device may still choose to leverage the TCP Keep-Alive technique to preserve connections that expect periods of inactivity longer than 30 minutes, but this longer TCP idle timeout enables applications to issue TCP Keep-Alive requests far less frequently than before, significantly reducing the strain on mobile device power resources.

## Implementation

TCP idle timeout can be configured for: 

* [Instance-Level Public IPs](http://msdn.microsoft.com/library/azure/dn690118.aspx)
* [Load-Balanced endpoint sets](http://msdn.microsoft.com/library/azure/dn655055.aspx)
* [Virtual Machine endpoints](virtual-machines-set-up-endpoints.md)
* [Web roles](http://msdn.microsoft.com/library/windowsazure/ee758711.aspx)
* [Worker roles](http://msdn.microsoft.com/library/windowsazure/ee758711.aspx)

## Next Steps
* TBD

## PowerShell Examples
Please download [the latest Azure PowerShell release](https://github.com/Azure/azure-sdk-tools/releases) for best results.

### Configure TCP timeout for your Instance-Level Public IP to 15 minutes

    Set-AzurePublicIP –PublicIPName webip –VM MyVM -IdleTimeoutInMinutes 15

IdleTimeoutInMinutes is optional. If not set, the default timeout is 4 minutes. Its value can now be set between 4 and 30 minutes.

### Set Idle Timeout when creating an Azure endpoint on a Virtual Machine

    Get-AzureVM -ServiceName "mySvc" -Name "MyVM1" | Add-AzureEndpoint -Name "HttpIn" -Protocol "tcp" -PublicPort 80 -LocalPort 8080 -IdleTimeoutInMinutes 15| Update-AzureVM

### Retrieve your idle timeout configuration

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
    
### Set the TCP timeout on a load balanced endpoint set

If endpoints are part of a load balanced endpoint set, the TCP timeout must be set on the load balanced endpoint set:

    Set-AzureLoadBalancedEndpoint -ServiceName "MyService" -LBSetName "LBSet1" -Protocol tcp -LocalPort 80 -ProbeProtocolTCP -ProbePort 8080 -IdleTimeoutInMinutes 15

## Cloud Service Examples

You can leverage the Azure SDK for .NET to update your Cloud Service

Endpoint settings for Cloud Services are made in the .csdef. So, in order to update the TCP timeout for a Cloud Services deployment, a deployment upgrade is required. An exception is if the TCP timeout is only specified for a Public IP. Public IP settings are in the .cscfg, and they can be updated through deployment update and upgrade.

The .csdef changes for endpoint settings are:

    <WorkerRole name="worker-role-name" vmsize="worker-role-size" enableNativeCodeExecution="[true|false]">
      <Endpoints>
        <InputEndpoint name="input-endpoint-name" protocol="[http|https|tcp|udp]" localPort="local-port-number" port="port-number" certificate="certificate-name" loadBalancerProbe="load-balancer-probe-name" idleTimeoutInMinutes="tcp-timeout" />
      </Endpoints>
    </WorkerRole>The .cscfg changes for the timeout setting on Public IPs are:
    
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
    
## API Examples

Developers can configure the load balancer distribution using the service management API.  Make sure to add the x-ms-version header is set to version 2014-06-01 or higher.

### Update the configuration of the specified load-balanced input endpoints on all Virtual Machines in a deployment

#### Request

    POST https://management.core.windows.net/<subscription-id>/services/hostedservices/<cloudservice-name>/deployments/<deployment-name>

The value of LoadBalancerDistribution can be sourceIP for 2-tuple affinity, sourceIPProtocol for 3-tuple affinity or none (for no affinity. i.e. 5-tuple)

#### Response

    <LoadBalancedEndpointList xmlns="http://schemas.microsoft.com/windowsazure" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <InputEndpoint>
        <LoadBalancedEndpointSetName>endpoint-set-name</LoadBalancedEndpointSetName>
        <LocalPort>local-port-number</LocalPort>
        <Port>external-port-number</Port>
        <LoadBalancerProbe>
          <Path>path-of-probe</Path>
          <Port>port-assigned-to-probe</Port>
          <Protocol>probe-protocol</Protocol>
          <IntervalInSeconds>interval-of-probe</IntervalInSeconds>
          <TimeoutInSeconds>timeout-for-probe</TimeoutInSeconds>
        </LoadBalancerProbe>
        <LoadBalancerName>name-of-internal-loadbalancer</LoadBalancerName>
        <Protocol>endpoint-protocol</Protocol>
        <IdleTimeoutInMinutes>15</IdleTimeoutInMinutes>
        <EnableDirectServerReturn>enable-direct-server-return</EnableDirectServerReturn>
        <EndpointACL>
          <Rules>
            <Rule>
              <Order>priority-of-the-rule</Order>
              <Action>permit-rule</Action>
              <RemoteSubnet>subnet-of-the-rule</RemoteSubnet>
              <Description>description-of-the-rule</Description>
            </Rule>
          </Rules>
        </EndpointACL>
      </InputEndpoint>
    </LoadBalancedEndpointList>
