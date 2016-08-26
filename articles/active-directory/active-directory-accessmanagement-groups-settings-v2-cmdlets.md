<properties
	pageTitle="Azure Active Directory PowerShell preview cmdlets for group management in Azure AD | Microsoft Azure"
	description="This page provides PowerShell examples to help you manage your groups in Azure Active Directory"
    keywords="Azure AD, Azure Active Directory, PowerShell, Groups, Group management"
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/11/2016"
	ms.author="curtand"/>

# Azure Active Directory preview cmdlets for group management

The following document will provide you with examples of how to use PowerShell to manage your groups in Azure Active Directory (Azure AD).  It also provides information on how to get set up with the Azure AD PowerShell preview module. First, you must [download the Azure AD PowerShell module](http://go.microsoft.com/fwlink/p/?linkid=236297).

## Installing the Azure AD PowerShell module

To install the AzureAD PowerShell preview module, use the following commands:

	PS C:\Windows\system32> install-module azureadpreview

To verify that the preview module was installed, use the following command:

	PS C:\Windows\system32> get-module azureadpreview

	ModuleType Version    Name                                ExportedCommands
	---------- -------    ----                                ----------------
	Binary     1.1.146.0  azureadpreview                      {Add-AzureADAdministrati...}

Now you can start using the cmdlets in the module. For a full description of the cmdlets in the AzureAD Preview module, please refer to the [online reference documentation](https://msdn.microsoft.com/library/azure/mt757216.aspx).

## Connecting to the directory
Before you can start managing groups using Azure AD PowerShell preview cmdlets, you must connect your PowerShell session to the directory you want to manage. To do this, use the following command:

	PS C:\Windows\system32> Connect-AzureAD -Force

The cmdlet will prompt you for the credentials you want to use to access your directory. In this example, we are using karen@drumkit.onmicrosoft.com to access the demonstration directory. The cmdlet will return a confirmation to show the session was connected successfully to your directory:

	Account                       Environment Tenant
	-------                       ----------- ------
	Karen@drumkit.onmicrosoft.com AzureCloud  85b5ff1e-0402-400c-9e3c-0f…

Now you can start using the AzureAD preview cmdlets to manage groups in your directory.

## Retrieving groups
To retrieve existing groups from your directory you can use the Get-AzureADGroups cmdlet. To retrieve all groups in the directory, use the cmdlet without parameters:

	PS C:\Windows\system32> get-azureadgroup

The cmdlet will return all groups in the connected directory.

You can use the -objectID parameter to retrieve a specific group for which you specify the group’s objectID:

	PS C:\Windows\system32> get-azureadgroup -ObjectId e29bae11-4ac0-450c-bc37-6dae8f3da61b

The cmdlet will now return the group whose objectID matches the value of the parameter you entered:

	DeletionTimeStamp            :
	ObjectId                     : e29bae11-4ac0-450c-bc37-6dae8f3da61b
	ObjectType                   : Group
	Description                  :
	DirSyncEnabled               :
	DisplayName                  : Pacific NW Support
	LastDirSyncTime              :
	Mail                         :
	MailEnabled                  : False
	MailNickName                 : 9bb4139b-60a1-434a-8c0d-7c1f8eee2df9
	OnPremisesSecurityIdentifier :
	ProvisioningErrors           : {}
	ProxyAddresses               : {}
	SecurityEnabled              : True

You can search for a specific group using the -filter parameter. This parameter takes an ODATA filter clause and returns all groups that match the filter, as in the following example:

	PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"


	DeletionTimeStamp            :
	ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
	ObjectType                   : Group
	Description                  : Intune Administrators
	DirSyncEnabled               :
	DisplayName                  : Intune Administrators
	LastDirSyncTime              :
	Mail                         :
	MailEnabled                  : False
	MailNickName                 : 4dd067a0-6515-4f23-968a-cc2ffc2eff5c
	OnPremisesSecurityIdentifier :
	ProvisioningErrors           : {}
	ProxyAddresses               : {}
	SecurityEnabled              : True

Note that the AzureAD PowerShell cmdlets implement the OData query standard, more information can be found [here](https://msdn.microsoft.com/library/gg309461.aspx#BKMK_filter).

## Creating groups
To create a new group in your directory, use the New-AzureADGroup cmdlet. This cmdlet creates a new security group called “Marketing":

	PS C:\Windows\system32> New-AzureADGroup -Description "Marketing" -DisplayName "Marketing" -MailEnabled $false -SecurityEnabled $true -MailNickName "Marketing"

## Updating groups
To update an existing group, use the Set-AzureADGroup cmdlet. In this example, we’re changing the DisplayName property of the group “Intune Administrators.” First, we’re finding the group using the Get-AzureADGroup cmdlet and filter using the DisplayName attribute:

	PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"


	DeletionTimeStamp            :
	ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
	ObjectType                   : Group
	Description                  : Intune Administrators
	DirSyncEnabled               :
	DisplayName                  : Intune Administrators
	LastDirSyncTime              :
	Mail                         :
	MailEnabled                  : False
	MailNickName                 : 4dd067a0-6515-4f23-968a-cc2ffc2eff5c
	OnPremisesSecurityIdentifier :
	ProvisioningErrors           : {}
	ProxyAddresses               : {}
	SecurityEnabled              : True

Next, we’re changing the Description property to the new value “Intune Device Administrators”:

	PS C:\Windows\system32> Set-AzureADGroup -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -Description "Intune Device Administrators"

Now if we find the group again, we see the Description property is updated to reflect the new value:

	PS C:\Windows\system32> Get-AzureADGroup -Filter "DisplayName eq 'Intune Administrators'"


	DeletionTimeStamp            :
	ObjectId                     : 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df
	ObjectType                   : Group
	Description                  : Intune Device Administrators
	DirSyncEnabled               :
	DisplayName                  : Intune Administrators
	LastDirSyncTime              :
	Mail                         :
	MailEnabled                  : False
	MailNickName                 : 4dd067a0-6515-4f23-968a-cc2ffc2eff5c
	OnPremisesSecurityIdentifier :
	ProvisioningErrors           : {}
	ProxyAddresses               : {}
	SecurityEnabled              : True

## Deleting groups
To delete groups from your directory, use the Remove-AzureADGroup cmdlet as follows:

	PS C:\Windows\system32> Remove-AzureADGroup -ObjectId b11ca53e-07cc-455d-9a89-1fe3ab24566b

## Managing members of groups
If you need to add new members to a group, use the Add-AzureADGroupMember cmdlet. This command adds a member to the Intune Administrators group we used in the previous example:

	PS C:\Windows\system32> Add-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -RefObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea

The -ObjectId parameter is the ObjectID of the group to which we want to add a member, and the -RefObjectId is the ObjectID of the user we want to add as a member to the group.

To get the existing members of a group, use the Get-AzureADGroupMember cmdlet, as in this example:

	PS C:\Windows\system32> Get-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df

	DeletionTimeStamp ObjectId                             ObjectType
	----------------- --------                             ----------
                  		72cd4bbd-2594-40a2-935c-016f3cfeeeea User
                  		8120cc36-64b4-4080-a9e8-23aa98e8b34f User

To remove the member we previously added to the group, use the Remove-AzureADGroupMember cmdlet, as is shown here:

	PS C:\Windows\system32> Remove-AzureADGroupMember -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -MemberId 72cd4bbd-2594-40a2-935c-016f3cfeeeea

To verify the group membership(s) of a user, use the Select-AzureADGroupIdsUserIsMemberOf cmdlet. This cmdlet takes as its parameters the ObjectId of the user for which to check the group memberships, and a list of groups for which to check the memberships. The list of groups must be provided in the form of a complex variable of type “Microsoft.Open.AzureAD.Model.GroupIdsForMembershipCheck”, so we first must create a variable with that type:

	PS C:\Windows\system32> $g = new-object Microsoft.Open.AzureAD.Model.GroupIdsForMembershipCheck

Next, we provide values for the groupIds to check in the attribute “GroupIds” of this complex variable:

	PS C:\Windows\system32> $g.GroupIds = "b11ca53e-07cc-455d-9a89-1fe3ab24566b", "31f1ff6c-d48c-4f8a-b2e1-abca7fd399df"

Now, if we want to check the group memberships of a user with ObjectID 72cd4bbd-2594-40a2-935c-016f3cfeeeea against the groups in $g, we should use:

	PS C:\Windows\system32> Select-AzureADGroupIdsUserIsMemberOf -ObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea -GroupIdsForMembershipCheck $g

	OdataMetadata 																								Value
	-------------      																							-----
	https://graph.windows.net/85b5ff1e-0402-400c-9e3c-0f9e965325d1/$metadata#Collection(Edm.String) 			{31f1ff6c-d48c-4f8a-b2e1-abca7fd399df}


The value returned is a list of groups of which this user is a member. You can also apply this method to check Contacts, Groups or Service Principals membership for a given list of groups, using Select-AzureADGroupIdsContactIsMemberOf, Select-AzureADGroupIdsGroupIsMemberOf or Select-AzureADGroupIdsServicePrincipalIsMemberOf

## Managing owners of groups
To add owners to a group, use the Add-AzureADGroupOwner cmdlet:

	PS C:\Windows\system32> Add-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -RefObjectId 72cd4bbd-2594-40a2-935c-016f3cfeeeea

The -ObjectId parameter is the ObjectID of the group to which we want to add an owner, and the -RefObjectId is the ObjectID of the user we want to add as an owner of the group.

To retrieve the owners of a group, use the Get-AzureADGroupOwner:

	PS C:\Windows\system32> Get-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df

The cmdlet will return the list of owners for the specified group:

	DeletionTimeStamp ObjectId                             ObjectType
	----------------- --------                             ----------
                  		e831b3fd-77c9-49c7-9fca-de43e109ef67 User

If you want to remove an owner from a group, use Remove-AzureADGroupOwner:

	PS C:\Windows\system32> remove-AzureADGroupOwner -ObjectId 31f1ff6c-d48c-4f8a-b2e1-abca7fd399df -OwnerId e831b3fd-77c9-49c7-9fca-de43e109ef67

## Next steps

You can find more Azure Active Directory PowerShell documentation at [Azure Active Directory Cmdlets](http://go.microsoft.com/fwlink/p/?LinkId=808260).

Additional instruction from Microsoft program manager Rob de Jong is available at [Rob's Groups Blog](http://robsgroupsblog.com/blog/configuring-settings-for-office-365-groups-in-azure-ad).

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
