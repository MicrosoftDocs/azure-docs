---
title: How to set up a Private Endpoint - QnA Maker
description: Understand Private Endpoint creation available in QnA Maker managed.
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: reference
ms.date: 01/12/2021
---

# Private Endpoints

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Now, QnA Maker provides you support to create private endpoints to the Azure Search Service. This functionality is available in QnA Maker managed. 

Private endpoints are provided by [Azure Private Link](../../private-link/private-link-overview.md), as a separate service. For more information about costs, see the [pricing page.](https://azure.microsoft.com/pricing/details/private-link/) 

## Prerequisites
> [!div class="checklist"]
> * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.
> * A QnA Maker [managed resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) created in the Azure portal. Remember your Azure Active Directory ID, Subscription, QnA resource name you selected when you created the resource.

## Steps to enable private endpoint
1. Assign *Contributer* role to QnA Maker managed service in the Azure Search Service instance. This operation requires *Owner* access to the subscription. Go to Identity tab in the service resource to get the identity.
![Managed service Identity](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-identity.png)

2. Add the above identity as *Contributer* by going to Azure Search Service IAM tab.
![Managed service IAM](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-access-control.png)

3. Click on *Add role assignments*, add the identity and click on *Save*.
![Managed role assignment](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-role-assignment.png)

4. Now, go to *Networking* tab in the Azure Search Service instance and switch Endpoint connectivity data from *Public* to *Private*. This operation is a long running process and can take up to 30 mins to complete. 
![Managed Azure search networking](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking.png)

5. Go to *Networking* tab of QnA Maker managed service and under the *Allow access from*, select the *Selected Networks and private endpoints* option and Click *save*. 
![Managed QnA maker newtorking](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking-2.png)

This will establish a private endpoint connection between QnA maker service and Azure cognitive search service instance. You can verify the Private endpoint connection on the *Networking* tab of Azure Search service instance. Once the whole operation is completed, you are good to use your QnA Maker service. 
![Managed Networking Service](../QnAMaker/media/qnamaker-reference-private-endpoints/private-endpoint-networking-3.png)


## Support details
 * We don't support change Azure Search Service once you enable private access to your QnAMaker service. If you change the Azure Search Service via 'Configuration' tab after you have enabled private access, the QnAMaker service will become unusable.
 * After establishing Private Endpoint Connection, if you switch Azure Search Service Networking to 'Public', you won't be able to use the QnAMaker service. Azure Search Service Networking needs to be 'Private' for the Private Endpoint Connection to work