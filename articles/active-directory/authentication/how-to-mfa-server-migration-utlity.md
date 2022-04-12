---
title: Use the MFA Server Migration Utility to migrate to Azure AD MFA - Azure Active Directory
description: Step-by-step guidance to move from Azure MFA Server on-premises to Azure AD MFA and Azure AD user authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/07/2022

ms.author: justinha
author: BarbaraSelden
manager: martinco
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Migrate to Azure AD MFA and Azure AD user authentication

## Solution overview

The MFA Server Migration Utility facilitates synchronizing multi-factor authentication data stored in the on-premises Azure MFA Server directly to Azure MFA. 
After the authentication data is migrated to Azure AD, users can leverage cloud-based MFA seamlessly without requiring any re-registration or confirmation of methods. 
Using the Staged Migration for MFA tool, admins can target single users or groups of users for testing and controlled rollout without having to make any tenant-wide changes.

## Limitations and requirements

- This is a private preview feature being shared with you under the terms of your NDA with Microsoft. Do not share documentation, preview builds, screenshots, or other artifacts generated for the purposes of this preview externally.
- This requires a new private preview build of the MFA Server solution to be installed on your Primary MFA Server. The build makes updates to the MFA Server data file, and includes the new MFA Server Migration Utility. You should not update the WebSDK or User Portal, even if prompted. Note that installing the update does not start the migration automatically.
- The MFA Server Migration Utility copies the data from the database file onto the user objects in Azure AD. While carrying out the migration, users can be targeted for Azure MFA for testing purposes using the staged migration tool. This allows for testing without making any changes to your domain federation settings. Once migrations are complete, you must finalize your migration by making changes to your domain federation settings.
- AD FS running Windows Server 2016 or higher is required to provide MFA authentication on any AD FS relying parties, not including Azure AD and Office 365. 
- If you’re running MFA Server on an IIS Server, please reach out to mfamigration@microsoft.com before deploying the Private Preview. You may have to move certain applications to an Application Proxy.
- Staged rollout can target a maximum of 500,000 users (10 groups containing a maximum of 50,000 users each)

## Migration guide

|Phase | Steps |
|:------|:-------|
|Preparations |Identify Azure MFA Server dependencies |
||Backup Azure MFA Server datafile |
||Install MFA Server update |
||Configure MFA Migration Utility |
|Migrations |Validate and test |
||Educate users|
||Migrate user data|
||Complete user migration|
|Finalize |Migrate MFA Server dependencies|
||Disable MFA Server User portal|
||Update domain federation settings|
||Decommission Azure MFA server|


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/migration-phases.png" alt-text="MFA Server migration phases.":::

:::image type="content" border="false" source="./media/how-to-mfa-server-migration-utlity/company-settings.png" alt-text="Screenshot of Company Settings.":::

:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/user-portal.png" alt-text="Screenshot of User portal.":::


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/permissions.png" alt-text="Screenshot of permissions.":::



:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/utility.png" alt-text="Screenshot of MFA Server Migration Utility.":::


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/settings.png" alt-text="Screenshot of settings.":::


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/confirmation.png" alt-text="Screenshot of confirmation.":::


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/body.png" alt-text="Screenshot of request.":::


:::image type="content" border="true" source="./media/how-to-mfa-server-migration-utlity/get.png" alt-text="Screenshot of GET command.":::


## Rollback

## How to get help
