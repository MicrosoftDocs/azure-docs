---
title: Link a partner ID to your Power Apps accounts with your Azure credentials 
description: This article helps Microsoft partners use their Azure credentials to assist customers use Microsoft Power Apps.
author: bandersmsft
ms.reviewer: akangaw
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/16/2021
ms.author: banders
---

# Link a partner ID to your Power Apps accounts

This article helps Microsoft partners, who are Power Apps service providers, to associate their service to customers on Microsoft Power Apps. When you (the Microsoft partner) manage, configure, and support Power Apps services for your customer, you have access to your customer's environment. You can use your Azure credentials and a Partner Admin Link (PAL) to associate your partner network ID with the account credentials used for service delivery.

The PAL allows Microsoft to identify and recognize partners that have Power Apps customers. Microsoft attributes usage to a partner's organization based on the account's permissions (Power Apps role) and scope (tenant, resource group, resource).

## Get access from your customer

Before you link your partner ID, your customer must give you access to their Power Apps resources by using one of the following options:

- **Guest user** - Your customer can add you as a guest user and assign any Power Apps roles. For more information, see [Add guest users from another directory](../../active-directory/external-identities/what-is-b2b.md).
- **Directory account** - Your customer can create a user account for you in their own directory and assign any Power Apps role.
- **Service principal** - Your customer can add an app or script from your organization in their directory and assign any Power Apps role. The identity of the app or script is known as a service principal.
- **Delegated Administrator** - Your customer can delegate a resource group so that your users can work on it from within your tenant. For more information, see [For partners: the Delegated Administrator](/power-platform/admin/for-partners-delegated-administrator).

## Link customer to a partner ID

When you have access to your customer's resources, use the Azure portal, PowerShell, or the Azure CLI to link your Microsoft Partner Network ID (MPN ID) to your user ID or service principal. Link the partner ID to each customer tenant.

### Use the Azure portal to link to a new partner ID

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to [Link to a partner ID](https://portal.azure.com/#blade/Microsoft_Azure_Billing/managementpartnerblade) in the Azure portal.
1. Enter the [Microsoft Partner Network](https://partner.microsoft.com/) ID for your organization. Be sure to use the  **Associated MPN ID**  shown on your partner profile.  
    :::image type="content" source="./media/link-partner-id-power-apps-accounts/link-partner-id.png" alt-text="Screenshot showing the Link to a partner ID window." lightbox="./media/link-partner-id-power-apps-accounts/link-partner-id.png" :::
1. To link your partner ID to another customer, switch the directory. Under **Switch directory**, select the appropriate directory.  
    :::image type="content" source="./media/link-partner-id-power-apps-accounts/switch-directory.png" alt-text="Screenshot showing the Directory + subscription window where can you switch your directory." lightbox="./media/link-partner-id-power-apps-accounts/switch-directory.png" :::

### Use PowerShell to link to a new partner ID

Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) Azure PowerShell module.

Sign into the customer's tenant with either the user account or the service principal. For more information, see [Sign in with PowerShell](/powershell/azure/authenticate-azureps).

```azurepowershell-interactive
Update-AzManagementPartner -PartnerId 12345
```

Link to the new partner ID. The partner ID is the [Microsoft Partner Network](https://partner.microsoft.com/) ID for your organization. Be sure to use the **Associated MPN ID**  shown on your partner profile.

```azurepowershell-interactive
new-AzManagementPartner -PartnerId 12345
```

Get the linked partner ID

```azurepowershell-interactive
get-AzManagementPartner
```

Update the linked partner ID

```azurepowershell-interactive
Update-AzManagementPartner -PartnerId 12345
```

Delete the linked partner ID

```azurepowershell-interactive
remove-AzManagementPartner -PartnerId 12345
```

### Use the Azure CLI to link to a new partner ID

First, install the Azure CLI extension.

```azurecli-interactive
az extension add --name managementpartner
```

Sign into the customer's tenant with either the user account or the service principal. For more information, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

```azurecli-interactive
az login --tenant TenantName
```

Link to the new partner ID. The partner ID is the [Microsoft Partner Network](https://partner.microsoft.com/) ID for your organization.

```azurecli-interactive
az managementpartner create --partner-id 12345
```

Get the linked partner ID

```azurecli-interactive
az managementpartner show
```

Update the linked partner ID

```azurecli-interactive
az managementpartner update --partner-id 12345
```

Delete the linked partner ID

```azurecli-interactive
az managementpartner delete --partner-id 12345
```

## Frequently asked questions (FAQ)

The following sections cover frequently asked questions about linking a partner ID to Power Apps accounts.

### Who should link the partner ID?

Any user from the partner organization who works on a customer's Power Apps resources can link the partner ID to the account. Ideally, the association in PAL should be done at the beginning of the project. However, it can be performed whenever you have access in the customer's directory.

### Can a partner ID be changed after it's linked?

Yes. A linked partner ID can be changed, added, or removed. One example for this situation might be when an employee from your company leaves your organization. Another example might be when a project or contract with the customer ends.

### What if a user has an account in more than one customer tenant?

The link between the partner ID and the account is done for each customer tenant. Link the partner ID in each customer tenant.

### Can other partners or customers edit or remove the link to the partner ID?

The link is associated at the user account level. Only you can edit or remove the link to the partner ID. The customer and other partners can't change the link to the partner ID.

### Which MPN ID should I use if my company has multiple?

Be sure to use the **Associated MPN ID** shown in your partner profile. It's usually the local account ID association with your organization.

### How do I explain PAL to my customer?

PAL enables Microsoft to identify and recognize those partners who are helping customers achieve business goals and realize value in the cloud. Customers must first provide a partner access to their Power Apps resource. Once access is granted, the partner's Microsoft Partner Network ID (MPN ID) is associated. This association helps Microsoft understand service providers and to refine the tools and programs needed to best support customers.

### What data does PAL collect?

The PAL association to existing credentials provides no new customer data to Microsoft. It provides the information to Microsoft where a partner is actively involved in a customer's Power Apps environments. Microsoft can attribute usage and influence from customer environment to partner organization based on the account's permissions (Power Apps role) and scope (tenant, Resource Group, Resource) provided to the partner by customer.

### Does PAL association affect the security of a customer's Power Apps environment?

PAL association only adds partner's MPN ID to the credential already provisioned. It doesn't alter any permissions (Power Apps role) or provide extra Power Apps service data to the partner or Microsoft.

### Next steps

- Join the discussion in the [Microsoft Partner Community](https://aka.ms/PALdiscussion) to receive updates or send feedback.
- Read the [Low Code Application Development advanced specialization FAQ](https://assetsprod.microsoft.com/mpn/faq-low-code-app-development-advanced-specialization.pdf) for PAL-based Power Apps association for Low code application development advanced specialization.
