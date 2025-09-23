---
title: Migration FAQ
titleSuffix: Azure Front Door
description: Frequently asked questions about migrating from Front Door (classic) and CDN Standard from Microsoft (classic) to Front Door Standard or Premium.
author: jainsabal
ms.author: jainsabal
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 08/06/2025

---

# Azure Front Door (classic) and CDN Standard from Microsoft (classic) Migration FAQ

This article provides answers to frequently asked questions about the migration from Azure Front Door (classic) and CDN Standard from Microsoft (classic) to Front Door Standard or Premium.

## Does the migration involve any downtime?

No, there's no downtime during the migration. The process is a control plane-only migration, meaning traffic delivery is unaffected.

During migration, the Azure Front Door (classic) endpoint `mydomain.azurefd.net` is created as a dummy custom domain on Front Door standard/premium. Both classic endpoint and standard/premium endpoints point to the same Front Door IP so the final resolution remains the same before and after DNS propagation. It continues to receive traffic until you update the DNS record of the Front Door custom domain `www.mydomain.com` to `mydomain.randomstring.z01.azurefd.net` directly. We recommend changing the CNAME from classic endpoint to Front Door standard/premium endpoint after verification.

Even in rare cases where the migration fails, traffic delivery continues to work as expected.

There's no rollback support. If migration fails, reach out to the support team for help.

## What should I do after migration?

After migration, follow these steps:

1. Verify traffic delivery continues to work.

1. Update the DNS CNAME record for your custom domain to point to the Front Door Standard/Premium endpoint `exampledomain-hash.z01.azurefd.net` instead of the classic endpoint (`exampledomain.azurefd.net` for Front Door (classic) or `exampledomain.azureedge.net`). Wait for the DNS update propagation until DNS TTL expires, depending on how long TTL is configured on DNS provider.

1. Verify again that traffic works in the custom domain.

1. Once confirmed, delete the pseudo custom domain (that is, the classic endpoint that was pointing to the Front Door Standard/Premium endpoint) from the Front Door Standard/Premium profile.

1. Then delete the classic resource. 

## When I change my DNS CNAME from Front Door (classic) endpoint to Front Door Standard/Premium endpoint, does DNS propagation cause downtime?

No, both classic endpoint and Standard/Premium endpoints point to the same IP, so the final resolution remains the same before and after DNS propagation.

## When should I delete the classic tier?

For Front Door (classic): After verifying that traffic works and the DNS record was updated to point to the Front Door Standard/Premium endpoint, you can safely delete the classic resource.

For CDN Standard from Microsoft (classic): You don't need to delete the classic resource. Migration is treated as a tier upgrade, and the classic resource can remain.

## Do I need to update my DevOps pipeline?

Yes. After migration, make sure to update your DevOps pipeline to reflect the new Front Door Standard or Premium configuration and endpoints. [Learn more](post-migration-dev-ops-experience.md).

## Related content

- Understand the [settings mapping between Azure Front Door tiers](tier-mapping.md).
- Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier.md) using the Azure portal.
- Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier-powershell.md) using Azure PowerShell.
- Learn how to [migrate from Azure CDN from Microsoft (classic)](migrate-tier.md) to Azure Front Door using the Azure portal.
