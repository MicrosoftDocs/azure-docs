---
title: Instructions for data retrieval from Azure Active Directory Domain Services | Microsoft Docs
description: Learn how to retrieve data from Azure Active Directory Domain Services (Azure AD DS).
services: active-directory-ds
author: justinha
manager: karenhoran

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 04/13/2022
ms.author: justinha
---

# Azure AD DS instructions for data retrieval

This document describes how to retrieve data from Azure Active Directory Domain Services (Azure AD DS).

[!INCLUDE [active-directory-app-provisioning.md](../../../includes/gdpr-intro-sentence.md)]

## Use Azure Active Directory to create, read, update, and delete user objects

To retrieve the email addresses for all of your users that are configured in Azure AD Connect Health to receive alerts, use the following steps.

1.	Start at the Azure Active Directory Connect health blade and select **Sync Services** from the left-hand navigation bar.
 ![Sync Services](./media/how-to-connect-health-data-retrieval/retrieve1.png)

2.	Click on the **Alerts** tile.</br>
 ![Alert](./media/how-to-connect-health-data-retrieval/retrieve3.png)

3.	Click on **Notification Settings**.
 ![Notification](./media/how-to-connect-health-data-retrieval/retrieve4.png)

4.	On the **Notification Setting** blade, you will find the list of email addresses that have been enabled as recipients for health Alert notifications.
 ![Emails](./media/how-to-connect-health-data-retrieval/retrieve5a.png)
 
## Use RSAT tools to connect to an Azure AD DS managed domain and view users

Sign in to the an administrative workstation with a user account that's a member of the *AAD DC Administrators* group. The following steps require installation of [Remote Server Administration Tools (RSAT)](tutorial-create-management-vm.md#install-active-directory-administrative-tools).

1. From the **Start** menu, select **Windows Administrative Tools**. The AD administrative tools installed in the previous step are listed.

    ![List of Administrative Tools installed on the server](./media/tutorial-create-management-vm/list-admin-tools.png)

1. Select **Active Directory Administrative Center**.
1. To explore the managed domain, choose the domain name in the left pane, such as *aaddscontoso*. Two containers named *AADDC Computers* and *AADDC Users* are at the top of the list.

    ![List the available containers part of the managed domain](./media/tutorial-create-management-vm/active-directory-administrative-center.png)

1. To see the users and groups that belong to the managed domain, select the **AADDC Users** container. The user accounts and groups from your Azure AD tenant are listed in this container.

    In the following example output, a user account named *Contoso Admin* and a group for *AAD DC Administrators* are shown in this container.

    ![View the list of Azure AD DS domain users in the Active Directory Administrative Center](./media/tutorial-create-management-vm/list-azure-ad-users.png)

1. To see the computers that are joined to the managed domain, select the **AADDC Computers** container. An entry for the current virtual machine, such as *myVM*, is listed. Computer accounts for all devices that are joined to the managed domain are stored in this *AADDC Computers* container.

You can also use the *Active Directory Module for Windows PowerShell*, installed as part of the administrative tools, to manage common actions in your managed domain.

## Next Steps
* [Azure AD DS Overview](overview.md)
