---
title: Link a partner ID to your Power Platform and Dynamics Customer Insights accounts with your Azure credentials 
description: This article helps Microsoft partners use their Azure credentials to provide customers with services for Microsoft Power Apps, Power Automate, Power BI and Dynamics Customer Insights.
author: bandersmsft
ms.reviewer: tpalmer
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 08/10/2023
ms.author: banders 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Link a partner ID to your Power Platform and Dynamics Customer Insights accounts

Microsoft partners who are Power Platform and Dynamics 365 Customer Insights service providers work with their customers to manage, configure, and support Power Platform and Customer Insights resources. To get credit for the services, you can associate your partner network ID with the Azure credential used for service delivery that's in your customers’ production environments using the Partner Admin Link (PAL).

PAL allows Microsoft to identify and recognize partners that have Power Platform and Customer Insights customers. Microsoft attributes usage to a partner's organization based on the account's permissions (user role) and scope (tenant, resource, and so on). The attribution is used for Specializations, including:

- [Microsoft Low Code Application Development Specialization](https://partner.microsoft.com/partnership/specialization/low-code-application-development)
- [Microsoft Intelligent Automation Specialization](https://partner.microsoft.com/partnership/specialization/intelligent-automation)
- [Partner Incentives](https://partner.microsoft.com/asset/collection/microsoft-commerce-incentive-resources#/)

The following sections explain how to:

1. **Initiation** - get service account from your customer
2. **Registration** - link your access account to your partner ID
3. **Attribution** - attribute your service account to the Power Platform & Dynamics Customer Insights resources using Solutions

We recommend taking these actions in the preceding order.

The attribution step is critical and typically happens automatically, as the partner user is the one creating, editing, and updating the resource. For example, the Power App application, the Power Automate flow, and so on. To ensure success, we strongly recommend that you use Solutions where available to import your deliverables into the customers Production Environment via a Managed Solution. When you use Solutions, the account used to import the Solution becomes the owner of each deliverable inside the Solution. Linking the account to your partner ID ensures all deliverables inside the Solution are associated to your partner ID, automatically handling the preceding step #3.

> [!NOTE]
> Solutions are not available for Power BI and Customer Insights. See the following detailed sections.

:::image type="content" source="./media/link-partner-id-power-apps-accounts/partner-admin-link-steps.png" alt-text="Diagrams showing the three steps listed previously."  border="false" lightbox="./media/link-partner-id-power-apps-accounts/partner-admin-link-steps.png" :::

## Initiation - get service account from your customer

Use a dedicated Service Account for work performed and delivered into production.

Through the normal course of business with your customer, determine ownership and access rights of a service account dedicated to you as a partner. 

[Creating a Service Account Video](https://aka.ms/ServiceAcct) 

## Registration - link your access account to your partner ID

Perform PAL Association on this Service Account.

[PAL Association Via Azure portal Video](https://aka.ms/PALAssocAzurePortal)

To use the Azure portal to link to a new partner ID:

1. Go to [Link to a partner ID](https://portal.azure.com/#blade/Microsoft_Azure_Billing/managementpartnerblade) in the Azure portal and sign in.
1. Enter the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization. Be sure to use the **Associated Partner ID** shown on your partner center profile. It's typically known as your [partner location ID](/partner-center/account-structure).  
    :::image type="content" source="./media/link-partner-id-power-apps-accounts/link-partner-id.png" alt-text="Screenshot showing the Link to a partner ID window." lightbox="./media/link-partner-id-power-apps-accounts/link-partner-id.png" :::

> [!NOTE]
> To link your partner ID to another customer, switch the directory. Under **Switch directory**, select the appropriate directory.
    
For more information about using PowerShell or the Azure CLI, see sections under [Alternate approaches](#alternate-approaches).

##  Attribution - attribute your service account to the resource using Solutions

To count the usage of a specific resource, the partner service account needs to be attributed to the *resource* for Power Platform or Dynamics Customer Insights. 

To ensure success, we strongly recommend that you use [Solutions](/power-apps/maker/data-platform/solutions-overview) where available to import your deliverables into the customers Production Environment via a Managed Solution. Use the Service account to install these Solutions into production environments. The last account with a PAL Association to import the solution assumes ownership of all objects inside the Solution and receive the usage credit.

[Attributing the account to Power Platform & Customer Insights resources using Solutions](https://aka.ms/AttributetoResources)

The resource and attribute user logic differ for every product.

| Product | Primary Metric | Resource | Attributed User Logic |
|---|---|---|---|
| Power Apps | Monthly Active Users (MAU) | Application |The user must be an owner/co-owner of the application. For more information, see [Share a canvas app with your organization](/powerapps/maker/canvas-apps/share-app). In cases of multiple partners being mapped to a single application, the user's activity is reviewed to select the *latest* partner. |
| Power Automate | Monthly Active Users (MAU) | Flow | The user must be the creator of the flow. There can only be one creator so there's no logic for multiple partners.  |
| Power BI | Monthly Active Users (MAU)   | Dataset | The user must be the publisher of the dataset. For more information, see [Publish datasets and reports from Power BI Desktop](/power-bi/create-reports/desktop-upload-desktop-files). In cases of multiple partners being mapped to a single dataset, the user's activity is reviewed to select the *latest* partner. |
| Customer Insights | Unified Profiles | Instance | Any active user of an Instance is treated as the attributed user. In cases of multiple partners being mapped to a single Instance, the user's activity is reviewed to select the *latest* partner. |

## Validation

The operation of a PAL association is a Boolean operation. Once performed it can be verified visually in the Azure portal or with a PowerShell Command. Either option shows your organization name and Partner ID to represent the account and partner ID were correctly connected.

## Alternate approaches

The following sections are alternate approaches to use PAL for Power Platform and Customer Insights.

### Associate PAL with user accounts

The Attribution step can also be completed with **user accounts**. Although it's an option, there are some downsides to the approach. For partners with a large number of users, it requires management of user accounts when users are new to the team and/or resign from the team. If you choose to associate PAL in this way, you need to manage the users via a spreadsheet.

To Associate PAL with User Accounts, follow the same steps as with Service Accounts but do so for each user.

Other points about products:

* **Power Apps - Canvas Applications**
  * Set the PAL associated User or Service Account as the owner or co-owner of the application.
  * You can only change the owner, not co-owner, using the PowerShell `Set-AdminPowerAppOwner` cmdlet.
  * The importing entity becomes the new owner when it's inside of a solution and it's imported into another environment.
* **Power Apps - Model Driven Applications**
  * Make sure the app creator performs the PAL association.
  * There's *no* co-owner option, and you can't change the owner using the GUI or PowerShell directly.
  * The importing entity becomes the new owner when it's inside of a solution and it's imported into another environment.
* **Power Automate**
  * Make sure the flow creator performs the PAL association
  * You can easily change the owner using the web GUI or with the PowerShell `Set-AdminFlowOwnerRole` cmdlet.
  * The importing entity becomes the new owner when it's inside of a solution and it's imported into another environment.
* **Power BI**
  * The act of publishing to the Power BI service sets the owner.
  * Make sure the user publishing the report performs the PAL association.
  * Use PowerShell to publish as any user or Service Account.


### Tooling to update or change attributed users 

The following table shows the tooling compatibility to change the owner or co-owner, as described previously, **user accounts or dedicated service accounts** after the application has been created.

| Product | GUI | PowerShell | PP CLI | DevOps + Build Tools |
| --- | --- | --- | --- | --- |
| Power App Canvas | ✔  | ✔  | ✔  | ✔  |
| Power App Model Driven | ✘ | ✘ | ✔  | ✔  |
| Power Automate | ✔  | ✔  | ✔  | ✔  |
| Power BI (Publishing) | ✘ | ✔  | ✘ | ✘ |

The following table shows the tooling compatibility to change a previously assigned user account to an **Application Registration known as a Service Principal**.

| Product | GUI | PowerShell | PP CLI | DevOps + Build Tools |
| --- | --- | --- | --- | --- |
| Power App Canvas | ✘ | ✘ | ✔  | ✔  |
| Power App Model Driven | ✘ | ✘ | ✔  | ✔  |
| Power Automate | ✔  | ✔  | ✔  | ✔  |
| Power BI (Publishing) | ✘ | ✔  | ✘ | ✘ |

### Use PowerShell to link to a new partner ID

Install the [Az.ManagementPartner](https://www.powershellgallery.com/packages/Az.ManagementPartner/) Azure PowerShell module.

Sign into the customer's tenant with either the user account or the service principal. For more information, see [Sign in with PowerShell](/powershell/azure/authenticate-azureps).

```azurepowershell-interactive
Update-AzManagementPartner -PartnerId 12345
```

Link to the new partner ID. The partner ID is the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization. Be sure to use the **Associated Partner ID**  shown on your partner profile.

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

Link to the new partner ID. The partner ID is the [Microsoft Cloud Partner Program](https://partner.microsoft.com/) ID for your organization.

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

- Learn more about the [Low Code Application Development advanced specialization](https://partner.microsoft.com/membership/advanced-specialization/low-code-application-development) 
- Read the [Low Code Application Development advanced specialization learning path](https://partner.microsoft.com/training/assets/collection/low-code-application-development-advanced-specialization#/)
