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
ms.date: 10/05/2021
---


# Data Access Design - In Dataset and Datastore Services

## Data access



<!-- The following questions and diagram describe the logic used in these layers when determining if data can be accessed:

* Network - Is the storage reachable over the public internet, or can you only reach it from a VNet?

    * If the storage is **publicly reachable**, move to the **Identity** section for further steps.
    * If the storage can only be **reached in a VNet**, does the workspace have a private endpoint that is in the VNet and allowed subnets for the storage?
   
        * If not, then __access is denied__.
        * If so, move to the **Identity** section for further steps.

* Identity - What is the identity used to make the request?

    * If the storage can only be **accessed in a VNet**, was the request made using a managed identity?

        * If not, then __access is denied__.
        * If so, determine the type of storage being used and move to the **Azure RBAC** section for further steps.

    * If the storage is __publicly accessible__, determine the type of storage being used and move to the **Azure RBAC** section for further steps.

* Azure RBAC - Is the identity authorized to perform the requested access?

    * Azure SQL Database, Azure PostgreSql, Azure MySQL - Does the identity have __Reader__ permission to the database, and __Reader__ permission on the database?
    * Azure Data Lake Gen1 and Gen2 - Does the reader have permission to the data lake and the correct ACL permission (file path specific)?
    * Azure Blob and Azure File - Does the identity have __Reader__ permission to the storage account and __Reader__ permission to the container?

    For all the above storage options, if __no__, then __access is denied__. Otherwise, access is granted. -->

Data access is complex and it is important to recognize that there are many pieces to it. In general, data access involves the following checks:

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

### Elements Of Data Access



![Data Access Call Flow Chart](dataAccessFlow.PNG)


## Current Limitations

1. We claim the firewall section on a storage account to not be supported. This section is used to specifically allowlist certain IP addresses for the storage. Since AML services is what accesses the storage resource, we would need to allowlist this IP, but it is not documented and also not stable. The customer would have to allowlist a wide-range IP, which is less secure, so we do not recommend it.
2. In an Azure SQL Server, there is a setting where the user can set "Deny public network access" to "yes" or "no". We do not support access to the sql server when it is set to "yes", meaning all access has to go through a private endpoint. A request from our service always has to be through a public endpoint, and there is no exception on the sql server that will allow just our services.

## Vnet/Subnet Logic Update

Currently, during a request that accesses storage, we validate that the client subnet is in the allowed subnets of the storage account. The storage resource can allow subnets in two ways, service endpoints (connection is through a public IP) and private endpoints (connection is through a private IP).

Service endpoints are enabled on the subnet level, and direct access to the storage will not work for a different subnet in the same vnet. Private link resources are enabled on the vnet level, so accessing storage directly from anywhere in the vnet via a private link will work.

We want to update our logic to reflect this, as it is too strict to verify that the user is in the same subnet as the private link resource.

- For any service endpoint on the storage, we verify the subnet
- For any private endpoint on the storage, we verify the vnet

For a storage resource with a combination of service and private endpoints, we will verify that the client is in the subnets of the SEs OR in the vnets of the PEs. If a private endpoint is in vnet A and a service endpoint is in subnet A within vnet A, we will only verify that the incoming IP is in vnet A.
