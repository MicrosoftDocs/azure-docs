---
title: Retrieve attack path data with API
description: Learn how to Retrieve attack path data with APIs in Microsoft Defender for Cloud and enhance the security of your environment.
ms.author: dacurwin
author: dcurwin
ms.topic: how-to
ms.date: 03/03/2024
#customer intent: As a developer, I want to learn how to retrieve attack path data with APIs in Microsoft Defender for Cloud so that I can enhance the security of my environment.
---

# Retrieve attack path data with API

You can consume attack path data programmatically by querying Azure Resource Graph (ARG) API.
Learn [how to query ARG API](/rest/api/azureresourcegraph/resourcegraph(2020-04-01-preview)/resources/resources?source=recommendations&tabs=HTTP).

## Consume attack path data programmatically using API

The following examples show sample ARG queries that you can run:

**Get all attack paths in subscription ‘X’**:

```kusto
securityresources
| where type == "microsoft.security/attackpaths"
| where subscriptionId == <SUBSCRIPTION_ID>
```

**Get all instances for a specific attack path**:
For example, `Internet exposed VM with high severity vulnerabilities and read permission to a Key Vault`.

```kusto
securityresources
| where type == "microsoft.security/attackpaths"
| where subscriptionId == "212f9889-769e-45ae-ab43-6da33674bd26"
| extend AttackPathDisplayName = tostring(properties["displayName"])
| where AttackPathDisplayName == "<DISPLAY_NAME>"
```

### API response schema

The following table lists the data fields returned from the API response:

| Field | Description |
|--|--|
| ID | The Azure resource ID of the attack path instance|
| Name | The Unique identifier of the attack path instance|
| Type | The Azure resource type, always equals `microsoft.security/attackpaths`|
| Tenant ID | The tenant ID of the attack path instance |
| Location | The location of the attack path |
| Subscription ID | The subscription of the attack path |
| Properties.description | The description of the attack path |
| Properties.displayName | The display name of the attack path |
| Properties.attackPathType | The type of the attack path|
| Properties.manualRemediationSteps | Manual remediation steps of the attack path |
| Properties.refreshInterval | The refresh interval of the attack path |
| Properties.potentialImpact | The potential impact of the attack path being breached |
| Properties.riskCategories | The categories of risk of the attack path |
| Properties.entryPointEntityInternalID | The internal ID of the entry point entity of the attack path |
| Properties.targetEntityInternalID | The internal ID of the target entity of the attack path |
| Properties.assessments | Mapping of entity internal ID to the security assessments on that entity |
| Properties.graphComponent | List of graph components representing the attack path |
| Properties.graphComponent.insights | List of insights graph components related to the attack path |
| Properties.graphComponent.entities | List of entities graph components related to the attack path |
| Properties.graphComponent.connections | List of connections graph components related to the attack path |
| Properties.AttackPathID | The unique identifier of the attack path instance |

## Next step

> [!div class="nextstepaction"]
> [build queries with cloud security explorer](how-to-manage-cloud-security-explorer.md).
