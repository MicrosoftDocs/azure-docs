---
title: Identify and remediate attack paths
description: Learn how to manage your attack path analysis and build queries to locate vulnerabilities in your multicloud environment.
ms.topic: how-to
ms.date: 09/13/2022
---

# Identify and remediate attack paths 

Defender for Cloud's contextual security capabilities assists security teams in the reduction of the risk of impactful breaches. Defender for Cloud uses environment context to perform a risk assessment of your security issues. Defender for Cloud identifies the biggest security risk issues, while distinguishing them from less risky issues.

Attack Path Analysis helps you to address the security issues that pose immediate threats with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

You can check out the full list of [Attack path names and descriptions](attack-path-reference.md).

## Availability

| Aspect | Details |
|--|--|
| Required plans | - Defender CSPM P1 enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Features of the attack path overview page

The attack path homepage offers you an overview of your total attack paths. From here, you can see all of your affected resources and a list of all active recommendations.

:::image type="content" source="media/concept-cloud-map/attack-path-homepage.png" alt-text="Screenshot of a sample attack path homepage.":::

On this page you can organize your recommendations based on name, environment, paths count, risk categories.

For each recommendation you can see all of risk categories and any affected resources.

The potential risk categories include Credentials exposure, Compute abuse, Data exposure, Subscription/account takeover.

The types of resources that can be infected include:

| Resource icon | Name |
|--|--|
| :::image type="icon" source="media/concept-cloud-map/keyvault-icon.png" border="false":::  | Key Vault |
| :::image type="icon" source="media/concept-cloud-map/managed-identity-icon.png" border="false"::: | Managed Identity |
| :::image type="icon" source="media/concept-cloud-map/public-ip-icon.png" border="false"::: | Public IP |
| :::image type="icon" source="media/concept-cloud-map/virtual-machine-icon.png" border="false"::: | Virtual Machine |
| :::image type="icon" source="media/concept-cloud-map/container-icon.png" border="false"::: | Container |
| :::image type="icon" source="media/concept-cloud-map/k8s-pods-icon.png" border="false"::: | Kubernetes pod |
| :::image type="icon" source="media/concept-cloud-map/virtual-machine-scale-set-icon.png" border="false"::: | Virtual Machine Scale Set |
| :::image type="icon" source="media/concept-cloud-map/k8s-namespace-icon.png" border="false"::: | Kubernetes namespace |
| :::image type="icon" source="media/concept-cloud-map/container-image-icon.png" border="false"::: | Container image |
| :::image type="icon" source="media/concept-cloud-map/k8s-service-icon.png" border="false"::: | Kubernetes service or ingress |
| :::image type="icon" source="media/concept-cloud-map/managed-cluster-icon.png" border="false"::: | Managed cluster |
| :::image type="icon" source="media/concept-cloud-map/subscription-icon.png" border="false"::: | Subscription |
| :::image type="icon" source="media/concept-cloud-map/storage-icon.png" border="false"::: | Storage |
| :::image type="icon" source="media/concept-cloud-map/resource-group-icon.png" border="false"::: | Resource group |
| :::image type="icon" source="media/concept-cloud-map/sql-database-icon.png" border="false"::: | Sql Database |
| :::image type="icon" source="media/concept-cloud-map/sql-server-icon.png" ::: | Sql Server |

## Investigate and remediate attack paths

Attack path analysis allows you to locate the biggest risks to your environment and to remediate them.

**To investigate and remediate an attack path**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**

1. Select an attack path.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path.png" alt-text="Screenshot that shows a sample of attack paths." lightbox="media/how-to-manage-cloud-map/attack-path.png":::

    > [!NOTE]
    > An attack path may have more than one path that is at risk. The path count will tell you how many paths need to be remediated. If the attack path has more than one path, you will need to select each path within that attack path to remediate all risks.

1. Select a node.

    :::image type="content" source="media/how-to-manage-cloud-map/node-select.png" alt-text="Screenshot of the attack path screen that shows you where the nodes are located for selection." lightbox="media/how-to-manage-cloud-map/node-select.png":::

1. Select **Insight** to view the associated insights for that node.

    :::image type="content" source="media/how-to-manage-cloud-map/insights.png" alt-text="Screenshot of the insights tab for a specific node.":::

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path-recommendations.png" alt-text="Screenshot that shows you where to select recommendations on the screen." lightbox="media/how-to-manage-cloud-map/attack-path-recommendations.png":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

1. Select other nodes as necessary and view their insights and recommendations as necessary.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## View all recommendations with attack path

Attack path analysis also gives you the ability to see all recommendations by attack path without having to check each node individually. You can resolve all recommendation without having to view each node individually.

**To resolve all recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**.

1. Select an attack path.

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/bulk-recommendations.png" alt-text="Screenshot that shows where to select on the screen to see the attack paths full list of recommendations.":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

Once an attack path is resolved, it can take up to 24 hours for an attack path to be removed from the list.

## External attack surface management (EASM)

An external attack surface is the entire area of an organization or system that is susceptible to an attack from an external source. An organization's attack surface is made up of all the points of access that an unauthorized person could use to enter their system. The larger your attack surface is, the harder it's to protect.

While you are [investigating and remediating an attack path](#investigate-and-remediate-attack-paths), you can also view your EASM.

> [!NOTE]
> To manage your EASM, you must [deploy the Defender EASM Azure resource](../external-attack-surface-management/deploying-the-defender-easm-azure-resource.md) to your subscription. Defender EASM has it's own cost and is separate from Defender for Cloud. To learn more about Defender for EASM pricing options, you can check out the [pricing page](https://azure.microsoft.com/pricing/details/defender-external-attack-surface-management/). 

**To manage your EASM**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**.

1. Select an attack path.

1. Select a resource.

1. Select **Insights**.

1. Select **Open EASM**.

    :::image type="content" source="media/how-to-manage-attack-path/open-easm.png" alt-text="Screenshot the shows you where on the screen you need to select open Defender EASM from." lightbox="media/how-to-manage-attack-path/easm-zoom.png":::

1. Follow the [Using and managing discovery](../external-attack-surface-management/using-and-managing-discovery.md) instructions.

## Next Steps

Learn how to manage your [Build queries with Cloud Security Explorer](how-to-manage-cloud-security-explorer.md).
