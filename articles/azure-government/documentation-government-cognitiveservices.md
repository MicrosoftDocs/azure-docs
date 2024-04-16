---
title: Azure AI services on Azure Government
description: Guidance for developing Azure AI services applications for Azure Government
services: azure-government
cloud: gov

ms.service: azure-government
ms.topic: article
ms.date: 08/30/2021
ms.custom: references_regions, devx-track-azurepowershell
---

# Azure AI services on Azure Government

This article provides developer guidance for using Computer Vision, Face API, Text Analytics, and Translator Azure AI services. For feature variations and limitations, see [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md).

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

- Install and Configure [Azure PowerShell](/powershell/azure/install-azure-powershell)
- Connect [PowerShell with Azure Government](documentation-government-get-started-connect-with-ps.md)

<a name='part-1-provision-cognitive-services-accounts'></a>

## Provision Azure AI services accounts

In order to access any of the Azure AI services APIs, you must first provision an Azure AI services account for each of the APIs you want to access. You can create Azure AI services in the [Azure Government portal](https://portal.azure.us/), or you can use Azure PowerShell to access the APIs and services as described in this article.

> [!NOTE]
> You must go through the process of creating an account and retrieving account key (explained below) **for each** of the APIs you want to access.
> 

1. Make sure that you have the **Cognitive Services resource provider registered on your account**. 

   You can do this by **running the following PowerShell command:**

   ```powershell
   Get-AzResourceProvider
   ```
   If you do **not see `Microsoft.CognitiveServices`**, you have to register the resource provider by **running the following command**:
   ```powershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.CognitiveServices
   ```
2. In the PowerShell command below, replace `<rg-name>`, `<name-of-your-api>`, and `<location-of-resourcegroup>` with your relevant account information. 

   Replace the `type of API` tag with any of the following APIs you want to access:
   - ComputerVision
   - Face
   - Language
   - TextTranslation
   - OpenAI

   ```powershell
   New-AzCognitiveServicesAccount -ResourceGroupName '<rg-name>' -name '<name-of-your-api>' -Type <type of API> -SkuName S0 -Location '<location-of-resourcegroup>'
   ```
   Example: 

   ```powershell
   New-AzCognitiveServicesAccount -ResourceGroupName 'resourcegrouptest' -name 'myFaceAPI' -Type Face -SkuName S0 -Location 'usgovvirginia'
   ```

   After you run the command, you should see something like this: 

   ![cog1](./media/documentation-government-cognitiveservices-img1.png)

3. Copy and save the "Endpoint" attribute somewhere as you will need it when making calls to the API. 

### Retrieve account key

You must retrieve an account key to access the specific API. 

In the PowerShell command below, replace the `<youraccountname>` tag with the name that you gave the Account that you created above. Replace the `rg-name` tag with the name of your resource group.

```powershell
Get-AzCognitiveServicesAccountKey -Name <youraccountname> -ResourceGroupName 'rg-name'
```

Example:
```powershell
Get-AzCognitiveServicesAccountKey -Name myFaceAPI -ResourceGroupName 'resourcegrouptest'
```
Copy and save the first key somewhere as you will need it to make calls to the API.

![cog2](./media/documentation-government-cognitiveservices-img2.png)

Now you are ready to make calls to the APIs. 


## Follow API quickstarts

The quickstarts below will help you to get started with the APIs available through Azure AI services in Azure Government.

> [!NOTE]
> The URI for accessing Azure AI Services resources in Azure Government is different than in Azure. For a list of Azure Government endpoints, see [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md#guidance-for-developers).

- [Azure AI Vision](../ai-services/computer-vision/index.yml) | [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?tabs=visual-studio%2Cwindows&pivots=programming-language-csharp)
- [Azure Face](../ai-services/computer-vision/overview-identity.md) | [quickstart](/azure/ai-services/computer-vision/quickstarts-sdk/identity-client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-rest-api)
- [Azure AI Language](/azure/ai-services/language-service/) | [quickstart](../ai-services/language-service/language-detection/overview.md?tabs=version-3-1&pivots=programming-language-csharp)
- [Azure AI Translator](../ai-services/translator/translator-overview.md) | [quickstart](/azure/ai-services/translator/quickstart-text-rest-api?tabs=csharp)
    > [!NOTE]
    > [Virtual Network support](../ai-services/cognitive-services-virtual-networks.md) for Translator service is limited to only `US Gov Virginia` region. The URI for accessing the API is:
    >  - `https://<your-custom-domain>.cognitiveservices.azure.us/translator/text/v3.0`
    >  - You can find your custom domain endpoint in the overview blade on the Azure Government portal once the resource is created. 
    > There are two regions: `US Gov Virginia` and `US Gov Arizona`.
- [Azure OpenAI](/azure/ai-services/openai/) | [quickstart](/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython&pivots=programming-language-studio)


### Next Steps

- Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
- Get help on Stack Overflow by using the "[azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)" tag
