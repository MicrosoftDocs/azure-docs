---
title: PostgreSQL least privilege configuration
description: Helps detect migration blockers and compatibility issues when moving PostgreSQL databases to Azure Database for PostgreSQL Flexible Server, ensuring a smooth and successful cloud transition.
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 08/01/2025
ms.custom: engagement-fy24 
# Customer intent: Customers want to ensure a smooth migration of PostgreSQL databases to Azure by identifying blockers, compatibility issues, and required configuration changes.
---

# PostgreSQL migration sssessment for Azure: Identify compatibility issues and blockers

The asessment rules help identify compatibility issues and migration blockers when moving PostgreSQL instances to Azure Database for PostgreSQL Flexible Server. These rules evaluate your source environment for resource constraints, feature compatibility, security requirements, and configuration differences. Findings are categorized as Issues (blockers requiring resolution) or Warnings (items needing attention but not blocking migration). This assessment helps ensure a successful migration by highlighting necessary changes to database configurations, applications, and architecture.