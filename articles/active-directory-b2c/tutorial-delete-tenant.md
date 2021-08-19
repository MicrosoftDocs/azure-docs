---
title: Clean up resources and delete a tenant - Azure Active Directory B2C
description: Steps describing how to delete an Azure AD B2C tenant. Learn how to delete all tenant resources, and then delete the tenant.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/23/2021
ms.author: mimart
ms.subservice: B2C
---

# Clean up resources and delete the tenant

When you've finished the Azure AD B2C tutorials, you can delete the tenant you used for testing or training. To delete the tenant, you'll first need to delete all tenant resources. In this article, you'll:

> [!div class="checklist"]
> * Use the **Delete tenant** option to identify cleanup tasks
> * Delete tenant resources (user flows, identity providers, applications, users)
> * Delete the tenant

## Identify cleanup tasks

1. Sign in to the [Azure portal](https://portal.azure.com/) with a global administrator or subscription administrator role. Use the same work or school account or the same Microsoft account that you used to sign up for Azure.

2. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.

3. Select the **Azure Active Directory** service.

4. Under **Manage**, select **Properties**.

5. Under **Access management for Azure resources**, select **Yes**, and then select **Save**.

6. Sign out of the Azure portal and then sign back in to refresh your access. Use the **Directory + subscription** filter in the top menu again to select the directory that contains your Azure AD B2C tenant.

7. Select the **Azure Active Directory** service.

8. On the **Overview** page, select **Delete tenant**. The **Required action** column indicates the resources you'll need to remove before you can delete the tenant.

   ![Delete tenant tasks](media/tutorial-delete-tenant/delete-tenant-tasks.png)

## Delete tenant resources

If you have the confirmation page open from the previous section, you can use the links in the **Required action** column to open the Azure portal pages where you can remove these resources. Or, you can remove tenant resources from within the Azure AD B2C service using the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com/) with a global administrator or subscription administrator role. Use the same work or school account or the same Microsoft account that you used to sign up for Azure.

2. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.

3. Select the **Azure AD B2C** service. Or use the search box to find and select **Azure AD B2C**.

4. Delete all users *except* the admin account you're currently signed in as: Under **Manage**, select **Users**. On the **All users** page, select the checkbox next to each user (except the admin account you're currently signed in as). Select **Delete**, and then select **Yes** when prompted.

   ![Delete users](media/tutorial-delete-tenant/delete-users.png)
   
5. Delete app registrations and the *b2c-extensions-app*: Under **Manage**, select **App registrations**. Select the **All applications** tab. Select an application, and then select **Delete**. Repeat for all applications, including the **b2c-extensions-app** application.

   ![Delete application](media/tutorial-delete-tenant/delete-applications.png)

6. Delete any identity providers you configured: Under **Manage**, select **Identity providers**. Select an identity provider you configured, and then select **Remove**.

   ![Delete identity provider](media/tutorial-delete-tenant/identity-providers.png)

8. Delete user flows: Under **Policies**, select **User flows**. Next to each user flow, select the ellipses (...) and then select **Delete**.

   ![Delete user flows](media/tutorial-delete-tenant/user-flow.png)

9. Delete policy keys: Under **Policies**, select **Identity Experience Framework**, and then select **Policy keys**. Next to each policy key, select the ellipses (...) and then select **Delete**.

10. Delete custom policies: Under **Policies**, select **Identity Experience Framework**, select **Custom policies**, and then delete all policies.

## Delete the tenant

1. Sign in to the [Azure portal](https://portal.azure.com/) with a global administrator or subscription administrator role. Use the same work or school account or the same Microsoft account that you used to sign up for Azure.

2. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.

3. Select the **Azure Active Directory** service.

4. If you haven't already granted yourself access management permissions, do the following:

   * Under **Manage**, select **Properties**.
   * Under **Access management for Azure resources**, select **Yes**, and then select **Save**.
   * Sign out of the Azure portal and then sign back in to refresh your access, and select the **Azure Active Directory** service.

5. On the **Overview** page, select **Delete tenant**.

   ![Delete the tenant](media/tutorial-delete-tenant/delete-tenant.png)

6. Follow the on-screen instructions to complete the process.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Delete your tenant resources
> * Delete the tenant

Next, learn more about getting started with Azure AD B2C [user flows and custom policies](user-flow-overview.md).
