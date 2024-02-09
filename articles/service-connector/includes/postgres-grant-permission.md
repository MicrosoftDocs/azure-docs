---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 10/31/2023
ms.author: xiaofanzhou
---

Next, if you have created tables and sequences in PostgreSQL flexible server before using Service Connector, you need to connect as the owner and grant permission to `<aad-username>` created by Service Connector. The username from the connection string or configuration set by Service Connector should look like `aad_<connection name>`. If you use the Azure portal, select the expand button next to the `Service Type` column and get the value. If you use Azure CLI, check `configurations` in the CLI command output.

Then, execute the query to grant permission

```azurecli-interactive
az extension add --name rdbms-connect

az postgres flexible-server execute -n <postgres-name> -u <owner-username> -p "<owner-password>" -d <database-name> --querytext "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"<aad-username>\";GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"<aad username>\";"
```

The `<owner-username>` and `<owner-password>` is the owner of the existing table that can grant permissions to others. `<aad-username>` is the user created by Service Connector. Replace them with the actual value.

Validate the result with the command:

```azurecli-interactive
az postgres flexible-server execute -n <postgres-name> -u <owner-username> -p "<owner-password>" -d <database-name> --querytext "SELECT distinct(table_name) FROM information_schema.table_privileges WHERE grantee='<aad-username>' AND table_schema='public';" --output table
```
