<properties
   pageTitle="Azure AD Connect sync: Connector Version Release History | Microsoft Azure"
   description="This topic lists all releases of the Connectors for Forefront Identity Manager (FIM) and Microsoft Identity Manager (MIM)"
   services="active-directory"
   documentationCenter=""
   authors="AndKjell"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="05/24/2016"
   ms.author="andkjell"/>

# Azure AD Connect sync: Connector Version Release History
The Connectors for Forefront Identity Manager (FIM) and Microsoft Identity Manager (MIM) are updated frequently.

This article is designed to help you keep track of the versions that have been released, and to understand whether you need to update to the newest version or not.

Related links:

- [Download Latest Connectors](http://go.microsoft.com/fwlink/?LinkId=717495)
- [Generic LDAP Connector](active-directory-aadconnectsync-connector-genericldap.md) reference documentation
- [Generic SQL Connector](active-directory-aadconnectsync-connector-genericsql.md) reference documentation
- [Web Services Connector](http://go.microsoft.com/fwlink/?LinkID=226245) reference documentation
- [PowerShell Connector](active-directory-aadconnectsync-connector-powershell.md) reference documentation
- [Lotus Domino Connector](active-directory-aadconnectsync-connector-domino.md) reference documentation

## 1.1.117.0
Released: 2016 March

**New Connector**  
Initial release of the [Generic SQL Connector](active-directory-aadconnectsync-connector-genericsql.md).

**New features:**

- Generic LDAP Connector:
    - Added support for delta import with Isode.
- Web Services Connector:
    - Updated the csEntryChangeResult activity and setImportErrorCode activity to allow object level errors to be returned back to the sync engine.
    - Updated the SAP6 and SAP6User templates to use the new object level error functionality.
- Lotus Domino Connector:
    - When exporting you need one certifier per address book. You can now use the same password for all certifiers to make the management easier.

**Fixed issues:**

- Generic LDAP Connector:
    - For IBM Tivoli DS, some reference attributes were not detected correctly.
    - For Open LDAP during a delta import, whitespaces at the beginning and end of strings were truncated.
    - For Novell and NetIQ, an export which both moved an object between OUs/containers and at the same time renamed the object failed.
- Web Services Connector:
    - If the web service had multiple end-points for same binding, then the Connector did not correctly discover these end-points.
- Lotus Domino Connector:
    - An export of the fullName attribute to a mail-in database did not work.
    - An export which both added and removed member from a group only exported the added members.
    - If a Notes Document is invalid (the attribute isValid set to false) then the Connector fails.

## Older releases
Before March 2016, the Connectors were released as support topics.

**Generic LDAP**

- [KB3078617](https://support.microsoft.com/kb/3078617) - 1.0.0597, 2015 September
- [KB3044896](https://support.microsoft.com/kb/3044896) - 1.0.0549, 2015 March
- [KB3031009](https://support.microsoft.com/kb/3031009) - 1.0.0534, 2015 January
- [KB3008177](https://support.microsoft.com/kb/3008177) - 1.0.0419, 2014 September
- [KB2936070](https://support.microsoft.com/kb/2936070) - 4.3.1082, 2014 March

**WebServices**

- [KB3008178](https://support.microsoft.com/kb/3008178) - 1.0.0419, 2014 September

**PowerShell**

- [KB3008179](https://support.microsoft.com/kb/3008179) - 1.0.0419, 2014 September

**Lotus Domino**

- [KB3096533](https://support.microsoft.com/kb/3096533) - 1.0.0597, 2015 September
- [KB3044895](https://support.microsoft.com/kb/3044895) - 1.0.0549, 2015 March
- [KB2977286](https://support.microsoft.com/kb/2977286) - 5.3.0712, 2014 August
- [KB2932635](https://support.microsoft.com/kb/2932635) - 5.3.1003, 2014 February  
- [KB2899874](https://support.microsoft.com/kb/2899874) - 5.3.0721, 2013 October
- [KB2875551](https://support.microsoft.com/kb/2875551) - 5.3.0534, 2013 August

## Next steps
Learn more about the [Azure AD Connect sync](active-directory-aadconnectsync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
