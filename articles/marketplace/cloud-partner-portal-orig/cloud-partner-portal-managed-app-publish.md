---
title: Publish a Azure Managed Application to Azure Marketplace
description: Publish a Azure Managed Application to Azure Marketplace
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: qianw211
manager: pbutlerm  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---


Publish an Azure-Managed Application to Azure Marketplace 
========================================================

This article lists the various steps involved in publishing a Managed
Application offer to Azure Marketplace.

Pre-requisites for publishing a Managed Application 
---------------------------------------------------

Prerequisites to listing on Azure Marketplace

1.  Technical

    -   [Author Azure Resource Manager
        templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates)

    -   Azure Quickstart templates:

        -   <https://azure.microsoft.com/documentation/templates/>

        -   <https://github.com/azure/azure-quickstart-templates>

    -   Create UI Definition

        -   [Create user interface definition
            file](https://docs.microsoft.com/azure/azure-resource-manager/managed-application-createuidefinition-overview)

2.  Non-technical (business requirements)

    -   Your company (or its subsidiary) must be located in a sell origin
        country supported by the Azure Marketplace

    -   Your product must be licensed in a way that is compatible with
        billing models supported by the Azure Marketplace

    -   You are responsible for providing technical support to
        your customers: free, paid, or through community support.

    -   You are responsible for licensing your software and any
        dependencies on third-party software.

    -   You must provide content that meets criteria for your offering
        to be listed on Azure Marketplace and in the Azure Management
        Portal

    -   You must agree to the terms of the Azure Marketplace
        Participation Policies and Publisher Agreement

    -   You must agree to comply with the Terms of Use, Microsoft
        Privacy Statement and Microsoft Azure Certified Program
        Agreement.

How to create a new Azure Application offer 
-------------------------------------------

Once all pre-requisites have been met, you are ready to start
authoring your managed application offer. Before we begin, a quick
overview of an offer and a SKU

**Offer**

An Azure Application offer corresponds to a class of product offering
from a publisher. If you have a new solution/application to be published in Azure Marketplace, a new offer is the way to go. An offer is a collection of SKUs. Every offer appears
as its own entity in Azure Marketplace.

**SKU**

A SKU is an offer with the smallest purchasable unit. While within the
same product class (offer), SKUs allow you to differentiate between
different features supported, whether the offer is managed or un-managed, and billing models.

Add multiple SKUs if you would like to support different billing models: such as Bring Your Own License (BYOL), Pay as you Go (PAYG), etc. 

Add
multiple SKUs when each SKU supports a different feature set, and differently priced.

A SKU shows up under the parent offer in Azure Marketplace while it
shows up as its own purchasable entity at azure.com.

1.  Sign in to the [Cloud Partner Portal](http://cloudpartner.azure.com).

2.  From the left navigation bar, click on \"+ New offer\" and select
    \"Azure Applications\".

    ![New Offer](./media/cloud-partner-portal-publish-managed-app/newOffer.png)

3.  A new offer \"Editor\" view is now opened, and you can start authoring.

4.  The \"forms\" that need to be filled out are visible on the left
    within the \"Editor\" view. Each \"form\" consists of a set of
    fields that are to be filled out. Required fields are marked with a
    red asterix (\*).

    > There are 4 main forms for authoring a Managed Application

    -   Offer Settings

    -   SKUs

    -   Marketplace

    -   Support

How to fill out the Offer Settings form 
---------------------------------------

The offer settings form is a basic form to specify the offer settings.
The different fields are described below.

**Offer ID**

A unique identifier for the offer within a publisher profile.
It will be visible in product URLs, Resource Manager templates, and billing
reports. Only lowercase alphanumeric characters or dashes (-) are allowed. It cannot end in a dash or exceed a maximum of 50
characters. This field is locked once an offer goes live.

**Publisher ID**

This dropdown allows you to choose the publisher profile you want to
publish this offer under. This field is locked once an offer
goes live.

**Name**

The display name for your offer. The name that will show
up in Azure Marketplace and in Azure portal. It can have a maximum of 50
characters. Guidance here is to include a recognizable brand name for
your product. Do not include your company name here unless that is how it
is marketed. If you are marketing this offer at your own website, ensure
that the name is exactly how it shows up in your website.

Click on \"Save\" to save your progress. Next step would be to add SKUs
for your offer.

How to create SKUs 
------------------

Click on the \"SKUs\" form. Here you can see an option to \"Add a SKU\"
clicking on which will allow you to enter a \"SKU ID\".

![new offer SKUs](./media/cloud-partner-portal-publish-managed-app/newOffer_skus.png)

\"SKU ID\" is a unique identifier for the SKU within an offer. This ID
will be visible in product URLs, ARM templates, and billing reports. It
can only be composed of lowercase alphanumeric characters or dashes (-).
It cannot end in a dash and can have a maximum of 50 characters. This field is locked once an offer goes live. You can have
multiple SKUs within an offer. You need a SKU for each image you are
planning to publish.

Once a SKU has been added, it will appear in the list of SKUs within the
\"SKUs\" form. Click on the SKU name to get into the details of that
particular SKU. Here are some details for some of the fields.

After clicking on \"New SKU\", you will need to fill the following form:

![New offer - new SKU](./media/cloud-partner-portal-publish-managed-app/newOffer_newsku.png)

### How to fill Sku Details section 

**Title** - Provides a title for this Sku. This is what will show up in
the gallery for this item.

**Summary** - Provides a short summary for this sku. This text will show
up right under the title.

**Description** - Provides a detailed description about the
SKU.

**Sku Type** - The allowed values are \"Managed Application\" and
\"Solution Templates\". For this case, you will select \"Managed
Application\".

### How to fill Package Details section 

The package section has the following fields that need to be filled out

![New offer - new SKU package](./media/cloud-partner-portal-publish-managed-app/newOffer_newsku_package.png)

**Current Version** - provides a version for the package you will upload.
It should be in the format.

**Package File** - the package contains the following files that are
compressed into a .zip file.

applianceMainTemplate.json - the deployment template file that
is used to deploy the solution/application and create the resources
defined in it. You can find more details on how to author deployment
template files here -
<https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-create-first-template>

applianceCreateUIDefinition.json - This file is used by the Portal at azure.com
to generate the user interface for provisioning this
solution/application. You can find more details on how to create this
file here -
<https://docs.microsoft.com/azure/azure-resource-manager/managed-application-createuidefinition-overview>

mainTemplate.json - the template file that contains only the
Microsoft.Solution/appliances resource. The key properties of this
resource to be aware of are as follows:

-   \"kind\" - The value should be \"Marketplace\" in the case of
    Marketplace-Managed application scenario
-   \"ManagedResourceGroupId\": the resource group in the
    customer\'s subscription where all the resources defined in the
    applianceMainTemplate.json will be deployed.
-   \"PublisherPackageId\": the string that uniquely identifies the
    package. 

The value needs to be constructed as follows - It is a
    concatenation of
    \[publisherId\].\[OfferId\]-preview\[SKUID\].\[PackageVersion\].
    Each of these values can be obtained as shown below.

This package should contain any other nested templates, or scripts required to successfully provision this application. The
mainTemplate.json, applianceMainTemplate.json and
applianceCreateUIDefinition.json must be present in the root folder.

**Authorizations** - This property defines who gets access, and what level of
access to the resources in customers subscriptions. This enables the
publisher to manage the application on behalf of the customer.

-   PrincipalId - the Azure Active directory identifier of a
    user, user group, or application that will be granted certain
    permissions (as described by the Role Definition) on the resources in customer subscription.

-   Role Definition - a list of all the built-in RBAC roles
    provided by Azure AD. You can select the role most
    appropriate, which will allow you to manage the resources on behalf of
    the customer.

Multiple authorizations can be added. However, it is recommended to
create an Active Directory user group and specify its ID in the
\"PrincipalId\."  This will enable addition of more users to the user
group without having to update the SKU.

More details on RBAC can be found here -
<https://docs.microsoft.com/azure/active-directory/role-based-access-control-what-is>

Marketplace Form
----------------

The marketplace form within an azure application offer asks for fields
that will show up on [Azure
Marketplace](https://azuremarketplace.microsoft.com) and on [Azure
Portal](https://portal.azure.com/). Here are some details for some of
the fields.

#### Preview Subscription IDs

Enter here a list of Azure Subscription IDs that you would like to have
access to the offer once it is published. These white-listed subscriptions
will allow you to test the previewed offer before making it live. The
partner portal allows you to white-list up to 100 subscriptions.

#### Suggested Categories

Select up to five categories from the provided list that your offer can be
best associated with. The selected categories will be used to map your
offer to the product categories available in [Azure
Marketplace](https://azuremarketplace.microsoft.com) and [Azure
Portal](https://portal.azure.com/).

Here are some of the places that the data you provide on this form shows
up in.

##### Azure Marketplace

![publishvm10](./media/cloud-partner-portal-publish-managed-app/publishvm10.png)

![publishvm11](./media/cloud-partner-portal-publish-managed-app/publishvm11.png)

![publishvm15](./media/cloud-partner-portal-publish-managed-app/publishvm15.png)

##### Portal at azure.com

![publishvm12](./media/cloud-partner-portal-publish-managed-app/publishvm12.png)

![publishvm13](./media/cloud-partner-portal-publish-managed-app/publishvm13.png)

##### Logo Guidelines

All the logos uploaded in the Cloud Partner Portal should follow the
below guidelines:

-   The Azure design has a simple color palette. Keep the number of
    primary and secondary colors on your logo low.

-   The theme colors of the portal at azure.com are white and black. Avoid using these colors as the background color of your logos. Use
    some color that would make your logos prominent in the portal at azure.com.
    We recommend simple primary colors. **If you are using transparent
    background, then make sure that the logos and text are not white,
    black, or blue.**

-   Do not use a gradient background on the logo.

-   Avoid placing text, even your company, or brand name, on the logo.
    The look and feel of your logo should be \'flat\' and should avoid
    gradients.

-   Avoid stretching the logo.

##### Hero Logo

The Hero logo is optional. The publisher can choose not to upload a Hero
logo. However once uploaded the hero icon cannot be deleted. In that case, the partner must follow the Azure Marketplace guidelines for Hero icons.

###### Guidelines for the Hero logo icon

-   The Publisher Display Name, plan title and the offer long summary
    are displayed in white font color. Avoid keeping
    any light color in the background of the Hero Icon. Black, white, and
    transparent backgrounds are not allowed for Hero icons.

-   When the offer gets listed, the publisher display name, plan title, the offer long summary, and
    the create button are programmatically embedded inside the Hero logo. You don't need to enter any text while
    you are designing the Hero logo. Leave empty spaces on the right
    for publisher display name, plan title, the offer
    long summary, and etc. They are programmatically included.
    Empty spaces for the text should be 415x100 on the right, and offset by 370 px from the left.

![publishvm14](./media/cloud-partner-portal-publish-managed-app/publishvm14.png)

Support Form
------------

The next form to fill out is the support form. This form asks for
support contacts from your company.  Some examples are your engineering contact information
and customer support contact information.

How to publish an offer
-----------------------

Now that your offer is drafted, the next step is to publish
the offer on Azure Marketplace. Click the \"Publish\" button start the process of making your offer live.
