---
title: "Set up an Azure AD app to use with Single Server to Flexible Server migration"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about setting up an Azure AD app to be used with the feature that migrates from Single Server to Flexible Server.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Set up an Azure AD app to use with migration from Single Server to Flexible Server

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This article shows you how to set up an [Azure Active Directory (Azure AD) app](../../active-directory/develop/howto-create-service-principal-portal.md) to use with a migration from Azure Database for PostgreSQL Single Server to Flexible Server. 

An Azure AD app helps with role-based access control (RBAC). The migration infrastructure requires access to both the source and target servers, and it's restricted by the roles assigned to the Azure AD app. After you create the Azure AD app, you can use it to manage multiple migrations. 

## Create an Azure AD app

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings. 
2. In the Azure portal, enter **Azure Active Directory** in the search box.
3. On the page for Azure Active Directory, under **Manage** on the left, select **App registrations**.
4. Select **New registration**.
   
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-new-registration.png" alt-text="Screenshot that shows selections for creating a new registration for an Azure Active Directory app." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-new-registration.png":::
  
5. Give the app registration a name, choose an option that suits your needs for account types, and then select **Register**.

    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-application-registration.png" alt-text="Screenshot that shows selections for naming and registering an Azure Active Directory app." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-application-registration.png":::

6. After the app is created, copy the client ID and tenant ID and store them. You'll need them for later steps in the migration. Then, select **Add a certificate or secret**.

    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-secret-screen.png" alt-text="Screenshot that shows essential information about an Azure Active Directory app, along with the button for adding a certificate or secret." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-secret-screen.png":::

7. For **Certificates & Secrets**, on the **Client secrets** tab, select **New client secret**.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-new-client-secret.png" alt-text="Screenshot that shows the button for creating a new client secret." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-new-client-secret.png":::

8. On the fan-out pane, add a description, and then use the drop-down list to select the life span of your Azure AD app. 

   After all the migrations are complete, you can delete the Azure AD app that you created for RBAC. The default option is **6 months**. If you don't need the Azure AD app for six months, select **3 months**. Then select **Add**.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-client-secret-description.png" alt-text="Screenshot that shows adding a description and selecting a life span for a client secret." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-client-secret-description.png":::

9. In the **Value** column, copy the Azure AD app secret. You can copy the secret only during creation. If you miss this step, you'll need to delete the secret and create another one for future tries.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-client-secret-value.png" alt-text="Screenshot that displays copying of a client secret." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-client-secret-value.png":::

## Add contributor privileges to an Azure resource

After you create the Azure AD app, you need to add contributor privileges for it to the following resources.

| Resource | Type | Description |
| ---- | ---- | ---- |
| Single Server | Required | Single Server source that you're migrating from. |
| Flexible Server | Required | Flexible Server target that you're migrating into. |
| Azure resource group | Required | Resource group for the migration. By default, this is the resource group for the Flexible Server target. If you're using a temporary resource group to create the migration infrastructure, the Azure AD app will require contributor privileges to this resource group. |
| Virtual network | Required (if used) | If the source or the target has private access, the Azure AD app will require contributor privileges to the corresponding virtual network. If you're using public access, you can skip this step. |

The following steps add contributor privileges to a Flexible Server target. Repeat the steps for the Single Server source, resource group, and virtual network (if used).

1. In the Azure portal, select the Flexible Server target. Then select **Access Control (IAM)** on the upper left.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-iam-screen.png" alt-text="Screenshot of the Access Control I A M page." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-iam-screen.png":::

2.  Select **Add** > **Add role assignment**.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-role-assignment.png" alt-text="Screenshot that shows selections for adding a role assignment." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-add-role-assignment.png":::

    > [!NOTE]
    > The **Add role assignment** capability is enabled only for users in the subscription who have a role type of **Owners**. Users who have other roles don't have permission to add role assignments.

3.  On the **Role** tab, select **Contributor** > **Next**.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-contributor-privileges.png" alt-text="Screenshot of the selections for choosing the contributor role." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-contributor-privileges.png":::

4.  On the **Members** tab, keep the default option of **User, group, or service principal** for **Assign access to**. Click **Select Members**, search for your Azure AD app, and then click **Select**.
    
    :::image type="content" source="./media/how-to-setup-azure-ad-app-portal/azure-ad-review-and-assign.png" alt-text="Screenshot of the Members tab to be added as Contributor." lightbox="./media/how-to-setup-azure-ad-app-portal/azure-ad-review-and-assign.png":::

 
## Next steps

- [Single Server to Flexible Server migration concepts](./concepts-single-to-flexible.md)
- [Migrate from Single Server to Flexible Server by using the Azure portal](./how-to-migrate-single-to-flexible-portal.md)
- [Migrate from Single Server to Flexible server by using the Azure CLI](./how-to-migrate-single-to-flexible-cli.md)