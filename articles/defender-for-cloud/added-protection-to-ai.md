---
title: Add protection for AI workloads
description: Learn how to add additional layers of threat protection for AI workloads on your Azure subscription with Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 05/05/2024
---

# Add protection for AI workloads

Microsoft Defender for Cloud's AI workload protection capabilities help you secure your AI workloads by providing continually identifies threats to generative AI applications in real time and assists in the response process. 

By adding all or some of the code samples provided, to your AI model, you can add advanced security knowledge and additional layers of threat protection to your AI workloads. Some of the added protection include:

- End used ID
- End user type
- End user tenat's ID
- the source IP address.
- Source request headers
- Application name

## Prerequisites

- Read up on [Overview - AI threat protection](ai-threat-protection.md).

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- [Enable threat protection for AI workloads (preview)](ai-onboarding.md).

## Add code to your AI model

To add the additional layers of threat protection to your AI model, you can add any of the following `SecurityContext` to your AI model. The `SecurityContext` field is comprised of several fields that describe the application itself, and the end user interacting with the application. Microsoft Defender for Cloud uses the `SecurityContext` to create security alerts that contain the user context, for example an incident that involves a malicious end-user. 

Application developers should ensure that a valid JSON is passed to the 'user' field in every request made by the application to Azure OpenAI.

All the fields in the `SecurityContext` are optional. We recommended passing the `EndUserId` and `SourceIP` fields at least, to allow Security Operations Center (SOC) analysts the ability to investigate security incidents that involve AI resources and generative AI applications. For examples, see the schema section.

If a field’s name is misspelled, the Azure OpenAI API call will still succeed. No validation of the `SecurityContext` schema is required to pass through the Azure OpenAI user field. 

## SecurityContext schema

| Field name | Type | Description | Optional | Example |
|------------|------|-------------|----------|---------|
| EndUserId | string | Acts as a unique identifier for the end user within the generative AI application, in case AAD authorization is used to authenticate end-users in the generative AI application, this should be Microsoft Entra (previously known as Azure Active Directory) user object id, otherwise this can be a GUID or some other identifier that is uniquely identifying the user. | Yes | 1234a123-12a3-1234-1ab2-a1b2c34d56e |
| EndUserIdType | string | Specifies the type of end user identifier. It should be set to AAD when using Microsoft Entra (previously known as Azure Active Directory) user object ID. | Yes, unless EndUserId is passed, in that case this must be set to proper value. | AAD, Google, Other |
| EndUserTenantId | string | This property specifies the Microsoft 365 tenant id the end user belongs to. It is required when the generative AI application is multi-tenant and end users from different tenants can login. | Yes | 1234a123-12a3-1234-1ab2-a1b2c34d56e  |
| SourceIP  | string | Captures the IP address of the client as seen directly by the server. It represents the most immediate client IP address that made the connection to the server. If the client connects through a proxy or load balancer, SourceIP will be the IP address of that proxy or load balancer, not the original client's IP address: <br> - ASP.NET: HttpContext.Connection.RemoteIpAddress <br> - Python: request.remote_addr | Yes | 12.34.567.891, 1234:1:123a:123:1a2b:ab1:ab1c:ab12 |
| SourceRequestHeaders  | Dictionary<string, string> | Captures a subset of end user's request headers that are added by proxies or load balancers. Headers like X-Forwarded-For, X-Real-IP, or Forwarded are used by Microsoft Defender for Cloud to get the original client's IP address. User-Agent header will provide context about the client software initiating the API request. <br><br> Recommended header names include: User-Agent, X-Forwarded-For, X-Real-IP, Forwarded, CF-Connecting-IP, True-Client-IP, X-Client-IP, X-Forwarded, Forwarded-For | Yes | - |
| ApplicationName | string | The name of the application, used for identification and UI purposes. | Yes | Contoso HR Copilot, Customer sales chat bot. |

1. Select the tab that corresponds to your development environment.


### [Basic C# Initialization Example](#tab/basic-c-initialization-example)

```csharp
Add code here
```

### [Azure AI C# SDK](#tab/azure-ai-c-sdk)

```csharp
Add code here
```

### [Semantic Kernel](#tab/sementic-kernel)

Require version 1.3.0 or later

```bash
Add code here
```

### [Azure AI Python SDK](#tab/azure-ai-python-sdk)

```azurecli
Add code here
```

---

1. Save the changes to your AI model.
1. ensure that a valid JSON is passed to the 'user' field in every request made by the application to Azure OpenAI.

## Next step

> [!div class="nextstepaction"]
> 