---
title: Upgrade an internal basic load balancer - No outbound connections required
titleSuffix: Azure Load Balancer
description: This article shows you how to upgrade Azure Internal Load Balancer from Basic SKU to Standard SKU.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 04/17/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Upgrade an internal basic load balancer - No outbound connections required

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date.

[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](./skus.md#skus).

This article introduces a PowerShell script that creates a Standard Load Balancer with the same configuration as the Basic Load Balancer along with migrating traffic from Basic Load Balancer to Standard Load Balancer.

## Upgrade overview

* Creates a Standard Internal SKU Load Balancer in the location that you specify. The [outbound connection](./load-balancer-outbound-connections.md) won't be provided by the Standard Internal Load Balancer.
* Seamlessly copies the configurations of the Basic SKU Load Balancer to the newly created Standard Load Balancer.
* Seamlessly move the private IPs from Basic Load Balancer to the newly created Standard Load Balancer.
* Seamlessly move the VMs from backend pool of the Basic Load Balancer to the backend pool of the Standard Load Balancer

### Caveats\Limitations

* Script only supports Internal Load Balancer upgrade where no outbound connection is required. If you required [outbound connection](./load-balancer-outbound-connections.md) for some of your VMs, refer to this [page](upgrade-InternalBasic-To-PublicStandard.md) for instructions.
* The Basic Load Balancer needs to be in the same resource group as the backend VMs and NICs.
* If the Standard load balancer is created in a different region, you won't be able to associate the VMs existing in the old region to the newly created Standard Load Balancer. To work around this limitation, make sure to create a new VM in the new region.
* If your Load Balancer doesn't have any frontend IP configuration or backend pool, you're likely to hit an error running the script. Make sure they aren't empty.
* The script can't migrate Virtual Machine Scale Set from Basic Load Balancer's backend to Standard Load Balancer's backend. For this type of upgrade, see [Upgrade a basic load balancer used with Virtual Machine Scale Sets](./upgrade-basic-standard-virtual-machine-scale-sets.md) for instructions and more information.

## Change IP allocation method to Static for frontend IP Configuration (Ignore this step if it's already static)

1. Select **All services** in the left-hand menu, select **All resources**, and then select your Basic Load Balancer from the resources list.

2. Under **Settings**, select **Frontend IP configuration**, and select the first frontend IP configuration.

3. For **Assignment**, select **Static**

4. Repeat the step 3 for all of the frontend IP configurations of the Basic Load Balancer.


## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureILBUpgrade/5.0).
## Use the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don't have the Azure Az PowerShell module installed, or don't mind uninstalling the Azure Az PowerShell module, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az PowerShell module, your best bet is to download the script and run it directly.

To determine if you have the Azure Az PowerShell module installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az PowerShell module, then you can use the `Install-Script` method.

### Install using the Install-Script method

To use this option, you must not have the Azure Az PowerShell module installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az PowerShell module, or use the other option to download the script manually and run it.

Run the script with the following command:

`Install-Script -Name AzureILBUpgrade`

This command also installs the required Az PowerShell module.

### Install using the Manual Download method

If you do have some Azure Az PowerShell module installed and can't uninstall them (or don't want to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](/powershell/gallery/how-to/working-with-packages/manual-download).

### Run the script

1. Use `Connect-AzAccount` to connect to Azure.

1. Use `Import-Module Az` to import the Az PowerShell module.

1. Examine the required parameters:

   * **rgName: [String]: Required** – This parameter is the resource group for your existing Basic Load Balancer and new Standard Load Balancer. To find this string value, navigate to Azure portal, select your Basic Load Balancer source, and select the **Overview** for the load balancer. The Resource Group is located on that page.
   * **oldLBName: [String]: Required** – This parameter is the name of your existing Basic Balancer you want to upgrade.
   * **newlocation: [String]: Required** – This parameter is the location in which the Standard Load Balancer will be created. It's recommended to inherit the same location of the chosen Basic Load Balancer to the Standard Load Balancer for better association with other existing resources.
   * **newLBName: [String]: Required** – This parameter is the name for the Standard Load Balancer to be created.
1. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzureILBUpgrade.ps1 -rgName "myRGlb" -oldLBName "myBasicLB" -newlocation "centralus" -newLbName "myStandardLB"
   ```
### Verify new load balancer

1. In your local PowerShell console, use `Get-AzLoadBalancer -ResourceGroupName <rgName_value>` to view the load balancers in your resource group.
1. Verify the JSON for the new standard load balancer. You can verify that settings, like **Frontend IP configuration**, **Backend Pools**, and **Load balancing** rules were migrated to the new standard load balancer.

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Caveats/Limitations](#caveatslimitations).

### Does the Azure PowerShell script also switch over the traffic from my Basic Load Balancer to the newly created Standard Load Balancer?

Yes it migrates traffic. If you would like to migrate traffic personally, use [this script](https://www.powershellgallery.com/packages/AzureILBUpgrade/1.0) that doesn't move VMs for you.

## Next steps

[Learn about Standard Load Balancer](load-balancer-overview.md)
