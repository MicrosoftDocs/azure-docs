---
title: 'Azure AD Connect: Pass-through authentication | Microsoft Docs'
description: This topic provides you with the information you need to know about how Azure AD pass-through authentications works with on-premises Active Directory (AD) to provide access to Azure Active Directory (Azure AD) and connected services.
services: active-directory
keywords: what is Azure AD Connect, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/08/2017
ms.author: billmath
---

# What is Azure AD Pass-through Authentication
Using the same credential (username and password) to access your corporate resources and cloud based services ensures that users don’t have to remember different credentials. It reduces the chances that they forget how to sign in and has the benefit of reducing the involvement of help desk for password reset events.

While many organizations are comfortable with using Azure AD [Password synchronization](active-directory-aadconnectsync-implement-password-synchronization.md) to provide users with a single credential to access on-premises and cloud services, other organizations require that passwords, even in a hashed form, do not leave their internal organizational boundary.

Azure AD pass-through authentication provides a simple solution for these customers. It ensures that password validation for Azure AD services is performed against their on-premises Active Directory. Passwords can be validated without the need for complex network infrastructure or for the on-premises passwords to exist in the cloud in any form.

When combined with the [Single Sign on](active-directory-aadconnect-sso.md) option, users do not need to type their password to sign in to Azure AD or other cloud services. This feature provides these customers with a truly integrated experience on their corporate machines.

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta1.png)

Pass-through authentication can be configured with Azure AD Connect and utilizes a simple on-premises agent that listens for password validation requests. The agent can be easily deployed to multiple machines to provide high availability and load balancing. Since all communications are outbound only, there is no requirement for a DMZ or for the connector to be installed in a DMZ. The machine requirements for the connector are as follows:

- Windows Server 2012 R2 or higher
- Joined to a domain in the forest that users are validated in

>[!NOTE]
>Multi-forest environments can be supported if there are trusts between the forests and name suffix routing is correctly configured.

## Supported Clients in the preview

Pass-through authentication is supported via web browser-based clients and Office clients that support [modern authentication](https://aka.ms/modernauthga). For clients that are not supported, such as legacy Office clients and Exchange active sync (that is, native email clients on mobile devices), customers are encouraged to use the modern authentication equivalent. These clients not only allow pass-through authentication, but also allow conditional access to be applied, such as multi-factor authentication.

For customers using Windows 10 joined to Azure AD, pass-through authentication is not currently supported. However, customers can utilize password sync as an automatic fallback for Windows 10 in addition for legacy clients.

>[!NOTE]
>During the preview, Password synchronization is enabled by default when Pass-through authentication is selected as the sign-in option in Azure AD Connect. This setting can be disabled on the Options page of Azure AD Connect.

## How Azure AD Pass-through Authentication works
When a user enters their username and password into the Azure AD sign-in page, Azure AD places the username and password on the appropriate on-premises connector queue for validation. One of the available on-premises connectors then retrieves the username and password and validates it against Active Directory. The validation occurs over standard Windows APIs similar to how Active Directory Federation Services validates password.

The on-premises Domain Controller then evaluates the request and returns a response to the connector, which in turn returns this response to Azure AD. Azure AD then evaluates the response and responds to the user as appropriate, for example by issuing a token or asking for Multifactor Authentication. This diagram shows the various steps:

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta2.png)

## Azure AD Pass-through prerequisites
Before you can enable and use Azure AD pass-through authentication, you need to have:

- Azure AD Connect
- An Azure AD tenant for which you are a global administrator.

>[!NOTE]
>It is recommended that the account is a cloud-only admin account so that you can manage the configuration of your tenant should your on-premises services fail or be unavailable.

- A server running Windows Server 2012 R2 or higher on which to run Azure AD Connect. This machine must be a member of the same forest as the users who are validated.
- If you have more than one forest containing users to be validated with Azure AD, the forests must have trusts between them.
- On-premises UserPrincipalName must be used as the Azure AD username.
- A second server running Windows Server 2012 R2 or higher on which to run a second connector for high availability and load balancing. Instructions are included below on how to deploy this connector.
- If there is a firewall between the connector and Azure AD, make sure that:
	- If URL filtering is enabled, ensure that the connector can communicate with the follow URLs:
		-  \*.msappproxy.net
		-  \*.servicebus.windows.net.  
		-  The connector also makes connection on direct IP connections to the [Azure data center IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=41653).
	- Ensure that the firewall does not perform SSL inspection as the connector uses client certificates to communicate with Azure AD.
	- Ensure the connector can make HTTPS (TCP) requests to Azure AD on the ports below.

|Port Number|Description
| --- | ---
|80|Enables outbound HTTP traffic for security validation such as SSL certificate revocation lists.
|443|	Enables user authentication against Azure AD.
|8080/443|	Enables the Connector bootstrap sequence and Connector automatic update.
|9090|	Enables Connector registration (required only for the Connector registration process).
|9091|	Enables Connector trust certificate automatic renewal.
|9352, 5671|	Enables communication between the Connector and the Azure AD service for incoming requests.
|9350|	[Optional] Enables better performance for incoming requests.
|10100–10120|	Enables responses from the connector back to Azure AD.

If your firewall enforces traffic according to originating users, open these ports for traffic coming from Windows services running as a Network Service. Also, make sure to enable port 8080 for NT Authority\System.

## Enabling Pass-through authentication
Azure AD pass-through authentication is enabled via Azure AD Connect. Enabling pass-through authentication deploys the first connector on the same server as Azure AD connect. When installing Azure AD Connect, select a custom installation and select Pass-through authentication on the sign-in options page. For more information, see [Custom installation of Azure AD Connect](active-directory-aadconnect-get-started-custom.md).

![Single sign-on](./media/active-directory-aadconnect-sso/sso3.png)

By default, the first pass-through authentication connector is installed on the Azure AD Connect server. You should deploy a second connector on another machine to ensure that you have high availability and load balancing of authentication requests.

To deploy the second connector, follow the instructions below:

### Step 1: Install the Connector without registration

1.	Download the latest [connector](https://go.microsoft.com/fwlink/?linkid=837580).
2.	Open a command prompt as an administrator.
3.	Run the following command in which /q means quiet installation - the installation does not prompt you to accept the End User License Agreement.

```
AADApplicationProxyConnectorInstaller.exe REGISTERCONNECTOR="false" /q
```

### Step 2: Register the Connector with Azure AD for pass-through authentication

1.	Open a PowerShell window as an administrator
2.	Navigate to **C:\Program Files\Microsoft AAD App Proxy Connector** and run the script.  
`.\RegisterConnector.ps1 -modulePath "C:\Program Files\Microsoft AAD App Proxy Connector\Modules\" -moduleName "AppProxyPSModule" -Feature PassthroughAuthentication`
3.	When prompted, enter the credentials of your Azure AD tenant Admin account.

## Troubleshooting Pass-through authentication
When troubleshooting Pass-through authentication, there are a few different categories of problems that can occur. Depending on the type of problem, you may need to look in different places.

For errors that relate to the connector you can check the Event Log of the connector machine under **Application and Service Logs\Microsoft\AadApplicationProxy\Connector\Admin**. If needed, more detailed logs are available by viewing the analytics and debugging logs and enabling the connector session log. It is not recommended to run with this log enabled by default and the contents are only visible after the log is disabled.

Additional information can also be found in the trace logs for the connector in **C:\Programdata\Microsoft\Microsoft AAD Application Proxy Connector\Trace**. These logs also include the reason that pass-through authentication failed for an individual user, such as the following entry below that includes the error code 1328:

```
	ApplicationProxyConnectorService.exe Error: 0 : Passthrough Authentication request failed. RequestId: 'df63f4a4-68b9-44ae-8d81-6ad2d844d84e'. Reason: '1328'.
	    ThreadId=5
	    DateTime=xxxx-xx-xxTxx:xx:xx.xxxxxxZ
```

You can get the details of the error by starting a command prompt and running the following command: (Replace '1328' with the error number in the request.)

`Net helpmsg 1328`

The result is similar to the following response:

![Pass-through Authentication](./media/active-directory-aadconnect-pass-through-authentication/pta3.png)

If audit logging is enabled, then additional information can also be found in the security logs of the Domain Controllers. A simple query for authentication requests by the connector would be as follows:

```
    <QueryList>
    <Query Id="0" Path="Security">
    <Select Path="Security">*[EventData[Data[@Name='ProcessName'] and (Data='C:\Program Files\Microsoft AAD App Proxy Connector\ApplicationProxyConnectorService.exe')]]</Select>
    </Query>
    </QueryList>
```

Other errors reported on the Azure AD sign-in screen are detailed below together with the appropriate resolution steps.

|Error|Description|Resolution
| --- | --- | ---
|AADSTS80001|Unable to connect to Active Directory|Ensure that the connector machines are domain joined and are able to connect to Active Directory.  
|AADSTS8002|A timeout occurred connecting to Active Directory|Check to ensure that Active Directory is available and responding to requests from the connector.
|AADSTS80004|The username passed to the connector was not valid|Ensure the user is attempting to sign in with the right username.
|AADSTS80005|Validation encountered unpredictable WebException|This error is a transient problem. Retry the request. Should it continue to fail, contact Microsoft support.
|AADSTS80007|An error occurred communicating with Active Directory|Check the connector logs for more information and verify that Active Directory is operating as expected.
