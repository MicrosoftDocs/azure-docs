---
title: "Setup AAD app to use with Single to Flexible migration"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about setting up AAD App to be used with Single to Flexible Server migration feature.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Setup AAD app to use with Single to Flexible server Migration

This quick start article shows you how to setup Azure Active Directory (AAD) app to use with Single to Flexible server migration. It is an important component of this migration feature. See [Azure Active Directory app](../active-directory/develop/howto-create-service-principal-portal.md) for details. AAD App helps with role-based access control (RBAC) as the migration infrastructure requires access to both the source and target servers, and is restricted by the roles assigned to the Azure Active Directory App. The AAD app instance once created, can be used to manage multiple migrations. To get started, create a new Azure Active Directory Enterprise App by doing the following steps:

## Create AAD App

1. If you are new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate our offerings. New customers get $200 in free credits to run, test and deploy workloads.
2. Search for Azure Active Directory in the search bar on the top in the portal.
3. Within the Azure Active Directory portal, under **Manage** on the left, choose **App Registrations**.
4. Click on **New Registration**
    :::image type="content" source="./media/concepts-single-to-flex/aad-new-registration.png" alt-text="New Registration for Azure Active Directory App" lightbox="./media/concepts-single-to-flex/AAD-new-registration.png":::
  
5. Give the app registration a name, choose an option that suits your needs for account types and click register
    :::image type="content" source="./media/concepts-single-to-flex/aad-application-registration.png" alt-text="AAD App Name screen" lightbox="./media/concepts-single-to-flex/aad-application-registration.png":::

6. Once the app is created, you can copy the client ID and tenant ID required for later steps in the migration. Next, click on **Add a certificate or secret**.
    :::image type="content" source="./media/concepts-single-to-flex/aad-add-secret-screen.png" alt-text="Add a certificate screen" lightbox="./media/concepts-single-to-flex/aad-add-secret-screen.png":::

7. In the next screen, click on **New client secret**.
    :::image type="content" source="./media/concepts-single-to-flex/aad-add-new-client-secret.png" alt-text="New Client Secret screen" lightbox="./media/concepts-single-to-flex/aad-add-new-client-secret.png":::

8. In the fan-out blade that opens, add a description, and select the drop-down to pick the life span of your Azure Active Directory App. Once all the migrations are complete, the Azure Active Directory App which was created for Role Based Access Control can be deleted. The default option is six months. If you do not need Azure Active Directory App for six months, choose three months and click **Add**.
    :::image type="content" source="./media/concepts-single-to-flex/aad-add-client-secret-description.png" alt-text="Client Secret Description" lightbox="./media/concepts-single-to-flex/AAD-add-client-secret-description.png":::

9. In the next screen, copy the **Value** column which has the details of the Azure Active Directory App secret. This can be copied only while creation. If you miss copying this secret, you will need to delete this secret and create another one for future tries.
    :::image type="content" source="./media/concepts-single-to-flex/aad-client-secret-Value.png" alt-text="Copying client secret" lightbox="./media/concepts-single-to-flex/aad-client-secret-Value.png":::

10. Once Azure Active Directory App is created, you will need to add contributor privileges for this Azure Active Directory app to the following resources:

    | Resource | Type | Description |
    | ---- | ---- | ---- |
    | Single Server | Required | Source single server you are migrating from. |
    | Flexible Server | Required | Target flexible server you are migrating into. |
    | Azure Resource Group | Required | Resource group for the migration. By default, this is the target flexible server resource group. If you are using a temporary resource group to create the migration infrastructure, the Azure Active Directory App will require contributor privileges to this resource group. |
    | VNET | Required (if used) | If the source or the target happens to have private access, then the Azure Active Directory App will require contributor privileges to corresponding VNet. If you are using public access, you can skip this . |


## Add contributor privileges to an Azure resource

Repeat the following for source single server, target flexible server, resource group and Vnet (if used).

1. For the target flexible server, do the following: - Select the target flexible server in the Azure portal. - Click on Access Control (IAM) on the top left
    :::image type="content" source="./media/concepts-single-to-flex/aad-iam-screen.png" alt-text="Access Control IAM screen" lightbox="./media/concepts-single-to-flex/aad-iam-screen.png":::

2.  Click **Add** and choose **Add role assignment**.
    :::image type="content" source="./media/concepts-single-to-flex/aad-add-role-assignment.png" alt-text="Add role assignment" lightbox="./media/concepts-single-to-flex/aad-add-role-assignment.png":::

> [!NOTE]
>   The Add role assignment capability is only enabled for users in the subscription with role type as **Owners**. Users with other roles do not have permission to add role assignments.

3.  Under the **Role** tab, click on **Contributor** and click Next button
    :::image type="content" source="./media/concepts-single-to-flex/aad-contributor-privileges.png" alt-text="Choosing Contributor Screen" lightbox="./media/concepts-single-to-flex/aad-contributor-privileges.png":::

4.  Under the Members tab, keep the default option of **Assign access to** User, group or service principal and click **Select Members**. Search for your Azure Active Directory App and click on **Select**.
    :::image type="content" source="./media/concepts-single-to-flex/aad-review-and-assign.png" alt-text="Review and Assign Screen" lightbox="./media/concepts-single-to-flex/aad-review-and-assign.png":::

 
## Next Steps

- [Single Server to Flexible migration concepts](./concepts-single-to-flexible.md)
- [Migrate to Flexible server using Azure portal](./how-to-migrate-single-to-flex-portal.md)
- [Migrate to Flexible server using Azure CLI](./how-to-migrate-single-to-flex-cli.md)