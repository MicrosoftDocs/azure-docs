---
author: PerfectChaos
ms.author: chaoschhapi
ms.date: 08/22/2025
ms.topic: include
ms.service: azure-operator-nexus
---

## How to view the full output of a command in the associated Storage Account

[!INCLUDE [command-output-access](./command-output-access.md)]

With the necessary permissions and access configured, you can then use the link or command from the output summary to download the zipped output file (tar.gz).

You can also download it via the Azure portal:

1. From the Azure portal, navigate to the Storage Account.
1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.
1. In the Storage browser details, select on **Blob containers**.
1. Select the blob container.
1. Select the output file from the command. The file name can be identified from the output summary. Additionally, the **Last modified** timestamp aligns with when the command was executed.
1. You can manage & download the output file from the **Overview** pop-out.
