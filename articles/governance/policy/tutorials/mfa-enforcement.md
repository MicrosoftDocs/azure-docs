---
title: "Tutorial: Self-enforce MFA through Azure Policy"
description: Learn how to gather audit events or enforce MFA enforcement on your environment
ms.date: 07/17/2025
ms.topic: how-to
author: nehakulkarni
ms.author: nehakulkarni
---
# Tutorial: Apply MFA self-enforcement through Azure Policy
[Azure Policy](../overview.md) is a powerful governance tool that allows you to prepare your organization for [upcoming enforcement of multifactor authentication (MFA) across Azure clients](https://aka.ms/mfaforazure).
This guide walks you through the process of applying Azure Policy assignments to self-enforce multifactor authentication across your organization.

## Apply Azure Policy enforcement through Azure portal

### 1. Sign into Azure portal
Navigate to the [Azure portal](https://www.portal.azure.com)

### 2. Access Azure Policy Service
Select Policy under Azure services. If you don't see it, type 'Policy' in the search bar at the top and select it from the results.

:::image type="content" source="../media/multifactor-enforcement/policy-overview.png" alt-text="Screenshot of Azure Policy Assignment View." border="false" lightbox="../media/multifactor-enforcement/policy-overview.png":::

### 3. Choose the Scope for Assignment
1. Click 'Assignments' in the left pane of the Policy dashboard.
2. Click 'Assign policy' at the top of the assignments page.
3. Click 'Select scope' in the Scope section.
4. Select the appropriate resource group, subscription, or management group where you want to apply the policy.
5. Click 'Select' to confirm your choice.

### 4. Configure Selectors for gradual rollout of policy enforcement
  > [!NOTE]
  > To enable safe rollout of policy enforcement, we recommend using [Azure Policy’s resource selectors](/azure/governance/policy/concepts/assignment-structure#resource-selectors) to gradually rollout policy enforcement across your resources.
1. Click 'Expand' on the 'Resource Selectors' section of the Basics tab.
2. Click 'Add a resource selector'

   :::image type="content" source="../media/multifactor-enforcement/policy-resource-selectors.png" alt-text="Screenshot of Azure Policy Assignment Creation View." border="false" lightbox="../media/multifactor-enforcement/policy-resource-selectors.png":::
    
3. Add a name for your selector
4. Toggle resourceLocation to enable it.
5. Pick a few low-risk regions that you’d like to enforce on. The policy assignment will evaluate Azure resources in those regions.
6. You can update this assignment later to add more regions by adding more resourceLocation selectors or updating the existing resourceLocation selector to add more regions.
  
:::image type="content" source="../media/multifactor-enforcement/resource-selector-creation.png" alt-text="Screenshot of Azure Policy Selector Creation View." border="false" lightbox="../media/multifactor-enforcement/resource-selector-creation.png":::

### 5. Select a Policy Definition
1. Click on Policy definition under 'Basics'.
2. Browse or search for the multifactor policy definition – there are 2 of them. Pick one for now:
    - [Users must authenticate with multi-factor authentication to delete resources](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb4a9d17-db75-4f46-9fcb-9f9526604417/version/1.0.0-preview/scopes/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender/).
    - [Users must authenticate with multi-factor authentication to create or update resources](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e6c27d5-a6ee-49cf-b2b4-d8fe90fa2b8b/version/1.0.0-preview/scopes/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender/).
3. Select the policy definition from the list.
  
:::image type="content" source="../media/multifactor-enforcement/policy-definition-selection.png" alt-text="Screenshot of Azure Policy Definition Search View." border="false" lightbox="../media/multifactor-enforcement/policy-definition-selection.png":::

### 6. Configure More Assignment Details
1. Under 'Basics', enter a name for your policy assignment. Optionally, you may add a description to help others understand the purpose of this assignment.
2. Under 'Basics', enforcement mode should be set to enabled (this mode is set by default, no action needed).
3. Go to the 'Parameters' tab. Uncheck 'only show parameters that require input or review'. The parameter value should be at the preselected value 'AuditAction' or 'Audit' (depending on the definition chosen in step 4).
4. Under the 'Non-compliance messages' tab, configure a custom message that any user sees if they're blocked from deleting a resource because of this enforcement:
  
_Sample Text: To resolve this error, set up MFA at aka.ms/setupMFA. If you set up MFA and are still receiving this error, reach out to your Entra administrator to restore your Azure security default._

:::image type="content" source="../media/multifactor-enforcement/noncompliance-message.png" alt-text="Screenshot of Azure Policy Message Tab." border="false" lightbox="../media/multifactor-enforcement/noncompliance-message.png":::


### 7. Review and Create Assignment
1. Review your selections and settings on the 'Review + create' tab.
2. If everything looks correct, click 'Create' to apply the policy assignment.

### 8. Roll out the policy assignment to all regions
1. Update the policy assignment selector to evaluate resources in other regions.
2. Repeat this step until the policy assignment is evaluating resources in all regions.

### 9. Verify existence of the policy assignment
1. Under the 'Assignments' tab, confirm that the policy assignment was successfully created.
2. You can use the search bar and scope bar to easily filter.
  
:::image type="content" source="../media/multifactor-enforcement/assignment-list.png" alt-text="Screenshot of Azure Policy Assignment List View." border="false" lightbox="../media/multifactor-enforcement/assignment-list.png":::


## Update the policy assignment to enforcement
You can enable enforcement by updating the 'Effect' of the policy assignment.
1. Go to the policy assignment under [Policy Assignments](https://portal.azure.com/?subscriptionId=617eb244-7791-4c21-98c5-77f840a7e4ef#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Overview/scope/%2Fsubscriptions%2F617eb244-7791-4c21-98c5-77f840a7e4ef). Click 'Edit assignment'.
2. In the 'Basics' tab, you’ll see 'Overrides'. Click expand.
3. Click 'Add a policy effect override'
4. In the drop-down menu, update the `Override Value` to 'DenyAction' or 'Deny' (depending on the policy definition chosen at Step 4).
5. For `Selected Resources`, pick a few low-risk regions that you’d like to enforce on. The policy assignment will only evaluate Azure resources in those regions.
:::image type="content" source="../media/multifactor-enforcement/overrides-example.png" alt-text="Screenshot of Azure Policy Overrides Creation." border="false" lightbox="../media/multifactor-enforcement/overrides-example.png":::
6. Click 'Review + save', then 'Create'.
7. Once you have confirmed no unexpected impact, you may update the existing override to add other regions.

## Audit Mode
Discover audit events in your activity log when this policy assignment is applied in audit mode. Each event represents a resource create, update or delete that was performed by a user who did not authenticate with MFA.

You can view activity Log events in Azure portal and other supported clients. Here's a sample query that can be used in CLI:

`az monitor activity-log list \
  --query "[?operationName.value=='Microsoft.Authorization/policies/audit/action'].{ResourceId: resourceId, Policies: properties.policies}" \
  --output json | \
jq -r '"ResourceName\tResourceId\tPolicyDefinitionDisplayName", (.[] as $event | ($event.Policies | fromjson[] | "\($event.ResourceId | split("/") | last)\t\($event.ResourceId)\t\(.policyDefinitionDisplayName)"))' | \
column -t -s $'\t'`

## Enforcement Mode
Discover deny events in your activity log when this policy assignment is applied in enforcement mode. Each deny event represents a resource create, update or delete that was attempted by a user who did not authenticate with MFA.

The next section shows the experience from some select clients when the policy assignment is applied in enforcement mode and a user account attempts to create, update, or delete a resource without being authenticated with MFA.
  > [!NOTE]
  > In preview timeframe, the error messages displayed to the user may differ depending on the client and command being run. 
### Azure portal
When you attempt to perform a create, update, or delete operation without an MFA-authenticated token, Azure portal may return:

:::image type="content" source="../media/multifactor-enforcement/portal-enforcement.png" alt-text="Screenshot of Azure portal view." border="false" lightbox="../media/multifactor-enforcement/portal-enforcement.png":::

### Azure CLI
When you attempt to perform a create, update, or delete operation without an MFA-authenticated token, Azure CLI may return:

:::image type="content" source="../media/multifactor-enforcement/cli-sample.png" alt-text="Screenshot of Azure CLI View When User Gets Blocked By Policy." border="false" lightbox="../media/multifactor-enforcement/cli-sample.png":::

### Azure PowerShell
When you attempt to perform a create, update, or delete operation without an MFA-authenticated token, Azure PowerShell may return:

:::image type="content" source="../media/multifactor-enforcement/powershell-sample.png" alt-text="Screenshot of Azure PowerShell View When User Gets Blocked By Policy." border="false" lightbox="../media/multifactor-enforcement/powershell-sample.png":::
