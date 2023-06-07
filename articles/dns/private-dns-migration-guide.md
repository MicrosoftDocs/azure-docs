---
title: Migrating legacy Azure DNS private zones to the new resource model
titleSuffix: Azure DNS
description: This guide provides step by step instruction on how to migrate legacy private DNS zones to latest resource model
author: greg-lindsay
ms.service: dns
ms.topic: how-to
ms.date: 09/27/2022
ms.author: greglin
---

# Migrating legacy Azure DNS private zones to new resource model

During public preview, private DNS zones were created using "dnszones" resource with "zoneType" property set to "Private". Such zones won't be supported after December 31, 2019 and must be migrated to GA resource model, which makes use of `privateDnsZones` resource type instead of `dnszones`. The migration process is  simple, and we've provided a PowerShell script to automate this process. This guide provides step by step instruction to migrate your Azure DNS private zones to the new resource model.

To find out the dnszones resources that require migration; execute the below command in Azure CLI.

```azurecli
az account set --subscription <SubscriptionId>
az network dns zone list --query "[?zoneType=='Private']"
```

## Prerequisites

Make sure you have installed latest version of Azure PowerShell. For more information on Azure PowerShell (Az) and how to install it visit [Introducing the Azure Az PowerShell module](/powershell/azure/new-azureps-module-az).

Make sure that you've Az.PrivateDns module for the Azure PowerShell installed. To install this module, open an elevated PowerShell window (Administrative mode) and enter following command

```powershell
Install-Module -Name Az.PrivateDns
```

> [!IMPORTANT]
> The migration process is fully automated and isn't expected to cause any downtime. However, if you're using Azure DNS private zones in a critical production environment you should run the following migration process during a planned maintenance time window. Make sure that you don't modify the configuration or record-sets of a private DNS zones while you're running the migration script.

## Installing the script

Open an elevated PowerShell window (Administrative mode) and run following command

```powershell
install-script PrivateDnsMigrationScript
```

Enter "A" when prompted to install the script

![Installing the script](./media/private-dns-migration-guide/install-migration-script.png)

You can also manually obtain the latest version of PowerShell script at https://www.powershellgallery.com/packages/PrivateDnsMigrationScript

> [!IMPORTANT]
> The migration script must not be run in Azure cloud shell and must be executed in a VM or local machine connected to internet.

## Running the script

Execute following command to run the script

```powershell
PrivateDnsMigrationScript.ps1
```

![Running the script](./media/private-dns-migration-guide/running-migration-script.png)

### Enter the subscription ID and sign-in to Azure

You'll be prompted to enter subscription ID containing the private DNS zones that you intend to migrate. You'll be asked to sign-in to your Azure account. Complete the sign-in so that script can access the private DNS zone resources in the subscription.

![Login to Azure](./media/private-dns-migration-guide/login-migration-script.png)

### Select the DNS zones you want to migrate

The script with get the list of all private DNS zones in the subscription and prompt you to confirm which ones you want to migrate. Enter "A" to migrate all private DNS zones. Once you execute this step, the script will create new private DNS zones using new resource model and copy the data into the new DSN zone. This step won't alter your existing private DNS zones in anyway.

![Select DNS zones](./media/private-dns-migration-guide/migratezone-migration-script.png)

### Switching DNS resolution to the new DNS zones

Once the zones and records have been copied to the new resource model, the script will prompt you to switch the DNS resolution to new DNS zones. This step removes the association between legacy private DNS zones and your virtual networks. When the legacy zone is unlinked from the virtual networks, the new DNS zones created in above step would automatically take over the DNS resolution for those virtual networks.

Select 'A' to switch the DNS resolution for all virtual networks.

![Switching Name Resolution](./media/private-dns-migration-guide/switchresolution-migration-script.png)

### Verify the DNS resolution

Before proceeding further, verify that DNS resolution on your DNS zones is working as expected. You can sign-in to your Azure VMs and issue nslookup query against the migrated zones to verify that DNS resolution is working.

![Verify Name Resolution](./media/private-dns-migration-guide/verifyresolution-migration-script.png)

If you find that DNS queries aren't resolving, wait for a few minutes and retry the queries. If DNS queries are working as expected, enter 'Y' when script prompts you to remove the virtual network from the private DNS zone.

![Confirm Name Resolution](./media/private-dns-migration-guide/confirmresolution-migration-script.png)

> [!IMPORTANT]
> If because of any reason DNS resolution against the migrated zones isn't working as expected, enter 'N' in above step and script will switch the DNS resolution back to legacy zones. Create a support ticket and we can help you with migration of your DNS zones.

## Cleanup

This step will delete the legacy DNS zones and should be executed only after you've verified that DNS resolution is working as expected. You'll be prompted to delete each private DNS zone. Enter 'Y' at every prompt after verifying that DNS resolution for that zones is working properly.

![Clean up](./media/private-dns-migration-guide/cleanup-migration-script.png)

## Update Your automation

If you're using automation including templates, PowerShell scripts or custom code developed using SDK, you must update your automation to use the new resource model for the private DNS zones. Below are the links to new private DNS CLI/PS/SDK documentation.
* [Azure DNS private zones REST API](/rest/api/dns/privatedns/privatezones)
* [Azure DNS private zones CLI](/cli/azure/network/private-dns/link/vnet)
* [Azure DNS private zones PowerShell](/powershell/module/az.privatedns/)
* [Azure DNS private zones SDK](/dotnet/api/overview/azure/resourcemanager.privatedns-readme)

## Need further help

Create a support ticket if you need further help with the migration process or because of any reason the above listed steps don't work for you. Include the transcript file generated by the PowerShell script with your support ticket.

## Next steps

* Learn how to create a private zone in Azure DNS using [Azure PowerShell](./private-dns-getstarted-powershell.md) or [Azure CLI](./private-dns-getstarted-cli.md).
* Read about some common [private zone scenarios](./private-dns-scenarios.md) that can be realized with private zones in Azure DNS.
* For common questions and answers about private zones in Azure DNS, including specific behavior you can expect for certain kinds of operations, see [Private DNS FAQ](./dns-faq-private.yml).
* Learn about DNS zones and records by visiting [DNS zones and records overview](dns-zones-records.md).
* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
