---
title: How to assign Communication and Email Service Owner role or sending emails using SMTP
titleSuffix: An Azure Communication Services Quickstart
description: Learn create a custom role for sending emails using SMTP.
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

The Microsoft Entra application must be assigned a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource. This can be done either by using the **Communication and Email Service Owner** role.

### Assigning the custom email role to the Microsoft Entra application
1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../../media/email-smtp-builtin-select-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../../media/email-smtp-builtin-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Microsoft Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="../../media/email-smtp-builtin-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../../media/email-smtp-builtin-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../../media/email-smtp-builtin-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::