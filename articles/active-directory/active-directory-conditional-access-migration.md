---
title: Migrate Azure Active Directory conditional access policies | Microsoft Docs
description: Migrate Azure Active Directory conditional access policies.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/27/2017
ms.author: markvi
ms.reviewer: calebb

---
# Migrate Azure Active Directory conditional access policies 

If you have conditional access policies in the Azure classic portal configured, you should migrate them to the Azure portal because:

- The policies you have configured in the Azure classic portal continue to work until you disable or migrate them. 

- A user who is in an Azure classic portal policy and an Azure portal policy needs to meet the requirements in both policies.

- If you don't migrate your existing policies, you are not be able to implement policies that are granting access.

This topic provides you with information about the related policy migration steps.

## Classic policies

The conditional access policies you have configured in the Azure classic portal are also known as **classic policies**. To migrate your classic policies, you don't need to have access to your Azure classic portal. The Azure portal provides you with a [**Classic policies (preview)** view](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/ClassicPolicies) that enables you to review your classic policies.

![Azure Active Directory](./media/active-directory-conditional-access-migration/33.png)


## Azure AD conditional access policies

This topic provides you with detailed steps that enable you to migrate your classic policies without being familiar with Azure AD conditional access polices. However, we recommend to get a basic understanding of [conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal.md). Having a basic understanding of the concepts and the terminology helps to simplify the migration process. If you want to familiarize yourself with the user interface in the Azure portal, see [Get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).     


## What you should know 




- Any existing classic policies configured for device and app (mobile app management) based controls work like multiple controls with one selected control to be fulfilled (OR).  

- Classic policies for app based controls apply only for “Office 365 Exchange Online” and “Office 365 SharePoint Online”. 

- Policies configured with classic controls and the new Ibiza controls work like separate multiple policies where all selected controls need to be fulfilled (AND).  

- Office 365 Exchange online cloud app requires 2 policies if you’re looking to support all supported client apps (browser, modern authentication clients and Exchange Active Sync apps).  

- Classic policies for app based controls are pre-configured for iOS and Android only. New Azure portal requires you to pick the device platform explicitly. 

- Classic policies for app based controls for Office 365 Exchange Online are configured to allow supported and unsupported platforms for Exchange ActiveSync. 


## Require multi-factor authentication policy 

This example shows how to migrate a **require multi-factor authentication** policy to the Azure portal. 

![Azure Active Directory](./media/active-directory-conditional-access-migration/22.png)


1. In the [Azure portal](https://portal.azure.com), on the left navbar, click **Azure Active Directory**.

    ![Azure Active Directory](./media/active-directory-conditional-access-migration/01.png)

2. On the **Azure Active Directory** page, in the **Manage** section, click **Conditional access**.

    ![Conditional access](./media/active-directory-conditional-access-migration/02.png)
 
3. On the **Conditional Access** page, to open the **New** page, in the toolbar on the top, click **Add**.

    ![Conditional access](./media/active-directory-conditional-access-migration/03.png)

4. On the **New** page, in the **Name** textbox, type a name for your policy.

    ![Conditional access](./media/active-directory-conditional-access-migration/29.png)

5. In the **Assignments** section, click **Users and groups**.

    ![Conditional access](./media/active-directory-conditional-access-migration/05.png)

    a. If you have all users selected in the Azure classic portal, click **All users**. 

    ![Conditional access](./media/active-directory-conditional-access-migration/23.png)

    b. If you have groups selected in the classic Azure portal, select individual users and groups.

    ![Conditional access](./media/active-directory-conditional-access-migration/24.png)

    c. If you’ve have the **Except** option selected, exclude the selected groups. 

    ![Conditional access](./media/active-directory-conditional-access-migration/25.png)

6. On the **New** page, to open the **Cloud apps** page, in the **Assignment** section, click **Cloud apps**.

    ![Conditional access](./media/active-directory-conditional-access-azure-portal-get-started/07.png)

8. On the **Cloud apps** page, perform the following steps:

    ![Conditional access](./media/active-directory-conditional-access-migration/08.png)

    a. Click **Select apps**.

    b. Click **Select**.

    c. On the **Select** page, select your cloud app, and then click **Select**.

    d. On the **Cloud apps** page, click **Done**.



9. If you have **Require multi-factor authentication** selected, do:

    ![Conditional access](./media/active-directory-conditional-access-migration/26.png)

    a. In the **Access controls** section, click **Grant**.

    ![Conditional access](./media/active-directory-conditional-access-migration/27.png)

    b. On the **Grant** page, click **Grant access**, and then click **Require multi-factor authentication**.

    c. Click **Select**.


10. Click **Enable policy**.

    ![Conditional access](./media/active-directory-conditional-access-migration/30.png)

11. Disable the policy in the Azure classic portal. 



 
 
 
## Require device marked as compliant policy



OR Required approved client apps” to the new Azure portal 
In this example, we will show you how to migrate the following device and app (mobile app management) based policies created using classic Azure portal and Intune app protection CA respectively. For this example, let’s assume that you’ve configured the following: 
In the classic Azure portal, you have configured Exchange Online (cloud app) for device based conditional access policy for a selected group for iOS/Android (device platform) on Mobile and desktop clients and Exchange Active sync (EAS) clients (client apps). 
In the Intune app protection portal, you have configured Exchange Online (cloud app) for conditional access policy for a selected group (same as device policy) and protect access from Exchange Active sync (EAS) clients (client apps). 
To migrate the above policies, follow the steps below. This example uses the ‘Classic policies’ view in the new Azure portal rather than the classic Azure portal and Intune app protection portal.   
Go to Conditional access in the new Azure portal and click + New policy. Alternatively, click on this: https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies  
Provide a meaningful name for the policy. In this case it will be two policies (e.g. 1. Device and app CA policy for selected group and 2. EAS policy for selected group) 
 
Select the users/groups under Users and groups. 
Classic policy view: Device 
New Azure Portal: Device & App policy 
 
 
Details pane 
 
 
 
Classic policy view: Mobile app management 
New Azure Portal: EAS policy 
 
 
Details pane 
 
 
 
 
Select the application for each the 2 policies (Device/App policy and EAS) 
Classic policy view: Device 
New Azure portal 
 
 
Classic policy view: Mobile app management 
 
Hint: You can select more apps in the same policy. Review and consider consolidation. 
 
Configure the platform conditions for each policy (in this example both are iOS and Android) 
Classic policy view: Device 
New Azure Portal: Device & App policy 
 
 
Note: EAS policies should not be configured for any platforms 
 
Classic policy view: Mobile app management 
New Azure Portal: EAS policy 
 
 
Note: EAS policies should not be configured for any platforms 
 
 
Configure the client app conditions for each policy (in this example both are Mobile and Desktop clients only) 
Classic policy view: Device 
New Azure Portal: Device & App policy 
 
 
 
EAS options 
 
 
 
 
 
 
Classic policy view: Mobile app management 
New Azure Portal: EAS policy 
 
 
EAS options 
 
 
 
 
Configure the controls for each policy 
Classic policy view: Device 
New Azure Portal: Device and app policy 
 
 
 
EAS is valid for compliant device only 
 
Classic policy view: Mobile app management 
New Azure Portal: EAS policy 
 
 
 
EAS is valid for approved client apps 
 
 
Enable new policies first and then disable the old policies.  
Classic policy view: Device 
New Azure Portal: Device and app policy 
 
 
 
Classic policy view: Mobile app management 
New Azure portal: EAS policy 
 
 
 
 
 
 
You are done!  
 

## Next steps

- If you want to know how to configure a conditional access policy, see [Get started with conditional access in Azure Active Directory](active-directory-conditional-access-azure-portal-get-started.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](active-directory-conditional-access-best-practices.md). 
