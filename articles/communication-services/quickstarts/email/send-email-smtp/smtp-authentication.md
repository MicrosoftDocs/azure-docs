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
- An Azure Email Communication Services Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- An Entra application with access to the Communication Resource. [Register an application with Microsoft Entra ID and create a service principal](../../../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Entra application with access to the Communication Resource. [Create a new client secret](../../../../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret)

## Using a Microsoft Entra application to the Communication Resource for SMTP
Sending an email using Azure Communications and SMTP requires a Entra application for authentication. Details about the Entra application as well as one of its client secrets are passed to SMTP as the username and password. The SMTP service will use this information to authenticate with Entra on behalf of the user.

### Assigning a custom role to the Entra application
The Entra application must have the "Microsoft.Communication/CommunicationServices/Read" and
"Microsoft.Communication/EmailServices/write" permissions on the communication resource. This can be done either by using the Contributor role, or by creating a custom role. Follow these steps to create a custom role by cloning an existing role.

1. In the portal, a custom role can be created by first navigating to the subscription, resource group, or communication resource where you want the custom role to be assignable and then open **Access control (IAM)**.
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

When assigning the Entra application a role for the Communication Resource, the new custom role will be available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md)

### Creating the SMTP credentials from the Entra application information.
The SMTP username consists of the Communication Resource name, the Entra application client Id, and the Entra application tenant Id. The values are delimited with pipe characters. The SMTP password is the Entra application client secret.

**Format:**
```
username: <Communication Resource name>|<Entra application Id>|<tenant Id>
password: <Entra application client secret>
```

**Example:**
```
username: acsemail-smtp-example|6003aadf-4bb7-4cc2-addc-05eed5ff3b79|00f50ff1-aaa4-4bbb-9ccf-0123455a95aa
password: nWu9HVZ7Rnj.2y7XSkVyUngZ][x9Z:e
```
