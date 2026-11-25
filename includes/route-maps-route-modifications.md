---
author: duongau
ms.author: duau
ms.service: azure-virtual-wan
ms.topic: include
ms.date: 06/02/2026
---

| Property | Action | Value | Interpretation |
|---|---|---|---|
| Route-prefix | Drop | 10.3.0.0/8, 10.4.0.0/8 | The routes specified in the rule are dropped. |
| Route-prefix | Replace | 10.0.0.0/8, 192.168.0.0/16 | Replace all the matched routes with the routes specified in the rule. |
| AS-Path | Add | 64580, 64581 | Prepend AS-PATH with the list of ASNs specified in the rule. These ASNs are applied in the same order for the matched routes. |
| AS-Path | Replace | 65004, 65005 | AS-PATH is set to this list in the same order for every matched route. See key considerations for reserved AS numbers. |
| AS-Path | Replace | (no value specified) | Remove all ASNs in the AS-PATH in the matched routes. |
| Community | Add | 64580:300, 64581:300 | Add all the listed communities to all the matched routes' Community attribute. |
| Community | Replace | 64580:300, 64581:300 | Replace Community attribute for all the matched routes with the list provided. |
| Community | Replace | (no value specified) | Remove Community attribute from all the matched routes. |
| Community | Remove | 65001:100, 65001:200 | Remove any of the listed communities that are present in the matched routes' Community attribute. |
