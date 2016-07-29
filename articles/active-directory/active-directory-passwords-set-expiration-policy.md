<properties
	pageTitle="Set password expiration policies in Azure Active Directory | Microsoft Azure"
	description="Learn how to check expiration policies and change user password expiration either singly or in bulk for Azure Active directory passwords"
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
	ms.date="07/12/2016"
	ms.author="curtand"/>


# Set password expiration policies in Azure Active Directory

> [AZURE.IMPORTANT] **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).

As a global administrator for a Microsoft cloud service, you can use the Microsoft Azure Active Directory Module for Windows PowerShell to set up user passwords not to expire. You can also use Windows PowerShell cmdlets to remove the never-expires configuration, or to see which user passwords are set up not to expire. This article provides help for cloud services, such as Microsoft Intune and Office 365, which rely on Microsoft Azure Active Directory for identity and directory services.

  > [AZURE.NOTE] Only passwords for user accounts that are not synchronized through directory synchronization can be configured not to expire. For more information about directory synchronization, see the list of topics in [Directory synchronization roadmap](https://msdn.microsoft.com/library/azure/hh967642.aspx).

To use Windows PowerShell cmdlets, you first must install them.

## What do you want to do?

- [How to check expiration policy for a password](#how-to-check-expiration-policy-for-a-password)

- [Set a password to expire](#set-a-password-to-expire)

- [Set a password so that it will not expire](#set-a-password-to-never-expire)

## How to check expiration policy for a password

1.  Connect to Windows PowerShell using your company administrator credentials.

2.  Do one of the following:

	- To see whether a single user’s password is set to never expire, run the following cmdlet by using the user principal name (UPN) (for example, aprilr@contoso.onmicrosoft.com) or the user ID of the user you want to check: `Get-MSOLUser -UserPrincipalName <user ID> | Select PasswordNeverExpires`

	- To see the "Password never expires" setting for all users, run the following cmdlet: `Get-MSOLUser | Select UserPrincipalName, PasswordNeverExpires`

## Set a password to expire

1.  Connect to Windows PowerShell using your company administrator credentials.

2.  Do one of the following:

	- To set the password of one user so that the password will expire, run the following cmdlet by using the user principal name (UPN) or the user ID of the user: `Set-MsolUser -UserPrincipalName <user ID> -PasswordNeverExpires \$false`

	- To set the passwords of all users in the organization so that they will expire, use the following cmdlet: `Get-MSOLUser | Set-MsolUser -PasswordNeverExpires \$false`

## Set a password to never expire

1. Connect to Windows PowerShell using your company administrator credentials.

2.  Do one of the following:

	- To set the password of one user to never expire, run the following cmdlet by using the user principal name (UPN) or the user ID of the user: `Set-MsolUser -UserPrincipalName <user ID> -PasswordNeverExpires \$true`

	- To set the passwords of all the users in an organization to never expire, run the following cmdlet: `Get-MSOLUser | Set-MsolUser -PasswordNeverExpires \$true`

## Next steps

* **Are you here because you're having problems signing in?** If so, [here's how you can change and reset your own password](active-directory-passwords-update-your-own-password.md).
