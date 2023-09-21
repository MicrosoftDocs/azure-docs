---
title: Integrate Application Insights to developer portal
titleSuffix: Azure API Management
description: Learn how to integrate Application Insights into your managed or self-hosted developer portal.
author: dlepow
ms.author: danlep
ms.date: 08/16/2022
ms.service: api-management
ms.topic: how-to
---

# Integrate Application Insights to developer portal

A popular feature of Azure Monitor is Application Insights. It's an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your developer portal and detect performance anomalies. Application Insights includes powerful analytics tools to help you learn what users actually do while visiting your developer portal.

## Add Application Insights to your portal

Follow these steps to plug Application Insights into your managed or self-hosted developer portal.

> [!IMPORTANT]
> Steps 1 -3 are not required for managed portals. If you have a managed portal, skip to step 4.

1. Set up a [local environment](developer-portal-self-host.md#step-1-set-up-local-environment) for the latest release of the developer portal.

1. Install the **npm** package to add [Paperbits for Azure](https://github.com/paperbits/paperbits-azure):

    ```console
    npm install @paperbits/azure --save
    ```

1. In the `startup.publish.ts` file in the `src` folder, import and register the Application Insights module. Add the `AppInsightsPublishModule` after the existing modules in the dependency injection container:

    ```typescript
    import { AppInsightsPublishModule } from "@paperbits/azure";
    ...
    const injector = new InversifyInjector();
    injector.bindModule(new CoreModule());
    ...
    injector.bindModule(new AppInsightsPublishModule());
    injector.resolve("autostart");
    ```

1. Retrieve the portal's configuration using the [Content Item - Get](/rest/api/apimanagement/current-ga/content-item/get) REST API:

    ```http
    GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ApiManagement/service/{api-management-service-name}/contentTypes/document/contentItems/configuration?api-version=2021-08-01
    ```
    
    Output is similar to:

    ```json
    {
        "id": "/contentTypes/document/contentItems/configuration",
        "type": "Microsoft.ApiManagement/service/contentTypes/contentItems",
          "name": "configuration",
          "properties": {
          "nodes": [
            {
                "site": {
                    "title": "Microsoft Azure API Management - developer portal",
                    "description": "Discover APIs, learn how to use them, try them out interactively, and sign up to acquire keys.",
                    "keywords": "Azure, API Management, API, developer",
                    "faviconSourceId": null,
                    "author": "Microsoft Azure API Management"
                }
            }
        ]
        }
    }
    ```

1. Extend the site configuration from the previous step with Application Insights configuration. Update the configuration using the [Content Item - Create or Update](/rest/api/apimanagement/current-ga/content-item/create-or-update) REST API. Pass the Application Insights instrumentation key in an `integration` node in the request body.


    ```http
    PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.ApiManagement/service/{api-management-service-name}/contentTypes/document/contentItems/configuration?api-version=2021-08-01
    ```

    ```json
    {
        "id": "/contentTypes/document/contentItems/configuration",
        "type": "Microsoft.ApiManagement/service/contentTypes/contentItems",
        "name": "configuration",
        "properties": {  
        "nodes": [
            {
                "site": { ... },
                "integration": {
                    "appInsights": {
                        "instrumentationKey": "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxxx"
                    }
                }
            }
        ]
        }
    }
    ```

1. After you update the configuration, [republish the portal](api-management-howto-developer-portal-customize.md#publish) for the changes to take effect.

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Automate portal deployments](automate-portal-deployments.md)
- [Self-host the developer portal](developer-portal-self-host.md)
