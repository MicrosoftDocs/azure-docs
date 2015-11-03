<properties
	pageTitle="Best practices for changing the default configuration | Microsoft Azure | Microsoft Azure"
	description="Provides best practices for changing the default configuration of Azure AD Connect sync."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2015"
	ms.author="markusvi;andkjell"/>


# Azure AD Connect sync: Best practices for changing the default configuration

The purpose of this topic is to describe supported and unsupported changes to Azure AD Connect sync.

The configuration created by Azure AD Connect works “as is” for the majority of environments that synchronize on-premises Active Directory with Azure AD. However, in some cases, it is necessary to apply some changes to a configuration to satisfy a particular need or requirement.

## Changes to the service account
Azure AD Connect sync is running under a service account created by the installation wizard. This service account holds the encryption keys to the database used by sync. It is created with a 127 characters long password and the password is set to not expire.

- It is **unsupported** to change or reset the password of the service account. Doing so will destroy the encryption keys and the service will not be able to access the database and be able to start.

## Changes to the scheduler
Azure AD Connect sync is set to synchronize identity data every 3 hours. During installation a scheduled task is created running under a service account with permissions to operate the sync server.

- It is **unsupported** to make changes to the scheduled task. The password for the service account is not known. See [changes to the service account](#changes-to-the-service-account)
- It is **unsupported** to synchronize more frequently than the default 3 hours.

## Changes to Synchronization Rules

While it is supported to apply changes to your Azure AD Connect sync configuration, you should apply them with care because Azure AD Connect sync is supposed to be as close as possible an appliance.

The following is a list of expected behaviors:

- After upgrading Azure AD Connect to a newer version, most settings will be reset back to default.
- Changes to “out-of-box” synchronization rules are lost after an upgrade has been applied.
- Deleted “out-of-box” synchronization rules are recreated during an upgrade to a newer version.
- Custom synchronization rules you have created remain unmodified when an upgrade to a newer version has been applied.



When you need to change the default configuration, do the following:

- When you need to modify an attribute flow of an “out-of-box” synchronization rule, do not change it. Instead, create a new synchronization rule with a higher precedence (lower numeric value) that contains your required attribute flow.
- Export your custom synchronization rules using the Synchronization Rules Editor. This provides you with a PowerShell script you can use to easily recreate them in the case of a disaster recovery scenario.
- If you need to change the scope or the join setting in an “out-of-box” synchronization rule, document this and reapply the change after upgrading to a newer version of Azure AD Sync.



## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

<!--Image references-->
