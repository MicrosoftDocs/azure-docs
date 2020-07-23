---
title: 'Quickstart - Create an Azure private endpoint using Azure CLI'
description: Learn about Azure private endpoint in this Quickstart
services: private-link
author: malopMSFT
ms.service: private-link
ms.topic: quickstart
ms.date: 09/16/2019
ms.author: allensu

---
# Quickstart: Create a private endpoint using Azure CLI

Private Endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate privately with Private Link Resources. In this Quickstart, you will learn how to create a VM on a virtual network, a server in SQL Database with a Private Endpoint using Azure CLI. Then, you can access the VM to and securely access the private link resource (a private server in SQL Database in this example).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.28 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

## Create a resource group

Before you can create any resource, you have to create a resource group to host the Virtual Network. Create a resource group with [az group create](/cli/azure/group). This example creates a resource group named *myResourceGroup* in the *westcentralus* location:

```azurecli-interactive
az group create --name myResourceGroup --location westcentralus
```

## Create a Virtual Network

Create a Virtual Network with [az network vnet create](/cli/azure/network/vnet). This example creates a default Virtual Network named *myVirtualNetwork* with one subnet named *mySubnet*:

```azurecli-interactive
az network vnet create \
 --name myVirtualNetwork \
 --resource-group myResourceGroup \
 --subnet-name mySubnet
```

## Disable subnet private endpoint policies

Azure deploys resources to a subnet within a virtual network, so you need to create or update the subnet to disable private endpoint network policies. Update a subnet configuration named *mySubnet* with [az network vnet subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update):

```azurecli-interactive
az network vnet subnet update \
 --name mySubnet \
 --resource-group myResourceGroup \
 --vnet-name myVirtualNetwork \
 --disable-private-endpoint-network-policies true
```

## Create the VM

Create a VM with az vm create. When prompted, provide a password to be used as the sign-in credentials for the VM. This example creates a VM named *myVm*:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm \
  --image Win2019Datacenter
```

Make a note of the public IP address of the VM. You will use this address to connect to the VM from the internet in the next step.

## Create a server in SQL Database

Create a server in SQL Database with the az sql server create command. Remember that the name of your server must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurecli-interactive
# Create a server in the resource group
az sql server create \
    --name "myserver"\
    --resource-group myResourceGroup \
    --location WestUS \
    --admin-user "sqladmin" \
    --admin-password "CHANGE_PASSWORD_1"

# Create a database in the server with zone redundancy as false
az sql db create \
    --resource-group myResourceGroup  \
    --server myserver \
    --name mySampleDatabase \
    --sample-name AdventureWorksLT \
    --edition GeneralPurpose \
    --family Gen4 \
    --capacity 1
```

The server ID is similar to ```/subscriptions/subscriptionId/resourceGroups/myResourceGroup/providers/Microsoft.Sql/servers/myserver.```
You will use the server ID in the next step.

## Create the Private Endpoint

Create a private endpoint for the logical SQL server in your Virtual Network:

```azurecli-interactive
az network private-endpoint create \  
    --name myPrivateEndpoint \  
    --resource-group myResourceGroup \  
    --vnet-name myVirtualNetwork  \  
    --subnet mySubnet \  
    --private-connection-resource-id "<server ID>" \  
    --group-ids sqlServer \  
    --connection-name myConnection  
 ```

## Configure the Private DNS Zone

Create a Private DNS Zone for SQL Database domain, create an association link with the Virtual Network
and create a DNS Zone Group to associate the private endpoint with the Private DNS Zone. 

```azurecli-interactive
az network private-dns zone create --resource-group myResourceGroup \
   --name  "privatelink.database.windows.net"
az network private-dns link vnet create --resource-group myResourceGroup \
   --zone-name  "privatelink.database.windows.net"\
   --name MyDNSLink \
   --virtual-network myVirtualNetwork \
   --registration-enabled false
az network private-endpoint dns-zone-group create \
   --resource-group myResourceGroup \
   --endpoint-name myPrivateEndpoint \
   --name MyZoneGroup \
   --private-dns-zone "privatelink.database.windows.net" \
   --zone-name sql
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

## Access SQL Database privately from the VM

In this section, you will connect to the SQL Database from the VM using the Private Endpoint.

1. In the Remote Desktop of *myVM*, open PowerShell.
2. Enter nslookup myserver.database.windows.net

   You'll receive a message similar to this:

    ```
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    myserver.privatelink.database.windows.net
    Address:  10.0.0.5
    Aliases:  myserver.database.windows.net
    ```

3. Install SQL Server Management Studio
4. In Connect to server, enter or select this information:

   - Server type: Select Database Engine.
   - Server name: Select myserver.database.windows.net
   - Username: Enter a username provided during creation.
   - Password: Enter a password provided during creation.
   - Remember password: Select Yes.

5. Select **Connect**.
6. Browse **Databases** from left menu.
7. (Optionally) Create or query information from *mydatabase*
8. Close the remote desktop connection to *myVm*.

## Clean up resources

When no longer needed, you can use az group delete to remove the resource group and all the resources it has:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

Learn more about [Azure Private Link](private-link-overview.md)
