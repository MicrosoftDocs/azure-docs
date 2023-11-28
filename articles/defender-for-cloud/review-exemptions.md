---
title: Exempt a recommendation in Microsoft Defender for Cloud
description: Learn how to exempt recommendations so they're not taken into account in Microsoft Defender for Cloud.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 11/22/2023
---

# Review resources exempted from recommendations 

In Microsoft Defender for Cloud, you can [exempt protected resources from Defender for Cloud security recommendations](exempt-resource.md). This article describes how to review and work with exempted resources.

> [!IMPORTANT]
> This page discusses how to use the new recommendations experience where you have the ability to prioritize your recommendations by their effective risk level. To view this experience, you must select **Try it now**.
>
> :::image type="content" source="media/review-security-recommendations/try-it-now.png" alt-text="Screenshot that shows where the try it now button is located on the recommendation page." lightbox="media/review-security-recommendations/try-it-now.png":::

## Review exempted resources in the portal

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Defender for Cloud** > **Recommendations**.

1. Select **Add filter** > **Is exempt**.

1. Select **All**, **Yes** or **No**. 

1. Select **Apply**.

    :::image type="content" source="media/review-exemptions/filter-exemptions.png" alt-text="Steps to create an exemption rule to exempt a recommendation from your subscription or management group."  lightbox="media/review-exemptions/filter-exemptions.png":::

1. In the details page for the relevant recommendation, review the exemption rules.

1. For each resource, the **Reason** column shows why the resource is exempted. To modify the exemption settings for a resource, select the ellipsis in the resource > **Manage exemption**.

You can also find all resources that have been exempted from one or more recommendations on the Inventory page.

**To review exempted resources on the Defender for Cloud's Inventory page**: 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Defender for Cloud** > **Recommendations**.

1. Select **Add filter**

    :::image type="content" source="media/review-exemptions/inventory-exemptions.png" alt-text="Defender for Cloud's asset inventory page and the filter to find resources with exemptions."  lightbox="media/review-exemptions/inventory-exemptions.png":::

1. Select **Contains Exemptions**.

1. Select **Yes**.

1. Select **OK**.

## Review exempted resources with Azure Resource Graph

[Azure Resource Graph (ARG)](../governance/resource-graph/index.yml) provides instant access to resource information across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to [query information](../governance/resource-graph/first-query-portal.md) using  [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/).

To view all recommendations that have exemption rules:

1. In the **Recommendations** page, select **Open query**.
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


## Get notified when exemptions are created

To keep track of how users are exempting resources from recommendations, we've created an Azure Resource Manager (ARM) template that deploys a Logic App Playbook, and all necessary API connections to notify you when an exemption has been created.

- Learn more about the playbook in TechCommunity blog [How to keep track of Resource Exemptions in Microsoft Defender for Cloud](https://techcommunity.microsoft.com/t5/azure-security-center/how-to-keep-track-of-resource-exemptions-in-azure-security/ba-p/1770580).
- Locate the ARM template in [Microsoft Defender for Cloud GitHub repository](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation/Notify-ResourceExemption)
- [Use this automated process](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Security-Center%2Fmaster%2FWorkflow%2520automation%2FNotify-ResourceExemption%2Fazuredeploy.json) to deploy all components.


## Next steps

[Review security recommendations](review-security-recommendations.md)