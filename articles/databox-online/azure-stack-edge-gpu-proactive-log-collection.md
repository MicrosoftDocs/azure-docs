---
title: Understand proactive log collection on Azure Stack Edge Pro device
description: Describes how proactive log collection is done on an Azure Stack Edge Pro device and how to disable it.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/26/2021
ms.author: alkohli
---

# Proactive log collection on your Azure Stack Edge device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Proactive log collection gathers system health indicators on your Azure Stack Edge device to help you efficiently troubleshoot any device issues. Proactive log collection is enabled by default. This article describes what is logged, how Microsoft handles the data, and how to disable or enable proactive log collection.

## About proactive log collection

Microsoft Customer Support and Engineering teams use system logs from your Azure Stack Edge device to efficiently identify and fix issues that might come up during operation. Proactive log collection is a method that alerts Microsoft that an issue/event has been detected by the customer’s Azure Stack Edge appliance. See [Proactive log collection indicators](#proactive-log-collection-indicators) for events that are tracked. The support logs pertaining to the issue are automatically uploaded to an Azure Storage account that Microsoft manages and controls. Microsoft Support and Microsoft engineers review these support logs to determine the best course of action to resolve the issue with the customer.

> [!NOTE]
> These logs are only used for debugging purposes and to provide support to the customers in case of issues.


## Enabling proactive log collection

Proactive log collection is enabled by default. You can disable proactive log collection when trying to activate the device via the local UI. 

1. In the local web UI of the device, go to the **Get started** page.

2. On the **Activation** tile, select **Activate**. 

    ![Local web UI "Cloud details" page 1](./media/azure-stack-edge-pro-r-deploy-activate/activate-1.png)

3. In the **Activate** pane:

   1. Enter the **Activation key** that you got in [Get the activation key for Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-prep.md#get-the-activation-key).

      Once activated, proactive log collection is enabled by default, allowing Microsoft to collect logs based on the health status of the device. These logs are uploaded to an Azure Storage account. 

      You can disable proactive log collection to stop Microsoft from collecting logs.

   1. If you want to disable proactive log collection on the device, select **Disable**.

   1. Select **Activate**.

   ![Local web UI "Cloud details" page 2](./media/azure-stack-edge-pro-r-deploy-activate/activate-2.png)

## Proactive log collection indicators

After the proactive log collection is enabled, logs are uploaded automatically when one of the following events is detected on the device:  


|Alert/Error/Condition  |Description  |
|---------|---------|
|AcsUnhealthyCondition     |Azure Consistent Services are unhealthy.         |
|IOTEdgeAgentNotRunningCondition      |IoT Edge Agent is not running.         |
|UpdateInstallFailedEvent | Could not install the update.        |

 
Microsoft will continue to add new events to the preceding list. No additional consent is needed for new events. Refer to this page to learn about the most up-to-date proactive log collection indicators.    
 

## Other log collection methods

Besides proactive log collection, which collects specific logs pertaining to a specific issue detected, other log collections can give a much deeper understanding of system health and behavior. Usually, these other logs can be collected during a support request or triggered by Microsoft based on telemetry data from the device.

## Handling data

When proactive log collection is enabled, the customer agrees to Microsoft collecting logs from the Azure Stack Edge device as described herein. The customer also acknowledges and consents to the upload and retention of those logs in an Azure Storage account managed and controlled by Microsoft.

Microsoft uses the data for troubleshooting system health and issues only. The data is not used for marketing, advertising, or any other commercial purposes without the customer consent. 

The data Microsoft collects is handled as per our standard privacy practices. Should a customer decide to revoke its consent for proactive log collection, any data collected with consent prior to the revocation will not be affected.

## Next steps

Learn how to [Gather a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package).