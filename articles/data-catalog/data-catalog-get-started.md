---
title: 'Quickstart: Create an Azure Data Catalog'
description: This quickstart describes how to create an Azure Data Catalog using the Azure portal.
ms.service: data-catalog
ms.topic: quickstart
ms.date: 12/07/2022
ms.custom: mode-ui
#Customer intent: As a user, I want to access my company's data all in one place so I can easily build reports or presentations from it.
---

# Quickstart: Create an Azure Data Catalog via the Azure portal

[!INCLUDE [Microsoft Purview redirect](includes/catalog-to-purview-migration-flag.md)]

Azure Data Catalog is a fully managed cloud service that serves as a system of registration and system of discovery for enterprise data assets. For a detailed overview, see [What is Azure Data Catalog](overview.md).

This quickstart helps you get started with creating an Azure Data Catalog.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

> [!Note]
> Due to Azure security requirements, Azure Data Catalog has enfored Transport Layer Security (TLS) 1.2. TLS 1.0 and TLS 1.1 have been disabled. You may encounter errors running the registration tool if your machine is not updated for TLS 1.2. See [Enable Transport Layer Security (1.2)](/mem/configmgr/core/plan-design/security/enable-tls-1-2) to update your machine for TLS 1.2.

To get started, you need to have:

* A [Microsoft Azure](https://azure.microsoft.com/) subscription.
* You need to have your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

To set up Data Catalog, you must be the owner or co-owner of an Azure subscription.

## Create a data catalog

You can create only one data catalog per organization (Azure Active Directory domain). Therefore, if the owner or co-owner of an Azure subscription who belongs to this Azure Active Directory domain has already created a catalog, then you can't create a catalog again even if you have multiple Azure subscriptions. To test whether a data catalog has been created by a user in your Azure Active Directory domain, go to the [Azure Data Catalog home page](http://azuredatacatalog.com) and verify whether you see the catalog. If a catalog has already been created for you, skip the following procedure and go to the next section.

1. Go to the [Azure portal](https://portal.azure.com) > **Create a resource** and select **Data Catalog**.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-create.png" alt-text="Data catalog resource type with the Create button selected.":::

1. Specify a **name** for the data catalog, the **subscription** you want to use, the **location** for the catalog, and the **pricing tier**. Then select **Create**.

1. Go to the [Azure Data Catalog home page](http://azuredatacatalog.com) and select **Publish Data**.

   :::image type="content" source="media/data-catalog-get-started/data-catalog-publish-data.png" alt-text="On the data catalog homepage, the Publish Data button is selected.":::

   You can also get to the Data Catalog home page from the [Data Catalog service page](https://azure.microsoft.com/services/data-catalog) by selecting **Get started**.

   :::image type="content" source="media/data-catalog-get-started/data-catalog-marketing-landing-page.png" alt-text="The data catalog service page, with the blue get started button at the bottom.":::

1. Go to the **Settings** page.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-create-azure-data-catalog.png" alt-text="The data catalog settings page, with several expandable options.":::

1. Expand **Pricing** and verify your Azure Data Catalog **edition** (Free or Standard).

    :::image type="content" source="media/data-catalog-get-started/data-catalog-create-catalog-select-edition.png" alt-text="The pricing option expanded with the free edition selected.":::

1. If you choose *Standard* edition as your pricing tier, you can expand **Security Groups** and enable authorizing Active Directory security groups to access Data Catalog and enable automatic adjustment of billing.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-standard-security-groups.png" alt-text="The security groups option expanded with the option to enable authorizing shown.":::

1. Expand **Catalog Users** and select **Add** to add users for the data catalog. You're automatically added to this group.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-add-catalog-user.png" alt-text="Catalog users expanded and the add button highlighted.":::

1. If you choose *Standard* edition as your pricing tier, you can expand **Glossary Administrators** and select **Add** to add glossary administrator users. You're automatically added to this group.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-standard-glossary-admin.png" alt-text="Glossary Administrators expanded and the add button highlighted.":::

1. Expand **Catalog Administrators** and select **Add** to add other administrators for the data catalog. You're automatically added to this group.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-add-catalog-admins.png" alt-text="Catalog Administrators expanded and the add button highlighted.":::

1. Expand **Portal Title** and add extra text that will be displayed in the portal title.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-portal-title.png" alt-text="Portal title expanded, showing the text box where optional text can be added.":::

1. Once you complete the **Settings** page, next navigate to the **Publish** page.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-created.png" alt-text="Data Catalog home page, with the Publish tab selected in the top menu.":::

## Find a data catalog in the Azure portal

1. On a separate tab in the web browser or in a separate web browser window, go to the [Azure portal](https://portal.azure.com) and sign in with the same account that you used to create the data catalog in the previous step.

1. Select **All services** and then select **Data Catalog**.

    :::image type="content" source="media/data-catalog-get-started/data-catalog-browse-azure-portal.png" alt-text="The left Azure portal menu is open, with 'all services' selected. In the services menu, Data Catalog is selected.":::

    You'll see the data catalog you created in the list. If you don't, check your subscription, resource group, location, and tag filters at the top of the search.

1. Select the catalog that you created. You'll see the **Data Catalog** page in the portal, showing details for your Data Catalog.

1. You can view properties of the data catalog and update them. For example, you can select **Pricing tier** and change the edition.

## Next steps

In this quickstart, you've learned how to create an Azure Data Catalog for your organization. You can now register data sources in your data catalog.

> [!div class="nextstepaction"]
> [Register data sources in Azure Data Catalog](data-catalog-how-to-register.md)
