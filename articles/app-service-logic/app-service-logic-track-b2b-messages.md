<properties 
   pageTitle="Track B2B messages in your logic apps in Azure App Service | Microsoft Azure" 
   description="This topic covers tracking of B2B processing" 
   services="logic-apps" 
   documentationCenter=".net,nodejs,java" 
   authors="rajram" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="04/20/2016"
   ms.author="rajram"/>


# Track B2B messages

[AZURE.INCLUDE [app-service-logic-version-message](../../includes/app-service-logic-version-message.md)]

## B2B Tracking Information
B2B communication involves message processing between trading partners. The relationships are defined as agreements between two trading partners. Once the communication is established, there needs to be a way to monitor if the communication is happening as expected. 

We've implemented message tracking for the following B2B scenarios: AS2, EDIFACT, and X12.

## AS2
Once you have created an instance of an AS2 API App, browse to that instance, and select **Tracking**. Herein you can view and filter all the AS2 tracking information:  

![][1]  

## EDIFACT
Once you have created an instance of an EDIFACT API App, browse to that instance, and select **Tracking**. Herein you can view and filter all the EDIFACT tracking information. Additionally, you can view the interchange level, group level, and transaction set level data, all in a single view. 

If batches are created as part of EDIFACT agreements in the associated Trading Partner Management API app, then the Batching section lists all these batches. You can select a batch to see the active message (if any) and also the information for the completed:  

![][2]      

## X12
Once you have created an instance of an X12 API App, browse to that instance, and select **Tracking**. Herein you can view and filter all the X12 tracking information. Additionally, you can view the interchange level, group level, and transaction set level data, all in a single view.

If batches are created as part of X12 agreements in the associated Trading Partner Management API app, then the Batching section lists all these batches. You can select a batch to see the active message (if any) and also the information for the completed batches.

<!--Image references-->
[1]: ./media/app-service-logic-track-b2b-messages/AS2Tracking.png
[2]: ./media/app-service-logic-track-b2b-messages/EDIFACTTracking.png
