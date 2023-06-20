---
title: "Tutorial: Disallow resource types in your cloud environment"
description: In this tutorial, you use Azure Policy to enforce only certain resource types be used in your environment.
ms.date: 06/19/2023
ms.topic: tutorial
---
# Tutorial: Disallow resource types in your cloud environment

One popular goal of cloud governance is restricting what resource types are allowed or disallowed in the environment. Businesses have many motivations behind resource type restrictions. For example, resource types may be costly or may go against business standards and strategies. Rather than creating and assigning several individual policies to allow or disallow a single resource type, Azure Policy offers two built-in policies to achieve this goal:

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa08ec900-254a-4555-9bf5-e42af04b5c5c) |This policy enables you to specify the resource types that your organization can deploy. Only resource types that support 'tags' and 'location' will be affected by this policy. To restrict all resources please duplicate this policy and change the 'mode' to 'All'. |deny |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedResourceTypes_Deny.json) |
|[Not allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6c112d4e-5bc7-47ae-a041-ea2d9dccd749) |Restrict which resource types can be deployed in your environment. Limiting resource types can reduce the complexity and attack surface of your environment while also helping to manage costs. Compliance results are only shown for non-compliant resources. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/InvalidResourceTypes_Deny.json) |

In this tutorial, you apply the **Not allowed resource types** policy and manage resource types at scale.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/)
before you begin.

## Assign the policy definition

The first step in disabling resource types is to assign the **Not allowed resource types** policy definition.

1. Navigate to [Not allowed resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6c112d4e-5bc7-47ae-a041-ea2d9dccd749) in Portal.

   :::image type="content" source="../media/disallowed-resources/definition-details.jpg" alt-text="Screenshot of definition details screen for 'Not allowed resource types' policy." border="false":::

1. Click the **Assign** button on the top of the page. 

1. On the **Basics** tab, select the **Scope** by selecting the ellipsis
   and choosing a management group, subscription, or resource group of choice. Learn more about [scope](../concepts/scope.md). Then select **Select** at the bottom of the **Scope** page.

   This example uses the **Contoso** subscription. Your subscription will differ.

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

1. Select the **Parameters** tab at the top of the wizard.

1. For the **Not allowed resource types** parameter, use the drop down to search and select resource types which should not be allowed in your cloud environment.

1. This policy definition does not have the `modify` or `deployIfNotExists` effects, so it does not support remediation tasks. For this tutorial, skip the **Remediation** tab.

1. Select the **Non-compliance messages** tab at the top of the wizard.

1. Set the **Non-compliance message** to _This resource type is not allowed_. This custom message is displayed when a resource is denied or for non-compliant resources during regular evaluation.

1. Select the **Review + create** tab at the top of the wizard.

1. Review your selections, then select **Create** at the bottom of the page.

## View results of your policy assignment in portal

The unique part of the allowed and not allowed resource type policies is that Azure Portal is aware of their existence and disables them in **All Services**.

Now that you've assigned a built-in policy definition, ...

> [!NOTE]
> If you assign this policy definition to your root management group, users will see the following notification when they log in for the first time or if the policy changes after they have logged in:
>
> _**Policy changed by admin**
> Your administrator has made changes to the policies for your account. It is recommended that you refresh the portal to use the updated policies._

## Create an exemption for this policy assignment

Now suppose your environment is set up such that only one subscription should be allowed to deploy the resource types disabled by this policy...

> [!WARNING]
> If you assign this policy definition to your root management group scope, Portal is unable to detect exemptions at lower level scopes from the All Services list. Resources disallowed by the policy assignment will still show as disabled from this view even if an exemption is in place at a lower scope. However, if the user has permissions on the exempt sub-scope, they will not be prevented from navigating to the service. At this point the false disabled status should no longer be present.

## Create a policy definition with REST API

You can create a policy with the REST API for Azure Policy Definitions. The REST API enables you to
create and delete policy definitions, and get information about existing definitions. To create a
policy definition, use the following example:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}
```

Include a request body similar to the following example:

```json
{
    "properties": {
        "parameters": {
            "allowedLocations": {
                "type": "array",
                "metadata": {
                    "description": "The list of locations that can be specified when deploying resources",
                    "strongType": "location",
                    "displayName": "Allowed locations"
                }
            }
        },
        "displayName": "Allowed locations",
        "description": "This policy enables you to restrict the locations your organization can specify when deploying resources.",
        "policyRule": {
            "if": {
                "not": {
                    "field": "location",
                    "in": "[parameters('allowedLocations')]"
                }
            },
            "then": {
                "effect": "deny"
            }
        }
    }
}
```

## Create a policy definition with PowerShell

Before proceeding with the PowerShell example, make sure you've installed the latest version of the
Azure PowerShell Az module.

You can create a policy definition using the `New-AzPolicyDefinition` cmdlet.

To create a policy definition from a file, pass the path to the file. For an external file, use the
following example:

```azurepowershell-interactive
$definition = New-AzPolicyDefinition `
    -Name 'denyCoolTiering' `
    -DisplayName 'Deny cool access tiering for storage' `
    -Policy 'https://raw.githubusercontent.com/Azure/azure-policy-samples/master/samples/Storage/storage-account-access-tier/azurepolicy.rules.json'
```

For a local file use, use the following example:

```azurepowershell-interactive
$definition = New-AzPolicyDefinition `
    -Name 'denyCoolTiering' `
    -Description 'Deny cool access tiering for storage' `
    -Policy 'c:\policies\coolAccessTier.json'
```

To create a policy definition with an inline rule, use the following example:

```azurepowershell-interactive
$definition = New-AzPolicyDefinition -Name 'denyCoolTiering' -Description 'Deny cool access tiering for storage' -Policy '{
    "if": {
        "allOf": [{
                "field": "type",
                "equals": "Microsoft.Storage/storageAccounts"
            },
            {
                "field": "kind",
                "equals": "BlobStorage"
            },
            {
                "field": "Microsoft.Storage/storageAccounts/accessTier",
                "equals": "cool"
            }
        ]
    },
    "then": {
        "effect": "deny"
    }
}'
```

The output is stored in a `$definition` object, which is used during policy assignment. The
following example creates a policy definition that includes parameters:

```azurepowershell-interactive
$policy = '{
    "if": {
        "allOf": [{
                "field": "type",
                "equals": "Microsoft.Storage/storageAccounts"
            },
            {
                "not": {
                    "field": "location",
                    "in": "[parameters(''allowedLocations'')]"
                }
            }
        ]
    },
    "then": {
        "effect": "Deny"
    }
}'

$parameters = '{
    "allowedLocations": {
        "type": "array",
        "metadata": {
            "description": "The list of locations that can be specified when deploying storage accounts.",
            "strongType": "location",
            "displayName": "Allowed locations"
        }
    }
}'

$definition = New-AzPolicyDefinition -Name 'storageLocations' -Description 'Policy to specify locations for storage accounts.' -Policy $policy -Parameter $parameters
```

### View policy definitions with PowerShell

To see all policy definitions in your subscription, use the following command:

```azurepowershell-interactive
Get-AzPolicyDefinition
```

It returns all available policy definitions, including built-in policies. Each policy is returned
in the following format:

```output
Name               : e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceId         : /providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceName       : e56962a6-4747-49cd-b67b-bf8b01975c4c
ResourceType       : Microsoft.Authorization/policyDefinitions
Properties         : @{displayName=Allowed locations; policyType=BuiltIn; description=This policy enables you to
                     restrict the locations your organization can specify when deploying resources. Use to enforce
                     your geo-compliance requirements.; parameters=; policyRule=}
PolicyDefinitionId : /providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c
```

## Create a policy definition with Azure CLI

You can create a policy definition using Azure CLI with the `az policy definition` command. To
create a policy definition with an inline rule, use the following example:

```azurecli-interactive
az policy definition create --name 'denyCoolTiering' --description 'Deny cool access tiering for storage' --rules '{
    "if": {
        "allOf": [{
                "field": "type",
                "equals": "Microsoft.Storage/storageAccounts"
            },
            {
                "field": "kind",
                "equals": "BlobStorage"
            },
            {
                "field": "Microsoft.Storage/storageAccounts/accessTier",
                "equals": "cool"
            }
        ]
    },
    "then": {
        "effect": "deny"
    }
}'
```

### View policy definitions with Azure CLI

To see all policy definitions in your subscription, use the following command:

```azurecli-interactive
az policy definition list
```

It returns all available policy definitions, including built-in policies. Each policy is returned
in the following format:

```json
{
    "description": "This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements.",
    "displayName": "Allowed locations",
    "id": "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",
    "name": "e56962a6-4747-49cd-b67b-bf8b01975c4c",
    "policyRule": {
        "if": {
            "not": {
                "field": "location",
                "in": "[parameters('listOfAllowedLocations')]"
            }
        },
        "then": {
            "effect": "Deny"
        }
    },
    "policyType": "BuiltIn"
}
```

## Create and assign an initiative definition

With an initiative definition, you can group several policy definitions to achieve one overarching
goal. An initiative evaluates resources within scope of the assignment for compliance to the
included policies. For more information about initiative definitions, see [Azure Policy
overview](../overview.md).

### Create an initiative definition

1. Select **Definitions** under **Authoring** in the left side of the Azure Policy page.

   :::image type="content" source="../media/create-and-manage/definition-under-authoring.png" alt-text="Screenshot of the Definitions page under the Authoring group.":::

1. Select **+ Initiative Definition** at the top of the page to open the **Initiative definition**
   wizard.

   :::image type="content" source="../media/create-and-manage/initiative-definition.png" alt-text="Screenshot of the initiative definition page and properties to set.":::

1. Use the **Initiative location** ellipsis to select a management group or subscription to store
   the definition. If the previous page was scoped to a single management group or subscription,
   **Initiative location** is automatically populated.

1. Enter the **Name** and **Description** of the initiative.

   This example validates that resources are in compliance with policy definitions about getting
   secure. Name the initiative **Get Secure** and set the description as: **This initiative has been
   created to handle all policy definitions associated with securing resources**.

1. For **Category**, choose from existing options or create a new category.

1. Set a **Version** for the initiative, such as _1.0_.

   > [!NOTE]
   > The version value is strictly metadata and isn't used for updates or any process by the Azure
   > Policy service.

1. Select **Next** at the bottom of the page or the **Policies** tab at the top of the wizard.

1. Select **Add policy definition(s)** button and browse through the list. Select the policy
   definition(s) you want added to this initiative. For the **Get Secure** initiative, add the
   following built-in policy definitions by selecting the checkbox next to the policy definition:

   - Allowed locations
   - Endpoint protection should be installed on machines
   - Non-internet-facing virtual machines should be protected with network security groups
   - Azure Backup should be enabled for Virtual Machines
   - Disk encryption should be applied on virtual machines
   - Add or replace a tag on resources (add this policy definition twice)

   After selecting each policy definition from the list, select **Add** at the bottom of the list.
   Since it's added twice, the _Add or replace a tag on resources_ policy definitions each get a
   different _reference ID_.

   :::image type="content" source="../media/create-and-manage/initiative-definition-2.png" alt-text="Screenshot of the selected policy definitions with their reference ID and group on the initiative definition page.":::

   > [!NOTE]
   > The selected policy definitions can be added to groups by selecting one or more added
   > definitions and selecting **Add selected policies to a group**. The group must exist first
   > and can be created on the **Groups** tab of the wizard.

1. Select **Next** at the bottom of the page or the **Groups** tab at the top of the wizard. New
   groups can be added from this tab. For this tutorial, we aren't adding any groups.

1. Select **Next** at the bottom of the page or the **Initiative parameters** tab at the top of the
   wizard. If we wanted a parameter to exist at the initiative for passing to one or more included
   policy definitions, the parameter is defined here and then used on the **Policy parameters** tab.
   For this tutorial, we aren't adding any initiative parameters.

   > [!NOTE]
   > Once saved to an initiative definition, initiative parameters can't be deleted from the
   > initiative. If an initiative parameter is no longer needed, remove it from use by any policy
   > definition parameters.

1. Select **Next** at the bottom of the page or the **Policy parameters** tab at the top of the
   wizard.

1. Policy definitions added to the initiative that have parameters are displayed in a grid. The
   _value type_ can be 'Default value', 'Set value', or 'Use Initiative Parameter'. If 'Set value'
   is selected, the related value is entered under _Value(s)_. If the parameter on the policy
   definition has a list of allowed values, the entry box is a dropdown list selector. If 'Use
   Initiative Parameter' is selected, a dropdown list select is provided with the names of
   initiative parameters created on the **Initiative parameters** tab.

   :::image type="content" source="../media/create-and-manage/initiative-definition-3.png" alt-text="Screenshot of the options for allowed values for the allowed locations definition parameter on the policy parameters tab of the initiative definition page.":::

   > [!NOTE]
   > In the case of some `strongType` parameters, the list of values cannot be automatically
   > determined. In these cases, an ellipsis appears to the right of the parameter row. Selecting it
   > opens the 'Parameter scope (&lt;parameter name&gt;)' page. On this page, select the
   > subscription to use for providing the value options. This parameter scope is only used during
   > creation of the initiative definition and has no impact on policy evaluation or the scope of
   > the initiative when assigned.

   Set the 'Allowed locations' _value type_ to 'Set value' and select 'East US 2' from the dropdown
   list. For the two instances of the _Add or replace a tag on resources_ policy definitions, set
   the **Tag Name** parameters to 'Env' and 'CostCenter and the **Tag Value** parameters to 'Test'
   and 'Lab' as shown below. Leave the others as 'Default value'. Using the same definition twice in
   the initiative but with different parameters, this configuration adds or replaces an 'Env' tag
   with the value 'Test' and a 'CostCenter' tag with the value of 'Lab' on resources in scope of the
   assignment.

   :::image type="content" source="../media/create-and-manage/initiative-definition-4.png" alt-text="Screenshot of the entered options for allowed values for the allowed locations definition parameter and values for both tag parameter sets on the policy parameters tab of the initiative definition page.":::

1. Select **Review + create** at the bottom of the page or at the top of the wizard.

1. Review the settings and select **Create**.

#### Create a policy initiative definition with Azure CLI

You can create a policy initiative definition using Azure CLI with the `az policy set-definition`
command. To create a policy initiative definition with an existing policy definition, use the
following example:

```azurecli-interactive
az policy set-definition create -n readOnlyStorage --definitions '[
        {
            "policyDefinitionId": "/subscriptions/mySubId/providers/Microsoft.Authorization/policyDefinitions/storagePolicy",
            "parameters": { "storageSku": { "value": "[parameters(\"requiredSku\")]" } }
        }
    ]' \
    --params '{ "requiredSku": { "type": "String" } }'
```

#### Create a policy initiative definition with Azure PowerShell

You can create a policy initiative definition using Azure PowerShell with the
`New-AzPolicySetDefinition` cmdlet. To create a policy initiative definition with an existing policy
definition, use the following policy initiative definition file as `VMPolicySet.json`:

```json
[
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/2a0e14a6-b0a6-4fab-991a-187a4f81c498",
        "parameters": {
            "tagName": {
                "value": "Business Unit"
            },
            "tagValue": {
                "value": "Finance"
            }
        }
    },
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/464dbb85-3d5f-4a1d-bb09-95a9b5dd19cf"
    }
]
```

```azurepowershell-interactive
New-AzPolicySetDefinition -Name 'VMPolicySetDefinition' -Metadata '{"category":"Virtual Machine"}' -PolicyDefinition C:\VMPolicySet.json
```

### Assign an initiative definition

1. Select **Definitions** under **Authoring** in the left side of the Azure Policy page.

1. Locate the **Get Secure** initiative definition you previously created and select it. Select
   **Assign** at the top of the page to open to the **Get Secure: Assign initiative** page.

   :::image type="content" source="../media/create-and-manage/assign-definition.png" alt-text="Screenshot of the 'Assign' button on the initiative definition page." border="false":::

   You can also select and hold (or right-click) on the selected row or select the ellipsis at the
   end of the row for a contextual menu. Then select **Assign**.

   :::image type="content" source="../media/create-and-manage/select-right-click.png" alt-text="Screenshot of the context menu for an initiative to select the Assign functionality." border="false":::

1. Fill out the **Get Secure: Assign Initiative** page by entering the following example
   information. You can use your own information.

   - Scope: The management group or subscription you saved the initiative to becomes the default.
     You can change scope to assign the initiative to a subscription or resource group within the
     save location.
   - Exclusions: Configure any resources within the scope to prevent the initiative assignment from
     being applied to them.
   - Initiative definition and Assignment name: Get Secure (pre-populated as name of initiative
     being assigned).
   - Description: This initiative assignment is tailored to enforce this group of policy
     definitions.
   - Policy enforcement: Leave as the default _Enabled_.
   - Assigned by: Automatically filled based on who is logged in. This field is optional, so custom
     values can be entered.

1. Select the **Parameters** tab at the top of the wizard. If you configured an initiative parameter
   in previous steps, set a value here.

1. Select the **Remediation** tab at the top of the wizard. Leave **Create a Managed Identity**
   unchecked. This box _must_ be checked when the policy or initiative being assigned includes a
   policy with the [deployIfNotExists](../concepts/effects.md#deployifnotexists) or
   [modify](../concepts/effects.md#modify) effects. As the policy used for this tutorial doesn't,
   leave it blank. For more information, see
   [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md)
   and
   [how remediation access control works](../how-to/remediate-resources.md#how-remediation-access-control-works).

1. Select the **Review + create** tab at the top of the wizard.

1. Review your selections, then select **Create** at the bottom of the page.

## Check initial compliance

1. Select **Compliance** in the left side of the Azure Policy page.

1. Locate the **Get Secure** initiative. It's likely still in _Compliance state_ of **Not started**.
   Select the initiative to get full details of the assignment.

   :::image type="content" source="../media/create-and-manage/compliance-status-not-started.png" alt-text="Screenshot of the Initiative compliance page showing assignment evaluations in a Not started state." border="false":::

1. Once the initiative assignment has been completed, the compliance page is updated with the
   _Compliance state_ of **Compliant**.

   :::image type="content" source="../media/create-and-manage/compliance-status-compliant.png" alt-text="Screenshot of the Initiative compliance page showing assignment evaluations complete and in a Compliant state." border="false":::

1. Selecting any policy on the initiative compliance page opens the compliance details page for that
   policy. This page provides details at the resource level for compliance.

## Remove a non-compliant or denied resource from the scope with an exclusion

After assigning a policy initiative to require a specific location, any resource created in a
different location is denied. In this section, you walk through resolving a denied request to create
a resource by creating an exclusion on a single resource group. The exclusion prevents enforcement
of the policy (or initiative) on that resource group. In the following example, any location is
allowed in the excluded resource group. An exclusion can apply to a subscription, a resource group,
or an individual resource.

> [!NOTE]
> A [policy exemption](../concepts/exemption-structure.md) can also be used skip the evaluation of a
> resource. For more information, see [Scope in Azure Policy](../concepts/scope.md).

Deployments prevented by an assigned policy or initiative can be viewed on the resource group
targeted by the deployment: Select **Deployments** in the left side of the page, then select the
**Deployment Name** of the failed deployment. The resource that was denied is listed with a status
of _Forbidden_. To determine the policy or initiative and assignment that denied the resource,
select **Failed. Click here for details ->** on the Deployment Overview page. A window opens on the
right side of the page with the error information. Under **Error Details** are the GUIDs of the
related policy objects.

:::image type="content" source="../media/create-and-manage/rg-deployment-denied.png" alt-text="Screenshot of a failed deployment that was denied by a policy assignment." border="false":::

On the Azure Policy page: Select **Compliance** in the left side of the page and select the **Get
Secure** policy initiative. On this page, there's an increase in the **Deny** count for blocked
resources. Under the **Events** tab are details about who tried to create or deploy the resource
that was denied by the policy definition.

:::image type="content" source="../media/create-and-manage/compliance-overview.png" alt-text="Screenshot of the Events tab and policy event details on the Initiative compliance page." border="false":::

In this example, Trent Baker, one of Contoso's Sr. Virtualization specialists, was doing required
work. We need to grant Trent a space for an exception. Create a new resource group,
**LocationsExcluded**, and next grant it an exception to this policy assignment.

### Update assignment with exclusion

1. Select **Assignments** under **Authoring** in the left side of the Azure Policy page.

1. Browse through all policy assignments and open the _Get Secure_ policy assignment.

1. Set the **Exclusion** by selecting the ellipsis and selecting the resource group to exclude,
   _LocationsExcluded_ in this example. Select **Add to Selected Scope** and then select **Save**.

   :::image type="content" source="../media/create-and-manage/request-exclusion.png" alt-text="Screenshot of the Exclusions option on the Initiative Assignment page to add an excluded resource group to the policy assignment." border="false":::

   > [!NOTE]
   > Depending on the policy definition and its effect, the exclusion could also be granted to
   > specific resources within a resource group inside the scope of the assignment. As a **Deny**
   > effect was used in this tutorial, it wouldn't make sense to set the exclusion on a specific
   > resource that already exists.

1. Select **Review + save** and then select **Save**.

In this section, you resolved the denied request by creating an exclusion on a single resource
group.

## Clean up resources

If you're done working with resources from this tutorial, use the following steps to delete any of
the policy assignments or definitions created above:

1. Select **Definitions** (or **Assignments** if you're trying to delete an assignment) under
   **Authoring** in the left side of the Azure Policy page.

1. Search for the new initiative or policy definition (or assignment) you want to remove.

1. Right-click the row or select the ellipses at the end of the definition (or assignment), and
   select **Delete definition** (or **Delete assignment**).

## Review

In this tutorial, you successfully accomplished the following tasks:

> [!div class="checklist"]
> - Assigned a policy to enforce a condition for resources you create in the future
> - Created and assign an initiative definition to track compliance for multiple resources
> - Resolved a non-compliant or denied resource
> - Implemented a new policy across an organization

## Next steps

To learn more about the structures of policy definitions, look at this article:

> [!div class="nextstepaction"]
> [Azure Policy definition structure](../concepts/definition-structure.md)
