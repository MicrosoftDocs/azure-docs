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
ms.component: compliance-reports
ms.date: 07/13/2018
ms.author: priyamo
ms.reviewer: dhanyahk

---

# Interpret the Azure Active Directory audit logs schema in Azure Monitor (preview)

This article describes the Azure AD audit log schema in Azure Monitor. Each individual log entry is stored as text, formatted as a JSON blob, as shown in the below two examples. 

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

| Field name | Description |
|------------|-------------|
| time       | Date and time (UTC) |
| operationName | Name of the operation |
| operationVersion | REST API version requested by the client |
| category | Currently, *Audit* is the only value supported |
| tenantId | Tenant Guid associated with the logs |
| resultType | Result of the operation, can be *Success* or *Failure* |
| resultSignature |  This is unmapped, and you can safely ignore this field. | 
| resultDescription | Additional description of the result, where available | 
| durationMs |  This is unmapped, and you can safely ignore this field. |
| callerIpAddress | IP address of the client that made the request | 
| correlationId | Optional Guid passed by the client. This can help correlate client-side operations with server-side operations and is useful when tracing logs that span across services. |
| identity | Identity from the token that was presented when making the request. Can be a user account, system account or service principal. |
| level | Type of message. For audit logs, this is always *Informational* |
| location | Location of the datacenter |
| properties | Lists the supported properties related to an audit log. For more information see the below table. | 


| Property name | Description |
|---------------|-------------|
| AuditEventCategory | Type of audit event. Can be *User Management*, *Application Management* etc.|
| Identity Type | *Application* or *User* |
| Operation Type | Can be *Add*, *Update*, *Delete* or *Other* |
| Target Resource Type | Specifies the target resource type that the operation was performed on. Can be *Application*, *User*, *Role*, *Policy* | 
| Target Resource Name | Name of the target resource. For example, this may be an application name, a role name, a user principal name or a service principal name |
| additionalTargets | Lists any additional properties for specific operations. For example, for an update operation, the old values and the new values are listed under *targetUpdatedProperties* | 

## Next steps

* [Interpret sign-in logs schema in Azure monitor](reporting-azure-monitor-diagnostics-sign-in-log-schema.md)
* [Read more about Azure Diagnostic Logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs)
* [Frequently asked questions and known issues](reporting-azure-monitor-diagnostics-overview.md#frequently-asked-questions)