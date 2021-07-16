---
title: "X12 TA1 Acknowledgment Error Codes | Microsoft Docs"
description: X12 TA1 Acknowledgement error code in Logic Apps X12 message processing with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: praveensri
ms.author: psrivas
ms.reviewer: estfan, divswa, azla
ms.topic: article
ms.date: 07/15/2021
---

# X12 TA1 Acknowledgment Error Codes
This topic lists the error codes used within the segments of an X12 TA1 acknowledgment. For more information about these segments, see [X12 TA1 Acknowledgment](./logic-apps-enterprise-integration-x12-ta1-acknowledgment.md).  
  
 The following table indicates which error codes specified by the X12 specification are supported in Logic App X12 message processing and which are unsupported. The values for engine behavior (TA104) are as follows:  
  
-   A = Accept  
  
-   E = Interchange accepted with errors  
  
-   R = Interchange rejected/suspended  
  
|Condition|Engine Behavior (TA104 Value)|TA105 Value|Supported?|  
|---------------|-------------------------------------|-----------------|----------------|  
|Success|A|000|Yes|  
|The Interchange Control Numbers in the header ISA 13 and trailer IEA02 do not match|E|001|Yes|  
|Standard in ISA11 (Control Standards) is not supported|E|002|Yes<br /><br /> (if there is an ID mismatch)|  
|Version of the controls is not supported|E|003|No<sup>1</sup>|  
|Segment Terminator is Invalid<sup>2</sup>|R|004|Yes|  
|Invalid Interchange ID Qualifier for Sender|R|005|Yes<br /><br /> (if there is an ID mismatch)|  
|Invalid Interchange Sender ID|E|006|Yes<sup>3</sup>|  
|Invalid Interchange ID Qualifier for Receiver|R|007|Yes<br /><br /> (if there is an ID mismatch)|  
|Invalid Interchange Receiver ID|E|008|No<sup>3</sup>|  
|Unknown Interchange Receiver ID|E|009|Yes|  
|Invalid Authorization Information Qualifier value|R|010|Yes<br /><br /> (if there is an ID mismatch)|  
|Invalid Authorization Information value|R|011|Yes<br /><br /> (if party is configured/valued)|  
|Invalid Security Information Qualifier value|R|012|Yes<br /><br /> (if there is an ID mismatch)|  
|Invalid Security Information value|R|013|Yes<br /><br /> (if party is configured/valued)|  
|Invalid Interchange Date value|R|014|Yes|  
|Invalid Interchange Time value|R|015|Yes|  
|Invalid Interchange Standards Identifier value|R|016|Yes|  
|Invalid Interchange Version ID value|R|017|Yes<sup>4</sup>|  
|Invalid Interchange Control Number value|R|018|Yes|  
|Invalid Acknowledgment Requested value|E|019|Yes|  
|Invalid Test Indicator value|E|020|Yes|  
|Invalid Number of Included Groups value|E|021|Yes|  
|Invalid Control Structure|R|022|Yes|  
|Improper (Premature) End-of-File (Transmission)|R|023|Yes|  
|Invalid Interchange Content (e.g., Invalid GS segment)|R|024|Yes|  
|Duplicate Interchange Control Number|R<br /><br /> (based off settings)|025|Yes|  
|Invalid Data Element Separator|R|026|Yes|  
|Invalid Component Element Separator|R|027|Yes|  
|Invalid Delivery Date in Deferred Delivery Request|Not supported|-|-|  
|Invalid Delivery Time in Deferred Delivery Request|Not supported|-|-|  
|Invalid Delivery Time Code in Deferred Delivery Request|Not supported|-|-|  
|Invalid Grade of Service|Not supported|-|-|  
  
 <sup>1</sup> Error code 017 is used instead.  
  
 <sup>2</sup> Valid combinations of the segment terminator are: Segment Terminator char only, and Segment Terminator character followed by suffix 1 and suffix 2.  
  
 <sup>3</sup> Supported if receiving an interchange on a receive port requiring authentication. Sender ID related properties will be reviewed and if inconsistent will be rejected. If party settings are not available due to not being configured, the interchange will be rejected.  
  
 <sup>4</sup> Indicates that enum value is invalid.
