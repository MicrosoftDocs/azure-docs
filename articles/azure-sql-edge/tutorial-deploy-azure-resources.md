---
title: Set up resources and software for the tutorial
description: In this section, we will install pre-requisite software and set up required Azure resources for the tutorial
keywords: 
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: VasiyaKrishnan
ms.author: vakrishn
ms.reviewer: sstein
ms.date: 05/19/2020
---
# Install software and set up resources for the tutorial
In this tutorial, you will be predicting iron ore impurities as a % of Silica in Azure SQL Edge. Before you proceed with the tutorial, ensure you have an active Azure subscription and you have installed the below pre-requisite software.

## Pre-requisite software to be installed 
1. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
2. Install [PowerShell 3.6.8](https://www.python.org/downloads/release/python-368/)
      * Windows x86-x64 Executable Installer
      * Ensure to add python path to the PATH environment variables
3. Install [Microsoft ODBC Driver 17 for SQL Server](https://www.microsoft.com/download/details.aspx?id=56567)
4. Install [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio/)
5. Open Azure Data Studio and configure Python for Notebooks. Details on how this can be accessed [here](/sql/azure-data-studio/sql-notebooks#configure-python-for-notebooks).This step can take several minutes.
6. Install latest version of [Azure CLI](https://github.com/Azure/azure-powershell/releases/tag/v3.5.0-February2020)
7. The below scripts require that the AZ PowerShell to be at the latest version (3.5.0, Feb 2020)

## Deploying Azure resources using PowerShell Script

Now, deploy Azure resources required for running the end to end scenario for Azure SQL Edge. These can be deployed either by using the PowerShell script below or through the Azure portal. For the purpose of this demo, we will be using the PowerShell Script.

1. Importing modules needed to run the below PowerShell script.
```powershell
Import-Module Az.Accounts -RequiredVersion 1.7.3
Import-Module -Name Az -RequiredVersion 3.5.0
Import-Module Az.IotHub -RequiredVersion 2.1.0
Import-Module Az.Compute -RequiredVersion 3.5.0
az extension add --name azure-cli-iot-ext
az extension add --name azure-cli-ml
```
2. Now, let us declare the variables required for the script to run. 
```powershell
$ResourceGroup = "<name_of_the_resource_group>"
$IoTHubName = "<name_of_the_IoT_hub>"
$location = "<location_of_your_Azure_Subscription>"
$SubscriptionName = "<your_azure_subscription>"
$NetworkSecGroup = "<name_of_your_network_security_group>"
$StorageAccountName = "<name_of_your_storage_account>"
```
3. Declaring rest of the variables.
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
4. To begin creation of assets, let us log in into Azure. 
```powershell
Login-AzAccount 

az login
```
5. Next, set the Azure Subscription ID.
```powershell
Select-AzSubscription -Subscription $SubscriptionName
az account set --subscription $SubscriptionName
```
6. Check and create a resource group for running the demo. 
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
7. Check and create a Storage account and Storage account container in the Resource Group. Also create a container within the storage account and upload the zipped dacpac file. Generate a SAS URL for the file. 
```powershell
$sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
if ($sa -eq $null)
{
    New-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName -SkuName Standard_LRS -Location $location -Kind Storage
    $sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
    $storagekey = Get-AzStorageAccountKey -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
    $storageContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $storagekey[0].Value
    New-AzStorageContainer -Name "sqldatabasedacpac" -Context $storageContext 
}
else
{
   Write-Output ("Storage Account $StorageAccountName exists in Resource Group $ResourceGroup")     
}
```
8. Upload the Database Dacpac file to the Storage account and generate a SAS URL for the blob. **Note down the SAS URL for the database dacpac blob.**
```powershell
$file = Read-Host "Please Enter the location to the zipped Database DacPac file:"
Set-AzStorageBlobContent -File $file -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context
$DacpacFileSASURL = New-AzStorageBlobSASToken -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context -Permission r -StartTime (Get-Date).DateTime -ExpiryTime (Get-Date).AddMonths(12) -FullUri
```
9. Check and Create an Azure Container Registry within this Resource Group.
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
10. Push the ARM/AMD docker images to the Container Registry.
```powershell
$containerRegistryCredentials = Get-AzContainerRegistryCredential -ResourceGroupName $ResourceGroup -Name $containerRegistryName

$amddockerimageFile = Read-Host "Please Enter the location to the amd docker tar file:"
$armdockerimageFile = Read-Host "Please Enter the location to the arm docker tar file:"
$amddockertag = $containerRegistry.LoginServer + "/silicaprediction" + ":amd64"
$armdockertag = $containerRegistry.LoginServer + "/silicaprediction" + ":arm64"

docker login $containerRegistry.LoginServer --username $containerRegistryCredentials.Username --password $containerRegistryCredentials.Password

docker import $amddockerimageFile $amddockertag
docker push $amddockertag

docker import $armdockerimageFile $armdockertag
docker push $armdockertag
```
11. Check and create the network security Group within the Resource Group. 
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
12. Create an Edge enabled VM, which will act as an Edge Device. 
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
13. Create an IoT Hub within the resource group.
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
14. Add an Edge Device to the IoT Hub. This step only creates the device digital identity
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
15. Get the device Primary connection String. This would be needed later for the VM. The next command uses Azure CLI for deployments.
```powershell
$deviceConnectionString = az iot hub device-identity show-connection-string --device-id $EdgeDeviceId --hub-name $IoTHubName --resource-group $ResourceGroup --subscription $SubscriptionName
$connString = $deviceConnectionString[1].Substring(23,$deviceConnectionString[1].Length-24)
$connString
```
16. Update the connection string in the IoT Edge Config File on the Edge Device. The next commands use Azure CLI for deployments.
```powershell
$script = "/etc/iotedge/configedge.sh '" + $connString + "'"
az vm run-command invoke -g $ResourceGroup -n $EdgeDeviceId  --command-id RunShellScript --script $script
```
17. Create an Azure Machine learning workspace within the Resource Group
```powershell
az ml workspace create -w $MyWorkSpace -g $ResourceGroup
```
## Next Steps

* [Set up IoT Edge Modules](set-up-iot-edge-modules.md)
