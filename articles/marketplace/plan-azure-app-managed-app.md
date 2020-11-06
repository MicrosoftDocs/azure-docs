---
title: Plan an Azure managed application for an Azure application offer
description: Learn what is required to create a managed application plan for a new Azure application offer using the commercial marketplace portal in Microsoft Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 11/06/2020
---

# Plan an Azure managed application for an Azure application offer

An Azure _managed application_ plan is one way to publish an Azure application offer in Azure Marketplace. If you haven’t already done so, read [Plan an Azure Application offer for the commercial marketplace](plan-azure-application-offer.md).

Managed applications are transact offers that are deployed and billed through Azure Marketplace. The listing option that a user sees is Get It Now.

Use an Azure Application: Managed application plan when the following conditions are required:

- You will deploy a subscription-based solution for your customer using either a virtual machine (VM) or an entire infrastructure as a service (IaaS)-based solution.
- You or your customer requires the solution to be managed by a partner. For example, a partner can be a systems integrator or a managed service provider (MSP).

## Managed application offer requirements

| Requriements | Details |
| ------------ | ------------- |
| An Azure subscription | Managed applications must be deployed to a customer's subscription, but they can be managed by a third party. |
| Billing and metering | The resources are provided in a customer's Azure subscription. VMs that use the pay-as-you-go payment model are transacted with the customer via Microsoft and billed via the customer's Azure subscription. <br><br> For bring-your-own-license VMs, Microsoft bills any infrastructure costs that are incurred in the customer subscription, but you transact software licensing fees with the customer directly. |
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux. For more information, see:<br> • [Create an Azure VM technical asset](/azure/marketplace/partner-center-portal/vm-certification-issues-solutions#how-to-address-a-vulnerability-or-exploit-in-a-vm-offer.md) (for Windows VHDs).<br> •  [Linux distributions endorsed on Azure](/azure/virtual-machines/linux/endorsed-distros.md) (for Linux VHDs). |
| Customer usage attribution | All new Azure application offers must also include an [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md) GUID. For more information about customer usage attribution and how to enable it, see [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md). |
| Deployment package | You’ll need a deployment package that will let customers deploy your plan. If you create multiple plans that require the same technical configuration, you can use the same package. For details, see the next section: Deployment package. |
|||

> [!NOTE]
> Managed applications must be deployable through Azure Marketplace. If customer communication is a concern, reach out to interested customers after you've enabled lead sharing.

## Deployment package

The deployment package contains all the template files needed for this plan, as well as any additional resources, packaged as a .zip file.

All Azure applications must include these two files in the root folder of a .zip archive:

- A Resource Manager template file named [mainTemplate.json](/azure/azure-resource-manager/managed-applications/publish-service-catalog-app?tabs=azure-powershell#create-the-arm-template.md). This template defines the resources to deploy into the customer's Azure subscription. For examples of Resource Manager templates, see [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/) or the corresponding [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates) repo.
- A user interface definition for the Azure application creation experience named [createUiDefinition.json](/azure/azure-resource-manager/managed-application-createuidefinition-overview.md). In the user interface, you specify elements that enable consumers to provide parameter values.

Maximum file sizes supported are:

- Up to 1 Gb in total compressed .zip archive size
- Up to 1 Gb for any individual uncompressed file within the .zip archive

All new Azure application offers must also include an [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md) GUID.

## Azure regions

You can publish your plan to the Azure public region, Azure Government region, or both. Before publishing to [Azure Government](/azure/azure-government/documentation-government-manage-marketplace-partners.md), test and validate your plan in the environment as certain endpoints may differ. To set up and test your plan, request a trial account from [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/).

You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated data centers and networks (located in the U.S. only).

For a list of countries and regions supported by the commercial marketplace, see [Geographic availability and currency support](marketplace-geo-availability-currencies.md).

Azure Government services handle data that is subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links visible to Azure Government customers only.

## Choose who can see your plan

You can configure each plan to be visible to everyone (public) or to only a specific audience (private). You can create up to 100 plans and up to 45 of them can be private. You may want to create a private plan to offer different pricing options or technical configurations to specific customers.

You grant access to a private plan using Azure subscription IDs with the option to include a description of each subscription ID you assign. You can add a maximum of 10 subscription IDs manually or up to 10,000 subscription IDs using a .CSV file. Azure subscription IDs are represented as GUIDs and letters must be lowercase.

Private plans are not supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP). For more information, see [Private offers in the Microsoft commercial marketplace](private-offers.md).

> [!NOTE]
> If you publish a private plan, you can change its visibility to public later. However, once you publish a public plan, you cannot change its visibility to private.

## Define pricing

You must provide the per-month price for each plan. This price is in addition to any Azure infrastructure or pay-as-you-go software costs incurred by the resources deployed by this solution.

In addition to the per-month price, you can also set prices for consumption of non-standard units using [metered billing](partner-center-portal/azure-app-metered-billing.md). You may set the per-month price to zero and charge exclusively using metered billing if you like.

Prices are set in USD (USD = United States Dollar) are converted into the local currency of all selected markets using the current exchange rates when saved. But you can choose to set customer prices for each market.

## Just in time (JIT) access

JIT access enables you to request elevated access to a managed application's resources for troubleshooting or maintenance. You always have read-only access to the resources, but for a specific time period you can have greater access. For more information, see [Enable and request just-in-time access for Azure Managed Applications](/azure/managed-applications/request-just-in-time-access.md).

> [!NOTE]
> Information the user should notice even if skimmingBe sure to update your `createUiDefinition.json` file in order to support this feature.

## Deployment mode

You can configure a managed application plan to use either the **Complete** or **Incremental** deployment mode. In complete mode, a redeployment of the application by the customer results in removal of resources in the managed resource group if the resources are not defined in the [mainTemplate.json](/azure/azure-resource-manager/managed-applications/publish-service-catalog-app?tabs=azure-powershell#create-the-arm-template.md). In incremental mode, a redeployment of the application leaves existing resources unchanged. To learn more, see [Azure Resource Manager deployment modes](/azure/azure-resource-manager/templates/deployment-modes.md?WT.mc_id=pc_52).

## Notification endpoint URL

You can optionally provide an HTTPS Webhook endpoint to receive notifications about all CRUD operations on managed application instances of a plan.

## Customize allowed customer actions (optional)

You can optionally specify which actions customers can perform on the managed resources in addition to the `*/read` actions that is available by default.

If you choose this option, you need to provide either the control actions or the allowed data actions, or both. For more information, see [Understanding deny assignments for Azure resources](/azure/role-based-access-control/deny-assignments.md). For available actions, see [Azure Resource Manager resource provider operations](/azure/role-based-access-control/resource-provider-operations.md). For example, to permit consumers to restart virtual machines, add `Microsoft.Compute/virtualMachines/restart/action` to the allowed actions.

## Choose who can manage the application

You must indicate who can manage a managed application in each of the selected clouds: _Public Azure_ and _Azure Government Cloud_. Collect the following information:

- **Azure Active Directory Tenant ID** – The Azure AD Tenant ID (also known as directory ID) containing the identities of the users, groups, or applications you want to grant permissions to. You can find your Azure AD Tenant ID on the Azure portal, in [Properties for Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties).
- **Authoriziations** – Add the Azure Active Directory object ID of each user, group, or application that you want to be granted permission to the managed resource group. Identify the user by their Principal ID, which can be found at the [Azure Active Directory users blade on the Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers).

For each principal ID, you will associate one of the Azure AD built-in roles (Owner or Contributor). The role you select describes the permissions the principal will have on the resources in the customer subscription. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles.md). For more information about role-based access control (RBAC), see [Get started with RBAC in the Azure portal](/azure/role-based-access-control/overview.md).

> [!NOTE]
> Although you may add up to 100 authorizations per Azure region, it's generally easier to create an Active Directory user group and specify its ID in the "Principal ID." This lets you add more users to the management group after the plan is deployed and reduce the need to update the plan just to add more authorizations.

## Policy settings

You can apply [Azure Policies](/azure/governance/policy.md) to your managed application to specify compliance requirements for the deployed solution. For policy definitions and the format of the parameter values, see [Azure Policy Samples](/azure/governance/policy/samples.md).

You can configure a maximum of five policies, and only one instance of each Policy type. Some policy types require additional parameters.

| Policy type | Policy parameters required |
| ------------ | ------------- |
| Azure SQL Database Encryption | No |
| Azure SQL Server Audit Settings | Yes |
| Azure Data Lake Store Encryption | No |
| Audit Diagnostic Setting | Yes |
| Audit Resource Location compliance | No |
|||

For each policy type you add, you must associate Standard or Free Policy SKU. The Standard SKU is required for audit policies. Policy names are limited to 50 characters.

## Next steps

- [How to create an Azure application offer in the commercial marketplace](create-new-azure-apps-offer.md)
