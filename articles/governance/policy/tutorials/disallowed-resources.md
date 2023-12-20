---
title: "Tutorial: Disallow resource types in your cloud environment"
description: In this tutorial, you use Azure Policy to enforce only certain resource types be used in your environment.
ms.date: 06/19/2023
ms.topic: tutorial
---
# Tutorial: Disallow resource types in your cloud environment

One popular goal of cloud governance is restricting what resource types are allowed or disallowed in the environment. Businesses have many motivations behind resource type restrictions. For example, resource types may be costly or may go against business standards and strategies. Rather than creating and assigning several individual policies to allow or disallow individual resource types, Azure Policy offers two built-in policies to achieve this goal:

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa08ec900-254a-4555-9bf5-e42af04b5c5c) |This policy enables you to specify the resource types that your organization can deploy. Only resource types that support 'tags' and 'location' are affected by this policy. To restrict all resources, duplicate this policy and change the 'mode' to 'All'. |deny |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedResourceTypes_Deny.json) |
|[Not allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6c112d4e-5bc7-47ae-a041-ea2d9dccd749) |Restrict which resource types can be deployed in your environment. Limiting resource types can reduce the complexity and attack surface of your environment while also helping to manage costs. Compliance results are only shown for non-compliant resources. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/InvalidResourceTypes_Deny.json) |

In this tutorial, you apply the **Not allowed resource types** policy and manage resource types at scale through Microsoft Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/)
before you begin.

## Assign the policy definition

The first step in disabling resource types is to assign the **Not allowed resource types** policy definition.

1. Go to [Not allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6c112d4e-5bc7-47ae-a041-ea2d9dccd749) in Azure portal.

   :::image source="../media/disallowed-resources/definition-details-red-outline.png" alt-text="Screenshot of definition details screen for 'Not allowed resource types' policy.":::

1. Click the **Assign** button on the top of the page. 

1. On the **Basics** tab, select the **Scope** by selecting the ellipsis
   and choosing a management group, subscription, or resource group of choice. Ensure that the selected scope has at least one subscope. Learn more about [scopes](../concepts/scope.md). Then click **Select** at the bottom of the **Scope** page.

   This example uses the **Contoso** subscription.

1. Resources can be excluded based on the **Scope**. **Exclusions** start at one level lower than
   the level of the **Scope**. **Exclusions** are optional, so leave it blank for now.

1. The **Assignment name** is automatically populated with the policy definition name you selected, but you can
   change it. You can
   also add an optional **Description** to provide details about this policy
   assignment.

1. Leave **Policy enforcement** as _Enabled_. When _Disabled_, this setting allows testing the
   outcome of the policy without triggering the effect. For more information, see
   [enforcement mode](../concepts/assignment-structure.md#enforcement-mode).

1. **Assigned by** is automatically filled based on who is logged in. This field is optional, so
   custom values can be entered.

1. Select the **Parameters** tab at the top of the wizard. This tutorial skips the **Advanced** tab.

1. For the **Not allowed resource types** parameter, use the drop-down to search and select resource types that shouldn't be allowed in your cloud environment.

1. This policy definition doesn't have the `modify` or `deployIfNotExists` effects, so it doesn't support remediation tasks. For this tutorial, skip the **Remediation** tab.

1. Select the **Non-compliance messages** tab at the top of the wizard.

1. Set the **Non-compliance message** to _This resource type isn't allowed_. This custom message is displayed when a resource is denied or for non-compliant resources during regular evaluation.

1. Select the **Review + create** tab at the top of the wizard.

1. Review your selections, then select **Create** at the bottom of the page.

## View disabled resource types in Azure portal

Now that you've assigned a built-in policy definition, go to [All Services](https:/portal.azure.com/#allservices/category/All). Azure portal is aware of the existence of allowed and not allowed resource type policy assignments and disables resources in the **All Services** page accordingly.

> [!NOTE]
> If you assign this policy definition to your root management group, users will see the following notification when they log in for the first time or if the policy changes after they have logged in:
>
> _**Policy changed by admin**
> Your administrator has made changes to the policies for your account. It is recommended that you refresh the portal to use the updated policies._

   :::image source="../media/disallowed-resources/disabled-resources.png" alt-text="Screenshot of disallowed resources in All Services blade.":::


## Create an exemption

Now suppose that one subscope should be allowed to have the resource types disabled by this policy. Let's create an exemption on this scope so that otherwise restricted resources can be deployed there. 

> [!WARNING]
> If you assign this policy definition to your *root management group* scope, Azure portal is unable to detect exemptions at lower level scopes from the All Services list. Resources disallowed by the policy assignment will still show as disabled from this view even if an exemption is in place at a lower scope. However, if the user has permissions on the exempt subscope, they will not be prevented from navigating to the service and performing actions there. At this point the false disabled status should no longer be present.

1. Select **Assignments** under **Authoring** in the left side of the Azure Policy page.

1. Search for the policy assignment you created.

1. Select the **Create exemption** button on the top of the page. 

1. In the **Basics** tab, select the **Exemption scope**, which is the subscope that should be allowed to have resources restricted by this policy assignment.

1. Fill out **Exemption name** with the desired text, and leave **Exemption category** as the default of *Waiver*. Don't switch the toggle for **Exemption expiration setting**, because this exemption won't be set to expire. Optionally add an **Exemption description**, and select **Review + create**.

1. This tutorial bypasses the **Advanced** tab. From the **Review + create** tab, select **Create**.

1. To view the exemption, select **Exemptions** under **Authoring** in the left side of the Azure Policy page.

Now your subscope can have the resource types disallowed by the policy.

## Clean up resources

If you're done working with resources from this tutorial, use the following steps to delete any of
the policy assignments or definitions created in this tutorial:

1. Select **Definitions** (or **Assignments** if you're trying to delete an assignment) under
   **Authoring** in the left side of the Azure Policy page.

1. Search for the new initiative or policy definition (or assignment) you want to remove.

1. Right-click the row or select the ellipses at the end of the definition (or assignment), and
   select **Delete definition** (or **Delete assignment**).

## Review

In this tutorial, you successfully accomplished the following tasks:

> [!div class="checklist"]
> - Assigned a built-in policy that denies creation of disallowed resource types
> - Created an exemption for a subscope

## Next steps

To learn more about the structures of policy definitions, assignments, and exemptions, look at these articles:

> [!div class="nextstepaction"]
> [Azure Policy definition structure](../concepts/definition-structure.md)
> [Azure Policy assignment structure](../concepts/assignment-structure.md)
> [Azure Policy exemption structure](../concepts/exemption-structure.md)


To see a full list of built-in policy samples, view this article:
> [!div class="nextstepaction"]
> [Azure Policy definition structure](../samples/built-in-policies.md)
