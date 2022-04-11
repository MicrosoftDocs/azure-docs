---
title: Connect to and manage a Power BI tenant
description: This guide describes how to connect to a Power BI tenant in Azure Purview, and use Azure Purview's features to scan and manage your Power BI tenant source.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/08/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage a Power BI tenant in Azure Purview

This article outlines how to register a Power BI tenant, and how to authenticate and interact with the tenant in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#prerequisites)| [Yes](#prerequisites)| Yes | No | No | No| [Yes](how-to-lineage-powerbi.md)|

### Supported scenarios for Power BI scans

|**Azure Purview public access allowed/denied** |**Power BI public access allowed /denied** | **Power BI tenant same/cross**  | **Runtime option**  |
|---------|---------|---------|---------|
|Allowed     |Allowed        |Same tenant        |[Azure Runtime & Managed Identity](#authenticate-to-power-bi-tenant-managed-identity-only)    |
|Allowed     |Allowed        |Same tenant        |[Self-hosted runtime & Delegated authentication](#scan-same-tenant-using-self-hosted-ir-and-delegated-authentication)  |
|Allowed     |Denied         |Same tenant        |[Self-hosted runtime & Delegated authentication](#scan-same-tenant-using-self-hosted-ir-and-delegated-authentication)  |
|Denied      |Allowed        |Same tenant        |[Self-hosted runtime & Delegated authentication](#scan-same-tenant-using-self-hosted-ir-and-delegated-authentication)  |
|Denied      |Denied         |Same tenant        |[Self-hosted runtime & Delegated authentication](#scan-same-tenant-using-self-hosted-ir-and-delegated-authentication)  |
|Allowed     |Allowed        |Cross-tenant       |[Azure Runtime  & Delegated authentication](#cross-power-bi-tenant-registration-and-scan)                  |
|Allowed     |Allowed        |Cross-tenant       |[Self-hosted runtime & Delegated authentication](#cross-power-bi-tenant-registration-and-scan)             |

### Known limitations

-  If Azure Purview or Power BI tenant is protected behind a private endpoint, Self-hosted runtime is the only option to scan
-  Delegated authentication is the only supported authentication option if self-hosted integration runtime is used during the scan
-  For cross-tenant scenario, delegated authentication is only supported option for scanning.
-  You can create only one scan for a Power BI data source that is registered in your Azure Purview account
-  If Power BI dataset schema is not shown after scan, it is due to one of the current limitations with [Power BI Metadata scanner](/power-bi/admin/service-admin-metadata-scanning)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active [Azure Purview account](create-catalog-portal.md).

- You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

- If delegated auth is used:
  -  Make sure proper [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) is assigned to Power BI admin user that is used for the scan.

  -  Exclude the user from Azure multi-factor authentication.

- If self-hosted integration runtime is used:

  - Set up the latest [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717). The minimum required version is 5.14.8055.1. For more information, see[the create and configure a self-hosted integration runtime guide](manage-integration-runtimes.md).
  
  - Ensure [JDK 8 or later](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html), is installed on the virtual machine where the self-hosted integration runtime is installed.
  
## Same Power BI tenant registration and scan

### Authentication options 

- Managed Identity 
- Delegated Authentication

### Authenticate to Power BI tenant-managed identity only

> [!Note]
> Follow steps in this section, only if you are planning to use **Managed Identity** as authentication option.

In Azure Active Directory Tenant, where Power BI tenant is located:

1. In the [Azure portal](https://portal.azure.com), search for **Azure Active Directory**.
   
2. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

    > [!Tip]
    > You can skip this step if you already have a security group you want to use.

3. Select **Security** as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Screenshot of security group type.":::

4. Add your Azure Purview managed identity to this security group. Select **Members**, then select **+ Add members**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-group-member.png" alt-text="Screenshot of how to add the catalog's managed instance to group.":::

5. Search for your Azure Purview managed identity and select it.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/add-catalog-to-group-by-search.png" alt-text="Screenshot showing how to add catalog by searching for its name.":::

    You should see a success notification showing you that it was added.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/success-add-catalog-msi.png" alt-text="Screenshot showing successful addition of  catalog managed identity.":::

### Associate the security group with Power BI tenant

1. Log into the [Power BI admin portal](https://app.powerbi.com/admin-portal/tenantSettings).
   
2. Select the **Tenant settings** page.

    > [!Important]
    > You need to be a Power BI Admin to see the tenant settings page.

3. Select **Admin API settings** > **Allow service principals to use read-only Power BI admin APIs (Preview)**.
   
4. Select **Specific security groups**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/allow-service-principals-power-bi-admin.png" alt-text="Image showing how to allow service principals to get read-only Power BI admin API permissions.":::

5. Select **Admin API settings** > **Enhance admin APIs responses with detailed metadata** > Enable the toggle to allow Azure Purview Data Map automatically discover the detailed metadata of Power BI datasets as part of its scans.

    > [!IMPORTANT]
    > After you update the Admin API settings on your power bi tenant, wait around 15 minutes before registering a scan and test connection.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-sub-artifacts.png" alt-text="Image showing the Power BI admin portal config to enable subartifact scan.":::

    > [!Caution]
    > When you allow the security group you created (that has your Azure Purview managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Azure Purview, Azure Purview's permissions, not Power BI permissions, determine who can see that metadata.
  
    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Azure Purview account. You can delete it separately, if you wish.

### Register same Power BI tenant

This section describes how to register a Power BI tenant in Azure Purview for same-tenant scenario.

1. Select the **Data Map** on the left navigation.

1. Then select **Register**.

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose.":::

1. Give your Power BI instance a friendly name.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-friendly-name.png" alt-text="Image showing Power BI data source-friendly name.":::

    The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

    By default, the system will find the Power BI tenant that exists in the same Azure Active Directory tenant.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-datasource-registered.png" alt-text="Image showing the registered Power BI data source.":::

### Scan same Power BI tenant

#### Scan same tenant using Azure IR and Managed Identity

This is a suitable scenario, if both Azure Purview and Power PI tenant are configured to allow public access in the network settings. 

To create and run a new scan, do the following:

1. In the Azure Purview Studio, navigate to the **Data map** in the left menu.

1. Navigate to **Sources**.

1. Select the registered Power BI source.

1. Select **+ New scan**.

2. Give your scan a name. Then select the option to include or exclude the personal workspaces.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-setup.png" alt-text="Image showing Power BI scan setup.":::

    > [!Note]
    > Switching the configuration of a scan to include or exclude a personal workspace will trigger a full scan of PowerBI source.

3. Select **Test Connection** before continuing to next steps. If **Test Connection** failed, select **View Report** to see the detailed status and troubleshoot the problem.
    1. Access - Failed status means the user authentication failed. Scans using managed identity will always pass because no user authentication required.
    2. Assets (+ lineage) - Failed status means the Azure Purview - Power BI authorization has failed. Make sure the Azure Purview managed identity is added to the security group associated in Power BI admin portal.
    3. Detailed metadata (Enhanced) - Failed status means the Power BI admin portal is disabled for the following setting - **Enhance admin APIs responses with detailed metadata**

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-test-connection-status-report.png" alt-text="Screenshot of test connection status report page.":::

4. Set up a scan trigger. Your options are **Recurring**, and **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Azure Purview scan scheduler.":::

5. On **Review new scan**, select **Save and run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan-managed-identity.png" alt-text="Screenshot of Save and run Power BI source using Managed Identity.":::

#### Scan same tenant using Self-hosted IR and Delegated authentication

This scenario can be used when Azure Purview and Power PI tenant or both, are configured to use private endpoint and deny public access. Additionally, this option is also applicable if Azure Purview and Power PI tenant are configured to allow public access.

> [!IMPORTANT]
> Additional configuration may be required for your Power BI tenant and Azure Purview account, if you are planning to scan Power BI tenant through private network where either Azure Purview account, Power BI tenant or both are configured with private endpoint with public access denied.
>
> For more information related to Power BI network, see [How to configure private endpoints for accessing Power BI](/power-bi/enterprise/service-security-private-links).
>
> For more information about Azure Purview network settings, see [Use private endpoints for your Azure Purview account](catalog-private-link.md).

To create and run a new scan, do the following:

1. Create a user account in Azure Active Directory tenant and assign the user to Azure Active Directory role, **Power BI Administrator**. Take note of username and login to change the password.

3. Assign proper Power BI license to the user.  

2. Navigate to your Azure key vault.

3. Select **Settings** > **Secrets** and select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot how to navigate to Azure Key Vault.":::

4. Enter a name for the secret and for **Value**, type the newly created password for the Azure AD user. Select **Create** to complete.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault-secret.png" alt-text="Screenshot how to generate an Azure Key Vault secret.":::

5. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account) 
   
6. Create an App Registration in your Azure Active Directory tenant. Provide a web URL in the **Redirect URI**. Take note of Client ID(App ID).

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-create-service-principle.png" alt-text="Screenshot how to create a Service principle.":::
  
7. From Azure Active Directory dashboard, select newly created application and then select **App registration**. From **API Permissions**, assign the application the following delegated permissions and grant admin consent for the tenant:

   - Power BI Service Tenant.Read.All
   - Microsoft Graph openid
   - Microsoft Graph User.Read

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-delegated-permissions.png" alt-text="Screenshot of delegated permissions for Power BI Service and Microsoft Graph.":::

8. In the Azure Purview Studio, navigate to the **Data map** in the left menu.

9. Navigate to **Sources**.

10. Select the registered Power BI source.

11. Select **+ New scan**.

12. Give your scan a name. Then select the option to include or exclude the personal workspaces.
   
    >[!Note]
    > Switching the configuration of a scan to include or exclude a personal workspace will trigger a full scan of PowerBI source.

13. Select your self-hosted integration runtime from the drop-down list. 

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-shir.png" alt-text="Image showing Power BI scan setup using SHIR for same tenant.":::

14. For the **Credential**, select **Delegated authentication** and click **+ New** to create a new credential.

15. Create a new credential and provide required parameters:
    
    - **Name**: Provide a unique name for credential
    - **Client ID**: Use Service Principal Client ID (App ID) you created earlier   
    - **User name**: Provide the username of Power BI Administrator you created earlier
    - **Password**: Select the appropriate Key vault connection and the **Secret name** where the Power BI account password was saved earlier.

   :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-delegated-authentication.png" alt-text="Image showing Power BI scan setup using Delegated authentication.":::

16. Select **Test Connection** before continuing to next steps. If **Test Connection** failed, select **View Report** to see the detailed status and troubleshoot the problem
    1. Access - Failed status means the user authentication failed. Scans using managed identity will always pass because no user authentication required.
    2. Assets (+ lineage) - Failed status means the Azure Purview - Power BI authorization has failed. Make sure the Azure Purview managed identity is added to the security group associated in Power BI admin portal.
    3. Detailed metadata (Enhanced) - Failed status means the Power BI admin portal is disabled for the following setting - **Enhance admin APIs responses with detailed metadata**

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-test-connection-status-report.png" alt-text="Screenshot of test connection status report page.":::

17. Set up a scan trigger. Your options are **Recurring**, and **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Azure Purview scan scheduler.":::

18. On **Review new scan**, select **Save and run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Screenshot of Save and run Power BI source.":::

## Cross Power BI tenant registration and scan

### Authentication options 
- Delegated Authentication

### Cross Power BI tenant registration

1. Select the **Data Map** on the left navigation.

1. Then select **Register**.

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose.":::

1. Give your Power BI instance a friendly name. The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

1. Edit the Tenant ID field to replace with cross Power BI tenant you want to register and scan. By default, Power BI tenant ID that exists in the same Azure Active Directory as Azure Purview will be populated.

     :::image type="content" source="media/setup-power-bi-scan-catalog-portal/register-cross-tenant.png" alt-text="Image showing the registration experience for cross tenant Power BI":::

### Cross Power BI tenant scanning

#### Scan cross Power BI tenant using Delegated authentication 

Delegated authentication is the only supported option for cross-tenant scan option, however, you can use either Azure runtime or a self-hosted integration runtime to run a scan. 

To create and run a new scan using Azure runtime, perform the following steps:

1. Create a user account in Azure Active Directory tenant where Power BI tenant is located and assign the user to Azure Active Directory role, **Power BI Administrator**. Take note of username and login to change the password.

2. Assign proper Power BI license to the user.  

2. Navigate to your Azure key vault in the tenant where Azure Purview is created.

3. Select **Settings** > **Secrets** and select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot how to navigate to Azure Key Vault.":::

5. Enter a name for the secret and for **Value**, type the newly created password for the Azure AD user. Select **Create** to complete.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault-secret.png" alt-text="Screenshot how to generate an Azure Key Vault secret.":::

6. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
   
7. Create an App Registration in your Azure Active Directory tenant where Power BI is located. Provide a web URL in the **Redirect URI**. Take note of Client ID(App ID).

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-create-service-principle.png" alt-text="Screenshot how to create a Service Principle.":::
  
8. From Azure Active Directory dashboard, select newly created application and then select **App permissions**. Assign the application the following delegated permissions and grant admin consent for the tenant:

   - Power BI Service Tenant.Read.All
   - Microsoft Graph openid
   - Microsoft Graph User.Read

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-delegated-permissions.png" alt-text="Screenshot of delegated permissions for Power BI Service and Microsoft Graph.":::

9.  From Azure Active Directory dashboard, select newly created application and then select **Authentication**. Under **Supported account types** select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-multitenant.png" alt-text="Screenshot of account type support multitenant.":::

10. Under **Implicit grant and hybrid flows**, ensure to select **ID tokens (used for implicit and hybrid flows)**
    
      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-id-token-hybrid-flows.png" alt-text="Screenshot of ID token hybrid flows.":::

11. Under **Advanced settings**, enable **Allow Public client flows**.

12. In the Azure Purview Studio, navigate to the **Data map** in the left menu. Navigate to **Sources**.

13. Select the registered Power BI source from cross tenant.

14. Select **+ New scan**.

15. Give your scan a name. Then select the option to include or exclude the personal workspaces.
   
   > [!Note]
   > Switching the configuration of a scan to include or exclude a personal workspace will trigger a full scan of PowerBI source.

16. Select **Azure AutoResolveIntegrationRuntime** from the drop-down list. 

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant.png" alt-text="Image showing Power BI scan setup using Azure IR for cross tenant.":::

17. For the **Credential**, select **Delegated authentication** and click **+ New** to create a new credential.
 
18. Create a new credential and provide required parameters:
    
   - **Name**: Provide a unique name for credential.

   - **Client ID**: Use Service Principal Client ID (App ID) you created earlier.
   
   - **User name**: Provide the username of Power BI Administrator you created earlier.
   
   - **Password**: Select the appropriate Key vault connection and the **Secret name** where the Power BI account password was saved earlier.

        :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-delegated-authentication.png" alt-text="Image showing Power BI scan setup using Delegated authentication.":::

19. Select **Test Connection** before continuing to next steps. 

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant-test.png" alt-text="Screenshot of test connection status.":::

    If **Test Connection** failed, select **View Report** to see the detailed status and troubleshoot the problem:

      1. Access - Failed status means the user authentication failed: Validate if username and password is correct. review if the Credential contains correct Client (App) ID from the App Registration.
      2. Assets (+ lineage) - Failed status means the Azure Purview - Power BI authorization has failed. Make sure the user is added to Power BI Administrator role and has proper Power BI license assigned to.
      3. Detailed metadata (Enhanced) - Failed status means the Power BI admin portal is disabled for the following setting - **Enhance admin APIs responses with detailed metadata**

20. Set up a scan trigger. Your options are **Recurring**, and **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Azure Purview scan scheduler.":::

18. On **Review new scan**, select **Save and run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Screenshot of Save and run Power BI source.":::

## Troubleshooting tips

If delegated auth is used:
- Check your key vault. Make sure there are no typos in the password.
- Assign proper [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) to Power BI administrator user.
- Validate if user is assigned to Power BI Administrator role.
- If user is recently created, make sure password is reset successfully and user can successfully initiate the session.

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
