---
title: Understand concepts of the Azure IoT Model Repository | Microsoft Docs
description: As a solution builder or an IT professional, learn about the basic concepts of the Azure IoT Model Repository.
author: JimacoMS3
ms.author: v-jambra
ms.date: 07/23/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Azure IoT model repository

The Azure IoT model repository enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). The models stored in the model repository service can be shared with solution builders either privately through access control or publicly without requiring any authentication to integrate and develop the Plug and Play cloud solution.

You can access the model repository using the:

- [Azure IoT model repository](https://aka.ms/iotmodelrepo) portal
- [REST API](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync)
- [Azure CLI](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest)

## Public models

The public digital twin models stored in the model repository are available to everyone to consume and integrate in their application without any authentication. Additionally, the public models make it possible for an open eco-system for device builders and solution builders to share and reuse their IoT Plug and Play device models.

To view a public model using the model repository portal:

1. Go to [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Select on **View public models**.

    ![View public models](./media/concepts-model-repository/public-models.png)

To view the public model programmatically using the REST API, see [Get Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync) REST API documentation. You don't need to pass in a JWT authorization header.

To view the public model using the CLI, see the Azure CLI [Get Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-show) command.

## Company models

Company models are authored by your company or organization. Company models are private and are maintained by your company or organization. Access to company models is controlled through access management policies that use role-based access control (RBAC) on your repository tenant.

### Set up your company model repository

Use your *work or school account* to access the model repository. To learn how to set up an Azure Active Directory tenant and how to create a user or service principal in an Azure Active Directory tenant, see [Manage models in the model repository - Additional information](howto-manage-models.md#additional-information).

- If you're the first user from your organization to access the model repository or to sign into the portal, you're granted the **Tenant Administrator** role. This role allows you to assign roles to other users in your organization's repository tenant.

- You can be assigned other roles by a **Tenant Administrator** such as **ReadTenantModels** or **CreateModels**.

Your organization needs to be a member of the [Microsoft Partner Network](https://docs.microsoft.com/partner-center/) to publish a model. To create a partner center account, see [create a Partner Center account](https://docs.microsoft.com/partner-center/mpn-create-a-partner-center-account). After your account is approved, you can publish your models. For more information, see the [Partner Center FAQ](https://support.microsoft.com/help/4340639/partner-center-account-faqs).

Use a *work or school account* to access the model repository. Models created by a company are stored in a repository tenant dedicated to the company or organization.

Repository tenant roles determine who can create and publish models in your organization. Permissions on models allow the creator of a model, which is private to the company or organization, to share it with a limited audience external to your organization.

To learn how to set up an Azure Active Directory tenant and how to create a user or service principal in an Azure Active Directory tenant, see [Manage models in the model repository - Additional information](howto-manage-models.md#additional-information).

#### Manage with the model repository REST API

To learn how to manage models with the model repository REST API, see the [Model repository REST API documentation](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodel/getmodel). 

When you call the REST APIs to manage company models that are private or shared, you must provide an authorization token in JWT format for the user or service principal. See the [Manage models in the model repository - Additional information](howto-manage-models.md#additional-information) section to learn how to get the JWT token for a user or service principal.

The JWT token fetched using the above method must be passed in the authorization HTTP header in the REST API for consuming company models or shared models. The JWT token isn't needed when consuming public models.

#### Manage with the Azure CLI

To manage models with the Azure CLI, see the documentation for the [az iot pnp command](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest).

### Access management

The model repository uses RBAC to provide fine-grained access to models in the company tenant repository. There are two general types of role available:

- Tenant roles provide users in a company or organizations tenant with the ability to create models, publish models, manage the roles assigned to other users, and get metrics about the models associated with the tenant.

- Model roles exposed on individual models enable the creator of a model to manage the external users who can read private interfaces.

The first user in an organization's tenant to sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo) is assigned the **Tenant Administrator** role. That person can then add other users in the tenant to tenant roles.

#### Tenant roles and permissions

The following table describes the roles that can be assigned on the tenant:

| Role                 | Permissions                                                     |
|----------------------|-----------------------------------------------------------------|
| Creator              | CreateModel, ReadTenantModels                                    |
| Publisher            | PublishModel, ReadTenantModels                                   |
| Tenant Administrator | CreateModel, ManageAccess, ReadTenantInformation, ReadTenantModels |


The following table describes the permissions that can be granted in the tenant with the different roles:

| Permission       | Description                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| CreateModel           | Allows the user to create models in the tenant.                                                                        |
| ManageAccess          | Allows the user to assign or remove other users to the *Administrator*, *Creator*, or *Publisher* roles in the tenant. |
| PublishModel          | Allows the user to publish models that exist in the tenant.                                                            |
| ReadTenantInformation | Allows the user to read information about the tenant; for example, number of interfaces.                               |
| ReadTenantModels      | Allows the user to view all models in the tenant.                                                                      |

#### Model roles and permissions

When a model is published, it's available anonymously without authentication. Device manufacturers may want to maintain private company models. For example, they may have customers who require that their device capabilities remain confidential. For this scenario, the model repository exposes permissions and roles that can be applied to individual models.

The following table describes the roles that can be granted on an individual model:

| Role | Permissions | Remarks |
|---|---|---|
| Model Administrator (owner) | ReadModel, ModelAdministrator | The Model Administrator role is automatically assigned to the user who creates the model. The user must be in either the Tenant Administrator or the Creator role on the tenant. |
| Reader | ReadModel | The Reader role can only be assigned to service identities and external users. To read a model, users in the tenant must be either the owner of the model or be in one of the tenant roles that grants the ReadTenantModels permission. |

The following table describes the permissions that are granted on a model with the different roles.

| Permission | Description |
|---|---|
| Model Administrator | Allows the user to add or remove access to the model on which it's granted by assigning the Reader role to an external user or service identity. Allows the user to read sharing info about the model on which it's granted. For example, the number of times a model has been shared and who the model has been shared with. |
| ReadModel | Allows the assigned user or service identity to view only the model on which it's granted. |

When a user in the *Tenant Creator* role adds a new model to the model repository, that user is automatically assigned the *Model Administrator* role on the model. The model administrator can add external users and service identities to the *Reader* role on the model. Typically a device manufacturer will generate a service identity (service principal) at the request of an external partner and add that service principal to the *Reader* role on the models that the partner needs access to.

#### Manage roles

By default, users and service principals can read their company's models, models that have been shared with them by other companies, and all public models. Repository tenant administrators can add users and service principals to repository tenant roles so that they can create models private to the company or organization, publish models, or manage roles for other users and service principals.

To add permissions to a user or a service principal in a model repository tenant role using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Select **Access management** on the left pane, then select **+Add**. On the **Add Permission** pane, type the work address of the user you want to add to the role.

    ![Add work address](./media/concepts-model-repository/add-user.png)

1. Choose the role you want to add the user to from the **Role** dropdown. Then select **Save**.

    ![Choose role](./media/concepts-model-repository/choose-role.png)

To add permissions to a user or a service principal in a model repository tenant role using the REST API, see [Assign Roles](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservicecontrolplane/assignroles/assignroles). Pass in a JWT token in the authorization header of the HTTP request.

To add permissions to a user or a service principal in a model repository tenant role using the CLI, see the Azure CLI [Assign Roles](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/role-assignment?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-role-assignment-create) command.

### Upload a model

You must be a member of the repository tenant's *Creator* role to upload a model to the model repository.

#### Unpublished models

Models that are created by users within your organization. These models are not published and are only accessible by users within your organization by default. You can also share one or more unpublished models with external users.

To upload a model using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Expand **Company Models** on the left pane and select **Create model**. Then select **Import Json**.

    ![Create model](./media/concepts-model-repository/create-model.png)

1.  Select the file you want to upload. If the portal successfully validates your model, select **Save**.

To upload a model using the REST API, see the [Create a Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/createorupdateasync/createorupdateasync) the REST API. Pass in a JWT token in the authorization header of the HTTP request.

To upload a model using the CLI, see the Azure CLI [Create a Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-create) command.

#### Share a model

You can share company models that you've created with users and service principals of external organizations. In this way, you can allow your collaborators to view and develop solutions with your private company models.

To share a company model using the portal:

If you're the creator of a model, the **Share** and **Shared with** buttons are active when you view the model in the **Company models** section.

![Share model](./media/concepts-model-repository/share-model.png)

- To share the model with an external user, select **Share**. In the **Share model** pane, enter the email address of the external user and select **Save**.

- To see the users who you've shared the model with, select **Shared with**.

- To stop sharing the model with a specific user, select the user from the list of users on the **Shared with** pane. Then select **Remove** and confirm your choice when prompted.

  ![Stop sharing](./media/concepts-model-repository/stop-sharing.png)

#### Shared Models

You can also **share models** securely with people or identities in other companies or organizations. Permissions on models allow the creator of a model, which is private to the company or organization, to share it with a limited audience external to your organization.

For example, a device manufacturer may want to maintain models private to the company or organization. They may have customers who require that their device capabilities remain confidential.

You can see a list of **unpublished** models that have been shared with you and a list of **published** models that have been shared with you.

Sharing models across companies or organizations allows for secure access to models that aren't public.

To share a company model using the REST API, see the [Share Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservicecontrolplane/assignroles/assignroles) REST API. Pass in a JWT token in the authorization header of the HTTP request.

To share a company model using the CLI, see the Azure CLI [Share a Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/role-assignment?view=azure-cli-latest) command.

### Publish a model

To publish a model, the following requirements must be met:

1. The company or organization tenant must be a Microsoft Partner. To learn how to register as a Microsoft Partner, see [Set up your model repository tenant and users](howto-manage-models.md#set-up-your-model-repository-tenant-and-users).

1. The user or service principal must be a member of the repository tenant's *Publisher* role.

#### Published models

Models that are created and published by users within your organization. These models are public and can be found by anyone under **Public Models**.

To publish a model using the portal:

1.  Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1.  Expand **Company Models** on the left pane and select the model you want to publish. Then select **Publish**.

    ![Publish model](./media/concepts-model-repository/publish-model.png)

> [!NOTE]
> If you get a notification saying that that you don't have a Microsoft Partner (MPN) ID, follow the registration steps in the notification. For more information, see [Set up your model repository tenant and users](howto-manage-models.md#set-up-your-model-repository-tenant-and-users).

To publish a model using the REST API, see the [Publish a model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/createorupdateasync/createorupdateasync) REST API documentation. Supply the query string parameter `update-metadata=true` to publish a model using the REST API.

To publish a model using the CLI, see the Azure CLI [Publish a Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-publish) command.

#### View company models or shared models

You must be a member of the repository tenant's *Reader* role or the model must be shared with you to read a model.

To view a shared model using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Expand **Company Models** – **Unpublished** on the left pane

    ![View company models](./media/concepts-model-repository/view-company-models.png)

1. Expand **Shared models – Unpublished** on the left pane
    
    ![View shared models](./media/concepts-model-repository/view-shared-models.png)

To view a company model or a shared model using the REST API, see the [Get Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync) REST API documentation. Pass in a JWT authorization header in the HTTP request.

To view a company model or a shared model using the CLI, see the Azure CLI for [Get Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-show) command.

## Additional information

You may find the following topics helpful when working with Azure Active Directory:

- To create a new Azure Active Directory tenant, see [Create a new tenant in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant). Most organizations will already have Azure Active Directory tenants.

- To add users or guest users to an Azure Active Directory tenant, see [Add or delete users using Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/add-users-azure-active-directory).

- To add a service principal to an Azure Active Directory tenant, see [How to use the portal to create an Azure Active Directory application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

- To learn how to get a JWT token from Azure Active Directory to use when calling REST APIs, see [Acquire a token from Azure Active Directory for authorizing requests from a client application](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-app).

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
