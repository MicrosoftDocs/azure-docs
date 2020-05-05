---
title: Troubleshooting intermittent outbound connection errors in Azure App Service
description: Troubleshoot intermittent connection errors and related performance issues in Azure App Service
author: v-miegge
manager: barbkess

ms.topic: troubleshooting
ms.date: 03/24/2020
ms.author: ramakoni
ms.custom: security-recommendations

---

# Troubleshooting intermittent outbound connection errors in Azure App Service

This article helps you troubleshoot intermittent connection errors and related performance issues in [Azure App Service](https://docs.microsoft.com/azure/app-service/overview). This topic will provide more information on, and troubleshooting methodologies for, exhaustion of source address network translation (SNAT) ports. If you require more help at any point in this article, contact the Azure experts at the [MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and select **Get Support**.

## Symptoms

Applications and Functions hosted on Azure App service may exhibit one or more of the following symptoms:

* Slow response times on all or some of the instances in a service plan.
* Intermittent 5xx or **Bad Gateway** errors
* Timeout error messages
* Could not connect to external endpoints (like SQLDB, Service Fabric, other App services etc.)

## Cause

A major cause of these symptoms is that the application instance is not able to open a new connection to the external endpoint because it has reached one of the following limits:

* TCP Connections: There is a limit on the number of outbound connections that can be made. This is associated with the size of the worker used.
* SNAT ports: As discussed in [Outbound connections in Azure](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections), Azure uses source network address translation (SNAT) and a Load Balancer (not exposed to customers)  to communicate with end points outside Azure in the public IP address space. Each instance on Azure App service is initially given a pre-allocated number of **128** SNAT ports. That limit affects opening connections to the same host and port combination. If your app creates connections to a mix of address and port combinations, you will not use up your SNAT ports. The SNAT ports are used up when you have repeated calls to the same address and port combination. Once a port has been released, the port is available for reuse as needed. The Azure Network load balancer reclaims SNAT port from closed connections only after waiting for 4 minutes.

When applications or functions rapidly open a new connection, they can quickly exhaust their pre-allocated quota of the 128 ports. They are then blocked until a new SNAT port becomes available, either through dynamically allocating additional SNAT ports, or through reuse of a reclaimed SNAT port. Applications or functions that are blocked because of this inability to create new connections will begin experiencing one or more of the issues described in the **Symptoms** section of this article.

## Avoiding the problem

Avoiding the SNAT port problem means avoiding the creation of new connections repetitively to the same host and port.

General strategies for mitigating SNAT port exhaustion are discussed in the [Problem-solving section](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#problemsolving) of the **Outbound connections of Azure** documentation. Of these strategies, the following are applicable to apps and functions hosted on Azure App service.

### Modify the application to use connection pooling

* For pooling HTTP connections, review [Pool HTTP connections with HttpClientFactory](https://docs.microsoft.com/aspnet/core/performance/performance-best-practices#pool-http-connections-with-httpclientfactory).
* For information on SQL Server connection pooling, review [SQL Server Connection Pooling (ADO.NET)](https://docs.microsoft.com/dotnet/framework/data/adonet/sql-server-connection-pooling).
* For implementing pooling with entity framework applications, review [DbContext pooling](https://docs.microsoft.com/ef/core/what-is-new/ef-core-2.0#dbcontext-pooling).

Here is a collection of links for implementing Connection pooling by different solution stack.

#### Node

By default, connections for NodeJS are not kept alive. Below are the popular databases and packages for connection pooling which contain examples for how to implement them.

* [MySQL](https://github.com/mysqljs/mysql#pooling-connections)
* [MongoDB](https://blog.mlab.com/2017/05/mongodb-connection-pooling-for-express-applications/)
* [PostgreSQL](https://node-postgres.com/features/pooling)
* [SQL Server](https://github.com/tediousjs/node-mssql#connection-pools)

HTTP Keep-alive

* [agentkeepalive](https://www.npmjs.com/package/agentkeepalive)
* [Node.js v13.9.0 Documentation](https://nodejs.org/api/http.html)

#### Java

Below are the popular libraries used for JDBC connection pooling which contain examples for how to implement them:
JDBC Connection Pooling.

* [Tomcat 8](https://tomcat.apache.org/tomcat-8.0-doc/jdbc-pool.html)
* [C3p0](https://github.com/swaldman/c3p0)
* [HikariCP](https://github.com/brettwooldridge/HikariCP)
* [Apache DBCP](https://commons.apache.org/proper/commons-dbcp/)

HTTP Connection Pooling

* [Apache Connection Management](https://hc.apache.org/httpcomponents-client-ga/tutorial/html/connmgmt.html)
* [Class PoolingHttpClientConnectionManager](http://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/org/apache/http/impl/conn/PoolingHttpClientConnectionManager.html)

#### PHP

Although PHP does not support connection pooling, you can try using persistent database connections to your back-end server.
 
* MySQL server

   * [MySQLi connections](https://www.php.net/manual/mysqli.quickstart.connections.php) for newer versions
   * [mysql_pconnect](https://www.php.net/manual/function.mysql-pconnect.php) for older versions of PHP

* Other data Sources

   * [PHP Connection Management](https://www.php.net/manual/en/pdo.connections.php)

#### Python

* [MySQL](https://github.com/mysqljs/mysql#pooling-connections)
* [MongoDB](https://blog.mlab.com/2017/05/mongodb-connection-pooling-for-express-applications/)
* [PostgreSQL](https://node-postgres.com/features/pooling)
* [SQL Server](https://github.com/tediousjs/node-mssql#connection-pools) (NOTE: SQLAlchemy can be used with other databases besides MicrosoftSQL Server)
* [HTTP Keep-alive](https://requests.readthedocs.io/en/master/user/advanced/#keep-alive)(Keep-Alive is automatic when using sessions [session-objects](https://requests.readthedocs.io/en/master/user/advanced/#keep-alive)).

For other environments, review provider or driver-specific documents for implementing connection pooling in your applications.

### Modify the application to reuse connections

*  For additional pointers and examples on managing connections in Azure functions, review [Manage connections in Azure Functions](https://docs.microsoft.com/azure/azure-functions/manage-connections).

### Modify the application to use less aggressive retry logic

* For additional guidance and examples, review [Retry pattern](https://docs.microsoft.com/azure/architecture/patterns/retry).

### Use keepalives to reset the outbound idle timeout

* For implementing keepalives for Node.js apps, review [My node application is making excessive outbound calls](https://docs.microsoft.com/azure/app-service/app-service-web-nodejs-best-practices-and-troubleshoot-guide#my-node-application-is-making-excessive-outbound-calls).

### Additional guidance specific to App Service:

* A [load test](https://docs.microsoft.com/azure/devops/test/load-test/app-service-web-app-performance-test) should simulate real world data in a steady feeding speed. Testing apps and functions under real world stress can identify and resolve SNAT port exhaustion issues ahead of time.
* Ensure that the back-end services can return responses quickly. For troubleshooting performance issues with Azure SQL database, review [Troubleshoot Azure SQL Database performance issues with Intelligent Insights](https://docs.microsoft.com/azure/sql-database/sql-database-intelligent-insights-troubleshoot-performance#recommended-troubleshooting-flow).
* Scale out the App Service plan to more instances. For more information on scaling, see [Scale an app in Azure App Service](https://docs.microsoft.com/azure/app-service/manage-scale-up). Each worker instance in an app service plan is allocated a number of SNAT ports. If you spread your usage across more instances, you might get the SNAT port usage per instance below the recommended limit of 100 outbound connections, per unique remote endpoint.
* Consider moving to [App Service Environment (ASE)](https://docs.microsoft.com/azure/app-service/environment/using-an-ase), where you are allotted a single outbound IP address, and the limits for connections and SNAT ports are much higher.

Avoiding the outbound TCP limits is easier to solve, as the limits are set by the size of your worker. You can see the limits in [Sandbox Cross VM Numerical Limits - TCP Connections](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#cross-vm-numerical-limits)

|Limit name|Description|Small (A1)|Medium (A2)|Large (A3)|Isolated tier (ASE)|
|---|---|---|---|---|---|
|Connections|Number of connections across entire VM|1920|3968|8064|16,000|

To avoid outbound TCP limits, you can either increase the size of your workers, or scale out horizontally.

## Troubleshooting

Knowing the two types of outbound connection limits, and what your app does, should make it easier to troubleshoot. If you know that your app makes many calls to the same storage account, you might suspect a SNAT limit. If your app creates a great many calls to endpoints all over the internet, you would suspect you are reaching the VM limit.

If you do not know the application behavior enough to determine the cause quickly, there are some tools and techniques available in App Service to help with that determination.

### Find SNAT port allocation information

You can use [App Service Diagnostics](https://docs.microsoft.com/azure/app-service/overview-diagnostics) to find SNAT port allocation information, and observe the SNAT ports allocation metric of an App Service site. To find SNAT port allocation information, follow the following steps:

1. To access App Service diagnostics, navigate to your App Service web app or App Service Environment in the [Azure portal](https://portal.azure.com/). In the left navigation, select **Diagnose and solve problems**.
2. Select Availability and Performance Category
3. Select SNAT Port Exhaustion tile in the list of available tiles under the category. The practice is to keep it below 128.
If you do need it, you can still open a support ticket and the support engineer will get the metric from back-end for you.

Note that since SNAT port usage is not available as a metric, it is not possible to either autoscale based on SNAT port usage, or to configure auto scale based on SNAT ports allocation metric.

### TCP Connections and SNAT Ports

TCP connections and SNAT ports are not directly related. A TCP connections usage detector is included in the Diagnose and Solve Problems blade of any App Service site. Search for the phrase "TCP connections" to find it.

* The SNAT Ports are only used for external network flows, while the total TCP Connections includes local loopback connections.
* A SNAT port can be shared by different flows, if the flows are different in either protocol, IP address or port. The TCP Connections metric counts every TCP connection.
* The TCP connections limit happens at the worker instance level. The Azure Network outbound load balancing doesn't use the TCP Connections metric for SNAT port limiting.
* The TCP connections limits are described in [Sandbox Cross VM Numerical Limits - TCP Connections](https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox#cross-vm-numerical-limits)

|Limit name|Description|Small (A1)|Medium (A2)|Large (A3)|Isolated tier (ASE)|
|---|---|---|---|---|---|
|Connections|Number of connections across entire VM|1920|3968|8064|16,000|

### WebJobs and Database connections
 
If SNAT ports are exhausted, where WebJobs are unable to connect to the Azure SQL database, there is no metric to show how many connections are opened by each individual web application process. To find the problematic WebJob, move several WebJobs out to another App Service plan to see if the situation improves, or if an issue remains in one of the plans. Repeat the process until you find the problematic WebJob.

### Using SNAT ports sooner

You cannot change any Azure settings to release the used SNAT ports sooner, as all SNAT ports will be released as per the below conditions and the behavior is by design.
 
* If either server or client sends FINACK, the [SNAT port will be released](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#tcp-snat-port-release) after 240 seconds.
* If an RST is seen, the SNAT port will be released after 15 seconds.
* If idle timeout has been reached, the port is released.
 
## Additional information

* [SNAT with App Service](https://4lowtherabbit.github.io/blogs/2019/10/SNAT/)
* [Troubleshoot slow app performance issues in Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-performance-degradation)
