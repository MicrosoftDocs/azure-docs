<properties 
   pageTitle="Archive AS2 Messages" 
   description="This topic covers archival of AS2 messages" 
   services="app-service-logic" 
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
   ms.date="02/27/2015"
   ms.author="hariag"/>
   
The 'AS2 Connector' API App exposes archiving functionality. 
Archiving simply stores the message at that point to the Azure Blob Container provided as part of the AS2 Connector package settings. 

Archive capability is currently exposed at 2 points:

1. As part of Receive/Decode trigger: the message will be archived as soon as it is received by the API App instance 
2. As part of Encode/Send action: the message will be archived post all processing has is complete and just before it is sent to the partner i.e. the encoded message will be archived

The above is true for both messages and acknowledgments (MDNs). 

**To know the archive location of a message**

Browse to the required AS2 Connector API App instance and then click the 'Tracking' part. The tracking/processing information for this API App will surfaces here. One can narrow down the list by using the filter parameters surfaced. Once the required message is in view then click on it to see its detailed view. Herein the archive URL for the message will be displayed if archiving was enabled for it.  

**To fetch the archived message**

Use the URL fetched above to retrieve the archived message from Azure Blobs.    
