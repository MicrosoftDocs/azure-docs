---
title: Troubleshoot Bad Gateway errors - Azure Application Gateway
description: 'Learn how to troubleshoot Application Gateway Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server.'
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 11/16/2019
ms.author: amsriva
---

# Troubleshooting bad gateway errors in Application Gateway

Learn how to troubleshoot bad gateway (502) errors received when using Azure Application Gateway.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Overview

After configuring an application gateway, one of the errors that you may see is "Server Error: 502 - Web server received an invalid response while acting as a gateway or proxy server". This error may happen for the following main reasons:

* NSG, UDR, or Custom DNS is blocking access to backend pool members.
* Back-end VMs or instances of virtual machine scale set aren't responding to the default health probe.
* Invalid or improper configuration of custom health probes.
* Azure Application Gateway's [back-end pool isn't configured or empty](#empty-backendaddresspool).
* None of the VMs or instances in [virtual machine scale set are healthy](#unhealthy-instances-in-backendaddresspool).
* [Request time-out or connectivity issues](#request-time-out) with user requests.

## Network Security Group, User Defined Route, or Custom DNS issue

### Cause

If access to the backend is blocked because of an NSG, UDR, or custom DNS, application gateway instances can't reach the backend pool. This causes probe failures, resulting in 502 errors.

The NSG/UDR could be present either in the application gateway subnet or the subnet where the application VMs are deployed.

Similarly, the presence of a custom DNS in the VNet could also cause issues. A FQDN used for backend pool members might not resolve correctly by the user configured DNS server for the VNet.

### Solution

Validate NSG, UDR, and DNS configuration by going through the following steps:

* Check NSGs associated with the application gateway subnet. Ensure that communication to backend isn't blocked.
* Check UDR associated with the application gateway subnet. Ensure that the UDR isn't directing traffic away from the backend subnet. For example, check for routing to network virtual appliances or default routes being advertised to the application gateway subnet via ExpressRoute/VPN.

```azurepowershell
$vnet = Get-AzVirtualNetwork -Name vnetName -ResourceGroupName rgName
Get-AzVirtualNetworkSubnetConfig -Name appGwSubnet -VirtualNetwork $vnet
```

* Check effective NSG and route with the backend VM

```azurepowershell
Get-AzEffectiveNetworkSecurityGroup -NetworkInterfaceName nic1 -ResourceGroupName testrg
Get-AzEffectiveRouteTable -NetworkInterfaceName nic1 -ResourceGroupName testrg
```

* Check presence of custom DNS in the VNet. DNS can be checked by looking at details of the VNet properties in the output.

```json
Get-AzVirtualNetwork -Name vnetName -ResourceGroupName rgName 
DhcpOptions            : {
                           "DnsServers": [
                             "x.x.x.x"
                           ]
                         }
```
If present, ensure that the DNS server can resolve the backend pool member's FQDN correctly.

## Problems with default health probe

### Cause

502 errors can also be frequent indicators that the default health probe can't reach back-end VMs.

When an application gateway instance is provisioned, it automatically configures a default health probe to each BackendAddressPool using properties of the BackendHttpSetting. No user input is required to set this probe. Specifically, when a load-balancing rule is configured, an association is made between a BackendHttpSetting and a BackendAddressPool. A default probe is configured for each of these associations and the application gateway starts a periodic health check connection to each instance in the BackendAddressPool at the port specified in the BackendHttpSetting element. 

The following table lists the values associated with the default health probe:

| Probe property | Value | Description |
| --- | --- | --- |
| Probe URL |`http://127.0.0.1/` |URL path |
| Interval |30 |Probe interval in seconds |
| Time-out |30 |Probe time-out in seconds |
| Unhealthy threshold |3 |Probe retry count. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

### Solution

* Ensure that a default site is configured and is listening at 127.0.0.1.
* If BackendHttpSetting specifies a port other than 80, the default site should be configured to listen at that port.
* The call to `http://127.0.0.1:port` should return an HTTP result code of 200. This should be returned within the 30-second timeout period.
* Ensure that the port configured is open and that there are no firewall rules or Azure Network Security Groups, which block incoming or outgoing traffic on the port configured.
* If Azure classic VMs or Cloud Service is used with a FQDN or a public IP, ensure that the corresponding [endpoint](../virtual-machines/windows/classic/setup-endpoints.md?toc=%2fazure%2fapplication-gateway%2ftoc.json) is opened.
* If the VM is configured via Azure Resource Manager and is outside the VNet where the application gateway is deployed, a [Network Security Group](../virtual-network/security-overview.md) must be configured to allow access on the desired port.

## Problems with custom health probe

### Cause

Custom health probes allow additional flexibility to the default probing behavior. When you use custom probes, you can configure the probe interval, the URL, the path to test, and how many failed responses to accept before marking the back-end pool instance as unhealthy.

The following additional properties are added:

| Probe property | Description |
| --- | --- |
| Name |Name of the probe. This name is used to refer to the probe in back-end HTTP settings. |
| Protocol |Protocol used to send the probe. The probe uses the protocol defined in the back-end HTTP settings |
| Host |Host name to send the probe. Applicable only when multi-site is configured on the application gateway. This is different from VM host name. |
| Path |Relative path of the probe. The valid path starts from '/'. The probe is sent to \<protocol\>://\<host\>:\<port\>\<path\> |
| Interval |Probe interval in seconds. This is the time interval between two consecutive probes. |
| Time-out |Probe time-out in seconds. If a valid response isn't received within this time-out period, the probe is marked as failed. |
| Unhealthy threshold |Probe retry count. The back-end server is marked down after the consecutive probe failure count reaches the unhealthy threshold. |

### Solution

Validate that the Custom Health Probe is configured correctly as the preceding table. In addition to the preceding troubleshooting steps, also ensure the following:

* Ensure that the probe is correctly specified as per the [guide](application-gateway-create-probe-ps.md).
* If  the application gateway is configured for a single site, by default the Host name should be specified as `127.0.0.1`, unless otherwise configured in custom probe.
* Ensure that a call to http://\<host\>:\<port\>\<path\> returns an HTTP result code of 200.
* Ensure that Interval, Timeout, and UnhealtyThreshold are within the acceptable ranges.
* If using an HTTPS probe, make sure that the backend server doesn't require SNI by configuring a fallback certificate on the backend server itself.

## Request time-out

### Cause

When a user request is received, the application gateway applies the configured rules to the request and routes it to a back-end pool instance. It waits for a configurable interval of time for a response from the back-end instance. By default, this interval is **20** seconds. If the application gateway does not receive a response from back-end application in this interval, the user request gets a 502 error.

### Solution

Application Gateway allows you to configure this setting via the BackendHttpSetting, which can be then applied to different pools. Different back-end pools can have different BackendHttpSetting, and a different request time-out configured.

```azurepowershell
    New-AzApplicationGatewayBackendHttpSettings -Name 'Setting01' -Port 80 -Protocol Http -CookieBasedAffinity Enabled -RequestTimeout 60
```

## Empty BackendAddressPool

### Cause

If the application gateway has no VMs or virtual machine scale set configured in the back-end address pool, it can't route any customer request and sends a bad gateway error.

### Solution

Ensure that the back-end address pool isn't empty. This can be done either via PowerShell, CLI, or portal.

```azurepowershell
Get-AzApplicationGateway -Name "SampleGateway" -ResourceGroupName "ExampleResourceGroup"
```

The output from the preceding cmdlet should contain non-empty back-end address pool. The following example shows two pools returned which are configured with a FQDN or an IP addresses for the backend VMs. The provisioning state of the BackendAddressPool must be 'Succeeded'.

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

If all the instances of BackendAddressPool are unhealthy, then the application gateway doesn't have any back-end to route user request to. This can also be the case when back-end instances are healthy but don't have the required application deployed.

### Solution

Ensure that the instances are healthy and the application is properly configured. Check if the back-end instances can respond to a ping from another VM in the same VNet. If configured with a public end point, ensure a browser request to the web application is serviceable.

## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).

