---
title: Build a PHP and MySQL web app in Azure | Microsoft Docs 
description: Learn how to get a PHP app working in Azure, with connection to a MySQL database in Azure.
services: app-service\web
documentationcenter: nodejs
author: cephalin
manager: erikre
editor: ''

ms.assetid: 14feb4f3-5095-496e-9a40-690e1414bd73
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: article
ms.date: 06/19/2017
ms.author: cephalin
ms.custom: mvc
---
# Build a PHP and MySQL web app in Azure
[Azure Web Apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) provides a highly scalable, self-patching web hosting service. This tutorial shows how to create a PHP web app in Azure and connect it to a MySQL database. When you're finished, you'll have a [Laravel](https://laravel.com/) app running on Azure App Service Web Apps.

![PHP app running in Azure App Service](./media/app-service-web-tutorial-php-mysql/complete-checkbox-published.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a MySQL database in Azure
> * Connect a PHP app to MySQL
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

## Prerequisites

To complete this tutorial:

* [Install Git](https://git-scm.com/)
* [Install PHP 5.6.4 or above](http://php.net/downloads.php)
* [Install Composer](https://getcomposer.org/doc/00-intro.md)
* Enable the following PHP extensions Laravel needs: OpenSSL, PDO-MySQL, Mbstring, Tokenizer, XML
* [Install and start MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html) 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Prepare local MySQL

In this step, you create a database in your local MySQL server for your use in this tutorial.

### Connect to MySQL server
In a terminal window, connect to your local MySQL server. You can use this terminal window to run all the commands in this tutorial.

```bash
mysql -u root -p
```

If you're prompted for a password, enter the password for the `root` account. If you don't remember your root account password, see [MySQL: How to Reset the Root Password](https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html).

If your command runs successfully, then your MySQL server is running. If not, make sure that your local MySQL server is started by following the [MySQL post-installation steps](https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html).

### Create a database

At the `mysql` prompt, create a database.

```sql 
CREATE DATABASE sampledb;
```

Exit your server connection by typing `quit`.

```sql
quit
```

<a name="step2"></a>

## Create local PHP app
In this step, you get a Laravel sample application, configure its database connection, and run it locally. 

### Clone the sample

In the terminal window, `cd` to a working directory.  

Run the following command to clone the sample repository. 

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

```
APP_ENV=local
APP_DEBUG=true
APP_KEY=SomeRandomString

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=sampledb
DB_USERNAME=root
DB_PASSWORD=<root_password>
```

For information on how Laravel uses the _.env_ file, see [Laravel Environment Configuration](https://laravel.com/docs/5.4/configuration#environment-configuration).

### Run the sample

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

![PHP connects successfully to MySQL](./media/app-service-web-tutorial-php-mysql/mysql-connect-success.png)

To stop PHP, type `Ctrl + C` in the terminal. 

## Create MySQL in Azure

In this step, you create a MySQL database in [Azure Database for MySQL (Preview)](/azure/mysql). Later, you configure the PHP application to connect to this database.

### Log in to Azure

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli
az login 
```
### Create a resource group

[!INCLUDE [Create resource group](../../includes/app-service-web-create-resource-group-no-h.md)] 

### Create a MySQL server

Create a server in Azure Database for MySQL (Preview) with the [az mysql server create](/cli/azure/mysql/server#create) command.

In the following command, substitute your MySQL server name where you see the _&lt;mysql_server_name>_ placeholder (valid characters are `a-z`, `0-9`, and `-`). This name is part of the MySQL server's hostname  (`<mysql_server_name>.database.windows.net`), it needs to be globally unique. 

```azurecli-interactive
az mysql server create \
    --name <mysql_server_name> \
    --resource-group myResourceGroup \
    --location "North Europe" \
    --user adminuser \
    --password MySQLAzure2017
```

When the MySQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "adminuser",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "<mysql_server_name>.database.windows.net",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/<mysql_server_name>",
  "location": "northeurope",
  "name": "<mysql_server_name>",
  "resourceGroup": "myResourceGroup",
  ...
}
```

### Configure server firewall

Create a firewall rule for your MySQL server to allow client connections by using the [az mysql server firewall-rule create](/cli/azure/mysql/server/firewall-rule#create) command. 

```azurecli-interactive
az mysql server firewall-rule create \
    --name allIPs \
    --server <mysql_server_name> \
    --resource-group myResourceGroup \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 255.255.255.255
```

> [!NOTE]
> Azure Database for MySQL (Preview) doesn't currently limit connections only to Azure services. As IP addresses in Azure are dynamically assigned, it is better to enable all IP addresses. The service is in preview. Better methods for securing your database are planned.
>
>

### Connect to production MySQL server

In the terminal window, connect to the MySQL server in Azure. Use the value you specified previously for _&lt;mysql_server_name>_.

```bash
mysql -u adminuser@<mysql_server_name> -h <mysql_server_name>.database.windows.net -P 3306 -p
```

When prompted for a password, use _$tr0ngPa$w0rd!_, which you specified when you created the database.

### Create a production database

At the `mysql` prompt, create a database.

```sql
CREATE DATABASE sampledb;
```

### Create a user with permissions

Create a database user called _phpappuser_ and give it all privileges in the `sampledb` database.

```sql
CREATE USER 'phpappuser' IDENTIFIED BY 'MySQLAzure2017'; 
GRANT ALL PRIVILEGES ON sampledb.* TO 'phpappuser';
```

Exit the server connection by typing `quit`.

```sql
quit
```

## Connect app to Azure MySQL

In this step, you connect the PHP application to the MySQL database you created in Azure Database for MySQL (Preview). 

<a name="devconfig"></a>
### Configure the connection 

In the repository root, create an _.env.production_ file and copy the following variables into it. Replace the placeholder _&lt;mysql_server_name>_.

```
APP_ENV=production
APP_DEBUG=true
APP_KEY=SomeRandomString

DB_CONNECTION=mysql
DB_HOST=<mysql_server_name>.database.windows.net
DB_DATABASE=sampledb
DB_USERNAME=phpappuser@<mysql_server_name>
DB_PASSWORD=MySQLAzure2017
MYSQL_SSL=true
```

Save the changes.

> [!TIP]
> To secure your MySQL connection information, this file is already excluded from the Git repository (See _.gitignore_ in the repository root). Later, you learn how to configure environment variables in App Service to connect to your database in Azure Database for MySQL (Preview). With environment variables, you don't need the *.env* file in App Service. 
>

### Configure SSL certificate

By default, Azure Database for MySQL enforces SSL connections from clients. To connect to your MySQL database in Azure, you must use a _.pem_ SSL certificate.

Open _config/database.php_ and add the _sslmode_ and _options_ parameters to `connections.mysql`, as shown in the following code.

```php
'mysql' => [
    ...
    'sslmode' => env('DB_SSLMODE', 'prefer'),
    'options' => (env('MYSQL_SSL')) ? [
        PDO::MYSQL_ATTR_SSL_KEY    => '/ssl/certificate.pem', 
    ] : []
],
```

To learn how to generate this _certificate.pem_, see [Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](../mysql/howto-configure-ssl.md).

> [!TIP]
> The path _/ssl/certificate.pem_ points to an existing _certificate.pem_ file in the Git repository. This file is provided for convenience in this tutorial. For best practice, you should not commit your _.pem_ certificates into source control. 
>
>

### Test the application

Run Laravel database migrations with _.env.production_ as the environment file to create the tables in your MySQL database in Azure Database for MySQL (Preview). Remember that _.env.production_ has the connection information to your MySQL database in Azure.

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

![PHP connects successfully to Azure Database for MySQL (Preview)](./media/app-service-web-tutorial-php-mysql/mysql-connect-success.png)

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

### Create an App Service plan

[!INCLUDE [Create app service plan no h](../../includes/app-service-web-create-app-service-plan-no-h.md)] 

### Create a web app

[!INCLUDE [Create web app no h](../../includes/app-service-web-create-web-app-no-h.md)] 

### Set the PHP version

Set the PHP version that the application requires by using the [az webapp config set](/cli/azure/webapp/config#set) command.

The following command sets the PHP version to _7.0_.

```azurecli-interactive
az webapp config set \
    --name <app_name> \
    --resource-group myResourceGroup \
    --php-version 7.0
```

### Configure database settings

As pointed out previously, you can connect to your Azure MySQL database using environment variables in App Service.

In App Service, you set environment variables as _app settings_ by using the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#set) command. 

The following command configures the app settings `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. Replace the placeholders _&lt;appname>_ and _&lt;mysql_server_name>_.

```azurecli-interactive
az webapp config appsettings set \
    --name <app_name> \
    --resource-group myResourceGroup \
    --settings DB_HOST="<mysql_server_name>.database.windows.net" DB_DATABASE="sampledb" DB_USERNAME="phpappuser@<mysql_server_name>" DB_PASSWORD="MySQLAzure2017" MYSQL_SSL="true"
```

You can use the PHP [getenv](http://www.php.net/manual/function.getenv.php) method to access the settings. the Laravel code uses an [env](https://laravel.com/docs/5.4/helpers#method-env) wrapper over the PHP `getenv`. For example, the MySQL configuration in _config/database.php_ looks like the following code:

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

Use `php artisan` to generate a new application key without saving it to _.env_.

```bash
php artisan key:generate --show
```

Set the application key in the App Service web app by using the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#set) command. Replace the placeholders _&lt;appname>_ and _&lt;outputofphpartisankey:generate>_.

```azurecli-interactive
az webapp config appsettings set \
    --name <app_name> \
    --resource-group myResourceGroup \
    --settings APP_KEY="<output_of_php_artisan_key:generate>" APP_DEBUG="true"
```

`APP_DEBUG="true"` tells Laravel to return debugging information when the deployed web app encounters errors. When running a production application, set it to `false`, which is more secure.

### Set the virtual application path

Set the virtual application path for the web app. This step is required because the [Laravel application lifecycle](https://laravel.com/docs/5.4/lifecycle) begins in the _public_ directory instead of the application's root directory. Other PHP frameworks whose lifecycle start in the root directory can work without manual configuration of the virtual application path.

Set the virtual application path by using the [az resource update](/cli/azure/resource#update) command. Replace the _&lt;appname>_ placeholder.

```azurecli-interactive
az resource update \
    --name web \
    --resource-group myResourceGroup \
    --namespace Microsoft.Web \
    --resource-type config \
    --parent sites/<app_name> \
    --set properties.virtualApplications[0].physicalPath="site\wwwroot\public" \
    --api-version 2015-06-01
```

By default, Azure App Service points the root virtual application path (_/_) to the root directory of the deployed application files (_sites\wwwroot_). 

### Configure a deployment user

[!INCLUDE [Configure deployment user](../../includes/configure-deployment-user-no-h.md)] 

### Configure local Git deployment 

[!INCLUDE [Configure local git](../../includes/app-service-web-configure-local-git-no-h.md)] 

### Push to Azure from Git

Add an Azure remote to your local Git repository. 

```bash
git remote add azure <paste_copied_url_here> 
```

Push to the Azure remote to deploy the PHP application. You are prompted for the password you supplied earlier as part of the creation of the deployment user. 

```bash
git push azure master
```

During deployment, Azure App Service communicates its progress with Git.

```bash
Counting objects: 3, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 291 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'a5e076db9c'.
remote: Running custom deployment command...
remote: Running deployment command...
...
< Output has been truncated for readability >
``` 

> [!NOTE]
> You may notice that the deployment process installs [Composer](https://getcomposer.org/) packages at the end. App Service does not run these automations during default deployment, so this sample repository has three additional files in its root directory to enable it: 
>
> - `.deployment` - This file tells App Service to run `bash deploy.sh` as the custom deployment script.
> - `deploy.sh` - The custom deployment script. If you review the file, you will see that it runs `php composer.phar install` after `npm install`. 
> - `composer.phar` - The Composer package manager.
>
> You can use this approach to add any step to your Git-based deployment to App Service. For more information, see [Custom Deployment Script](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script).
>
>


### Browse to the Azure web app

Browse to `http://<app_name>.azurewebsites.net` and add a few tasks to the list. 

![PHP app running in Azure App Service](./media/app-service-web-tutorial-php-mysql/php-mysql-in-azure.png)

Congratulations, you're running a data-driven PHP app in Azure App Service.

## Update model and redeploy

In this step, you make a simple change to the `task` data model and the webapp, and then publish the update to Azure.

For the tasks scenario, you modify the application so that you can mark a task as complete. 

### Add a column

In the terminal, navigate to the root of the Git repository.

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

In the terminal, run Laravel database migrations to make the change in the local database.

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

From the root directory of the Git repository, run the development server.

```bash
php artisan serve
```

To see the task status change, navigate to `http://localhost:8000` and select the checkbox.

![Added check box to task](./media/app-service-web-tutorial-php-mysql/complete-checkbox.png)

To stop PHP, type `Ctrl + C` in the terminal. 

### Publish changes to Azure

In the terminal, run Laravel database migrations with the production connection string to make the change in the Azure database.

```bash
php artisan migrate --env=production --force
```

Commit all the changes in Git, and then push the code changes to Azure.

```bash
git add .
git commit -m "added complete checkbox"
git push azure master
```

Once the `git push` is complete, navigate to the Azure web app and test the new functionality.

![Model and database changes published to Azure](media/app-service-web-tutorial-php-mysql/complete-checkbox-published.png)

If you added any tasks, they are retained in the database. Updates to the data schema leave existing data intact.

## Stream diagnostic logs 

While the PHP application runs in Azure App Service, you can get the console logs piped to your terminal. That way, you can get the same diagnostic messages to help you debug application errors.

To start log streaming, use the [az webapp log tail](/cli/azure/webapp/log#tail) command.

```azurecli-interactive 
az webapp log tail \
    --name <app_name> \
    --resource-group myResourceGroup
``` 

Once log streaming has started, refresh the Azure web app in the browser to get some web traffic. You can now see console logs piped to the terminal. If you don't see console logs immediately, check again in 30 seconds.

To stop log streaming at anytime, type `Ctrl`+`C`. 

> [!TIP]
> A PHP application can use the standard [error_log()](http://php.net/manual/function.error-log.php) to output to the console. The sample application uses this approach in _app/Http/routes.php_.
>
> As a web framework, [Laravel uses Monolog](https://laravel.com/docs/5.4/errors) as the logging provider. To see how to get Monolog to output messages to the console, see [PHP: How to use monolog to log to console (php://out)](http://stackoverflow.com/questions/25787258/php-how-to-use-monolog-to-log-to-console-php-out).
>
>

## Manage the Azure web app

Go to the [Azure portal](https://portal.azure.com) to manage the web app you created.

From the left menu, click **App Services**, and then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-tutorial-php-mysql/access-portal.png)

You see your web app's Overview page. Here, you can perform basic management tasks like  stop, start, restart, browse, and delete. 

The left menu provides pages for configuring your app. 

![App Service page in Azure portal](./media/app-service-web-tutorial-php-mysql/web-app-blade.png)

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

<a name="next"></a>

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a MySQL database in Azure
> * Connect a PHP app to MySQL
> * Deploy the app to Azure
> * Update the data model and redeploy the app
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

Advance to the next tutorial to learn how to map a custom DNS name to a web app.

> [!div class="nextstepaction"] 
> [Map an existing custom DNS name to Azure Web Apps](app-service-web-tutorial-custom-domain.md)
