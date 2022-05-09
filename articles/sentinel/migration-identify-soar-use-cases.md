---
title: TBD | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Identify SOAR use cases

Sentinel provides Security Orchestration, Automation, and Response (SOAR) capabilities with automation rules to automate incident handling and response, and playbooks to run predetermined sequences of actions to response and remediate threats. Here’s what you need to think about when migrating SOAR use cases from your original SIEM.

- Use case quality. Choose good use cases for automation. Use cases should be based on procedures that are clearly defined, with minimal variation, and a very low false-positive rate. Automation should work with efficient use cases.
- Manual intervention. Automated response can have wide ranging effects and high impact automations should have human input to confirm actions before they’re taken.
- Binary criteria. To increase response success, decision points within an automated workflow should be as limited as possible, with binary criteria.  This educes the need for human intervention as, and enhances outcome predictability.
- Accurate alerts or data. Response actions are dependent on the accuracy of signals such as alerts. Alerts and enrichment sources should be reliable. Microsoft Sentinel resources such as watchlists and reliable threat intelligence can enhance reliability.
- Analyst role. While automation where possible is great, SOAR reserve more complex tasks for analysts, and provide them with the opportunity for input into workflows that require validation. In short, response automation should augment and extend analyst capabilities. 
