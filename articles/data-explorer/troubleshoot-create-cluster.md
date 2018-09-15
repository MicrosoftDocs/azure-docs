---
title: Failure to create a cluster in Azure Data Explorer
description: This article describes troubleshooting steps for creating a cluster in Azure Data Explorer.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
services: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Troubleshoot: Failure to create a cluster in Azure Data Explorer

In the unlikely event that cluster creation fails in Azure Data Explorer, follow these steps.

1. Verify that you are a member of either the *Contributor* or *Owner* roles for the Azure subscription in which you're trying to create the cluster. If necessary, work with your subscription administrator so they can add you to the appropriate role.

1. Ensure that there are no validation errors related to the cluster name you entered under **Create cluster** in the Azure portal.

1. Check the [Azure service health dashboard](https://azure.microsoft.com/en-us/status/>). Look for the status of Azure Data Explorer in the region where you're trying to create the cluster.

    If the status isn't **Good** (green check mark), try creating the cluster after the status improves.

1. If you still need assistance solving your issue, please open a support request in the [Azure portal](https://ms.portal.azure.com/#).

## Next steps

[Measure cluster health](measure-cluster-health.md).