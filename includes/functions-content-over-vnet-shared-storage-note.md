---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/03/2024
ms.author: glenga
---

> [!NOTE]
> Multiple function apps hosted in the same plan can also use the same storage account for the content share (defined by `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` and `WEBSITE_CONTENTSHARE`). In such a scenario, all of these apps should also use the same value for `vnetContentShareEnabled` (formerly `WEBSITE_CONTENTOVERVNET`) to guarantee that traffic is consistently routed through the intended network. A mismatch in this setting between apps using the same content share might result in traffic being routed through public networks, which causes access to be blocked by storage account network rules.