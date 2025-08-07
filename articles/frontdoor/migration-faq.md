---
title: AFD/CDN Classic Migration FAQ
description: Frequently asked questions about migrating from AFD/CDN Classic to AFD Standard or Premium.
author: jainsabal
ms.author: jainsabal
ms.service: azure-frontdoor
ms.topic: overview
ms.date: 08/06/2025

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# AFD and CDN Classic Migration FAQ

This document provides answers to frequently asked questions regarding the migration from Azure Front Door (AFD) Classic and CDN Classic to AFD Standard/Premium.

### Will there be downtime during migration?

No, there is no downtime during the migration. This is a control plane-only migration, meaning traffic delivery is unaffected.

During migration, the classic Azure Front Door (AFD) endpoint mydomain.azurefd.net is created as a dummy custom domain on AFD standard/premium that is CNAMEd to AFD standard/premium endpoint mydomain.randomstring.z01.azurefd.net. It continues to receive traffic until you update the DNS record of AFD custom domain (www.mydomain.com) to mydomain.randomstring.z01.azurefd.net directly. It is highly recommended to change the CNAME from classic endpoint to AFD standard/premium endpoint after verification.

Even in rare cases where the migration fails, traffic delivery continues to work as expected.

There is no rollback support, please reach out to the support team for help if migration fails.



### What should I do after migration?

After migration:

- Verify traffic delivery continues to work.

- Update the DNS CNAME record for your custom domain to point to the AFD Standard/Premium endpoint (exampledomain-hash.z01.azurefd.net) instead of the classic endpoint (exampledomain.azurefd.net for classic AFD or exampledomain.azureedge.net). Wait for the DNS update propagation until DNS TTL expires, depending on how long TTL is configured on DNS provider.

- Verify again that traffic works in the custom domain.

- Once confirmed, delete the pseudo custom domain (i.e., the classic endpoint that was pointing to the AFD Standard/Premium endpoint) from the AFD Standard/Premium profile.

### When I change my DNS CNAME from classic AFD endpoint to AFD standard/premium endpoint, does DNS propagation cause downtime?

No, both classic endpoint and Std/premium endpoints point to the same IP, so the final resolution remains the same before and after DNS propagation.

### When should I delete the classic SKU?

For AFD Classic: After verifying that traffic works and the DNS record has been updated to point to the AFD Standard/Premium endpoint, you can safely delete the classic resource.

For CDN Classic: You do not need to delete the classic resource. Migration is treated as a SKU upgrade, and the classic resource can remain.

### Do I need to update my DevOps pipeline?

Yes. After migration, make sure to update your DevOps pipeline to reflect the new AFD Standard/Premium configuration and endpoints.

## Next step

* Understand the [settings mapping between Azure Front Door tiers](tier-mapping.md).
* Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier.md) using the Azure portal.
* Learn how to [migrate from Azure Front Door (classic) to Standard or Premium tier](migrate-tier-powershell.md) using Azure PowerShell.
* Learn how to [migrate from Azure CDN from Microsoft (classic)](migrate-tier.md) to Azure Front Door using the Azure portal.