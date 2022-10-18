---
title: 'Quickstart: Create a private endpoint by using the Azure CLI'
description: In this quickstart, you'll learn how to create a private endpoint by using the Azure CLI.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 05/24/2022
ms.author: allensu
ms.custom: mode-api, devx-track-azurecli
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using the Azure CLI.
---
# Quickstart: Create a private endpoint by using the Azure CLI

Get started with Azure Private Link by using a private endpoint to connect securely to an Azure web app.

In this quickstart, you'll create a private endpoint for an Azure web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for various Azure services, such as Azure SQL and Azure Storage.

## Prerequisites

* An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

   To ensure that your subscription is active, sign in to the Azure portal, and then check your version by running `az login`.

* An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **myWebApp1979**. Replace the example with your webapp name.

* The latest version of the Azure CLI, installed.

   Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the most recent [release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  
   If you don't have the latest version of the Azure CLI, update it by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

First, create a resource group by using **[az group create](/cli/azure/group#az-group-create)**:

```azurecli-interactive
az group create \
    --name CreatePrivateEndpointQS-rg \
    --location eastus
```

## Create a virtual network and bastion host

A virtual network and subnet is required for to host the private IP address for the private endpoint. You'll create a bastion host to connect securely to the virtual machine to test the private endpoint. You'll create the virtual machine in a later section.

Create a virtual network with **[az network vnet create](/cli/azure/network/vnet#az-network-vnet-create)**.

```azurecli-interactive
az network vnet create \
    --resource-group CreatePrivateEndpointQS-rg \
    --location eastus \
    --name myVNet \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name myBackendSubnet \
    --subnet-prefixes 10.0.0.0/24
```

Create a bastion subnet with **[az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create)**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name AzureBastionSubnet \
    --vnet-name myVNet \
    --address-prefixes 10.0.1.0/27
```

Create a public IP address for the bastion host with **[az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create)**.

```azurecli-interactive
az network public-ip create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name myBastionIP \
    --sku Standard \
    --zone 1 2 3
```

Create the bastion host with **[az network bastion create](/cli/azure/network/bastion#az-network-bastion-create)**.

```azurecli-interactive
az network bastion create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name myBastionHost \
    --public-ip-address myBastionIP \
    --vnet-name myVNet \
    --location eastus
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create a private endpoint

An Azure service that supports private endpoints is required to set up the private endpoint and connection to the virtual network. For the examples in this article, you'll use the Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

A private endpoint can have a static or dynamically assigned IP address.
> [!IMPORTANT]
> You must have a previously deployed Azure WebApp to proceed with the steps in this article. For more information, see [Prerequisites](#prerequisites) .

Place the resource ID of the web app that you created earlier into a shell variable with **[az webapp list](/cli/azure/webapp#az-webapp-list)**. Create the private endpoint with **[az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create)**.

# [**Dynamic IP**](#tab/dynamic-ip)

```azurecli-interactive
id=$(az webapp list \
    --resource-group CreatePrivateEndpointQS-rg \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --connection-name myConnection
    --name myPrivateEndpoint \
    --private-connection-resource-id $id \
    --resource-group CreatePrivateEndpointQS-rg \
    --subnet myBackendSubnet \
    --group-id sites \
    --vnet-name myVNet    
```

# [**Static IP**](#tab/static-ip)

 ```azurecli-interactive
id=$(az webapp list \
    --resource-group CreatePrivateEndpointQS-rg \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --connection-name myConnection \
    --name myPrivateEndpoint \
    --private-connection-resource-id $id \
    --resource-group CreatePrivateEndpointQS-rg \
    --subnet myBackendSubnet \
    --group-id sites \
    --ip-config name=myIPconfig group-id=sites member-name=sites private-ip-address=10.0.0.10 \
    --vnet-name myVNet
```

---

## Configure the private DNS zone

A private DNS zone is used to resolve the DNS name of the private endpoint in the virtual network. For this example, we're using the DNS information for an Azure WebApp, for more information on the DNS configuration of private endpoints, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md)].

Create a new private Azure DNS zone with **[az network private-dns zone create](/cli/azure/network/private-dns/zone#az-network-private-dns-zone-create)**.

```azurecli-interactive
az network private-dns zone create \
    --resource-group CreatePrivateEndpointQS-rg \
    --name "privatelink.azurewebsites.net"
```

Link the DNS zone to the virtual network you created previously with **[az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create)**.

```azurecli-interactive
az network private-dns link vnet create \
    --resource-group CreatePrivateEndpointQS-rg \
    --zone-name "privatelink.azurewebsites.net" \
    --name MyDNSLink \
    --virtual-network myVNet \
    --registration-enabled false
```

Create a DNS zone group with **[az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az-network-private-endpoint-dns-zone-group-create)**.

```azurecli-interactive
az network private-endpoint dns-zone-group create \
    --resource-group CreatePrivateEndpointQS-rg \
    --endpoint-name myPrivateEndpoint \
    --name MyZoneGroup \
    --private-dns-zone "privatelink.azurewebsites.net" \
    --zone-name webapp
```

## Create a test virtual machine

To verify the static IP address and the functionality of the private endpoint, a test virtual machine connected to your virtual network is required.

Create the virtual machine with **[az vm create](/cli/azure/vm#az-vm-create)**.

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

## Test connectivity with the private endpoint

Use the VM you created in the previous step to connect to the webapp across the private endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com). 
 
2. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

3. Select **myVM**.

4. On the overview page for **myVM**, select **Connect**, and then select **Bastion**.

5. Enter the username and password that you used when you created the VM. Select **Connect**.

6. After you've connected, open PowerShell on the server.

7. Enter `nslookup mywebapp1979.azurewebsites.net`. Replace **mywebapp1979** with the name of the web app that you created earlier. You'll receive a message that's similar to the following example:

    ```powershell
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    mywebapp1979.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  mywebapp1979.azurewebsites.net
    ```

8. In the bastion connection to **myVM**, open the web browser.

9. Enter the URL of your web app, ``https://mywebapp1979.azurewebsites.net``.

   If your web app hasn't been deployed, you'll get the following default web app page:

   :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

10. Close the connection to **myVM**.

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
