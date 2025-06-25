---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 01/24/2025
ms.author: cephalin
---

When you clone a configuration from another deployment slot, the cloned configuration is editable. Some configuration elements follow the content across a swap (they're *not slot specific*). Other configuration elements stay in the same slot after a swap (they're *slot specific*).

When you swap slots, these settings are swapped:

- Language stack and version, 32 bit and 64 bit
- App settings (can be configured to stick to a slot)
- Connection strings (can be configured to stick to a slot)
- Mounted storage accounts (can be configured to stick to a slot)
- Handler mappings
- Public certificates
- WebJobs content
- Hybrid connections (currently)
- Service endpoints (currently)
- Azure Content Delivery Network (currently)
- Path mappings
- Virtual network integration

When you swap slots, these settings aren't swapped:

- General settings not mentioned in the previous list
- Publishing endpoints
- Custom domain names
- Nonpublic certificates and TLS/SSL settings
- Scale settings
- WebJobs schedulers
- IP restrictions
- Always On
- Diagnostic settings
- Cross-origin resource sharing (CORS)
- Managed identities and related settings
- Settings that end with the suffix `_EXTENSION_VERSION`
- Settings that [Service Connector](../articles/service-connector/overview.md) created

> [!NOTE]
> To make settings swappable, add the app setting `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` in every slot of the app. Set its value to `0` or `false`. These settings are either all swappable or all not swappable. You can't make just some settings swappable and not the others. Managed identities are never swapped. This override app setting doesn't affect them.
>
> Certain app settings that apply to unswapped settings are also not swapped. For example, because diagnostic settings aren't swapped, related app settings like `WEBSITE_HTTPLOGGING_RETENTION_DAYS` and `DIAGNOSTICS_AZUREBLOBRETENTIONDAYS` are also not swapped, even if they don't show up as slot settings.
