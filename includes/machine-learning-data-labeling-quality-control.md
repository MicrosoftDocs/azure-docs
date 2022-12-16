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
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Select **Enable consensus labeling (preview)** to have each item sent to multiple labelers.  Then set the **Minimum labelers** and **Maximum labelers** to specify how many labelers to use.  Make sure you have as many labelers available as your maximum number. You can't later change these settings once the project has started.

If a consensus is reached from the minimum number of labelers, the item is labeled.  If a consensus isn't reached, the item will be sent to more labelers.  If there's no consensus after the item goes to the maximum number of labelers, its status will be `Needs Review`, and the project owner will be responsible for labeling the item.
