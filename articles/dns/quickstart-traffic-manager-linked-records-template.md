---
title: 'Quickstart: Create a Traffic Manager Linked Record - ARM template'
titleSuffix: Azure DNS
description: Learn how to use an ARM template to create a Traffic Manager Linked Record that resolves directly to a public endpoint IP, without a trafficmanager.net CNAME hop.
services: dns
author: asudbring
ms.author: allensu
ms.date: 11/17/2026
ms.topic: quickstart
ms.service: azure-dns
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-arm-template
# Customer intent: As a network engineer, I want to deploy a Traffic Manager Linked Record using an ARM template, so that clients resolve directly to the highest-priority healthy endpoint IP address without an intermediate CNAME hop to trafficmanager.net.
---

# Quickstart: Create a Traffic Manager Linked Record using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a **Traffic Manager Linked Record** in Azure DNS. A Traffic Manager Linked Record connects a DNS record set directly to an Azure Traffic Manager profile. When a client queries the record, Azure DNS resolves the linked Traffic Manager profile internally and returns the endpoint IP address directly in the response. No intermediate CNAME hop to `trafficmanager.net` is required.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ftraffic-manager-linked-record%2Fazuredeploy.json":::

## Prerequisites

* An Azure account with an active subscription.
* Two public IPv4 endpoints that answer HTTP requests on port 80 at path `/`. Traffic Manager uses these endpoints to demonstrate priority-based failover.
* Azure CLI or Azure PowerShell, either installed locally or available through Azure Cloud Shell.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/traffic-manager-linked-record/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/traffic-manager-linked-record/azuredeploy.json":::

The template defines three Azure resources:

* [**Microsoft.Network/dnsZones**](/azure/templates/microsoft.network/dnszones): A public Azure DNS zone.
* [**Microsoft.Network/trafficManagerProfiles**](/azure/templates/microsoft.network/trafficmanagerprofiles): A [strictly typed](../traffic-manager/traffic-manager-strictly-typed-profiles.md) Traffic Manager profile that uses **priority** routing across two external endpoints, so traffic always goes to the highest-priority healthy endpoint first.
* [**Microsoft.Network/dnsZones/A**](/azure/templates/microsoft.network/dnszones/a): An `A` record in the zone whose `trafficManagementProfile` property links it directly to the Traffic Manager profile. This link is what makes the record set a Traffic Manager Linked Record instead of a standard alias record.

Because the profile is strictly typed as an `A` profile, Traffic Manager only accepts IPv4 endpoints for it, which reduces the chance of a type mismatch between the DNS record and the profile's endpoints.

Use the stable `"apiVersion": "2026-09-01"` for the `Microsoft.Network/trafficManagerProfiles` resource. This version supports the `recordType` property used for Strictly Typed Profiles.

## Deploy the template

Deploy the template by using either Azure CLI or Azure PowerShell. Replace `<primary-ip-address>` and `<secondary-ip-address>` with the public IPv4 addresses of your two endpoints.

# [CLI](#tab/CLI)

```azurecli-interactive
az group create --name TMLinkResourceGroup --location eastus
az deployment group create \
    --name azuredeploy \
    --resource-group TMLinkResourceGroup \
    --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/traffic-manager-linked-record/azuredeploy.json" \
    --parameters endpoint1IpAddress=<primary-ip-address> endpoint2IpAddress=<secondary-ip-address>
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
New-AzResourceGroup -Name TMLinkResourceGroup -Location eastus
New-AzResourceGroupDeployment `
    -Name azuredeploy `
    -ResourceGroupName TMLinkResourceGroup `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.network/traffic-manager-linked-record/azuredeploy.json" `
    -endpoint1IpAddress "<primary-ip-address>" `
    -endpoint2IpAddress "<secondary-ip-address>"
```

---

When the deployment finishes, you see a message indicating the deployment succeeded.

## Validate the deployment

The template's outputs include the authoritative name servers and the linked record resource ID, so you can query the deployment for the names and values you need instead of guessing them. The linked record resource ID contains the generated DNS zone name.

1. Retrieve the deployment outputs. The `dnsZoneNameServers` output is an array; the first entry is your zone's primary authoritative name server. The generated zone name is embedded in the `linkedRecordResourceId` output.

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    az deployment group show \
        --resource-group TMLinkResourceGroup \
        --name azuredeploy \
        --query properties.outputs
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    (Get-AzResourceGroupDeployment -ResourceGroupName TMLinkResourceGroup -Name azuredeploy).Outputs
    ```

    ---

1. Show the `A` record and confirm it's linked to the Traffic Manager profile. Replace `<generated-zone-name>` with the zone name from the previous step. This link is what makes the record a Traffic Manager Linked Record.

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    az network dns record-set a show \
        --resource-group TMLinkResourceGroup \
        --zone-name <generated-zone-name> \
        --name www
    ```

    The JSON output includes a nested `trafficManagementProfile` object; its `id` property holds the Traffic Manager profile's resource ID.

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    Get-AzDnsRecordSet -ResourceGroupName TMLinkResourceGroup -ZoneName <generated-zone-name> -Name www -RecordType A | Format-List
    ```

    Confirm that the returned record set contains the resource ID of the Traffic Manager profile you deployed.

    ---

1. Query the record directly against the authoritative name server from step 1. Replace `<generated-zone-name>` with the zone name and `<name-server>` with the first authoritative name server.

    # [CLI](#tab/CLI)

    ```azurecli-interactive
    nslookup -type=A www.<generated-zone-name> <name-server>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell-interactive
    Resolve-DnsName -Name www.<generated-zone-name> -Server <name-server> -Type A
    ```

    ---

    The response includes the IPv4 address of the highest-priority healthy endpoint directly in the answer. The response doesn't include a `trafficmanager.net` CNAME. This response pattern confirms that the record resolves through the Traffic Manager Linked Record rather than through a standard CNAME-based alias.

## Use another linked record type

This quickstart deploys an `A` record profile, but you can adapt the same pattern for other supported record types.

* **AAAA**: Provide IPv6 endpoint targets, set the Traffic Manager profile's `recordType` to `AAAA`, and change the linked record resource type to `Microsoft.Network/dnsZones/AAAA@2023-07-01-preview`.
* **CNAME**: Provide FQDN endpoint targets instead of IP addresses, set the profile's `recordType` to `CNAME`, and change the linked record resource type to `Microsoft.Network/dnsZones/CNAME@2023-07-01-preview`.
* **Zone apex**: To link the record at the zone apex instead of a subdomain, set `recordName` to `@`. Zone apex support is one of the advantages of Traffic Manager Linked Records, because the DNS protocol doesn't allow `CNAME` records at the apex.

## Clean up resources

When you no longer need the resources you created, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group. This action removes the Traffic Manager Linked Record, the Traffic Manager profile, the DNS zone, and all related resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name TMLinkResourceGroup
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name TMLinkResourceGroup
```

---

## Next steps

In this quickstart, you used an ARM template to deploy a DNS zone, a strictly typed Traffic Manager profile, and a Traffic Manager Linked Record that resolves directly to an endpoint IP address.

* Learn more about [Traffic Manager Linked Records](dns-traffic-manager-linked-records.md).
* Create a Traffic Manager Linked Record by using the [Azure portal](tutorial-traffic-manager-linked-records-portal.md), [Azure CLI](tutorial-traffic-manager-linked-records-cli.md), or [Azure PowerShell](tutorial-traffic-manager-linked-records-powershell.md).
* Learn more about [Strictly Typed Profiles](../traffic-manager/traffic-manager-strictly-typed-profiles.md).
