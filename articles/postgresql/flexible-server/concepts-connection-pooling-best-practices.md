---
title: Connection Pooling Best Practices - Azure Database for PostgreSQL - Flexible Server
description: This article describes the best practices for connection pooling in Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: ramyerrabotu
author: AwdotiaRomanowna
ms.date: 08/30/2023
---

# CONNECTION POOLING STRATEGY FOR POSTGRESQL USING PGBOUNCER

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Strategic guidance for selecting connection pooling mechanism for PostgreSQL

## Introduction

When using PostgreSQL, establishing a connection to the database involves creating a communication channel between the client application and the server. This channel is responsible for managing data, executing queries, and initiating transactions. Once the connection is established, the client application can send commands to the server and receive responses. However, creating a new connection for each operation can cause performance issues for mission-critical applications. Every time a new connection is created, PostgreSQL spawns a new process using the postmaster process, which consumes additional resources.

To mitigate this issue, connection pooling is used to create a cache of connections that can be reused in PostgreSQL. When an application or client requests a connection, it is created from the connection pool. After the session or transaction is completed, the connection is returned to the pool for reuse. By reusing connections, resources usage is reduced, and performance is improved.

:::image type="content" source="./media/concepts-connection-pooling-best-practices/connection-patterns.png" alt-text="Diagram for Connection Pooling Patterns":::

Although there are different tools for connection pooling, in this section, we will discuss different strategies to use connection pooling using **PgBouncer**.

## What is PgBouncer?

**PgBouncer** is an efficient connection pooler designed for PostgreSQL, offering the advantage of reducing processing time and optimizing resource usage in managing multiple client connections to one or more databases. **PgBouncer** incorporates three distinct pooling mode for connection rotation:

- **Session pooling:** This method assigns a server connection to the client application for the entire duration of the client's connection. Upon disconnection of the client application, PgBouncer promptly returns the server connection back to the pool. This pooling mechanism is the default setting. (Note: It is not recommended in most of the cases and will not give any performance benefits over classic connections).
- **Transaction pooling:** With transaction pooling, a server connection is dedicated to the client application for the duration of a transaction. Once the transaction is successfully completed, **PgBouncer** intelligently releases the server connection, making it available again within the pool. This is the default mode in Flexible server, and it does not support prepared transactions.
- **Statement pooling:** In statement pooling, a server connection is allocated to the client application for each individual statement. Upon the statement's completion, the server connection is promptly returned to the connection pool. It is important to note that multi-statement transactions are not supported in this mode.

The effective utilization of PgBouncer can be categorized into 3 distinct usage patterns.

1. PgBouncer and Application Co-location deployment
1. Application independent centralized PgBouncer deployments
1. Inbuilt PgBouncer and Database deployment

:::image type="content" source="./media/concepts-connection-pooling-best-practices/design-patterns.png" alt-text="Diagram for App co-location":::


Each of these patterns has its own advantages & disadvantages.

## 1. PgBouncer and Application Co-location Deployment

When utilizing this approach, PgBouncer is deployed on the same server where your application is hosted. The application & PgBouncer can be deployed either on traditional virtual machines or within a microservices-based architecture as highlighted below:

### I. PgBouncer deployed in Application VM

If your application runs on an Azure VM, you have the option to set up PgBouncer on the same VM. To install and configure PgBouncer as a connection pooling proxy with Azure Database for PostgreSQL, please follow the instructions provided in the following [link](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-proxy/ba-p/730555).

:::image type="content" source="./media/concepts-connection-pooling-best-practices/co-location.png" alt-text="Diagram for App co-location on VM":::


Deploying PgBouncer in an application server can provide several advantages, especially when working with PostgreSQL databases. Below are some key benefits & limitations of this deployment method.

**Benefits:**

- **Reduced Latency:** By deploying **PgBouncer** on the same Application VM, communication between the primary application and the connection pooler is efficient due to their proximity. This minimizes latency and ensures smooth and swift interactions.
- **Improved security:** **PgBouncer** can act as a secure intermediary between the application and the database, providing an additional layer of security. It can enforce authentication and encryption, ensuring that only authorized clients can access the database.

Overall, deploying PgBouncer in an application server provides a more efficient, secure, and scalable approach to managing connections to PostgreSQL databases, enhancing the performance and reliability of the application.

**Limitations:**

- **Single point of failure:** If PgBouncer is deployed as a single instance on the application server, it becomes a potential single point of failure. If the PgBouncer instance goes down, it can disrupt the entire database connection pool, causing downtime for the application. To mitigate this, you can set up multiple PgBouncer instances behind a load balancer for high availability.
- **Limited scalability:** PgBouncer scalability depends on the capacity of the server where it is deployed. If the application server reaches its connection limit, PgBouncer may become a bottleneck, limiting the ability to scale the application. You may need to distribute the connection load across multiple PgBouncer instances or consider alternative solutions like connection pooling at the application level.
- **Configuration complexity:** Configuring and fine-tuning PgBouncer can be complex, especially when considering factors such as connection limits, pool sizing, and load balancing. Administrators need to carefully tune the PgBouncer configuration to match the application's requirements and ensure optimal performance and stability.

It's important to weigh these limitations against the benefits and evaluate whether PgBouncer is the right choice for your specific application and database setup.

### II. PgBouncer deployed as an AKS sidecar

It is possible to utilize **PgBouncer** as a sidecar container if your application is containerized and running on [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/), [Azure Container Instance (ACI)](https://azure.microsoft.com/products/container-instances), [Azure Container Apps (ACA)](https://azure.microsoft.com/products/container-apps/), or [Azure Red Hat OpenShift (ARO)](https://azure.microsoft.com/products/openshift/). The Sidecar pattern draws its inspiration from the concept of a sidecar attached to a motorcycle, where an auxiliary container, known as the sidecar container, is affixed to a parent application. This pattern enriches the parent application by extending its functionalities and delivering supplementary support.

The sidecar pattern is typically used with containers being co-scheduled as an atomic container group. This tightly couples the application and sidecar lifecycles and shares resources such as hostname and networking to make efficient use of resources. The PgBouncer sidecar operates alongside the application container within the same pod in Azure Kubernetes Service (AKS) with 1:1 mapping, serving as a connection pooling proxy for Azure Database for PostgreSQL.

This sidecar pattern is typically used with containers being co-scheduled as an atomic container group. This strongly binds the application and sidecar lifecycles and has shared resources such hostname and networking. By leveraging this setup, PgBouncer optimizes connection management and facilitates efficient communication between the application and the Azure Database for PostgreSQL.

Microsoft has published a [**PgBouncer** sidecar proxy image](https://hub.docker.com/_/microsoft-azure-oss-db-tools-pgbouncer-sidecar) in Microsoft container registry.

Please refer [this](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-on-azure/ba-p/3633043) for more details.

:::image type="content" source="./media/concepts-connection-pooling-best-practices/sidecar-proxy.png" alt-text="Diagram for App co-location on Sidecar":::

Below are some key benefits & limitations of this deployment method.

**Benefits:**

- **Reduced Latency:** By deploying **PgBouncer** as an AKS sidecar, communication between the primary application and the connection pooler is seamless and efficient due to their proximity. This minimizes latency and ensures smooth and swift interactions.
- **Simplified Management and Deployment:** The tight coupling of **PgBouncer** with the application container simplifies the management and deployment process. Both components are tightly integrated, allowing for easier administration and seamless coordination.
- **High Availability and Connection Resiliency:** In the event of an application container failure or restart, the **PgBouncer** sidecar container closely follows, ensuring high availability. This setup guarantees connection resiliency and maintains predictable performance even during failovers, contributing to a reliable and robust system.

By considering PgBouncer as an AKS sidecar, you can leverage these advantages to enhance your application's performance, streamline management, and ensure continuous availability of the connection pooler.

**Limitations:**

- **Connection Performance Issues:** Largehund-scale applications that utilize thousands of pods, each running sidecar PgBouncer, may encounter potential challenges related to database connection exhaustion. This situation can result in performance degradation and service disruptions. Deploying a sidecar PgBouncer for each pod increases the number of concurrent connections to the database server, which can exceed its capacity. As a result, the database may struggle to handle the high volume of incoming connections, leading to performance issues such as increased response times or even service outages.
- **Complex Deployment:** The utilization of the sidecar pattern introduces a level of complexity to the deployment process, as it involves running two containers within the same pod. This can potentially complicate troubleshooting and debugging activities, requiring additional effort to identify and resolve issues.
- **Scaling Challenges:** Moreover, it is important to note that the sidecar pattern may not be the ideal choice for applications that demand high scalability. The inclusion of a sidecar container can impose additional resource requirements, potentially limiting the number of pods that can be effectively created and managed.

While considering this sidecar pattern, it is crucial to carefully assess the trade-offs between deployment complexity and scalability requirements to determine the most appropriate approach for your specific application scenario.

## 2. Application Independent - Centralized PgBouncer Deployment

When utilizing this approach, PgBouncer is deployed as a centralized service, independent of the application. The PgBouncer service can be deployed either on traditional virtual machines or within a microservices-based architecture as highlighted below:

### I. PgBouncer deployed in ubuntu VM

**PgBouncer** connection proxy is setup between the application and database layer as shown in the image below. Since Azure Database for PostgreSQL is a fully managed platform service, you will not be able to install any external services on DB server. In this case, if your application is running on an Azure VM, you can setup **PgBouncer** on the same VM. If the application is running on a managed service like Azure App Services or Azure Functions, you will need to provision a separate Ubuntu VM to run **PgBouncer** proxy.

Please refer [link](https://techcommunity.microsoft.com/t5/azure-database-for-postgresql/steps-to-install-and-setup-pgbouncer-connection-pooling-proxy/ba-p/730555)  to install and setup PgBouncer connection pooling proxy with Azure Database for PostgreSQL.


:::image type="content" source="./media/concepts-connection-pooling-best-practices/deploying-vm.png" alt-text="Diagram for App co-location on Vm with Load Balancer":::

Below are some key benefits & limitations of this deployment method.

**Benefits:**

- **Seamless Integration with Managed Services:** If your application is hosted on a managed service platform such as Azure App Services or Azure Functions, deploying PgBouncer on a VM allows for easy integration with your existing infrastructure.
- **Simplified Setup on Azure VM:** If you are already running your application on an Azure VM, setting up PgBouncer on the same VM is straightforward. This ensures that PgBouncer is deployed in close proximity to your application, minimizing network latency and maximizing performance.
- **Non-Intrusive Configuration:** By deploying PgBouncer on a VM, you can avoid modifying server parameters on Azure PostgreSQL. This is particularly useful when you want to configure PgBouncer on a flexible server. For example, changing the SSLMODE parameter to "required" on Azure PostgreSQL might cause certain applications that rely on SSLMODE=FALSE to fail. Deploying PgBouncer on a separate VM allows you to maintain the default server configuration while still leveraging PgBouncer's benefits.
- **Compatibility with Prepared Statements:** In-built PgBouncer does not support using prepared statements in conjunction with transaction and statement pool modes. However, by deploying PgBouncer on a VM, you can overcome this limitation. This provides the flexibility to utilize prepared statements without sacrificing the advantages offered by transaction and statement pool modes.

By considering these benefits, deploying PgBouncer on a VM offers a convenient and efficient solution for enhancing the performance and compatibility of your application running on Azure infrastructure.

**Limitations:**

- **Single point of failure:** As **PgBouncer** is configured on standalone VM, connection pooling might not work in case of unavailability of the VM. This may result in errors in application connectivity.
- **Management overhead:** As **PgBouncer** is installed in VM, there might be management overhead to manage multiple configuration files. This makes it difficult to cope up with version upgrades, new releases, and product updates.
- **Feature parity:** If you are migrating from traditional PostgreSQL to Azure PostgreSQL and using **PgBouncer**, there might be some features gaps. For example, lack of md5 support in Azure PostgreSQL.

### II. Centralized PgBouncer Deployed as a service within AKS

If you are working with highly scalable and large containerized deployments on Azure Kubernetes Service (AKS), consisting of hundreds of pods, or in situations where multiple applications need to connect to a shared database, **PgBouncer** can be employed as a standalone service rather than a sidecar container.

By utilizing **PgBouncer** as a separate service, you can efficiently manage and handle connection pooling for your applications on a broader scale. This approach allows for centralizing the connection pooling functionality, enabling multiple applications to connect to the same database resource while maintaining optimal performance and resource utilization.

[**PgBouncer** sidecar proxy image](https://hub.docker.com/_/microsoft-azure-oss-db-tools-pgbouncer-sidecar) published in Microsoft container registry can be used to create and deploy a service.

:::image type="content" source="./media/concepts-connection-pooling-best-practices/centralized-aks.png" alt-text="Diagram for PGBouncer as a service within AKS":::

Below are some key benefits & limitations of this deployment method.

**Benefits:**

- **Enhanced Reliability:** Deploying **PgBouncer** as a standalone service allows for configuration in a highly available manner. This improves the overall reliability of the connection pooling infrastructure, ensuring continuous availability even in the face of failures or disruptions. 
- **Optimal Resource Utilization:** If your application or the database server has limited resources, opting for a separate machine dedicated to running the **PgBouncer** service can be advantageous. By deploying **PgBouncer** on a machine with ample resources, you can ensure optimal performance and prevent resource contention issues.
- **Centralized Connection Management:** When centralized management of database connections is a requirement, a standalone **PgBouncer** service provides a more streamlined approach. By consolidating connection management tasks into a centralized service, you can effectively monitor and control database connections across multiple applications, simplifying administration and ensuring consistency.

By considering **PgBouncer** as a standalone service within AKS, you can leverage these benefits to achieve improved reliability, resource efficiency, and centralized management of database connections.

**Limitations:**

- **Increased N/W Latency:** When deploying **PgBouncer** as a standalone service, it is important to consider the potential introduction of additional latency. This is due to the need for connections to be passed between the application and the PgBouncer service over the network. It is crucial to evaluate the latency requirements of your application and consider the trade-offs between centralized connection management and potential latency issues.

While **PgBouncer** running as a standalone service offers benefits such as centralized management and resource optimization, it is important to assess the impact of potential latency on your application's performance to ensure it aligns with your specific requirements.

## 3. Inbuilt PgBouncer in Azure Database for PostgreSQL Flexible Server

Azure Database for PostgreSQL – Flexible Server offers [PgBouncer](https://github.com/pgbouncer/pgbouncer) as a built-in connection pooling solution. This is offered as an optional service that can be enabled on a per-database server basis. PgBouncer runs in the same virtual machine as the Postgres database server. As the number of connections increases beyond a few hundreds or thousand, Postgres may encounter resource limitations. In such cases, built-in PgBouncer can provide a significant advantage by improving the management of idle and short-lived connections at the database server.

Please refer link to enable and setup PgBouncer connection pooling in Azure DB for PostgreSQL Flexible server

Below are some key benefits & limitations of this deployment method.

**Benefits:**

- **Seamless Configuration:** With the inbuilt **PgBouncer** in Flexible Server, there is no need for a separate installation or complex setup. It can be easily configured directly from the server parameters, ensuring a hassle-free experience.
- **Managed Service Convenience:** As a managed service, users can enjoy the advantages of other Azure managed services. This includes automatic updates, eliminating the need for manual maintenance and ensuring that **PgBouncer** stays up to date with the latest features and security patches.
- **Public and Private Connection Support:** The inbuilt **PgBouncer** in Flexible Server provides support for both public and private connections. This allows users to establish secure connections over private networks or connect externally, depending on their specific requirements.
- **High Availability (HA):** In the event of a failover, where a standby server is promoted to the primary role, **PgBouncer** seamlessly restarts on the newly promoted standby without any changes required to the application connection string. This ensures continuous availability and minimizes disruption to the application.
- **Cost Efficient:** It is cost efficient as the users don’t need to pay for extra compute like VM or the containers. Though  It does have some CPU impact as it's another process running on the same machine.

By leveraging the benefits of inbuilt PgBouncer with Flexible Server, users can enjoy the convenience of simplified configuration, the reliability of a managed service, support for various pooling modes, and seamless high availability during failover scenarios.

**Limitations:**

- **Not supported with Burstable:** **PgBouncer** is currently not supported with Burstable server compute tier. If you change the compute tier from General Purpose or Memory Optimized to Burstable tier, you will lose the **PgBouncer** capability.
- **Re-establish connections after restarts:** Whenever the server is restarted during scale operations, HA failover, or a restart, the **PgBouncer** is also restarted along with the server virtual machine. Hence, existing connections must be re-established.

_We have discussed different ways of implementing PgBouncer and the table below summarizes which deployment method to opt for:_



|**Selection Criteria**|**PgBouncer on App VM**|**PgBouncer on VM using ALB***|**PgBouncer on AKS Sidecar**|**PgBouncer as a Service**|**Flexible Server Inbuilt PgBouncer**|
|:-:|:-:|:-:|:-:|:-:|:-:|
|Simplified Management|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/red.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/red.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|
|HA|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|
|Containerized Apps|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|
|Reduced Network Overhead & Latency|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|
|Fine grain control on monitoring and debugging|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/red.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/red.png":::|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|

<br></br>

<span style="display: inline-block; width: 10px; height: 10px; background-color: black;"></span> **Legend**
|**Difficulty Level**|**Symbol**|
|---|---|
|Easy|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/green.png":::|
|Medium|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/yellow.png":::|
|Difficult|:::image type="icon" source="./media/concepts-connection-pooling-best-practices/red.png":::|


*ALB: Azure Load Balancer

