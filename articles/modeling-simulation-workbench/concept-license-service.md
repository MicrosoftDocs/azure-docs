---
title: "License service: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench license service component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the license service component.
---

# License service: Azure Modeling and Simulation Workbench

A license service automates the installation of a license manager to help customers accelerate their engineering design.  A license service is integrated into Azure Modeling and Simulation Workbench.

## Overview

Engineering design tools are widely used across industries to enable design teams to run their flows efficiently. Many of these proprietary software programs require licenses. License management is integrated into our flows via the most commonly used license manager, FLEXlm.

Here's how the license service works:

- For each deployed chamber within the workbench, we set up a license server and expose the FLEXlm HostID's to procure licenses.
- Users request tool licenses for the specific HostID.
- Once the license file is received from the tool vendor, users import it to enable the license service.

## Additional information

For silicon EDA, our service automation deploys license servers for each of the four common software vendors (Synopsys, Cadence, Siemens, and Ansys) as part of resource creation to enable multi-vendor flows. The workbench also supports license service beyond these common EDA tool vendors with some manual configuration.

This flow is extendible and can also include other software vendors across industry verticals."

## Next steps

- [Manage users in Azure Modeling and Simulation Workbench](./how-to-guide-manage-users.md)
