---
title: Intra-account container copy jobs
titleSuffix: Azure Cosmos DB
description: Copy container data between containers within an account in Azure Cosmos DB.
author: seesharprun
ms.author: sidandrews
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 11/30/2022
ms.custom: references_regions, ignite-2022
---

# Intra-account container copy jobs in Azure Cosmos DB (Preview)

[!INCLUDE[NoSQL, Cassandra](includes/appliesto-nosql-cassandra.md)]

You can perform offline container copy within an Azure Cosmos DB account using container copy jobs.

You may need to copy data within your Azure Cosmos DB account if you want to achieve any of these scenarios:

* Copy all items from one container to another.
* Change the [granularity at which throughput is provisioned - from database to container](set-throughput.md) and vice-versa.
* Change the [partition key](partitioning-overview.md#choose-partitionkey) of a container.
* Update the [unique keys](unique-keys.md) for a container.
* Rename a container/database.
* Adopt new features that are only supported on new containers.

Intra-account container copy jobs can be [created and managed using CLI commands](how-to-container-copy.md).

## Get started

To get started using container copy jobs, register for "Intra-account offline container copy (Cassandra & SQL)" preview from the ['Preview Features'](access-previews.md) list in the Azure portal. Once the registration is complete, the preview is effective for all Cassandra and API for NoSQL accounts in the subscription.

## Overview of steps needed to do container copy

1. Create the target Azure Cosmos DB container with the desired settings (partition key, throughput granularity, RUs, unique key, etc.).
2. Stop the operations on the source container by pausing the application instances or any clients connecting to it.
3. [Create the container copy job](how-to-container-copy.md).
4. [Monitor the progress of the container copy job](how-to-container-copy.md#monitor-the-progress-of-a-container-copy-job) and wait until it's completed.
5. Resume the operations by appropriately pointing the application or client to the source or target container copy as intended.

## How does intra-account container copy work?

Intra-account container copy jobs perform offline data copy using the source container's incremental change feed log.

* The platform allocates server-side compute instances for the Azure Cosmos DB account.
* These instances are allocated when one or more container copy jobs are created within the account.
* The container copy jobs run on these instances.
* A single job is executed across all instances at any time.
* The instances are shared by all the container copy jobs running within the same account.
* The platform may deallocate the instances if they're idle for >15 mins.

> [!NOTE]
> We currently only support offline container copy jobs. So, we strongly recommend to stop performing any operations on the source container prior to beginning the container copy. Item deletions and updates done on the source container after beginning the copy job may not be captured. Hence, continuing to perform operations on the source container while the container job is in progress may result in additional or missing data on the target container.

## Factors affecting the rate of a container copy job

The rate of container copy job progress is determined by these factors:

* Source container/database throughput setting.

* Target container/database throughput setting.

    > [!TIP]
    > Set the target container throughput to at least two times the source container's throughput.

* Server-side compute instances allocated to the Azure Cosmos DB account for performing the data transfer.

    > [!IMPORTANT]
    > The default SKU offers two 4-vCPU 16-GB server-side instances per account.

## Limitations

### Preview eligibility criteria

Container copy jobs don't work with accounts having following capabilities enabled. You will need to disable these features before running the container copy jobs.

- [Disable local auth](how-to-setup-rbac.md#use-azure-resource-manager-templates)
- [Private endpoint / IP Firewall enabled](how-to-configure-firewall.md#allow-requests-from-global-azure-datacenters-or-other-sources-within-azure). You will need to provide access to connections within public Azure datacenters to run container copy jobs.
- [Merge partition](merge.md).


### Account Configurations

- The time-to-live (TTL) setting is not adjusted in the destination container. As a result, if a document has not expired in the source container, it will start its countdown anew in the destination container.


## FAQs

### Is there an SLA for the container copy jobs?

Container copy jobs are currently supported on best-effort basis. We don't provide any SLA guarantees for the time taken to complete these jobs.

### Can I create multiple container copy jobs within an account?

Yes, you can create multiple jobs within the same account. The jobs run consecutively. You can [list all the jobs](how-to-container-copy.md#list-all-the-container-copy-jobs-created-in-an-account) created within an account and monitor their progress.

### Can I copy an entire database within the Azure Cosmos DB account?

You must create a job for each container in the database.

### I have an Azure Cosmos DB account with multiple regions. In which region will the container copy job run?

The container copy job runs in the write region. If there are accounts configured with multi-region writes, the job runs in one of the regions from the list.

### What happens to the container copy jobs when the account's write region changes?

The account's write region may change in the rare scenario of a region outage or due to manual failover. In such a scenario, incomplete container copy jobs created within the account would fail. You would need to recreate these failed jobs. Recreated jobs would then run in the new (current) write region.


## Supported regions

Currently, container copy is supported in the following regions:

| **Americas** | **Europe and Africa** | **Asia Pacific** |
| ------------ | -------- | ----------- |
| Brazil South | France Central | Australia Central |
| Canada Central | France South | Australia Central 2 |
| Canada East | Germany North | Australia East |
| Central US | Germany West Central | Central India |
| Central US EUAP | North Europe | Japan East |
| East US | Norway East | Korea Central |
| East US 2 | Norway West | Southeast Asia |
| East US 2 EUAP | Switzerland North | UAE Central |
| North Central US | Switzerland West | West India |
| South Central US | UK South | |
| West Central US | UK West  | |
| West US | West Europe |
| West US 2 | |

## Known/common issues

* Error - Owner resource doesn't exist

    If the job creation fails with the error *"Owner resource doesn't exist"*, it means that the target container wasn't created or was mis-spelt.
    Make sure the target container is created before running the job as specified in the [overview section.](#overview-of-steps-needed-to-do-container-copy)

    ```output
    "code": "404",
    "message": "Response status code does not indicate success: NotFound (404); Substatus: 1003; ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx; Reason: (Message: {\"Errors\":[\"Owner resource does not exist\"]
    ```

* Error - (Request) is blocked by your Cosmos DB account firewall settings.

    The job creation request could be blocked if the client IP isn't allowed as per the VNet and Firewall IPs configured on the account. In order to get past this issue, you need to [allow access to the IP through the Firewall setting](how-to-configure-firewall.md). Alternately, you may set **Accept connections from within public Azure datacenters** in your firewall settings and run the container copy commands through the portal [Cloud Shell](/azure/cloud-shell/quickstart?tabs=powershell).

    ```output
    InternalServerError Request originated from IP xxx.xxx.xxx.xxx through public internet. This is blocked by your Cosmos DB account firewall settings. More info: https://aka.ms/cosmosdb-tsg-forbidden
    ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```
* Error - Error while getting resources for job.

    This error can occur due to internal server issues. To resolve this issue, contact Microsoft support by raising a **New Support Request** from the Azure portal. Set the Problem Type as **'Data Migration'** and Problem subtype as **'Intra-account container copy'**.

    ```output
    "code": "500"
    "message": "Error while getting resources for job, StatusCode: 500, SubStatusCode: 0, OperationId:  xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, ActivityId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ``` 
	



## Next steps

* You can learn [how to create, monitor and manage container copy jobs within Azure Cosmos DB account using CLI commands](how-to-container-copy.md).
