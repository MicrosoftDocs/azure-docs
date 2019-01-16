---
title: Tutorial - Create an Azure Active Directory B2C tenant | Microsoft Docs
description: Learn how to prepare for registering your applications by creating an Azure Active Directory B2C tenant using the Azure portal.
services: B2C
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/26/2018
ms.author: davidmu
ms.component: B2C
---

# Tutorial: Create an Azure Active Directory B2C tenant

Before your applications can interact with Azure Active Directory (Azure AD) B2C, they must be registered in a tenant that you manage.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription

You learn how to register an application in the next tutorial.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Azure AD B2C tenant

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure that you are using the directory that contains your subscription by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains it. This is a different directory than the one that will contain your Azure AD B2C tenant.

    ![Switch to subscription directory](./media/tutorial-create-tenant/switch-directory-subscription.png)

3. Choose **Create a resource** in the top-left corner of the Azure portal.
4. Search for and select **Active Directory B2C**, and then click **Create**.
5. Choose **Create a new Azure AD B2C Tenant**, enter an organization name and initial domain name, which is used in the tenant name, select the country (it can't be changed later), and then click **Create**.

    ![Create a tenant](./media/tutorial-create-tenant/create-tenant.png)

    In this example the tenant name is contoso0926Tenant.onmicrosoft.com

6. On the **Create new B2C Tenant or Link to an exiting Tenant** page, choose **Link an existing Azure AD B2C Tenant to my Azure subscription**, select the tenant that you created, select your subscription, click **Create new** and enter a name for the resource group that will contain the tenant, select the location, and then click **Create**.
7. To start using your new tenant, make sure you are using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains it.

    ![Switch to tenant directory](./media/tutorial-create-tenant/switch-directories.png)

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription

> [!div class="nextstepaction"]
> [Enable a web application to authenticate with accounts](active-directory-b2c-tutorials-web-app.md)