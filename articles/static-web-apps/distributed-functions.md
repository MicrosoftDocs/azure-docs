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

Enable distributed functions on your Static Web Apps to enable dynamic distribution of your Static Web Apps' managed functions to regions of high request load. Distributed functions replicate your managed functions 
to regions close to your users to ensure minimal network latency and optimized application performance for your users. Distributed functions are only available on the [Standard hosting plan](plans.md).

When a Static Web Apps with distributed functions gets high levels of backend traffic to a region other than your main functions region, Static Web Apps distributes your managed functions to this new region and direct traffic accordingly.
Distributed functions can help reduce your network latency by up to 70%. Decreased network latency leads to improved performance and responsiveness of web applications with global audiences. Distributed functions can also improve application performance when quick response times are needed for responsive personalization, routing or authorization. 
Distributed functions apply to the production environment of your Static Web Apps resource.

> [!NOTE]
> Distributed functions is not currently compatible with Next.js hybrid rendering sites

# Enable distributed functions

Before enabling distributed functions, ensure that you have a Standard hosting plan Static Web Apps resource with managed functions.

To enable distributed functions for your Static Web Apps resource, use the following steps:

1. Open your static web app in the Azure portal.
   
1. From the Settings section, select APIs.

1. Check the box labeled **Distributed functions**.

1. Select **Confirm**.

# Next steps

> [!div class="nextstepaction"]
> [Use preview environments](preview-environments.md)
