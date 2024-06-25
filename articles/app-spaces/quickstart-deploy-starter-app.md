---
title: Deploy a starter app with App Spaces
description: Learn how to deploy a starter app to create a web application with App Spaces.
ms.service: app-spaces
ms.topic: quickstart
ms.author: msangapu
author: msangapu-msft
ms.date: 05/20/2024
zone_pivot_groups: app-spaces-frontend-backend
#customer intent: As a new cloud developer, I want to learn how to create a web application with App Spaces.
---

# Quickstart: Deploy a starter app with App Spaces

[!include [preview note](./includes/preview-note.md)]

[App Spaces](https://go.microsoft.com/fwlink/?linkid=2234200) is an intelligent service for developers that reduces the complexity of creating and managing web apps. This article describes how to deploy a starter app to App Spaces. You select one of the samples provided to provision new resources on Azure. For more information, see [About App Spaces](overview.md). 

## Prerequisites

To deploy a sample app for App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/). You can only deploy with a subscription that you own.
- [GitHub account](https://github.com/)

## Select a starter app

While Express.JS (back end) and React (front end) apps are used in this quickstart, other starter apps are also available in App Spaces. See [App Spaces in the Azure portal](https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotTemplateGallery.ReactView) for a full list of starter apps in App Spaces.

Follow these steps to deploy a starter app to App Spaces. 

1. Browse to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for **app spaces** and select it in the results.
:::image type="content" source="media/azure-portal-search-app-spaces.png" alt-text="Screenshot of App Space in Azure portal.":::
1. In the *App Spaces page*, select **+ Create App Space**.

::: zone pivot="frontend"  
4. Under *Use a starter app*, select **React App**.

## Connect to GitHub

- Enter the following values in the *Connect to GitHub* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Enter `myReactSample` for your new repository. |

## Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myAppSpace`. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The sample web application code deploys to App Spaces. The deployment can take a few minutes to complete.

[!include [deployment note](./includes/provision-text-swa.md)]
::: zone-end  
::: zone pivot="backend"  
4. Under *Use a starter app*, select **Express.JS App**.
## Connect to GitHub

- Enter the following values in the *Connect to GitHub* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Enter `myExpressSample` for your new repository. |

## Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myAppSpace`. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The sample web application code deploys to App Spaces. The deployment can take a few minutes to complete.

[!include [deployment note](./includes/provision-text-aca.md)]
::: zone-end  

## Verify deployment

In your *App Space Page*, select **Open app in browser** to view your new app.

::: zone pivot="frontend"  
:::image type="content" source="media/verify-deployment-react.png" alt-text="Screenshot of React app running.":::
::: zone-end
::: zone pivot="backend"  
:::image type="content" source="media/verify-deployment-express.png" alt-text="Screenshot Express.JS app running.":::
::: zone-end

## Clean up resources
[!include [deployment note](./includes/clean-up-resources.md)]

For more information about managing App Spaces, see [Manage components](how-to-manage-components.md).

## Related content

- [App Spaces overview](overview.md)
- [Deploy your app with App Spaces](quickstart-deploy-your-app.md)
