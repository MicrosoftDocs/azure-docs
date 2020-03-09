---
title: Configure firewall for Event Grid topics or domains
description: This article describes how to configure firewall settings for Event Grid topics or domains. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 03/09/2020
ms.author: spelluru
---

# Configure IP firewall for Event Grid topics or domains
This article describes how to configure IP firewall settings for Event Grid topics or domains.

## Use Azure portal

1. In the [Azure portal](https://portal.azure.com), Navigate to your Event Grid topic or domain, and switch to the **Networking** tab. 

    ![Networking -> Firewall](./media/configure-firewall/networking-filewall-page.png)
2. Select one of the following options. 
    
    - Select **All IP addresses** if you want the Event Grid topic or domain to be accessed from all IP addresses. This is the default value. 
    - Select the **Selected IP addresses and private endpoints** option if you want the Event Grid to be accessed from only specified IP addresses and private endpoints. Then, enter the range of IP addresses that can access the Event Grid topic or domain. 
3. Select **Save** on the toolbar. 


## Use Azure CLI

## Use PowerShell



## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
