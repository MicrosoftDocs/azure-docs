---
title: Quotas in Azure Static Web Apps
description: Learn about quotas associated with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 02/09/2023
ms.author: cshoe
---

# Quotas in Azure Static Web Apps

The following quotas exist for Azure Static Web Apps.

| Feature                     | Free plan        | Standard plan |
|-----------------------------|------------------|---------------|
| Included bandwidth          | 100 GB per month, per subscription | 100 GB per month, per subscription |
| Overage bandwidth           | Unavailable      | $0.20 per GB |
| Apps per Azure subscription | 10               | Unlimited |
| Storage | • 500 MB max for all staging and production environments<br><br>• 250 MB max per app | • 2 GB max for all staging and production environments<br><br>• 500 MB max per app |
| Pre-production environments | 3                | 10 |
| Custom domains              | 2 per app        | 5 per app |
| Allowed IP ranges           | Unavailable      | 25 |
| Authorization (built-in roles) | Unlimited end-users that may authenticate with built-in `authenticated` role | Unlimited end-users that may authenticate with built-in `authenticated` role |
| Authorization (custom roles) | Maximum of 25 end-users that may belong to custom roles via [invitations](authentication-custom.md#manage-roles) | Maximum of 25 end-users that may belong to custom roles via [invitations](authentication-custom.md#manage-roles), or unlimited end-users that may be assigned custom roles via [serverless function](authentication-custom.md#manage-roles) |
| Request Size Limit | 30 MB               | 30 MB |
| File count         | 15,000              | 15,000|

## GitHub storage

GitHub Actions and Packages use GitHub Storage, which has its own set of quotas. When you create an Azure Static Web Apps site, GitHub stores the artifacts for your site even after deployment.

See the following resources for more detail:

- [Managing Actions storage space](https://github.community/t5/GitHub-Actions/Managing-Actions-storage-space/td-p/38944)
- [About billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions#about-billing-for-github-actions)
- [Managing your spending limit for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-your-spending-limit-for-github-actions)

## Next steps

- [Azure Static Web Apps overview](overview.md)
