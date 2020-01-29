---
title: Onboard a customer to Azure delegated resource management
description: Learn how to onboard a customer to Azure delegated resource management, allowing their resources to be accessed and managed through your own tenant.
ms.date: 01/20/2020
ms.topic: conceptual
---

# Onboard a customer to Azure delegated resource management

This article explains how you, as a service provider, can onboard a customer to Azure delegated resource management, allowing their delegated resources (subscriptions and/or resource groups) to be accessed and managed through your own Azure Active Directory (Azure AD) tenant. While we'll refer to service providers and customers here, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same process to consolidate their management experience.

You can repeat this process if you are managing resources for multiple customers. Then, when an authorized user signs in to your tenant, that user can be authorized across customer tenancy scopes to perform management operations without having to sign in to every individual customer tenant.

To track your impact across customer engagements and receive recognition, associate your Microsoft Partner Network (MPN) ID with your onboarded subscriptions. For more info, see [Link a partner ID to your Azure accounts](../../billing/billing-partner-admin-link-started.md). Note that you'll need to perform this association in your service provider tenant.

> [!NOTE]
> Customers can also be onboarded when they purchase a managed services offer (public or private) that you published to Azure Marketplace. For more info, see [Publish Managed Services offers to Azure Marketplace](publish-managed-services-offers.md). You can also use the onboarding process described here along with an offer published to Azure Marketplace.

The onboarding process requires actions to be taken from within both the service provider's tenant and from the customer's tenant. All of these steps are described in this article.

> [!IMPORTANT]
> Currently, you can’t onboard a subscription (or resource group within a subscription) for Azure delegated resource management if the subscription uses Azure Databricks. Similarly, if a subscription has been registered for onboarding with the **Microsoft.ManagedServices** resource provider, you won’t be able to create a Databricks workspace for that subscription at this time.

## Gather tenant and subscription details

To onboard a customer's tenant, it must have an active Azure subscription. You'll need to know the following:

- The tenant ID of the service provider's tenant (where you will be managing the customer's resources)
- The tenant ID of the customer's tenant (which will have resources managed by the service provider)
- The subscription IDs for each specific subscription in the customer's tenant that will be managed by the service provider (or that contains the resource group(s) that will be managed by the service provider).

> [!NOTE]
> Even if you only wish to onboard one or more resource groups within a subscription, the deployment must be done at the subscription level, so you'll need the subscription ID.

If you don't have these ID values already, you can retrieve them in one of the following ways. Be sure and use these exact values in your deployment.

### Azure portal

Your tenant ID can be seen by hovering over your account name on the upper right-hand side of the Azure portal, or by selecting **Switch directory**. To select and copy your tenant ID, search for "Azure Active Directory" from within the portal, then select **Properties** and copy the value shown in the **Directory ID** field. To find the ID of a subscription in the customer tenant, search for "Subscriptions" and then select the appropriate subscription ID.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

Select-AzSubscription <subscriptionId>
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az account set --subscription <subscriptionId/name>
az account show
```

> [!NOTE]
> When onboarding a subscription (or one or more resource groups within a subscription) using the process described here, the **Microsoft.ManagedServices** resource provider will be registered for that subscription.

## Define roles and permissions

As a service provider, you may want to perform multiple tasks for a single customer, requiring different access for different scopes. You can define as many authorizations as you need to assign [role-based access control (RBAC) built-in roles](../../role-based-access-control/built-in-roles.md) to users in your tenant.

To make management easier, we recommend using Azure AD user groups for each role, allowing you to add or remove individual users to the group rather than assigning permissions directly to that user. You may also want to assign roles to a service principal. Be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job. For recommendations and info about supported roles, see [Tenants, users, and roles in Azure Lighthouse scenarios](../concepts/tenants-users-roles.md).

In order to define authorizations, you'll need to know the ID values for each user, user group, or service principal in the service provider tenant to which you want to grant access. You'll also need the role definition ID for each built-in role you want to assign. If you don't have them already, you can retrieve them by running the commands below from within the service provider tenant.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# To retrieve the objectId for an Azure AD group
(Get-AzADGroup -DisplayName '<yourGroupName>').id

# To retrieve the objectId for an Azure AD user
(Get-AzADUser -UserPrincipalName '<yourUPN>').id

# To retrieve the objectId for an SPN
(Get-AzADApplication -DisplayName '<appDisplayName>').objectId

# To retrieve role definition IDs
(Get-AzRoleDefinition -Name '<roleName>').id
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# To retrieve the objectId for an Azure AD group
az ad group list --query "[?displayName == '<yourGroupName>'].objectId" --output tsv

# To retrieve the objectId for an Azure AD user
az ad user show --upn-or-object-id "<yourUPN>" –-query "objectId" --output tsv

# To retrieve the objectId for an SPN
az ad sp list --query "[?displayName == '<spDisplayName>'].objectId" --output tsv

# To retrieve role definition IDs
az role definition list --name "<roleName>" | grep name
```
> [!TIP]
> We recommend assigning the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when onboarding a customer, so that users in your tenant can [remove access to the delegation](#remove-access-to-a-delegation) later if needed. If this role is not assigned, delegated resources can only be removed by a user in the customer's tenant.

## Create an Azure Resource Manager template

To onboard your customer, you'll need to create an [Azure Resource Manager](../../azure-resource-manager/index.yml) template for your offer with the following information. The **mspOfferName** and **mspOfferDescription** values will be visible to the customer when viewing offer details in the [Service providers page](view-manage-service-providers.md) of the Azure portal.

|Field  |Definition  |
|---------|---------|
|**mspOfferName**     |A name describing this definition. This value is displayed to the customer as the title of the offer.         |
|**mspOfferDescription**     |A brief description of your offer (for example, "Contoso VM management offer").      |
|**managedByTenantId**     |Your tenant ID.          |
|**authorizations**     |The **principalId** values for the users/groups/SPNs from your tenant, each with a **principalIdDisplayName** to help your customer understand the purpose of the authorization, and mapped to a built-in **roleDefinitionId** value to specify the level of access.      |

> [!TIP]
> Be sure that your **managedByTenantID**, **principalIdDisplayName**, and **roleDefinitionId** entries are identical to the values used by Azure. Do not use any capital letters in these values.

The onboarding process requires an Azure Resource Manager template (provided in our [samples repo](https://github.com/Azure/Azure-Lighthouse-samples/) and a corresponding parameters file that you modify to match your configuration and define your authorizations.

The template you choose will depend on whether you are onboarding an entire subscription, a resource group, or multiple resource groups within a subscription. We also provide a template that can be used for customers who purchased a managed service offer that you published to Azure Marketplace, if you prefer to onboard their subscription(s) this way.

|To onboard this  |Use this Azure Resource Manager template  |And modify this parameter file |
|---------|---------|---------|
|Subscription   |[delegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management/delegatedResourceManagement.json)  |[delegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management/delegatedResourceManagement.parameters.json)    |
|Resource group   |[rgDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.json)  |[rgDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.parameters.json)    |
|Multiple resource groups within a subscription   |[multipleRgDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/multipleRgDelegatedResourceManagement.json)  |[multipleRgDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/multipleRgDelegatedResourceManagement.parameters.json)    |
|Subscription (when using an offer published to Azure Marketplace)   |[marketplaceDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.json)  |[marketplaceDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.parameters.json)    |

> [!IMPORTANT]
> The process described here requires a separate subscription-level deployment for each subscription being onboarded, even if you are onboarding subscriptions in the same customer tenant. Separate deployments are also required if you are onboarding multiple resource groups within different subscriptions in the same customer tenant. However, onboarding multiple resource groups within a single subscription can be done in one subscription-level deployment.
>
> Separate deployments are also required for multiple offers being applied to the same subscription (or resource groups within a subscription). Each offer applied must use a different **mspOfferName**.

The following example shows a modified **delegatedResourceManagement.parameters.json** file that can be used to onboard a subscription. The resource group parameter files (located in the [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management) folder) are similar, but also include an **rgName** parameter to identify the specific resource group(s) to be onboarded.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspOfferName": {
            "value": "Fabrikam Managed Services - Interstellar"
        },
        "mspOfferDescription": {
            "value": "Fabrikam Managed Services - Interstellar"
        },
        "managedByTenantId": {
            "value": "df4602a3-920c-435f-98c4-49ff031b9ef6"
        },
        "authorizations": {
            "value": [
                {
                    "principalId": "0019bcfb-6d35-48c1-a491-a701cf73b419",
                    "principalIdDisplayName": "Tier 1 Support",
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
                },
                {
                    "principalId": "0019bcfb-6d35-48c1-a491-a701cf73b419",
                    "principalIdDisplayName": "Tier 1 Support",
                    "roleDefinitionId": "36243c78-bf99-498c-9df9-86d9f8d28608"
                },
                {
                    "principalId": "0afd8497-7bff-4873-a7ff-b19a6b7b332c",
                    "principalIdDisplayName": "Tier 2 Support",
                    "roleDefinitionId": "acdd72a7-3385-48ef-bd42-f606fba81ae7"
                },
                {
                    "principalId": "9fe47fff-5655-4779-b726-2cf02b07c7c7",
                    "principalIdDisplayName": "Service Automation Account",
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
                },
                {
                    "principalId": "3kl47fff-5655-4779-b726-2cf02b05c7c4",
                    "principalIdDisplayName": "Policy Automation Account",
                    "roleDefinitionId": "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
                    "delegatedRoleDefinitionIds": [
                        "b24988ac-6180-42a0-ab88-20f7382dd24c",
                        "92aaf0da-9dab-42b6-94a3-d43ce8d16293"
                    ]
                }
            ]
        }
    }
}
```

The last authorization in the example above adds a **principalId** with the User Access Administrator role (18d7d88d-d35e-4fb5-a5c3-7773c20a72d9). When assigning this role, you must include the **delegatedRoleDefinitionIds** property and one or more built-in roles. The user created in this authorization will be able to assign these built-in roles to [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) in the customer tenant,  which is required in order to [deploy policies that can be remediated](deploy-policy-remediation.md). No other permissions normally associated with the User Access Administrator role will apply to this user.

## Deploy the Azure Resource Manager templates

Once you have updated your parameter file, a user in the customer's tenant must deploy the Azure Resource Manager template within their tenant as a subscription-level deployment. A separate deployment is needed for each subscription that you want to onboard to Azure delegated resource management (or for each subscription that contains resource groups that you want to onboard).

Because this is a subscription-level deployment, it cannot be initiated in the Azure portal. The deployment may be done by using PowerShell or Azure CLI, as shown below.

> [!IMPORTANT]
> This subscription-level deployment must be done by a non-guest account in the customer’s tenant who has the [Owner built-in role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) for the subscription being onboarded (or which contains the resource groups that are being onboarded). To see all users who can delegate the subscription, a user in the customer's tenant can select the subscription in the Azure portal, open **Access control (IAM)**, and [view all users with the Owner role](../../role-based-access-control/role-assignments-list-portal.md#list-owners-of-a-subscription).

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
New-AzDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateFile <pathToTemplateFile> `
                 -TemplateParameterFile <pathToParameterFile> `
                 -Verbose

# Deploy Azure Resource Manager template that is located externally
New-AzDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateUri <templateUri> `
                 -TemplateParameterUri <parameterUri> `
                 -Verbose
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
az deployment create --name <deploymentName> \
                     --location <AzureRegion> \
                     --template-file <pathToTemplateFile> \
                     --parameters <parameters/parameterFile> \
                     --verbose

# Deploy external Azure Resource Manager template, with local parameter file
az deployment create --name <deploymentName> \
                     --location <AzureRegion> \
                     --template-uri <templateUri> \
                     --parameters <parameterFile> \
                     --verbose
```

## Confirm successful onboarding

When a customer subscription has successfully been onboarded to Azure delegated resource management, users in the service provider's tenant will be able to see the subscription and its resources (if they have been granted access to it through the process above, either individually or as a member of an Azure AD group with the appropriate permissions). To confirm this, check to make sure the subscription appears in one of the following ways.  

### Azure portal

In the service provider's tenant:

1. Navigate to the [My customers page](view-manage-customers.md).
2. Select **Customers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

> [!IMPORTANT]
> In order to see the delegated subscription in [My customers](view-manage-customers.md), users in the service provider's tenant must have been granted the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) when the subscription was onboarded for Azure delegated resource management.

In the customer's tenant:

1. Navigate to the [Service providers page](view-manage-service-providers.md).
2. Select **Service provider offers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

> [!NOTE]
> It may take a few minutes after your deployment is complete before the updates are reflected in the Azure portal.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

Get-AzContext
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az account list
```

## Remove access to a delegation

By default, users in the customer's tenant who have the appropriate permissions can remove service provider access to delegated resources in the [Service providers page](view-manage-service-providers.md#add-or-remove-service-provider-offers) of the Azure portal. When they do so, no users in the service provider's tenant will be able to access the resources that had been previously delegated.

If you have onboarded users with the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when onboarding a customer for Azure delegated resource management, those users will also be able to remove the delegation.

The example below shows an assignment granting the **Managed Services Registration Assignment Delete Role** that can be included in a parameter file:

```json
    "authorizations": [ 
        { 
            "principalId": "cfa7496e-a619-4a14-a740-85c5ad2063bb", 
            "principalIdDisplayName": "MSP Operators", 
            "roleDefinitionId": "91c1777a-f3dc-4fae-b103-61d183457e46" 
        } 
    ] 
```

A user with this permission can remove a delegation in one of the following ways.

### Azure portal

1. Navigate to the [My customers page](view-manage-customers.md).
2. Select **Delegations**.
3. Find the delegation you want to remove, then select the trash can icon that appears in its row.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Sign in as a user from the managing tenant directory 

Login-AzAccount

# Select the subscription that is delegated - or contains the delegated resource group(s)

Select-AzSubscription -SubscriptionName "<subscriptionName>"

# Get the registration assignment

Get-AzManagedServicesAssignment -Scope "/subscriptions/{delegatedSubscriptionId}"

# Delete the registration assignment

Remove-AzManagedServicesAssignment -ResourceId "/subscriptions/{delegatedSubscriptionId}/providers/Microsoft.ManagedServices/registrationAssignments/{assignmentGuid}"
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Sign in as a user from the managing tenant directory

az login

# Select the subscription that is delegated – or contains the delegated resource group(s)

az account set -s <subscriptionId/name>

# List registration assignments

az managedservices assignment list

# Delete the registration assignment

az managedservices assignment delete --assignment <id or full resourceId>
```

## Next steps

- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
