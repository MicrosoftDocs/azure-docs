---
title: Register and scan a Power BI tenant (preview)
description: Learn how to use the Azure Purview portal to register and scan a Power BI tenant. 
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 07/28/2021
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

1. Select the **Data Map** on the left navigation.

1. Then select **Register**.

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
    > * Schema is unavailable in the schema tab.

5. Set up a scan trigger. Your options are **Once**, **Every 7 days**, and **Every 30 days**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Scan trigger image":::

6. On **Review new scan**, select **Save and Run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Save and run Power BI screen image":::

## Register and scan a cross-tenant Power BI

In a cross-tenant scenario, you can use PowerShell to register and scan your Power BI tenants, however, you can view, browse and search assets of remote tenant using Azure Purview Studio through the UI experience. 

Consider using this guide if the Azure AD tenant where Power BI tenant is located, is different than the Azure AD tenant where your Azure Purview account is being provisioned. 
Use the following steps to register and scan one or more Power BI tenants in Azure Purview in a cross-tenant scenario:

1. Download the [Managed Scanning PowerShell Modules](https://github.com/Azure/Purview-Samples/blob/master/Cross-Tenant-Scan-PowerBI/ManagedScanningPowerShell.zip), and extract its contents to the location of your choice.

2. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, right-click **Windows PowerShell**, and then select **Run as administrator**.


3. Install and import module in your machine if it has not been installed yet.

   ```powershell
    Install-Module -name az
    Import-Module -name az
    Login-AzAccount
    ```

4. Sign into your Azure environment using the Azure AD Administrator credential where your Power BI tenant is located.

   ```powershell
    Login-AzAccount
    ```

5. In the PowerShell window, enter the following command, replacing `<path-to-managed-scanning-powershell-modules>` with the folder path of the extracted modules such as `C:\Program Files\WindowsPowerShell\Modules\ManagedScanningPowerShell`

   ```powershell
   dir -Path <path-to-managed-scanning-powershell-modules> -Recurse | Unblock-File
   ```

6. Enter the following command to install the PowerShell modules.

   ```powershell
   Import-Module 'C:\Program Files\WindowsPowerShell\Modules\ManagedScanningPowerShell\Microsoft.DataCatalog.Management.Commands.dll'
   ```
   
7. Use the same PowerShell session to set the following parameters. Update `purview_tenant_id` with Azure AD tenant ID where Azure Purview is deployed, `powerbi_tenant_id` with your Azure AD tenant where Power BI tenant is located and `purview_account_name` is your existing Azure Purview account.
   
   ```powershell
   $azuretenantId = '<purview_tenant_id>'
   $powerBITenantIdToScan = '<powerbi_tenant_id>'
   $purviewaccount = '<purview_account_name>'
   ```
8. Create a cross-tenant Service Principal. 

   1. Create an App Registration in your Azure Active Directory tenant where Power BI is located. Make sure you update `password` field with a strong password and update `app_display_name` with a non-existent application name in your Azure AD tenant where Power BI tenant is hosted.

    ```powershell   
    $SecureStringPassword = ConvertTo-SecureString -String <'password'> -AsPlainText -Force
    $AppName = '<app_display_name>'
    New-AzADApplication -DisplayName $AppName -Password $SecureStringPassword
    ```
    
   2. From Azure Active Directory dashboard select newly created application and then select **App registration**. Assign the application the following delegated permissions and grant admin consent for the tenant:
   
         - Power BI Service     Tenant.Read.All
         - Microsoft Graph      openid

   3. From Azure Active Directory dashboard select newly created application and then select **Authentication**. Under **Supported account types** select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 
   
   4. Construct tenant specific sign-in URL for your service principal by running the following url in your web browser:
   
     https://login.microsoftonline.com/<purview_tenant_id>/oauth2/v2.0/authorize?client_id=<client_id_to_delegate_the_pbi_admin>&scope=openid&response_type=id_token&response_mode=fragment&state=1234&nonece=67890
    
    Make sure you replace the parameters with correct information:
    <purview_tenant_id> is the Azure Active Directory tenant ID (GUID) where Azure Purview account is provisioned.
    <client_id_to_delegate_the_pbi_admin> is the application ID corresponding to your service principal
   
   5. Sign-in using any non-admin account. This is required to provision your service principal in the foreign tenant.
   
   6. When prompted, accept permission requested for _View your basic profile_ and _Maintain access to data you have given it access to_.

9. Update `client_id_to_delegate_the_pbi_admin` with Application (client) ID of newly created application and run the following command in your PowerShell session:
   
   ```powershell
   $ServicePrincipalId = '<client_id_to_delegate_the_pbi_admin>'
   ```

10.  Create a user account in Azure Active Directory tenant where Power BI tenant is located and assign Azure AD role, **Power BI Administrator**. Update `pbi_admin_username` and `pbi_admin_password` with corresponding information and execute the following lines in the PowerShell terminal:

        ```powershell
        $UserName = '<pbi_admin_username>'
        $Password = '<pbi_admin_password>'
        ```

11.  In Azure Purview subscription, locate your Purview account and using Azure RBAC roles, assign _Purview Data Source Administrator_ to the Service Principal and the Power BI user.

12. To register the cross-tenant Power BI tenant as a new data source inside Azure Purview account, update `service_principal_key` and execute the following cmdlets in the PowerShell session:

    ```powershell
    Set-AzDataCatalogSessionSettings -DataCatalogSession -TenantId $azuretenantId -ServicePrincipalAuthentication -ServicePrincipalApplicationId $ServicePrincipalId -ServicePrincipalKey '<service_principal_key>' -Environment Production -DataCatalogAccountName $purviewaccount

    Set-AzDataCatalogDataSource -Name 'pbidatasource' -AccountType PowerBI -Tenant $powerBITenantIdToScan -Verbose
    ```

13. To create and run a new scan inside Azure Purview execute the following cmdlets in the PowerShell session:

    ```powershell
    Set-AzDataCatalogScan -DataSourceName 'pbidatasource' -Name 'pbiscan' -AuthorizationType PowerBIDelegated -ServicePrincipalId $ServicePrincipalId -UserName $UserName -Password $Password  -IncludePersonalWorkspaces $true -Verbose

    Start-AzDataCatalogScan -DataSourceName 'pbidatasource' -Name 'pbiscan'
    ```
### Known limitations

-   For cross-tenant scenario, no UX experience currently available to register and scan cross Power BI tenant.
-   By Editing the Power BI cross tenant registered with PowerShell using Purview Studio will tamper the data source registration with inconsistent scan behavior.

        
## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
