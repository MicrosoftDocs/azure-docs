---
title: Quotas in Azure Static Web Apps Preview
description: Learn about quotas associated with Azure Static Web Apps Preview
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 05/08/2020
ms.author: cshoe
---

# Quotas in Azure Static Web Apps Preview

The following quotas exist for Azure Static Web Apps Preview.

> [!IMPORTANT]
> Azure Static Web Apps is in public preview and is not intended for production use.

| Feature                     | Free plan        |
|-----------------------------|------------------|
| Included bandwidth          | 100 GB per month |
| Overage bandwidth           | Unavailable      |
| Apps per Azure subscription | 10               |
| App size                    | 100 MB           |
| Pre-production environments | 1                |
| Custom domains              | 1                |
| Authorization<br><br>With custom roles and routing rules | Max 25 end-users invited and assigned roles |
| Azure Functions             | Available        |
| SLA                         | None             |

## GitHub storage

GitHub Actions and Packages use GitHub Storage, which has its own set of quotas. When you create an Azure Static Web Apps site, GitHub stores the artifacts for your site even after deployment.

See the following resources for more detail:

- [Managing Actions storage space](https://github.community/t5/GitHub-Actions/Managing-Actions-storage-space/td-p/38944)
- [About billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions#about-billing-for-github-actions)
- [Managing your spending limit for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-your-spending-limit-for-github-actions)

## Next steps

- [Overview](overview.md)
