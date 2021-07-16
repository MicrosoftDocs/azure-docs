---
title: "EDIFACT CONTRL Acknowledgment | Microsoft Docs"
description: "EDIFACT CONTRL Acknowledgment in Logic Apps EDIFACT message processing with Enterprise Integration Pack"
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: reference
ms.date: 07/15/2021
---
# EDIFACT CONTRL Acknowledgment
The CONTRL acknowledgment (ACK) serves as both technical and functional acknowledgment for EDIFACT-encoded messages. As a technical acknowledgment, the CONTRL message indicates receipt of an interchange. As a functional acknowledgment, the CONTRL message indicates acceptance or rejection of the received interchange, group, or message, with a list of errors or unsupported functionality.  
  
 The full CONTRL message serves as the functional ACK. Sections of the functional ACK are reused for the technical ACK. If you have selected both technical and functional ACKs in the party properties for a sending party or in global properties, Logic App EDIFACT Decode action will generate two CONTRL messages: a technical CONTRL ACK and a functional CONTRL ACK.  
  
 The CONTRL ACK conforms to the EFACT_\<Version number\>_CONTRL.xsd schema.  
  
## Technical Acknowledgement  
 A technical ACK implies that the recipient of the interchange:  
  
-   has received the subject interchange;  
  
-   acknowledges the parts of the subject interchange that have been checked in order to ensure that the data elements copied into the reporting UCI segment are syntactically correct;  
  
-   has accepted responsibility for notifying the sender of acknowledgement or rejection of the other parts of the subject interchange;  
  
-   and has taken reasonable precautions in order to ensure that the sender is so notified.  
  
## Functional Acknowledgement  
 A functional ACK implies that the recipient of the interchange:  
  
- has received the referenced levels(s) of the interchange acknowledged;  
  
- has checked that there are no fatal syntactic errors in the acknowledged referenced level that prevents further processing of the interchange;  
  
- has checked that all acknowledged parts of service segments are semantically correct (if no errors are reported);  
  
- will comply with the actions requested in the acknowledged referenced-levels of the service segments;  
  
- has accepted responsibility for notifying the sender by other means than sending a CONTRL message if any syntactic or semantic errors as described above, are later detected in the relevant part, or the part cannot be processed for some other reason after the part has been acknowledged in a submitted CONTRL message;  
  
- and has taken reasonable precautions in order to ensure that such errors are detected and that the sender is notified.  
  
  Rejection implies that the recipient of the interchange:  
  
- cannot acknowledge the subject interchange, or the relevant parts of it, for reasons indicated in the CONTRL message;  
  
- and will not take any further action on business information contained in the rejected part of the subject interchange.  
  
## In This Section  
  
-   [EDIFACT CONTRL Message as Technical Acknowledgment](./logic-apps-enterprise-integration-edifact-contrl-message-as-technical-acknowledgment.md)  
  
-   [EDIFACT CONTRL Message as Functional Acknowledgment](./logic-apps-enterprise-integration-edifact-contrl-message-as-functional-acknowledgment.md)  
  