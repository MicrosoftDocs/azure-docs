---
title: Understand concepts of the Azure IoT Model Repository | Microsoft Docs
description: As a solution developer or an IT professional, learn about the basic concepts of the Azure IoT Model Repository.
author: prashmo
ms.author: prashmo
ms.date: 07/24/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Azure IoT model repository

The Azure IoT model repository enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). The models stored in the model repository service can be shared with solution developers either privately through access control or publicly without requiring any authentication to integrate and develop the IoT Plug and Play cloud solution.

> [!NOTE]
> Device builders can choose to implement IoT Plug and Play device models directly on a device, use modules, or in an IoT Edge module.

You can access the model repository using the:

- [Azure IoT model repository](https://aka.ms/iotmodelrepo) portal
- [Azure IoT model repository REST API](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync)
- [Azure CLI IoT model repository commands](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest&preserve-view=true)

## Public models

The public digital twin models stored in the model repository are available to everyone to consume and integrate in their application without any authentication. Additionally, the public models make it possible for an open eco-system for device builders and solution developers to share and reuse their IoT Plug and Play device models.

Refer to the [Publish a Model](#publish-a-model) section under the **Company Models** for instructions on how to publish a model in the model repository to make it public.

To view a public model using the model repository portal:

1. Go to [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Select on **View public models**.

    ![View public models](./media/concepts-model-repository/public-models.png)

To view a public model programmatically using the REST API, see [Get Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync) REST API documentation.

```csharp
var httpClient = new HttpClient();
httpClient.BaseAddress = new Uri("https://repo.azureiotrepository.com");

var modelId = "dtmi:com:mxchip:model;1";
var response = await httpClient.GetAsync($"/models/{modelId}?api-version=2020-05-01-preview").ConfigureAwait(false);
```

To view a public model using the CLI, see the Azure CLI [Get Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-show&preserve-view=true) command.

## Company models

The company model repository is a tenant in the Azure IoT model repository for your organization to create and manage digital twin models authored by users within your company or organization. Company models are available only to authenticated users of your company or organization. A model repository tenant administrator can assign permissions and control access of other users in the company or organization to the models in the company model repository.

### Set up your company model repository

Use your *work or school Azure Active Directory (Azure AD) account* to access the model repository. If your organization already has an Azure AD tenant, you can use user account(s) and service principals from this Azure AD tenant.

To learn how to set up an Azure AD tenant and how to create a user or service principal in an Azure AD tenant, see [Additional information](#additional-information) section.

- If you're the first user from your organization to access the model repository or to sign into the portal, you're granted the **Tenant Administrator** role. This role allows you to assign roles to other users in your organization's repository tenant.

- You can be assigned other roles by a **Tenant Administrator** such as **Read Models** or **Create Models**.

### Understand access management

The following table summarizes the supported capabilities in the company model repository and their associated permissions:

| Capability  | Permission| Description|
|-------------|-----------|------------|
|Read Models|Read Models|By default, all users in the company tenant can view their company models. Additionally, the user can also view the private model(s) shared to them by other companies.|
|Manage Access|Manage Access|Manage the user role assignment (add or remove) for other users in the organization.|
|Create Models|Create Models|Create models in the company model repository.|
|Publish Models|Publish Models|Publish models to make them public for anyone to view the model.|

The following table summarizes the supported roles and their capabilities in the model repository that can be used for access management.

|Role|Capability|
|----|----------|
|TenantAdministrator|Manage Access, Read Models|
|Creator|Create Models, Read Models|
|Publisher|Publish Models, Read Models|

#### Passing a security token when accessing company models with a REST API

When you call the REST APIs to manage company models that are private or shared, you must provide an authorization token for the user or service principal in JWT format. See the [Additional information](#additional-information) section to learn how to get a JWT token for a user or service principal.

The JWT token must be passed in the Authorization HTTP header in the API when targeting company models or shared models. The JWT token isn't needed when targeting public models.

```csharp
// sample token
var authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCTI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorizationToken);
```

### View company or shared models

You must be a member of the repository tenant's *Reader* role or the model must be shared with you to read a model. You can see a list of unpublished models that have been shared with you and a list of published models that have been shared with you. By default, users can read their company's models, models that have been shared with them by other companies, and all public models.

To view a company or shared model using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Expand **Company Models** – **Unpublished** on the left pane

    ![View company models](./media/concepts-model-repository/view-company-models.png)

1. Expand **Shared models – Unpublished** on the left pane

    ![View shared models](./media/concepts-model-repository/view-shared-models.png)

To view a company or shared model using the REST API, see the [Get Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/getmodelasync/getmodelasync) REST API documentation. See [Passing a security token when accessing company models with a REST API](#passing-a-security-token-when-accessing-company-models-with-a-rest-api) for information about how to pass in a JWT authorization header in the HTTP request.

```csharp
var modelId = "dtmi:com:mxchip:model;1";
var response = await httpClient.GetAsync($"/models/{modelId}?api-version=2020-05-01-preview").ConfigureAwait(false);
```

To view a company model or a shared model using the CLI, see the Azure CLI [Get Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-show&preserve-view=true) command.

### Manage roles

The tenant administrator can assign roles to users in the repository tenant so that they can create models private to the company or organization, publish models, or manage roles for other users.

To add a user to a model repository tenant role using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Select **Access management** on the left pane, then select **+Add**. On the **Add Permission** pane, type the work address of the user you want to add to the role:

    ![Add work address](./media/concepts-model-repository/add-user.png)

1. Choose the role you want to add the user to from the **Role** dropdown. Then select **Save**:

    ![Choose role](./media/concepts-model-repository/choose-role.png)

### Upload a model

You must be a member of the repository tenant's **Creator** role to upload a model to the company model repository.

These models are not published and are only accessible by users within your organization by default. You can also share one or more unpublished models with external users.

Uploaded models are immutable.

The model IDs for these models must be globally unique across all repository tenants for all uploaded models.

To upload a model using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

1. Expand **Company Models** on the left pane and select **Create model**. Then select **Import Json**.

    ![Create model](./media/concepts-model-repository/create-model.png)

1. Select the file you want to upload. If the portal successfully validates your model, select **Save**.

To upload a model using the REST API, see the [Create a Model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/createorupdateasync/createorupdateasync) API. See [Passing a security token when accessing company models with a REST API](#passing-a-security-token-when-accessing-company-models-with-a-rest-api) for information about how to pass in a JWT authorization header in the HTTP request.

```csharp
var httpContent = new StringContent(jsonLdModel, Encoding.UTF8, "application/json");
var modelId = "dtmi:com:mxchip:model;1";
var response = await httpClient.PutAsync($"/models/{modelId}?api-version=2020-05-01-preview", httpContent).ConfigureAwait(false);
```

To upload a model using the CLI, see the Azure CLI [Create a Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-create&preserve-view=true) command.

### Publish a model

To publish a model, the following requirements must be met:

1. Your organization needs to be a member of the [Microsoft Partner Network](https://docs.microsoft.com/partner-center/) to publish a model. To create a partner center account, see [create a Partner Center account](https://docs.microsoft.com/partner-center/mpn-create-a-partner-center-account). After your account is approved, you can publish your models. For more information, see the [Partner Center FAQ](https://support.microsoft.com/help/4340639/partner-center-account-faqs).

2. The user must be a member of the repository tenant's *Publisher* role.

Models that are created and published by users within your organization are visible as *published models*. These models are public and can be found by anyone under **Public Models**.

To publish a model using the portal:

1. Sign in to the [Azure IoT model repository portal](https://aka.ms/iotmodelrepo).

2. Expand **Company Models** on the left pane and select the model you want to publish. Then select **Publish**.

    ![Publish model](./media/concepts-model-repository/publish-model.png)

> [!NOTE]
> If you get a notification saying that that you don't have a Microsoft Partner (MPN) ID, follow the registration steps in the notification. For more information, see the requirements at the beginning of this section.

To publish a model using the REST API, see the [Publish a model](https://docs.microsoft.com/rest/api/iothub/digitaltwinmodelrepositoryservice/createorupdateasync/createorupdateasync) REST API documentation. Supply the query string parameter `update-metadata=true` to publish a model using the REST API. See [Passing a security token when accessing company models with a REST API](#passing-a-security-token-when-accessing-company-models-with-a-rest-api) for information about how to pass in a JWT authorization header in the HTTP request.

To publish a model using the CLI, see the Azure CLI [Publish a Model](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp/model?view=azure-cli-latest#ext-azure-iot-az-iot-pnp-model-publish&preserve-view=true) command.

> [!NOTE]
> Models must be published in the model repository before you run the certification tests. To learn more, see [How to certify IoT Plug and Play devices](howto-certify-device.md).

### Share a model

You can share company models that you've created with users of external organizations. In this way, you can allow collaborators to view and develop solutions with your private company models.

For example, a device manufacturer may want to maintain models private to the company or organization. They may have customers who require that their device capabilities remain confidential.

Sharing models across companies or organizations allows for secure access to models that aren't public.

To share a company model using the portal:

- If you're the creator of a model, the **Share** and **Shared with** buttons are active when you view the model in the **Company models** section.

    ![Share model](./media/concepts-model-repository/share-model.png)

- To share the model with an external user, select **Share**. In the **Share model** pane, enter the email address of the external user and select **Save**.

- To see the users who you've shared the model with, select **Shared with**.

- To stop sharing the model with a specific user, select the user from the list of users on the **Shared with** pane. Then select **Remove** and confirm your choice when prompted.

    ![Stop sharing](./media/concepts-model-repository/stop-sharing.png)

## Additional information

You may find the following topics helpful when working with Azure AD:

- To create a new Azure AD tenant, see [Create a new tenant in Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant). Most organizations will already have Azure AD tenants.

- To add users or guest users to an Azure AD tenant, see [Add or delete users using Azure AD](https://docs.microsoft.com/azure/active-directory/fundamentals/add-users-azure-active-directory).

- To add a service principal to an Azure AD tenant, see [How to use the portal to create an Azure AD application and service principal that can access resources](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal).

- To learn how to get a JWT token from Azure AD to use when calling REST APIs, see [Acquire a token from Azure AD for authorizing requests from a client application](https://docs.microsoft.com/azure/storage/common/storage-auth-aad-app).

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
