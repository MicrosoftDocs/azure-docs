---
title: Link a partner ID to your account that’s used to manage customers
description: Track engagements with Azure customers by linking a partner ID to the user account that you use to manage the customer's resources.
author: bandersmsft
ms.reviewer: presharm
ms.author: banders
ms.date: 07/27/2023
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Link a partner ID to your account that’s used to manage customers

Microsoft partners provide services that help customers achieve business and mission objectives using Microsoft products. When a partner acts on behalf of the customer to manage, configure, and support Azure services, the partner users will need access to the customer’s environment. When partners use Partner Admin Link (PAL), they can associate their partner network ID with the credentials used for service delivery.

PAL enables Microsoft to identify and recognize partners who drive Azure customer success. Microsoft can attribute influence and Azure consumed revenue to your organization based on the account's permissions (Azure role) and scope (subscription, resource group, resource). If a group has Azure RBAC access, then PAL is recognized for all the users in the group.

## Get access from your customer

Before you link your partner ID, your customer must give you access to their Azure resources by using one of the following options:

- **Guest user**: Your customer can add you as a guest user and assign any Azure roles. For more information, see [Add guest users from another directory](../../active-directory/external-identities/what-is-b2b.md).

- **Directory account**: Your customer can create a user account for you in their own directory and assign any Azure role.

- **Service principal**: Your customer can add an app or script from your organization in their directory and assign any Azure role. The identity of the app or script is known as a service principal.

- **Azure Lighthouse**: Your customer can delegate a subscription (or resource group) so that your users can work on it from within your tenant. For more information, see [Azure Lighthouse](../../lighthouse/overview.md).

## Link to a partner ID

When you have access to the customer's resources, use the Azure portal, PowerShell, or the Azure CLI to link your Partner ID to your user ID or service principal. Link the Partner ID in each customer tenant.

### Use the Azure portal to link to a new partner ID

1. Go to [Link to a partner ID](https://portal.azure.com/#blade/Microsoft_Azure_Billing/managementpartnerblade) in the Azure portal.

2. Sign in to the Azure portal.

3. Enter the Microsoft partner ID. The partner ID is the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization. Be sure to use the **Associated Partner ID** shown on your partner profile.

   ![Screenshot that shows Link to a partner ID](./media/link-partner-id/link-partner-id01.png)

4. To link a partner ID for another customer, switch the directory. Under **Switch directory**, select your directory.

   ![Screenshot that shows Switch directory](./media/link-partner-id/directory-switcher.png)

### Use PowerShell to link to a new partner ID

1. Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) PowerShell module.

2. Sign in to the customer's tenant with either the user account or the service principal. For more information, see [Sign in with PowerShell](/powershell/azure/authenticate-azureps).

   ```azurepowershell-interactive
    C:\> Connect-AzAccount -TenantId XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   ```

3. Link to the new partner ID. The partner ID is the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization. Be sure to use the **Associated Partner ID** shown on your partner profile.


    ```azurepowershell-interactive
    C:\> New-AzManagementPartner -PartnerId 12345
    ```

#### Get the linked partner ID
```azurepowershell-interactive
C:\> Get-AzManagementPartner
```

#### Update the linked partner ID
```azurepowershell-interactive
C:\> Update-AzManagementPartner -PartnerId 12345
```
#### Delete the linked partner ID
```azurepowershell-interactive
C:\> Remove-AzManagementPartner -PartnerId 12345
```

### Use the Azure CLI to link to a new partner ID
1. Install the Azure CLI extension.

    ```azurecli-interactive
    C:\ az extension add --name managementpartner
    ```

2. Sign in to the customer's tenant with either the user account or the service principal. For more information, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

    ```azurecli-interactive
    C:\ az login --tenant <tenant>
    ```

3. Link to the new partner ID. The partner ID is the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization.

     ```azurecli-interactive
     C:\ az managementpartner create --partner-id 12345
      ```  

#### Get the linked partner ID
```azurecli-interactive
C:\ az managementpartner show
```

#### Update the linked partner ID
```azurecli-interactive
C:\ az managementpartner update --partner-id 12345
```

#### Delete the linked partner ID
```azurecli-interactive
C:\ az managementpartner delete --partner-id 12345
```

## Frequently asked questions

**What PAL identity permissions are needed to show revenue?**

PAL can be as granular as a resource instance. For example, a single virtual machine. However, PAL is set on a user account. The scope of the Azure Consumed Revenue (ACR) measurement is whatever administrative permissions that a user account has within the environment. An administrative scope can be subscription, resource group, or resource instance using standard Azure RBAC roles.

In other words, PAL association can happen for all RBAC roles. The roles determine eligibility for partner incentives. For more information about eligibility, see [Partner Incentives](https://aka.ms/partnerincentives).

For example, if you're partner, your customer might hire you to do a project. Your customer can give you an administrative account to deploy, configure, and support an application. Your customer can scope your access to a resource group. If you use PAL and associate your MPN ID with the administrative account, Microsoft measures the consumed revenue from the services within the resource group.

If the Azure AD identity that was used for PAL is deleted or disabled, the ACR attribution stops for the partner on the associated resources.

Various partner programs have differing rules for the RBAC roles. Contact your Partner Development Manager for rules about the specific Azure RBAC roles that are needed at the time of PAL in order for ACR attribution to be realized.

For more information, see: 

- [Azure Partner Admin Link](https://www.microsoftpartnercommunity.com/atvwr79957/attachments/atvwr79957/Webinars/53/1/Azure%20Partner%20Admin%20Link%20FAQ.pdf)
- [Get recognized with Partner Admin Link](https://www.microsoftpartnercommunity.com/t5/Microsoft-Partner-Network/Get-recognized-with-Partner-Admin-Link/td-p/8389/page/2)

**Who can link the partner ID?**

Any user from the partner organization who manages a customer's Azure resources can link the partner ID to the account.

**Can a partner ID be changed after it's linked?**

Yes. A linked partner ID can be changed, added, or removed.

**What if a user has an account in more than one customer tenant?**

The link between the partner ID and the account is done for each customer tenant. Link the partner ID in each customer tenant.

However, if you're managing customer resources through Azure Lighthouse, you should create the link in your service provider tenant, using an account that has access to the customer resources. For more information, see [Link your partner ID to track your impact on delegated resources](../../lighthouse/how-to/partner-earned-credit.md).

**Can other partners or customers edit or remove the link to the partner ID?**

The link is associated at the user account level. Only you can edit or remove the link to the partner ID. The customer and other partners can't change the link to the partner ID.

**Which Partner ID should I use if my company has multiple?**

Be sure to use the **Associated Partner ID** shown in your partner profile.

**Where can I find influenced revenue reporting for linked partner ID?**

Cloud Product Performance reporting is available to partners in Partner Center at [My Insights dashboard](https://partner.microsoft.com/membership/reports/myinsights). You need to select Partner Admin Link as the partner association type.

**Why can't I see my customer in the reports?**

You can't see the customer in the reports due to following reasons

1. The linked user account doesn't have [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) on any customer Azure subscription or resource.

2. The Azure subscription where the user has [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) access doesn't have any usage.

**Does link partner ID works with Azure Stack?**

Yes, You can link your partner ID for Azure Stack.

**How do I link my partner ID if my company uses [Azure Lighthouse](../../lighthouse/overview.md) to access customer resources?**

In order for Azure Lighthouse activities to be recognized, you need to associate your Partner ID with at least one user account that has access to each of your onboarded subscriptions. The association is needed in your service provider tenant rather than in each customer tenant. For simplicity, we recommend creating a service principal account in your tenant, associating it with your Partner ID, then granting it access to every customer you onboard with an [Azure built-in role that is eligible for partner earned credit](/partner-center/azure-roles-perms-pec). For more information, see [Link your partner ID to track your impact on delegated resources](../../lighthouse/how-to/partner-earned-credit.md).

**How do I explain Partner Admin Link (PAL) to my Customer?**

Partner Admin Link (PAL) enables Microsoft to identify and recognize those partners who are helping customers achieve business objectives and realize value in the cloud. Customers must first provide a partner access to their Azure resource. Once access is granted, the partner’s Microsoft Cloud Partner Program ID is associated. This association helps Microsoft understand the ecosystem of IT service providers and to refine the tools and programs needed to best support our common customers.

**What data does PAL collect?**

The PAL association to existing credentials provides no new customer data to Microsoft. It simply provides the information to Microsoft where a partner is actively involved in a customer’s Azure environment. Microsoft can attribute influence and Azure consumed revenue from customer environment to partner organization based on the account's permissions (Azure role) and scope (Management Group, Subscription, Resource Group, Resource) provided to the partner by customer. 

**Does this impact the security of a customer’s Azure Environment?**

PAL association only adds partner’s ID to the credential already provisioned and it doesn't alter any permissions (Azure role) or provide other Azure service data to partner or Microsoft.

**What happens if the PAL identity is deleted?**

If the partner network ID, also called MPN ID, is deleted, then all the recognition mechanisms including Azure Consumed Revenue (ACR) attribution stops working.

## Next steps

Join the discussion in the [Microsoft Partner Community](https://aka.ms/PALdiscussion) to receive updates or send feedback.
