---
title: Disable local authentication in Azure AI Services
titleSuffix: Azure AI services
description: "This article describes disabling local authentication in Azure AI Services."
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 09/22/2023
ms.author: pafarley
---

# Disable local authentication in Azure AI Services

Azure AI Services provides Microsoft Entra authentication support for all resources. This gives organizations control to disable local authentication methods and enforce Microsoft Entra authentication. This feature provides you with seamless integration when you require centralized control and management of identities and resource credentials.

You can disable local authentication using the Azure policy [Cognitive Services accounts should have local authentication methods disabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F71ef260a-8f18-47b7-abcb-62d0673d94dc). You can set it at the subscription level or resource group level to enforce the policy for a group of services.

Disabling local authentication doesn't take effect immediately. Allow a few minutes for the service to block future authentication requests.

You can use PowerShell to determine whether the local authentication policy is currently enabled. First sign in with the `Connect-AzAccount` command. Then use the cmdlet **[Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount)** to retrieve your resource, and check the property `DisableLocalAuth`. A value of `true` means local authentication is disabled.


## Re-enable local authentication

To enable local authentication, execute the PowerShell cmdlet **[Set-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/set-azcognitiveservicesaccount)** with the parameter `-DisableLocalAuth false`.  Allow a few minutes for the service to accept the change to allow local authentication requests.

## Next steps
- [Authenticate requests to Azure AI services](./authentication.md)
