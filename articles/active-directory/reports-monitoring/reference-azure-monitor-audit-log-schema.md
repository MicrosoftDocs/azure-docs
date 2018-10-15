---
title: Interpret the Azure Active Directory audit log schema in Azure Monitor (preview) | Microsoft Docs
description: Describe the Azure AD audit log schema for use in Azure Monitor (preview)
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman
editor: ''

ms.assetid: 4b18127b-d1d0-4bdc-8f9c-6a4c991c5f75
ms.service: active-directory
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.component: report-monitor
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Interpret the Azure AD audit logs schema in Azure Monitor (preview)

This article describes the Azure Active Directory (Azure AD) audit log schema in Azure Monitor. Each individual log entry is stored as text and formatted as a JSON blob, as shown in the following two examples: 

```json
{ 
    "records": [ 
    { 
        "time": "2018-03-17T00:14:31.2585575Z", 
        "operationName": "Change password (self-service)",
        "operationVersion": "1.0",
        "category": "Audit", 
        "tenantId": "bf85dc9d-cb43-44a4-80c4-469e8c58249e", 
        "resultType": "Success", 
        "resultSignature": "-1", 
        "resultDescription": "None", 
        "durationMs": "-1", 
        "correlationId": "60d5e89a-b890-413f-9e25-a047734afe9f", 
        "identity": "sreens@wingtiptoysonline.com", 
        "Level": "Informational", 
        "location": "WUS", 
        "properties": { 
            "identityType": "UPN", 
            "operationType": "Update", 
            "additionalDetails": "None", 
            "additionalTargets": "", 
            "targetUpdatedProperties": "", 
            "targetResourceType": "UPN__TenantContextID__PUID__ObjectID__ObjectClass", 
            "targetResourceName": "sreens@wingtiptoysonline.com__bf85dc9d-cb43-44a4-80c4-469e8c58249e__1003BFFD9FEB17DB__7a408bdd-7d97-4574-8511-dd747b56465d__User", 
            "auditEventCategory": "UserManagement" 
        } 
    } 
    ] 
} 
```

```json
{ 
    "records": [ 
    { 
        "time": "2018-03-18T19:47:43.0368859Z", 
        "operationName": "Update service principal.", 
        "operationVersion": "1.0", 
        "category": "Audit", 
        "tenantId": "bf85dc9d-cb43-44a4-80c4-469e8c58249e", 
        "resultType": "Success", 
        "resultSignature": "-1", 
        "durationMs": "-1", 
        "callerIpAddress": "<null>", 
        "correlationId": "14916c7a-5a7d-44e8-9b06-74b49efb08ee", 
        "identity": "NA", 
        "Level": "Informational", 
        "properties": { 
            "identityType": "NA", 
            "operationType": "Update", 
            "additionalDetails": {}, 
            "additionalTargets": "", 
            "targetUpdatedProperties": [ 
            { 
                "Name": "Included Updated Properties", 
                "OldValue": null, 
                "NewValue": "" 
            }, 
            { 
                "Name": "TargetId.ServicePrincipalNames", 
                "OldValue": null, 
                "NewValue": "http://adapplicationregistry.onmicrosoft.com/salesforce.com/primary;cd3ed3de-93ee-400b-8b19-b61ef44a0f29" 
            } 
            ], 
        "targetResourceType": "Other__ObjectID__ObjectClass__Name__AppId__SPN", 
        "targetResourceName": "ServicePrincipal_ea70a262-4da3-440a-b396-9734ddfd9df2__ea70a262-4da3-440a-b396-9734ddfd9df2__ServicePrincipal__Salesforce__cd3ed3de-93ee-400b-8b19-b61ef44a0f29__http://adapplicationregistry.onmicrosoft.com/salesforce.com/primary;cd3ed3de-93ee-400b-8b19-b61ef44a0f29", 
        "auditEventCategory": "ApplicationManagement" 
      } 
    } 
    ] 
} 
```

## Field and property descriptions

| Field name | Description |
|------------|-------------|
| time       | The date and time (UTC). |
| operationName | The name of the operation. |
| operationVersion | The REST API version that's requested by the client. |
| category | Currently, *Audit* is the only supported value. |
| tenantId | The tenant GUID that's associated with the logs. |
| resultType | The result of the operation. The result can be *Success* or *Failure*. |
| resultSignature |  This field is unmapped, and you can safely ignore it. | 
| resultDescription | An additional description of the result, where available. | 
| durationMs |  This field is unmapped, and you can safely ignore it. |
| callerIpAddress | The IP address of the client that made the request. | 
| correlationId | An optional GUID that's passed by the client. It can help correlate client-side operations with server-side operations and it's useful when you're tracking logs that span services. |
| identity | The identity from the token that was presented when you made the request. The identity can be a user account, system account, or service principal. |
| level | The message type. For audit logs, the level is always *Informational*. |
| location | The location of the datacenter. |
| properties | Lists the supported properties that are related to an audit log. For more information, see the next table. | 

<br>

| Property name | Description |
|---------------|-------------|
| AuditEventCategory | The type of audit event. It can be *User Management*, *Application Management*, or another type.|
| Identity Type | The type can be *Application* or *User*. |
| Operation Type | The type can be *Add*, *Update*, *Delete*. or *Other*. |
| Target Resource Type | Specifies the target resource type that the operation was performed on. The type can be *Application*, *User*, *Role*, *Policy* | 
| Target Resource Name | The name of the target resource. It can be an application name, a role name, a user principal name, or a service principal name. |
| additionalTargets | Lists any additional properties for specific operations. For example, for an update operation, the old values and the new values are listed under *targetUpdatedProperties*. | 

## Next steps

* [Interpret sign-in logs schema in Azure Monitor](reference-azure-monitor-sign-ins-log-schema.md)
* [Read more about Azure diagnostics logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs)
* [Frequently asked questions and known issues](concept-activity-logs-in-azure-monitor.md#frequently-asked-questions)
