---
title: Onboard a customer to Azure Lighthouse
description: Learn how to onboard a customer to Azure Lighthouse, allowing their resources to be accessed and managed by users in your tenant.
ms.date: 05/04/2023
ms.topic: how-to 
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
---

# Onboard a customer to Azure Lighthouse

This article explains how you, as a service provider, can onboard a customer to Azure Lighthouse. When you do so, delegated resources (subscriptions and/or resource groups) in the customer's Microsoft Entra tenant can be managed by users in your tenant through [Azure delegated resource management](../concepts/architecture.md).

> [!TIP]
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same process to set up Azure Lighthouse and consolidate their management experience.

You can repeat the onboarding process for multiple customers. When a user with the appropriate permissions signs in to your managing tenant, that user is authorized to perform management operations across customer tenancy scopes, without having to sign in to each individual customer tenant.

> [!NOTE]
> Customers can alternately be onboarded to Azure Lighthouse when they purchase a Managed Service offer (public or private) that you [publish to Azure Marketplace](publish-managed-services-offers.md). You can also use the onboarding process described here in conjunction with offers published to Azure Marketplace.

The onboarding process requires actions to be taken from within both the service provider's tenant and from the customer's tenant. All of these steps are described in this article.

## Gather tenant and subscription details

To onboard a customer's tenant, it must have an active Azure subscription. When you [create a template manually](#create-your-template-manually), you'll need to know the following:

- The tenant ID of the service provider's tenant (where you will be managing the customer's resources). 
- The tenant ID of the customer's tenant (which will have resources managed by the service provider).
- The subscription IDs for each specific subscription in the customer's tenant that will be managed by the service provider (or that contains the resource group(s) that will be managed by the service provider).

If you don't know the ID for a tenant, you can [retrieve it by using the Azure portal, Azure PowerShell, or Azure CLI](/azure/active-directory/fundamentals/how-to-find-tenant).

If you [create your template in the Azure portal](#create-your-template-in-the-azure-portal), your tenant ID is provided automatically. You don't need to know the customer's tenant or subscription details in order to create your template in the Azure portal. However, if you plan to onboard one or more resource groups in the customer's tenant (rather than the entire subscription), you'll need to know the names of each resource group.

## Define roles and permissions

As a service provider, you may want to perform multiple tasks for a single customer, requiring different access for different scopes. You can define as many authorizations as you need in order to assign the appropriate [Azure built-in roles](../../role-based-access-control/built-in-roles.md). Each authorization includes a `principalId` which refers to a Microsoft Entra user, group, or service principal in the managing tenant.

> [!NOTE]
> Unless explicitly specified, references to a "user" in the Azure Lighthouse documentation can apply to a Microsoft Entra user, group, or service principal in an authorization.

To define authorizations in your template, you must include the ID values for each user, user group, or service principal in the managing tenant to which you want to grant access. You'll also need to include the role definition ID for each [built-in role](../../role-based-access-control/built-in-roles.md) you want to assign. When you [create your template in the Azure portal](#create-your-template-in-the-azure-portal), you can select the user account and role, and these ID values will be added automatically. If you are [creating a template manually](#create-your-template-manually), you can [retrieve user IDs by using the Azure portal, Azure PowerShell, or Azure CLI](../../role-based-access-control/role-assignments-template.md#get-object-ids) from within the managing tenant.

> [!TIP]
> We recommend assigning the [Managed Services Registration Assignment Delete Role](../../role-based-access-control/built-in-roles.md#managed-services-registration-assignment-delete-role) when onboarding a customer, so that users in your tenant can [remove access to the delegation](remove-delegation.md) later if needed. If this role is not assigned, delegated resources can only be removed by a user in the customer's tenant.

Whenever possible, we recommend using Microsoft Entra user groups for each assignment whenever possible, rather than individual users. This gives you the flexibility to add or remove individual users to the group that has access, so that you don't have to repeat the onboarding process to make user changes. You can also assign roles to a service principal, which can be useful for automation scenarios.

> [!IMPORTANT]
> In order to add permissions for a Microsoft Entra group, the **Group type** must be set to **Security**. This option is selected when the group is created. For more information, see [Create a basic group and add members using Microsoft Entra ID](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

When defining your authorizations, be sure to follow the principle of least privilege so that users only have the permissions needed to complete their job. For information about supported roles and best practices, see [Tenants, users, and roles in Azure Lighthouse scenarios](../concepts/tenants-users-roles.md).

To track your impact across customer engagements and receive recognition, associate your Microsoft Cloud Partner Program ID with at least one user account that has access to each of your onboarded subscriptions. You'll need to perform this association in your service provider tenant. We recommend creating a service principal account in your tenant that is associated with your partner ID, then including that service principal every time you onboard a customer. For more info, see [Link your partner ID to enable partner earned credit on delegated resources](partner-earned-credit.md).

> [!TIP]
> You can also create *eligible authorizations* that let users in your managing tenant temporarily elevate their role. This feature has specific licensing requirements. For more information, see [Create eligible authorizations](create-eligible-authorizations.md).

## Create an Azure Resource Manager template

To onboard your customer, you'll need to create an [Azure Resource Manager](../../azure-resource-manager/index.yml) template for your offer with the following information. The `mspOfferName` and `mspOfferDescription` values will be visible to the customer in the [Service providers page](view-manage-service-providers.md) of the Azure portal once the template is deployed in the customer's tenant.

|Field  |Definition  |
|---------|---------|
|`mspOfferName`     |A name describing this definition. This value is displayed to the customer as the title of the offer and must be a unique value.        |
|`mspOfferDescription`     |A brief description of your offer (for example, "Contoso VM management offer"). This field is optional, but recommended so that customers have a clear understanding of your offer.   |
|`managedByTenantId`     |Your tenant ID.          |
|`authorizations`     |The `principalId` values for the users/groups/SPNs from your tenant, each with a `principalIdDisplayName` to help your customer understand the purpose of the authorization, and mapped to a built-in `roleDefinitionId` value to specify the level of access.      |

You can create this template in the Azure portal, or by manually modifying the templates provided in our [samples repo](https://github.com/Azure/Azure-Lighthouse-samples/).

> [!IMPORTANT]
> The process described here requires a separate deployment for each subscription being onboarded, even if you are onboarding subscriptions in the same customer tenant. Separate deployments are also required if you are onboarding multiple resource groups within different subscriptions in the same customer tenant. However, onboarding multiple resource groups within a single subscription can be done in one deployment.
>
> Separate deployments are also required for multiple offers being applied to the same subscription (or resource groups within a subscription). Each offer applied must use a different `mspOfferName`.

### Create your template in the Azure portal

To create your template in the Azure portal, go to **My customers** and then select **Create ARM Template** from the overview page.

On the **Create ARM Template offer** Page, provide your **Name** and an optional **Description**. These values will be used for the `mspOfferName` and `mspOfferDescription` in your template, and they may be visible to your customer. The `managedByTenantId` value will be provided automatically, based on the Microsoft Entra tenant to which you are logged in.

Next, select either **Subscription** or **Resource group**, depending on the customer scope you want to onboard. If you select **Resource group**, you'll need to provide the name of the resource group to onboard. You can select the **+** icon to add additional resource groups in the same subscription if needed. (To onboard additional resource groups in a different subscription, you must create and deploy a separate template for that subscription.)

Finally, create your authorizations by selecting **+ Add authorization**. For each of your authorizations, provide the following details:

1. Select the **Principal type** depending on the type of account you want to include in the authorization. This can be either **User**, **Group**, or **Service principal**. In this example, we'll choose **User**.
1. Select the **+ Select user** link to open the selection pane. You can use the search field to find the user you'd like to add. Once you've done so, click **Select**. The user's **Principal ID** will be automatically populated.
1. Review the **Display name** field (populated based on the user you selected) and make changes, if desired.
1. Select the **Role** to assign to this user.
1. For **Access** type, select **Permanent** or **Eligible**. If you choose **Eligible**, you will need to specify options for maximum duration, multifactor authentication, and whether or not approval is required. For more information about these options, see [Create eligible authorizations](create-eligible-authorizations.md). The eligible authorizations feature can't be used with service principals.
1. Select **Add** to create your authorization.

:::image type="content" source="../media/add-authorization.png" alt-text="Screenshot of the Add authorization section in the Azure portal.":::

After you select **Add**, you'll return to the **Create ARM Template offer** screen. You can select **+ Add authorization** again to add as many authorizations as needed.

When you've added all of your authorizations, select **View template**. On this screen, you'll see a .json file that corresponds to the values you entered. Select **Download** to save a copy of this .json file. This template can then be [deployed in the customer's tenant](#deploy-the-azure-resource-manager-template). You can also edit it manually if you need to make any changes.

> [!IMPORTANT]
> The generated template file is not stored in the Azure portal. Be sure to download a copy before you navigate away from the **Show template** screen.

### Create your template manually

You can create your template by using an Azure Resource Manager template (provided in our [samples repo](https://github.com/Azure/Azure-Lighthouse-samples/)) and a corresponding parameter file that you modify to match your configuration and define your authorizations. If you prefer, you can include all of the information directly in the template, rather than using a separate parameter file.

The template you choose will depend on whether you are onboarding an entire subscription, a resource group, or multiple resource groups within a subscription. We also provide a template that can be used for customers who purchased a managed service offer that you published to Azure Marketplace, if you prefer to onboard their subscription(s) this way.

|To onboard this  |Use this Azure Resource Manager template  |And modify this parameter file |
|---------|---------|---------|
|Subscription   |[subscription.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/subscription/subscription.json)  |[subscription.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/subscription/subscription.parameters.json)    |
|Resource group   |[rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/rg/rg.json)  |[rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/rg/rg.parameters.json)    |
|Multiple resource groups within a subscription   |[multi-rg.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/rg/multi-rg.json)  |[multiple-rg.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/delegated-resource-management/rg/multiple-rg.parameters.json)    |
|Subscription (when using an offer published to Azure Marketplace)   |[marketplaceDelegatedResourceManagement.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.json)  |[marketplaceDelegatedResourceManagement.parameters.json](https://github.com/Azure/Azure-Lighthouse-samples/blob/master/templates/marketplace-delegated-resource-management/marketplaceDelegatedResourceManagement.parameters.json)    |

If you want to include [eligible authorizations](create-eligible-authorizations.md#create-eligible-authorizations-using-azure-resource-manager-templates), select the corresponding template from the [delegated-resource-management-eligible-authorizations section of our samples repo](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management-eligible-authorizations).

> [!TIP]
> While you can't onboard an entire management group in one deployment, you can deploy a policy to [onboard each subscription in a management group](onboard-management-group.md). You'll then have access to all of the subscriptions in the management group, although you'll have to work on them as individual subscriptions (rather than taking actions on the management group resource directly).

The following example shows a modified **subscription.parameters.json** file that can be used to onboard a subscription. The resource group parameter files (located in the [rg-delegated-resource-management](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/delegated-resource-management/rg) folder) have a similar format, but they also include an `rgName` parameter to identify the specific resource group(s) to be onboarded.

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
            "value": "00000000-0000-0000-0000-000000000000"
        },
        "authorizations": {
            "value": [
                {
                    "principalId": "00000000-0000-0000-0000-000000000000",
                    "principalIdDisplayName": "Tier 1 Support",
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
                },
                {
                    "principalId": "00000000-0000-0000-0000-000000000000",
                    "principalIdDisplayName": "Tier 1 Support",
                    "roleDefinitionId": "36243c78-bf99-498c-9df9-86d9f8d28608"
                },
                {
                    "principalId": "00000000-0000-0000-0000-000000000000",
                    "principalIdDisplayName": "Tier 2 Support",
                    "roleDefinitionId": "acdd72a7-3385-48ef-bd42-f606fba81ae7"
                },
                {
                    "principalId": "00000000-0000-0000-0000-000000000000",
                    "principalIdDisplayName": "Service Automation Account",
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
                },
                {
                    "principalId": "00000000-0000-0000-0000-000000000000",
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

The last authorization in the example above adds a `principalId` with the User Access Administrator role (18d7d88d-d35e-4fb5-a5c3-7773c20a72d9). When assigning this role, you must include the `delegatedRoleDefinitionIds` property and one or more supported Azure built-in roles. The user created in this authorization will be able to assign these roles to [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) in the customer tenant, which is required in order to [deploy policies that can be remediated](deploy-policy-remediation.md). The user is also able to create support incidents. No other permissions normally associated with the User Access Administrator role will apply to this `principalId`.

## Deploy the Azure Resource Manager template

Once you have created your template, a user in the customer's tenant must deploy it within their tenant. A separate deployment is needed for each subscription that you want to onboard (or for each subscription that contains resource groups that you want to onboard).

When onboarding a subscription (or one or more resource groups within a subscription) using the process described here, the **Microsoft.ManagedServices** resource provider will be registered for that subscription.

> [!IMPORTANT]
> This deployment must be done by a non-guest account in the customer's tenant who has a role with the `Microsoft.Authorization/roleAssignments/write` permission, such as [Owner](../../role-based-access-control/built-in-roles.md#owner), for the subscription being onboarded (or which contains the resource groups that are being onboarded). To find users who can delegate the subscription, a user in the customer's tenant can select the subscription in the Azure portal, open **Access control (IAM)**, and [view all users with the Owner role](../../role-based-access-control/role-assignments-list-portal.md#list-owners-of-a-subscription).
>
> If the subscription was created through the [Cloud Solution Provider (CSP) program](../concepts/cloud-solution-provider.md), any user who has the [Admin Agent](/partner-center/permissions-overview#manage-commercial-transactions-in-partner-center-azure-ad-and-csp-roles) role in your service provider tenant can perform the deployment.

The deployment may be done by using PowerShell, by using Azure CLI, or in the Azure portal, as shown below.

### Deploy by using PowerShell

To deploy a single template:

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
New-AzSubscriptionDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateFile <pathToTemplateFile> `
                 -Verbose

# Deploy Azure Resource Manager template that is located externally
New-AzSubscriptionDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateUri <templateUri> `
                 -Verbose
```

To deploy a template with a separate parameter file:

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
New-AzSubscriptionDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateFile <pathToTemplateFile> `
                 -TemplateParameterFile <pathToParameterFile> `
                 -Verbose

# Deploy Azure Resource Manager template that is located externally
New-AzSubscriptionDeployment -Name <deploymentName> `
                 -Location <AzureRegion> `
                 -TemplateUri <templateUri> `
                 -TemplateParameterUri <parameterUri> `
                 -Verbose
```

### Deploy by using Azure CLI

To deploy a single template:

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
az deployment sub create --name <deploymentName> \
                         --location <AzureRegion> \
                         --template-file <pathToTemplateFile> \
                         --verbose

# Deploy external Azure Resource Manager template, with local parameter file
az deployment sub create --name <deploymentName> \
                         --location <AzureRegion> \
                         --template-uri <templateUri> \
                         --verbose
```

To deploy a template with a separate parameter file:

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Deploy Azure Resource Manager template using template and parameter file locally
az deployment sub create --name <deploymentName> \
                         --location <AzureRegion> \
                         --template-file <pathToTemplateFile> \
                         --parameters <parameters/parameterFile> \
                         --verbose

# Deploy external Azure Resource Manager template, with local parameter file
az deployment sub create --name <deploymentName> \
                         --location <AzureRegion> \
                         --template-uri <templateUri> \
                         --parameters <parameterFile> \
                         --verbose
```

### Deploy in the Azure portal

To deploy a template in the Azure portal, follow the process described below. These steps must be done by a user in the customer tenant with the **Owner** role (or another role with the `Microsoft.Authorization/roleAssignments/write` permission).

1. From the [Service providers](view-manage-service-providers.md) page in the Azure portal, select **Server provider offers**.
1. Near the top of the screen, select the arrow next to **Add offer**, and then select **Add via template**.

   :::image type="content" source="../media/add-offer-via-template.png" alt-text="Screenshot showing the Add via template option in the Azure portal.":::

1. Upload the template by dragging and dropping it, or select **Browse for files** to find and upload the template.
1. If applicable, select the **I have a separate parameter file** box, then upload your parameter file.
1. After you've uploaded your template (and parameter file if needed), select **Upload**.
1. In the **Custom deployment** screen, review the details that appear. If needed, you can make changes to these values in this screen, or by selecting **Edit parameters**. 
1. Select **Review and create**, then select **Create**.

After a few minutes, you should see a notification that the deployment has completed.

> [!TIP]
> Alternately, from our [GitHub repo](https://github.com/Azure/Azure-Lighthouse-samples/), select the **Deploy to Azure** button shown next to the template you want to use (in the **Auto-deploy** column). The example template will open in the Azure portal. If you use this process, you must update the values for **Msp Offer Name**, **Msp Offer Description**, **Managed by Tenant Id**, and **Authorizations** before you select **Review and create**.

## Confirm successful onboarding

When a customer subscription has successfully been onboarded to Azure Lighthouse, users in the service provider's tenant will be able to see the subscription and its resources (if they have been granted access to it through the process above, either individually or as a member of a Microsoft Entra group with the appropriate permissions). To confirm this, check to make sure the subscription appears in one of the following ways.  

### Confirm in the Azure portal

In the service provider's tenant:

1. Navigate to the [My customers page](view-manage-customers.md).
2. Select **Customers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

> [!IMPORTANT]
> In order to see the delegated subscription in [My customers](view-manage-customers.md), users in the service provider's tenant must have been granted the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) when the subscription was onboarded.

In the customer's tenant:

1. Navigate to the [Service providers page](view-manage-service-providers.md).
2. Select **Service provider offers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

> [!NOTE]
> It may take up to 15 minutes after your deployment is complete before the updates are reflected in the Azure portal. You may be able to see the updates sooner if you update your Azure Resource Manager token by refreshing the browser, signing in and out, or requesting a new token.

### Confirm by using PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

Get-AzContext

# Confirm successful onboarding for Azure Lighthouse

Get-AzManagedServicesDefinition
Get-AzManagedServicesAssignment
```

### Confirm by using Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az account list

# Confirm successful onboarding for Azure Lighthouse

az managedservices definition list
az managedservices assignment list
```

If you need to make changes after the customer has been onboarded, you can [update the delegation](update-delegation.md). You can also [remove access to the delegation](remove-delegation.md) completely.

## Troubleshooting

If you are unable to successfully onboard your customer, or if your users have trouble accessing the delegated resources, check the following tips and requirements and try again.

- Users who need to view customer resources in the Azure portal must have been granted the [Reader](../../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) during the onboarding process.
- The `managedbyTenantId` value must not be the same as the tenant ID for the subscription being onboarded.
- You can't have multiple assignments at the same scope with the same `mspOfferName`.
- The **Microsoft.ManagedServices** resource provider must be registered for the delegated subscription. This should happen automatically during the deployment but if not, you can [register it manually](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).
- Authorizations must not include any users with the [Owner](../../role-based-access-control/built-in-roles.md#owner) role, any roles with [DataActions](../../role-based-access-control/role-definitions.md#dataactions), or any roles that include [restricted actions](../concepts/tenants-users-roles.md#role-support-for-azure-lighthouse).
- Groups must be created with [**Group type**](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md#group-types) set to **Security** and not **Microsoft 365**.
- If access was granted to a group, check to make sure the user is a member of that group. If they aren't, you can [add them to the group using Microsoft Entra ID](../../active-directory/fundamentals/active-directory-groups-members-azure-portal.md), without having to perform another deployment. Note that [group owners](../../active-directory/fundamentals/active-directory-accessmanagement-managing-group-owners.md) are not necessarily members of the groups they manage, and may need to be added in order to have access.
- There may be an additional delay before access is enabled for [nested groups](../..//active-directory/fundamentals/active-directory-groups-membership-azure-portal.md).
- The [Azure built-in roles](../../role-based-access-control/built-in-roles.md) that you include in authorizations must not include any deprecated roles. If an Azure built-in role becomes deprecated, any users who were onboarded with that role will lose access, and you won't be able to onboard additional delegations. To fix this, update your template to use only supported built-in roles, then perform a new deployment.

## Next steps

- Learn about [cross-tenant management experiences](../concepts/cross-tenant-management-experience.md).
- [View and manage customers](view-manage-customers.md) by going to **My customers** in the Azure portal.
- Learn how to [update](update-delegation.md) or [remove](remove-delegation.md) a delegation.
