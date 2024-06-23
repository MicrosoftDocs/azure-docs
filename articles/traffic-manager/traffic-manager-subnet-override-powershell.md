---
title: Azure Traffic Manager subnet override using Azure PowerShell
description: This article helps you to understand the Traffic Manager subnet override feature. This feature is used to override the routing method of a Traffic Manager profile. Traffic is directed to an endpoint based upon the end-user IP address using predefined IP range to endpoint mappings.
services: traffic-manager
author: greg-lindsay
ms.topic: how-to
ms.service: traffic-manager
ms.date: 06/03/2024
ms.author: greglin
ms.custom: template-how-to, devx-track-azurepowershell
---

# Traffic Manager subnet override using Azure PowerShell

Traffic Manager subnet override allows you to alter the routing method of a profile. The addition of an override directs traffic based upon the end user's IP address with a predefined IP address range to endpoint mapping. 

## How subnet override works

When subnet overrides are added to a traffic manager profile, Traffic Manager first checks if there's a subnet override for the end user’s IP address. If one is found, the user’s DNS query is directed to the corresponding endpoint. If a mapping isn't found, Traffic Manager falls back to the profile’s original routing method. 

The IP address ranges can be specified as either CIDR ranges (for example, 1.2.3.0/24) or as address ranges (for example, 1.2.3.4-5.6.7.8). The IP ranges associated with each endpoint must be unique to that endpoint. Any overlap of IP address ranges among different endpoints causes the profile to be rejected by Traffic Manager.

There are two types of routing profiles that support subnet overrides:

* **Geographic** - If Traffic Manager finds a subnet override for the DNS query's IP address, it routes the query to the endpoint whatever the health of the endpoint is.
* **Performance** - If Traffic Manager finds a subnet override for the DNS query's IP address, it only routes the traffic to the endpoint if it's healthy. Traffic Manager falls back to the performance routing heuristic if the subnet override endpoint isn't healthy.

> [!NOTE]
> Azure Traffic Manager supports IPv6 addresses in subnet overrides for subnet profiles. This capability enables more granular control over traffic routing based on the source IP address of DNS queries, including both IPv4 and IPv6 addresses. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- For this guide you need an App Service and a Traffic Manager profile. To learn more, see [Create a Traffic Manager profile](./quickstart-create-traffic-manager-profile.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Create a Traffic Manager subnet override

To create a Traffic Manager subnet override, you can use Azure PowerShell to add the subnets for the override to the Traffic Manager endpoint.

### Add IP Address range to Endpoint 

1. **Retrieve the Traffic Manager endpoint:**

    To enable the subnet override, retrieve the endpoint you wish to add the override to and store it in a variable using [Get-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/get-aztrafficmanagerendpoint).

    Replace the Name, ProfileName, and ResourceGroupName with the values of the endpoint that you're changing. In this example we use the endpoint name *myAppServicePlan* and the profile name *myTrafficManagerProfile*. 

    ```powershell

    $TrafficManagerEndpoint = Get-AzTrafficManagerEndpoint -Name "myAppServicePlan" -ProfileName "myTrafficManagerProfile" -ResourceGroupName "MyResourceGroup" -Type AzureEndpoints

    ```
1. **Add the IP address range to the endpoint:**
    
    To add the IP address range to the endpoint, you'll use [Add-AzTrafficManagerIpAddressRange](/powershell/module/az.trafficmanager/add-aztrafficmanageripaddressrange) to add the range.

    ```powershell

    ### Add a range of IPs ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "1.2.3.4" -Last "5.6.7.8"

    ### Add a subnet ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "9.10.11.0" -Scope 24

    ### Add a range of IPs with a subnet ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "12.13.14.0" -Last "12.13.14.31" -Scope 27
 
    ```

### Update Endpoint 

Once the ranges are added, use [Set-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/set-aztrafficmanagerendpoint) to update the endpoint.

```powershell

Set-AzTrafficManagerEndpoint -TrafficManagerEndpoint $TrafficManagerEndpoint

```

### Remove IP address range from Endpoint


1. **Retrieve the Traffic Manager endpoint:**

    To enable the subnet override, retrieve the endpoint you wish to add the override to and store it in a variable using [Get-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/get-aztrafficmanagerendpoint).

    Replace the Name, ProfileName, and ResourceGroupName with the values of the endpoint that you're changing.

    ```powershell

    $TrafficManagerEndpoint = Get-AzTrafficManagerEndpoint -Name "myAppServicePlan" -ProfileName "myTrafficManagerProfile" -ResourceGroupName "MyResourceGroup" -Type AzureEndpoints

    ```
1. **Remove the IP address range from the endpoint:**

    ```powershell
    
    ### Remove a range of IPs ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "1.2.3.4" 

    ### Remove a subnet ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "9.10.11.0" 

    ### Remove a range of IPs with a subnet ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "12.13.14.0" 

    ```

### Update Endpoint

Once the ranges are removed, use [Set-AzTrafficManagerEndpoint](/powershell/module/az.trafficmanager/set-aztrafficmanagerendpoint) to update the endpoint.

```powershell
Set-AzTrafficManagerEndpoint -TrafficManagerEndpoint $TrafficManagerEndpoint

```


## Next steps
Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

Learn about the [Subnet traffic-routing method](./traffic-manager-routing-methods.md#subnet-traffic-routing-method)
