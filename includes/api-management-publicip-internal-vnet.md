---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/02/2024
ms.author: danlep
---

> [!IMPORTANT]
> Starting May 2024, configuring a public IP address is *optional* when deploying (injecting) an API Management instance in a VNet in internal mode or updating the VNet configuration with a new subnet. If you do not configure one, an Azure-managed public IP address is configured for you and used only for Azure internal management operations. In external mode, configuring a public IP address is *required* for runtime API traffic. 