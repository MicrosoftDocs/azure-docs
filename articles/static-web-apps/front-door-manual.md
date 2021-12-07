---
title: "Tutorial: Manually configure Azure Front Door for Azure Static Web Apps"
description: Learn set up Azure Front Door for Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 09/20/2021
ms.author: cshoe
---

# Tutorial: Manually configure Azure Front Door for Azure Static Web Apps

Learn to add [Azure Front Door](../frontdoor/front-door-overview.md) as the CDN for your static web app.  Azure Front Door is a scalable and secure entry point for fast delivery of your web applications.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure Front Door instance
> - Associate Azure Front Door with your Azure Static Web Apps site

> [!NOTE]
> This tutorial requires the Azure Static Web Apps Standard plan.

## Copy URL

1. Navigate to the Azure portal.

1. Open the static web app that you want to apply Azure Front Door.

1. Go to the *Overview* section.

1. Copy the *URL* to your clipboard for later use.

## Add Azure Front Door

1. Navigate to the Azure portal.

1. Select **Create a resource**.

1. Search for **Azure Front Door**.

1. Select **Front Door**.

    Make sure not to select the service labeled *Front Door Standard/Premium* as the steps for the Standard/Premium service differ from what's presented in this tutorial.

1. Select **Create**.

1. In the *Basics* tab, enter the following values:

    | Setting | Value |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Enter a resource group name. This name is often the same group name used by your static web app. |
    | Resource group location | If you create a new resource group, enter the location nearest you. |

    Select **Next: Configuration >**.

1. In the *Configuration* tab, select the **plus sign** next to *Frontends/domains*, and enter the following value:

    | Setting | Value |
    |---|---|
    | Host name | Enter a unique name for your Front Door host. |

    Accept the defaults for the rest of the form, and select **Add**.

1. Select the **plus sign** next to *Backend pools*, and enter the following value:

    | Setting | Value |
    |---|---|
    | Name | Enter **my-static-web-app-pool**. |

1. Select **+ Add a backend**, and enter the following values:

    | Setting | Value |
    |---|---|
    | Backend host type | Select **Custom host**. |
    | Backend host name | Enter the hostname of your static web app. Make sure your value does not include a trailing slash or protocol. (For example, `desert-rain-04056.azurestaticapps.net`)  |
    | Backend host header | Enter the hostname of your static web app. Make sure your value does not include a trailing slash protocol. (For example, `desert-rain-04056.azurestaticapps.net`) |

    Accept the defaults for the rest of the form, and select **Add**.

1. Select **Add**.

1. Select the **plus sign** next to *Routing rule*, and enter the following value:

    | Setting | Value |
    |---|---|
    | Name | Enter **my-routing-rule**. |

    Accept the defaults for the rest of the form, and select **Add**.

1. Select **Review + create**.

1. Select **Create**.

    The creation process may take a few minutes to complete.

1. Select **Go to resource**.

1. Select **Overview**.

1. Select the link labeled *Frontend host*.

    When you select this link, you may see a 404 error if the site is not fully propagated. Instead of refreshing the page, wait a few minutes and return back to the *Overview* window and select the link labeled *Frontend host*.

1. From the *Overview* window, copy the value labeled **Front Door ID** and paste it into a file for later use.

> [!IMPORTANT]
> By default, Azure Front Door configures [health probes](../frontdoor/front-door-health-probes.md) that may affect your traffic statistics. You may want to edit the default values for the [health probes](../frontdoor/front-door-health-probes.md).

## Update static web app configuration

To complete the integration with Front Door, you need to update the application configuration file to:

- Restrict traffic to your site only through Front Door
- Restrict traffic to your site only from your Front Door instance
- Define which domains can access your site

Open the [staticwebapp.config.json](configuration.md) file for your site and make the following changes.

1. Restrict traffic to only use Front Door by adding the following section to the configuration file:

    ```json
    "networking": {
      "allowedIpRanges": ["AzureFrontDoor.Backend"]
    }
    ```

1. To define which Azure Front Door instances and domains can access your site, add the `forwardingGateway` section.

    ```json
    "forwardingGateway": {
      "requiredHeaders": {
        "X-Azure-FDID" : "<YOUR-FRONT-DOOR-ID>"
      },
      "allowedForwardedHosts": [
        "my-sitename.azurefd.net"
      ]
    }
    ```

    First, configure your app to only allow traffic from your Front Door instance. In every backend request, Front Door automatically adds an `X-Azure-FDID` header that contains your Front Door instance ID. By configuring your static web app to require this header, it will restrict traffic exclusively to your Front Door instance. In the `forwardingGateway` section in your configuration file, add the `requiredHeaders` section and define the `X-Azure-FDID` header. Replace `<YOUR-FRONT-DOOR-ID>` with the *Front Door ID* you set aside earlier.

    Next, add the Azure Front Door hostname (not the Azure Static Web Apps hostname) into the `allowedForwardedHosts` array. If you have custom domains configured in your Front Door instance, also include them in this list.

    In this example, replace `my-sitename.azurefd.net` with the Azure Front Door hostname for your site.

With this configuration, your site is no longer available via the generated `*.azurestaticapps.net` hostname, but exclusively through the hostnames configured in your Front Door instance.

> [!NOTE]
> When you deploy updates to existing files in your static web app, Azure Front Door may continue to serve older versions of your files until their [time-to-live](https://wikipedia.org/wiki/Time_to_live) expires. [Purge the Azure Front Door cache](../frontdoor/front-door-caching.md#cache-purge) for the affected paths to ensure the latest files are served.

Now that Front Door is managing your site, you no long use the Azure Static Web Apps custom domain feature. Azure Front Door has a separate process for adding a custom domain. Refer to [Add a custom domain to your Front Door](../frontdoor/front-door-custom-domain.md). When you add a custom domain to Front Door, you'll need to update your static web app configuration file to include it in the `allowedForwardedHosts` list.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](apis.md)
