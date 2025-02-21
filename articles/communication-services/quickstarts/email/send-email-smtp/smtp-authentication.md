---
title: How to create authentication credentials for sending emails using SMTP
titleSuffix: An Azure Communication Services Quickstart
description: Learn about how to use a service principal to create authentication credentials for sending emails using SMTP.
author: ddouglas-msft
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: How to assign a role to an Entra application for SMTP authentication

In this quick start, you learn about how to use an Entra application to create the authentication credentials for using SMTP to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- A Microsoft Entra application with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Microsoft Entra application with access to the Azure Communication Service Resource. [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret)

## Using a Microsoft Entra Application for SMTP authentication

Application developers who build apps that send email using the SMTP protocol need to implement secure, modern authentication. Azure Communication Services does this by leveraging Microsoft Entra application service principals. Combining the Azure Communication Services Resource and the Microsoft Entra application service principal's information, the SMTP services undertakes authentication with Microsoft Entra on the user's behalf to ensure a secure and seamless email transmission. After creating a Microsoft Entra application, the application is linked to the Communication Service resource by creating an SMTP Username resource. SMTP Username resources are user-defined and can be either use an email format or be freeform. If an SMTP username uses the email format, the domain must be one of the Communication Service resource's linked domains. The Microsoft Entra application must also be given access to the Communication resource using either a built-in role or a custom role with the required permissions.

## Creating an SMTP Username using the Azure Portal
1. In the portal, navigate to the Azure Communication Service Resource and then open **SMTP Usernames**.
    :::image type="content" source="../media/smtpusernames-1-usernameblade.png" alt-text="Screenshot that shows SMTP Usernames.":::
1. Click **+Add* SMTP Username* and then select the Entra application. The username can be cursom text or an email address.
    :::image type="content" source="../media/smtpusernames-2-addsmtpusername.png" alt-text="Screenshot that shows adding an SMTP username.":::
1. The SMTP Username will now appear in the list. The status will be **Ready to use** if all of the requirements for sending an email using the username and SMTP have been met.
    :::image type="content" source="../media/smtpusernames-3-list.png" alt-text="Screenshot that shows newly created SMTP username in the list.":::

## Assigning the built-in 'Communication and Email Service Owner' role to the Microsoft Entra application
The **Communication and Email Service Owner** role can be assigned to an Entra application to give it access to a Communication Service resource.

1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the **Communication and Email Service Owner** role for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-builtin-select-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-builtin-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Microsoft Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="../media/email-smtp-builtin-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-builtin-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-builtin-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::

## Using a custom role to limit permissions granted to the Microsoft Entra Application

The **Communication and Email Service Owner** role gives access to all Communication and Email service operations. To limit access to only the operations needed to send emails using SMTP, a custom role can be created. The Microsoft Entra application must be assigned a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource.

### Creating a custom email role for the Microsoft Entra application
1. In the portal, a custom role can be created by first navigating to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click the **Roles** tab to see a list of all the built-in and custom roles.
1. Search for a role you want to clone such as the Reader role.
1. At the end of the row, click the ellipsis (...) and then click **Clone**.
    :::image type="content" source="../media/smtp-custom-role-clone.png" alt-text="Screenshot that shows cloning a role.":::
1. Click the **Basics** tab and give a name to the new role.
    :::image type="content" source="../media/smtp-custom-role-basics.png" alt-text="Screenshot that shows creating a name for a new custom role.":::
1. Click the **Permissions** tab and click **Add permissions**. Search for **Microsoft.Communication** and select **Azure Communication Services**
    :::image type="content" source="../media/smtp-custom-role-permissions.png" alt-text="Screenshot that shows adding permissions for a new custom role.":::
1. Select the **Microsoft.Communication/CommunicationServices** **Read**, **Microsoft.Communication/CommunicationServices** **Write**, and the **Microsoft.Communication/EmailServices** **Write** permissions. Click **Add**.
    :::image type="content" source="../media/smtp-custom-role-add-permissions.png" alt-text="Screenshot that shows adding Azure Communication Services' permissions.":::
1. Review the permissions for the new role. Click **Review + create** and then **Create** on the next page.
    :::image type="content" source="../media/smtp-custom-role-review.png" alt-text="Screenshot that shows reviewing the new custom role.":::

When assigning the Microsoft Entra application a role for the Azure Communication Services Resource, the new custom role will be available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md)

### Assigning the custom email role to the Microsoft Entra application
1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-select-custom-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Microsoft Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="../media/email-smtp-select-entra.png" alt-text="Screenshot that shows selecting the Microsoft Entra application.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::