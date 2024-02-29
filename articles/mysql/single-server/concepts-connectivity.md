---
title: Transient connectivity errors - Azure Database for MySQL
description: Learn how to handle  transient connectivity errors and connect efficiently to Azure Database for MySQL.
keywords: mysql connection,connection string,connectivity issues,transient error,connection error,connect efficiently
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Handle transient errors and connect efficiently to Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This article describes how to handle transient errors and connect efficiently to  Azure Database for MySQL.

## Transient errors

A transient error, also known as a transient fault, is an error that will resolve itself. Most typically these errors manifest as a connection to the database server being dropped. Also new connections to a server can't be opened. Transient errors can occur for example when hardware or network failure happens. Another reason could be a new version of a PaaS service that is being rolled out. Most of these events are automatically mitigated by the system in less than 60 seconds. A best practice for designing and developing applications in the cloud is to expect transient errors. Assume they can happen in any component at any time and to have the appropriate logic in place to handle these situations.

## Handling transient errors

Transient errors should be handled using retry logic. Situations that must be considered:

* An error occurs when you try to open a connection
* An idle connection is dropped on the server side. When you try to issue a command it can't be executed
* An active connection that currently is executing a command is dropped.

The first and second case are fairly straight forward to handle. Try to open the connection again. When you succeed, the transient error has been mitigated by the system. You can use your Azure Database for MySQL again. We recommend having waits before retrying the connection. Back off if the initial retries fail. This way the system can use all resources available to overcome the error situation. A good pattern to follow is:

* Wait for 5 seconds before your first retry.
* For each following retry, the increase the wait exponentially, up to 60 seconds.
* Set a max number of retries at which point your application considers the operation failed.

When a connection with an active transaction fails, it is more difficult to handle the recovery correctly. There are two cases: If the transaction was read-only in nature, it is safe to reopen the connection and to retry the transaction. If however the transaction was also writing to the database, you must determine if the transaction was rolled back, or if it succeeded before the transient error happened. In that case, you might just not have received the commit acknowledgment from the database server.

One way of doing this, is to generate a unique ID on the client that is used for all the retries. You pass this unique ID as part of the transaction to the server and to store it in a column with a unique constraint. This way you can safely retry the transaction. It will succeed if the previous transaction was rolled back and the client-generated unique ID does not yet exist in the system. It will fail indicating a duplicate key violation if the unique ID was previously stored because the previous transaction completed successfully.

When your program communicates with Azure Database for MySQL through third-party middleware, ask the vendor whether the middleware contains retry logic for transient errors.

Make sure to test you retry logic. For example, try to execute your code while scaling up or down the compute resources of your Azure Database for MySQL server. Your application should handle the brief downtime that is encountered during this operation without any problems.

## Connect efficiently to Azure Database for MySQL

Database connections are a limited resource, so making effective use of connection pooling to access Azure Database for MySQL optimizes performance. The below section explains how to use connection pooling or persistent connections to more effectively access Azure Database for MySQL.

## Access databases by using connection pooling (recommended)

Managing database connections can have a significant impact on the performance of the application as a whole. To optimize the performance of your application, the goal should be to reduce the number of times connections are established and time for establishing connections in key code paths. We strongly recommend using database connection pooling or persistent connections to connect to Azure Database for MySQL. Database connection pooling handles the creation, management, and allocation of database connections. When a program requests a database connection, it prioritizes the allocation of existing idle database connections, rather than the creation of a new connection. After the program has finished using the database connection, the connection is recovered in preparation for further use, rather than simply being closed down.

For better illustration, this article provides [a piece of sample code](./sample-scripts-java-connection-pooling.md) that uses JAVA as an example. For more information, see [Apache common DBCP](https://commons.apache.org/proper/commons-dbcp/).

> [!NOTE]
> The server configures a timeout mechanism to close a connection that has been in an idle state for some time to free up resources. Be sure to set up the verification system to ensure the effectiveness of persistent connections when you are using them. For more information, see [Configure verification systems on the client side to ensure the effectiveness of persistent connections](concepts-connectivity.md#configure-verification-mechanisms-in-clients-to-confirm-the-effectiveness-of-persistent-connections).

## Access databases by using persistent connections (recommended)

The concept of persistent connections is similar to that of connection pooling. Replacing short connections with persistent connections requires only minor changes to the code, but it has a major effect in terms of improving performance in many typical application scenarios.

## Access databases by using wait and retry mechanism with short connections

If you have resource limitations, we strongly recommend that you use database pooling or persistent connections to access databases. If your application use short connections and experience connection failures when you approach the upper limit on the number of concurrent connections,you can try wait and retry mechanism. You can set an appropriate wait time, with a shorter wait time after the first attempt. Thereafter, you can try waiting for events multiple times.

## Configure verification mechanisms in clients to confirm the effectiveness of persistent connections

The server configures a timeout mechanism to close a connection that’s been in an idle state for some time to free up resources. When the client accesses the database again, it’s equivalent to creating a new connection request between the client and the server. To ensure the effectiveness of connections during the process of using them, configure a verification mechanism on the client. As shown in the following example, you can use Tomcat JDBC connection pooling to configure this verification mechanism.

By setting the TestOnBorrow parameter, when there's a new request, the connection pool automatically verifies the effectiveness of any available idle connections. If such a connection is effective, its directly returned otherwise connection pool withdraws the connection. The connection pool then creates a new effective connection and returns it. This process ensures that database is accessed efficiently. 

For information on the specific settings, see the [JDBC connection pool official introduction document](https://tomcat.apache.org/tomcat-7.0-doc/jdbc-pool.html#Common_Attributes). You mainly need to set the following three parameters: TestOnBorrow (set to true), ValidationQuery (set to SELECT 1), and ValidationQueryTimeout (set to 1). The specific sample code is shown below:

```java
public class SimpleTestOnBorrowExample {
      public static void main(String[] args) throws Exception {
          PoolProperties p = new PoolProperties();
          p.setUrl("jdbc:mysql://localhost:3306/mysql");
          p.setDriverClassName("com.mysql.jdbc.Driver");
          p.setUsername("root");
          p.setPassword("password");
            // The indication of whether objects will be validated by the idle object evictor (if any). 
            // If an object fails to validate, it will be dropped from the pool. 
            // NOTE - for a true value to have any effect, the validationQuery or validatorClassName parameter must be set to a non-null string. 
          p.setTestOnBorrow(true); 

            // The SQL query that will be used to validate connections from this pool before returning them to the caller.
            // If specified, this query does not have to return any data, it just can't throw a SQLException.
          p.setValidationQuery("SELECT 1");

            // The timeout in seconds before a connection validation queries fail. 
            // This works by calling java.sql.Statement.setQueryTimeout(seconds) on the statement that executes the validationQuery. 
            // The pool itself doesn't timeout the query, it is still up to the JDBC driver to enforce query timeouts. 
            // A value less than or equal to zero will disable this feature.
          p.setValidationQueryTimeout(1);
            // set other useful pool properties.
          DataSource datasource = new DataSource();
          datasource.setPoolProperties(p);

          Connection con = null;
          try {
            con = datasource.getConnection();
            // execute your query here
          } finally {
            if (con!=null) try {con.close();}catch (Exception ignore) {}
          }
      }
  }
```

## Next steps

* [Troubleshoot connection issues to Azure Database for MySQL](how-to-troubleshoot-common-connection-issues.md)
