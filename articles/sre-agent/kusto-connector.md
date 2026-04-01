---
title: "Tutorial: Connect to Azure Data Explorer (ADX) in Azure SRE Agent"
description: Connect your SRE agent to Azure Data Explorer (Kusto) clusters so it can run KQL queries against your logs and telemetry data.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to connect my agent to Azure Data Explorer so that it can query logs and telemetry during incident investigations.
---

# Tutorial: Connect to Azure Data Explorer (ADX) in Azure SRE Agent
In this tutorial, you connect your SRE agent to an Azure Data Explorer (Kusto) cluster. After you complete the setup, the agent can run KQL queries against your logs and telemetry data to support incident investigations and diagnostics.

**Estimated time**: 15 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Locate your Azure Data Explorer cluster URL and database name
> - Grant the agent's managed identity access to the database
> - Add and test the Kusto connector in the SRE Agent portal

## Prerequisites

- An existing Azure Data Explorer cluster
- Admin access to grant database permissions on the target cluster
- An agent created in the SRE Agent portal

## Get your cluster details

To configure the connector, you need the cluster URL and at least one database name.

1. Find your cluster URL. The URL follows this format:

    ```text
    https://<CLUSTER_NAME>.<REGION>.kusto.windows.net
    ```

1. Note the name of the database you want the agent to query.

## Grant the agent database permissions

The agent's managed identity needs at least viewer-level access to the database.

Run the following KQL command to grant the required permissions:

```kql
.add database <DATABASE_NAME> viewers ('aadapp=<AGENT_MANAGED_IDENTITY_ID>')
```

Replace `<DATABASE_NAME>` with your database name and `<AGENT_MANAGED_IDENTITY_ID>` with the agent's managed identity client ID.

## Add the connector in the portal

Configure the Kusto connector in the SRE Agent portal.

1. Go to **Builder** > **Connectors**.
1. Select **Add connector**.
1. Select **Kusto**.
1. Enter the following values:
   - **Name**: A descriptive name for the connector, such as "production-logs".
   - **Cluster URL**: The cluster URL from the previous step.
   - **Database**: The default database name.
1. Select **Test connection** to verify the configuration.

   You see a **Connection successful** confirmation. If the test fails, check the [Troubleshooting](#troubleshoot-common-issues) section.

   **Checkpoint:** The connector appears in your **Connectors** list with a **Connected** status badge.

1. Select **Save**.

## Verify the connection

Confirm the agent can access the cluster by asking it a question that requires querying the database.

Ask your agent:

```text
List the tables in the production-logs database
```

The agent returns a list of tables from the connected database.

## Troubleshoot common issues

If you encounter problems during setup, review the following common causes.

### Connection test fails

- Verify the cluster URL is correct and includes the region.
- Ensure the managed identity has the viewer role on the target database.
- Check that your firewall rules allow connections from SRE Agent IP addresses. For the list of required IP addresses, see [Network requirements](network-requirements.md).

## Next step

> [!div class="nextstepaction"]
> [Create a Kusto tool](./create-kusto-tool.md)

## Related content

- [Create Kusto tool](create-kusto-tool.md)
- [Diagnose with external observability](diagnose-observability.md)
