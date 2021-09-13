---
title: Upgrade from Basic Public to Standard Public - Azure Load Balancer
description: This article shows you how to upgrade Azure Public Load Balancer from Basic SKU to Standard SKU
services: load-balancer
author: irenehua
ms.service: load-balancer
ms.topic: how-to
ms.date: 01/23/2020
ms.author: irenehua
---

# Upgrade Azure Public Load Balancer
[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Load Balancer SKU, see [comparison table](./skus.md#skus).

There are two stages in an upgrade:

1. Change IP allocation method from Dynamic to Static.
2. Run the PowerShell script to complete the upgrade and traffic migration.

## Upgrade overview

An Azure PowerShell script is available that does the following:

* Creates a Standard SKU Load Balancer with location you specify in the same resource group of the Basic Standard Load Balancer.
* Upgrades Public IP address from Basic SKU to Standard SKU in-place.
* Seamlessly copies the configurations of the Basic SKU Load Balancer to the newly create Standard Load Balancer.
* Creates a default outbound rule which enables outbound connectivity.

### Caveats\Limitations

* Script only supports Public Load Balancer upgrade. For Internal Basic Load Balancer upgrade, refer to [this page](./upgrade-basicinternal-standard.md) for instructions.
* The allocation method of the Public IP Address has to be changed to "static" before running the script. 
* If your Load Balancer does not have any frontend IP configuration or backend pool, you are likely to hit an error running the script. Please make sure they are not empty.

### Change Allocation method of the Public IP Address to Static

* **Here are our recommended steps:

    1. To do the tasks in this quickstart, sign in to the [Azure portal](https://portal.azure.com).
 
    1. Select **All resources** on the left menu, and then select the **Basic Public IP Address associated with Basic Load Balancer** from the resource list.
   
    1. Under **Settings**, select **Configurations**.
   
    1. Under **Assignment**, select **Static**.
    1. Select **Save**.
    >[!NOTE]
    >For VMs which have Public IPs, you will need to create Standard IP addresses first where same IP address is not guaranteed. Disassociate VMs from Basic IPs and associate them with the newly created Standard IP addresses. Then, you will be able to follow instructions to add VMs into backend pool of Standard Load Balancer. 

* **Creating new VMs to add to the backend pools of the newly created Standard Public Load Balancer**.
    * More instructions on how to create VM and associate it with Standard Load Balancer can be found [here](./quickstart-load-balancer-standard-public-portal.md#create-virtual-machines).


## Download the script

Download the migration script from the  [PowerShell Gallery](https://www.powershellgallery.com/packages/AzurePublicLBUpgrade/5.0).
## Use the script

There are two options for you depending on your local PowerShell environment setup and preferences:

* If you don’t have the Azure Az modules installed, or don’t mind uninstalling the Azure Az modules, the best option is to use the `Install-Script` option to run the script.
* If you need to keep the Azure Az modules, your best bet is to download the script and run it directly.

To determine if you have the Azure Az modules installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az modules, then you can use the `Install-Script` method.

### Install using the Install-Script method

To use this option, you must not have the Azure Az modules installed on your computer. If they're installed, the following command displays an error. You can either uninstall the Azure Az modules, or use the other option to download the script manually and run it.
  
Run the script with the following command:

`Install-Script -Name AzurePublicLBUpgrade`

This command also installs the required Az modules.  

### Install using the script directly

If you do have some Azure Az modules installed and can't uninstall them (or don't want to uninstall them), you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw nupkg file. To install the script from this nupkg file, see [Manual Package Download](/powershell/scripting/gallery/how-to/working-with-packages/manual-download).

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

1. Use `Import-Module Az` to import the Az modules.

1. Examine the required parameters:

   * **oldRgName: [String]: Required** – This is the resource group for your existing Basic Load Balancer you want to upgrade. To find this string value, navigate to Azure portal, select your Basic Load Balancer source, and click the **Overview** for the load balancer. The Resource Group is located on that page.
   * **oldLBName: [String]: Required** – This is the name of your existing Basic Balancer you want to upgrade. 
   * **newLBName: [String]: Required** – This is the name for the Standard Load Balancer to be created.
1. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzurePublicLBUpgrade.ps1 -oldRgName "test_publicUpgrade_rg" -oldLBName "LBForPublic" -newLbName "LBForUpgrade"
   ```

### Create an outbound rule for outbound connection

Follow the [instructions](./quickstart-load-balancer-standard-public-powershell.md#create-outbound-rule-configuration) to create an outbound rule so you can
* Define outbound NAT from scratch.
* Scale and tune the behavior of existing outbound NAT.

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Caveats/Limitations](#caveatslimitations).

### How long does the upgrade take?

It usually take about 5-10 minutes for the script to finish and it could take longer depending on the complexity of your Load Balancer configuration. Therefore, keep the downtime in mind and plan for failover if necessary.

### Does the Azure PowerShell script also switch over the traffic from my Basic Load Balancer to the newly created Standard Load Balancer?

Yes. The Azure PowerShell script not only upgrades the Public IP address, copies the configuration from Basic to Standard Load Balancer, but also migrates VM to behind the newly created Standard Public Load Balancer as well. 

## Next steps

[Learn about Standard Load Balancer](load-balancer-overview.md)
