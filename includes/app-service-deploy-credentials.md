---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 04/20/2020
ms.author: cephalin
---

* **User-level credentials**: One set of credentials for the entire Azure account. These credentials can be used to deploy to App Service for any app in any subscription that the Azure account has permission to access. This credentials set is the default that surfaces in the portal's graphical environment, like in **Overview** and **Properties**
on the app's [resource pane](/azure/azure-resource-manager/management/manage-resources-portal#manage-resources). When a user is granted app access via role-based access control (RBAC) or coadministrator permissions, they can use their user-level credentials until access is revoked. Don't share these credentials with other Azure users.

* **App-level credentials**: One set of credentials for each app. These credentials can be used to deploy to that app only. The credentials for each app are generated automatically at app creation. They can't be configured manually, but can be reset anytime. To grant a user access to app-level credentials via RBAC, that user must have **Contributor** level or higher permissions on the app (including the built-in **Website Contributor** role). Readers aren't allowed to publish, and can't access those credentials.
