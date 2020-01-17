---
title: Create a new Azure Apps offer in the Commercial Marketplace 
description: How to create a new Azure Apps offer for listing or selling in the Azure Marketplace, AppSource, or through the Cloud Solution Provider (CSP) program using the Commercial Marketplace portal on Microsoft Partner Center. 
author: MaggiePucciEvans 
manager: evansma
ms.author: evansma
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 11/21/2019
---

# Create an Azure application offer

The steps for publishing an Azure application offer in commercial marketplace are outlined here.

## Azure application offer type

This topic outlines fundamentals about Azure application offers.  You should be familiar with these concepts before starting the process of publishing a new Azure application offer in the Marketplace.

### Publishing overview

The video [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603) is an introduction to the Azure application offer type:

* What offer types are available;
* What technical assets are required;
* How to author an Azure Resource Manager template;
* Developing and testing the app UI;
* How to publish the app offer;
* The application review process.

### Types of Azure application plans

There are two kinds of Azure application plans, managed applications and solution templates.

* **Solution template** is one of the main ways to publish a solution in the Marketplace. This plan type is used when your solution requires additional deployment and configuration automation beyond a single virtual machine (VM).  With a solution template, you can automate providing of more than one resource, including VMs, networking, and storage resources to provide complex IaaS solutions.  For more information about building solution templates, see the [Azure Resource Manager](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview) documentation.

* **Managed application** is similar to solution templates, with one key difference. In a managed application, the resources are deployed to a resource group that's managed by the publisher of the app. The resource group is present in the consumer's subscription, but an identity in the publisher's tenant has access to the resource group. As the publisher, you specify the cost for ongoing support of the solution. Use Managed applications to easily build and deliver fully managed, turnkey applications to your customers.  For more information about the advantages and types of managed applications, see the [Azure managed applications overview](https://docs.microsoft.com/azure/managed-applications/overview).

All Azure applications include at least two files in the root folder of a `.zip` archive:

* A Resource Manager template file named [mainTemplate.json](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).  This is the template that defines the resources to deploy into the customer's Azure subscription.  For examples of Resource Manager templates, see the [Azure Quickstart Templates gallery](https://azure.microsoft.com/resources/templates/) or the corresponding [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates) repo.

* A user interface definition for the Azure application creation experience named [createUiDefinition.json](https://docs.microsoft.com/azure/managed-applications/create-uidefinition-overview).  In the user interface, you specify elements that enable consumers to provide parameter values.

All new Azure application offers must include an [Azure partner customer usage attribution GUID](https://docs.microsoft.com/azure/marketplace/azure-partner-customer-usage-attribution).

### Before you begin

Review the following Azure application documentation, which provides Quickstarts, Tutorials, and Samples.

* [Understand Azure Resource Manager Templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates)
* Quickstarts:

    * [Azure Quickstart templates](https://azure.microsoft.com/documentation/templates/)
    * [GitHub Azure Quickstart templates](https://github.com/azure/azure-quickstart-templates)
    * [Publish application definition](https://docs.microsoft.com/azure/managed-applications/publish-managed-app-definition-quickstart)
    * [Deploy service catalog app](https://docs.microsoft.com/azure/managed-applications/deploy-service-catalog-quickstart)

* Tutorials:

    * [Create definition files](https://docs.microsoft.com/azure/managed-applications/publish-service-catalog-app)
    * [Publish marketplace application](https://docs.microsoft.com/azure/managed-applications/publish-marketplace-app)

* Samples:

    * [Azure CLI](https://docs.microsoft.com/azure/managed-applications/cli-samples)
    * [Azure PowerShell](https://docs.microsoft.com/azure/managed-applications/powershell-samples)
    * [Managed application solutions](https://docs.microsoft.com/azure/managed-applications/sample-projects)

### Fundamentals in technical knowledge

Designing, building, and testing these assets take time and requires technical knowledge of both the Azure platform and the technologies used to build the offer.

Your engineering team should have knowledge about the following Microsoft technologies:

* Basic understanding of [Azure Services](https://azure.microsoft.com/services/).
* How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/).
* Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking).
* Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/).
* Working knowledge of [JSON](https://www.json.org/).

### Suggested tools

Choose one or both of the following scripting environments to help manage your Azure application:

* [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview)
* [Azure CLI](https://docs.microsoft.com/cli/azure)

We recommend adding the following tools to your development environment:

* [Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer)
* [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
    * Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
    * Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
    * Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

You can review the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/) page.  Also if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Create an Azure application offer

Before you can create an Azure application offer, you must first [Create a Partner Center account](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) and open the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/offers), with the **Overview** tab selected.

>[!Note]
>Once an offer is published, edits to the offer made in Partner Center will only be updated in the system and storefronts after re-publishing.  Please ensure that you submit the offer for publication after you changes are made.

### Create a new offer

Select the **+ New offer** button, then select the **Azure Application** menu item. The **New offer** dialog box will appear.

### Offer ID and alias

* **Offer ID**: A unique identifier for each offer in your account. This ID will be visible to customers in the URL address for the marketplace offer and Azure Resource Manager templates (if applicable). <br> <br> Your Offer ID must be lowercase alphanumeric characters (including hyphens and underscores, but no whitespace). It is limited to 50 characters and can’t be changed after you select Create. <br> <br> For example, if you enter `test-offer-1` here, the offer URL will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`. 

* **Offer alias**: The name used to refer to the offer within the Partner Center. This name won't be used in the marketplace and is different from the offer name and other values that will be shown to customers. This value can't be changed after you select **Create**.

Once you have entered your **Offer ID** and **Offer alias**, select **Create**. You'll then be able to work on all other parts of your offer.

## Offer setup

The **Offer setup** page asks for the following information. Be sure to select **Save** after completing these fields.

### Test drive

A test drive is a great way to showcase your offer to potential customers by giving them the option to 'try before you buy', resulting in increased conversion and the generation of highly qualified leads. [Learn more about test drives.](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/what-is-test-drive)

To enable a test drive, check the **Enable a test drive** box. You'll then need to configure a demonstration environment in the [Test drive technical configuration](#types-of-azure-application-plans) configure to let customers try your offer for a fixed period of time. 

>[!Note]
>Because all Azure applications are implemented using an Azure Resource Manager template, the only type of test drive that can be configured for an Azure Application is an [Azure Resource Manager based test drive](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/azure-resource-manager-test-drive).

#### Additional test drive resources

- [Test Drive Technical Best Practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Test Drive Marketing Best Practices](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/marketing-and-best-practices)
- [Test Drive Overview One Pager](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf)

## Connect lead management

[!INCLUDE [Connect lead management](./includes/connect-lead-management.md)]

For more information, see [Lead management overview](./commercial-marketplace-get-customer-leads.md).

Remember to **Save** before moving on to the next section!

## Properties

The **Properties** page lets you define the categories and industries used to group your offer on the marketplace, your app version, and the legal contracts supporting your offer. Select **Save** after completing this page.

### Category

Select a minimum of one and a maximum of three categories, which will be used to place your offer into the appropriate marketplace search areas. Be sure to call out how your offer supports these categories in the offer description. 

### Standard Marketplace terms and conditions

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a Standard Contract template in order to help facilitate a transaction in the marketplace.

Rather than crafting custom terms and conditions, you can choose to offer your software under the Standard Contract, which customers only need to vet and accept once.

The Standard Contract can be found here: https://go.microsoft.com/fwlink/?linkid=2041178

To use the Standard Contract, check the **Use Standard Contract?** box.

#### Terms of use

If you do not check the **Use Standard Contract?** box, you'll need to provide your own legal terms of use in the **Terms of use** field. Enter up to 10,000 characters of text, or, if your terms of use require a longer description, provide the URL where your additional license terms can be found. Customers will be required to accept these terms before they can try your app.

## Offer listing

The Offer listing page displays the languages in which your offer will be listed. Currently, **English (United States)** is the only available option.

You will need to define marketplace details (offer name, description, images, etc.) for each language/market. Select the language/market name to provide this info.

> [!NOTE]
> Offer listing content (such as the description, documents, screenshots, terms of use, etc.) is not required to be in English, as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful Link URL* to offer content in a language other than the one used in the Offer listing content.

### Name

The name you enter here will be shown to customers as the title of your offer listing. This field is prepopulated with the text you entered for **Offer alias** when you created the offer, but you can change this value. This name may be trademarked (and you may include trademark or copyright symbols). The name can't be more than 50 characters and can't include any emojis.

### Summary

Provide a short description of your offer (up to 100 characters), which may be used in marketplace search results.

### Long summary

Provide a longer description of your offer (up to 256 characters). The description may be used in marketplace search results.

### Description

Provide a longer description of your offer (up to 3,000 characters). This description will be displayed to customers in the marketplace listing overview. Include your offer's value proposition, key benefits, category and/or industry associations, in-app purchase opportunities, and any required disclosures. 

Some tips for writing your description:  

- Clearly describe your offer's value proposition in the first few sentences of your description. Include the following items in your value proposition:
  - Description of the product
  - The type of user that benefits from the product
  - Customer needs or pain that the product addresses
- Keep in mind that the first few sentences might be displayed in search engine results.  
- Do not rely on features and functionality to sell your product. Instead, focus on the value you deliver.  
- Use industry-specific vocabulary or benefit-based wording as much as possible. 
- Consider using HTML tags to format your description and make it more engaging.

### Search keywords

You can optionally enter up to three search keywords to help customers find your offer in the marketplace. For best results, try to use these keywords in your description as well.

### Support URLs

This section lets you provide links to help customers understand more about your offer.

#### Privacy policy URL

Enter the URL to your organization's privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations, and for providing a valid privacy policy.

#### Useful links

Provide optional supplemental online documents about your solution.  Add additional useful links by clicking **+ Add a link**.

### Contacts

In this section, you must provide the name, email, and phone number for a **Support contact** and an **Engineering contact**. This info is not shown to customers, but will be available to Microsoft, and may be provided to CSP partners.

In the **Support contact** section, you must also provide the **Support URL** where CSP partners can find support for your offer.

### Marketplace images

In this section, you can provide logos and images that will be used when showing your offer to customer. All images must be in .png format.

#### Store logos

Provide your offer's logo in three sizes: **Small (48 x 48)**, **Medium (90 X 90)**, and **Large (216 x 216)**.

#### Hero

The hero image is optional. If you provide one, it must measure 815 x 290 pixels.

#### Screenshots

Add screenshots that show how your offer works. You can add up to five screenshots. All screenshots must be 1280 x 720 pixels.

#### Videos

You can optionally add up to five videos that demonstrate your offer. These videos should be hosted on YouTube and/or Vimeo. For each one, enter the video's name, its URL, and a thumbnail image of the video (1280 x 720 pixels).

#### Additional marketplace listing resources

- [Best practices for marketplace offer listings](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices)

## Preview

The **Preview** tab enables you to define a limited **Preview Audience** for validating your offer prior to publishing your offer live to the broader marketplace audience.

> [!IMPORTANT]
> You must select **Go live** before your offer will be published live to the marketplace public audience after checking your offer in Preview.

Your preview audience is identified by Azure subscription ID GUIDs, paired with an optional description for each.  Neither of these fields are visible to customers.

Add up to 10 Azure subscription IDs manually, or up to 100 if uploading a CSV file.  By adding these subscriptions, you are defining an audience that will be allowed preview access to your offer before it is fully published.  If your offer is already live, you may still define a preview audience for testing any changes or updates to your offer.

>[!Note]
>The preview audience differs from a private audience. A preview audience is allowed access to your offer *prior* to being published live in the marketplaces. You may also choose to create a plan and make it available only to a private audience (using the plan Availability tab).  Your preview audience will be able to see and validate all plans, including plans which will be available only to a private audience once your offer is fully published to the marketplace.

## Plan overview

The **Plan overview** tab enables you to provide different plan options within the same offer. These plans (referred to as SKUs in the Cloud Partner Portal) can differ in terms of plan type (solution template vs. managed application), monetization, or audience.  Configure at least one plan in order to list your offer in the marketplace.

Once created, you will see your plan names, IDs, plan type, availability (Public or Private), current publishing status, and any available actions on this tab.

**Actions** available in the **Plan overview** vary depending on the current status of your plan and may include:

* If the plan status is **Draft** – Delete draft.
* If the plan status is **Live** – Stop sell plan or Sync private audience.

### Create new plan

***Plan ID*** - Create a unique plan ID for each plan in this offer. This ID will be visible to customers in the product URL.  Use only lowercase, alphanumeric characters, dashes, or underscores. A maximum of 50 characters are allowed for this plan ID. This ID cannot be modified after selecting create.

***Plan name*** - Customers will see this name when deciding which plan to select within your offer. Create a unique offer name for each plan in this offer. The plan name is used to differentiate software plans that may be a part of the same offer (E.g. Offer name: Windows Server; plans: Windows Server 2016, Windows Server 2019).

### Plan setup

The **Plan setup** tab enables you to set the high-level configuration for the type of plan, whether it reuses packages from another plan, and what clouds the plan should be available in.  Your answers on this tab will affect which fields are displayed on other tabs for the same plan.

#### Plan type

As outlined in the [Types of Azure application plans](#types-of-azure-application-plans), select whether your plan will contain a solution template or a managed application.

#### This plan reuses packages

If you have more than one plan of the same type and the packages are identical between them, you may select **this plan reuses packages from another plan**.  When you select this option, you will be able to select one of the other plans of the same type for this offer to reuse packages from. 

>[!Note]
>When you re-use packages from another plan, the entire Technical configuration tab will disappear from this plan.  The Technical configuration details from the other plan, including any updates that you make in the future, will be used for this plan as well. <br> <br> Also, this setting cannot be changed once this plan is published.

#### Cloud availability

This plan must be made available in at least one cloud. 

Select the **Public Azure** option to make your solution deployable to customers in all public Azure regions that have Marketplace integration.  Learn more about [geographic availability](https://docs.microsoft.com/azure/marketplace/marketplace-geo-availability-currencies).

Select the **Azure Government Cloud** option to make your solution deployable in the [Azure Government Cloud](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome), a government-community cloud with controlled access for customers from the US Federal, State, local or tribal and partners eligible to serve these entities.  You, as the publisher, are responsible for any compliance controls, security measures, and best practices to serve this cloud community.  Azure Government uses physically isolated data centers and networks (located in U.S. only).  Before publishing to the [Azure Government](https://aka.ms/azuregovpublish), Microsoft recommends that you test and validate your solution in the environment as certain endpoints may differ. To stage and test your solution, request a trial account from this [link](https://azure.microsoft.com/global-infrastructure/government/request/).

>[!Note]
>Once a plan is published as available in a specific cloud, that cloud cannot be removed.

**Azure Government Cloud certifications**

This option is only visible if **Azure Government Cloud** is selected under **Cloud availability**.

Azure Government services handle data that is subject to certain government regulations and requirements, such as FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS.  To bring awareness to your certifications for these programs, you can provide up to 100 links describing your certifications.  These links can be either links to your listing on the program directly, or a links to descriptions of your compliance with them on your own websites.  These links will only be visible to Azure Government Cloud customers.

## Plan listing

The **plan listing** tab displays the plan-specific listing information that can be different between different plans for the same offer.

### Name

Pre-populated based on your name you assigned your plan when you created it.  This name will appear as the title of this "Software plan" displayed in the marketplace.  May contain up to 100 characters.

### Summary

Provide a short summary of your software plan.  May contain up to 100 characters.

### Description

This description is an opportunity to explain what makes this software plan unique and any differences from other software plans within your offer. May contain up to 2,000 characters.

Select **Save** after completing these fields.

## Availability

The **Availability** tab is visible to solution template plans only.  You can make the plan visible to everyone, only to specific customers (a private audience), and whether to make the plan hidden for use by other solution template or managed applications only.

### Plan Audience

You have the option to configure each plan to be visible to everyone or to only a specific audience of your choosing. You can assign membership in this restricted audience using Azure subscription IDs.

**Privacy / This is a private plan** (Optional checkbox) - Check this box to make your plan private and visible only to the restricted audience of your choosing. Once published as a private plan, you can update the audience or choose to make the plan available to everyone. Once a plan is published as visible to everyone, it must remain visible to everyone. (The plan cannot be configured as a private plan again).

**Restricted Audience (Azure subscription IDs)** - Assign the audience that will have access to this private plan. Access is assigned using Azure subscription IDs with the option to include a description of each Azure subscription ID assigned. A maximum of 10 subscription IDs can be added, or 20,000 customers subscription IDs if importing a .csv spreadsheet file.  Azure subscription IDs are represented as GUIDs, and letters must be lower-cased.

>[!Note]
>The private audience (or restricted audience) differs from the preview audience you defined in the [**Preview**](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-saas-offer#preview) tab.  A preview audience is allowed access to your offer *prior* to the offer being published live in the marketplace. While the private audience designation only applies to a specific plan, the preview audience can view all plans (private or not) for validation purposes.

### Hide plan

If your solution template is intended to be deployed only indirectly when referenced though another solution template or managed application, check this box to publish your solution template but hide it from customers searching and browsing for it directly.

## Pricing and availability

The **Pricing and availability** tab is visible to managed application plans only.  You can configure the markets that this plan will be available in, the price per month of the management of the solution, and whether to make the plan visible to everyone or only to specific customers (a private audience).

### Markets

Every plan must be available in at least one market. Select the checkbox for any market location where you would like to make this plan available. A search box and button for selecting "Tax Remitted" countries, in which Microsoft remits sales and use tax on your behalf, are included to help.

If you have already set prices for your plan in United States Dollars (USD) and add another market location, the price for the new market will be calculated according to the current exchange rates. Always review the price for each market before publishing. Pricing can be reviewed by using the "Export prices (xlsx)" link after saving your changes.

### Pricing

Provide the per-month price for this plan.  This price is in addition to any Azure infrastructure or pay-as-you-go software costs incurred by the resources deployed by this solution.

Prices set in local currency (USD = United States Dollar) are converted into the local currency of all selected markets using the current exchange rates available during setup. Validate these prices before publishing by exporting the pricing spreadsheet and reviewing the price in each market. If you would like to set custom prices in an individual market, modify and import the pricing spreadsheet. 

>[!Note]
>You must first save your pricing changes to enable export of pricing data.

Review your prices carefully before publishing, as there are some restrictions on what can change after a plan is published.  

>[!Note]
>Once a price for a market in your plan is published, it can't be changed later.

### Plan Audience

You have the option to configure each plan to be visible to everyone or to only a specific audience of your choosing. You can assign membership in this restricted audience using Azure subscription IDs.

**Privacy / This is a private plan** (Optional checkbox) - Check this box to make your plan private and visible only to the restricted audience of your choosing. Once published as a private plan, you can update the audience or choose to make the plan available to everyone. Once a plan is published as visible to everyone, it must remain visible to everyone. (The plan cannot be configured as a private plan again).

**Restricted Audience (Azure subscription IDs)** - Assign the audience that will have access to this private plan. Access is assigned using Azure subscription IDs with the option to include a description of each Azure subscription ID assigned. A maximum of 10 subscription IDs can be added, or 20,000 customers subscription IDs if importing a .csv spreadsheet file.  Azure subscription IDs are represented as GUIDs, and letters must be lower-cased.

>[!Note]
>The private audience (or restricted audience) differs from the preview audience you defined in the [**Preview**](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-saas-offer#preview) tab.  A preview audience is allowed access to your offer *prior* to the offer being published live in the marketplace. While the private audience designation only applies to a specific plan, the preview audience can view all plans (private or not) for validation purposes.

## Technical configuration 

The **technical configuration** tab allows you to upload the deployment package that will enable customers to deploy your plan.

>[!Note]
>This tab will not be visible if you configured this plan to re-use packages from another plan on the **Plan setup** tab.

### Package details

The **Package details** subtab enables you to edit the draft version of your technical configuration.

***Version*** - Assign the current version of the technical configuration.  Increment this version each time you publish a change to this page. Version must be in the format `{integer}.{integer}.{integer}`.

***Package file*** (`.zip`) - This package contains all of the template files needed for this plan, as well as any additional resources, packaged as a `.zip` file.

All Azure application plan packages must include these two files in the root folder of a `.zip` archive:

* A Resource Manager template file named [mainTemplate.json](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).  This template automates the deployment of resources into the customers Azure subscription.  For examples of Resource Manager templates, see the [Azure Quickstart Templates gallery](https://azure.microsoft.com/documentation/templates/) or the corresponding [GitHub: Azure Resource Manager Quickstart Templates](https://github.com/azure/azure-quickstart-templates) repo.

* A user interface definition for the Azure application creation experience named [createUiDefinition.json](https://docs.microsoft.com/azure/azure-resource-manager/managed-application-createuidefinition-overview).

All new Azure application offers must also include an [Azure partner customer usage attribution](https://docs.microsoft.com/azure/marketplace/azure-partner-customer-usage-attribution) GUID.

### Previously published packages 

The **Previously published packages** subtab enables you to view all published versions of your technical configuration.

## Technical configuration (managed application plans only)

Managed application plans have additional complexity on the **Technical configuration** tab beyond the **Version** and **Package file** fields described above. 

### Enable just-in-time (JIT) access

Select this option to enable Just-in-time (JIT) access for this plan.  JIT access enables you to request elevated access to a managed application's resources for troubleshooting or maintenance. You always have read-only access to the resources, but for a specific time period you can have greater access.  For more information, see [Enable and request just-in-time access for Azure Managed Applications](https://docs.microsoft.com/azure/managed-applications/request-just-in-time-access).  To require that consumers of your managed application grant your account permanent access, leave this option unchecked.

>[!Note]
>Be sure to update your `createUiDefinition.json` file in order to support this feature.  

### Deployment mode

Select whether to configure **Complete** or **Incremental deployment mode** when deploying this plan: 

* In **complete mode**, a redeployment of the application by the customer will result in removal of resources in the managed resource group if the resources are not defined in the `mainTemplate.json`. 
* In **incremental mode**, a redeployment of the application leaves existing resources unchanged.

To learn more about deployment modes, see [Azure Resource Manager deployment modes](https://docs.microsoft.com/azure/azure-resource-manager/deployment-modes).

### Notification endpoint URL

Specify an HTTPS Webhook endpoint to receive notifications about all CRUD operations on managed application instances of this plan version.

### Customize allowed customer actions

Select this option to specify which actions customers can perform on the managed resources in addition to the “`*/read`” actions that is available by default. 

List the additional actions you would like to enable your customer to perform here, separated by semicolons.  For more information, see [Understanding deny assignments for Azure resources](https://docs.microsoft.com/azure/role-based-access-control/deny-assignments).  For available actions, see [Azure Resource Manager resource provider operations](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations). For example, to permit consumers to restart virtual machines, add `Microsoft.Compute/virtualMachines/restart/action` to the allowed actions.

### Global Azure / Azure Government Cloud

Indicate who should have management access to this managed application in each supported cloud.  Users, groups, or applications that you want to be granted permission to the managed resource group are identified using Azure Active Directory (AAD) identities.

***Azure Active Directory Tenant ID*** - The AAD Tenant ID (also known as directory ID) containing the identities of the users, groups, or applications you want to grant permissions to.  You can find your AAD Tenant ID on the Azure portal, in [Properties for Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Properties).

***Authorizations*** - Add the Azure Active Directory object ID of the user, group, or application that you want to be granted permission to the managed resource group. Identify the user by their Principal ID, which can be found at the [Azure Active Directory users blade on the Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers).

For each principal, select one of the Azure AD built-in roles from the list (Owner or Contributor). The role you select will describe the permissions the principal will have on the resources in the customer subscription. For more information, see [Built-in roles for Azure resources](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).  For more information about role-based access control (RBAC), see [Get started with RBAC in the Azure portal](https://docs.microsoft.com/azure/role-based-access-control/overview).

>[!Note]
>Although you may add up to 100 authorizations per cloud, it’s generally easier to create an Active Directory user group and specify its ID in the "Principal ID."  This will enable you to add more users to the management group after the plan is deployed and reduce the need to update the plan just to add more authorizations.

### Policy settings

Apply [Azure Policies](https://docs.microsoft.com/azure/governance/policy/overview) to your managed application to specify compliance requirements for the deployed solution.  For policy definitions and the format of the parameter values, see [Azure Policy Samples](https://docs.microsoft.com/azure/governance/policy/samples/index).  You can configure a maximum of five policies, and only one instance of each Policies option.  Some policies require additional parameters.  The Standard SKU is required for audit policies.  Policy Name is limited to 50 characters.

## Co-Sell

Providing information on the Cosell tab is entirely optional for publishing your offer. It is required to achieve Co-sell Ready and IP Co-sell Ready status. The information you provide will be used by Microsoft sales teams to learn more about your solution when evaluating its fit for customer needs. It is not available directly to customers.

For more information about completing this tab, see [Co-sell option in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-co-sell).

## Test drive

The **Test drive** tab enables you to set up a demonstration (or "test drive") which will enable customers to try your offer before committing to purchase it. Learn more in the article [What is Test Drive?](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/what-is-test-drive)  If you no longer want to provide a test drive for your offer, return to the **Offer setup** page and uncheck **Enable test drive**.

### Technical configuration

Azure Applications inherently use the Azure Resource Manager test drive type.  See [Technical configuration for Azure Resource Manager test drive](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-customer-engagement-offer#technical-configuration-for-azure-resource-manager-test-drive) for more information.

### Deployment subscription details

In order to deploy the Test Drive on your behalf, please create and provide a separate, unique Azure Subscription. (Not required for Power BI test drives).

- **Azure subscription ID** (required for Azure Resource Manager and Logic apps): Enter the subscription ID to grant access to your Azure account services for resource usage reporting and billing. We recommend that you consider [creating a separate Azure subscription](https://docs.microsoft.com/azure/billing/billing-create-subscription) to use for test drives if you don't have one already. You can find your Azure subscription ID by logging in to the [Azure portal](https://portal.azure.com/) and navigating to the **Subscriptions** tab of the left-side menu. Selecting the tab will display your subscription ID (e.g. "a83645ac-1234-5ab6-6789-1h234g764ghty").

- **Azure AD tenant ID** (required): Enter your Azure Active Directory (AD) [tenant ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To find this ID, sign in to the [Azure portal](https://portal.azure.com/), select the Active Directory tab in the left-menu, select **Properties, then look for the **Directory ID** number listed (e.g. 50c464d3-4930-494c-963c-1e951d15360e). You can also look up your organization's tenant ID using your domain name URL at:  [https://www.whatismytenantid.com](https://www.whatismytenantid.com).

- **Azure AD tenant name** (required for Dynamic 365): Enter your Azure Active Directory (AD) name. To find this name, sign in to the [Azure portal](https://portal.azure.com/), in the upper right corner your tenant name will be listed under your account name.

- **Azure AD app ID** (required): Enter your Azure Active Directory (AD) [application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To find this ID, sign in to the [Azure portal](https://portal.azure.com/), select the Active Directory tab in the left-menu, select **App registrations**, then look for the **Application ID** number listed (e.g. 50c464d3-4930-494c-963c-1e951d15360e).

- **Azure AD app client secret** (required): Enter your Azure AD application [client secret](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#certificates-and-secrets). To find this value, sign in to the [Azure portal](https://portal.azure.com/). Select the **Azure Active Directory** tab in the left menu, select **App registrations**, then select your test drive app. Next, select **Certificates and secrets**, select **New client secret**, enter a description, select **Never** under **Expires**, then choose **Add**. Make sure to copy down the value. (Don't navigate away from the page before you have copied the value, or else you won't have access to the value.)

Remember to **Save** before moving on to the next section!

### Test drive listings (optional)

The **Test Drive listings** option found under the **Test drive** tab displays the languages (and markets) where your test drive is available, currently English (United States) is the only location available. Additionally, this page displays the status of the language-specific listing and the date/time that it was added. You will need to define the test drive details (description, user manual, videos, etc.) for each language/market.

- **Description** (required): Describe your test drive, what will be demonstrated, objectives for the user to experiment with, features to explore, and any relevant information to help the user determine whether to acquire your offer. Up to 3,000 characters of text can be entered in this field. 

- **Access information** (required for Azure Resource Manager and Logic test drives): Explain what a customer needs to know in order to access and use this test drive. Walk through a scenario for using your offer and exactly what the customer should know to access features throughout the test drive. Up to 10,000 characters of text can be entered in this field.

- **User Manual** (required): An in-depth walkthrough of your test drive experience. The User Manual should cover exactly what you want the customer to gain from experiencing the test drive and serve as a reference for any questions that they may have. The file must be in PDF format and be named (255 characters max) after uploading.

- **Videos: Add videos** (optional): Videos can be uploaded to YouTube or Vimeo and referenced here with a link and thumbnail image (533 x 324 pixels) so that a customer can view a walk-through of information to help them better understand the test drive, including how to successfully use the features of your offer and understand scenarios that highlight their benefits.
  - **Name** (required)
  - **URL (YouTube or Vimeo only)** (required)
  - **Thumbnail (533 x 324 px)**: Image file must be in PNG format.

Select **Save** after completing these fields.

## Publish

### Submit offer to preview

Once you have completed all the required sections of the offer, select **publish** in the top-right corner of the portal. You will be redirected to the **Review and publish** page. 

If it is your first time publishing this offer, you can:

- See the completion status for each section of the offer.
    - *Not started* - means the section has not been touched and needs to be completed.
    - *Incomplete* - means the section has errors that need to be fixed or requires more information to be provided. Please go back to the section(s) and update it.
    - *Complete* - means the section is complete, all required data has been provided and there are no errors. All sections of the offer must be in a complete state before you can submit the offer.
- Provide testing instructions to the certification team to ensure that your app is tested correctly, in addition to any supplementary notes helpful for understanding your app.
- Submit the offer for publishing by selecting **Submit**. We will send you an email to let you know when a preview version of the offer is available for you to review and approve. Return to Partner Center and select **Go-live** for the offer to publish your offer to the public (or if a private offer, to the private audience).

### Errors and review feedback

The **Manual validation** step in the publishing process represents an extensive review of your offer and its associated technical assets (especially the Azure Resource Manager template), issues are typically presented as pull request (PR) links. An explanation of how to view and respond to these PRs, see [Handling review feedback](./azure-apps-review-feedback.md).

If you encountered errors in one or more of the publishing steps, you must correct them and republish your offer.

## Next steps

- [Update an existing offer in the Commercial Marketplace](./update-existing-offer.md)
