---
title: Azure Monitor agent overview
description: T
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Azure Monitor agent overview (preview)
The Azure Monitor Agent (AMA) is the 


## Relation to other agents
As part of an effort to consolidate and simplify the approach to data collection in Azure Monitor, we are introducing a new concept for data collection configuration and a new, unified agent for Azure Monitor. In this preview state there are limited types of data that can be collected and limited destinations where the data can be sent, but the capabilities improve on a few key areas of data collection from VMs in Azure Monitor:

- Scoping – the new capabilities make it possible to collect different sets of data from different scopes of VMs and send all that data into one workspace.
- Linux multi-homing – the new Linux agent can send the same or different data to multiple workspaces.
- Windows event filtering – the new configuration method uses XPATH queries for defining which Windows events are collected, providing a much more robust filter language than the existing options in the workspace Advanced Settings.
- Improved extension management – the new agent moves to a new method of handling extensibility that is more transparent and controllable than the management of Management Packs and Linux plug-ins in the current Log Analytics agents.



## Next steps

