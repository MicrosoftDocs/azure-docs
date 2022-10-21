---
title: Configure a VM test drive
description: Configure a VM test drive in Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 03/15/2022
ms.custom: devx-track-azurepowershell
---

# Configure a VM test drive

A test drive lets customers try your offer prior to purchase by giving them access to a preconfigured environment for a fixed number of hours, resulting in highly qualified leads and an increased conversion rate.

For VM offers, Azure Resource Manager (ARM) deployment is the **only** test drive option available. The deployment template must contain all the Azure resources that comprise your solution.

To see the **Test drive** tab in left-nav menu, select the **Test drive** check box on the [Offer setup](azure-vm-offer-setup.md#test-drive-optional) page and connect to your CRM system. After you select **Save**, the **Test drive** tab appears with two sub-tabs:

- **[Technical configuration](#technical-configuration)** – Configure your test drive and provide your ARM template (next section below).
- **[Marketplace listing](#marketplace-listing)** – Provide additional details of your listing and supplemental resources for your customers, such as user manuals and videos.

## Technical configuration

### Regions

Select **Edit regions** and select the check box for each region in which you want the test drive to be available. Or, at the top right, use the **Select all** or **Unselect all** links as appropriate. For best performance, choose only the regions where you expect the largest number of customers to be located, and ensure your subscription is allowed to deploy all needed resources there. When you've finished selecting regions, select **Save**.

### Instances

Enter values between 0-99 in the boxes to indicate how many of Hot, Warm, or Cold instances you want available per region. The number of each instance type you specify will be multiplied by the number of regions where your offer is available.

- **Hot** – Pre-deployed instances that are always running and ready for your customers to instantly access (< 10 seconds acquisition time) rather than having to wait for a deployment. Since most customers don't want to wait for a full deployment, we recommended having at least one Hot instance, otherwise you may experience reduced customer usage. Since hot instances are always running on your Azure subscription, they incur a larger uptime cost.
- **Warm** – Pre-deployed instances that are then put in storage. Less expensive than hot instances while still being quick to reboot for your customers (3-10 minutes acquisition time).
- **Cold** – Instances that require the test drive ARM template to be deployed when requested by each customer. Cold instances are much slower to load relative to Hot and Warm instances. The wait time varies greatly based on the resources required (up to 1.5 hours). Cold instances are more cost-effective for you since the cost is only for the test drive duration, compared to always running on your Azure subscription as with a Hot instance.

### Technical configuration of ARM template

The ARM template for your test drive is a coded container of all the Azure resources that comprise your solution. To create the ARM deployment template you'll need for your test drive, see [Azure Resource Manager test drive](azure-resource-manager-test-drive.md#write-the-test-drive-template). Once your template is complete, return here to learn how to uploaded your ARM template and complete the configuration.

To publish successfully, it is important to validate the formatting of the ARM template. Two ways to do this are by using an [online API tool](/rest/api/resources/deployments/validate) or with a [test deployment](../azure-resource-manager/templates/deploy-portal.md). Once you are ready to upload your template, drag .zip file into the area indicated, or **Browse** for the file.

Enter a **Test drive duration**, in hours. This is the number of hours the test drive will stay active. The test drive terminates automatically after this time period ends.

### Deployment subscription details

For Microsoft to deploy the test drive on your behalf, connect to your Azure Subscription and Azure Active Directory (AAD) by completing the steps below, then select **Save draft**.

1. **Azure subscription ID** – This grants access to Azure services and the Azure portal. The subscription is where resource usage is reported and services are billed. Consider creating a [separate Azure subscription](../cost-management-billing/manage/create-subscription.md) to use for test drives if you don't have one already. You can find your Azure subscription ID by signing into the Azure portal and searching *Subscriptions* in the search bar.
2. **Azure AD tenant ID** – Enter your Azure Active Directory (AD) tenant ID by going to **Azure Active Directory** > **Properties** > **Directory ID** within the Azure portal. If you don't have a tenant ID, create a new one in Azure Active Directory. For help with setting up a tenant, see [Quickstart: Set up a tenant](../active-directory/develop/quickstart-create-new-tenant.md).
3. Before proceeding with the other fields, provision the Microsoft Test-Drive application to your tenant. We will use this application to perform operations on your test drive resources.
    1. If you don't have it yet, install the [Azure Az PowerShell module](/powershell/azure/install-az-ps).
    2. Add the Service Principal for Microsoft Test-Drive application.
        1. Run `Connect-AzAccount` and provide credentials to sign in to your Azure account, which requires the Azure active directory **Global Administrator** [built-in role](../active-directory/roles/permissions-reference.md).
        2. Create a new service principal: `New-AzADServicePrincipal -ApplicationId d7e39695-0b24-441c-a140-047800a05ede -DisplayName 'Microsoft TestDrive'`.
        3. Ensure the service principal has been created: `Get-AzADServicePrincipal -DisplayName 'Microsoft TestDrive'`.
            :::image type="content" source="media/test-drive/commands-to-verify-service-principal.png" alt-text="Shows how to ensure the principal has been created.":::
1. **Azure AD App ID** - After provisioning the Microsoft Test-Drive application to your tenant, then paste in this Application ID: `d7e39695-0b24-441c-a140-047800a05ede`.
1. **Azure AD app client secret** – No secret is required. Insert a dummy secret, such as "no-secret".
1. Since we are using the application to deploy to the subscription, we need to add the application as a contributor on the subscription. Do this using either the Azure portal or PowerShell:

    **Method 1: Azure portal**

    1. Select the Subscription being used for the test drive.
    2. Select **Access control (IAM)**.
    3. Select the **Role assignments** tab within the main window, then **+Add** and select **+ Add role assignment** from the drop-down menu.
    4. Enter this Azure AD application name: `Microsoft TestDrive`. Select the application to which you want to assign the **Contributor** role.
    5. Select **Save**.

    **Method 2: PowerShell**

    1. Run this to get the ServicePrincipal object-id: `(Get-AzADServicePrincipal -DisplayName 'Microsoft TestDrive').id`.
    2. Run this with the ObjectId and subscription ID: `New-AzRoleAssignment -ObjectId <objectId> -RoleDefinitionName Contributor -Scope /subscriptions/<subscriptionId>`.

Complete your test drive solution by continuing to the next **Test drive** tab in the left-nav menu, **Marketplace listing**.

## Marketplace listing

Provide additional details of your listing and resources for your customers.

**Description** – Describe your test drive, what will be demonstrated, features to explore, objectives for the user to experiment with, and other relevant information to help them determine if your offer is right for them (up to 5,000 characters).

**Access information** – Walk through a scenario for exactly what the customer needs to know to access and use the features throughout the test drive (up to 10,000 characters).

**User Manual** – Describe your test drive experience in detail. The manual should cover exactly what you want the customer to gain from experiencing the test drive and serve as a reference for questions. It must be in PDF format with a name less than 255 characters in length.

**Test drive demo video** (optional) – Reference a video hosted elsewhere with a link and thumbnail image. Videos are a great way to help customers better understand the test drive, including how to successfully use the features of your offer and understand scenarios that highlight their benefits. Select **Add video** and include the following information:

- **Name**
- **URL** – YouTube or Vimeo only
- **Thumbnail** – Image must be in PNG format, 533x324 pixels.

Select **Save draft** before continuing with **Next steps** below.

## Next steps

- [Review and publish your offer](review-publish-offer.md)