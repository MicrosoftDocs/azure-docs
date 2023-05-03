---
title: Identify and remediate attack paths
titleSuffix: Defender for Cloud
description: Learn how to manage your attack path analysis and build queries to locate vulnerabilities in your multicloud environment.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 03/27/2023
---

# Identify and remediate attack paths 

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environment context to perform a risk assessment of your security issues. Defender for Cloud identifies the biggest security risk issues, while distinguishing them from less risky issues.

Attack path analysis helps you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

You can check out the full list of [Attack path names and descriptions](attack-path-reference.md).

## Availability

| Aspect | Details |
|--|--|
| Release state | GA (General Availability) |
| Prerequisites | - [Enable agentless scanning](enable-vulnerability-assessment-agentless.md), or [Enable Defender for Server P1 (which includes MDVM)](defender-for-servers-introduction.md) or [Defender for Server P2 (which includes MDVM and Qualys)](defender-for-servers-introduction.md). <br> - [Enable Defender CSPM](enable-enhanced-security.md) <br> - [Enable Defender for Containers](defender-for-containers-enable.md), and install the relevant agents in order to view attack paths that are related to containers. This will also give you the ability to [query](how-to-manage-cloud-security-explorer.md#build-a-query-with-the-cloud-security-explorer) containers data plane workloads in security explorer. |
| Required plans | - Defender Cloud Security Posture Management (CSPM) enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Features of the attack path overview page

The attack path page shows you an overview of all of your attack paths. You can also see your affected resources and a list of active attack paths.

:::image type="content" source="media/concept-cloud-map/attack-path-homepage.png" alt-text="Screenshot of a sample attack path homepage." lightbox="media/concept-cloud-map/attack-path-homepage.png":::

On this page you can organize your attack paths based on name, environment, paths count, risk categories.

For each attack path you can see all of risk categories and any affected resources.

The potential risk categories include credentials exposure, compute abuse, data exposure, subscription and account takeover.

Learn more about [the cloud security graph, attack path analysis, and the cloud security explorer?](concept-attack-path.md).

## Investigate and remediate attack paths

You can use Attack path analysis  to locate the biggest risks to your environment and to remediate them.

**To investigate and remediate an attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack path**.

    :::image type="content" source="media/how-to-manage-attack-path/attack-path-icon.png" alt-text="Screenshot that shows where the icon is on the recommendations page to get to attack paths." lightbox="media/how-to-manage-attack-path/attack-path-icon.png":::

1. Select an attack path.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path.png" alt-text="Screenshot that shows a sample of attack paths." lightbox="media/how-to-manage-cloud-map/attack-path.png" :::

    > [!NOTE]
    > An attack path may have more than one path that is at risk. The path count will tell you how many paths need to be remediated. If the attack path has more than one path, you will need to select each path within that attack path to remediate all risks.

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

**To resolve all recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**.

1. Select an attack path.

1. Select **Recommendations**.

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
| where type == "microsoft.security/locations/attackpaths"
| where subscriptionId == <SUBSCRIPTION_ID>
```

**Get all instances for a specific attack path**:   
For example, ‘Internet exposed VM with high severity vulnerabilities and read permission to a Key Vault’. 

```kusto
securityresources
| where type == "microsoft.security/locations/attackpaths"
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
| Type | The Azure resource type, always equals “microsoft.security/attackpaths”|
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

## External attack surface management (EASM)

An external attack surface is the entire area of an organization or system that is susceptible to an attack from an external source. An organization's attack surface is made up of all the points of access that an unauthorized person could use to enter their system. The larger your attack surface is, the harder it's to protect.

While you are [investigating and remediating an attack path](#investigate-and-remediate-attack-paths), you can also view your EASM if it is available and you have enabled Defender EASM to your subscription.

> [!NOTE]
> To manage your EASM, you must [deploy the Defender EASM Azure resource](../external-attack-surface-management/deploying-the-defender-easm-azure-resource.md) to your subscription. Defender EASM has it's own cost and is separate from Defender for Cloud. To learn more about Defender for EASM pricing options, you can check out the [pricing page](https://azure.microsoft.com/pricing/details/defender-external-attack-surface-management/). 

**To manage your EASM**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**.

1. Select an attack path.

1. Select a resource.

1. Select **Insights**.

1. Select **Open EASM**.

    :::image type="content" source="media/how-to-manage-attack-path/open-easm.png" alt-text="Screenshot that shows you where on the screen you need to select open Defender EASM from." lightbox="media/how-to-manage-attack-path/easm-zoom.png":::

1. Follow the [Using and managing discovery](../external-attack-surface-management/using-and-managing-discovery.md) instructions.

## Next Steps

Learn how to [build queries with cloud security explorer](how-to-manage-cloud-security-explorer.md).
