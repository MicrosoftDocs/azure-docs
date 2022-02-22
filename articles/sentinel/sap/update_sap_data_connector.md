---
title: Update SAP data connector | Microsoft Docs
description: Update SAP data connector
author: MSFTandrelom
ms.author: andrelom
ms.topic: reference
ms.date: 03/02/2022
---

# Update SAP data connector

If you have a Docker container already running with an earlier version of the SAP data connector, run the SAP data connector update script to get the latest features available.

Make sure that you have the most recent versions of the relevant deployment scripts from the Microsoft Sentinel github repository. 

Run:

```azurecli
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated. 

Be sure to check for any other available updates, such as:

- Relevant SAP change requests, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR).
- Microsoft Sentinel SAP security content, in the **Microsoft Sentinel Continuous Threat Monitoring for SAP** solution.
- Relevant watchlists, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists).
