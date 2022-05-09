---
title: TBD | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Identify use cases (some info pulled from blog)

https://www.microsoft.com/security/blog/2021/08/18/migrating-content-from-traditional-siems-to-azure-sentinel/ 

Use the following guidance to identify your use cases.
* What’s the scope? Do you want to migrate all use cases, or use some prioritization criteria?
* What use cases are effective? A good starting place is to look at which detections have produced results within the last year (false positive versus positive rate). 
* What are the business priorities that affect use case migration? What are the biggest risks to your business? What type of issues put your business most at risk?
* Prioritize by use case characteristics.
    * Consider setting lower and higher priorities. Our recommendation is to focus on detections that would enforce 90 percent true positive on alert feeds, while use cases that cause a high false positive might be a lower priority for your business.
    * Select use cases that justify rule migration in terms of business priority and efficacy:
        * Review rules that haven’t triggered any alerts in the last 6 to 12 months.
        * Eliminate low-level threats or alerts you routinely ignore.
* Prepare a validation process. Define test scenarios and build a test script.
* Can you apply a methodology to prioritize use cases? You can follow a methodology such as MoSCoW to prioritize a leaner set of use cases for migration.
