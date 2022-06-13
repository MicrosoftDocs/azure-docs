---
title: Link a partner ID to your Power Platform and Dynamics Customer Insights accounts with your Azure credentials 
description: This article helps Microsoft partners use their Azure credentials to provide customers with services for Microsoft Power Apps, Power Automate, Power BI and Dynamics Customer Insights.
author: bandersmsft
ms.reviewer: tpalmer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 12/17/2021
ms.author: banders 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Link a partner ID to your Power Platform and Dynamics Customer Insights accounts

Microsoft partners who are Power Platform and Dynamics Customer Insights service providers work with their customers to manage, configure and support Power Platform and Customer Insights resources. In order to get credit for these services, you can associate your partner network ID with the Azure credential used for service delivery in your customers’ production environments using Partner Admin Link (PAL).

The PAL allows Microsoft to identify and recognize partners that have Power Platform and Customer Insights customers. Microsoft attributes usage to a partner's organization based on the account's permissions (user role) and scope (tenant, resource, and so on). This attribution can be used for Advanced Specializations, such as the [Microsoft Low Code Advanced Specializations](https://partner.microsoft.com/membership/advanced-specialization#tab-content-2), and [Partner Incentives](https://partner.microsoft.com/asset/collection/microsoft-commerce-incentive-resources#/). 

The following sections explain in more detail how to
1. [Get access accounts from your customer](#access)
2. [Link your access account to your partner ID](#link)
3. [Attribute your access account to the product resource](#attribute)

The attribution step is critical and typically happens automatically, as the partner user is the one creating, editing, and updating the resource. To ensure success, it is strongly recommended to use Solutions where available to import your deliverables into the customers Production Environment via a Managed Solution. When using Solutions, the account used to import the Solution becomes the owner of each deliverable inside the Solution. Linking that account to your partner ID ensures all deliverables inside the Solution are associated to your partner ID.

> *Note: Solutions are not available for Power BI and Customer Insights. See detailed sections below. 

:::image type="content" source="./media/link-partner-id-power-apps-accounts/PAL-steps.png" alt-text="Images showing the three steps listed above." lightbox="./media/link-partner-id-power-apps-accounts/PAL-steps.png" :::

## 1. Get access from your customer <a name="access" />

Before you link your partner ID, your customer must give you access to their Power Platform or Customer Insights resources. They use one of the following options:

* **Directory account** - Your customer can create a dedicated user account, or a user account to act as a service account, in their own directory, and provide access to the product(s) you're publishing to Production.
* **Service principal** - Your customer can add an app or script from your organization in their directory and provide access to the product you're working on in production. 

## 2. Link your access account to your partner ID (aka PAL association) <a name="link" />

When you have access to either a Production Environment access account, you can use PAL to link the account to your Microsoft Partner Network ID (Location MPN ID)

For directory accounts (user or service), use the graphical web-based Azure portal, PowerShell or the Azure CLI to link to your Microsoft Partner Network ID (Location MPN ID).

For service principal, use PowerShell or the Azure CLI to provide the link your Microsoft Partner Network ID (Location MPN ID). Link the partner ID to each customer resource.

To use the Azure portal to link to a new partner ID:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to [Link to a partner ID](https://portal.azure.com/#blade/Microsoft_Azure_Billing/managementpartnerblade) in the Azure portal.
3. Enter the [Microsoft Partner Network](https://partner.microsoft.com/) ID for your organization. Be sure to use the  **Associated MPN ID**  shown on your partner center profile. It's typically known as your [Partner Location Account MPN ID](/partner-center/account-structure).  
    :::image type="content" source="./media/link-partner-id-power-apps-accounts/link-partner-id.png" alt-text="Screenshot showing the Link to a partner ID window." lightbox="./media/link-partner-id-power-apps-accounts/link-partner-id.png" :::
4. To link your partner ID to another customer, switch the directory. Under **Switch directory**, select the appropriate directory.  
    
More details on using PowerShell or the Azure CLI are listed in the [Using PowerShell, CLI and other tools](#tooling). 

##  3. Attribute your access account to the product resource <a name="attribute" />

The partner user/guest account that you received from your customer and was linked through the Partner Admin Link (PAL) needs to be attributed to the *resource* for Power Platform or Dynamics Customer Insights to count the usage of that specific resource. The user/guest account doesn't need to be associated with a specific Azure subscription for Power Apps, Power Automate, Power BI or D365 Customer Insights. In many cases, it happens automatically, as the partner user is the one creating, editing, and updating the resource. Besides the logic below, the specific programs the PAL link is used for (such as the [Microsoft Low Code Advanced Specializations](https://partner.microsoft.com/membership/advanced-specialization#tab-content-2) or Partner Incentives) may have other requirements such as the resource needing to be in production and associated with paid usage.

| Product           | Primary Metric   | Resource | Attributed User Logic                                                                                                                                                                             |
|-------------------|------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Power Apps | Monthly Active Users (MAU) | Application |The user must be an owner/co-owner of the application. For more information, see [Share a canvas app with your organization](/powerapps/maker/canvas-apps/share-app). In cases of multiple partners being mapped to a single application, the user's activity is reviewed to select the 'latest' partner. |
| Power Automate | Monthly Active Users (MAU) | Flow | The user must be the creator of the flow. There can only be one creator so there's no logic for multiple partners.  |
| Power BI            | Monthly Active Users (MAU)   | Dataset | The user must be the publisher of the dataset. For more information, see [Publish datasets and reports from Power BI Desktop](/power-bi/create-reports/desktop-upload-desktop-files). In cases of multiple partners being mapped to a single dataset, the user's activity is reviewed to select the 'latest' partner. |
| Customer Insights | Unified Profiles | Instance | Any active user of an Instance is treated as the attributed user. In cases of multiple partners being mapped to a single Instance, the user's activity is reviewed to select the 'latest' partner |

Additional callouts by product: 
* **Power Apps - Canvas Applications:**
  * Set the PAL associated User or Service Account as the owner or co-owner of the application.
  * You can only change the owner (not co-owner) via the PowerShell Set-AdminPowerAppOwner.
  * When inside of a solution, and imported into another environment, the importing entity becomes the new owner.
* **Power Apps - Model Driven Applications:**
  * Make sure the app creator has a PAL association.
  * There is NO co-owner option, and you cannot change the owner via the GUI or PowerShell directly.
  * When inside of a solution, and imported into another environment, the importing entity becomes the new owner.
* **Power Automate:**
  * Make sure the flow creator has a PAL association
  * You can easily change the owner via the web GUI or with the PowerShell Set-AdminFlowOwnerRole
  * When inside of a solution, and imported into another environment, the importing entity becomes the new owner.
* **Power BI:**
  * The act of publishing to the service sets the owner.
  * Make sure the user publishing the report has a PAL association.
  * Use PowerShell to publish as any user or Service Account.


## Using PowerShell, CLI and other tools <a name="tooling" />

### Tooling to update or change attributed users 

This chart shows the tooling compatibility to changing the owner/co-owner (as described above) **user accounts or dedicated service accounts** after the application has been created.

| Product | GUI | PowerShell | PP CLI | DevOps + Build Tools |
| --- | --- | --- | --- | --- |
| Power App Canvas | YES | YES | YES | YES |
| Power App Model Driven | NO | NO | YES | YES |
| Power Automate | YES | YES | YES | YES |
| Power BI (Publishing) | NO | YES | NO | NO |
| Power Virtual Agent | NO | NO | YES | YES |

This shows the tooling compatibility to changing a previously assigned user account to an **Application Registration known as a Service Principal**.

| Product | GUI | PowerShell | PP CLI | DevOps + Build Tools |
| --- | --- | --- | --- | --- |
| Power App Canvas | NO | NO | YES | YES |
| Power App Model Driven | NO | NO | YES | YES |
| Power Automate | YES | YES | YES | YES |
| Power BI (Publishing) | NO | YES | NO | NO |
| Power Virtual Agent | NO | NO | YES | YES |

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

### Next steps

- Learn more about the [Low Code Application Development advanced specialization](https://partner.microsoft.com/en-us/membership/advanced-specialization/low-code-application-development) 
- Leverage the [Low Cod Application Development advanced specialization learning path](https://partner.microsoft.com/training/assets/collection/low-code-application-development-advanced-specialization#/)
