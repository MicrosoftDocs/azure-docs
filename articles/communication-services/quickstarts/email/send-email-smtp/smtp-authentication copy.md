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
zone_pivot_groups: acs-smtp-role-assignment
---

- id: acs-smtp-role-assignment
  title: SMTP Sending Method
  prompt: Choose a role type
  pivots:
  - id: smtp-role-builtin
    title: Built-in Role
  - id: smtp-role-custom
    title: Custom Role

# Quickstart: How to create authentication credentials for sending emails using SMTP

In this quick start, you learn about how to use an Entra application to create the authentication credentials for using SMTP to send an email using Azure Communication Services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An Azure Communication Email Resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Azure Communication Services Resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)
- A Microsoft Entra application with access to the Azure Communication Services Resource. [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal)
- A client secret for the Microsoft Entra application with access to the Azure Communication Service Resource. [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret)

## Using a Microsoft Entra application with access to the Azure Communication Services Resource for SMTP

Application developers who build apps that send email using the SMTP protocol need to implement secure, modern authentication. Azure Communication Services does this by leveraging Microsoft Entra application service principals. Combining the Azure Communication Services Resource and the Microsoft Entra application service principal's information, the SMTP services undertakes authentication with Microsoft Entra on the user's behalf to ensure a secure and seamless email transmission.

### Creating a custom email role for the Microsoft Entra application

The Microsoft Entra application must be assigned a role with both the **Microsoft.Communication/CommunicationServices/Read**, **Microsoft.Communication/CommunicationServices/Write**, and the **Microsoft.Communication/EmailServices/write** permissions on the Azure Communication Service Resource. This can be done either by using the **Contributor** role, or by creating a **custom role**. This can be done using the built-in **Communication and Email Service Owner** role or by creating a custom role.

::: zone pivot="smtp-role-builtin"
[!INCLUDE [Entra access using built-in role](./includes/smtp-authentication-role-builtin.md)]
::: zone-end

::: zone pivot="smtp-role-custom"
[!INCLUDE [Entra access using custom role](./includes/smtp-authentication-role-custom.md)]
::: zone-end

### Creating the SMTP credentials from the Microsoft Entra application information.
#### SMTP Authentication Username
Azure Communication Services allows the credentials for a Microsoft Entra application to be used as the SMTP username and password. The username consists of the following three parts and can be pipe or dot delimited.
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
The password is one of the Microsoft Entra application's client secrets.
    :::image type="content" source="../media/email-smtp-entra-secret.png" alt-text="Screenshot that shows finding the Microsoft Entra client secret.":::

### Requirements for SMTP AUTH client submission

- **Authentication**: Username and password authentication is supported using the Microsoft Entra application details as the credentials. The Azure Communication Services SMTP service will use the Microsoft Entra application details to get an access token on behalf of the user and use that to submit the email. Because the Microsoft Entra token isn't cached, access can be revoked immediately by either changing the Microsoft Entra application client secret or by changing the access controls for the Azure Communication Services Resource.
- **Azure Communication Service**: An Azure Communication Services Resource with a connected Azure Communication Email Resource and domain is required.
- **Transport Layer Security (TLS)**: Your device must be able to use TLS version 1.2 and above.
- **Port**: Port 587 (recommended) or port 25 is required and must be unblocked on your network. Some network firewalls or ISPs block ports because that's the port that email servers use to send mail.
- **DNS**: Use the DNS name smtp.azurecomm.net. Don't use an IP address for the Microsoft 365 or Office 365 server, as IP Addresses aren't supported.

### How to set up SMTP AUTH client submission

Enter the following settings directly on your device or in the application as their guide instructs (it might use different terminology than this article). Provided your scenario aligns with the prerequisites for SMTP AUTH client submission, these settings allow you to send emails from your device or application using SMTP Commands.

| Device or Application setting | Value |
|--|--|
|Server / smart host | smtp.azurecomm.net |
|Port |Port 587 (recommended) or port 25|
|TLS / StartTLS | Enabled|
|Username and password | Enter the Microsoft Entra application credentials from an application with access to the Azure Communication Services Resource |
