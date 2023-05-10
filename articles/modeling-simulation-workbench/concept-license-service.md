---
title: Azure Modeling and Simulation Workbench license service
description: Overview of Azure Modeling and Simulation Workbench license service component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the license service component.
---

# Azure Modeling and Simulation Workbench license service

## License service - an introduction

Engineering design tools are widely used across industries to enable design teams to run their flows efficiently. Many these proprietary software requires licenses. FlexLM is the most commonly used license manager, and we have integrated license management via FlexLM in our flows. For each deployed chamber within the workbench, we set up a license server and expose the FlexLM HostID's to procure licenses.

Users request tool licenses for the specific HostID. Once the license file is received from the tool vendor, users can then import that to kick off the license service from the Azure portal.  

For silicon EDA, our service automation deploys license servers for each of the four common software vendors (Synopsys, Cadence, Siemens and Ansys) as part of resource creation, to enable multi-vendor flows.  

The workbench also supports license service beyond these common EDA tool vendors with some manual configuration.

This flow is extendible and can include other software vendors as well across industry verticals.  

## Next steps

- [What's Next - How to manage chamber licenses](./howtoguide-licenses.md)

Choose an article to know more:

- [Workbench](./concept-workbench.md)

- [User Personas](./concept-user-personas.md)

- [Chamber](./concept-chamber.md)

- [Connector](./concept-connector.md)

- [Data Pipeline](./concept-data-pipeline.md)
