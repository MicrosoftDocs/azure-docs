---
title: 'Tutorial: Build a PHP (Laravel) app with Azure Database for MySQL Flexible Server'
description: This tutorial explains how to build a PHP app with flexible server.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: tutorial
ms.devlang: php
ms.date: 9/21/2020
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Build a PHP (Laravel) and MySQL Flexible Server (Preview) app in Azure App Service


:::image type="content" source="media/tutorial-php-database-app/complete-checkbox-published.png" alt-text="PHP Web App in Azure with Flexible Server":::

[Azure App Service](../../app-service/overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a PHP app in Azure and connect it to a MySQL database. When you're finished, you'll have a [Laravel](https://laravel.com/) app running on Azure App Service on Linux.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Setup a PHP (Laravel) app with local MySQL
> * Create a MySQL Flexible Server (Preview)
> * Connect a PHP app to MySQL Flexible Server (Preview)
> * Deploy the app to Azure App Service
> * Update the data model and redeploy the app
> * Manage the app in the Azure portal

If you don't have an [Azure subscription](../../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

To complete this tutorial:

1. [Install Git](https://git-scm.com/)
2. [Install PHP 5.6.4 or above](https://php.net/downloads.php)
3. [Install Composer](https://getcomposer.org/doc/00-intro.md)
4. Enable the following PHP extensions Laravel needs: OpenSSL, PDO-MySQL, Mbstring, Tokenizer, XML
5. [Install and start MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html)

## Prepare local MySQL

In this step, you create a database in your local MySQL server for your use in this tutorial.

### Connect to local MySQL server

In a terminal window, connect to your local MySQL server. You can use this terminal window to run all the commands in this tutorial.

```bash
mysql -u root -p
```

If you're prompted for a password, enter the password for the `root` account. If you don't remember your root account password, see [MySQL: How to Reset the Root Password](https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html).

If your command runs successfully, then your MySQL server is running. If not, make sure that your local MySQL server is started by following the [MySQL post-installation steps](https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html).

### Create a database locally

At the `mysql` prompt, create a database.

```sql
CREATE DATABASE sampledb;
```

Exit your server connection by typing `quit`.

```sql
quit
```

<a name="step2"></a>

## Create a PHP app locally
In this step, you get a Laravel sample application, configure its database connection, and run it locally.

### Clone the sample

In the terminal window, navigate to an empty directory where you can clone the sample application.  Run the following command to clone the sample repository.

```bash
git clone https://github.com/Azure-Samples/laravel-tasks
```

`cd` to your cloned directory.
Install the required packages.

```bash
cd laravel-tasks
composer install
```

### Configure MySQL connection

In the repository root, create a file named *.env*. Copy the following variables into the *.env* file. Replace the _&lt;root_password>_ placeholder with the MySQL root user's password.

```txt
APP_ENV=local
APP_DEBUG=true
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=sampledb
DB_USERNAME=root
DB_PASSWORD=<root_password>
```

For information on how Laravel uses the _.env_ file, see [Laravel Environment Configuration](https://laravel.com/docs/5.4/configuration#environment-configuration).

### Run the sample locally

Run [Laravel database migrations](https://laravel.com/docs/5.4/migrations) to create the tables the application needs. To see which tables are created in the migrations, look in the _database/migrations_ directory in the Git repository.

```bash
php artisan migrate
```

Generate a new Laravel application key.

```bash
php artisan key:generate
```

Run the application.

```bash
php artisan serve
```

Navigate to `http://localhost:8000` in a browser. Add a few tasks in the page.

:::image type="content" source="media/tutorial-php-database-app/mysql-connect-success.png" alt-text="PHP connects successfully to MySQL":::

To stop PHP, type `Ctrl + C` in the terminal.

## Create a MySQL Flexible Server (Preview)
In this step, you create a MySQL database in [Azure Database for MySQL Flexible Server](../index.yml) which is in public preview. Later, you configure the PHP application to connect to this database. In the [Azure Cloud Shell](../../cloud-shell/overview.md), create a server in with the [`az flexible-server create`](/cli/azure/mysql/server#az_mysql_flexible_server_create) command.

```azurecli-interactive
az mysql flexible-server create  --resource-group myResourceGroup --public-access <IP-Address>
```

> [!IMPORTANT]
> - Make a note of the **servername** and **connection string** to use it in the next step to connect and run laravel data migration.
> - For **IP-Address**  argument, provide the IP of your client machine. The server is locked when created and you need to permit access to your client machine to manage the server locally.

### Configure server firewall to allow web app to connect to the server

In the Cloud Shell, create a firewall rule for your MySQL server to allow client connections by using the az mysql server firewall-rule create command. When both starting IP and end IP are set to ```0.0.0.0```, the firewall is only opened for other Azure services that do not have a static IP to connect to the server.

```azurecli
az mysql flexible-server firewall-rule create --name allanyAzureIPs --server <mysql-server-name> --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

### Connect to production MySQL server locally

In the local terminal window, connect to the MySQL server in Azure. Use the value you specified previously for ```<admin-user>``` and ```<mysql-server-name>``` . When prompted for a password, use the password you specified when you created the database in Azure.

```bash
mysql -u <admin-user> -h <mysql-server-name>.mysql.database.azure.com -P 3306 -p
```

### Create a production database

At the `mysql` prompt, create a database.

```sql
CREATE DATABASE sampledb;
```

### Create a user with permissions

Create a database user called _phpappuser_ and give it all privileges in the `sampledb` database. For simplicity of the tutorial, use _MySQLAzure2020_ as the password.

```sql
CREATE USER 'phpappuser' IDENTIFIED BY 'MySQLAzure2020';
GRANT ALL PRIVILEGES ON sampledb.* TO 'phpappuser';
```

Exit the server connection by typing `quit`.

```sql
quit
```

## Connect app to MySQL flexible server

In this step, you connect the PHP application to the MySQL database you created in Azure Database for MySQL.

<a name="devconfig"></a>

### Configure the database connection

In the repository root, create an _.env.production_ file and copy the following variables into it. Replace the placeholder _&lt;mysql-server-name>_ in both *DB_HOST* and *DB_USERNAME*.

```
APP_ENV=production
APP_DEBUG=true
APP_KEY=

DB_CONNECTION=mysql
DB_HOST=<mysql-server-name>.mysql.database.azure.com
DB_DATABASE=sampledb
DB_USERNAME=phpappuser
DB_PASSWORD=MySQLAzure2017
MYSQL_SSL=true
```

Save the changes.

> [!TIP]
> To secure your MySQL connection information, this file is already excluded from the Git repository (See _.gitignore_ in the repository root). Later, you learn how to configure environment variables in App Service to connect to your database in Azure Database for MySQL. With environment variables, you don't need the *.env* file in App Service.
>

### Configure TLS/SSL certificate

By default, MySQL Flexible Server enforces TLS connections from clients. To connect to your MySQL database in Azure, you must use the [_.pem_ certificate supplied by Azure Database for MySQL Flexible Server](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem). Download [this certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem)) and place it in the **SSL** folder in the local copy of the sample app repository.

Open _config/database.php_ and add the `sslmode` and `options` parameters to `connections.mysql`, as shown in the following code.

```php
'mysql' => [
    ...
    'sslmode' => env('DB_SSLMODE', 'prefer'),
    'options' => (env('MYSQL_SSL') && extension_loaded('pdo_mysql')) ? [
        PDO::MYSQL_ATTR_SSL_KEY    => '/ssl/DigiCertGlobalRootCA.crt.pem',
    ] : []
],
```

### Test the application locally

Run Laravel database migrations with _.env.production_ as the environment file to create the tables in your MySQL database in Azure Database for MySQL. Remember that _.env.production_ has the connection information to your MySQL database in Azure.

```bash
php artisan migrate --env=production --force
```

_.env.production_ doesn't have a valid application key yet. Generate a new one for it in the terminal.

```bash
php artisan key:generate --env=production --force
```

Run the sample application with _.env.production_ as the environment file.

```bash
php artisan serve --env=production
```

Navigate to `http://localhost:8000`. If the page loads without errors, the PHP application is connecting to the MySQL database in Azure.

Add a few tasks in the page.

:::image type="content" source="media/tutorial-php-database-app/mysql-connect-success.png" alt-text="PHP connects successfully to Azure Database for MySQL":::

To stop PHP, type `Ctrl + C` in the terminal.

### Commit your changes

Run the following Git commands to commit your changes:

```bash
git add .
git commit -m "database.php updates"
```

Your app is ready to be deployed.

## Deploy to Azure

In this step, you deploy the MySQL-connected PHP application to Azure App Service.

### Configure a deployment user

FTP and local Git can deploy to an Azure web app by using a deployment user. Once you configure your deployment user, you can use it for all your Azure deployments. Your account-level deployment username and password are different from your Azure subscription credentials.

To configure the deployment user, run the [az webapp deployment user set](/cli/azure/webapp/deployment/user#az_webapp_deployment_user_set) command in Azure Cloud Shell. Replace _&lt;username>_ and _&lt;password>_ with your deployment user username and password.

The username must be unique within Azure, and for local Git pushes, must not contain the ‘@’ symbol.
The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols.

```bash
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku F1 --is-linux
```

The JSON output shows the password as null. If you get a 'Conflict'. Details: 409 error, change the username. If you get a 'Bad Request'. Details: 400 error, use a stronger password. **Record your username and password to use to deploy your web apps.**

### Create an App Service plan

In the Cloud Shell, create an App Service plan in the resource group with the [az appservice plan create](/cli/azure/appservice/plan#az_appservice_plan_create) command. The following example creates an App Service plan named myAppServicePlan in the Free pricing tier (--sku F1) and in a Linux container (--is-linux).

az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku F1 --is-linux

<a name="create"></a>

### Create a web app

Create a [web app](../../app-service/overview.md#app-service-on-linux) in the myAppServicePlan App Service plan.

In the Cloud Shell, you can use the [az webapp create](/cli/azure/webapp#az_webapp_create) command. In the following example, replace _&lt;app-name>_ with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`). The runtime is set to `PHP|7.0`. To see all supported runtimes, run [az webapp list-runtimes --linux](/cli/azure/webapp#az_webapp_list_runtimes).

```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app-name> --runtime "PHP|7.3" --deployment-local-git
```

When the web app has been created, the Azure CLI shows output similar to the following example:

```
Local git is configured with url of 'https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git'
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app-name>.azurewebsites.net",
  "deploymentLocalGitUrl": "https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git",
  "enabled": true,
  < JSON data removed for brevity. >
}
```

You’ve created an empty new web app, with git deployment enabled.

> [!NOTE]
> The URL of the Git remote is shown in the deploymentLocalGitUrl property, with the format https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git. Save this URL as you need it later.

### Configure database settings

In App Service, you set environment variables as _app settings_ by using the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command.

The following command configures the app settings `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. Replace the placeholders _&lt;app-name>_ and _&lt;mysql-server-name>_.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings DB_HOST="<mysql-server-name>.mysql.database.azure.com" DB_DATABASE="sampledb" DB_USERNAME="phpappuser" DB_PASSWORD="MySQLAzure2017" MYSQL_SSL="true"
```

You can use the PHP [getenv](https://www.php.net/manual/en/function.getenv.php) method to access the settings. the Laravel code uses an [env](https://laravel.com/docs/5.4/helpers#method-env) wrapper over the PHP `getenv`. For example, the MySQL configuration in _config/database.php_ looks like the following code:

```php
'mysql' => [
    'driver'    => 'mysql',
    'host'      => env('DB_HOST', 'localhost'),
    'database'  => env('DB_DATABASE', 'forge'),
    'username'  => env('DB_USERNAME', 'forge'),
    'password'  => env('DB_PASSWORD', ''),
    ...
],
```

### Configure Laravel environment variables

Laravel needs an application key in App Service. You can configure it with app settings.

In the local terminal window, use `php artisan` to generate a new application key without saving it to _.env_.

```bash
php artisan key:generate --show
```

In the Cloud Shell, set the application key in the App Service app by using the [`az webapp config appsettings set`](/cli/azure/webapp/config/appsettings#az_webapp_config_appsettings_set) command. Replace the placeholders _&lt;app-name>_ and _&lt;outputofphpartisankey:generate>_.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings APP_KEY="<output_of_php_artisan_key:generate>" APP_DEBUG="true"
```

`APP_DEBUG="true"` tells Laravel to return debugging information when the deployed app encounters errors. When running a production application, set it to `false`, which is more secure.

### Set the virtual application path

[Laravel application lifecycle](https://laravel.com/docs/5.4/lifecycle) begins in the _public_ directory instead of the application's root directory. The default PHP Docker image for App Service uses Apache, and it doesn't let you customize the `DocumentRoot` for Laravel. However, you can use `.htaccess` to rewrite all requests to point to _/public_ instead of the root directory. In the repository root, an `.htaccess` is added already for this purpose. With it, your Laravel application is ready to be deployed.

For more information, see [Change site root](../../app-service/configure-language-php.md?pivots=platform-linux#change-site-root).

### Push to Azure from Git

Back in the local terminal window, add an Azure remote to your local Git repository. Replace _&lt;deploymentLocalGitUrl-from-create-step>_ with the URL of the Git remote that you saved from [Create a web app](#create-a-web-app).

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Push to the Azure remote to deploy your app with the following command. When Git Credential Manager prompts you for credentials, make sure you enter the credentials you created in **Configure a deployment user**, not the credentials you use to sign in to the Azure portal.

```bash
git push azure main
```

This command may take a few minutes to run. While running, it displays information similar to the following example:

<pre>
Counting objects: 3, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 291 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Updating branch 'main'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'a5e076db9c'.
remote: Running custom deployment command...
remote: Running deployment command...
...
&lt; Output has been truncated for readability &gt;
</pre>

### Browse to the Azure app

Browse to `http://<app-name>.azurewebsites.net` and add a few tasks to the list.

:::image type="content" source="media/tutorial-php-database-app/php-mysql-in-azure.png" alt-text="PHP Web App in Azure":::

Congratulations, you're running a data-driven PHP app in Azure App Service.

## Update model locally and redeploy

In this step, you make a simple change to the `task` data model and the webapp, and then publish the update to Azure.

For the tasks scenario, you modify the application so that you can mark a task as complete.

### Add a column

In the local terminal window, navigate to the root of the Git repository.

Generate a new database migration for the `tasks` table:

```bash
php artisan make:migration add_complete_column --table=tasks
```

This command shows you the name of the migration file that's generated. Find this file in _database/migrations_ and open it.

Replace the `up` method with the following code:

```php
public function up()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->boolean('complete')->default(False);
    });
}
```

The preceding code adds a boolean column in the `tasks` table called `complete`.

Replace the `down` method with the following code for the rollback action:

```php
public function down()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropColumn('complete');
    });
}
```

In the local terminal window, run Laravel database migrations to make the change in the local database.

```bash
php artisan migrate
```

Based on the [Laravel naming convention](https://laravel.com/docs/5.4/eloquent#defining-models), the model `Task` (see _app/Task.php_) maps to the `tasks` table by default.

### Update application logic

Open the *routes/web.php* file. The application defines its routes and business logic here.

At the end of the file, add a route with the following code:

```php
/**
 * Toggle Task completeness
 */
Route::post('/task/{id}', function ($id) {
    error_log('INFO: post /task/'.$id);
    $task = Task::findOrFail($id);

    $task->complete = !$task->complete;
    $task->save();

    return redirect('/');
});
```

The preceding code makes a simple update to the data model by toggling the value of `complete`.

### Update the view

Open the *resources/views/tasks.blade.php* file. Find the `<tr>` opening tag and replace it with:

```html
<tr class="{{ $task->complete ? 'success' : 'active' }}" >
```

The preceding code changes the row color depending on whether the task is complete.

In the next line, you have the following code:

```html
<td class="table-text"><div>{{ $task->name }}</div></td>
```

Replace the entire line with the following code:

```html
<td>
    <form action="{{ url('task/'.$task->id) }}" method="POST">
        {{ csrf_field() }}

        <button type="submit" class="btn btn-xs">
            <i class="fa {{$task->complete ? 'fa-check-square-o' : 'fa-square-o'}}"></i>
        </button>
        {{ $task->name }}
    </form>
</td>
```

The preceding code adds the submit button that references the route that you defined earlier.

### Test the changes locally

In the local terminal window, run the development server from the root directory of the Git repository.

```bash
php artisan serve
```

To see the task status change, navigate to `http://localhost:8000` and select the checkbox.

:::image type="content" source="media/tutorial-php-database-app/complete-checkbox.png" alt-text="Added check box to task":::

To stop PHP, type `Ctrl + C` in the terminal.

### Publish changes to Azure

In the local terminal window, run Laravel database migrations with the production connection string to make the change in the Azure database.

```bash
php artisan migrate --env=production --force
```

Commit all the changes in Git, and then push the code changes to Azure.

```bash
git add .
git commit -m "added complete checkbox"
git push azure main
```

Once the `git push` is complete, navigate to the Azure app and test the new functionality.

:::image type="content" source="media/tutorial-php-database-app/complete-checkbox-published.png" alt-text="Model and database changes published to Azure":::

If you added any tasks, they are retained in the database. Updates to the data schema leave existing data intact.

## Clean up resources
In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```bash
az group delete --name myResourceGroup
```

<a name="next"></a>

## Next steps

> [!div class="nextstepaction"]
> [How to manage your resources in Azure portal](../../azure-resource-manager/management/manage-resources-portal.md) <br/>
> [!div class="nextstepaction"]
> [How to manage your server](how-to-manage-server-cli.md)
