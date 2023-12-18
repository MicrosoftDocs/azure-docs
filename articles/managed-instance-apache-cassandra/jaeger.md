---
title: Run Jaeger with Azure Managed Instance for Apache Cassandra
description: This article details how to run jaeger in Azure Managed Instance for Apache Cassandra
author: IriaOsara
ms.author: IriaOsara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 12/08/2023

---

# Run Jaeger with Azure Managed Instance for Apache Cassandra

Jaeger, a distributed tracing platform for monitoring microservices, enables the fast identification of performance challenges and optimization. Through features, like tracing instrumentation and logging integration.

The article specifically details the use of the sample application HotROD and Jaeger alongside Azure Managed Instance for Apache Cassandra for efficient storage monitoring.


## Prerequisites and Setup
* [Create an Azure Managed Instance for Apache Cassandra cluster](create-cluster-cli.md).
* [Docker installed](https://www.docker.com/get-started/).


## Run Jaeger with Azure Managed Instance for Apache Cassandra
1. [Download the Jaeger repo](git@github.com:jaegertracing/jaeger.git)
1. Navigate to the docker-compose folder `cd jaeger\docker-compose`
1. Add your Azure Managed Instance Cassandra cluster credentials to the `jaeger-collector and jaeger-query` section within the `jaeger-docker-compose.yml` file.

    ```yml
        command: ["--cassandra.port=9042", "--cassandra.servers=seed_nodes_mi_datacenters", "--cassandra.username=cassandra", "--cassandra.password=cassandra_mi_password","--cassandra.tls.skip-host-verify","--cassandra.tls.enabled", 
        "--cassandra.keyspace=jaeger_v1_dc1" ]
    ``` 

1. Additionally to the `cassandra-schema and jaeger-collector` add the environment variables.

    ```yml
    environment: 
        ...
        - SSL_VERSION=TLSv1_2
        - SSL_VALIDATE=false
        - CQLSH_SSL=--ssl
        ...
    ```
1. To connect your managed instance Cassandra cluster, add the Cassandra sign-in credentials to the `cassandra-schema`
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

1. Once the containers are running access the Jaeger UI to view traces from the application.
    :::image type="content" source="./media/jaeger/jaeger-page-1.png" alt-text="Screenshot Jaeger web interface." lightbox="./media/jaeger/jaeger-page-1.png" border="true":::

1. Verify by looking at your Managed Instance cluster.
    :::image type="content" source="./media/jaeger/jaeger-table-1.png" alt-text="Screenshot Jaeger tables in managed instance cluster" lightbox="./media/jaeger/jaeger-table-1.png" border="true":::

1.  Also you can view the traces from step 7 in the table.
    :::image type="content" source="./media/jaeger/jaeger-table-2.png" alt-text="Screenshot Jaeger trace table." lightbox="./media/jaeger/jaeger-table-2.png" border="true":::


## FAQs
Open a support ticket if you have issues running or testing Jaeger. Providing the subscription ID and account name where your Jaeger test is running.

## Next steps
- Learn about [hybrid cluster configuration](configure-hybrid-cluster) in Azure Managed Instance for Apache Cassandra.