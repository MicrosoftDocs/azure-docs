---
title: Conditional Access in Azure Synapse Analytics
description: Articles explains conditional access in Azure Synapse Analytics 
author: meenalsri
ms.author: mesrivas
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 09/07/2021
ms.sub-service: security
ms.custom: template-concept
---

# Conditional Access in Azure Synapse Analytics

You can now configure conditional access policies for Azure Synapse workspaces. Conditional access is a tool provided by Microsoft Entra ID to bring several signals such as device type and device IP location together to make decisions to grant access, block access, or enforce multi-factor authentication for a resource. Conditional access policies are configured in Microsoft Entra ID. Learn more about [conditional access](../../active-directory/conditional-access/overview.md).


## Configure conditional access
The following steps show how to configure a conditional access policy for Azure Synapse workspaces.

1. Sign in to the Azure portal using an account with *global administrator permissions*, select **Microsoft Entra ID**, choose **Security** from the menu. 
2. Select **Conditional Access**, then choose **+ New Policy**, and provide a name for the policy.
3. Under **Assignments**, select **Users and groups**, check the **Select users and groups** option, and then select a Microsoft Entra user or group for Conditional access. Click Select, and then click Done.
4. Select **Cloud apps**, click **Select apps**. Select **Microsoft Azure Synapse Gateway**. Then click Select and Done.
5. Under **Access Controls**, select **Grant** and then check the policy you want to apply, and select Done.
6. Set the **Enable policy** toggle to **On**, then select Create.


## Next steps
Learn more about conditional access policies and their components.
- [Common conditional access policies](../../active-directory/conditional-access/concept-conditional-access-policy-common.md)
- [Building a conditional access policy](../../active-directory/conditional-access/concept-conditional-access-policies.md)
