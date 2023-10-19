---
title: How to create authentication credentials for sending emails using SMTP
titleSuffix: An Azure Communication Services Quickstart
description: Learn about how use a service principal to create authentication credentials for sending emails using SMTP.
author: ddouglas
services: azure-communication-services
ms.author: ddouglas
ms.date: 10/18/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: How to create authentication credentials for sending emails using SMTP
In this quick start, you learn about how to use an Entra application to create the authentication credentials for using SMTP to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- An Entra application with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](../../../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Entra application with access to the Azure Communication Service Resource. [Create a new client secret](../../../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret)

## Using a Microsoft Entra application with access to the Azure Communication Services Resource for SMTP

Application developers who have built apps that send email using the SMTP protocol need to implement a secure, modern authentication configuration using Entra application service principals to leverage Azure Communication Services. Combining the Azure Communication Services Resource and the Entra application service principal's information, the SMTP services undertakes authentication with Entra on behalf of the user to ensure a secure and seamless email transmission.

### Assigning a custom role to the Entra application

The Entra application must have the "Microsoft.Communication/CommunicationServices/Read" and
"Microsoft.Communication/EmailServices/write" permissions on the Azure Communication Service Resource. This can be done either by using the Contributor role, or by creating a custom role. Follow these steps to create a custom role by cloning an existing role.

1. In the portal, a custom role can be created by first navigating to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click the **Roles** tab to see a list of all the built-in and custom roles.
1. Search for a role you want to clone such as the Reader role.
1. At the end of the row, click the ellipsis (...) and then click **Clone**.
    :::image type="content" source="../media/smtp-custom-role-clone.png" alt-text="Screenshot that shows cloning a role.":::
1. Click the **Basics** tab and give an name to the new role.
    :::image type="content" source="../media/smtp-custom-role-basics.png" alt-text="Screenshot that shows creating a name for a new custom role.":::
1. Click the **Permissions** tab and click **Add permissions**. Search for **Microsoft.Communication** and select **Azure Communication Services**
    :::image type="content" source="../media/smtp-custom-role-permissions.png" alt-text="Screenshot that shows adding permissions for a new custom role.":::
1. Select the **Microsoft.Communication/CommunicationServices** **Read** and the **Microsoft.Communication/EmailServices** **Write*** permisions. Click **Add**.
    :::image type="content" source="../media/smtp-custom-role-add-permissions.png" alt-text="Screenshot that shows adding Azure Communication Services' permissions.":::
1. Review the permissions for the new role. Click **Review + create** and then **Create** on the next page.
    :::image type="content" source="../media/smtp-custom-role-review.png" alt-text="Screenshot that shows reviewing the new custom role.":::

When assigning the Entra application a role for the Azure Communication Services Resource, the new custom role will be available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md)

### Requirements for SMTP AUTH client submission

- **Authentication**: Username and password authentication is supported using Entra application details as the credentials. The Azure Communication Services SMTP service will use the Entra application details to get an OATH token on behalf of the user and use that to submit the email. To find out more about OAuth, see [Authenticate an IMAP, POP, or SMTP connection using OAuth](https://learn.microsoft.com/en-us/exchange/client-developer/legacy-protocols/how-to-authenticate-an-imap-pop-smtp-application-by-using-oauth). Because the Entra token is not cached, access can be revoked immediately by either changing the Entra application client secret or by changing the access controls for the Azure Communication Services Resource.
- **Azure Communication Service**: An Azure Communication Services Resource with a connected Azure Communication Email Resource and domain are required.
- **Transport Layer Security (TLS)**: Your device must be able to use TLS version 1.2 and above.
- **Port**: Port 587 (recommended) or port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports, especially port 25, because that's the port that email servers use to send mail.
- **DNS**: Use the DNS name smtp.azurecomm.net. Do not use an IP address for the Microsoft 365 or Office 365 server, as IP Addresses are not supported.

### How to set up SMTP AUTH client submission
Enter the following settings directly on your device or in the application as their guide instructs (it might use different terminology than this article). As long as your scenario meets the requirements for SMTP AUTH client submission, the following settings will enable you to send email from your device or application.

| Device or Application setting | Value |
|--|--|
|Server / smart host | smtp.azurecomm.net |
|Port |Port 587 (recommended) or port 25|
|TLS / StartTLS | Enabled|
|Username and password | Enter the sign-in credentials of the hosted mailbox being used|

### Creating the SMTP credentials from the Entra application information.
The SMTP username consists of the Azure Communication Services Resource name, the Entra application client Id, and the Entra application tenant Id. The values are delimited with pipe characters. The SMTP password is the Entra application client secret.

**Format:**
```
username: <Azure Communication Services Resource name>|<Entra application Id>|<tenant Id>
password: <Entra application client secret>
```
