---
title: Troubleshoot Azure Data Explorer cluster connection failures
description: This article describes troubleshooting steps for connecting to a cluster in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Troubleshoot: Failure to connect to a cluster in Azure Data Explorer

If you're not able to connect to a cluster in Azure Data Explorer, follow these steps.

1. Ensure the connection string is correct. It should be in the form: `https://<ClusterName>.<Region>.kusto.windows.net`, such as the following example:  `https://docscluster.westus.kusto.windows.net`.

1. Ensure you have adequate permissions. If you don't, you'll get a response of *unauthorized*.

    For more information about permissions, see [Manage database permissions](manage-database-permissions.md). If necessary, work with your cluster administrator so they can add you to the appropriate role.

1. Verify that the cluster hasn't been deleted: review the activity log in your subscription.

1. Check the [Azure service health dashboard](https://azure.microsoft.com/status/). Look for the status of Azure Data Explorer in the region where you're trying to connect to a cluster.

    If the status isn't **Good** (green check mark), try connecting to the cluster after the status improves.

1. If you still need assistance solving your issue, please open a support request in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).