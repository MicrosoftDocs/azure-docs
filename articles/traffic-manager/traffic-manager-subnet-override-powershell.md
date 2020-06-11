---
title: Azure Traffic Manager subnet override using Azure PowerShell | Microsoft Docs
description: This article will help you understand how Traffic Manager subnet override is used to override the routing method of a Traffic Manager profile to direct traffic to an endpoint based upon the end-user IP address via predefined IP range to endpoint mappings using Azure PowerShell.
services: traffic-manager
documentationcenter: ''
author: rohinkoul

ms.topic: how-to
ms.service: traffic-manager
ms.date: 09/18/2019
ms.author: rohink
---

# Traffic Manager subnet override using Azure Powershell

Traffic Manager subnet override allows you to alter the routing method of a profile.  The addition of an override will direct traffic based upon the end user's IP address with a predefined IP range to endpoint mapping. 

## How subnet override works

When subnet overrides are added to a traffic manager profile, Traffic Manager will first check if there's a subnet override for the end user’s IP address. If one is found, the user’s DNS query will be directed to the corresponding endpoint.  If a mapping isn't found, Traffic Manager will fall back to the profile’s original routing method. 

The IP address ranges can be specified as either CIDR ranges (for example, 1.2.3.0/24) or as address ranges (for example, 1.2.3.4-5.6.7.8). The IP ranges associated with each endpoint must be unique to that endpoint. Any overlap of IP ranges among different endpoints will cause the profile to be rejected by Traffic Manager.

There are two types of routing profiles that support subnet overrides:

* **Geographic** - If Traffic Manager finds a subnet override for the DNS query's IP address, it will route the query to the endpoint whatever the health of the endpoint is.
* **Performance** - If Traffic Manager finds a subnet override for the DNS query's IP address, it will only route the traffic to the endpoint if it's healthy.  Traffic Manager will fall back to the performance routing heuristic if the subnet override endpoint isn't healthy.

## Create a Traffic Manager subnet override

To create a Traffic Manager subnet override, you can use Azure PowerShell to add the subnets for the override to the Traffic Manager endpoint.

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can run the commands that follow in the [Azure Cloud Shell](https://shell.azure.com/powershell), or by running PowerShell from your computer. The Azure Cloud Shell is a free interactive shell. It has common Azure tools preinstalled and configured to use with your account. 
If you run PowerShell from your computer, you need the Azure PowerShell module, 1.0.0 or later. You can run `Get-Module -ListAvailable Az` to find the installed version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to sign in to Azure.


1. **Retrieve the Traffic Manager endpoint:**

    To enable the subnet override, retrieve the endpoint you wish to add the override to and store it in a variable using [Get-AzTrafficManagerEndpoint](https://docs.microsoft.com/powershell/module/az.trafficmanager/get-aztrafficmanagerendpoint?view=azps-2.5.0).

    Replace the Name, ProfileName, and ResourceGroupName with the values of the endpoint that you're changing.

    ```powershell

    $TrafficManagerEndpoint = Get-AzTrafficManagerEndpoint -Name "contoso" -ProfileName "ContosoProfile" -ResourceGroupName "ResourceGroup" -Type AzureEndpoints

    ```
2. **Add the IP address range to the endpoint:**
    
    To add the IP address range to the endpoint, you'll use [Add-AzTrafficManagerIpAddressRange](https://docs.microsoft.com/powershell/module/az.trafficmanager/add-aztrafficmanageripaddressrange?view=azps-2.5.0&viewFallbackFrom=azps-2.4.0) to add the range.

    ```powershell

    ### Add a range of IPs ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "1.2.3.4" -Last "5.6.7.8"

    ### Add a subnet ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "9.10.11.0" -Scope 24

    ### Add a range of IPs with a subnet ###
    Add-AzTrafficManagerIPAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "12.13.14.0" -Last "12.13.14.31" -Scope 27
 
    ```
    Once the ranges are added, use [Set-AzTrafficManagerEndpoint](https://docs.microsoft.com/powershell/module/az.trafficmanager/set-aztrafficmanagerendpoint?view=azps-2.5.0) to update the endpoint.

    ```powershell

    Set-AzTrafficManagerEndpoint -TrafficManagerEndpoint $TrafficManagerEndpoint

    ```
Removal of the IP address range can be completed by using [Remove-AzTrafficManagerIpAddressRange](https://docs.microsoft.com/powershell/module/az.trafficmanager/remove-aztrafficmanageripaddressrange?view=azps-2.5.0).

1.  **Retrieve the Traffic Manager endpoint:**

    To enable the subnet override, retrieve the endpoint you wish to add the override to and store it in a variable using [Get-AzTrafficManagerEndpoint](https://docs.microsoft.com/powershell/module/az.trafficmanager/get-aztrafficmanagerendpoint?view=azps-2.5.0).

    Replace the Name, ProfileName, and ResourceGroupName with the values of the endpoint that you're changing.

    ```powershell

    $TrafficManagerEndpoint = Get-AzTrafficManagerEndpoint -Name "contoso" -ProfileName "ContosoProfile" -ResourceGroupName "ResourceGroup" -Type AzureEndpoints

    ```
2. **Remove the IP address range from the endpoint:**

    ```powershell
    
    ### Remove a range of IPs ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "1.2.3.4" -Last "5.6.7.8"

    ### Remove a subnet ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "9.10.11.0" -Scope 24

    ### Remove a range of IPs with a subnet ###
    Remove-AzTrafficManagerIpAddressRange -TrafficManagerEndpoint $TrafficManagerEndpoint -First "12.13.14.0" -Last "12.13.14.31" -Scope 27

    ```
     Once the ranges are removed, use [Set-AzTrafficManagerEndpoint](https://docs.microsoft.com/powershell/module/az.trafficmanager/set-aztrafficmanagerendpoint?view=azps-2.5.0) to update the endpoint.

    ```powershell

    Set-AzTrafficManagerEndpoint -TrafficManagerEndpoint $TrafficManagerEndpoint

    ```

## Next steps
Learn more about Traffic Manager [traffic routing methods](traffic-manager-routing-methods.md).

Learn about the [Subnet traffic-routing method](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-routing-methods#subnet-traffic-routing-method)
