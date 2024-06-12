---
title: Logging for Azure Health Data Services
description: Learn to monitor Azure Health Data Services with AuditLogs for secure healthcare service trails and operational insights. Discover log types and uses.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.topic: tutorial
ms.date: 06/12/2024
ms.author: jasteppe
---

# Logging for Azure Health Data Services

While activity logs are available for each Azure resource from the Azure portal, Azure Health Data Services emits resource logs, which include two categories of logs: AuditLogs and DiagnosticLogs.

- AuditLogs provide audit trails for healthcare services. For example, a caller's IP address and resource URL are logged when a user or application accesses the FHIR service. Each service emits required properties and optionally implements other properties.
- DiagnosticLogs provide insight into the operation of the service, for example, log level (information, warning, or error), and log message.

Here's an example of the AuditLog:

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

[Enable diagnostic logging in the DICOM service](./dicom/enable-diagnostic-logging.md)

[Enable diagnostic settings for the MedTech service](./../healthcare-apis/iot/how-to-enable-diagnostic-settings.md)

[Use Azure Monitor logs](../azure-monitor/essentials/platform-logs-overview.md).

[Supported metrics with Azure Monitor](../azure-monitor/essentials/metrics-supported.md)
