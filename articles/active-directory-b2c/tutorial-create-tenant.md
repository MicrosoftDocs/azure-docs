---
title: Tutorial - Create an Azure Active Directory B2C tenant | Microsoft Docs
description: Learn how to prepare for registering your applications by creating an Azure Active Directory B2C tenant using the Azure portal.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: conceptual
ms.date: 06/19/2018
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

Log in to the [Azure portal](https://portal.azure.com/).

## Create an Azure AD B2C tenant

1. Choose **Create a resource** in the top-left corner of the Azure portal.
2. In the search box above the list of Azure Marketplace resources, search for and select **Active Directory B2C**, and then click **Create**.
3. Choose **Create a new Azure AD B2C Tenant**, enter an organization name and initial domain name, which is used in the tenant name, select the country, and then click **Create**. Be sure of the country of the tenant because it can't be changed later.

    ![Create a tenant](./media/tutorial-create-tenant/create-tenant.png)

    In this example the tenant name is contoso0522Tenant.onmicrosoft.com

To start managing your new tenant, click the word **here** where it says **Click here, to manage your new directory**. You will see a **Troubleshoot** message that says you need to link your subscription to the new tenant. 

## Link your tenant to your subscription

You need to link your Azure AD B2C tenant to your Azure subscription to enable all functionality and pay for usage charges. If you don't link your tenant to your subscription, your applications won't work correctly.

1. Make sure you're using the directory that contains the subscription you want to associate to the new tenant by switching the directory in the top-right corner of the Azure portal.

    ![Switch directories](./media/tutorial-create-tenant/switch-directories.png)

    And then selecting the directory that contains your subscription.

    ![Select directory](./media/tutorial-create-tenant/select-directory.png)

2. Choose **Create a resource** in the upper top-left corner of the Azure portal.
3. In the search box above the list of Azure Marketplace resources, search for and select **Active Directory B2C**, and then click **Create**.
4. Choose **Link an existing Azure AD B2C Tenant to my Azure subscription**, select the tenant that you created, select your subscription, enter *myContosoTenantRG* for the resource group name, accept the location, and then click **Create**.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription

> [!div class="nextstepaction"]
> [Enable a web application to authenticate with accounts](active-directory-b2c-tutorials-web-app.md)