---
 title: include file
 description: include file
 author: jonels-msft
 ms.service: postgresql
 ms.subservice: hyperscale-citus
 ms.topic: include
 ms.date: 05/09/2019
 ms.author: jonels
 ms.custom: include file
---

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create an Azure Database for PostgreSQL

Follow these steps to create an Azure Database for PostgreSQL server:
1. Click **Create a resource**  in the upper left-hand corner of the Azure portal.
2. Select **Databases** from the **New** page, and select **Azure Database for PostgreSQL** from the **Databases** page.
3. For the deployment option, click the **Create** button under **Hyperscale (Citus) server group - PREVIEW.**
4. Fill out the new server details form with the following information:
   - Resource group: click the **Create new** link below the text box for this field. Enter a name such as **myresourcegroup**.
   - Server group name: enter a unique name for the new server group, which will also be used for a server subdomain.
   - Admin username: enter a unique username, it will be used later to connect to the database.
   - Password: must be at least eight characters in length and must contain characters from three of the following categories – English uppercase letters, English lowercase letters, numbers (0-9), and non-alphanumeric characters (!, $, #, %, etc.)
   - Location: use the location that is closest to your users to give them the fastest access to the data.

   > [!IMPORTANT]
   > The server admin login and password that you specify here are required to log in to the server and its databases later in this quick start. Remember or record this information for later use.

5. Click **Configure server group**. Leave the settings in that section unchanged and click **Save**.
6. Click **Review + create** and then **Create** to provision the server. Provisioning takes a few minutes.
7. The page will redirect to monitor deployment. When the live status changes from **Your deployment is underway** to **Your deployment is complete**, click the **Outputs** menu item on the left of the page.
8. The outputs page will contain a coordinator hostname with a button next to it to copy the value to the clipboard. Record this information for later use.

## Configure a server-level firewall rule

The Azure Database for PostgreSQL – Hyperscale (Citus) (preview) service uses a firewall at the server-level. By default, the firewall prevents all external applications and tools from connecting to the coordinator node and any databases inside. We must add a rule to open the firewall for a specific IP address range.

1. From the **Outputs** section where you previously copied the coordinator node hostname, click back into the **Overview** menu item.

2. The name of your deployment's scaling group will be prefixed with "sg-". Find it in the list of resources and click it.

3. Click **Firewall** under **Security** in the left-hand menu.

4. Click the link **+ Add firewall rule for current client IP address**. Finally, click the **Save** button.

5. Click **Save**.

   > [!NOTE]
   > Azure PostgreSQL server communicates over port 5432. If you are trying to connect from within a corporate network, outbound traffic over port 5432 may not be allowed by your network's firewall. If so, you cannot connect to your Azure SQL Database server unless your IT department opens port 5432.
   >

## Connect to the database using psql in Cloud Shell

Let's now use the [psql](https://www.postgresql.org/docs/current/app-psql.html) command-line utility to connect to the Azure Database for PostgreSQL server.
1. Launch the Azure Cloud Shell via the terminal icon on the top navigation pane.

   ![Azure Database for PostgreSQL - Azure Cloud Shell terminal icon](./media/azure-postgresql-hyperscale-create-db/psql-cloud-shell.png)

2. The Azure Cloud Shell opens in your browser, enabling you to type bash commands.

   ![Azure Database for PostgreSQL - Azure Shell Bash Prompt](./media/azure-postgresql-hyperscale-create-db/psql-bash.png)

3. At the Cloud Shell prompt, connect to your Azure Database for PostgreSQL server using the psql commands. The following format is used to connect to an Azure Database for PostgreSQL server with the [psql](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility:
   ```bash
   psql --host=<myserver> --username=myadmin --dbname=citus
   ```

   For example, the following command connects to the default database called **citus** on your PostgreSQL server **mydemoserver.postgres.database.azure.com** using access credentials. Enter your server admin password when prompted.

   ```bash
   psql --host=mydemoserver.postgres.database.azure.com --username=myadmin --dbname=citus
   ```
