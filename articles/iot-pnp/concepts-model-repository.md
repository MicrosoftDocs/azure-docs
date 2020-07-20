---
title: Understand concepts of the Azure IoT Model Repository | Microsoft Docs
description: As a solution builder or an IT professional, learn about the basic concepts of the Azure IoT Model Repository.
author: JimacoMS3
ms.author: v-jambra
ms.date: 04/10/2020
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Understand the Azure IoT Model Repository

This article describes concepts behind the Azure IoT Model Repository.

## Azure IoT Model Repository

The model repository stores the Digital Twin interfaces that describe the functionality of IoT Plug and Play devices. Models are secured with fine grained access control using role-based access control (RBAC).

### Public models

For any model that has been published in the model repository it becomes a public model. It does not require a user to sign in to browse any public models. The model repository offers an anonymous browsing experience with public models.

### Company models

Models authored by your organization. You can see a list of unpublished models of your company and a list of published models of your company.

#### Unpublished

Models that are created by users within your organization. These models are not published, and are only accessible by users within your organization by default. You can also share one or more unpublished models with external users.

#### Published

Models that are created and published by users within your organization. These models are public and can also be found by anyone under Public Models.

### Shared Models

The models that are shared with me from outside of my company. You can see a list of unpublished models that have been shared with you and a list of published models that have been shared with you.

## Role-based access control (RBAC)

The model repository uses RBAC to provide fine-grained access to models in the repository. There are two general types of roles available:

- Tenant roles provide users in a company's Azure AD tenant with the ability to create interfaces, publish interfaces, manage the roles assigned to other users, and get metrics about the interfaces associated with the tenant.
- Model roles exposed on individual interfaces enable the creator of an interface to manage the external users who are able to read private interfaces.

### Tenant roles and permissions

The following table describes the roles that can be assigned on the tenant.

| Role | Permissions |
|------|-------------|
| Creator | CreateModel </br> ReadTenantModels |
| Publisher | PublishModel </br> ReadTenantModels |
| Tenant Administrator | CreateModel </br> ManageAccess </br> ReadTenantInformation </br> ReadTenantModels |

The following table describes the permissions that can be granted in the tenant with the different roles.

| Permission | Description |
|------------| ------------|
| CreateModel | Allows the user to create  models in the tenant. |
| ManageAccess | Allows the user to assign or remove other users to the *Administrator*, *Creator*, or *Publisher* roles in the tenant. |
| PublishModel | Allows the user to publish models that exist in the tenant. |
| ReadTenantInformation | Allows the user to read information about the tenant; for example, number of interfaces. |
| ReadTenantModels | Allows the user to view all models in the tenant. |

The first user in an organization's tenant to sign in to the [Azure IoT Model Repository portal](https://aka.ms/iotmodelrepo) is assigned the *Tenant Administrator* role. That person can then add other users in the tenant to tenant roles.

### Model roles and permissions

Once an interface is published, it's available publicly (anonymous authentication). Device manufacturers may, however, want to maintain private interfaces; for example, they may have customers who require that their device capabilities remain confidential. For this scenario, the model repository exposes permissions and roles that can be applied to individual  models.

The following table describes the roles that can be granted on an individual model.

| Role | Permissions | Remarks |
|------|-------------|---------|
| Model Administrator (owner) | ReadModel </br> ModelAdministrator | The *Model Administrator* role is automatically assigned to the user who creates the model. The user must be in either the *Tenant Administrator* or the *Creator* role on the tenant. |
| Reader | ReadModel | The *Reader* role can only be assigned to service identities and external users. To read a model, users in the tenant must be either the owner of the model or be in one of the tenant roles that grants the *ReadTenantModels* permission. |

The following table describes the permissions that are granted on a model with the different roles.

| Permission | Description |
|------------| ------------|
| Model Administrator | Allows the user to add or remove access to the model on which it is granted by assigning the *Reader* role to an external user or service identity. </br></br> Allows the user to read sharing info about the model on which it is granted. For example, the number of times a model has been shared and who the model has been shared with. |
| ReadModel | Allows the assigned user or service identity to view only the model on which it is granted. |

When a user in the *Tenant Creator* role adds a new model to the model repository, that user is automatically assigned the *Model Administrator* role on the model. The model administrator can add external users and service identities to the *Reader* role on the model. Typically a device manufacturer will generate a service identity (service principal) at the request of an external partner and add that service principal to the *Reader* role on the models that the partner needs access to.
