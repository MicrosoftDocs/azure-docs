---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 06/18/2019
ms.author: cephalin
---

When you clone configuration from another deployment slot, the cloned configuration is editable. Some configuration elements follow the content across a swap (not slot specific), whereas other configuration elements stay in the same slot after a swap (slot specific). The following lists show the settings that change when you swap slots.

**Settings that are swapped**:

* General settings, such as framework version, 32/64-bit, web sockets
* App settings (can be configured to stick to a slot)
* Connection strings (can be configured to stick to a slot)
* Handler mappings
* Monitoring and diagnostic settings
* Public certificates
* WebJobs content
* Hybrid connections *
* Virtual network integration *
* Service endpoints *
* Azure Content Delivery Network *

Features marked with an asterisk (*) are planned to be made sticky to the slot. 

**Settings that aren't swapped**:

* Publishing endpoints
* Custom domain names
* Private certificates and SSL bindings
* Scale settings
* WebJobs schedulers
* IP restrictions
* Always On
* Protocol settings (HTTPS, TLS version, client certificates)
* Diagnostic log settings
* Cross-origin resource sharing (CORS)

<!-- VNET and hybrid connections not yet sticky to slot -->