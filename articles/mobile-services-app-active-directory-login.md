<properties linkid="develop-mobile-how-to-guides-register-for-microsoft-waad-authentication" urlDisplayName="Register for Azure Active Directory Authentication" pageTitle="Register for Azure Active Directory authentication - Mobile Services" metaKeywords="Azure registering application, Azure Active Directory authentication, application authenticate, authenticate mobile services" description="Learn how to register for Azure Active Directory authentication in your Azure Mobile Services application." metaCanonical="" disqusComments="0" umbracoNaviHide="1" title="Register your apps to use an Azure Active Directory Account login" authors="" />


# Register your apps to use an Azure Active Directory Account login

This topic shows you how to register your apps to be able to use Azure Active Directory as an authentication provider for Azure Mobile Services. 

<div class="dev-callout"><b>Note</b>
<p>When you intend to also provide client-driven authentication for single sign-on (SSO) or push notifications from a Windows Store app, consider also registering your app with the Windows Store. For more information, see <a href="/en-us/develop/mobile/how-to-guides/register-for-single-sign-on">Register your Windows Store apps for Windows Live Connect authentication</a>.</p>
</div>

1. Log into the [Azure Management Portal]. 

2. Navigate to **Active Directory** in the management portal, then click your directory.

   ![][1] 

3. Click on the **Applications** tab, then click **Add an App**. 

   ![][2]


4. Follow the directions in the new application wizard choosing **Web Application And/Or Web API** for the XXX. Enable Single Sign On. When prompted for the **App URL**, paste the mobile services application URL.


5. *** MORE TO COME ***


You are now ready to use an Azure Active Directory for authentication in your app by providing the client ID and client secret values to Mobile Services.

<!-- Anchors. -->

<!-- Images. -->
[1]: ./media/mobile-services-app-active-directory-login/mobile-services-live-connect-add-app.png
[2]: ./media/mobile-services-app-active-directory-login/mobile-live-connect-app-api-settings.png

<!-- URLs. -->
[Azure Management Portal]: https://manage.windowsazure.com/
