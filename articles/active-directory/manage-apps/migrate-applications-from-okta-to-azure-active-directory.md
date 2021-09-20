---

title: Tutorial to migrate your applications from Okta to Azure Active Directory
titleSuffix: Active Directory
description: Learn how to migrate your applications from Okta to Azure Active Directory
services: active-directory
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 09/01/2021
ms.author: gasinh
ms.subservice: app-mgmt
---

# Tutorial: Migrate your applications from Okta to Azure Active Directory

In this tutorial, learn how to migrate your applications from Okta to Azure Active Directory (Azure AD).

## Create an inventory of current Okta applications

Before you convert Okta applications to Azure AD, you should document the current environment and application settings. You can use the Okta API to collect this information from a centralized location. To use the API, you'll need an API explorer tool such as [Postman](https://www.postman.com/).

Follow these steps to create an application inventory:

1. Install the Postman app. After the installation, generate an API token from the Okta admin console.

2. On the API dashboard, under **Security**, select **Tokens** > **Create Token**.

   ![Screenshot that shows the "Create Token" button.](media/migrate-applications-from-okta-to-azure-active-directory/token-creation.png)

3. Insert a token name and then select **Create Token**.

   ![Screenshot showing where to name the token.](media/migrate-applications-from-okta-to-azure-active-directory/token-created.png)

4. After you select **Create Token**, record the value and save it. It won't be accessible after you select **OK, got it**.

   ![Screenshot shoiwng the token value that you must save.](media/migrate-applications-from-okta-to-azure-active-directory/record-created.png)

5. In the Postman app, in the workspace, select **Import**.

   ![Screenshot showing the Import A P I.](media/migrate-applications-from-okta-to-azure-active-directory/import-api.png)

6. On the **Import** page, select **Link**. Then insert the following link to import the API:
`https://developer.okta.com/docs/api/postman/example.oktapreview.com.environment`

   ![Screenshot showing the link to import.](media/migrate-applications-from-okta-to-azure-active-directory/link-to-import.png)

   >[!NOTE]
   >Don't modify the link with your tenant values.

7. Continue through the next page by selecting **Import**.

   ![Screenshot showing the next Import page.](media/migrate-applications-from-okta-to-azure-active-directory/next-import-menu.png)

8. After the API is imported, change the **Environment** selection to **{yourOktaDomain}**.

   ![Screenshot showing how to change the environment.](media/migrate-applications-from-okta-to-azure-active-directory/change-environment.png)

9. Edit your Okta environment by selecting the eye icon. Then select **Edit**.

   ![Screenshot showing how to edit the Okta environment.](media/migrate-applications-from-okta-to-azure-active-directory/edit-environment.png)

10. Update the values for the URL and API key in the **Initial value** and **Current value** fields. Also change the name to reflect your environment. Then save the values.

    ![Screenshot showing how to update values for the A P I.](media/migrate-applications-from-okta-to-azure-active-directory/update-values-for-api.png)

11. [Load the API into Postman](https://app.getpostman.com/run-collection/377eaf77fdbeaedced17).

12. Select **Apps** > **Get List Apps** > **Send**.

Now you can print all of the applications in your Okta tenant to a JSON format:

![Screenshot showing a list of applications in the Okta tenant.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-applications.png)

You should copy and convert this JSON list to a CSV format. You can use a public converter such as [Konklone](https://konklone.io/json/). Or for PowerShell, use [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json)
and [ConvertTo-CSV.](/powershell/module/microsoft.powershell.utility/convertto-csv)

After you download the CSV, you have recorded the applications in your Okta tenant for future reference.

## Migrate a SAML application to Azure AD

To migrate a SAML 2.0 application to Azure AD, first configure the application in your Azure AD tenant for application access. In this example, we'll convert a Salesforce instance. Follow [this tutorial](../saas-apps/salesforce-tutorial.md) to configure the applications.

To complete the migration, repeat the configuration steps for all applications discovered in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications** > **New application**.

   ![Screenshot showing a list of new applications.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-new-applications.png)

2. In **Azure AD Gallery**, search for **Salesforce**, select the application, and then select **Create**.

   ![Screenshot showing the Salesforce application in Azure A D Gallery.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-application.png)

3. After the application is created, on the **Single sign-on** (SSO) tab, select **SAML**.

   ![Screenshot showing the SAML application.](media/migrate-applications-from-okta-to-azure-active-directory/saml-application.png)

4. Download the **Federation Metadata XML and Certificate (Raw)** to import it into Salesforce.

   ![Screenshot showing where to download federation metadata.](media/migrate-applications-from-okta-to-azure-active-directory/federation-metadata.png)

5. After the XML is captured, on the Salesforce admin console, select **Identity** > **Single Sign-On Settings** > **New from Metadata File**

   ![Screenshot showing the Salesforce admin console.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-admin-console.png)

6. Upload the XML file that you downloaded from the Azure AD portal. Then select **Create**.

   ![Screenshot showing where to upload the XML file.](media/migrate-applications-from-okta-to-azure-active-directory/upload-xml-file.png)

7. Upload the certificate that you downloaded from Azure. Then select **Save** to create the SAML provider in Salesforce.

   ![Screenshot showing how to create the SAML provider in Salesforce.](media/migrate-applications-from-okta-to-azure-active-directory/create-saml-provider.png)

8. Record the values in the following fields. You'll use these in Azure. 
   * **Entity ID**
   * **Login URL** 
   * **Logout URL** 

   Then select **Download metadata**.

   ![Screenshot showing the values you should record for use in Azure.](media/migrate-applications-from-okta-to-azure-active-directory/record-values-for-azure.png)

9. On the Azure AD **Enterprise applications** page, in the SAML SSO settings, select **Upload metadata file** to upload the file to the Azure AD portal. Before you save, make sure that the imported values match the recorded values.

   ![Screenshot showing how to upload the metadata file in Azure AD.](media/migrate-applications-from-okta-to-azure-active-directory/upload-metadata-file.png)

10. In the Salesforce administration console, select **Company Settings** > **My Domain**. Go to **Authentication Configuration** and then select **Edit**.

    ![Screenshot showing how to edit company settings.](media/migrate-applications-from-okta-to-azure-active-directory/edit-company-settings.png)

11. For a sign-in option, select the new SAML provider you configured earlier. Then select **Save**.

    ![Screenshot showing where to save the SAML provider option.](media/migrate-applications-from-okta-to-azure-active-directory/save-saml-provider.png)

12. In Azure AD, on the **Enterprise applications** page, select **Users and groups**. Then add test users.

    ![Screenshot showing test users.](media/migrate-applications-from-okta-to-azure-active-directory/add-test-user.png)

13. To test the configuration, sign in as one of the test users. Go to your Microsoft [apps gallery](https://aka.ms/myapps) and then select **Salesforce**.

    ![Screenshot showing how to open Salesforce from the app gallery.](media/migrate-applications-from-okta-to-azure-active-directory/test-user-sign-in.png)

14. Select the newly configured identity provider (IdP) to sign in.

    ![Screenshot showing where to sign in.](media/migrate-applications-from-okta-to-azure-active-directory/new-identity-provider.png)

    If everything has been correctly configured, the test user will land on the Salesforce homepage. If you need to troubleshoot, see the [debugging guide](../manage-apps/debug-saml-sso-issues.md).

16. On the **Enterprise applications** page, assign the remaining users to the Salesforce application with the correct roles.

    >[!NOTE]
    >After you add the remaining users to the Azure AD application, the users should test the connection to ensure that there are no issues with access. Test the connection before you move on to the next step.

17. On the Salesforce administration console, select **Company Settings** > **My Domain**.

18. Under **Authentication Configuration**, select **Edit**. Clear the selection for Okta as an authentication service.

    ![Screenshot showing where to clear the selection for Okta as the authentication service.](media/migrate-applications-from-okta-to-azure-active-directory/deselect-okta.png)

Salesforce is now successfully configured with Azure AD for SSO. Later in this tutorial, follow the steps to clean up the Okta portal.

## Migrate an OIDC/OAuth 2.0 application to Azure AD

To migrate an OpenID Connect (OIDC) or OAuth 2.0 application to Azure AD, in your Azure AD tenant, first configure the application for access. In this example, we'll convert a custom OIDC app.

To complete the migration, repeat the following configuration steps for all applications that are discovered in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications**. Under **All applications**, select **New application**.

2. Select **Create your own application**. In the menu that appears, name the OIDC app and then select **Register an application you're working on to integrate with Azure AD**. Then select **Create**.

   ![Screenshot showing how to create an OIDC application.](media/migrate-applications-from-okta-to-azure-active-directory/new-oidc-application.png)

3. On the next page, set up the tenancy of your application registration. For more information, see [Tenancy in Azure Active Directory](../develop/single-and-multi-tenant-apps.md).

   In this example, we'll choose **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** > **Register**.

   ![Screenshot showing how to select Azure AD directory multitenant.](media/migrate-applications-from-okta-to-azure-active-directory/multitenant-azure-ad-directory.png)

4. On the **App registrations** page, under **Azure Active Directory**, open the newly created registration.

   Depending on the [application scenario](../develop/authentication-flows-app-scenarios.md), various configuration actions
   might be needed. Most scenarios require an app client secret, so we'll cover those scenarios.

5. On the **Overview** page, record the **Application (client) ID**. You'll use this ID in your application.

   ![Screenshot showing the application client I D.](media/migrate-applications-from-okta-to-azure-active-directory/application-client-id.png)

6. On the left, select **Certificates & Secrets**. Then select **New client secret**. Name the client secret and set its expiration.

   ![Screenshot showing the new client secret.](media/migrate-applications-from-okta-to-azure-active-directory/new-client-secret.png)

7. Before you leave this page, record the value and ID of the secret.

   >[!NOTE]
   >If you lose the client secret, you can't retrieve it. Instead, you'll need to regenerate a secret.

8. On the left, select **API permissions**. Then grant the application access to the OIDC stack.

9. Select **Add permission** > **Microsoft Graph** > **Delegated permissions**.

10. In the **OpenId permissions** section, select **email**, **openid**, and **profile**. Then select **Add permissions**.

    ![Screenshot showing where to add Open I D permissions.](media/migrate-applications-from-okta-to-azure-active-directory/add-openid-permission.png)

11. To improve user experience and suppress user consent prompts, select **Grant admin consent for Tenant Domain Name**. Then wait for the **Granted** status to appear.

    ![Screenshot showing where to grant admin consent.](media/migrate-applications-from-okta-to-azure-active-directory/grant-admin-consent.png)

12. If your application has a redirect URI, enter the appropriate URI. If the reply URL targets the **Authentication** tab, followed by **Add a platform** and **Web**, enter the appropriate URL. Select **Access tokens** and **ID tokens**. Then select **Configure**.

    ![Screenshot showing how to configure tokens.](media/migrate-applications-from-okta-to-azure-active-directory/configure-tokens.png)

    In the **Authentication** menu, under **Advanced settings** and **Allow public client flows**, if necessary, select **Yes**.

    ![Screenshot showing how to allow public client flows.](media/migrate-applications-from-okta-to-azure-active-directory/allow-client-flows.png)

13. In your OIDC-configured application, import the application ID and client secret before you test. Follow the preceding steps to configure your application with settings such as client ID, secret, and scopes.

## Migrate a custom authorization server to Azure AD

Okta authorization servers map one-to-one to application registrations that [expose an API](../develop/quickstart-configure-app-expose-web-apis.md#add-a-scope).

The default Okta authorization server should be mapped to Microsoft Graph scopes or permissions.

![Screenshot showing the default Okta authorization.](media/migrate-applications-from-okta-to-azure-active-directory/default-okta-authorization.png)

## Next steps 

- [Migrate Okta federation to Azure AD](migrate-okta-federation-to-azure-active-directory.md)

- [Migrate Okta sync provisioning to syncronization based on Azure AD Connect](migrate-okta-sync-provisioning-to-azure-active-directory.md)

- [Migrate Okta sign-on policies to Azure AD Conditional Access](migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access.md)