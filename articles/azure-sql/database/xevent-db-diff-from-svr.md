---
title: Extended events
description: Describes extended events (XEvents) in Azure SQL Database, and how event sessions differ slightly from event sessions in Microsoft SQL Server.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: MightyPen
ms.author: genemi
ms.reviewer: jrasnik
ms.date: 12/19/2018
---
# Extended events in Azure SQL Database 
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

[!INCLUDE [sql-database-xevents-selectors-1-include](../../../includes/sql-database-xevents-selectors-1-include.md)]

The feature set of extended events in Azure SQL Database is a robust subset of the features on SQL Server and Azure SQL Managed Instance.

*XEvents* is an informal nickname that is sometimes used for 'extended events' in blogs and other informal locations.

Additional information about extended events is available at:

- [Quick Start: Extended events in SQL Server](/sql/relational-databases/extended-events/quick-start-extended-events-in-sql-server)
- [Extended Events](/sql/relational-databases/extended-events/extended-events)

## Prerequisites

This topic assumes you already have some knowledge of:

- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/)
- [Extended events](/sql/relational-databases/extended-events/extended-events)

- The bulk of our documentation about extended events applies to SQL Server, Azure SQL Database, and Azure SQL Managed Instance.

Prior exposure to the following items is helpful when choosing the Event File as the [target](#AzureXEventsTargets):

- [Azure Storage service](https://azure.microsoft.com/services/storage/)

- [Azure PowerShell with Azure Storage](/powershell/module/az.storage/)

## Code samples

Related topics provide two code samples:

- [Ring Buffer target code for extended events in Azure SQL Database](xevent-code-ring-buffer.md)

  - Short simple Transact-SQL script.
  - We emphasize in the code sample topic that, when you are done with a Ring Buffer target, you should release its resources by executing an alter-drop `ALTER EVENT SESSION ... ON DATABASE DROP TARGET ...;` statement. Later you can add another instance of Ring Buffer by `ALTER EVENT SESSION ... ON DATABASE ADD TARGET ...`.

- [Event File target code for extended events in Azure SQL Database](xevent-code-event-file.md)

  - Phase 1 is PowerShell to create an Azure Storage container.
  - Phase 2 is Transact-SQL that uses the Azure Storage container.

## Transact-SQL differences

- When you execute the [CREATE EVENT SESSION](/sql/t-sql/statements/create-event-session-transact-sql) command on SQL Server, you use the **ON SERVER** clause. But on Azure SQL Database you use the **ON DATABASE** clause instead.
- The **ON DATABASE** clause also applies to the [ALTER EVENT SESSION](/sql/t-sql/statements/alter-event-session-transact-sql) and [DROP EVENT SESSION](/sql/t-sql/statements/drop-event-session-transact-sql) Transact-SQL commands.

- A best practice is to include the event session option of **STARTUP_STATE = ON** in your **CREATE EVENT SESSION**  or **ALTER EVENT SESSION** statements.
  - The **= ON** value supports an automatic restart after a reconfiguration of the logical database due to a failover.

## New catalog views

The extended events feature is supported by several [catalog views](https://msdn.microsoft.com/library/ms174365.aspx). Catalog views tell you about *metadata or definitions* of user-created event sessions in the current database. The views do not return information about instances of active event sessions.

| Name of<br/>catalog view | Description |
|:--- |:--- |
| **sys.database_event_session_actions** |Returns a row for each action on each event of an event session. |
| **sys.database_event_session_events** |Returns a row for each event in an event session. |
| **sys.database_event_session_fields** |Returns a row for each customize-able column that was explicitly set on events and targets. |
| **sys.database_event_session_targets** |Returns a row for each event target for an event session. |
| **sys.database_event_sessions** |Returns a row for each event session in the database. |

In Microsoft SQL Server, similar catalog views have names that include *.server\_* instead of *.database\_*. The name pattern is like **sys.server_event_%**.

## New dynamic management views [(DMVs)](https://msdn.microsoft.com/library/ms188754.aspx)

Azure SQL Database has [dynamic management views (DMVs)](https://msdn.microsoft.com/library/bb677293.aspx) that support extended events. DMVs tell you about *active* event sessions.

| Name of DMV | Description |
|:--- |:--- |
| **sys.dm_xe_database_session_event_actions** |Returns information about event session actions. |
| **sys.dm_xe_database_session_events** |Returns information about session events. |
| **sys.dm_xe_database_session_object_columns** |Shows the configuration values for objects that are bound to a session. |
| **sys.dm_xe_database_session_targets** |Returns information about session targets. |
| **sys.dm_xe_database_sessions** |Returns a row for each event session that is scoped to the current database. |

In Microsoft SQL Server, similar catalog views are named without the *\_database* portion of the name, such as:

- **sys.dm_xe_sessions**, instead of name<br/>**sys.dm_xe_database_sessions**.

### DMVs common to both

For extended events there are additional DMVs that are common to Azure SQL Database, Azure SQL Managed Instance, and Microsoft SQL Server:

- **sys.dm_xe_map_values**
- **sys.dm_xe_object_columns**
- **sys.dm_xe_objects**
- **sys.dm_xe_packages**

<a name="sqlfindseventsactionstargets" id="sqlfindseventsactionstargets"></a>

## Find the available extended events, actions, and targets

You can run a simple SQL **SELECT** to obtain a list of the available events, actions, and target.

```sql
SELECT
        o.object_type,
        p.name         AS [package_name],
        o.name         AS [db_object_name],
        o.description  AS [db_obj_description]
    FROM
                   sys.dm_xe_objects  AS o
        INNER JOIN sys.dm_xe_packages AS p  ON p.guid = o.package_guid
    WHERE
        o.object_type in
            (
            'action',  'event',  'target'
            )
    ORDER BY
        o.object_type,
        p.name,
        o.name;
```

<a name="AzureXEventsTargets" id="AzureXEventsTargets"></a> &nbsp;

## Targets for your Azure SQL Database event sessions

Here are targets that can capture results from your event sessions on Azure SQL Database:

- [Ring Buffer target](https://msdn.microsoft.com/library/ff878182.aspx) - Briefly holds event data in memory.
- [Event Counter target](https://msdn.microsoft.com/library/ff878025.aspx) - Counts all events that occur during an extended events session.
- [Event File target](https://msdn.microsoft.com/library/ff878115.aspx) - Writes complete buffers to an Azure Storage container.

The [Event Tracing for Windows (ETW)](https://msdn.microsoft.com/library/ms751538.aspx) API is not available for extended events on Azure SQL Database.

## Restrictions

There are a couple of security-related differences befitting the cloud environment of Azure SQL Database:

- Extended events are founded on the single-tenant isolation model. An event session in one database cannot access data or events from another database.
- You cannot issue a **CREATE EVENT SESSION** statement in the context of the **master** database.

## Permission model

You must have **Control** permission on the database to issue a **CREATE EVENT SESSION** statement. The database owner (dbo) has **Control** permission.

### Storage container authorizations

The SAS token you generate for your Azure Storage container must specify **rwl** for the permissions. The **rwl** value provides the following permissions:

- Read
- Write
- List

## Performance considerations

There are scenarios where intensive use of extended events can accumulate more active memory than is healthy for the overall system. Therefore Azure SQL Database dynamically sets and adjusts limits on the amount of active memory that can be accumulated by an event session. Many factors go into the dynamic calculation.

If you receive an error message that says a memory maximum was enforced, some corrective actions you can take are:

- Run fewer concurrent event sessions.
- Through your **CREATE** and **ALTER** statements for event sessions, reduce the amount of memory you specify on the **MAX\_MEMORY** clause.

### Network latency

The **Event File** target might experience network latency or failures while persisting data to Azure Storage blobs. Other events in Azure SQL Database might be delayed while they wait for the network communication to complete. This delay can slow your workload.

- To mitigate this performance risk, avoid setting the **EVENT_RETENTION_MODE** option to **NO_EVENT_LOSS** in your event session definitions.

## Related links

- [Using Azure PowerShell with Azure Storage](/powershell/module/az.storage/).
- [Azure Storage Cmdlets](https://docs.microsoft.com/powershell/module/Azure.Storage)
- [Using Azure PowerShell with Azure Storage](/powershell/module/az.storage/)
- [How to use Blob storage from .NET](../../storage/blobs/storage-quickstart-blobs-dotnet.md)
- [CREATE CREDENTIAL (Transact-SQL)](https://msdn.microsoft.com/library/ms189522.aspx)
- [CREATE EVENT SESSION (Transact-SQL)](https://msdn.microsoft.com/library/bb677289.aspx)
- [Jonathan Kehayias' blog posts about extended events in Microsoft SQL Server](https://www.sqlskills.com/blogs/jonathan/category/extended-events/)
- The Azure *Service Updates* webpage, narrowed by parameter to Azure SQL Database:
  - [https://azure.microsoft.com/updates/?service=sql-database](https://azure.microsoft.com/updates/?service=sql-database)

<!--
('lock_acquired' event.)

- Code sample for SQL Server: [Determine Which Queries Are Holding Locks](https://msdn.microsoft.com/library/bb677357.aspx)
- Code sample for SQL Server: [Find the Objects That Have the Most Locks Taken on Them](https://msdn.microsoft.com/library/bb630355.aspx)
-->
