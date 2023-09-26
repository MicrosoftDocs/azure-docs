---
title: Set up resources for deploying an ML model in Azure SQL Edge
description: In part one of this three-part Azure SQL Edge tutorial for predicting iron ore impurities, you'll install the prerequisite software and set up required Azure resources for deploying a machine learning model in Azure SQL Edge.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: tutorial
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
---
# Install software and set up resources for the tutorial

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In this three-part tutorial, you'll create a machine learning model to predict iron ore impurities as a percentage of Silica, and then deploy the model in Azure SQL Edge. In part one, you'll install the required software and deploy Azure resources.

## Prerequisites

1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
1. Install Visual Studio 2019 with
   - Azure IoT Edge tools
   - .NET core cross-platform development
   - Container development tools
1. Install [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio/)
1. Open Azure Data Studio and configure Python for notebooks. For details, see [Configure Python for Notebooks](/sql/azure-data-studio/sql-notebooks#configure-python-for-notebooks). This step can take several minutes.
1. Install the latest version of [Azure CLI](https://github.com/Azure/azure-powershell/releases/tag/v3.5.0-February2020). The following scripts require that AZ PowerShell be the latest version (3.5.0, Feb 2020).
1. Set up the environment to debug, run, and test IoT Edge solution by installing [Azure IoT EdgeHub Dev Tool](https://pypi.org/project/iotedgehubdev/).
1. Install Docker.

## Deploy Azure resources using PowerShell Script

Deploy the Azure resources required by this Azure SQL Edge tutorial. These resources can be deployed either by using a PowerShell script or through the Azure portal. This tutorial uses a PowerShell script.

[!INCLUDE [iot-hub-cli-version-info](../../includes/iot-hub-cli-version-info.md)]

1. Import the modules needed to run the PowerShell script in this tutorial.

   ```powershell
   Import-Module Az.Accounts -RequiredVersion 1.7.3
   Import-Module -Name Az -RequiredVersion 3.5.0
   Import-Module Az.IotHub -RequiredVersion 2.1.0
   Import-Module Az.Compute -RequiredVersion 3.5.0
   az extension add --name azure-iot
   az extension add --name azure-cli-ml
   ```

1. Declare the variables required by the PowerShell script.

   ```powershell
   $ResourceGroup = "<name_of_the_resource_group>"
   $IoTHubName = "<name_of_the_IoT_hub>"
   $location = "<location_of_your_Azure_Subscription>"
   $SubscriptionName = "<your_azure_subscription>"
   $NetworkSecGroup = "<name_of_your_network_security_group>"
   $StorageAccountName = "<name_of_your_storage_account>"
   ```

1. Declare the rest of the variables.

   ```powershell
   $IoTHubSkuName = "S1"
   $IoTHubUnits = 4
   $EdgeDeviceId = "IronOrePredictionDevice"
   $publicIpName = "VMPublicIP"
   $imageOffer = "iot_edge_vm_ubuntu"
   $imagePublisher = "microsoft_iot_edge"
   $imageSku = "ubuntu_1604_edgeruntimeonly"
   $AdminAcc = "iotadmin"
   $AdminPassword = ConvertTo-SecureString "IoTAdmin@1234" -AsPlainText -Force
   $VMSize = "Standard_DS3"
   $NetworkName = "MyNet"
   $NICName = "MyNIC"
   $SubnetName = "MySubnet"
   $SubnetAddressPrefix = "10.0.0.0/24"
   $VnetAddressPrefix = "10.0.0.0/16"
   $MyWorkSpace = "SQLDatabaseEdgeDemo"
   $containerRegistryName = $ResourceGroup + "ContRegistry"
   ```

1. To begin creating assets, sign in to Azure.

   ```powershell
   Login-AzAccount

   az login
   ```

1. Set the Azure subscription ID.

   ```powershell
   Select-AzSubscription -Subscription $SubscriptionName
   az account set --subscription $SubscriptionName
   ```

1. Create the resource group if it doesn't already exist.

   ```powershell
   $rg = Get-AzResourceGroup -Name $ResourceGroup
   if($rg -eq $null)
   {
       Write-Output("Resource Group $ResourceGroup does not exist, creating Resource Gorup")
       New-AzResourceGroup -Name $ResourceGroup -Location $location
   }
   else
   {
       Write-Output ("Resource Group $ResourceGroup exists")
   }
   ```

1. Create the storage account and storage account container in the resource group.

   ```powershell
   $sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName
   if ($sa -eq $null)
   {
       New-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName -SkuName Standard_LRS -Location $location -Kind Storage
       $sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName
       $storageKey = Get-AzStorageAccountKey -ResourceGroupName $ResourceGroup -Name $StorageAccountName
       $storageContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $storageKey[0].Value
       New-AzStorageContainer -Name "sqldatabasedacpac" -Context $storageContext
   }
   else
   {
      Write-Output ("Storage Account $StorageAccountName exists in Resource Group $ResourceGroup")
   }
   ```

1. Upload the database `dacpac` file to the storage account and generate a SAS URL for the blob. **Make a note of the SAS URL for the database `dacpac` blob.**

   ```powershell
   $file = Read-Host "Please Enter the location to the zipped Database DacPac file:"
   Set-AzStorageBlobContent -File $file -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context
   $DacpacFileSASURL = New-AzStorageBlobSASToken -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context -Permission r -StartTime (Get-Date).DateTime -ExpiryTime (Get-Date).AddMonths(12) -FullUri
   ```

1. Create an Azure container registry within this resource group.

   ```powershell
   $containerRegistry = Get-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName
   if ($containerRegistry -eq $null)
   {
       New-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName -Sku Standard -Location $location -EnableAdminUser
       $containerRegistry = Get-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName
   }
   else
   {
       Write-Output ("Container Registry $containerRegistryName exists in Resource Group $ResourceGroup")
   }
   ```

1. Create the network security group within the resource group.

   ```powershell
   $nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroup -Name $NetworkSecGroup
   if($nsg -eq $null)
   {
       Write-Output("Network Security Group $NetworkSecGroup does not exist in the resource group $ResourceGroup")

       $rule1 = New-AzNetworkSecurityRuleConfig -Name "SSH" -Description "Allow SSH" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 22
       $rule2 = New-AzNetworkSecurityRuleConfig -Name "SQL" -Description "Allow SQL" -Access Allow -Protocol Tcp -Direction Inbound -Priority 101 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 1600
       New-AzNetworkSecurityGroup -Name $NetworkSecGroup -ResourceGroupName $ResourceGroup -Location $location -SecurityRules $rule1, $rule2

       $nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroup -Name $NetworkSecGroup
   }
   else
   {
       Write-Output ("Network Security Group $NetworkSecGroup exists in the resource group $ResourceGroup")
   }
   ```

1. Create an Azure virtual machine enabled with SQL Edge. This VM acts as an Edge device.

   ```powershell
   $AzVM = Get-AzVM -ResourceGroupName $ResourceGroup -Name $EdgeDeviceId
   If($AzVM -eq $null)
   {
       Write-Output("The Azure VM with Name- $EdgeVMName is not present in the Resource Group- $ResourceGroup ")

       $SingleSubnet = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $SubnetAddressPrefix
       $Vnet = New-AzVirtualNetwork -Name $NetworkName -ResourceGroupName $ResourceGroup -Location $location -AddressPrefix $VnetAddressPrefix -Subnet $SingleSubnet
       $publicIp = New-AzPublicIpAddress -Name $publicIpName -ResourceGroupName $ResourceGroup -AllocationMethod Static -Location $location
       $NIC = New-AzNetworkInterface -Name $NICName -ResourceGroupName $ResourceGroup -Location $location -SubnetId $Vnet.Subnets[0].Id -NetworkSecurityGroupId $nsg.Id -PublicIpAddressId $publicIp.Id

       ##Set-AzNetworkInterfaceIpConfig -Name "ipconfig1"  -NetworkInterface $NIC -PublicIpAddress $publicIp

       $Credential = New-Object System.Management.Automation.PSCredential ($AdminAcc, $AdminPassword);

       $VirtualMachine = New-AzVMConfig -VMName $EdgeDeviceId -VMSize $VMSize
       $VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine -Linux -ComputerName $EdgeDeviceId -Credential $Credential
       $VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $NIC.Id
       $VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine -PublisherName $imagePublisher -Offer $imageOffer -Skus $imageSku -Version latest
       $VirtualMachine = Set-AzVMPlan -VM $VirtualMachine -Name $imageSku -Publisher $imagePublisher -Product $imageOffer

       $AzVM = New-AzVM -ResourceGroupName $ResourceGroup -Location $location -VM $VirtualMachine -Verbose
       $AzVM = Get-AzVM -ResourceGroupName $ResourceGroup -Name $EdgeDeviceId

   }
   else
   {
       Write-Output ("The Azure VM with Name- $EdgeDeviceId is present in the Resource Group- $ResourceGroup ")
   }
   ```

1. Create an IoT hub within the resource group.

   ```powershell
   $iotHub = Get-AzIotHub -ResourceGroupName $ResourceGroup -Name $IoTHubName
   If($iotHub -eq $null)
   {
       Write-Output("IoTHub $IoTHubName does not exists, creating The IoTHub in the resource group $ResourceGroup")
       New-AzIotHub -ResourceGroupName $ResourceGroup -Name $IoTHubName -SkuName $IoTHubSkuName -Units $IoTHubUnits -Location $location -Verbose
   }
   else
   {
       Write-Output ("IoTHub $IoTHubName present in the resource group $ResourceGroup")
   }
   ```

1. Add an Edge device to the IoT hub. This step only creates the device digital identity.

   ```powershell
   $deviceIdentity = Get-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId
   If($deviceIdentity -eq $null)
   {
       Write-Output("The Edge Device with DeviceId- $EdgeDeviceId is not registered to the IoTHub- $IoTHubName ")
       Add-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId -EdgeEnabled
   }
   else
   {
       Write-Output ("The Edge Device with DeviceId- $EdgeDeviceId is registered to the IoTHub- $IoTHubName")
   }
   $deviceIdentity = Get-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId
   ```

1. Get the device primary connection string, which is needed later for the VM. The following command uses Azure CLI for deployments.

   ```powershell
   $deviceConnectionString = az iot hub device-identity connection-string show --device-id $EdgeDeviceId --hub-name $IoTHubName --resource-group $ResourceGroup --subscription $SubscriptionName
   $connString = $deviceConnectionString[1].Substring(23,$deviceConnectionString[1].Length-24)
   $connString
   ```

1. Update the connection string in the IoT Edge configuration file on the Edge device. The following commands use Azure CLI for deployments.

   ```azurecli
   $script = "/etc/iotedge/configedge.sh '" + $connString + "'"
   az vm run-command invoke -g $ResourceGroup -n $EdgeDeviceId  --command-id RunShellScript --script $script
   ```

1. Create an Azure Machine Learning workspace within the resource group.

   ```azurecli
   az ml workspace create -w $MyWorkSpace -g $ResourceGroup
   ```

## Next steps

- [Set up IoT Edge modules and connections](tutorial-set-up-iot-edge-modules.md)
