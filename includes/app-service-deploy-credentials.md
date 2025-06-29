---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 04/20/2020
ms.author: cephalin
---

- **User-scope credentials** provide a user with one set of deployment credentials for their entire Azure account. A user who is granted app access via role-based access control (RBAC) or coadministrator permissions can use their user-level credentials until access is revoked.

  You can use your user-scope credentials to deploy any app to App Service via local Git or FTP/S in any subscription that your Azure account has permission to access. You don't share these credentials with other Azure users.

- **App-scope credentials** provide one set of credentials per app, which can be used to deploy that app only. The app-scope credentials for each app are generated automatically during app creation and can't be configured manually, but they can be reset anytime.

  A user must have at least **Contributor** level permissions on an app, including the built-in **Website Contributor** role, to be granted access to app-level credentials via RBAC. **Reader** role can't publish and can't access these credentials.
