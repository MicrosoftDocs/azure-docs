---
title: Add components to App Spaces
description: Learn how to add components to Azure App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: how-to
ms.date: 05/20/2024
---

# Add Azure App Space components

To add a component to your App Space, select **+ Add component** on the _App Space_ page.

#### [Custom app](#tab/custom-app/)

Follow these steps to add a custom app component.

### Add tab

1. In the _Add_ tab, select **GitHub repository** and select the **Next** button at the bottom of the page.

### Configure tab

#### [Container App](#tab/custom-app/aca/)

1. Enter the following values in the _Connect to GitHub to import your repository_ section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Listening port | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Startup command | Under *Advanced configurations* enter a **Startup command** or leave blank for none.|


1. Enter the following values in the _Configure app details_ section.

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

[!include [deployment note](./includes/provisioning-note-aca.md)]
#### [Static Web App](#tab/custom-app/swa/)
1. Enter the following values in the _Connect to GitHub to import your repository_ section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Output location | Enter the location of your build output relative to your app location. For example, a value of 'build' when your app location is set to '/app' will cause the content at '/app/build' to be served. |

1. Enter the following values in the _Configure app details_ section.

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

[!include [deployment note](./includes/provisioning-note-swa.md)]
* * *


#### [Sample app](#tab/sample-web-app/)

Follow these steps to add an app component from a template.

### Add tab

1. In the _Add_ tab, select **Template** and select the **Next** button at the bottom of the page.

1. Under _Templates_, select an app and then select the **Next** button at the bottom of the page.

### Configure tab

1. Enter the following values in the _Connect to GitHub_ section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | New repository | Enter a name for your new repository. |


1. Enter the following values in the _Configure app details_ section.

    | Setting | Action |
    |---|---|
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

#### [Database](#tab/database/)

Follow these steps to add a database component.

### Add tab

1. In the _Add_ tab, select **Database** and then click the **Next** button at the bottom of the page.

### Configure tab

1. Enter the following values in the _Configure_ tab.

    | Setting | Action |
    |---|---|
    | Database type | Select a database type. |
    | Component name | Enter a name for your component. |

1. Select the **Add** button at the bottom of the page.

* * *

## Related articles

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](deploy-app-spaces-template.md)
