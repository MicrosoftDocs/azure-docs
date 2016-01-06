<properties
	pageTitle="How to enable publishing of native client apps with proxy applications | Microsoft Azure"
	description="Covers how to enable native client apps to communicate with Azure AD Application Proxy Connector to provide secure remote access to your on-premises apps."
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
	ms.date="11/02/2015"
	ms.author="kgremban"/>

# How to enable native client apps to interact with proxy Applications
Azure Active Directory Application Proxy is widely used to publish browser applications such as SharePoint, Outlook Web Access and custom line of business applications. It can also be used to publish HTTP backend applications that are consumed using native clients. This is done by supporting Azure AD issued tokens that are sent in standard Authorize HTTP headers.


![](./media/active-directory-application-proxy-native-client/richclientflow.png)


The recommended method to publish such applications is to use the Azure AD Authentication Library that takes care of all the authentication hassle and supports many different client environments. Application Proxy fits into the [Native Application to Web API scenario](active-directory-authentication-scenarios.md#native-application-to-web-api). The process for accomplishing this is as follows:

1. Publish your proxy application as you would any other application, assign users and give them premium or basic licenses. For more information see  [Publish applications with Application Proxy](active-directory-application-proxy-publish.md).
2. Configure your native application as follows:
  3. Sign in to the Azure Management Portal.
  4. Click on the Active Directory icon on the left menu, and then click on the desired directory.
  5. On the top menu, click Applications. If no apps have been added to your directory, this page will only show the Add an App link. Click on the link, or alternatively you can click on the Add button on the command bar.
  4. On the **What do you want to do** page, click on the link to **Add an application my organization is developing**.
  5. On the **Tell us about your application** page, specify a name for your application and choose **Native client application** which represents an application that is installed on a device such as a phone or computer. Once finished, click the arrow icon on the bottom-right corner of the page.
  6. On the **App properties** page, provide the **Redirect URI** for the native client application, then click the checkbox in the bottom-right hand corner of the page. </br>Your application has been added, and you will be taken to the Quick Start page for your application.
8. Enable the native application to be exposed to other applications in your directory:
  9. On the top menu, click **Applications**, select the new native application, and then click **Configure**.
  10. Scroll down to the **permissions to other applications** section. Click on the **Add application** button and select the proxy application that you want to grant the native application access to, and click the check mark in the bottom right corner. From the **Delegated Permissions** drop-down menu, select the new permission. </br>

![](./media/active-directory-application-proxy-native-client/delegate_native_app.png) </br></br>
4. Edit the native application code in the authentication context of the Active Directory Authentication Library (ADAL) to include the following:

		// Acquire Access Token from AAD for Proxy Application
		AuthenticationContext authContext = new AuthenticationContext("https://login.microsoftonline.com/<TenantId>");
		AuthenticationResult result = authContext.AcquireToken("< Frontend Url of Proxy App >",
                                                        "< Client Id of the Native app>",
                                                        new Uri("< Redirect Uri of the Native App>"),
                                                        PromptBehavior.Never);

		//Use the Access Token to access the Proxy Application
		HttpClient httpClient = new HttpClient();
		httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
		HttpResponseMessage response = await httpClient.GetAsync("< Proxy App API Url >");

The variables should be replaced as follows:


- **TenantId** can be found in the GUID in the URL of the application's **Configuration** page, right after “/Directory/”.
- **Frontend URL** is the front end URL you entered in the Proxy Application and can be found on the **Configuration** page of the proxy app.
- **Client Id** of the native app can be found on the **Configure** page of the native application.
- **Redirect URI of the native app** can be found on the **Configure** page of the native application.

![](./media/active-directory-application-proxy-native-client/new_native_app.png)
</br> </br>For more information about the native application flow, see [Native application to web API](active-directory-authentication-scenarios.md#native-application-to-web-api).






## What's next?
There's a lot more you can do with Application Proxy:


- [Publish applications using your own domain name](active-directory-application-proxy-custom-domains.md)
- [Enable single-sign on](active-directory-application-proxy-sso-using-kcd.md)
- [Working with claims aware applications](active-directory-application-proxy-claims-aware-apps.md)
- [Enable conditional access](active-directory-application-proxy-conditional-access.md)


### Learn more about Application Proxy
- [Take a look here at our online help](active-directory-application-proxy-enable.md)
- [Check out the Application Proxy blog](http://blogs.technet.com/b/applicationproxyblog/)
- [Watch our videos on Channel 9!](http://channel9.msdn.com/events/Ignite/2015/BRK3864)

## Additional resources
* [Sign up for Azure as an organization](sign-up-organization.md)
* [Azure Identity](fundamentals-identity.md)
