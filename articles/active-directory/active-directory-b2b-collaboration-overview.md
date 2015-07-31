<properties
   pageTitle="Azure Active Directory business-to-business (B2B) collaboration"
   description="Article description that will be displayed on landing pages and in most search results"
   services="active-directory"
   documentationCenter=""
   authors="curtand"
   manager="stevepo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang=""
   ms.topic="article"
   ms.tgt_pltfrm=""
   ms.workload="identity"
   ms.date="07/31/2015"
   ms.author="curtand"/>

#Azure Active Directory business-to-business (B2B) collaboration

Azure AD B2B lets you use Azure Active Directory to enable your business partners to access your corporate applications in a simpler and more secure manner.

-   Your business partners use their own login credentials, which frees you from managing an external partner directory and needing to remove access when users leave the partner organization.
-   Azure AD allows you to manage trust relationships in the cloud, freeing you from the complexity of managing per-partner
    federation relationships.
-   You manage access independently of your business partner's account lifecycle. This means, for example, that you can revoke access to your apps without having to ask the IT department of your business partner to do anything.
-   Azure AD allows you to setup business-to-business collaboration with partners of any size, whether they already Azure AD accounts or not.

##Capabilities

Azure AD B2B allows a company administrator to invite and authorize a set of external users by uploading a comma-separated values (CSV) file to the B2B portal. The portal will send email invitations to these external users. The invited user will either sign in to an existing work account with Microsoft (managed in Azure AD), or get a new work account in Azure AD. Once signed in, the user will be redirected to the app that was shared with them.

##CSV File Format

The CSV file follows the format below.

**Email:** Email address for invited user.<br/>
**DisplayName:** Display name for invited user (typically, first and last name).<br/>
**InviteAppID:** Application to use for branding email invite and acceptance pages.<br/>
**InviteReplyURL:** URL to direct invited user to after invite acceptance. This should be a company-specific URL (such as [*contoso.my.salesforce.com*](http://contoso.my.salesforce.com/)).<br/>
**InviteAppResources:** AppIDs for applications to assign users to. AppIDs are retrievable by calling `Get-MsolServicePrincipal | fl DisplayName, AppPrincipalId.\`<br/>
**InviteGroupResources:** ObjectIDs for groups to add user to. ObjectIDs are retrievable by calling `Get-MsolGroup | fl DisplayName, ObjectId.\`<br/>
**InviteContactUsUrl:** "Contact Us" URL to include in email invitations should the invited user want to contact your organization.

##Sample CSV file
Here is a sample CSV you can modify for your purposes. Save it to any file name you prefer, but ensure that it has a '.csv' file extension.

```Email,DisplayName,InviteAppID,InviteReplyUrl,InviteAppResources,InviteGroupResources,InviteContactUsUrl<br/>
wharp@contoso.com,Walter Harp,0baa9d19-06a5-47da-af74-479796d05109,http://azure.microsoft.com/services/active-directory/,6d97ec32-bf04-458b-aab3-6e6c5a324264,8680bdac-f610-4086-ae1d-4f5af1c0c9b5,http://azure.microsoft.com/services/active-directory/<br/>
jsmith@contoso.com,Jeff Smith,0baa9d19-06a5-47da-af74-479796d05109,http://azure.microsoft.com/services/active-directory/,6d97ec32-bf04-458b-aab3-6e6c5a324264,8680bdac-f610-4086-ae1d-4f5af1c0c9b5,http://azure.microsoft.com/services/active-directory/<br/>
bsmith@contoso.com,Ben Smith,0baa9d19-06a5-47da-af74-479796d05109,http://azure.microsoft.com/services/active-directory/,6d97ec32-bf04-458b-aab3-6e6c5a324264,8680bdac-f610-4086-ae1d-4f5af1c0c9b5,http://azure.microsoft.com/services/active-directory/
```

##Known Limitations

- For users who don't yet have an account in Azure AD, new accounts will be provisioned in a US datacenter only.
- Neither group assignment nor app assignment is currently working.
- A maximum of 2,000 records can be uploaded via CSV.
- Logging in after creating a new work account in Azure AD may fail occasionally, but will work on a retry (hitting F5 at the invite acceptance screen).
- Invitations to consumer email addresses (for example, gmail or [*comcast.net*](http://comcast.net/)) are not currently supported.
