---
title: Integrate Application Insights to developer portal
titleSuffix: Azure API Management
description: Learn how to integrate Application Insights into your managed or self-hosted developer portal.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Integrate Application Insights to developer portal

A popular feature of Azure Monitor is Application Insights. It's an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your developer portal and detect performance anomalies. Application Insights includes powerful analytics tools to help you learn what users actually do while visiting your developer portal.

## Add Application Insights to your portal

Follow these steps to plug Application Insights into your managed or self-hosted developer portal.

> [!IMPORTANT]
> Steps 1 and 2 are not required for managed portals. If you have a managed portal, skip to step 4.

1. Set up a [local environment](developer-portal-self-host.md#step-1-set-up-local-environment) for the latest release of the developer portal.

1. Install the **npm** package to add [Paperbits for Azure](https://github.com/paperbits/paperbits-azure):

    ```console
    npm install @paperbits/azure --save
    ```

1. In the `startup.publish.ts` file in the `src` folder, import and register the Application Insights module:

    ```typescript
    import { AppInsightsPublishModule } from "@paperbits/azure";
    ...
    injector.bindModule(new AppInsightsPublishModule());
    ```

1. Retrieve the portal's configuration:

    ```http
    GET /contentTypes/document/contentItems/configuration
    ```

    ```json
    {
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
    ```

1. Extend the site configuration from the previous step with Application Insights configuration:

    ```http
    PUT /contentTypes/document/contentItems/configuration
    ```

    ```json
    {
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
    ```

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Automate portal deployments](automate-portal-deployments.md)
- [Self-host the developer portal](developer-portal-self-host.md)
