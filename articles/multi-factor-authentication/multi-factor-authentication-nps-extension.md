---
title: Use existing NPS servers to provide Azure MFA capabilities | Microsoft Docs
description: The Network Policy Server extension for Azure Multi-Factor Authentication is a simple solution to add cloud-based two-step vericiation capabilities to your existing authentication infrastructure.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid:
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: kgremban

ms.custom: H1Hack27Feb2017,it-pro
---
# Integrate your existing NPS infrastructure with Azure Multi-Factor Authentication - Public preview

The Network Policy Server (NPS) extension for Azure MFA adds cloud-based MFA capabilities to your authentication infrastructure using your existing servers. With the NPS extension, you can add phone call, SMS, or phone app verification to your existing authentication flow without having to install, configure, and maintain new servers. 

This extension was created for organizations that want to protect VPN connections without deploying the Azure MFA Server. The NPS extension acts as an adapter between RADIUS and cloud-based Azure MFA to provide a second factor of authentication for federated or synced users.

When using the NPS extension for Azure MFA, the authentication flow includes the following components: 

1. **NAS/VPN Server** receives requests from VPN clients and converts them into RADIUS requests to NPS servers. 
2. **NPS Server** connects to Active Directory to perform the primary authentication for the RADIUS requests and, upon success, passes the request to any installed extensions.  
3. **NPS Extension** triggers a request to Azure MFA for the secondary authentication. Once the extension receives the response, and if the MFA challenge succeeds, it completes the authentication request by providing the NPS server with security tokens that include an MFA claim, issued by Azure STS.  
4. **Azure MFA** communicates with Azure Active Directory to retrieve the user’s details and performs the secondary authentication using a verification method configured to the user.

The following diagram illustrates this high-level authentication request flow: 

![Authentication flow diagram](./media/multi-factor-authentication-nps-extension/auth-flow.png)

## Plan your deployment

The NPS extension automatically handles redundancy, so you don't need a special configuration.

You can create as many Azure Multi-Factor Authentication enabled NPS servers as you need. If you do install multiple servers, you should use a difference client certificate for each one of them. Creating a cert for each server means that you can update each cert individually, and not worry about downtime across all your servers.

VPN servers route authentication requests, so they need to be aware of the new Azure MFA-enabled NPS servers.

## Prerequisites

The NPS extension is meant to work with your existing infrastructure. Make sure you have the following prerequisites before you begin.

### Licenses

The NPS Extension for Azure MFA is available to customers with [licenses for Azure Multi-Factor Authentication](multi-factor-authentication.md) (included with Azure AD Premium, EMS, or an MFA subscription).

### Software

Windows Server 2008 R2 SP1 or above.

### Libraries

These libraries are installed automatically with the extension.
-	[Visual C++ Redistributable Packages for Visual Studio 2013 (X64)](https://www.microsoft.com/download/details.aspx?id=40784)
-	[Microsoft Azure Active Directory Module for Windows PowerShell version 1.1.166.0](https://connect.microsoft.com/site1164/Downloads/DownloadDetails.aspx?DownloadID=59185)

### Azure Active Directory

Everyone using the NPS extension must be synced to Azure Active Directory using Azure AD Connect, and must be enabled for MFA.

When you install the extension, you need the directory ID and admin credentials for your Azure AD tenant. You can find your directory ID in the [Azure portal](https://portal.azure.com). Sign in as an administrator, select the **Azure Active Directory** icon on the left, then select **Properties**. Copy the GUID in the **Directory ID** box and save it. You'll use this GUID as the tenant ID when you install the NPS extension.

![Find your Directory ID under Azure Active Directory properties](./media/multi-factor-authentication-nps-extension/find-directory-id.png)

## Prepare your environment

Before you install the NPS extension, you want to prepare you environment to handle the authentication traffic.

### Enable the NPS role on a domain-joined server

The NPS server connects to Azure Active Directory and authenticates the MFA requests. Choose one server for this role. We recommend choosing a server that doesn't handle requests from other services, because the NPS extension throws errors for any requests that aren't RADIUS.

1. On your server, open the **Add Roles and Features Wizard** from the Server Manager Quickstart menu.
2. Choose **Role-based or feature-based installation** for your installation type.
3. Select the **Network Policy and Access Services** server role. A window may pop up to inform you of required features to run this role.
4. Continue through the wizard until the Confirmation page. Select **Install**.

Now that you have a server designated for NPS, you should also configure this server to handle incoming RADIUS requests from the VPN solution.

### Configure your VPN solution to communicate with the NPS server

Depending on which VPN solution you use, the steps to configure your RADIUS authentication policy vary. Configure this policy to point to your RADIUS NPS server.

### Sync domain users to the cloud

This step may already be complete on your tenant, but it's good to double-check that Azure AD Connect has synchronized your databases recently.

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Select **Azure Active Directory** > **Azure AD Connect**
3. Verify that your sync status is **Enabled** and that your last sync was less than an hour ago.

If you need to kick off a new round of synchronization, us the instructions in [Azure AD Connect sync: Scheduler](../active-directory/connect/active-directory-aadconnectsync-feature-scheduler.md#start-the-scheduler).

### Determine which authentication methods your users can use

There are two factors that affect which authentication methods are available with an NPS extension deployment:

1. The password encryption algorithm used between the RADIUS client (VPN, Netscaler server, or other) and the NPS servers.
   - **PAP** supports all the authentication methods of Azure MFA in the cloud: phone call, text message, mobile app notification, and mobile app verification code.
   - **CHAPV2** supports phone call and mobile app notification.
   - **EAP** is not supported.
2. The input methods that the client application (VPN, Netscaler server, or other) can handle. For example, does the VPN client have some means to allow the user to type in a verification code from a text or mobile app?

When you deploy the NPS extension, use these factors to evaluate which methods are available for your users. If your RADIUS client supports PAP, but the client UX doesn't have input fields for a verification code, then phone call and mobile app notification are the two supported options.

You can [disable unsupported authentication methods](multi-factor-authentication-whats-next.md#selectable-verification-methods) in Azure.

### Enable users for MFA

Before you deploy the full NPS extension, you need to enable MFA for the users that you want to perform two-step verification. More immediately, to test the extension as you deploy it, you need at least one test account that is fully registered for Multi-Factor Authentication.

Use these steps to get a test account started:
1. [Enable an account for MFA](multi-factor-authentication-get-started-user-states.md).
2. Go to any website that kicks off an Azure AD authentication, like https://portal.azure.com.
3. [Register for two-step verification](./end-user/multi-factor-authentication-end-user-first-time.md).

Your users also need to follow these steps to enroll before they can authenticate with the NPS extension.

## Install the NPS extension

> [!IMPORTANT]
> Install the NPS extension on a different server than the VPN access point.

### Download and install the NPS extension for Azure MFA

1.	[Download the NPS Extension](https://aka.ms/npsmfa) from the Microsoft Download Center.
2.	Copy the binary to the Network Policy Server you want to configure.
3.	Run *setup.exe* and follow the installation instructions. If you encounter errors, double-check that the two libraries from the prerequisite section were succesfully installed.

### Run the PowerShell script

The installer creates a PowerShell script in this location: `C:\Program Files\Microsoft\AzureMfa\Config` (where C:\ is your installation drive). This PowerShell script performs the following actions:

-	Create a self-signed certificate.
-	Associate the public key of the certificate to the service principal on Azure AD.
-	Store the cert in the local machine cert store.
-	Grant access to the certificate’s private key to Network User.
-	Restart the NPS.

Unless you want to use your own certificates (instead of the self-signed certificates that the PowerShell script generates), run the PowerShell Script to complete the installation. If you install the extension on multiple servers, each one should have its own certificate.

1. Run Windows PowerShell as an administrator.
2. Change directories.

   `cd "C:\Program Files\Microsoft\AzureMfa\Config"`

3. Run the PowerShell script created by the installer.

   `.\AzureMfaNpsExtnConfigSetup.ps1`

4. PowerShell prompts for your tenant ID. Use the Directory ID GUID that you copied from the Azure portal in the prerequisites section.
5. Sign in to Azure AD as an administrator.
6. PowerShell shows a success message when the script is finished.  

Repeat these steps on any additional NPS servers that you want to set up for load balancing.

## Configure your NPS extension

This section includes design considerations and suggestions for successful NPS extension deployments.

### Configurations limitations

- The NPS extension for Azure MFA does not include tools to migrate users and settings from MFA Server to the cloud. For this reason, we suggest using the extension for new deployments, rather than existing deployment. If you use the extension on an existing deployment, your users will have to perform proof-up again to populate their MFA details in the cloud.  
- The NPS extension uses the UPN from the on-premises Active directory to identify the user on Azure MFA for performing the Secondary Auth. The extension cannot be configured to use a different identifier like alternate login ID or custom AD field other than UPN.  
- Not all encryption protocols support all verification methods.
   - **PAP** supports phone call, text message, mobile app notification, and mobile app verification code
   - **CHAPV2** supports phone call and mobile app notification
   - **EAP** is not supported

### Control RADIUS clients that require MFA

Once you enable MFA for a RADIUS client using the NPS Extension, all authentications for this client are required to perform MFA. If you want to enable MFA for some RADIUS clients but not others, you can configure two NPS servers and install the extension on only one of them. Configure RADIUS clients that you want to require MFA to send requests to the NPS server configured with the extension, and other RADIUS clients to the NPS server not configured with the extension.

### Prepare for users that aren't enrolled for MFA

If you have users that aren't enrolled for MFA, you can determine what happens when they try to authenticate. Use the registry setting *REQUIRE_USER_MATCH* in the registry path *HKLM\Software\Microsoft\AzureMFA* to control the feature behavior. This setting has a single configuration option:

| Key | Value | Default |
| --- | ----- | ------- |
| REQUIRE_USER_MATCH | TRUE/FALSE | Not set (equivalent to TRUE) |

The purpose of this setting is to determine what to do when a user is not enrolled for MFA. When the key does not exist, is not set, or is set to TRUE, and the user is not enrolled, then the extension fails the MFA challenge. When the key is set to FALSE and the user is not enrolled, authentication proceeds without performing MFA.

You can choose to create this key and set it to FALSE while your users are onboarding, and may not all be enrolled for Azure MFA yet. However, since setting the key permits users that aren't enrolled for MFA to sign in, you should remove this key before going to production.

## Troubleshooting

### How do I verify that the client cert is installed as expected?

Look for the self-signed certificate created by the installer in the cert store, and check that the private key has permissions granted to user **NETWORK SERVICE**. The cert has a subject name of **CN \<tenantid\>, OU = Microsoft NPS Extension**

-------------------------------------------------------------

### How can I verify that my client cert is associated to my tenant in Azure Active Directory?

Open PowerShell command prompt and run the following commands:

```
import-module MSOnline
Connect-MsolService
Get-MsolServicePrincipalCredential -AppPrincipalId "981f26a1-7f43-403b-a875-f8b09b8cd720" -ReturnKeyValues 1 
```

These commands print all the certificates associating your tenant with your instance of the NPS extension in your PowerShell session. Look for your certificate by exporting your client cert as a "Base-64 encoded X.509(.cer)" file without the private key, and compare it with the list from PowerShell.

Valid-From and Valid-Until timestamps, which are in human-readable form, can be used to filter out obvious misfits if the command returns more than one cert.

-------------------------------------------------------------

### Why are my requests failing with ADAL token error?

This error could be due to one of several reasons. Use these steps to help troubleshoot:

1. Restart your NPS server.
2. Verify that that client cert is installed as expected.
3. Verify that the certificate is associated with your tenant on Azure AD.
4. Verify that https://login.windows.net/ is accessible from the server running the extension.

-------------------------------------------------------------

### Why does authentication fail with an error in HTTP logs stating that the user is not found?

Verify that AD Connect is running, and that the user is present in both Windows Active Directory and Azure Active Directory.

------------------------------------------------------------

### Why do I see HTTP connect errors in logs with all my authentications failing?

Verify that https://adnotifications.windowsazure.com is reachable from the server running the NPS extension.


## Next steps

See how to integrate Azure MFA with [Active Directory](multi-factor-authentication-get-started-server-dirint.md), [RADIUS authentication](multi-factor-authentication-get-started-server-radius.md), and [LDAP authentication](multi-factor-authentication-get-started-server-ldap.md).
