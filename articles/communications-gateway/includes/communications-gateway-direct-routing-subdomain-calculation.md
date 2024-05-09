---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 04/04/2024
---
1. Choose a suitable customer-specific DNS label to form the subdomains.
    - The label must be up to **nine** characters in length and can only contain letters, numbers, underscores, and dashes.
    - You must not use wildcard subdomains or subdomains with multiple labels.
    - For example, you could allocate the label `contoso`.
    > [!IMPORTANT]
    > The full customer subdomains (including the per-region domain names) must be a maximum of 48 characters. Microsoft Entra ID does not support domain names of more than 48 characters. For example, the customer subdomain `contoso1.1r1.a1b2c3d4e5f6g7h8.commsgw.azure.com` is 48 characters.