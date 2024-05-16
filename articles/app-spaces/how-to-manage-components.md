---
title: Manage components in App Spaces
description: Learn how to manage App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: how-to
ms.date: 05/20/2024
---

# Manage app component

You can manage the components of your App Space by selecting the component on the __App Space__ page. 




## Deployment

Shows the app deployment details in App Space. Here you can view the GitHub actions workflow


#### [Static App Component (Frontend app)](#tab/static-app-component/)

- Redeploy repeats the latest deployment.
- Workflow run allows you to view the GitHub actions 
- View commit

* * *





## Logs

Service-level events, or console logs to debug code. 


## Metrics

## Settings

## Info

#### [App Component](#tab/app-component/)
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
#### [Static App Component](#tab/static-app-component/)
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

#### [Database](#tab/database/)
| Name | Description |
|------|-------------|
|URL | App URL |
|Resource group | App's resource group |
|Pricing | Pricing details |
|Location | App region |
|Branch|GitHub branch|
|Subscription|Azure subscription|
|Resource name|App space internal name|

* * *



Component name
Listening port

#### Environment variables

### Info

- URL
- Location
- Subscription
- Resource name
- Repository
- Resource group
- Pricing (goes to a generic page)



which provides information and options, based on the Azure service you're using to deploy your web application. Select the following tab associated with the Azure service.

#### [Container Apps](#tab/container-apps/)

The following table shows the components tabs that you can select, which allow you to view information and perform tasks for your App Space.

|Hosting tab  |Actions | 
|---------|---------|
|**Secrets**     | Add a secret. Enter `Key` and `Value`, and then select **Apply**.  |
|**Container details**   | View container information, like name, image source, registry, and resource allocation.     |
|**Environment variables** | Add an environment variable. Enter `Name` and `Value` of manually entered or referenced secret, and then select **Apply**.        |
|**Log Stream**    | View logs.        |
|**Deployment**   |  View deployment name, status, and time for code deployment logs.|

The following image shows an example of the Hosting tab, Container details selection.

:::image type="content" source="media/hosting-container-details.png" alt-text="Screenshot showing Hosting tab with Container details selection.":::

In the Monitoring tab, you can view Log Analytics workspace information like the subscription and  resource group used for your App Space, and region.

#### [Static Web Apps](#tab/static-web-apps/)

The following table shows the components tabs that you can select, which allow you to view information and perform tasks for your App Space.

|Hosting tab  |Actions | 
|---------|---------|
|**Environments**   | View production and preview environment name, branch, last update time, and status.   |
| **Environment variables**  |Add an environment variable. Enter `Name` and `Value` , and then select **Apply**.    |
| **Backend & API**   |Bring your own API backends. Enter `Environment Name`, `Backend Type`, `Backend Resource Name`, and `Link`, and then select **Apply**.|
|**Deployment**     | View deployment name, status, and time for code deployment logs.      |


* * *

For more advanced configuration options, select **Go to advanced view**.

:::image type="content" source="media/select-go-to-advanced-view.png" alt-text="Screenshot showing red box around button, Go to advanced view for App Space.":::

You can also view the essentials for your Container Apps Environment and Managed Identities on the **Additional** tab. This view is hidden by default.


## Related articles

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](deploy-app-spaces-template.md)
