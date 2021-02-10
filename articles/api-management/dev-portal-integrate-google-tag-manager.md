---
title: Integrate Google Tag Manager
titleSuffix: Azure API Management
description: Learn how to plug Google Tag Manager into your managed or self-hosted developer portal.
author: erikadoyle
ms.author: apimpm
ms.date: 02/09/2021
ms.service: api-management
ms.topic: how-to
---

# Integrate Google Tag Manager

Google Tag Manager is a tag management system created by Google. You can use it to manage JavaScript and HTML tags used for tracking and analytics on websites. For example, you can use Google Tag Manager to integrate Google Analytics, heatmaps, or chatbots like LiveChat.

## Add Google Tag Manager to your portal

Follow the steps below to plug Google Tag Manager into your managed or self-hosted developer portal.

> [!IMPORTANT]
> Steps 1 and 2 are not required for managed portals. If you have a managed portal, skip to step 3.

1. Install the **npm** package to add [Paperbits for Google Tag Manager](https://github.com/paperbits/paperbits-gtm):

    ```sh
    npm install @paperbits/gtm --save
    ```

1. In the `startup.publish.ts` file in the `src` folder, import and register the GTM module:

    ```typescript
    import { GoogleTagManagerPublishModule } from "@paperbits/gtm/gtm.publish.module";
    ...
    injector.bindModule(new GoogleTagManagerPublishModule());
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

1. Extend the site configuration from the previous step with Google Tag Manager configuration:

    ```http
    PUT /contentTypes/document/contentItems/configuration
    ```

    ```json
    {
        "nodes": [
            {
                "site": { ... },
                "integration": {
                    "googleTagManager": {
                        "containerId": "GTM-..."
                    }
                }
            }
        ]
    }
    ```

## Next steps

- [Move from managed to self-hosted](dev-portal-move-managed-self-hosted.md)