---
title: Connect to and manage a Power BI tenant cross tenant
description: This guide describes how to connect to a cross-tenant Power BI tenant in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Power BI tenant source.
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 04/29/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage a Power BI tenant in Microsoft Purview (Cross Tenant)

This article outlines how to register a Power BI tenant in a cross-tenant scenario, and how to authenticate and interact with the tenant in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#deployment-checklist)| [Yes](#deployment-checklist)| Yes | No | No | No| [Yes](how-to-lineage-powerbi.md)|

### Supported scenarios for Power BI scans

|**Scenarios**  |**Microsoft Purview public access allowed/denied** |**Power BI public access allowed /denied** | **Runtime option** | **Authentication option**  | **Deployment checklist** | 
|---------|---------|---------|---------|---------|---------|
|Public access with Azure IR     |Allowed     |Allowed        |Azure runtime      |Delegated Authentication    | [Deployment checklist](#deployment-checklist) |
|Public access with Self-hosted IR     |Allowed     |Allowed        |Self-hosted runtime        |Delegated Authentication  | [Deployment checklist](#deployment-checklist) |

### Known limitations

-  For cross-tenant scenario, delegated authentication is only supported option for scanning.
-  You can create only one scan for a Power BI data source that is registered in your Microsoft Purview account.
-  If Power BI dataset schema is not shown after scan, it is due to one of the current limitations with [Power BI Metadata scanner](/power-bi/admin/service-admin-metadata-scanning).

## Prerequisites

Before you start, make sure you have the following prerequisites:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active [Microsoft Purview account](create-catalog-portal.md).
  
## Authentication options 

- Delegated Authentication

## Deployment checklist
Use any of the following deployment checklists during the setup or for troubleshooting purposes, based on your scenario:   

# [Public access with Azure IR](#tab/Scenario1)

### Scan cross-tenant Power BI using Azure IR and Delegated Authentication in public network

1. Make sure Power BI and Microsoft Purview accounts are in cross-tenant.

2. Make sure Power BI tenant Id is entered correctly during the registration. By default, Power BI tenant ID that exists in the same Azure Active Directory as Microsoft Purview will be populated.

3. From Azure portal, validate if Microsoft Purview account Network is set to public access.

4. From Power BI tenant Admin Portal, make sure Power BI tenant is configured to allow public network.

5. Check your Azure Key Vault to make sure:
   1. There are no typos in the password.
   2. Microsoft Purview Managed Identity has get/list access to secrets.

6. Review your credential to validate: 
   1. Client ID matches _Application (Client) ID_ of the app registration.
   2. Username includes the user principal name such as `johndoe@contoso.com`.

7. In Power BI Azure AD tenant, validate Power BI admin user settings to make sure:
   1. User is assigned to Power BI Administrator role.
   2. At least one [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) is assigned to the user.
   3. If user is recently created, login with the user at least once to make sure password is reset successfully and user can successfully initiate the session.
   4. There is no MFA or Conditional Access Policies are enforced on the user.

8. In Power BI Azure AD tenant, validate App registration settings to make sure:
   1. App registration exists in your Azure Active Directory tenant where Power BI tenant is located.
   2. Under **API permissions**, the following **delegated permissions** and **grant admin consent for the tenant** is set up with read for the following APIs:
      1. Power BI Service Tenant.Read.All
      2. Microsoft Graph openid
      3. Microsoft Graph User.Read
   3. Under **Authentication**:
      1. **Supported account types**, **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** is selected.
      2. **Implicit grant and hybrid flows**, **ID tokens (used for implicit and hybrid flows)** is selected.
      3. **Allow public client flows** is enabled.
   
# [Public access with Self-hosted IR](#tab/Scenario2)
### Scan cross-tenant Power BI using self-hosted IR and Delegated Authentication in public network

1. Make sure Power BI and Microsoft Purview accounts are in cross-tenant.

2. Make sure Power BI tenant Id is entered correctly during the registration.By default, Power BI tenant ID that exists in the same Azure Active Directory as Microsoft Purview will be populated.

3. From Azure portal, validate if Microsoft Purview account Network is set to public access.

4. From Power BI tenant Admin Portal, make sure Power BI tenant is configured to allow public network.

5. Check your Azure Key Vault to make sure:
   1. There are no typos in the password.
   2. Microsoft Purview Managed Identity has get/list access to secrets.

6. Review your credential to validate: 
   1. Client ID matches _Application (Client) ID_ of the app registration.
   2. Username includes the user principal name such as `johndoe@contoso.com`.

8. In Power BI Azure AD tenant, validate Power BI admin user settings to make sure:
   1. User is assigned to Power BI Administrator role.
   2. At least one [Power BI license](/power-bi/admin/service-admin-licensing-organization#subscription-license-types) is assigned to the user.
   3. If user is recently created, login with the user at least once to make sure password is reset successfully and user can successfully initiate the session.
   4. There is no MFA or Conditional Access Policies are enforced on the user.

9. In Power BI Azure AD tenant, validate App registration settings to make sure:
   5. App registration exists in your Azure Active Directory tenant where Power BI tenant is located.
   6. Under **API permissions**, the following **delegated permissions** and **grant admin consent for the tenant** is set up with read for the following APIs:
      1. Power BI Service Tenant.Read.All
      2. Microsoft Graph openid
      3. Microsoft Graph User.Read
   7. Under **Authentication**:
      1. **Supported account types**, **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** is selected.
      2. **Implicit grant and hybrid flows**, **ID tokens (used for implicit and hybrid flows)** is selected.
      3. **Allow public client flows** is enabled.

10. Validate Self-hosted runtime settings:
   8.  Latest version of [Self-hosted runtime](https://www.microsoft.com/download/details.aspx?id=39717) is installed on the VM.
   9.  Network connectivity from Self-hosted runtime to Power BI tenant is enabled.
   10. Network connectivity from Self-hosted runtime to Microsoft services is enabled.
   11. [JDK 8 or later](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) is installed.

---

## Register Power BI tenant

1. Select the **Data Map** on the left navigation.

1. Then select **Register**.

    Select **Power BI** as your data source.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/select-power-bi-data-source.png" alt-text="Image showing the list of data sources available to choose.":::

1. Give your Power BI instance a friendly name. The name must be between 3-63 characters long and must contain only letters, numbers, underscores, and hyphens.  Spaces aren't allowed.

1. Edit the Tenant ID field to replace with cross Power BI tenant you want to register and scan. By default, Power BI tenant ID that exists in the same Azure Active Directory as Microsoft Purview will be populated.

     :::image type="content" source="media/setup-power-bi-scan-catalog-portal/register-cross-tenant.png" alt-text="Image showing the registration experience for cross tenant Power BI":::

## Scan cross-tenant Power BI

### Scan cross-tenant Power BI using Delegated authentication 

Delegated authentication is the only supported option for cross-tenant scan option, however, you can use either Azure runtime or a self-hosted integration runtime to run a scan. 

To create and run a new scan using Azure runtime, perform the following steps:

1. Create a user account in Azure Active Directory tenant where Power BI tenant is located and assign the user to Azure Active Directory role, **Power BI Administrator**. Take note of username and login to change the password.

2. Assign proper Power BI license to the user.  

2. Navigate to your Azure key vault in the tenant where Microsoft Purview is created.

3. Select **Settings** > **Secrets** and select **+ Generate/Import**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault.png" alt-text="Screenshot how to navigate to Azure Key Vault.":::

5. Enter a name for the secret and for **Value**, type the newly created password for the Azure AD user. Select **Create** to complete.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/power-bi-key-vault-secret.png" alt-text="Screenshot how to generate an Azure Key Vault secret.":::

6. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
   
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

12. In the Microsoft Purview Studio, navigate to the **Data map** in the left menu. Navigate to **Sources**.

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
      2. Assets (+ lineage) - Failed status means the Microsoft Purview - Power BI authorization has failed. Make sure the user is added to Power BI Administrator role and has proper Power BI license assigned to.
      3. Detailed metadata (Enhanced) - Failed status means the Power BI admin portal is disabled for the following setting - **Enhance admin APIs responses with detailed metadata**

20. Set up a scan trigger. Your options are **Recurring**, and **Once**.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/scan-trigger.png" alt-text="Screenshot of the Microsoft Purview scan scheduler.":::

18. On **Review new scan**, select **Save and run** to launch your scan.

    :::image type="content" source="media/setup-power-bi-scan-catalog-portal/save-run-power-bi-scan.png" alt-text="Screenshot of Save and run Power BI source.":::

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
