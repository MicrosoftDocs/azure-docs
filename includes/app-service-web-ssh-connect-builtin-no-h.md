---
title: "include file"
description: "include file"
services: app-service
author: cephalin
ms.service: azure-app-service
ms.topic: "include"
ms.date: 10/08/2026
ms.author: cephalin
ms.custom: "include file"
---

[!INCLUDE [Open SSH session in browser](app-service-web-ssh-connect-no-h.md)]

> [!NOTE]
> Any changes that you make outside the `/home` directory are stored in the container itself and don't persist beyond an app restart.
>

For Linux apps, you can also [open a shell in your local terminal](../articles/app-service/configure-linux-open-ssh-session.md#open-ssh-session-with-azure-cli) or [run a detached command](../articles/app-service/configure-linux-open-ssh-session.md#run-commands-without-an-interactive-session) with the preview `az webapp exec` command.
