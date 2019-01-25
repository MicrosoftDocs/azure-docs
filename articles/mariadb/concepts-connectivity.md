---
title: Handling of transient connectivity errors for Azure Database for MariaDB | Microsoft Docs
description: Learn how to handle  transient connectivity errors for Azure Database for MariaDB.
keywords: mysql connection,connection string,connectivity issues,transient error,connection error
author: jan-eng
ms.author: janeng
ms.service: mariadb
ms.topic: conceptual
ms.date: 11/09/2018
---

# Handling of transient connectivity errors for Azure Database for MariaDB

This article describes how to handle transient errors connecting to  Azure Database for MariaDB.

## Transient errors

A transient error, also known as a transient fault, is an error that will resolve itself. Most typically these errors manifest as a connection to the database server being dropped. Also new connections to a server can't be opened. Transient errors can occur for example when hardware or network failure happens. Another reason could be a new version of a PaaS service that is being rolled out. Most of these events are automatically mitigated by the system in less than 60 seconds. A best practice for designing and developing applications in the cloud is to expect transient errors. Assume they can happen in any component at any time and to have the appropriate logic in place to handle these situations.

## Handling transient errors

Transient errors should be handled using retry logic. Situations that must be considered:

* An error occurs when you try to open a connection
* An idle connection is dropped on the server side. When you try to issue a command it can't be executed
* An active connection that currently is executing a command is dropped.

The first and second case are fairly straight forward to handle. Try to open the connection again. When you succeed, the transient error has been mitigated by the system. You can use your Azure Database for MariaDB again. We recommend having waits before retrying the connection. Back off if the initial retries fail. This way the system can use all resources available to overcome the error situation. A good pattern to follow is:

* Wait for 5 seconds before your first retry.
* For each following retry, the increase the wait exponentially, up to 60 seconds.
* Set a max number of retries at which point your application considers the operation failed.

When a connection with an active transaction fails, it is more difficult to handle the recovery correctly. There are two cases: If the transaction was read-only in nature, it is safe to reopen the connection and to retry the transaction. If however if the transaction was also writing to the database, you must determine if the transaction was rolled back, or if it succeeded before the transient error happened. In that case, you might just not have received the commit acknowledgement from the database server.

One way of doing this, is to generate a unique ID on the client that is used for all the retries. You pass this unique ID as part of the transaction to the server and to store it in a column with a unique constraint. This way you can safely retry the transaction. It will succeed if the previous transaction was rolled back and the client generated unique ID does not yet exist in the system. It will fail indicating a duplicate key violation if the unique ID was previously stored because the previous transaction completed successfully.

When your program communicates with Azure Database for MariaDB through third-party middleware, ask the vendor whether the middleware contains retry logic for transient errors.

Make sure to test you retry logic. For example, try to execute your code while scaling up or down the compute resources of you Azure Database for MariaDB server. Your application should handle the brief downtime that is encountered during this operation without any problems.

## Next steps

* [Troubleshoot connection issues to Azure Database for MariaDB](howto-troubleshoot-common-connection-issues.md)
