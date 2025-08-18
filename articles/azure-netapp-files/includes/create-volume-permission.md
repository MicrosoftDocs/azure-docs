---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 05/07/2024
ms.author: anfdocs

# azure-netapp-files-create-volumes.md
# azure-netapp-files-create-volumes-smb.md
# create-volumes-dual-protocol.md

# Customer intent: "As a cloud administrator, I want to ensure I have the correct permissions configured in my custom role, so that I can successfully create or update a volume in Azure NetApp Files."
---

>[!IMPORTANT]
>If you're using a custom RBAC/IAM role, you must have the `Microsoft.Network/virtualNetworks/subnets/read` permission configured to create or update a volume. 
>
> For more information about permissions and to confirm permissions configuration, see [Create or update Azure custom roles using the Azure portal](../../role-based-access-control/custom-roles-portal.md).