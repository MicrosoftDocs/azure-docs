---
title: Troubleshoot distribution of Microsoft Purview access policies
description: Learn how to troubleshoot the communication of access policies that were created in Microsoft Purview and need to be enforced in data sources.
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 11/21/2022
---

# Tutorial: Troubleshoot distribution of Microsoft Purview access policies (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this tutorial, you learn how to programmatically fetch access policies that were created in Microsoft Purview. By doing so, you can troubleshoot the communication of policies between Microsoft Purview, where policies are created and updated, and the data sources, where these policies need to be enforced.

For more information about Microsoft Purview policies, see the concept guides listed in the [Next steps](#next-steps) section.

This guide uses examples from SQL Server as data sources.

## Prerequisites

* An Azure subscription. If you don't already have one, [create a free subscription](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A Microsoft Purview account. If you don't have one, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).
* Register a data source, enable *Data use management*, and create a policy. To do so, use one of the Microsoft Purview policy guides. To follow along with the examples in this tutorial, you can [create a DevOps policy for Azure SQL Database](how-to-policies-devops-azure-sql-db.md).
* Establish a bearer token and call data plane APIs. To learn how, see [how to call REST APIs for Microsoft Purview data planes](tutorial-using-rest-apis.md). To be authorized to fetch policies, you need to be a Policy Author, Data Source Admin, or Data Curator at the root-collection level in Microsoft Purview. To assign those roles, see [Manage Microsoft Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

## Overview

You can fetch access policies from Microsoft Purview via either a *full pull* or a *delta pull*, as described in the following sections.

The Microsoft Purview policy model is written in [JSON syntax](https://datatracker.ietf.org/doc/html/rfc8259).

You can construct the policy distribution endpoint from the Microsoft Purview account name as
`{endpoint} = https://<account-name>.purview.azure.com/pds`.

## Full pull

Full pull provides a complete set of policies for a particular data resource scope.

### Request

To fetch policies for a data source via full pull, send a `GET` request to `/policyElements`, as follows:

```
GET {{endpoint}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}/policyelements?api-version={apiVersion}&$filter={filter}
```

where the path `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}` matches the resource ID for the data source.

The last two parameters `api-version` and `$filter` are query parameters of type string.
`$filter` is optional and can take the following values: `atScope` (the default, if parameter is not specified) or `childrenScope`. The first value is used to request all the policies that apply at the level of the path, including the ones that exist at higher scope as well as the ones that apply specifically to lower scope, that is, children data objects. The second means just return fine-grained policies that apply to the children data objects.

>[!Tip]
> The resource ID can be found under the properties for the data source in the Azure portal.


### Response status codes 

|HTTP code|HTTP code description|Type|Description|Response|
|---------|---------------------|----|-----------|--------|
|200|Success|Success|The request was processed successfully|Policy data|
|401|Unauthenticated|Error|No bearer token was passed in the request, or invalid token|Error data|
|403|Forbidden|Error|Other authentication errors|Error data|
|404|Not found|Error|The request path is invalid or not registered|Error data|
|500|Internal server error|Error|The back-end service is unavailable|Error data|
|503|Backend service unavailable|Error|The back-end service is unavailable|Error data|

### Example for SQL Server (Azure SQL Database)

**Example parameters**:
- Microsoft Purview account: relecloud-pv
- Data source Resource ID: /subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1

**Example request**:

```
GET https://relecloud-pv.purview.azure.com/pds/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1/policyElements?api-version=2021-01-01-preview&$filter=atScope
```
**Example response**:

`200 OK`

```json
{
    "count": 2,
    "syncToken": "820:0",
    "elements": [
        {
            "id": "9912572d-58bc-4835-a313-b913ac5bef97",
            "kind": "policy",
            "updatedAt": "2022-11-04T20:57:20.9389522Z",
            "version": 1,
            "elementJson": "{\"id\":\"9912572d-58bc-4835-a313-b913ac5bef97\",\"name\":\"marketing-rg_sqlsecurityauditor\",\"kind\":\"policy\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389522Z\",\"decisionRules\":[{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"fromRule\":\"purviewdatarole_builtin_sqlsecurityauditor\",\"attributeName\":\"derived.purview.role\",\"attributeValueIncludes\":\"purviewdatarole_builtin_sqlsecurityauditor\"}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_0235e4df-0d3f-41ca-98ed-edf1b8bfcf9f\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_45fa5236-a2a3-4291-9f0a-813b2883f118\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/databases/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]}]}"
        },
        {
            "id": "f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4",
            "scopes": [
                "/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg"
            ],
            "kind": "policyset",
            "updatedAt": "2022-11-04T20:57:20.9389456Z",
            "version": 1,
            "elementJson": "{\"id\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"name\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"kind\":\"policyset\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389456Z\",\"preconditionRules\":[{\"dnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}]]}],\"policyRefs\":[\"9912572d-58bc-4835-a313-b913ac5bef97\"]}"
        }
    ]
}
```

## Delta pull

A delta pull provides an incremental view of policies (that is, the changes since the last pull request), regardless of whether the last pull was a full or a delta pull. A full pull is required prior to issuing the first delta pull.

### Request

To fetch policies via delta pull, send a `GET` request to `/policyEvents`, as follows:

```
GET {{endpoint}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}/policyEvents?api-version={apiVersion}&syncToken={syncToken}
```

Provide the syncToken you got from the prior pull in any successive delta pulls.

### Response status codes 

|HTTP code|HTTP code description|Type|Description|Response|
|---------|---------------------|----|-----------|--------|
|200|Success|Success|The request was processed successfully|Policy data|
|304|Not modified|Success|No events were received since the last delta pull call|None|
|401|Unauthenticated|Error|No bearer token was passed in the request, or invalid token|Error data|
|403|Forbidden|Error|Other authentication errors|Error data|
|404|Not found|Error|The request path is invalid or not registered|Error data|
|500|Internal server error|Error| The back-end service is unavailable|Error data|
|503|Backend service unavailable|Error| The back-end service is unavailable|Error data|

### Examples for SQL Server (Azure SQL Database)

**Example parameters**:
- Microsoft Purview account: `relecloud-pv`
- Data source resource ID: `/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1`
- syncToken: 820:0

**Example request**:
```
https://relecloud-pv.purview.azure.com/pds/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1/policyEvents?api-version=2021-01-01-preview&syncToken=820:0
```

**Example response**:

`200 OK`

```json
{
    "count": 2,
    "syncToken": "822:0",
    "elements": [
        {
            "eventType": "Microsoft.Purview/PolicyElements/Delete",
            "id": "f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4",
            "scopes": [
                "/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg"
            ],
            "kind": "policyset",
            "updatedAt": "2022-11-04T20:57:20.9389456Z",
            "version": 1,
            "elementJson": "{\"id\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"name\":\"f1f2ecc0-c8fa-473f-9adf-7f7bd53ffdb4\",\"kind\":\"policyset\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389456Z\",\"preconditionRules\":[{\"dnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}]]}],\"policyRefs\":[\"9912572d-58bc-4835-a313-b913ac5bef97\"]}"
        },
        {
            "eventType": "Microsoft.Purview/PolicyElements/Delete",
            "id": "9912572d-58bc-4835-a313-b913ac5bef97",
            "scopes": [
                "/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg"
            ],
            "kind": "policy",
            "updatedAt": "2022-11-04T20:57:20.9389522Z",
            "version": 1,
            "elementJson": "{\"id\":\"9912572d-58bc-4835-a313-b913ac5bef97\",\"name\":\"marketing-rg_sqlsecurityauditor\",\"kind\":\"policy\",\"version\":1,\"updatedAt\":\"2022-11-04T20:57:20.9389522Z\",\"decisionRules\":[{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"fromRule\":\"purviewdatarole_builtin_sqlsecurityauditor\",\"attributeName\":\"derived.purview.role\",\"attributeValueIncludes\":\"purviewdatarole_builtin_sqlsecurityauditor\"}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_0235e4df-0d3f-41ca-98ed-edf1b8bfcf9f\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]},{\"kind\":\"decisionrule\",\"effect\":\"Permit\",\"id\":\"auto_45fa5236-a2a3-4291-9f0a-813b2883f118\",\"updatedAt\":\"11/04/2022 20:57:20\",\"cnfCondition\":[[{\"attributeName\":\"resource.azure.path\",\"attributeValueIncludedIn\":[\"/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/**\"]}],[{\"attributeName\":\"request.azure.dataAction\",\"attributeValueIncludedIn\":[\"Microsoft.Sql/sqlservers/databases/Connect\"]}],[{\"attributeName\":\"principal.microsoft.groups\",\"attributeValueIncludedIn\":[\"b29c1676-8d2c-4a81-b7e1-365b79088375\"]}]]}]}"
        }
    ]
}
```

In this example, the delta pull communicates the event that the policy on the resource group *marketing-rg*, which has the scope ```"scopes": ["/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg"]``` was deleted, per the ```"eventType": "Microsoft.Purview/PolicyElements/Delete"```.


## Policy constructs
Three top-level policy constructs are used within the responses to the full pull (`/policyElements`) and delta pull (`/policyEvents`) requests: `Policy`, `PolicySet`, and `AttributeRule`.

### Policy

`Policy` specifies the decision that the data source must enforce (*permit* or *deny*) when an Azure AD principal attempts access via a client, provided that the request context attributes satisfy the attribute predicates, as specified in the policy (for example: *scope*, *requested action*, and so on). An evaluation of the policy triggers an evaluation of `AttributeRules`, as referenced in the policy.

|Member|Value|Type|Cardinality|Description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind| |string|1||
|version|1|number|1||
|updatedAt| |string|1| A string representation of time, in the format yyyy-MM-ddTHH:mm:ss.fffffffZ (for example: "2022-01-11T09:55:52.6472858Z")|
|preconditionRules| |array[Object:Rule]|0..1|All the rules are 'anded'|
|decisionRules| |array[Object:DecisionRule]|1||

### PolicySet

`PolicySet` associates an array of policy IDs with a resource scope, where they need to be enforced.

|Member|Value|Type|Cardinality|Description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind| |string|1||
|version|1|number|1||
|updatedAt| |string|1| A string representation of time in the format yyyy-MM-ddTHH:mm:ss.fffffffZ (for example: "2022-01-11T09:55:52.6472858Z")|
|preconditionRules| |array[Object:Rule]|0..1||
|policyRefs| |array[string]|1|A list of policy IDs|


### AttributeRule

`AttributeRule` produces derived attributes and adds them to the request context attributes. An evaluation of `AttributeRule` triggers an evaluation of additional `AttributeRules`, as referenced in `AttributeRule`.

|Member|Value|Type|Cardinality|Description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind|AttributeRule|string|1||
|version|1|number|1||
|dnfCondition| |array[array[Object:AttributePredicate]]|0..1||
|cnfCondition| |array[array[Object:AttributePredicate]]|0..1||
|condition| |Object: Condition|0..1||
|derivedAttributes| |array[Object:DerivedAttribute]|1||

## Common subconstructs used in PolicySet, Policy, and AttributeRule

### AttributePredicate
`AttributePredicate` checks to see whether the predicate that's specified on an attribute is satisfied. `AttributePredicate` can specify the following properties:
- `attributeName`: Specifies the attribute name on which an attribute predicate needs to be evaluated.
- `matcherId`: The ID of a matcher function that's used to compare the attribute value that's looked up in the request context by attribute name to the attribute value literal that's specified in the predicate. At present, we support two `matcherId` values: `ExactMatcher` and `GlobMatcher`. If `matcherId` isn't specified, it defaults to `GlobMatcher`.
- `fromRule`: An optional property that specifies the ID of `AttributeRule` that needs to be evaluated to populate the request context with attribute values that would be compared in this predicate.
- `attributeValueIncludes`: A scalar literal value that should match the request context attribute values.
- `attributeValueIncludedIn`: An array of literal values that should match the request context attribute values.
- `attributeValueExcluded`: A scalar literal value that should *not* match the request context attribute values.
- `attributeValueExcludedIn`: An array of literal values that should *not* match the request context attribute values.

### CNFCondition
An array of `AttributePredicates` that have to be satisfied with the semantics of ANDofORs.

### DNFCondition
An array of `AttributePredicates` that have to be satisfied with the semantics of ORofANDs.

### PreConditionRule
- A `PreConditionRule` can specify at most one each of `CNFCondition`, `DNFCondition`, or `Condition`.
- All of the specified `CNFCondition`, `DNFCondition`, and `Condition` should evaluate to `true` for `PreConditionRule` to be satisfied for the current request.
- If any of the precondition rules isn't satisfied, `PolicySet` or `Policy` is considered not applicable for the current request and skipped.

### Condition
- `condition` allows you to specify a complex condition of predicates that can nest functions from a library of functions.
- At `decision compute time`, `condition` evaluates to `true` or `false` and also could emit optional obligations.
- If `condition` evaluates to  `false`, the containing `DecisionRule` is considered not applicable to the current request.


## Next steps

Concept guides for Microsoft Purview access policies:
- [DevOps policies](concept-policies-devops.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
- [Data owner policies](concept-policies-data-owner.md)
