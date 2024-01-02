---
title: 'Quickstart: Create a private endpoint - Azure CLI'
description: In this quickstart, you learn how to create a private endpoint using the Azure CLI.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 06/14/2023
ms.author: allensu
ms.custom: mode-api, devx-track-azurecli, template-quickstart
#Customer intent: As someone who has a basic network background but is new to Azure, I want to create a private endpoint by using the Azure CLI.
---

# Quickstart: Create a private endpoint by using the Azure CLI

Get started with Azure Private Link by creating and using a private endpoint to connect securely to an Azure web app.

In this quickstart, create a private endpoint for an Azure App Services web app and then create and deploy a virtual machine (VM) to test the private connection.  

You can create private endpoints for various Azure services, such as Azure SQL and Azure Storage.

:::image type="content" source="./media/create-private-endpoint-portal/private-endpoint-qs-resources.png" alt-text="Diagram of resources created in private endpoint quickstart.":::

## Prerequisites

* An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An Azure web app with a *PremiumV2-tier* or higher app service plan, deployed in your Azure subscription.  

    - For more information and an example, see [Quickstart: Create an ASP.NET Core web app in Azure](../app-service/quickstart-dotnetcore.md). 
    
    - The example webapp in this article is named **webapp-1**. Replace the example with your webapp name.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

First, create a resource group by using **[az group create](/cli/azure/group#az-group-create)**:

```azurecli-interactive
az group create \
    --name test-rg \
    --location eastus2
```

## Create a virtual network and bastion host

A virtual network and subnet is required for to host the private IP address for the private endpoint. You create a bastion host to connect securely to the virtual machine to test the private endpoint. You create the virtual machine in a later section.

>[!NOTE]
>[!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

Create a virtual network with **[az network vnet create](/cli/azure/network/vnet#az-network-vnet-create)**.

```azurecli-interactive
az network vnet create \
    --resource-group test-rg \
    --location eastus2 \
    --name vnet-1 \
    --address-prefixes 10.0.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefixes 10.0.0.0/24
```

Create a bastion subnet with **[az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create)**.

```azurecli-interactive
az network vnet subnet create \
    --resource-group test-rg \
    --name AzureBastionSubnet \
    --vnet-name vnet-1 \
    --address-prefixes 10.0.1.0/26
```

Create a public IP address for the bastion host with **[az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create)**.

```azurecli-interactive
az network public-ip create \
    --resource-group test-rg \
    --name public-ip \
    --sku Standard \
    --zone 1 2 3
```

Create the bastion host with **[az network bastion create](/cli/azure/network/bastion#az-network-bastion-create)**.

```azurecli-interactive
az network bastion create \
    --resource-group test-rg \
    --name bastion \
    --public-ip-address public-ip \
    --vnet-name vnet-1 \
    --location eastus2
```

It can take a few minutes for the Azure Bastion host to deploy.

## Create a private endpoint

An Azure service that supports private endpoints is required to set up the private endpoint and connection to the virtual network. For the examples in this article, use the Azure WebApp from the prerequisites. For more information on the Azure services that support a private endpoint, see [Azure Private Link availability](availability.md).

A private endpoint can have a static or dynamically assigned IP address.

> [!IMPORTANT]
> You must have a previously deployed Azure App Services WebApp to proceed with the steps in this article. For more information, see [Prerequisites](#prerequisites) .

Place the resource ID of the web app that you created earlier into a shell variable with **[az webapp list](/cli/azure/webapp#az-webapp-list)**. Create the private endpoint with **[az network private-endpoint create](/cli/azure/network/private-endpoint#az-network-private-endpoint-create)**.

# [**Dynamic IP**](#tab/dynamic-ip)

```azurecli-interactive
id=$(az webapp list \
    --resource-group test-rg \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --connection-name connection-1 \
    --name private-endpoint \
    --private-connection-resource-id $id \
    --resource-group test-rg \
    --subnet subnet-1 \
    --group-id sites \
    --vnet-name vnet-1    
```

# [**Static IP**](#tab/static-ip)

```azurecli-interactive
id=$(az webapp list \
    --resource-group test-rg \
    --query '[].[id]' \
    --output tsv)

az network private-endpoint create \
    --connection-name connection-1 \
    --name private-endpoint \
    --private-connection-resource-id $id \
    --resource-group test-rg \
    --subnet subnet-1 \
    --group-id sites \
    --ip-config name=ipconfig-1 group-id=sites member-name=sites private-ip-address=10.0.0.10 \
    --vnet-name vnet-1
```

---

## Configure the private DNS zone

A private DNS zone is used to resolve the DNS name of the private endpoint in the virtual network. For this example, we're using the DNS information for an Azure WebApp, for more information on the DNS configuration of private endpoints, see [Azure Private Endpoint DNS configuration](private-endpoint-dns.md)].

Create a new private Azure DNS zone with **[az network private-dns zone create](/cli/azure/network/private-dns/zone#az-network-private-dns-zone-create)**.

```azurecli-interactive
az network private-dns zone create \
    --resource-group test-rg \
    --name "privatelink.azurewebsites.net"
```

Link the DNS zone to the virtual network you created previously with **[az network private-dns link vnet create](/cli/azure/network/private-dns/link/vnet#az-network-private-dns-link-vnet-create)**.

```azurecli-interactive
az network private-dns link vnet create \
    --resource-group test-rg \
    --zone-name "privatelink.azurewebsites.net" \
    --name dns-link \
    --virtual-network vnet-1 \
    --registration-enabled false
```

Create a DNS zone group with **[az network private-endpoint dns-zone-group create](/cli/azure/network/private-endpoint/dns-zone-group#az-network-private-endpoint-dns-zone-group-create)**.

```azurecli-interactive
az network private-endpoint dns-zone-group create \
    --resource-group test-rg \
    --endpoint-name private-endpoint \
    --name zone-group \
    --private-dns-zone "privatelink.azurewebsites.net" \
    --zone-name webapp
```

## Create a test virtual machine

To verify the static IP address and the functionality of the private endpoint, a test virtual machine connected to your virtual network is required.

Create the virtual machine with **[az vm create](/cli/azure/vm#az-vm-create)**.

```azurecli-interactive
az vm create \
    --resource-group test-rg \
    --name vm-1 \
    --image Win2022Datacenter \
    --public-ip-address "" \
    --vnet-name vnet-1 \
    --subnet subnet-1 \
    --admin-username azureuser
```

>[!NOTE]
>Virtual machines in a virtual network with a bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in bastion hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Test connectivity to the private endpoint

Use the virtual machine that you created earlier to connect to the web app across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines**.

1. Select **vm-1**.

1. On the overview page for **vm-1**, select **Connect**, and then select the **Bastion** tab.

1. Select **Use Bastion**.

1. Enter the username and password that you used when you created the VM.

1. Select **Connect**.

1. After you've connected, open PowerShell on the server.

1. Enter `nslookup webapp-1.azurewebsites.net`. You receive a message that's similar to the following example:

    ```output
    Server:  UnKnown
    Address:  168.63.129.16

    Non-authoritative answer:
    Name:    webapp-1.privatelink.azurewebsites.net
    Address:  10.0.0.10
    Aliases:  webapp-1.azurewebsites.net
    ```

    A private IP address of **10.0.0.10** is returned for the web app name if you chose static IP address in the previous steps. This address is in the subnet of the virtual network you created earlier.

1. In the bastion connection to **vm-1**, open the web browser.

1. Enter the URL of your web app, `https://webapp-1.azurewebsites.net`.

   If your web app hasn't been deployed, you get the following default web app page:

    :::image type="content" source="./media/create-private-endpoint-portal/web-app-default-page.png" alt-text="Screenshot of the default web app page on a browser." border="true":::

1. Close the connection to **vm-1**.

## Clean up resources

When no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, private link service, load balancer, and all related resources.

```azurecli-interactive
  az group delete \
    --name test-rg
```

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
