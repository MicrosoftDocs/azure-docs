git---
title: Use PowerShell to register and scan Power BI (preview)
description: Learn how use PowerShell to register and scan a Power BI tenant in Azure Babylon.
author: darrenparker
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: how-to
ms.date: 10/12/2020
---

# Use PowerShell to register and scan Power BI in Azure Babylon (preview) 

This article shows how to use PowerShell to set up a scan of a Power BI tenant in an Azure Babylon catalog.

## Power BI authentication background

The Babylon catalog must connect to the Power BI Admin API to scan artifacts in a Power BI tenant. The Power BI Admin API currently supports two types of authentication:

- Managed identity (MSI).
- Delegated user authentication.

> [!Note]
> MSI is recommended, unless delegated user authentication is required.

## Create a security group

Every Babylon catalog has its own system-assigned managed identity that must be given access to the Power BI tenant to enable scanning. The catalog name can be used to find its identity on Azure portal.

1. In the [Azure portal](https://portal.azure.com), search for Azure Active Directory.
1. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal).

    > [!Tip]
    > You can skip this step if you already have a security group to use.

1. Make sure to select Security as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Security group type":::

1. Add your catalog's managed identity to this security group by selecting Members then **+ Add members**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-group-member.png" alt-text="Add the catalog's managed instance to group":::

1. Search for your catalog and select it.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-catalog-to-group-by-search.png" alt-text="Add catalog by searching for it":::

1. You should see a success notification showing you that it was added.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/success-add-catalog-msi.png" alt-text="Add catalog MSI success":::

## Associate the security group with Power BI

1. Log into the [Power BI admin portal](https://app.powerbi.com/admin-portal/tenantSettings?allowServicePrincipalsUseReadAdminAPIsUI=1). Append this feature flag:  `allowServicePrincipalsUseReadAdminAPIsUI=1`. This flag enables the feature that allows you to associate your security group. For example,

    ```http
    https://app.powerbi.com/admin-portal/tenantSettings?allowServicePrincipalsUseReadAdminAPIsUI=1`
    ```

    > [!Important]
    > 1. You need to be a Power BI Admin to see the tenant settings page.
    > 1. You must also first request that your Power BI tenant be added to an allow list (contact [mailto:BabylonDiscussion@microsoft.com](mailto:BabylonDiscussion@microsoft.com)).

1. Select **Developer settings** > **Allow service principals to use read-only Power BI APIs (Preview)**.
1. Select **Specific security groups**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/allow-service-principals-power-bi-admin.png" alt-text="Image showing how to allow service principals to get read-only Power BI admin API permissions ":::

    > [!Caution]
    > When you allow the security group you created (that has your data catalog managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Azure data catalog, the catalog permissions, not Power BI permissions, determine who can see that metadata.

    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Babylon account. You can delete it separately.

## Register Power BI and set up a scan

Now that you've given the catalog permissions to connect to the Admin API of your Power BI tenant, you need to set up your scan in the catalog. To do this, you configure and run a PowerShell script.

1. Download and extract the ADC PowerShell cmdlets.
1. Configure your script by providing values for the assignments at the top of the script.

    ```PowerShell
    #Babylon Account Info
    $azuretenantId = '<Tenant Id>'
    $azuresubscriptionId = '<Tenant Id>'
    $azureResourceGroupName = '<Resource Group Name>'
    $azureBabylonAccountName = '<Catalog Name>'
    $createCatalog = $false #Change to true if you need a new catalog to be created
    $azureCatalogLocation = 'East Us' #The region of your account
    $dataSourceName = 'pbi-msi-datasource01' #provide a unique data source name
    $dataScanName = 'scan01' #provide a unique scan name

    #PowerShell Command Module Path
    $ModulePath = '<Full path to where you extracted the PS zip files>\Microsoft.DataCatalog.Management.Commands.dll'
    Import-Module $ModulePath

    If ($createCatalog -eq $true)
    {
      Connect-AzAccount -Tenant $azuretenantId -SubscriptionId $azuresubscriptionId
      Set-AzDataCatalog -ResourceGroupName $azureResourceGroupName -Name $azureBabylonAccountName -Location $azureCatalogLocation
    }

    Set-AzDataCatalogSessionSettings -DataCatalogSession -UserAuthentication -TenantId $azuretenantId  -DataCatalogAccountName $azureBabylonAccountName

    Set-AzDataCatalogDataSource -Name $dataSourceName -AccountType PowerBI  -Tenant $azuretenantId

    Set-AzDataCatalogScan -DataSourceName $dataSourceName -ScanName $dataScanName -PowerBIManagedInstanceMsi
    ```

    > [!Note]
    > You must be a contributor or owner on the subscription under which you run the commands.

1. Start your scan by running the following script:

    ```PowerShell
    Start-AzDataCatalogScan -DataSourceName $dataSourceName -Name $dataScanName -AsJob
    ```

## Register and scan Power BI

The recommended authentication method is MSI. However, to scan a Power BI tenant that's in a different Azure tenant than your catalog, you use  delegated authentication.

To do delegated authentication, you must have admin user credentials, as well as Power BI admin credentials. You must also create an Azure app and grant it Power BI Tenant.ReadAll permissions.

1. Navigate to [Azure portal](https://portal.azure.com) and search for **App Registrations**.

1. From **App registrations**, select **+ New registration**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/new-app-registration.png" alt-text="Image showing how to create a new Azure app registration":::

1. Enter a name for your app.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/register-new-app.png" alt-text="Image showing how to create a new Azure app registration":::

1. Once your app is created, select **API permissions**, and then **+ Add a permission**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/app-permissions.png" alt-text="Image showing how to add permission to the app":::

1. Select **Power BI Service** on **Request API permissions**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/select-power-bi-service.png" alt-text="Image showing how to select the PBI service":::

1. Select **Delegated permissions** and **Tenant.Read.All**. Then select **Add permissions**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/request-api-permissions.png" alt-text="Image showing how to request API permissions":::

1. Select **Grant admin consent**

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/grant-admin-perms.png" alt-text="Image showing how to grant admin consent":::

1. Copy the **Application (client) ID** and the **Directory (tenant) ID** values.  You'll use these values when you set up your scan.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/copy-client-and-tenantid.png" alt-text="Image showing copying the client and tenant IDs":::

1. Configure your scan in PowerShell. The script will prompt for credentials. You must have at least contributor permissions on the Azure subscription you use.

    ```PowerShell
    # Babylon Account Info
    $azuretenantId = '<Tenant Id>'
    $azuresubscriptionId = '<Tenant Id>'
    $azureResourceGroupName = '<Resource Group Name>'
    $azureBabylonAccountName = '<Catalog Name>'
    $createCatalog = $false
    $azureCatalogLocation = 'East Us' #The region of your account
    $dataSourceName = 'pbi-delegated-datasource01' #provide a unique data source name
    $dataScanName = 'scan01' #provide a unique scan name

    # Power BI Tenant Info
    $powerBITenantIdToScan = '<Power BI Tenant ID copied from above steps>'
    $ServicePrincipalId = '<Client ID copied from above steps>'
    $UserName = '<Power BI Admin emil ex: admin@firsttomarket.onmicrosoft.com>'
    $Password = '<Power BI Admin Password>'

    #PowerShell Command Module Path
    $ModulePath = '<Full path to where you extracted the PS zip files>\Microsoft.DataCatalog.Management.Commands.dll'
    Import-Module $ModulePath

    #Commands To Create catalog, Create DataSource, Create Datascan, Start Scan
    If($createCatalog -eq $true)
    {
      Connect-AzAccount -Tenant $azuretenantId -SubscriptionId $azuresubscriptionId
      Set-AzDataCatalog -ResourceGroupName $azureResourceGroupName -Name $azureBabylonAccountName -Location $azureCatalogLocation
    }

    Set-AzDataCatalogSessionSettings -DataCatalogSession -UserAuthentication -TenantId $azuretenantId   -DataCatalogAccountName $azureBabylonAccountName

    Set-AzDataCatalogDataSource -Name $dataSourceName -AccountType PowerBI -Tenant $powerBITenantIdToScan

    Set-AzDataCatalogScan -DataSourceName $dataSourceName -ScanName $dataScanName -PowerBIDelegated -ServicePrincipalId $ServicePrincipalId -UserName $UserName -Password $Password
    ```

1. Run your scan.

      ```PowerShell
      Start-AzDataCatalogScan -DataSourceName $dataSourceName -Name $dataScanName -AsJob
      ```

## Next steps

To get started with Azure Babylon, see [Quickstart: Create an Azure Babylon account](create-catalog-portal.md).
