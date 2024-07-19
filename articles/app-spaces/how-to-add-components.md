---
title: Add components in App Spaces
description: Learn how to add App Spaces components in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: how-to
ms.date: 05/20/2024
zone_pivot_groups: app-spaces-add-component
---


# Add App Spaces components

[!include [preview note](./includes/preview-note.md)]

[App Spaces](https://go.microsoft.com/fwlink/?linkid=2234200) is an intelligent service for developers that reduces the complexity of creating and managing web apps. This guide shows you how to add components to an existing App Spaces app. Components can be a back-end app (Azure Container App), a front-end app (Static Web App), or a database (MariaDB, PostgreSQL, Qdrant).

[!include [component types](./includes/component-types-table.md)]

## Add components

To add a component to your App Space, on the _App Space_ page, select **+ Add component**.

::: zone pivot="custom"  

Follow these steps to add a custom app component.

### Add tab

- In the _Add_ tab, select **GitHub repository**, and select the **Next** button at the bottom of the page.

### Configure tab

#### [Container App (back end)](#tab/aca/)

1. In the _Connect to GitHub to import your repository_ section, enter the following values.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Listening port |Specify the port that your web server is listening on. External requests being made to port 80 or 443  get routed to this port internally for your application to server content from. |
    | Startup command (optional) | Under *Advanced configurations*, enter a **Startup command** or leave blank for none.|

1. In the _Configure app details_ section, enter the following values.

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

[!include [deployment note](./includes/provision-text-aca.md)]
#### [Static Web App (front end)](#tab/swa/)
1. In the _Connect to GitHub to import your repository_ section, enter the following values.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Output location (optional) | Enter the location of your build output relative to your app location. For example, a value of 'build' when your app location is set to '/app' causes the content at '/app/build' to be served. |

1. Enter the following values in the _Configured app details_ section.

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

[!include [deployment note](./includes/provision-text-swa.md)]

* * *

::: zone-end

::: zone pivot="sample"  

Follow these steps to add a sample template app.

### Add tab

1. In the _Add_ tab, select **Template**, and select the **Next** button at the bottom of the page.

1. Under _Templates_, select an app and then select the **Next** button at the bottom of the page.

### Configure tab

1. Enter the following values in the _Connect to GitHub_ section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Enter a name for your new repository. |


1. In the _Configure app details_ section, enter the following values. 

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

::: zone-end

::: zone pivot="database"  

Follow these steps to add a database component.

### Add tab

- In the _Add_ tab, select **Database**, and then select the **Next** button at the bottom of the page.

### Configure tab

1. In the _Configure_ tab, enter the following values. 

    | Setting | Action |
    |---|---|
    | Database type | Select a database type. |
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

::: zone-end

## Related content

- [App Spaces overview](overview.md)
- [Deploy an App Spaces starter app](quickstart-deploy-starter-app.md)
