---
author: grrlgeek
ms.service: azure-arc
ms.topic: include
ms.date: 05/27/2022
ms.author: jeschult
---

### Upgrade path

Our image tag version scheme is `<Major>.<Minor>.<optional:revision>_<optional: tag>`.

Upgrades are limited to the next incremental minor or major version. For example:

- Supported version upgrades:
    - 1.1 -> 1.2
    - 1.3 -> 2.0
- Unsupported version upgrades:
    - 1.1 -> 1.4 Not supported because one or more minor versions are skipped.

Additionally, all SQL Managed Instances deployed on the data controller must be at the same version as the data controller before upgrading the data controller.
