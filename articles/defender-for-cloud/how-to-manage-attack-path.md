---
title: Manage your attack path analysis
description: Learn how to manage your attack path analysis and build queries to locate vulnerabilities in your multicloud environment.
ms.topic: how-to
ms.date: 08/18/2022
---

# Manage your attack path analysis

Defender for Cloud provides contextual security capabilities that help organizations assess risks that their multicloud environments may be exposed to while taking into account the structure of their cloud environment and 
their unique circumstances. For example, internet exposure, permissions, connections between resources.

[Attack path analysis](#attack-path-analysis) helps you address misconfigurations and vulnerabilities that pose immediate threats 
with the greatest potential of being exploited in your environment. Defender for Cloud analyzes which security issues are part of potential attack paths that attackers could use to breach your environment. It also highlights the security recommendations that need to be resolved in order to mitigate it.

You can also build queries to help you proactively hunt for vulnerabilities in your multi cloud environments and mitigate and remediate them based on their priority.

## Availability

| Aspect | Details |
|--|--|
| Required plans | - Defender for SQL enabled <br> - Defender for Servers enabled <br> - [Threat and vulnerability management integration with Defender for Cloud](deploy-vulnerability-assessment-tvm.md) enabled |
| Required roles and permissions: | - **Security Reader** <br> - **Security Admin** <br> - **Reader** <br> - **Contributor** <br> - **Owner** |
| Clouds: | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds (Azure, AWS) <br>:::image type="icon" source="./media/icons/no-icon.png"::: Commercial clouds (GCP) <br>:::image type="icon" source="./media/icons/no-icon.png"::: National (Azure Government, Azure China 21Vianet) |

## Attack path analysis

Attack path analysis allows you to see the details of each node within your environment to locate any node that has vulnerabilities or misconfigurations. You can then remediate each recommendation in order to harden your environment.

**To view recommendations by node**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**

1. Select an attack path.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path.png" alt-text="Screenshot that shows the a sample of attack paths." lightbox="media/how-to-manage-cloud-map/attack-path.png":::

1. Select a node to view the associated recommendations.

    :::image type="content" source="media/how-to-manage-cloud-map/node-select.png" alt-text="Screenshot of the attack path screen that shows you where the nodes are located for selection." lightbox="media/how-to-manage-cloud-map/node-select.png":::

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/attack-path-recommendations.png" alt-text="Screenshot that shows you where to select recommendations on the screen." lightbox="media/how-to-manage-cloud-map/attack-path-recommendations.png":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

After resolving an attack path, it can take up to 24 hours for an attack path to be removed from the list.

## View all recommendations with attack path

Attack path analysis also gives you the ability to see all recommendations by attack path without having to check each node individually. You can resolve all recommendation without having to view each node individually.

**To resolve view and resolve all recommendations**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations** > **Attack paths**

1. Select an attack path.

1. Select **Recommendations**.

    :::image type="content" source="media/how-to-manage-cloud-map/bulk-recommendations.png" alt-text="Screenshot that shows where to select on the screen to see the attack paths full list of recommendations.":::

1. Select a recommendation.

1. Follow the remediation steps to remediate the recommendation.

After resolving an attack path, it can take up to 24 hours for an attack path to be removed from the list.

## Next Steps
