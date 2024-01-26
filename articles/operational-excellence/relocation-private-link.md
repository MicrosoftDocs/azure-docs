---
title: Relocation guidance for Azure Private Link
titleSufffix: Azure Private Link
description: Find out about relocation guidance for Azure Private Link
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/26/2024
ms.service: private-link
ms.topic: conceptual
ms.custom:
  - subject-relocation
---

# Relocate Azure Private Link to another region

This article shows you how to relocate [Azure Private Link](/azure/private-link/private-link-overview) when moving a Platform as a Service (PaaS) service, such as Azure Storage or SQL Database, to another region. 


## Relocate Azure Private Link Service


1. Redeploy all dependent resources that are used by the Private Link service, such as Application Insights, log storage, etc.

1. Redeploy the source Log Analytics Workspace by following the guidance in [Relocate Azure Monitor - Log Analytics Workspace to another region](./relocation-log-analytics.md).

1. Give the new reference used in the parameter file of Private Link service:

  - Mark the location as global.
  - Rename the name of the private link used in the `deploy.json`` file as per parameter file changed name.

1. Trigger the Push Pipeline for a successful relocation.

1. Configure your DNS settings by following guidance in [Private DNS zone values](../private-link/private-endpoint-dns.md)

:::image type="content" source="media/relocation/consumer-provider-endpoint.png" alt-text="Diagram that illustrates relocation process for Private Link service.":::

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
