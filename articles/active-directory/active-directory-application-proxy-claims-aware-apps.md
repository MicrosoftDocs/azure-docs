<properties
	pageTitle="Working with Claims Aware Apps in Application Proxy"
	description="Covers how to get up and running with Azure AD Application Proxy."
	services="active-directory"
	documentationCenter=""
	authors="rkarlin"
	manager="msStevenPo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/09/2015"
	ms.author="rkarlin"/>



# Working with claims aware apps in Application Proxy


Claims aware apps perform a redirection to the STS, which in turn requests credentials from the user in exchange for a token before redirecting the user to the application. To enable Application Proxy to be able to work with these redirects, the following steps need to be taken to enable Application Proxy to work with claims aware applications.

> [AZURE.IMPORTANT] Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).


## Prerequisite

Before performing this procedure, make sure that the STS the claims aware app redirects to is available outside your on-premises network.

### Azure portal configuration

1. Publish your application according to the instructions described in [Publish applications with Application Proxy](active-directory-application-proxy-publish.md).
2. In the list of applications, select the claims aware app and click **Configure**.
3. If you chose **Passthrough** as your **Preauthentication Method**, make sure to select **HTTPS** as your **External URL** scheme.
4. If you chose Azure Active Directory as your **Preauthentication Method**, make sure to select **None** as your **Internal Authentication Method**.

### ADFS configuration

1. Open **ADFS Management**.
2. Go to **Relying Party Trusts** and right click on the app you are publishing with Application Proxy, and choose **Properties**.

![Relying Party Trusts right click on app name - screentshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyrelyingpartytrust.png)

3. On the **Endpoints** tab, under **Endpoint type** select **WS-Federation**.
4. Under **Trusted URL**, enter the URL you entered in the Application Proxy under **External URL** and click **OK**.

![Add an Endpoint - set Trusted URL value - screenshot](./media/active-directory-application-proxy-claims-aware-apps/appproxyendpointtrustedurl.png)


