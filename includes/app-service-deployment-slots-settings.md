---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 09/09/2021
ms.author: cephalin
---

When you clone configuration from another deployment slot, the cloned configuration is editable. Some configuration elements follow the content across a swap (not slot specific), whereas other configuration elements stay in the same slot after a swap (slot specific). The following lists show the settings that change when you swap slots.

**Settings that are swapped**:

* General settings, such as framework version, 32/64-bit, web sockets
* App settings (can be configured to stick to a slot)
* Connection strings (can be configured to stick to a slot)
* Handler mappings
* Public certificates
* WebJobs content
* Hybrid connections *
* Service endpoints *
* Azure Content Delivery Network *
* Path mappings

Features marked with an asterisk (*) are planned to be unswapped. 

**Settings that aren't swapped**:

* Publishing endpoints
* Custom domain names
* Non-public certificates and TLS/SSL settings
* Scale settings
* WebJobs schedulers
* IP restrictions
* Always On
* Diagnostic settings
* Cross-origin resource sharing (CORS)
* Virtual network integration
* Managed identities and related settings
* Settings that end with the suffix _EXTENSION_VERSION
* Settings that created by [Service Connector](../articles/service-connector/overview.md)

> [!NOTE]
> To make aforementioned settings swappable, add the app setting `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` in every slot of the app and set its value to `0` or `false`. These settings are either all swappable or not at all. You can't make just some settings swappable and not the others. Managed identities are never swapped and are not affected by this override app setting.
>
> Certain app settings that apply to unswapped settings are also not swapped. For example, since diagnostic settings are not swapped, related app settings like `WEBSITE_HTTPLOGGING_RETENTION_DAYS` and `DIAGNOSTICS_AZUREBLOBRETENTIONDAYS` are also not swapped, even if they don't show up as slot settings.
>
