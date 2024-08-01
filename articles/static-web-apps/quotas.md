---
title: Quotas in Azure Static Web Apps
description: Learn about quotas associated with Azure Static Web Apps
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 05/30/2024
ms.author: cshoe
---

# Quotas in Azure Static Web Apps

Subscription limits:

| Feature                             | Free plan   | Standard plan | Dedicated plan (Preview) |
|-------------------------------------|-------------|---------------|--------------------------|
| Included bandwidth (per month)      | 100 GB      | 100 GB        | 100 GB                   |
| Overage bandwidth                   | Unavailable | $0.20 per GB  | $0.20 per GB             |
| Apps                                | 10          | 100           | 1                        |

If you need more apps on the Standard plan, contact Azure Support.

App limits:

| Feature                             | Free plan   | Standard plan | Dedicated plan (Preview) |
|-------------------------------------|-------------|---------------|--------------------------|
| [Preview environments][3]           | 3           | 10            | 10                       |
| Total storage (all environments)    | 500 MB      | 2 GB          | 2 GB                     |
| Storage (single environment)        | 250 MB      | 500 MB        | 500 MB                   |
| File count                          | 15,000      | 15,000        | 15,000                   |
| [Custom domains][1]                 | 2           | 5             | 5                        |
| [Private endpoint][4]               | Unavailable | 1             | 1                        |
| Allowed IP range restrictions       | Unavailable | 25            | 25                       |
| [Authorization (custom roles)][2]   |             |               |                          |
| &nbsp;&nbsp;&nbsp;&nbsp;via invitations | 25 | 25 | 25 |
| &nbsp;&nbsp;&nbsp;&nbsp;via serverless functions | Unavailable | Unlimited | Unlimited |
| Request Size Limit                  | 30 MB       | 30 MB         | 30 MB                    |

## GitHub storage

GitHub Actions and Packages use GitHub Storage, which has its own set of quotas. When you create an Azure Static Web Apps site, GitHub stores the artifacts for your site even after deployment.

See the following resources for more detail:

- [Managing Actions storage space](https://github.community/t5/GitHub-Actions/Managing-Actions-storage-space/td-p/38944)
- [About billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions#about-billing-for-github-actions)
- [Managing your spending limit for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-your-spending-limit-for-github-actions)

## Next steps

- [Azure Static Web Apps overview](overview.md)

<!-- Links -->
[1]: custom-domain.md
[2]: authentication-custom.md#manage-roles
[3]: preview-environments.md
[4]: private-endpoint.md
