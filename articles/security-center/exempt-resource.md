---
title: Exempt an Azure Security Center recommendation from a resource, subscription, management group, and secure score
description: Learn how to create rules to exempt security recommendations from subscriptions or management groups and prevent them from impacting your secure score
author: memildin
ms.author: memildin
ms.date: 03/11/2021
ms.topic: how-to
ms.service: security-center
manager: rkarlin

---

# Exempting resources and recommendations from your secure score 

A core priority of every security team is to ensure analysts can focus on the tasks and incidents that matter to the organization. Security Center has many features for customizing the experience and making sure your secure score reflects your organization's security priorities. The **exempt** option is one such feature.

When you investigate your security recommendations in Azure Security Center, one of the first pieces of information you review is the list of affected resources.

Occasionally, a resource will be listed that you feel shouldn't be included. Or a recommendation will show in a scope where you feel it doesn't belong. The resource might have been remediated by a process not tracked by Security Center. The recommendation might be inappropriate for a specific subscription. Or perhaps your organization has simply decided to accept the risks related to the specific resource or recommendation.

In such cases, you can create an exemption for a recommendation to:

- **Exempt a resource** to ensure it isn't listed with the unhealthy resources in the future, and doesn't impact your secure score. The resource will be listed as not applicable and the reason will be shown as "exempted" with the specific justification you select.

- **Exempt a subscription or management group** to ensure that the recommendation doesn't impact your secure score and won't be shown for the subscription or management group in the future. This relates to existing resources and any you create in the future. The recommendation will be marked with the specific justification you select for the scope that you selected.

## Availability

| Aspect                          | Details                                                                                                                                                                                                                                                                                                                            |
|---------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:                  | Preview<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)]                                                                                                                                                                                                                                             |
| Pricing:                        | This is a premium Azure Policy capability that's offered for Azure Defender customers with no additional cost. For other users, charges might apply in the future.                                                                                                                                                                 |
| Required roles and permissions: | **Owner** or **Resource Policy Contributor** to create an exemption<br>To create a rule, you need permissions to edit policies in Azure Policy.<br>Learn more in [Azure RBAC permissions in Azure Policy](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy).                                            |
| Limitations:                    | Exemptions can be created only for recommendations included in Security Center's default initiative, [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction), or any of the supplied regulatory standard initiatives. Recommendations that are generated from custom initiatives cannot be exempted. Learn more about the relationships between [policies, initiatives, and recommendations](security-policy-concept.md). |
| Clouds:                         | ![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)                                                                                                                                                                                         |
|                                 |                                                                                                                                                                                                                                                                                                                                    |

## Define an exemption

To fine-tune the security recommendations that Security Center makes for your subscriptions, management group, or resources, you can create an exemption rule to:

- Mark a specific **recommendation** or as "mitigated" or "risk accepted". You can create recommendation exemptions for a subscription, multiple subscriptions, or an entire management group.
- Mark **one or more resources** as "mitigated" or "risk accepted" for a specific recommendation.

> [!NOTE]
> Exemptions can be created only for recommendations included in Security Center's default initiative, Azure Security Benchmark or any of the supplied regulatory standard initiatives. Recommendations that are generated from any custom initiatives assigned to your subscriptions cannot be exempted. Learn more about the relationships between [policies, initiatives, and recommendations](security-policy-concept.md).

> [!TIP]
> You can also create exemptions using the API. For an example JSON, and an explanation of the relevant structures see [Azure Policy exemption structure](../governance/policy/concepts/exemption-structure.md).

To create an exemption rule:

1. Open the recommendations details page for the specific recommendation.

1. From the toolbar at the top of the page, select **Exempt**.

    :::image type="content" source="media/exempt-resource/exempting-recommendation.png" alt-text="Create an exemption rule for a recommendation to be exempted from a subscription or management group.":::

1. In the **Exempt** pane:
    1. Select the scope for this exemption rule:
        - If you select a management group, the recommendation will be exempted from all subscriptions within that group
        - If you're creating this rule to exempt one or more resources from the recommendation, choose "Selected resources"" and select the relevant ones from the list

    1. Enter a name for this exemption rule.
    1. Optionally, set an expiration date.
    1. Select the category for the exemption:
        - **Resolved through 3rd party (mitigated)** – if you're using a third-party service that Security Center hasn't identified. 

            > [!NOTE]
            > When you exempt a recommendation as mitigated, you aren't given points towards your secure score. But because points aren't *removed* for the unhealthy resources, the result is that your score will increase.

        - **Risk accepted (waiver)** – if you’ve decided to accept the risk of not mitigating this recommendation
    1. Optionally, enter a description.
    1. Select **Create**.

    :::image type="content" source="media/exempt-resource/defining-recommendation-exemption.png" alt-text="Steps to create an exemption rule to exempt a recommendation from your subscription or management group":::

    When the exemption takes effect (it might take up to 30 minutes):
    - The recommendation or resources won't impact your secure score.
    - If you've exempted specific resources, they'll be listed in the **Not applicable** tab of the recommendation details page.
    - If you've exempted a recommendation, it will be hidden by default on Security Center's recommendations page. This is because the default options of the **Recommendation status** filter on that page are to exclude **Not applicable** recommendations. The same is true if you exempt all recommendations in a security control.

        :::image type="content" source="media/exempt-resource/recommendations-filters-hiding-not-applicable.png" alt-text="Default filters on Azure Security Center's recommendations page hide the not applicable recommendations and security controls":::

    - The information strip at the top of the recommendation details page updates the number of exempted resources:
        
        :::image type="content" source="./media/exempt-resource/info-banner.png" alt-text="Number of exempted resources":::

1. To review your exempted resources, open the **Not applicable** tab:

    :::image type="content" source="./media/exempt-resource/modifying-exemption.png" alt-text="Modifying an exemption":::

    The reason for each exemption is included in the table (1).

    To modify or delete an exemption, select the ellipsis menu ("...") as shown (2).

1. To review all of the exemption rules on your subscription, select **View exemptions** from the information strip:

    > [!IMPORTANT]
    > To see the specific exemptions relevant to one recommendation, filter the list according to the relevant scope and recommendation name.

    :::image type="content" source="./media/exempt-resource/policy-page-exemption.png" alt-text="Azure Policy's exemption page":::

    > [!TIP]
    > Alternatively, [use Azure Resource Graph to find recommendations with exemptions](#find-recommendations-with-exemptions-using-azure-resource-graph).

## Monitor exemptions created in your subscriptions

As explained earlier on this page, exemption rules are a powerful tool providing granular control over the recommendations affecting resources in your subscriptions and management groups. 

To keep track of how your users are exercising this capability, we've created an Azure Resource Manager (ARM) template that deploys a Logic App Playbook and all necessary API connections to notify you when an exemption has been created.

- To learn more about the playbook, see the tech community blog post [How to keep track of Resource Exemptions in Azure Security Center](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-keep-track-of-resource-exemptions-in-azure-security/ba-p/1770580)
- You'll find the ARM template in the [Azure Security Center GitHub repository](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation/Notify-ResourceExemption)
- To deploy all the necessary components, [use this automated process](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Security-Center%2Fmaster%2FWorkflow%2520automation%2FNotify-ResourceExemption%2Fazuredeploy.json)


## Find recommendations with exemptions using Azure Resource Graph

Azure Resource Graph (ARG) provides instant access to resource information across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

To view all recommendations that have exemption rules:

1. Open **Azure Resource Graph Explorer**.

    :::image type="content" source="./media/security-center-identity-access/opening-resource-graph-explorer.png" alt-text="Launching Azure Resource Graph Explorer** recommendation page" :::

1. Enter the following query and select **Run query**.

    ```kusto
    securityresources
    | where type == "microsoft.security/assessments"
    // Get recommendations in useful format
    | project
	['TenantID'] = tenantId,
	['SubscriptionID'] = subscriptionId,
	['AssessmentID'] = name,
	['DisplayName'] = properties.displayName,
	['ResourceType'] = tolower(split(properties.resourceDetails.Id,"/").[7]),
	['ResourceName'] = tolower(split(properties.resourceDetails.Id,"/").[8]),
	['ResourceGroup'] = resourceGroup,
	['ContainsNestedRecom'] = tostring(properties.additionalData.subAssessmentsLink),
	['StatusCode'] = properties.status.code,
	['StatusDescription'] = properties.status.description,
	['PolicyDefID'] = properties.metadata.policyDefinitionId,
	['Description'] = properties.metadata.description,
	['RecomType'] = properties.metadata.assessmentType,
	['Remediation'] = properties.metadata.remediationDescription,
	['Severity'] = properties.metadata.severity,
	['Link'] = properties.links.azurePortal
	| where StatusDescription contains "Exempt"    
    ```


Learn more in the following pages:
- [Learn more about Azure Resource Graph](../governance/resource-graph/index.yml).
- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)
- [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/)





## FAQ - Exemption rules

### What happens when one recommendation is in multiple policy initiatives?

Sometimes, a security recommendation appears in more than one policy initiative. If you've got multiple instances of the same recommendation assigned to the same subscription, and you create an exemption for the recommendation, it will affect all of the initiatives that you have permission to edit. 

For example, the recommendation **** is part of the default policy initiative assigned to all Azure subscriptions by Azure Security Center. It also in XXXXX.

If you try to create an exemption for this recommendation, you'll see one of the two following messages:

- If you have the necessary permissions to edit both initiatives, you'll see:

    *This recommendation is included in several policy initiatives: [initiative names separated by comma]. Exemptions will be created on all of them.*  

- If you don't have sufficient permissions on both initiatives, you'll see this message instead:

    *You have limited permissions to apply the exemption on all the policy initiatives, the exemptions will be created only on the initiatives with sufficient permissions.*


## Next steps

In this article, you learned how to exempt a resource from a recommendation so that it doesn't impact your secure score. For more information about secure score, see:

- [Secure score in Azure Security Center](secure-score-security-controls.md)
