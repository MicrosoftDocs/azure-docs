---
title: How to configure Azure Active Directory Authentication
titleSuffix: Azure Cognitive Services
description: Learn how to authenticate using Azure Active Directory Authentication
services: cognitive-services
author: rhurey
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 06/18/2021
ms.author: rhurey
zone_pivot_groups: programming-languages-set-two
ROBOTS: NOINDEX
---
# Using Azure Active Directory Authentication with the Speech SDK

When using the Speech SDK to access the Speech service, there are three authentication methods available: service keys, a key-based token, and Azure Active Directory (AAD). This article describes how to configure the Speech resource and Speech SDK to use AAD for authentication.

To use AAD authentication with the Speech SDK there are four steps:
1) Create a Speech Resource
2) Configure the Speech Resource for AAD Authentication
3) Get an AAD token
4) Call the Speech SDK

## Create a Speech Resource
For steps on creating a Speech Resource, see [Try Speech For Free](overview.md#try-the-speech-service-for-free)

## Configure the Speech Resource for AAD Authentication

To configure the Speech Resource to be usable for AAD Authentication there are two steps needed:
1) Create a Custom Domain Name
2) Assign Roles

### Create a custom domain name
[!INCLUDE [Custom Domain include](includes/how-to/custom-domain.md)]

### Assign Roles
AAD Authentication requires that the correct roles be assigned to the AAD user or application, for Speech Resources, either the *Cognitive Services Speech Contributor* or *Cognitive Services Speech User* roles must be assigned.

You can assign roles to the user or application using the [Azure Portal](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) or [Powershell](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell) 

## Get an AAD token
::: zone pivot="programming-language-csharp"
To get an AAD token in C#, use the [Azure Identy Client Library](https://docs.microsoft.com/dotnet/api/overview/azure/identity-readme).

An example of using Azure.Identity to get an AAD Token from an interactive browser:
```c#
TokenRequestContext context = new Azure.Core.TokenRequestContext(new string[] { "https://cognitiveservices.azure.com/.default" });
InteractiveBrowserCredential browserCredential = new InteractiveBrowserCredential();
var browserToekn = browserCredential.GetToken(context);
```
The token context must be set to "https://cognitiveservices.azure.com/.default".
::: zone-end

::: zone pivot="programming-language-cpp"
To get an AAD token in C++, use the [Azure Identy Client Library](https://github.com/Azure/azure-sdk-for-cpp/tree/main/sdk/identity/azure-identity).

An example of using Azure.Identity to get an AAD Token from a client secret credential:
```cpp
const std::string tenandId = "";
const std::string clientId = "";
const std::string clientSecret = "";
const std::string tokenContext = "https://cognitiveservices.azure.com/.default";

Azure::Identity::ClientSecretCredential cred(tenandId,
    clientId,
    clientSecret,
    Azure::Identity::ClientSecretCredentialOptions());

Azure::Core::Credentials::TokenRequestContext context;
context.Scopes.push_back(tokenContext);

auto token = cred.GetToken(context, Azure::Core::Context());
```
The token context must be set to "https://cognitiveservices.azure.com/.default".

::: zone-end

::: zone pivot="programming-language-java"
To get an AAD token in Java, use the [Azure Identy Client Library](https://docs.microsoft.com/java/api/overview/azure/identity-readme?view=azure-java-stable).

An example of using Azure.Identity to get an AAD Token from an interactive browser:
```java
TokenRequestContext context = new Azure.Core.TokenRequestContext(new string[] { "https://cognitiveservices.azure.com/.default" });
InteractiveBrowserCredential browserCredential = new InteractiveBrowserCredential();
var browserToekn = browserCredential.GetToken(context);
```
The token context must be set to "https://cognitiveservices.azure.com/.default".
::: zone-end

::: zone pivot="programming-language-python"
To get an AAD token in Java, use the [Azure Identy Client Library](https://docs.microsoft.com/python/api/overview/azure/identity-readme?view=azure-python).

An example of using Azure.Identity to get an AAD Token from an interactive browser:
```Python
from azure.identity import  InteractiveBrowserCredential
ibc = InteractiveBrowserCredential()
token = ibc.get_token("https://cognitiveservices.azure.com/.default")
```
::: zone-end
## Call the Speech SDK