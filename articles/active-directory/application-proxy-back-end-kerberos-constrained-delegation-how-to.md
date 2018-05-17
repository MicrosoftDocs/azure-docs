---
title: Troubleshoot Kerberos constrained delegation configurations for Application Proxy | Microsoft Docs
description: Troubleshoot Kerberos Constrained Delegation configurations for Application Proxy
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/09/2018
ms.author: markvi
ms.reviewer: harshja

---

# Troubleshoot Kerberos constrained delegation configurations for Azure Active Directory Application Proxy

The methods available for achieving SSO to published applications can vary from one application to another. One option that Azure AD Application Proxy offers by default is Kerberos constrained delegation. You can configure a connector to perform constrained Kerberos authentication to back-end applications, on behalf of users.

The procedure for enabling Kerberos constrained delegation is straightforward. It usually requires no more than a general understanding of the various components and authentication flow that facilitate SSO. But sometimes, Kerberos constrained delegation SSO doesn’t function as expected. You need good sources of information to troubleshoot these scenarios.

This article provides a single point of reference that helps troubleshoot and self-remediate some of the most common issues. It also provides guidance for diagnosing more complex implementation problems.

This article makes the following assumptions:

-   Deployment of Azure AD Application Proxy per [Get started with Application Proxy](manage-apps/application-proxy-enable.md) and general access to non-Kerberos constrained delegation applications work as expected.

-   The published target application is based on Microsoft Internet Information Services (IIS) and Microsoft’s implementation of Kerberos.

-   The server and application hosts reside in a single Azure Active Directory domain. For detailed information on cross-domain and forest scenarios, see the [Kerberos constrained delegation whitepaper](https://aka.ms/KCDPaper).

-   The subject application is published in an Azure tenant with pre-authentication enabled. Users are expected to authenticate to Azure via forms-based authentication. Rich client authentication scenarios aren't covered by this article. They might be added at some point in the future.

## Prerequisites

Azure AD Application Proxy can be deployed into many types of infrastructures or environments. The architectures will vary from organization to organization. The most common causes of Kerberos constrained delegation-related issues aren't the environments. Simple misconfigurations or general oversight cause most issues.

For this reason, it's best to make sure you've met all the prerequisites in [Using Kerberos constrained delegation SSO with the Application Proxy](manage-apps/application-proxy-configure-single-sign-on-with-kcd.md) before you start troubleshooting. Note the section on configuring Kerberos constrained delegation on 2012R2. This process employs a different approach to configuring KCD on previous versions of Windows. Also, be mindful of these considerations:

-   It's not uncommon for a domain member server to open a secure channel dialog with a specific domain controller. Then the server might move to another dialog at any given time. So connector hosts shouldn't be restricted to communication with only specific local site DCs.

-   As in the preceding point, cross-domain scenarios rely on referrals that direct a connector host to DCs that might reside outside of the local network perimeter. In this scenario, it's equally important to also allow traffic onward to DCs that represent other respective domains. If not, delegation fails.

-   Where possible, avoid placing any active IPS or IDS devices between connector hosts and DCs. These devices are sometimes overintrusive and interfere with core RPC traffic.

Test delegation in simple scenarios. The more variables you introduce, the more you might have to contend with. To save time, limit your testing to a single connector. Add additional connectors after the issue has been resolved.

Some environmental factors might also contribute to an issue. To avoid these factors, minimize architecture as much as possible during testing. For example, misconfigured internal firewall ACLs are common. If possible, allow all traffic from a connector straight through to the DCs and back-end application.

The best place to position connectors is as close as possible to their targets. A firewall that sits inline while testing adds unnecessary complexity and can prolong your investigations.

What represents a KCD problem? There are several common indications that KCD SSO is failing. The first signs of an issue usually appear in the browser.

   ![Incorrect KCD configuration error](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic1.png)

   ![Authorization failed due to missing permissions](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic2.png)

Both of these show the same symptom: failure to perform SSO. User access to the application is denied.

## Troubleshooting

How you troubleshoot depends on the issue and the symptoms you observe. Before going any farther, explore the following articles. They contain useful troubleshooting information:

-   [Troubleshoot Application Proxy problems and error messages](active-directory-application-proxy-troubleshoot.md)

-   [Kerberos errors and symptoms](active-directory-application-proxy-troubleshoot.md#kerberos-errors)

-   [Working with SSO when on-premises and cloud identities aren't identical](manage-apps/application-proxy-configure-single-sign-on-with-kcd.md#working-with-different-on-premises-and-cloud-identities)

If you’ve got this far, then the main issue definitely exists. To start, separate the flow into three distinct stages that you can troubleshoot.

**Client preauthentication**. The external user authenticating to Azure via a browser. The ability to preauthenticate to Azure is necessary for KCD SSO to function. Test and address this if there are any issues. The preauthentication stage isn't related to KCD or the published application. It's easy to correct any discrepancies by sanity checking that the subject account exists in Azure. Also check that it's not disabled or blocked. The error response in the browser is usually descriptive enough to explain the cause. If you're uncertain, check other Microsoft troubleshooting articles to verify.

**Delegation service**. The Azure Proxy connector that obtains a Kerberos service ticket from a Kerberos Key Distribution Center (KCD) on behalf of users.

The external communications between the client and the Azure front end have no bearing on KCD, other than ensuring that it works. This is so the Azure Proxy service can be provided with a valid user ID that is used to obtain a Kerberos ticket. Without this, KCD is not possible and would fail.

As mentioned previously, the browser error messages usually provide some good clues on why things are failing. Make sure to note down the activity ID and timestamp in the response as this allows you to correlate the behavior to actual events in the Azure Proxy event log.

   ![Incorrect KCD configuration error](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic3.png)

And the corresponding entries seen the event log would be seen as events 13019 or 12027. You can find the connector event logs in **Applications and Services Logs** &gt; **Microsoft** &gt; **AadApplicationProxy** &gt; **Connector**&gt;**Admin**.

   ![Event 13019 from Application Proxy event log](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic4.png)

   ![Event 12027 from Application Proxy event log](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic5.png)

-   Use an A record in your internal DNS for the application’s address, and not a CName

-   Reconfirm that the connector host has been granted the rights to delegate to the designated target account’s SPN, and that **Use any authentication protocol** is selected. For more information about this topic, see [SSO configuration article](manage-apps/application-proxy-configure-single-sign-on-with-kcd.md)

-   Verify that there is only a single instance of the SPN in existence in AD by issuing a `setspn -x` from a cmd prompt on any domain member host

-   Check to see if a domain policy is enforced to limit the [max size of issued Kerberos tokens](https://blogs.technet.microsoft.com/askds/2012/09/12/maxtokensize-and-windows-8-and-windows-server-2012/), as this prevents the connector from obtaining a token if found to be excessive

A network trace capturing the exchanges between the connector host and a domain KDC would then be the next best step in obtaining more low-level detail on the issues. For more information, see, [deep dive Troubleshoot paper](https://aka.ms/proxytshootpaper).

If ticketing looks good, you should see an event in the logs stating that authentication failed due to the application returning a 401. This typically indicates that the target application rejecting your ticket, so proceed with the following next stage:

**Target application** - The consumer of the Kerberos ticket provided by the connector

At this stage, the connector is expected to have sent a Kerberos service ticket to the backend, as a header within the first application request.

-   Using the application’s internal URL defined in the portal, validate that the application is accessible directly from the browser on the connector host. Then you can log in successfully. Details on doing this can be found on the connector Troubleshoot page.

-   Still on the connector host, confirm that the authentication between the browser and the application is using Kerberos, by doing one of the following:

1.  Run Dev tools(**F12**) in Internet Explorer, or use [Fiddler](https://blogs.msdn.microsoft.com/crminthefield/2012/10/10/using-fiddler-to-check-for-kerberos-auth/) from the connector host. Go to the application using the internal URL, and inspect the offered WWW authorization headers returned in the response from the application, to ensure that either negotiate or Kerberos is present. A subsequent Kerberos blob returned in the response from the browser to the application typically start with **YII**, so this is a good indication of Kerberos being in play. NTLM on the other hand always starts with **TlRMTVNTUAAB**, which reads NTLMSSP when decoded from Base64. If you see **TlRMTVNTUAAB** at the start of the blob, this means that Kerberos is **not** available. If you don’t see this, Kerberos is likely available.
    > [!NOTE]
    > If using Fiddler, this method would require temporarily disabling extended protection on the application’s config in IIS.

     ![Browser network inspection window](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic6.png)

    *Figure:* Since this does not start with TIRMTVNTUAAB, this is an example that Kerberos is available. This is an example of a Kerberos Blob that doesn’t start with YII.

2.  Temporarily remove NTLM from the providers list on IIS site and access app directly from IE on connector host. With NTLM no longer in the providers list, you should be able to access the application using Kerberos only. If this fails, then that suggests that there is a problem with the application’s configuration and Kerberos authentication is not functioning.

If Kerberos is not available, then check the application’s authentication settings in IIS to make sure negotiate is listed topmost, with NTLM just beneath it. (Not Negotiate: Kerberos or Negotiate: PKU2U). Only continue if Kerberos is functional.

   ![Windows authentication providers](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic7.png)
   
-   With Kerberos and NTLM in place, lets now temporarily disable pre-authentication for the application in the portal. See if you can access it from the internet using the external URL. You should be prompted to authenticate and should be able to do so with the same account used in the previous step. If not, this indicates a problem with the backend application and not KCD at all.

-   Now re-enable pre-authentication in the portal and authenticate through Azure by attempting to connect to the application via its external URL. If SSO has failed, then you should see a forbidden error message in the browser, plus event 13022 in the log:

    *Microsoft AAD Application Proxy Connector cannot authenticate the user because the backend server responds to Kerberos authentication attempts with an HTTP 401 error.*

    ![HTTTP 401 forbidden error](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic8.png)

-   Check the IIS application to ensure the configured application pool is configured to use the same account that the SPN has been configured against in AD, by navigating in IIS as in the following illustration

    ![IIS application configuration window](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic9.png)

    Once you know the identity, issue the following from a cmd prompt to make sure this account is definitely configured with the SPN in question. For example,  `setspn –q http/spn.wacketywack.com`

    ![SetSPN command window](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic10.png)

-   Check that the SPN defined against the application’s settings in the portal is the same SPN configured against the target AD account used by the application’s app pool

   ![SPN configuration in Azure portal](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic11.png)
   
-   Go into IIS and select the **Configuration Editor** option for the application, and navigate to **system.webServer/security/authentication/windowsAuthentication** to make sure the value **UseAppPoolCredentials** is **True**

   ![IIS configuration app pools credential option](./media/application-proxy-back-end-kerberos-constrained-delegation-how-to/graphic12.png)

After changing this value to **True**, all cached Kerberos tickets need to be removed from the backend server. You can do this by running the following command:

```powershell
Get-WmiObject Win32_LogonSession | Where-Object {$_.AuthenticationPackage -ne 'NTLM'} | ForEach-Object {klist.exe purge -li ([Convert]::ToString($_.LogonId, 16))}
``` 

For more information, see [Purge the Kerberos client ticket cache for all sessions](https://gallery.technet.microsoft.com/scriptcenter/Purge-the-Kerberos-client-b56987bf).



While being useful in improving the performance of Kerberos operations, leaving Kernel mode enabled also causes the ticket for the requested service to be decrypted using machine account. This is also called the Local system, so having this set to true break KCD when the application is hosted across multiple servers in a farm.

-   As an additional check, you may also want to disable the **Extended** protection too. There have been encountered scenarios where this has proved to break KCD when enabled in specific configurations, where an application is published as a sub folder of the Default Web site. This itself is configured for Anonymous authentication only, leaving the entire dialogs grayed out suggesting child objects would not be inheriting any active settings. But where possible we would always recommend having this enabled, so by all means test, but don’t forget to restore this to enabled.

These additional checks should have put you on track to start using your published application. You can go ahead and spin up additional connectors that are also configured to delegate, but if things are no further then we would suggest a read of our more in-depth technical walkthrough [The complete guide for Troubleshoot Azure AD Application Proxy](https://aka.ms/proxytshootpaper)

If you’re still unable to progress your issue, support would be more than happy to assist and continue from here. Create a support ticket directly within the portal (an engineer will reach out to you).

## Other scenarios

-   Azure Application Proxy requests a Kerberos ticket before sending its request to an application. Some third-party applications such as Tableau Server do not like this method of authenticating, and rather expects the more conventional negotiations to take place. The first request is anonymous, allowing the application to respond with the authentication types that it supports through a 401.

-   Double hop authentication - Commonly used in scenarios where an application is tiered, with a backend and front end, both requiring authentication, such as SQL Reporting Services.

## Next steps
[Configure kerberos constrained delegation (KCD) on a managed domain](../active-directory-domain-services/active-directory-ds-enable-kcd.md)
