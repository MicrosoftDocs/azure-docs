<properties
	pageTitle="SSO for On Prem IWA Apps Using KCD with Application Proxy"
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



# SSO for on-prem IWA apps using KCD with Application Proxy


You can enable Single Sign On (SSO) to your applications using Integrated Windows Authentication (IWA) by giving Application Proxy Connectors permission in Active Directory to impersonate users and send and receive tokens on their behalf.

> [AZURE.IMPORTANT] Application Proxy is a feature that is available only if you upgraded to the Premium or Basic edition of Azure Active Directory. For more information, see [Azure Active Directory editions](active-directory-editions.md).


## Network diagram

![Microsoft AAD authentication flow diagram](./media/active-directory-application-proxy-sso-using-kcd/AuthDiagram.png)

This diagram explains the flow when a user attempts to access an on-prem application that uses IWA. The general flow is:

1. The user enters the URL to access the on-prem application through Application Proxy.
2. Application Proxy redirects the request to Azure AD authentication services to preauthenticate. At this point, Azure AD applies any applicable authentication and authorization policies, such as multifactor authentication. If the user is validated, Azure AD creates a token and sends it to the user.
3. The user passes the token to Application Proxy.
4. Application Proxy validates the token and retrieves the User Principal Name (UPN) from it, and then sends the request, the UPN, and the Service Principal Name (SPN) to the Connector through a dually authenticated secure channel.
5. The Connector performs Kerberos Constrained Delegation (KCD) negotiation with the on-prem AD, impersonating the user to get a Kerberos token to the application.
6. Active Directory sends the Kerberos token for the application to the Connector.
7. The Connector sends the original request to the application server, using the Kerberos token it received from AD.
8. The application sends the response to the Connector which is then returned to the Application Proxy service and finally to the user.

### Prerequisites

1. Make sure that your apps, such as your SharePoint Web apps, are set to use Integrated Windows Authentication. For more information see [Enable Support for Kerberos Authentication](https://technet.microsoft.com/library/dd759186.aspx), or for SharePoint see [Plan for Kerberos authentication in SharePoint 2013](https://technet.microsoft.com/library/ee806870.aspx).
2. Create Service Principal Names for your applications.
3. Make sure that the server running the Connector and the server running the app you are publishing are domain joined and part of the same domain. For more information on domain join, see [Join a Computer to a Domain](https://technet.microsoft.com/library/dd807102.aspx).


## Active Directory configuration

The Active Directory configuration varies, depending on whether your Application Proxy Connector and the published server are in the same domain or not.

### Connector and published server in the same domain



1. In Active Directory, go to **Tools** > **Users and Computers**. 
2. Select the server running the Connector. 
3. Right click and select **Properties** > **Delegation**. 
4. Select **Trust this computer for delegation to specified services only** and under **Services to which this account can present delegated credentials**, add the value for the Service Principal Name (SPN) identity of the application server. 
5. This enables the Application Proxy Connector to impersonate users in AD against the applications defined in the list.

![Connector-SVR Properties window screenshot](./media/active-directory-application-proxy-sso-using-kcd/Properties.jpg)

### Connector and published server in different domains

1. For a list of prerequisites for working with KCD across domains, see [Kerberos Constrained Delegation across domains](https://technet.microsoft.com/library/hh831477.aspx).
2. In Windows 2012 R2, use the `principalsallowedtodelegateto` property on the Connector server to enable the Application Proxy to delegate for the Connector server, where the published server is `sharepointserviceaccount` and the delegating server is `connectormachineaccount`.

		$connector= Get-ADComputer -Identity connectormachineaccount -server dc.connectordomain.com

		Set-ADComputer -Identity sharepointserviceaccount -PrincipalsAllowedToDelegateToAccount $connector

		Get-ADComputer sharepointserviceaccount -Properties PrincipalsAllowedToDelegateToAccount


>[AZURE.NOTE] `sharepointserviceaccount` can be the SPS machine account or a service account under which the SPS app pool is running.


## Azure portal configuration

1. Publish your application according to the instructions described in [Publish applications with Application Proxy](active-directory-application-proxy-publish.md). Make sure to select **Azure Active Directory** as the **Preauthentication Method**.
2. After your application appears in the list of applications, select it and click **Configure**.
3. Under **Properties**, set **Internal Authentication Method** to **Integrated Windows Authentication**.

![Advanced Application Configuration](./media/active-directory-application-proxy-sso-using-kcd/cwap_auth2.png)

4. Enter the **Internal Application SPN** of the application server. In this example, the SPN for our published application is http/lob.contoso.com.

>[AZURE.IMPORTANT] The UPNs in Azure Active Directory must be identical to the UPNs in your on-premises Active Directory in order for preauthentication to work. Make sure your Azure Active Directory is synchronized with your on-premises Active Directory.

| | |
| --- | --- |
| Internal Authentication Method | If you use Azure AD for preauthentication, you can set an internal authentication method to enable your users to benefit from single-sign on (SSO) to this application. <br><br> Select **Integrated Windows Authentication** (IWA) if your application uses IWA and you can configure Kerberos Constrained Delegation (KCD) to enable SSO for this application. Applications that use IWA must be configured using KCD, otherwise Application Proxy will not be able to publish these applications. <br><br> Select **None** if your application does not use IWA. |
| Internal Application SPN | This is the Service-Principal-Name (SPN) of the internal application as configured in the on-prem Azure AD. The SPN is used by the Application Proxy Connector to fetch Kerberos tokens for the application using KCD. |

<!--Image references-->
[1]: ./media/active-directory-application-proxy-sso-using-kcd/AuthDiagram.png
[2]: ./media/active-directory-application-proxy-sso-using-kcd/Properties.jpg
