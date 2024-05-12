---
title:  Manage access to Microsoft Copilot for Azure
description: This article describes the limited access policy for Microsoft Copilot for Azure.
ms.date: 05/21/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Manage access to Microsoft Copilot for Azure

> [!IMPORTANT]
> We're currently in the process of rolling out Microsoft Copilot for Azure (preview) to all Azure tenants. We'll remove this note once the functionality is available to all users.

Microsoft Copilot for Azure only has access to resources that the user has access to. It can only take actions that the user has permission to perform, and requires confirmation before making changes. Microsoft Copilot for Azure complies with all existing access management rules and protections such as Azure role-based access control (Azure RBAC), Privileged Identity Management, Azure Policy, and resource locks.

By default, Copilot for Azure is available to all users in a tenant. However, [Global Administrators](/entra/identity/role-based-access-control/permissions-reference#global-administrator) can choose to limit access to Copilot for Azure for their organization. If you turn access off for your tenant, you can still grant access to specific Microsoft Entra users or groups.

[!INCLUDE [preview-note](includes/preview-note.md)]

## Limit user access to Microsoft Copilot for Azure

To limit access to Microsoft Copilot for Azure for users in your tenant, any Global Administrator in that tenant can follow these steps:

1. In the Azure portal, search for **Copilot for Azure admin center** and select it.

1. In **Copilot for Azure admin center**, under **Settings**, select **Access management**.

1. Select the toggle next to **On for entire tenant** to change it to **Off for entire tenant**.

1. To grant access to specific Microsoft Entra users or groups, select **Manage RBAC roles**.

1. Assign the **Copilot for Azure User** role to specific users or groups. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

Global Administrators for a tenant can change the **Access management** selection at any time.

> [!IMPORTANT]
> In order to use Microsoft Copilot for Azure, your organization must allow websocket connections to `https://directline.botframework.com`. Please ask your network administrator to enable this connection.

## Next steps

- [Learn more about Microsoft Copilot for Azure](overview.md).
- Read the [Responsible AI FAQ for Microsoft Copilot for Azure](responsible-ai-faq.md).
- Explore the [capabilities](capabilities.md) of Microsoft Copilot for Azure and learn how to [write effective prompts](write-effective-prompts.md).
