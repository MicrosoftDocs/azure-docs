---  
title: Run KQL queries on Microsoft Sentinel data lake using APIs
titleSuffix: Microsoft Security  
description: Learn how to run KQL queries against the Microsoft Sentinel data lake programmatically using REST APIs. Enable automation, intelligent agents, and scalable analytics.
author: EdB-MSFT  
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform  
ms.topic: how-to
ms.date: 03/26/2026
ms.author: edbaynash  
ms.collection: ms-security  
---  

# Run KQL queries on the Microsoft Sentinel data lake using APIs

Microsoft Sentinel data lake supports running Kusto Query Language (KQL) queries programmatically by using REST APIs. This enables security teams and automation systems to retrieve analytical results without using the Azure portal or interactive query editors.
This article explains when to use the API, required permissions, and how to submit a basic query request.

## When to use the KQL query API

The KQL query API is designed for system-to-system access scenarios, including:
- Automation and orchestration workflows
- Background services and scheduled jobs
- Agent and security tools that require query results as input
- Integration with external systems or agents

For interactive investigation and ad-hoc analysis, run KQL queries from the Defender portal instead.



## Authentication and permissions

You can authenticate to the Sentinel data lake API by using either:
- A service principal
- A user access token

> [!NOTE]
> Using a service principal currently Entra ID roles and Microsoft Defender XDR unified RBAC roles aren't supported for querying the Sentinel data lake through this API.

## Calling the API

**API endpoint**

All KQL queries are submitted by using the following REST endpoint:

`POST https://api.securityplatform.microsoft.com/lake/kql/v2/rest/query`

**Request body format**

A query request consists of:

- The KQL query
- The target workspace, specified as workspaceName-workspaceId

**Payload parameters**

|Field|Description|
|-----|-----------|
|csl|The KQL query to execute|
|db|The Sentinel workspace name and workspace ID|

Sample payload:

```json
{
"csl": "SigninLogs | take 10",
"db": "workspace1-12345678-abcd-abcd-1234-1234567890ab"
}
```

**Submitting the request**

The request must include an OAuth 2.0 bearer token in the Authorization header.

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```
 
The API returns query results in a structured JSON format that can be processed by automation workflows or applications.
 
### Optional query settings

You can include additional execution options in the request payload, such as:

- Server timeout
- Query consistency
- Read-only enforcement 

These options are useful when running queries in automated or high-scale environments.

sample payload:
```json
{
    "csl": "SigninLogs | take 10",
    "db": "workspace1-12345678-abcd-abcd-1234-1234567890ab",
    "properties": {
        "Options": {
            "servertimeout": "00:04:00",
            "queryconsistency": "strongconsistency",
            "query_language": "kql",
            "request_readonly": False,
            "request_readonly_hardline": False
        }
    }
```

## Service limits and considerations

Query execution is subject to time and result size limits. For current limits, see: [Microsoft Sentinel data lake service limits](sentinel-lake-service-limits.md)
 

## Related content

- [Run KQL queries on the Microsoft Sentinel data lake](kql-queries.md)
- [Microsoft Sentinel data lake overview](sentinel-lake-overview.md)
- [Onboarding to Microsoft Sentinel data lake](sentinel-lake-onboarding.md)
- [Microsoft Sentinel data lake service limits](sentinel-lake-service-limits.md)
- [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal)
- [Microsoft Authentication Library (MSAL) overview](/entra/identity-platform/msal-overview)
- [Acquire and cache tokens with Microsoft Authentication Library](/entra/identity-platform/msal-acquire-cache-tokens)
