---
title: Troubleshoot the Azure RTOS security module 
description: Troubleshoot working with Azure Security Center for IoT Azure RTOS security module .
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/06/2020
ms.author: mlottner
---



# Azure RTOS IoT security module troubleshooting guide 

In the event you have unexpected or unexplained errors, use the following troubleshooting methods to attempt to resolve your issues. Reach out to the Azure Security Center for IoT product team for assistance as needed. 

In this troubleshooting guide you'll learn how to:

> [!div class="checklist"]
> * View the module logs
> * Learn how to enable/disable the baseline checks
> * Restart the Azure RTOS IoT security module

## View Azure RTOS IoT security module logs

- To view the iot_security_module logs, use this command:

```sudo journalctl -u iot_security_module | tail -n 200
```

## Enable and disable RTOS IoT security module baseline checks

Follow these steps to enable/disable the baseline checks:
1.	Edit the baseline configuration file located at /var/iot_security_module/baseline_conf.json.
    1. You can enable/disable a group of checks by changing the enable field of the group. You can also enable/disable a specific check by changing the enable field of that specific check. 
2.	Restart the iot_security_module using the following command:

```sudo systemctl restart iot_security_module
```

- To initiate a new baseline report, restart the iot_security_module using the following command: 

```sudo systemctl restart iot_security_module
```


## Next steps

- Read the Azure Security Center for IoT Azure RTOS security module [Overview](iot-security-azure-rtos.md)
- Learn more about Azure Security Center for IoT Azure RTOS security module [concepts](concept-rtos-security-module.md)

