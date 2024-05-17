---
title: Logging for Azure Health Data Services
description: This article explains how logging works and how to enable logging for the Azure Health Data Services
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 10/10/2022
ms.author: chrupa
---

# Logging for Azure Health Data Services

The Azure platform provides three types of logs, activity logs, resource logs and Microsoft Entra logs. For more information, see [activity logs](../azure-monitor/essentials/platform-logs-overview.md). In this article, you’ll learn about how logging works for the Azure Health Data Services.

## AuditLogs
While activity logs are available for each Azure resource from the Azure portal, Azure Health Data Services emits resource logs, which include two categories of logs, AuditLogs and DiagnosticLogs.

- AuditLogs provide auditing trails for healthcare services. For example, a caller's IP address and resource URL are logged when a user or application accesses the FHIR service. Each service emits required properties and optionally implements additional properties.
- DiagnosticLogs provides insight into the operation of the service, for example, log level (information, warning or error) and log message.

At this time, Azure Health Data Services only supports AuditLogs.

Below is one example of the AuditLog.

```
{
    "time": "2021-08-02 16:01:29Z",
    "resourceId": "/SUBSCRIPTIONS/xxx/RESOURCEGROUPS/xxx/PROVIDERS/MICROSOFT.HEALTHCAREAPIS/SERVICES/xxx",
    "operationName": "Microsoft.HealthcareApis/services/fhir-R4/search-type",
    "category": "AuditLogs",
    "resultType": "Started",
    "resultSignature": 0,
    "durationMs": 0,
    "callerIpAddress": "::ffff:73.164.17.31",
    "correlationId": "5d04211aaf172d43b83d9eb500464ec5",
    "identity": {
        "claims": {
            "iss": "https://sts.windows.net/xxx/",
            "oid": "xxx"
        }
    },
    "level": "Informational",
    "location": "South Central US",
    "uri": "https://xxx.azurehealthcareapis.com:443/Patient",
    "properties": {
        "fhirResourceType": "Patient"
    }
}
```

## Next steps

In this article, you learned how to enable diagnostic logging for Azure Health Data Services. For more information about the supported metrics for Azure Health Data Services with Azure Monitor, see 

>[!div class="nextstepaction"]
>[Supported metrics with Azure Monitor](../azure-monitor/essentials/metrics-supported.md).

For more information about service logs and metrics for the DICOM service and MedTech service, see

>[!div class="nextstepaction"]
>[Enable diagnostic logging in the DICOM service](./dicom/enable-diagnostic-logging.md)

>[!div class="nextstepaction"]
>[How to enable diagnostic settings for the MedTech service](./../healthcare-apis/iot/how-to-enable-diagnostic-settings.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
