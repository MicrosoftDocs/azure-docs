---
title: Register and scan a Power BI tenant (preview)
description: Learn how to use the Azure Purview portal to register and scan a Power BI tenant. 
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 11/19/2020
---

# Register and scan a Power BI tenant (preview)

This article shows how to use Azure Purview portal to register and scan a Power BI tenant.

> [!Note]
> If the Purview instance and the Power BI tenant are in the same Azure tenant, you can only use managed identity (MSI) authentication to set up a scan of a Power BI tenant. 

## Create a security group for permissions

To set up authentication, create a security group and add the Purview managed identity to it.

1. In the [Azure portal](https://portal.azure.com), search for **Azure Active Directory**.
1. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

    > [!Tip]
    > You can skip this step if you already have a security group you want to use.

1. Select **Security** as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Security group type":::

1. Add your Purview managed identity to this security group. Select **Members**, then select **+ Add members**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-group-member.png" alt-text="Add the catalog's managed instance to group.":::

1. Search for your Purview managed identity and select it.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-catalog-to-group-by-search.png" alt-text="Add catalog by searching for it":::

    You should see a success notification showing you that it was added.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/success-add-catalog-msi.png" alt-text="Add catalog MSI success":::

## Associate the security group with the tenant

1. Log into the [Power BI admin portal](https://app.powerbi.com/admin-portal/tenantSettings).
1. Select the **Tenant settings** page.

    > [!Important]
    > You need to be a Power BI Admin to see the tenant settings page.

1. Select **Admin API settings** > **Allow service principals to use read-only Power BI admin APIs (Preview)**.
1. Select **Specific security groups**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/allow-service-principals-power-bi-admin.png" alt-text="Image showing how to allow service principals to get read-only Power BI admin API permissions":::

    > [!Caution]
    > When you allow the security group you created (that has your Purview managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Azure Purview, Purview's permissions, not Power BI permissions, determine who can see that metadata.

    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Purview account. You can delete it separately, if you wish.

## Register your Power BI and set up a scan

Now that you've given the Purview Managed Identity permissions to connect to the Admin API of your Power BI tenant, you can set up your scan from the Azure Purview Studio.

1. Select the **Management Center** icon.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/management-center.png" alt-text="Management center icon.":::

1. Then select **+ New** on **Data sources**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/data-sources.png" alt-text="Image of new data source button":::

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose":::

3. Give your Power BI instance a friendly name.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-friendly-name.png" alt-text="Image showing Power BI data source-friendly name":::

    The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

    By default, the system will find the Power BI tenant that exists in the same Azure subscription.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-datasource-registered.png" alt-text="Power BI data source registered":::

    > [!Note]
    > For Power BI, data source registration and scan is allowed for only one instance.


4. Give your scan a name. Then select the option to include or exclude the personal workspaces. Notice that the only authentication method supported is **Managed Identity**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-setup.png" alt-text="Image showing Power BI scan setup":::

    > [!Note]
    > * Switching the configuration of a scan to include or exclude a personal workspace will trigger a full scan of PowerBI source
    > * The scan name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens. Spaces aren't allowed.

5. Set up a scan trigger. Your options are **Once**, **Every 7 days**, and **Every 30 days**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Scan trigger image":::

6. On **Review new scan**, select **Save and Run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Save and run Power BI screen image":::

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
