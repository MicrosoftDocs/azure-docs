---
title: "Tutorial: Apply MFA Self-Enforcement through Azure Policy"
description: Learn how to gather audit events or enforce MFA enforcement on your environment
ms.date: 07/17/2025
ms.topic: how-to
author: nehakulkarni
ms.author: nehakulkarni
---
# Tutorial: Apply MFA Self-Enforcement through Azure Policy
[Azure Policy](../overview.md) is a powerful governance tool that allows you to enforce organizational standards and assess compliance at-scale. You can also use Azure Policy to prepare your organization for [upcoming enforcement of multi-factor authentication (MFA) across Azure clients](https://learn.microsoft.com/entra/identity/authentication/concept-mandatory-multifactor-authentication?tabs=dotnet).
This guide walks you through the process of applying Azure Policy assignments to self-enforce multi-factor authentication across your organization.

## Apply Azure Policy enforcement through Azure Portal

**1. Sign In to Azure Portal**
Navigate to the Azure Portal at portal.azure.com

**2. Access Azure Policy Service**
On the left-hand menu or home dashboard, select Policy under Azure services. If you don't see it, type 'Policy' in the search bar at the top and select it from the results.

:::image type="content" source="../media/multifactor-enforcement/image1.png" alt-text="Screenshot of Azure Policy Assignment View." border="false":::

**3. Choose the Scope for Assignment**
- In the Policy dashboard, click on Assignments in the left pane.
- Click Assign policy at the top of the assignments page.
- In the Scope section, click Select scope.
- Choose the appropriate resource group, subscription, or management group where you want to apply the policy. Click Select to confirm your choice.
<img width="670" height="303" alt="image" src="https://github.com/user-attachments/assets/3979890d-a756-4994-ab1f-affd64519c32" />


**4. Configure Selectors for gradual rollout of policy enforcement**
  > [!NOTE]
  > To enable safe rollout of policy enforcement, we recommend leveraging Azure Policy’s resource selectors to gradually rollout policy enforcement across your resources.
- In the 'Basics' tab, you’ll see 'Resource Selectors'. Click expand.
- Click 'Add a resource selector'
:::image type="content" source="../media/multifactor-enforcement/image2.png" alt-text="Screenshot of Azure Policy Assignment Creation View." border="false":::
- In your resource selector, add a name for your selector.
- Toggle resourceLocation to enable it. Pick a few low-risk regions that you’d like to enforce on. This means that the policy assignment will only evaluate Azure resources in those regions.
- You can update this assignment later to add more regions by adding additional resourceLocation selectors or updating the existing resourceLocation selector to add more regions.
:::image type="content" source="../media/multifactor-enforcement/image3.png" alt-text="Screenshot of Azure Policy Selector Creation View." border="false":::

**5. Select a Policy Definition**
- Under 'Basics', click on Policy definition.
- Browse or search for the multi-factor policy definition – there will be 2 of them. Pick one for now:
- [[Preview]: Users must authenticate with multi-factor authentication to delete resources - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb4a9d17-db75-4f46-9fcb-9f9526604417/version/1.0.0-preview/scopes/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender/)
- [[Preview]: Users must authenticate with multi-factor authentication to create or update resources - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e6c27d5-a6ee-49cf-b2b4-d8fe90fa2b8b/version/1.0.0-preview/scopes/%5B%22%2Fsubscriptions%2F12015272-f077-4945-81de-a5f607d067e1%22%2C%22%2Fsubscriptions%2F0ba674a6-9fde-43b4-8370-a7e16fdf0641%22%5D/contextRender/)
- Select the policy definition from the list.
:::image type="content" source="../media/multifactor-enforcement/image4.png" alt-text="Screenshot of Azure Policy Definition Search View." border="false":::

**6. Configure Additional Assignment Details**
- Under 'Basics', enter a Name for your policy assignment. Optionally, you may add a Description to help others understand the purpose of this assignment.
- Under 'Basics', enforcement mode should be set to enabled (this is set by default, no action needed).
- Go to the 'Parameters' tab. Uncheck 'only show parameters that require input or review'. The parameter value should be at the pre-selected value 'AuditAction' or 'Audit' (depending on the definition chosen in step 4).
- Under the 'Non-compliance messages' tab, configure a custom message that any user will see if they are blocked from deleting a resource because of this enforcement:
  
_Sample Text: To resolve this error, you must set up MFA, following the process outlined at aka.ms/setupMFA. If you set up MFA and are still receiving this error, please reach out to your Entra administrator to restore the security default for Azure by following the process outlined at aka.ms/loginMFAForAzure._

:::image type="content" source="../media/multifactor-enforcement/image5.png" alt-text="Screenshot of Azure Policy Non Compliance Message Tab." border="false":::


**7. Review and Create Assignment**
- Review your selections and settings on the 'Review + create' tab.
- If everything looks correct, click 'Create' to apply the policy assignment.

**8. Rollout the policy assignment to all regions**
- After completing step 7, you may update the policy assignment selector to evaluate resources in additional regions. Repeat this step until the policy assignment is evaluating resources in all regions.

**9. Verify existence of the policy assignment**
- Go to the 'Assignments' tab to confirm that the policy assignment was successfully created. You can use the search bar and scope bar to easily filter.
:::image type="content" source="../media/multifactor-enforcement/image6.png" alt-text="Screenshot of Azure Policy Assignment List View." border="false":::


## Update the policy assignment to enforcement
Once you are ready, you may update the policy assignment to enable enforcement. This is done by updating the 'Effect' of the policy assignment.
- Go to the policy assignment under [Policy|Assignments](https://portal.azure.com/?subscriptionId=617eb244-7791-4c21-98c5-77f840a7e4ef#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Overview/scope/%2Fsubscriptions%2F617eb244-7791-4c21-98c5-77f840a7e4ef). Click 'Edit assignment'.
- In the 'Basics' tab, you’ll see 'Overrides'. Click expand.
- Click 'Add a policy effect override'
- In the drop down menu, update the 'Override Value' to 'DenyAction' or 'Deny' (depending on the policy definition chosen at Step 4).
- For 'Selected Resources', pick a few low-risk regions that you’d like to enforce on. This means that the policy assignment will only evaluate Azure resources in those regions.
:::image type="content" source="../media/multifactor-enforcement/image7.png" alt-text="Screenshot of Azure Policy Overrides Creation." border="false":::
- Click 'Review + save', then 'Create'.
- Once you have confirmed no unexpected impact for this initial application, you may update the existing override to add additional regions, then monitor for any impact. Repeat this step as many times as needed to eventually add all regions.

# User Experience during Preview

## Audit Mode
Users can discover audit events in their activity log when this policy assignment is applied in audit mode and they attempt to create, update or delete a resource without being authenticated with MFA.

Activity Log events can be viewed in Azure Portal and other SDKs. Here is a sample query that can be used in CLI:

`az monitor activity-log list \
  --query "[?operationName.value=='Microsoft.Authorization/policies/audit/action'].{ResourceId: resourceId, Policies: properties.policies}" \
  --output json | \
jq -r '"ResourceName\tResourceId\tPolicyDefinitionDisplayName", (.[] as $event | ($event.Policies | fromjson[] | "\($event.ResourceId | split("/") | last)\t\($event.ResourceId)\t\(.policyDefinitionDisplayName)"))' | \
column -t -s $'\t'`

## Enforcement Mode
Users can expect the following experience when this policy assignment is applied in enforcement mode and they attempt to create, update or delete a resource without being authenticated with MFA.

The next section shows the experience from some select clients when the policy assignment is applied in enforcement mode and a user account attempts to create, update, or delete a resource without being authenticated with MFA.
  > [!NOTE]
  > In preview timeframe, the error message(s) displayed to the user may differ depending on the client and command being run. This error messaging will continue to improve to be consistent across clients used as this feature matures to GA availability.
### Azure Portal
When a user attempts to perform a create, update, or delete operation without an MFA-authenticated token, Azure Portal may return:
:::image type="content" source="../media/multifactor-enforcement/image8.png" alt-text="Screenshot of Azure Portal View When User Gets Blocked By Policy." border="false":::

### Azure CLI
When a user attempts to perform a create, update, or delete operation without an MFA-authenticated token, Azure CLI may return:
:::image type="content" source="../media/multifactor-enforcement/image9.png" alt-text="Screenshot of Azure CLI View When User Gets Blocked By Policy." border="false":::

### Azure PowerShell
When a user attempts to perform a create, update, or delete operation without an MFA-authenticated token, Azure PowerShell may return:
:::image type="content" source="../media/multifactor-enforcement/image10.png" alt-text="Screenshot of Azure PS View When User Gets Blocked By Policy." border="false":::

## Limitations in the Preview Timeframe
- In some cases, you may not be prompted to complete MFA after receiving an error. In such cases, please re-authenticate with MFA before retrying the operation (e.g., through Azure Portal).
- In some cases, the error message may not indicate that the operation is blocked due to the policy assignment in-place. Please take note of the error message samples shared above in order to familiarize your organization on what error messages they may receive.
