---
title: Get support for Microsoft Dev Box
description: Learn how to choose the appropriate channel to get support for Microsoft Dev Box, and what options you should try before opening a support request.  
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to 
ms.date: 04/03/2023
ms.custom: template-how-to-pattern
zone_pivot_groups: get-dev-box-support
---

# Get support for Microsoft Dev Box

Multiple channels are available for support in Microsoft Dev Box. The support channel you choose depends on your role and hence your access to existing Dev Box resources. 

## 



:::zone pivot="role-dev-infra-admin"

### Urgent

#### Open an MS support ticket
As an infrastructure administrator, you have access to dev box dev centers, and all other resources in the [Azure portal](https://portal.azure.com). 

If you have an issue that you cannot resolve, open a support request to contact Azure support: [Contact Microsoft Azure Support - Microsoft Support](https://support.microsoft.com/topic/contact-microsoft-azure-support-2315e669-8b1f-493b-5fb1-d88a8736ffe4).

To learn more about support requests, refer to: [Create an Azure support request](https://learn.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).

### Non-urgent
[!INCLUDE [get-support-non-urgent](includes/get-support-non-urgent.md)]

:::zone-end

:::zone pivot="role-devcenter-project-admin"

#### Internal troubleshooting 
As a developer team lead or project admin, you have access to manage projects and pools in the [Azure portal](https://portal.azure.com).

Some basic troubleshooting steps you can try include:
•	If a developer can’t create a dev box from the desired project or pool, ensure they are assigned the Dev Box User role for the project.
•	If a dev box can’t access network services, verify network connectivity for other devices. 

### Urgent
If these basic troubleshooting steps do not resolve the issue, contact your Dev Box dev center administrator (typically a dev infrastructure administrator) or your internal support teams. 

### Non-urgent
[!INCLUDE [get-support-non-urgent](includes/get-support-non-urgent.md)]

:::zone-end

:::zone pivot="role-dev-box-user"

#### Developer Portal
As a developer, you can manage your dev boxes through the [developer portal](https://aka.ms/devbox-portal). You can create dev boxes from pools in the projects you have access to, and you can start, stop, and delete your existing dev boxes.

If you have issues with any of these tasks, contact your developer team lead or project admin for help. They can troubleshoot the issue through the Azure portal and escalate to the dev infra admin if necessary.

:::zone-end


## Next steps
TODO: Add your next step link(s)
