---
title: Recover from a forced migration of an App Service Environment
description: Learn how to address issues that might result from a forced migration to App Service Environment v3.
author: seligj95
ms.topic: tutorial
ms.date: 6/18/2024
ms.author: jordanselig
---
# Resolve issues caused by a forced migration of an App Service Environment

> [!IMPORTANT]
> App Service Environment v1 and v2 are retired and no longer supported. If you have an App Service Environment v1 or v2, you must migrate to App Service Environment v3. For more information, see [Upgrade to App Service Environment v3](upgrade-to-asev3.md).
>
> Forced migrations are migrations that are initiated by Microsoft. Starting on September 1, 2024, all App Service Environments v1 and v2 will be forcibly migrated to App Service Environment v3 at any given time. Open a support case if you have any questions or concerns about the forced migration.
>

If you have an App Service Environment v1 or v2 that was forcibly migrated to App Service Environment v3, you might encounter issues with your apps or services. This article provides guidance on how to address these issues.

## Overview

After September 1, 2024, all App Service Environments v1 and v2 will be forcibly migrated to App Service Environment v3 at any given time. The platform initiates forced migrations, which are necessary to ensure that your App Service Environment is running on a supported platform. 

Forced migrations are done using the [in-place migration feature](migrate.md). There's about one hour of downtime during the migration process. The inbound and outbound IP addresses of your App Service Environment might change during the migration process. Downtime might be longer if you have dependencies on these IP addresses. Downtime might also be longer if you use features that aren't supported in App Service Environment v3.

## Forced migration limitations

Forced migrations are done using the in-place migration feature. The following limitations apply to forced migrations, similar to [limitations of in-place migrations](migrate.md#limitations):

- The new App Service Environment v3 is in the existing subnet that was used for your old environment.
- The new App Service Environment v3 is in the same region as your old environment.
- The new App Service Environment v3 is in the same resource group as your old environment.
- All resources maintain the same names and resource IDs.
- IP-based TLS/SSL bindings aren't supported in App Service Environment v3. If you use IP-based TLS/SSL bindings, they're removed during the migration process.
- App Service Environment v1 in a [Classic virtual network](/previous-versions/azure/virtual-network/create-virtual-network-classic) isn't supported for migration. If you have an App Service Environment v1 in a Classic virtual network, you must [migrate manually](migration-alternatives.md). Your App Service Environment is suspended until you migrate manually. **Your App Service Environment will be deleted in February 2025.**

For more information about in-place migrations and to see what process is followed during a forced migration, see the [Migration to App Service Environment v3 using the in-place migration feature](migrate.md).

## Changes to the in-place migration feature

To limit the effect of forced migrations, we implemented the following changes to the in-place migration feature.

### Outbound IP address preservation

Previously, the outbound IP address of your App Service Environment was changed during the migration process. Now, the outbound IP address of your App Service Environment is preserved during the migration process. The App Service Environment v1/v2 public IP address is preserved and used as the outbound IP address of the App Service Environment v3. However, App Service Environment v3 has two outbound IP addresses. If you have a custom domain suffix configuration and connect to your Azure Key Vault over the public internet, you might still need to account for the other new outbound IP address.

For internal load balancer (ILB) App Service Environment migrations, the inbound IP is always preserved. This functionality is the same as before.

For external load balancer (ELB) App Service Environment migrations, the inbound IP still changes. This change might affect you if you use A records to point to the inbound IP address of your App Service Environment. If you use A records, you must update the A records to point to the new inbound IP address after the migration process is complete. If you use CNAME records, you don't need to make any changes. If you have any other dependencies on the inbound IP address, you must update them accordingly.

### App Service Environment v2 custom domain suffix configuration compatibility

[Custom domain suffix on App Service Environment v3](how-to-custom-domain-suffix.md) is implemented differently than on App Service Environment v2. On App Service Environment v2, the certificate is uploaded directly to the App Service Environment. Additionally, wildcard certificates are allowed. On App Service Environment v3, the certificate must be stored in Azure Key Vault and the App Service Environment must be able to access the key vault. Also, wildcard certificates aren't allowed.

To reduce the effect of forced migrations, we implemented a limited compatibility mode for App Service Environment v2 custom domain suffix configurations on App Service Environment v3. If you have a custom domain suffix configuration on App Service Environment v2, the configuration is migrated to App Service Environment v3. The certificate is uploaded to the App Service Environment v3 and the configuration is updated to use the uploaded certificate. This process is done as a temporary measure and is only valid until the current certificate expires. You must [update the configuration to use Azure Key Vault](how-to-custom-domain-suffix.md) after the migration process is complete and before the certificate expires. If you don't update the configuration, once the certificate expires, the custom domain suffix doesn't work. For more information, see [Custom domain suffix on App Service Environment v3](how-to-custom-domain-suffix.md).

### Migration support for apps with IP-based TLS/SSL bindings

IP-based TLS/SSL bindings aren't supported in App Service Environment v3. Previously, the migration feature only allowed you to migrate once you removed the bindings. To enable forced migrations, the validation to check for IP-based TLS/SSL bindings is removed. If you have IP-based TLS/SSL bindings, you must remove them once the migration is complete. Your apps don't work until you remove the bindings.

## Address issues caused by a forced migration

If you encounter issues with your apps or services after a forced migration, follow these steps to address them:

TODO: what if there is an azure policy blocking migration?
TODO: what if there is a lock blocking migration?
TODO: how do we handle subnet delegation? do we automatically delegate the subnet?
TODO: how do we handle "Subscription has too many App Service Environments. Please remove some before trying to create more."?