---
title: API Management as an Event Grid source
description: This article describes how to use Azure API Management as an Event Grid event source. It provides the schema and links to tutorial and how-to articles. 
ms.topic: conceptual
author: spelluru
ms.author: spelluru
ms.date: 07/01/2021
---

# Azure API Management as an Event Grid source (Preview)

This article provides the properties and schema for [Azure API Management](../api-management/index.yml) events. For an introduction to event schemas, see [Azure Event Grid event schema](./event-schema.md). It also gives you a list of quick starts and tutorials to use Azure Policy as an event source.

## Available event types

API Management emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.APIManagement.UserCreated | Raised when a user is created. |
| Microsoft.APIManagement.UserUpdated | Raised when a user is updated. |
| Microsoft.APIManagement.UserDeleted | Raised when a user is deleted. |
| Microsoft.APIManagement.APISubscriptionCreated | Raised when an API subscription is created. |
| Microsoft.APIManagement.APISubscriptionUpdated | Raised when an API subscription is updated. |
| Microsoft.APIManagement.APISubscriptionDeleted | Raised when an API subscription is deleted. |
| Microsoft.APIManagement.ProductCreated | Raised when a product is created. |
| Microsoft.APIManagement.ProductUpdated | Raised when a product is updated. |
| Microsoft.APIManagement.ProductDeleted | Raised when a product is deleted. |
| Microsoft.APIManagement.APIReleaseCreated | Raised when an API release is created. |
| Microsoft.APIManagement.APIReleaseUpdated | Raised when an API release is updated. |
| Microsoft.APIManagement.APIReleaseDeleted | Raised when an API release is deleted. |

## Example event

# [Event Grid event schema](#tab/event-grid-event-schema)
The following example shows the schema of a user created event: 

```json
[{
    "id": "5829794FCB5075FCF585476619577B5A5A30E52C84842CBD4E2AD73996714C4C",
    "topic": "/subscriptions/<SubscriptionID>",
    "subject": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>",
    "data": {
        "timestamp": "2021-03-27T18:37:42.4496956Z",
        "policyAssignmentId": "<policy-assignment-scope>/providers/microsoft.authorization/policyassignments/<policy-assignment-name>",
        "policyDefinitionId": "<policy-definition-scope>/providers/microsoft.authorization/policydefinitions/<policy-definition-name>",
        "policyDefinitionReferenceId": "",
        "complianceState": "NonCompliant",
        "subscriptionId": "<subscription-id>",
        "complianceReasonCode": ""
    },
    "eventType": "Microsoft.PolicyInsights.PolicyStateCreated",
    "eventTime": "2021-03-27T18:37:42.5241536Z",
    "dataVersion": "1",
    "metadataVersion": "1"
}]
```

The schema for a policy state changed event is similar: 

```json
[{
    "id": "5829794FCB5075FCF585476619577B5A5A30E52C84842CBD4E2AD73996714C4C",
    "topic": "/subscriptions/<SubscriptionID>",
    "subject": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>",
    "data": {
        "timestamp": "2021-03-27T18:37:42.4496956Z",
        "policyAssignmentId": "<policy-assignment-scope>/providers/microsoft.authorization/policyassignments/<policy-assignment-name>",
        "policyDefinitionId": "<policy-definition-scope>/providers/microsoft.authorization/policydefinitions/<policy-definition-name>",
        "policyDefinitionReferenceId": "",
        "complianceState": "NonCompliant",
        "subscriptionId": "<subscription-id>",
        "complianceReasonCode": ""
    },
    "eventType": "Microsoft.PolicyInsights.PolicyStateChanged",
    "eventTime": "2021-03-27T18:37:42.5241536Z",
    "dataVersion": "1",
    "metadataVersion": "1"
}]
```
# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of a policy state created event: 

```json
[{
    "id": "5829794FCB5075FCF585476619577B5A5A30E52C84842CBD4E2AD73996714C4C",
    "source": "/subscriptions/<SubscriptionID>",
    "subject": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>",
    "data": {
        "timestamp": "2021-03-27T18:37:42.4496956Z",
        "policyAssignmentId": "<policy-assignment-scope>/providers/microsoft.authorization/policyassignments/<policy-assignment-name>",
        "policyDefinitionId": "<policy-definition-scope>/providers/microsoft.authorization/policydefinitions/<policy-definition-name>",
        "policyDefinitionReferenceId": "",
        "complianceState": "NonCompliant",
        "subscriptionId": "<subscription-id>",
        "complianceReasonCode": ""
    },
    "type": "Microsoft.PolicyInsights.PolicyStateCreated",
    "time": "2021-03-27T18:37:42.5241536Z",
    "specversion": "1.0"
}]
```

The schema for a policy state changed event is similar: 

```json
[{
    "id": "5829794FCB5075FCF585476619577B5A5A30E52C84842CBD4E2AD73996714C4C",
    "source": "/subscriptions/<SubscriptionID>",
    "subject": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>",
    "data": {
        "timestamp": "2021-03-27T18:37:42.4496956Z",
        "policyAssignmentId": "<policy-assignment-scope>/providers/microsoft.authorization/policyassignments/<policy-assignment-name>",
        "policyDefinitionId": "<policy-definition-scope>/providers/microsoft.authorization/policydefinitions/<policy-definition-name>",
        "policyDefinitionReferenceId": "",
        "complianceState": "NonCompliant",
        "subscriptionId": "<subscription-id>",
        "complianceReasonCode": ""
    },
    "type": "Microsoft.PolicyInsights.PolicyStateChanged",
    "time": "2021-03-27T18:37:42.5241536Z",
    "specversion": "1.0"
}]
```

---

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | API Management event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | API Management event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `timestamp` | string | The time (in UTC) that the resource was scanned by Azure Policy. For ordering events, use this property instead of the top-level `eventTime` or `time` properties. |
| `policyAssignmentId` | string | The resource ID of the policy assignment. |
| `policyDefinitionId` | string | The resource ID of the policy definition. |
| `policyDefinitionReferenceId` | string | The reference ID for the policy definition inside the initiative definition, if the policy assignment is for an initiative. May be empty. |
| `complianceState` | string | The compliance state of the resource with respect to the policy assignment. |
| `subscriptionId` | string | The subscription ID of the resource. |
| `complianceReasonCode` | string | The compliance reason code. May be empty. |

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| | |

## Next steps

- For a walkthrough routing Azure Policy state change events, see
  [Use Event Grid for policy state change notifications](../governance/policy/tutorials/route-state-change-events.md).
- For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
- For more information about creating an Azure Event Grid subscription, see
  [Event Grid subscription schema](./subscription-creation-schema.md).