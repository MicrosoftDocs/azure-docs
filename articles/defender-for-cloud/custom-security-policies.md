---
title: Create custom security standards for Azure resources in Microsoft Defender for Cloud
description: Learn how to create custom security standards for Azure resources in Microsoft Defender for Cloud
ms.topic: how-to
ms.custom: ignite-2023
ms.date: 10/30/2023
zone_pivot_groups: manage-asc-initiatives
---

# Create custom standards and recommendations (Azure)

Security recommendations in Microsoft Defender for Cloud help you to improve and harden your security posture. Recommendations are based on the security standards you define in subscriptions that have Defender for Cloud onboarded. 

[Security standards](security-policy-concept.md) can be based on regulatory compliance standards, and on customized standards. This article describes how to create custom standards and recommendations.

## Before you begin

- You need Owner permissions on the subscription to create a new security standard.
- For custom standards to be evaluated and displayed in Defender for Cloud, you must add them at the subscription level (or higher). We recommend that you select the widest scope available.

::: zone pivot="azure-portal"


## Create a custom standard in the portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription or management group.


1. Select **Security policies** > **+ Create** > **Custom standard**.

    :::image type="content" source="media/custom-security-policies/create-custom-standard.png" alt-text="Screenshot that shows how to create a custom security standard." lightbox="media/custom-security-policies/create-custom-standard.png":::

1. In **Create a new standard** > **Basics**, enter a name and description. Make sure the name is unique. If you create a custom standard with the same name as an existing standard, it causes a conflict in the information displayed in the dashboard.

1. Select **Next**.

1. In **Recommendations**, select the recommendations that you want to add to the custom standard.

    :::image type="content" source="media/custom-security-policies/select-recommendations.png" alt-text="Screenshot that shows the list of all of the recommendations that are available to select for the custom standard." lightbox="media/custom-security-policies/select-recommendations.png":::

1. (Optional) Select **...** > **Manage effect and parameters** to manage the effects and parameters of each recommendation, and save the setting.

1. Select **Next**.

1. In **Review + create**, select **Create**.

Your new standard takes effect after you create it. Here's what you'll see:

- In Defender for Cloud > **Regulatory compliance**, the compliance dashboard shows the new custom standard alongside existing standards.
- If your environment doesn't align with the custom standard, you begin to receive recommendations to fix issues found in the **Recommendations** page.



## Create a custom recommendation

If you want to create a custom recommendation for Azure resources, you currently need to do that in Azure Policy, as follows:

1. Create one or more policy definitions in the [Azure Policy portal](../governance/policy/tutorials/create-custom-policy-definition.md), or [programatically](../governance/policy/how-to/programmatically-create.md).
1. [Create a policy initiative](../governance/policy/concepts/initiative-definition-structure.md) that contains the custom policy definitions.

::: zone-end

::: zone pivot="rest-api"


## Create a custom recommendation/standard (legacy)

You can create custom recommendations and standards in Defender for cloud by creating policy definitions and initiatives in Azure Policy, and onboarding them in Defender for Cloud.

Here's how you do that:

1. Create one or more policy definitions in the [Azure Policy portal](../governance/policy/tutorials/create-custom-policy-definition.md), or [programatically](../governance/policy/how-to/programmatically-create.md).
1. [Create a policy initiative](../governance/policy/concepts/initiative-definition-structure.md) that contains the custom policy definitions.


## Onboard the initiative as a custom standard (legacy)

[Policy assignments](../governance/policy/concepts/assignment-structure.md) are used by Azure Policy to assign Azure resources to a policy or initiative.

To onboard an initiative to a custom security standard in Defender for you, you need to include `"ASC":"true"` in the request body as shown here. The `ASC` field onboards the initiative to Microsoft Defender for Cloud.

Here's an example of how to do that.
 
### Example to onboard a custom initiative

```
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

### Example to remove an assignment

This example shows you how to remove an assignment:

```
  DELETE   
  https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 
```

::: zone-end


## Enhance custom recommendations (legacy)

The built-in recommendations supplied with Microsoft Defender for Cloud include details such as severity levels and remediation instructions. If you want to add this type of information to custom recommendations for Azure, use the REST API. 

The two types of information you can add are:

- **RemediationDescription** – String
- **Severity** – Enum [Low, Medium, High]

The metadata should be added to the policy definition for a policy that is part of the custom initiative. It should be in the ‘securityCenter’ property, as shown:

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


## Next steps

- [Learn about](create-custom-recommendations.md) Defender for Cloud security standards and recommendations.
- [Learn about](create-custom-recommendations.md) creating custom standards for AWS accounts and GCP projects.