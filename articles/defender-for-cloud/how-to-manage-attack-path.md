---
title: Identify and remediate attack paths in Microsoft Defender for Cloud
description: Learn how to identify and remediate attack paths in Microsoft Defender for Cloud
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 11/01/2023
---

# Identify and remediate attack paths

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environment context to perform a risk assessment of your security issues. Defender for Cloud identifies the biggest security risk issues, while distinguishing them from less risky issues.

Attack path analysis helps you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

You can check out the full list of [Attack path names and descriptions](attack-path-reference.md).

## Availability

| Aspect | Details |
|--|--|
| Release state | GA (General Availability) |
| Prerequisites | - [Enable agentless scanning](enable-vulnerability-assessment-agentless.md), or [Enable Defender for Server P1 (which includes MDVM)](defender-for-servers-introduction.md) or [Defender for Server P2 (which includes MDVM and Qualys)](defender-for-servers-introduction.md). <br> - [Enable Defender CSPM](enable-enhanced-security.md) <br> - Enable agentless container posture extension in Defender CSPM, or [Enable Defender for Containers](defender-for-containers-enable.md), and install the relevant agents in order to view attack paths that are related to containers. This also gives you the ability to [query](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) containers data plane workloads in security explorer. |
| Required plans | - Defender Cloud Security Posture Management (CSPM) enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS, GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Features of the attack path overview page

The attack path page shows you an overview of all of your attack paths. You can also see your affected resources and a list of active attack paths.

:::image type="content" source="media/concept-cloud-map/attack-path-homepage.png" alt-text="Screenshot of a sample attack path homepage." lightbox="media/concept-cloud-map/attack-path-homepage.png":::

On this page you can organize your attack paths based on risk level, name, environment, paths count, risk factors, entry point, target, the number of affected resources, or the number of active recommendations. 

For each attack path, you can see all of risk factors and any affected resources.

The potential risk factors include credentials exposure, compute abuse, data exposure, subscription and account takeover.

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer?](concept-attack-path.md).

## Investigate and remediate attack paths

You can use Attack path analysis  to locate the biggest risks to your environment and to remediate them.

**To investigate and remediate an attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Attack path analysis**.

    :::image type="content" source="media/how-to-manage-attack-path/attack-path-blade.png" alt-text="Screenshot that shows the attack path analysis page on the main screen." lightbox="media/how-to-manage-attack-path/attack-path-blade.png":::

1. Select an attack path.

1. Select a node.

    :::image type="content" source="media/how-to-manage-cloud-map/node-select.png" alt-text="Screenshot of the attack path screen that shows you where the nodes are located for selection." lightbox="media/how-to-manage-cloud-map/node-select.png":::

1. Select **Insight** to view the associated insights for that node.

    :::image type="content" source="media/how-to-manage-cloud-map/insights.png" alt-text="Screenshot of the insights tab for a specific node." lightbox="media/how-to-manage-cloud-map/insights.png":::

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path-recommendations.png" alt-text="Screenshot that shows you where to select recommendations on the screen." lightbox="media/how-to-manage-cloud-map/attack-path-recommendations.png":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

1. Select other nodes as necessary and view their insights and recommendations as necessary.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## View all recommendations with attack path

Attack path analysis also gives you the ability to see all recommendations by attack path without having to check each node individually. You can resolve all recommendations without having to view each node individually.

The remediation path contains two types of recommendation:

- **Recommendations** - Recommendations that mitigate the attack path.
- **Additional recommendations** - Recommendations that reduce the exploitation risks, but don’t mitigate the attack path.

**To resolve all recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Attack path analysis**.

1. Select an attack path.

1. Select **Remediation**.

    :::image type="content" source="media/how-to-manage-cloud-map/bulk-recommendations.png" alt-text="Screenshot that shows where to select on the screen to see the attack paths full list of recommendations." lightbox="media/how-to-manage-cloud-map/bulk-recommendations.png":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## Consume attack path data programmatically using API

You can consume attack path data programmatically by querying Azure Resource Graph (ARG) API.
Learn [how to query ARG API](/rest/api/azureresourcegraph/resourcegraph(2020-04-01-preview)/resources/resources?source=recommendations&tabs=HTTP).

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

## Next Steps

Learn how to [build queries with cloud security explorer](how-to-manage-cloud-security-explorer.md).
