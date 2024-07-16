---
title: Gain end-user context for AI alerts
description: Learn how to enhance the security of your AI workloads by adding user context for AI alerts with Microsoft Defender for Cloud threat protection for AI workloads.
ms.topic: how-to
ms.date: 07/15/2024
#Customer intent: I want to learn how to enhance the security of my AI workloads by adding end-user context for AI alerts with Microsoft Defender for Cloud threat protection for AI workloads.
---

# Gain end-user context for AI alerts

Microsoft Defender for Cloud allows you to enhance the security of your AI workloads by incorporating the code samples provided in this document, into your generative AI application's code 

When AI threat protection is enabled you gain threat protection for AI workloads on your Azure subscription which provide  insights to threats that might affect your generative AI applications.

:::image type="content" source="media/gain-end-user-context-ai/before-code.png" alt-text="Screenshot of the Defender XDR portal that shows the threat protection alerts provided." lightbox="media/gain-end-user-context-ai/before-code.png":::

By adding the code provided on this page, your generative AI applications gain the ability to pass critical end-user context to Defender for Cloud's AI alerts. The addition of the end-user context allows the security alerts to contain more details and leads to more actionable alerts so that you can improve real-time threat detection and incident response.

:::image type="content" source="media/gain-end-user-context-ai/after-code.png" alt-text="Screenshot of the Defender XDR portal that shows all of the additional benefits gained by adding the code." lightbox="media/gain-end-user-context-ai/after-code.png":::

## Prerequisites

- Read up on [Overview - AI threat protection](ai-threat-protection.md).

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- [Enable threat protection for AI workloads (preview)](ai-onboarding.md) on an AI application, with Azure OpenAI as its underlying model.

## Add security parameters to your Azure OpenAI call

To receive AI security alerts with more context, you can add any or all of the following sample `SecurityContext` code to your [Azure OpenAI API](../ai-services/openai/reference.md) calls. Defender for Cloud enhances AI security alerts by using the `SecurityContext` code to incorporate the user context, for example detailing incidents that involve a malicious end-user. 

Application developers should ensure that a valid JSON is passed to the 'user' field in every request made by the application to Azure OpenAI.

All the fields in the `SecurityContext` are optional. We recommended passing the `EndUserId` and `SourceIP` fields at least, to allow Security Operations Center (SOC) analysts the ability to investigate security incidents that involve AI resources and generative AI applications. For examples, see the [SecurityContext schema](#securitycontext-schema) section.

If a field’s name is misspelled, the Azure OpenAI API call will still succeed. No validation of the `SecurityContext` schema is required to pass through the Azure OpenAI user field. 

## SecurityContext schema

The provided code consists of the `SecurityContext` field which contains several components that describe the application itself, and the end user that interacts with the application. These fields assist your security operations teams to investigate and mitigate security incidents by providing a comprehensive approach to protecting your AI applications.

- End used ID
- End user type
- End user tenat's ID
- the source IP address.
- Source request headers
- Application name

| Field name | Type | Description | Optional | Example |
|------------|------|-------------|----------|---------|
| EndUserId | string | Acts as a unique identifier for the end user within the generative AI application, in case AAD authorization is used to authenticate end-users in the generative AI application, this should be Microsoft Entra (previously known as Azure Active Directory) user object id, otherwise this can be a GUID or some other identifier that is uniquely identifying the user. | Yes | 1234a123-12a3-1234-1ab2-a1b2c34d56e |
| EndUserIdType | string | Specifies the type of end user identifier. It should be set to AAD when using Microsoft Entra (previously known as Azure Active Directory) user object ID. | Yes, unless EndUserId is passed, in that case this must be set to proper value. | AAD, Google, Other |
| EndUserTenantId | string | This property specifies the Microsoft 365 tenant id the end user belongs to. It is required when the generative AI application is multi-tenant and end users from different tenants can login. | Yes | 1234a123-12a3-1234-1ab2-a1b2c34d56e  |
| SourceIP  | string | Captures the IP address of the client as seen directly by the server. It represents the most immediate client IP address that made the connection to the server. If the client connects through a proxy or load balancer, SourceIP will be the IP address of that proxy or load balancer, not the original client's IP address: <br> - ASP.NET: HttpContext.Connection.RemoteIpAddress <br> - Python: request.remote_addr | Yes | 12.34.567.891, 1234:1:123a:123:1a2b:ab1:ab1c:ab12 |
| SourceRequestHeaders  | Dictionary<string, string> | Captures a subset of end user's request headers that are added by proxies or load balancers. Headers like X-Forwarded-For, X-Real-IP, or Forwarded are used by Microsoft Defender for Cloud to get the original client's IP address. User-Agent header will provide context about the client software initiating the API request. <br><br> Recommended header names include: User-Agent, X-Forwarded-For, X-Real-IP, Forwarded, CF-Connecting-IP, True-Client-IP, X-Client-IP, X-Forwarded, Forwarded-For | Yes | - |
| ApplicationName | string | The name of the application, used for identification and UI purposes. | Yes | Contoso HR Copilot, Customer sales chat bot. |

## Add the SecurityContext code to your application

We recommend reviewing and referencing the code samples provided in this document to your generative AI application's code.

1. Select one of these examples:

    - [sample-app-aoai-chatGPT](https://github.com/microsoft/sample-app-aoai-chatGPT)
    - [ms_defender_utils.py](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/f3f19bf5f4cd9754ff0f759ade72057ca1e01fbc/backend/security/ms_defender_utils.py#L3)
    - [app.py](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/f3f19bf5f4cd9754ff0f759ade72057ca1e01fbc/app.py#L741C1-L742C1).

1. Locate and copy the sample code.

    :::image type="content" source="media/gain-end-user-context-ai/sample-code-security-context.png" alt-text="Screenshot of the sample code provided from GitHub." lightbox="media/gain-end-user-context-ai/sample-code-security-context.png":::

Add the code in the relevant Azure OpenAI API call of your generative AI application's code.

1. Alter the code parameters to match your requirements.  

1. Save the changes.

Once you have added the code and saved your changes, ensure that a valid JSON is passed to the 'user' field in every request made by the application to Azure OpenAI.

## Next step

> [!div class="nextstepaction"]
> 