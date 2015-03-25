<properties 
   pageTitle="Archive AS2 messages" 
   description="This topic covers archival of AS2 messages" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="harishkragarwal" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/18/2015"
   ms.author="hariag"/>


#Archive AS2 Messages

**AS2 Connector** exposes the ability to archive messages. Archiving stores the message in the **Azure Blob Container** that is a part of package settings. 

Archiving is exposed at two points for both messages and acknowledgements (MDNs):

1. **Receive/Decode Trigger**: the message is archived as soon as it is received by the API App instance 
2. **Encode/Send Action**: the encoded message is archived, after all processing is complete and just before it is sent to the partner 

##How To: Retrieve Archived URL of Message

Browse to the AS2 Connector API App instance and click 'Tracking'. Narrow down the tracking information by using filter parameters. Once your message is in view, click to see its detailed view. The archived URL for the message will be displayed in this detailed view.

![][1]  

##How To: Retrieve Archived Message

Use the URL retrieved above to retrieve the archived message from Azure Blob Storage.


<!--Image references-->
[1]: ./media/app-service-logic-archive-as2-messages/Tracking.jpg
