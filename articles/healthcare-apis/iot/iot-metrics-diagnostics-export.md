---
title: Export IoT connector Metrics through Diagnostic settings - Azure Healthcare APIs
description: This article explains how to export IoT connector metrics through Diagnostic settings
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 09/30/2021
ms.author: jasteppe
---

# Export IoT connector Metrics through Diagnostic settings

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you'll learn how to export IoT connector Metrics logs. The feature that enables Metrics logging is the [**Diagnostic settings**](../../azure-monitor/essentials/diagnostic-settings.md) in the Azure portal. 

## Enable Metrics logging for IoT connector
1. To enable Metrics logging for the IoT connector, select your Fast Healthcare Interoperability Resources (FHIR&#174;) service in the Azure portal. 

2. Navigate to **Diagnostic settings** 

3. Select **+ Add diagnostic setting**

   :::image type="content" source="media/iot-metrics-export/diagnostic-settings-main.png" alt-text="IoT connector1" lightbox="media/iot-metrics-export/diagnostic-settings-main.png"::: 

4. Enter a name in the **Diagnostic setting name** dialog box.

5. Select the method you want to use to access your diagnostic logs:

    1. **Archive to a storage account** for auditing or manual inspection. The storage account you want to use needs to be already created.
    2. **Stream to event hub** for ingestion by a third-party service or custom analytic solution. You'll need to create an event hub namespace and event hub policy before you can configure this step.
    3. **Stream to the Log Analytics** workspace in Azure Monitor. You'll need to create your Logs Analytics Workspace before you can select this option.

6. Select **Errors, Traffic, and Latency** for IoT connector.  Select any extra metric categories you want to capture for the FHIR service.

7. Select **Save**

   :::image type="content" source="media/iot-metrics-export/diagnostic-setting-add.png" alt-text="IoT connector2" lightbox="media/iot-metrics-export/diagnostic-setting-add.png":::

> [!Note] 
> It might take up to 15 minutes for the first Metrics logs to display in the repository of your choice.  
 
For more information about how to work with diagnostic logs, see the [Azure Resource Log documentation](../../azure-monitor/essentials/platform-logs-overview.md)

## Conclusion 
Having access to Metrics logs is essential for monitoring and troubleshooting.  IoT connector allows you to do these actions through Metrics logs. 

## Next steps

Check out frequently asked questions about the IoT connector.

>[!div class="nextstepaction"]
>[IoT connector FAQs](../fhir/fhir-faq.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.