---
title: What is hybrid identity with Azure Active Directory?
description: Hybrid identity is having a common user identity for authentication and authorization both on-premises and in the cloud. 
keywords: introduction to Azure AD Connect, Azure AD Connect overview, what is Azure AD Connect, install active directory
services: active-directory
author: billmath
manager: daveba
ms.assetid: 59bd209e-30d7-4a89-ae7a-e415969825ea
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 05/17/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# What is hybrid identity with Azure Active Directory?

Today, businesses, and corporations are becoming more and more a mixture of on-premises and cloud applications.  Users require access to those applications both on-premises and in the cloud. Managing users both on-premises and in the cloud poses challenging scenarios. 

Microsoft’s identity solutions span on-premises and cloud-based capabilities.  These solutions create a common user identity for authentication and authorization to all resources, regardless of location. We call this **hybrid identity**.

With hybrid identity to Azure AD and hybrid identity management these scenarios become possible.

To achieve hybrid identity with Azure AD, one of three authentication methods can be used, depending on your scenarios.   The three methods are: 

- **[Password hash synchronization (PHS)](whatis-phs.md)**  
- **[Pass-through authentication (PTA)](how-to-connect-pta.md)**  
- **[Federation (AD FS)](whatis-fed.md)** 

These authentication methods also provide [single-sign on](how-to-connect-sso.md) capabilities.  Single-sign on automatically signs your users in when they are on their corporate devices, connected to your corporate network.

For additional information, see [Choose the right authentication method for your Azure Active Directory hybrid identity solution](https://docs.microsoft.com/azure/security/azure-ad-choose-authn). 

## Common scenarios and recommendations 

Here are some common hybrid identity and access management scenarios with recommendations as to which hybrid identity option (or options) might be appropriate for each. 

|I need to:|PHS and SSO<sup>1</sup>| PTA and SSO<sup>2</sup> | AD FS<sup>3</sup>| 
|-----|-----|-----|-----| 
|Sync new user, contact, and group accounts created in my on-premises Active Directory to the cloud automatically.|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| ![Recommended](./media/whatis-hybrid-identity/ic195031.png) |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Set up my tenant for Office 365 hybrid scenarios.|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| ![Recommended](./media/whatis-hybrid-identity/ic195031.png) |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Enable my users to sign in and access cloud services using their on-premises password.|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| ![Recommended](./media/whatis-hybrid-identity/ic195031.png) |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Implement single sign-on using corporate credentials.|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| ![Recommended](./media/whatis-hybrid-identity/ic195031.png) |![Recommended](./media/whatis-hybrid-identity/ic195031.png)|  
|Ensure no password hashes are stored in the cloud.| |![Recommended](./media/whatis-hybrid-identity/ic195031.png)|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Enable cloud-based multi-factor authentication solutions.|![Recommended](./media/whatis-hybrid-identity/ic195031.png)|![Recommended](./media/whatis-hybrid-identity/ic195031.png)|![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Enable on-premises multi-factor authentication solutions.| | |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Support smartcard authentication for my users.<sup>4</sup>| | |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 
|Display password expiry notifications in the Office Portal and on the Windows 10 desktop.| | |![Recommended](./media/whatis-hybrid-identity/ic195031.png)| 

> <sup>1</sup> Password hash synchronization with single sign-on. 
> 
> <sup>2</sup> Pass-through authentication and single sign-on.  
> 
> <sup>3</sup> Federated single sign-on with AD FS.  
>  
> <sup>4</sup> AD FS can be integrated with your enterprise PKI to allow sign-in using certificates. These certificates can be soft-certificates deployed via trusted provisioning channels such as MDM or GPO or smartcard certificates (including PIV/CAC cards) or Hello for Business (cert-trust). For more information about smartcard authentication support, see [this blog](https://blogs.msdn.microsoft.com/samueld/2016/07/19/adfs-certauth-aad-o365/). 
> 

## License requirements for using Azure AD Connect

[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-free-license.md)]

## Next Steps 

- [What is Azure AD Connect and Connect Health?](whatis-azure-ad-connect.md) 
- [What is password hash synchronization (PHS)?](whatis-phs.md) 
- [What is pass-through authentication (PTA)?](how-to-connect-pta.md) 
- [What is federation?](whatis-fed.md) 
- [What is single-sign on?](how-to-connect-sso.md) 

