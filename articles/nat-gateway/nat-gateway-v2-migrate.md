---

title: Migrate Azure NAT Gateway from Standard to StandardV2 
description: Get guidance for migrating Azure NAT Gateway from the Standard SKU to the StandardV2 SKU. 
author: alittleton 
ms.author: alittleton 
ms.service: azure-nat-gateway 
ms.topic: how-to 
ms.customs: references_regions 
ms.date: 05/15/2026

#customer intent: "As a cloud engineer who uses Azure NAT Gateway, I need guidance on migrating my workloads from the Standard SKU to the StandardV2 SKU so that I can take advantage of zone redundancy with higher throughput." 
---
 
# Migrate Azure NAT Gateway from Standard to StandardV2

The StandardV2 SKU of Azure NAT Gateway offers enhanced data-processing limits and high availability through zone redundancy. We recommend that you use the StandardV2 SKU for production workloads that require resiliency to zone outages.

This article discusses guidance for how to migrate your subnets from a Standard network address translation (NAT) gateway to a StandardV2 NAT gateway. In-place migration to a StandardV2 NAT gateway isn't available.

> [!IMPORTANT]
> Migration from a Standard NAT gateway to a StandardV2 NAT gateway involves *downtime and impact to existing connections*. Plan accordingly.

## Pre-migration steps

We recommend the following steps to prepare for the migration:

* A StandardV2 NAT gateway requires the use of StandardV2 public IPs. Existing Standard public IPs don't work with StandardV2 NAT gateways. Make sure that you can re-IP to StandardV2 public IPs before you create a StandardV2 NAT gateway.
* Check if you have requirements for allow lists at destination endpoints, because you have to re-IP to StandardV2 public IPs to use a StandardV2 NAT gateway.
* Plan for application downtime during the migration. Existing connections with a Standard NAT gateway are affected when you're migrating to a StandardV2 NAT gateway.
* Confirm which subnets in your virtual network need to be migrated to a StandardV2 NAT gateway.

## Unsupported scenarios

Before you migrate to a StandardV2 NAT gateway, make sure that your specific scenario is supported. Review the following unsupported scenarios and [known issues](#known-issues) with StandardV2 NAT gateways.

* You must use StandardV2 public IPs with StandardV2 NAT gateways. Standard public IPs aren't supported.

* StandardV2 NAT Gateway doesn't support Basic load balancers or Basic public IPs.

* StandardV2 NAT Gateway doesn't support the use of custom public IPs (bring your own IP).

* The following regions don't support StandardV2 NAT gateways and StandardV2 public IPs:

  * Canada East
  * Chile Central
  * Indonesia Central
  * Israel Northwest
  * Malaysia West
  * Qatar Central
  * Sweden South
  * West India

## Known issues

* A StandardV2 NAT gateway disrupts outbound connections made with load balancer outbound rules for IPv6 traffic only. If you see disruption to outbound connectivity for IPv6 outbound traffic with load balancer outbound rules, remove the StandardV2 NAT gateway from the subnet or virtual network. Then use either:

  * Load balancer outbound rules to provide outbound connectivity for both IPv4 and IPv6 traffic
  * A Standard NAT gateway to provide outbound connectivity for IPv4 traffic and load balancer outbound rules for IPv6 traffic

* Existing outbound connections that use a load balancer or instance-level public IPs on a VM instance might be interrupted when you attach a Standard or StandardV2 NAT gateway to the subnet. New connections use the NAT gateway.

## Guidance for manual migration

### Azure portal

To manually migrate from a Standard NAT gateway to a StandardV2 NAT gateway by using the Azure portal, use this suggested order of operations:

1. Select StandardV2 as the SKU.

2. Create a new StandardV2 public IP or a StandardV2 public IP prefix resource. Select the required IP version: IPv4 or IPv6.

3. Skip the **Networking** tab. You attach the StandardV2 NAT gateway to the subnet later.

4. Create the StandardV2 NAT gateway.

5. From your resource group, go to the subnet that you want to migrate from a Standard NAT gateway to a StandardV2 NAT gateway.

6. Update the subnet configuration to use the new StandardV2 NAT gateway. This step replaces your existing Standard NAT gateway with the StandardV2 NAT gateway.

7. Save the subnet configuration and validate connectivity.

8. Repeat steps 5 to 7 for each subnet that you want to migrate to a StandardV2 NAT gateway.

> [!NOTE]
> This migration doesn't delete your existing Standard NAT gateway or Standard public IP resources.

### Azure PowerShell

Before you migrate from a Standard NAT gateway to a StandardV2 NAT gateway by using Azure PowerShell, ensure that you meet the following criteria:

* You have Azure PowerShell installed locally, or you plan to use Azure Cloud Shell. If you choose to install and use PowerShell locally:

  * This article requires Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).
  * Run `Connect-AzAccount` to create a connection with Azure.

* Ensure that your `Az.Network` module is 7.17.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network`.

* Sign in to Azure PowerShell and select the subscription that you want to use. For more information, see [Sign in to Azure from Azure PowerShell](/powershell/azure/authenticate-azureps).

For the migration, use this suggested order of operations:

1. Create a new StandardV2 public IP or a StandardV2 public IP prefix resource by using the `New-AzPublicIpAddress` or `New-AzPublicIpPrefix` cmdlet. Select IPv4 or IPv6 for the IP version.

    ```powershell
    $publicIp = New-AzPublicIpAddress -ResourceGroupName <your-resource-group> -Name <your-public-ip-name> -Location <your-location> -Sku StandardV2 -AllocationMethod Static -IpVersion IPv4 -Zone 1,2,3  
    ```

    Or  

    ```powershell
    $publicIpPrefix = New-AzPublicIpPrefix -ResourceGroupName <your-resource-group> -Name <your-public-ip-prefix-name> -Location <your-location> -Sku StandardV2 -PrefixLength 28 -Zone 1,2,3  
    ```

2. Create a new StandardV2 NAT gateway by using the `New-AzNatGateway` cmdlet. Be sure to select StandardV2 as the SKU.

    ```powershell
    $natGateway = New-AzNatGateway -ResourceGroupName <your-resource-group> -Name <your-nat-gateway-name> -Location <your-location> -Sku StandardV2, -PublicIpAddress $publicIp
    ```

    Or  

    ```powershell
    $natGateway = New-AzNatGateway -ResourceGroupName <your-resource-group> -Name <your-nat-gateway-name> -Location <your-location> -Sku StandardV2 -PublicIpPrefix $publicIpPrefix
    ```

3. From your resource group, retrieve the subnet that you want to migrate from a Standard NAT gateway to a StandardV2 NAT gateway by using the `Get-AzVirtualNetwork` cmdlet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName <your-resource-group> -Name <your-vnet-name> | Get-AzVirtualNetworkSubnetConfig -Name <your-subnet-name>  
    ```

4. Update the subnet configuration to use the new StandardV2 NAT gateway by using the `Set-AzVirtualNetworkSubnetConfig` cmdlet.

    ```powershell
    Set-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name <your-subnet-name> -NatGateway $natGateway  
    ```

5. Save the subnet configuration by using the `Set-AzVirtualNetwork` cmdlet.

    ```powershell
    Set-AzVirtualNetwork -VirtualNetwork $vnet  
    ```

6. Repeat steps 3 to 5 for each subnet that you want to migrate to a StandardV2 NAT gateway.

> [!NOTE]
> This migration process doesn't delete your existing Standard NAT gateway or Standard public IP resources.

### Azure CLI

Before you migrate from a Standard NAT gateway to a StandardV2 NAT gateway by using the Azure CLI, ensure that you meet the following criteria:

* To run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli). If you're running on Windows or macOS, consider [running the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
* If you're using a local installation, sign in to the Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Authenticate to Azure using the Azure CLI](/cli/azure/authenticate-azure-cli).
* When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Manage Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).
* To find the version and dependent libraries that are installed, run [az version](/cli/azure/reference-index?#az-version). To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

For the migration, use this suggested order of operations:

1. Create a new StandardV2 public IP or a StandardV2 public IP prefix resource by using the `az network public-ip create` or `az network public-ip prefix create` cmdlet. Select IPv4 or IPv6 for the IP version.

    ```azurecli-interactive
    az network public-ip create \ 
       --resource-group test-rg \ 
       --name public-ip-nat \ 
       --location eastus \ 
       --sku StandardV2 \ 
       --allocation-method Static \ 
       --version IPv4 \ 
       --zone 1 2 3 
     ```

    Or

    ```azurecli-interactive
    az network public-ip prefix create \ 
       --resource-group test-rg \ 
       --name public-ip-prefix-nat \ 
       --location eastus \ 
       --sku StandardV2 \ 
       --length 28 \ 
       --version IPv4 \ 
       --zone 1 2 3 
     ```

2. Create a new StandardV2 NAT gateway by using the `az network nat gateway create` cmdlet. Be sure to select StandardV2 as the SKU.

    ```azurecli-interactive
    az network nat gateway create \ 
       --resource-group test-rg \ 
       --name nat-gatewayv2 \ 
       --location eastus \ 
       --public-ip-addresses public-ip-nat \ 
       --idle-timeout 4 \ 
       --sku StandardV2 \ 
       --zone 1 2 3 
     ```

3. Replace the Standard NAT gateway on your subnet with your newly created StandardV2 NAT gateway by using the `az network vnet subnet update` cmdlet.

    ```azurecli-interactive
    az network vnet subnet update \ 
       --resource-group test-rg \ 
       --vnet-name myVNet \ 
       --name mySubnet \ 
       --nat-gateway nat-gatewayv2 
    ```

4. Repeat step 3 for each subnet that you want to migrate to a StandardV2 NAT gateway.

## Post-migration steps

After you migrate your subnets to a StandardV2 NAT gateway, we recommend the following steps:

1. Validate outbound connectivity to the internet from the virtual machines in the subnets that you migrated to the StandardV2 NAT gateway.

1. Monitor your applications for any issues related to connectivity or performance after the migration.

## Common questions

### Can I use my existing Standard public IPs with a StandardV2 NAT gateway?

No, a StandardV2 NAT gateway requires the use of StandardV2 public IPs. Existing Standard public IPs aren't compatible with a StandardV2 NAT gateway.

### Is there any downtime during the migration?

Yes, migrating from a Standard NAT gateway to a StandardV2 NAT gateway causes downtime and affects existing connections. Be sure to plan for application downtime during the migration and perform the migration during a maintenance window.

### How long is the expected downtime?

The duration of downtime depends on the number of subnets that you're migrating and the complexity of your network configuration. To minimize downtime, migrate one subnet at a time and validate connectivity before you proceed to the next subnet.

### Can I automate the migration process?

Yes, you can use Azure PowerShell or Azure CLI scripts to automate the migration process. The steps in this article can be adapted into scripts for automation.

### How do I revert back to a Standard NAT gateway if needed?

To revert back to a Standard NAT gateway, you need to reattach the subnets to the existing Standard NAT gateway and reassign the original Standard public IPs. This process also involves downtime and affects existing connections.

### Is my Standard NAT gateway deleted after migration?

No, migrating to a StandardV2 NAT gateway doesn't delete your existing Standard NAT gateway or your Standard public IP resources. You need to manually delete these resources if you no longer need them. Don't delete these resources until you fully validate that your workloads function as expected with the StandardV2 NAT gateway.

### How do I validate that the migration is successful?

After you migrate your subnets to a StandardV2 NAT gateway, you can validate the migration by checking outbound connectivity to the internet from your virtual machines in the migrated subnets. You can also monitor your applications for any connectivity or performance issues. For guidance on how to test connectivity for a NAT gateway, see [Create a StandardV2 NAT gateway](quickstart-create-nat-gateway-v2.md).
