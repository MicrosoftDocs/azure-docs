---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/28/2022
---

**Step 1.** Run the [az postgres flexible-server create](/cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-create) command to create the PostgreSQL server and database in Azure using the values below. It is not uncommon for this command to run for a few minutes to complete.

#### [bash](#tab/terminal-bash)

```azurecli
DB_SERVER_NAME='msdocs-python-postgres-webapp-db'
DB_NAME='restaurant'
ADMIN_USERNAME='demoadmin'

az postgres flexible-server create \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $DB_SERVER_NAME  \
   --location $LOCATION \
   --admin-user $ADMIN_USERNAME \
   --admin-password <admin-password> \
   --public-access None \
   --sku-name Standard_B1ms \
   --tier Burstable
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
$DB_SERVER_NAME='msdocs-python-postgres-webapp-db'
$DB_NAME='restaurant'
$ADMIN_USERNAME='demoadmin'

az postgres flexible-server create `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $DB_SERVER_NAME  `
   --location $LOCATION `
   --admin-user $ADMIN_USERNAME `
   --admin-password <admin-password> `
   --public-access None `
   --sku-name Standard_B1ms `
   --tier Burstable
```

---

* *resource-group* &rarr; Use the same resource group name in which you created the web app, for example `msdocs-python-postgres-webapp-rg`.
* *name* &rarr; The PostgreSQL database server name. This name must be **unique across all Azure** (the server endpoint becomes `https://<name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. A good pattern is to use a combination of your company name and server identifier. (`msdocs-python-postgres-webapp-db`)
* *location* &rarr; Use the same location used for the web app.
* *admin-user* &rarr; Username for the administrator account. It can't be `azure_superuser`, `admin`, `administrator`, `root`, `guest`, or `public`. For example, `demoadmin` is okay.
* *admin-password* Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

    > [!IMPORTANT]
    > When creating usernames or passwords **do not** use the `$` character. Later you create environment variables with these values where the `$` character has special meaning within the Linux container used to run Python apps.

* *public-access* &rarr; `None` which sets the server in public access mode with no firewall rules. Rules will be created in a later step.
* *sku-name* &rarr; The name of the pricing tier and compute configuration, for example `Standard_B1ms`. Follow the convention {pricing tier}{compute generation}{vCores} set create this variable. For more information, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/pricing/details/postgresql/server/).
* *tier* &rarr; `Burstable`

**Step 2.** Configure the firewall rules on your server by using the [az postgres flexible-server firewall-rule create](/cli/azure/postgres/flexible-server/firewall-rule) command to give your local environment access to connect to the server.

#### [bash](#tab/terminal-bash)

```azurecli
az postgres flexible-server firewall-rule create \
   --resource-group $RESOURCE_GROUP_NAME \
   --name $DB_SERVER_NAME \
   --rule-name AllowMyIP \
   --start-ip-address <your IP> \
   --end-ip-address <your IP>
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres flexible-server firewall-rule create `
   --resource-group $RESOURCE_GROUP_NAME `
   --name $DB_SERVER_NAME `
   --rule-name AllowMyIP `
   --start-ip-address <your IP> `
   --end-ip-address <your IP`
```

---

* *resource-group* &rarr; Use the same resource group name in which you created the web app, for example `msdocs-python-postgres-webapp-rg`.
* *name* &rarr; The PostgreSQL database server name.
* *rule-name* &rarr; *AllowMyIP*.
* *start-ip-address* &rarr; equal to your IP address. To get your current IP address, see [WhatIsMyIPAddress.com](https://whatismyipaddress.com/).
* *end-ip-address* &rarr; equal to *start-ip-address*.

**Step 3.** (*optional*) You can retrieve connection information using the [az postgres server show](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-show). The command outputs a JSON object that contains connection strings for the database along and the `administratorLogin` name.

#### [bash](#tab/terminal-bash)

```azurecli
az postgres flexible-server show \
   --name $DB_SERVER_NAME \
   --resource-group $RESOURCE_GROUP_NAME
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
az postgres flexible-server show `
   --name $DB_SERVER_NAME `
   --resource-group $RESOURCE_GROUP_NAME
```

---

* *resource-group* &rarr; The name of resource group you used, for example, *msdocs-python-postgres-webapp-rg*.
* *name* &rarr; The name of the database server, for example, *msdocs-python-postgres-webapp-db-\<unique-id>*.

**Step 4.** In your local environment using the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html), connect to the PostgreSQL database server, and create the `restaurant` database.

```Console
psql --host=$DB_SERVER_NAME.postgres.database.azure.com \
     --port=5432 \
     --username=$ADMIN_USERNAME \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
```

The values of `<server name>` and `<admin-user>` are the values from a previous step. If you have trouble connecting, restart the database and try again.

**Step 5.** *(optional)* Verify `restaurant` database was successfully created by running  `\c restaurant` to change the prompt from `postgres`  (default) to `restaurant`.

```Console
postgres=> \c restaurant
restaurant=>
```

Type `\?` to show help or `\q` to quit.
