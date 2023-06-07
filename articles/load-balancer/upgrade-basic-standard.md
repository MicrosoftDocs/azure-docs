---
title: Upgrade a basic to standard public load balancer
titleSuffix: Azure Load Balancer
description: This article shows you how to upgrade a public load balancer from basic to standard SKU.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 04/17/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Upgrade from a basic public to standard public load balancer

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date.

[Azure Standard Load Balancer](load-balancer-overview.md) offers a rich set of functionality and high availability through zone redundancy. To learn more about Azure Load Balancer SKUs, see [comparison table](./skus.md#skus).

There are two stages in an upgrade:

1. Change IP allocation method from **Dynamic** to **Static**.

2. Run the PowerShell script to complete the upgrade and traffic migration.

## Upgrade overview

An Azure PowerShell script is available that does the following procedures:

* Creates a standard load balancer with a location you specify in the same resource group of the basic load balancer

* Upgrades the public IP address from basic SKU to standard SKU in-place

* Copies the configurations of the basic load balancer to the newly standard load balancer

* Creates a default outbound rule that enables outbound connectivity

### Constraints

* The script only supports a public load balancer upgrade. For an internal basic load balancer upgrade, see [Upgrade from basic internal to standard internal - Azure Load Balancer](./upgrade-basicinternal-standard.md) for instructions and more information

* The allocation method of the public IP Address must be changed to **static** before running the script

* If the load balancer doesn't have a frontend IP configuration or backend pool, you'll encounter an error running the script. Ensure the load balancer has a frontend IP and backend pool

* The script can't migrate Virtual Machine Scale Set from Basic Load Balancer's backend to Standard Load Balancer's backend. For this type of upgrade, see [Upgrade a basic load balancer used with Virtual Machine Scale Sets](./upgrade-basic-standard-virtual-machine-scale-sets.md) for instructions and more information.

### Change allocation method of the public IP address to static

The following are the recommended steps to change the allocation method.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources** in. the left menu. Select the **basic public IP address associated with the basic load balancer** from the resource list.

3. In the **Settings** of the basic public IP address, select **Configurations**.

4. In **Assignment**, select **Static**.

5. Select **Save**.

>[!NOTE]
>For virtual machines which have public IPs, you must create standard IP addresses first. The same IP address is not guaranteed. Disassociate the VMs from the basic IPs and associate them with the newly created standard IP addresses. You'll then be able to follow the instructions to add VMs into the backend pool of the Standard Azure Load Balancer.

### Create new VMs to add to the backend pool of the new standard load balancer

* To create a virtual machine and associate it with the load balancer, see [Create virtual machines](./quickstart-load-balancer-standard-public-portal.md#create-virtual-machines).

## Download the script

Download the migration script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzurePublicLBUpgrade/6.0).

## Use the script

There are two options depending on your local PowerShell environment setup and preferences:

* If you don't have the Az PowerShell module installed, or don't mind uninstalling the Az PowerShell module, use the `Install-Script` option to run the script.

* If you need to keep the Az PowerShell module, download the script and run it directly.

To determine if you have the Az PowerShell module installed, run `Get-InstalledModule -Name az`. If you don't see any installed Az PowerShell module, then you can use the `Install-Script` method.

### Install with Install-Script

To use this option, don't have the Az PowerShell module installed on your computer. If they're installed, the following command displays an error. Uninstall the Az PowerShell module, or use the other option to download the script manually and run it.

Run the script with the following command:

```azurepowershell
Install-Script -Name AzurePublicLBUpgrade
```
This command also installs the required Az PowerShell module.

### Install with the script directly

If you do have Az PowerShell module installed and can't uninstall it, or don't want to uninstall it,you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw **nupkg** file. To install the script from this **nupkg** file, see [Manual Package Download](/powershell/gallery/how-to/working-with-packages/manual-download)

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

2. Use `Import-Module Az` to import the Az PowerShell module.

3. Examine the required parameters:

    * **oldRgName: [String]: Required** – This parameter is the resource group for your existing basic load balancer you want to upgrade. To find this string value, navigate to the Azure portal, select your basic load balancer source, and select the **Overview** for the load balancer. The resource group is located on that page

    * **oldLBName: [String]: Required** – This parameter is the name of your existing the basic load balancer you want to upgrade.

    * **newLBName: [String]: Required** – This parameter is the name for the standard load balancer to be created

4. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzurePublicLBUpgrade.ps1 -oldRgName "test_publicUpgrade_rg" -oldLBName "LBForPublic" -newLbName "LBForUpgrade"
   ```

### Create a NAT gateway for outbound access

The script creates an outbound rule that enables outbound connectivity. Azure Virtual Network NAT is the recommended service for outbound connectivity. For more information about Azure Virtual Network NAT, see [What is Azure Virtual Network NAT?](../virtual-network/nat-gateway/nat-overview.md).

To create a NAT gateway resource and associate it with a subnet of your virtual network see, [Create NAT gateway](quickstart-load-balancer-standard-public-portal.md#create-nat-gateway).

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Constraints](#constraints).

### How long does the upgrade take?

It usually takes a few minutes for the script to finish and it could take longer depending on the complexity of your load balancer configuration. Keep the downtime in mind and plan for failover if necessary.

### Does the script switch over the traffic from my basic load balancer to the newly created standard load balancer?

Yes. The Azure PowerShell script upgrades the public IP address, copies the configuration from the basic to standard load balancer, and migrates the virtual machine to the newly created public standard load balancer.

## Next steps

[Learn about Azure Load Balancer](load-balancer-overview.md)
