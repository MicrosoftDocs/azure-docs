---
title: Integrate Application Insights
titleSuffix: Azure API Management
description: Learn how to integrate Application Insights into your managed or self-hosted developer portal.
author: erikadoyle
ms.author: apimpm
ms.date: 02/08/2021
ms.service: api-management
ms.topic: how-to
---

# Integrate Application Insights

A popular feature of Azure Monitor is Application Insights. It's an extensible Application Performance Management (APM) service for developers and DevOps professionals. Use it to monitor your developer portal and detect performance anomalies. Application Insights includes powerful analytics tools to help you learn what users actually do while visiting your developer portal.

## Add Application Insights to your portal

Follow the steps below to plug Application Insights into your managed or self-hosted developer portal.

> [!IMPORTANT]
> Steps 1 and 2 are not required for managed portals. If you have a managed portal, skip to step 3.

1. Install the **npm** package to add [Paperbits for Azure](https://github.com/paperbits/paperbits-azure):

    ```sh
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

- [Integrate Google Tag Manager](dev-portal-integrate-google-tag-manager.md)
