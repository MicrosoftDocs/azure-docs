---
author: dlepow
ms.service: azure-api-management
ms.custom:
  - build-2024
  - build-2025
ms.topic: include
ms.date: 04/25/2025
ms.author: danlep
---

## Limitation for custom domain name in Standard v2 tier

Currently, in the Standard v2 tier, API Management requires a publicly resolvable DNS name to allow traffic to the Gateway endpoint. If you configure a custom domain name for the Gateway endpoint, that name must be publicly resolvable, not restricted to a private DNS zone. 

As a workaround in scenarios where you limit public access to the gateway and you configure a private domain name, you can set up Application Gateway to receive traffic at the private domain name and route it to the API Management instance's Gateway endpoint. For an example architecture, see this [GitHub repo](https://github.com/Azure/agw-pep-custom-names).