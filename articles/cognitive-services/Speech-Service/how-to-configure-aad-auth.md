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
---
# Azure Active Directory Authentication with the Speech SDK

When using the Speech SDK to access the Speech service, there are three authentication methods available: service keys, a key-based token, and Azure Active Directory (AAD). This article describes how to configure the Speech resource and create a Speech SDK configuration object to use AAD for authentication.

This article shows how to use AAD authentication with the Speech SDK by following four steps:
1) Create a Speech Resource
2) Configure the Speech Resource for AAD Authentication
3) Get an AAD token
4) Create the appropriate SDK configuration object.

## Create a Speech Resource
To create a Speech Resource, see [Try Speech For Free](overview.md#try-the-speech-service-for-free).

## Configure the Speech Resource for AAD Authentication

Follow these steps to configure the Speech Resource to be usable for AAD Authentication:
1) Create a Custom Domain Name
2) Assign Roles

### Create a custom domain name
[!INCLUDE [Custom Domain include](includes/how-to/custom-domain.md)]

### Assign roles
AAD Authentication requires that the correct roles be assigned to the AAD user or application, for Speech Resources, either the *Cognitive Services Speech Contributor* or *Cognitive Services Speech User* roles must be assigned.

You can assign roles to the user or application using the [Azure portal](/azure/role-based-access-control/role-assignments-portal) or [PowerShell](/azure/role-based-access-control/role-assignments-powershell).

## Get an AAD token
::: zone pivot="programming-language-csharp"
To get an AAD token in C#, use the [Azure Identy Client Library](/dotnet/api/overview/azure/identity-readme).

An example of using Azure.Identity to get an AAD Token from an interactive browser:
```c#
TokenRequestContext context = new Azure.Core.TokenRequestContext(new string[] { "https://cognitiveservices.azure.com/.default" });
InteractiveBrowserCredential browserCredential = new InteractiveBrowserCredential();
var browserToken = browserCredential.GetToken(context);
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
To get an AAD token in Java, use the [Azure Identy Client Library](/java/api/overview/azure/identity-readme).

An example of using Azure.Identity to get an AAD Token from a browser:
```java
TokenRequestContext context = new TokenRequestContext();
context.addScopes("https://cognitiveservices.azure.com/.default");

InteractiveBrowserCredentialBuilder builder = new InteractiveBrowserCredentialBuilder();
InteractiveBrowserCredential browserCredential = builder.build();

AccessToken browserToken = browserCredential.getToken(context).block();
String token = browserToken.getToken();
```
The token context must be set to "https://cognitiveservices.azure.com/.default".
::: zone-end

::: zone pivot="programming-language-python"
To get an AAD token in Java, use the [Azure Identy Client Library](/python/api/overview/azure/identity-readme).

An example of using Azure.Identity to get an AAD Token from an interactive browser:
```Python
from azure.identity import  InteractiveBrowserCredential
ibc = InteractiveBrowserCredential()
aadToken = ibc.get_token("https://cognitiveservices.azure.com/.default")
```
::: zone-end

::: zone pivot="programming-language-more"
Find samples that get an AAD token in [Microsoft identity platform code samples](/azure/active-directory/develop/sample-v2-code).

For programming languages where an Azure Identity client is not available, you can directly [request an OAuth token](/azure/active-directory/develop/v2-oauth-ropc).
::: zone-end
## Get the Speech Resource ID

You'll need the Speech Resource's ID to make SDK calls using AAD Authentication.

> [!NOTE]
> For Intent Recognition use the ID for the LUIS Prediction Resource.

# [Azure portal](#tab/portal)

To get the resource ID in the Azure portal:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the required Speech resource.
1. In the **Resource Management** group on the left pane, select **Properties**.
1. Copy the **Resource ID**

# [PowerShell](#tab/powershell)

To get the Resource ID using PowerShell, confirm that your computer has PowerShell version 7.x or later with the Azure PowerShell module version 5.1.0 or later. To see the versions of these tools, follow these steps:

1. In a PowerShell window, enter:

    `$PSVersionTable`

    Confirm that the `PSVersion` value is 7.x or later. To upgrade PowerShell, follow the instructions at [Installing various versions of PowerShell](/powershell/scripting/install/installing-powershell).

1. In a PowerShell window, enter:

    `Get-Module -ListAvailable Az`

    If nothing appears, or if that version of the Azure PowerShell module is earlier than 5.1.0, follow the instructions at [Install the Azure PowerShell module](/powershell/azure/install-Az-ps) to upgrade.

Now run `Connect-AzAccount` to create a connection with Azure.


```azurepowershell
$subId = "Your Azure subscription Id"
$resourceGroup = "Resource group name where Speech resource is located"
$speechResourceName = "Your Speech resource name"

# Select the Azure subscription that contains the Speech resource.
# You can skip this step if your Azure account has only one active subscription.
Set-AzContext -SubscriptionId $subId

# Get the Speech Resource 
$resource = Get-AzCognitiveServicesAccount -Name $speechResourceName -ResourceGroupName $resourceGroup

# Get the resource ID:
$resourceId = resource.Id
```
***

## Create the Speech SDK configuration object
With an AAD token, you can now create the appropriate Speech SDK configuration object.

The method of providing the token, and the method to construct the corresponding Speech SDK Config object varies by the object you'll be using.

### SpeechRecognizer, IntentRecognizer, ConversationTranscriber & SpeechSynthizer

For these objects, build the authorization token from the Resource ID and the AAD Token and then use it to create a SpeechConfig object.

::: zone pivot="programming-language-csharp"
```C#
string resourceId = "Your ResourceID";
string aadToken = "Your AAD Token";
string region =  "Your Speech Region";

var speechToken = $"aad#{resourceId}#{aadToken}";
var speechConfig = SpeechConfig.FromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-cpp"
```C++
std::string resourceId = "Your ResourceID";
std::string aadToken = "Your AAD Token";
std::string region = "Your Speech Region";

auto speechToken = "aad#" + resourceId + "#" + aadToken;

auto speechConfig = SpeechConfig::FromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-java"
```Java
String resourceId = "Your Resource ID";
String region = "Your Region";

String speechToken = "aad#" + resourceId + "#" + token;

SpeechConfig speechConfig = SpeechConfig.fromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-python"
```Python
resourceId = "Your Resource ID"
region = "Your Region"
speechToken = speechToken = "aad#" + resourceId + "#" + aadToken.token
speechConfig = SpeechConfig(auth_token=speechToken, region=region)
```
::: zone-end

### TranslationRecognizer

For the TranslationRecognizer, build the authorization token from the Resource ID and the AAD Token and then use it to create a SpeechTranslationConfig object.

::: zone pivot="programming-language-csharp"
```C#
string resourceId = "Your ResourceID";
string aadToken = "Your AAD Token";
string region =  "Your Speech Region";

var speechToken = $"aad#{resourceId}#{aadToken}";
var speechConfig = SpeechTranslationConfig.FromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-cpp"
```cpp
std::string resourceId = "Your ResourceID";
std::string aadToken = "Your AAD Token";
std::string region = "Your Speech Region";

auto speechToken = "aad#" + resourceId + "#" + aadToken;

auto speechConfig = SpeechTranslationConfig::FromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-java"
```Java
String resourceId = "Your Resource ID";
String region = "Your Region";

String speechToken = "aad#" + resourceId + "#" + token;

SpeechTranslationConfig translationConfig = SpeechTranslationConfig.fromAuthorizationToken(speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-python"
```Python
resourceId = "Your Resource ID"
region = "Your Region"
speechToken = speechToken = "aad#" + resourceId + "#" + aadToken.token
translationConfig = SpeechTranslationConfig(auth_token=speechToken, region=region)
```
::: zone-end

### DialogServiceConnector

For the DialogServiceConnection, build the authorization token from the Resource ID and the AAD Token and then use it to create a CustomCommandsConfig or a BotFrameworkConfig object.

::: zone pivot="programming-language-csharp"
```C#
string resourceId = "Your ResourceID";
string aadToken = "Your AAD Token";
string region =  "Your Speech Region";
string appId = "Your app ID";

var speechToken = $"aad#{resourceId}#{aadToken}";
var customCommandsConfig = CustomCommandsConfig.FromAuthorizationToken(appId, speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-cpp"
```cpp
std::string resourceId = "Your ResourceID";
std::string aadToken = "Your AAD Token";
std::string region = "Your Speech Region";
std::string appId = "Your app Id";

auto speechToken = "aad#" + resourceId + "#" + aadToken;

auto customCommandsConfig = CustomCommandsConfig::FromAuthorizationToken(appId, speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-java"
```Java
String resourceId = "Your Resource ID";
String region = "Your Region";
String appId = "Your AppId";

String speechToken = "aad#" + resourceId + "#" + token;

CustomCommandsConfig dialogServiceConfig = CustomCommandsConfig.fromAuthorizationToken(appId, speechToken, region);
```
::: zone-end

::: zone pivot="programming-language-python"
The DialogServiceConnector is not currently supported in Python
::: zone-end

### VoiceProfileClient
To use the VoiceProfileClient with AAD Authentication, use the custom domain name created above.

::: zone pivot="programming-language-csharp"
```C#
string customDomainName = "Your Custom Name";
string hostName = $"https://{customDomainName}.cognitiveservices.azure.com/";
string token = "Your AAD Token";

var config =  SpeechConfig.FromHost(new Uri(hostName));
var token = AzureSubscription.GetAADToken().Result;
config.AuthorizationToken = token;
```
::: zone-end

::: zone pivot="programming-language-cpp"
```cpp
std::string customDomainName = "Your Custom Name";
std::string aadToken = "Your AAD Token";

auto speechConfig = SpeechConfig::FromHost("https://" + customDomainName + ".cognitiveservices.azure.com/");
speechConfig->SetAuthorizationToken(aadToken);
```
::: zone-end

::: zone pivot="programming-language-java"
```Java
String aadToken = "Your AAD Token";
String customDomainName = "Your Custom Name";
String hostName = "https://" + customDomainName + ".cognitiveservices.azure.com/";
SpeechConfig speechConfig = SpeechConfig.fromHost(new URI(hostName));
speechConfig.setAuthorizationToken(aadToken);
```
::: zone-end

::: zone pivot="programming-language-python"
The VoiceProfileClient is not currently supported in Python.
::: zone-end

> [!NOTE]
> **ConversationTranslator** does not currently support AAD Authentication.
