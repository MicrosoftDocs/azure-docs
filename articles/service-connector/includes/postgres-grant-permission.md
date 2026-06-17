---
ms.service: service-connector
ms.topic: include
ms.date: 06/17/2026
ms.reviewer: xiaofanzhou
---

Next, if you created tables and sequences in PostgreSQL flexible server before using Service Connector, connect as the owner and grant permission to `<aad-username>` created by Service Connector. The username from the connection string or configuration set by Service Connector should look like `aad_<connection name>`. If you use the Azure portal, select the expand button next to the **Service Type** column to get the value. If you use the Azure CLI, check `configurations` in the CLI command output.

Then run the following query to grant permissions:

```azurecli-interactive
az extension add --name rdbms-connect

az postgres flexible-server execute -n <postgres-name> -u <owner-username> -p "<owner-password>" -d <database-name> --querytext "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"<aad-username>\";GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"<aad username>\";"
```

The `<owner-username>` and `<owner-password>` belong to the owner of the existing table that can grant permissions to others. `<aad-username>` is the user created by Service Connector. Replace them with actual values.

Validate the result:

```azurecli-interactive
az postgres flexible-server execute -n <postgres-name> -u <owner-username> -p "<owner-password>" -d <database-name> --querytext "SELECT distinct(table_name) FROM information_schema.table_privileges WHERE grantee='<aad-username>' AND table_schema='public';" --output table
```
