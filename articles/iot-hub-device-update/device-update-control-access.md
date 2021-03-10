---
title: Understand Device Update for IoT Hub authentication and authorization | Microsoft Docs
description: Understand how Device Update for IoT Hub uses Azure RBAC to provide authentication and authorization for users and service APIs.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Azure Role-based access control (RBAC) and Device Update

Device Update uses Azure RBAC to provide authentication and authorization for users and service APIs.

## Configure access control roles

In order for other users and applications to have access to Device Update, users or applications must be granted access to this resource. Here are the roles that are supported by Device Update

|   Role Name   | Description  |
| :--------- | :---- |
|  Device Update Administrator | Has access to all device update resources  |
|  Device Update Reader| Can view all updates and deployments |
|  Device Update Content Administrator | Can view, import, and delete updates  |
|  Device Update Content Reader | Can view updates  |
|  Device Update Deployments Administrator | Can manage deployment of updates to devices|
|  Device Update Deployments Reader| Can view deployments of updates to devices |

A combination of roles can be used to provide the right level of access. For example, a developer can import and manage updates using the Device Update Content Administrator role, but needs a Device Update Deployments Reader role to view the progress of an update. Conversely, a solution operator with the Device Update Reader role can view all updates, but needs to use the Device Update Deployments Administrator role to deploy a specific update to devices.


## Authenticate to Device Update REST APIs for Publishing and Management

Device Update also uses Azure AD for authentication to publish and manage content via service APIs. To get started, you need to create and configure a client application.

### Create client Azure AD App

To integrate an application or service with Azure AD, [first register](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app) an application with Azure AD. Client application setup varies depending on the authorization flow used.  Configuration below is for guidance when using the Device Update REST APIs.

* Set client authentication: 'redirect URIs for native or web client'.
* Set API Permissions - Device Update for IoT Hub exposes:
  * Delegated permissions: 'user_impersonation'
  * **Optional**, grant admin consent

[Next steps: Create device update resources and configure access control roles](./create-device-update-account.md)
