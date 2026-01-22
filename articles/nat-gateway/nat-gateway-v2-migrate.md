---

title: Migrate Azure NAT Gateway from Standard to StandardV2 - Guidance 
description: Upgrade guidance for migrating Standard NAT Gateway to StandardV2 NAT Gateway. 
author: alittleton 
ms.author: alittleton 
ms.service: azure-nat-gateway 
ms.topic: concept-article 
ms.customs: references_regions 
ms.date: 01/13/2026  

# Customer intent: "As a cloud engineer with Standard NAT Gateway, I need guidance on migrating my workloads off Standard to StandardV2 SKU." 
---
 
# Migrate from Standard to StandardV2 NAT Gateway 


StandardV2 NAT Gateway offers enhanced data processing limits and high availability through zone redundancy. StandardV2 NAT Gateway is recommended for production workloads requiring resiliency to zonal outages. 

In this article, we discuss guidance for how to migrate your subnets from Standard NAT gateway to StandardV2 NAT gateway. In place migration to StandardV2 NAT Gateway isn't available.  

> [!IMPORTANT]
> Migration from Standard to StandardV2 NAT Gateway involves **downtime and impact to existing connections**. It also requires the use of new StandardV2 Public IPs. Existing Standard SKU Public IPs don't work with StandardV2 NAT Gateway. Plan accordingly.

## Pre-migration steps 

We recommend the following pre-migration steps to prepare for the migration.  
* StandardV2 NAT Gateway requires the use of StandardV2 public IPs. Existing Standard SKU public IPs don’t work with StandardV2 NAT Gateway. Make sure you’re able to re-IP to StandardV2 Public IPs before you create StandardV2 NAT Gateway.
* Check if you have allow listing requirements at destination endpoints since you have to re-IP to StandardV2 public IPs to use StandardV2 NAT Gateway.
* Plan for application downtime during the migration. Existing connections with Standard NAT Gateway are impacted when migrating to StandardV2 NAT Gateway.
* Confirm which subnets in your virtual network need to be migrated to StandardV2 NAT Gateway. 

## Unsupported scenarios 

Before you migrate to StandardV2 NAT gateway, make sure that your specific scenario is supported. Review the following unsupported scenarios and [known issues](#known-issues) with StandardV2 NAT gateway.  

* StandardV2 NAT Gateway must be used with StandardV2 SKU public IPs. Standard SKU public IPs aren't supported.
* Azure Kubernetes Service (AKS) managed NAT gateway doesn't support StandardV2 NAT Gateway deployment. To use a StandardV2 NAT gateway with AKS, StandardV2 NAT Gateway must be deployed as user-assigned.
* StandardV2 NAT Gateway and Basic SKU Load balancer or Basic SKU public IPs aren't supported.
* StandardV2 NAT Gateway doesn't support the use of custom public IPs (BYOIP).
* The following regions don't support StandardV2 NAT Gateway and StandardV2 public IPs:
  * Brazil Southeast
  * Canada East
  * Central India
  * Chile Central
  * Indonesia Central
  * Israel Northwest
  * Malaysia West
  * Qatar Central
  * Sweden South
  * UAE Central
  * West Central US
  * West India

## Known issues 

* StandardV2 NAT Gateway doesn't support and can't be attached to delegated subnets for the following services:  
  * Azure SQL Managed Instance
  * Azure Container Instances
  * Azure Database for PostgreSQL - Flexible Server
  * Azure Database for MySQL - Flexible Server
  * Azure Database for MySQL
  * Azure Data Factory - Data Movement
  * Microsoft Power Platform services
  * Azure Stream Analytics
  * Azure Web Apps
  * Azure Container Apps
  * Azure DNS Private Resolver 

* StandardV2 NAT Gateway disrupts outbound connections made with Load balancer outbound rules for IPv6 traffic only. Standard SKU NAT gateway can be used to provide outbound for IPv4 traffic while Load balancer outbound rules is used for IPv6 outbound traffic. If you see disruption to outbound connectivity for IPv6 outbound traffic with Load balancer outbound rules, remove the StandardV2 NAT Gateway from the subnet or virtual network. Use Load balancer outbound rules to provide outbound connectivity for both IPv4 and IPv6 traffic. Or use Standard SKU NAT Gateway to provide outbound connectivity for IPv4 traffic and Load balancer outbound rules for IPv6 traffic.  

* Attaching a StandardV2 NAT Gateway to an empty subnet created before April 2025 without any virtual machines may cause the virtual network to go into a failed state. To return the virtual network to a successful state, remove StandardV2 NAT Gateway, create and add a virtual machine to the subnet and then reattach the StandardV2 NAT Gateway. 

* Existing outbound connections using a Load balancer or an instance-level public IP on a VM instance may be disrupted by attaching a Standard SKU or StandardV2 NAT gateway to the subnet. New connections use the NAT gateway. 

## Guidance for manual migration 

### Migration using the portal 

Use the suggested order of operations for manually migrating from a Standard SKU NAT Gateway to a StandardV2 SKU NAT Gateway using the Portal.  

1. Create a new **StandardV2 SKU NAT gateway**. Make sure to select StandardV2 as the SKU.  

2. Create a new **StandardV2 SKU public IP** or **StandardV2 SKU public IP prefix** resource during the create experience for the StandardV2 NAT gateway. Select the IP version required - either IPv4 or IPv6. 

> [!IMPORTANT]
> StandardV2 NAT gateway requires the use of StandardV2 public IPs. Existing Standard SKU public IPs don’t work with StandardV2 NAT Gateway. Make sure you’re able to re-IP to StandardV2 public IPs before you create StandardV2 NAT gateway.  

3. **Skip the Networking tab** during the portal create experience for StandardV2 NAT gateway. You attach the StandardV2 NAT gateway to the subnet later. 

4. **Create** the StandardV2 NAT gateway.  

5. From your resource group, navigate to the **subnet** you want to migrate from Standard NAT gateway to StandardV2 NAT gateway.  

6. **Update** the subnet configuration to use the new StandardV2 NAT gateway. (This replaces your existing Standard NAT gateway with the StandardV2 NAT gateway). 

7. **Save** the subnet configuration. 

> [!IMPORTANT]
> Existing connections with Standard NAT gateway are impacted when migrating to StandardV2 NAT gateway. Plan for application downtime during the migration. It's advised to migrate one subnet at a time and validate connectivity before proceeding to the next subnet. To minimize impact to your applications, consider performing this step during a maintenance window.  

8. Repeat steps 5-7 for each subnet you want to migrate to StandardV2 NAT gateway. 

> [!NOTE]
> This migration doesn't delete your existing Standard NAT gateway or Standard SKU public IP resources.  

### Migration using PowerShell 

Use the suggested order of operations for migrating from a Standard SKU NAT gateway to a StandardV2 SKU NAT gateway using PowerShell.  

Before you begin, ensure you meet the following criteria:  

- Azure PowerShell installed locally or use Azure Cloud Shell.
-  If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).
-  If you run PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure. 
- Ensure that your `Az.Network` module is 7.17.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name "Az.Network"`. If the module requires an update, use the command `Update-Module -Name Az.Network`. 
- Sign in to Azure PowerShell and select the subscription that you want to use. For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps). 

The following steps should be taken to migrate from Standard NAT gateway to StandardV2 NAT gateway using PowerShell:  

1. Create a new **StandardV2 SKU public IP** or **StandardV2 SKU public IP prefix** resource using the `New-AzPublicIpAddress` or `New-AzPublicIpPrefix` cmdlet. Select IPv4 or IPv6 for IP version. 

```powershell
$publicIp = New-AzPublicIpAddress -ResourceGroupName <your-resource-group> -Name <your-public-ip-name> -Location <your-location> -Sku StandardV2 -AllocationMethod Static -IpVersion IPv4 -Zone 1,2,3  
``` 

Or  

```powershell
$publicIpPrefix = New-AzPublicIpPrefix -ResourceGroupName <your-resource-group> -Name <your-public-ip-prefix-name> -Location <your-location> -Sku StandardV2 -PrefixLength 28 -Zone 1,2,3  
``` 

2. Create a new **StandardV2 SKU NAT gateway** using the `New-AzNatGateway` cmdlet. Make sure to select StandardV2 as the SKU. 

```powershell
$natGateway = New-AzNatGateway -ResourceGroupName <your-resource-group> -Name <your-nat-gateway-name> -Location <your-location> -Sku StandardV2, -PublicIpAddress $publicIp  
```

Or  

```powershell
$natGateway = New-AzNatGateway -ResourceGroupName <your-resource-group> -Name <your-nat-gateway-name> -Location <your-location> -Sku StandardV2 -PublicIpPrefix $publicIpPrefix  
 ```

3. From your resource group, retrieve the **subnet** you want to migrate from Standard NAT gateway to StandardV2 NAT gateway using the `Get-AzVirtualNetwork` cmdlet. 

```powershell
$subnet = Get-AzVirtualNetwork -ResourceGroupName <your-resource-group> -Name <your-vnet-name> | Get-AzVirtualNetworkSubnetConfig -Name <your-subnet-name>  
```

4. **Update** the subnet configuration to use the new StandardV2 NAT gateway using the `Set-AzVirtualNetworkSubnetConfig` cmdlet. 

```powershell
Set-AzVirtualNetworkSubnetConfig -VirtualNetwork $vnet -Name <your-subnet-name> -NatGateway $natGateway  
``` 

5. **Save** the subnet configuration using the Set-AzVirtualNetwork cmdlet. 

```powershell
Set-AzVirtualNetwork -VirtualNetwork $vnet  
``` 

6. Repeat steps 3-5 for each subnet you want to migrate to StandardV2 NAT gateway. 

>[!NOTE]
> This migration process doesn't delete your existing Standard NAT gateway or Standard SKU public IP resources. 

### Migration using CLI 

Use the suggested order of operations for migrating from a Standard SKU NAT gateway to a StandardV2 SKU NAT gateway using CLI.  

Before you begin, ensure you meet the following criteria:  

- To run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
- If you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Authenticate to Azure using Azure CLI](/cli/azure/authenticate-azure-cli).
- When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
- Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

The following steps should be taken to migrate from Standard NAT gateway to StandardV2 NAT gateway using CLI: 

1. Create a new StandardV2 SKU public IP or StandardV2 SKU public IP prefix resource using the az network public-ip create or az network public-ip prefix create cmdlet. Select IPv4 or IPv6 for IP version. 

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

or 

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

2. Create a new StandardV2 SKU NAT gateway using the az network nat gateway create cmdlet. Make sure to select StandardV2 as the SKU. 

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

3. Replace the Standard NAT gateway on your subnet with your newly created StandardV2 NAT gateway using the az network vnet subnet update cmdlet. 

```azurecli-interactive
az network vnet subnet update \ 
   --resource-group test-rg \ 
   --vnet-name myVNet \ 
   --name mySubnet \ 
   --nat-gateway nat-gatewayv2 
``` 

4. Repeat step 3 for each subnet you want to migrate to StandardV2 NAT gateway.  

## Post-migration steps 

After you migrate your subnets to StandardV2 NAT gateway, we recommend the following post-migration steps.  

Validate outbound connectivity to the internet from your virtual machines in the subnets that were migrated to StandardV2 NAT gateway.  

Monitor your applications for any issues related to connectivity or performance after the migration. 

## Common questions 

### Can I use my existing Standard SKU public IPs with StandardV2 NAT gateway? 

No, StandardV2 NAT gateway requires the use of StandardV2 public IPs. Existing Standard SKU public IPs aren't compatible with StandardV2 NAT gateway.  

### Is there any downtime during the migration? 

Yes, migrating from Standard NAT gateway to StandardV2 NAT gateway causes downtime and impacts existing connections. It's recommended to plan for application downtime during the migration and perform the migration during a maintenance window.  

### How long is the expected downtime? 

The duration of downtime depends on the number of subnets being migrated and the complexity of your network configuration. It's advisable to migrate one subnet at a time and validate connectivity before proceeding to the next subnet to minimize downtime.  

### Can I automate the migration process? 

Yes, you can use PowerShell or Azure CLI scripts to automate the migration process. The steps provided in this article can be adapted into scripts for automation.  

### How do I revert back to Standard NAT gateway if needed? 

To revert back to Standard NAT gateway, you need to reattach the subnets to the existing Standard NAT gateway and reassign the original Standard SKU public IPs. This process also involves downtime and impacts existing connections.  

### Is my Standard NAT gateway deleted after migration? 

No, migrating to StandardV2 NAT Gateway doesn't delete your existing Standard NAT Gateway or Standard SKU public IP resources. You need to manually delete these resources if they're no longer needed. Don't delete these resources until you fully validate that your workloads function as expected with StandardV2 NAT Gateway and you no longer need the Standard NAT Gateway or Standard SKU public IPs.  

### How do I validate that the migration is successful? 

After migrating your subnets to StandardV2 NAT gateway, you can validate the migration by checking outbound connectivity to the internet from your virtual machines in the migrated subnets. You can also monitor your applications for any connectivity or performance issues. Follow guidance on how to test NAT Gateway connectivity in the Create StandardV2 NAT Gateway article. 
