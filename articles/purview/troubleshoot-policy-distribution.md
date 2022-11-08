---
title: Troubleshoot distribution of Microsoft Purview access policies
description: Learn how to troubleshoot the enforcement of access policies that were created in Microsoft Purview
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 11/08/2022
---

# Tutorial: troubleshoot distribution of Microsoft Purview access policies (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this tutorial, learn how to programmatically fetch access policies that were created in Microsoft Purview. This can be used to troubleshoot the communication of policies between Microsoft Purview, where policies are created and updated and the data sources on which these policies are enforced.
This guide will use Arc-enabled SQL Server as an example of data source.

To get the necessary context about Microsoft Purview policies, see concept guides listed in [next-steps](#next-steps).

## Prerequisites

* If you don't have an Azure subscription, [create a free one](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* You must have an existing Microsoft Purview account. If you don't have one, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).
* To register a data source, enable *Data use management* and create a simple policy [follow this guide](how-to-policies-devops-arc-sql-server.md)
* To establish a bearer token and to call any data plane APIs, see [the documentation about how to call REST APIs for Microsoft Purview data planes](tutorial-using-rest-apis.md). In order to be authorized to fetch policies, you need to be Policy Author, Data Source Admin or Data Curator at root-collection level. For that, see the guide on [managing Microsoft Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

## Overview
There are two ways to fetch access policies from Microsoft Purview
- Full pull: Provides a complete set of policies for a particular data resource scope.
- Delta pull: Provides an incremental view of policies, i.e. what has changed since the last pull request, whether that one was a full pull or a delta pull.

Microsoft Purview policy model is described using [JSON syntax](https://datatracker.ietf.org/doc/html/rfc8259)

The policy distribution endpoint can be constructed from the Microsoft Purview account name as:
`{endpoint} = https://<account-name>.purview.azure.com/pds`

## Full pull

### Request
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

##### Example request:
```
GET https://relecloud-pv.purview.azure.com/pds/subscriptions/b285630c-8185-456b-80ae-97296561303e/resourceGroups/Finance-rg/providers/Microsoft.AzureArcData/sqlServerInstances/vm-finance/policyelements?api-version=2021-01-01-preview
```

##### Example response:

```json
{
    "count": 2,
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
        }
    ]
}
```

## Policy constructs
There are 3 top-level policy constructs used in conjunction with the full pull (/policyElements) and delta pull (/policyEvents) requests: PolicySet, Policy and AttributeRule.

### PolicySet

PolicySet associates Policy to a resource scope. Purview policy decision compute starts with a list of PolicySets. PolicySet evaluation triggers evaluation of Policy referenced in the PolicySet.


### Policy

Policy specifies decision that should be emitted if the policy is applicable for the request provided request context attributes satisfy attribute predicates specified in the policy. Evaluation of policy triggers evaluation of AttributeRules referenced in the Policy.

### AttributeRule

AttributeRule produces derived attributes and add them to request context attributes. Evaluation of AttributeRule triggers evaluation of additional AttributeRules referenced in the AttributeRule.


## Next steps

Concept guides for Microsoft Purview access policies:
- [DevOps policies](concept-policies-devops.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
- [Data owner policies](concept-policies-data-owner.md)
