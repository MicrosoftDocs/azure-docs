---
title: Migration FAQ
titleSuffix: Azure Front Door
description: Frequently asked questions about migrating from Front Door (classic) and CDN Standard from Microsoft (classic) to Front Door Standard or Premium.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 07/27/2026
---

# Azure Front Door (classic) and CDN Standard from Microsoft (classic) migration FAQ

**Applies to:** :heavy_check_mark: Front Door (classic) :heavy_check_mark: CDN Standard from Microsoft (classic)

This article provides answers to frequently asked questions about migrating from Azure Front Door (classic) and CDN Standard from Microsoft (classic) to Front Door Standard or Premium.

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/front-door-classic-retirement.md)]

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

## Does the migration cause any downtime?

No, the migration process doesn't cause any downtime. It's a control plane-only migration, so traffic delivery isn't affected.

During migration, the Azure Front Door (classic) endpoint `mydomain.azurefd.net` is created as a dummy custom domain on Front Door standard or premium. Both classic endpoint and standard or premium endpoints point to the same Front Door IP, so the final resolution stays the same before and after DNS propagation. The endpoint keeps receiving traffic until you update the DNS record of the Front Door custom domain `www.mydomain.com` to `mydomain.randomstring.z01.azurefd.net` directly. Change the CNAME from classic endpoint to Front Door standard or premium endpoint after verification.

Even in rare cases where the migration fails, traffic delivery continues to work as expected.

The migration process doesn't support rollback. If migration fails, contact the support team for help.

## What should I do after migration?

After migration, follow these steps:

1. Verify that traffic delivery continues to work.

1. Update the DNS CNAME record for your custom domain to point to the Front Door Standard or Premium endpoint `exampledomain-hash.z01.azurefd.net` instead of the classic endpoint (`exampledomain.azurefd.net` for Front Door (classic) or `exampledomain.azureedge.net`). Wait for the DNS update to propagate until DNS TTL expires, depending on how long TTL is configured on DNS provider.

1. Verify again that traffic works in the custom domain.

1. Once confirmed, delete the pseudo custom domain (that is, the classic endpoint that was pointing to the Front Door Standard or Premium endpoint) from the Front Door Standard or Premium profile.

1. Then delete the classic resource. 

## When I change my DNS CNAME from Front Door (classic) endpoint to Front Door Standard/Premium endpoint, does DNS propagation cause downtime?

No, both classic endpoint and Standard/Premium endpoints point to the same IP, so the final resolution remains the same before and after DNS propagation.

## When should I delete the classic tier?

For Front Door (classic): After verifying that traffic works and the DNS record is updated to point to the Front Door Standard or Premium endpoint, you can safely delete the classic resource.

For CDN Standard from Microsoft (classic): You don't need to delete the classic resource. Migration is treated as a tier upgrade, and the classic resource can remain.

## Do I need to update my DevOps pipeline?

Yes. After migration, make sure to update your DevOps pipeline to reflect the new Front Door Standard or Premium configuration and endpoints. [Learn more](post-migration-dev-ops-experience.md).

## Related content

- [Settings mapping between Azure Front Door tiers](tier-mapping.md)
- Migrate from Azure Front Door (classic) to Standard or Premium tier using the [Azure portal](migrate-tier.md) or [Azure PowerShell](migrate-tier-powershell.md)
- [Migrate from Azure CDN from Microsoft (classic) to Standard or Premium tier using the Azure portal](migrate-tier.md)
