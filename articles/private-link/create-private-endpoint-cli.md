---
title: 'Quickstart - Create an Azure Private Endpoint using Azure CLI'
description: Use this quickstart to learn how to create a Private Endpoint using Azure CLI.
services: private-link
author: asudbring
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create an Azure private endpoint
ms.service: private-link
ms.topic: quickstart
ms.date: 11/07/2020
ms.author: allensu

---
# Quickstart: Create a Private Endpoint using Azure CLI

Get started with Azure Private Link by using a Private Endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and deploy a virtual machine to test the private connection.  

Private endpoints can be created for different kinds of Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Web App with a **PremiumV2-tier** or higher app service plan deployed in your Azure subscription.  
    * For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    * For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app using an Azure Private Endpoint](tutorial-private-endpoint-webapp-portal.md).
* Sign in to the Azure portal and check that your subscription is active by running `az login`.
* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az_group_create):

* Named **CreatePrivateEndpointQS-rg**. 
* In the **eastus** location.

```azurecli-interactive
az group create \
    --name CreatePrivateEndpointQS-rg \
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
* In the **CreatePrivateEndpointQS-rg** resource group.
* Location of **eastus**.

```azurecli-interactive
az network vnet create \
    --resource-group CreatePrivateEndpointQS-rg\
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
    --resource-group CreatePrivateEndpointQS-rg \
    --vnet-name myVNet \
    --disable-private-endpoint-network-policies true
```

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public ip address for the bastion host:

* Create a standard zone redundant public IP address named **myBastionIP**.
* In **CreatePrivateEndpointQS-rg**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name myBastionIP \
    --sku Standard
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create a bastion subnet:

* Named **AzureBastionSubnet**.
* Address prefix of **10.0.1.0/24**.
* In virtual network **myVNet**.
* In resource group **CreatePrivateEndpointQS-rg**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.0.1.0/24
```

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create a bastion host:

* Named **myBastionHost**.
* In **CreatePrivateEndpointQS-rg**.
* Associated with public IP **myBastionIP**.
* Associated with virtual network **myVNet**.
* In **eastus** location.

```azurecli-interactive
az network bastion create \
    --resource-group CreatePrivateEndpointQS-rg \
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
* In **CreatePrivateEndpointQS-rg**.
* In network **myVNet**.
* In subnet **myBackendSubnet**.
* Server image **Win2019Datacenter**.

```azurecli-interactive
az vm create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name myVM \
    --image Win2019Datacenter \
    --public-ip-address "" \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --admin-username azureuser
```

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Create private endpoint

In this section, you'll create the private endpoint.

Use [az webapp list](/cli/azure/webapp#az_webapp_list) to place the resource ID of the Web app you previously created into a shell variable.

Use [az network private-endpoint create](/cli/azure/network/private-endpoint#az_network_private_endpoint_create) to create the endpoint and connection:

* Named **myPrivateEndpoint**.
* In resource group **CreatePrivateEndpointQS-rg**.
* In virtual network **myVNet**.
* In subnet **myBackendSubnet**.
* Connection named **myConnection**.
* Your webapp **\<webapp-resource-group-name>**.

```azurecli-interactive
id=$(az webapp list \
    --resource-group <webapp-resource-group-name> \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group CreatePrivateEndpointQS-rg \
    --vnet-name myVNet --subnet myBackendSubnet \
    --private-connection-resource-id $id \
    --group-id sites \
    --connection-name myConnection  
```

## Configure the private DNS zone

In this section, you'll create and configure the private DNS zone using [az network private-dns zone create](/cli/azure/network/private-dns/zone#ext_privatedns_az_network_private_dns_zone_create).  

You'll use [az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#ext_privatedns_az_network_private_dns_link_vnet_create) to create the virtual network link to the dns zone.

You'll create a dns zone group with [az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az_network_private_endpoint_dns_zone_group_create).

* Zone named **privatelink.azurewebsites.net**
* In virtual network **myVNet**.
* In resource group **CreatePrivateEndpointQS-rg**.
* DNS link named **myDNSLink**.
* Associated with **myPrivateEndpoint**.
* Zone group named **MyZoneGroup**.

```azurecli-interactive
az network private-dns zone create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name "privatelink.azurewebsites.net"

az network private-dns link vnet create \
    --resource-group CreatePrivateEndpointQS-rg \
    --zone-name "privatelink.azurewebsites.net" \
    --name MyDNSLink \
    --virtual-network myVNet \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
   --resource-group CreatePrivateEndpointQS-rg \
   --endpoint-name myPrivateEndpoint \
   --name MyZoneGroup \
   --private-dns-zone "privatelink.azurewebsites.net" \
   --zone-name webapp
```

## Test connectivity to private endpoint

In this section, you'll use the virtual machine you created in the previous step to connect to the SQL server across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com) 
 
2. Select **Resource groups** in the left-hand navigation pane.

3. Select **CreatePrivateEndpointQS-rg**.

4. Select **myVM**.

5. On the overview page for **myVM**, select **Connect** then **Bastion**.

6. Select the blue **Use Bastion** button.

7. Enter the username and password that you entered during the virtual machine creation.

8. Open Windows PowerShell on the server after you connect.

9. Enter `nslookup <your-webapp-name>.azurewebsites.net`. Replace **\<your-webapp-name>** with the name of the web app you created in the previous steps.  You'll receive a message similar to what is displayed below:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.0.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of **10.0.0.5** is returned for the web app name.  This address is in the subnet of the virtual network you created previously.

10. In the bastion connection to **myVM**, open Internet Explorer.

11. Enter the url of your web app, **https://\<your-webapp-name>.azurewebsites.net**.

12. You'll receive the default web app page if your application hasn't been deployed:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Default web app page." border="true":::

13. Close the connection to **myVM**.

## Clean up resources 
When you're done using the private endpoint and the VM, use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group and all the resources it has:

```azurecli-interactive
az group delete \
    --name CreatePrivateEndpointQS-rg
```

## Next steps

In this quickstart, you created a:

* Virtual network and bastion host.
* Virtual machine.
* Private endpoint for an Azure Web App.

You used the virtual machine to test connectivity securely to the web app across the private endpoint.

For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)
