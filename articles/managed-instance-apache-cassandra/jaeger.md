---
title: Using Jaeger with Azure Managed Instance for Apache Cassandra
description: Learn how to integrate Jaeger with Azure Managed Instance for Apache Cassandra for efficient storage monitoring.
author: IriaOsara
ms.author: IriaOsara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 12/08/2023

---

# Using Jaeger with Azure Managed Instance for Apache Cassandra

Jaeger, a distributed tracing platform for monitoring microservices, enables the fast identification of performance challenges and optimization. Through features, like tracing instrumentation and logging integration.

The article specifically details the use of the sample application HotROD and Jaeger alongside Azure Managed Instance for Apache Cassandra for efficient storage monitoring.


## Prerequisites and Setup
* [Create an Azure Managed Instance for Apache Cassandra cluster](create-cluster-cli.md).
* [Ensure Docker is installed](https://www.docker.com/get-started/).


## Running Jaeger with Azure Managed Instance for Apache Cassandra
1. [Download the Jaeger repository](https://github.com/jaegertracing/jaeger.git).
1. Navigate to the docker-compose folder `cd jaeger\docker-compose`.
1. Add your Azure Managed Instance Cassandra cluster credentials to the `jaeger-collector and jaeger-query` section within the `jaeger-docker-compose.yml` file:

    ```yml
        command: ["--cassandra.port=9042", "--cassandra.servers=seed_nodes_mi_datacenters", "--cassandra.username=cassandra", "--cassandra.password=cassandra_mi_password","--cassandra.tls.skip-host-verify","--cassandra.tls.enabled", 
        "--cassandra.keyspace=jaeger_v1_dc1" ]
    ``` 

1. Additionally, add the environment variables to the `cassandra-schema and jaeger-collector`:`

    ```yml
    environment: 
        ...
        - SSL_VERSION=TLSv1_2
        - SSL_VALIDATE=false
        - CQLSH_SSL=--ssl
        ...
    ```
1. To connect your Azure Managed Instance Cassandra cluster, add the Cassandra sign-in credentials to the `cassandra-schema`:
    ```yml
      environment:
        ...
        - CQLSH_HOST=datacenter_node_ip
        - CQLSH_PORT=9042
        - CASSANDRA_PASSWORD=mi_cluster_password
        - CASSANDRA_USERNAME=cassandra
        ...
    ```
1. Run `docker-compose -f jaeger-docker-compose.yml up -d` to start the application.

    :::image type="content" source="./media/jaeger/jaeger-running.png" alt-text="Screenshot of running jaeger." lightbox="./media/jaeger/jaeger-running.png" border="true":::

    > [!TIP]
    > Five containers are created, and you should be able to access the test application at http://localhost:8080/ to generate traces that can be viewed at http://localhost:16686/search.

1. Once the containers are running, access the Jaeger UI to view traces from the application.
    :::image type="content" source="./media/jaeger/jaeger-page-1.png" alt-text="Screenshot Jaeger web interface." lightbox="./media/jaeger/jaeger-page-1.png" border="true":::

1. Verify by inspecting your Azure Managed Instance cluster.
    :::image type="content" source="./media/jaeger/jaeger-table-1.png" alt-text="Screenshot Jaeger tables in managed instance cluster" lightbox="./media/jaeger/jaeger-table-1.png" border="true":::

1.  Refer to the traces table to view the data related to step 7.
    :::image type="content" source="./media/jaeger/jaeger-table-2.png" alt-text="Screenshot Jaeger trace table." lightbox="./media/jaeger/jaeger-table-2.png" border="true":::


## FAQs
If you encounter issues running or testing Jaeger, open a support ticket. Provide the subscription ID and account name where your Jaeger test is running.

## Next steps
- Learn about [hybrid cluster configuration](configure-hybrid-cluster.md) in Azure Managed Instance for Apache Cassandra.