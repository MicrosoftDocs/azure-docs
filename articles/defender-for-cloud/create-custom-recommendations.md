---
title: Create custom security standards and recommendations
description: Learn how to create custom security standards and recommendations for all clouds in Microsoft Defender for Cloud.
ms.topic: how-to
ms.date: 03/26/2023
---

# Create custom security standards and recommendations in Microsoft Defender for Cloud

[Security recommendations](security-policy-concept.md) in Microsoft Defender for Cloud help you to improve and harden your security posture. Recommendations are based on assessments against [security standards](security-policy-concept.md) defined for Azure subscriptions, AWS accounts, and GCP projects that have Defender for Cloud enabled.

This article describes how to:

- Create custom recommendations for all clouds (Azure, AWS, and GCP) with a KQL query.
- Assign custom recommendations to a custom security standard.

## Before you start

- You need Owner permissions on the subscription to create a new security standard.
- You need Security Admin permissions to create custom recommendations.
- To create custom recommendations based on KQL, you must have the [Defender CSPM plan](concept-cloud-security-posture-management.md) enabled. All customers can create custom recommendations based on Azure Policy.
- [Review support in Azure clouds](support-matrix-cloud-environment.md) for custom recommendations.

We recommend watching this episode of [Defender for Cloud in the field](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/creating-custom-recommendations-amp-standards-for-aws-gcp/ba-p/3810248) to learn more about the feature, and dig into creating KQL queries.

## Create a custom recommendation

Create custom recommendations, including steps for remediation, severity, and the standards to which the recommendation should be assigned. You add recommendation logic with KQL. You can use a simple query editor with built-in query templated that you can tweak as needed, or you can write your KQL query from scratch.

1. In the Defender for Cloud portal > **Environment settings**, select the relevant scope.

1. Select **Security policies** > **+ Create** > **Custom recommendation**.

1. In **Recommendation details**, fill in the recommendation details (for example: name, severity) and select the standards you want to apply the recommendation to.

    :::image type="content" source="./media/create-custom-recommendations/fill-info-recommendation.png" alt-text="Screenshot showing where to fill in description details of recommendation." lightbox="./media/create-custom-recommendations/fill-info-recommendation.png":::

1. Select **Next**.
1. In **Recommendation query**, write a KQL query, or select **Open query editor** to structure your query. If you want to use the query editor, follow the instructions below.
1. After the query is ready, select **Next**.
1. In **Standards**, select the custom standards to which you want to add the custom recommendation.
1. and in **Review and create**, review the recommendations details.

    :::image type="content" source="./media/create-custom-recommendations/review-recommendation.png" alt-text="Screenshot showing where to review the recommendation details." lightbox="./media/create-custom-recommendations/review-recommendation.png":::

### Use the query editor

We recommend using the query editor to create a recommendation query.

- Using the editor helps you to build and test your query before you start using it.
- Select **How to** to get help on structuring the query, and additional instructions and links.
- The editor contains examples of built-in recommendations queries, that you can use to help build your own query. The data appears in the same structure as in the API.

1. in the query editor, select **New query** to create a query
1. Use the example query template with its instructions, or select an example built-in recommendation query to get started.

    :::image type="content" source="./media/create-custom-recommendations/query-editor.png" alt-text="Screenshot showing how to use the query editor." lightbox="./media/create-custom-recommendations/query-editor.png":::

1. Select **Run query** to test the query you created.
1. When the query is ready, cut and paste it from the editor into the **Recommendations query** pane.

## Create a custom standard

Custom recommendations can be assigned to one or more custom standards.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant scope.

1. Select **Security policies** > **+ Create** > **Standard**.

1. In **Recommendations**, select the recommendations that you want to add to the custom standard. For Azure subscriptions, you can see the source as well.

    :::image type="content" source="media/custom-security-policies/select-recommendations.png" alt-text="Screenshot that shows the list of all of the recommendations that are available to select for the custom standard." lightbox="media/custom-security-policies/select-recommendations.png":::

1. Select **Create**.

## Create and enhance custom recommendations with Azure Policy (legacy)

For Azure subscriptions, you can create custom recommendations and standards, and enhance them, using Azure Policy. This is a legacy feature, and we recommend using the new custom recommendations feature.

### Create a custom recommendation/standard (legacy)

You can create custom recommendations and standards in Defender for cloud by creating policy definitions and initiatives in Azure Policy, and onboarding them in Defender for Cloud.

Here's how you do that:

1. Create one or more policy definitions in the [Azure Policy portal](../governance/policy/tutorials/create-custom-policy-definition.md), or [programatically](../governance/policy/how-to/programmatically-create.md).
1. [Create a policy initiative](../governance/policy/concepts/initiative-definition-structure.md) that contains the custom policy definitions.

### Onboard the initiative as a custom standard (legacy)

[Policy assignments](../governance/policy/concepts/assignment-structure.md) are used by Azure Policy to assign Azure resources to a policy or initiative.

To onboard an initiative to a custom security standard in Defender for you, you need to include `"ASC":"true"` in the request body as shown here. The `ASC` field onboards the initiative to Microsoft Defender for Cloud.

Here's an example of how to do that.

#### Example to onboard a custom initiative

```json
  PUT  
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policySetDefinitions/{policySetDefinitionName}?api-version=2021-06-01

  Request Body (JSON) 

  {
    "properties": {
      "displayName": "Cost Management",
      "description": "Policies to enforce low cost storage SKUs",
      "metadata": {
        "category": "Cost Management"
        "ASC":"true"
      },
      "parameters": {
        "namePrefix": {
          "type": "String",
          "defaultValue": "myPrefix",
          "metadata": {
            "displayName": "Prefix to enforce on resource names"
          }
        }
      },
      "policyDefinitions": [
        {
          "policyDefinitionId": "/subscriptions/ae640e6b-ba3e-4256-9d62-2993eecfa6f2/providers/Microsoft.Authorization/policyDefinitions/7433c107-6db4-4ad1-b57a-a76dce0154a1",
          "policyDefinitionReferenceId": "Limit_Skus",
          "parameters": {
            "listOfAllowedSKUs": {
              "value": [
                "Standard_GRS",
                "Standard_LRS"
              ]
            }
          }
        },
        {
          "policyDefinitionId": "/subscriptions/ae640e6b-ba3e-4256-9d62-2993eecfa6f2/providers/Microsoft.Authorization/policyDefinitions/ResourceNaming",
          "policyDefinitionReferenceId": "Resource_Naming",
          "parameters": {
            "prefix": {
              "value": "[parameters('namePrefix')]"
            },
            "suffix": {
              "value": "-LC"
            }
          }
        }
      ]
    }
  }
```

#### Example to remove an assignment

This example shows you how to remove an assignment:

```json
  DELETE   
  https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 
```

::: zone-end

### Enhance custom recommendations (legacy)

The built-in recommendations supplied with Microsoft Defender for Cloud include details such as severity levels and remediation instructions. If you want to add this type of information to custom recommendations for Azure, use the REST API.

The two types of information you can add are:

- **RemediationDescription** – String
- **Severity** – Enum [Low, Medium, High]

The metadata should be added to the policy definition for a policy that is part of the custom initiative. It should be in the 'securityCenter' property, as shown:

```json
 "metadata": {
  "securityCenter": {
    "RemediationDescription": "Custom description goes here",
    "Severity": "High"
    },
```

Here's another example of a custom policy including the metadata/securityCenter property:

  ```json
  {
"properties": {
  "displayName": "Security - ERvNet - AuditRGLock",
  "policyType": "Custom",
  "mode": "All",
  "description": "Audit required resource groups lock",
  "metadata": {
    "securityCenter": {
      "RemediationDescription": "Resource Group locks can be set via Azure Portal -> Resource Group -> Locks",
      "Severity": "High"
   }
  },
 "parameters": {
    "expressRouteLockLevel": {
      "type": "String",
      "metadata": {
        "displayName": "Lock level",
        "description": "Required lock level for ExpressRoute resource groups."
      },
      "allowedValues": [
        "CanNotDelete",
        "ReadOnly"
      ]
    }
  },
  "policyRule": {
    "if": {
      "field": "type",
      "equals": "Microsoft.Resources/subscriptions/resourceGroups"
    },
    "then": {
      "effect": "auditIfNotExists",
      "details": {
        "type": "Microsoft.Authorization/locks",
        "existenceCondition": {
          "field": "Microsoft.Authorization/locks/level",
          "equals": "[parameters('expressRouteLockLevel')]"
        }
      }
    }
 }
}
}
  ```

For another example for using the securityCenter property, see [this section of the REST API documentation](/rest/api/defenderforcloud/assessments-metadata/create-in-subscription#examples).

## Related content

You can use the following links to learn more about Kusto queries:

- [KQL Quick Reference](/azure/data-explorer/kql-quick-reference)
- [Kusto Query Language (KQL) overview](/azure/data-explorer/kusto/query/)
- [Must Learn KQL Part 1: Tools and Resources](https://rodtrent.substack.com/p/must-learn-kql-part-1-tools-and-resources)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
