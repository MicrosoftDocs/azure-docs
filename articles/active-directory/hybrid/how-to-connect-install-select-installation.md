---
title: 'Azure AD Connect: Select your installation type | Microsoft Docs'
description: This topic walks you through how to select the installation type to use for Azure AD Connect
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/12/2017
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Select which installation type to use for Azure AD Connect
Azure AD Connect has two installation types for new installation: Express and customized. This topic helps you to decide which option to use during installation.

## Express
Express is the most common option and is used by about 90% of all new installations. It was designed to provide a configuration that works for the most common customer scenarios.

It assumes:

- You have a single Active Directory forest on-premises.
- You have an enterprise administrator account you can use for the installation.
- You have less than 100,000 objects in your on-premises Active Directory.

You get:

- [Password hash synchronization](how-to-connect-password-hash-synchronization.md) from on-premises to Azure AD for single sign-on.
- A configuration that synchronizes [users, groups, contacts, and Windows 10 computers](concept-azure-ad-connect-sync-default-configuration.md).
- Synchronization of all eligible objects in all domains and all OUs.
- [Automatic upgrade](how-to-connect-install-automatic-upgrade.md) is enabled to make sure you always use the latest available version.

Options where you can still use Express:

- If you do not want to synchronize all OUs, you can still use Express and on the last page, unselect **Start the synchronization process...***. Then run the installation wizard again and change the OUs in [configuration options](how-to-connect-installation-wizard.md#customize-synchronization-options) and enable scheduled sync.
- You want to enable one of the features in Azure AD Premium, such as Password writeback. First go through express to get the initial installation completed. Then run the installation wizard again and change the [configuration options](how-to-connect-installation-wizard.md#customize-synchronization-options).

## Custom
The customized path allows many more options than express. It should be used in all cases where the configuration described in previous section for express is not representative for your organization.

Use when:

- You do not have access to an enterprise admin account in Active Directory.
- You have more than one forest or you plan to synchronize more than one forest in the future.
- You have domains in your forest not reachable from the Connect server.
- You plan to use federation or pass-through authentication for user sign-in.
- You have more than 100,000 objects and need to use a full SQL Server.
- You plan to use group-based filtering and not only domain or OU-based filtering.

## Upgrade from DirSync
If you are currently using DirSync, then follow the steps in [Upgrade from DirSync](how-to-dirsync-upgrade-get-started.md) to upgrade your existing configuration. There are two different upgrade options:

- In-place upgrade to install Connect on the same server.
- Parallel deployment to install Connect on a new server while the existing DirSync server is still operational.

## Upgrade from Azure AD Sync
If you are currently using Azure AD Sync, then you can follow the [same steps](how-to-upgrade-previous-version.md) as when you upgrade from one Connect version to a newer. There are two different upgrade options:

- In-place upgrade to install Connect on the same server.
- Swing-migration to install Connect on a new server while the existing Azure AD Sync server is still operational.

## Migrate from FIM2010 or MIM2016
If you are currently using Forefront Identity Manager 2010 or Microsoft Identity Manager 2016 with the Azure AD Connector, then your only option is a migration. Follow the steps described in [swing-migration](how-to-upgrade-previous-version.md#swing-migration). In the steps, replace any mention of Azure AD Sync with FIM2010/MIM2016.

## Next steps
Depending on the option you have selected to use, use the table of content to the left to find your article with the detailed steps.
