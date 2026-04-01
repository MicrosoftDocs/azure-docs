---
title: Get started with custom graphs in Microsoft Sentinel (preview)
description: Learn how to create and manage custom graphs in Microsoft Sentinel to model attack patterns, investigate threats, and run advanced graph algorithms.
author: EdB-MSFT
ms.author: edbaynash
ms.date: 03/23/2026
ms.topic: how-to 
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph

#customer intent: As a security researcher, I want to create custom graphs in my tenant so that I can continuously monitor and detect systemic threats.
---

# Get started with custom graphs in Microsoft Sentinel (preview)

Custom graphs in Microsoft Sentinel enable security researchers and analysts to create tailored graph representations of their security data. By building custom graphs, you can model specific attack patterns, investigate threats, and run advanced graph algorithms to uncover hidden relationships within your digital environment. This guide walks you through the steps to create and manage custom graphs by using Jupyter notebooks in the Microsoft Sentinel Visual Studio Code extension.

This article focuses on manually authoring custom graphs using code. For an AI‑driven experience, see [AI‑assisted custom graph authoring in Microsoft Sentinel](./create-graphs-with-ai.md).

## Prerequisites

The following are required to create custom graphs in Microsoft Sentinel:

+ Microsoft Sentinel extension for Visual Studio Code. For more information, see [Run notebooks on the Microsoft Sentinel data lake](notebooks.md).
+ Jupyter extension for Visual Studio Code. 
+ Microsoft Sentinel data lake configured with appropriate permissions. For more information, see [Onboard to Microsoft Sentinel data lake](sentinel-lake-onboard-defender.md).

Enable the Microsoft Entra ID connector to ingest the Microsoft Entra asset tables used in this article's sample code. For more information, see [Asset data ingestion in the Microsoft Sentinel data lake](enable-data-connectors.md).

### Permissions

To interact with custom graphs, you need the following XDR permissions in Sentinel data lake. The following table lists the permission requirements for common graph operations:

| Graph operation| Permissions required|
|---------------------|-------------------------|
| Model and build a notebook graph | Use a [custom Microsoft Defender XDR unified RBAC role with *data (manage)*](https://aka.ms/data-lake-custom-urbac) permissions over the Microsoft Sentinel data collection. |
| Persist a graph in tenant | Use one of the following Microsoft Entra ID roles:<br>[Security operator](/entra/identity/role-based-access-control/permissions-reference#security-operator)<br>[Security administrator](/entra/identity/role-based-access-control/permissions-reference#security-administrator)<br>[Global administrator](/entra/identity/role-based-access-control/permissions-reference#global-administrator) |
| Query a persisted graph | Use a [custom Microsoft Defender XDR unified RBAC role with *security data basics (read)*](/defender-xdr/custom-permissions-details) permissions over the Microsoft Sentinel data collection. |

> [!IMPORTANT]
> You must have permissions to read the data used in the graph. If you don't have access to a specific dataset, that data won't be included in the graph.
> To create a graph, you must not be restricted by a Sentinel scope. A scoped user isn't able to create a custom graph.

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake).

### Install Visual Studio Code and the Microsoft Sentinel extension 

Create custom graphs by using Jupyter notebooks in the Microsoft Sentinel Visual Studio Code extension. For more information, see [Install Visual Studio Code and the Microsoft Sentinel extension ](notebooks.md#install-visual-studio-code-and-the-microsoft-sentinel-extension)
  

## Create a custom graph 

To create and work with custom graphs, complete the following steps:

1. Model a custom graph
1. Persist the custom graph by scheduling a graph job
1. View and manage custom graphs 



## Model a custom graph

Create a custom graph by using a Jupyter notebook in the Microsoft Sentinel Visual Studio Code extension. 

The following steps walk you through creating your first custom graph by using a sample notebook.


### Set up your notebook and connect to the data lake

1. In Visual Studio Code with the Microsoft Sentinel extension installed, select the **Microsoft Sentinel** icon in the left-hand menu.
1. Select **Sign in to view graphs**
1. A dialog box appears with the text *The extension 'Microsoft Sentinel' wants to sign in using Microsoft*. Select **Allow** to sign in.
1. Sign in with your credentials.
1. After signing in, select  **+** then select **Create new notebook**.
1. Name the notebook file and save it in an appropriate location in your workspace.

   :::image type="content" source="media/create-custom-graphs/sign-in-to-view-graphs.png" lightbox="media/create-custom-graphs/sign-in-to-view-graphs.png" alt-text="A screenshot of the sign-in page for graphs in Visual Studio Code.":::

1. Select **Select kernel** in the top right of the notebook window to select a spark compute pool.
1. Select **Microsoft Sentinel**, then select any of the available spark pools.

   :::image type="content" source="media/create-custom-graphs/select-kernel.png"  lightbox="media/create-custom-graphs/select-kernel.png" alt-text="A screenshot of the select kernel page in Visual Studio Code.":::

    > [!TIP]
    > You can use AI prompts to help you create a custom graph notebook. For more information, see [AI-assisted custom graph authoring in Microsoft Sentinel](create-graphs-with-ai.md). 

1. Run a cell to by selecting the run cell triangle icon to the left of the cell. The first time you run a cell, you might be prompted to select a kernel if you didn't already select one.

     The first time you run a cell, takes about five minutes to start the Spark session.

   :::image type="content" source="media/create-custom-graphs/run-first-cell.png" lightbox="media/create-custom-graphs/run-first-cell.png" alt-text="A screenshot showing the running of the first cell in Visual Studio Code.":::

	
### Create a graph 

The following sample creates a graph to traverse Microsoft Entra group memberships and understand nested group relationships. The sample code helps you get started with a simple use case to learn the custom graph capability and leverage the power of graph traversal for your investigations. You can create a graph from any table available in the Sentinel data lake.

1.	Connect to your workspace and read Entra assets tables to begin building the graph.

    ```python
    from pyspark.sql import functions as F
    from sentinel_lake.providers import MicrosoftSentinelProvider
    
    lake_provider = MicrosoftSentinelProvider(spark=spark)
    
    # Use the "System tables" workspace which contains the Entra* Assets tables
    # If you are data is in a different workspace, update this variable accordingly and ensure the tables are present
    LOG_ANALYTICS_WORKSPACE = "System tables"
    
    # Dynamically get the latest snapshot time from EntraUsers
    snapshot_time = (
        lake_provider.read_table("EntraUsers", LOG_ANALYTICS_WORKSPACE)
        .df.agg(F.max("_SnapshotTime").alias("max_snapshot"))
        .collect()[0]["max_snapshot"]
        .strftime("%Y-%m-%dT%H:%M:%SZ")
    )
    print(f"Using snapshot_time: {snapshot_time}")
    
    snapshot_filter = (F.col("_SnapshotTime") == F.lit(snapshot_time).cast("timestamp"))
    
    # Load EntraMembers - edges: group contains user/group/servicePrincipal
    df_members = (
        lake_provider.read_table("EntraMembers", LOG_ANALYTICS_WORKSPACE)
        .filter(
            snapshot_filter
            & (F.col("sourceType") == "group")
            & (F.col("targetType").isin("user", "group", "servicePrincipal"))
        )
    )
    
    # Load EntraGroups - nodes
    df_groups = (
        lake_provider.read_table("EntraGroups", LOG_ANALYTICS_WORKSPACE)
        .filter(snapshot_filter)
        .select("id", "displayName", "mailEnabled")
    )
    
    # Load EntraUsers - nodes
    df_users = (
        lake_provider.read_table("EntraUsers", LOG_ANALYTICS_WORKSPACE)
        .filter(snapshot_filter)
        .select("id", "accountEnabled", "displayName", "department",
                "lastPasswordChangeDateTime", "userPrincipalName", "usageLocation")
    )
    
    # Load EntraServicePrincipals - nodes
    df_service_principals = (
        lake_provider.read_table("EntraServicePrincipals", LOG_ANALYTICS_WORKSPACE)
        .filter(snapshot_filter)
        .select("accountEnabled", "id", "displayName", "servicePrincipalType",
                "tenantId", "organizationId")
    )
    
    # Fix for Spark 3.x Parquet datetime rebase issue. Required when reading Parquet files
    # written by Spark 2.x which used the Julian calendar, whereas Spark 3.x uses Proleptic
    # Gregorian. Without these settings, timestamp columns (e.g. lastPasswordChangeDateTime)
    # may throw errors or return incorrect values. Safe to remove if all data was written by
    # Spark 3.x (typical for current Fabric/Sentinel environments).
    spark.conf.set("spark.sql.parquet.datetimeRebaseModeInRead", "CORRECTED")
    spark.conf.set("spark.sql.parquet.datetimeRebaseModeInWrite", "CORRECTED")
    spark.conf.set("spark.sql.parquet.int96RebaseModeInRead", "CORRECTED")
    spark.conf.set("spark.sql.parquet.int96RebaseModeInWrite", "CORRECTED")
    ```

1.	Prepare the node and edge DataFrames required for building the graph

    ```python
    # ============================================================
    # NODE PREPARATION
    # ============================================================
    
    # EntraUser nodes - keyed by user id
    user_nodes = (
        df_users.df
        .select(
            F.col("id"),
            F.col("displayName"),
            F.col("accountEnabled"),
            F.col("department"),
            F.col("lastPasswordChangeDateTime"),
            F.col("userPrincipalName"),
            F.col("usageLocation")
        )
    )
    
    # EntraGroup nodes - keyed by group id
    group_nodes = (
        df_groups.df
        .select(
            F.col("id"),
            F.col("displayName"),
            F.col("mailEnabled")
        )
    )
    
    # EntraServicePrincipal nodes - keyed by SP id
    sp_nodes = (
        df_service_principals.df
        .select(
            F.col("id"),
            F.col("displayName"),
            F.col("accountEnabled"),
            F.col("servicePrincipalType"),
            F.col("tenantId"),
            F.col("organizationId")
        )
    )
    
    # ============================================================
    # EDGE PREPARATION
    # ============================================================
    
    # Edge: EntraGroup --Contains--> EntraUser
    edge_group_contains_user = (
        df_members.df
        .filter(F.col("targetType") == "user")
        .select(
            F.col("sourceId").alias("SourceGroupId"),
            F.col("targetId").alias("TargetUserId")
        )
        .distinct()
        .withColumn("EdgeKey", F.concat_ws("_", F.col("SourceGroupId"), F.col("TargetUserId")))
    )
    
    # Edge: EntraGroup --Contains--> EntraGroup (nested groups)
    edge_group_contains_group = (
        df_members.df
        .filter(F.col("targetType") == "group")
        .select(
            F.col("sourceId").alias("SourceGroupId"),
            F.col("targetId").alias("TargetGroupId")
        )
        .distinct()
        .withColumn("EdgeKey", F.concat_ws("_", F.col("SourceGroupId"), F.col("TargetGroupId")))
    )
    
    # Edge: EntraGroup --Contains--> EntraServicePrincipal
    edge_group_contains_sp = (
        df_members.df
        .filter(F.col("targetType") == "servicePrincipal")
        .select(
            F.col("sourceId").alias("SourceGroupId"),
            F.col("targetId").alias("TargetSPId")
        )
        .distinct()
        .withColumn("EdgeKey", F.concat_ws("_", F.col("SourceGroupId"), F.col("TargetSPId")))
    )
    ```

1. Define your graph schema and bind to the DataFrames created in the previous step

    ```python
    from sentinel_graph import GraphSpecBuilder, Graph
    
    # Define the graph schema 
    
    entra_group_graph_spec = (
        GraphSpecBuilder.start()
    
        # === NODES ===
    
        .add_node("EntraUser")
        .from_dataframe(user_nodes)  # Native Spark DataFrame (from .df + .select + .distinct)
        .with_columns(
            "id", "displayName", "accountEnabled",
            "department", "lastPasswordChangeDateTime", "userPrincipalName", "usageLocation",
            key="id", display="displayName"
        )
    
        .add_node("EntraGroup")
        .from_dataframe(group_nodes)  # Native Spark DataFrame
        .with_columns(
            "id", "displayName", "mailEnabled",
            key="id", display="displayName"
        )
    
        .add_node("EntraServicePrincipal")
        .from_dataframe(sp_nodes)  # Native Spark DataFrame
        .with_columns(
            "id", "displayName", "accountEnabled",
            "servicePrincipalType", "tenantId", "organizationId",
            key="id", display="displayName"
        )
    
        # === EDGES ===
    
        # EntraGroup --ContainsUser--> EntraUser
        .add_edge("ContainsUser")
        .from_dataframe(edge_group_contains_user)  # Native Spark DataFrame
        .source(id_column="SourceGroupId", node_type="EntraGroup")
        .target(id_column="TargetUserId", node_type="EntraUser")
        .with_columns("SourceGroupId", "TargetUserId", "EdgeKey",
                      key="EdgeKey", display="EdgeKey")
    
        # EntraGroup --ContainsGroup--> EntraGroup (nested groups)
        .add_edge("ContainsGroup")
        .from_dataframe(edge_group_contains_group)  # Native Spark DataFrame
        .source(id_column="SourceGroupId", node_type="EntraGroup")
        .target(id_column="TargetGroupId", node_type="EntraGroup")
        .with_columns("SourceGroupId", "TargetGroupId", "EdgeKey",
                      key="EdgeKey", display="EdgeKey")
    
        # EntraGroup --ContainsServicePrincipal--> EntraServicePrincipal
        .add_edge("ContainsServicePrincipal")
        .from_dataframe(edge_group_contains_sp)  # Native Spark DataFrame
        .source(id_column="SourceGroupId", node_type="EntraGroup")
        .target(id_column="TargetSPId", node_type="EntraServicePrincipal")
        .with_columns("SourceGroupId", "TargetSPId", "EdgeKey",
                      key="EdgeKey", display="EdgeKey")
    
    ).done()
    ```

1.	Validate the graph schema
    ```python
    # Check the schema of the graph spec to ensure it's correct
    entra_group_graph_spec.show_schema()
    ```

1. Build the graph, including preparing the data and publishing the graph

    ```python
    # Build the graph from the spec - this will validate the spec and prepare it for querying
    # Alter options is to use Graph.prepare() to prepare the graph nodes and edges in the lake
    # and then use Graph.publish() to create the graph. You would typically call prepare() and publish()
    # seperately to understand the cost of Graph API calls that are triggeterd by Graph.publish()
    # see https://learn.microsoft.com/azure/sentinel/billing?tabs=simplified%2Ccommitment-tiers
    intra_group_graph = Graph.build(entra_group_graph_spec)
    ```

    > [!NOTE] 
    > Graphs created during interactive notebook sessions are removed when the notebook session is closed. To persist the graph for reuse and sharing, see [Persist your custom graph](#persist-your-custom-graph)


You have now created a graph in the notebook.

To show a visual representation of the graph, in a new cell paste and run the following code:

```python
# Query 1: Find nested group relationships nexting up to 8 levels deep
# Update the Entra Group name that you want to traverse from
query_nested_groups = """
MATCH p=(g1:EntraGroup)-[cg]->{1,8}(g2)
WHERE g1.displayName = 'tmplevel3'
RETURN *
"""
intra_group_graph.query(query_nested_groups).show()
```

This code runs a sample Graph Query Language (GQL) query to retrieve all nested group membership up to 8 levels deep The resulting graph is visualized in the output

:::image type="content" source="media/create-custom-graphs/graph-visualization.png" lightbox="media/create-custom-graphs/graph-visualization.png" alt-text="A screenshot showing the visualization of a graph in Visual Studio Code.":::




### Persist your custom graph 
Once you create the graph code in notebook, you can run the notebook in an interactive session or schedule a graph job. Graphs created during the interactive notebook session are temporary and are available only in the context of the notebook session. To save your graph and share with your team, schedule a graph job to rebuild your graph frequently. Once the graph is saved, it's accessible from: the graph experience in Microsoft Defender portal under Sentinel, Visual Studio Code Notebooks, and Graph query APIs.  


1. From your graph notebook, select **Create Scheduled Job**, then select **Create a graph job**.

    :::image type="content" source="media/create-custom-graphs/create-scheduled-job.png" lightbox="media/create-custom-graphs/create-scheduled-job.png" alt-text="A screenshot showing the create scheduled job button in a graph notebook.":::

1.  In the **Create graph job** form, enter the **Graph name** and **Description**, and verify the correct graph notebook is included in **Path**.

1.  To build the graph without configuring a refresh schedule, select **On demand** in the **Schedule** section, then select **Submit** to create the graph.

    > [!NOTE]
    > Graphs created using on demand schedule have default retention of 30 days and are deleted on expiration.

1.  To build the graph where the graph data is refreshed regularly, select **Scheduled** in the **Schedule** section.

    1.  Select a **Repeat frequency** for the job. You can choose from **By the minute**, **Hourly**, **Weekly**, **Daily**, or **Monthly**.

    1.  More options are displayed to configure the schedule, depending on the frequency you select. For example day of the week, time of day, or day of the month.

    1.  Select a **Start on** time for the schedule to start running.

    1.  Select an **End on** time for the schedule to stop running. If you don't want to set an end time for the schedule, select **Set job to run indefinitely**. Dates and times are in your timezone.

    1.  Select **Submit** to save the job configuration and publish the job. The graph building process starts in your tenant. View the newly created graph and its latest status in the Sentinel extension.

    :::image type="content" source="media/create-custom-graphs/configure-graph-job.png" lightbox="media/create-custom-graphs/configure-graph-job.png" alt-text="A screenshot of the create graph job page.":::


### View and manage custom graphs

After you create a graph job, you can view and manage the graph in your tenant from the Microsoft Sentinel extension in Visual Studio Code.

1. From the list of graphs, select your materialized graph to view its details.
1. Select the **Job Details** tab to view the status of the graph job, including last run time, next run time, and any errors encountered during the build process.
1. Select **Run Now** to manually trigger a graph build outside of the scheduled times. The **Status** changes to **Queued**, then "In Progress" while the graph is being built.

    :::image type="content" source="media/create-custom-graphs/graph-job-details.png" lightbox="media/create-custom-graphs/graph-job-details.png" alt-text="A screenshot showing the graph job details tab in Visual Studio Code.":::

1. When the graph build is complete, the **Status** updates to **Ready**. Select the **Graph Details** tab to view information about the graph. 

    :::image type="content" source="media/create-custom-graphs/graph-details.png" lightbox="media/create-custom-graphs/graph-details.png" alt-text="A screenshot of the graph details tab.":::

1. You can now query and visualize your graph from the graph visualization in Microsoft Sentinel in the Defender portal. For more information, see [Visualize graphs in Microsoft Sentinel graph (preview)](./graph-visualization.md).


## Related articles

- [AI-assisted custom graph authoring in Microsoft Sentinel](create-graphs-with-ai.md)
- [Microsoft Sentinel graph provider library reference](./sentinel-graph-provider-reference.md)
- [Graph Query Language (GQL) reference for Sentinel custom graph](./gql-reference-for-sentinel-custom-graph.md)
- [Visualize graphs in Microsoft Sentinel graph (preview)](./graph-visualization.md)