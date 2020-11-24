---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management service for developers and DevOps professionals. Use it to monitor your developer portal and detect performance anomalies. Application Insights includes powerful analytics tools to help you understand what users actually do while visiting your developer portal.

Follow the steps below to plug Application Insights into your managed or self-hosted developer portal.

## 1. Add Azure package

**This step is not required for managed portals.**

Install *npm* package:
```sh
npm install @paperbits/azure --save
```

Import and register Application Insights module in `stratup.publish.ts`:
```ts
import { AppInsightsPublishModule } from "@paperbits/azure";
...
injector.bindModule(new AppInsightsPublishModule());
```

## 2. Fetch site configuration

Retrieve the portal's configuration.

`GET /contentTypes/document/contentItems/configuration`

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

## 3. Extend site configuration

Extended the configuration from the previous step with Application Insights configuration.

`PUT /contentTypes/document/contentItems/configuration`

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