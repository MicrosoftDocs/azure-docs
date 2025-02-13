---
title: Azure Static Web Apps hosting plans
description: Compare and contrast the different Azure Static Web Apps hosting plans.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic:  overview
ms.date: 01/28/2025
ms.author: cshoe
---

# Azure Static Web Apps hosting plans

Azure Static Web Apps is available through three different plans, Free, Standard, and Dedicated (preview). See the [pricing page for Standard plan costs](https://azure.microsoft.com/pricing/details/app-service/static/), and Dedicated is free for a limited time. For information service level agreement details, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Features

| Feature | Free plan <br> (For personal projects) | Standard plan <br> (For production apps) | Dedicated plan (preview) |
| --- | --- | --- |---|
| Web hosting | ✔ | ✔ | ✔ |
| GitHub integration | ✔ | ✔ | ✔ |
| Azure DevOps integration | ✔ | ✔ | ✔ |
| Globally distributed static content | ✔ | ✔ | ✗ |
| Free, automatically renewing SSL certificates | ✔ | ✔ | ✔ |
| Staging environments | 3 per app | 10 per app | 20 per app |
| Max app size | 250 MB per app | 500 MB per app | 2 GB |
| Custom domains | 2 per app | 5 per app | 10 per app |
| APIs via Azure Functions | Managed | Managed or<br>[Bring your own Functions app](functions-bring-your-own.md) | Managed or<br>[Bring your own Functions app](functions-bring-your-own.md) |
| Authentication provider integration | [Preconfigured](authentication-authorization.yml)<br>(Service defined) | [Custom registrations](authentication-custom.md) | [Custom registrations](authentication-custom.md) |
| [Assign custom roles with a function](authentication-custom.md#manage-roles) | ✗ | ✔ | ✔ |
| Private endpoints | ✗ | ✔ | ✔ |
| [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/app-service-static/v1_0/) | None  | ✔ | ✔ |

## Selecting a plan

The following scenarios can help you decide if the Standard or Dedicated plan best fits your needs.

Select Standard or Dedicated when:

- Expected traffic volumes exceed bandwidth maximums.
- The existing Azure Functions app you want to use either has triggers and bindings beyond HTTP endpoints, or can't be converted to a managed Functions app.
- Security requirements that require a [custom provider registration](authentication-custom.md).
- The site's web assets total file size exceed the storage maximums.
- You require formal customer support.
- You require more than three [staging environments](review-publish-pull-requests.md).

Select the Dedicated plan when:

- Your application requires regional data residency.

See the [quotas guide](quotas.md) for limitation details.

## Changing plans

You can move between Free or Standard plans via the Azure portal.

1. Go to your Static Web Apps resource in the Azure portal.

1. Under the _Settings_ menu, select **Hosting plan**.

1. Select the hosting plan you want for your static web app.

1. Select **Save**.
