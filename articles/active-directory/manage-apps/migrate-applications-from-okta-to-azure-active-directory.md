---

title: Tutorial to migrate your applications from Okta to Azure Active Directory
description: Learn how to migrate your applications from Okta to Azure Active Directory.
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

In this tutorial, you'll learn how to migrate your applications from Okta to Azure Active Directory (Azure AD).

## Create an inventory of current Okta applications

Before you begin the migration, you should document the current environment and application settings. You can use the Okta API to collect this information from a centralized location. To use the API, you'll need an API explorer tool such as [Postman](https://www.postman.com/).

Follow these steps to create an application inventory:

1. Install the Postman app. Then generate an API token from the Okta admin console.

1. On the API dashboard, under **Security**, select **Tokens** > **Create Token**.

   ![Screenshot that shows the button for creating a token.](media/migrate-applications-from-okta-to-azure-active-directory/token-creation.png)

1. Insert a token name and then select **Create Token**.

   ![Screenshot that shows where to name the token.](media/migrate-applications-from-okta-to-azure-active-directory/token-created.png)

1. Record the token value and save it. It won't be accessible after you select **OK, got it**.

   ![Screenshot that shows the Token Value box.](media/migrate-applications-from-okta-to-azure-active-directory/record-created.png)

1. In the Postman app, in the workspace, select **Import**.

   ![Screenshot that shows the Import A P I.](media/migrate-applications-from-okta-to-azure-active-directory/import-api.png)

1. On the **Import** page, select **Link**. Then insert the following link to import the API:
`https://developer.okta.com/docs/api/postman/example.oktapreview.com.environment`

   ![Screenshot that shows the link to import.](media/migrate-applications-from-okta-to-azure-active-directory/link-to-import.png)

   >[!NOTE]
   >Don't modify the link with your tenant values.

1. Continue by selecting **Import**.

   ![Screenshot that shows the next Import page.](media/migrate-applications-from-okta-to-azure-active-directory/next-import-menu.png)

1. After the API is imported, change the **Environment** selection to **{yourOktaDomain}**.

   :::image type="content" source="media/migrate-applications-from-okta-to-azure-active-directory/change-environment.png" alt-text="Screenshot that shows how to change the environment." lightbox="media/migrate-applications-from-okta-to-azure-active-directory/change-environment.png":::

1. Edit your Okta environment by selecting the eye icon. Then select **Edit**.

   ![Screenshot that shows how to edit the Okta environment.](media/migrate-applications-from-okta-to-azure-active-directory/edit-environment.png)

1. Update the values for the URL and API key in the **Initial Value** and **Current Value** fields. Change the name to reflect your environment. Then save the values.

    ![Screenshot that shows how to update values for the A P I.](media/migrate-applications-from-okta-to-azure-active-directory/update-values-for-api.png)

1. [Load the API into Postman](https://app.getpostman.com/run-collection/377eaf77fdbeaedced17).

1. Select **Apps** > **Get List Apps** > **Send**.

   Now you can print all the applications in your Okta tenant. The list is in JSON format.

    ![Screenshot that shows a list of applications in the Okta tenant.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-applications.png)

We recommend that you copy and convert this JSON list to a CSV format. You can use a public converter such as [Konklone](https://konklone.io/json/). Or for PowerShell, use [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json)
and [ConvertTo-CSV](/powershell/module/microsoft.powershell.utility/convertto-csv).

Download the CSV to keep a record of the applications in your Okta tenant for future reference.

## Migrate a SAML application to Azure AD

To migrate a SAML 2.0 application to Azure AD, first configure the application in your Azure AD tenant for application access. In this example, we'll convert a Salesforce instance. Follow [this tutorial](../saas-apps/salesforce-tutorial.md) to configure the applications.

To complete the migration, repeat the configuration steps for all applications discovered in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications** > **New application**.

   ![Screenshot that shows a list of new applications.](media/migrate-applications-from-okta-to-azure-active-directory/list-of-new-applications.png)

1. In **Azure AD Gallery**, search for **Salesforce**, select the application, and then select **Create**.

   ![Screenshot that shows the Salesforce application in Azure A D Gallery.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-application.png)

1. After the application is created, on the **Single sign-on** (SSO) tab, select **SAML**.

   ![Screenshot that shows the SAML application.](media/migrate-applications-from-okta-to-azure-active-directory/saml-application.png)

1. Download the **Certificate (Raw)** and **Federation Metadata XML** to import it into Salesforce.

   ![Screenshot that shows where to download federation metadata.](media/migrate-applications-from-okta-to-azure-active-directory/federation-metadata.png)

1. On the Salesforce admin console, select **Identity** > **Single Sign-On Settings** > **New from Metadata File**.

   ![Screenshot that shows the Salesforce admin console.](media/migrate-applications-from-okta-to-azure-active-directory/salesforce-admin-console.png)

1. Upload the XML file that you downloaded from the Azure AD portal. Then select **Create**.

   :::image type="content" source="media/migrate-applications-from-okta-to-azure-active-directory/upload-xml-file.png" alt-text="Screenshot that shows where to upload the XML file." lightbox="media/migrate-applications-from-okta-to-azure-active-directory/upload-xml-file.png":::

1. Upload the certificate that you downloaded from Azure. Then select **Save** to create the SAML provider in Salesforce.

   ![Screenshot that shows how to create the SAML provider in Salesforce.](media/migrate-applications-from-okta-to-azure-active-directory/create-saml-provider.png)

1. Record the values in the following fields. You'll use these values in Azure.
   * **Entity ID**
   * **Login URL**
   * **Logout URL**

   Then select **Download Metadata**.

   ![Screenshot that shows the values you should record for use in Azure.](media/migrate-applications-from-okta-to-azure-active-directory/record-values-for-azure.png)

1. On the Azure AD **Enterprise applications** page, in the SAML SSO settings, select **Upload metadata file** to upload the file to the Azure AD portal. Before you save, make sure that the imported values match the recorded values.

   ![Screenshot that shows how to upload the metadata file in Azure A D.](media/migrate-applications-from-okta-to-azure-active-directory/upload-metadata-file.png)

1. In the Salesforce administration console, select **Company Settings** > **My Domain**. Go to **Authentication Configuration** and then select **Edit**.

    ![Screenshot that shows how to edit company settings.](media/migrate-applications-from-okta-to-azure-active-directory/edit-company-settings.png)

1. For a sign-in option, select the new SAML provider you configured earlier. Then select **Save**.

    ![Screenshot that shows where to save the SAML provider option.](media/migrate-applications-from-okta-to-azure-active-directory/save-saml-provider.png)

1. In Azure AD, on the **Enterprise applications** page, select **Users and groups**. Then add test users.

    ![Screenshot that shows added test users.](media/migrate-applications-from-okta-to-azure-active-directory/add-test-user.png)

1. To test the configuration, sign in as one of the test users. Go to your Microsoft [apps gallery](https://aka.ms/myapps) and then select **Salesforce**.

    ![Screenshot that shows how to open Salesforce from the app gallery.](media/migrate-applications-from-okta-to-azure-active-directory/test-user-sign-in.png)

1. Select the newly configured identity provider (IdP) to sign in.

    ![Screenshot that shows where to sign in.](media/migrate-applications-from-okta-to-azure-active-directory/new-identity-provider.png)

    If everything has been correctly configured, the test user will land on the Salesforce home page. For troubleshooting help, see the [debugging guide](../manage-apps/debug-saml-sso-issues.md).

1. On the **Enterprise applications** page, assign the remaining users to the Salesforce application with the correct roles.

    >[!NOTE]
    >After you add the remaining users to the Azure AD application, the users should test the connection to ensure they have access. Test the connection before you move on to the next step.

1. On the Salesforce administration console, select **Company Settings** > **My Domain**.

1. Under **Authentication Configuration**, select **Edit**. Clear the selection for **Okta** as an authentication service.

    ![Screenshot that shows where to clear the selection for Okta as an authentication service.](media/migrate-applications-from-okta-to-azure-active-directory/deselect-okta.png)

Salesforce is now successfully configured with Azure AD for SSO.

## Migrate an OIDC/OAuth 2.0 application to Azure AD

To migrate an OpenID Connect (OIDC) or OAuth 2.0 application to Azure AD, in your Azure AD tenant, first configure the application for access. In this example, we'll convert a custom OIDC app.

To complete the migration, repeat the following configuration steps for all applications that are discovered in the Okta tenant.

1. In the [Azure AD portal](https://aad.portal.azure.com), select **Azure Active Directory** > **Enterprise applications**. Under **All applications**, select **New application**.

1. Select **Create your own application**. On the menu that appears, name the OIDC app and then select **Register an application you're working on to integrate with Azure AD**. Then select **Create**.

   :::image type="content" source="media/migrate-applications-from-okta-to-azure-active-directory/new-oidc-application.png" alt-text="Screenshot that shows how to create an O I D C application." lightbox="media/migrate-applications-from-okta-to-azure-active-directory/new-oidc-application.png":::

1. On the next page, set up the tenancy of your application registration. For more information, see [Tenancy in Azure Active Directory](../develop/single-and-multi-tenant-apps.md).

   In this example, we'll choose **Accounts in any organizational directory (Any Azure AD directory - Multitenant)** > **Register**.

   ![Screenshot that shows how to select Azure A D directory multitenant.](media/migrate-applications-from-okta-to-azure-active-directory/multitenant-azure-ad-directory.png)

1. On the **App registrations** page, under **Azure Active Directory**, open the newly created registration.

   Depending on the [application scenario](../develop/authentication-flows-app-scenarios.md), various configuration actions might be needed. Most scenarios require an app client secret, so we'll cover those scenarios.

1. On the **Overview** page, record the **Application (client) ID**. You'll use this ID in your application.

   ![Screenshot that shows the application client I D.](media/migrate-applications-from-okta-to-azure-active-directory/application-client-id.png)

1. On the left, select **Certificates & secrets**. Then select **New client secret**. Name the client secret and set its expiration.

   ![Screenshot that shows the new client secret.](media/migrate-applications-from-okta-to-azure-active-directory/new-client-secret.png)

1. Record the value and ID of the secret.

   >[!NOTE]
   >If you lose the client secret, you can't retrieve it. Instead, you'll need to regenerate a secret.

1. On the left, select **API permissions**. Then grant the application access to the OIDC stack.

1. Select **Add permission** > **Microsoft Graph** > **Delegated permissions**.

1. In the **OpenId permissions** section, select **email**, **openid**, and **profile**. Then select **Add permissions**.

    :::image type="content" source="media/migrate-applications-from-okta-to-azure-active-directory/add-openid-permission.png" alt-text="Screenshot that shows where to add Open I D permissions." lightbox="media/migrate-applications-from-okta-to-azure-active-directory/add-openid-permission.png":::

1. To improve user experience and suppress user consent prompts, select **Grant admin consent for Tenant Domain Name**. Then wait for the **Granted** status to appear.

    ![Screenshot that shows where to grant admin consent.](media/migrate-applications-from-okta-to-azure-active-directory/grant-admin-consent.png)

1. If your application has a redirect URI, enter the appropriate URI. If the reply URL targets the **Authentication** tab, followed by **Add a platform** and **Web**, enter the appropriate URL. Select **Access tokens** and **ID tokens**. Then select **Configure**.

    :::image type="content" source="media/migrate-applications-from-okta-to-azure-active-directory/configure-tokens.png" alt-text="Screenshot that shows how to configure tokens." lightbox="media/migrate-applications-from-okta-to-azure-active-directory/configure-tokens.png":::
    
    On the **Authentication** menu, under **Advanced settings** and **Allow public client flows**, if necessary, select **Yes**.

    ![Screenshot that shows how to allow public client flows.](media/migrate-applications-from-okta-to-azure-active-directory/allow-client-flows.png)

1. In your OIDC-configured application, import the application ID and client secret before you test. Follow the preceding steps to configure your application with settings such as client ID, secret, and scopes.

## Migrate a custom authorization server to Azure AD

Okta authorization servers map one-to-one to application registrations that [expose an API](../develop/quickstart-configure-app-expose-web-apis.md#add-a-scope).

The default Okta authorization server should be mapped to Microsoft Graph scopes or permissions.

![Screenshot that shows the default Okta authorization.](media/migrate-applications-from-okta-to-azure-active-directory/default-okta-authorization.png)

## Next steps

- [Migrate Okta federation to Azure AD](migrate-okta-federation-to-azure-active-directory.md)
- [Migrate Okta sync provisioning to Azure AD Connect-based synchronization](migrate-okta-sync-provisioning-to-azure-active-directory.md)
- [Migrate Okta sign-on policies to Azure AD Conditional Access](migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access.md)
