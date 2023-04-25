---
title: Upgrade an internal basic load balancer - Outbound connections required
titleSuffix: Azure Load Balancer
description: Learn how to upgrade a basic internal load balancer to a standard public load balancer.
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 04/17/2023
ms.author: mbender
ms.custom: template-how-to, engagement-fy23
---

# Upgrade an internal basic load balancer - Outbound connections required

>[!Important]
>On September 30, 2025, Basic Load Balancer will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/). If you are currently using Basic Load Balancer, make sure to upgrade to Standard Load Balancer prior to the retirement date.

A standard [Azure Load Balancer](load-balancer-overview.md) offers increased functionality and high availability through zone redundancy. For more information about Azure Load Balancer SKUs, see [Azure Load Balancer SKUs](./skus.md#skus). A standard internal Azure Load Balancer doesn't provide outbound connectivity. The PowerShell script in this article, migrates the basic load balancer configuration to a standard public load balancer.

There are four stages in the upgrade:

1. Migrate the configuration to a standard public load balancer

2. Add virtual machines to the backend pools of the standard public load balancer

3. Create Network Security Group (NSG) rules for subnets and virtual machines that require internet connection restrictions

This article covers a configuration migration. Adding the VMs to the backend pool may vary depending on your specific environment. See [Add VMs to the backend pools](#add-vms-to-the-backend-pool-of-the-standard-load-balancer) later in this article for recommendations.

## Upgrade overview

An Azure PowerShell script is available that does the following procedures:

* Creates a standard public load balancer in the resource group and location that you specify

* Copies the configurations of the basic internal load balancer to the newly created standard public load balancer.

* Creates an outbound rule that enables outbound connectivity

### Constraints

* The script supports an internal load balancer upgrade where outbound connectivity is required. If outbound connectivity isn't required, see [Upgrade an internal basic load balancer - Outbound connections not required](./upgrade-basicinternal-standard.md).

* The standard load balancer has a new public address. It's impossible to move the IP addresses associated with existing basic internal load balancer to a standard public load balancer because of different SKUs.

* If the standard load balancer is created in a different region, you won't be able to associate the VMs in the old region. To avoid this constraint, ensure you create new VMs in the new region.

* If the load balancer doesn't have a frontend IP configuration or backend pool, you'll encounter an error running the script. Ensure the load balancer has a frontend IP and backend pool

* The script can't migrate Virtual Machine Scale Set from Basic Load Balancer's backend to Standard Load Balancer's backend. For this type of upgrade, see [Upgrade a basic load balancer used with Virtual Machine Scale Sets](./upgrade-basic-standard-virtual-machine-scale-sets.md) for instructions and more information.

## Download the script

Download the migration script from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureLBUpgrade/2.0).

## Use the script

There are two options depending on your local PowerShell environment setup and preferences:

* If you don't have the Az PowerShell module installed, or don't mind uninstalling the Az PowerShell module, use the `Install-Script` option to run the script.

* If you need to keep the Az PowerShell module, download the script and run it directly.

To determine if you have the Az PowerShell module installed, run `Get-InstalledModule -Name az`. If the Az PowerShell module isn't installed, you can use the `Install-Script` method.

### Install with Install-Script

To use this option, don't have the Az PowerShell module installed on your computer. If they're installed, the following command displays an error. Uninstall the Az PowerShell module, or use the other option to download the script manually and run it.

Run the script with the following command:

```azurepowershell
Install-Script -Name AzureLBUpgrade
```
This command also installs the required Az PowerShell module.

### Install with the script directly

If you do have Az PowerShell module installed and can't uninstall them, or don't want to uninstall them, you can manually download the script using the **Manual Download** tab in the script download link. The script is downloaded as a raw **nupkg** file. To install the script from this **nupkg** file, see [Manual Package Download](/powershell/gallery/how-to/working-with-packages/manual-download).

To run the script:

1. Use `Connect-AzAccount` to connect to Azure.

2. Use `Import-Module Az` to import the Az PowerShell module.

3. Examine the required parameters:

    * **oldRgName: [String]: Required** – This parameter is the resource group for your existing basic load balancer you want to upgrade. To find this string value, navigate to the Azure portal, select your basic load balancer source, and select the **Overview** for the load balancer. The resource group is located on that page

    * **oldLBName: [String]: Required** – This parameter is the name of your existing the basic load balancer you want to upgrade

    * **newRgName: [String]: Required** – This parameter is the resource group where the standard load balancer is created. The resource group can be new or existing. If you choose an existing resource group, the name of the load balancer must be unique within the resource group.

    * **newLocation: [String]: Required** – This parameter is the location where the standard load balancer is created. We recommend you choose the same location as the basic load balancer to ensure association of existing resources

    * **newLBName: [String]: Required** – This parameter is the name for the standard load balancer to be created

4. Run the script using the appropriate parameters. It may take five to seven minutes to finish.

    **Example**

   ```azurepowershell
   AzureLBUpgrade.ps1 -oldRgName "test_publicUpgrade_rg" -oldLBName "LBForPublic" -newRgName "test_userInput3_rg" -newLocation "centralus" -newLbName "LBForUpgrade"
   ```

### Add VMs to the backend pool of the standard load balancer

Ensure that the script successfully created a new standard public load balancer with the exact configuration from your basic internal load balancer. You can verify the configuration from the Azure portal.

Send a small amount of traffic through the standard load balancer as a manual test.

The following scenarios explain how you add VMs to the backend pools of the newly created standard public load balancer, and our recommendations for each scenario:

* **Move existing VMs from the backend pools of the old basic internal load balancer to the backend pools of the new standard public load balancer**

    1. Sign in to the [Azure portal](https://portal.azure.com).

    2. Select **All resources** in the left menu. Select the **new standard load balancer** from the resource list.

    3. In the **Settings** in the load balancer page, select **Backend pools**.

    4. Select the backend pool that matches the backend pool of the basic load balancer.

    5. Select **Virtual Machine**

    6. Select the VMs from the matching backend pool of the basic load balancer.

    7. Select **Save**.

    >[!NOTE]
    >For virtual machines which have public IPs, you must create standard IP addresses first. The same IP address is not guaranteed. Disassociate the VMs from the basic IPs and associate them with the newly created standard IP addresses. You'll then be able to follow the instructions to add VMs into the backend pool of the Standard Azure Load Balancer.

* **Create new VMs to add to the backend pools of the new standard public load balancer**.

    * To create a virtual machine and associate it with the load balancer, see [Create virtual machines](./quickstart-load-balancer-standard-public-portal.md#create-virtual-machines).

### Create a NAT gateway for outbound access

The script creates an outbound rule that enables outbound connectivity. Azure NAT Gateway is the recommended service for outbound connectivity. For more information about Azure NAT Gateway, see [What is Azure NAT Gateway?](../virtual-network/nat-gateway/nat-overview.md).

To create a NAT gateway resource and associate it with a subnet of your virtual network see, [Create NAT gateway](quickstart-load-balancer-standard-public-portal.md#create-nat-gateway).

### Create NSG rules for subnets and virtual machines that require internet connection restrictions

For more information about creating Network Security Groups and restricting internet traffic, see [Create, change, or delete an Azure network security group](../virtual-network/manage-network-security-group.md).

## Common questions

### Are there any limitations with the Azure PowerShell script to migrate the configuration from v1 to v2?

Yes. See [Constraints](#constraints).

### Does the Azure PowerShell script switch over the traffic from my basic load Balancer to the new standard load balancer?

No. The Azure PowerShell script only migrates the configuration. Actual traffic migration is your responsibility and in your control.

## Next steps

[Learn about Azure Load Balancer](load-balancer-overview.md)
