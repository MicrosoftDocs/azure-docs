---
title: Private Link - Azure CLI - Azure Database for PostgreSQL - Single server
description: Learn how to configure private link for Azure Database for PostgreSQL- Single server from Azure CLI
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 01/09/2020
---

# Create and manage Private Link for Azure Database for PostgreSQL - Single server using CLI

A Private Endpoint is the fundamental building block for private link in Azure. It enables Azure resources, like Virtual Machines (VMs), to communicate privately with private link resources. In this article, you will learn how to use the Azure CLI to create a VM in an Azure Virtual Network and an Azure Database for PostgreSQL Single server with an Azure private endpoint.

> [!NOTE]
> This feature is available in all Azure regions where Azure Database for PostgreSQL - Single server supports General Purpose and Memory Optimized pricing tiers.

## Prerequisites

To step through this how-to guide, you need:

- An [Azure Database for PostgreSQL server and database](quickstart-create-server-database-azure-cli.md).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.28 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

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
Azure deploys resources to a subnet within a virtual network, so you need to create or update the subnet to disable private endpoint [network policies](../private-link/disable-private-endpoint-network-policy.md). Update a subnet configuration named *mySubnet* with [az network vnet subnet update](https://docs.microsoft.com/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update):

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

## Create an Azure Database for PostgreSQL - Single server 
Create a Azure Database for PostgreSQL with the az postgres server create command. Remember that the name of your PostgreSQL Server must be unique across Azure, so replace the placeholder value in brackets with your own unique value: 

```azurecli-interactive
# Create a server in the resource group 
az postgres server create \
--name mydemoserver \
--resource-group myresourcegroup \
--location westeurope \
--admin-user mylogin \
--admin-password <server_admin_password> \
--sku-name GP_Gen5_2
```

## Create the Private Endpoint 
Create a private endpoint for the PostgreSQL server in your Virtual Network: 

```azurecli-interactive
az network private-endpoint create \  
    --name myPrivateEndpoint \  
    --resource-group myResourceGroup \  
    --vnet-name myVirtualNetwork  \  
    --subnet mySubnet \  
    --private-connection-resource-id $(az resource show -g myResourcegroup -n mydemoserver --resource-type "Microsoft.DBforPostgreSQL/servers" --query "id") \    
    --group-id postgresqlServer \  
    --connection-name myConnection  
 ```

## Configure the Private DNS Zone 
Create a Private DNS Zone for PostgreSQL server domain and create an association link with the Virtual Network. 
```azurecli-interactive
az network private-dns zone create --resource-group myResourceGroup \ 
   --name  "privatelink.postgres.database.azure.com" 
az network private-dns link vnet create --resource-group myResourceGroup \ 
   --zone-name  "privatelink.postgres.database.azure.com"\ 
   --name MyDNSLink \ 
   --virtual-network myVirtualNetwork \ 
   --registration-enabled false 

#Query for the network interface ID  
networkInterfaceId=$(az network private-endpoint show --name myPrivateEndpoint --resource-group myResourceGroup --query 'networkInterfaces[0].id' -o tsv)
 
 
az resource show --ids $networkInterfaceId --api-version 2019-04-01 -o json 
# Copy the content for privateIPAddress and FQDN matching the Azure database for PostgreSQL name 
 
 
#Create DNS records 
az network private-dns record-set a create --name myserver --zone-name privatelink.postgres.database.azure.com --resource-group myResourceGroup  
az network private-dns record-set a add-record --record-set-name myserver --zone-name privatelink.postgres.database.azure.com --resource-group myResourceGroup -a <Private IP Address>
```

> [!NOTE] 
> The FQDN in the customer DNS setting does not resolve to the private IP configured. You will have to setup a DNS zone for the configured FQDN as shown [here](../dns/dns-operations-recordsets-portal.md).

> [!NOTE]
> In some cases the Azure Database for PostgreSQL and the VNet-subnet are in different subscriptions. In these cases you must ensure the following configurations:
> - Make sure that both the subscription has the **Microsoft.DBforPostgreSQL** resource provider registered. For more information refer [resource-manager-registration][resource-manager-portal]

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

## Access the PostgreSQL server privately from the VM

1. In the Remote Desktop of *myVM*, open PowerShell.

2. Enter  `nslookup mydemopostgresserver.privatelink.postgres.database.azure.com`. 

    You'll receive a message similar to this:
    ```azurepowershell
    Server:  UnKnown
    Address:  168.63.129.16
    Non-authoritative answer:
    Name:    mydemopostgresserver.privatelink.postgres.database.azure.com
    Address:  10.1.3.4
    ```

3. Test the private link connection for the PostgreSQL server using any available client. In the example below I have used [Azure Data studio](https://docs.microsoft.com/sql/azure-data-studio/download?view=sql-server-ver15) to do the operation.

4. In **New connection**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Server type| Select **PostgreSQL**.|
    | Server name| Select *mydemopostgresserver.privatelink.postgres.database.azure.com* |
    | User name | Enter username as username@servername which is provided during the PostgreSQL server creation. |
    |Password |Enter a password provided during the PostgreSQL server creation. |
    |SSL|Select **Required**.|
    ||

5. Select Connect.

6. Browse databases from left menu.

7. (Optionally) Create or query information from the postgreSQL server.

8. Close the remote desktop connection to myVm.

## Clean up resources 
When no longer needed, you can use az group delete to remove the resource group and all the resources it has: 

```azurecli-interactive
az group delete --name myResourceGroup --yes 
```

## Next steps
- Learn more about [What is Azure private endpoint](https://docs.microsoft.com/azure/private-link/private-endpoint-overview)

<!-- Link references, to text, Within this same GitHub repo. -->
[resource-manager-portal]: ../azure-resource-manager/management/resource-providers-and-types.md