---
title: 'Azure AD Connect: Troubleshoot Azure AD connectivity issues | Microsoft Docs'
description: Explains how to troubleshoot connectivity issues with Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: 3aa41bb5-6fcb-49da-9747-e7a3bd780e64
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/25/2019
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Troubleshoot Azure AD connectivity
This article explains how connectivity between Azure AD Connect and Azure AD works and how to troubleshoot connectivity issues. These issues are most likely to be seen in an environment with a proxy server.

## Troubleshoot connectivity issues in the installation wizard
Azure AD Connect is using Modern Authentication (using the ADAL library) for authentication. The installation wizard and the sync engine proper require machine.config to be properly configured since these two are .NET applications.

In this article, we show how Fabrikam connects to Azure AD through its proxy. The proxy server is named fabrikamproxy and is using port 8080.

First we need to make sure [**machine.config**](how-to-connect-install-prerequisites.md#connectivity) is correctly configured.  
![machineconfig](./media/tshoot-connect-connectivity/machineconfig.png)

> [!NOTE]
> In some non-Microsoft blogs, it is documented that changes should be made to miiserver.exe.config instead. However, this file is overwritten on every upgrade so even if it works during initial install, the system stops working on first upgrade. For that reason, the recommendation is to update machine.config instead.
>
>

The proxy server must also have the required URLs opened. The official list is documented in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

Of these URLs, the following table is the absolute bare minimum to be able to connect to Azure AD at all. This list does not include any optional features, such as password writeback, or Azure AD Connect Health. It is documented here to help in troubleshooting for the initial configuration.

| URL | Port | Description |
| --- | --- | --- |
| mscrl.microsoft.com |HTTP/80 |Used to download CRL lists. |
| \*.verisign.com |HTTP/80 |Used to download CRL lists. |
| \*.entrust.net |HTTP/80 |Used to download CRL lists for MFA. |
| \*.windows.net |HTTPS/443 |Used to sign in to Azure AD. |
| secure.aadcdn.microsoftonline-p.com |HTTPS/443 |Used for MFA. |
| \*.microsoftonline.com |HTTPS/443 |Used to configure your Azure AD directory and import/export data. |

## Errors in the wizard
The installation wizard is using two different security contexts. On the page **Connect to Azure AD**, it is using the currently signed in user. On the page **Configure**, it is changing to the [account running the service for the sync engine](reference-connect-accounts-permissions.md#adsync-service-account). If there is an issue, it appears most likely already at the **Connect to Azure AD** page in the wizard since the proxy configuration is global.

The following issues are the most common errors you encounter in the installation wizard.

### The installation wizard has not been correctly configured
This error appears when the wizard itself cannot reach the proxy.  
![nomachineconfig](./media/tshoot-connect-connectivity/nomachineconfig.png)

* If you see this error, verify the [machine.config](how-to-connect-install-prerequisites.md#connectivity) has been correctly configured.
* If that looks correct, follow the steps in [Verify proxy connectivity](#verify-proxy-connectivity) to see if the issue is present outside the wizard as well.

### A Microsoft account is used
If you use a **Microsoft account** rather than a **school or organization** account, you see a generic error.  
![A Microsoft Account is used](./media/tshoot-connect-connectivity/unknownerror.png)

### The MFA endpoint cannot be reached
This error appears if the endpoint **https://secure.aadcdn.microsoftonline-p.com** cannot be reached and your global admin has MFA enabled.  
![nomachineconfig](./media/tshoot-connect-connectivity/nomicrosoftonlinep.png)

* If you see this error, verify that the endpoint **secure.aadcdn.microsoftonline-p.com** has been added to the proxy.

### The password cannot be verified
If the installation wizard is successful in connecting to Azure AD, but the password itself cannot be verified you see this error:  
![Bad password.](./media/tshoot-connect-connectivity/badpassword.png)

* Is the password a temporary password and must be changed? Is it actually the correct password? Try to sign in to https://login.microsoftonline.com (on another computer than the Azure AD Connect server) and verify the account is usable.

### Verify proxy connectivity
To verify if the Azure AD Connect server has actual connectivity with the Proxy and Internet, use some PowerShell to see if the proxy is allowing web requests or not. In a PowerShell prompt, run `Invoke-WebRequest -Uri https://adminwebservice.microsoftonline.com/ProvisioningService.svc`. (Technically the first call is to https://login.microsoftonline.com and this URI works as well, but the other URI is faster to respond.)

PowerShell uses the configuration in machine.config to contact the proxy. The settings in winhttp/netsh should not impact these cmdlets.

If the proxy is correctly configured, you should get a success status:
![proxy200](./media/tshoot-connect-connectivity/invokewebrequest200.png)

If you receive **Unable to connect to the remote server**, then PowerShell is trying to make a direct call without using the proxy or DNS is not correctly configured. Make sure the **machine.config** file is correctly configured.
![unabletoconnect](./media/tshoot-connect-connectivity/invokewebrequestunable.png)

If the proxy is not correctly configured, you get an error:
![proxy200](./media/tshoot-connect-connectivity/invokewebrequest403.png)
![proxy407](./media/tshoot-connect-connectivity/invokewebrequest407.png)

| Error | Error Text | Comment |
| --- | --- | --- |
| 403 |Forbidden |The proxy has not been opened for the requested URL. Revisit the proxy configuration and make sure the [URLs](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) have been opened. |
| 407 |Proxy Authentication Required |The proxy server required a sign-in and none was provided. If your proxy server requires authentication, make sure to have this setting configured in the machine.config. Also make sure you are using domain accounts for the user running the wizard and for the service account. |

### Proxy idle timeout setting
When Azure AD Connect sends an export request to Azure AD, Azure AD can take up to 5 minutes to process the request before generating a response. This can happen especially if there are a number of group objects with large group memberships included in the same export request. Ensure the Proxy idle timeout is configured to be greater than 5 minutes. Otherwise, intermittent connectivity issue with Azure AD may be observed on the Azure AD Connect server.

## The communication pattern between Azure AD Connect and Azure AD
If you have followed all these preceding steps and still cannot connect, you might at this point start looking at network logs. This section is documenting a normal and successful connectivity pattern. It is also listing common red herrings that can be ignored when you are reading the network logs.

* There are calls to https://dc.services.visualstudio.com. It is not required to have this URL open in the proxy for the installation to succeed and these calls can be ignored.
* You see that dns resolution lists the actual hosts to be in the DNS name space nsatc.net and other namespaces not under microsoftonline.com. However, there are not any web service requests on the actual server names and you do not have to add these URLs to the proxy.
* The endpoints adminwebservice and provisioningapi are discovery endpoints and used to find the actual endpoint to use. These endpoints are different depending on your region.

### Reference proxy logs
Here is a dump from an actual proxy log and the installation wizard page from where it was taken (duplicate entries to the same endpoint have been removed). This section can be used as a reference for your own proxy and network logs. The actual endpoints might be different in your environment (in particular those URLs in *italic*).

**Connect to Azure AD**

| Time | URL |
| --- | --- |
| 1/11/2016 8:31 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:31 |connect://adminwebservice.microsoftonline.com:443 |
| 1/11/2016 8:32 |connect://*bba800-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:32 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:33 |connect://provisioningapi.microsoftonline.com:443 |
| 1/11/2016 8:33 |connect://*bwsc02-relay*.microsoftonline.com:443 |

**Configure**

| Time | URL |
| --- | --- |
| 1/11/2016 8:43 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:43 |connect://*bba800-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:43 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://adminwebservice.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://*bba900-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://adminwebservice.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://*bba800-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:44 |connect://login.microsoftonline.com:443 |
| 1/11/2016 8:46 |connect://provisioningapi.microsoftonline.com:443 |
| 1/11/2016 8:46 |connect://*bwsc02-relay*.microsoftonline.com:443 |

**Initial Sync**

| Time | URL |
| --- | --- |
| 1/11/2016 8:48 |connect://login.windows.net:443 |
| 1/11/2016 8:49 |connect://adminwebservice.microsoftonline.com:443 |
| 1/11/2016 8:49 |connect://*bba900-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:49 |connect://*bba800-anchor*.microsoftonline.com:443 |

## Authentication errors
This section covers errors that can be returned from ADAL (the authentication library used by Azure AD Connect) and PowerShell. The error explained should help you in understand your next steps.

### Invalid Grant
Invalid username or password. For more information, see [The password cannot be verified](#the-password-cannot-be-verified).

### Unknown User Type
Your Azure AD directory cannot be found or resolved. Maybe you try to login with a username in an unverified domain?

### User Realm Discovery Failed
Network or proxy configuration issues. The network cannot be reached. See [Troubleshoot connectivity issues in the installation wizard](#troubleshoot-connectivity-issues-in-the-installation-wizard).

### User Password Expired
Your credentials have expired. Change your password.

### Authorization Failure
Failed to authorize user to perform action in Azure AD.

### Authentication Canceled
The multi-factor authentication (MFA) challenge was canceled.

<div id="connect-msolservice-failed">
<!--
  Empty div just to act as an alias for the "Connect To MS Online Failed" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Connect To MS Online Failed
Authentication was successful, but Azure AD PowerShell has an authentication problem.

<div id="get-msoluserrole-failed">
<!--
  Empty div just to act as an alias for the "Azure AD Global Admin Role Needed" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Azure AD Global Admin Role Needed
User was authenticated successfully. However user is not assigned global admin role. This is [how you can assign global admin role](../users-groups-roles/directory-assign-admin-roles.md) to the user. 

<div id="privileged-identity-management">
<!--
  Empty div just to act as an alias for the "Privileged Identity Management Enabled" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Privileged Identity Management Enabled
Authentication was successful. Privileged identity management has been enabled and you are currently not a global administrator. For more information, see [Privileged Identity Management](../privileged-identity-management/pim-getting-started.md).

<div id="get-msolcompanyinformation-failed">
<!--
  Empty div just to act as an alias for the "Company Information Unavailable" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Company Information Unavailable
Authentication was successful. Could not retrieve company information from Azure AD.

<div id="get-msoldomain-failed">
<!--
  Empty div just to act as an alias for the "Domain Information Unavailable" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Domain Information Unavailable
Authentication was successful. Could not retrieve domain information from Azure AD.

### Unspecified Authentication Failure
Shown as Unexpected error in the installation wizard. Can happen if you try to use a **Microsoft Account** rather than a **school or organization account**.

## Troubleshooting steps for previous releases.
With releases starting with build number 1.1.105.0 (released February 2016), the sign-in assistant was retired. This section and the configuration should no longer be required, but is kept as reference.

For the single-sign in assistant to work, winhttp must be configured. This configuration can be done with [**netsh**](how-to-connect-install-prerequisites.md#connectivity).  
![netsh](./media/tshoot-connect-connectivity/netsh.png)

### The Sign-in assistant has not been correctly configured
This error appears when the Sign-in assistant cannot reach the proxy or the proxy is not allowing the request.
![nonetsh](./media/tshoot-connect-connectivity/nonetsh.png)

* If you see this error, look at the proxy configuration in [netsh](how-to-connect-install-prerequisites.md#connectivity) and verify it is correct.
  ![netshshow](./media/tshoot-connect-connectivity/netshshow.png)
* If that looks correct, follow the steps in [Verify proxy connectivity](#verify-proxy-connectivity) to see if the issue is present outside the wizard as well.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
