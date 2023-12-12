---
title: How to create authentication credentials for sending emails using SMTP
titleSuffix: An Azure Communication Services Quickstart
description: Learn about how to use a service principal to create authentication credentials for sending emails using SMTP.
author: ddouglas
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: How to create authentication credentials for sending emails using SMTP

[!INCLUDE [Public Preview Notice](../../../includes/public-preview-include-document.md)]

In this quick start, you learn about how to use an Entra application to create the authentication credentials for using SMTP to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- An Entra application with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](../../../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Entra application with access to the Azure Communication Service Resource. [Create a new client secret](../../../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret)

## Using a Microsoft Entra application with access to the Azure Communication Services Resource for SMTP

Application developers who build apps that send email using the SMTP protocol need to implement secure, modern authentication. Azure Communication Services does this by leveraging Entra application service principals. Combining the Azure Communication Services Resource and the Entra application service principal's information, the SMTP services undertakes authentication with Entra on the user's behalf to ensure a secure and seamless email transmission.

### Creating a custom email role for the Entra application

The Entra application must be assigned a role with both the **Microsoft.Communication/CommunicationServices/Read** and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource. This can be done either by using the **Contributor** role, or by creating a **custom role**. Follow these steps to create a custom role by cloning an existing role.

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
1. Select the **Microsoft.Communication/CommunicationServices** **Read** and the **Microsoft.Communication/EmailServices** **Write*** permissions. Click **Add**.
    :::image type="content" source="../media/smtp-custom-role-add-permissions.png" alt-text="Screenshot that shows adding Azure Communication Services' permissions.":::
1. Review the permissions for the new role. Click **Review + create** and then **Create** on the next page.
    :::image type="content" source="../media/smtp-custom-role-review.png" alt-text="Screenshot that shows reviewing the new custom role.":::

When assigning the Entra application a role for the Azure Communication Services Resource, the new custom role will be available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md)

### Assigning the custom email role to the Entra application
1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-select-custom-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Entra** application that you'll use for authentication and select it. Then click **Select**.
    :::image type="content" source="../media/email-smtp-select-entra.png" alt-text="Screenshot that shows selecting the Entra application.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::

### Creating the SMTP credentials from the Entra application information.
#### SMTP Authentication Username
Azure Communication Services allows the credentials for an Entra application to be used as the SMTP username and password. The username consists of three pipe-delimited parts.
1. The Azure Communication Service Resource name.
    :::image type="content" source="../media/email-smtp-resource-name.png" alt-text="Screenshot that shows finding the resource name.":::
1. The Entra Application ID.
    :::image type="content" source="../media/email-smtp-entra-details.png" alt-text="Screenshot that shows finding the Entra Application ID.":::
1. The Entra Tenant ID.
    :::image type="content" source="../media/email-smtp-entra-tenant.png" alt-text="Screenshot that shows finding the Entra Tenant ID.":::

**Format:**
```
username: <Azure Communication Services Resource name>.<Entra Application ID>.<Entra Tenant ID>
OR
username: <Azure Communication Services Resource name>|<Entra Application ID>|<Entra Tenant ID>
```
#### SMTP Authentication Password
The password is one of the Entra application's client secrets.
    :::image type="content" source="../media/email-smtp-entra-secret.png" alt-text="Screenshot that shows finding the Entra client secret.":::

### Requirements for SMTP AUTH client submission

- **Authentication**: Username and password authentication is supported using Entra application details as the credentials. The Azure Communication Services SMTP service will use the Entra application details to get an access token on behalf of the user and use that to submit the email. Because the Entra token isn't cached, access can be revoked immediately by either changing the Entra application client secret or by changing the access controls for the Azure Communication Services Resource.
- **Azure Communication Service**: An Azure Communication Services Resource with a connected Azure Communication Email Resource and domain is required.
- **Transport Layer Security (TLS)**: Your device must be able to use TLS version 1.2 and above.
- **Port**: Port 587 (recommended) or port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports, especially port 25, because that's the port that email servers use to send mail.
- **DNS**: Use the DNS name smtp.azurecomm.net. Don't use an IP address for the Microsoft 365 or Office 365 server, as IP Addresses aren't supported.

### How to set up SMTP AUTH client submission

Enter the following settings directly on your device or in the application as their guide instructs (it might use different terminology than this article). Provided your scenario aligns with the prerequisites for SMTP AUTH client submission, these settings allow you to send emails from your device or application using SMTP Commands.

| Device or Application setting | Value |
|--|--|
|Server / smart host | smtp.azurecomm.net |
|Port |Port 587 (recommended) or port 25|
|TLS / StartTLS | Enabled|
|Username and password | Enter the Entra application credentials from an application with access to the Azure Communication Services Resource |
