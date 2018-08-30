---
title: Tutorial - Create an Azure DNS alias record to refer to an Azure Public IP address.
description: This tutorial shows you how to configure an Azure DNS alias record to reference an Azure Public IP address.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 9/24/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to configure Azure an DNS alias record to refer to an Azure Public IP address.
---

# Tutorial: Configure an alias record to refer to an Azure Public IP address 

You can create an alias record for your Public IP addresses. The alias record references an Azure Public IP address instance instead of an A record. Since your alias record points to the service instance (an Azure Public IP address), the alias record seamlessly updates itself during DNS resolution. It points to the service instance, which has the actual IP address associated with it.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a host VM and network infrastructure
> * Create an alias record
> * Test the alias record


If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a host VM and network infrastructure
## Create an alias record
## Test the alias record
## Clean up resources

## Next steps

In this tutorial, you've created an alias record to refer to an Azure Public IP address. To learn about Azure DNS and web apps, continue with the tutorial for web apps.

> [!div class="nextstepaction"]
> [Create DNS records for a web app in a custom domain](./dns-web-sites-custom-domain.md)
