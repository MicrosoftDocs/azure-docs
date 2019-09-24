---
title: "Tutorial: Add a SQL Database managed instance to a failover group"
description: Learn to configure a failover group for your Azure SQL Database managed instance. 
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: sashan, carlrab
manager: jroth
ms.date: 08/27/2019
---
# Tutorial: Add a SQL Database managed instance to a failover group

Add a SQL Database managed instance to a failover group. In this article, you will learn how to:

> [!div class="checklist"]
> - Create a primary managed instance
> - Create a secondary managed instance as part of a [failover group](sql-database-auto-failover-group.md). 
> - Test failover

  > [!NOTE]
  > - When going through this tutorial, ensure you are configuring your resources with the [prerequisites for setting up failover groups for managed instance](sql-database-auto-failover-group.md#enabling-geo-replication-between-managed-instances-and-their-vnets). 
  > - Creating a managed instance can take a significant amount of time. As a result, this tutorial could take several hours to complete. For more information on provisioning times, see [managed instance management operations](sql-database-managed-instance.md#managed-instance-management-operations). 
  > - Using failover groups with managed instances is currently in preview. 

## Prerequisites

To complete this tutorial, make sure you have: 

- An Azure subscription, [create a free account](https://azure.microsoft.com/free/) if you don"t already have one. 


## 1 - Create resource group and primary managed instance
In this step, you will create the resource group and the primary managed instance for your failover group using the Azure portal. 

1. Select **Azure SQL** in the left-hand menu of the Azure portal. If **Azure SQL** is not in the list, select **All services**, then type Azure SQL in the search box. (Optional) Select the star next to **Azure SQL** to favorite it and add it as an item in the left-hand navigation. 
1. Select **+ Add** to open the **Select SQL deployment option** page. You can view additional information about the different databases by selecting Show details on the Databases tile.
1. Select **Create** on the **SQL managed instances** tile. 

    ![Select managed instance](media/sql-database-managed-instance-failover-group-tutorial/select-managed-instance.png)

1. On the **Create Azure SQL Database Managed Instance** page, on the **Basics** tab
    1. Under **Project Details**, select your **Subscription** from the drop-down and then choose to **Create New** resource group. Type in a name for your resource group, such as `myResourceGroup`. 
    1. Under **Managed Instance Details**, provide the name of your managed instance, and the region where you would like to deploy your managed instance. Leave the **Compute + storage** at default values. 
    1. Under **Administrator Account**, provide an admin login, such as `azureuser`, and a complex admin password. 

    ![Create primary MI](media/sql-database-managed-instance-failover-group-tutorial/primary-sql-mi-values.png)

1. Leave the rest of the settings at default values, and select **Review + create** to review your managed instance settings. 
1. Select **Create** to create your primary managed instance. 

```powershell-interactive
# Connect-AzAccount
# The SubscriptionId in which to create these objects
$SubscriptionId = '<Subscription-ID>'
# Create a random identifier to use as subscript for the different resource names
$randomIdentifier = $(Get-Random)
# Set the resource group name and location for your managed instance
$resourceGroupName = "myResourceGroup-$randomIdentifier"
$location = "eastus"
$drLocation = "eastus2"

# Set the networking values for your primary managed instance
$primaryVNet = "primaryVNet-$randomIdentifier"
$primaryAddressPrefix = "10.0.0.0/16"
$primaryDefaultSubnet = "primaryDefaultSubnet-$randomIdentifier"
$primaryDefaultSubnetAddress = "10.0.0.0/24"
$primaryMiSubnetName = "primaryMISubnet-$randomIdentifier"
$primaryMiSubnetAddress = "10.0.0.0/24"
$primaryMiGwSubnetAddress = "10.0.255.0/27"
$primaryGWName = "primaryGateway-$randomIdentifier"
$primaryGWPublicIPAddress = $primaryGWName + "-ip"
$primaryGWIPConfig = $primaryGWName + "-ipc"
$primaryGWAsn = 61000
$primaryGWConnection = $primaryGWName + "-connection"


# Set the networking values for your secondary managed instance
$secondaryVNet = "secondaryVNet-$randomIdentifier"
$secondaryAddressPrefix = "10.128.0.0/16"
$secondaryDefaultSubnet = "secondaryDefaultSubnet-$randomIdentifier"
$secondaryDefaultSubnetAddress = "10.128.0.0/24"
$secondaryMiSubnetName = "secondaryMISubnet-$randomIdentifier"
$secondaryMiSubnetAddress = "10.128.0.0/24"
$secondaryMiGwSubnetAddress = "10.128.255.0/27"
$secondaryGWName = "secondaryGateway-$randomIdentifier"
$secondaryGWPublicIPAddress = $secondaryGWName + "-IP"
$secondaryGWIPConfig = $secondaryGWName + "-ipc"
$secondaryGWAsn = 62000
$secondaryGWConnection = $secondaryGWName + "-connection"



# Set the managed instance name for the new managed instances
$primaryInstance = "primary-mi-$randomIdentifier"
$secondaryInstance = "secondary-mi-$randomIdentifier"

# Set the admin login and password for your managed instance
$secpasswd = "PWD27!"+(New-Guid).Guid | ConvertTo-SecureString -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ("azureuser", $secpasswd)


# Set the managed instance service tier, compute level, and license mode
$edition = "General Purpose"
$vCores = 8
$maxStorage = 256
$computeGeneration = "Gen5"
$license = "LicenseIncluded" #"BasePrice" or LicenseIncluded if you have don't have SQL Server licence that can be used for AHB discount

# Set failover group details
$vpnSharedKey = "mi1mi2psk"
$failoverGroupName = "failovergroup-$randomIdentifier"

# Show randomized variables
Write-host "Resource group name is" $resourceGroupName
Write-host "Password is" $secpasswd
Write-host "Primary Virtual Network name is" $primaryVNet
Write-host "Primary default subnet name is" $primaryDefaultSubnet
Write-host "Primary managed instance subnet name is" $primaryMiSubnetName
Write-host "Secondary Virtual Network name is" $secondaryVNet
Write-host "Secondary default subnet name is" $secondaryDefaultSubnet
Write-host "Secondary managed instance subnet name is" $secondaryMiSubnetName
Write-host "Primary managed instance name is" $primaryInstance
Write-host "Secondary managed instance name is" $secondaryInstance
Write-host "Failover group name is" $failoverGroupName

# Suppress networking breaking changes warning (https://aka.ms/azps-changewarnings
Set-Item Env:\SuppressAzurePowerShellBreakingChangeWarnings "true"

# Set subscription context
Set-AzContext -SubscriptionId $subscriptionId 

# Create a resource group
Write-host "Creating resource group..."
$resourceGroup = New-AzResourceGroup -Name $resourceGroupName -Location $location -Tag @{Owner="SQLDB-Samples"}
$resourceGroup

# Configure primary virtual network
Write-host "Creating primary virtual network..."
$primaryVirtualNetwork = New-AzVirtualNetwork `
                      -ResourceGroupName $resourceGroupName `
                      -Location $location `
                      -Name $primaryVNet `
                      -AddressPrefix $primaryAddressPrefix

                  Add-AzVirtualNetworkSubnetConfig `
                      -Name $primaryMiSubnetName `
                      -VirtualNetwork $primaryVirtualNetwork `
                      -AddressPrefix $PrimaryMiSubnetAddress `
                  | Set-AzVirtualNetwork
$primaryVirtualNetwork


# Configure primary MI subnet
Write-host "Configuring primary MI subnet..."
$primaryVirtualNetwork = Get-AzVirtualNetwork -Name $primaryVNet -ResourceGroupName $resourceGroupName


$primaryMiSubnetConfig = Get-AzVirtualNetworkSubnetConfig `
                        -Name $primaryMiSubnetName `
                        -VirtualNetwork $primaryVirtualNetwork
$primaryMiSubnetConfig

# Configure network security group management service
Write-host "Configuring primary MI subnet..."

$primaryMiSubnetConfigId = $primaryMiSubnetConfig.Id

$primaryNSGMiManagementService = New-AzNetworkSecurityGroup `
                      -Name 'primaryNSGMiManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $location
$primaryNSGMiManagementService

# Configure route table management service
Write-host "Configuring primary MI route table management service..."

$primaryRouteTableMiManagementService = New-AzRouteTable `
                      -Name 'primaryRouteTableMiManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $location
$primaryRouteTableMiManagementService

# Configure the primary network security group
Write-host "Configuring primary network security group..."
Set-AzVirtualNetworkSubnetConfig `
                      -VirtualNetwork $primaryVirtualNetwork `
                      -Name $primaryMiSubnetName `
                      -AddressPrefix $PrimaryMiSubnetAddress `
                      -NetworkSecurityGroup $primaryNSGMiManagementService `
                      -RouteTable $primaryRouteTableMiManagementService | `
                    Set-AzVirtualNetwork

Get-AzNetworkSecurityGroup `
                      -ResourceGroupName $resourceGroupName `
                      -Name "primaryNSGMiManagementService" `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 100 `
                      -Name "allow_management_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange 9000,9003,1438,1440,1452 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 200 `
                      -Name "allow_misubnet_inbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix $PrimaryMiSubnetAddress `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 300 `
                      -Name "allow_health_probe_inbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix AzureLoadBalancer `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1000 `
                      -Name "allow_tds_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 1433 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1100 `
                      -Name "allow_redirect_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 11000-11999 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1200 `
                      -Name "allow_geodr_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 5022 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 4096 `
                      -Name "deny_all_inbound" `
                      -Access Deny `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 100 `
                      -Name "allow_management_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange 80,443,12000 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 200 `
                      -Name "allow_misubnet_outbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix $PrimaryMiSubnetAddress `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1100 `
                      -Name "allow_redirect_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 11000-11999 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1200 `
                      -Name "allow_geodr_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 5022 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 4096 `
                      -Name "deny_all_outbound" `
                      -Access Deny `
                      -Protocol * `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Set-AzNetworkSecurityGroup
Write-host "Primary network security group configured successfully."


Get-AzRouteTable `
                      -ResourceGroupName $resourceGroupName `
                      -Name "primaryRouteTableMiManagementService" `
                    | Add-AzRouteConfig `
                      -Name "primaryToMIManagementService" `
                      -AddressPrefix 0.0.0.0/0 `
                      -NextHopType Internet `
                    | Add-AzRouteConfig `
                      -Name "ToLocalClusterNode" `
                      -AddressPrefix $PrimaryMiSubnetAddress `
                      -NextHopType VnetLocal `
                    | Set-AzRouteTable
Write-host "Primary network route table configured successfully."


# Create primary managed instance

Write-host "Creating primary managed instance..."
Write-host "This will take some time, see https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance#managed-instance-management-operations for more information."
New-AzSqlInstance -Name $primaryInstance `
                      -ResourceGroupName $resourceGroupName `
                      -Location $location `
                      -SubnetId $primaryMiSubnetConfigId `
                      -AdministratorCredential $mycreds `
                      -StorageSizeInGB $maxStorage `
                      -VCore $vCores `
                      -Edition $edition `
                      -ComputeGeneration $computeGeneration `
                      -LicenseType $license
Write-host "Primary managed instance created successfully."
```

## 2 - Create secondary virtual network
In this step, you will create a virtual network for the secondary managed instance. This step is necessary because there is a requirement that the subnet of the primary and secondary managed instances have non-overlapping address ranges. This step is only necessary when using the Azure portal as it's combined in the Powershell script in the next step. 

To verify the subnet range of your primary virtual network, follow these steps:
1. In the [Azure portal](https://portal.azure.com), navigate to your resource group and select the virtual network for your primary instance. 
1. Select **Subnets** under **Settings** and note the **Address range**. The subnet address range of the virtual network for the secondary managed instance cannot overlap this. 


   ![Primary subnet](media/sql-database-managed-instance-failover-group-tutorial/verify-primary-subnet-range.png)

To create a virtual network, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** and search for *virtual network*. 
1. Select the **Virtual Network** option published by Microsoft and then select **Create** on the next page. 
1. Fill out the required fields to configure the virtual network for your secondary managed instance, and then select **Create**. 

   The following table shows the values necessary for the secondary virtual network:

    | **Field** | Value |
    | --- | --- |
    | **Name** |  The name for the virtual network to be used by the secondary managed instance, such as `vnet-sql-mi-secondary`. |
    | **Address space** | The address space for your virtual network, such as `10.128.0.0/16`. | 
    | **Subscription** | The subscription where your primary managed instance and resource group reside. |
    | **Region** | The location where you will deploy your secondary managed instance. |
    | **Subnet** | The name for your subnet. `default` is provided for you by default. |
    | **Address range**| The address range for your subnet. This must be different than the subnet address range used by the virtual network of your primary managed instance, such as `10.128.0.0/24`.  |
    | &nbsp; | &nbsp; |

    ![Secondary virtual network values](media/sql-database-managed-instance-failover-group-tutorial/secondary-virtual-network.png)


## 3 - Create a secondary managed instance
In this step, you will create a secondary managed instance in the Azure portal, which will also configure the networking between the two managed instances. 

Your second managed instance must:
- Be empty. 
- Have a different subnet and IP range than the primary managed instance. 

To create your secondary managed instance, follow these steps: 

1. Select **Azure SQL** in the left-hand menu of the Azure portal. If **Azure SQL** is not in the list, select **All services**, then type Azure SQL in the search box. (Optional) Select the star next to **Azure SQL** to favorite it and add it as an item in the left-hand navigation. 
1. Select **+ Add** to open the **Select SQL deployment option** page. You can view additional information about the different databases by selecting Show details on the Databases tile.
1. Select **Create** on the **SQL managed instances** tile. 

    ![Select managed instance](media/sql-database-managed-instance-failover-group-tutorial/select-managed-instance.png)

1. On the **Basics** tab of the **Create Azure SQL Database Managed Instance** page, fill out the required fields to configure your secondary managed instance. 

   The following table shows the values necessary for the secondary managed instance:
 
    | **Field** | Value |
    | --- | --- |
    | **Subscription** |  The subscription where your primary managed instance is. |
    | **Resource group**| The resource group where your primary managed instance is. |
    | **Managed instance name** | The name of your new secondary managed instance, such as `sql-mi-secondary`  | 
    | **Region**| The location for your secondary managed instance.  |
    | **Managed instance admin login** | The login you want to use for your new secondary managed instance, such as `azureuser`. |
    | **Password** | A complex password that will be used by the admin login for the new secondary managed instance.  |
    | &nbsp; | &nbsp; |

1. Under the **Networking** tab, for the **Virtual Network**, select the virtual network you created for the secondary managed instance from the drop-down.

   ![Secondary MI networking](media/sql-database-managed-instance-failover-group-tutorial/networking-settings-for-secondary-mi.png)

1. Under the **Additional settings** tab, for **Geo-Replication**, choose to **Yes** to _Use as failover secondary_. Select the primary managed instance from the drop-down. 
    1. Be sure that the collation and time zone matches that of the primary managed instance. The primary managed instance created in this tutorial used  the default of `SQL_Latin1_General_CP1_CI_AS` collation and the `(UTC) Coordinated Universal Time` time zone. 

   ![Secondary MI networking](media/sql-database-managed-instance-failover-group-tutorial/secondary-mi-failover.png)

1. Select **Review + create** to review the settings for your secondary managed instance. 
1. Select **Create** to create your secondary managed instance. 

```powershell-interactive
# Configure secondary virtual network
Write-host "Configuring secondary virtual network..."

$SecondaryVirtualNetwork = New-AzVirtualNetwork `
                      -ResourceGroupName $resourceGroupName `
                      -Location $drlocation `
                      -Name $secondaryVNet `
                      -AddressPrefix $secondaryAddressPrefix

Add-AzVirtualNetworkSubnetConfig `
                      -Name $secondaryMiSubnetName `
                      -VirtualNetwork $SecondaryVirtualNetwork `
                      -AddressPrefix $secondaryMiSubnetAddress `
                    | Set-AzVirtualNetwork
$SecondaryVirtualNetwork

# Configure secondary managed instance subnet
Write-host "Configuring secondary MI subnet..."

$SecondaryVirtualNetwork = Get-AzVirtualNetwork -Name $secondaryVNet -ResourceGroupName $resourceGroupName

$secondaryMiSubnetConfig = Get-AzVirtualNetworkSubnetConfig `
                        -Name $secondaryMiSubnetName `
                        -VirtualNetwork $SecondaryVirtualNetwork
$secondaryMiSubnetConfig

# Configure secondary network security group management service
Write-host "Configuring secondary network security group management service..."

$secondaryMiSubnetConfigId = $secondaryMiSubnetConfig.Id

$secondaryNSGMiManagementService = New-AzNetworkSecurityGroup `
                      -Name 'secondaryToMIManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $drlocation
$secondaryNSGMiManagementService

# Configure secondary route table MI management service
Write-host "Configuring secondary route table MI management service..."

$secondaryRouteTableMiManagementService = New-AzRouteTable `
                      -Name 'secondaryRouteTableMiManagementService' `
                      -ResourceGroupName $resourceGroupName `
                      -location $drlocation
$secondaryRouteTableMiManagementService

# Configure the secondary network security group
Write-host "Configuring secondary network security group..."

Set-AzVirtualNetworkSubnetConfig `
                      -VirtualNetwork $SecondaryVirtualNetwork `
                      -Name $secondaryMiSubnetName `
                      -AddressPrefix $secondaryMiSubnetAddress `
                      -NetworkSecurityGroup $secondaryNSGMiManagementService `
                      -RouteTable $secondaryRouteTableMiManagementService `
                    | Set-AzVirtualNetwork

Get-AzNetworkSecurityGroup `
                      -ResourceGroupName $resourceGroupName `
                      -Name "secondaryToMIManagementService" `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 100 `
                      -Name "allow_management_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange 9000,9003,1438,1440,1452 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 200 `
                      -Name "allow_misubnet_inbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix $secondaryMiSubnetAddress `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 300 `
                      -Name "allow_health_probe_inbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix AzureLoadBalancer `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1000 `
                      -Name "allow_tds_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 1433 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1100 `
                      -Name "allow_redirect_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 11000-11999 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1200 `
                      -Name "allow_geodr_inbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 5022 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 4096 `
                      -Name "deny_all_inbound" `
                      -Access Deny `
                      -Protocol * `
                      -Direction Inbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 100 `
                      -Name "allow_management_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange 80,443,12000 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 200 `
                      -Name "allow_misubnet_outbound" `
                      -Access Allow `
                      -Protocol * `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix $secondaryMiSubnetAddress `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1100 `
                      -Name "allow_redirect_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 11000-11999 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 1200 `
                      -Name "allow_geodr_outbound" `
                      -Access Allow `
                      -Protocol Tcp `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix VirtualNetwork `
                      -DestinationPortRange 5022 `
                      -DestinationAddressPrefix * `
                    | Add-AzNetworkSecurityRuleConfig `
                      -Priority 4096 `
                      -Name "deny_all_outbound" `
                      -Access Deny `
                      -Protocol * `
                      -Direction Outbound `
                      -SourcePortRange * `
                      -SourceAddressPrefix * `
                      -DestinationPortRange * `
                      -DestinationAddressPrefix * `
                    | Set-AzNetworkSecurityGroup


Get-AzRouteTable `
                      -ResourceGroupName $resourceGroupName `
                      -Name "secondaryRouteTableMiManagementService" `
                    | Add-AzRouteConfig `
                      -Name "secondaryToMIManagementService" `
                      -AddressPrefix 0.0.0.0/0 `
                      -NextHopType Internet `
                    | Add-AzRouteConfig `
                      -Name "ToLocalClusterNode" `
                      -AddressPrefix $secondaryMiSubnetAddress `
                      -NextHopType VnetLocal `
                    | Set-AzRouteTable
Write-host "Secondary network security group configured successfully."

# Create secondary managed instance

$primaryManagedInstanceId = Get-AzSqlInstance -Name $primaryInstance -ResourceGroupName $resourceGroupName | Select-Object Id


Write-host "Creating secondary managed instance..."
Write-host "This will take some time, see https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance#managed-instance-management-operations for more information."
New-AzSqlInstance -Name $secondaryInstance `
                  -ResourceGroupName $resourceGroupName `
                  -Location $drLocation `
                  -SubnetId $secondaryMiSubnetConfigId `
                  -AdministratorCredential $mycreds `
                  -StorageSizeInGB $maxStorage `
                  -VCore $vCores `
                  -Edition $edition `
                  -ComputeGeneration $computeGeneration `
                  -LicenseType $license `
                  -DnsZonePartner $primaryManagedInstanceId.Id
Write-host "Secondary managed instance created successfully."
```


## 4 - Create primary gateway 
For two managed instances to participate in a failover group, there must be a gateway configured between the virtual networks of the two managed instances to allow network communication. You can create the gateway for the primary managed instance using the Azure portal. 

<!-- PowerShell, and Az CLI. 
# [Portal](#tab/azure-portal)

Create the gateway for the virtual network of your primary managed instance using the Azure portal. 
-->

1. In the [Azure portal](https://portal.azure.com), go to your resource group and select the **Virtual network** resource for your primary managed instance. 
1. Select **Subnets** under **Settings** and then select to add a new **Gateway subnet**. Leave the default values. 

   ![Add gateway for primary managed instance](media/sql-database-managed-instance-failover-group-tutorial/add-subnet-gateway-primary-vnet.png)

1. Once the subnet gateway is created, select **Create a resource** from the left navigation pane and then type `Virtual network gateway` in the search box. Select the **Virtual network gateway** resource published by **Microsoft**. 

   ![Create a new virtual network gateway](media/sql-database-managed-instance-failover-group-tutorial/create-virtual-network-gateway.png)

1. Fill out the required fields to configure the gateway your primary managed instance. 

   The following table shows the values necessary for the gateway for the primary managed instance:
 
    | **Field** | Value |
    | --- | --- |
    | **Subscription** |  The subscription where your primary managed instance is. |
    | **Name** | The name for your virtual network gateway, such as `primary-mi-gateway`. | 
    | **Region** | The region where your secondary managed instance is. |
    | **Gateway type** | Select **VPN**. |
    | **VPN Type** | Select **Route-based** |
    | **SKU**| Leave default of `VpnGw1`. |
    | **Location**| The location where your primary managed instance and primary virtual network is.   |
    | **Virtual network**| Select the virtual network that was created in section 2, such as `vnet-sql-mi-primary`. |
    | **Public IP address**| Select **Create new**. |
    | **Public IP address name**| Enter a name for your IP address, such as `primary-gateway-IP`. |
    | &nbsp; | &nbsp; |

1. Leave the other values as default, and then select **Review + create** to review the settings for your virtual network gateway.

   ![Primary gateway settings](media/sql-database-managed-instance-failover-group-tutorial/settings-for-primary-gateway.png)

1. Select **Create** to create your new virtual network gateway. 


# [PowerShell](#tab/azure-powershell)

Create the gateway for the virtual network of your primary managed instance using PowerShell. 

    ```powershell-interactive
    # $primaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    $primaryVnetName = "vnet-sql-mi-primary"
    $primaryGWName = "Primary-Gateway"
    $primaryGWPublicIPAddress = $primaryGWName + "-ip"
    $primaryGWIPConfig = $primaryGWName + "-ipc"
    $primaryGWAsn = 61000
    
    
    # Get the primary virtual network
    $vnet1 = Get-AzVirtualNetwork -Name $primaryVnetName -ResourceGroupName $primaryResourceGroupName
    $primaryLocation = $vnet1.Location
    
    # Create primary gateway
    Write-host "Creating primary gateway..."
    $subnet1 = Get-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet1
    $gwpip1= New-AzPublicIpAddress -Name $primaryGWPublicIPAddress -ResourceGroupName $primaryResourceGroupName `
             -Location $primaryLocation -AllocationMethod Dynamic
    $gwipconfig1 = New-AzVirtualNetworkGatewayIpConfig -Name $primaryGWIPConfig `
             -SubnetId $subnet1.Id -PublicIpAddressId $gwpip1.Id
     
    $gw1 = New-AzVirtualNetworkGateway -Name $primaryGWName -ResourceGroupName $primaryResourceGroupName `
        -Location $primaryLocation -IpConfigurations $gwipconfig1 -GatewayType Vpn `
        -VpnType RouteBased -GatewaySku VpnGw1 -EnableBgp $true -Asn $primaryGWAsn
    $gw1
    ```
---


## 5 - Create secondary gateway 
In this step, create the gateway for the virtual network of your secondary managed instance using the Azure Portal, 


# [Portal](#tab/azure-portal)

Using the Azure portal, repeat the steps in the previous section to create the virtual network subnet and gateway for the secondary managed instance. Fill out the required fields to configure the gateway for your secondary managed instance. 

   The following table shows the values necessary for the gateway for the secondary managed instance:

   | **Field** | Value |
   | --- | --- |
   | **Subscription** |  The subscription where your secondary managed instance is. |
   | **Name** | The name for your virtual network gateway, such as `secondary-mi-gateway`. | 
   | **Region** | The region where your secondary managed instance is. |
   | **Gateway type** | Select **VPN**. |
   | **VPN Type** | Select **Route-based** |
   | **SKU**| Leave default of `VpnGw1`. |
   | **Location**| The location where your secondary managed instance and secondary virtual network is.   |
   | **Virtual network**| Select the virtual network that was created in section 2, such as `vnet-sql-mi-secondary`. |
   | **Public IP address**| Select **Create new**. |
   | **Public IP address name**| Enter a name for your IP address, such as `secondary-gateway-IP`. |
   | &nbsp; | &nbsp; |

   ![Secondary gateway settings](media/sql-database-managed-instance-failover-group-tutorial/settings-for-secondary-gateway.png)


# [PowerShell](#tab/azure-powershell)

Create the gateway for the virtual network of the secondary managed instance using PowerShell. 

    ```powershell-interactive
    # $secondaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    $secondaryVnetName = "vnet-sql-mi-secondary"
    $secondaryGWName = "Secondary-Gateway"
    $secondaryGWPublicIPAddress = $secondaryGWName + "-IP"
    $secondaryGWIPConfig = $secondaryGWName + "-ipc"
    $secondaryGWAsn = 62000
    
    # Get the secondary virtual network
    $vnet2 = Get-AzVirtualNetwork -Name $secondaryVnetName -ResourceGroupName $secondaryResourceGroupName
    $secondaryLocation = $vnet2.Location
     
    # Create the secondary gateway
    Write-host "Creating secondary gateway..."
    $subnet2 = Get-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet2
    $gwpip2= New-AzPublicIpAddress -Name $secondaryGWPublicIPAddress -ResourceGroupName $secondaryResourceGroupName `
             -Location $secondaryLocation -AllocationMethod Dynamic
    $gwipconfig2 = New-AzVirtualNetworkGatewayIpConfig -Name $secondaryGWIPConfig `
             -SubnetId $subnet2.Id -PublicIpAddressId $gwpip2.Id
     
    $gw2 = New-AzVirtualNetworkGateway -Name $secondaryGWName -ResourceGroupName $secondaryResourceGroupName `
        -Location $secondaryLocation -IpConfigurations $gwipconfig2 -GatewayType Vpn `
        -VpnType RouteBased -GatewaySku VpnGw1 -EnableBgp $true -Asn $secondaryGWAsn
    
    $gw2
    ```
---


## 6 - Connect the gateways
In this step, create a bidirectional connection between the two gateways of the two virtual networks. 


# [Portal](#tab/azure-portal)

Connect the two gateways using the Azure portal. 


1. Select **Create a resource** from the [Azure portal](https://portal.azure.com).
1. Type `connection` in the search box and then press enter to search, which takes you to the **Connection** resource, published by Microsoft.
1. Select **Create** to create your connection. 
1. On the **Basics** tab, select the following values and then select **OK**. 
    1. Select `VNet-to-VNet` for the **Connection type**. 
    1. Select your subscription from the drop-down. 
    1. Select the resource group for your managed instance in the drop-down. 
    1. Select the location of your primary managed instance from the drop down 
1. On the **Settings** tab, select or enter the following values and then select **OK**:
    1. Choose the primary network gateway for the **First virtual network gateway**, such as `Primary-Gateway`.  
    1. Choose the secondary network gateway for the **Second virtual network gateawy**, such as `Secondary-Gateway`. 
    1. Select the checkbox next to **Establish bidirectional connectivity**. 
    1. Either leave the default primary connection name, or rename it to a value of your choice. 
    1. Either leave the default primary connection name, or rename it to a value of your choice. 
    1. Provide a **Shared key (PSK)** for the connection, such as `mi1m2psk`. 

   ![Create gateway connection](media/sql-database-managed-instance-failover-group-tutorial/create-gateway-connection.png)

1. On the **Summary** tab, review the settings for your bidirectional connection and then select **OK** to create your connection. 


# [PowerShell](#tab/azure-powershell)

Connect the two gateways using PowerShell. 

    ```powershell-interactive
    $vpnSharedKey = "mi1mi2psk"
     
    # $primaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    $primaryGWConnection = "Primary-connection"
    $primaryLocation = "West US"
     
    # $secondaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    $secondaryGWConnection = "Secondary-connection"
    $secondaryLocation = "East US"    
   
    # Connect the primary to secondary gateway
    Write-host "Connecting the primary gateway"
    New-AzVirtualNetworkGatewayConnection -Name $primaryGWConnection -ResourceGroupName $primaryResourceGroupName `
        -VirtualNetworkGateway1 $gw1 -VirtualNetworkGateway2 $gw2 -Location $primaryLocation `
        -ConnectionType Vnet2Vnet -SharedKey $vpnSharedKey -EnableBgp $true
    $primaryGWConnection
    
    # Connect the secondary to primary gateway
    Write-host "Connecting the secondary gateway"
    
    New-AzVirtualNetworkGatewayConnection -Name $secondaryGWConnection -ResourceGroupName $secondaryResourceGroupName `
        -VirtualNetworkGateway1 $gw2 -VirtualNetworkGateway2 $gw1 -Location $secondaryLocation `
        -ConnectionType Vnet2Vnet -SharedKey $vpnSharedKey -EnableBgp $true
    $secondaryGWConnection 
    ```
---



## 7 - Create a failover group
In this step, you will create the failover group and add both managed instances to it. 


# [Portal](#tab/azure-portal)
Create the failover group using the Azure portal. 


1. Select **Azure SQL** in the left-hand menu of the [Azure portal](https://portal.azure.com). If **Azure SQL** is not in the list, select **All services**, then type Azure SQL in the search box. (Optional) Select the star next to **Azure SQL** to favorite it and add it as an item in the left-hand navigation. 
1. Select the primary managed instance you created in the first section, such as `sql-mi-primary`. 
1. Under **Settings**, navigate to **Instance Failover Groups** and then choose to **Add group** to open the **Instance Failover Group** page. 

   ![Add a failover group](media/sql-database-managed-instance-failover-group-tutorial/add-failover-group.png)

1. On the **Instance Failover Group** page, type the name of  your failover group, such as `failovergrouptutorial` and then choose the secondary managed instance, such as `sql-mi-secondary` from the drop-down. Select **Create** to create your failover group. 

   ![Create failover group](media/sql-database-managed-instance-failover-group-tutorial/create-failover-group.png)

1. Once failover group deployment is complete, you will be taken back to the **Failover group** page. 


# [PowerShell](#tab/azure-powershell)
Create the failover group using PowerShell. 

    ```powershell-interactive
    # $primaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    $failoverGroupName = "failovergrouptutorial"
    # $primaryLocation = "East US"
    # $secondaryLocation = "West US"
    # $primaryManagedInstance = "sql-mi-primary"
    # $secondaryManagedInstance = "sql-mi-secondary"
    
    # Create failover group
    Write-host "Creating the failover group..."
    $failoverGroup = New-AzSqlDatabaseInstanceFailoverGroup -Name $failoverGroupName `
         -Location $primaryLocation -ResourceGroupName $primaryResourceGroupName -PrimaryManagedInstanceName $primaryManagedInstance `
         -PartnerRegion $secondaryLocation -PartnerManagedInstanceName $secondaryManagedInstance `
         -FailoverPolicy Automatic -GracePeriodWithDataLossHours 1
    $failoverGroup
    ```

---



## 8 - Test failover
In this step, you will fail your failover group over to the secondary server, and then fail back using the Azure portal. 


# [Portal](#tab/azure-portal)
Test failover using the Azure portal. 


1. Navigate to your managed instance within the [Azure portal](https://portal.azure.com) and select **Instance Failover Groups** under settings. 
1. Review which managed instance is the primary, and which managed instance is the secondary. 
1. Select **Failover** and then select **Yes** on the warning about TDS sessions being disconnected. 

   ![Fail over the failover group](media/sql-database-managed-instance-failover-group-tutorial/failover-mi-failover-group.png)

1. Review which manged instance is the primary and which instance is the secondary. If fail over succeeded, the two instances should have switched roles. 

   ![Managed instances have switched roles after failover](media/sql-database-managed-instance-failover-group-tutorial/mi-switched-after-failover.png)

1. Select **Failover** once again to fail the primary instance back to the primary role. 


# [PowerShell](#tab/azure-powershell)
Test failover using PowerShell. 

    ```powershell-interactive
    # $primaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    # $secondaryResourceGroupName = "myResourceGroup-$(Get-Random)"
    # $failoverGroupName = "failovergrouptutorial"
    # $primaryLocation = "East US"
    # $secondaryLocation = "West US"
    # $primaryManagedInstance = "sql-mi-primary"
    # $secondaryManagedInstance = ""sql-mi-secondary"
    
    # Verify the current primary role
    Get-AzSqlDatabaseInstanceFailoverGroup -ResourceGroupName $primaryResourceGroupName `
        -Location $secondaryLocation -Name $failoverGroupName
    
    # Failover the primary managed instance to the secondary role
    Write-host "Failing primary over to the secondary location"
    Get-AzSqlDatabaseInstanceFailoverGroup -ResourceGroupName $secondaryResourceGroupName `
        -Location $secondaryLocation -Name $failoverGroupName | Switch-AzSqlDatabaseInstanceFailoverGroup
    Write-host "Successfully failed failover group to secondary location"
    ```

Revert failover group back to the primary server:

    ```powershell-interactive
    # Verify the current primary role
    Get-AzSqlDatabaseInstanceFailoverGroup -ResourceGroupName $primaryResourceGroupName `
        -Location $secondaryLocation -Name $failoverGroupName
    
    # Fail primary managed instance back to primary role
    Write-host "Failing primary back to primary role"
    Get-AzSqlDatabaseInstanceFailoverGroup -ResourceGroupName $primaryResourceGroupName `
        -Location $primaryLocation -Name $failoverGroupName | Switch-AzSqlDatabaseInstanceFailoverGroup
   Write-host "Successfully failed failover group to primary location"
    
    # Verify the current primary role
    Get-AzSqlDatabaseInstanceFailoverGroup -ResourceGroupName $primaryResourceGroupName `
        -Location $secondaryLocation -Name $failoverGroupName
    ```

---



## Clean up resources
Clean up resources by first deleting the managed instance, then the virtual cluster, then any remaining resources, and finally the resource group. 

1. Navigate to your resource group in the [Azure portal](https://portal.azure.com). 
1. Select the managed instance and then select **Delete**. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. This process may take some time to complete in the background, and until it"s done, you will not be able to delete the *Virtual cluster* or any other dependent resources. Monitor the delete in the Activity tab to confirm your managed instance has been deleted. 
1. Once the managed instance is deleted, delete the *Virtual cluster* by selecting it in your resource group, and then choosing **Delete**. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. 
1. Delete any remaining resources. Type `yes` in the text box to confirm you want to delete the resource and then select **Delete**. 
1. Delete the resource group by selecting **Delete resource group**, typing in the name of the resource group, `myResourceGroup`, and then selecting **Delete**. 


## Full script

## Next steps

In this tutorial, you configured a failover group between two managed instances. You learned how to:

> [!div class="checklist"]
> - Create a primary managed instance
> - Create a secondary managed instance as part of a [failover group](sql-database-auto-failover-group.md). 
> - Test failover

Advance to the next quickstart on how to connect to your managed instance, and how to restore a database to your managed instance: 

> [!div class="nextstepaction"]
> [Connect to your managed instance](sql-database-managed-instance-configure-vm.md)
> [Restore a database to a managed instance](sql-database-managed-instance-get-started-restore.md)


