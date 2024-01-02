---
title: Troubleshoot Bad Gateway errors - Azure Application Gateway
description: 'Learn how to troubleshoot Application Gateway Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server.'
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: troubleshooting
ms.date: 05/19/2023
ms.author: greglin
ms.custom: devx-track-azurepowershell
---

# Troubleshooting bad gateway errors in Application Gateway

Learn how to troubleshoot bad gateway (502) errors received when using Azure Application Gateway.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview

After you configure an application gateway, one of the errors that you may see is **Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server**. This error may happen for the following main reasons:

* NSG, UDR, or Custom DNS is blocking access to backend pool members.
* Backend VMs or instances of virtual machine scale set aren't responding to the default health probe.
* Invalid or improper configuration of custom health probes.
* Azure Application Gateway's [backend pool isn't configured or empty](#empty-backendaddresspool).
* None of the VMs or instances in [virtual machine scale set are healthy](#unhealthy-instances-in-backendaddresspool).
* [Request time-out or connectivity issues](#request-time-out) with user requests.

## Network Security Group, User Defined Route, or Custom DNS issue

### Cause

If access to the backend is blocked because of an NSG, UDR, or custom DNS, application gateway instances can't reach the backend pool. This issue causes probe failures, resulting in 502 errors.

The NSG/UDR could be present either in the application gateway subnet or the subnet where the application VMs are deployed.

Similarly, the presence of a custom DNS in the VNet could also cause issues. An FQDN used for backend pool members might not resolve correctly by the user configured DNS server for the VNet.

### Solution

Validate NSG, UDR, and DNS configuration by going through the following steps:

1. Check NSGs associated with the application gateway subnet. Ensure that communication to backend isn't blocked. For more information, see [Network security groups](/azure/application-gateway/configuration-infrastructure#network-security-groups).
2. Check UDR associated with the application gateway subnet. Ensure that the UDR isn't directing traffic away from the backend subnet. For example, check for routing to network virtual appliances or default routes being advertised to the application gateway subnet via ExpressRoute/VPN.

    ```azurepowershell
    $vnet = Get-AzVirtualNetwork -Name vnetName -ResourceGroupName rgName
    Get-AzVirtualNetworkSubnetConfig -Name appGwSubnet -VirtualNetwork $vnet
    ```

3. Check effective NSG and route with the backend VM

    ```azurepowershell
    Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName nic1 -ResourceGroupName testrg
    Get-AzEffectiveRouteTable -NetworkInterfaceName nic1 -ResourceGroupName testrg
    ```

4. Check presence of custom DNS in the VNet. DNS can be checked by looking at details of the VNet properties in the output.

    ```json
    Get-AzVirtualNetwork -Name vnetName -ResourceGroupName rgName 
    DhcpOptions            : {
                               "DnsServers": [
                                 "x.x.x.x"
                               ]
                             }
    ```
5. If present, ensure that the DNS server can resolve the backend pool member's FQDN correctly.

## Problems with default health probe

### Cause

502 errors can also be frequent indicators that the default health probe can't reach backend VMs.

When an application gateway instance is provisioned, it automatically configures a default health probe to each BackendAddressPool using properties of the BackendHttpSetting. No user input is required to set this probe. Specifically, when a load-balancing rule is configured, an association is made between a BackendHttpSetting and a BackendAddressPool. A default probe is configured for each of these associations and the application gateway starts a periodic health check connection to each instance in the BackendAddressPool at the port specified in the BackendHttpSetting element. 

The following table lists the values associated with the default health probe:

| Probe property | Value | Description |
| --- | --- | --- |
| Probe URL |`http://127.0.0.1/` |URL path |
| Interval |30 |Probe interval in seconds |
| Time-out |30 |Probe time-out in seconds |
| Unhealthy threshold |3 |Probe retry count. The backend server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

### Solution

* Host value of the request will be set to 127.0.0.1. Ensure that a default site is configured and is listening at 127.0.0.1.
* Protocol of the request is determined by the BackendHttpSetting protocol.
* URI Path will be set to */*.
* If BackendHttpSetting specifies a port other than 80, the default site should be configured to listen at that port.
* The call to `protocol://127.0.0.1:port` should return an HTTP result code of 200. This code should be returned within the 30-second timeout period.
* Ensure the configured port is open and there are no firewall rules or Azure Network Security Groups blocking incoming or outgoing traffic on the port configured.
* If Azure classic VMs or Cloud Service is used with an FQDN or a public IP, ensure that the corresponding [endpoint](/previous-versions/azure/virtual-machines/windows/classic/setup-endpoints?toc=%2fazure%2fapplication-gateway%2ftoc.json) is opened.
* If the VM is configured via Azure Resource Manager and is outside the VNet where the application gateway is deployed, a [Network Security Group](../virtual-network/network-security-groups-overview.md) must be configured to allow access on the desired port.

For more information, see [Application Gateway infrastructure configuration](configuration-infrastructure.md).

## Problems with custom health probe

### Cause

Custom health probes allow additional flexibility to the default probing behavior. When you use custom probes, you can configure the probe interval, the URL, the path to test, and how many failed responses to accept before marking the backend pool instance as unhealthy.

The following additional properties are added:

| Probe property | Description |
| --- | --- |
| Name |Name of the probe. This name is used to refer to the probe in backend HTTP settings. |
| Protocol |Protocol used to send the probe. The probe uses the protocol defined in the backend HTTP settings |
| Host |Host name to send the probe. Applicable only when multi-site is configured on the application gateway. This is different from VM host name. |
| Path |Relative path of the probe. The valid path starts from '/'. The probe is sent to \<protocol\>://\<host\>:\<port\>\<path\> |
| Interval |Probe interval in seconds. This is the time interval between two consecutive probes. |
| Time-out |Probe time-out in seconds. If a valid response isn't received within this time-out period, the probe is marked as failed. |
| Unhealthy threshold |Probe retry count. The backend server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

### Solution

Validate that the Custom Health Probe is configured correctly, as shown in the preceding table. In addition to the preceding troubleshooting steps, also ensure the following:

* Ensure that the probe is correctly specified as per the [guide](application-gateway-create-probe-ps.md).
* If  the application gateway is configured for a single site, by default the Host name should be specified as `127.0.0.1`, unless otherwise configured in custom probe.
* Ensure that a call to http://\<host\>:\<port\>\<path\> returns an HTTP result code of 200.
* Ensure that Interval, Timeout, and UnhealtyThreshold are within the acceptable ranges.
* If using an HTTPS probe, make sure that the backend server doesn't require SNI by configuring a fallback certificate on the backend server itself.

## Request time-out

### Cause

When a user request is received, the application gateway applies the configured rules to the request and routes it to a backend pool instance. It waits for a configurable interval of time for a response from the backend instance. By default, this interval is **20** seconds. In Application Gateway v1, if the application gateway doesn't receive a response from backend application in this interval, the user request gets a 502 error.  In Application Gateway v2, if the application gateway doesn't receive a response from the backend application in this interval, the request will be tried against a second backend pool member.  If the second request fails the user request gets a 504 error.

### Solution

Application Gateway allows you to configure this setting via the BackendHttpSetting, which can be then applied to different pools. Different backend pools can have different BackendHttpSetting, and a different request time-out configured.

```azurepowershell
    New-AzApplicationGatewayBackendHttpSettings -Name 'Setting01' -Port 80 -Protocol Http -CookieBasedAffinity Enabled -RequestTimeout 60
```

## Empty BackendAddressPool

### Cause

If the application gateway has no VMs or virtual machine scale set configured in the backend address pool, it can't route any customer request and sends a bad gateway error.

### Solution

Ensure that the backend address pool isn't empty. This can be done either via PowerShell, CLI, or portal.

```azurepowershell
Get-AzApplicationGateway -Name "SampleGateway" -ResourceGroupName "ExampleResourceGroup"
```

The output from the preceding cmdlet should contain nonempty backend address pool. The following example shows two pools returned which are configured with an FQDN or an IP addresses for the backend VMs. The provisioning state of the BackendAddressPool must be 'Succeeded'.

BackendAddressPoolsText:

```json
[{
    "BackendAddresses": [{
        "ipAddress": "10.0.0.10",
        "ipAddress": "10.0.0.11"
    }],
    "BackendIpConfigurations": [],
    "ProvisioningState": "Succeeded",
    "Name": "Pool01",
    "Etag": "W/\"00000000-0000-0000-0000-000000000000\"",
    "Id": "/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/applicationGateways/<application gateway name>/backendAddressPools/pool01"
}, {
    "BackendAddresses": [{
        "Fqdn": "xyx.cloudapp.net",
        "Fqdn": "abc.cloudapp.net"
    }],
    "BackendIpConfigurations": [],
    "ProvisioningState": "Succeeded",
    "Name": "Pool02",
    "Etag": "W/\"00000000-0000-0000-0000-000000000000\"",
    "Id": "/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.Network/applicationGateways/<application gateway name>/backendAddressPools/pool02"
}]
```

## Unhealthy instances in BackendAddressPool

### Cause

If all the instances of BackendAddressPool are unhealthy, then the application gateway doesn't have any backend to route user request to. This can also be the case when backend instances are healthy but don't have the required application deployed.

### Solution

Ensure that the instances are healthy and the application is properly configured. Check if the backend instances can respond to a ping from another VM in the same VNet. If configured with a public end point, ensure a browser request to the web application is serviceable.

## Upstream SSL certificate does not match

### Cause

The TLS certificate installed on backend servers does not match the hostname received in the Host request header. 

In scenarios where End-to-end TLS is enabled, a configuration that is achieved by editing the appropriate "Backend HTTP Settings", and changing there the configuration of the "Backend protocol" setting to HTTPS, it is mandatory to ensure that the CNAME of the TLS certificate installed on backend servers matches the hostname coming to the backend in the HTTP host header request.

As a reminder, the effect of enabling on the "Backend HTTP Settings" the option of protocol HTTPS rather than HTTP, will be that the second part of the communication that happens between the instances of the Application Gateway and the backend servers will be encrypted with TLS.

Due to the fact that by default Application Gateway sends the same HTTP host header to the backend as it receives from the client, you will need to ensure that the TLS certificate installed on the backend server, is issued with a CNAME that matches the host name received by that backend server in the HTTP host header.
Remember that, unless specified otherwise, this hostname would be the same as the one received from the client.

For example:

Imagine that you have an Application Gateway to serve the https requests for domain www.contoso.com. You could have the domain contoso.com delegated to an Azure DNS Public Zone, and a A DNS record in that zone pointing www.contoso.com to the public IP of the specific Application Gateway that is going to serve the requests.

On that Application Gateway you should have a listener for the host www.contoso.com with a rule that has the "Backed HTTP Setting" forced to use protocol HTTPS (ensuring End-to-end TLS). That same rule could have configured a backend pool with two VMs running IIS as Web servers.

As we know enabling HTTPS in the "Backed HTTP Setting" of the rule will make the second part of the communication that happens between the Application Gateway instances and the servers in the backend to use TLS.

If the backend servers do not have a TLS certificate issued for the CNAME www.contoso.com or *.contoso.com, the request will fail with **Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server** because the upstream SSL certificate (the certificate installed on the backend servers) will not match the hostname in the host header, and hence the TLS negotiation will fail. 


www.contoso.com --> APP GW front end IP --> Listener with a rule that configures "Backend HTTP Settings" to use protocol HTTPS rather than HTTP  --> Backend Pool --> Web server (needs to have a TLS certificate installed for www.contoso.com) 

## Solution

it is required that the CNAME of the TLS certificate installed on the backend server, matches the host name configured in the HTTP backend settings, otherwise the second part of the End-to-end communication that happens between the instances of the Application Gateway and the backend, will fail with "Upstream SSL certificate does not match", and will throw back a **Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server**


## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
