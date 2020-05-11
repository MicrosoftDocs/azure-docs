---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 09/18/2019
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
* Virtual network integration *
* Service endpoints *
* Azure Content Delivery Network *

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

> [!NOTE]
> Certain app settings that apply to unswapped settings are also not swapped. For example, since diagnostic settings are not swapped, related app settings like `WEBSITE_HTTPLOGGING_RETENTION_DAYS` and `DIAGNOSTICS_AZUREBLOBRETENTIONDAYS` are also not swapped, even if they don't show up as slot settings.
>
