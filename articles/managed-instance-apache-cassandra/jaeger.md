---
title: Run Jaeger with Azure Managed Instance for Apache Cassandra
description: Learn how to integrate Jaeger with Azure Managed Instance for Apache Cassandra for efficient storage monitoring.
author: IriaOsara
ms.author: IriaOsara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 12/08/2023

---

# Run Jaeger with Azure Managed Instance for Apache Cassandra

Jaeger is a distributed tracing platform for monitoring microservices. It enables the fast identification of performance challenges and optimization through features like tracing instrumentation and logging integration.

This article details the use of the sample application HotROD and Jaeger alongside Azure Managed Instance for Apache Cassandra for efficient storage monitoring.

## Prerequisites and setup

* [Create an Azure Managed Instance for Apache Cassandra cluster](create-cluster-cli.md).
* [Ensure that Docker is installed](https://www.docker.com/get-started/).

## Use Jaeger with Azure Managed Instance for Apache Cassandra

1. [Download the Jaeger repository](https://github.com/jaegertracing/jaeger.git).
1. Go to the *docker-compose* folder: `cd jaeger\docker-compose`.
1. In the *jaeger-docker-compose.yml* file, add your Azure Managed Instance for Apache Cassandra cluster credentials to the `jaeger-collector` and `jaeger-query` sections:

    ```yml
        command: ["--cassandra.port=9042", "--cassandra.servers=seed_nodes_mi_datacenters", "--cassandra.username=cassandra", "--cassandra.password=cassandra_mi_password","--cassandra.tls.skip-host-verify","--cassandra.tls.enabled", 
        "--cassandra.keyspace=jaeger_v1_dc1" ]
    ```

1. Add the environment variables to the `cassandra-schema` and `jaeger-collector` sections:

    ```yml
    environment: 
        ...
        - SSL_VERSION=TLSv1_2
        - SSL_VALIDATE=false
        - CQLSH_SSL=--ssl
        ...
    ```

1. To connect your Azure Managed Instance for Apache Cassandra cluster, add the Cassandra sign-in credentials to the `cassandra-schema` section:

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

    :::image type="content" source="./media/jaeger/jaeger-running.png" alt-text="Screenshot of a running Jaeger application." lightbox="./media/jaeger/jaeger-running.png" border="true":::

    > [!TIP]
    > The command creates five containers. You can access the test application at `http://localhost:8080/` to generate traces that you can view at `http://localhost:16686/search`.

1. After the containers are running, use the Jaeger UI to view traces from the application.

    :::image type="content" source="./media/jaeger/jaeger-page-1.png" alt-text="Screenshot of the Jaeger web interface." lightbox="./media/jaeger/jaeger-page-1.png" border="true":::

1. Verify by inspecting your Azure Managed Instance for Apache Cassandra cluster.

    :::image type="content" source="./media/jaeger/jaeger-table-1.png" alt-text="Screenshot of Jaeger tables in a managed instance cluster." lightbox="./media/jaeger/jaeger-table-1.png" border="true":::

1. Refer to the `traces` table to view the data related to step 7.

    :::image type="content" source="./media/jaeger/jaeger-table-2.png" alt-text="Screenshot of the Jaeger traces table." lightbox="./media/jaeger/jaeger-table-2.png" border="true":::

## Support

If you have problems running or testing Jaeger, open a support ticket. Provide the subscription ID and account name where your Jaeger instance is running.

## Next steps

* Learn about [hybrid cluster configuration](configure-hybrid-cluster.md) in Azure Managed Instance for Apache Cassandra.
