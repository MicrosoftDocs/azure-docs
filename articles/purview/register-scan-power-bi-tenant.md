---
title: Register and scan a Power BI tenant (preview)
description: Learn how to use the Azure Purview portal to register and scan a Power BI tenant. 
author: darrenparker
ms.author: dpark
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/12/2020
---

# Register and scan a Power BI tenant (preview)

This article shows how to use Azure Purview portal to register and scan a Power BI tenant.

> [!Note]
> If the Purview instance and the Power BI tenant are in the same Azure tenant, you can only use managed identity (MSI) authentication to set up a scan of a Power BI tenant. If the Purview instance and Power BI tenant are in different Azure tenants, you must authenticate with delegated authentication, and you must use PowerShell to set up your scans. See [Use PowerShell to register and scan Power BI](powershell-register-scan-power-bi.md).

## Create a security group for permissions

To set up authentication, create a security group and add the catalog's managed identity to it.

1. In the [Azure portal](https://portal.azure.com), search for **Azure Active Directory**.
1. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

    > [!Tip]
    > You can skip this step if you already have a security group you want to use.

1. Select **Security** as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Security group type":::

1. Add your catalog's managed identity to this security group. Select **Members**, then select **+ Add members**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-group-member.png" alt-text="Add the catalog's managed instance to group.":::

1. Search for your catalog and select it.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-catalog-to-group-by-search.png" alt-text="Add catalog by searching for it":::

    You should see a success notification showing you that it was added.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/success-add-catalog-msi.png" alt-text="Add catalog MSI success":::

## Associate the security group with the tenant

1. Log into the [Power BI admin portal](https://app.powerbi.com/admin-portal/tenantSettings?allowServicePrincipalsUseReadAdminAPIsUI=1). Append this feature flag to the URI:  `allowServicePrincipalsUseReadAdminAPIsUI=1`. This flag enables the feature that allows you to associate your security group. For example,

    ```http
    https://app.powerbi.com/admin-portal/tenantSettings?allowServicePrincipalsUseReadAdminAPIsUI=1
    ```

    > [!Important]
    > 1. You need to be a Power BI Admin to see the tenant settings page.
    > 1. You must also first request that your Power BI tenant be added to an allow list (contact [mailto:BabylonDiscussion@microsoft.com](mailto:BabylonDiscussion@microsoft.com)).

1. Select **Developer settings** > **Allow service principals to use read-only Power BI APIs (Preview)**.
1. Select **Specific security groups**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/allow-service-principals-power-bi-admin.png" alt-text="Image showing how to allow service principals to get read-only Power BI admin API permissions":::

    > [!Caution]
    > When you allow the security group you created (that has your data catalog managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Azure data catalog, the catalog permissions, not Power BI permissions, determine who can see that metadata.

    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Purview account. You can delete it separately, if you wish.

 ## Register your Power BI and set up a scan

Now that you've given the catalog permissions to connect to the Admin API of your Power BI tenant, you can set up your scan from the catalog portal.

First, add a special feature flag to your Purview URL 

1. Add the following string to the end of your Purview instance's uri: `?feature.ext.catalog={"pbi":"true"}`. This enables the Power BI registration option in your catalog.

1. Select the **Management Center** icon.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/management-center.png" alt-text="Management center icon.":::

1. Then select **+ New** on **Data sources**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/data-sources.png" alt-text="Image of new data source button":::

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose":::

1. Give your Power BI instance a friendly name.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-friendly-name.png" alt-text="Image showing Power BI data source-friendly name":::

    The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

    By default, the system will find the Power BI tenant that exists in the same Azure subscription.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-datasource-registered.png" alt-text="Power BI data source registered":::

1. Give your scan a name. Notice that the only authentication method supported is **Managed Identity**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-setup.png" alt-text="Image showing Power BI scan setup":::

    The scan name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

1. Set up a scan trigger. Your options are **Once**, **Every 7 days**, and **Every 30 days**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Scan trigger image":::

1. On **Review new scan**, select **Save and Run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Save and run Power BI screen image":::

## Next steps

To learn how to use PowerShell cmdlets to register and scan a Power BI tenant, see:
  
 > [!div class="nextstepaction"]
 > [Use PowerShell to register and scan Power BI](powershell-register-scan-power-bi.md)
