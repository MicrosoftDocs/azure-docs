---
title: Move Azure API for FHIR instance to a different subscription or resource group
description: This article describes how to move Azure an API for FHIR instance  
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: kesheth
---

# Move Azure API for FHIR to a different subscription or resource group

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this article, you'll learn how to move an Azure API for FHIR instance to a different subscription or another resource group.  

Moving to a different region isn’t supported, though the option may be available from the list. For more information, see [Move operation support for resources](../../azure-resource-manager/management/move-support-resources.md).

> [!Note] 
> Moving an instance of Azure API for FHIR between subscriptions or resource groups is supported, as long as Private Link is NOT enabled and no IoMT connectors are created.

## Move to another subscription

You can move an Azure API for FHIR instance to another subscription from the portal. However, the runtime and data for the service aren’t moved. On average the **move** operation takes approximately 15 minutes or so, and the actual time may vary.

The **move** operation takes a few simple steps.

1. Select a FHIR service instance 

Select the FHIR service from the source subscription and then the target subscription.

  :::image type="content" source="media/move/move-source-target.png" alt-text="Screenshot of Move to another subscription with source and target." lightbox="media/move/move-source-target.png":::

2. Validate the move operation

This step validates whether the selected resource can be moved. It takes a few minutes and returns a status from **Pending validation** to **Succeeded** or **Failed**. If the validation failed, you can view the error details, fix the error, and restart the **move** operation.

  :::image type="content" source="media/move/move-validation.png" alt-text="Screenshot of Move to another subscription with validation." lightbox="media/move/move-validation.png":::

3. Review and confirm the move operation
 
After reviewing the move operation summary, select the confirmation checkbox at the bottom of the screen and press the Move button to complete the operation.

  :::image type="content" source="media/move/move-review.png" alt-text="Screenshot of Move to another subscription with confirmation." lightbox="media/move/move-review.png":::

Optionally, you can check the activity log in the source subscription and target subscription.

## Move to another resource group

The process works similarly to **Move to another subscription**, except the selected FHIR service will be moved to a  different resource group in the same subscription.

## Next steps

In this article, you've learned how to move the Azure API for FHIR instance. For more information about the supported FHIR features in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

