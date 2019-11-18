---
title: "Tutorial: Monitor Azure Spring Cloud resources using alerts and action groups | Microsoft Docs"
description: Learn how to use Spring Cloud's alerts.
author: v-gedo
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 11/18/2019

---
# Tutorial: Monitor Spring Cloud resources using alerts and action groups

Azure Spring Cloud alerts support monitoring resources based on conditions such as available storage and rates of requests or data usage. There are two steps to set up an alert pipeline: 
1. Set up an Action Group with the actions to be taken when an alert is triggered, such as email, SMS, Runbook, or Webhook. Action Groups can be re-used among different alerts.
2. Set up Alert rules. The rules bind metric patterns with the action groups based on target resource, metric, condition, time aggregation, etc.

