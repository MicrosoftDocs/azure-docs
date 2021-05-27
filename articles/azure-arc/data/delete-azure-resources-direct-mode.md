---
title: Delete Azure Arc enabled data service | Portal
description: Delete Azure Arc enabled SQL Managed Instances or PostgreSQL Hyperscale groups from the portal on a data controller that is directly connected to Azure.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 06/02/2021
ms.topic: how-to
---

# Delete Azure Arc enabled data service | Direct connect mode

When Azure Arc enabled data services is directly connected to Azure, you can delete SQL Server Managed Instances or PostgreSQL Hyperscale Server groups directly from the portal. 

> [!WARNING] 
> When you delete a data service from the portal all of the data in all of the databases that belonged to that service are permanently deleted. In addition, the data services themselves are deleted. This action is irreversible.

## Prerequisites

- An Azure Arc enabled data services deployment in direct connectivity mode.
- One or more Azure Arc enabled data services. Either:
   - Azure Arc enabled PostgreSQL Hyperscale group
   - Azure Arc enabled SQL Managed Instance

## Delete a data service from the portal

Complete the following steps to permanently delete a data service from the portal. 

1. Login to your Azure Subscription and navigate to your resource group with your Arc enabled data services.

1. Select the Arc Data controller, Azure Arc enabled SQL Managed Instance, or Postgres Hyperscale group for deletion by checking box.

1. At the top, right of the portal click the ellipses (**...**). This opens the **Delete** option. Click **Delete**.

   At this point, the portal prompts you to confirm that you are deleting resource permanently and that they can not be recovered.

1. Review the content in the portal, and if you agree, follow the instructions to confirm.

Azure deletes the resources that you specified from your Kubernetes cluster. Any databases or other objects in those resources are permanently deleted.

## See also

[Delete resources from Azure](delete-azure-resources.md)
