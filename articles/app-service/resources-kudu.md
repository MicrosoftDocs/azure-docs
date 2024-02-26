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

To access Kudu in the browser by using Microsoft Entra authentication, you need to be a member of a built-in or custom role.

If you're using a built-in role, you must be a member of Website Contributor, Contributor, or Owner. If you're using a custom role, you need the resource provider operation: `Microsoft.Web/sites/publish/Action`.

## More resources

Kudu is an [open-source project](https://github.com/projectkudu/kudu). It has documentation on the [Kudu wiki](https://github.com/projectkudu/kudu/wiki).
