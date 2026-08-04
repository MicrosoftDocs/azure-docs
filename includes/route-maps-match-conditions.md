---
author: duongau
ms.author: duau
ms.service: azure-virtual-wan
ms.topic: include
ms.date: 06/02/2026
---

| Property | Criterion | Value (example) | Interpretation |
|---|---|---|---|
| Route-prefix | Equals | 10.1.0.0/16, 10.2.0.0/16, 10.3.0.0/16 | Matches these routes only. Specific prefixes underneath these routes aren't matched. |
| Route-prefix | Contains | 10.1.0.0/16, 192.168.16.0/24 | Matches all specified routes and all prefixes underneath them. For example, 10.1.5.0/24 is underneath 10.1.0.0/16. |
| Community | Equals | 65001:100, 65001:200 | The route's Community property must have both communities. Order isn't relevant. |
| Community | Contains | 65001:100, 65001:200 | The route's Community property can have one or more of the specified communities. |
| AS-Path | Equals | 65001, 65002, 65003 | AS-PATH of the routes must have ASNs listed in the specified order. |
| AS-Path | Contains | 65001, 65002, 65003 | AS-PATH in the routes can contain one or more of the ASNs listed. Order isn't relevant. |
