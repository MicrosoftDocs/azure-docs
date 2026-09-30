---
title: Configure a standard service endpoint - Azure CLI
titleSuffix: Azure Private Link
description: Learn how to configure a standard service endpoint using the Azure CLI with network security perimeter and network identifiers.
author: asudbring
ms.author: allensu
ms.service: azure-private-link
ms.topic: how-to
ms.date: 07/08/2026
---

# Configure a standard service endpoint using the Azure CLI

This article walks you through configuring a [standard service endpoint](service-endpoint-standard-overview.md) using the Azure CLI. You create a public IP address as a network identifier, associate it with service endpoints on a subnet, configure a network security perimeter, and validate connectivity.

> [!IMPORTANT]
> Standard service endpoint is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- **Network Contributor** role or higher on the subscription. Specifically, you need the `Microsoft.Network/publicIPAddresses/joinServiceEndpointNetworkIdentifier/action` permission. For more information, see [network security perimeter role-based access control requirements](network-security-perimeter-role-based-access-control-requirements.md).

- Standard service endpoint is currently behind a feature flag. Before you configure it, register the **AllowServiceEndpointNetworkIdentifier** feature in your subscription by using these self-serve commands:

    ```azurecli-interactive
    az feature register \
        --namespace Microsoft.Network \
        --name AllowServiceEndpointNetworkIdentifier
    ```

    Verify the registration status:

    ```azurecli-interactive
    az feature show \
        --namespace Microsoft.Network \
        --name AllowServiceEndpointNetworkIdentifier \
        --query "properties.state" \
        --output tsv
    ```

    Wait for the state to show **Registered**, then refresh the resource provider registration:

    ```azurecli-interactive
    az provider register --namespace Microsoft.Network
    ```

- Azure CLI version 2.x or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create).

```azurecli-interactive
az group create \
  --name test-rg \
  --location eastus2
```

## Create a virtual network

Create a virtual network and subnet with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create).

```azurecli-interactive
az network vnet create \
  --resource-group test-rg \
  --name vnet-1 \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-1 \
  --subnet-prefix 10.0.0.0/24 \
  --location eastus2
```

## Create a NAT gateway

Create a NAT gateway v2 and associate it with **subnet-1** to provide outbound internet connectivity for the virtual machine.

1. Create a public IP address for the NAT gateway with [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

    ```azurecli-interactive
    az network public-ip create \
      --resource-group test-rg \
      --name public-ip-nat \
      --sku Standard \
      --allocation-method Static \
      --location eastus2
    ```

1. Create a NAT gateway with [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create).

    ```azurecli-interactive
    az network nat gateway create \
      --resource-group test-rg \
      --name nat-gateway \
      --location eastus2 \
      --public-ip-addresses public-ip-nat \
      --idle-timeout 4  
    ```

1. Associate the NAT gateway with **subnet-1** by using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

    ```azurecli-interactive
    az network vnet subnet update \
      --resource-group test-rg \
      --vnet-name vnet-1 \
      --name subnet-1 \
      --nat-gateway nat-gateway
    ```

## Deploy Azure Bastion

Azure Bastion uses your browser to connect to VMs in your virtual network over secure shell (SSH) or remote desktop protocol (RDP) by using their private IP addresses. The VMs don't need public IP addresses, client software, or special configuration. For more information about Azure Bastion, see [Azure Bastion](/azure/bastion/bastion-overview).

>[!NOTE]
>[!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

Create an Azure Bastion host with [az network bastion create](/cli/azure/network/bastion#az-network-bastion-create).

```azurecli-interactive
az network bastion create \
  --name bastion \
  --resource-group test-rg \
  --vnet-name vnet-1 \
  --location eastus2 \
  --sku Basic
```

## Create a virtual machine

Create a VM named **vm-1** in the virtual network. The virtual machine is used to validate connectivity after configuration.

Create a virtual machine with [az vm create](/cli/azure/vm#az-vm-create).

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-1 \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-1 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-address "" \
  --nsg nsg-1
```

> [!NOTE]
> Virtual machines in a virtual network with an Azure Bastion host don't need public IP addresses. Bastion provides the public IP, and the VMs use private IPs to communicate within the network. You can remove the public IPs from any VMs in Bastion-hosted virtual networks. For more information, see [Dissociate a public IP address from an Azure VM](../virtual-network/ip-services/remove-public-ip-address-vm.md).

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Install tools on the virtual machine

Install **cifs-utils** and **Azure CLI** on the virtual machine by running a shell script with [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke).

```azurecli-interactive
az vm run-command invoke \
  --resource-group test-rg \
  --name vm-1 \
  --command-id RunShellScript \
  --scripts "sudo apt-get update && sudo apt-get install -y cifs-utils && curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
```

## Create a storage account

Create an Azure storage account with a file share to use as the PaaS resource for testing connectivity through the service endpoint.

1. Create a storage account with [az storage account create](/cli/azure/storage/account#az-storage-account-create). Replace `<storage-account-name>` with a globally unique name.

    ```azurecli-interactive
    az storage account create \
      --name <storage-account-name> \
      --resource-group test-rg \
      --location eastus2 \
      --sku Standard_LRS \
      --kind StorageV2
    ```

1. Create a file share with [az storage share-rm create](/cli/azure/storage/share-rm#az-storage-share-rm-create).

    ```azurecli-interactive
    az storage share-rm create \
      --resource-group test-rg \
      --storage-account <storage-account-name> \
      --name fileshare-1
    ```

## Create a public IP prefix

Create a public IP prefix and a public IP address instance to use as a network identifier.

1. Create a public IP prefix with [az network public-ip prefix create](/cli/azure/network/public-ip/prefix#az-network-public-ip-prefix-create).

    ```azurecli-interactive
    az network public-ip prefix create \
      --resource-group test-rg \
      --name public-ip-prefix \
      --length 31 \
      --location eastus2
    ```

1. Create a public IP address from the prefix with [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create).

    ```azurecli-interactive
    az network public-ip create \
      --resource-group test-rg \
      --name public-ip-1 \
      --public-ip-prefix public-ip-prefix \
      --sku Standard \
      --allocation-method Static
    ```

## Configure service endpoints with a network identifier

This step is the key configuration for a standard service endpoint. You associate a public IP address as a network identifier with service endpoints on a subnet.

A network identifier is a public IP address that you assign to your service endpoint. The public IP isn't used for network routing decisions. When you create a public IP address within your subscription, it's automatically assigned from your service's designated IP pool. Services inside the network security perimeter use this public IP address to recognize service endpoint traffic and configure appropriate access rules.

> [!NOTE]
> The public IP address used as the network identifier must meet all of the following requirements: Standard SKU, Static allocation method, IPv4, in Succeeded provisioning state, and must already exist before associating it with a service endpoint. NRP rejects the IP if any of these conditions aren't met.

Update the subnet to add a service endpoint with the public IP address as the network identifier using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update).

```azurecli-interactive
az network vnet subnet update \
  --resource-group test-rg \
  --vnet-name vnet-1 \
  --name subnet-1 \
  --add serviceEndpoints '{"service":"Microsoft.Storage","networkIdentifier":{"id":"/subscriptions/<subscription-id>/resourceGroups/test-rg/providers/Microsoft.Network/publicIPAddresses/public-ip-1"}}'
```

> [!NOTE]
> Replace `<subscription-id>` with your Azure subscription ID. You can find your subscription ID by running `az account show --query id --output tsv`.
>
> The same public IP address can be assigned to all subnets in a region within a subscription. The network identifier is supported across subscriptions during the public preview.

## Create a network security perimeter

Create a network security perimeter and associate your PaaS resources with it.

1. Create a network security perimeter with [az network perimeter create](/cli/azure/network/perimeter#az-network-perimeter-create).

    ```azurecli-interactive
    az network perimeter create \
      --name nsp-1 \
      --resource-group test-rg \
      --location eastus2
    ```

1. Create a profile in the network security perimeter with [az network perimeter profile create](/cli/azure/network/perimeter/profile#az-network-perimeter-profile-create).

    ```azurecli-interactive
    az network perimeter profile create \
      --perimeter-name nsp-1 \
      --resource-group test-rg \
      --name profile-1
    ```

1. Associate your storage account with the network security perimeter with [az network perimeter association create](/cli/azure/network/perimeter/association#az-network-perimeter-association-create). Replace `<subscription-id>` and `<storage-account-name>` with your values.

    ```azurecli-interactive
    az network perimeter association create \
      --perimeter-name nsp-1 \
      --resource-group test-rg \
      --association-name assoc-storage \
      --access-mode Learning \
      --profile "{id:/subscriptions/<subscription-id>/resourceGroups/test-rg/providers/Microsoft.Network/networkSecurityPerimeters/nsp-1/profiles/profile-1}" \
      --private-link-resource "{id:/subscriptions/<subscription-id>/resourceGroups/test-rg/providers/Microsoft.Storage/storageAccounts/<storage-account-name>}"
    ```

## Create a network security perimeter inbound access rule

Add an IP-based inbound access rule in the network security perimeter to authorize traffic from your network identifier. This rule matches the public IP address to enable connectivity from your service endpoints.

Create an inbound access rule with [az network perimeter profile access-rule create](/cli/azure/network/perimeter/profile/access-rule#az-network-perimeter-profile-access-rule-create). Replace `<public-ip-prefix-range>` with the address range of your public IP prefix.

```azurecli-interactive
az network perimeter profile access-rule create \
  --perimeter-name nsp-1 \
  --resource-group test-rg \
  --profile-name profile-1 \
  --access-rule-name allow-se-standard \
  --direction Inbound \
  --address-prefixes "<public-ip-prefix-range>"
```

> [!NOTE]
> To find the address range of your public IP prefix, run `az network public-ip prefix show --resource-group test-rg --name public-ip-prefix --query ipPrefix --output tsv`.

## Validate connectivity

Connect to your virtual machine with Azure Bastion and test connectivity to the storage account to validate that traffic is authorized by the network security perimeter inbound access rule.

### Connect to the virtual machine

1. In the [Azure portal](https://portal.azure.com), search for and select **Virtual machines**.

1. Select **vm-1**.

1. Select **Connect**, then select **Connect via Bastion**.

1. In the **Bastion** page, enter the following information:

    | Setting | Value |
    |---|---|
    | Authentication Type | Select **SSH Private Key from Local File**. |
    | Username | Enter **azureuser**. |
    | Local File | Select the **vm-1-key.pem** file you downloaded when you created the virtual machine. |

1. Select **Connect**.

### Test connectivity to the storage account

1. In the SSH session on **vm-1**, sign in to Azure CLI:

    ```bash
    az login
    ```

1. Mount the Azure file share to validate connectivity to the storage account through the service endpoint. Replace `<storage-account-name>` with the name of your storage account:

    ```bash
    sudo mkdir -p /mnt/fileshare-1
    STORAGE_KEY=$(az storage account keys list \
        --resource-group test-rg \
        --account-name <storage-account-name> \
        --query "[0].value" -o tsv)

    sudo mount -t cifs //<storage-account-name>.file.core.windows.net/fileshare-1 /mnt/fileshare-1 \
        -o username=<storage-account-name>,password=$STORAGE_KEY,serverino,nosharesock,actimeo=30,mfsymlinks
    ```

1. Verify that the file share mounts successfully:

    ```bash
    df -h /mnt/fileshare-1
    ```

1. To confirm that the inbound access rule is working, check the network security perimeter diagnostic logs. For more information about network security perimeter diagnostic logs, see [Diagnostic logging for network security perimeter](network-security-perimeter-diagnostic-logs.md).

## Clean up resources

When you no longer need the resources created in this article, delete the resource group:

```azurecli-interactive
az group delete --name test-rg --yes --no-wait
```

## Next steps

- [Configure a standard service endpoint using the Azure portal](configure-service-endpoint-standard-portal.md)
- [Configure a standard service endpoint using Azure PowerShell](configure-service-endpoint-standard-powershell.md)
- [What is a standard service endpoint?](service-endpoint-standard-overview.md)
- [What is a network security perimeter?](network-security-perimeter-concepts.md)
