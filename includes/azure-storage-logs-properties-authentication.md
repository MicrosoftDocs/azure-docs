---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 09/28/2020
 ms.author: normesta
---

| Property | Description |
|:--- |:---|
|**identity / type** | The type of authentication that was used to make the request. For example: `OAuth`, `SAS Key`, `Account Key`, or `Anonymous` |
|**identity / tokenHash**|This field is reserved for internal use only. |
|**authorization / action** | The action that is assigned to the request. |
|**authorization / roleAssignmentId** | The role assignment ID. For example: `4e2521b7-13be-4363-aeda-111111111111`.|
|**authorization / roleDefinitionId** | The role definition ID. For example: `ba92f5b4-2d11-453d-a403-111111111111"`.|
|**principals / id** | The ID of the security principal. For example: `a4711f3a-254f-4cfb-8a2d-111111111111`.|
|**principals / type** | The type of security principal. For example: `ServicePrincipal`. |
|**requester / appID** | The Open Authorization (OAuth) application ID that is used as the requester. <br> For example: `d3f7d5fe-e64a-4e4e-871d-333333333333`.|
|**requester / audience** | The OAuth audience of the request. For example: `https://storage.azure.com`. |
|**requester / objectId** | The OAuth object ID of the requester. In case of Kerberos authentication, represents the object identifier of Kerberos authenticated user. For example: `0e0bf547-55e5-465c-91b7-2873712b249c`. |
|**requester / tenantId** | The OAuth tenant ID of identity. For example: `72f988bf-86f1-41af-91ab-222222222222`.|
|**requester / tokenIssuer** | The OAuth token issuer. For example: `https://sts.windows.net/72f988bf-86f1-41af-91ab-222222222222/`.|
|**requester / upn** | The User Principal Name (UPN) of requestor. For example: `someone@contoso.com`. |
|**requester / userName** | This field is reserved for internal use only.|