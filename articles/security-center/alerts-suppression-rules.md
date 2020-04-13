---
title: Using alerts suppression rules for to suppress false positives or other unwanted security alerts in Azure Security Center.
description: This article explains how to use Azure Security Center's suppression rules to hide unwanted security alerts.  
author: memildin
manager: rkarlin
services: security-center
ms.author: memildin
ms.date: 04/13/2020
ms.service: security-center
ms.topic: conceptual
---

# Suppressing alerts from Azure Security Center's threat protection

The threat protection components of Azure Security Center detect threats in any area of your environment and generate security alerts.

When a single alert isn't interesting or relevant, you can dismiss it. Alternatively, use the suppression rules (preview) feature to automatically dismiss such alerts in the future. Typically, you'd use a suppression rule for:

- alerts that you know are false positives

- alerts that are being triggered too often to be useful

Your suppression rules define the criteria for which alerts should be automatically dismissed.

> [!TIP]
> Alerts that match your enabled suppression rules will still be generated, but their state will be set to **dismissed**. You can see the state in the Azure portal or however you access your Security Center security alerts.

[![Azure Security Center security alerts page with alerts suppression options](media/alerts-suppression-rules/alerts-screen-with-options.png)](media/alerts-suppression-rules/alerts-screen-with-options.png#lightbox)

## Creating a suppression rule

There are a few ways you can create rules to suppress unwanted security alerts:

- To suppress alerts at the management group level, use Azure Policy

- To suppress alerts at the subscription level, you can use the Azure portal or the REST API as explained below


### [Using the Azure portal](#tab/create-a-rule-portal)

To create a rule directly in the Azure portal.

### [Using the REST API](#tab/create-a-rule-API)

You can create, view, or delete alert suppression rules via Security Center's REST API. 

The relevant HTTP methods for suppression rules in the REST API are:

- **PUT**: To create or update a suppression rule in a specified subscription.

- **GET**:

    - To list all rules configured for a specified subscription. This method returns an array of the applicable rules.

    - To get the details of a specific rule on a specified subscription. This method returns one suppression rule.

    - To simulate the impact of a suppression rule still in the design phase. This call identifies which of your existing alerts would have been dismissed if the rule had been active.

- **DELETE**: Deletes an existing rule (but doesn't change the status of alerts already dismissed by it).



--- 




## Reviewing dismissed alerts 

To list all rules configured for a specified subscription. This method returns an array of the applicable rules.