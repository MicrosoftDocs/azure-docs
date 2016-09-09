<properties
	pageTitle="How to configure Azure Active Directory authentication for your App Services application"
	description="Learn how to configure Azure Active Directory authentication for your App Services application."
	authors="mattchenderson"
	services="app-service"
	documentationCenter=""
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="05/04/2016"
	ms.author="mahender"/>

# How to configure your App Service application to use Azure Active Directory login

[AZURE.INCLUDE [app-service-mobile-selector-authentication](../../includes/app-service-mobile-selector-authentication.md)]

This topic shows you how to configure Azure App Services to use Azure Active Directory as an authentication provider.

## <a name="express"> </a>Configure Azure Active Directory using express settings

13. In the [Azure portal], navigate to your application. Click **Settings**, and then **Authentication/Authorization**.

14. If the Authentication / Authorization feature is not enabled, turn the switch to **On**.

15. Click **Azure Active Directory**, and then click **Express** under **Management Mode**.

16. Click **OK** to register the application in Azure Active Directory. This will create a new registration. If you want to choose an existing
registration instead, click **Select an existing app** and then search for the name of a previously created registration within your tenant.
Click the registration to select it and click **OK**. Then click **OK** on the Azure Active Directory settings blade.

    ![][0]

	By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.

17. (Optional) To restrict access to your site to only users authenticated by Azure Active Directory, set **Action to take when request
is not authenticated** to **Log in with Azure Active Directory**. This requires that all requests be authenticated, and all unauthenticated
requests are redirected to Azure Active Directory for authentication.

17. Click **Save**.

You are now ready to use Azure Active Directory for authentication in your app.

## <a name="advanced"> </a>(Alternative method) Manually configure Azure Active Directory with advanced settings
You can also choose to provide configuration settings manually. This is the preferred solution if the AAD tenant you wish to use is different from the tenant with which you sign into Azure. To complete the configuration, you must first create a registration in Azure Active Directory, and then you must provide some of the registration details to App Service.

### <a name="register"> </a>Register your application with Azure Active Directory

1. Log on to the [Azure portal], and navigate to your application. Copy your **URL**. You will use this to configure your Azure Active Directory app.

3. Sign in to the [Azure classic portal] and navigate to **Active Directory**.

    ![][2]

4. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration.

5. Click **Add an application my organization is developing**.

6. In the Add Application Wizard, enter a **Name** for your application and click the  **Web Application And/Or Web API** type. Then click to continue.

7. In the **SIGN-ON URL** box, paste the application URL you copied earlier. Enter that same URL in the **App ID URI** box. Then click to continue.

8. Once the application has been added, click the **Configure** tab. Edit the **Reply URL** under **Single Sign-on** to be the the URL of your application appended with the path, _/.auth/login/aad/callback_. For example, `https://contoso.azurewebsites.net/.auth/login/aad/callback`. Make sure that you are using the HTTPS scheme.

    ![][3]

9. Click **Save**. Then copy the **Client ID** for the app. You will configure your application to use this later.

10. In the bottom command bar, click **View Endpoints**, and then copy the **Federation Metadata Document** URL and download that document or navigate to it in a browser.

11. Within the root **EntityDescriptor** element, there should be an **entityID** attribute of the form `https://sts.windows.net/` followed by a GUID specific to your tenant (called a "tenant ID"). Copy this value - it will serve as your **Issuer URL**. You will configure your application to use this later.

### <a name="secrets"> </a>Add Azure Active Directory information to your application

13. Back in the [Azure portal], navigate to your application. Click **Settings**, and then **Authentication/Authorization**.

14. If the Authentication/Authorization feature is not enabled, turn the switch to **On**.

15. Click **Azure Active Directory**, and then click **Advanced** under **Management Mode**. Paste in the Client ID and Issuer URL value which you obtained previously. Then click **OK**.

    ![][1]

	By default, App Service provides authentication but does not restrict authorized access to your site content and APIs. You must authorize users in your app code.

17. (Optional) To restrict access to your site to only users authenticated by Azure Active Directory, set **Action to take when
request is not authenticated** to **Log in with Azure Active Directory**. This requires that all requests be authenticated, and
all unauthenticated requests are redirected to Azure Active Directory for authentication.

17. Click **Save**.

You are now ready to use Azure Active Directory for authentication in your app.

## (Optional) Configure a native client application

Azure Active Directory also allows you to register native clients, which provides greater control over permissions mapping. You need this if you wish to perform logins using a library such as the **Active Directory Authentication Library**.

1. Navigate to **Active Directory** in the [Azure classic portal].

2. Select your directory, and then select the **Applications** tab at the top. Click **ADD** at the bottom to create a new app registration.

3. Click **Add an application my organization is developing**.

4. In the Add Application Wizard, enter a **Name** for your application and click the  **Native Client Application** type. Then click to continue.

5. In the **Redirect URI** box, enter your site's _/.auth/login/done_ endpoint, using the HTTPS scheme. This value should be similar to _https://contoso.azurewebsites.net/.auth/login/done_. If creating a Windows application, instead use the [package SID](app-service-mobile-dotnet-how-to-use-client-library.md#package-sid) as the URI.

6. Once the native application has been added, click the **Configure** tab. Find the **Client ID** and make a note of this value.

7. Scroll the page down to the **Permissions to other applications** section and click **Add application**.

8. Search for the web application that you registered earlier and click the plus icon. Then click the check to close the dialog. If the web application cannot be found, navigate to its registration and add a new reply URL (e.g., the HTTP version of your current URL), click save, and then repeat these steps - the application should show up in the list.

9. On the new entry you just added, open the **Delegated Permissions** dropdown and select **Access (appName)**. Then click **Save**.

You have now configured a native client application which can access your App Service application.

## <a name="related-content"> </a>Related Content

[AZURE.INCLUDE [app-service-mobile-related-content-get-started-users](../../includes/app-service-mobile-related-content-get-started-users.md)]

<!-- Images. -->

[0]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/mobile-app-aad-express-settings.png
[1]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/mobile-app-aad-advanced-settings.png
[2]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-navigate-aad.png
[3]: ./media/app-service-mobile-how-to-configure-active-directory-authentication/app-service-aad-app-configure.png

<!-- URLs. -->

[Azure portal]: https://portal.azure.com/
[Azure classic portal]: https://manage.windowsazure.com/
[alternative method]:#advanced
