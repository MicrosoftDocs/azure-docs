---
title: Export Azure IoT connector for FHIR (preview) Metrics through Diagnostic settings
description: This article explains how to export Azure IoT connector for FHIR (preview) Metrics through Diagnostic settings
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 06/03/2022
ms.author: jasteppe
---

# Export IoT connector for FHIR (preview) Metrics through Diagnostic settings

> [!IMPORTANT]
> As of September 2022, the IoT Connector feature within Azure API for FHIR will be retired and replaced with the [MedTech service](../../healthcare-apis/iot/deploy-iot-connector-in-azure.md) for enhanced service quality and functionality.
> 
> All new users are directed to deploy and use the MedTech service feature within the Azure Health Data Services. For more information about the MedTech service, see [What is the MedTech service?](../../healthcare-apis/iot/iot-connector-overview.md).

In this article, you'll learn how to export Azure IoT connector for Fast Healthcare Interoperability Resources (FHIR&#174;) Metrics logs. The feature that enables Metrics logging is the [**Diagnostic settings**](../../azure-monitor/essentials/diagnostic-settings.md) in the Azure portal. 

> [!TIP]
> Follow the guidance in [Enable Diagnostic Logging in Azure API for FHIR and Azure IoT Connector for FHIR](enable-diagnostic-logging.md#enable-diagnostic-logging-in-azure-api-for-fhir) to set up audit logging.

## Enable Metrics logging for the Azure IoT connector for FHIR (preview)
1. To enable Metrics logging for the Azure IoT connector for FHIR, select your Azure API for FHIR service in the Azure portal. 

2. Under **Monitoring**, select the **Diagnostic settings**.

3. Select **+ Add diagnostic setting**.

   :::image type="content" source="media/iot-metrics-export/diagnostic-settings-main.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-export/diagnostic-settings-main.png"::: 

4. Enter a name in the **Diagnostic setting name** dialog box.

5. Select the method you want to use to access your diagnostic logs:

    1. **Archive to a storage account** for auditing or manual inspection. The storage account you want to use needs to be already created.
    2. **Stream to event hub** for ingestion by a third-party service or custom analytic solution. You'll need to create an event hub namespace and event hub policy before you can configure this step.
    3. **Stream to the Log Analytics** workspace in Azure Monitor. You'll need to create your Logs Analytics Workspace before you can select this option.

6. Select **Errors, Traffic, and Latency** for the Azure IoT connector for FHIR.  Select any additional metric categories you want to capture for Azure API for FHIR.

7. Select **Save**.

   :::image type="content" source="media/iot-metrics-export/diagnostic-setting-add.png" alt-text="IoT Connector2" lightbox="media/iot-metrics-export/diagnostic-setting-add.png":::

> [!Note] 
> It might take up to 15 minutes for the first Metrics logs to display in the repository of your choice.  
 
For more information about how to work with diagnostic logs, see [Overview of Azure platform logs](../../azure-monitor/essentials/platform-logs-overview.md).

## Conclusion 
Having access to Metrics logs is essential for monitoring and troubleshooting.  Azure IoT connector for FHIR allows you to do these actions through Metrics logs. 

## Next steps

For more information about the frequently asked questions of Azure IoT connector for FHIR, see

>[!div class="nextstepaction"]
>[Azure IoT connector for FHIR FAQs](fhir-faq.yml)

>[!div class="nextstepaction"]
>[Frequently asked questions about IoT connector](../../healthcare-apis/iot/iot-connector-faqs.md)

*In the Azure portal, Azure IoT connector for FHIR is referred to as IoT connector (preview). FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

