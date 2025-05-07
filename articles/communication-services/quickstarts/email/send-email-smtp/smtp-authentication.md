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

# Set up SMTP authentication for sending emails

This article describes how to use Microsoft Entra ID to create the authentication credentials for using Simple Mail Transfer Protocol (SMTP) to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain [Create Email Communication Resource](../create-email-communication-resource.md).
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Connect an Email Resource with a Communication Resource](../connect-email-communication-resource.md).
- A Microsoft Entra ID with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).
- A client secret for Microsoft Entra ID with access to the Azure Communication Service Resource. [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret).

## Use Microsoft Entra ID with access to the Azure Communication Services Resource for SMTP

Application developers who build apps that send email using the SMTP protocol need to implement secure, modern authentication. Azure Communication Services handles authentication using Microsoft Entra ID service principals. Combining the Azure Communication Services Resource and the Microsoft Entra ID service principal's information, the SMTP services authenticates with Microsoft Entra ID on the user's behalf to ensure a secure and seamless email transmission.

### Create a custom email role for Microsoft Entra ID

You need to assign Microsoft Entra ID a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource. Create a custom email role using either the **Contributor** role, or by creating a **custom role**. Follow these steps to create a custom role by cloning an existing role.

1. In the portal, create a custom role by first navigating to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
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

When assigning Microsoft Entra ID a role for the Azure Communication Services Resource, the new custom role is available. For more information on creating custom roles, see [Create or update Azure custom roles using the Azure portal](../../../../role-based-access-control/custom-roles-portal.md).

### Assign the custom email role to Microsoft Entra ID

1. In the portal, navigate to the subscription, resource group, or Azure Communication Service Resource where you want the custom role to be assignable and then open **Access control (IAM)**.
    :::image type="content" source="../media/smtp-custom-role-iam.png" alt-text="Screenshot that shows Access control.":::
1. Click **+Add** and then select **Add role assignment**.
    :::image type="content" source="../media/email-smtp-add-role-assignment.png" alt-text="Screenshot that shows selecting Add role assignment.":::
1. On the **Role** tab, select the custom role created for sending emails using SMTP and click **Next**.
    :::image type="content" source="../media/email-smtp-select-custom-role.png" alt-text="Screenshot that shows selecting the custom role.":::
1. On the **Members** tab, choose **User, group, or service principal** and then click **+Select members**.
    :::image type="content" source="../media/email-smtp-select-members.png" alt-text="Screenshot that shows choosing select members.":::
1. Use the search box to find the **Microsoft Entra** application that you use for authentication and select it. Then click **Select**.
    :::image type="content" source="../media/email-smtp-select-entra.png" alt-text="Screenshot that shows selecting Microsoft Entra ID.":::
1. After confirming the selection, click **Next**.
    :::image type="content" source="../media/email-smtp-select-review.png" alt-text="Screenshot that shows reviewing the assignment.":::
1. After confirming the scope and members, click **Review + assign**.
    :::image type="content" source="../media/email-smtp-select-assign.png" alt-text="Screenshot that shows assigning the custom role.":::

### Create the SMTP credentials from the Microsoft Entra ID information

#### SMTP Authentication Username

Azure Communication Services enables you to use the credentials for Microsoft Entra ID as the SMTP username and password. The username consists of the following three parts and can be pipe or dot delimited.
1. The Azure Communication Service Resource name.
    :::image type="content" source="../media/email-smtp-resource-name.png" alt-text="Screenshot that shows finding the resource name.":::
1. The Microsoft Entra Application ID.
    :::image type="content" source="../media/email-smtp-entra-details.png" alt-text="Screenshot that shows finding the Microsoft Entra Application ID.":::
1. The Microsoft Entra Tenant ID.
    :::image type="content" source="../media/email-smtp-entra-tenant.png" alt-text="Screenshot that shows finding the Microsoft Entra Tenant ID.":::

**Dot-delimited Format:**

```
username: <Azure Communication Services Resource name>.<Microsoft Entra Application ID>.<Microsoft Entra Tenant ID>
```

**Pipe-delimited Format:**

```
username: <Azure Communication Services Resource name>|<Microsoft Entra Application ID>|<Microsoft Entra Tenant ID>
```

#### SMTP Authentication Password

The password is a Microsoft Entra ID client secret.
    :::image type="content" source="../media/email-smtp-entra-secret.png" alt-text="Screenshot that shows finding the Microsoft Entra client secret.":::

### Requirements for SMTP AUTH client submission

- **Authentication**: Username and password authentication is supported using the Microsoft Entra ID details as the credentials. The Azure Communication Services SMTP service uses the Microsoft Entra ID details to get an access token on behalf of the user and use that to submit the email. The Microsoft Entra ID token isn't cached. So you can revoke access immediately by either changing the Microsoft Entra ID client secret or by changing the access controls for the Azure Communication Services Resource.
- **Azure Communication Service**: An Azure Communication Services Resource with a connected Azure Communication Email Resource and domain is required.
- **Transport Layer Security (TLS)**: Your device must be able to use TLS version 1.2 and above.
- **Port**: Port 587 (recommended) or port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports because that's the port that email servers use to send mail.
- **DNS**: Use the DNS name smtp.azurecomm.net. Don't use an IP address for the Microsoft 365 or Office 365 server, as IP Addresses aren't supported.

### How to set up SMTP AUTH client submission

Enter the following settings directly on your device or in the application as their guide instructs (it might use different terminology than this article). Provided your scenario aligns with the prerequisites for SMTP AUTH client submission, these settings enable you to send emails from your device or application using SMTP Commands.

| Device or Application setting | Value |
| --- | --- |
|Server / smart host | smtp.azurecomm.net |
|Port |Port 587 (recommended) or port 25|
|TLS / StartTLS | Enabled|
|Username and password | Enter the Microsoft Entra ID credentials from an application with access to the Azure Communication Services Resource |
