---
author: duongau
ms.author: duau
ms.service: azure-virtual-wan
ms.topic: include
ms.date: 06/02/2026
---

- Don't use private ASNs for AS prepending.
- Don't use ASNs reserved by Azure for AS prepending:

    - Public ASNs: 8074, 8075, 12076
    - Private ASNs: 65515, 65517, 65518, 65519, 65520

- Don't remove the Azure BGP communities:

    - 65517:12001, 65517:12002, 65517:12003, 65517:12005, 65517:12006, 65518:65518, 65517:65517, 65517:12076, 65518:12076, 65515:10000, 65515:20000

- Route maps only supports 2-byte ASN numbers.
