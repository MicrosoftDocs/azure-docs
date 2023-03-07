---
author: sgilley
ms.service: machine-learning
ms.topic: include
ms.date: 10/21/2021
ms.author: sdgilley
---

To get more accurate labels, use the **Quality control** page to send each item to multiple labelers.

> [!IMPORTANT]
> Consensus labeling is currently in public preview.
>
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To have each item sent to multiple labelers, select **Enable consensus labeling (preview)**. Then set values for **Minimum labelers** and **Maximum labelers** to specify how many labelers to use.  Make sure that you have as many labelers available as your maximum number. You *can't* change these settings after the project has started.

If a consensus is reached from the minimum number of labelers, the item is labeled. If a consensus isn't reached, the item is sent to more labelers. If there's no consensus after the item goes to the maximum number of labelers, its status is **Needs Review**, and the project owner is responsible for labeling the item.
