---

title: Download a list of users in the Azure Active Directory portal | Microsoft Docs
description: Download user records in bulk in the Azure admin center in Azure Active Directory. 
services: active-directory 
author: curtand
ms.author: curtand
manager: mtillman
ms.date: 04/30/2019
ms.topic: conceptual
ms.service: active-directory
ms.subservice: users-groups-roles
ms.workload: identity
ms.custom: it-pro
ms.reviewer: jeffsta
ms.collection: M365-identity-device-management
---

# Download a list of users in the Azure Active Directory portal

Azure Active Directory (Azure AD) supports bulk user create and delete operations, and supports downloading lists of users, groups, and group members.

## To download a list of users

1. Sign in to your Azure AD organization with a User administrator account in the organization.
1. In Azure AD, select **Users** > **Bulk create**.
1. On the **Bulk create user** page, select **Download** to receive and edit a valid formatted CSV file of user properties.
1. When you finish editing the CSV file or if you have one of your own ready to upload, select the file under **Upload your CSV file** to be validated. The file contents are validated and you must fix eny errors before you can submit the job.
1. When your file passes validation, select **Submit** to start the Azure batch job that add the new user information. Job notifications are generated to apprise you of progress.

## Troubleshoot bulk user addition

The causes of your troubles are many. Let us make them few. Specific actions can address the causes of many  potential error states during the list download process.

Validation error Message 1
guidance 1

Batch job failure Message 2
Guidance 2

## Next steps

Bulk delete users
Download list of users
Download list of groups
Download list of group members
