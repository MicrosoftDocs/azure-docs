---
title: Security guidelines for least privilege accounts for Azure Migrate
description: Azure Migrate appliance discovers on-premises servers, collects metadata, and supports workload analysis with secure, least-privilege access.
ms.topic: conceptual
author: habibaum
ms.author: v-uhabiba
ms.manager: molir
ms.service: azure-migrate
ms.date: 05/29/2025
ms.custom: engagement-fy24

# Security guidelines for least privilege accounts for Azure Migrate

Azure Migrate Appliance is a lightweight appliance used by Azure Migrate: Discovery and Assessment uses to discover on-premises servers and send their configuration and performance metadata to Azure. It also performs software inventory, agentless dependency analysis, and discovers workloads like web apps and SQL Server instances and databases. To use these capabilities, users add server and guest credentials in the Appliance Config Manager. For security and efficiency, we recommend following the principle of least privilege to reduce potential risks.

 