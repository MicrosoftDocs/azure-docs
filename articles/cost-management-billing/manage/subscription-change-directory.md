---
title: Azure subscription change directory
description: This article helps you to complete the Azure subscription change directory two-party request and accept workflow. 
author: Nicholak-MS
ms.author: nicholak
ms.reviewer: nicholak
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 03/17/2026
service.tree.id: b69a7832-2929-4f60-bf9d-c6784a865ed8
---

# How to change the Entra directory of your Azure subscription

To change the Entra Directory of your Azure subscription, you need to complete the following two-party request and accept workflow. 

1. To initiate a change directory request, you need to be a subscription owner of the subscription in the source directory. 
2. To accept a change directory request, you or another party need to be an Entra admin in the destination directory.

Follow these steps to complete the change directory workflow.

## Step 1 - Sign into the Azure portal and go to Subscriptions

1. Sign into the Azure portal of the source directory as a subscription owner or Entra admin and select the subscription you want to change from the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)  
2. Select **Change Directory**

:::image type="content" source="./media/subscription-change-directory/1-change-directory.png" alt-text="Screenshot that shows Change Directory higlighted." lightbox="./media/subscription-change-directory/1-change-directory.png" :::
   
3. The Change directory experience opens. 

## Step 2 - Initiate the directory change request

1. Read the information completely to understand the implications of the change directory action. 
2. Choose whether you or another party will accept the request in the destination directory. 
      1. Yes - if you're the acceptor in the destination
      2. No - if you're inviting another party to accept the invitation

:::image type="content" source="./media/subscription-change-directory/2-start.png" alt-text="Screenshot that shows the start of the Change Directory workflow." lightbox="./media/subscription-change-directory/2-start.png":::

  If you're the acceptor select Yes and select the Entra tenant ID of the destination directory in the dropdown and click Continue to initiate the transfer. 

:::image type="content" source="./media/subscription-change-directory/4-destination-selection.png" alt-text="Screenshot that shows the destination choices of the Change Directory workflow." lightbox="./media/subscription-change-directory/4-destination-selection.png":::

  If you're sending the request to another party select No and enter the email address of the recipient and the Entra tenant ID of the destination directory and click Continue to initiate the transfer. 

:::image type="content" source="./media/subscription-change-directory/3-b-other-recipient.png" alt-text="Screenshot that shows the selections if the acceptor is a different party." lightbox="./media/subscription-change-directory/3-b-other-recipient.png":::
  
## Step 3 - Confirm the directory change request

1. If you initiated a request that you'll be accepting you'll be presented with a confirmation page to Continue the transfer.

:::image type="content" source="./media/subscription-change-directory/5-self-request-sent.png" alt-text="Screenshot that shows the confirmation of a self approved request." lightbox="./media/subscription-change-directory/5-self-request-sent.png":::
    
2. If you sent the request to another party, you receive the following confirmation page. This confirmation page includes a link for the acceptor to complete the transfer. Share the link with the recipient to complete the transfer.  

:::image type="content" source="./media/subscription-change-directory/6-other-transfer-sent.png" alt-text="Screenshot that shows the confirmation of a different party request." lightbox="./media/subscription-change-directory/6-other-transfer-sent.png":::

## Step 4 - Accept the directory change request

1. If you initiated a request and are also the acceptor click Accept to complete the transfer.
2. If you sent the request to another party, they need to click the link to Accept the transfer that was generated in step 2. 

:::image type="content" source="./media/subscription-change-directory/7-accept-transfer.png" alt-text="Screenshot that shows the acceptance of a transfer." lightbox="./media/subscription-change-directory/7-accept-transfer.png":::
