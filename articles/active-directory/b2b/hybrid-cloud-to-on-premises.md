---
title: Grant B2B users access to your on-premises apps - Azure AD
description: Shows how to give cloud B2B users access to on premises apps with Azure AD B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 10/10/2018

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Grant B2B users in Azure AD access to your on-premises applications

As an organization that uses Azure Active Directory (Azure AD) B2B collaboration capabilities to invite guest users from partner organizations to your Azure AD, you can now provide these B2B users access to on-premises apps. These on-premises apps can use SAML-based authentication or Integrated Windows Authentication (IWA) with Kerberos constrained delegation (KCD).

## Access to SAML apps

If your on-premises app uses SAML-based authentication, you can easily make these apps available to your Azure AD B2B collaboration users through the Azure portal.

You must do both of the following:

- Integrate the SAML app by using the non-gallery application template, as described in [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../manage-apps/configure-single-sign-on-non-gallery-applications.md). Make sure to note what you use for the **Sign-on URL** value.
-  Use Azure AD Application Proxy to publish the on-premises app, with **Azure Active Directory** configured as the authentication source. For instructions, see [Publish applications using Azure AD Application Proxy](../manage-apps/application-proxy-publish-azure-portal.md). 

   When you configure the **Internal Url** setting, use the sign-on URL that you specified in the non-gallery application template. In this way, users can access the app from outside the organization boundary. Application Proxy performs the SAML single sign-on for the on-premises app.
 
   ![Shows on-premises app settings internal URL and authentication](media/hybrid-cloud-to-on-premises/OnPremAppSettings.PNG)

## Access to IWA and KCD apps

To provide B2B users access to on-premises applications that are secured with Integrated Windows Authentication and Kerberos constrained delegation, you need the following components:

- **Authentication through Azure AD Application Proxy**. B2B users must be able to authenticate to the on-premises application. To do this, you must publish the on-premises app through the Azure AD Application Proxy. For more information, see [Get started with Application Proxy and install the connector](../manage-apps/application-proxy-enable.md) and [Publish applications using Azure AD Application Proxy](../manage-apps/application-proxy-publish-azure-portal.md).
- **Authorization via a B2B user object in the on-premises directory**. The application must be able to perform user access checks, and grant access to the correct resources. IWA and KCD require a user object in the on-premises Windows Server Active Directory to complete this authorization. As described in [How single sign-on with KCD works](../manage-apps/application-proxy-configure-single-sign-on-with-kcd.md#how-single-sign-on-with-kcd-works), Application Proxy needs this user object to impersonate the user and get a Kerberos token to the app. 

   For the B2B user scenario, there are two methods available that you can use to create the guest user objects that are required for authorization in the on-premises directory:

   - Microsoft Identity Manager (MIM) and the MIM management agent for Microsoft Graph. 
   - [A PowerShell script](#create-b2b-guest-user-objects-through-a-script-preview). Using the script is a more lightweight solution that does not require MIM. 

The following diagram provides a high-level overview of how Azure AD Application Proxy and the generation of the B2B user object in the on-premises directory work together to grant B2B users access to your on-premises IWA and KCD apps. The numbered steps are described in detail below the diagram.

![Diagram of MIM and B2B script solutions](media/hybrid-cloud-to-on-premises/MIMScriptSolution.PNG)

1.	A user from a partner organization (the Fabrikam tenant) is invited to the Contoso tenant.
2.	A guest user object is created in the Contoso tenant (for example, a user object with a UPN of guest_fabrikam.com#EXT#@contoso.onmicrosoft.com).
3.	The Fabrikam guest is imported from Contoso through MIM or through the B2B PowerShell script.
4.	A representation or “footprint” of the Fabrikam guest user object (Guest#EXT#) is created in the on-premises directory, Contoso.com, through MIM or through the B2B PowerShell script.
5.	The guest user accesses the on-premises application, app.contoso.com.
6.	The authentication request is authorized through Application Proxy, using Kerberos constrained delegation. 
7.	Because the guest user object exists locally, the authentication is successful.

### Lifecycle management policies

You can manage the on-premises B2B user objects through lifecycle management policies. For example:

- You can set up multi-factor authentication (MFA) policies for the Guest user so that MFA is used during Application Proxy authentication. For more information, see [Conditional Access for B2B collaboration users](conditional-access.md).
- Any sponsorships, access reviews, account verifications, etc. that are performed on the cloud B2B user applies to the on-premises users. For example, if the cloud user is deleted through your lifecycle management policies, the on-premises user is also deleted by MIM Sync or through Azure AD Connect sync. For more information, see [Manage guest access with Azure AD access reviews](../governance/manage-guest-access-with-access-reviews.md).

### Create B2B guest user objects through MIM

For information about how to use MIM 2016 Service Pack 1 and the MIM management agent for Microsoft Graph to create the guest user objects in the on-premises directory, see [Azure AD business-to-business (B2B) collaboration with Microsoft Identity Manager (MIM) 2016 SP1 with Azure Application Proxy](https://docs.microsoft.com/microsoft-identity-manager/microsoft-identity-manager-2016-graph-b2b-scenario).

### Create B2B guest user objects through a script (Preview)

There’s a PowerShell sample script available that you can use as a starting point to create the guest user objects in your on-premises Active Directory.

You can download the script and the Readme file from the [Download Center](https://www.microsoft.com/download/details.aspx?id=51495). Choose the **Script and Readme to pull Azure AD B2B users on-prem.zip** file.

Before you use the script, make sure that you review the prerequisites and important considerations in the associated Readme file. Also, understand that the script is made available only as a sample. Your development team or a partner must customize and review the script before you run it.

## License considerations

Make sure that you have the correct Client Access Licenses (CALs) for external guest users who access on-premises apps. For more information, see the "External Connectors" section of [Client Access Licenses and Management Licenses](https://www.microsoft.com/licensing/product-licensing/client-access-license.aspx). Consult your Microsoft representative or local reseller regarding your specific licensing needs.

## Next steps

- [Azure Active Directory B2B collaboration for hybrid organizations](hybrid-organizations.md)

- For an overview of Azure AD Connect, see [Integrate your on-premises directories with Azure Active Directory](../hybrid/whatis-hybrid-identity.md).

