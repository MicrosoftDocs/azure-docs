<properties
   pageTitle="External user object attribute changes for Azure Active Directory B2B collaboration preview | Microsoft Azure"
   description="Azure Active Directory B2B supports your cross-company relationships by enabling business partners to selectively access your corporate applications"
   services="active-directory"
   documentationCenter=""
   authors="viv-liu"
   manager="cliffdi"
   editor=""
   tags=""/>

<tags
   ms.service="active-directory"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="na"
   ms.date="05/09/2016"
   ms.author="viviali"/>

# Azure AD B2B collaboration preview: External user object attribute changes

Each user in an Azure AD directory is represented by a user object. The user object in Azure AD undergoes attribute changes in various stages of the B2B collaboration invite-redeem flow. The user object representing the partner user in the directory has attributes that change at redeem time, when the partner user clicks the link in the invite email. Specifically:

- The **SignInName** and **AltSecId** attributes are populated
- The **DisplayName** attribute changes from the User Principal Name (user_fabrikam.com#EXT#@contoso.com) to the sign-in name (user@fabrikam.com)

Tracking these attributes in Azure AD can help you troubleshoot whether or not a partner user has redeemed their B2B collaboration invitation.

## Related articles
Browse our other articles on Azure AD B2B collaboration:

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [How it works](active-directory-b2b-how-it-works.md)
- [Detailed walkthrough](active-directory-b2b-detailed-walkthrough.md)
- [CSV file format reference](active-directory-b2b-references-csv-file-format.md)
- [External user token format](active-directory-b2b-references-external-user-token-format.md)
- [Current preview limitations](active-directory-b2b-current-preview-limitations.md)
- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
