---
title: Network data security
titleSuffix: Azure Machine Learning
description: Learn how network traffic flows between components when your Azure Machine Learning workspace is in a secured virtual network.
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

Accessing data in Azure Machine Learning relies on the following three layers:

* **Physical access** - Can you actually get to where the data is stored? For example, if the data is secured in a virtual network (VNet) that is not accessible from the public internet, you cannot get to the data unless you (or Azure Machine Learning in this case) have access to the VNet.
* **Authentication** - Access to the data must be authenticated. Azure Active Directory (Azure AD) is used to authenticate identities (users, service principals, managed identities, etc.)
* **Authorization** - Authorization is handled using Azure role-based access control (Azure RBAC). You can control access to resources by creating roles that have specific access levels. For example, read but not write. Identities from Azure AD are then assigned to the roles to grant access to the data store.

The following questions and diagram describe the logic used in these layers when determining if data can be accessed:

* Physical access - Is the storage reachable over the public internet, or can you only reach it from a VNet?

    * If the storage is **publicly reachable**, move to the **Identity** section for further steps.
    * If the storage can only be **reached in a VNet**, does the workspace have a private endpoint that is in the VNet and allowed subnets for the storage?
   
        * If not, then __access is denied__.
        * If so, move to the **Identity** section for further steps.

* Authentication - What is the identity used to make the request?

    * If the storage can only be **accessed in a VNet**, was the request made using a managed identity?

        * If not, then __access is denied__.
        * If so, determine the type of storage being used and move to the **authorization** section for further steps.

    * If the storage is __publicly accessible__, determine the type of storage being used and move to the **authorization** section for further steps.

* Authorization - Is the identity authorized to perform the requested access?

    * Azure SQL Database, Azure PostgreSql, Azure MySQL - Does the identity have __Reader__ permission to the database, and __Reader__ permission on the database?
    * Azure Data Lake Gen1 and Gen2 - Does the reader have permission to the data lake and the correct ACL permission (file path specific)?
    * Azure Blob and Azure File - Does the identity have __Reader__ permission to the storage account and __Reader__ permission to the container?

    For all the above storage options, if __no__, then __access is denied__. Otherwise, access is granted.

### Elements Of Data Access

Data access is complex and it is important to recognize that there are many pieces to it.

1. Who is accessing? (identity)
   - There are multiple different types of authentication including account key, service principal, msi, user identity, etc
   - If user identity, then it is important to know *which* user is trying to access storage
2. Do they have permission? (RBAC)
   - Are the credentials correct? And if so, does the service principal, or msi, etc, have the necessary RBAC permission on the storage?
   - Reader of the storage account reads metadata of the storage
   - Storage Blob Data Reader reads data within a blob container
   - Contributor allows write access to a storage account
   - More types of roles depending on the type of storage
3. Where is access from? (network)
   - User: Does the user IP address lie in a vnet/subnet range?
   - Workspace: Is the workspace public or does it have a private link to a vnet/subnet?
   - Storage: Does the storage allow public access, or does it restrict access through a service endpoint (public link) or a private endpoint (private link)?
4. What operation is being performed? (CRUD op vs data access op)
   - CRUD calls just access the Azure document DB for our service
   - Data Access calls (preview, quick profile, schema, etc) go to the underlying storage and need additional permissions
5. Where is this operation being run? (Compute vs our machines)
   - For all calls to dataset and datastore services except full profile, we use our own machines to run the operations
   - Jobs, including a full profile, run on a customer compute and access the data from there, so the compute identity needs permission to the storage rather than the user

Since the interaction of the elements can be complex, this diagram shows the general flow of a data access call. The assumption here is that a user is trying to make a data access call through a machine learning workspace, and not involving any compute.

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
