---
title: Upgrading to 3.1 - Azure Monitor Application Insights Java
description: Upgrading to Azure Monitor Application Insights Java 3.1
ms.topic: conceptual
ms.date: 05/11/2021
author: MS-jgol
ms.custom: devx-track-java
ms.author: jgol
---

# Upgrading to Application Insights Java 3.1

There is one significant change from 3.0 to 3.1 that you should be aware of when upgrading.

In 3.1.0, the operation name (and the corresponding request telemetry name) is prefixed by the http method
(`GET`, `POST`, etc.), e.g.

:::image type="content" source="media/java-ipa/upgrade-to-3.1/operation-names-3-0.png" alt-text="Operation names in 3.0":::

This is different from 3.0.x, which did not prefix the operation name by the http method, e.g.

:::image type="content" source="media/java-ipa/upgrade-to-3.1/operation-names-prefixed-by-http-method.png" alt-text="Operation names prefixed by http method":::

This can affect dashboards or alerts you may have created previously.