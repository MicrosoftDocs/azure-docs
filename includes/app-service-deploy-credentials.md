---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 06/30/2025
ms.author: cephalin
---

- **User-scope** or user-level credentials provide one set of deployment credentials for a user's entire Azure account. A user who is granted app access via role-based access control (RBAC) or coadministrator permissions can use their user-level credentials as long as they have those permissions.

  You can use your user-scope credentials to deploy any app to App Service via local Git or FTP/S in any subscription that your Azure account has permission to access. You don't share these credentials with any other Azure users. You can reset your user-scope credentials anytime.

- **App-scope** or application-level credentials are one set of credentials per app that can be used to deploy that app only. These credentials are generated automatically for each app at creation and can't be configured manually, but the password can be reset anytime.

  A user must have at least **Contributor** level permissions on an app, including the built-in **Website Contributor** role, to be granted access to app-level credentials via RBAC. **Reader** role can't publish and can't access these credentials.
