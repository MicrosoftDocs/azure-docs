---
title: Use Azure Policy to create and manage policies to enforce organizational compliance | Microsoft Docs
description: Use Azure Policy to enforce standards, meet regulatory compliance and audit requirements, control costs, maintain security and performance consistency, and impose enterprise wide design principles.
services: azure-policy
keywords:
author: bandersmsft
ms.author: banders
ms.date: 04/19/2018
ms.topic: tutorial
ms.service: azure-policy
ms.custom: mvc
---

# Create and manage policies to enforce compliance

Understanding how to create and manage policies in Azure is important for staying compliant with your corporate standards and service level agreements. In this tutorial, you learn to use Azure Policy to do some of the more common tasks related to creating, assigning and managing policies across your organization, such as:

> [!div class="checklist"]
> * Assign a policy to enforce a condition for resources you create in the future
> * Create and assign an initiative definition to track compliance for multiple resources
> * Resolve a non-compliant or denied resource
> * Implement a new policy across an organization

If you would like to assign a policy to identify the current compliance state of your existing resources, the quickstart articles go over how to do so. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Assign a policy

The first step in enforcing compliance with Azure Policy is to assign a policy definition. A policy definition defines under what condition a policy is enforced, and what action to take. In this example, assign a built-in policy definition called *Require SQL Server Version 12.0*, to enforce the condition that all SQL Server databases must be v12.0 to be compliant.

1. Launch the Azure Policy service in the Azure portal by searching for and selecting **Policy** in the left pane.

   ![Search for policy](media/assign-policy-definition/search-policy.png)

2. Select **Assignments** on the left pane of the Azure Policy page. An assignment is a policy that has been assigned to take place within a specific scope.
3. Select **Assign Policy** from the top of the **Assignments** pane.

   ![Assign a policy definition](media/create-manage-policy/select-assign-policy.png)

4. On the **Assign Policy** page, click ![Policy definition button](media/assign-policy-definition/definitions-button.png) next to **Policy** field to open the list of available definitions. You can filter the policy definition **Type** to *BuiltIn* to view all and read their descriptions.

   ![Open available policy definitions](media/create-manage-policy/open-policy-definitions.png)

5. Select **Require SQL Server Version 12.0**. If you cannot find it right away, type **Require SQL Server Version 12.0** into the search box and then press ENTER.

   ![Locate a policy](media/create-manage-policy/select-available-definition.png)

6. The displayed **Name** is automatically populated, but you can change it. For this example, use *Require SQL Server version 12.0*. You can also add an optional **Description**. The description provides details about how this policy assignment ensures all SQL servers created in this environment are version 12.0.

7. Change the pricing tier to **Standard** to ensure that the policy gets applied to existing resources.

   There are two pricing tiers within Azure Policy – *Free* and *Standard*. With the Free tier, you can only enforce policies on future resources, while with Standard, you can also enforce them on existing resources to better understand your compliance state. Because Azure Policy is in Preview, there is not yet a released a pricing model, so you will not receive a bill for selecting *Standard*. To read more about pricing, look at: [Azure Policy pricing](https://azure.microsoft.com/pricing/details/azure-policy).

8. Select the **Scope** - the subscription (or resource group) you previously registered. A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups.

   This example uses the **Azure Analytics Capacity Dev** subscription. Your subscription will differ.

10. Select **Assign**.

## Implement a new custom policy

Now that you've assigned a built-in policy definition, you can do more with Azure Policy. Next, create a new custom policy to save costs by ensuring that VMs created in your environment cannot be in the G series. This way, every time a user in your organization tries to create VM in the G series, the request is denied.

1. Select **Definition** under **Authoring** in the left pane.

   ![Definition under authoring](media/create-manage-policy/definition-under-authoring.png)

2. Select **+ Policy Definition**.
3. Enter the following:

   - The name of the policy definition - *Require VM SKUs smaller than the G series*
   - The description of what the policy definition is intended to do – This policy definition enforces that all VMs created in this scope have SKUs smaller than the G series to reduce cost.
   - The subscription in which the policy definition resides. In this case, the policy definition resides in **Advisor Analytics Capacity Dev**. Your subscription list will differ.
   - Chose from existing options, or create a new category for this policy definition.
   - Copy the following json code and then update it for your needs with:
      - The policy parameters.
      - The policy rules/conditions, in this case – VM SKU size equal to G series
      - The policy effect, in this case – **Deny**.

    Here's what the json should look like. Paste your revised code into the Azure portal.

    ```json
{
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Compute/virtualMachines"
          },
          {
            "field": "Microsoft.Compute/virtualMachines/sku.name",
            "like": "Standard_G*"
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
}
    ```

    The value of the *field property* in the policy rule must be one of the following: Name, Type, Location, Tags, or an alias. For example, `"Microsoft.Compute/VirtualMachines/Size"`.

    To view more samples of json code, read the [Templates for Azure Policy](json-samples.md) article.

4. Select **Save**.

## Create a policy definition with REST API

You can create a policy with the REST API for Policy Definitions. The REST API enables you to create and delete policy definitions, and get information about existing definitions.
To create a policy definition, use the following example:

```
PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.authorization/policydefinitions/{policyDefinitionName}?api-version={api-version}

```
Include a request body similar to the following example:

```
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

Before proceeding with the PowerShell example, make sure you have installed the latest version of Azure PowerShell. Policy parameters were added in version 3.6.0. If you have an earlier version, the examples return an error indicating the parameter cannot be found.

You can create a policy definition using the `New-AzureRmPolicyDefinition` cmdlet.

To create a policy definition from a file, pass the path to the file. For an external file, use the following example:

```
$definition = New-AzureRmPolicyDefinition `
    -Name denyCoolTiering `
    -DisplayName "Deny cool access tiering for storage" `
    -Policy 'https://raw.githubusercontent.com/Azure/azure-policy-samples/master/samples/Storage/storage-account-access-tier/azurepolicy.rules.json'
```

For a local file use, use the following example:

```
$definition = New-AzureRmPolicyDefinition `
    -Name denyCoolTiering `
    -Description "Deny cool access tiering for storage" `
    -Policy "c:\policies\coolAccessTier.json"
```

To create a policy definition with an inline rule, use the following example:

```
$definition = New-AzureRmPolicyDefinition -Name denyCoolTiering -Description "Deny cool access tiering for storage" -Policy '{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "field": "kind",
        "equals": "BlobStorage"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/accessTier",
          "equals": "cool"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}'
```

The output is stored in a `$definition` object, which is used during policy assignment.
The following example creates a policy definition that includes parameters:

```
$policy = '{
    "if": {
        "allOf": [
            {
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

$definition = New-AzureRmPolicyDefinition -Name storageLocations -Description "Policy to specify locations for storage accounts." -Policy $policy -Parameter $parameters
```

## View policy definitions

To see all policy definitions in your subscription, use the following command:

```
Get-AzureRmPolicyDefinition
```

It returns all available policy definitions, including built-in policies. Each policy is returned in the following format:

```
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

You can create a policy definition using Azure CLI with the policy definition command.
To create a policy definition with an inline rule, use the following example:

```
az policy definition create --name denyCoolTiering --description "Deny cool access tiering for storage" --rules '{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "field": "kind",
        "equals": "BlobStorage"
      },
      {
        "not": {
          "field": "Microsoft.Storage/storageAccounts/accessTier",
          "equals": "cool"
        }
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}'
```

## View policy definitions

To see all policy definitions in your subscription, use the following command:

```
az policy definition list
```

It returns all available policy definitions, including built-in policies. Each policy is returned in the following format:

```
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

With an initiative definition, you can group several policy definitions to achieve one overarching goal. You create an initiative definition to ensure that resources within the scope of the definition stay compliant with the policy definitions that make up the initiative definition.  See the [Azure Policy overview](./azure-policy-introduction.md) for more information on initiative definitions.

### Create an initiative definition

1. Select **Definitions** under **Authoring** on the left pane.

   ![Select definitions](media/create-manage-policy/select-definitions.png)

2. Select **Initiative Definition** at the top of the page, this selection takes you to the **Initiative Definition** form.
3. Enter the name and description of the initiative.

   In this example, ensure that resources are in compliance with policy definitions about getting secure. So, the name of the initiative would be **Get Secure**, and the description would be: **This initiative has been created to handle all policy definitions associated with securing resources**.

   ![Initiative definition](media/create-manage-policy/initiative-definition.png)

4. Browse through the list of **Available Definitions** and select the policy definition(s) you would like to add to that initiative. For our **Get secure** initiative, **Add** the following built in policy definitions:
   - Require SQL Server version 12.0
   - Monitor unprotected web applications in Security Center.
   - Monitor permissive network across in Security Center.
   - Monitor possible app Whitelisting in Security Center.
   - Monitor unencrypted VM Disks in Security Center.

   ![Initiative definitions](media/create-manage-policy/initiative-definition-2.png)

   After selecting the policy definitions from the list you see it under **Policies and parameters**, as shown in the preceding image.

5. Use **Definition location** to select a subscription to store the definition. Select **Save**.

### Assign an initiative definition

1. Go to the **Definitions** tab under **Authoring**.
2. Search for the **Get secure** initiative definition you created.
3. Select the initiative definition, and then select **Assign**.

   ![Assign a definition](media/create-manage-policy/assign-definition.png)

4. Fill out the **Assignment** form, by entering the following example information. You can use your own information.
   - Name: Get secure assignment
   - Description: This initiative assignment is tailored to enforce this group of policy definitions in the **Azure Advisor Capacity Dev** subscription.
   - Pricing Tier: Standard
   - Scope where you would like this assignment applied to: **Azure Advisor Capacity Dev**. You can choose your own subscription and resource group.

5. Select **Assign**.

## Exempt a non-compliant or denied resource using Exclusion

Following the example above, after assigning the policy definition to require SQL server version 12.0, a SQL server created with any version other 12.0 would get denied. In this section, you walk through resolving a denied attempt to create a SQL server by requesting an exclusion for specific resources. The exclusion essentially prevents policy enforcement. In the following example, any SQL server version is allowed. An exclusion can apply to a resource group, or you can narrow the exclusion to individual resources.

1. Select **Assignments** on the left pane.
2. Browse through all policy assignments and open the *Require SQL Server version 12.0* assignment.
3. **Select** an exclusion for resources in the resource groups where you are trying to create the SQL server. In this example, exclude Microsoft.Sql/servers/databases: *azuremetrictest/testdb* and *azuremetrictest/testdb2*.

   ![Request exclusion](media/create-manage-policy/request-exclusion.png)

   Other ways you could resolve a denied resource include: Reaching out to the contact associated with the policy if you have a strong justification for needing the SQL server created, and directly editing the policy if you have access to.

4. Click **Assign**.

In this section, you resolved the denial of your attempt to create a SQL server, by requesting an exclusion to the resources.

## Clean up resources

If you plan to continue to work with subsequent tutorials, do not clean up the resources created in this guide. If you do not plan to continue, use the following steps to delete any of the assignments or definitions created above:

1. Select **Definitions** (or **Assignments** if you are trying to delete an assignment) on the left pane.
2. Search for the new initiative or policy definition (or assignment) you just created.
3. Select the ellipses on the end of the definition or assignment, and select **Delete Definition** (or **Delete Assignment**).

## Next steps

In this tutorial, you successfully accomplished the following:

> [!div class="checklist"]
> * Assigned a policy to enforce a condition for resources you create in the future
> * Created and assign an initiative definition to track compliance for multiple resources
> * Resolved a non-compliant or denied resource
> * Implemented a new policy across an organization

To learn more about the structures of policy definitions, look at this article:

> [!div class="nextstepaction"]
> [Azure Policy definition structure](policy-definition.md)
