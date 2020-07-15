---
title: Support for Azure Active Directory B2C | Microsoft Docs
description: How to file support requests for Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/06/2016
ms.author: mimart
ms.subservice: B2C
---

# Azure Active Directory B2C: File Support Requests
You can file support requests for Azure Active Directory B2C (Azure AD B2C) on the Azure portal using the following steps:

1. Switch from your B2C tenant to another tenant that has an Azure subscription associated with it. Typically, the latter is your employee tenant or the default tenant created for you when you signed up for an Azure subscription. To learn more, see [how an Azure subscription is related to Azure AD](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

    ![Azure portal with tenant selection highlighted](./media/support-options/support-switch-dir.png)

1. After switching tenants, click **Help + support**.

    ![Help + Support tile highlighted in Azure portal](./media/support-options/support-support.png)

1. Click **New support request**.

    ![New support request tile highlighted in Azure portal](./media/support-options/support-new.png)

1. In the **Basics** blade, use these details and click **Next**.

    * **Issue type** is **Technical**.
    * Choose the appropriate **Subscription**.
    * **Service** is **Active Directory**.
    * Choose the appropriate **Support plan**. If you don't have one, you can sign up for one [here](https://azure.microsoft.com/support/plans/).

     ![Basics page with Next button highlighted in Azure portal](./media/support-options/support-basics.png)

1. In the **Problem** blade, use these details and click **Next**.

    * Choose the appropriate **Severity** level.
    * **Problem type** is **B2C**.
    * Choose the appropriate **Category**.
    * Describe your issue in the **Details** field. Provide details such as the B2C tenant name, description of the problem, error messages, correlation IDs (if available), and so on.
    * In the **Time frame** field, provide the date and time (including time zone) that the issue occurred.
    * Under **File upload**, upload all screenshots and files that you think would assist in resolving the issue.

     ![Problem page with Next button highlighted in Azure portal](./media/support-options/support-problem.png)

1. In the **Contact information** blade, add your contact information. Click **Create**.

    ![Contact information page with Create button highlighted in portal](./media/support-options/support-contact.png)

1. After submitting your support request, you can monitor it by clicking **Help + support** on the Startboard, and then **Manage support requests**.

## Known issue: Filing a support request in the context of a B2C tenant

If you missed step 2 outlined above and try to create a support request in the context of your B2C tenant, you will see the following error.

> [!IMPORTANT]
> Don't attempt to sign up for a new Azure subscription in your B2C tenant.

![You don't have a subscription error displayed in Azure portal](./media/support-options/support-no-sub.png)
