---
title: Connect virtual networks in different subscriptions with service principal names
titleSuffix: Azure Virtual Network
description: Learn how to peer virtual networks in different subscriptions using service principal names.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.topic: how-to 
ms.date: 04/18/2024

#customer intent: As a network administrator, I want to connect virtual networks in different subscriptions using service principal names so that I can allow resources in different subscriptions to communicate with each other.

---
# Connect virtual networks in different subscriptions with service principal names

Scenarios exist where you need to connect virtual networks in different subscriptions without the use of user accounts or guest accounts. In this virtual network how-to, learn how to peer two virtual networks with service principal names (SPNs) in different subscriptions. Virtual network peerings between virtual networks in different subscriptions and Microsoft Entra ID tenants must be peered via Azure CLI or PowerShell. Currently there isn't an option in the Azure portal to peer virtual networks with SPNs in different subscriptions.

## Prerequisites

- An Azure account with two active subscriptions and two Microsoft Entra ID tenants. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Account permissions to create a service principal, assign app permissions, and create resources in the Microsoft Entra ID tenant associated with each subscription.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This how-to article requires version 2.31.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Resources used

| SPN | Resource group | Subscription/Tenant | Virtual network | Location |
| ----- | -------- | ------- | ------- | ----- |
| spn-1-peer-vnet | test-rg-1 | subscription-1 | vnet-1 | East US 2 |
| spn-2-peer-vnet | test-rg-2 | subscription-2 | vnet-2 | West US 2 |

## Create subscription-1 resources

1. Use [az sign-in](/cli/azure/reference-index#az-login) to sign-in to **subscription-1** with a user account with permissions to create a resource group, a virtual network, and an SPN in the Microsoft Entra ID tenant associated with **subscription-1**

    ```azurecli
    az login
    ```

1. Create a resource group with [az group create](/cli/azure/group#az-group-create).

    ```azurecli
    az group create \
        --name test-rg-1 \
        --location eastus2  
    ```

1. Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named **vnet-1** in **subscription-1**.

    ```azurecli
    az network vnet create \
        --resource-group test-rg-1 \
        --location eastus2 \
        --name vnet-1 \
        --address-prefixes 10.0.0.0/16 \
        --subnet-name subnet-1 \
        --subnet-prefixes 10.0.0.0/24
    ```

### Create spn-1-peer-vnet

Create **spn1-peer-vnet** with a scope to the virtual network created in the previous step. This SPN is added to the scope of **vnet-2** in a future step to allow for the virtual network peer.

1. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to place the resource ID of the virtual network you created earlier in a variable for use in the later step.

    ```azurecli
    vnetid=$(az network vnet show \
                --resource-group test-rg-1 \
                --name vnet-1 \
                --query id \
                --output tsv)
     ```

1. Use [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) to create **spn-1-peer-vnet** with a role of **Network Contributor** scoped to the virtual network **vnet-1**.

    ```azurecli
    az ad sp create-for-rbac \
        --name spn-1-peer-vnet \
        --role "Network Contributor" \
        --scope $vnetid
    ```

    Make note of the output of the creation in the step. The password is only displayed here in this output. Copy the password to a place safe for use in the later sign-in steps. 

    ```output
    {
    "appId": "baa9d5f8-c1f9-4e74-b9fa-b5bc551e6cd0",
    "displayName": "spn-1-peer-vnet",
    "password": "",
    "tenant": "c2d26d12-71cc-4f3b-8557-1fa18d077698"    
    }
    ```

1. The appId of the service principal is used in the subsequent steps to finish the configuration of the SPN. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to place the appId of the SPN into a variable for later use.

    ```azurecli
    appid1=$(az ad sp list \
                --display-name spn-1-peer-vnet \
                --query [].appId \
                --output tsv)
    ```

1. The SPN created in the previous step must have a redirect URI to finish the authentication process approval and must be converted to multitenant use. Use [az ad app update](/cli/azure/ad/app##az-ad-app-update) to add **https://www.microsoft.com** as a redirect URI and enable multitenant on **spn-1-peer-vnet**. 

    ```azurecli
    az ad app update \
        --id $appid1 \
        --sign-in-audience AzureADMultipleOrgs \
        --web-redirect-uris https://www.microsoft.com     
    ```

1. The service principal must have **User.Read** permissions to the directory. Use [az ad app permission add](/cli/azure/ad/app#az-ad-app-permission-add) and [az ad app permission grant](/cli/azure/ad/app#az-ad-app-permission-grant) to add the Microsoft Graph permissions of **User.Read** to the service principal.

    ```azurecli
    az ad app permission add \
        --id $appid1 \
        --api 00000003-0000-0000-c000-000000000000 \
        --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope

    az ad app permission grant \
        --id $appid1 \
        --api 00000003-0000-0000-c000-000000000000 \
        --scope User.Read
    ```

## Create subscription-2 resources

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-2** with a user account with permissions to create a resource group, a virtual network, and an SPN in the Microsoft Entra ID tenant associated with **subscription-2**

    ```azurecli
    az login
    ```

1. Create resource group with [az group create](/cli/azure/group#az-group-create).

    ```azurecli
    az group create \
        --name test-rg-2 \
        --location westus2  
    ```

1. Use [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) to create a virtual network named **vnet-2** in **subscription-2**.

    ```azurecli
    az network vnet create \
        --resource-group test-rg-2 \
        --location westus2 \
        --name vnet-2 \
        --address-prefixes 10.1.0.0/16 \
        --subnet-name subnet-1 \
        --subnet-prefixes 10.1.0.0/24
    ```

### Create spn-2-peer-vnet

Create **spn-2-peer-vnet** with a scope to the virtual network created in the previous step. This SPN is added to the scope of **vnet-2** in a future step to allow for the virtual network peer.

1. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to place the resource ID of the virtual network you created earlier in a variable for use in the later step.

    ```azurecli
    vnetid=$(az network vnet show \
                --resource-group test-rg-2 \
                --name vnet-2 \
                --query id \
                --output tsv)
    ```

1. Use [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) to create **spn-2-peer-vnet** with a role of **Network Contributor** scoped to the virtual network **vnet-2**.

    ```azurecli
    az ad sp create-for-rbac \
        --name spn-2-peer-vnet \
        --role "Network Contributor" \
        --scope $vnetid
    ```

    Make note of the output of the creation in the step. Copy the password to a place safe for use in the later sign-in steps. The password isn't displayed again.

    The output looks similar to the following output.

    ```output
    {
    "appId": "19b439a8-614b-4c8e-9e3e-b0c901346362",
    "displayName": "spn-2-peer-vnet",
    "password": "",
    "tenant": "24baaf57-f30d-4fba-a20e-822030f7eba3"
    }    
    ```

1. The appId of the service principal is used in the subsequent steps to finish the configuration of the SPN. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to place the ID of the SPN into a variable for later use.

    ```azurecli
    appid2=$(az ad sp list \
                --display-name spn-2-peer-vnet \
                --query [].appId \
                --output tsv)
    ```

1. The SPN created in the previous step must have a redirect URI to finish the authentication process approval and must be converted to multitenant use. Use [az ad app update](/cli/azure/ad/app##az-ad-app-update) to add **https://www.microsoft.com** as a redirect URI and enable multitenant on **spn-2-peer-vnet**. 

    ```azurecli
    az ad app update \
        --id $appid2 \
        --sign-in-audience AzureADMultipleOrgs \
        --web-redirect-uris https://www.microsoft.com     
    ```

1. The service principal must have **User.Read** permissions to the directory. Use [az ad app permission add](/cli/azure/ad/app#az-ad-app-permission-add) and [az ad app permission grant](/cli/azure/ad/app#az-ad-app-permission-grant)to add the Microsoft Graph permissions of **User.Read** to the service principal.

    ```azurecli
    az ad app permission add \
        --id $appid2 \
        --api 00000003-0000-0000-c000-000000000000 \
        --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope

    az ad app permission grant \
        --id $appid2 \
        --api 00000003-0000-0000-c000-000000000000 \
        --scope User.Read
    ```

## Register spn-2-peer-vnet in subscription-1 and assign permissions to vnet-1

A user account with administrator permissions in the Microsoft Entra ID tenant must complete the process of adding **spn-2-vnet-peer** to **subscription-1**. Once completed, **spn-2-vnet-peer** can be assigned permissions to **vnet-1**. 

### Register spn-2-peer-vnet app in subscription-1

An administrator in the **subscription-1** Microsoft Entra ID tenant must approve the service principal **spn-2-peer-vnet** so that it can be added to the virtual network **vnet-1**. Use the following command to sign-in to **subscription-2** to find the appID of **spn-2-peer-vnet**.

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-2**.

    ```azurecli
    az login
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to obtain the appId of **spn-2-peer-vnet**. Note the appID in the output. This appID is used in the authentication URL in the later steps.

    ```azurecli
    appid2=$(az ad sp list \
                --display-name spn-2-peer-vnet \
                --query [].appId \
                --output tsv)
    echo $appid2
    ```

1. Use the appid for **spn-2-peer-vnet** and the Microsoft Entra ID tenant ID for **subcription-1** to build the sign-in URL for the approval. The URL is built from the following example:

    ```
    https://login.microsoftonline.com/entra-tenant-id-subscription-1/oauth2/authorize?client_id={$appid2}&response_type=code&redirect_uri=https://www.microsoft.com
    ```

    The URL looks similar to the below example.

    ```
    https://login.microsoftonline.com/c2d26d12-71cc-4f3b-8557-1fa18d077698/oauth2/authorize?client_id=19b439a8-614b-4c8e-9e3e-b0c901346362&response_type=code&redirect_uri=https://www.microsoft.com
    ```

1. Open the URL in a web browser and sign-in with an administrator in the Microsoft Entra ID tenant in **subscription-1**.

1. Approve the application **spn-2-peer-vnet**. The microsoft.com homepage displays if the authentication was successful.

### Assign spn-2-peer-vnet to vnet-1

After the administrator approves **spn-2-peer-vnet**, add it to the virtual network **vnet-1** as a **Network Contributor**.

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-1**.

    ```azurecli
    az login
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to find the appId for **spn-2-peer-vnet** and place in a variable for later use.

    ```azurecli
    appid2=$(az ad sp list \
                --display-name spn-2-peer-vnet \
                --query [].appId \
                --output tsv)
    ```

1. Use Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID of **vnet-1** into a variable for use in the later steps.

    ```azurecli
    vnetid=$(az network vnet show \
                --resource-group test-rg-1 \
                --name vnet-1 \
                --query id \
                --output tsv)
    ```

1. Use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) the following command to add **spn-2-peer-vnet** to **vnet-1** as a **Network Contributor**.

    ```azurecli
    az role assignment create --assignee $appid2 \
        --role "Network Contributor" \
        --scope $vnetid
    ```

## Register spn-1-peer-vnet in subscription-2 and assign permissions to vnet-2

A user account with administrator permissions in the Microsoft Entra ID tenant must complete the process of adding **spn-1-peer-vnet** to **subscription-2**. Once completed, **spn-1-peer-vnet** can be assigned permissions to **vnet-2**. 

### Register spn-1-peer-vnet app in subscription-2

An administrator in the **subscription-2** Microsoft Entra ID tenant must approve the service principal **spn-1-peer-vnet** so that it can be added to the virtual network **vnet-2**. Use the following command to sign-in to **subscription-1** to find the appID of **spn-1-peer-vnet**.

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-1**.

    ```azurecli
    az login
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to obtain the appId of **spn-1-peer-vnet**. Note the appID in the output. This appID is used in the authentication URL in the later steps.

    ```azurecli
    appid1=$(az ad sp list \
                --display-name spn-1-peer-vnet \
                --query [].appId \
                --output tsv)
    echo $appid1
    ```

1. Use the appid for **spn-1-peer-vnet** and the Microsoft Entra ID tenant ID for **subscription-2** to build the sign-in URL for the approval. The URL is built from the following example:

    ```
    https://login.microsoftonline.com/entra-tenant-id-subscription-2/oauth2/authorize?client_id={$appid1}&response_type=code&redirect_uri=https://www.microsoft.com
    ```

    The URL looks similar to the below example.

    ```
    https://login.microsoftonline.com/24baaf57-f30d-4fba-a20e-822030f7eba3/oauth2/authorize?client_id=baa9d5f8-c1f9-4e74-b9fa-b5bc551e6cd0&response_type=code&redirect_uri=https://www.microsoft.com
    ```

1. Open the URL in a web browser and sign-in with an administrator in the Microsoft Entra ID tenant in **subscription-2**.

1. Approve the application **spn-1-peer-vnet**. The microsoft.com homepage displays if the authentication was successful.

### Assign spn-1-peer-vnet to vnet-2

Once the administrator approves **spn-1-peer-vnet**, add it to the virtual network **vnet-2** as a **Network Contributor**.

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-2**.

    ```azurecli
    az login
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to find the appId for **spn-1-peer-vnet** and place in a variable for later use.

    ```azurecli
    appid1=$(az ad sp list \
                --display-name spn-1-peer-vnet \
                --query [].appId \
                --output tsv)
    ```

1. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID of **vnet-2** into a variable for use in the later steps.

    ```azurecli
    vnetid=$(az network vnet show \
                --resource-group test-rg-2 \
                --name vnet-2 \
                --query id \
                --output tsv)
    ```

1. Use [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to add **spn-1-peer-vnet** to **vnet-2** as a **Network Contributor**.

    ```azurecli
    az role assignment create --assignee $appid1 \
        --role "Network Contributor" \
        --scope $vnetid
    ```

## Peer vnet-1 to vnet-2 and vnet-2 to vnet-1

To peer **vnet-1** to **vnet-2**, you use the service principal appId and password to sign-in to the Microsoft Entra ID tenant associated with **subscription-1**.

### Obtain the appId of spn-1-peer-vnet and spn-2-peer-vnet

For the purposes of this article, sign-in to each subscription and obtain the appID of each SPN and the resource ID of each virtual network. Use these values to sign-in to each subscription with the SPN in the later steps. These steps aren't required to peer the virtual networks if both sides already have the appID of the SPNs and the resource ID of the virtual networks.

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-1** with a regular user account.

    ```azurecli
    az login
    ```

1. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID of **vnet-1** into a variable for use in the later steps.

    ```azurecli
    vnetid1=$(az network vnet show \
                --resource-group test-rg-1 \
                --name vnet-1 \
                --query id \
                --output tsv)
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to obtain the appId of **spn-1-peer-vnet** and place in a variable for use in the later steps.

    ```azurecli
    appid1=$(az ad sp list \
                --display-name spn-1-peer-vnet \
                --query [].appId \
                --output tsv)
    ```

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-2** with a regular user account.

    ```azurecli
    az login
    ```

1. Use [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) to obtain the resource ID of **vnet-2** into a variable for use in the later steps.

    ```azurecli
    vnetid2=$(az network vnet show \
                --resource-group test-rg-2 \
                --name vnet-2 \
                --query id \
                --output tsv)
    ```

1. Use [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to obtain the appId of **spn-2-peer-vnet** and place in a variable for use in the later steps.

    ```azurecli
    appid2=$(az ad sp list \
                --display-name spn-2-peer-vnet \
                --query [].appId \
                --output tsv)
    echo $appid2
    ```

1. Use [az logout](/cli/azure/reference-index#az-logout) to sign out of the Azure CLI session with the following command. **Don't close the terminal**.

    ```azurecli
    az logout
    ```

### Peer the virtual networks

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-1** with **spn-1-peer-vnet**. You need the tenant ID of the Microsoft Entra ID tenant associated with **subscription-1** to complete the command. The password is shown in the example with a variable placeholder. Replace with the password you noted during the resource creation. Replace the placeholder in `--tenant` with the tenant ID of the Microsoft Entra ID tenant associated with **subscription-1**.

    ```azurecli
    az login \
        --service-principal \
        --username $appid1 \
        --password $password \
        --tenant c2d26d12-71cc-4f3b-8557-1fa18d077698
    ```

1. Use [az login](/cli/azure/reference-index#az-login) to sign-in to **subscription-2** with **spn-2-peer-vnet**. You need the tenant ID of the Microsoft Entra ID tenant associated with **subscription-2** to complete the command. The password is shown in the example with a variable placeholder. Replace with the password you noted during the resource creation. Replace the placeholder in `--tenant` with the tenant ID of the Microsoft Entra ID tenant associated with **subscription-2**.

    ```azurecli
    az login \
        --service-principal \
        --username $appid2 \
        --password $password \
        --tenant 24baaf57-f30d-4fba-a20e-822030f7eba3
    ```

1. Use [az account set](/cli/azure/account#az-account-set) to change the context to **subscription-1**.

    ```azurecli
    az account set --subscription "subscription-1-subscription-id-NOT-ENTRA-TENANT-ID"
    ```

1. Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create the virtual network peering between **vnet-1** and **vnet-2**.

    ```azurecli
    az network vnet peering create \
        --name vnet-1-to-vnet-2 \
        --resource-group test-rg-1 \
        --vnet-name vnet-1 \
        --remote-vnet $vnetid2 \
        --allow-vnet-access
    ```

1. Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to verify the virtual network peering between **vnet-1** and **vnet-2**.

    ```azurecli
    az network vnet peering list \
        --resource-group test-rg-1 \
        --vnet-name vnet-1 \
        --output table
    ```

1. Use [az account set](/cli/azure/account#az-account-set) to change the context to **subscription-2**.

    ```azurecli
    az account set --subscription "subscription-2-subscription-id-NOT-ENTRA-TENANT-ID"
    ```

1. Use [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create) to create the virtual network peering between **vnet-2** and **vnet-1**.

    ```azurecli
    az network vnet peering create \
        --name vnet-2-to-vnet-1 \
        --resource-group test-rg-2 \
        --vnet-name vnet-2 \
        --remote-vnet $vnetid1 \
        --allow-vnet-access
    ```

1. Use [az network vnet peering list](/cli/azure/network/vnet/peering#az-network-vnet-peering-list) to verify the virtual network peering between **vnet-2** and **vnet-1**.

    ```azurecli
    az network vnet peering list \
        --resource-group test-rg-2 \
        --vnet-name vnet-2 \
        --output table
    ```
