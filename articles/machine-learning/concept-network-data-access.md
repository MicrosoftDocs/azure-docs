---
title: Data access
titleSuffix: Azure Machine Learning
description: Learn how data access works with Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 10/13/2021
---


# Network data access with Azure Machine Learning studio

Data access is complex and it is important to recognize that there are many pieces to it. In particular, accessing data from Azure Machine Learning studio is more complex than using the SDK or CLI, as studio runs partially in your web browser. In general, data access from studio involves the following checks:

1. Who is accessing?
    - There are multiple different types of authentication including account key, service principal, managed identity, user identity, etc
    - If user identity, then it is important to know *which* user is trying to access storage
2. Do they have permission?
    - Are the credentials correct? And if so, does the service principal, or managed identity, etc, have the necessary Azure RBAC permission on the storage?
    - Reader of the storage account reads metadata of the storage
    - Storage Blob Data Reader reads data within a blob container
    - Contributor allows write access to a storage account
    - More types of roles depending on the type of storage
3. Where is access from?
    - User: Is the client IP address in the VNet/subnet range?
    - Workspace: Is the workspace public or does it have a private endpoint in a VNet/subnet?
    - Storage: Does the storage allow public access, or does it restrict access through a service endpoint or a private endpoint?
4. What operation is being performed?
    - Create, read, update, and delete (CRUD) calls on a data store or dataset are handled by Azure Machine Learning.
    - Data Access calls (preview, quick profile, schema, etc.) go to the underlying storage and need additional permissions
5. Where is this operation being run? (Compute vs our machines)
    - For all calls to dataset and datastore services except full profile, we use our own machines to run the operations
    - Jobs, including a full profile, run on a customer compute and access the data from there, so the compute identity needs permission to the storage rather than the user

The following diagram shows the general flow of a data access call. In this example, a user is trying to make a data access call through a machine learning workspace, without using any compute resource.

:::image type="content" source="./media/concept-data-access/data-access-flow.png" alt-text="Diagram of the logic flow when accessing data":::

## Current Limitations

### Azure Storage firewall

When an Azure Storage account is behind a virtual network, the storage firewall can normally be used to allow your client to directly connect over the internet. However, when using studio it is not your client that is connecting to the storage account, it is the Azure Machine Learning service that makes the request. The IP address of the service is not documented and changes frequently. For this reason, __Enabling the storage firewall will not allow studio to access the storage account in a VNet configuration__.

### Azure SQL Database

In Azure SQL Database, the __Deny public network access__ allows you to block public access to the database. We __do not support__ accessing SQL Database if this option is enabled. When using a SQL Database with Azure Machine Learning studio, the data access is always made through the public endpoint for the SQL Database.



