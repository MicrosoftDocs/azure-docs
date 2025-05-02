---
title: Solutions for common errors and problems in B2B scenarios
description: Find solutions for common errors and problems when troubleshooting B2B scenarios in Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 02/20/2025
---

# B2B errors and solutions for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This article helps you troubleshoot errors that might happen in Azure Logic Apps B2B scenarios and suggests appropriate actions for correcting those errors.

## Agreement resolution

| Error summary | Error | Resolution |
|---------------|-------|------------|
| No agreement found. | **No agreement found with Agreement Resolution Parameters.** | Add an agreement with the appropriate business identities to your integration account. Make sure that the business identities match to the input message IDs. |
| No agreement found with identities. | **No agreement found with identities: 'AS2Identity'::'Partner1' and'AS2Identity'::'Partner3'** | The agreement has invalid **AS2-From** or **AS2-To** values. To match the AS2 IDs in the AS2 message headers for your agreement setup, correct the AS2 message header values **AS2-From** or **AS2-To** or the agreement. |

## AS2

| Error summary | Error | Resolution |
|---------------|-------|------------|
| Missing AS2 message headers | **Invalid AS2 headers. One of the "AS2-To" or "AS2-From" headers is empty.** | A received AS2 message didn't contain the headers for **AS2-From**, **AS2-To**, or both. Check the AS2 message headers for **AS2-From** and **AS2-To**, and correct them based on your agreement setup. |
| Missing AS2 message body and headers | **The request content is null or empty.** | A received AS2 message didn't contain a message body. Make sure that a message body exists. |
| AS2 message decryption failure | **`[processed/Error: decryption-failed]`** | Apply the `@base64ToBinary()` function to the AS2Message before sending the message to the trading partner. See [Example - AS2 message decryption failure example](#as2-decryption-failure). |
| Message Disposition Notification (MDN) decryption failure | **`[processed/Error: decryption-failed]`** | Apply the `@base64ToBinary()` function to the MDN before sending the notification to the partner. See [Example - Message Disposition Notification (MDN) decryption failure](#mdn-decryption-failure). |
| Missing signing certificate | **The Signing Certificate has not been configured for AS2 party. AS2-From: partner1 AS2-To: partner2** | Set the AS2 agreement settings with the correct certificate for the signature. |

<a name="as2-decryption-failure"></a>
### Example - AS2 message decryption failure

```json
"HTTP": {
   "inputs": {
   "body": "@base64ToBinary(body('Encode_to_AS2_message')?['AS2Message']?['Content'])",
   "headers": "@body('Encode_to_AS2_message')?['AS2Message']?['OutboundHeaders']",
   "method": "POST",
   "uri": "xxxxx.xxx"
},
``` 

<a name="mdn-decryption-failure"></a>
### Example - Message Disposition Notification (MDN) decryption failure

```json
"Response": {
   "inputs": {
   "body": "@base64ToBinary(body('Decode_AS2_message')?['OutgoingMDN']?['Content'])",
   "headers": "@body('Decode_AS2_message')?['OutgoingMDN']?['OutboundHeaders']",
   "statusCode": 200
},               
``` 

## X12 and EDIFACT

| Error summary | Error | Resolution |
|---------------|-------|------------|
| Duplicate check is enabled in the agreement. | **Duplicate Control Number** | This error indicates that the received message has duplicate control numbers. Correct the control number, and resend the message. |
| Missing schema in the agreement | **Error encountered during parsing. The X12 transaction set with ID '564220001' contained in functional group with ID '56422', in interchange with ID '000056422', with sender ID '12345678', receiver ID '87654321' is being suspended with following errors: "The message has an unknown document type and did not resolve to any of the existing schemas configured in the agreement"** | Set up the schema in the agreement settings. |
| Incorrect schema in the agreement | **The message has an unknown document type and did not resolve to any of the existing schemas configured in the agreement.** | Set up the correct schema in the agreement settings. |
| Leading or trailing space found | **Error encountered during parsing. The EDIFACT transaction set with ID '123456' contained in interchange (without group) with ID '987654', with sender ID 'Partner1', receiver ID 'Partner2' is being suspended with following errors: "Leading Trailing separator found"** | Set up or edit the agreement settings to allow leading and trailing whitespace. See [Example - Allow leading and trailing whitespace](#allow-leading-trailing-whitespace). |

<a name="allow-leading-trailing-whitespace"></a>
### Example - Set up agreement settings to allow leading and trailing whitespace

![Screenshot shows example for setting to allow leading and trailing whitespace.](./media/logic-apps-enterprise-integration-b2b-list-errors-solutions/leadingandtrailing.png)

## Flat file

| Error summary | Error | Resolution |
|---------------|-------|------------|
| Input message with no body | **InvalidTemplate. Unable to process template language expressions in action 'Flat_File_Decoding' inputs at line '1' and column '1902': 'Required property 'content' expects a value but got null. Path ''.'.** | This error indicates that the input message doesn't contain a body. Make sure that the input message contains a body. |

## Related content

- [Exchange B2B messages between partners using workflows in Azure Logic Apps](/azure/logic-apps/logic-apps-enterprise-integration-b2b)
