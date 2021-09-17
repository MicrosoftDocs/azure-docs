---
title: Azure Attestation audit logs
description: Describes the full audit logs that are collected for Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: reference
ms.date: 11/23/2020
ms.author: mbaldwin


---

# Audit logs for Azure Attestation

Audit logs are secure, immutable, timestamped records of discrete events that happened over time. These logs capture important events that may affect the functionality of your attestation instance.

Azure Attestation manages attestation instances and the policies associated with them. Actions associated with instance management and policy changes are audited and logged.

This article contains information on the events that are logged, the information collected, and the location of these logs.

## About Audit logs

Azure Attestation uses code to produce audit logs for events that affect the way attestation is performed. This typically boils down to how or when policy changes are made to your attestation instance as well as some admin actions.

### Auditable Events
Here are some of the audit logs we collect:

|     Event/API                              |     Event Description                                                                         |
|--------------------------------------------|-----------------------------------------------------------------------------------------------|
|     Create Instance                        |     Creates a new instance of an attestation service. |
|     Destroy Instance                       |     Destroys an instance of an attestation service. |
|     Add Policy Certificate                 |     Addition of a certificate to the current set of policy management certificates. |
|     Remove Policy Certificate              |     Remove a certificate from the current set of policy management certificates. |
|     Set Current Policy                     |     Sets the attestation policy for a given TEE type. |
|     Reset Attestation Policy               |     Resets the attestation policy for a given TEE type. |
|     Prepare to Update Policy               |     Prepare to update attestation policy for a given TEE type. |
|     Rehydrate Tenants After Disaster       |     Re-seals all of the attestation tenants on this instance of the attestation service. This can only be performed by Attestation Service admins. |

### Collected  information
For each of these events, Azure Attestation collects the following information:

- Operation Name
- Operation Success
- Operation Caller, which could be any of the following:
    - Azure AD UPN
    - Object ID
    - Certificate
    - Azure AD Tenant ID
- Operation Target, which could be any of the following:
    - Environment
    - Service Region
    - Service Role
    - Service Role Instance
    - Resource ID
    - Resource Region

### Sample Audit log

Audit logs are provided in JSON format. Here is an example of what an audit log may look like.

```json
{
    "operationName": "SetCurrentPolicy",
    "resultType": "Success",
    "resultDescription": null,
    "auditEventCategory": [
        "ApplicationManagement"
    ],
    "nCloud": null,
    "requestId": null,
    "callerIpAddress": null,
    "callerDisplayName": null,
    "callerIdentities": [
        {
            "callerIdentityType": "ObjectID",
            "callerIdentity": "<some object ID>"
        },
        {
            "callerIdentityType": "TenantId",
            "callerIdentity": "<some tenant ID>"
        }
    ],
    "targetResources": [
        {
            "targetResourceType": "Environment",
            "targetResourceName": "PublicCloud"
        },
        {
            "targetResourceType": "ServiceRegion",
            "targetResourceName": "EastUS2"
        },
        {
            "targetResourceType": "ServiceRole",
            "targetResourceName": "AttestationRpType"
        },
        {
            "targetResourceType": "ServiceRoleInstance",
            "targetResourceName": "<some service role instance>"
        },
        {
            "targetResourceType": "ResourceId",
            "targetResourceName": "/subscriptions/<some subscription ID>/resourceGroups/<some resource group name>/providers/Microsoft.Attestation/attestationProviders/<some instance name>"
        },
        {
            "targetResourceType": "ResourceRegion",
            "targetResourceName": "EastUS2"
        }
    ],
    "ifxAuditFormat": "Json",
    "env_ver": "2.1",
    "env_name": "#Ifx.AuditSchema",
    "env_time": "2020-11-23T18:23:29.9427158Z",
    "env_epoch": "MKZ6G",
    "env_seqNum": 1277,
    "env_popSample": 0.0,
    "env_iKey": null,
    "env_flags": 257,
    "env_cv": "##00000000-0000-0000-0000-000000000000_00000000-0000-0000-0000-000000000000_00000000-0000-0000-0000-000000000000",
    "env_os": null,
    "env_osVer": null,
    "env_appId": null,
    "env_appVer": null,
    "env_cloud_ver": "1.0",
    "env_cloud_name": null,
    "env_cloud_role": null,
    "env_cloud_roleVer": null,
    "env_cloud_roleInstance": null,
    "env_cloud_environment": null,
    "env_cloud_location": null,
    "env_cloud_deploymentUnit": null
}
```

## Access Audit Logs

These logs are stored in Azure and can't be accessed directly. If you need to access these logs, file a support ticket. For more information, see [Contact Microsoft Support](https://azure.microsoft.com/support/options/). 

Once the support ticket is filed, Microsoft will download and provide you access to these logs.
