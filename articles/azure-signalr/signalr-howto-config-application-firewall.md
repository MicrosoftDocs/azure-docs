---
title: SignalR Application Firewall (Preview)
description: An introduction about why and how to setup Application Firewall for Azure SignalR service
author: vicancy
ms.service: signalr
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/29/2023
ms.author: lianwei
---
# Application Firewall for Azure SignalR Service

Application Firewall brings more sophisticated control over client connections over a distributed system. In this doc,  typical scenarios are  demonstrated to show how Application Firewall rules work and how to configure them. Before that, let's clarify what Application Firewall don't do:

1. It's not intended to replace Authentication. The firewall works behind the client conenction authentication layer.
2. It's not related to the network layer access control. 


## Regenerate access keys


