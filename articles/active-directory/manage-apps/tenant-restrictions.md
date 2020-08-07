---
title: Use tenant restrictions to manage access to SaaS apps - Azure AD
description: How to use tenant restrictions to manage which users can access apps based on their Azure AD tenant.
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/28/2019
ms.author: kenwith
ms.reviewer: richagi
ms.collection: M365-identity-device-management
---

# Use tenant restrictions to manage access to SaaS cloud applications

Large organizations that emphasize security want to move to cloud services like Office 365, but need to know that their users only can access approved resources. Traditionally, companies restrict domain names or IP addresses when they want to manage access. This approach fails in a world where software as a service (or SaaS) apps are hosted in a public cloud, running on shared domain names like [outlook.office.com](https://outlook.office.com/) and [login.microsoftonline.com](https://login.microsoftonline.com/). Blocking these addresses would keep users from accessing Outlook on the web entirely, instead of merely restricting them to approved identities and resources.

The Azure Active Directory (Azure AD) solution to this challenge is a feature called tenant restrictions. With tenant restrictions, organizations can control access to SaaS cloud applications, based on the Azure AD tenant the applications use for single sign-on. For example, you may want to allow access to your organization’s Office 365 applications, while preventing access to other organizations’ instances of these same applications.  

With tenant restrictions, organizations can specify the list of tenants that their users are permitted to access. Azure AD then only grants access to these permitted tenants.

This article focuses on tenant restrictions for Office 365, but the feature should work with any SaaS cloud app that uses modern authentication protocols with Azure AD for single sign-on. If you use SaaS apps with a different Azure AD tenant from the tenant used by Office 365, make sure that all required tenants are permitted. For more information about SaaS cloud apps, see the [Active Directory Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.AzureActiveDirectory).

## How it works

The overall solution comprises the following components:

1. **Azure AD**: If the `Restrict-Access-To-Tenants: <permitted tenant list>` is present, Azure AD only issues security tokens for the permitted tenants.

2. **On-premises proxy server infrastructure**: This infrastructure is a proxy device capable of Transport Layer Security (TLS) inspection. You must configure the proxy to insert the header containing the list of permitted tenants into traffic destined for Azure AD.

3. **Client software**: To support tenant restrictions, client software must request tokens directly from Azure AD, so that the proxy infrastructure can intercept traffic. Browser-based Office 365 applications currently support tenant restrictions, as do Office clients that use modern authentication (like OAuth 2.0).

4. **Modern Authentication**: Cloud services must use modern authentication to use tenant restrictions and block access to all non-permitted tenants. You must configure Office 365 cloud services to use modern authentication protocols by default. For the latest information on Office 365 support for modern authentication, read [Updated Office 365 modern authentication](https://www.microsoft.com/en-us/microsoft-365/blog/2015/03/23/office-2013-modern-authentication-public-preview-announced/).

The following diagram illustrates the high-level traffic flow. Tenant restrictions requires TLS inspection only on traffic to Azure AD, not to the Office 365 cloud services. This distinction is important, because the traffic volume for authentication to Azure AD is typically much lower than traffic volume to SaaS applications like Exchange Online and SharePoint Online.

![Tenant restrictions traffic flow - diagram](./media/tenant-restrictions/traffic-flow.png)

## Set up tenant restrictions

There are two steps to get started with tenant restrictions. First, make sure that your clients can connect to the right addresses. Second, configure your proxy infrastructure.

### URLs and IP addresses

To use tenant restrictions, your clients must be able to connect to the following Azure AD URLs to authenticate: [login.microsoftonline.com](https://login.microsoftonline.com/), [login.microsoft.com](https://login.microsoft.com/), and [login.windows.net](https://login.windows.net/). Additionally, to access Office 365, your clients must also be able to connect to the fully qualified domain names (FQDNs), URLs, and IP addresses defined in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2). 

### Proxy configuration and requirements

The following configuration is required to enable tenant restrictions through your proxy infrastructure. This guidance is generic, so you should refer to your proxy vendor’s documentation for specific implementation steps.

#### Prerequisites

- The proxy must be able to perform TLS interception, HTTP header insertion, and filter destinations using FQDNs/URLs.

- Clients must trust the certificate chain presented by the proxy for TLS communications. For example, if certificates from an internal [public key infrastructure (PKI)](/windows/desktop/seccertenroll/public-key-infrastructure) are used, the internal issuing root certificate authority certificate must be trusted.

- This feature is included in Office 365 subscriptions, but if you want to use tenant restrictions to control access to other SaaS apps, then Azure AD Premium 1 licenses are required.

#### Configuration

For each incoming request to login.microsoftonline.com, login.microsoft.com, and login.windows.net, insert two HTTP headers: *Restrict-Access-To-Tenants* and *Restrict-Access-Context*.

The headers should include the following elements:

- For *Restrict-Access-To-Tenants*, use a value of \<permitted tenant list\>, which is a comma-separated list of tenants you want to allow users to access. Any domain that is registered with a tenant can be used to identify the tenant in this list. For example, to permit access to both Contoso and Fabrikam tenants, the name/value pair looks like: `Restrict-Access-To-Tenants: contoso.onmicrosoft.com,fabrikam.onmicrosoft.com`

- For *Restrict-Access-Context*, use a value of a single directory ID, declaring which tenant is setting the tenant restrictions. For example, to declare Contoso as the tenant that set the tenant restrictions policy, the name/value pair looks like: `Restrict-Access-Context: 456ff232-35l2-5h23-b3b3-3236w0826f3d`  

> [!TIP]
> You can find your directory ID in the [Azure Active Directory portal](https://aad.portal.azure.com/). Sign in as an administrator, select **Azure Active Directory**, then select **Properties**.

To prevent users from inserting their own HTTP header with non-approved tenants, the proxy needs to replace the *Restrict-Access-To-Tenants* header if it is already present in the incoming request.

Clients must be forced to use the proxy for all requests to login.microsoftonline.com, login.microsoft.com, and login.windows.net. For example, if PAC files are used to direct clients to use the proxy, end users shouldn't be able to edit or disable the PAC files.

## The user experience

This section describes the experience for both end users and admins.

### End-user experience

An example user is on the Contoso network, but is trying to access the Fabrikam instance of a shared SaaS application like Outlook online. If Fabrikam is a non-permitted tenant for the Contoso instance, the user sees an access denial message, which says you're trying to access a resource that belongs to an organization unapproved by your IT department.

### Admin experience

While configuration of tenant restrictions is done on the corporate proxy infrastructure, admins can access the tenant restrictions reports in the Azure portal directly. To view the reports:

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com/). The **Azure Active Directory admin center** dashboard appears.

2. In the left pane, select **Azure Active Directory**. The Azure Active Directory overview page appears.

3. In the **Other capabilities** heading, select **Tenant restrictions**.

The admin for the tenant specified as the Restricted-Access-Context tenant can use this report to see sign-ins blocked because of the tenant restrictions policy, including the identity used and the target directory ID. Sign-ins are included if the tenant setting the restriction is either the user tenant or resource tenant for the sign-in.

> [!NOTE]
> The report may contain limited information, such as target directory ID, when a user who is in a tenant other than the Restricted-Access-Context tenant signs in. In this case, user identifiable information, such as name and user principal name, is masked to protect user data in other tenants.

Like other reports in the Azure portal, you can use filters to specify the scope of your report. You can filter on a specific time interval, user, application, client, or status. If you select the **Columns** button, you can choose to display data with any combination of the following fields:

- **User**
- **Application**
- **Status**
- **Date**
- **Date (UTC)** (where UTC is Coordinated Universal Time)
- **MFA Auth Method** (multifactor authentication method)
- **MFA Auth Detail** (multifactor authentication detail)
- **MFA Result**
- **IP Address**
- **Client**
- **Username**
- **Location**
- **Target tenant ID**

## Office 365 support

Office 365 applications must meet two criteria to fully support tenant restrictions:

1. The client used supports modern authentication.
2. Modern authentication is enabled as the default authentication protocol for the cloud service.

Refer to [Updated Office 365 modern authentication](https://www.microsoft.com/en-us/microsoft-365/blog/2015/03/23/office-2013-modern-authentication-public-preview-announced/) for the latest information on which Office clients currently support modern authentication. That page also includes links to instructions for enabling modern authentication on specific Exchange Online and Skype for Business Online tenants. SharePoint Online already enables Modern authentication by default.

Office 365 browser-based applications (the Office Portal, Yammer, SharePoint sites, Outlook on the Web, and more) currently support tenant restrictions. Thick clients (Outlook, Skype for Business, Word, Excel, PowerPoint, and more) can enforce tenant restrictions only when using modern authentication.  

Outlook and Skype for Business clients that support modern authentication may still able to use legacy protocols against tenants where modern authentication isn't enabled, effectively bypassing tenant restrictions. Tenant restrictions may block applications that use legacy protocols if they contact login.microsoftonline.com, login.microsoft.com, or login.windows.net during authentication.

For Outlook on Windows, customers may choose to implement restrictions preventing end users from adding non-approved mail accounts to their profiles. For example, see the [Prevent adding non-default Exchange accounts](https://gpsearch.azurewebsites.net/default.aspx?ref=1) group policy setting.

## Testing

If you want to try out tenant restrictions before implementing it for your whole organization, you have two options: a host-based approach using a tool like Fiddler, or a staged rollout of proxy settings.

### Fiddler for a host-based approach

Fiddler is a free web debugging proxy that can be used to capture and modify HTTP/HTTPS traffic, including inserting HTTP headers. To configure Fiddler to test tenant restrictions, perform the following steps:

1. [Download and install Fiddler](https://www.telerik.com/fiddler).

2. Configure Fiddler to decrypt HTTPS traffic, per [Fiddler’s help documentation](https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/DecryptHTTPS).

3. Configure Fiddler to insert the *Restrict-Access-To-Tenants* and *Restrict-Access-Context* headers using custom rules:

   1. In the Fiddler Web Debugger tool, select the **Rules** menu and select **Customize Rules…** to open the CustomRules file.

   2. Add the following lines at the beginning of the `OnBeforeRequest` function. Replace \<tenant domain\> with a domain registered with your tenant (for example, `contoso.onmicrosoft.com`). Replace \<directory ID\> with your tenant's Azure AD GUID identifier.

      ```JScript.NET
      if (
          oSession.HostnameIs("login.microsoftonline.com") ||
          oSession.HostnameIs("login.microsoft.com") ||
          oSession.HostnameIs("login.windows.net")
      )
      {
          oSession.oRequest["Restrict-Access-To-Tenants"] = "<tenant domain>";
          oSession.oRequest["Restrict-Access-Context"] = "<directory ID>";
      }
      ```

      If you need to allow multiple tenants, use a comma to separate the tenant names. For example:

      `oSession.oRequest["Restrict-Access-To-Tenants"] = "contoso.onmicrosoft.com,fabrikam.onmicrosoft.com";`

4. Save and close the CustomRules file.

After you configure Fiddler, you can capture traffic by going to the **File** menu and selecting **Capture Traffic**.

### Staged rollout of proxy settings

Depending on the capabilities of your proxy infrastructure, you may be able to stage the rollout of settings to your users. Here are a couple high-level options for consideration:

1. Use PAC files to point test users to a test proxy infrastructure, while normal users continue to use the production proxy infrastructure.
2. Some proxy servers may support different configurations using groups.

For specific details, refer to your proxy server documentation.

## Next steps

- Read about [Updated Office 365 modern authentication](https://www.microsoft.com/en-us/microsoft-365/blog/2015/03/23/office-2013-modern-authentication-public-preview-announced/)
- Review the [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2)
