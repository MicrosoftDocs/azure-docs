---
title: Connect to and manage a Power BI tenant (cross-tenant)
description: This guide describes how to connect to a Power BI tenant in a cross-tenant scenario. You use Microsoft Purview to scan and manage your Power BI tenant source.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 10/24/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage a Power BI tenant in Microsoft Purview (cross-tenant)

This article outlines how to register a Power BI tenant in a cross-tenant scenario, and how to authenticate and interact with the tenant in Microsoft Purview. If you're unfamiliar with the service, see [What is Microsoft Purview?](overview.md).

## Supported capabilities

|**Metadata extraction**|  **Full scan**  |**Incremental scan**|**Scoped scan**|**Classification**|**Access policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#deployment-checklist)| [Yes](#deployment-checklist)| Yes | No | No | No| [Yes](how-to-lineage-powerbi.md)| No|

For a list of metadata available for Power BI, see our [available metadata documentation](available-metadata.md).

### Supported scenarios for Power BI scans

|**Scenario**  |**Microsoft Purview public access** |**Power BI public access** | **Runtime option** | **Authentication option**  | **Deployment checklist** | 
|---------|---------|---------|---------|---------|---------|
|Public access with Azure integration runtime     |Allowed     |Allowed        |Azure runtime      |Delegated authentication    | [Deployment checklist](#deployment-checklist) |
|Public access with self-hosted integration runtime     |Allowed     |Allowed        |Self-hosted runtime        |Delegated authentication / service principal | [Deployment checklist](#deployment-checklist) |

### Known limitations

- For the cross-tenant scenario, delegated authentication and service principal are the only supported authentication options for scanning.
- You can create only one scan for a Power BI data source that is registered in your Microsoft Purview account.
- If the Power BI dataset schema isn't shown after the scan, it's due to one of the current limitations with the [Power BI metadata scanner](/power-bi/admin/service-admin-metadata-scanning).
- Empty workspaces are skipped.

## Prerequisites

Before you start, make sure you have the following:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active [Microsoft Purview account](create-catalog-portal.md).
  
## Deployment checklist

Use either of the following deployment checklists during the setup, or for troubleshooting purposes, based on your scenario.

# [Public access with Azure integration runtime](#tab/Scenario1)

### Scan cross-tenant Power BI by using delegated authentication in a public network

1. Make sure the Power BI and Microsoft Purview accounts are in the cross-tenant mode.

1. Make sure the Power BI tenant ID is entered correctly during the registration. By default, the Power BI tenant ID that exists in the same Azure Active Directory (Azure AD) instance as Microsoft Purview will be populated.

1. Make sure your [Power BI metadata model is up to date by enabling metadata scanning](/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning).

1. From the Azure portal, validate if the Microsoft Purview account network is set to **public access**.

1. From the Power BI tenant admin portal, make sure the Power BI tenant is configured to allow a public network.

1. Check your instance of Azure Key Vault to make sure:
   1. There are no typos in the password or secret.
   2. Microsoft Purview managed identity has **get** and **list** access to secrets.

1. Review your credential to validate that the:
   1. Client ID matches the _Application (Client) ID_ of the app registration.
   2. For **delegated auth**, username includes the user principal name, such as `johndoe@contoso.com`.

1. In the Power BI Azure AD tenant, validate the following Power BI admin user settings:
   1. The user is assigned to the Power BI administrator role.
   2. At least one [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) is assigned to the user.
   3. If the user is recently created, sign in with the user at least once, to make sure that the password is reset successfully, and the user can successfully initiate the session.
   4. There are no multifactor authentication or conditional access policies enforced on the user.

1. In the Power BI Azure AD tenant, validate the following app registration settings:
   1. The app registration exists in your Azure AD tenant where the Power BI tenant is located.
   
   2. If service principal is used, under **API permissions**, the following **delegated permissions** are assigned with read for the following APIs:
      - Microsoft Graph openid
      - Microsoft Graph User.Read
   
   3. If delegated authentication is used, under **API permissions**, the following **delegated permissions** and **grant admin consent for the tenant** is set up with read for the following APIs:
      - Power BI Service Tenant.Read.All
      - Microsoft Graph openid
      - Microsoft Graph User.Read
   
   3. Under **Authentication**:
      1. **Supported account types** > **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** is selected.
      2. **Implicit grant and hybrid flows** > **ID tokens (used for implicit and hybrid flows)** is selected.
      3. **Allow public client flows** is enabled.
   
1. In Power BI tenant, In Azure Active Directory create a security group.
1. In Power BI tenant, from Azure Active Directory tenant, make sure [Service Principal is member of the new security group](#authenticate-to-power-bi-tenant).
1. On the Power BI Tenant Admin portal, validate if [Allow service principals to use read-only Power BI admin APIs](#associate-the-security-group-with-power-bi-tenant) is enabled for the new security group. 

# [Public access with self-hosted integration runtime](#tab/Scenario2)

### Scan cross-tenant Power BI by using delegated authentication in a public network

1. Make sure the Power BI and Microsoft Purview accounts are in the cross-tenant mode.

1. Make sure the Power BI tenant ID is entered correctly during the registration. By default, the Power BI tenant ID that exists in the same Azure Active Directory (Azure AD) instance as Microsoft Purview will be populated.

1. Make sure your [Power BI metadata model is up to date by enabling metadata scanning](/power-bi/admin/service-admin-metadata-scanning-setup#enable-tenant-settings-for-metadata-scanning).

1. From the Azure portal, validate if the Microsoft Purview account nNetwork is set to **public access**.

1. From the Power BI tenant admin portal, make sure the Power BI tenant is configured to allow a public network.

1. Check your instance of Azure Key Vault to make sure:
   1. There are no typos in the password.
   2. Microsoft Purview managed identity has **get** and **list** access to secrets.

1. Review your credential to validate that the: 
   1. Client ID matches the _Application (Client) ID_ of the app registration.
   2. Username includes the user principal name, such as `johndoe@contoso.com`.

1. In the Power BI Azure AD tenant, validate the following app registration settings:
   1. The app registration exists in your Azure AD tenant where the Power BI tenant is located.
   
   2. If service principal is used, under **API permissions**, the following **delegated permissions** are assigned with read for the following APIs:
      - Microsoft Graph openid
      - Microsoft Graph User.Read
   
   3. If delegated authentication is used, under **API permissions**, the following **delegated permissions** and **grant admin consent for the tenant** is set up with read for the following APIs:
      - Power BI Service Tenant.Read.All
      - Microsoft Graph openid
      - Microsoft Graph User.Read
   
   3. Under **Authentication**:
      1. **Supported account types** > **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** is selected.
      2. **Implicit grant and hybrid flows** > **ID tokens (used for implicit and hybrid flows)** is selected.
      3. **Allow public client flows** is enabled.

1. If delegated authentication is used, in the Power BI Azure AD tenant, validate the following Power BI admin user settings:
   1. The user is assigned to the Power BI administrator role.
   2. At least one [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) is assigned to the user.
   3. If the user is recently created, sign in with the user at least once, to make sure that the password is reset successfully, and the user can successfully initiate the session.
   4. There are no multifactor authentication or conditional access policies enforced on the user.

1. Validate the following self-hosted runtime settings:
   1. The latest version of the [self-hosted runtime](https://www.microsoft.com/download/details.aspx?id=39717) is installed on the VM.
   1. Network connectivity from the self-hosted runtime to the Power BI tenant is enabled. The following endpoints must be reachable from self-hosted runtime VM:
      - `*.powerbi.com` 
      - `*.analysis.windows.net` 
   
   1. Network connectivity from the self-hosted runtime to Microsoft services is enabled.
   1. [JDK 8 or later](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed.
1. In Power BI tenant, In Azure Active Directory create a security group.
1. In Power BI tenant, from Azure Active Directory tenant, make sure [Service Principal is member of the new security group](#authenticate-to-power-bi-tenant).
1. On the Power BI Tenant Admin portal, validate if [Allow service principals to use read-only Power BI admin APIs](#associate-the-security-group-with-power-bi-tenant) is enabled for the new security group. 
---

## Register the Power BI tenant

1. From the options on the left, select **Data Map**.

1. Select **Register**, and then select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Screenshot that shows the list of data sources available to choose.":::

1. Give your Power BI instance a friendly name. The name must be 3 to 63 characters long, and must contain only letters, numbers, underscores, and hyphens. Spaces aren't allowed.

1. Edit the **Tenant ID** field, to replace with the cross-tenant Power BI that you want to register and scan. By default, the Power BI tenant ID that exists in the same Azure AD instance as Microsoft Purview is populated.

     :::image type="content" source="media/setup-power-bi-scan-catalog-portal/register-cross-tenant.png" alt-text="Screenshot that shows the registration experience for cross-tenant Power BI.":::

## Scan cross-tenant Power BI

Delegated authentication is the only supported option for cross-tenant scanning. You can use either Azure runtime or a self-hosted integration runtime to run a scan.

> [!TIP]
> To troubleshoot any issues with scanning:
> 1. Confirm you have completed the [deployment checklist for your scenario](#deployment-checklist).
> 1. Review the [scan troubleshooting documentation](register-scan-power-bi-tenant-troubleshoot.md).

### Authenticate to Power BI tenant

In Azure Active Directory Tenant, where Power BI tenant is located:

1. In the [Azure portal](https://portal.azure.com), search for **Azure Active Directory**.
   
2. Create a new security group in your Azure Active Directory, by following [Create a basic group and add members using Azure Active Directory](../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

    > [!Tip]
    > You can skip this step if you already have a security group you want to use.

3. Select **Security** as the **Group Type**.

    :::image type="content" source="./media/setup-power-bi-scan-PowerShell/security-group.png" alt-text="Screenshot of security group type.":::

4. Add your **service principal** to this security group. Select **Members**, then select **+ Add members**.

5. Search for your Microsoft Purview managed identity or service principal and select it.

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

5. Select **Admin API settings** > **Enhance admin APIs responses with detailed metadata** > Enable the toggle to allow Microsoft Purview Data Map automatically discover the detailed metadata of Power BI datasets as part of its scans.

    > [!IMPORTANT]
    > After you update the Admin API settings on your power bi tenant, wait around 15 minutes before registering a scan and test connection.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-sub-artifacts.png" alt-text="Image showing the Power BI admin portal config to enable subartifact scan.":::

    > [!Caution]
    > When you allow the security group you created (that has your Microsoft Purview managed identity as a member) to use read-only Power BI admin APIs, you also allow it to access the metadata (e.g. dashboard and report names, owners, descriptions, etc.) for all of your Power BI artifacts in this tenant. Once the metadata has been pulled into the Microsoft Purview, Microsoft Purview's permissions, not Power BI permissions, determine who can see that metadata.
  
    > [!Note]
    > You can remove the security group from your developer settings, but the metadata previously extracted won't be removed from the Microsoft Purview account. You can delete it separately, if you wish.

### Create scan for cross-tenant using Azure IR with delegated authentication 

To create and run a new scan by using the Azure runtime, perform the following steps:

1. Create a user account in the Azure AD tenant where the Power BI tenant is located, and assign the user to the Azure AD role, **Power BI Administrator**. Take note of the username and sign in to change the password.

1. Assign the proper Power BI license to the user.  

1. Go to the instance of Azure Key Vault in the tenant where Microsoft Purview is created.

1. Select **Settings** > **Secrets**, and then select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot of the instance of Azure Key Vault.":::

1. Enter a name for the secret. For **Value**, type the newly created password for the Azure AD user. Select **Create** to complete.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault-secret.png" alt-text="Screenshot that shows how to generate a secret in Azure Key Vault.":::

1. If your key vault isn't connected to Microsoft Purview yet, you need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).
   
1. Create an app registration in your Azure AD tenant where Power BI is located. Provide a web URL in the **Redirect URI**. 

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant-app-registration.png" alt-text="Screenshot how to create App in Azure AD for cross tenant.":::
 
3. Take note of the client ID (app ID).

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-create-service-principle.png" alt-text="Screenshot that shows how to create a service principle.":::
  
1. From the Azure AD dashboard, select the newly created application, and then select **App permissions**. Assign the application the following delegated permissions, and grant admin consent for the tenant:

   - Power BI Service Tenant.Read.All
   - Microsoft Graph openid
   - Microsoft Graph User.Read

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-delegated-permissions.png" alt-text="Screenshot of delegated permissions on Power BI and Microsoft Graph.":::

1. From the Azure AD dashboard, select the newly created application, and then select **Authentication**. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-multitenant.png" alt-text="Screenshot of account type support multitenant.":::

1. Under **Implicit grant and hybrid flows**, select **ID tokens (used for implicit and hybrid flows)**.
    
      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-id-token-hybrid-flows.png" alt-text="Screenshot of ID token hybrid flows.":::

1. Under **Advanced settings**, enable **Allow Public client flows**.

1. In the Microsoft Purview Studio, go to the **Data map** in the left menu. Go to **Sources**.

1. Select the registered Power BI source from cross-tenant.

1. Select **+ New scan**.

1. Give your scan a name. Then select the option to include or exclude the personal workspaces.
   
   > [!Note]
   > If you switch the configuration of a scan to include or exclude a personal workspace, you trigger a full scan of the Power BI source.

1. Select **Azure AutoResolveIntegrationRuntime** from the dropdown list.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant.png" alt-text="Screenshot that shows the Power BI scan setup, using Azure integration runtime for cross-tenant.":::

1. For the **Credential**, select **Delegated authentication**, and then select **+ New** to create a new credential.
 
1. Create a new credential and provide the following required parameters:
    
   - **Name**: Provide a unique name for the credential.

   - **Client ID**: Use the service principal client ID (app ID) that you created earlier.
   
   - **User name**: Provide the username of the Power BI administrator that you created earlier.
   
   - **Password**: Select the appropriate Key Vault connection, and the **Secret name** where the Power BI account password was saved earlier.

        :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-delegated-authentication.png" alt-text="Screenshot that shows the Power BI scan setup, using delegated authentication.":::

1. Select **Test connection** before continuing to the next steps.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant-test.png" alt-text="Screenshot that shows the test connection status.":::

    If the test fails, select **View Report** to see the detailed status and troubleshoot the problem:

      1. *Access - Failed* status means that the user authentication failed. Validate if the  username and password are correct. Review if the credential contains the correct client (app) ID from the app registration.
      2. *Assets (+ lineage) - Failed* status means that the authorization between Microsoft Purview and Power BI has failed. Make sure that the user is added to the Power BI administrator role, and has the proper Power BI license assigned.
      3. *Detailed metadata (Enhanced) - Failed* status means that the Power BI admin portal is disabled for the following setting: **Enhance admin APIs responses with detailed metadata**.

1. Set up a scan trigger. Your options are **Recurring** or **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Microsoft Purview scan scheduler.":::

1. On **Review new scan**, select **Save and run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Screenshot that shows how to save and run the Power BI source.":::

### Create scan for cross-tenant using self-hosted IR with service principal

To create and run a new scan by using the self-hosted integration runtime, perform the following steps:

1. Create an app registration in your Azure AD tenant where Power BI is located. Provide a web URL in the **Redirect URI**. 

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-cross-tenant-app-registration.png" alt-text="Screenshot how to create App in Azure AD for cross tenant.":::
 
2. Take note of the client ID (app ID).

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-create-service-principle.png" alt-text="Screenshot that shows how to create a service principle.":::
  
1. From the Azure AD dashboard, select the newly created application, and then select **App permissions**. Assign the application the following delegated permissions:

   - Microsoft Graph openid
   - Microsoft Graph User.Read

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-spn-api-permissions.png" alt-text="Screenshot of delegated permissions on Microsoft Graph.":::

1. From the Azure AD dashboard, select the newly created application, and then select **Authentication**. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant)**. 

      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-multitenant.png" alt-text="Screenshot of account type support multitenant.":::

1. Under **Implicit grant and hybrid flows**, select **ID tokens (used for implicit and hybrid flows)**.
    
      :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-id-token-hybrid-flows.png" alt-text="Screenshot of ID token hybrid flows.":::

1. Under **Advanced settings**, enable **Allow Public client flows**.

1. In the tenant where Microsoft Purview is created go to the instance of Azure Key Vault.

1. Select **Settings** > **Secrets**, and then select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot of the instance of Azure Key Vault.":::

1. Enter a name for the secret. For **Value**, type the newly created secret for the App registration. Select **Create** to complete.

    
2. Under **Certificates & secrets**, create a new secret and save it securely for next steps.

3. In Azure portal, navigate to your Azure key vault.

4. Select **Settings** > **Secrets** and select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot how to navigate to Azure Key Vault.":::

5. Enter a name for the secret and for **Value**, type the newly created secret for the App registration. Select **Create** to complete.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault-secret-spn.png" alt-text="Screenshot how to generate an Azure Key Vault secret for SPN.":::

1. If your key vault isn't connected to Microsoft Purview yet, you need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account).
   
1. In the Microsoft Purview Studio, go to the **Data map** in the left menu. Go to **Sources**.

1. Select the registered Power BI source from cross-tenant.

1. Select **+ New scan**.

1. Give your scan a name. Then select the option to include or exclude the personal workspaces.
   
   > [!Note]
   > If you switch the configuration of a scan to include or exclude a personal workspace, you trigger a full scan of the Power BI source.

1. Select your self-hosted integration runtime from the drop-down list.

1. For the **Credential**, select **Service Principal**, and then select **+ New** to create a new credential.
 
1. Create a new credential and provide the following required parameters:
    
  - **Name**: Provide a unique name for credential
  - **Authentication method**: Service principal
  - **Tenant ID**: Your Power BI tenant ID
  - **Client ID**: Use Service Principal Client ID (App ID) you created earlier

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-scan-spn-authentication.png" alt-text="Screenshot of the new credential menu, showing Power BI credential for SPN with all required values supplied.":::

1. Select **Test connection** before continuing to the next steps.

    If the test fails, select **View Report** to see the detailed status and troubleshoot the problem:

      1. *Access - Failed* status means that the user authentication failed. Validate if the App ID and secret are correct. Review if the credential contains the correct client (app) ID from the app registration.
      2. *Assets (+ lineage) - Failed* status means that the authorization between Microsoft Purview and Power BI has failed. Make sure that the user is added to the Power BI administrator role, and has the proper Power BI license assigned.
      3. *Detailed metadata (Enhanced) - Failed* status means that the Power BI admin portal is disabled for the following setting: **Enhance admin APIs responses with detailed metadata**.

1. Set up a scan trigger. Your options are **Recurring** or **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Microsoft Purview scan scheduler.":::

1. On **Review new scan**, select **Save and run** to launch your scan.

## Next steps

Now that you've registered your source, see the following guides to learn more about Microsoft Purview and your data.

- [Data estate insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search data catalog](how-to-search-catalog.md)
