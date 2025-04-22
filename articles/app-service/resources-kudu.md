---
title: Kudu service overview
description: Learn about the engine that powers continuous deployment in App Service and its features.
author: msangapu-msft
ms.author: msangapu
ms.date: 03/17/2021
ms.topic: reference
---

# Kudu service overview

Kudu is the engine behind some features in [Azure App Service](overview.md) that are related to source-control-based deployment and other deployment methods, like Dropbox and OneDrive sync.

## Access Kudu for your app

Anytime you create an app, App Service creates a companion app for it that's secured by HTTPS. This Kudu app is accessible at these URLs:

- App not in the Isolated tier: `https://<app-name>.scm.azurewebsites.net`
- Internet-facing app in the Isolated tier (App Service Environment): `https://<app-name>.scm.<ase-name>.p.azurewebsites.net`
- Internal app in the Isolated tier (App Service Environment for internal load balancing): `https://<app-name>.scm.<ase-name>.appserviceenvironment.net`

For more information, see [Accessing the Kudu service](https://github.com/projectkudu/kudu/wiki/Accessing-the-kudu-service).

## Kudu features

Kudu gives you helpful information about your App Service app, such as:

- App settings
- Connection strings
- Environment variables
- Server variables
- HTTP headers

It also provides features like these:

- Run commands in the [Kudu console](https://github.com/projectkudu/kudu/wiki/Kudu-console).
- Download IIS diagnostic dumps or Docker logs.
- Manage IIS processes and site extensions.
- Add deployment webhooks for Windows apps.
- Allow ZIP deployment UI with `/ZipDeploy`.
- Generate [custom deployment scripts](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script).
- Allow access with a [REST API](https://github.com/projectkudu/kudu/wiki/REST-API).

## RBAC permissions required to access Kudu

To access Kudu in the browser by using Microsoft Entra authentication, you need to be assigned an appropriate built-in or custom role over the scope of the application. The assigned role must include permission for the `Microsoft.Web/sites/publish/Action` resource provider operation. The following table shows example built-in roles that include this permission.

| Role type | Example built-in roles | 
|-|-|
| Job function roles | [Website Contributor](../role-based-access-control//built-in-roles/web-and-mobile.md#website-contributor)<br/>[Logic Apps Standard Developer (Preview)](../role-based-access-control//built-in-roles/integration.md#logic-apps-standard-developer-preview)  |
| Privileged administrator roles<sup>1</sup> | [Owner](../role-based-access-control//built-in-roles/privileged.md#owner)<br/>[Contributor](../role-based-access-control//built-in-roles/privileged.md#contributor) |

<sup>1</sup> Privileged administrator roles grant much more permission than is needed to access Kudu. If need to create a new role assignment, consider if a job function role with less access can be used instead.

See the [role-based access control overview](../role-based-access-control/overview.md) to learn more about creating role assignments.

## More resources

Kudu is an [open-source project](https://github.com/projectkudu/kudu). It has documentation on the [Kudu wiki](https://github.com/projectkudu/kudu/wiki).
