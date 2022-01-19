---
title: Connect to and manage a Power BI tenant
description: This guide describes how to connect to a Power BI tenant in Azure Purview, and use Azure Purview's features to scan and manage your Power BI tenant source.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage a Power BI tenant in Azure Purview

This article outlines how to register a Power BI tenant, and how to authenticate and interact with the tenant in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register)| [Yes](#scan)| No | No | No | No| [Yes](how-to-lineage-powerbi.md)|

> [!Note]
> If the Azure Purview instance and the Power BI tenant are in the same Azure tenant, you can only use managed identity (MSI) authentication to set up a scan of a Power BI tenant.

### Known limitations

-   For cross-tenant scenario, no UX experience currently available to register and scan cross Power BI tenant.
-   By Editing the Power BI cross tenant registered with PowerShell using Azure Purview Studio will tamper the data source registration with inconsistent scan behavior.
-   Review [Power BI Metadata scanning limitations](/power-bi/admin/service-admin-metadata-scanning).


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register a Power BI tenant in Azure Purview in both [same-tenant](#authentication-for-a-same-tenant-scenario) and [cross-tenant](#steps-to-register-cross-tenant) scenarios.

### Authentication for a same-tenant scenario

For both same-tenant and cross-tenant scenarios, to set up authentication, create a security group and add the Purview-managed identity to it.

1. In the [Azure portal](https://portal.azure.com), search for **Azure Active Directory**.
1. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

    > [!Tip]
    > You can skip this step if you already have a security group you want to use.

1. Select **Security** as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Screenshot of security group type.":::

1. Add your Purview-managed identity to this security group. Select **Members**, then select **+ Add members**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-group-member.png" alt-text="Screenshot of how to add the catalog's managed instance to group.":::

1. Search for your Purview-managed identity and select it.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-catalog-to-group-by-search.png" alt-text="Screenshot showing how to add catalog by searching for its name.":::

    You should see a success notification showing you that it was added.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/success-add-catalog-msi.png" alt-text="Screenshot showing successful addition of  catalog MSI.":::

#### Associate the security group with the tenant

1. Log into the [Power BI admin portal](https://app.powerbi.com/admin-portal/tenantSettings).
1. Select the **Tenant settings** page.

    > [!Important]
    > You need to be a Power BI Admin to see the tenant settings page.

1. Select **Admin API settings** > **Allow service principals to use read-only Power BI admin APIs (Preview)**.
1. Select **Specific security groups**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/allow-service-principals-power-bi-admin.png" alt-text="Image showing how to allow service principals to get read-only Power BI admin API permissions.":::

1. Select **Admin API settings** > **Enhance admin APIs responses with detailed metadata** > Enable the toggle to allow Azure Purview Data Map automatically discover the detailed metadata of Power BI datasets as part of its scans.

    > [!IMPORTANT]
    > After you update the Admin API settings on your power bi tenant, wait around 15 minutes before registering a scan and test connection.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-sub-artifacts.png" alt-text="Image showing the Power BI admin portal config to enable subartifact scan.":::

    > [!Caution]
    > When you allow the security group you created (that has your Azure Purview managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Azure Purview, Azure Purview's permissions, not Power BI permissions, determine who can see that metadata.
  
    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Azure Purview account. You can delete it separately, if you wish.

### Steps to register in the same tenant

Now that you've given the Purview-Managed Identity permissions to connect to the Admin API of your Power BI tenant, you can set up your scan from the Azure Purview Studio.

1. Select the **Data Map** on the left navigation.

1. Then select **Register**.

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose.":::

1. Give your Power BI instance a friendly name.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-friendly-name.png" alt-text="Image showing Power BI data source-friendly name.":::

    The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

    By default, the system will find the Power BI tenant that exists in the same Azure subscription.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-datasource-registered.png" alt-text="Image showing the registered Power BI data source.":::

    > [!Note]
    > For Power BI, data source registration and scan is allowed for only one instance.

### Steps to register cross-tenant

In a cross-tenant scenario, you can use PowerShell to register and scan your Power BI tenants. You can browse, and search assets of remote tenant using Azure Purview Studio through the UI experience. 

Consider using this guide if the Azure AD tenant where Power BI tenant is located, is different than the Azure AD tenant where your Azure Purview account is being provisioned. 
Use the following steps to register and scan one or more Power BI tenants in Azure Purview in a cross-tenant scenario:

1. Download the [Managed Scanning PowerShell Modules](https://github.com/Azure/Purview-Samples/blob/master/Cross-Tenant-Scan-PowerBI/ManagedScanningPowerShell.zip), and extract its contents to the location of your choice.

1. On your computer, enter **PowerShell** in the search box on the Windows taskbar. In the search list, select and hold (or right-click) **Windows PowerShell**, and then select **Run as administrator**.

1. Install and import module in your machine if it has not been installed yet.

   ```powershell
    Install-Module -name az
    Import-Module -name az
    Login-AzAccount
    ```

1. Sign into your Azure environment using the Azure AD Administrator credential where your Power BI tenant is located.

   ```powershell
    Login-AzAccount
    ```

1. In the PowerShell window, enter the following command, replacing `<path-to-managed-scanning-powershell-modules>` with the folder path of the extracted modules such as `C:\Program Files\WindowsPowerShell\Modules\ManagedScanningPowerShell`

   ```powershell
   dir -Path <path-to-managed-scanning-powershell-modules> -Recurse | Unblock-File
   ```

1. Enter the following command to install the PowerShell modules.

   ```powershell
   Import-Module 'C:\Program Files\WindowsPowerShell\Modules\ManagedScanningPowerShell\Microsoft.DataCatalog.Management.Commands.dll'
   ```

1. Use the same PowerShell session to set the following parameters. Update `purview_tenant_id` with Azure AD tenant ID where Azure Purview is deployed, `powerbi_tenant_id` with your Azure AD tenant where Power BI tenant is located, and `purview_account_name` is your existing Azure Purview account.

   ```powershell
   $azuretenantId = '<purview_tenant_id>'
   $powerBITenantIdToScan = '<powerbi_tenant_id>'
   $purviewaccount = '<purview_account_name>'
   ```

1. Create a cross-tenant Service Principal.

   1. Create an App Registration in your Azure Active Directory tenant where Power BI is located. Make sure you update `password` field with a strong password and update `app_display_name` with a non-existent application name in your Azure AD tenant where Power BI tenant is hosted.

      ```powershell   
      $SecureStringPassword = ConvertTo-SecureString -String <'password'> -AsPlainText -Force
      $AppName = '<app_display_name>'
      New-AzADApplication -DisplayName $AppName -Password $SecureStringPassword
      ```

   1. From Azure Active Directory dashboard, select newly created application and then select **App registration**. Assign the application the following delegated permissions and grant admin consent for the tenant:

      - Power BI Service     Tenant.Read.All
      - Microsoft Graph      openid

      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-delegated-permissions.png" alt-text="Screenshot of delegated permissions for Power BI Service and Microsoft Graph.":::

   1. From Azure Active Directory dashboard, select newly created application and then select **Authentication**. Under **Supported account types** select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-multitenant.png" alt-text="Screenshot of account type support multitenant.":::

   1. Under **Implicit grant and hybrid flows**, ensure to select **ID tokens (used for implicit and hybrid flows)**
    
      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-id-token-hybrid-flows.png" alt-text="Screenshot of ID token hybrid flows.":::

   1. Construct tenant-specific sign-in URL for your service principal by running the following url in your web browser:

      ```
      https://login.microsoftonline.com/<purview_tenant_id>/oauth2/v2.0/authorize?client_id=<client_id_to_delegate_the_pbi_admin>&scope=openid&response_type=id_token&response_mode=fragment&state=1234&nonce=67890
      ```
    
      Make sure you replace the parameters with correct information:
      
      - `<purview_tenant_id>` is the Azure Active Directory tenant ID (GUID) where Azure Purview account is provisioned.
      - `<client_id_to_delegate_the_pbi_admin>` is the application ID corresponding to your service principal
   
   1. Sign-in using any non-admin account. This is required to provision your service principal in the foreign tenant.

   1. When prompted, accept permission requested for _View your basic profile_ and _Maintain access to data you have given it access to_.

1. Update `client_id_to_delegate_the_pbi_admin` with Application (client) ID of newly created application and run the following command in your PowerShell session:

   ```powershell
   $ServicePrincipalId = '<client_id_to_delegate_the_pbi_admin>'
   ```

1. Create a user account in Azure Active Directory tenant where Power BI tenant is located and assign Azure AD role, **Power BI Administrator**. Update `pbi_admin_username` and `pbi_admin_password` with corresponding information and execute the following lines in the PowerShell terminal:

    ```powershell
    $UserName = '<pbi_admin_username>'
    $Password = '<pbi_admin_password>'
    ```

    > [!Note]
    > If you create a user account in Azure Active Directory from the portal, the public client flow option is **No** by default. You need to toggle it to **Yes**:
    > <br>
    > :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-public-client-flows.png" alt-text="Screenshot of public client flows.":::
    
1. In Azure Purview Studio, assign _Data Source Admin_ to the Service Principal and the Power BI user at the root collection. 

1. To register the cross-tenant Power BI tenant as a new data source inside Azure Purview account, update `service_principal_key` and execute the following cmdlets in the PowerShell session:

    ```powershell
    Set-AzDataCatalogSessionSettings -DataCatalogSession -TenantId $azuretenantId -ServicePrincipalAuthentication -ServicePrincipalApplicationId $ServicePrincipalId -ServicePrincipalKey '<service_principal_key>' -Environment Production -DataCatalogAccountName $purviewaccount

    Set-AzDataCatalogDataSource -Name 'pbidatasource' -AccountType PowerBI -Tenant $powerBITenantIdToScan -Verbose
    ```

## Scan

Follow the steps below to scan a Power BI tenant to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

This guide covers both [same-tenant](#create-and-run-scan-for-same-tenant-power-bi) and [cross-tenant](#create-and-run-scan-for-cross-tenant-power-bi) scanning scenarios.

### Create and run scan for same-tenant Power BI

To create and run a new scan, do the following:

1. In the Azure Purview Studio, navigate to the **Data map** in the left menu.

1. Navigate to **Sources**.

1. Select the registered Power BI source.

1. Select **+ New scan**.

1. Give your scan a name. Then select the option to include or exclude the personal workspaces. Notice that the only authentication method supported is **Managed Identity**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-setup.png" alt-text="Image showing Power BI scan setup.":::

    > [!Note]
    > Switching the configuration of a scan to include or exclude a personal workspace will trigger a full scan of PowerBI source.

1. Select **Test Connection** before continuing to next steps. If **Test Connection** failed, select **View Report** to see the detailed status and troubleshoot the problem
    1. Access - Failed status means the user authentication failed. Scans using managed identity will always pass because no user authentication required.
    1. Assets (+ lineage) - Failed status means the Azure Purview - Power BI authorization has failed. Make sure the Purview-managed identity is added to the security group associated in Power BI admin portal.
    1. Detailed metadata (Enhanced) - Failed status means the Power BI admin portal is disabled for the following setting - **Enhance admin APIs responses with detailed metadata**

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-test-connection-status-report.png" alt-text="Screenshot of test connection status report page.":::

1. Set up a scan trigger. Your options are **Once**, **Every 7 days**, and **Every 30 days**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Azure Purview scan scheduler.":::

1. On **Review new scan**, select **Save and Run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Screenshot of save and run Power BI source.":::

### Create and run scan for cross-tenant Power BI

To create and run a new scan inside Azure Purview execute the following cmdlets in the PowerShell session:

   ```powershell
   Set-AzDataCatalogScan -DataSourceName 'pbidatasource' -Name 'pbiscan' -AuthorizationType PowerBIDelegated -ServicePrincipalId $ServicePrincipalId -UserName $UserName -Password $Password -IncludePersonalWorkspaces $true -Verbose

   Start-AzDataCatalogScan -DataSourceName 'pbidatasource' -Name 'pbiscan'
   ```

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
