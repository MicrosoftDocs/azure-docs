---
title: 'Azure Active Directory Domain Services: Getting Started | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: ace1ed4a-bf7f-43c1-a64a-6b51a2202473
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: maheshu

---
# Enable Azure Active Directory Domain Services (Preview)

## Task 3: Configure administrative group for Azure Active Directory Domain Services
In this configuration task, you create an administrative group in your Azure AD directory. This special administrative group is called *AAD DC Administrators*. Members of this group are granted administrative permissions on machines that are domain-joined to the Azure Active Directory Domain Services-managed domain. On domain-joined machines, this group is added to the administrators group. Additionally, members of this group can use Remote Desktop to connect remotely to domain-joined machines.

> [!NOTE]
> You do not have Domain Administrator or Enterprise Administrator permissions on the managed domain that you created by using Azure Active Directory Domain Services. On managed domains, these permissions are reserved by the service and are not made available to users within the tenant. However, you can use the special administrative group created in this configuration task to perform some privileged operations. These operations include joining computers to the domain, belonging to the administration group on domain-joined machines, and configuring Group Policy.
>

The wizard automatically creates the administrative group in your Azure AD directory. This group is called 'AAD DC Administrators'. You can configure group membership using the **Administrator group** wizard page.

1. To configure group membership, click **AAD DC Administrators**.

    ![Configure group membership](./media/getting-started/domain-services-blade-admingroup.png)

2. Click the **Add members** button to add users from your Azure AD directory to the administrator group.

3. When you are done, click **OK** to move on to the **Summary** page of the wizard.

4. On the **Summary** page of the wizard, review the configuration settings for the managed domain. You can go back to any step of the wizard to make changes, if necessary. When you are done, click **OK** to create the new managed domain.

    ![Summary](./media/getting-started/domain-services-blade-summary.png)

5. You see a notification that shows the progress of your Azure AD Domain Services deployment. Click the notification to see detailed progress for the deployment.

    ![Notification - deployment in progress](./media/getting-started/domain-services-blade-deployment-in-progress.png)

6. After a while, you can search for 'domain services' in the **All Resource** search box. The **Azure AD Domain Services** blade lists the managed domain that is being provisioned.

    ![Domain Services - provisioning state](./media/getting-started/domain-services-provisioning-state.png)

7. Click the name of the managed domain (for example, 'contoso100.com') to see more details about the domain. The **Overview** tab shows that the domain is currently being provisioned. You cannot configure the managed domain until it is fully provisioned.

    ![Domain Services - Overview tab during the provisioning state ](./media/getting-started/domain-services-provisioning-state-details.png)

8. When the managed domain is fully provisioned, you see two IP addresses on the **Properties** tab.

## Next step
[Task 4: Update the DNS settings for the Azure virtual network](active-directory-ds-getting-started-dns.md)
