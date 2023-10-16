---
title: 'Microsoft Entra Connect: Troubleshoot Microsoft Entra connectivity issues'
description: Learn how to troubleshoot connectivity issues with Microsoft Entra Connect.
services: active-directory
author: billmath
manager: amycolannino
editor: ''

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 01/19/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref, has-azure-ad-ps-ref
---
# Troubleshoot Microsoft Entra Connect connectivity issues

This article explains how connectivity between Microsoft Entra Connect and Microsoft Entra ID works and how to troubleshoot connectivity issues. These issues are most likely to be seen in an environment that uses a proxy server.

## Connectivity issues in the installation wizard

Microsoft Entra Connect uses the Microsoft Authentication Library (MSAL) for authentication. The installation wizard and the sync engine require machine.config to be properly configured because these two are .NET applications.

> [!NOTE]
> Azure AD Connect v1.6.xx.x uses the Active Directory Authentication Library (ADAL). The ADAL is being deprecated and support will end in June 2022. We recommend that you upgrade to the latest version of [Microsoft Entra Connect v2](whatis-azure-ad-connect-v2.md).

In this article, we show how Fabrikam connects to Microsoft Entra ID through its proxy. The proxy server is named `fabrikamproxy` and uses port 8080.

First, make sure that [machine.config](how-to-connect-install-prerequisites.md#connectivity) is correctly configured and that the Microsoft Entra ID Sync service has been restarted once after the *machine.config* file update.

:::image type="content" source="media/tshoot-connect-connectivity/machineconfig.png" alt-text="Screenshot that shows part of the machine dot config file.":::

> [!NOTE]
> Some non-Microsoft blogs indicate you should make changes to *miiserver.exe.config* instead of the *machine.config* file. However, the *miiserver.exe.config* file is overwritten on every upgrade. Even if the file works during the initial installation, the system stops working during the first upgrade. For that reason, we recommend that you update *machine.config* as described in this article.

The proxy server must also have the required URLs opened. The official list is documented in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

Of these URLs, the URLs listed in the following table are the absolute bare minimum to be able to connect to Microsoft Entra ID at all. This list doesn't include any optional features, such as password writeback or Microsoft Entra Connect Health. The information is provided here to help with troubleshooting for the initial configuration.

| URL | Port | Description |
| --- | --- | --- |
| `mscrl.microsoft.com` |HTTP/80 |Used to download certificate revocation list (CRL) lists. |
| `*.verisign.com` |HTTP/80 |Used to download CRL lists. |
| `*.entrust.net` |HTTP/80 |Used to download CRL lists for multifactor authentication (MFA). |
| `*.management.core.windows.net` (Azure Storage)</br>`*.graph.windows.net` (Azure AD Graph)|HTTPS/443|Used for the various Azure services.|
| `secure.aadcdn.microsoftonline-p.com` |HTTPS/443 |Used for MFA. |
| `*.microsoftonline.com` |HTTPS/443 |Used to configure your Microsoft Entra directory and import/export data. |
| `*.crl3.digicert.com` |HTTP/80 |Used to verify certificates. |
| `*.crl4.digicert.com` |HTTP/80 |Used to verify certificates. |
| `*.digicert.cn` |HTTP/80 |Used to verify certificates. |
| `*.ocsp.digicert.com` |HTTP/80 |Used to verify certificates. |
| `*.www.d-trust.net` |HTTP/80 |Used to verify certificates. |
| `*.root-c3-ca2-2009.ocsp.d-trust.net` |HTTP/80 |Used to verify certificates. |
| `*.crl.microsoft.com` |HTTP/80 |Used to verify certificates. |
| `*.oneocsp.microsoft.com` |HTTP/80 |Used to verify certificates. |
| `*.ocsp.msocsp.com` |HTTP/80 |Used to verify certificates. |

## Errors in the wizard

The installation wizard uses two different security contexts. On the **Connect to Microsoft Entra ID** page, it uses the user who is currently signed in. On the **Configure** page, it changes to the [account running the service for the sync engine](reference-connect-accounts-permissions.md#adsync-service-account). If an issue occurs, the error most likely will appear on the **Connect to Microsoft Entra ID** page in the wizard because the proxy configuration is global.

The following issues are the most common errors you might encounter in the installation wizard.

### The installation wizard hasn't been correctly configured

This error appears when the wizard itself can't reach the proxy.

:::image type="content" source="media/tshoot-connect-connectivity/nomachineconfig.png" alt-text="Screenshot shows an error Unable to validate credentials.":::

If you see this error, verify that the [machine.config file](how-to-connect-install-prerequisites.md#connectivity) is correctly configured. If *machine.config* looks correct, complete the steps in [Verify proxy connectivity](#verify-proxy-connectivity) to see if the issue is also present outside the wizard.

### A Microsoft account is used

If you use a *Microsoft account* instead of a *school or organization account*, you see a generic error:

:::image type="content" source="media/tshoot-connect-connectivity/unknownerror.png" alt-text="Screenshot that shows a generic credentials validation error.":::

### The MFA endpoint can't be reached

This error appears if the endpoint `https://secure.aadcdn.microsoftonline-p.com` can't be reached and your Hybrid Identity Administrator has MFA enabled.

:::image type="content" source="media/tshoot-connect-connectivity/nomicrosoftonlinep.png" alt-text="Screenshot that shows an example of a script error when the MFA endpoint can't be reached.":::

If you see this error, verify that the endpoint `secure.aadcdn.microsoftonline-p.com` has been added to the proxy.

### The password can't be verified

If the installation wizard is successful in connecting to Microsoft Entra ID but the password itself can't be verified, you see this error:

:::image type="content" source="media/tshoot-connect-connectivity/badpassword.png" alt-text="Screenshot that shows an error that occurs when the password can't be verified.":::

Is the password a temporary password that must be changed? Is it actually the correct password? Try to sign in to `https://login.microsoftonline.com` on a different computer than the Microsoft Entra Connect server and verify that the account is usable.

### Verify proxy connectivity

To check whether the Microsoft Entra Connect server is connecting to the proxy and the internet, use some PowerShell cmdlets to see if the proxy is allowing web requests. In PowerShell, run `Invoke-WebRequest -Uri https://adminwebservice.microsoftonline.com/ProvisioningService.svc`. (Technically, the first call is to `https://login.microsoftonline.com`, and this URI also works, but the other URI is quicker to respond.)

PowerShell uses the configuration in *machine.config* to contact the proxy. The settings in *winhttp/netsh* shouldn't affect these cmdlets.

If the proxy is correctly configured, a success status appears:

:::image type="content" source="media/tshoot-connect-connectivity/invokewebrequest200.png" alt-text="Screenshot that shows the success status when the proxy is configured correctly.":::

If you see the message **Unable to connect to the remote server**, PowerShell is trying to make a direct call without using the proxy or DNS isn't correctly configured. Make sure that the *machine.config* file is correctly configured.

:::image type="content" source="media/tshoot-connect-connectivity/invokewebrequestunable.png" alt-text="Screenshot of an error message when PowerShell can't connect to the remote server.":::

If the proxy isn't correctly configured, a 403 or 407 error message appears:

:::image type="content" source="media/tshoot-connect-connectivity/invokewebrequest403.png" alt-text="Screenshot of a 403 proxy error in PowerShell.":::

:::image type="content" source="media/tshoot-connect-connectivity/invokewebrequest407.png" alt-text="Screenshot of a 407 proxy error in PowerShell.":::

The following table describes 403 and 407 proxy errors:

| Error | Error Text | Comment |
| --- | --- | --- |
| 403 |Forbidden |The proxy hasn't been opened for the requested URL. Revisit the proxy configuration and make sure that the [URLs](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) have been opened. |
| 407 |Proxy Authentication Required |The proxy server required a sign-in and none was provided. If your proxy server requires authentication, make sure that you configured this setting in *machine.config*. Also make sure that you're using domain accounts for the user running the wizard and for the service account. |

### Proxy idle timeout setting

When Microsoft Entra Connect sends an export request to Microsoft Entra ID, Microsoft Entra ID can take up to 5 minutes to process the request before generating a response. The response is especially likely to be delayed if many group objects that have large group memberships are included in the same export request. Ensure that the proxy idle timeout is configured to be greater than 5 minutes. Otherwise, you might have intermittent connectivity issues with Microsoft Entra ID on the Microsoft Entra Connect server.

<a name='communication-pattern-between-azure-ad-connect-and-azure-ad'></a>

## Communication pattern between Microsoft Entra Connect and Microsoft Entra ID

If you've followed all the steps described in this article and you still can't connect, at this point you might look at network logs. This section describes a normal and successful connectivity pattern.

But first, here are some common concerns about data in the network logs that you can ignore:

- There are calls to `https://dc.services.visualstudio.com`. It's not required to have this URL open in the proxy for the installation to succeed, and these calls can be ignored.
- You see that DNS resolution lists the actual hosts as being in the DNS namespace `nsatc.net` and other namespaces that aren't under `microsoftonline.com`. However, there aren't any web service requests on the actual server names. You don't have to add these URLs to the proxy.
- The endpoints `adminwebservice` and `provisioningapi` are discovery endpoints, and they're used to find the actual endpoint to use. These endpoints are different depending on your region.

### Reference proxy logs

The following example is a dump from an actual proxy log and the installation wizard page from where it was taken (duplicate entries to the same endpoint have been removed). This section can be used as a reference for your own proxy and network logs. The actual endpoints might be different in your environment (in particular, the URLs in *italic*).

**Connect to Microsoft Entra ID**

| Time | URL |
| --- | --- |
| 1/11/2016 8:31 |connect:/login.microsoftonline.com:443 |
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

**Initial sync**

| Time | URL |
| --- | --- |
| 1/11/2016 8:48 |connect://login.windows.net:443 |
| 1/11/2016 8:49 |connect://adminwebservice.microsoftonline.com:443 |
| 1/11/2016 8:49 |connect://*bba900-anchor*.microsoftonline.com:443 |
| 1/11/2016 8:49 |connect://*bba800-anchor*.microsoftonline.com:443 |

## Authentication errors

This section covers errors that might be returned from the ADAL and PowerShell. The error explanation should help you identify your next steps.

### Invalid grant

You entered an invalid username or password. For more information, see [The password can't be verified](#the-password-cant-be-verified).

### Unknown user type

Your Microsoft Entra directory can't be found or resolved. Maybe you tried to sign in with a username in an unverified domain?

### User realm discovery failed

Network or proxy configuration issues. The network can't be reached. See [Connectivity issues in the installation wizard](#connectivity-issues-in-the-installation-wizard).

### User password expired

Your credentials have expired. Change your password.

### Authorization failure

Microsoft Entra Connect failed to authorize the user to perform an action in Microsoft Entra ID.

### Authentication canceled

The MFA challenge was canceled.

<div id="connect-msolservice-failed">
<!--
  Empty div just to act as an alias for the "Connect To MSOnline Failed" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Connect to MSOnline failed

Authentication was successful, but Azure AD PowerShell has an authentication problem.

<div id="get-msoluserrole-failed">
<!--
  Empty div just to act as an alias for the "Azure AD Global Administrator Role Needed" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

<a name='azure-ad-global-administrator-role-needed'></a>

### Microsoft Entra Global Administrator role needed

The user was authenticated successfully, but the user isn't assigned the Global Administrator role. You can [assign the Global Administrator role](../../roles/permissions-reference.md) to the user.

<div id="privileged-identity-management">
<!--
  Empty div just to act as an alias for the "Privileged Identity Management Enabled" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Privileged Identity Management enabled

Authentication was successful, but Privileged Identity Management has been enabled and the user currently isn't a Hybrid Identity Administrator. For more information, see [Privileged Identity Management](../../privileged-identity-management/pim-getting-started.md).

<div id="get-msolcompanyinformation-failed">
<!--
  Empty div just to act as an alias for the "Company Information Unavailable" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Company information unavailable

Authentication was successful, but company information couldn't be retrieved from Microsoft Entra ID.

<div id="get-msoldomain-failed">
<!--
  Empty div just to act as an alias for the "Domain Information Unavailable" header
  because we used the mentioned id in the code to jump to this section.
-->
</div>

### Domain information unavailable

Authentication was successful, but domain information couldn't be retrieved from Microsoft Entra ID.

### Unspecified authentication failure

Shown as *Unexpected error* in the installation wizard. This error might occur if you try to use a *Microsoft account* instead of a *school or organization account*.

## Troubleshooting steps for earlier releases

In releases starting with build number 1.1.105.0 (released February 2016), the sign-in assistant was retired. Configuring the sign-in assistant should no longer be required, but the information in the next sections is included for reference.

For the single sign-in assistant to work, Microsoft Windows HTTP Services (WinHTTP) must be configured. You can configure WinHTTP by using [netsh](how-to-connect-install-prerequisites.md#connectivity).

:::image type="content" source="media/tshoot-connect-connectivity/netsh.png" alt-text="Screenshot that shows a command prompt window running the netsh tool to set a proxy.":::

### The sign-in assistant isn't configured correctly

This error appears when the sign-in assistant can't reach the proxy or the proxy isn't allowing the request.

:::image type="content" source="media/tshoot-connect-connectivity/nonetsh.png" alt-text="Screenshot of the error Unable to validate credentials, Verify network connectivity and firewall or proxy settings.":::

If you see this error, look at the proxy configuration in [netsh](how-to-connect-install-prerequisites.md#connectivity) and verify that it's correct.

:::image type="content" source="media/tshoot-connect-connectivity/netshshow.png" alt-text="Screenshot that shows a command prompt window running the netsh tool to show the proxy configuration.":::

If the proxy configuration looks correct, complete the steps in [Verify proxy connectivity](#verify-proxy-connectivity) to see if the issue occurs outside the wizard.

## Next steps

Learn more about [integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
