---
title: 'Tutorial: Connect to an Azure SQL server using an Azure Private Endpoint - Azure CLI'
description: Use this tutorial to learn how to create an Azure SQL server with a private endpoint using Azure CLI
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
ms.service: private-link
ms.topic: tutorial
ms.date: 11/03/2020
ms.author: allensu
ms.custom: fasttrack-edit, devx-track-azurecli
---
# Tutorial: Connect to an Azure SQL server using an Azure Private Endpoint - Azure CLI

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to communicate with Private Link resources privately.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create a Azure SQL server and private endpoint.
> * Test connectivity to the SQL server private endpoint.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Sign in to the Azure portal and check that your subscription is active by running `az login`.
* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

* Named **CreateSQLEndpointTutorial-rg**. 
* In the **eastus** location.

```azurecli-interactive
az group create \
    --name CreateSQLEndpointTutorial-rg \
    --location eastus
```

## Create a virtual network and bastion host

In this section, you'll create a virtual network, subnet, and bastion host. 

The bastion host will be used to connect securely to the virtual machine for testing the private endpoint.

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create)

* Named **myVNet**.
* Address prefix of **10.0.0.0/16**.
* Subnet named **myBackendSubnet**.
* Subnet prefix of **10.0.0.0/24**.
* In the **CreateSQLEndpointTutorial-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
az network vnet create \
    --resource-group CreateSQLEndpointTutorial-rg\
    --location eastus \
    --name myVNet \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.0.0.0/24
```

Update the subnet to disable private endpoint network policies for the private endpoint with [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update):

```azurecli-interactive
az network vnet subnet update \
    --name myBackendSubnet \
    --resource-group CreateSQLEndpointTutorial-rg \
    --vnet-name myVNet \
    --disable-private-endpoint-network-policies true
```

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CreateSQLEndpointTutorial-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --name myBastionIP \
    --sku Standard
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.0.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreateSQLEndpointTutorial-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.0.1.0/24
```

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a bastion host:

* Named **myBastionHost**.
* In **CreateSQLEndpointTutorial-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create test virtual machine

In this section, you'll create a virtual machine that will be used to test the private endpoint.

Create a VM with [az vm create](/cli/azure/vm#az_vm_create). When prompted, provide a password to be used as the credentials for the VM:

* Named **myVM**.
* In **CreateSQLEndpointTutorial-rg**.
* In network **myVNet**.
* In subnet **myBackendSubnet**.
* Server image **Win2019Datacenter**.

```azurecli-interactive
az vm create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --name myVM \
    --image Win2019Datacenter \
    --public-ip-address "" \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --admin-username azureuser
```

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create an Azure SQL server

In this section, you'll create a SQL server and database.

Use [az sql server create](/cli/azure/sql/server#az_sql_server_create) to create a SQL server:

* Replace **\<sql-server-name>** with your unique server name.
* Replace **\<your-password>** with your password.
* In **CreateSQLEndpointTutorial-rg**.
* In **eastus** region.

```azurecli-interactive
az sql server create \
    --name <sql-server-name> \
    --resource-group CreateSQLEndpointTutorial-rg \
    --location eastus \
    --admin-user sqladmin \
    --admin-password <your-password>
```

Use [az sql db create](/cli/azure/sql/db#az_sql_db_create) to create a database:

* Named **myDataBase**.
* In **CreateSQLEndpointTutorial-rg**.
* Replace **\<sql-server-name>** with your unique server name.

```azurecli-interactive
az sql db create \
    --resource-group CreateSQLEndpointTutorial-rg  \
    --server <sql-server-name> \
    --name myDataBase \
    --sample-name AdventureWorksLT
```

## Create private endpoint

In this section, you'll create the private endpoint.

Use [az sql server list](/cli/azure/sql/server#az_sql_server_list) to place the resource ID of the SQL server into a shell variable.

Use [az network private-endpoint create](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) to create the endpoint and connection:

* Named **myPrivateEndpoint**.
* In resource group **CreateSQLEndpointTutorial-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* Connection named **myConnection**.

```azurecli-interactive
id=$(az sql server list \
    --resource-group CreateSQLEndpointTutorial-rg \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group CreateSQLEndpointTutorial-rg \
    --vnet-name myVNet --subnet myBackendSubnet \
    --private-connection-resource-id $id \
    --group-ids sqlServer \
    --connection-name myConnection  
```

## Configure the private DNS zone

In this section, you'll create and configure the private DNS zone using [az network private-dns zone create](/cli/azure/network/private-dns/zone#az_network_private_dns_zone_create).  

You'll use [az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#az_network_private_dns_link_vnet_create) to create the virtual network link to the dns zone.

You'll create a dns zone group with [az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az_network_private_endpoint_dns_zone_group_create).

* Zone named **privatelink.database.windows.net**
* In virtual network **myVNet**.
* In resource group **CreateSQLEndpointTutorial-rg**.
* DNS link named **myDNSLink**.
* Associated with **myPrivateEndpoint**.
* Zone group named **MyZoneGroup**.

```azurecli-interactive
az network private-dns zone create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --name "privatelink.database.windows.net"

az network private-dns link vnet create \
    --resource-group CreateSQLEndpointTutorial-rg \
    --zone-name "privatelink.database.windows.net" \
    --name MyDNSLink \
    --virtual-network myVNet \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
   --resource-group CreateSQLEndpointTutorial-rg \
   --endpoint-name myPrivateEndpoint \
   --name MyZoneGroup \
   --private-dns-zone "privatelink.database.windows.net" \
   --zone-name sql
```

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the SQL server across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com) 
 
2. Select **Resource groups** in the left-hand navigation pane.

3. Select **CreateSQLEndpointTutorial-rg**.

4. Select **myVM**.

5. On the overview page for **myVM**, select **Connect** then **Bastion**.

6. Select the blue **Use Bastion** button.

7. Enter the username and password that you entered during the virtual machine creation.

8. Open Windows PowerShell on the server after you connect.

9. Enter `nslookup <sqlserver-name>.database.windows.net`. Replace **\<sqlserver-name>** with the name of the SQL server you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mysqlserver8675.privatelink.database.windows.net
    Address:  10.0.0.5
    Aliases:  mysqlserver8675.database.windows.net
    ```

    A private IP address of **10.0.0.5** is returned for the SQL server name.  This address is in the subnet of the virtual network you created previously.


10. Install [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms?preserve-view=true&view=sql-server-2017) on **myVM**.

11. Open **SQL Server Management Studio**.

12. In **Connect to server**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Server type | Select **Database Engine**.|
    | Server name | Enter **\<sql-server-name>.database.windows.net** |
    | Authentication | Select **SQL Server Authentication**. |
    | User name | Enter the username you entered during server creation |
    | Password | Enter the password you entered during server creation |
    | Remember password | Select **Yes**. |

13. Select **Connect**.

14. Browse databases from the left menu.

15. (Optionally) Create or query information from **mysqldatabase**.

16. Close the bastion connection to **myVM**. 

## Clean up resources 

When you're done using the private endpoint, SQL server, and the VM, delete the resource group and all of the resources it contains: 

```azurecli-interactive
az group delete \
    --name CreateSQLEndpointTutorial-rg
```

## Next steps

In this tutorial, you created a:

* Virtual network and bastion host.
* Virtual machine.
* Azure SQL server with private endpoint.

You used the virtual machine to test connectivity securely to the SQL server across the private endpoint.

As a next step, you may also be interested in the **Web app with private connectivity to Azure SQL database** architecture scenario, which connects a web application outside of the virtual network to the private endpoint of a database.
> [!div class="nextstepaction"]
> [Web app with private connectivity to Azure SQL database](/azure/architecture/example-scenario/private-web-app/private-web-app)