---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

The following article addresses frequently asked questions about the self-hosted version of the portal. For general FAQ, please refer to [the official Azure documentation](https://aka.ms/apimdocs/portal).

## Local development of my portal is no longer working...

If your local version of the developer portal cannot save or retrieve information from the Storage Account or API Management instance, the SAS tokens may have expired. You can fix that by generating new tokens. For instructions, refer to **Step 2: Configure** from the [self-hosted portal tutorial](Self-hosting-the-portal).

## How can I remove the content provisioned to my API Management service?

Provide the required parameters in the `scripts/cleanup.bet` script and execute it:

```sh
cd scripts
.\cleanup.bat
cd ..
```
