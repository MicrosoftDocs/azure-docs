---
title: 'Azure AD Connect cloud provisioning new agent configuration'
description: This topic describes how to install cloud provisioning.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/05/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure AD Connect cloud provisioning new configuration

Once you have installed the agent, you need to sign-in to the Azure portal and configure provisioning.  Use the following steps to enable the agent.

## Configure provisioning
To configure provisioning, use the following steps:

1.  In the Azure AD portal, click **Azure Active Directory**
2.  Click **Azure AD Connect**
3.  Select **Manage provisioning (Preview)**
![](media/how-to-configure/manage1.png)

4.  Click on **New configuration**.
5.  On the configuration screen, the on-premises domain is pre-populated
6. Enter a **Notification email**. This email will be notified when provisioning is not healthy.  
8. Move the selector to **Enable** and click **Save**.
![](media/tutorial-single-forest/configure2.png)

## Scoping provisioning to specific users and groups
If you want to scope the agent to only synchronize specific users and groups, you can do this. You can scope using on-premises AD groups or Organizational Units. You cannot configure groups and Organizational Units within a configuration. 

1.  In the Azure AD portal, click **Azure Active Directory**
2.  Click **Azure AD Connect**
3.  Select **Manage provisioning (Preview)**
4.  Under **Configuration** click on your configuration.  
![](media/how-to-configure/scope1.png)

5.  Under **Configure**, select **All users** to change the scope of the configuration rule.
![](media/how-to-configure/scope2.png)

6. On the right, you can change the scope to include only security groups by entering the distinguished name of the group and clicking **Add**.
![](media/how-to-configure/scope3.png)

7. Or change it to include only specific OUs. Click **Done** and **Save**.
![](media/how-to-configure/scope4.png)


## Restart provisioning 
If you do not want to wait for the next scheduled run, you can trigger the provisioning run using the restart provisioning button. 
1.  In the Azure AD portal, click **Azure Active Directory**
2.  Click **Azure AD Connect**
3.  Select **Manage provisioning (Preview)**
4.  Under **Configuration** click on your configuration.  
![](media/how-to-configure/scope1.png)

5.  At the top, click **Restart provisioning**.

## Removing a configuration
If you want to delete a configuration you can do that by using the following steps.

1.  In the Azure AD portal, click **Azure Active Directory**
2.  Click **Azure AD Connect**
3.  Select **Manage provisioning (Preview)**
4.  Under **Configuration** click on your configuration.  
![](media/how-to-configure/scope1.png)

5.  At the top, click **Delete**.
![](media/how-to-configure/remove1.png)

>[!IMPORTANT]
>There is no confirmation prior to deleting a configuration so be sure that this is the action you want to take before clicking **Delete**.


## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
