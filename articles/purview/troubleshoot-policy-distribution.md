---
title: Troubleshoot distribution of Microsoft Purview access policies
description: Learn how to troubleshoot the communication of access policies that were created in Microsoft Purview and need to be enforced in data sources
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: tutorial
ms.date: 11/14/2022
---

# Tutorial: troubleshoot distribution of Microsoft Purview access policies (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

In this tutorial, learn how to programmatically fetch access policies that were created in Microsoft Purview. With this you can troubleshoot the communication of policies between Microsoft Purview, where policies are created and updated, and the data sources, where these policies need to be enforced.

To get the necessary context about Microsoft Purview policies, see concept guides listed in [next-steps](#next-steps).

This guide will use examples for Azure SQL Server as data source.

## Prerequisites

* If you don't have an Azure subscription, [create a free one](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
* You must have an existing Microsoft Purview account. If you don't have one, see the [quickstart for creating a Microsoft Purview account](create-catalog-portal.md).
* Register a data source, enable *Data use management*, and create a policy. To do so, follow one of the Microsoft Purview policies guides. To follow along the examples in this tutorial you can [create a DevOps policy for Azure SQL Database](how-to-policies-devops-azure-sql-db.md)
* To establish a bearer token and to call any data plane APIs, see [the documentation about how to call REST APIs for Microsoft Purview data planes](tutorial-using-rest-apis.md). In order to be authorized to fetch policies, you need to be Policy Author, Data Source Admin or Data Curator at root-collection level in Microsoft Purview. You can assign those roles by following this guide: [managing Microsoft Purview role assignments](catalog-permissions.md#assign-permissions-to-your-users).

## Overviewrelecloud-sql-srv1
There are two ways to fetch access policies from Microsoft Purview
- Full pull: Provides a complete set of policies for a particular data resource scope.
- Delta pull: Provides an incremental view of policies, that is, what changed since the last pull request, regardless of whether the last pull  was a full or a delta one. A full pull is required prior to issuing the first delta pull.

Microsoft Purview policy model is described using [JSON syntax](https://datatracker.ietf.org/doc/html/rfc8259)

The policy distribution endpoint can be constructed from the Microsoft Purview account name as:
`{endpoint} = https://<account-name>.purview.azure.com/pds`

## Full pull

### Request
To fetch policies for a data source via full pull, send a `GET` request to /policyElements as follows:

```
GET {{endpoint}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}/policyelements?api-version={apiVersion}
```

where the path /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName} matches the resource ID for the data source.

>[!Tip]
> The resource ID can be found under the properties for the data source in Azure portal.


### Response status codes 

|Http Code|Http Code Description|Type|Description|Response|
|---------|---------------------|----|-----------|--------|
|200|Success|Success|Request processed successfully|Policy data|
|401|Unauthenticated|Error|No bearer token passed in request or invalid token|Error data|
|403|Forbidden|Error|Other authentication errors|Error data|
|404|Not found|Error|The request path is invalid or not registered|Error data|
|500|Internal server error|Error|Backend service unavailable|Error data|
|503|Backend service unavailable|Error|Backend service unavailable|Error data|

### Example for Azure SQL Server (Azure SQL Database)

##### Example parameters:
- Microsoft Purview account: relecloud-pv
- Data source Resource ID: /subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1

##### Example request:
```
GET https://relecloud-pv.purview.azure.com/pds/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1/policyElements?api-version=2021-01-01-preview
```

##### Example response:

`200 OK`

```json
{
    "count": 7,
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

### Request
To fetch policies via delta pull, send a `GET` request to /policyEvents as follows:

```
GET {{endpoint}}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}/policyEvents?api-version={apiVersion}&syncToken={syncToken}
```

Provide the syncToken you got from the prior pull in any successive delta pulls.

### Response status codes 

|Http Code|Http Code Description|Type|Description|Response|
|---------|---------------------|----|-----------|--------|
|200|Success|Success|Request processed successfully|Policy data|
|304|Not modified|Success|No events received since last delta pull call|None|
|401|Unauthenticated|Error|No bearer token passed in request or invalid token|Error data|
|403|Forbidden|Error|Other authentication errors|Error data|
|404|Not found|Error|The request path is invalid or not registered|Error data|
|500|Internal server error|Error|Backend service unavailable|Error data|
|503|Backend service unavailable|Error|Backend service unavailable|Error data|

### Example for Azure SQL Server (Azure SQL Database)

##### Example parameters:
- Microsoft Purview account: relecloud-pv
- Data source Resource ID: /subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1
- syncToken: 820:0

##### Example request:
```
https://relecloud-pv.purview.azure.com/pds/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg/providers/Microsoft.Sql/servers/relecloud-sql-srv1/policyEvents?api-version=2021-01-01-preview&syncToken=820:0
```

##### Example response:

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

In this example, the delta pull communicates the event that the policy on the resource group marketing-rg, which had the scope ```"scopes": ["/subscriptions/BB345678-abcd-ABCD-0000-bbbbffff9012/resourceGroups/marketing-rg"]``` was deleted, per the ```"eventType": "Microsoft.Purview/PolicyElements/Delete"```.


## Policy constructs
There are 3 top-level policy constructs used within the responses to the full pull (/policyElements) and delta pull (/policyEvents) requests: Policy, PolicySet and AttributeRule.

### Policy

Policy specifies the decision the data source must enforce (permit vs. deny) when an Azure AD principal attempts an access via a client, provided request context attributes satisfy attribute predicates specified in the policy (for example scope, requested action, etc.). Evaluation of the Policy triggers evaluation of AttributeRules referenced in the Policy.

|member|value|type|cardinality|description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind| |string|1||
|version|1|number|1||
|updatedAt| |string|1|String representation of time in yyyy-MM-ddTHH:mm:ss.fffffffZ Ex: "2022-01-11T09:55:52.6472858Z"|
|preconditionRules| |array[Object:Rule]|0..1|All the rules are 'anded'|
|decisionRules| |array[Object:DecisionRule]|1||

### PolicySet

PolicySet associates an array of Policy IDs to a resource scope where they need to be enforced.

|member|value|type|cardinality|description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind| |string|1||
|version|1|number|1||
|updatedAt| |string|1|String representation of time in yyyy-MM-ddTHH:mm:ss.fffffffZ Ex: "2022-01-11T09:55:52.6472858Z"|
|preconditionRules| |array[Object:Rule]|0..1||
|policyRefs| |array[string]|1|List of policy IDs|


### AttributeRule

AttributeRule produces derived attributes and add them to request context attributes. Evaluation of AttributeRule triggers evaluation of additional AttributeRules referenced in the AttributeRule.

|member|value|type|cardinality|description|
|------|-----|----|-----------|-----------|
|ID| |string|1||
|name| |string|1||
|kind|AttributeRule|string|1||
|version|1|number|1||
|dnfCondition| |array[array[Object:AttributePredicate]]|0..1||
|cnfCondition| |array[array[Object:AttributePredicate]]|0..1||
|condition| |Object: Condition|0..1||
|derivedAttributes| |array[Object:DerivedAttribute]|1||

## Common sub-constructs used in PolicySet, Policy, AttributeRule

#### AttributePredicate
AttributePredicate checks whether predicate specified on an attribute is satisfied. AttributePredicate  can specify the following properties:
- attributeName: specifies attribute name on which attribute predicate needs to be evaluated.
- matcherId: ID of matcher function that is used to compare the attribute value looked up in request context by the attribute name to the attribute value literal specified in the predicate.  At present we support 2 matcherId(s): ExactMatcher, GlobMatcher. If matcherId isn't specified, it defaults to GlobMatcher.
- fromRule: optional property specifying the ID of an AttributeRule that needs to be evaluated to populate the request context with attribute values that would be compared in this predicate.
- attributeValueIncludes: scalar literal value that should match the request context attribute values.
- attributeValueIncludedIn: array of literal values that should match the request context attribute values.
- attributeValueExcluded: scalar literal value that should not  match the request context attribute values.
- attributeValueExcludedIn: array of literal values that should not match the request context attribute values.

#### CNFCondition
Array of array of AttributePredicates that have to be satisfied with the semantic of ANDofORs.

#### DNFCondition
Array of array of AttributePredicates that have to be satisfied with the semantic of ORofANDs.

#### PreConditionRule
- A PreConditionRule can specify at most one each of CNFCondition, DNFConition, Condition.
- All of the specified CNFCondition, DNFCondition, Condition should evaluate to “true” for the  PreConditionRule to be satisfied for the current request.
- If any of the precondition rules is not satisfied,  containing PolicySet or Policy is considered not applicable for the current request and skipped.

#### Condition
- A Condition allows specifying a complex condition of predicates that can nest functions from library of functions.
- At decision compute time the Condition evaluates to “true” or “false” and also could emit optional Obligation(s).
- If the Condition evaluates to  “false” the containing DecisionRule is considered Not Applicable to the current request.


## Next steps

Concept guides for Microsoft Purview access policies:
- [DevOps policies](concept-policies-devops.md)
- [Self-service access policies](concept-self-service-data-access-policy.md)
- [Data owner policies](concept-policies-data-owner.md)
