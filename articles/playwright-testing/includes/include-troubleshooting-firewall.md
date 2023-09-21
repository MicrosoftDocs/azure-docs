---
title: "Include file"
description: "Include file"
ms.custom: "include file"
ms.topic: "include"
ms.date: 09/27/2023
---

### Unable to test web applications hosted behind firewall

Ensure that you set the `exposeNetwork` option in the `playwright.service.config.ts` file to make the network available on the client machine to the cloud browser. Example values for this option are: `<loopback>` for the localhost network, `*` to expose all networks, or the IP address/DNS of the application endpoint.

Learn how more about how to [test locally deployed applications](../how-to-test-local-applications.md).
