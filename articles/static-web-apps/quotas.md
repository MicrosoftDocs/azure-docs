---
title: Quotas in Azure Static Web Apps
description: Learn about quotas associated with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 05/08/2020
ms.author: cshoe
---

# Quotas in Azure Static Web Apps

The following quotas exist for Azure Static Web Apps.

| Feature                     | Free plan        | Standard plan |
|-----------------------------|------------------|---------------|
| Included bandwidth          | 100 GB per month, per subscription | 100 GB per month, per subscription |
| Overage bandwidth           | Unavailable      | $0.20 per GB |
| Apps per Azure subscription | 10               | Unlimited |
| App size                    | 250 MB           | 500 MB |
| Plan size                   | 500 MB max app size for a single deployment, and 0.50 GB max for all staging and production environments  | 500 MB max app size for a single deployment, and 2.00 GB max combined across all staging and production environments |
| Pre-production environments | 3                | 10 |
| Custom domains              | 2 per app        | 5 per app |
| Authorization (with custom roles and routing rules) | Maximum of 25 end-users that may belong to custom roles | Maximum of 25 end-users that may belong to custom roles |

## GitHub storage

GitHub Actions and Packages use GitHub Storage, which has its own set of quotas. When you create an Azure Static Web Apps site, GitHub stores the artifacts for your site even after deployment.

See the following resources for more detail:

- [Managing Actions storage space](https://github.community/t5/GitHub-Actions/Managing-Actions-storage-space/td-p/38944)
- [About billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions#about-billing-for-github-actions)
- [Managing your spending limit for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-your-spending-limit-for-github-actions)

## Next steps

- [Overview](overview.md)
