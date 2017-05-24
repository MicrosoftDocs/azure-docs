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
ms.date: 05/05/2017
ms.author: cephalin

---
# Build a PHP and MySQL web app in Azure
This tutorial shows you how to create a PHP web app in Azure and connect it to a MySQL database. When you are finished, you'll have a [Laravel](https://laravel.com/) application running on [Azure App Service Web Apps](app-service-web-overview.md).

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

Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. [Download and install PHP 5.6.4 or above](http://php.net/downloads.php)
1. [Download and install Composer](https://getcomposer.org/doc/00-intro.md)
1. Enable the following PHP extensions Laravel needs: OpenSSL, PDO-MySQL, Mbstring, Tokenizer, XML
1. [Download, install, and start MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html) 
1. [Download and install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prepare local MySQL

In this step, you create a database in your local MySQL server for your use in this tutorial.

### Connect to MySQL server
In a terminal window, connect to your local MySQL server.

```bash
mysql -u root -p
```

If you're prompted for a password, enter the password for the `root` account. If you don't remember your root account password, see [MySQL: How to Reset the Root Password](https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html).

If your command runs successfully, then your MySQL server is already running. If not, make sure that your local MySQL server is started by following the [MySQL post-installation steps](https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html).

### Create a database

In the `mysql` prompt, create a database.

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

Open the terminal window and `cd` to a working directory.  

Run the following commands to clone the sample repository. 

```bash
git clone https://github.com/Azure-Samples/laravel-tasks
```

`cd` to your cloned directory and install the required packages.

```bash
cd laravel-tasks
composer install
```

### Configure MySQL connection

In the repository root, create a _.env_ file and copy the following variables into it. Replace the _&lt;root_password>_ placeholder with the root user's password.

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

> [!NOTE]
> For information on how Laravel uses this _.env_ file, see [Laravel Environment Configuration](https://laravel.com/docs/5.4/configuration#environment-configuration).
>
>

### Run the sample

Run [Laravel database migrations](https://laravel.com/docs/5.4/migrations) to create the tables your application needs. To see which tables are created in the migrations, look in the _database/migrations_ directory in your Git repository.

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

To stop PHP at any time, type `Ctrl`+`C` in the terminal. 

## Create production MySQL in Azure

In this step, you create a MySQL database in [Azure Database for MySQL (Preview)](/azure/mysql). Later, you'll configure your PHP application to connect to this database.

### Log in to Azure

You are now going to use the Azure CLI 2.0 in a terminal window to create the resources needed to host your PHP application in Azure App Service. Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 

### Create a resource group

Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources like web apps, databases, and storage accounts are deployed and managed. 

The following example creates a resource group in the North Europe region:

```azurecli
az group create --name myResourceGroup --location "North Europe"
```

To see what possible values you can use for `--location`, use the [az appservice list-locations](/cli/azure/appservice#list-locations) command.

### Create a MySQL server

Create a server in Azure Database for MySQL (Preview) with the [az mysql server create](/cli/azure/mysql/server#create) command.

In the following command, substitute your own unique MySQL server name where you see the _&lt;mysql_server_name>_ placeholder. This name is part of your MySQL server's hostname, `<mysql_server_name>.database.windows.net`, so it needs to be globally unique. Similarly, substitute _&lt;admin_user>_ and _&lt;admin_password>_ with your own values.

```azurecli
az mysql server create \
    --name <mysql_server_name> \
    --resource-group myResourceGroup \
    --location "North Europe" \
    --user <admin_user> \
    --password <admin_password>
```

When the MySQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "<admin_user>",
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

```azurecli
az mysql server firewall-rule create \
    --name allIPs \
    --server <mysql_server_name> \
    --resource-group myResourceGroup \
    --start-ip-address 0.0.0.0 \
    --end-ip-address 255.255.255.255
```

> [!NOTE]
> Azure Database for MySQL (Preview) doesn't yet enable connections only from Azure services. As IP addresses in Azure are dynamically assigned, it is better to enable all IP addresses for now. As the service is in preview, better methods for securing your database will be enabled soon.
>
>

### Connect to production MySQL server

In the terminal window, connect to the MySQL server in Azure. Use the value you specified previously for _&lt;admin_user>_ and _&lt;mysql_server_name>_.

```bash
mysql -u <admin_user>@<mysql_server_name> -h <mysql_server_name>.database.windows.net -P 3306 -p
```

### Create a production database

In the `mysql` prompt, create a database.

```sql
CREATE DATABASE sampledb;
```

### Create a user with permissions

Create a database user and give it all privileges in the `sampledb` database. Replace the placeholders _&lt;phpapp_user>_ and _&lt;phpapp_password>_ with your own unique app name.

```sql
CREATE USER '<phpapp_user>' IDENTIFIED BY '<phpapp_password>'; 
GRANT ALL PRIVILEGES ON sampledb.* TO '<phpapp_user>';
```

Exit your server connection by typing `quit`.

```sql
quit
```

## Connect app to production MySQL

In this step, you connect your PHP application to the MySQL database you just created in Azure Database for MySQL (Preview). 

<a name="devconfig"></a>
### Configure the connection 

In the repository root, create a _.env.production_ file and copy the following variables into it. Replace the placeholders _&lt;mysql_server_name>_, _&lt;phpapp_user>_, and _&lt;phpapp_password>_.

```
APP_ENV=production
APP_DEBUG=true
APP_KEY=SomeRandomString

DB_CONNECTION=mysql
DB_HOST=<mysql_server_name>.database.windows.net
DB_DATABASE=sampledb
DB_USERNAME=<phpapp_user>@<mysql_server_name>
DB_PASSWORD=<phpapp_password>
```

Save your changes.

### Test the application

Run Laravel database migrations with _.env.production_ as the environment file to create the tables in your MySQL database in Azure Database for MySQL (Preview).

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

Navigate to `http://localhost:8000` in a browser. If the page loads without errors, then your PHP application is connecting to the MySQL database in Azure. 

Add a few tasks in the page.

![PHP connects successfully to Azure Database for MySQL (Preview)](./media/app-service-web-tutorial-php-mysql/mysql-connect-success.png)

To stop PHP at any time, type `Ctrl`+`C` in the terminal. 

### Secure sensitive data

You need to make sure that the sensitive data in _.env.production_ is not committed into Git.

To do this, open _.gitignore_ from the repository root and add the filename in a new line:

```
.env.production
```

Save your changes, then commit your changes to Git.

```bash
git add .gitignore
git commit -m "keep sensitive data out of git"
```

Later, you learn how to configure environment variables in App Service to connect to your database in Azure Database for MySQL (Preview), so you don't need any `.env` file in App Service. 

## Deploy PHP app to Azure
In this step, you deploy your MySQL-connected PHP application to Azure App Service.

### Create an App Service plan

Create an App Service plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command. 

[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

The following example creates an App Service plan named _myAppServicePlan_ using the **FREE** pricing tier:

```azurecli
az appservice plan create \
    --name myAppServicePlan \
    --resource-group myResourceGroup \
    --sku FREE
```

When the App Service plan is created, the Azure CLI shows information similar to the following example:

```json 
{ 
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "North Europe",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "kind": "app",
  "location": "North Europe",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  ...
  < Output has been truncated for readability >
} 
``` 

### Create a web app

Now that an App Service plan has been created, create a web app within the _myAppServicePlan_ App Service plan. The web app gives you a hosting space to deploy your code and provides a URL for you to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the web app. 

In the following command, substitute the _&lt;appname>_ placeholder with your own unique app name. This unique name is used as the part of the default domain name for the web app, so the name needs to be unique across all apps in Azure. You can later map any custom DNS entry to the web app before you expose it to your users. 

```azurecli
az appservice web create \
    --name <app_name> \
    --resource-group myResourceGroup \
    --plan myAppServicePlan
```

When the web app has been created, the Azure CLI shows information similar to the following example: 

```json 
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "<app_name>.azurewebsites.net",
  "enabled": true,
  ...
  < Output has been truncated for readability >
}
```

### Set the PHP version

Set the PHP version that your application requires by using the [az appservice web config update](/cli/azure/appservice/web/config#update) command.

The following command sets the PHP version to _7.0_.

```azurecli
az appservice web config update \
    --name <app_name> \
    --resource-group myResourceGroup \
    --php-version 7.0
```

### Configure database settings

As pointed out previously, you can connect to your Azure MySQL database using environment variables in App Service.

In App Service, you set environment variables as _app settings_ by using the [az appservice web config appsettings update](/cli/azure/appservice/web/config/appsettings#update) command. 

The following command lets you configure the app settings `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. Replace the placeholders _&lt;appname>_, _&lt;mysql_server_name>_, _&lt;phpapp_user>_, and _&lt;phpapp_password>_.

```azurecli
az appservice web config appsettings update \
    --name <app_name> \
    --resource-group myResourceGroup \
    --settings DB_HOST="<mysql_server_name>.database.windows.net" DB_DATABASE="sampledb" DB_USERNAME="<phpapp_user>@<mysql_server_name>" DB_PASSWORD="<phpapp_password>"
```

You can use the PHP [getenv()](http://www.php.net/manual/function.getenv.php) method to access the settings. Your Laravel code uses an [env()](https://laravel.com/docs/5.4/helpers#method-env) wrapper over the PHP `getenv()`. For example, your MySQL configuration in _config/database.php_ looks like this:

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

Just like on your local machine, Laravel needs an application key in App Service. You can configure it with app settings too.

Use `php artisan` to generate a new application key without saving it to _.env_.

```bash
php artisan key:generate --show
```

Set the application key in your App Service web app by using the [az appservice web config appsettings update](/cli/azure/appservice/web/config/appsettings#update) command. Replace the placeholders _&lt;appname>_ and _&lt;outputofphpartisankey:generate>_.

```azurecli
az appservice web config appsettings update \
    --name <app_name> \
    --resource-group myResourceGroup \
    --settings APP_KEY="<output_of_php_artisan_key:generate>" APP_DEBUG="true"
```

> [!NOTE]
> `APP_DEBUG="true"` tells Laravel to return debugging information if your deployed web app encounters errors. When running a production application, you should set it to `false` instead for better security.
>
>

### Set the virtual application path

Set the virtual application path for your web app. You only need this step because the [Laravel application lifecycle](https://laravel.com/docs/5.4/lifecycle) begins in the _public_ directory instead of your application's root directory. Other PHP frameworks whose lifecycle start in the root directory can work without manual configuration of the virtual application path.

You set the virtual application path by using the [az resource update](/cli/azure/resource#update) command. Replace the _&lt;appname>_ placeholder.

```bash
az resource update \
    --name web \
    --resource-group myResourceGroup \
    --namespace Microsoft.Web \
    --resource-type config \
    --parent sites/<app_name> \
    --set properties.virtualApplications[0].physicalPath="site\wwwroot\public" \
    --api-version 2015-06-01
```

> [!NOTE]
> By default, Azure App Service points the root virtual application path (_/_) to the root directory of your deployed application files (_sites\wwwroot_). 
>
>

### Configure a deployment user

For FTP and local Git, it is necessary to have a deployment user configured on the server to authenticate your deployment. 

> [!NOTE] 
> A deployment user is required for FTP and Local Git deployment to a Web App. The username and password are account-level, as such, are different from your Azure Subscription credentials.

If you've previously created a deployment username and password, you can use the following command to show the username:

```azurecli
az appservice web deployment user show
```

If you don't already have a deployment user, run the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your deployment credentials. 

```azurecli
az appservice web deployment user set \
    --user-name <username> \
    --password <minimum-8-char-capital-lowercase-number>
```

The username must be unique and the password must be strong. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password.

You only need to create this deployment user once; you can use it for all your Azure deployments.

Record the username and password, as they are used later when you deploy the application.

### Configure local git deployment 

You can deploy your application to Azure App Service in various ways including FTP, local Git, GitHub, Visual Studio Team Services, and BitBucket. 

Use the [az appservice web source-control config-local-git](/cli/azure/appservice/web/source-control#config-local-git) command to configure local Git access to the Azure web app. 

```azurecli
az appservice web source-control config-local-git \
    --name <app_name> \
    --resource-group myResourceGroup
```

When the deployment user is configured, the Azure CLI shows the deployment URL for your Azure web app in the following format:

```bash 
https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git 
``` 

Copy the output from the terminal as it will be used in the next step. 

### Push to Azure from Git

Add an Azure remote to your local Git repository. 

```bash
git remote add azure <paste_copied_url_here> 
```

Push to the Azure remote to deploy your PHP application. You will be prompted for the password you supplied earlier as part of the creation of the deployment user. 

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

**Congratulations!** You're running a data-driven PHP app in Azure App Service.

## Update data model and redeploy

In this step, you make some changes to the `task` data model and publish your changes to Azure.

For the tasks scenario, you want to modify your application so that you can mark a task as complete. 

### Add a column

In the terminal, make sure you're in the root of your Git repository, then generate a new database migration for the `tasks` table.

```bash
php artisan make:migration add_complete_column --table=tasks
```

This command shows you the name of the migration file that's generated. Find this file in _database/migrations_ and open it in a text editor.

Replace the up() method with the following code:

```php
public function up()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->boolean('complete')->default(False);
    });
}
```

This code adds a boolean column in the `tasks` table called `complete`.

Replace the down() method with the following code for the rollback action:

```php
public function down()
{
    Schema::table('tasks', function (Blueprint $table) {
        $table->dropColumn('complete');
    });
}
```

In the terminal, run Laravel database migrations locally to make the change in your local database.

```bash
php artisan migrate
```

Based on the [Laravel naming convention](https://laravel.com/docs/5.4/eloquent#defining-models), the model `Task` (see _app/Task.php_) maps to the `tasks` table by default, so you're finished with updating the data model.

### Update application logic

Open _routes/web.php_. The sample application defines its routes and business logic here.

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

This code makes a simple update to your data model by toggling the value of `complete`.

### Update the view

Open _resources/views/tasks.blade.php_. Find the `<tr>` opening tag and replace it with:

```html
<tr class="{{ $task->complete ? 'success' : 'active' }}" >
```

This changes the row color depending on whether the task is complete.

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

This code adds the submit button that references the route that you defined earlier.

### Test your changes locally

From the root directory of your Git repository, run the development server again.

```bash
php artisan serve
```

Navigate to `http://localhost:8000` in a browser and click the checkbox to see the task status change accordingly.

![Added check box to task](./media/app-service-web-tutorial-php-mysql/complete-checkbox.png)

### Publish changes to Azure

In the terminal, run Laravel database migrations with the production connection string to make the change in your production database in Azure.

```bash
php artisan migrate --env=production --force
```

Commit all your changes in Git, then push the code changes to Azure.

```bash
git add .
git commit -m "added complete checkbox"
git push azure master
```

Once the `git push` is complete, navigate to your Azure web app again and try out the new functionality.

![Model and database changes published to Azure](media/app-service-web-tutorial-php-mysql/complete-checkbox-published.png)

> [!NOTE]
> If you added any tasks earlier, you still can see them. Your updates to the data schema leaves your existing data intact.
>
>

## Stream diagnostic logs 

While your PHP application runs in Azure App Service, you can get the console logs piped directly to your terminal. That way, you can get the same diagnostic messages to help you debug application errors.

To start log streaming, use the [az appservice web log tail](/cli/azure/appservice/web/log#tail) command.

```azurecli 
az appservice web log tail \
    --name <app_name> \
    --resource-group myResourceGroup 
``` 

Once log streaming has started, refresh your Azure web app in the browser to get some web traffic. You should now see console logs piped to your terminal.

To stop log streaming at anytime, type `Ctrl`+`C`. 

> [!TIP]
> A PHP application can use the standard [error_log()](http://php.net/manual/function.error-log.php) to output to the console. The sample application uses this approach in _app/Http/routes.php_.
>
> As a web framework, [Laravel uses Monolog](https://laravel.com/docs/5.4/errors) as the logging provider. To see how to get Monolog to output messages to the console, see [PHP: How to use monolog to log to console (php://out)](http://stackoverflow.com/questions/25787258/php-how-to-use-monolog-to-log-to-console-php-out).
>
>

## Manage your Azure web app

Go to the Azure portal to see the web app you created.

To do this, sign in to [https://portal.azure.com](https://portal.azure.com).

From the left menu, click **App Service**, then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-tutorial-php-mysql/access-portal.png)

You have landed in your web app's _blade_ (a portal page that opens horizontally).

By default, your web app's blade shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the blade show the different configuration pages you can open.

![App Service blade in Azure portal](./media/app-service-web-tutorial-php-mysql/web-app-blade.png)

These tabs in the blade show the many great features you can add to your web app. The following list gives you just a few of the possibilities:

* Map a custom DNS name
* Bind a custom SSL certificate
* Configure continuous deployment
* Scale up and out
* Add user authentication

## Clean up Resources
 
If you don't need these resources for another tutorial (see [Next steps](#next)), you can delete them by running the following command: 
  
```azurecli 
az group delete --name myResourceGroup 
``` 

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

Advance to the next tutorial to learn how to map a custom DNS name to it.

> [!div class="nextstepaction"] 
> [Map an existing custom DNS name to Azure Web Apps](app-service-web-tutorial-custom-domain.md)
