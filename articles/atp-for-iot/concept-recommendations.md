---

title: Understand ATP for IoT security recommendations Preview| Microsoft Docs
description: Learn about the concept of security recommendations and how they are used in ATP for IoT. 
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid:02ced504-d3aa-4770-9d10-b79f80af366c
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2019
ms.author: mlottner

---
# Security recommendations
> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Device recommendations

| Severity | Name                                         | Data Source | Description                                                                                     |
|----------|----------------------------------------------|-------------|-------------------------------------------------------------------------------------------------|
| Medium   | CIS Baseline scanning                        | Agent       | Device doesn't comply with [CIS Linux benchmarks](https://www.cisecurity.org/cis-benchmarks/)|
| Medium   | Listening Ports                              | Agent       | Device actively listening to an external port  |

