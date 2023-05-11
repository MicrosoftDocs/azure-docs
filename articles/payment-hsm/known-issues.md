---
title: Azure Payment HSM known issues
description: Azure Payment HSM known issues
services: payment-hsm
author: msmbaldwin

tags: azure-resource-manager
ms.service: payment-hsm
ms.workload: security
ms.topic: article
ms.date: 03/10/2023
ms.author: mbaldwin
---

# Azure Payment HSM known issues

This article describes some known issues with Azure Payment HSM.

## The PayShield fan is running too fast

Sporadic problems have been observed with the PS10K HSM, where the error log indicates that one of the fans is running too fast. Once this error has been observed, it's replicated once every 24 hours to the unit's error log. The error is benign and doesn't affect the HSMs operational functionalities. Clearing the specific error entry from the HSM involves a hard-reboot to the unit. The fan error problem will be fixed with Thales payShield firmware release version v1.8a and 1.6a.  See details in [Thales support portal KB0026952](https://supportportal.thalesgroup.com/csm?sys_kb_id=6fe423cec319259063ec26359901310c&id=kb_article_view&sysparm_rank=1&sysparm_tsqueryId=18143570dba96d544f917828f496190c&sysparm_article=KB0026952).

If Azure Payment HSM customers observe the fan too fast error and want to do a hard-reboot to the unit, contact Microsoft support.

## Next steps

- Learn more about [Azure Payment HSM](overview.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
