---
title: How to assign a custom role or sending emails using SMTP
titleSuffix: An Azure Communication Services Quickstart
description: Learn create a custom role for sending emails using SMTP.
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

## Creating a custom email role for the Microsoft Entra application

The Microsoft Entra application must be assigned a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource. This can be done either by using the **Contributor** role, or by creating a **custom role**. Follow these steps to create a custom role by cloning an existing role.

1. In the portal, a custom role can be created by first navigating to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click the **Roles** tab to see a list of all the built-in and custom roles.
1. Search for a role you want to clone such as the Reader role.
1. At the end of the row, click the ellipsis (...) and then click **Clone**.
    :::image type="content" source="../../media/smtp-custom-role-clone.png" alt-text="Screenshot that shows cloning a role.":::
1. Click the **Basics** tab and give a name to the new role.
    :::image type="content" source="../../media/smtp-custom-role-basics.png" alt-text="Screenshot that shows creating a name for a new custom role.":::
1. Click the **Permissions** tab and click **Add permissions**. Search for **Microsoft.Communication** and select **Azure Communication Services**
    :::image type="content" source="../../media/smtp-custom-role-permissions.png" alt-text="Screenshot that shows adding permissions for a new custom role.":::
1. Select the **Microsoft.Communication/CommunicationServices** **Read**, **Microsoft.Communication/CommunicationServices** **Write**, and the **Microsoft.Communication/EmailServices** **Write** permissions. Click **Add**.
    :::image type="content" source="../../media/smtp-custom-role-add-permissions.png" alt-text="Screenshot that shows adding Azure Communication Services' permissions.":::
1. Review the permissions for the new role. Click **Review + create** and then **Create** on the next page.
    :::image type="content" source="../../media/smtp-custom-role-review.png" alt-text="Screenshot that shows reviewing the new custom role.":::

When assigning the Microsoft Entra application a role for the Azure Communication Services Resource, the new custom role will be available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../../role-based-access-control/custom-roles-portal.md)

### Assigning the custom email role to the Microsoft Entra application
1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../../media/email-smtp-select-custom-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../../media/email-smtp-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Microsoft Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="../../media/email-smtp-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../../media/email-smtp-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../../media/email-smtp-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::