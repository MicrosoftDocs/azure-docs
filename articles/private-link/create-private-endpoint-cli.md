---
title: 'Create an Azure private endpoint using Azure CLI| Microsoft Docs'
description: Learn about Azure private endpoint
services: virtual-network
author: KumudD
ms.service: virtual-network
ms.topic: article
ms.date: 09/10/2019
ms.author: kumud

---
# Create a private endpoint using Azure CLI
A private endpoint is the fundamental building block for private link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate privately with private link resources. In this Quickstart, you will learn how to create a VM on a virtual network, an Azure storage account with a private endpoint using Azure CLI. Then, you can access the VM to and securely access the private link resource (a private Azure storage account in this example). 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.28 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

## Create a resource group

Before you can create a virtual network, you have to create a resource group to host the virtual network. Create a resource group with [az group create](/cli/azure/group). This example creates a resource group named *myResourceGroup* in the *westcentralus* location:

```azurecli-interactive
az group create --name myResourceGroup --location westcentralus
```

## Create a virtual network
Create a virtual network with [az network vnet create](/cli/azure/network/vnet). This example creates a default virtual network named *myVirtualNetwork* with one subnet named *mySubnet*:

```azurecli-interactive
az network vnet create \
 --name myVirtualNetwork \
 --resource-group myResourceGroup \
 --subnet-name mySubnet
```
## Disable subnet private endpoint policies 
Azure deploys resources to a subnet within a virtual network, so you need to create or update the subnet to disable private endpoint network policies. Update a subnet configuration named *mySubnet** with [az network vnet subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update):

```azurecli-interactive
az network vnet subnet update \
 --name mySubnet \
 --resource-group myResourceGroup \
 --vnet-name myVirtualNetwork \
 --disable-private-endpoint-network-policies true
```
## Create the VM 
Create a VM with az vm create. When prompted, provide a password to be used as the sign-in credentials for the VM. This example creates a VM named *myVm*: 
```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm \
  --image Win2019Datacenter
```
 Note the public IP address of the VM. You will use this address to connect to the VM from the internet in the next step.

## Create a storage account 
Create a general-purpose storage account with the az storage account create command. The general-purpose storage account can be used for all four services: blobs, files, tables, and queues. 
```azurecli-interactive
az storage account create \ 
    --name mystorageaccount \ 
    --resource-group myResourceGroup \ 
    --location westus \ 
    --sku Standard_LRS \ 
    --kind StorageV2 \ 
    --encryption blob \ 
    --default-action Deny 
 ```
Note the storage account ID is similar to  */subscriptions/subscriptionId/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount*. You will use the storage account ID in the next step. 
## Create the private endpoint 
Create a private endpoint for the storage account in your virtual network: 
```azurecli-interactive
$privateEndpoint = az network private-endpoint create \ 
    --name myPrivateEndpoint \ 
    --resource-group myResourceGroup \ 
    --vnet-name myVirtualNetwork  \ 
    --subnet default \ 
    --private-connection-resource-id "<Storage account Id>" \ 
    --group-ids blob \ 
    --connection-name myConnection 
 ```
## Configure the private DNS zone 
Create a private DNS zone for storage blob domain and create an association link with the virtual network. 
```azurecli-interactive
az network private-dns zone create --resource-group myResourceGroup \ 
   --name  "privatelink.blob.core.windows.net" 
az network private-dns link vnet create --resource-group myResourceGroup \ 
   --zone-name  "privatelink.blob.core.windows.net"\ 
   --name MyDNSLink \ 
   --virtual-network myVirtualNetwork \ 
   --registration-enabled false 
 
$networkInterfaceId  = az network private-endpoint show --name myPrivateEndpoint --resource-group myResourceGroup --query 'networkInterfaces[0].id' 
 
$networkInterface = az resource show --ids $networkInterfaceId --api-version 2019-04-01 -o json | ConvertFrom-Json 
 
foreach ($ipconfig in $networkInterface.properties.ipConfigurations) { 
foreach ($fqdn in $ipconfig.properties.privateLinkConnectionProperties.fqdns) { 
Write-Host "$($ipconfig.properties.privateIPAddress) $($fqdn)"  
$recordName = $fqdn.split('.',2)[0] 
$dnsZone = $fqdn.split('.',2)[1] 
az network private-dns record-set a create --name $recordName --zone-name privatelink.blob.core.windows.net --resource-group myResourceGroup 
az network private-dns record-set a add-record --record-set-name $recordName --zone-name privatelink.blob.core.windows.net --resource-group myResourceGroup -a $ipconfig.properties.privateIPAddress  
} 
} 
```

## Connect to a VM from the internet

Connect to the VM *myVm* from the internet as follows:

1. In the portal's search bar, enter *myVm*.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the downloaded.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.  

## Access storage account privately from the VM

In this section, you will create a virtual network to host the Azure storage account and configure it with a private endpoint.


1. In the Remote Desktop of *myVM*, open PowerShell.
2. Enter `nslookup mystorageaccount.blob.core.windows.net`
    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mystorageaccount123123.privatelink.blob.core.windows.net
    Address:  10.0.0.5
    Aliases:  mystorageaccount.blob.core.windows.net
3. Install [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&tabs=windows).
4. Select **Storage accounts** with the right-click.
5. Select **Connect to an azure storage**.
6. Select **Use a connection string**.
7. Select **Next**.
8. Enter the connection string by pasting the information previously copied.
9. Select **Next**.
10. Select **Connect**.
11. Browse the Blob containers from mystorageaccount 
12. (Optionally) Create folders and/or upload files to *mystorageaccount*. 
13. Close the remote desktop connection to *myVM*. 

Additional options to access the storage account:
- Microsoft Azure Storage Explorer is a standalone free app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux. You can install the application to browse privately the storage account content. 
 
- The AzCopy utility is another option for high-performance scriptable data transfer for Azure Storage. Use AzCopy to transfer data to and from Blob, File, and Table storage. 


## Clean up resources 
When you're done using the private endpoint, storage account and the VM, delete the resource group and all of the resources it contains: 
1. Enter *myResourceGroup* in the **Search** box at the top of the portal and select *myResourceGroup* from the search results. 
2. Select **Delete resource group**. 
3. Enter *myResourceGroup* for **TYPE THE RESOURCE GROUP NAME** and select **Delete**. 

## Next steps
- Learn more about [Azure Private Link](private-link-overview.md)
 