<properties
   pageTitle="Current preview limitations for Azure Active Directory B2B collaboration | Microsoft Azure"
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
   ms.workload="identity"
   ms.date="05/09/2016"
   ms.author="viviali"/>

# Azure AD B2B collaboration preview: Current preview limitations

- Multi-factor authentication (MFA) not supported on external users. For example, if Contoso has MFA, but Partner Org does not, then Partner Org users can't be granted MFA through B2B collaboration.
- Invites are possible only via CSV; individual invites and API access are not supported.
- Only Azure AD Global Administrators can upload .csv files.
- Invitations to consumer email addresses (such as hotmail.com, Gmail.com, or comcast.net) are currently not supported.
- External user access to on-premises applications not tested.
- External users are not automatically cleaned up when the actual user is deleted from their directory.
- Invitations to distribution lists are not supported.
- Maximum of 2,000 records can be uploaded via CSV.

## Related articles
Browse our other articles on Azure AD B2B collaboration:

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [How it works](active-directory-b2b-how-it-works.md)
- [Detailed walkthrough](active-directory-b2b-detailed-walkthrough.md)
- [CSV file format reference](active-directory-b2b-references-csv-file-format.md)
- [External user token format](active-directory-b2b-references-external-user-token-format.md)
- [External user object attribute changes](active-directory-b2b-references-external-user-object-attribute-changes.md)
- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
