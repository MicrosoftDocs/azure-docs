---
title: Manage components in App Spaces
description: Learn how to manage App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: how-to
ms.date: 05/20/2024
zone_pivot_groups: app-spaces-component-types
---

# Manage components in App Spaces

You can manage the components of your App Space by selecting the component on the __App Space__ page. 

[!include [component types](./includes/component-types-table.md)]


## Deployment

Shows the app deployment details including GitHub actions workflow. 
::: zone pivot="static"
- Redeploy repeats the latest deployment.
- Workflow run allows you to view the GitHub actions 
- View commit
::: zone-end
::: zone pivot="app"
Deployment info for app component.
::: zone-end
::: zone pivot="database"
Deployment info for database.
::: zone-end



## Logs

Service-level events, or console logs to debug code. 

::: zone pivot="static"

For more information, see [Enable a framework extension for Application Insights JavaScript SDK](https://go.microsoft.com/fwlink/?linkid=2269911).
::: zone-end
::: zone pivot="app"
For more information, see [View log streams in Azure Container Apps](https://go.microsoft.com/fwlink/?linkid=2259026).
::: zone-end
::: zone pivot="database"
Logs info for database.
::: zone-end


## Metrics

::: zone pivot="static"
metrics info for static app component.
::: zone-end
::: zone pivot="app"
metrics info for app component.
::: zone-end
::: zone pivot="database"
metrics info for database.
::: zone-end

## Settings


::: zone pivot="static"
settings info for static app component.

|Section| Name | Description |
|-------|------|-------------|
|General | Component name | App Space component name |
|Domains | Domain | App Space domain name |
|Routes | - | [Route rules allow you to restrict access to users in specific roles or perform actions such as redirect or rewrite](../static-web-apps/configuration.md#routes). |
|Authentication | - | Setup an authentication provider to authenticate users who visit your site. Once authenticated, users can be authorized by the GET roles API which will return which roles have been assigned to the user. The paths and APIs that each role has access to are determined by the routes which you defined above.|
::: zone-end
::: zone pivot="app"
settings info for app component.
::: zone-end
::: zone pivot="database"
settings info for database.
::: zone-end


## Info

::: zone pivot="static"
This tab shows the following details:

| Name | Description |
|------|-------------|
|URL | App URL |
|Location | App region |
|Resource group | App's resource group |
|Pricing | [Pricing details](https://go.microsoft.com/fwlink/?linkid=2260405) |
|Repository|Component's GitHub repo|
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|
::: zone-end
::: zone pivot="app"
info for app component.
ACA info link: https://go.microsoft.com/fwlink/?linkid=2261690

This tab shows the following details:

| Name | Description |
|------|-------------|
|URL | App URL |
|Location | App region |
|Resource group | App's resource group |
|Pricing | Pricing details |
|Repository|Component's GitHub repo|
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|
::: zone-end
::: zone pivot="database"
info for database.
DB info link: https://go.microsoft.com/fwlink/?linkid=2261690

| Name | Description |
|------|-------------|
|URL | App URL |
|Resource group | App's resource group |
|Pricing | Pricing details |
|Location | App region |
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|

::: zone-end




## Related articles

- [App Spaces overview](overview.md)
- [Deploy a starter app in App Spaces](quickstart-deploy-starter-app.md)
- [Deploy your app in App Spaces](quickstart-deploy-your-app.md)
