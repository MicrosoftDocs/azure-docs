---
title: 'Tutorial: Create a Traffic Manager Linked Record - Azure CLI'
titleSuffix: Azure DNS
description: Learn to create a Traffic Manager Linked Record in Azure DNS with the Azure CLI, returning endpoint IPs without an intermediate CNAME hop.
services: dns
author: asudbring
ms.service: azure-dns
ms.topic: tutorial
ms.date: 06/01/2026
ms.author: allensu
ms.custom:
  - template-tutorial
  - devx-track-azurecli
# Customer intent: "As a network administrator, I want to create a Traffic Manager Linked Record using the command line, so that I can automate and script DNS configurations that use Traffic Manager for intelligent traffic routing."
---

# Tutorial: Create a Traffic Manager Linked Record using Azure CLI

In this tutorial, you create a **Traffic Manager Linked Record** in Azure DNS using the Azure CLI. A Traffic Manager Linked Record connects a DNS record set directly to an Azure Traffic Manager profile, returning IP addresses to clients without an intermediate CNAME resolution.

> [!IMPORTANT]
> Traffic Manager Linked Records is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For a portal-based walkthrough, see [Create a Traffic Manager Linked Record using the Azure portal](tutorial-traffic-manager-linked-records-portal.md). For a conceptual overview, see [Traffic Manager Linked Records overview](dns-traffic-manager-linked-records.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create the networking and virtual machine infrastructure.
> * Create a Traffic Manager profile with endpoints.
> * Create a Traffic Manager Linked Record using Azure CLI.
> * Test the Traffic Manager Linked Record.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

* An Azure account with an active subscription.
* Azure CLI version 2.60 or later installed locally, or use Azure Cloud Shell. Run `az --version` to check your version. To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* A domain name hosted in Azure DNS. If you don't have an Azure DNS zone, [create one](./dns-getstarted-cli.md) and [delegate your domain](dns-delegate-domain-azure-dns.md) to Azure DNS.

   > [!NOTE]
   > In this tutorial, `contoso.com` is used as an example domain name. Replace `contoso.com` with your own domain name.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Set environment variables

Set variables for the resource names and locations used throughout this tutorial to avoid repeating them in each command.

```azurecli-interactive
RESOURCE_GROUP="test-rg"
LOCATION="eastus"
VNET_NAME="vnet-1"
TM_PROFILE_NAME="tm-profile"
DNS_ZONE="contoso.com"
```

## Create the resource group

```azurecli-interactive
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION
```

## Create the virtual network

```azurecli-interactive
az network vnet create \
    --resource-group $RESOURCE_GROUP \
    --name $VNET_NAME \
    --address-prefix 10.10.0.0/16 \
    --subnet-name subnet-1 \
    --subnet-prefix 10.10.0.0/24
```

## Create web server virtual machines

Create two Ubuntu virtual machines with public IP addresses to use as Traffic Manager endpoints.

### Create the public IP addresses

```azurecli-interactive
az network public-ip create \
    --resource-group $RESOURCE_GROUP \
    --name public-ip-1 \
    --sku Standard \
    --dns-name vm-1-tmlink

az network public-ip create \
    --resource-group $RESOURCE_GROUP \
    --name public-ip-2 \
    --sku Standard \
    --dns-name vm-2-tmlink
```

### Create the network security group

```azurecli-interactive
az network nsg create \
    --resource-group $RESOURCE_GROUP \
    --name nsg-1

az network nsg rule create \
    --resource-group $RESOURCE_GROUP \
    --nsg-name nsg-1 \
    --name AllowHTTP \
    --protocol tcp \
    --priority 100 \
    --destination-port-range 80

az network nsg rule create \
    --resource-group $RESOURCE_GROUP \
    --nsg-name nsg-1 \
    --name AllowHTTPS \
    --protocol tcp \
    --priority 110 \
    --destination-port-range 443
```

### Create the virtual machine NICs

```azurecli-interactive
az network nic create \
    --resource-group $RESOURCE_GROUP \
    --name nic-1 \
    --vnet-name $VNET_NAME \
    --subnet subnet-1 \
    --network-security-group nsg-1 \
    --public-ip-address public-ip-1

az network nic create \
    --resource-group $RESOURCE_GROUP \
    --name nic-2 \
    --vnet-name $VNET_NAME \
    --subnet subnet-1 \
    --network-security-group nsg-1 \
    --public-ip-address public-ip-2
```

### Create the virtual machines

> [!NOTE]
> Replace `<your-ssh-public-key>` with the contents of your SSH public key file, or use `--generate-ssh-keys` to create a new key pair.

```azurecli-interactive
az vm create \
    --resource-group $RESOURCE_GROUP \
    --name vm-1 \
    --nics nic-1 \
    --image Ubuntu2404 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --no-wait

az vm create \
    --resource-group $RESOURCE_GROUP \
    --name vm-2 \
    --nics nic-2 \
    --image Ubuntu2404 \
    --admin-username azureuser \
    --generate-ssh-keys
```

The last command waits for **vm-2** to be created. Both VMs are ready when the command returns.

### Install NGINX on both VMs

```azurecli-interactive
az vm run-command invoke \
    --resource-group $RESOURCE_GROUP \
    --name vm-1 \
    --command-id RunShellScript \
    --scripts "sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-1' | sudo tee /var/www/html/index.html"

az vm run-command invoke \
    --resource-group $RESOURCE_GROUP \
    --name vm-2 \
    --command-id RunShellScript \
    --scripts "sudo apt-get update && sudo apt-get install -y nginx && echo 'Hello World from vm-2' | sudo tee /var/www/html/index.html"
```

## Retrieve the public IP addresses

Note the IP addresses for both VMs. You need them when adding Traffic Manager endpoints.

```azurecli-interactive
VM1_IP=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP \
    --name public-ip-1 \
    --query ipAddress \
    --output tsv)

VM2_IP=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP \
    --name public-ip-2 \
    --query ipAddress \
    --output tsv)

echo "vm-1 IP: $VM1_IP"
echo "vm-2 IP: $VM2_IP"
```

## Create the Traffic Manager profile

```azurecli-interactive
az network traffic-manager profile create \
    --resource-group $RESOURCE_GROUP \
    --name $TM_PROFILE_NAME \
    --routing-method Priority \
    --unique-dns-name tm-profile-$RANDOM
```

### Add endpoints to the Traffic Manager profile

```azurecli-interactive
az network traffic-manager endpoint create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $TM_PROFILE_NAME \
    --name tmendpoint-1 \
    --type externalEndpoints \
    --target $VM1_IP \
    --priority 1

az network traffic-manager endpoint create \
    --resource-group $RESOURCE_GROUP \
    --profile-name $TM_PROFILE_NAME \
    --name tmendpoint-2 \
    --type externalEndpoints \
    --target $VM2_IP \
    --priority 2
```

Get the full resource ID of the Traffic Manager profile. You need it when creating the linked record.

```azurecli-interactive
TM_PROFILE_ID=$(az network traffic-manager profile show \
    --resource-group $RESOURCE_GROUP \
    --name $TM_PROFILE_NAME \
    --query id \
    --output tsv)

echo "Traffic Manager profile ID: $TM_PROFILE_ID"
```

## Create the Traffic Manager Linked Record

Use `az network dns record-set a create` with the `--traffic-management-profile` parameter to create the Traffic Manager Linked Record. The following command creates an A record at the zone apex (`@`).

> [!NOTE]
> The `--traffic-management-profile` parameter is available in Azure CLI version 2.60 and later, and requires the Traffic Manager Linked Records preview API (`2024-06-01-preview` or later).

```azurecli-interactive
az network dns record-set a create \
    --resource-group <dns-zone-resource-group> \
    --zone-name $DNS_ZONE \
    --name "@" \
    --traffic-management-profile $TM_PROFILE_ID
```

> [!NOTE]
> Replace `<dns-zone-resource-group>` with the resource group that contains your Azure DNS zone. This may differ from the resource group that contains the Traffic Manager profile.

To create a Traffic Manager Linked Record for a subdomain instead of the zone apex, replace `"@"` with the subdomain name, for example `"www"`:

```azurecli-interactive
az network dns record-set a create \
    --resource-group <dns-zone-resource-group> \
    --zone-name $DNS_ZONE \
    --name "www" \
    --traffic-management-profile $TM_PROFILE_ID
```

### Verify the linked record

```azurecli-interactive
az network dns record-set a show \
    --resource-group <dns-zone-resource-group> \
    --zone-name $DNS_ZONE \
    --name "@"
```

The output includes a `trafficManagementProfile` property with the Traffic Manager profile resource ID, confirming the link is established:

```json
{
  "name": "@",
  "properties": {
    "trafficManagementProfile": {
      "id": "/subscriptions/.../resourceGroups/test-rg/providers/Microsoft.Network/trafficManagerProfiles/tm-profile"
    },
    "TTL": 30,
    ...
  }
}
```

> [!NOTE]
> The TTL value shown in the output is inherited from the Traffic Manager profile's DNS configuration. Any TTL value specified during record creation is ignored.

## Test the Traffic Manager Linked Record

To test name resolution, query one of the Azure DNS name servers for your zone directly. First, list your zone's name servers:

```azurecli-interactive
az network dns record-set ns show \
    --resource-group <dns-zone-resource-group> \
    --zone-name $DNS_ZONE \
    --name "@" \
    --query "nsRecords[0].nsdname" \
    --output tsv
```

Use the returned name server with `nslookup` to test resolution:

```bash
nslookup contoso.com <name-server-from-above>
```

The response contains the IP address of the highest-priority healthy Traffic Manager endpoint—without any CNAME records in the answer. This confirms that Traffic Manager Linked Records return IP addresses directly.

### Test failover

1. Browse to your domain. You should see the NGINX page for **vm-1**.
1. Stop the **vm-1** VM:

    ```azurecli-interactive
    az vm stop --resource-group $RESOURCE_GROUP --name vm-1
    ```

1. Wait a few minutes for Traffic Manager to detect the endpoint as unhealthy.
1. Flush your local DNS cache (`ipconfig /flushdns` on Windows, `sudo dscacheutil -flushcache` on macOS) and browse to your domain again. You should now see the page for **vm-2**.
1. Restart **vm-1** to restore the original configuration:

    ```azurecli-interactive
    az vm start --resource-group $RESOURCE_GROUP --name vm-1
    ```

## Clean up resources

When you no longer need the resources created in this tutorial, delete the resource group and the DNS record:

```azurecli-interactive
# Delete the resource group and all resources within it
az group delete --name $RESOURCE_GROUP --yes --no-wait

# Delete the Traffic Manager Linked Record from the DNS zone
az network dns record-set a delete \
    --resource-group <dns-zone-resource-group> \
    --zone-name $DNS_ZONE \
    --name "@" \
    --yes
```

## Next steps

In this tutorial, you created a Traffic Manager Linked Record using Azure CLI. The record links your DNS zone apex to a Traffic Manager profile, returning IP addresses directly to clients.

- Learn more about [Traffic Manager Linked Records](dns-traffic-manager-linked-records.md).
- Create a Traffic Manager Linked Record using [Azure PowerShell](tutorial-traffic-manager-linked-records-powershell.md) or the [Azure portal](tutorial-traffic-manager-linked-records-portal.md).
- Learn more about [Traffic Manager routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- Learn more about [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md).
