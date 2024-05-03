---
title: Distributed managed functions in Azure Static Web Apps (preview)
description: Configure dynamic distribution of your Static Web Apps managed functions to high request load regions.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 03/12/2024
ms.author: cshoe
---

# Distributed managed functions in Azure Static Web Apps (preview)

As requests to your APIs increase, you often want to distribute your APIs to the Azure regions getting the most demand. When you enable dynamic distribution, your API functions are automatically replicated to the regions closest to highest levels of incoming requests. For each request, Azure automatically directs traffic to the most appropriate region. Distributing your APIs reduces network latency and increases application performance and reliability of your static web app.

Distributed functions are only available on the [Standard hosting plan](plans.md).


Distributed functions can help reduce your network latency by up to 70%. Decreased network latency leads to improved performance and responsiveness of web applications with global audiences. Distributed functions can also improve application performance when quick response times are needed for responsive personalization, routing or authorization. 

Distributed functions only apply to the production environment of your static web app.

> [!NOTE]
> Distributed functions is not compatible with Next.js hybrid rendering applications.

## Enable distributed functions

Before enabling distributed functions, make sure your static web app is under the Standard hosting plan with managed functions.

Use the following steps to enable distributed functions.

1. Open your static web app in the Azure portal.
   
1. From the *Settings* section, select **APIs**.

1. Check the box labeled **Distributed functions**.

1. Select **Confirm**.

## Next steps

> [!div class="nextstepaction"]
> [Use preview environments](preview-environments.md)
