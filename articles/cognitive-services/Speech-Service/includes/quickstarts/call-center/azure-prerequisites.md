---
author: eric-urban
ms.service: cognitive-services
ms.subservice: speech-service
ms.date: 09/29/2022
ms.topic: include
ms.author: eur
---

> [!div class="checklist"]
> * Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
> * <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a Cognitive Services resource"  target="_blank">Create a Cognitive Services multi-service resource</a> in the Azure portal. This quickstart only requires one Cognitive Services [multi-service resource](/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice#create-a-new-azure-cognitive-services-resource). The sample code allows you to specify separate <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">Language</a> and <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech</a> resource keys.
> * Get the resource key and region. After your Cognitive Services resource is deployed, select **Go to resource** to view and manage keys. For more information about Cognitive Services resources, see [Get the keys for your resource](~/articles/cognitive-services/cognitive-services-apis-create-account.md#get-the-keys-for-your-resource). 

> [!IMPORTANT]
> This quickstart requires access to [conversation summarization](../../../../language-service/summarization/how-to/conversation-summarization.md). To get access, you must submit an [online request](https://aka.ms/applyforconversationsummarization/) and have it approved. 
> 
> The `--languageKey` and `--languageEndpoint` values in this quickstart must correspond to a resource that's in one of the regions supported by the [conversation summarization API](https://aka.ms/convsumregions): `eastus`, `northeurope`, and `uksouth`.
