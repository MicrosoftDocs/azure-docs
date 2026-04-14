---
title: "Tutorial: Connect to Azure Data Explorer (ADX) in Azure SRE Agent"
description: Connect your SRE agent to Azure Data Explorer (Kusto) clusters with per-cluster connectivity testing before saving.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/01/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to connect my agent to Azure Data Explorer so that it can query logs and telemetry during incident investigations.
---

# Tutorial: Connect to Azure Data Explorer (ADX) in Azure SRE Agent
In this tutorial, you connect your SRE agent to an Azure Data Explorer (Kusto) cluster. The connector wizard tests connectivity per-cluster before saving, so you can verify access before committing the configuration.

**Estimated time**: 15 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Locate your Azure Data Explorer cluster URL and database name
> - Grant the agent's managed identity access to the database
> - Add an Azure Data Explorer connector with cluster groups
> - Test per-cluster connectivity and save the connector

## Prerequisites

- An existing Azure Data Explorer cluster
- Admin access to grant database permissions on the target cluster
- An agent created in the SRE Agent portal with a managed identity (system-assigned or user-assigned)

## Get your cluster details

To configure the connector, you need the cluster URL and at least one database name.

1. Find your cluster URL. The URL follows this format:

    ```text
    https://<CLUSTER_NAME>.<REGION>.kusto.windows.net
    ```

1. Note the name of the database you want the agent to query. You'll need the full URL in the format `https://<CLUSTER_NAME>.<REGION>.kusto.windows.net/<DATABASE_NAME>`.

## Grant the agent database permissions

The agent's managed identity needs at least viewer-level access to the database.

Run the following KQL command to grant the required permissions:

```kql
.add database <DATABASE_NAME> viewers ('aadapp=<AGENT_MANAGED_IDENTITY_ID>')
```

Replace `<DATABASE_NAME>` with your database name and `<AGENT_MANAGED_IDENTITY_ID>` with the agent's managed identity client ID.

## Add the connector in the portal

Configure the Azure Data Explorer connector in the SRE Agent portal.

1. Go to **Builder** > **Connectors**.
1. Select **Add connector**.
1. Select the **Azure Data Explorer** card.
1. Select **Next**.

### Set up the connector

1. Enter a **Name** for the connector, such as "production-logs".
1. Select a **Managed identity** from the dropdown.
1. Select **Next**.

### Add clusters

1. Enter a **Group name** for the cluster group (such as "production").
1. Select a **Managed identity** for this cluster group, or leave as **(inherit)** to use the connector-level identity.
1. Under **Clusters**, enter your cluster URL in the format `https://<CLUSTER_NAME>.<REGION>.kusto.windows.net/<DATABASE_NAME>`.
1. To add more clusters to the same group, type each URL in the next row — a new row appears automatically when you fill the current one.
1. To add a second group with different clusters or a different identity, select **+ Create new group**.
1. Select **Next**.

### Test connection and save

1. Review your connector details—connector type, name, managed identity, and cluster groups.
1. Each cluster group shows a **Not tested** label.
1. Select **Test connection**. The button changes to **Testing connection...** while connectivity is verified.
1. After testing completes, each cluster shows a result:
   - A green checkmark icon means the cluster is reachable.
   - A red X icon means the cluster is unreachable, with an error message displayed inline.
1. Once testing completes, the button changes to **Add connector**.
1. Select **Add connector** to save.

> [!TIP]
> If a cluster fails the test, go back to verify the cluster URL format and that the managed identity has the correct permissions on that cluster.

## Edit an existing connector

To modify an existing Azure Data Explorer connector, select the connector name or the edit icon in the Connectors list. The wizard opens directly at the **Add clusters** step, skipping the connector picker.

## Verify the connection

Confirm the agent can access the cluster by asking it a question that requires querying the database.

Ask your agent:

```text
List the tables in the production-logs database
```

The agent returns a list of tables from the connected database.

## Troubleshoot common issues

If you encounter problems during setup, review the following common causes.

### Connection test fails with a permission error

- Verify the managed identity has the viewer role on the target database by running `.show database <DATABASE_NAME> principals`.
- Ensure you used the correct managed identity client ID when granting permissions.

### Connection test fails with an unreachable error

- Verify the cluster URL is correct and includes the region and database name.
- Check that your firewall rules allow connections from SRE Agent IP addresses. For the list of required IP addresses, see [Network requirements](network-requirements.md).

### Not tested badge remains after clicking Test connection

- Wait for the test to complete. Large clusters may take a few seconds to respond.

## Next step

> [!div class="nextstepaction"]
> [Create a Kusto tool](./create-kusto-tool.md)

## Related content

- [Create Kusto tool](create-kusto-tool.md)
- [Diagnose with external observability](diagnose-observability.md)
