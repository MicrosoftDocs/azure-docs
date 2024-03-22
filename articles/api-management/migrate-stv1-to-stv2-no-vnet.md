---
title: Migrate to stv2 platform - Azure API Management - Non-VNet injected
description: Migrate your Azure API Management instance in-place from the stv1 compute platform to the stv2 platform. Follow these migration steps if your API Management instance is not deployed (injected) in an external or internal VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/14/2024
ms.author: danlep
---

# Migrate a non-VNet-injected API Management instance to the stv2 compute platform

This article provides steps to migrate an API Management instance hosted on the `stv1` compute platform in-place to the `stv2` platform when the instance *is not* injected (deployed) in an external or internal VNet. For this scenario, migrate your instance using the Azure portal or the [Migrate to stv2](/rest/api/apimanagement/current-ga/api-management-service/migratetostv2) REST API. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).  

If you need to migrate a *VNnet-injected* API Management hosted on the `stv1` platform, see [Migrate a VNet-injected API Management instance to the stv2 platform](migrate-stv1-to-stv2-vnet.md).

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]

> [!CAUTION]
> * Migrating your API Management instance to new infrastructure is a long-running operation. 
> * Depending on your migration process, you might have temporary downtime during migration, and you might need to update your network dependencies after migration to reach your API Management instance. Plan your migration accordingly.
> * Migration to `stv2` is not reversible.

[!INCLUDE [api-management-availability-premium-dev-standard-basic-no-v2](../../includes/api-management-availability-premium-dev-standard-basic-no-v2.md)]

## What happens during migration?

API Management platform migration from `stv1` to `stv2` involves updating the underlying compute alone and has no impact on the service/API configuration persisted in the storage layer. For an instance that's not deployed in a VNet:

* You can choose whether the VIP address of the instance will change, or whether the original VIP address is preserved.
* The upgrade process involves creating a new compute in parallel to the old compute.
* The API Management status in the portal will be **Updating**.
* If you choose to preserve the VIP address, migration includes an additional step of moving the VIP from the old compute to the new compute during which the APIs will be unresponsive.
* Azure manages the management endpoint DNS, and updates to the new compute immediately on successful migration.
* The default gateway and portal DNS point to the new compute immediately.
* If you choose to have your API Management instance receive a new VIP address, you'll need to update network dependencies to use the new VIP address.

## Prerequisites

* An API Management instance hosted on the `stv1` compute platform. To confirm that your instance is hosted on the `stv1` platform, see [How do I know which platform hosts my API Management instance?](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Migrate the instance to stv2 platform

You can choose whether the virtual IP address of API Management will change, or whether the original VIP address is preserved.

* **New virtual IP address** - If you choose this mode, API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address. 

* **Preserve IP address** - If you preserve the VIP address, API requests will be unresponsive for approximately 15 minutes while the IP address is migrated to the new infrastructure. Infrastructure configuration (such as custom domains, locations, and CA certificates) will be locked for 45 minutes. No further configuration is required after migration.

#### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Settings**, select **Platform migration**.
1. On the **Platform migration** page, select one of the two migration options:

    * **New virtual IP address**. The VIP address of your API Management instance will change automatically. Your service will have no downtime, but after migration you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

    * **Preserve IP address** - The VIP address of your API Management instance won't change. Your instance will have downtime for up to 15 minutes.

        :::image type="content" source="media/migrate-stv1-to-stv2-no-vnet/platform-migration-portal.png" alt-text="Screenshot of API Management platform migration in the portal.":::

1. Review guidance for the migration process, and prepare your environment. 

1. After you've completed preparation steps, select **I have read and understand the impact of the migration process.** Select **Migrate**.

#### [Azure CLI](#tab/cli)

Run the following Azure CLI commands, setting variables where indicated with the name of your API Management instance and the name of the resource group in which it was created.
> [!NOTE]
> The Migrate to `stv2` REST API is available starting in API Management REST API version `2022-04-01-preview`.
> [!NOTE]
> The following script is written for the bash shell. To run the script in PowerShell, prefix the variable names with the `$` character. Example: `$APIM_NAME`.

```azurecli
RG_NAME={name of your resource group}
# Get resource ID of API Management instance
APIM_RESOURCE_ID=$(az apim show --name $APIM_NAME --resource-group $RG_NAME --query id --output tsv)
# Call REST API to migrate to stv2 and change VIP address
az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "NewIp"}'
# Alternate call to migrate to stv2 and preserve VIP address
# az rest --method post --uri "$APIM_RESOURCE_ID/migrateToStv2?api-version=2023-03-01-preview" --body '{"mode": "PreserveIp"}'
```
---

[!INCLUDE [api-management-validate-migration-to-stv2](../../includes/api-management-validate-migration-to-stv2.md)]

[!INCLUDE [api-management-migration-rollback](../../includes/api-management-migration-rollback.md)]

## Update network dependencies

After successful migration to a new VIP address, update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.


[!INCLUDE [api-management-migration-support](../../includes/api-management-migration-support.md)]

## Frequently asked questions

- **What information do we need to choose a migration path?**
    
   - What is the network mode of the API Management instance?
   - Are custom domains configured?
   - Is a firewall involved?
   - Any known dependencies taken by upstream/downstream on the IPs involved?
   - Is it a multi-region deployment?
   - Can we modify the existing instance or is a parallel setup required?
   - Can there be downtime?
   - Can the migration be done in nonbusiness hours?

- **What are the prerequisites for the migration?**

   For non-VNet-injected instances, no prerequisites are required. If you migrate preserving your public IP address, this will render your API Management instance unresponsive for approximately 15 minutes. There may not be a downtime if you choose the **New virtual IP address** option that makes API Management available on a new IP. Instances configured with a custom domain using an A record and/or having network dependencies on the public virtual IP address will have a downtime when a new virtual IP address is requested.

- **Will the migration cause a downtime?**
   
   For non-VNet-injected instances, there's a downtime of approximately 15 minutes only if you choose to preserve the original IP address. However, there's no downtime if you migrate with a new IP address and have no network dependencies on the new IP. Network dependencies include custom domain name without a CNAME, IP allow–listing, firewall rules, and VNets.

- **Can data or configuration losses occur by/during the migration?**

   `stv1` to `stv2` migration involves updating the compute platform alone and the internal storage layer isn't changed. Hence all the configuration is safe during the migration process. This includes the system-assigned managed identity, which if enabled is preserved.

- **How to confirm that the migration is complete and successful?**

   The migration is considered complete and successful when the status in the overview page reads **Online** along with the platform version being either `stv2` or `stv2.1`. Also verify that the network status in the network blade shows green for all required connectivity.

- **Can I do the migration using the portal?**

   Yes, the **Platform migration** blade in the Azure portal guides through the migration for non-VNet-injected instances.

- **Can I preserve the IP address of the instance?**

   Yes, the IP address can be preserved, but there will be a downtime of approximately 15 minutes.

- **Is there a migration path without modifying the existing instance?**

   Yes, you need a [side-by-side migration](migrate-stv1-to-stv2.md#alternative-side-by-side-deployment). That means you create a new API Management instance in parallel with your current instance and copy the configuration over to the new instance. 

- **What happens if the migration fails?**

   If your API Management instance doesn't show the platform version as `stv2` or `stv2.1` and status as **Online** after you initiated the migration, it probably failed. Your service is automatically rolled back to the old instance and no changes are made. If you have problems (such as if status is **Updating** for more than 2 hours), contact Azure support.

- **What functionality is not available during migration?**

   For non-VNet-injected instances:
   
   - If you opted to preserve the original IP address: API requests are unresponsive for approximately 15 minutes while the IP address is migrated to the new infrastructure. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 45 minutes.
   - If you opted to migrate to a new IP address: API requests remain responsive during migration. Infrastructure configuration (such as custom domains, locations, and CA certificates) is locked for 30 minutes. After migration, you'll need to update any network dependencies including DNS, firewall rules, and VNets to use the new VIP address.

- **How long will the migration take?**

   The expected duration for the whole migration is approximately 45 minutes. The indicator to check if the migration was already performed is to check if Status of your instance is back to **Online** and not **Updating**. If it says **Updating** for more than 2 hours, contact Azure support.


- **Can I roll back the migration if required?**

    If there's a failure during the migration process, the instance will automatically roll back to the `stv1` platform. However, after the service migrates successfully, you can't roll back to the `stv1` platform. 

- **Is there any change required in custom domains/private DNS zones?**

   For non-VNet injected instances, no changes are required if the IP is preserved. If opted for a new IP, custom domains referring to the IP should be updated.

- **My stv1 instance is deployed to multiple Azure regions (multi-region). How do I upgrade to stv2?**

   For an API Management that's not inject in a VNet, follow the [migration steps](#migrate-the-instance-to-stv2-platform) using the portal or the Azure CLI. All the regions will be migrated to `stv2`.

- **What should we consider for self-hosted gateways?**

   You don't need to do anything in your self-hosted gateways. You just need to migrate API Management instances running in Azure that are impacted by the `stv1` platform retirement. Note that there could be a new IP for the Configuration endpoint of the API Management instance, and any networking restrictions pinned to the IP should be updated.

- **How is the developer portal impacted by migration?**

   There's no impact on developer portal. If custom domains are used, the DNS record should be updated with the effective IP, post migration. However, if the default domains are in use, they're automatically updated on successful migration. There's no downtime for the developer portal during the migration.

- **Is there any impact on cost once we migrated to stv2?**

   The billing model remains the same for `stv2` and there won't be any more cost incurred during and after the migration.

- **What RBAC permissions are required for the stv1 to stv2 migration?**

   The user/process undertaking the migration needs [write access to the API Management instance](./api-management-role-based-access-control.md).

[!INCLUDE [api-management-migration-related-content](../../includes/api-management-migration-related-content.md)]