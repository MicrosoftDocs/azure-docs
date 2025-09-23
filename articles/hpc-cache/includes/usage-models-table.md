---
ms.service: azure-hpc-cache
ms.topic: include
ms.date: 02/16/2024
author: ronhogue
ms.author: rohogue
# Customer intent: "As a cloud architect, I want to understand the caching modes and their configurations in an HPC environment, so that I can optimize data access and performance for high-performance computing applications."
---

| Usage model | Caching mode | Verification timer | Write-back timer |
|--|--|--|--|
| Read-only caching <!--READ_ONLY-->| Read | 30 seconds | None |
| Read-write caching <!--READ_WRITE-->| Read/write | 8 hours | 1 hour |
