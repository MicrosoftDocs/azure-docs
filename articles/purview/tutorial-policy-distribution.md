---
title: Programmatic access to Microsoft Purview data policies
description: Learn how to programmatically fetch the access policies that have been created in Microsoft Purview
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 11/08/2022
---

# Tutorial: Programmatic access to Microsoft Purview data policies.

In this tutorial, learn how to programmatically fetch the access policies that have been created in Microsoft Purview. This tutorial will use Arc-enabled SQL Server as an example of data source.

## Prerequisites

* If you don't have an Azure subscription, [create a free one](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* You must have an existing Microsoft Purview account. If you don't have one, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).

* To register a data source, enable *Data use management* and create a simple policy [follow this guide](how-to-policies-devops-arc-sql-server.md)

* To establish a bearer token and to call any data plane APIs, see [the documentation about how to call REST APIs for Microsoft Purview data planes](tutorial-using-rest-apis.md). In order to be authorized to fetch policies, you need to be Policy Author, Data Source Admin or Data Curator at root-collection level. For that, see the guide on [managing Microsoft Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

## Policy distribution endpoint

The policy distribution endpoint can be constructed from the Microsoft Purview account name as:
`{endpoint} = https://<account-name>.purview.azure.com/pds`

## Full pull of access policies

### Full pull request
To fetch policies via full pull, send a `GET` request to /policyElements as follows:

```
GET {{endpoint}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}/policyelements?api-version={apiVersion}
```

### Response status codes 

|Http Code|Http Code Description|Type|Description|Response|
|---------|---------------------|----|-----------|--------|
|200|Success|Success|Request processed successfully|Policy data|
|404|Not Found|Error|The request path is invalid or not registered|Error data|
|401|Unauthenticated|Error|No bearer token passed in request or invalid token|Error data|
|403|Forbidden|Error|Other authentication errors|Error data|
|500|Internal server error|Error|Backend service unavailable|Error data|
|503|Backend service unavailable|Error|Backend service unavailable|Error data|

### Example for Arc-enabled SQL Server

##### Example parameters:
- resourceProvider = Microsoft.AzureArcData
- resourceType = sqlServerInstances
- apiVersion = 2021-01-01-preview

##### Example Request:
```
GET https://relecloud-pv.purview.azure.com/pds/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/providers/Microsoft.AzureArcData/sqlServerInstances/vm-finance/policyelements?api-version=2021-01-01-preview
```

##### Example Response:

```json
{
    "count": 7,
    "syncToken": "808:0",
    "elements": [
        {
            "id": "9912572d-58bc-4835-a313-b913ac5bef97",
            "kind": "policy",
            "updatedAt": "2022-11-04T20:57:20.9389522Z",
            "version": 1,
            "elementJson": "{\"id\":\"9912572d-58bc-4835-a313-b913ac5bef97\",\"name\":\"Finance-rg_sqlsecurityauditor\",\"kind\":\"policy\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389522Z\",\"decisionRules\":[{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/**\"]}],[{\"fromRule\":\"purviewdatarole_builtin_sqlsecurityauditor\",\"attributeName\":\"derived.purview.role\",\"attributeValueIncludes\":\"purviewdatarole_builtin_sqlsecurityauditor\"}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_0235e4df-0d3f-41ca-98ed-edf1b8bfcf9f\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_45fa5236-a2a3-4291-9f0a-813b2883f118\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/databases/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]}]}"
        },
        {
            "id": "f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4",
            "scopes": [
                "/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg"
            ],
            "kind": "policyset",
            "updatedAt": "2022-11-04T20:57:20.9389456Z",
            "version": 1,
            "elementJson": "{\"id\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"name\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"kind\":\"policyset\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389456Z\",\"preconditionRules\":[{\"dnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/**\"]}]]}],\"policyRefs\":[\"9912572d-58bc-4835-a313-b913ac5bef97\"]}"
        },
        {
            "id": "purviewdatarole_builtin_read",
            "scopes": [
                "/"
            ],
            "kind": "attributerule",
            "updatedAt": "2022-04-13T08:25:50.5908394Z",
            "version": 1,
            "elementJson": "{\"kind\":\"attributerule\",\"derivedAttributes\":[{\"attributeName\":\"derived.purview.role\",\"op\":\"add\",\"attributeValue\":\"purviewdatarole_builtin_read\"}],\"id\":\"purviewdatarole_builtin_read\",\"name\":\"Read\",\"version\":1,\"updatedAt\":\"2022-04-13T08:25:50.5908394Z\",\"cnfCondition\":[[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read\",\"Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/executeQuery\",\"Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed\",\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read\",\"Microsoft.Sql/sqlservers/Databases/Schemas/Tables/Rows/Select\",\"Microsoft.Sql/sqlservers/Databases/Schemas/Views/Rows/Select\"]}]]}"
        },
        {
            "id": "purviewdatarole_builtin_sqlperfmonitor",
            "scopes": [
                "/"
            ],
            "kind": "attributerule",
            "updatedAt": "2021-06-10T14:04:46.8356493Z",
            "version": 1,
            "elementJson": "{\"kind\":\"attributerule\",\"derivedAttributes\":[{\"attributeName\":\"derived.purview.role\",\"op\":\"add\",\"attributeValue\":\"purviewdatarole_builtin_sqlperfmonitor\"}],\"id\":\"purviewdatarole_builtin_sqlperfmonitor\",\"name\":\"SQL Performance Monitoring\",\"version\":1,\"updatedAt\":\"2021-06-10T14:04:46.8356493Z\",\"cnfCondition\":[[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerMetadata/rows/select\",\"Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseMetadata/rows/select\",\"Microsoft.Sql/sqlservers/Connect\",\"Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerState/rows/select\",\"Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseState/rows/select\",\"Microsoft.Sql/sqlservers/databases/Connect\",\"Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabasePerformanceState/Rows/Select\",\"Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerPerformanceState/Rows/Select\"]}]]}"
        },
        {
            "id": "purviewdatarole_builtin_sqlsecurityauditor",
            "scopes": [
                "/"
            ],
            "kind": "attributerule",
            "updatedAt": "2021-06-10T14:04:46.8356493Z",
            "version": 1,
            "elementJson": "{\"kind\":\"attributerule\",\"derivedAttributes\":[{\"attributeName\":\"derived.purview.role\",\"op\":\"add\",\"attributeValue\":\"purviewdatarole_builtin_sqlsecurityauditor\"}],\"id\":\"purviewdatarole_builtin_sqlsecurityauditor\",\"name\":\"SQL Security Auditing\",\"version\":1,\"updatedAt\":\"2021-06-10T14:04:46.8356493Z\",\"cnfCondition\":[[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/databases/Connect\",\"Microsoft.Sql/sqlservers/Connect\",\"Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityState/rows/select\",\"Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityState/rows/select\",\"Microsoft.Sql/sqlservers/SystemViewsAndFunctions/ServerSecurityMetadata/rows/select\",\"Microsoft.Sql/sqlservers/databases/SystemViewsAndFunctions/DatabaseSecurityMetadata/rows/select\"]}]]}"
        },
        {
            "id": "purviewdatarole_builtin_modify",
            "scopes": [
                "/"
            ],
            "kind": "attributerule",
            "updatedAt": "2021-06-10T14:04:46.8356493Z",
            "version": 1,
            "elementJson": "{\"kind\":\"attributerule\",\"derivedAttributes\":[{\"attributeName\":\"derived.purview.role\",\"op\":\"add\",\"attributeValue\":\"purviewdatarole_builtin_modify\"}],\"id\":\"purviewdatarole_builtin_modify\",\"name\":\"Modify\",\"version\":1,\"updatedAt\":\"2021-06-10T14:04:46.8356493Z\",\"cnfCondition\":[[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read\",\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write\",\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action\",\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action\",\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete\"]}]]}"
        },
        {
            "id": "purviewdatarole_builtin_move",
            "scopes": [
                "/"
            ],
            "kind": "attributerule",
            "updatedAt": "2022-09-02T10:43:27.5598693Z",
            "version": 1,
            "elementJson": "{\"kind\":\"attributerule\",\"derivedAttributes\":[{\"attributeName\":\"derived.purview.role\",\"op\":\"add\",\"attributeValue\":\"purviewdatarole_builtin_move\"}],\"id\":\"purviewdatarole_builtin_move\",\"name\":\"Move\",\"version\":1,\"updatedAt\":\"2022-09-02T10:43:27.5598693Z\",\"cnfCondition\":[[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action\"]}]]}"
        }
    ]
}
```

## Next steps

Concept guides for Microsoft Purview access policies:
- [DevOps policies](concept-policies-devops.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
- [Data owner policies](concept-policies-data-owner.md)
