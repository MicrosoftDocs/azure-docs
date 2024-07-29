---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/13/2024
ms.author: danlep
---

> [!IMPORTANT]
> * Starting May 2024, a public IP address is *no longer needed* when deploying (injecting) an API Management instance in a VNet in internal mode or migrating the internal VNet configuration to a new subnet. In external VNet mode, specifying a public IP address is *optional*; if you don't provide one, an Azure-managed public IP address is automatically configured. In external VNet mode, the public IP address is used for runtime API traffic. 
> * Currently, if you enable zone redundancy for an API Management instance in a VNet in either internal mode or external mode, you must specify a new public IP address. 