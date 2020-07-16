---
title: Manage IoT Plug and Play Preview models in the repository| Microsoft Docs
description: How to manage device capability models in the repository using the Azure IoT Model Repository portal.
author: JimacoMS3
manager: philmea
ms.service: iot-pnp
services: iot-pnp
ms.topic: how-to
ms.date: 07/16/2020
ms.author: v-jambra
---

# Manage models in the model repository

The Azure IoT Model Repository stores the models defined using [DTDLv2](<provide link>). The model repository makes the models discoverable and consumable by device and solution developers.

You can use the [Azure IoT Model Repository portal](https://aka.ms/iotmodelrepo), the [Model repository Azure CLI commands](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest), or the [Model repository REST API](https://review.docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodel/getmodel?branch=iotpnp) to manage models in the repository.  

## Public and Private models

Models can be public or private to the organization.

Company models are private and are maintained by your company. Access to company models is controlled through role-based access control (RBAC) on your repository tenant. Repository tenant roles determine who can create and publish models in your organization. Permissions on models allow the creator of a private model to share it with a limited audience within the company or with partners of your organization.

Once a model has been published, it is public. Public models are available anonymously.

For an overview of model repository concepts including RBAC, see [Understand the Azure IoT Model Repository](concepts-model-repository.md).

## Model repository user management

Use your _work or school account_ to access the model repository. The model repository checks your membership with the Microsoft Partner Center when you access it:

- If you're the first user from your organization to access the model repository or to sign in to the portal, you're granted the _Tenant Administrator_ role. This role allows you to assign roles to other users in your organization's repository (repository tenant).
- You can be assigned other roles by a _Tenant Administrator_ like _ReadTenantModels_ or _CreateModels_.
- If your organization isn't a member of the [Microsoft Partner Center](https://docs.microsoft.com/partner-center/), you can't publish your models.
- If you see a notification message in the [Azure IoT Model Repository](https://aka.ms/iotmodelrepo) that your Microsoft Partner Network ID is missing, you should [create a Partner Center account](https://docs.microsoft.com/partner-center/mpn-create-a-partner-center-account). When your account is approved, you can return and publish your models. For more information, see the [Partner Center FAQ](https://support.microsoft.com/help/4340639/partner-center-account-faqs).

To learn how to create a user or service principal in an Azure AD tenant, see the links to Azure AD topics in [Manage models with the Model repository REST API](#manage-models-with-the-model-repository-rest-api).

## Manage model repository tenant roles

 By default, users can read their company's private models, models that have been shared with them by other companies, and all public models. Repository tenant administrators can add users and service principals  to repository tenant roles so that they can create private models, publish private models, or manage roles for other users and service principals.

To add a user or a service principal to a model repository tenant role using the portal:

1. Sign-in to the [Azure IoT Model Repository portal](https://aka.ms/iotmodelrepo).

2. Select **Access management** on the left pane, then select **+Add**. On the **Add Permission** pane, type the work address of the user you want to add to the role.

    ![Add tenant permission to user.](./media/howto-manage-models/add-permission.png)

3. Choose the role you want to add the user to from the **Role** dropdown. Then select **Save**.

    ![Choose tenant role.](./media/howto-manage-models/choose-role.png)

To add permissions to a user or service principal in a model repository tenant through REST Api (<refer to REST API documentation>)

To add permissions to a user or service principal in a model repository tenant through Azure CLI(<refer to CLI>)

## Upload a model

You must be a member of the repository tenant's _Creator_ role to upload a model to the model repository.

To upload a model using the portal:

1. Sign-in to the [Azure IoT Model Repository portal](https://aka.ms/iotmodelrepo).

2. Expand **Company Models** on the left pane and select **Create model**. Then select **Import Json**.

    ![Create a model.](./media/howto-manage-models/create-model.png)

3. Select the file you want to upload. If the portal successfully validates your model, select **Save**.

## Share a private model

You can share private models that you have created with users and service principals of external organizations. In this way, you can allow your collaborators to view and develop solutions with your company's private models.

To share a private model using the portal:

If you're the creator of a model, the **Share** and **Shared with** buttons will be active when you view the model in your Company models.

![Model sharing.](./media/howto-manage-models/share-model.png)

- To share the model with an external user, select **Share**. In the **Share model** pane, enter the email address of the external user and select **Save**.

- To see the users who you have shared the model with, select **Shared with**.

- To stop sharing the model with a specific user, select the user from the list of users on the **Shared with** pane. Then select **Remove** and confirm your choice when prompted.

    ![Stop sharing a model.](./media/howto-manage-models/unshare-model.png)

## Publish a model

You must be a member of the repository tenant's _Publisher_ role to publish a model.

To publish a model using the portal:

1. Sign-in to the [Azure IoT Model Repository portal](https://aka.ms/iotmodelrepo).

2. Expand **Company Models** on the left pane and select the model you want to publish. Then select **Publish**.

    ![Publish a model.](./media/howto-manage-models/publish-model.png)

    > [!NOTE]
    > If you get a notification saying that that you don't have a Microsoft Partner (MPN) ID, follow the registration steps in the notification. For more information, see [Model repository sign-in](#model-repository-sign-in).

## Manage models with the Model repository REST API

To manage models with the Model repository REST API, see the [Model repository REST API documentation](https://review.docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodel/getmodel?branch=iotpnp).

You may find the following topics helpful when working with Azure Active Directory:

- To create a new Azure AD tenant, see [Create a new tenant in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant). Note that Most organizations will already have Azure AD tenants.

- To add users or guest users to an Azure AD tenant, see [Add or delete users using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/add-users-azure-active-directory).

- To add a service principal to an Azure AD tenant, see [How to use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

- To learn how to get a JWT token from Azure AD to use when calling REST APIs, see [Acquire a token from Azure AD for authorizing requests from a client application](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-app).

## Manage models with the Azure CLI

To manage models with the Azure CLI, see the documentation for the [az iot pnp command](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest).

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
