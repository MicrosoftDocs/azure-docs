---
title: Monitoring Azure monitor data reference  
description: Important reference material needed when you monitor parts of Azure Monitor  
author: rboucher
ms.author: robb
ms.topic: reference
ms.service: azure-monitor
ms.custom: subject-monitoring
ms.date: 04/03/2022
ms.reviewer: robb
---

# Monitoring Azure Monitor data reference

> [!NOTE]
> This article may seem confusing because it lists the parts of the Azure Monitor service that are monitored by itself.

See [Monitoring Azure Monitor](monitor-azure-monitor.md) for an explanation of how Azure Monitor monitors itself.

## Metrics

This section lists all the platform metrics collected automatically for Azure Monitor into Azure Monitor.   

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| [Autoscale behaviors for VMs and AppService](./autoscale/autoscale-overview.md) | [microsoft.insights/autoscalesettings](/azure/azure-monitor/platform/metrics-supported#microsoftinsightsautoscalesettings) |

While technically not about Azure Monitor operations, the following metrics are collected into Azure Monitor namespaces.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Log Analytics agent gathered data for the [Metric alerts on logs](./alerts/alerts-metric-logs.md#metrics-and-dimensions-supported-for-logs) feature | [Microsoft.OperationalInsights/workspaces](/azure/azure-monitor/platform/metrics-supported##microsoftoperationalinsightsworkspaces)
| [Application Insights availability tests](./app/availability-overview.md) | [Microsoft.Insights/Components](./essentials/metrics-supported.md#microsoftinsightscomponents)

See a complete list of [platform metrics for other resources types](/azure/azure-monitor/platform/metrics-supported).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

The following dimensions are relevant for the following areas of Azure Monitor. 

### Autoscale

| Dimension Name | Description |
| ------------------- | ----------------- |
|MetricTriggerRule    | The autoscale rule that triggered the scale action |
|MetricTriggerSource  | The metric value that triggered the scale action |
|ScaleDirection       | The direction of the scale action (up or down)

## Resource logs

This section lists all the Azure Monitor resource log category types collected.

|Resource Log Type | Resource Provider / Type Namespace<br/> and link |
|-------|-----|
| [Autoscale for VMs and AppService](./autoscale/autoscale-overview.md) | [Microsoft.insights/autoscalesettings](./essentials/resource-logs-categories.md#microsoftinsightsautoscalesettings)|
| [Application Insights availability tests](./app/availability-overview.md) | [Microsoft.insights/Components](./essentials/resource-logs-categories.md#microsoftinsightscomponents) |

For additional reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).


## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Monitor resource types and available for query by Log Analytics.

|Resource Type | Notes |
|--------------|-------|
| [Autoscale for VMs and AppService](./autoscale/autoscale-overview.md) | [Autoscale Tables](/azure/azure-monitor/reference/tables/tables-resourcetype#azure-monitor-autoscale-settings) | 


## Activity log

For a partial list of entires that the Azure Monitor services writes to the activity log, see [Azure resource provider operations](../role-based-access-control/resource-provider-operations.md#monitor).  There may be other entires not listed here.

For more information on the schema of Activity Log entries, see [Activity  Log schema](./essentials/activity-log-schema.md).

## Schemas

The following schemas are in use by Azure Monitor.

### Action Groups

The following schemas are relevant to action groups, which are part of the notification infrastructure for Azure Monitor. Following are example calls and responses for action groups.

#### Create Action Group
```json
{
    "authorization": {
        "action": "microsoft.insights/actionGroups/write",
        "scope": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc"
    },
    "caller": "test.cam@ieee.org",
    "channels": "Operation",
    "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/04ebb17f-c9d2-bbbb-881f-8fd503332aac/",
        "iat": "1627074914",
        "nbf": "1627074914",
        "exp": "1627078814",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "AUQAu/8TbbbbyZJhgackCVdLETN5UafFt95J8/bC1SP+tBFMusYZ3Z4PBQRZUZ4SmEkWlDevT4p7Wtr4e/R+uksbfixGGQumxw==",
        "altsecid": "1:live.com:00037FFE809E290F",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
        "appid": "c44b4083-3bb0-49c1-bbbb-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "test.cam@ieee.org",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "cam",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "test",
        "groups": "d734c6d5-bbbb-4b39-8992-88fd979076eb",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "live.com",
        "ipaddr": "73.254.xxx.xx",
        "name": "test cam",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "f19e58c4-5bfa-4ac6-8e75-9823bbb1ea0a",
        "puid": "1003000086500F96",
        "rh": "0.AVgAf7HrBNLJbkKIH4_VAzMqrINAS8SwO8FJtH2XTlPL3zxYAFQ.",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "SzEgbtESOKM8YsOx9t49Ds-L2yCyUR-hpIDinBsS-hk",
        "http://schemas.microsoft.com/identity/claims/tenantid": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "live.com#test.cam@ieee.org",
        "uti": "KuRF5PX4qkyvxJQOXwZ2AA",
        "ver": "1.0",
        "wids": "62e90394-bbbb-4237-9190-012177145e10",
        "xms_tcdt": "1373393473"
    },
    "correlationId": "74d253d8-bd5a-4e8d-a38e-5a52b173b7bd",
    "description": "",
    "eventDataId": "0e9bc114-dcdb-4d2d-b1ea-d3f45a4d32ea",
    "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:21:22.9871449Z",
    "id": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/0e9bc114-dcdb-4d2d-b1ea-d3f45a4d32ea/ticks/637626720829871449",
    "level": "Informational",
    "operationId": "74d253d8-bd5a-4e8d-a38e-5a52b173b7bd",
    "operationName": {
        "value": "microsoft.insights/actionGroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "testK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actionGroups",
        "localizedValue": "microsoft.insights/actionGroups"
    },
    "resourceId": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "Created",
        "localizedValue": "Created (HTTP Status Code: 201)"
    },
    "submissionTimestamp": "2021-07-23T21:22:22.1634251Z",
    "subscriptionId": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a",
    "tenantId": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
    "properties": {
        "statusCode": "Created",
        "serviceRequestId": "33658bb5-fc62-4e40-92e8-8b1f16f649bb",
        "eventCategory": "Administrative",
        "entity": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
        "message": "microsoft.insights/actionGroups/write",
        "hierarchy": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a"
    },
    "relatedEvents": []
}
```

#### Delete Action Group
```json
{
    "authorization": {
        "action": "microsoft.insights/actionGroups/delete",
        "scope": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testk-test/providers/microsoft.insights/actionGroups/TestingLogginc"
    },
    "caller": "test.cam@ieee.org",
    "channels": "Operation",
    "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/04ebb17f-c9d2-bbbb-881f-8fd503332aac/",
        "iat": "1627076795",
        "nbf": "1627076795",
        "exp": "1627080695",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "AUQAu/8TbbbbTkWb9O23RavxIzqfHvA2fJUU/OjdhtHPNAjv0W4pyNnoZ3ShUOEzDut700WhNXth6ZYpd7al4XyJPACEfmtr9g==",
        "altsecid": "1:live.com:00037FFE809E290F",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
        "appid": "c44b4083-3bb0-49c1-bbbb-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "test.cam@ieee.org",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "cam",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "test",
        "groups": "d734c6d5-bbbb-4b39-8992-88fd979076eb",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "live.com",
        "ipaddr": "73.254.xxx.xx",
        "name": "test cam",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "f19e58c4-5bfa-4ac6-8e75-9823bbb1ea0a",
        "puid": "1003000086500F96",
        "rh": "0.AVgAf7HrBNLJbkKIH4_VAzMqrINAS8SwO8FJtH2XTlPL3zxYAFQ.",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "SzEgbtESOKM8YsOx9t49Ds-L2yCyUR-hpIDinBsS-hk",
        "http://schemas.microsoft.com/identity/claims/tenantid": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "live.com#test.cam@ieee.org",
        "uti": "E1BRdcfDzk64rg0eFx8vAA",
        "ver": "1.0",
        "wids": "62e90394-bbbb-4237-9190-012177145e10",
        "xms_tcdt": "1373393473"
    },
    "correlationId": "a0bd5f9f-d87f-4073-8650-83f03cf11733",
    "description": "",
    "eventDataId": "8c7c920e-6a50-47fe-b264-d762e60cc788",
    "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:52:07.2708782Z",
    "id": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testk-test/providers/microsoft.insights/actionGroups/TestingLogginc/events/8c7c920e-6a50-47fe-b264-d762e60cc788/ticks/637626739272708782",
    "level": "Informational",
    "operationId": "f7cb83ba-36fa-47dd-8ec4-bcac40879241",
    "operationName": {
        "value": "microsoft.insights/actionGroups/delete",
        "localizedValue": "Delete action group"
    },
    "resourceGroupName": "testk-test",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actionGroups",
        "localizedValue": "microsoft.insights/actionGroups"
    },
    "resourceId": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testk-test/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "OK",
        "localizedValue": "OK (HTTP Status Code: 200)"
    },
    "submissionTimestamp": "2021-07-23T21:54:00.1811815Z",
    "subscriptionId": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a",
    "tenantId": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
    "properties": {
        "statusCode": "OK",
        "serviceRequestId": "88fe5ac8-ee1a-4b97-9d5b-8a3754e256ad",
        "eventCategory": "Administrative",
        "entity": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testk-test/providers/microsoft.insights/actionGroups/TestingLogginc",
        "message": "microsoft.insights/actionGroups/delete",
        "hierarchy": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a"
    },
    "relatedEvents": []
}
```

#### Unsubscribe using Email

```json
{
    "caller": "test.cam@ieee.org",
    "channels": "Operation",
    "claims": {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "person@contoso.com",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": ""
    },
    "correlationId": "8f936022-18d0-475f-9704-5151c75e81e4",
    "description": "User with email address:person@contoso.com has unsubscribed from action group:TestingLogginc, Action:testEmail_-EmailAction-",
    "eventDataId": "9b4b7b3f-79a2-4a6a-b1ed-30a1b8907765",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:38:35.1687458Z",
    "id": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/9b4b7b3f-79a2-4a6a-b1ed-30a1b8907765/ticks/637626731151687458",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "microsoft.insights/actiongroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "testK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actiongroups",
        "localizedValue": "microsoft.insights/actiongroups"
    },
    "resourceId": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "Updated",
        "localizedValue": "Updated"
    },
    "submissionTimestamp": "2021-07-23T21:38:35.1687458Z",
    "subscriptionId": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a",
    "tenantId": "",
    "properties": {},
    "relatedEvents": []
}
```

#### Unsubscribe using SMS
```json
{
    "caller": "",
    "channels": "Operation",
    "claims": {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "4252137109",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/spn": "",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": ""
    },
    "correlationId": "e039f06d-c0d1-47ac-b594-89239101c4d0",
    "description": "User with phone number:4255557109 has unsubscribed from action group:TestingLogginc, Action:testPhone_-SMSAction-",
    "eventDataId": "789d0b03-2a2f-40cf-b223-d228abb5d2ed",
    "eventName": {
        "value": "",
        "localizedValue": ""
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:31:47.1537759Z",
    "id": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/789d0b03-2a2f-40cf-b223-d228abb5d2ed/ticks/637626727071537759",
    "level": "Informational",
    "operationId": "",
    "operationName": {
        "value": "microsoft.insights/actiongroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "testK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actiongroups",
        "localizedValue": "microsoft.insights/actiongroups"
    },
    "resourceId": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
    },
    "subStatus": {
        "value": "Updated",
        "localizedValue": "Updated"
    },
    "submissionTimestamp": "2021-07-23T21:31:47.1537759Z",
    "subscriptionId": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a",
    "tenantId": "",
    "properties": {},
    "relatedEvents": []
}
```

#### Update Action Group
```json
{
    "authorization": {
        "action": "microsoft.insights/actionGroups/write",
        "scope": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc"
    },
    "caller": "test.cam@ieee.org",
    "channels": "Operation",
    "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/04ebb17f-c9d2-bbbb-881f-8fd503332aac/",
        "iat": "1627074914",
        "nbf": "1627074914",
        "exp": "1627078814",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "AUQAu/8TbbbbyZJhgackCVdLETN5UafFt95J8/bC1SP+tBFMusYZ3Z4PBQRZUZ4SmEkWlDevT4p7Wtr4e/R+uksbfixGGQumxw==",
        "altsecid": "1:live.com:00037FFE809E290F",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "pwd",
        "appid": "c44b4083-3bb0-49c1-bbbb-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "test.cam@ieee.org",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "cam",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "test",
        "groups": "d734c6d5-bbbb-4b39-8992-88fd979076eb",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "live.com",
        "ipaddr": "73.254.xxx.xx",
        "name": "test cam",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "f19e58c4-5bfa-4ac6-8e75-9823bbb1ea0a",
        "puid": "1003000086500F96",
        "rh": "0.AVgAf7HrBNLJbkKIH4_VAzMqrINAS8SwO8FJtH2XTlPL3zxYAFQ.",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "SzEgbtESOKM8YsOx9t49Ds-L2yCyUR-hpIDinBsS-hk",
        "http://schemas.microsoft.com/identity/claims/tenantid": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "live.com#test.cam@ieee.org",
        "uti": "KuRF5PX4qkyvxJQOXwZ2AA",
        "ver": "1.0",
        "wids": "62e90394-bbbb-4237-9190-012177145e10",
        "xms_tcdt": "1373393473"
    },
    "correlationId": "5a239734-3fbb-4ff7-b029-b0ebf22d3a19",
    "description": "",
    "eventDataId": "62c3ebd8-cfc9-435f-956f-86c45eecbeae",
    "eventName": {
        "value": "BeginRequest",
        "localizedValue": "Begin request"
    },
    "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
    },
    "eventTimestamp": "2021-07-23T21:24:34.9424246Z",
    "id": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc/events/62c3ebd8-cfc9-435f-956f-86c45eecbeae/ticks/637626722749424246",
    "level": "Informational",
    "operationId": "5a239734-3fbb-4ff7-b029-b0ebf22d3a19",
    "operationName": {
        "value": "microsoft.insights/actionGroups/write",
        "localizedValue": "Create or update action group"
    },
    "resourceGroupName": "testK-TEST",
    "resourceProviderName": {
        "value": "microsoft.insights",
        "localizedValue": "Microsoft Insights"
    },
    "resourceType": {
        "value": "microsoft.insights/actionGroups",
        "localizedValue": "microsoft.insights/actionGroups"
    },
    "resourceId": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
    "status": {
        "value": "Started",
        "localizedValue": "Started"
    },
    "subStatus": {
        "value": "",
        "localizedValue": ""
    },
    "submissionTimestamp": "2021-07-23T21:25:22.1522025Z",
    "subscriptionId": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a",
    "tenantId": "04ebb17f-c9d2-bbbb-881f-8fd503332aac",
    "properties": {
        "eventCategory": "Administrative",
        "entity": "/subscriptions/52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a/resourceGroups/testK-TEST/providers/microsoft.insights/actionGroups/TestingLogginc",
        "message": "microsoft.insights/actionGroups/write",
        "hierarchy": "52c65f65-bbbb-bbbb-bbbb-7dbbfc68c57a"
    },
    "relatedEvents": []
}
```

## See Also

- See [Monitoring Azure Monitor](monitor-azure-monitor.md) for a description of what Azure Monitor monitors in itself. 
- See [Monitoring Azure resources with Azure Monitor](./essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
