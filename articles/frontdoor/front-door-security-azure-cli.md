---
title: Set up security for Azure Front Door with the Azure CLI
description: Learn how to create a security policy that you can use to apply WAF policies and protect your web apps against vulnerabilities and malicious bots.
ms.topic: sample
author: duau
ms.author: duau
ms.service: frontdoor
ms.date: 10/14/2021
ms.custom: devx-track-azurecli

---

# Set up security for Azure Front Door with the Azure CLI

Many web applications have experienced a rapid increase of traffic in recent weeks because of COVID-19. These web applications are also experiencing a surge in malicious traffic, including denial-of-service attacks. There's an effective way to both scale out your application for traffic surges and protect yourself from attacks: configure Azure Front Door with Azure WAF as an acceleration, caching, and security layer in front of your web app. This article provides guidance on how to get Azure Front Door with Azure WAF configured for any web app that runs inside or outside of Azure.

We'll be using the Azure CLI to configure the WAF in this tutorial. You can accomplish the same thing by using the Azure portal, Azure PowerShell, Azure Resource Manager, or the Azure REST APIs.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
> - Create a Front Door.
> - Create a security policy.
> - Create an Azure WAF policy.
> - Configure rule sets for a WAF policy.
> - Associate a WAF policy with Front Door.
> - Configure a custom domain.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]