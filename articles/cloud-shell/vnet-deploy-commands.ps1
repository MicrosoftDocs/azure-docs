

# STOP

you must register the container instance for vnet -- not just the genreal registration
its in the docs -- need to find a place here.

# Resource Group
$rg = @{
    Name = "RG-VNET"
    Location = "EastUS"
} 
New-AzResourceGroup @rg

# Virtual Netowrk
$vnet = @{
    name = "net-VNET"
    location = "EastUS"
    resourceGroupName = "RG-VNET"
    addressPrefix = "10.0.0.0/16"
}
New-AzVirtualNetwork @vnet

# Network template
$subnet = @{
    ResourcegroupName = "RG-VNET"
    TemplateURI = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/demos/cloud-shell-vnet/azuredeploy.json"
    existingVNETName = "net-VNET"
    relayNamespaceName = "jason-relay-namespace"
    azureContainerInstanceOID = (Get-AzADServicePrincipal -ApplicationId "6bb8e274-af5d-4df2-98a3-4fd78b4cafd9" -ErrorAction Stop).id
    containerSubnetName = "container-subnet"
    containerSubnetAddressPrefix = "10.0.1.0/24"
    relaySubnetName = "relay-subnet"
    relaySubnetAddressPrefix = "10.0.2.0/24"
    storageSubnetName = "storage-subnet"
    storageSubnetAddressPrefix = "10.0.3.0/24"
    nsgname = "nsg-VNET"
}
New-AzResourceGroupDeployment @subnet


# Storage 

$storage = @{
    ResourcegroupName = "RG-VNET"
    TemplateURI = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/demos/cloud-shell-vnet-storage/azuredeploy.json"
    existingVNETName = "net-VNET"
    existingStorageSubnetName = "storage-subnet"
    existingContainerSubnetName = "container-subnet"
    storageAccountName = "1uniquename"
}
New-AzResourceGroupDeployment @storage





## Get resorucegroup
Get-AzResourceGroup 
## Delete resoruce group
Remove-AzResourceGroup -Name "RG-VNET" -Force
```
