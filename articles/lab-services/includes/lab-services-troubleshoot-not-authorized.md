---
ms.service: lab-services
ms.topic: include
author: ntrogh
ms.author: nicktrog
ms.date: 11/29/2022
---

### Lab creation fails with `You are not authorized to access this resource`

When you create a new lab plan, it might take a few minutes for the permissions to propagate to the lab level. You can assign the Lab Creator role at the resource group level to prevent this behavior:

1. In the [Azure portal](https://portal.azure.com), go to the resource group that contains the lab plan.
1. Select **Access control (IAM)** from the left navigation.
1. Select **Add** > **Add role assignment**.
1. Assign the **Lab Creator** role to the user account.
