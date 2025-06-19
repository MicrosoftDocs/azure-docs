---
title: include file
description: include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/12/2023
ms.topic: include
ms.custom: include file
ms.author: shamkh
---
```python
def get_templates_list(self):

    from azure.communication.messages import MessageTemplateClient
    message_template_client = MessageTemplateClient.from_connection_string(self.connection_string)
    # calling send() with whatsapp message details
    template_list = message_template_client.list_templates(self.channel_id)
    count_templates = len(list(template_list))
    print("Successfully retrieved {} templates from channel_id {}.".format(count_templates, self.channel_id))
```
