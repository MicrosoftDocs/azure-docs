---
author: inhenkel
ms.topic: include
ms.date: 11/13/2020
ms.author: inhenkel
---

A callback URL is used to notify the customer (through a POST request) about the following events:

- Indexing state change: 
   - Properties:    
    
      |Name|Description|
      |---|---|
      |id|The video ID|
      |state|The video state|  

   - Example: https:\//test.com/notifyme?projectName=MyProject&id=1234abcd&state=Processed

- Person identified in video:
  - Properties
    
      |Name|Description|
      |---|---|
      |id| The video ID|
      |faceId|The face ID that appears in the video index|
      |knownPersonId|The person ID that is unique within a face model|
      |personName|The name of the person|
        
   - Example: https:\//test.com/notifyme?projectName=MyProject&id=1234abcd&faceid=12&knownPersonId=CCA84350-89B7-4262-861C-3CAC796542A5&personName=Inigo_Montoya 
