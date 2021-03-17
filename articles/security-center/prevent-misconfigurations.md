---
title: How to prevent misconfigurations with Azure Security Center
description: Learn how to use Security Center's 'Enforce' and 'Deny' options on the recommendations details pages
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 03/17/2021
ms.author: memildin

---

# Prevent misconfigurations with Enforce/Deny recommendations

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regard to specific recommendations. 

This feature can help keep your workloads secure and stabilize your secure score.

Enforcing a secure configuration, based on a specific recommendation, is offered in two modes:

- Using the **Deny** effect of Azure Policy, you can stop unhealthy resources from being created
- Using the **Enforce** option, you can take advantage of Azure policy's **DeployIfNotExist** effect and automatically remediate non-compliant resources upon creation

This can be found at the top of the resource details page for selected security recommendations (see [Recommendations with deny/enforce options](#recommendations-with-denyenforce-options)).

## Prevent resource creation

1. Open the recommendation that your new resources must satisfy, and select the **Deny** button at the top of the page.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-deny-button.png" alt-text="Recommendation page with Deny button highlighted":::

    The configuration pane opens listing the scope options. 

1. Set the scope by selecting the relevant subscription or management group.

    > [!TIP]
    > You can use the three dots at the end of the row to change a single subscription, or use the checkboxes to select multiple subscriptions or groups then select **Change to Deny**.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-prevent-resource-creation.png" alt-text="Setting the scope for Azure Policy deny":::


## Enforce a secure configuration

1. Open the recommendation that you'll deploy a template deployment for if new resources don't  satisfy it, and select the **Enforce** button at the top of the page.

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-button.png" alt-text="Recommendation page with Enforce button highlighted":::

    The configuration pane opens with all of the policy configuration options. 

    :::image type="content" source="./media/security-center-remediate-recommendations/recommendation-enforce-config.png" alt-text="Enforce configuration options":::

1. Set the scope, assignment name, and other relevant options.

1. Select **Review + create**.

## Recommendations with deny/enforce options

These recommendations can be used with the **deny** option:

[!INCLUDE [azure-security-center-recommendations-deny](../../includes/asc/recommendations-with-deny.md)]

These recommendations can be used with the **enforce** option:

- Auditing on SQL server should be enabled
- Azure Backup should be enabled for virtual machines
- Azure Defender for SQL should be enabled on your SQL servers
- Azure Policy Add-on for Kubernetes should be installed and enabled on your clusters
- Diagnostic logs in Azure Stream Analytics should be enabled
- Diagnostic logs in Batch accounts should be enabled
- Diagnostic logs in Data Lake Analytics should be enabled
- Diagnostic logs in Event Hub should be enabled
- Diagnostic logs in Key Vault should be enabled
- Diagnostic logs in Logic Apps should be enabled
- Diagnostic logs in Search services should be enabled
- Diagnostic logs in Service Bus should be enabled
