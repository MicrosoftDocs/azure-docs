---
title: Upgrade from Basic Internal to Standard Internal - Azure Load Balancer
description: This article shows you how to upgrade Azure Internal Load Balancer from Basic SKU to Standard SKU
services: load-balancer
author: irenehua
ms.service: load-balancer
ms.topic: article
ms.date: 02/23/2020
ms.author: irenehua
---

# Upgrade Azure Internal Load Balancer- No Outbound Connection Required
[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](https://docs.microsoft.com/azure/load-balancer/skus#skus).

This article introduces a PowerShell script which creates a Standard Load Balancer with the same configuration as the Basic Load Balancer along with migrating traffic from Basic Load Balancer to Standard Load Balancer.

## Upgrade overview

An Azure PowerShell script is available that does the following:

* Creates a Standard Internal SKU Load Balancer in the location that you specify. Note that no [outbound connection](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) will not be provided by the Standard Internal Load Balancer.
* Seamlessly copies the configurations of the Basic SKU Load Balancer to the newly created Standard Load Balancer.
* Seamlessly move the private IPs from Basic Load Balancer to the newly created Standard Load Balancer.
* Seamlessly move the VMs from backend pool of the Basic Load Balancer to the backend pool of the Standard Load Balancer

### Caveats\Limitations

* Script only supports Internal Load Balancer upgrade where no outbound connection is required. If you required [outbound connection](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) for some of your VMs, please refer to this [page](upgrade-InternalBasic-To-PublicStandard.md) for instructions. 
* The Basic Load Balancer needs to be in the same resource group as the backend VMs and NICs.
* If the Standard load balancer is created in a different region, you won’t be able to associate the VMs existing in the old region to the newly created Standard Load Balancer. To work around this limitation, make sure to create a new VM in the new region.
* If your Load Balancer does not have any frontend IP configuration or backend pool, you are likely to hit an error running the script. Make sure they are not empty.

## Change IP allocation method to Static for frontend IP Configuration (Ignore this step if it's already static)

1. Select **All services** in the left-hand menu, select **All resources**, and then select your Basic Load Balancer from the resources list.

2. Under **Settings**, select **Frontend IP Configuration**, and select the first frontend IP configuration. 

3. For **Assignment**, select **Static**

4. Repeat the step 3 for all of the frontend IP configurations of the Basic Load Balancer.


## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureILBUpgrade/3.0).
## Use the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don’t have the Azure Az modules installed, or don’t mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, then you can use the `Install-Script` method.

### Install using the Install-Script method

To use this option, you must not have the Azure Az modules installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az modules, or use the other option to download the script manually and run it.
  
Run the script with the following command:

`Install-Script -Name AzureILBUpgrade`

This command also installs the required Az modules.  

### Install using the script directly

If you do have some Azure Az modules installed and can't uninstall them (or don't want to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](/powershell/scripting/gallery/how-to/working-with-packages/manual-download).

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

1. Use `Import-Module Az` to import the Az modules.

1. Examine the required parameters:

   * **rgName: [String]: Required** – This is the resource group for your existing Basic Load Balancer and new Standard Load Balancer. To find this string value, navigate to Azure portal, select your Basic Load Balancer source, and click the **Overview** for the load balancer. The Resource Group is located on that page.
   * **oldLBName: [String]: Required** – This is the name of your existing Basic Balancer you want to upgrade. 
   * **newlocation: [String]: Required** – This is the location in which the Standard Load Balancer will be created. It is recommended to inherit the same location of the chosen Basic Load Balancer to the Standard Load Balancer for better association with other existing resources.
   * **newLBName: [String]: Required** – This is the name for the Standard Load Balancer to be created.
1. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzureILBUpgrade.ps1 -rgName "test_InternalUpgrade_rg" -oldLBName "LBForInternal" -newlocation "centralus" -newLbName "LBForUpgrade"
   ```

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Caveats/Limitations](#caveatslimitations).

### Does the Azure PowerShell script also switch over the traffic from my Basic Load Balancer to the newly created Standard Load Balancer?

Yes it migrates traffic. If you would like to migrate traffic personally, use [this script](https://www.powershellgallery.com/packages/AzureILBUpgrade/1.0) which does not move VMs for you.

### I ran into some issues with using this script. How can I get help?
  
You can send an email to slbupgradesupport@microsoft.com, open a support case with Azure Support, or do both.

## Next steps

[Learn about Standard Load Balancer](load-balancer-overview.md)
