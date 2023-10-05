---
title: Private Link - Azure CLI - Azure Database for MariaDB
description: Learn how to configure private link for Azure Database for MariaDB from Azure CLI
ms.service: mariadb
author: mksuni
ms.author: sumuth
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 06/24/2022
---

# Create and manage Private Link for Azure Database for MariaDB using CLI

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

A Private Endpoint is the fundamental building block for private link in Azure. It enables Azure resources, like Virtual Machines (VMs), to communicate privately with private link resources. In this article, you will learn how to use the Azure CLI to create a VM in an Azure Virtual Network and an Azure Database for MariaDB server with an Azure private endpoint.

> [!NOTE]
> The private link feature is only available for Azure Database for MariaDB servers in the General Purpose or Memory Optimized pricing tiers. Ensure the database server is in one of these pricing tiers.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- You need an [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-cli.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Before you can create any resource, you have to create a resource group to host the Virtual Network. Create a resource group with [az group create](/cli/azure/group). This example creates a resource group named *myResourceGroup* in the *westeurope* location:

```azurecli-interactive
az group create --name myResourceGroup --location westeurope
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

Azure deploys resources to a subnet within a virtual network, so you need to create or update the subnet to disable private endpoint [network policies](../private-link/disable-private-endpoint-network-policy.md). Update a subnet configuration named *mySubnet* with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update):

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
Note the public IP address of the VM. You will use this address to connect to the VM from the internet in the next step.

## Create an Azure Database for MariaDB server 

Create a Azure Database for MariaDB with the az mariadb server create command. Remember that the name of your MariaDB Server must be unique across Azure, so replace the placeholder value in brackets with your own unique value:

```azurecli-interactive
# Create a server in the resource group 

az mariadb server create \
--name mydemoserver \
--resource-group myResourcegroup \
--location westeurope \
--admin-user mylogin \
--admin-password <server_admin_password> \
--sku-name GP_Gen5_2
```

> [!NOTE]
> In some cases the Azure Database for MariaDB and the VNet-subnet are in different subscriptions. In these cases you must ensure the following configurations:
> - Make sure that both the subscription has the **Microsoft.DBforMariaDB** resource provider registered. For more information refer [resource-manager-registration][resource-manager-portal]

## Create the Private Endpoint 

Create a private endpoint for the MariaDB server in your Virtual Network:

```azurecli-interactive
az network private-endpoint create \  
    --name myPrivateEndpoint \  
    --resource-group myResourceGroup \  
    --vnet-name myVirtualNetwork  \  
    --subnet mySubnet \  
    --private-connection-resource-id $(az resource show -g myResourcegroup -n mydemoserver --resource-type "Microsoft.DBforMariaDB/servers" --query "id" -o tsv) \    
    --group-id mariadbServer \  
    --connection-name myConnection  
```

## Configure the Private DNS Zone 

Create a Private DNS Zone for MariDB server domain and create an association link with the Virtual Network.

```azurecli-interactive
az network private-dns zone create --resource-group myResourceGroup \ 
   --name  "privatelink.mariadb.database.azure.com" 
az network private-dns link vnet create --resource-group myResourceGroup \ 
   --zone-name  "privatelink.mariadb.database.azure.com"\ 
   --name MyDNSLink \ 
   --virtual-network myVirtualNetwork \ 
   --registration-enabled false

#Query for the network interface ID  

networkInterfaceId=$(az network private-endpoint show --name myPrivateEndpoint --resource-group myResourceGroup --query 'networkInterfaces[0].id' -o tsv)

az resource show --ids $networkInterfaceId --api-version 2019-04-01 -o json
# Copy the content for privateIPAddress and FQDN matching the Azure database for MariaDB name

#Create DNS records 

az network private-dns record-set a create --name mydemoserver --zone-name privatelink.mariadb.database.azure.com --resource-group myResourceGroup  
az network private-dns record-set a add-record --record-set-name mydemoserver --zone-name privatelink.mariadb.database.azure.com --resource-group myResourceGroup -a <Private IP Address>
```

> [!NOTE] 
> The FQDN in the customer DNS setting does not resolve to the private IP configured. You will have to setup a DNS zone for the configured FQDN as shown [here](../dns/dns-operations-recordsets-portal.md).

## Connect to a VM from the internet

Connect to the VM *myVm* from the internet as follows:

1. In the portal's search bar, enter *myVm*.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the *downloaded.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

        > [!NOTE]
        > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

1. Once the VM desktop appears, minimize it to go back to your local desktop.

## Access the MariaDB server privately from the VM

1. In the Remote Desktop of *myVM*, open PowerShell.

2. Enter  `nslookup mydemoserver.privatelink.mariadb.database.azure.com`.

    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mydemoserver.privatelink.mariadb.database.azure.com
    Address:  10.1.3.4
    ```

3. Test the private link connection for the MariaDB server using any available client. In the example below I have used [MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html) to do the operation.

4. In **New connection**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Connection Name| Select the connection name of your choice.|
    | Hostname | Select *mydemoserver.privatelink.mariadb.database.azure.com* |
    | Username | Enter username as *username@servername* which is provided during the MariaDB server creation. |
    | Password | Enter a password provided during the MariaDB server creation. |

5. Select **Test Connection** or **OK**.

6. (Optionally) Browse databases from left menu and Create or query information from the MariaDB database

8. Close the remote desktop connection to myVm.

## Clean up resources 

When no longer needed, you can use az group delete to remove the resource group and all the resources it has:

```azurecli-interactive
az group delete --name myResourceGroup --yes 
```

## Next steps

Learn more about [What is Azure private endpoint](../private-link/private-endpoint-overview.md)

<!-- Link references, to text, Within this same GitHub repo. -->
[resource-manager-portal]: ../azure-resource-manager/management/resource-providers-and-types.md
