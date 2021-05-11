---
title: Create an Azure IoT Edge module offer with Partner Center in Azure Marketplace
description: Learn how to create, configure, and publish an IoT Edge module offer in Azure Marketplace using Partner Center.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: keferna
ms.author: keferna
ms.date: 08/07/2020
---

# Create an IoT Edge module offer

This article describes how to create and publish an Internet of Things (IoT) Edge module offer for Azure Marketplace. Before starting, [Create a Commercial Marketplace account in Partner Center](../create-account.md) if you haven't done so yet. Ensure your account is enrolled in the commercial marketplace program.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-nav menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview page, select **+ New offer** > **IoT Edge module**.

    ![Illustrates the left-navigation menu.](./media/new-offer-iot-edge.png)

> [!IMPORTANT]
> After an offer is published, edits made to it in Partner Center only appear in online stores after republishing the offer. Make sure you always republish after making changes.

### Offer ID and alias

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the marketplace offer and Azure Resource Manager templates, if applicable.
- Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if you enter **test-offer-1**, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
- The Offer ID can't be changed after you select **Create**.

Enter an **Offer alias**. This is the name used for the offer in Partner Center.

- This name isn't used in the marketplace and is different from the offer name and other values shown to customers.
- This can't be changed after you select **Create**.

Select **Create** to generate the offer and continue.

## Offer overview

The **Offer overview** page shows a visual representation of the steps required to publish this offer (both completed and upcoming) and how long each step should take to complete.

This page includes links to perform operations on this offer based on the selection you make. For example:

- If the offer is a draft - Delete draft offer
- If the offer is live - [Stop selling the offer](update-existing-offer.md#stop-selling-an-offer-or-plan)
- If the offer is in preview - [Go-live](../review-publish-offer.md#previewing-and-approving-your-offer)
- If you haven't completed publisher sign-out - [Cancel publishing.](../review-publish-offer.md#cancel-publishing)

## Offer setup

Follow these steps to set up your offer.

### Customer leads

When publishing your offer to the marketplace with Partner Center, you can optionally connect it to your Customer Relationship Management (CRM) system. This lets you receive customer contact information as soon as someone expresses interest in or uses your product.

1. Select a lead destination where you want us to send customer leads. Partner Center supports the following CRM systems:

    - [Dynamics 365](commercial-marketplace-lead-management-instructions-dynamics.md) for Customer Engagement
    - [Marketo](commercial-marketplace-lead-management-instructions-marketo.md)
    - [Salesforce](commercial-marketplace-lead-management-instructions-salesforce.md)

    > [!NOTE]
    > If your CRM system isn't listed above, use [Azure Table](commercial-marketplace-lead-management-instructions-azure-table.md) or [Https Endpoint](commercial-marketplace-lead-management-instructions-https.md) to store customer lead data, then export the data to your CRM system.

2. Connect your offer to the lead destination when publishing in Partner Center.
3. Confirm that the connection to the lead destination is configured properly. After you publish it in Partner Center, we'll validate the connection and send you a test lead. While you preview the offer before it goes live, you can also test your lead connection by trying to purchase the offer yourself in the preview environment.
4. Make sure the connection to the lead destination stays updated so you don't lose any leads.

Here are some additional lead management resources:

- [Customer leads from your commercial marketplace offer](commercial-marketplace-get-customer-leads.md)
- [Common questions about lead management](../lead-management-faq.md#common-questions-about-lead-management)
- [Troubleshooting lead configuration errors](../lead-management-faq.md#publishing-config-errors)
- [Lead Management Overview](https://assetsprod.microsoft.com/mpn/cloud-marketplace-lead-management.pdf) PDF (Make sure your pop-up blocker is turned off).

Select **Save draft** before continuing.

### Properties

This page lets you define the categories used to group your offer on the marketplace and the legal contracts that support your offer.

#### Category

Select categories and subcategories to place your offer in the appropriate marketplace search areas. Be sure to describe how your offer supports these categories in the offer description. Select:

- At least one and up to two categories, including a primary and a secondary category (optional).
- Up to two subcategories for each primary and/or secondary category. If no subcategory is applicable to your offer, select **Not applicable**.

See the full list of categories and subcategories in [Offer Listing Best Practices](../gtm-offer-listing-best-practices.md). In the marketplace, IoT Edge modules are always shown under the **Internet of Things** > **IoT Edge module** category.

#### Legal

You must provide terms and conditions for the offer. You have two options:

- Use the Standard Contract for the Microsoft Commercial Marketplace.
- Provide your own terms and conditions.

##### Standard contract for the Microsoft Commercial Marketplace

We offer a Standard Contract template to help facilitate transactions in the commercial marketplace. You can choose to offer your solution under the Standard Contract, which customers only need to check and accept once. This is a good option if you don't want to craft custom terms and conditions.

To learn more about the Standard Contract, see [Standard Contract for the Microsoft Commercial Marketplace](../standard-contract.md). You can also download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF (make sure your pop-up blocker is off).

To use the Standard Contract, select the **Use the Standard Contract for Microsoft's commercial marketplace** check box, and then click **Accept**.

> [!NOTE]
> After you publish an offer using the Standard contract for Microsoft commercial marketplace, you can't use your own custom terms and conditions. Either offer your solution under the Standard Contract or under your own terms and conditions.

![Illustrates using the Standard Contract for Microsoft's commercial marketplace checkbox.](media//iot-edge-module-standard-contract-checkbox.png)

##### Your own terms and conditions

To provide your own custom terms and conditions, enter them in the **Terms and Conditions** box. You can enter an unlimited amount of characters of text in this box. Customers must accept these terms before they can try your offer.

Select **Save draft** before continuing to the next section, Offer listing.

## Offer listing

Here you'll define the offer details that are displayed in the marketplace. This includes the offer name, description, images, and so on. Be sure to follow the policies detailed on Microsoft's policy page while configuring this offer.

> [!NOTE]
> Offer details are not required to be in English if the offer description begins with the phrase, "This application is available only in [non-English language]." It's also okay to provide a Useful Link to offer content in a language that's different from the one used in the Offer listing details.

### Name

The name you enter here displays as the title of your offer. This field is pre-filled with the text you entered in the **Offer alias** box when you created the offer. You can change this name later.

The name:

- Can be trademarked (and you may include trademark or copyright symbols).
- Can't be more than 50 characters long.
- Can't include emojis.

### Search results summary

Provide a short description of your offer. This can be up to 100 characters long and is used in marketplace search results.

### Long summary

Provide a more detailed description of your offer. This can be up to 256 characters long and is used in marketplace search results.

### Description

[!INCLUDE [Long description-1](./includes/long-description-1.md)]

IoT Edge module offers must include a minimum hardware requirements paragraph at the bottom of the description, such as:

- Minimum hardware requirements: Linux x64 and arm32 OS, 1 GB of RAM, 500 Mb of storage

[!INCLUDE [Long description-2](./includes/long-description-2.md)]

[!INCLUDE [Long description-3](./includes/long-description-3.md)]

#### Privacy policy URL

Enter the web address of your organization's privacy policy. You're responsible for ensuring that your offer complies with privacy laws and regulations. You're also responsible for posting a valid privacy policy on your website.

#### Useful links

Provide supplemental online documents about your offer. You can add up to 25 links. To add a link, select **+ Add a link** and then complete the following fields:

- **Title** - Customers will see the title on your offer's details page.
- **Link (URL)** - Enter a link for customers to view your online document. The link must start with `http://` or `https://`.

Make sure to add at least one link to your documentation and one link to the compatible IoT Edge devices from the [Azure IoT device catalog](https://devicecatalog.azure.com/).

### Contact information

You must provide the name, email, and phone number for a **Support contact** and an **Engineering contact.** This information isn't shown to customers. It is available to Microsoft and may be provided to Cloud Solution Provider (CSP) partners.

- Support contact (required): For general support questions.
- Engineering contact (required): For technical questions and certification issues.
- CSP Program contact (optional): For reseller questions related to the CSP program.

In the **Support contact** section, provide the web address of the **Support website** where partners can find support for your offer based on whether the offer is available in global Azure, Azure Government, or both.

In the **CSP Program contact** section, provide the link (**CSP Program Marketing Materials**) where CSP partners can find marketing materials for your offer.

#### Additional marketplace listing resources

To learn more about creating offer listings, see [Offer listing best practices](../gtm-offer-listing-best-practices.md).

### Marketplace images

Provide logos and images to use with your offer. All images must be in PNG format. Blurry images will be rejected.

[!INCLUDE [logo tips](../includes/graphics-suggestions.md)]

>[!Note]
>If you have an issue uploading files, make sure your local network does not block the https://upload.xboxlive.com service used by Partner Center.

#### Store logos

Provide a PNG file for the **Large** size logo. Partner Center will use this to create a **Small** and a **Medium** logo. You can optionally replace these with different images later.

- **Large** (from 216 x 216 to 350 x 350 px, required)
- **Medium** (90 x 90 px, optional)
- **Small** (48 x 48 px, optional)

These logos are used in different places in the listing:

[!INCLUDE [logos-azure-marketplace-only](../includes/logos-azure-marketplace-only.md)]

[!INCLUDE [Logo tips](../includes/graphics-suggestions.md)]

#### Screenshots (optional)

Add up to five screenshots that show how your offer works. Each must be 1280 x 720 pixels in size and in PNG format.

#### Videos (optional)

Add up to five videos that demonstrate your offer. Enter the video's name, its web address, and a thumbnail PNG image of the video at 1280 x 720 pixels in size.

#### Marketplace  examples

Here's an example of how offer information appears in Azure Marketplace:

:::image type="content" source="media/example-iot-azure-marketplace-offer.png" alt-text="Illustrates how this offer appears in Azure Marketplace.":::

#### Call-out descriptions

1. Large logo
2. Categories
3. Support address (link)
4. Terms and conditions
5. Privacy policy address (link)
6. Name
7. Summary
8. Description
9. Useful links
10. Screenshots/videos

<br>Here's an example of how offer information appears in Azure Marketplace search results:

:::image type="content" source="media/example-iot-azure-marketplace-offer-search-results.png" alt-text="Illustrates how this offer appears in Azure Marketplace search results.":::

#### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary

<br>Here's an example of how offer information appears in the Azure portal:

:::image type="content" source="media/example-iot-azure-portal-offer.png" alt-text="Illustrates how this offer appears in the Azure portal.":::

#### Call-out descriptions

1. Name
2. Description
3. Useful links
4. Screenshots

<br>Here's an example of how offer information appears in the Azure portal search results:

:::image type="content" source="media/example-iot-azure-portal-offer-search-results.png" alt-text="Illustrates how this offer appears in the Azure portal search results.":::

#### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary

<br>Select **Save draft** before proceeding to the next section, Preview.

## Preview

On the **Preview tab**, you can choose a limited **Preview Audience** for validating your offer before publishing it live to the broader marketplace audience.

> [!IMPORTANT]
> After you view your offer in Preview, you must select **Go live** to publish your offer to the public.

Specify your preview audience using Azure subscription ID GUIDs, along with an optional description for each. Neither of these fields can be seen by customers.

> [!NOTE]
> You can find your Azure subscription ID on the Subscriptions page in the Azure portal.

Add at least one Azure subscription ID, either individually (up to 10) or by uploading a CSV file (up to 100). By adding these subscription IDs, you define who can preview your offer before it's published live. If your offer is already live, you can define a preview audience to test changes or updates to your offer.

Select **Save draft** before proceeding to the next section, Plan overview.

## Plan overview

This tab lets you provide different plan options within the same offer in Partner Center. Plans (formerly called SKUs) can differ in terms of what clouds are available, such as global clouds, Government clouds, and the image referenced by the plan. To list your offer in the marketplace, you must set up at least one plan.

You can create up to 100 plans for each offer: up to 45 of these can be private. Learn more about private plans in [Private offers in the Microsoft commercial marketplace](../private-offers.md).

After you create your plans, the **Plan overview** tab shows:

- Plan names
- Pricing model
- Azure regions (Global or Government)
- Current publishing status
- Any available actions

The actions available in the Plan overview vary depending on the current status of your plan. They include:

- **Delete draft**: If the plan status is a Draft.
- **Stop sell plan**: If the plan status is published live.

### Create new plan

Select **Create new plan**. The **New plan** dialog box appears.

In the **Plan ID** box, create a unique plan ID for each plan in this offer. This ID will be visible to customers in the product web address. Use only lowercase letters and numbers, dashes, or underscores, and a maximum of 50 characters.

In the **Plan name** box, enter a name for this plan. Customers see this name when deciding which plan to select within your offer. Create a unique name for each plan in this offer. For example, you might use an offer name of **Windows Server** with plans **Windows Server 2016** and **Windows Server 2019**.

> [!NOTE]
> The plan ID can't be changed after you select **Create**.

Select **Create**.

### Plan setup

This tab lets you configure which clouds the plan is available in. Your answers on this tab affect which fields are displayed on other tabs.

#### Azure regions

All plans for IoT Edge module offers are automatically made available in **Azure Global**.  Your plan can be used by customers in all global Azure regions that use the marketplace. For details, see [Geographic availability and currency support](../marketplace-geo-availability-currencies.md).

Select the [Azure Government](../../azure-government/documentation-government-welcome.md) option to make your solution appear here. This is a government community cloud with controlled access for customers from U.S. federal, state, and local or tribal government agencies, as well as partners eligible to serve them. As the publisher, you're responsible for any compliance controls, security measures, and best practices for this cloud community. Azure Government uses physically isolated data centers and networks (located in the U.S. only). Before [publishing](../../azure-government/documentation-government-manage-marketplace-partners.md) to Azure Government, test and confirm your solution within that area as the results may be different. To stage and test your solution, request a trial account from [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/).

> [!NOTE]
> After your plan is published and available in a specific region, you can't remove that region.

#### Azure Government certifications

This option is only visible if **Azure Government** is selected under **Azure regions**.

Azure Government services handle data that's subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe your certifications. These can be links to your listings on the program directly or to your own website. These links are visible to Azure Government customers only.

### Plan listing

This tab displays specific information for each different plan within the same offer.

### Plan name

This is pre-filled with the name you gave your plan when you created it. You can change this name, as needed. It can be up to 50 characters long. This name appears as the title of this plan in Azure Marketplace and the Azure portal. It's used as the default module name after the plan is ready to be used.

### Plan summary

Provide a short summary of your plan (not the offer). This summary appears in Azure Marketplace search results and can contain up to 100 characters.

### Plan description

Describe what makes this plan unique, as well as differences between plans within your offer. Don't describe the offer, just the plan. This description will appear in Azure Marketplace and in the Azure portal on the Offer listing page. It can be the same content you provided in the plan summary and contain up to 2,000 characters.

Select **Save draft** after completing these fields.

#### Plan examples

Here's an example of Azure Marketplace plan details (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/example-iot-azure-marketplace-plan.png" alt-text="Illustrates Azure Marketplace plan details.":::

#### Call-out descriptions

1. Offer name
2. Plan name
3. Plan description

<br>Here's an example of the Azure portal plan details (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/example-iot-azure-marketplace-plan-details.png" alt-text="Illustrates the Azure portal plan details.":::

#### Call-out descriptions

1. Offer name
2. Plan name
3. Plan description

### Availability

If you want to hide your published offer so customers can't search, browse, or purchase it in the marketplace, select the **Hide plan** check box on the Availability tab.

This field is commonly used when:

- The offer is intended to be used only indirectly when referenced though another application.
- The offer should not be purchased individually.
- The plan was used for initial testing and is no longer relevant.
- The plan was used for temporary or seasonal offers and should no longer be offered.

## Technical configuration

The **IoT Edge module** offer type is a specific type of container that runs on an IoT Edge device. On the **Technical Configuration** tab, you'll provide reference information for your container image repository inside the [Azure Container Registry](https://azure.microsoft.com/services/container-registry/), along with configuration settings that let customers use the module easily.

After the offer is published, your IoT Edge container image is copied to Azure Marketplace in a specific public container registry. All requests from Azure users to use your module are served from the Azure Marketplace public container registry, not your private container registry.

You can target multiple platforms and provide several versions of your module container image using tags. To learn more about tags and versioning, see [Prepare your IoT Edge module technical assets](create-iot-edge-module-asset.md).

### Image repository details

You'll provide the following information on the **Image repository details** tab.

**Select the image source**: Select the **Azure Container Registry** option.

**Azure subscription ID**: Provide the subscription ID where resource usage is reported and services are billed for the Azure Container Registry that includes your container image. You can find this ID on the [Subscriptions page](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal.

**Azure resource group name**: Provide the [resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md) name that contains the Azure Container Registry with your container image. The resource group must be accessible in the subscription ID (above). You can find the name on the [Resource groups](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) page in the Azure portal.

**Azure container registry name**: Provide the name of the [Azure Container Registry](../../container-registry/container-registry-intro.md) that has your container image. The container registry must be present in the Azure resource group you provided earlier. Provide only the registry name, not the full login server name. Be sure to omit **azurecr.io** from the name. You can find the registry name on the [Container Registries page](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.ContainerRegistry%2Fregistries) in the Azure portal.

**Admin username for the Azure Container Registry**: Provide the [admin username](../../container-registry/container-registry-authentication.md#admin-account)) associated with the Azure Container Registry that has your container image. The username and password are required to ensure your company has access to the registry. To get the admin username and password, set the **admin-enabled** property to **True** using the Azure Command-Line Interface (CLI). You can optionally set **Admin user** to **Enable** in the Azure portal.

:::image type="content" source="media/example-iot-update-container-registry.png" alt-text="Illustrates the Update container registry dialog box.":::

#### Call-out description

1. Admin user

<br>**Password for the Azure Container Registry**: Provide the password for the admin username that's associated with the Azure Container Registry and has your container image. The username and password are required to ensure your company has access to the registry. You can get the password from the Azure portal by going to **Container Registry** > **Access Keys** or with Azure CLI using the [show command.](/cli/azure/acr/credential#az_acr_credential_show)

:::image type="content" source="media/example-iot-access-keys.png" alt-text="Illustrates the access key screen in the Azure portal.":::

#### Call-out descriptions

1. Access keys
2. Username
3. Password

**Repository name within the Azure Container Registry**. Provide the name of the Azure Container Registry repository that has your image. You specify the name of the repository when you push the image to the registry. You can find the name of the repository by going to the [Container Registry](https://azure.microsoft.com/services/container-registry/) > **Repositories page**. For more information, see [View container registry repositories in the Azure portal](../../container-registry/container-registry-repositories.md). After the name is set, it can't be changed. Use a unique name for each offer in your account.

> [!NOTE]
> We don't support Encrypted Azure Container Registry for Edge Module Certification. Azure Container Registry should be created without Encryption enabled.

### Image tags for new versions of your offer

Customers must be able to automatically get updates from the Azure Marketplace when you publish an update. If they don't want to update, they must be able to stay on a specific version of your image. You can do this by adding new image tags each time you make an update to the image.

**Image tag**. This field must include a **latest** tag that points to the latest version of your image on all supported platforms. It must also include a version tag (for example, starting with xx.xx.xx, where xx is a number). Customers should use [manifest tags](https://github.com/estesp/manifest-tool) to target multiple platforms. All tags referenced by a manifest tag must also be added so we can upload them. All manifest tags (except the latest tag) must start with either X.Y- or X.Y.Z- where X, Y, and Z are integers. For example, if a latest tag points to 1.0.1-linux-x64, 1.0.1-linux-arm32, and 1.0.1-windows-arm32, these six tags need to be added to this field. For details about tags and versioning, see [Prepare your IoT Edge module technical assets.](create-iot-edge-module-asset.md)

### Default deployment settings (optional)

Define the most common settings to deploy your IoT Edge module. Optimize customer deployments by letting them launch your IoT Edge module out-of-the-box with these default settings.

**Default routes**. The IoT Edge Hub manages communication between modules, the IoT Hub, and devices. You can set routes for data input and output between modules and the IoT Hub, which gives you the flexibility to send messages where they need to go without the need for additional services to process messages or writing additional code. Routes are constructed using name/value pairs. You can define up to five default route names, each up to 512 characters long.

Be sure to use the correct [route syntax](../../iot-edge/module-composition.md#declare-routes)) in your route value (usually defined as FROM/message/* INTO $upstream). This means that any messages sent by any modules go to your IoT Hub. To refer to your module, use its default module name, which will be your **Offer Name**, without spaces or special characters. To refer to other modules that are not yet known, use the <FROM_MODULE_NAME> convention to let your customers know that they need to update this info. For details about IoT Edge routes, see [Declare routes](../../iot-edge/module-composition.md#declare-routes)).

For example, if module ContosoModule listens for inputs on ContosoInput and output data at ContosoOutput, it makes sense to define the following two default routes:

- Name #1: ToContosoModule
- Value #1: FROM /messages/modules/<FROM_MODULE_NAME>/outputs/* INTO BrokeredEndpoint("/modules/ContosoModule/inputs/ContosoInput")
- Name #2: FromContosoModuleToCloud
- Value #2: FROM /messages/modules/ContonsoModule/outputs/ContosoOutput INTO $upstream

**Default module twin desired properties**. A module twin is a JSON document in the IoT Hub that stores the state information for a module instance, including desired properties. Desired properties are used along with reported properties to synchronize module configuration or conditions. The solution backend can set desired properties and the module can read them. The module can also receive change notifications in the desired properties. Desired properties are created using up to five name/value pairs and each default value must be fewer than 512 characters. You can define up to five name/value twin desired properties. Values of twin desired properties must be valid JSON, non-escaped, without arrays with a maximum nested hierarchy of four levels. In a scenario where a parameter required for a default value doesn't make sense (for example, the IP address of a customer's server), you can add a parameter as the default value. To learn more about twin desired properties, see [Define or update desired properties](../../iot-edge/module-composition.md#define-or-update-desired-properties)).

For example, if a module supports a dynamically configurable refresh rate using twin desired properties, it makes sense to define the following default twin desired property:

- Name #1: RefreshRate
- Value #1: 60

**Default environment variables**. Environment variables provide supplemental information to a module that's helping the configuration process. Environment variables are created using name/value pairs. Each default environment variable name and value must be fewer than 512 characters, and you can define up to five. When a parameter required for a default value doesn't make sense (for example, the IP address of a customer's server), you can add a parameter as the default value.

For example, if a module requires to accept terms of use before being started, you can define the following environment variable:

- Name #1: ACCEPT_EULA
- Value #1: Y

**Default container create options**. Container creation options direct the creation of the IoT Edge module Docker container. IoT Edge supports Docker engine API Create Container options. See all the options at [List containers.](https://docs.docker.com/engine/api/v1.30/#operation/ContainerList) The create options field must be valid JSON, non-escaped, and fewer than 512 characters.

For example, if a module requires port binding, define the following create options:

"HostConfig":{"PortBindings":{"5012/tcp":[{"HostPort":"5012"}]}

## Review and publish

After you've completed all the required sections of the offer, you can submit it to review and publish.

In the top-right corner of the portal, select **Review and publish**.

On the review page you can see the publishing status:

- See the completion status for each section of the offer. You can't publish until all sections of the offer are marked as complete.
    - **Not started** - The section hasn't been started and needs to be completed.
    - **Incomplete** - The section has errors that need to be fixed or requires that you provide more information. See the sections earlier in this document for guidance.
    - **Complete** - The section has all required data and there are no errors. All sections of the offer must be complete before you can submit the offer.
- Provide testing instructions to the certification team to ensure your offer is tested correctly. Also, provide any supplementary notes that are helpful for understanding your offer.

To submit the offer for publishing, select **Publish**.

We'll send you an email to let you know when a preview version of the offer is available to review and approve. To publish your offer to the public, go to Partner Center and select **Go-live**.

## Next steps

- [Update an existing offer in the commercial marketplace](update-existing-offer.md)
