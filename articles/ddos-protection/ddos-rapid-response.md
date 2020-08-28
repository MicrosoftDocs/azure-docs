---
title: Azure DDoS Rapid Response
description: Learn how to engage DDoS experts during an active attack for specialized support.
services: ddos-protection
documentationcenter: na
author: aletheatoh
ms.service: ddos-protection
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/28/2020
ms.author: aletheatoh

---
# Azure DDoS Rapid Response

DDoS Protection Standard customers now have access to Rapid Response team during an active attack. DRR can help with attack investigation, custom mitigations during an attack and post-attack analysis.

## Follow the steps below to engage DRR during an active attack:

1. From Azure Portal while creating a new support request, choose **Issue Type** as Technical.
2. Choose **Service** as **DDOS Protection**.
3. Choose a resource in the resource drop down menu. _You must select a DDoS Plan that’s linked to the virtual network being protected by DDoS Protection Standard to engage DRR._

![Choose Resource](./media/ddos-rapid-response/choose-resource.png)

4. On the next **Problem** page select the **severity** as A -Critical Impact and **Problem Type** as ‘Under attack.’

![PSeverity and Problem Type](./media/ddos-rapid-response/severity-and-problem-type.png)

5. Complete additional details and submit the support request.

DRR follows the Azure Rapid Response support model. Refer to [Support scope and responsiveness](https://azure.microsoft.com/en-us/support/plans/response/) for more information on Rapid Response..

To learn more, read the [DDoS Protection Standard documentation](https://docs.microsoft.com/en-us/azure/virtual-network/ddos-protection-overview).