---
author: blackmist
ms.service: machine-learning
ms.topic: include
ms.date: 06/12/2023
ms.author: larryfr
---

+ To deploy resources into a virtual network or subnet, your user account must have permissions to the following actions in Azure role-based access control (Azure RBAC):

    - "Microsoft.Network/*/read" on the virtual network resource. This permission isn't needed for Azure Resource Manager (ARM) template deployments.
    - "Microsoft.Network/virtualNetworks/join/action" on the virtual network resource.
    - "Microsoft.Network/virtualNetworks/subnets/join/action" on the subnet resource.
    
    For more information on Azure RBAC with networking, see the [Networking built-in roles](/azure/role-based-access-control/built-in-roles#networking)