<properties
   pageTitle="Azure Active Directory business-to-business (B2B) collaboration"
   description="Azure Active Directory B2B collaboration enables business partners to access your corporate applications"
   services="active-directory"
   documentationCenter=""
   authors="curtand"
   manager="msStevenPo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/15/2015"
   ms.author="curtand"/>

# Azure Active Directory business-to-business (B2B) collaboration

Azure AD B2B lets you use Azure Active Directory (AD) to enable your business partners to access your corporate applications in a simpler and more secure manner.

-   Your business partners use their own sign-in credentials, which frees you from managing an external partner directory, and from needing to remove access when users leave the partner organization.
-   Azure AD allows you to manage trust relationships in the cloud, freeing you from the complexity of managing per-partner
    federation relationships.
-   You manage access independently of your business partner's account lifecycle. This means, for example, that you can revoke access to your apps without having to ask the IT department of your business partner to do anything.
-   Azure AD allows you to set up business-to-business collaboration with partners of any size, whether they already have Azure AD accounts or not.

## Capabilities

Azure AD B2B collaboration allows a company administrator to invite and authorize a set of external users by uploading a comma-separated values (CSV) file to the B2B collaboration portal. The portal will send email invitations to these external users. The invited user will either sign in to an existing work account with Microsoft (managed in Azure AD), or get a new work account in Azure AD. Once signed in, the user will be redirected to the app that was shared with them.

## CSV File Format

The CSV file follows the format below.

| Item | Description |
|-------|------------|
| Email | Email address for invited user. |
| DisplayName | Display name for invited user (typically, first and last name). |
| InviteAppID | The ID for the application to use for branding the email invite and acceptance pages. |
| InviteReplyURL | URL to direct invited user to after invite acceptance. This should be a company-specific URL (such as [*contoso.my.salesforce.com*](http://contoso.my.salesforce.com/)). |
| InviteAppResources | AppIDs to which applications can assign users. AppIDs are retrievable by calling `Get-MsolServicePrincipal fl DisplayName, AppPrincipalId.\` |
| InviteGroupResources | ObjectIDs for groups to add user to. ObjectIDs are retrievable by calling `Get-MsolGroup fl DisplayName, ObjectId.\` |
| InviteContactUsUrl | "Contact Us" URL to include in email invitations in case the invited user wants to contact your organization. |

## Sample CSV file
Here is a sample CSV you can modify for your purposes. Save it to any file name you prefer, but ensure that it has a '.csv' file extension.

```Email,DisplayName,InviteAppID,InviteReplyUrl,InviteAppResources,InviteGroupResources,InviteContactUsUrl<br/>
`wharp@contoso.com,Walter Harp,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/`<br/>
`jsmith@contoso.com,Jeff Smith,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/`<br/>
`bsmith@contoso.com,Ben Smith,cd3ed3de-93ee-400b-8b19-b61ef44a0f29,http://azure.microsoft.com/services/active-directory/,,,http://azure.microsoft.com/services/active-directory/``
```

## Known Limitations

- A maximum of 2,000 records can be uploaded via CSV.
- Logging in after creating a new work account in Azure AD could fail the first time, but will work on a retry (by pressing F5 at the invite acceptance screen).
- Invitations to consumer email addresses (for example, gmail or [*comcast.net*](http://comcast.net/)) are not currently supported.
