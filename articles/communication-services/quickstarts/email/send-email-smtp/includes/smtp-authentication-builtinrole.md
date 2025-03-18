---
title: include file
description: Assign a built-in role for authentication
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 3/18/2025
ms.topic: include
ms.service: azure-communication-services
---

## Assign the built-in Communication and Email Service Owner role to the Microsoft Entra application
Assign the **Communication and Email Service Owner** role to a Microsoft Entra application to give it access to a Communication Service resource.

1. In the portal, navigate to the Azure Communication Service Resource used to send emails using SMTP and then open **Access control (IAM)**.
    :::image type="content" source="../../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control for the Communication resource.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment for the Communication resource.":::
1. On the **Role** tab, select the **Communication and Email Service Owner** role for sending emails using SMTP and click **Next**.
    :::image type="content" source="../../media/email-smtp-builtin-select-role.png" alt-text="Screenshot that shows selecting the built-in role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../../media/email-smtp-builtin-select-members.png" alt-text="Screenshot that shows choosing select members for the built-in role.":::
1. Use the search box to find the **Microsoft Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="..././media/email-smtp-builtin-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application that will get the built-in role.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../../media/email-smtp-builtin-select-review.png" alt-text="Screenshot that shows reviewing the assignment for the built-in role.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../../media/email-smtp-builtin-select-assign.png" alt-text="Screenshot that shows assigning the built-in role.":::