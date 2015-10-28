<properties
   pageTitle="CSV file format for Azure Active Directory B2B collaboration preview | Microsoft Azure"
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
   ms.workload="identity"
   ms.date="10/27/2015"
   ms.author="viviali"/>

# CSV file format for Azure Active Directory (Azure AD) B2B collaboration preview

The preview version of Azure AD B2B collaboration requires a CSV file specifying partner user information to be uploaded through the Azure AD portal. The CSV file should contain the required labels below, and optional fields as necessary. Modify the sample CSV file (below) without changing the spelling of the labels in the first row or reordering the columns.

>[AZURE.NOTE] The first row of labels (such as Email, DisplayName...) is necessary for the CSV file to be parsed successfully. The spelling must match the fields specified below. These labels identify the content beneath them. For optional fields that aren't needed, their labels can be removed from the CSV file. The entire column can be left empty.

## Required fields: <br/>
**Email:** Email address of invited user. <br/>
**DisplayName:** Display name for invited user (typically, first and last name).<br/>
**InviteContactUsUrl:** URL to include in email invitations in case the invited user wants to contact your organization.<br/>

## Optional fields: <br/>
**InviteAppID:**  The ID for the application to use for branding the email invite and acceptance pages.<br/>
**InviteAppResources:** AppIDs to corporate applications to assign users. AppIDs are retrievable in PowerShell by calling `Get-MsolServicePrincipal | fl DisplayName, AppPrincipalId`<br/>
**InviteGroupResources:** ObjectIDs for groups to add user to. ObjectIDs are retrievable in PowerShell by calling `Get-MsolGroup | fl DisplayName, ObjectId`<br/>
**InviteReplyURL:** URL to direct an invited user after invite acceptance. This should be a company-specific URL (such as [*contoso.my.salesforce.com*](http://contoso.my.salesforce.com/)). If this optional field is not specified, the invited user is directed to the App Access Panel where they can navigate to your chosen corporate apps. The App Access Panel URL is of the form  `https://account.activedirectory.windowsazure.com/applications/default.aspx?tenantId=<TenantID>`.<br/>
**Language:** Language for invitation email and redemption experience, with English as the default when unspecified. The other 10 supported language codes are:<br/>
1. de: German<br/>
2. es: Spanish<br/>
3. fr: French<br/>
4. it: Italian<br/>
5. ja: Japanese<br/>
6. ko: Korean<br/>
7. pt-BR: Portuguese (Brazil)<br/>
8. ru: Russian<br/>
9. zh-HANS: Simplified Chinese<br/>
10. zh-HANT: Traditional Chinese<br/>

## Sample CSV file
Here is a sample CSV you can modify.

>[AZURE.NOTE] Copy and paste this into Notepad, and save it with a '.csv' file extension. Then edit this in Excel. It will be structured into a table with labels in the first row.

>[AZURE.NOTE] Add more optional fields in Excel by specifying the label and populating the column beneath it.

```
Email,DisplayName,InviteAppID,InviteReplyUrl,InviteAppResources,InviteGroupResources,InviteContactUsUrl
wharp@contoso.com,Walter Harp,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/
jsmith@contoso.com,Jeff Smith,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/
bsmith@contoso.com,Ben Smith,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/
```

## Related articles
Browse our other articles on Azure B2B collaboration

- [What is Azure AD B2B collaboration?](active-directory-b2b-what-is-azure-ad-b2b.md)
- [How it works](active-directory-b2b-how-it-works.md)
- [Detailed walkthrough](active-directory-b2b-detailed-walkthrough.md)
- [External user token format](active-directory-b2b-references-external-user-token-format.md)
- [External user object attribute changes](active-directory-b2b-references-external-user-object-attribute-changes.md)
- [Current preview limitations](active-directory-b2b-current-preview-limitations.md)
