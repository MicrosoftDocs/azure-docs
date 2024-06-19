---
title: Recover from an auto-migration of an App Service Environment
description: Learn how to address issues that might result from an auto-migration to App Service Environment v3.
author: seligj95
ms.topic: tutorial
ms.date: 6/19/2024
ms.author: jordanselig
---
# Resolve issues caused by an auto-migration of an App Service Environment

> [!IMPORTANT]
> App Service Environment v1 and v2 are retired and no longer supported. If you have an App Service Environment v1 or v2, you must migrate to App Service Environment v3. For more information, see [Upgrade to App Service Environment v3](upgrade-to-asev3.md).
>
> Auto-migrations are migrations that are initiated by Microsoft. Starting on September 1, 2024, all App Service Environments v1 and v2 will be automatically migrated to App Service Environment v3 at any given time.
>

If you have an App Service Environment v1 or v2 that was auto-migrated to App Service Environment v3, you might encounter issues with your apps or services. This article provides guidance on how to address these issues.

## Overview

After September 1, 2024, all App Service Environments v1 and v2 will be automatically migrated to App Service Environment v3 at any given time. The platform initiates auto-migrations, which are necessary to ensure that your App Service Environment is running on a supported platform. 

Auto-migrations are done using the [in-place migration feature](migrate.md). There's about one hour of downtime during the migration process. The inbound and outbound IP addresses of your App Service Environment might change during the migration process. Downtime might be longer if you have dependencies on these IP addresses. Downtime might also be longer if you use features that aren't supported in App Service Environment v3.

## Auto-migration limitations

Auto-migrations are done using the [in-place migration feature](migrate.md). The following limitations apply to auto-migrations, similar to [limitations of in-place migrations](migrate.md#limitations):

- The new App Service Environment v3 is in the existing subnet that was used for your old environment.
- The new App Service Environment v3 is in the same region as your old environment.
- The new App Service Environment v3 is in the same resource group as your old environment.
- All resources maintain the same names and resource IDs.
- IP-based TLS/SSL bindings aren't supported in App Service Environment v3. If you have IP-based TLS/SSL bindings, you must remove them once the migration is complete. Your apps don't work until you remove the bindings.
- App Service Environment v1 in a [Classic virtual network](/previous-versions/azure/virtual-network/create-virtual-network-classic) isn't supported for migration. If you have an App Service Environment v1 in a Classic virtual network, you must [migrate manually](migration-alternatives.md). Your App Service Environment is suspended until you migrate manually. **Your App Service Environment will be deleted in February 2025.**

For more information about in-place migrations and to see what process is followed during an auto-migration, see the [Migration to App Service Environment v3 using the in-place migration feature](migrate.md).

## Changes to the in-place migration feature

To limit the effect of auto-migrations, we implemented the following changes to the in-place migration feature.

### Outbound IP address preservation

Previously, the outbound IP address of your App Service Environment was changed during the migration process. Now, the outbound IP address of your App Service Environment is preserved during the migration process. The App Service Environment v1/v2 public IP address is preserved and used as the outbound IP address of the App Service Environment v3. However, App Service Environment v3 has two outbound IP addresses. If you have a custom domain suffix configuration and connect to your Azure Key Vault over the public internet, you might still need to account for the other new outbound IP address.

For internal load balancer (ILB) App Service Environment migrations, the inbound IP is always preserved. This functionality is the same as before.

For external load balancer (ELB) App Service Environment migrations, the inbound IP still changes. This change might affect you if you use A records to point to the inbound IP address of your App Service Environment. If you use A records, you must update the A records to point to the new inbound IP address after the migration process is complete. If you use CNAME records, you don't need to make any changes. If you have any other dependencies on the inbound IP address, you must update them accordingly.

### App Service Environment v2 custom domain suffix configuration compatibility

[Custom domain suffix on App Service Environment v3](how-to-custom-domain-suffix.md) is implemented differently than on App Service Environment v2. On App Service Environment v2, the certificate is uploaded directly to the App Service Environment. Additionally, wildcard certificates are allowed. On App Service Environment v3, the certificate must be stored in Azure Key Vault and the App Service Environment must be able to access the key vault. Also, wildcard certificates aren't allowed.

To reduce the effect of auto-migrations, we implemented a limited compatibility mode for App Service Environment v2 custom domain suffix configurations on App Service Environment v3. If you have a custom domain suffix configuration on App Service Environment v2, the configuration is migrated to App Service Environment v3. The certificate is uploaded to the App Service Environment v3 and the configuration is updated to use the uploaded certificate. This process is done as a temporary measure and is only valid until the current certificate expires. You must [update the configuration to use Azure Key Vault](how-to-custom-domain-suffix.md) after the migration process is complete and before the certificate expires. If you don't update the configuration, once the certificate expires, the custom domain suffix doesn't work. For more information, see [Custom domain suffix on App Service Environment v3](how-to-custom-domain-suffix.md).

### Migration support for apps with IP-based TLS/SSL bindings

IP-based TLS/SSL bindings aren't supported in App Service Environment v3. Previously, the migration feature only allowed you to migrate once you removed the bindings. To enable auto-migrations, the validation to check for IP-based TLS/SSL bindings is removed. If you have IP-based TLS/SSL bindings, you must remove them once the migration is complete. Your apps don't work until you remove the bindings.

## Address issues caused by an auto-migration

The following are issues you might encounter with your apps or services after an auto-migration. If your issue isn't listed here and you need assistance, contact [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

### Issue: App Service Environment v3 is using the old custom domain suffix configuration

If you have a custom domain suffix configuration on App Service Environment v2, the configuration is migrated to App Service Environment v3. The certificate is uploaded to the App Service Environment v3 and the configuration is updated to use the uploaded certificate. This process is done as a temporary measure and is only valid until the current certificate expires. 

To address this incompatibility, you must [update the configuration to use Azure Key Vault](how-to-custom-domain-suffix.md) after the migration process is complete and before the certificate expires. If you don't update the configuration, once the certificate expires, the custom domain suffix doesn't work. To update the custom domain suffix configuration, follow the steps in [Custom domain suffix on App Service Environment v3](how-to-custom-domain-suffix.md).

### Issue: Apps on App Service Environment v3 have IP-based TLS/SSL bindings

IP-based TLS/SSL bindings aren't supported in App Service Environment v3. You must remove the bindings once the migration is complete. Your apps don't work until you remove the bindings.

### Issue: Dependent resources haven't been updated to use the new inbound IP address

ILB App Service Environment migrations preserve the inbound IP address, so no action is needed. 

ELB App Service Environment migrations change the inbound IP address. If you use A records to point to the inbound IP address of your App Service Environment, you must update the A records to point to the new inbound IP address after the migration process is complete. If you use CNAME records, you likely don't need to make any DNS changes. If you have any other dependencies on the inbound IP address, you must update them accordingly. The old inbound IP address is no longer valid after the migration process is complete.

### Issue: Dependent resources haven't been updated to use the new outbound IP address

App Service Environment v3 has two outbound IP addresses. After the migration process, your existing outbound IP address is preserved, but another outbound IP is created. In general, you don't need to account for this new IP address. However, if you have a custom domain suffix configuration and connect to your Azure Key Vault over the public internet, you need to account for the other new outbound IP address.

### Issue: Feature incompatibility or change with App Service Environment v3

In general, App Service Environment v3 is compatible with App Service Environment v1 and v2. However, there are some differences. To see the differences between the versions, review the [App Service Environment version comparison](version-comparison.md). If you're using a feature that isn't supported or behaves differently on App Service Environment v3, you must update your apps accordingly.

The following are notable changes in App Service Environment v3:

- IP-based TLS/SSL bindings aren't supported.
- Custom domain suffix configuration is different.
- If you have a custom domain suffix, the default domain is also maintained.
- Wildcard certificates aren't allowed.
- App Service Environment v3 has two outbound IP addresses.
- The [available SKUs](https://azure.microsoft.com/pricing/details/app-service/windows/) are different sizes.
- There's a different [pricing model](overview.md#pricing).
- There's a different [networking model](networking.md).
- FTPS endpoint structure is different. Access to FTPS endpoint using custom domain suffix isn't supported.
- App Service Environment v3 doesn't fall back to Azure DNS if your configured custom DNS servers in the virtual network aren't able to resolve a given name. If this behavior is required, ensure that you have a forwarder to a public DNS or include Azure DNS in the list of custom DNS servers.

## Pricing

There's no cost associated with migrating your App Service Environment. You stop being charged for your previous App Service Environment as soon as it shuts down during the migration process. You begin getting charged for your new App Service Environment v3 as soon as it gets deployed. For more information about App Service Environment v3 pricing, see the [pricing details](overview.md#pricing).

When you migrate to App Service Environment v3 from previous versions, there are scenarios that you should consider that can potentially reduce your monthly cost. Consider [reservations](../../cost-management-billing/reservations/reservation-discount-app-service.md#how-reservation-discounts-apply-to-isolated-v2-instances) and [savings plans](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md) to further reduce your costs. For information on cost saving opportunities, see [Cost saving opportunities after upgrading to App Service Environment v3](upgrade-to-asev3.md#cost-saving-opportunities-after-upgrading-to-app-service-environment-v3).

> [!NOTE]
> Due to the conversion of App Service plans from Isolated to Isolated v2, your apps may be over-provisioned after the migration since the Isolated v2 tier has more memory and CPU per corresponding instance size. You'll have the opportunity to [scale your environment](../manage-scale-up.md) as needed once migration is complete. For more information, review the [SKU details](https://azure.microsoft.com/pricing/details/app-service/windows/).
>

### Scale down your App Service plans

The App Service plan SKUs available for App Service Environment v3 run on the Isolated v2 (Iv2) tier. The number of cores and amount of RAM are effectively doubled per corresponding tier compared the Isolated tier. When you migrate, your App Service plans are converted to the corresponding tier. For example, your I2 instances are converted to I2v2. While I2 has two cores and 7-GB RAM, I2v2 has four cores and 16-GB RAM. If you expect your capacity requirements to stay the same, you're over-provisioned and paying for compute and memory you're not using. For this scenario, you can scale down your I2v2 instance to I1v2 and end up with a similar number of cores and RAM that you had previously.

## Frequently asked questions

- **Why was my App Service Environment auto-migrated?**
  App Service Environment v1 and v2 are retired and no longer supported. The supporting infrastructure for App Service Environment v1 and v2 is being decommissioned. To ensure that your App Service Environment is running on a supported platform, Microsoft initiates auto-migrations to App Service Environment v3.
- **What is the downtime during the migration process?**
  There's about one hour of downtime during the migration process. The inbound and outbound IP addresses of your App Service Environment might change during the migration process. Downtime might be longer if you have dependencies on these IP addresses. Downtime might also be longer if you use features that aren't supported in App Service Environment v3.
- **Will I be charged for auto-migrations?**
  There's no cost associated with migrating your App Service Environment. You stop being charged for your previous App Service Environment as soon as it shuts down during the migration process. You begin getting charged for your new App Service Environment v3 as soon as it gets deployed.

TODO: what if there is an azure policy blocking migration?
TODO: what if there is a lock blocking migration?
TODO: how do we handle subnet delegation? do we automatically delegate the subnet?
TODO: how do we handle "Subscription has too many App Service Environments. Please remove some before trying to create more."?