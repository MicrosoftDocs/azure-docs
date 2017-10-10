---
title: Use Azure Policy to create and manage policies to enforce organizational compliance | Microsoft Docs 
description: Use Azure Policy to enforce standards, meet regulatory compliance and audit requirements, control costs, maintain security and performance consistency, and impose enterprise wide design principles.
services: azure-policy 
keywords: 
author: Jim-Parker
ms.author: jimpark
ms.date: 10/06/2017
ms.topic: tutorial
ms.service: azure-policy
ms.custom: mvc
---

# Create and manage policies to enforce compliance

Understanding how to create and manage policies in Azure is important for staying compliant with your corporate standards and service level agreements. In this tutorial, you'll learn to use Azure Policy to do some of the more common tasks related to creating, assigning and managing policies across your organization, such as:

> [!div class="checklist"]
> * Assign a policy to enforce a condition for resources you create in the future
> * Create and assign an initiative definition to track compliance for multiple resources
> * Resolve a non-compliant or denied resource
> * Implement a new policy across an organization

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Opt in to Azure Policy

Azure Policy is now available in Limited Preview, so you need to register to request access.

1. Go to Azure Policy at https://aka.ms/getpolicy and select **Sign Up** in the left pane.

   ![Search for policy](media/assign-policy-definition/sign-up.png)

2. Opt-in to Azure Policy by selecting the subscriptions in the **Subscription** list you would like to work with. Then select **Register**.

   Your subscription list includes all your Azure subscriptions.

   ![Opt-in to use Azure Policy](media/assign-policy-definition/preview-opt-in.png)

   Depending on demand, it may take up to a couple of days for us to accept your registration request. Once your request gets accepted, you will be notified via email that you can begin using the service.

## Assign a policy

The first step in enforcing compliance with Azure Policy is to assign a policy definition. A policy definition defines under what condition a policy is enforced, and what action to take. In this example, we assign a built-in policy definition called *Require SQL Server Version 12.0*, to enforce the condition that all SQL Server databases must be v12.0 to be compliant.

1. Launch the Azure Policy service in the Azure portal by searching for and selecting **Policy** in the left pane.

   ![Search for policy](media/assign-policy-definition/search-policy.png)

2. Select **Assignments** on the left pane of the Azure Policy page. An assignment is a policy that has been assigned to take place within a specific scope.
3. Select **Assign Policy** from the top of the **Assignments** pane.

   ![Assign a policy definition](media/create-manage-policy/select-assign-policy.png)

4. On the **Assign Policy** page, click ![Policy definition button](media/assign-policy-definition/definitions-button.png) next to **Policy** field to open the list of available definitions.

   ![Open available policy definitions](media/create-manage-policy/open-policy-definitions.png)

5. Select **Require SQL Server Version 12.0**.
   
   ![Locate a policy](media/create-manage-policy/select-available-definition.png)

6. Provide a display **Name** for the policy assignment. In this case, let’s use *Require SQL Server version 12.0*. You can also add an optional **Description**. The description provides details about how this policy assignment ensures all SQL servers created in this environment are version 12.0.
7. Change the pricing tier to **Standard** to ensure that the policy gets applied to existing resources.

   There are two pricing tiers within Azure Policy – *Free* and *Standard*. With the Free tier, you can only enforce policies on future resources, while with Standard, you can also enforce them on existing resources to better understand your compliance state. Because we are in Limited Preview, we have not yet released a pricing model, so you will not receive a bill for selecting *Standard*. To read more about pricing, look at: [Azure Policy pricing](https://acom-milestone-ignite.azurewebsites.net/pricing/details/azure-policy/).

8. Select the **Scope** - the subscription (or resource group) you previously registered when you opted into Azure Policy. A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups.

   For this example we are using this subscription - **Azure Analytics Capacity Dev**. Your subscription will differ.

10. Select **Assign**.

## Implement a new custom policy

Now that we've assigned the policy definition, we're going to create a new policy to save costs by ensuring that VMs created across your environment cannot be in the G series. This way, every time a user in your org tries to create VM in the G series, the request will get denied.

1. Select **Definition** under **Authoring** in the left pane.

   ![Definition under authoring](media/create-manage-policy/definition-under-authoring.png)

2. Select **+ Policy Definition**.
3. Enter the following:

   - The name of the policy definition - *Require VM SKUs smaller than the G series*
   - The description of what the policy definition is intended to do – This policy definition enforces that all VMs created in this scope have SKUs smaller than the G series to reduce cost.
   - The subscription in which the policy definition will live in – In this case, our policy definition will live in  **Advisor Analytics Capacity Dev**. Your subscription list will differ.
   - Write the json code with:
      - The policy parameters.
      - The policy rules/conditions, in this case – VM SKU size equal to G series
      - The policy effect, in this case – **Deny**.
   
   Here's what the json should look like

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

   To view samples of json code, look at this article  - [Resource policy overview](../azure-resource-manager/resource-manager-policy.md)
   
4. Select **Save**.

## Create and assign an initiative definition

With an initiative definition, you can group several policy definitions to achieve one overarching goal. You create an initiative definition to ensure that resources within the scope of the definition stay compliant with the policy definitions that make up the initiative definition.  See the [Azure Policy overview](./azure-policy-introduction.md) for more information on initiative definitions.

### Create an initiative definition

1. Select **Definitions** under **Authoring** on the left pane.

   ![Select definitions](media/create-manage-policy/select-definitions.png)

2. Select **Initiative Definition** at the top of the page, this selection takes you to the **Initiative Definition** form.
3. Enter the name and description of the initiative.

   In this example, we want to ensure that resources are in compliance with policy definitions about getting secure, the name of the initiative would be **Get Secure**, and the description would be: **This initiative has been created to handle all policy definitions associated with securing resources**.

   ![Initiative definition](media/create-manage-policy/initiative-definition.png)

4. Browse through the list of **Available Definitions** and select the policy definition(s) you would like to add to that initiative. For our **Get secure** initiative, add the following built in policy definitions:
   - Require SQL Server version 12.0
   - Monitor unprotected web applications in the security center.
   - Monitor permissive network across in Security Center.
   - Monitor possible app Whitelisting in Security Center.
   - Monitor unencrypted VM Disks in Security Center.

   ![Initiative definitions](media/create-manage-policy/initiative-definition-2.png)

   After selecting the policy definitions from the list you'll see it under **Policies and parameters**, as shown above.

5. Select **Create**.

### Assign an initiative definition

1. Go to the **Definitions** tab under **Authoring**.
2. Search for the **Get secure** initiative definition you created.
3. Select the initiative definition, and then select **Assign**.

   ![Assign a definition](media/create-manage-policy/assign-definition.png)

4. Fill out the **Assignment** form, by entering:
   - name: Get secure assignment
   - description: this initiative assignment is tailored towards enforcing this group of policy definitions in the **Azure Advisor Capacity Dev** subscription
   - pricing tier: Standard
   - scope you would like this assignment applied to: **Azure Advisor Capacity Dev**

5. Select **Assign**. 

## Resolve a non-compliant or denied resource

Following the example above, after assigning the policy definition to require SQL server version 12.0, a SQL server created with a different version would get denied. In this section, we’re walking through resolving a denied attempt to created a SQL server of a different version.

1. Select **Assignments** on the left pane.
2. Browse through all policy assignments and launch the *Require SQL Server version 12.0* assignment.
3. Request an exclusion for the resource groups in which you are trying to create the SQL server. In this case, we are excluding Microsoft.Sql/servers/databases: *baconandbeer/Cheetos* and *baconandbeer/Chorizo*.

   ![Request exclusion](media/create-manage-policy/request-exclusion.png)

   Other ways you could resolve a denied resource include: Reaching out to the contact associated with the policy if you have a strong justification for needing the SQL server created, and directly editing the policy if you have access to.

4. Select **Save**.

In this section, you resolved the denial of your attempt to create a SQL server with version 12.0, by requesting an exclusion to the resources.

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
> [Policy Definition Structure](../azure-resource-manager/resource-manager-policy.md#policy-definition-structure)
