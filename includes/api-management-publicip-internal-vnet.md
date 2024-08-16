---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 08/16/2024
ms.author: danlep
---

> [!IMPORTANT]
> * Starting May 2024, a public IP address resource is *no longer needed* when deploying (injecting) an API Management instance in a VNet in internal mode or migrating the internal VNet configuration to a new subnet. In external VNet mode, specifying a public IP address is *optional*; if you don't provide one, an Azure-managed public IP address is automatically configured and used for runtime API traffic. Only provide the public IP address if you want to own and control the public IP address used for inbound or outbound communication to the internet.
> * Currently, if you enable zone redundancy for an API Management instance in a VNet in either internal mode or external mode, you must specify a new public IP address. 