<properties
   pageTitle="External user object attribute changes for Azure Active Directory B2B collaboration preview | Microsoft Azure"
   description="Azure Active Directory B2B supports your cross-company relationships by enabling business partners to selectively access your corporate applications"
   services="active-directory"
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
   ms.date="10/27/2015"
   ms.author="viviali"/>

# External user object attribute changes for Azure Active Directory B2B collaboration preview
The user object in Azure AD undergoes attribute changes in various stages of the B2B collaboration invite-redeem flow. The user object representing the partner user in the directory has attributes that change at redeem time, when the partner user clicks the link in the invite email. Specifically, the attributes

- SignInName and AltSecId are populated
- DisplayName changes from the User Principle Name (user_fabrikam.com#EXT#@contoso.com) to the sign in name (user@fabrikam.com)

Tracking these attributes in Azure AD can identify whether or not a partner user has redeemed their B2B collaboration invitation.

## Related articles
Browse our other articles on Azure B2B collaboration

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [How it works](active-directory-b2b-how-it-works.md)
- [Detailed walkthrough](active-directory-b2b-detailed-walkthrough.md)
- [CSV file format reference](active-directory-b2b-references-csv-file-format.md)
- [External user token format](active-directory-b2b-references-external-user-token-format.md)
- [Current preview limitations](active-directory-b2b-current-preview-limitations.md)
