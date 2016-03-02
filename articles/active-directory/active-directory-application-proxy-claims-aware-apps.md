<properties
	pageTitle="Working with Claims Aware Apps in Application Proxy"
	description="Covers how to get up and running with Azure AD Application Proxy."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/09/2016"
	ms.author="kgremban"/>



# Working with claims aware apps in Application Proxy

> [AZURE.IMPORTANT] Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).

Claims aware apps perform a redirection to the Security Token Service (STS), which in turn requests credentials from the user in exchange for a token before redirecting the user to the application. To enable Application Proxy to work with these redirects, the following steps need to be taken.

## Prerequisite

Before performing this procedure, make sure that the STS the claims aware app redirects to is available outside of your on-premises network.


### Azure classic portal configuration

1. Publish your application according to the instructions described in [Publish applications with Application Proxy](active-directory-application-proxy-publish.md).
2. In the list of applications, select the claims aware app and click **Configure**.
3. If you chose **Passthrough** as your **Preauthentication Method**, make sure to select **HTTPS** as your **External URL** scheme.
4. If you chose **Azure Active Directory** as your **Preauthentication Method**, select **None** as your **Internal Authentication Method**.


### ADFS configuration

1. Open ADFS Management.
2. Go to **Relying Party Trusts**, right click on the app you are publishing with Application Proxy, and choose **Properties**.  
  ![Relying Party Trusts right click on app name - screentshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyrelyingpartytrust.png)  
3. On the **Endpoints** tab, under **Endpoint type**, select **WS-Federation**.
4. Under **Trusted URL** enter the URL you entered in the Application Proxy under **External URL** and click **OK**.  
  ![Add an Endpoint - set Trusted URL value - screenshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyendpointtrustedurl.png)  

## See also
There's a lot more you can do with Application Proxy:

- [Publish applications with Application Proxy](active-directory-application-proxy-publish.md)
- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Troubleshoot issues you're having with Application Proxy](active-directory-application-proxy-troubleshoot.md)

## Learn more about Application Proxy
- [Take a look at our online help](active-directory-application-proxy-enable.md)
- [Check out the Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
- [Watch our videos on Channel 9!](http://channel9.msdn.com/events/Ignite/2015/BRK3864)

## Additional Resources

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Providing secure remote access to on-premises applications](active-directory-application-proxy-get-started.md)
- [How to enable native client apps to interact with proxy Applications](active-directory-application-proxy-native-client.md)
- [Sign up for Azure as an organization](sign-up-organization.md)
- [Azure Identity](fundamentals-identity.md)

