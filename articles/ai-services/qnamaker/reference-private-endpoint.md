---
title: How to set up a Private Endpoint - QnA Maker
description: Understand Private Endpoint creation available in QnA Maker managed.
ms.service: cognitive-services
manager: nitinme
ms.author: jboback
author: jboback
ms.subservice: qna-maker
ms.topic: reference
ms.date: 01/12/2021
---

# Private Endpoints

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Now, Custom question answering provides you support to create private endpoints to the Azure Search Service.

Private endpoints are provided by [Azure Private Link](../../private-link/private-link-overview.md), as a separate service. For more information about costs, see the [pricing page.](https://azure.microsoft.com/pricing/details/private-link/) 

## Prerequisites
> [!div class="checklist"]
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
> * A [Text Analytics resource](https://portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) (with Custom question answering feature) created in the Azure portal. Remember your Azure Active Directory ID, Subscription, Text Analytics resource name you selected when you created the resource.

## Steps to enable private endpoint
1. Assign *Contributer* role to Text Analytics service in the Azure Search Service instance. This operation requires *Owner* access to the subscription. Go to Identity tab in the service resource to get the identity.

> [!div class="mx-imgBorder"]
> ![Text Analytics Identity](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoints-identity.png)

1. Add the above identity as *Contributer* by going to Azure Search Service IAM tab.

![Managed service IAM](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoint-access-control.png)

1. Select **Add role assignments**, add the identity and then select **Save**.

![Managed role assignment](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoint-role-assignment.png)

1. Now, go to the **Networking** tab in the Azure Search Service instance and switch Endpoint connectivity data from *Public* to *Private*. This operation is a long running process and can take up to 30 mins to complete. 

![Managed Azure search networking](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking.png)

1. Go to the **Networking** tab of Text Analytics service and under **Allow access from**, select the **Selected Networks and private endpoints** option.
1. Select **Save**
 
> [!div class="mx-imgBorder"]
> ![Text Analytics newtorking](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking-custom-qna.png)

This will establish a private endpoint connection between Text Analytics service and Azure Cognitive Search service instance. You can verify the Private endpoint connection on the *Networking* tab of the Azure Cognitive Search service instance. Once the whole operation is completed, you are good to use your Text Analytics service. 

![Managed Networking Service](../qnamaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking-3.png)


## Support details
 * We don't support changes to Azure Cognitive Search service once you enable private access to your Text Analytics service. If you change the Azure Cognitive Search service via 'Features' tab after you have enabled private access, the Text Analytics service will become unusable.
 * After establishing Private Endpoint Connection, if you switch Azure Cognitive Search Service Networking to 'Public', you won't be able to use the Text Analytics service. Azure Search Service Networking needs to be 'Private' for the Private Endpoint Connection to work
