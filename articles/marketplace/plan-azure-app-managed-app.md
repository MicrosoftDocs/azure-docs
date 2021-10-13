---
title: Plan an Azure managed application for an Azure application offer
description: Learn what is required to create a managed application plan for a new Azure application offer using the commercial marketplace portal in Microsoft Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 08/13/2021
---

# Plan an Azure managed application for an Azure application offer

An Azure _managed application_ plan is one way to publish an Azure application offer in Azure Marketplace. If you haven't already done so, read [Plan an Azure Application offer for the commercial marketplace](plan-azure-application-offer.md).

Managed applications are transact offers that are deployed and billed through Azure Marketplace. The listing option that a user sees is Get It Now.

Use an Azure Application: Managed application plan when the following conditions are required:

- You will deploy a subscription-based solution for your customer using either a virtual machine (VM) or an entire infrastructure as a service (IaaS)-based solution.
- You or your customer requires the solution to be managed by a partner. For example, a partner can be a systems integrator or a managed service provider (MSP).

## Managed application offer requirements

| Requirements | Details |
| ------------ | ------------- |
| An Azure subscription | Managed applications must be deployed to a customer's subscription, but they can be managed by a third party. |
| Billing and metering | The resources are provided in a customer's Azure subscription. VMs that use the pay-as-you-go payment model are transacted with the customer via Microsoft and billed via the customer's Azure subscription. <br><br> For bring-your-own-license VMs, Microsoft bills any infrastructure costs that are incurred in the customer subscription, but you transact software licensing fees with the customer directly. |
| Azure-compatible virtual hard disk (VHD) | VMs must be built on Windows or Linux. For more information, see:<br> * [Create an Azure VM technical asset](./azure-vm-create-certification-faq.yml#address-a-vulnerability-or-an-exploit-in-a-vm-offer) (for Windows VHDs).<br> *  [Linux distributions endorsed on Azure](../virtual-machines/linux/endorsed-distros.md) (for Linux VHDs). |
| Customer usage attribution | All new Azure application offers must also include an [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md) GUID. For more information about customer usage attribution and how to enable it, see [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md). |
| Deployment package | You'll need a deployment package that will let customers deploy your plan. If you create multiple plans that require the same technical configuration, you can use the same package. For details, see the next section: Deployment package. |
|||

> [!NOTE]
> Managed applications must be deployable through Azure Marketplace. If customer communication is a concern, reach out to interested customers after you've enabled lead sharing.

## Usage of Azure Kubernetes Service (AKS) and containers in managed application

### Azure application offers fall into two categories

- Solution template – not accessible by the publisher
- Managed application – accessible by the publisher via pre-defined authorization that is granted by the customer at the time of deployment

**Solution templates:** The Solution Template offers are not changeable by the publisher after customer deployment. Therefore, containers and Azure Kubernetes Service (AKS) resources are not currently allowed in this offer category.

**Managed applications:** The Managed Application offers allow the publisher to access and control the resources created during deployment in the customer’s subscription. Therefore, containers and Azure Kubernetes Service (AKS) resources *<u>are provisionally allowed</u>* in this offer category.

### Rules and known issues for AKS and containers in managed applications

- AKS Node Resource Group does not inherit the Deny Assignments as a part of the Azure Managed Application. This means the customer will have full access to the AKS Node Resource Group that is created by the AKS resource when it is included in the managed application while the Managed Resource Group will have the proper Deny Assignments.
 
- The publisher can include Helm charts and other scripts as part of the Azure Managed Application. However, the offer will be treated like a regular managed application deployment and there will be no automatic container-specific processing or Helm chart installation at deployment time. It is the publisher’s responsibility to execute the relevant scripts, either at deployment time, using the usual techniques such as VM custom script extension or Azure Deployment Scripts, or after deployment.
 
- Same as with the regular Azure Managed Application, it is the publisher’s responsibility to ensure that the solution deploys successfully and that all components are properly configured, secured, and operational. For example, publishers can use their own container registry as the source of the images but are fully responsible for the container security and ongoing vulnerability scanning.

> [!NOTE]
> The support for containers and AKS in Azure Managed Application offer may be withdrawn when an official Container Application offer type is made available in Marketplace. At that time, it might be a requirement to publish all future offers using the new offer type and the existing offers may need to be migrated to the new offer type and retired.

## Deployment package

The deployment package contains all the template files needed for this plan, as well as any additional resources, packaged as a .zip file.

All Azure applications must include these two files in the root folder of a .zip archive:

- A Resource Manager template file named [mainTemplate.json](../azure-resource-manager/managed-applications/publish-service-catalog-app.md?tabs=azure-powershell#create-the-arm-template). This template defines the resources to deploy into the customer's Azure subscription. For examples of Resource Manager templates, see [Azure Quickstart Templates gallery](https://azure.microsoft.com/resources/templates/) or the corresponding [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates) repo.
- A user interface definition for the Azure application creation experience named [createUiDefinition.json](../azure-resource-manager/managed-applications/create-uidefinition-overview.md). In the user interface, you specify elements that enable consumers to provide parameter values.

Maximum file sizes supported are:

- Up to 1 Gb in total compressed .zip archive size
- Up to 1 Gb for any individual uncompressed file within the .zip archive

All new Azure application offers must also include an [Azure partner customer usage attribution](azure-partner-customer-usage-attribution.md) GUID.

## Azure regions

You can publish your plan to the Azure public region, Azure Government region, or both. Before publishing to [Azure Government](../azure-government/documentation-government-manage-marketplace-partners.md), test and validate your plan in the environment as certain endpoints may differ. To set up and test your plan, request a trial account from [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/).

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

In addition to the per-month price, you can also set prices for consumption of non-standard units using [metered billing](marketplace-metering-service-apis.md). You may set the per-month price to zero and charge exclusively using metered billing if you like.

Prices are set in USD (USD = United States Dollar) are converted into the local currency of all selected markets using the current exchange rates when saved. But you can choose to set customer prices for each market.

## Just in time (JIT) access

JIT access enables you to request elevated access to a managed application's resources for troubleshooting or maintenance. You always have read-only access to the resources, but for a specific time period you can have greater access. For more information, see [Enable and request just-in-time access for Azure Managed Applications](../azure-resource-manager/managed-applications/request-just-in-time-access.md).

> [!NOTE]
> Be sure to update your `createUiDefinition.json` file in order to support this feature.

## Deployment mode

You can configure a managed application plan to use either the **Complete** or **Incremental** deployment mode. In complete mode, a redeployment of the application by the customer results in removal of resources in the managed resource group if the resources are not defined in the [mainTemplate.json](../azure-resource-manager/managed-applications/publish-service-catalog-app.md?tabs=azure-powershell#create-the-arm-template). In incremental mode, a redeployment of the application leaves existing resources unchanged. To learn more, see [Azure Resource Manager deployment modes](../azure-resource-manager/templates/deployment-modes.md).

## Notification endpoint URL

You can optionally provide an HTTPS Webhook endpoint to receive notifications about all CRUD operations on managed application instances of a plan.

## Customize allowed customer actions (optional)

You can optionally specify which actions customers can perform on the managed resources in addition to the `*/read` actions that is available by default.

If you choose this option, you need to provide either the control actions or the allowed data actions, or both. For more information, see [Understanding deny assignments for Azure resources](../role-based-access-control/deny-assignments.md). For available actions, see [Azure Resource Manager resource provider operations](../role-based-access-control/resource-provider-operations.md). For example, to permit consumers to restart virtual machines, add `Microsoft.Compute/virtualMachines/restart/action` to the allowed actions.

## Choose who can manage the application

You must indicate who can manage a managed application in each of the selected clouds: _Public Azure_ and _Azure Government Cloud_. Collect the following information:

- **Azure Active Directory Tenant ID** – The Azure AD Tenant ID (also known as directory ID) containing the identities of the users, groups, or applications you want to grant permissions to. You can find your Azure AD Tenant ID on the Azure portal, in [Properties for Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties).
- **Authorizations** – Add the Azure Active Directory object ID of each user, group, or application that you want to be granted permission to the managed resource group. Identify the user by their Principal ID, which can be found at the [Azure Active Directory users blade on the Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers).

For each principal ID, you will associate one of the Azure AD built-in roles (Owner or Contributor). The role you select describes the permissions the principal will have on the resources in the customer subscription. For more information, see [Azure built-in roles](../role-based-access-control/built-in-roles.md). For more information about role-based access control (RBAC), see [Get started with RBAC in the Azure portal](../role-based-access-control/overview.md).

> [!NOTE]
> Although you may add up to 100 authorizations per Azure region, it's generally easier to create an Active Directory user group and specify its ID in the "Principal ID." This lets you add more users to the management group after the plan is deployed and reduce the need to update the plan just to add more authorizations.

## Policy settings

You can apply [Azure Policies](../governance/policy/index.yml) to your managed application to specify compliance requirements for the deployed solution. For policy definitions and the format of the parameter values, see [Azure Policy Samples](../governance/policy/samples/index.md).

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

- [Create an Azure application offer](azure-app-offer-setup.md)
