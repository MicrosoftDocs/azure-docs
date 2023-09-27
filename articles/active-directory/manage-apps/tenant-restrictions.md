---
title: Use tenant restrictions to manage access to SaaS apps
description: How to use tenant restrictions to manage which users can access apps based on their Microsoft Entra tenant.
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 3/16/2023
ms.author: jomondi
ms.reviewer: vranganathan
ms.collection: M365-identity-device-management
ms.custom: contperf-fy22q3, enterprise-apps-article
---

# Restrict access to a tenant

Large organizations that emphasize security want to move to cloud services like Microsoft 365, but need to know that their users only can access approved resources. Traditionally, companies restrict domain names or IP addresses when they want to manage access. This approach fails in a world where software as a service (or SaaS) apps are hosted in a public cloud, running on shared domain names like `outlook.office.com` and `login.microsoftonline.com`. Blocking these addresses would keep users from accessing Outlook on the web entirely, instead of merely restricting them to approved identities and resources.

The Microsoft Entra solution to this challenge is a feature called tenant restrictions. With tenant restrictions, organizations can control access to SaaS cloud applications, based on the Microsoft Entra tenant the applications use for [single sign-on](what-is-single-sign-on.md). For example, you may want to allow access to your organization's Microsoft 365 applications, while preventing access to other organizations' instances of these same applications.  

With tenant restrictions, organizations can specify the list of tenants that users on their network are permitted to access. Microsoft Entra ID then only grants access to these permitted tenants - all other tenants are blocked, even ones that your users may be guests in. 

This article focuses on tenant restrictions for Microsoft 365, but the feature protects all apps that send the user to Microsoft Entra ID for single sign-on. If you use SaaS apps with a different Microsoft Entra tenant from the tenant used by your Microsoft 365, make sure that all required tenants are permitted (For example, in B2B collaboration scenarios). For more information about SaaS cloud apps, see the [Active Directory Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps).

The tenant restrictions feature also supports [blocking the use of all Microsoft consumer applications](#blocking-consumer-applications) (MSA apps) such as OneDrive, Hotmail, and Xbox.com.  This uses a separate header to the `login.live.com` endpoint, and is detailed at the end of this article.

## How it works

The overall solution comprises the following components:

1. **Microsoft Entra ID**: If the `Restrict-Access-To-Tenants: <permitted tenant list>` header is present, Microsoft Entra-only issues security tokens for the permitted tenants.

2. **On-premises proxy server infrastructure**: This infrastructure is a proxy device capable of Transport Layer Security (TLS) inspection. You must configure the proxy to insert the header containing the list of permitted tenants into traffic destined for Microsoft Entra ID.

3. **Client software**: To support tenant restrictions, client software must request tokens directly from Microsoft Entra ID, so that the proxy infrastructure can intercept traffic. Browser-based Microsoft 365 applications currently support tenant restrictions, as do Office clients that use modern authentication (like OAuth 2.0).

4. **Modern Authentication**: Cloud services must use modern authentication to use tenant restrictions and block access to all non-permitted tenants. You must configure Microsoft 365 cloud services to use modern authentication protocols by default. For the latest information on Microsoft 365 support for modern authentication, read [Updated Office 365 modern authentication](/microsoft-365/enterprise/modern-auth-for-office-2013-and-2016).

The following diagram illustrates the high-level traffic flow. Tenant restrictions requires TLS inspection only on traffic to Microsoft Entra ID, not to the Microsoft 365 cloud services. This distinction is important, because the traffic volume for authentication to Microsoft Entra ID is typically much lower than traffic volume to SaaS applications like Exchange Online and SharePoint Online.

:::image type="content" source="./media/tenant-restrictions/traffic-flow.png" alt-text="Diagram of tenant restrictions traffic flow.":::

## Set up tenant restrictions

There are two steps to get started with tenant restrictions. First, make sure that your clients can connect to the right addresses. Second, configure your proxy infrastructure.

### URLs and IP addresses

To use tenant restrictions, your clients must be able to connect to the following Microsoft Entra URLs to authenticate: 

- login.microsoftonline.com
- login.microsoft.com
- login.windows.net 

Additionally, to access Office 365, your clients must also be able to connect to the fully qualified domain names (FQDNs), URLs, and IP addresses defined in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

### Proxy configuration and requirements

The following configuration is required to enable tenant restrictions through your proxy infrastructure. This guidance is generic, so you should refer to your proxy vendor's documentation for specific implementation steps.

#### Prerequisites

- The proxy must be able to perform TLS interception, HTTP header insertion, and filter destinations using FQDNs/URLs.

- Clients must trust the certificate chain presented by the proxy for TLS communications. For example, if certificates from an internal public key infrastructure (PKI) are used, the internal issuing root certificate authority certificate must be trusted.

- Microsoft Entra ID P1 or P2 1 licenses are required for use of tenant restrictions.

#### Configuration

For each outgoing request to `login.microsoftonline.com`, `login.microsoft.com`, and `login.windows.net`, insert two HTTP headers: *Restrict-Access-To-Tenants* and *Restrict-Access-Context*.

> [!NOTE]
> Do not include subdomains under `*.login.microsoftonline.com` in your proxy configuration. Doing so will include `device.login.microsoftonline.com` and will interfere with Client Certificate authentication, which is used in Device Registration and Device-based Conditional Access scenarios. Configure your proxy server to exclude `device.login.microsoftonline.com` and `enterpriseregistration.windows.net` from TLS break-and-inspect and header injection.

The headers should include the following elements:

- For *Restrict-Access-To-Tenants*, use a value of \<permitted tenant list\>, which is a comma-separated list of tenants you want to allow users to access. Any domain that is registered with a tenant can be used to identify the tenant in this list, and the directory ID itself. For an example of all three ways of describing a tenant, the name/value pair to allow Contoso, Fabrikam, and Microsoft looks like: `Restrict-Access-To-Tenants: contoso.com,fabrikam.onmicrosoft.com,72f988bf-86f1-41af-91ab-2d7cd011db47`

- For *Restrict-Access-Context*, use a value of a single directory ID, declaring which tenant is setting the tenant restrictions. For example, to declare Contoso as the tenant that set the tenant restrictions policy, the name/value pair looks like: `Restrict-Access-Context: 456ff232-35l2-5h23-b3b3-3236w0826f3d`. You *must* use your own directory ID here to get logs for these authentications. If you use any directory ID other than your own, those sign-in logs *will* appear in someone else's tenant, with all personal information removed. For more information, see [Admin experience](#admin-experience).

To find your directory ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Reader](../roles/permissions-reference.md#global-reader). 
1. Browse to **Identity** > **Overview** > **Overview**.
1. Copy the **Tenant ID** value.

To validate that a directory ID or domain name refer to the same tenant, use that ID or domain in place of \<tenant\> in this URL: `https://login.microsoftonline.com/<tenant>/v2.0/.well-known/openid-configuration`.  If the results with the domain and the ID are the same, they refer to the same tenant.

To prevent users from inserting their own HTTP header with non-approved tenants, the proxy needs to replace the *Restrict-Access-To-Tenants* header if it's already present in the incoming request.

Clients must be forced to use the proxy for all requests to `login.microsoftonline.com`, `login.microsoft.com`, and `login.windows.net`. For example, if PAC files are used to direct clients to use the proxy, end users shouldn't be able to edit or disable the PAC files.

## The user experience

This section describes the experience for both end users and admins.

### End-user experience

An example user is on the Contoso network, but is trying to access the Fabrikam instance of a shared SaaS application like Outlook online. If Fabrikam is a non-permitted tenant for the Contoso instance, the user sees an access denial message, which says you're trying to access a resource that belongs to an organization unapproved by your IT department.

:::image type="content" source="./media/tenant-restrictions/error-message.png" alt-text="Screenshot of tenant restrictions error message, from April 2021.":::
### Admin experience

While configuration of tenant restrictions is done on the corporate proxy infrastructure, admins can access the tenant restrictions reports in the Microsoft Entra admin center directly. To view the reports:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Global Reader](../roles/permissions-reference.md#global-reader). 
1. Browse to **Identity** > **Overview** > **Tenant restrictions**.

The admin for the tenant specified as the Restricted-Access-Context tenant can use this report to see sign-ins blocked because of the tenant restrictions policy, including the identity used and the target directory ID. Sign-ins are included if the tenant setting the restriction is either the user tenant or resource tenant for the sign-in.

The report may contain limited information, such as target directory ID, when a user who is in a tenant other than the Restricted-Access-Context tenant signs in. In this case, user identifiable information, such as name and user principal name, is masked to protect user data in other tenants (For example, `"{PII Removed}@domain.com" or 00000000-0000-0000-0000-000000000000` in place of usernames and object IDs as appropriate).

Like other reports in the Microsoft Entra admin center, you can use filters to specify the scope of your report. You can filter on a specific time interval, user, application, client, or status. If you select the **Columns** button, you can choose to display data with any combination of the following fields:

- **User** - this field can have personal data removed, where it is set to `00000000-0000-0000-0000-000000000000`.
- **Application**
- **Status**
- **Date**
- **Date (UTC)** - where UTC is Coordinated Universal Time
- **IP Address**
- **Client**
- **Username** - this field can have personal data removed, where it is set to `{PII Removed}@domain.com`
- **Location**
- **Target tenant ID**

## Microsoft 365 support

Microsoft 365 applications must meet two criteria to fully support tenant restrictions:

1. The client used supports modern authentication.
2. Modern authentication is enabled as the default authentication protocol for the cloud service.

For the latest information on which Office clients currently support modern authentication, see [Updated Office 365 modern authentication](https://www.microsoft.com/microsoft-365/blog/2015/03/23/office-2013-modern-authentication-public-preview-announced/). That page also includes links to instructions for enabling modern authentication on specific Exchange Online and Skype for Business Online tenants. SharePoint Online already enables Modern authentication by default. Teams only supports modern auth, and doesn't support legacy auth, so this bypass concern doesn't apply to Teams. 

Microsoft 365 browser-based applications (such as the Office Portal, Yammer, SharePoint sites, and Outlook on the Web.) currently support tenant restrictions. Thick clients (Outlook, Skype for Business, Word, Excel, PowerPoint, and more) can enforce tenant restrictions only when using modern authentication.  

Outlook and Skype for Business clients that support modern authentication may still be able to use legacy protocols against tenants where modern authentication isn't enabled, effectively bypassing tenant restrictions. Tenant restrictions may block applications that use legacy protocols if they contact `login.microsoftonline.com`, `login.microsoft.com`, or `login.windows.net` during authentication.

For Outlook on Windows, customers may choose to implement restrictions preventing end users from adding non-approved mail accounts to their profiles. For example, see the [Prevent adding non-default Exchange accounts](https://gpsearch.azurewebsites.net/default.aspx?ref=1) group policy setting.

### Azure RMS and Office Message Encryption incompatibility

The [Azure Rights Management Service](/azure/information-protection/what-is-azure-rms) (RMS) and [Office Message Encryption](/microsoft-365/compliance/ome) features aren't compatible with tenant restrictions. These features rely on signing your users into other tenants in order to get decryption keys for the encrypted documents. Because tenant restrictions blocks access to other tenants, encrypted mail and documents sent to your users from untrusted tenants won't be accessible.

## Testing

If you want to try out tenant restrictions before implementing it for your whole organization, you have two options: a host-based approach using a tool like Fiddler, or a staged rollout of proxy settings.

### Fiddler for a host-based approach

Fiddler is a free web debugging proxy that can be used to capture and modify HTTP/HTTPS traffic, it includes inserting HTTP headers. To configure Fiddler to test tenant restrictions, perform the following steps:

1. [Download and install Fiddler](https://www.telerik.com/fiddler).

2. Configure Fiddler to decrypt HTTPS traffic, per [Fiddler's help documentation](https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/DecryptHTTPS).

3. Configure Fiddler to insert the *Restrict-Access-To-Tenants* and *Restrict-Access-Context* headers using custom rules:

   1. In the Fiddler Web Debugger tool, select the **Rules** menu and select **Customize Rules…** to open the CustomRules file.

   2. Add the following lines within the `OnBeforeRequest` function. Replace \<List of tenant identifiers\> with a domain registered with your tenant (for example, `contoso.onmicrosoft.com`). Replace \<directory ID\> with your tenant's Microsoft Entra GUID identifier.  You **must** include the correct GUID identifier in order for the logs to appear in your tenant.

   ```JScript.NET
    // Allows access to the listed tenants.
      if (
          oSession.HostnameIs("login.microsoftonline.com") ||
          oSession.HostnameIs("login.microsoft.com") ||
          oSession.HostnameIs("login.windows.net")
      )
      {
          oSession.oRequest["Restrict-Access-To-Tenants"] = "<List of tenant identifiers>";
          oSession.oRequest["Restrict-Access-Context"] = "<Your directory ID>";
      }

    // Blocks access to consumer apps
      if (
          oSession.HostnameIs("login.live.com")
      )
      {
          oSession.oRequest["sec-Restrict-Tenant-Access-Policy"] = "restrict-msa";
      }
   ```

   If you need to allow multiple tenants, use a comma to separate the tenant names. For example:

   `oSession.oRequest["Restrict-Access-To-Tenants"] = "contoso.onmicrosoft.com,fabrikam.onmicrosoft.com";`

4. Save and close the CustomRules file.

After you configure Fiddler, you can capture traffic by going to the **File** menu and selecting **Capture Traffic**.

### Staged rollout of proxy settings

Depending on the capabilities of your proxy infrastructure, you may be able to stage the rollout of settings to your users. See the following high-level options for consideration:

1. Use PAC files to point test users to a test proxy infrastructure, while normal users continue to use the production proxy infrastructure.
2. Some proxy servers may support different configurations using groups.

For specific details, refer to your proxy server documentation.

## Blocking consumer applications

Applications from Microsoft that support both consumer accounts and organizational accounts such as OneDrive can sometimes be hosted on the same URL. This means that users that must access that URL for work purposes also have access to it for personal use, which may not be permitted under your operating guidelines.

Some organizations attempt to fix this by blocking `login.live.com` in order to block personal accounts from authenticating.  This has several downsides:

1. Blocking `login.live.com` blocks the use of personal accounts in B2B guest scenarios, which can intrude on visitors and collaboration.
1. [Autopilot requires the use of `login.live.com`](/mem/autopilot/networking-requirements) in order to deploy. Intune and Autopilot scenarios can fail when `login.live.com` is blocked.
1. Organizational telemetry and Windows updates that rely on the login.live.com service for device IDs [cease to work](/windows/deployment/update/windows-update-troubleshooting#feature-updates-are-not-being-offered-while-other-updates-are).

### Configuration for consumer apps

While the `Restrict-Access-To-Tenants` header functions as an allowlist, the Microsoft account (MSA) block works as a deny signal, telling the Microsoft account platform to not allow users to sign in to consumer applications. To send this signal, the `sec-Restrict-Tenant-Access-Policy` header is injected to traffic visiting `login.live.com` using the same corporate proxy or firewall as [above](#proxy-configuration-and-requirements). The value of the header must be `restrict-msa`. When the header is present and a consumer app is attempting to sign in a user directly, that sign in will be blocked.

At this time, authentication to consumer applications doesn't appear in the [admin logs](#admin-experience), as login.live.com is hosted separately from Microsoft Entra ID.

### What the header does and doesn't block

The `restrict-msa` policy blocks the use of consumer applications, but allows through several other types of traffic and authentication:

1. User-less traffic for devices.  This includes traffic for Autopilot, Windows Update, and organizational telemetry.
1. B2B authentication of consumer accounts. Users with Microsoft accounts that are [invited to collaborate with a tenant](../external-identities/redemption-experience.md#invitation-redemption-flow) authenticate to login.live.com in order to access a resource tenant.
    1. This access is controlled using the `Restrict-Access-To-Tenants` header to allow or deny access to that resource tenant.
1. "Passthrough" authentication, used by many Azure apps and Office.com, where apps use Microsoft Entra ID to sign in consumer users in a consumer context.
    1. This access is also controlled using the `Restrict-Access-To-Tenants` header to allow or deny access to the special "passthrough" tenant (`f8cdef31-a31e-4b4a-93e4-5f571e91255a`).  If this tenant doesn't appear in your `Restrict-Access-To-Tenants` list of allowed domains, consumer accounts will be blocked by Microsoft Entra ID from signing into these apps.

## Platforms that don't support TLS break and inspect

Tenant restrictions depends on injection of a list of allowed tenants in the HTTPS header, which requires Transport Layer Security Inspection (TLSI) to break and inspect traffic. For environments where the client's side isn't able to break and inspect the traffic to add headers, tenant restrictions won't work.

Take the example of Android 7.0 and onwards. Android changed how it handles trusted certificate authorities (CAs) to provide safer defaults for secure app traffic. For more information, see [Changes to Trusted Certificate Authorities in Android Nougat](https://android-developers.googleblog.com/2016/07/changes-to-trusted-certificate.html). 

Following the recommendation from Google, Microsoft client apps ignore user certificates by default thus making such apps unable to work with tenant restrictions, since the certificates used by the network proxy are installed in the user certificate store, which isn't trusted by client apps.

For such environments that can't break and inspect traffic to add the tenant restrictions parameters onto the header, other features of Microsoft Entra ID can provide protection. The following list provides more information on such Microsoft Entra features.

- [Conditional Access: Only allow use of managed/compliant devices](/mem/intune/protect/conditional-access-intune-common-ways-use#device-based-conditional-access)
- [Conditional Access: Manage access for guest/external users](/microsoft-365/security/office-365-security/identity-access-policies-guest-access)
- [B2B Collaboration: Restrict outbound rules by Cross-tenant access for the same tenants listed in the parameter "Restrict-Access-To-Tenants"](../external-identities/cross-tenant-access-settings-b2b-collaboration.md)
- [B2B Collaboration: Restrict invitations to B2B users to the same domains listed in the "Restrict-Access-To-Tenants" parameter](../external-identities/allow-deny-list.md)
- [Application management: Restrict how users consent to applications](configure-user-consent.md)
- [Intune: Apply App Policy through Intune to restrict usage of managed apps to only the UPN of the account that enrolled the device](/mem/intune/apps/app-configuration-policies-use-android) - Check the section under, **Allow only configured organization accounts in apps** subheading.

However, some specific scenarios can only be covered using tenant restrictions.
## Next steps

- Read about [Updated Office 365 modern authentication](https://www.microsoft.com/microsoft-365/blog/2015/11/19/updated-office-365-modern-authentication-public-preview/)
- Review the [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2)
