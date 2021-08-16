---
title: Logging for Azure Healthcare APIs
description: This article explains how logging works and how to enable logging for the Azure Healthcare APIs
services: healthcare-apis
author: ginalee-dotcom
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 08/16/2021
ms.author: bxue
---

# Logging for Azure Healthcare APIs (preview)

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure platform provides three types of logs, activity logs, resource logs and Azure Active Directory logs. See more details on [activity logs](https://docs.microsoft.com/azure/azure-monitor/essentials/platform-logs-overview). In this article, you will learn about how logging works for the Azure Healthcare APIs.

## AuditLogs
While activity logs are available for each Azure resource from the Azure portal, the Healthcare APIs emit resource logs, which include two categories of logs, AuditLogs and DiagnosticLogs.

- AuditLogs provides auditing trail for healthcare services, for example, caller's ip address and resource url when a user or application accesses the FHIR service. Each service emits required properties and optionally implements additional properties.
- DiagnosticLogs provides insight into the operation of the service, for example, log level (information, warning or error) and log message.

Currently, Healthcare APIs only supports AuditLogs for public preview. DiagnosticLogs will be available when the service is generally available.

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

You can find latest supported metrics for the Healthcare APIs with Azure Monitor [here](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-supported).

For more details on DICOM service logs and metrics, see [here](https://docs.microsoft.com/en-us/azure/healthcare-apis/dicom/enable-diagnostic-logging).

For more details on IoT Connector logs and metrics, see [here](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/iot-metrics-display).
