---
title: Migrate a classic policy that requires multi-factor authentication in the Azure portal 
 | Microsoft Docs
description: This article shows how to migrate a classic policy that requires multi-factor authentication in the Azure portal.
services: active-directory
keywords: conditional access to apps, conditional access with Azure AD, secure access to company resources, conditional access policies
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 8c1d978f-e80b-420e-853a-8bbddc4bcdad
ms.service: active-directory
ms.component: conditional-access
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/13/2018
ms.author: markvi
ms.reviewer: nigu

---
# Migrate a classic policy that requires multi-factor authentication in the Azure portal 

This article shows how to migrate a classic policy that requires **multi-factor authentication** for a cloud app. Although it is not a prerequisite, we recommend that you read [Migrate classic policies in the Azure portal](policy-migration.md) before you start migrating your classic policies.


 
## Overview 

The scenario in this article shows how to migrate a classic policy that requires **multi-factor authentication** for a cloud app. 

![Azure Active Directory](./media/policy-migration/33.png)


The migration process consist of the following steps:

1. [Open the classic policy](#open-a-classic-policy) to get the configuration settings.
2. Create a new Azure AD conditional access policy to replace your classic policy. 
3. Disable the classic policy.



## Open a classic policy

1. In the [Azure portal](https://portal.azure.com), on the left navbar, click **Azure Active Directory**.

    ![Azure Active Directory](./media/policy-migration-mfa/01.png)

2. On the **Azure Active Directory** page, in the **Manage** section, click **Conditional access**.

    ![Conditional access](./media/policy-migration-mfa/02.png)

3. In the **Manage** section, click **Classic policies (preview)**.

    ![Classic policies](./media/policy-migration-mfa/12.png)

4. In the list of classic policies, click the policy that requires **multi-factor authentication** for a cloud app.

    ![Classic policies](./media/policy-migration-mfa/13.png)


## Create a new conditional access policy


1. In the [Azure portal](https://portal.azure.com), on the left navbar, click **Azure Active Directory**.

    ![Azure Active Directory](./media/policy-migration/01.png)

2. On the **Azure Active Directory** page, in the **Manage** section, click **Conditional access**.

    ![Conditional access](./media/policy-migration/02.png)



3. On the **Conditional Access** page, to open the **New** page, in the toolbar on the top, click **Add**.

    ![Conditional access](./media/policy-migration/03.png)

4. On the **New** page, in the **Name** textbox, type a name for your policy.

    ![Conditional access](./media/policy-migration/29.png)

5. In the **Assignments** section, click **Users and groups**.

    ![Conditional access](./media/policy-migration/05.png)

    a. If you have all users selected in your classic policy, click **All users**. 

    ![Conditional access](./media/policy-migration/35.png)

    b. If you have groups selected in your classic policy, click **Select users and groups**, and then select the required users and groups.

    ![Conditional access](./media/policy-migration/36.png)

    c. If you have the excluded groups, click the **Exclude** tab, and then select the required users and groups. 

    ![Conditional access](./media/policy-migration/37.png)

6. On the **New** page, to open the **Cloud apps** page, in the **Assignment** section, click **Cloud apps**.

8. On the **Cloud apps** page, perform the following steps:

    ![Conditional access](./media/policy-migration/08.png)

    a. Click **Select apps**.

    b. Click **Select**.

    c. On the **Select** page, select your cloud app, and then click **Select**.

    d. On the **Cloud apps** page, click **Done**.



9. If you have **Require multi-factor authentication** selected:

    ![Conditional access](./media/policy-migration/26.png)

    a. In the **Access controls** section, click **Grant**.

    ![Conditional access](./media/policy-migration/27.png)

    b. On the **Grant** page, click **Grant access**, and then click **Require multi-factor authentication**.

    c. Click **Select**.


10. Click **On** to enable your policy.

    ![Conditional access](./media/policy-migration/30.png)



## Disable the classic policy

To disable your classic policy, click **Disable** in the **Details** view.

![Classic policies](./media/policy-migration-mfa/14.png)



## Next steps

- For more information about the classic policy migration, see [Migrate classic policies in the Azure portal](policy-migration.md).


- If you want to know how to configure a conditional access policy, see [Require MFA for specific apps with Azure Active Directory conditional access](app-based-mfa.md).

- If you are ready to configure conditional access policies for your environment, see the [best practices for conditional access in Azure Active Directory](best-practices.md). 
