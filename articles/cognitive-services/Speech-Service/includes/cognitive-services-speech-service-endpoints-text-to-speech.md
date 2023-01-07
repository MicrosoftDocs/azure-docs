---
author: wolfma61
ms.service: cognitive-services
ms.topic: include
ms.date: 05/06/2019
ms.author: wolfma
---

### Prebuilt neural voices

Use this table to determine *availability of neural voices* by region or endpoint:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Brazil South | `https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| Canada Central | `https://canadacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| Central US | `https://centralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East Asia | `https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US | `https://eastus.tts.speech.microsoft.com/cognitiveservices/v1` |
| East US 2 | `https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1` |
| France Central | `https://francecentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| Germany West Central | `https://germanywestcentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| India Central | `https://centralindia.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan East | `https://japaneast.tts.speech.microsoft.com/cognitiveservices/v1` |
| Japan West | `https://japanwest.tts.speech.microsoft.com/cognitiveservices/v1` |
| Jio India West | `https://jioindiawest.tts.speech.microsoft.com/cognitiveservices/v1` |
| Korea Central | `https://koreacentral.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Central US | `https://northcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| North Europe | `https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| Norway East | `https://norwayeast.tts.speech.microsoft.com/cognitiveservices/v1` |
| South Central US | `https://southcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| Southeast Asia | `https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1` |
| Sweden Central | `https://swedencentral.tts.speech.microsoft.com/cognitiveservices/v1`|
| Switzerland North | `https://switzerlandnorth.tts.speech.microsoft.com/cognitiveservices/v1`|
| Switzerland West | `https://switzerlandwest.tts.speech.microsoft.com/cognitiveservices/v1`|
| UAE North | `https://uaenorth.tts.speech.microsoft.com/cognitiveservices/v1`|
| US Gov Arizona | `https://usgovarizona.tts.speech.azure.us/cognitiveservices/v1`|
| US Gov Virginia | `https://usgovvirginia.tts.speech.azure.us/cognitiveservices/v1`|
| UK South | `https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Central US | `https://westcentralus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West Europe | `https://westeurope.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US | `https://westus.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US 2 | `https://westus2.tts.speech.microsoft.com/cognitiveservices/v1` |
| West US 3 | `https://westus3.tts.speech.microsoft.com/cognitiveservices/v1` |

> [!TIP]
> [Voices in preview](../language-support.md?tabs=tts) are available in only these three regions: East US, West Europe, and Southeast Asia.

### Custom neural voices

If you've created a custom neural voice font, use the endpoint that you've created. You can also use the following endpoints. Replace `{deploymentId}` with the deployment ID for your neural voice model.

| Region | Training |Deployment |Endpoint |
|--------|----------|----------|----------|
| Australia East |Yes|Yes| `https://australiaeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Brazil South | No |Yes| `https://brazilsouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Canada Central | No |Yes|`https://canadacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Central US | No |Yes| `https://centralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East Asia | No |Yes| `https://eastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US |Yes| Yes | `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US 2 |Yes| Yes |`https://eastus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| France Central | No |Yes| `https://francecentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Germany West Central | No |Yes| `https://germanywestcentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| India Central |Yes| Yes | `https://centralindia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan East |Yes| Yes | `https://japaneast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan West | No |Yes| `https://japanwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Jio India West | No |Yes| `https://jioindiawest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Korea Central |Yes|Yes| `https://koreacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Central US | No |Yes| `https://northcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Europe |Yes|Yes| `https://northeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Norway East| No |Yes| `https://norwayeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| South Africa North | No |Yes| `https://southafricanorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| South Central US |Yes|Yes| `https://southcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Southeast Asia |Yes|Yes| `https://southeastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Switzerland North | No |Yes| `https://switzerlandnorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Switzerland West | No |Yes| `https://switzerlandwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| UAE North | No |Yes| `https://uaenorth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}`|
| UK South |Yes| Yes | `https://uksouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Central US | No |Yes| `https://westcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Europe |Yes|Yes| `https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US |Yes|Yes| `https://westus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US 2 |Yes|Yes| `https://westus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US 3 | No |Yes| `https://westus3.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |

> [!NOTE]
> The preceding regions are available for neural voice model hosting and real-time synthesis. Custom neural voice training is only available in some regions. But users can easily copy a neural voice model from these regions to other regions in the preceding list.

### Long Audio API

The Long Audio API is available in multiple regions with unique endpoints:

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.customvoice.api.speech.microsoft.com` |
| East US | `https://eastus.customvoice.api.speech.microsoft.com` |
| India Central | `https://centralindia.customvoice.api.speech.microsoft.com` |
| South Central US | `https://southcentralus.customvoice.api.speech.microsoft.com` |
| Southeast Asia | `https://southeastasia.customvoice.api.speech.microsoft.com` |
| UK South | `https://uksouth.customvoice.api.speech.microsoft.com` |
| West Europe | `https://westeurope.customvoice.api.speech.microsoft.com` |
