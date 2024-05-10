---
title: Deploy a template with Azure App Spaces
description: Learn how to deploy a template to create a web application with Azure App Spaces.
ms.service: app-spaces
ms.topic: how-to
ms.author: msangapu
author: msangapu-msft
ms.date: 05/20/2024
zone_pivot_groups: app-spaces-sample
---

# Deploy a sample app with Azure App Spaces

This article describes how to deploy a sample app to Azure App Spaces. You select one of the sample templates provided to provision new resources on Azure. For more information, see [About Azure App Spaces](overview.md). 

## Prerequisites

To deploy a sample app for Azure App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/). You can only deploy with a subscription that you own.
- [GitHub account](https://github.com/)

## Deploy a sample app

Follow these steps to deploy a sample app to App Spaces. 

1. Browse to [https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotTemplateGallery.ReactView](https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotTemplateGallery.ReactView).

::: zone pivot="react"  
1. Under *Use a starter app*, select **React App**.

#### Connect to GitHub

1. Enter the following values in the *Connect to GitHub* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Eneter `myReactSample` for your new repository. |

#### Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myAppSpace`. |
    | Organization | Select your organization. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The sample web application code deploys to App Spaces. The deployment can take a few minutes to complete.

[!include [deployment note](./includes/provisioning-note-swa.md)]
::: zone-end  
::: zone pivot="vue"  
1. Under *Use a starter app*, select **Vue App**.

#### Connect to GitHub

1. Enter the following values in the *Connect to GitHub* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Eneter `myVueSample` for your new repository. |

#### Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myAppSpace`. |
    | Organization | Select your organization. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The sample web application code deploys to App Spaces. The deployment can take a few minutes to complete.
::: zone-end  
::: zone pivot="express"  
1. Under *Use a starter app*, select **Express.JS App**.
#### Connect to GitHub

1. Enter the following values in the *Connect to GitHub* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Eneter `myExpressSample` for your new repository. |

#### Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myAppSpace`. |
    | Organization | Select your organization. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The sample web application code deploys to App Spaces. The deployment can take a few minutes to complete.

[!include [deployment note](./includes/provisioning-note-aca.md)]
::: zone-end  

## Verify deployment

In your *App Space Page*, select **Open app in browser** to view your new app.

::: zone pivot="react"  
:::image type="content" source="media/verify-deployment-react.png" alt-text="Screenshot of React app running.":::
::: zone-end
::: zone pivot="vue"  
:::image type="content" source="media/verify-deployment-vue.png" alt-text="Screenshot of Vue app running.":::
::: zone-end
::: zone pivot="express"  
:::image type="content" source="media/verify-deployment-express.png" alt-text="Screenshot Express.JS app running.":::
::: zone-end

For more information about managing App Spaces, see [Manage components](quickstart-deploy-web-app.md#manage-components).

## Related articles

- [App Spaces overview](overview.md)
- [Deploy a web app with App Spaces](quickstart-deploy-custom-web-app.md)
