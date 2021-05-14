---
title: Azure Static Web Apps plans
description: Compare and contrast the different Azure Static Web Apps plans.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 05/14/2021
ms.author: cshoe
---

# Azure Static Web Apps plans

Azure Static Web Apps is available through two different plans, free and standard.

See the [pricing page for Standard plan costs](https://azure.microsoft.com/pricing/details/app-service/static/).

## Features

| Feature | Free plan <br> (For personal projects) | Standard plan <br> (For production apps) |
| --- | --- | --- |
| Web hosting | ✔ | ✔ |
| GitHub integration | ✔ | ✔ |
| Azure DevOps integration | ✔ | ✔ |
| Globally distributed static content | ✔ | ✔ |
| Free, automatically renewing SSL certificates | ✔ | ✔ |
| Staging environments | 3 per app | 10 per app |
| Max app size | 250 MB per app | 500 MB per app |
| Custom domains | 2 per app | 5 per app |
| APIs via Azure Functions | Managed | Managed or<br>Bring your own Functions app |
| Authentication provider integration | Pre-configured<br>(service defined) | Custom registrations |
| Service Level Agreement (SLA) | None  | ✔ |

## Selecting a plan

The following scenarios can help you decide if the Standard plan best fits your needs.

- Expected traffic volumes exceed 100 GB per month.
- The existing Azure Functions app you want to use either has triggers and bindings beyond just HTTP endpoints, or can't be converted to a managed Functions app.
- Security requirements that require a custom provider registration.
- The site's web assets total file size exceed the storage maximums.
- You require formal customer support.
- You require more than 3 staging environments.

## Changing plans

You can move between Free or Standard plans via the Azure portal.

1. Navigate to your Static Web Apps resource in the Azure portal.

1. Under the _Settings_ menu, select **Hosting plan**.

1. Select the hosting plan you want for your static web app.

1. Select **Save**.
