---
title: Onboard a customer to Azure delegated resource management - Azure Lighthouse
description: Learn how to onboard a customer to Azure delegated resource management, allowing their resources to be accessed and managed through your own tenant. 
author: JnHs
ms.author: jenhayes
ms.service: lighthouse
ms.date: 07/11/2019
ms.topic: overview
manager: carmonm
---

# Onboard a customer to Azure delegated resource management

This article explains how you, as a service provider, can onboard a customer to Azure delegated resource management, allowing their delegated resources (subscriptions and/or resource groups) to be accessed and managed through your own Azure Active Directory (Azure AD) tenant. While we'll refer to service providers and customers here, enterprises managing multiple tenants can use the same process to consolidate their management experience.

You can repeat this process if you are managing resources for multiple customers. Then, when an authorized user signs in to your tenant, that user can be authorized across customer tenancy scopes to perform management operations without having to sign in to every individual customer tenant.

You can associate your Microsoft Partner Network (MPN) ID with your onboarded subscriptions to track your impact across customer engagements. For more info, see [Link a partner ID to your Azure accounts](https://docs.microsoft.com/azure/billing/billing-partner-admin-link-started).

> [!NOTE]
> Customers can be onboarded automatically when they purchase a managed services offer (public or private) that you published to Azure Marketplace. For more info, see [Publish Managed Services offers to Azure Marketplace](publish-managed-services-offers.md). You can also use the onboarding process described here with an offer published to Azure Marketplace.

The onboarding process requires actions to be taken from within both the service provider's tenant and from the customer's tenant. All of these steps are described in this article.

> [!IMPORTANT]
> Currently, you can’t onboard a subscription (or resource group within a subscription) for Azure delegated resource management if the subscription uses Azure Databricks. Similarly, if a subscription has been registered for onboarding with the **Microsoft.ManagedServices** resource provider, you won’t be able to create a Databricks workspace for that subscription at this time.

## Gather tenant and subscription details

To onboard a customer's tenant, it must have an active Azure subscription. You'll need to know the following:

- The tenant ID of the service provider's tenant (where you will be managing the customer's resources)
- The tenant ID of the customer's tenant (which will have resources managed by the service provider)
- The subscription IDs for each specific subscription in the customer's tenant that will be managed by the service provider (or that contains the resource group(s) that will be managed by the service provider)

If you don't have this info already, you can retrieve it in one of the following ways.

### Azure portal

Your tenant ID can be seen by hovering over your account name on the upper right-hand side of the Azure portal, or by selecting **Switch directory**. To select and copy your tenant ID, search for "Azure Active Directory" from within the portal, then select **Properties** and copy the value shown in the **Directory ID** field. To find the ID of a subscription, search for "Subscriptions" and then select the appropriate subscription ID.

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


## Ensure the customer's subscription is registered for onboarding

Each subscription must be authorized for onboarding by manually registering the **Microsoft.ManagedServices** resource provider. The customer can register a subscription by following the steps outlined in [Azure resource providers and types](../../azure-resource-manager/resource-manager-supported-services.md).

The customer can confirm that the subscription is ready for onboarding in one of the following ways.

### Azure portal

1. In the Azure portal, select the subscription.
1. Select **Resource providers**.
1. Confirm that **Microsoft.ManagedServices** shows as **Registered**.

### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

Set-AzContext -Subscription <subscriptionId>
Get-AzResourceProvider -ProviderNameSpace 'Microsoft.ManagedServices'
```

This should return results similar to the following:

```output
ProviderNamespace : Microsoft.ManagedServices
RegistrationState : Registered
ResourceTypes     : {registrationDefinitions}
Locations         : {}

ProviderNamespace : Microsoft.ManagedServices
RegistrationState : Registered
ResourceTypes     : {registrationAssignments}
Locations         : {}

ProviderNamespace : Microsoft.ManagedServices
RegistrationState : Registered
ResourceTypes     : {operations}
Locations         : {}
```

### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az account set –subscription <subscriptionId>
az provider show –namespace "Microsoft.ManagedServices" –-output table
```

This should return results similar to the following:

```output
Namespace                  RegistrationState
-------------------------  -------------------
Microsoft.ManagedServices  Registered
```

## Define roles and permissions

As a service provider, you may want to use multiple offers with a single customer, requiring different access for different scopes.

To make management easier, we recommend using Azure AD user groups for each role, allowing you to add or remove individual users to the group rather than assigning permissions directly to that user. You may also want to assign roles to a service principal. Be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job, helping to reduce the chance of inadvertent errors. For more info, see [Recommended security practices](../concepts/recommended-security-practices.md).

> [!NOTE]
> Role assignments must use role-based access control (RBAC) [built-in roles](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles). All built-in roles are currently supported with Azure delegated resource management except for Owner and any built-in roles with [DataActions](https://docs.microsoft.com/azure/role-based-access-control/role-definitions#dataactions) permission. The User Access Administrator built-in role is supported for limited use as described below. Custom roles and [classic subscription administrator roles](https://docs.microsoft.com/azure/role-based-access-control/classic-administrators) are also not supported.

In order to define authorizations, you'll need to know the ID values for each user, user group, or service principal to which you want to grant access. You'll also need the role definition ID for each built-in role you want to assign. If you don't have them already, you can retrieve them in one of the following ways.



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
az ad group list –-query "[?displayName == '<yourGroupName>'].objectId" –-output tsv

# To retrieve the objectId for an Azure AD user
az ad user show –-upn-or-object-id "<yourUPN>" –-query "objectId" –-output tsv

# To retrieve the objectId for an SPN
az ad sp list –-query "[?displayName == '<spDisplayName>'].objectId" –-output tsv

# To retrieve role definition IDs
az role definition list –-name "<roleName>" | grep name
```

## Create an Azure Resource Manager template

To onboard your customer, you'll need to create an [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/) template that includes the following:

|Field  |Definition  |
|---------|---------|
|**mspName**     |Service provider name         |
|**mspOfferDescription**     |A brief description of your offer (for example, "Contoso VM management offer")      |
|**managedByTenantId**     |Your tenant ID         |
|**authorizations**     |The **principalId** values for the users/groups/SPNs from your tenant, each with a **principalIdDisplayName** to help your customer understand the purpose of the authorization and mapped to a built-in **roleDefinitionId** value to specify the level of access         |

To onboard a customer's subscription, use the appropriate Azure Resource Manager template that we provide in our [samples repo](https://github.com/Azure/Azure-Lighthouse-samples/), along with a corresponding parameters file that you modify to match your configuration and define your authorizations. Separate templates are provided depending on whether you are onboarding an entire subscription, a resource group, or multiple resource groups within a subscription. We also provide a template that can be used for customers who purchased a managed service offer that you published to Azure Marketplace, if you prefer to onboard their subscription(s) this way.

|**To onboard this**  |**Use this Azure Resource Manager template**  |**And modify this parameter file** |
|---------|---------|---------|
|Subscription   |[delegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management/delegatedResourceManagement.json)  |[delegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/delegated-resource-management/delegatedResourceManagement.parameters.json)    |
|Resource group   |[rgDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.json)  |[rgDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.parameters.json)    |
|Multiple resource groups within a subscription   |[multipleRgDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/multipleRgDelegatedResourceManagement.json)  |[multipleRgDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/multipleRgDelegatedResourceManagement.parameters.json)    |
|Subscription (when using an offer published to Azure Marketplace)   |[marketplaceDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.json)  |[marketplaceDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/Azure-Delegated-Resource-Management/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.parameters.json)    |

> [!IMPORTANT]
> The process described here requires a separate deployment for each subscription being onboarded.
> 
> Separate deployments are also required if you are onboarding multiple resource groups within different subscriptions. However, onboarding multiple resource groups within a single subscription can be done in one deployment.

The following example shows a modified **resourceProjection.parameters.json** file that will be used to onboard a subscription. The resource group parameter files (located in the [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management) folder) are similar, but also include an **rgName** parameter to identify the specific resource group(s) to be onboarded.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspName": {
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
The last authorization in the example above adds a **principalId** with the User Access Administrator role (18d7d88d-d35e-4fb5-a5c3-7773c20a72d9). When assigning this role, you must include the **delegatedRoleDefinitionIds** property and one or more built-in roles. The user created in this authorization will be able to assign these built-in roles to managed identities. Note that no other permissions normally associated with the User Access Administrator role will apply to this user.

## Deploy the Azure Resource Manager templates

Once you have updated your parameter file, the customer must deploy the Resource Management template in their customer's tenant as a subscription-level deployment. A separate deployment is needed for each subscription that you want to onboard to Azure delegated resource management (or for each subscription that contains resource groups that you want to onboard).

> [!IMPORTANT]
> The deployment must be done by a non-guest account in the customer’s tenant which has the [Owner built-in role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) for the subscription being onboarded (or which contains the resource groups that are being onboarded).

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
az deployment create –-name <deploymentName> \
                     --location <AzureRegion> \
                     --template-file <pathToTemplateFile> \
                     --parameters <parameters/parameterFile> \
                     --verbose

# Deploy external Azure Resource Manager template, with local parameter file
az deployment create –-name <deploymentName \
                     –-location <AzureRegion> \
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

## Next steps

- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
