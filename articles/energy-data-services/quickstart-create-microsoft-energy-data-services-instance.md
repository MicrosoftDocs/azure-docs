---
title: Create a Microsoft Energy Data Services Preview instance #Required; page title is displayed in search results. Include the brand.
description: Quickly create a Microsoft Energy Data Services Preview instance #Required; article description that is displayed in search results. 
author: nitinnms #Required; your GitHub user alias, with correct capitalization.
ms.author: nitindwivedi #Required; microsoft alias of author; optional team alias.
ms.service: energy-data-services #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 08/18/2022
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Quickstart: Create a Microsoft Energy Data Services Preview instance

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

In this quickstart, you'll learn how to create and deploy a Microsoft Energy Data Services instance. 

Microsoft Energy Data Services (or MEDS, in short) is a managed Platform-as-a-service (PaaS) offering from Microsoft that builds on top of the [OSDU&trade;](https://osduforum.org/) data platform. MEDS lets you ingest, transform, and export subsurface data by letting you connect your consuming in-house or third-party applications.

## Before you start

- The entire setup of Microsoft Energy Data Services instance, including the preparation and installation will take about 50 minutes.


## Prerequisites

| Prerequisite | Details |
| ------------ | ------- |
Active Azure Subscription | You'll need the Azure subscription ID and the region where you want to install Microsoft Energy Data Services. Choose one of the regions listed in the Regions supported section.
Application ID | You'll need an application ID (often referred to as "App ID" or a "client ID"). This application ID will be used for authentication to Azure Active Directory and will be associated with your Microsoft Energy Data Services instance. Follow the steps below if you don't have one.

#### Creating an Application ID

1. Log in to the [Azure portal](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden)

1. Navigate to Azure Active Directory and open *App registration* in the left-hand pane.

1. Select *+ New application*.

1. Add a redirect URI.


1. *Save* your application registration. 

1. Add a client secret with the steps laid out in [this documentation](/articles/active-directory/develop/quickstart-register-app.md)

> [!NOTE]
> Note down your **Application (client) ID** and **client secret** for future use

## Create a Microsoft Energy Data Services instance

> [!IMPORTANT]
> *Microsoft Energy Data Services* is available on the Azure Marketplace only if you use the below Azure portal link.

1. Log in to [Microsoft Azure Marketplace](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_OpenEnergyPlatformHidden)


1. Select your account in the top-right corner and switch to the Azure AD tenant where you want to install Microsoft Energy Data Services instance.

1. Go to Azure Marketplace within the portal and search for *Microsoft Energy Data Services* in the Marketplace.

    [![Screenshot of the search result on Azure Marketplace that shows Microsoft energy data services. Microsoft Energy data services shows as a card.](media/quickstart-create-microsoft-energy-data-services-instance/search-meds-on-azure-marketplace.png)](media/quickstart-create-microsoft-energy-data-services-instance/search-meds-on-azure-marketplace.png#lightbox)

1. A new window with an overview of **Microsoft Energy Data Services** appears. Select **Create**.

1. A new window appears. Complete the sign-up process by choosing the correct subscription, resource group, and location to which you want to create an instance of **Microsoft Energy Data Services**.

    Some naming conventions to guide you at this step:

    | Field | Name Validation | 
    | ----- | --------------- |
    Instance name | Only alphanumeric characters are allowed, and the value must be 1-15 characters long.
    Application ID | Enter the valid Application ID that you generated and saved in the last section.
    Data Partition name | Name should be 1-10 char long consisting of lowercase alphanumeric characters and hyphens. It should start with an alphanumeric character and shouldn't contain consecutive hyphens.

    [![Screenshot of the basic details page after you select 'create' for Microsoft energy data services. This page allows you to enter both instance and data partition details.](media/quickstart-create-microsoft-energy-data-services-instance/input-basic-details.png)](media/quickstart-create-microsoft-energy-data-services-instance/input-basic-details.png#lightbox)


1. Select **Next: Tags** and enter any tags that you would want to specify. If nothing, this field can be left blank.

    [![Screenshot of the tags tab on the create workflow. Any number of tags can be added and will show up in the list.](media/quickstart-create-microsoft-energy-data-services-instance/input-tags.png)](media/quickstart-create-microsoft-energy-data-services-instance/input-tags.png#lightbox)

1. Select Next: **Review + Create**.

1. Once the basic validation tests have been passed, review the Terms and Basic Details. Select **Create** to start the deployment.

    [![Screenshot of the review tab. It shows that data validation happens before you start deployment.](media/quickstart-create-microsoft-energy-data-services-instance/validation-check-after-entering-details.png)](media/quickstart-create-microsoft-energy-data-services-instance/validation-check-after-entering-details.png#lightbox)

1. At this stage, you can also download an Azure Resource Manager (ARM) template to use for automated deployments of Microsoft Energy Data Services in future.  

    [![Screenshot of the template that opens up when you select 'download template for automation'. Options are available to download or deploy from this page.](media/quickstart-create-microsoft-energy-data-services-instance/automate-deploy-resource-using-azure-resource-manager.png)](media/quickstart-create-microsoft-energy-data-services-instance/automate-deploy-resource-using-azure-resource-manager.png#lightbox)

1. Sit back and relax while the deployment happens in the background. Review the details of the instance created.

    [![Screenshot of the deployment completion page. Options are available to view details of the deployment.](media/quickstart-create-microsoft-energy-data-services-instance/deployment-complete.png)](media/quickstart-create-microsoft-energy-data-services-instance/deployment-complete.png#lightbox)

 
## Uninstall

To uninstall a Microsoft Energy Data Services instance, complete the following steps:

1. Sign in to the Azure portal and **delete the resource groups** in which these components are installed.

2. Go to Azure Active Directory and **delete the Azure AD application** linked to the Microsoft Energy Data Services installation.

## Next steps

After installing a Microsoft Energy Data Services instance, you can learn about user management on this instance.

> [!div class="nextstepaction"]
> [How to manage users](how-to-manage-users.md)
