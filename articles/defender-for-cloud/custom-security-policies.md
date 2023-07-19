---
title: Create custom Azure security policies
description: Azure custom policy definitions monitored by Microsoft Defender for Cloud.
ms.topic: how-to
ms.custom: ignite-2022
ms.date: 01/24/2023
zone_pivot_groups: manage-asc-initiatives
---

# Create custom Azure security initiatives and policies

To help secure your systems and environment, Microsoft Defender for Cloud generates security recommendations. These recommendations are based on industry best practices, which are incorporated into the generic, default security policy supplied to all customers. They can also come from Defender for Cloud's knowledge of industry and regulatory standards.

With this feature, you can add your own *custom* initiatives. Although custom initiatives aren't included in the secure score, you'll receive recommendations if your environment doesn't follow the policies you create. Any custom initiatives you create are shown in the list of all recommendations and you can filter by initiative to see the recommendations for your initiative. They're also shown with the built-in initiatives in the regulatory compliance dashboard, as described in the tutorial [Improve your regulatory compliance](regulatory-compliance-dashboard.md).

As discussed in [the Azure Policy documentation](../governance/policy/concepts/definition-structure.md#definition-location), when you specify a location for your custom initiative, it must be a management group or a subscription. 

> [!TIP]
> For an overview of the key concepts on this page, see [What are security policies, initiatives, and recommendations?](security-policy-concept.md).

You can view your custom initiatives organized by controls, similar to the controls in the compliance standard. To learn how to create policy groups within the custom initiatives and organize them in your initiative, follow the guidance provided in the [policy definitions groups](../governance/policy/concepts/initiative-definition-structure.md).  

::: zone pivot="azure-portal"

## To add a custom initiative to your subscription 

1. From Defender for Cloud's menu, open **Environment settings**.

1. Select the relevant subscription or management group to which you would like to add a custom initiative.

    > [!NOTE]
    > For your custom initiatives to be evaluated and displayed in Defender for Cloud, you must add them at the subscription level (or higher). We recommend that you select the widest scope available.

1. Open the **Security policy** page, and in the **Your custom initiatives** area, select **Add a custom initiative**.

    :::image type="content" source="media/custom-security-policies/accessing-security-policy-page.png" alt-text="Screenshot of accessing the security policy page in Microsoft Defender for Cloud." lightbox="media/custom-security-policies/accessing-security-policy-page.png":::

1. Review the list of custom policies already created in your organization, and select **Add** to assign a policy to your subscription.

If there isn't an initiative in the list that meets your needs, you can create one.

**To create a new custom initiative**:

1. Select **Create new**.

1. Enter the definition's location and custom name.

    > [!NOTE]
    > Custom initiatives shouldn't have the same name as other initiatives (custom or built-in). If you create a custom initiative with the the same name, it will cause a conflict in the information displayed in the dashboard.

1. Select the policies to include and select **Add**.

1. Enter any desired parameters.

1. Select **Save**.

1. In the Add custom initiatives page, select refresh. Your new initiative will be available.

1. Select **Add** and assign it to your subscription.

    ![Create or add a policy.](media/custom-security-policies/create-or-add-custom-policy.png)


    > [!NOTE]
    > Creating new initiatives requires subscription owner credentials. For more information about Azure roles, see [Permissions in Microsoft Defender for Cloud](permissions.md).

    Your new initiative takes effect and you can see the results in the following two ways:

    * From the Defender for Cloud menu, select **Regulatory compliance**. The compliance dashboard opens to show your new custom initiative alongside the built-in initiatives.
    
    * You'll begin to receive recommendations if your environment doesn't follow the policies you've defined.

1. To see the resulting recommendations for your policy, select **Recommendations** from the sidebar to open the recommendations page. The recommendations will appear with a "Custom" label and be available within approximately one hour.

    [![Custom recommendations.](media/custom-security-policies/custom-policy-recommendations.png)](media/custom-security-policies/custom-policy-recommendations-in-context.png#lightbox)

::: zone-end

::: zone pivot="rest-api"

## Configure a security policy in Azure Policy using the REST API

As part of the native integration with Azure Policy, Microsoft Defender for Cloud enables you to take advantage Azure Policy’s REST API to create policy assignments. The following instructions walk you through creation of policy assignments, and customization of existing assignments. 

Important concepts in Azure Policy: 

- A **policy definition** is a rule 

- An **initiative** is a collection of policy definitions (rules) 

- An **assignment** is an application of an initiative or a policy to a specific scope (management group, subscription, etc.) 

Defender for Cloud has a built-in initiative, [Microsoft cloud security benchmark](/security/benchmark/azure/introduction), that includes all of its security policies. To assess Defender for Cloud’s policies on your Azure resources, you should create an assignment on the management group, or subscription you want to assess.

The built-in initiative has all of Defender for Cloud’s policies enabled by default. You can choose to disable certain policies from the built-in initiative. For example, to apply all of Defender for Cloud’s policies except **web application firewall**, change the value of the policy’s effect parameter to **Disabled**.

## API examples

In the following examples, replace these variables:

- **{scope}** enter the name of the management group or subscription to which you're applying the policy
- **{policyAssignmentName}** enter the name of the relevant policy assignment
- **{name}** enter your name, or the name of the administrator who approved the policy change

This example shows you how to assign the built-in Defender for Cloud initiative on a subscription or management group:
 
 ```
    PUT  
    https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 

    Request Body (JSON) 

    { 

      "properties":{ 

    "displayName":"Enable Monitoring in Microsoft Defender for Cloud", 

    "metadata":{ 

    "assignedBy":"{Name}" 

    }, 

    "policyDefinitionId":"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8", 

    "parameters":{}, 

    } 

    } 
 ```

This example shows you how to assign the built-in Defender for Cloud initiative on a subscription, with the following policies disabled: 

- System updates (“systemUpdatesMonitoringEffect”) 

- Security configurations ("systemConfigurationsMonitoringEffect") 

- Endpoint protection ("endpointProtectionMonitoringEffect") 

 ```
    PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 
    
    Request Body (JSON) 
    
    { 
    
      "properties":{ 
    
    "displayName":"Enable Monitoring in Microsoft Defender for Cloud", 
    
    "metadata":{ 
    
    "assignedBy":"{Name}" 
    
    }, 
    
    "policyDefinitionId":"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8", 
    
    "parameters":{ 
    
    "systemUpdatesMonitoringEffect":{"value":"Disabled"}, 
    
    "systemConfigurationsMonitoringEffect":{"value":"Disabled"}, 
    
    "endpointProtectionMonitoringEffect":{"value":"Disabled"}, 
    
    }, 
    
     } 
    
    } 
 ```

This example shows you how to assign a custom Defender for Cloud initiative on a subscription or management group:

> [!NOTE]
> Make sure you include `"ASC":"true"` in the request body as shown here. The `ASC` field onboards the initiative to Microsoft Defender for Cloud.
 
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

This example shows you how to remove an assignment:

```
  DELETE   
  https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2018-05-01 
```

::: zone-end


## Enhance your custom recommendations with detailed information

The built-in recommendations supplied with Microsoft Defender for Cloud include details such as severity levels and remediation instructions. If you want to add this type of information to your custom recommendations so that it appears in the Azure portal or wherever you access your recommendations, you'll need to use the REST API. 

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

For another example of using the securityCenter property, see [this section of the REST API documentation](/rest/api/defenderforcloud/assessments-metadata/create-in-subscription#examples).


## Next steps

In this article, you learned how to create custom security policies. 

For other related material, see the following articles: 

- [The overview of security policies](tutorial-security-policy.md)
- [A list of the built-in security policies](./policy-reference.md)
