---
title: 'Quickstart: Create a private endpoint by using the Azure CLI'
description: In this quickstart, you'll learn how to create a private endpoint by using the Azure CLI.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 11/07/2020
ms.author: allensu
ms.custom: mode-api, devx-track-azurecli
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using the Azure CLI.
---
# Quickstart: Create a private endpoint by using the Azure CLI

Get started with Azure Private Link by using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for a variety of Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

   To ensure that your subscription is active, sign in to the Azure portal, and then check your version by running `az login`.

* An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    For a detailed tutorial on creating a web app and an endpoint, see [Tutorial: Connect to a web app by using a private endpoint](tutorial-private-endpoint-webapp-portal.md).

* The latest version of the Azure CLI, installed.

   Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the most recent [release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  
   If you don't have the latest version of the Azure CLI, update it by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

First, create a resource group by using [az group create](/cli/azure/group#az-group-create):

```azurecli-interactive
az group create \
    --name CreatePrivateEndpointQS-rg \
    --location eastus
```

## Create a virtual network and bastion host

Next, create a virtual network, subnet, and bastion host. You'll use the bastion host to connect securely to the VM for testing the private endpoint.

1. Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create):

    * Name: **myVNet**
    * Address prefix: **10.0.0.0/16**
    * Subnet name: **myBackendSubnet**
    * Subnet prefix: **10.0.0.0/24**
    * Resource group: **CreatePrivateEndpointQS-rg**
    * Location: **eastus**

    ```azurecli-interactive
    az network vnet create \
        --resource-group CreatePrivateEndpointQS-rg\
        --location eastus \
        --name myVNet \
        --address-prefixes 10.0.0.0/16 \
        --subnet-name myBackendSubnet \
        --subnet-prefixes 10.0.0.0/24
    ```

1. Update the subnet to disable private-endpoint network policies for the private endpoint by using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update):

    ```azurecli-interactive
    az network vnet subnet update \
        --name myBackendSubnet \
        --resource-group CreatePrivateEndpointQS-rg \
        --vnet-name myVNet \
        --disable-private-endpoint-network-policies true
    ```

1. Create a public IP address for the bastion host by using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create):

    * Standard zone-redundant public IP address name: **myBastionIP**
    * Resource group: **CreatePrivateEndpointQS-rg**

    ```azurecli-interactive
    az network public-ip create \
        --resource-group CreatePrivateEndpointQS-rg \
        --name myBastionIP \
        --sku Standard
    ```

1. Create a bastion subnet by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create):

    * Name: **AzureBastionSubnet**
    * Address prefix: **10.0.1.0/24**
    * Virtual network: **myVNet**
    * Resource group: **CreatePrivateEndpointQS-rg**

    ```azurecli-interactive
    az network vnet subnet create \
        --resource-group CreatePrivateEndpointQS-rg \
        --name AzureBastionSubnet \
        --vnet-name myVNet \
        --address-prefixes 10.0.1.0/24
    ```

1. Create a bastion host by using [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create):

    * Name: **myBastionHost**
    * Resource group: **CreatePrivateEndpointQS-rg**
    * Public IP address: **myBastionIP**
    * Virtual network: **myVNet**
    * Location: **eastus**

    ```azurecli-interactive
    az network bastion create \
        --resource-group CreatePrivateEndpointQS-rg \
        --name myBastionHost \
        --public-ip-address myBastionIP \
        --vnet-name myVNet \
        --location eastus
    ```

It can take a few minutes for the Azure Bastion host to deploy.

## Create a test virtual machine

Next, create a VM that you can use to test the private endpoint.

1. Create the VM by using [az vm create](/cli/azure/vm#az-vm-create). 

1. At the prompt, provide a password to be used as the credentials for the VM:

    * Name: **myVM**
    * Resource group: **CreatePrivateEndpointQS-rg**
    * Virtual network: **myVNet**
    * Subnet: **myBackendSubnet**
    * Server image: **Win2019Datacenter**

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

## Create a private endpoint

Next, create the private endpoint.

1. Place the resource ID of the web app that you created earlier into a shell variable by using [az webapp list](/cli/azure/webapp#az-webapp-list).

1. Create the endpoint and connection by using [az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create):

    * Name: **myPrivateEndpoint**
    * Resource group: **CreatePrivateEndpointQS-rg**
    * Virtual network: **myVNet**
    * Subnet: **myBackendSubnet**
    * Connection name: **myConnection**
    * Web app: **\<webapp-resource-group-name>**

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

Next, create and configure the private DNS zone by using [az network private-dns zone create](/cli/azure/network/private-dns/zone#az-network-private-dns-zone-create).  

1. Create the virtual network link to the DNS zone by using [az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create).

1. Create a DNS zone group by using [az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az-network-private-endpoint-dns-zone-group-create).

    * Zone name: **privatelink.azurewebsites.net**
    * Virtual network: **myVNet**
    * Resource group: **CreatePrivateEndpointQS-rg**
    * DNS link name: **myDNSLink**
    * Endpoint name: **myPrivateEndpoint**
    * Zone group name: **MyZoneGroup**

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

## Test connectivity to the private endpoint

Finally, use the VM that you created earlier to connect to the SQL Server instance across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com). 
 
1. On the left pane, select **Resource groups**.

1. Select **CreatePrivateEndpointQS-rg**.

1. Select **myVM**.

1. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

1. Select the blue **Use Bastion** button.

1. Enter the username and password that you used when you created the VM.

1. After you've connected, open PowerShell on the server.

1. Enter `nslookup <your-webapp-name>.azurewebsites.net`, replacing *\<your-webapp-name>* with the name of the web app that you created earlier. You'll receive a message that's similar to the following:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp8675.privatelink.azurewebsites.net
    Address:  10.0.0.5
    Aliases:  mywebapp8675.azurewebsites.net
    ```

    A private IP address of *10.0.0.5* is returned for the web app name. This address is in the subnet of the virtual network that you created earlier.

1. In the bastion connection to *myVM**, open your web browser.

1. Enter the URL of your web app, *https://\<your-webapp-name>.azurewebsites.net*.

   If your web app hasn't been deployed, you'll get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

1. Close the connection to *myVM*.

## Clean up resources 

When you're done using the private endpoint and the VM, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all the resources within it:

```azurecli-interactive
az group delete \
    --name CreatePrivateEndpointQS-rg
```

## What you've learned

In this quickstart, you created:

* A virtual network and bastion host
* A virtual machine
* A private endpoint for an Azure web app

You used the VM to securely test connectivity to the web app across the private endpoint.

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
