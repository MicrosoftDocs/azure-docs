---
title: Azure Virtual Desktop MSIX app attach overview - Azure
description: What is MSIX app attach? Find out in this article.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/08/2023
ms.author: helohr
manager: femila
---
# What is MSIX app attach?

MSIX is a new packaging format that offers many features aimed to improve packaging experience for all Windows apps. To learn more about MSIX, see the [MSIX overview](/windows/msix/overview).

MSIX app attach is a way to deliver MSIX applications to both physical and virtual machines. However, MSIX app attach is different from regular MSIX because it's made especially for supported products, such as Azure Virtual Desktop. This article will describe what MSIX app attach is and what it can do for you.

## What does MSIX app attach do?

In an Azure Virtual Desktop deployment, MSIX app attach delivers apps to session hosts within [MSIX containers](/windows/msix/msix-container). These containers separate user data, the OS, and apps, increasing security and ensuring easier troubleshooting if something goes wrong. App attach removes the need for repackaging apps when delivering applications dynamically, which increases the speed of deployments and reduces the time it takes for users to sign in to their remote sessions. This rapid delivery reduces operational overhead and costs for your organization.

## Traditional app layering compared to MSIX app attach

The following table compares key feature of MSIX app attach and app layering.

| Feature | Traditional app layering  | MSIX app attach  |
|-----|-----------------------------|--------------------|
| Format               | Different app layering technologies require different proprietary formats. | Works with the native MSIX packaging format.        |
| Repackaging overhead | Proprietary formats require sequencing and repackaging per update.         | Apps published as MSIX don't require repackaging. However, if the MSIX package isn't available, repackaging overhead still applies. |
| Ecosystem            | N/A (for example, vendors don't ship App-V)  | MSIX is Microsoft's mainstream technology that key ISV partners and in-house apps like Office are adopting. You can use MSIX on both virtual desktops and physical Windows computers. |
| Infrastructure       | Additional infrastructure required (servers, clients, and so on) | Storage only   |
| Administration       | Requires maintenance and update   | Simplifies app updates |
| User experience      | Impacts user sign-in time. Boundary exists between OS state, app state, and user data.  | Delivered apps are indistinguishable from locally installed applications. |

## Next steps

If you want to learn more about MSIX app attach, check out our [glossary](app-attach-glossary.md) and [FAQ](app-attach-faq.yml). Otherwise, get started with [Set up MSIX app attach with the Azure portal](app-attach-azure-portal.md).
