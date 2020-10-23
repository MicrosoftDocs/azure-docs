---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 05/06/2019
ms.author: wolfma
---

### Standard and neural voices

Use this table to determine availability of standard and neural voices by region/endpoint:

| Region | Endpoint | Standard Voices | Neural Voices |
|--------|----------|-----------------|---------------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| Japan West | `https://japanwest.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | No |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/v1` | Yes | Yes |

### Custom voices

If you've created a custom voice font, use the endpoint that you've created. You can also use the endpoints listed below, replacing the `{deploymentId}` with the deployment ID for your voice model.

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Brazil South | `https://brazilsouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Canada Central | `https://canadacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Central US | `https://centralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East Asia | `https://eastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US | `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US 2 | `https://eastus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| France Central | `https://francecentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| India Central | `https://centralindia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan East | `https://japaneast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan West | `https://japanwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Korea Central | `https://koreacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Central US | `https://northcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Europe | `https://northeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| South Central US | `https://southcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Southeast Asia | `https://southeastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| UK South | `https://uksouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Europe | `https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US | `https://westus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US 2 | `https://westus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
