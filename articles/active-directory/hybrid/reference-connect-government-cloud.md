---
title: 'Azure AD Connect: Hybrid Identity Considerations for Azure Government '
description: Special considerations for deploying Azure AD Connect with the government cloud.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 04/13/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Hybrid Identity Considerations for Azure Government 

> [!NOTE] 
> Upgrade to the latest release of [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594). 

> [!NOTE] 
> For a full list of U.S. Government DoD Endpoints, refer to the [documentation](https://docs.microsoft.com/office365/enterprise/office-365-u-s-government-dod-endpoints) 

## Pass Through Authentication 

### Allow access to URLs  
Before deploying the pass-through authentication agent, verify if there is a firewall between your servers and Azure AD, and if so, configure the following items: 

- If your firewall or proxy allows DNS whitelisting, whitelist connections to *.msapproxy.us and *.servicebus.usgovcloudapi.net. If not, allow access to the Azure datacenter IP ranges, which are updated weekly. 
- Your Authentication Agents need access to login.windows.us and login.microsoftonline.us for initial registration. Open your firewall for those URLs as well. 
- For certificate validation, unblock the following URLs: mscrl.microsoft.us:80, crl.microsoft.us:80, ocsp.msocsp.us:80, and www.microsoft.us:80. Since these URLs are used for certificate validation with other Microsoft products you may already have these URLs unblocked. 

Before deploying the pass-through authentication agent, verify if there is a firewall between your servers and Azure AD. If your firewall or proxy allows DNS whitelisting, whitelist the following connections: 


|URL |How it's used|
|-----|-----| 
|*.msappproxy.us *.servicebus.usgovcloudapi.net|Communication between the agent and the Azure AD cloud service |
|mscrl.microsoft.us:80 crl.microsoft.us:80 </br>ocsp.msocsp.us:80 www.microsoft.us:80| The agent uses these URLs to verify certificates.| 
|login.windows.us secure.aadcdn.microsoftonline-p.com *.microsoftonline.us </br>*.microsoftonline-p.us </br>*.msauth.net </br>*.msauthimages.net </br>*.msecnd.net</br>*.msftauth.net </br>*.msftauthimages.net</br>*.phonefactor.net </br>enterpriseregistration.windows.net</br>management.azure.com </br>policykeyservice.dc.ad.msft.net</br>ctdl.windowsupdate.us:80| The agent uses these URLs during the registration process.| 

### Install the agent for the Azure Government cloud 
In order to install the agent for the Azure Government cloud you must follow these specific steps: 
In the command line terminal, navigate to folder where the executable for installing the agent is located. 
Run the following command which specifies the installation is for Azure Government. 
For Passthrough Authentication: 
```
AADConnectAuthAgentSetup.exe REGISTERCONNECTOR="false" ENVIRONMENTNAME="AzureUSGovernment" /q 
For Application Proxy: 
AADApplicationProxyConnectorInstaller.exe ENVIRONMENTNAME="Azure 
USGovernment" 
```
## Single Sign On 
Set up your Azure AD Connect server: If you use Pass-through Authentication as your sign-in method, no additional prerequisite check is required. If you use password hash synchronization as your sign-in method, and if there is a firewall between Azure AD Connect and Azure AD, ensure that:
- You use version 1.1.644.0 or later of Azure AD Connect. 
- If your firewall or proxy allows DNS whitelisting, whitelist the connections to the *.msapproxy.us URLs over port 443. If not, allow access to the Azure datacenter IP ranges, which are updated weekly. This prerequisite is applicable only when you enable the feature. It is not required for actual user sign-ins. 

### Rolling Out Seamless SSO 
You can gradually roll out Seamless SSO to your users using the instructions provided below. You start by adding the following Azure AD URL to all or selected users' Intranet zone settings by using Group Policy in Active Directory: 
https://autologon.microsoft.us 

In addition, you need to enable an Intranet zone policy setting called Allow updates to status bar via script through Group Policy. 
Browser considerations 
Mozilla Firefox (all platforms) 
Mozilla Firefox doesn't automatically use Kerberos authentication. Each user must manually add the Azure AD URL to their Firefox settings by using the following steps: 
1. Run Firefox and enter about:config in the address bar. Dismiss any notifications that you see. 
2. Search for the network.negotiate-auth.trusted-uris preference. This preference lists Firefox's trusted sites for Kerberos authentication. 
3. Right-click and select Modify. 
4. Enter https://autologon.microsoft.us in the field.
5. Select OK and then reopen the browser. 

### Microsoft Edge based on Chromium (all platforms) 
If you have overridden the `AuthNegotiateDelegateAllowlist` or the `AuthServerAllowlist` policy settings in your environment, ensure that you add Azure AD's URL (https://autologon.microsoft.us) to them as well. 

### Google Chrome (all platforms) 
If you have overridden the `AuthNegotiateDelegateWhitelist` or the `AuthServerWhitelist` policy settings in your environment, ensure that you add Azure AD's URL (https://autologon.microsoft.us) to them as well. 

## Next Steps
[Pass-through Authentication](how-to-connect-pta-quick-start.md#step-1-check-the-prerequisites)
[Single Sign-on](how-to-connect-sso-quick-start.md#step-1-check-the-prerequisites) 