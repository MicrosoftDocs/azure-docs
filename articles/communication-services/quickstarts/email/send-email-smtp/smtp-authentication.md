---
title: Set up SMTP authentication for sending emails
titleSuffix: An Azure Communication Services article
description: This article describes how to use a service principal to create authentication credentials for sending emails using Simple Mail Transfer Protocol (SMTP).
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Create credentials for Simple Mail Transfer Protocol (SMTP) authentication

This article describes how to use a Microsoft Entra application to create the authentication credentials for using Simple Mail Transfer Protocol (SMTP) to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain. [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- A Microsoft Entra application with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Microsoft Entra application with access to the Azure Communication Service Resource. [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret)

## Use a Microsoft Entra application for SMTP authentication

Application developers who build apps that send email using the SMTP protocol need to implement secure, modern authentication. Azure Communication Services uses Microsoft Entra application service principals to provide secure authentication. Link a Microsoft Entra application to the Communication Service resource by creating an SMTP Username resource.

The SMTP service uses the Microsoft Entra application information linked to the SMTP username to authenticate with Microsoft Entra on the user's behalf to ensure a secure and seamless email transmission. SMTP username resources are user-defined and can use either email format or freeform. If an SMTP username uses the email format, the domain must be one of the Communication Service resource's linked domains.

## Assign a role to the Microsoft Entra application

You also need to give the Microsoft Entra application access to the Communication resource using either a built-in role or a custom role with the required permissions.

#### [Built-in role](#tab/built-in-role)
### Assign the built-in Communication and Email Service Owner role to the Microsoft Entra application
Assign the **Communication and Email Service Owner** role to a Microsoft Entra application to give it access to a Communication Service resource.

1. In the portal, navigate to the Azure Communication Service Resource used to send emails using SMTP and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control for the Communication resource." lightbox="../media/smtp-custom-role-iam-expanded.png":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment for the Communication resource." lightbox="../media/email-smtp-add-role-assignment-expanded.png":::
1. On the **Role** tab, select the **Communication and Email Service Owner** role for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-builtin-select-role.png" alt-text="Screenshot that shows selecting the built-in role." lightbox="../media/email-smtp-builtin-select-role-expanded.png":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-builtin-select-members.png" alt-text="Screenshot that shows choosing select members for the built-in role." lightbox="../media/email-smtp-builtin-select-members-expanded.png":::
1. Use the search box to find the Microsoft Entra application that you use for authentication and select it. Then click Select.
    :::image type="content" source="../media/email-smtp-builtin-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application that gets the built-in role." lightbox="../media/email-smtp-builtin-select-entra-expanded.png":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-builtin-select-review.png" alt-text="Screenshot that shows reviewing the assignment for the built-in role." lightbox="../media/email-smtp-builtin-select-review-expanded.png":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-builtin-select-assign.png" alt-text="Screenshot that shows assigning the built-in role." lightbox="../media/email-smtp-builtin-select-assign-expanded.png":::

#### [Custom role](#tab/custom-role)
### Use a custom role to limit permissions granted to the Microsoft Entra Application

The **Communication and Email Service Owner** role gives access to all Communication and Email service operations. You can create a custom role to limit access to only the operations needed to send emails using SMTP. Assign the Microsoft Entra application a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource.

#### Create a custom email role for the Microsoft Entra application
1. In the portal, create a custom role by first navigating to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control." lightbox="../media/smtp-custom-role-iam-expanded.png":::
1. Click the **Roles** tab to see a list of all the built-in and custom roles.
1. Search for a role you want to clone such as the Reader role.
1. At the end of the row, click the ellipsis (...) and then click **Clone**.
    :::image type="content" source="../media/smtp-custom-role-clone.png" alt-text="Screenshot that shows cloning a role." lightbox="../media/smtp-custom-role-clone-expanded.png":::
1. Click the **Basics** tab and give a name to the new role.
    :::image type="content" source="../media/smtp-custom-role-basics.png" alt-text="Screenshot that shows creating a name for a new custom role." lightbox="../media/smtp-custom-role-basics-expanded.png":::
1. Click the **Permissions** tab and click **Add permissions**.
    :::image type="content" source="../media/smtp-custom-role-click-add-permissions.png" alt-text="Screenshot that shows how to add permissions to custom role." lightbox="../media/smtp-custom-role-click-add-permissions-expanded.png":::
1. Search for **Microsoft.Communication** and select **Azure Communication Services**
    :::image type="content" source="../media/smtp-custom-role-permissions.png" alt-text="Screenshot that shows adding permissions for a new custom role." lightbox="../media/smtp-custom-role-permissions-expanded.png":::
1. Select the **Microsoft.Communication/CommunicationServices** **Read**, **Microsoft.Communication/CommunicationServices** **Write**, and the **Microsoft.Communication/EmailServices** **Write** permissions. Click **Add**.
    :::image type="content" source="../media/smtp-custom-role-add-permissions.png" alt-text="Screenshot that shows adding Azure Communication Services' permissions." lightbox="../media/smtp-custom-role-add-permissions-expanded.png":::
1. Review the permissions for the new role. Click **Review + create** and then **Create** on the next page.
    :::image type="content" source="../media/smtp-custom-role-review.png" alt-text="Screenshot that shows reviewing the new custom role." lightbox="../media/smtp-custom-role-review-expanded.png":::

When you assign the Microsoft Entra application a role for the Azure Communication Services Resource, the new custom role is now available. For more information about creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md).

#### Assign the custom email role to the Microsoft Entra application
1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control." lightbox="../media/smtp-custom-role-iam-expanded.png":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment." lightbox="../media/email-smtp-add-role-assignment-expanded.png":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-select-custom-role.png" alt-text="Screenshot that shows selecting the custom role." lightbox="../media/email-smtp-select-custom-role-expanded.png":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-select-members.png" alt-text="Screenshot that shows choosing select members." lightbox="../media/email-smtp-select-members-expanded.png":::
1. Use the search box to find the **Microsoft Entra** application that you use for authentication and select it. Then click **Select**.
    :::image type="content" source="../media/email-smtp-select-entra.png" alt-text="Screenshot that shows selecting Microsoft Entra ID." lightbox="../media/email-smtp-select-entra-expanded.png":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-select-review.png" alt-text="Screenshot that shows reviewing the assignment." lightbox="../media/email-smtp-select-review-expanded.png":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-select-assign.png" alt-text="Screenshot that shows assigning the custom role." lightbox="../media/email-smtp-select-assign-expanded.png":::

---

## Create an SMTP Username using the Azure portal
1. In the portal, navigate to the Azure Communication Service Resource and then open **SMTP Usernames**.
    :::image type="content" source="../media/smtp-usernames-1-username-blade.png" alt-text="Screenshot that shows SMTP Usernames." lightbox="../media/smtp-usernames-1-username-blade-expanded.png":::
1. Click **+Add SMTP Username** and then select the Microsoft Entra application. If the Microsoft Entra application doesn't appear in the drop-down, see the previous steps to assign a role. The username can be custom text or an email address.
    :::image type="content" source="../media/smtp-usernames-2-add-smtp-username.png" alt-text="Screenshot that shows adding an SMTP username." lightbox="../media/smtp-usernames-2-add-smtp-username-expanded.png":::
1. Verify the SMTP Username is in the list. The status changes to **Ready to use** once all of the requirements for sending an email using the username and SMTP are met.
    :::image type="content" source="../media/smtp-usernames-3-list.png" alt-text="Screenshot that shows newly created SMTP username in the list." lightbox="../media/smtp-usernames-3-list-expanded.png":::

## SMTP authentication password
The password is one of the Microsoft Entra application's client secrets.
    :::image type="content" source="../media/email-smtp-entra-secret.png" alt-text="Screenshot that shows finding the Microsoft Entra client secret." lightbox="../media/email-smtp-entra-secret-expanded.png":::

## Requirements for SMTP AUTH client submission

- **Authentication**: Username and password authentication is supported using an SMTP username linked to Microsoft Entra application details. The Azure Communication Services SMTP service uses the Microsoft Entra application user's details to get an access token on behalf of the user and uses that to submit the email.
- **Azure Communication Service**: An Azure Communication Services Resource with a connected Azure Communication Email Resource and domain is required.
- **Transport Layer Security (TLS)**: Your device must be able to use TLS version 1.2 and above.
- **Port**: Port 587 (recommended) or port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports because that's the port that email servers use to send mail.
- **DNS**: Use the DNS name smtp.azurecomm.net. Don't use an IP address for the Microsoft 365 or Office 365 server, as IP Addresses aren't supported.

## How to set up SMTP AUTH client submission

Enter the following settings directly on your device or in the application as their guide instructs (it might use different terminology than this article). Provided your scenario aligns with the prerequisites for SMTP AUTH client submission, these settings enable you to send emails from your device or application using SMTP Commands.

| Device or Application setting | Value |
| --- | --- |
|Server / smart host | smtp.azurecomm.net |
|Port |Port 587 (recommended) or port 25|
|TLS / StartTLS | Enabled|
|Username and password | Enter the SMTP Username and one Microsoft Entra application's client secrets. |
