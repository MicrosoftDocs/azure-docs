---

title: Tutorial to migrate your applications from Okta to Azure Active Directory
description: Learn how to migrate your applications from Okta to Azure Active Directory.
services: active-directory
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/19/2022
ms.author: gasinh
ms.subservice: app-mgmt
---

# Tutorial: Migrate your applications from Okta to Azure Active Directory

In this tutorial, you'll learn how to migrate your applications from Okta to Azure Active Directory (Azure AD).

## Create an inventory of current Okta applications

Before migration, document the current environment and application settings. You can use the Okta API to collect this information. Use an API explorer tool such as [Postman](https://www.postman.com/).

To create an application inventory:

1. With the Postman app, generate an API token from the Okta admin console.
2. On the API dashboard, under **Security**, select **Tokens** > **Create Token**.

   ![Screenshot that shows the button for creating a token.](media/migrate-applications-from-okta-to-azure-active-directory/token-creation.png)

3. Insert a token name and then select **Create Token**.

   ![Screenshot that shows where to name the token.](media/migrate-applications-from-okta-to-azure-active-directory/token-created.png)

4. Record the token value and save it. It's not accessible after you select **OK, got it**.

   ![Screenshot that shows the Token Value box.](media/migrate-applications-from-okta-to-azure-active-directory/record-created.png)

5. In the Postman app, in the workspace, select **Import**.

   ![Screenshot that shows the Import A P I.](media/migrate-applications-from-okta-to-azure-active-directory/import-api.png)

6. On the **Import** page, select **Link**. Then insert the following link to import the API:

`https://developer.okta.com/docs/api/postman/example.oktapreview.com.environment`

   ![Screenshot that shows the link to import.](media/migrate-applications-from-okta-to-azure-active-directory/link-to-import.png)

>[!NOTE]
>Don't modify the link with your tenant values.

7. Select **Import**.

   ![Screenshot that shows the next Import page.](media/migrate-applications-from-okta-to-azure-active-directory/next-import-menu.png)

8. After the API is imported, change the **Environment** selection to **{yourOktaDomain}**.
9. To edit your Okta environment select the **eye** icon. Then select **Edit**.

   ![Screenshot that shows how to edit the Okta environment.](media/migrate-applications-from-okta-to-azure-active-directory/edit-environment.png)

10. Update the values for the URL and API key in the **Initial Value** and **Current Value** fields. Change the name to reflect your environment. 
11. Save the values.

    ![Screenshot that shows how to update values for the A P I.](media/migrate-applications-from-okta-to-azure-active-directory/update-values-for-api.png)

12. [Load the API into Postman](https://app.getpostman.com/run-collection/377eaf77fdbeaedced17).
13. Select **Apps** > **Get List Apps** > **Send**.

>[!NOTE]
>You can print the applications in your Okta tenant. The list is in JSON format.

   ![Screenshot that shows a list of applications in the Okta tenant.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-applications.png)

We recommend you copy and convert this JSON list to a CSV format:

* Use a public converter such as [Konklone](https://konklone.io/json/)
* Or for PowerShell, use [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json) and [ConvertTo-CSV](/powershell/module/microsoft.powershell.utility/convertto-csv)

>[!NOTE]
>Download the CSV to have a record of the applications in your Okta tenant.

## Migrate a SAML application to Azure AD

To migrate a SAML 2.0 application to Azure AD, configure the application in your Azure AD tenant for application access. In this example, we convert a Salesforce instance. Follow the [Salesforce tutorial](../saas-apps/salesforce-tutorial.md) to configure the applications.

To complete the migration, repeat the configuration for all applications in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications** > **New application**.

   ![Screenshot that shows a list of new applications.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-new-applications.png)

2. In **Azure AD Gallery**, search for **Salesforce**, select the application, and then select **Create**.

   ![Screenshot that shows the Salesforce application in Azure A D Gallery.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-application.png)

3. After the application is created, on the **Single sign-on** (SSO) tab, select **SAML**.

   ![Screenshot that shows the SAML application.](media/migrate-applications-from-okta-to-azure-active-directory/saml-application.png)

4. Download the **Certificate (Raw)** and **Federation Metadata XML** to import it into Salesforce.

   ![Screenshot that shows where to download federation metadata.](media/migrate-applications-from-okta-to-azure-active-directory/federation-metadata.png)

5. On the Salesforce admin console, select **Identity** > **Single Sign-On Settings** > **New from Metadata File**.

   ![Screenshot that shows the Salesforce admin console.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-admin-console.png)

6. Upload the XML file you downloaded from the Azure AD portal. Then select **Create**.
7. Upload the certificate you downloaded from Azure. Select **Save** to create the SAML provider in Salesforce.

   ![Screenshot that shows how to create the SAML provider in Salesforce.](media/migrate-applications-from-okta-to-azure-active-directory/create-saml-provider.png)

8. Record the values in the following fields. The values are in Azure.

   * **Entity ID**
   * **Login URL**
   * **Logout URL**

9. Select **Download Metadata**.

   ![Screenshot that shows the values you should record for use in Azure.](media/migrate-applications-from-okta-to-azure-active-directory/record-values-for-azure.png)

10. On the Azure AD **Enterprise applications** page, in the SAML SSO settings, select **Upload metadata file** to upload the file to the Azure AD portal. Ensure the imported values match the recorded values. Select **Save**.

   ![Screenshot that shows how to upload the metadata file in Azure A D.](media/migrate-applications-from-okta-to-azure-active-directory/upload-metadata-file.png)

11. In the Salesforce administration console, select **Company Settings** > **My Domain**. Go to **Authentication Configuration** and then select **Edit**.

    ![Screenshot that shows how to edit company settings.](media/migrate-applications-from-okta-to-azure-active-directory/edit-company-settings.png)

12. For a sign-in option, select the new SAML provider you configured. Select **Save**.

    ![Screenshot that shows where to save the SAML provider option.](media/migrate-applications-from-okta-to-azure-active-directory/save-saml-provider.png)

13. In Azure AD, on the **Enterprise applications** page, select **Users and groups**. Then add test users.

    ![Screenshot that shows added test users.](media/migrate-applications-from-okta-to-azure-active-directory/add-test-user.png)

14. To test the configuration, sign in as a test user. Go to the Microsoft [apps gallery](https://aka.ms/myapps) and then select **Salesforce**.

    ![Screenshot that shows how to open Salesforce from the app gallery.](media/migrate-applications-from-okta-to-azure-active-directory/test-user-sign-in.png)

15. Select the configured identity provider (IdP) to sign in.

    ![Screenshot that shows where to sign in.](media/migrate-applications-from-okta-to-azure-active-directory/new-identity-provider.png)

>[!NOTE]
>If configuration is correct, the test user lands on the Salesforce home page. For troubleshooting help, see the [debugging guide](../manage-apps/debug-saml-sso-issues.md).

16. On the **Enterprise applications** page, assign the remaining users to the Salesforce application with the correct roles.

>[!NOTE]
>After you add the remaining users to the Azure AD application, users can test the connection to ensure they have access. Test the connection before the next step.

17. On the Salesforce administration console, select **Company Settings** > **My Domain**.

18. Under **Authentication Configuration**, select **Edit**. For authentication service, clear the selection for **Okta**.

    ![Screenshot that shows where to clear the selection for Okta as an authentication service.](media/migrate-applications-from-okta-to-azure-active-directory/deselect-okta.png)

## Migrate an OpenID Connect or OAuth 2.0 application to Azure AD

To migrate an OpenID Connect (OIDC) or OAuth 2.0 application to Azure AD, in your Azure AD tenant, configure the application for access. In this example, we convert a custom OIDC app.

To complete the migration, repeat configuration for all applications in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications**. 
2. Under **All applications**, select **New application**.
3. Select **Create your own application**. 
4. On the menu that appears, name the OIDC app and then select **Register an application you're working on to integrate with Azure AD**. 
5. Select **Create**.
6. On the next page, set up the tenancy of your application registration. For more information, see [Tenancy in Azure Active Directory](../develop/single-and-multi-tenant-apps.md). Go to **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** > **Register**.

   ![Screenshot that shows how to select Azure A D directory multitenant.](media/migrate-applications-from-okta-to-azure-active-directory/multitenant-azure-ad-directory.png)

7. On the **App registrations** page, under **Azure Active Directory**, open the created registration.

>[!NOTE]
>Depending on the [application scenario](../develop/authentication-flows-app-scenarios.md), there are various configuration actions. Most scenarios require an app client secret.

8. On the **Overview** page, record the **Application (client) ID**. You use this ID in your application.

   ![Screenshot that shows the application client I D.](media/migrate-applications-from-okta-to-azure-active-directory/application-client-id.png)

9. On the left, select **Certificates & secrets**. Then select **New client secret**. Name the client secret and set its expiration.

   ![Screenshot that shows the new client secret.](media/migrate-applications-from-okta-to-azure-active-directory/new-client-secret.png)

10. Record the value and ID of the secret.

>[!NOTE]
>If you misplace the client secret, you can't retrieve it. Instead, regenerate a secret.

11. On the left, select **API permissions**. Then grant the application access to the OIDC stack.
12. Select **Add permission** > **Microsoft Graph** > **Delegated permissions**.
13. In the **OpenId permissions** section, select **email**, **openid**, and **profile**. Then select **Add permissions**.
14. To improve user experience and suppress user consent prompts, select **Grant admin consent for Tenant Domain Name**. Wait for the **Granted** status to appear.

    ![Screenshot that shows where to grant admin consent.](media/migrate-applications-from-okta-to-azure-active-directory/grant-admin-consent.png)

15. If your application has a redirect URI, enter the URI. If the reply URL targets the **Authentication** tab, followed by **Add a platform** and **Web**, enter the URL. 
16. Select **Access tokens** and **ID tokens**. 
17. Select **Configure**.
18. If needed, on the **Authentication** menu, under **Advanced settings** and **Allow public client flows**, select **Yes**.

    ![Screenshot that shows how to allow public client flows.](media/migrate-applications-from-okta-to-azure-active-directory/allow-client-flows.png)

19. In your OIDC-configured application, import the application ID and client secret before you test. 

>[!NOTE]
>Use the previous steps to configure your application with settings such as client ID, secret, and scopes.

## Migrate a custom authorization server to Azure AD

Okta authorization servers map one-to-one to application registrations that [expose an API](../develop/quickstart-configure-app-expose-web-apis.md#add-a-scope).

Map the default Okta authorization server to Microsoft Graph scopes or permissions.

![Screenshot that shows the default Okta authorization.](media/migrate-applications-from-okta-to-azure-active-directory/default-okta-authorization.png)

## Next steps

- [Migrate Okta federation to Azure AD](migrate-okta-federation-to-azure-active-directory.md)
- [Migrate Okta sync provisioning to Azure AD Connect-based synchronization](migrate-okta-sync-provisioning-to-azure-active-directory.md)
- [Migrate Okta sign-on policies to Azure AD Conditional Access](migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access.md)
