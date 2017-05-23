---
title: Build a Java and MySQL web app in Azure
description: Learn how to get a Java app that connects to the Azure MySQL database service working in Azure appservice .
services: app-service\web
documentationcenter: Java
author: bbenz
manager: jeffsand
editor: jasonwhowell
ms.assetid: 
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 05/22/2017
ms.author: bbenz
---
# Build a Java and MySQL web app in Azure
This tutorial shows you how to create a Java web app in Azure that connects to a MySQL database. 
The first step is to clone an application to your local machine, and have it work with a local MySQL instance.
The next step is to set up Azure services for the Java app and MySQL, then deploy the application to an Azure appservice.
When you are finished, you will have a to-do list application running on Azure and connecting to the Azure MySQL database service.

![Java app running in Azure appservice](./media/app-service-web-tutorial-java-mysql/appservice-web-app.png)

## Before you begin
Before running this sample, install the following prerequisites locally:

1. [Download and install git](https://git-scm.com/)
1. [Download and install Java 7 or above](http://Java.net/downloads.Java)
1. [Download and install Maven](https://maven.apache.org/download.cgi)
1. [Download, install, and start MySQL](https://dev.mysql.com/doc/refman/5.7/en/installing.html) 
1. [Download and install the Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prepare local MySQL database

In this step, you create a database in a local MySQL server for your use in this tutorial.

### Connect to MySQL server
Connect to your local MySQL server from the command line:

```bash
mysql -u root -p
```

If your command runs successfully, then your MySQL server is already running. If not, make sure that your local MySQL server is started by following the [MySQL post-installation steps](https://dev.mysql.com/doc/refman/5.7/en/postinstallation.html).

If you're prompted for a password, enter the password for the `root` account. If you don't remember your root account password, see [MySQL: How to Reset the Root Password](https://dev.mysql.com/doc/refman/5.7/en/resetting-permissions.html).


### Create a database and table

In the `mysql` prompt, create a database and a table for the to-do items.

```sql
CREATE DATABASE todoItemDb;
USE todoItemDb;
CREATE TABLE ITEMS ( id varchar(255), name varchar(255), category varchar(255), complete bool);
```

Exit your server connection by typing `quit`.

```sql
quit
```

## Create local Java application
In this step, you clone a GitHub repo, configure the MySQL database connection, and run the app locally. 

### Clone the sample

From the command prompt, navigate to a working directory.  

Run the following commands to clone the sample repository. 

```bash
git clone https://github.com/bbenz/azure-mysql-java-todo-app
```

Next, set up lombok.jar by following the steps in the repo's readme.


### Configure MySQL connection

This application uses the Maven Jetty plugin to run the application locally and connect to the MySQL database.
To enable access to the local MySQL instance, Set your local MySQL user ID and password in WebContent/WEB-INF/jetty-env.xml.

Update the User and Password values with your local MySQL instance's user ID and password:

```
<Configure id='wac' class="org.eclipse.jetty.webapp.WebAppContext">
  <New id="itemdb" class="org.eclipse.jetty.plus.jndi.Resource">
     <Arg></Arg>
     <Arg>jdbc/todoItemDb</Arg>
     <Arg>
        <New class="com.mysql.jdbc.jdbc2.optional.MysqlConnectionPoolDataSource">
           <Set name="Url">jdbc:mysql://localhost:3306/itemdb</Set>
           <Set name="User">root</Set>
           <Set name="Password"></Set>
        </New>
     </Arg>
    </New>
</Configure>

```

> [!NOTE]
> For information on how Jetty uses the `jetty-env.xml` file, see the [Jetty XML Reference](http://www.eclipse.org/jetty/documentation/9.4.x/jetty-env-xml.html).

### Run the sample

Use a Maven command to run the sample: 

```bash
mvn package jetty:run
```

Next, navigate to `http://localhost:8080` in a browser. Add a few tasks in the page.

To stop the application at any time, type `Ctrl`+`C` at the command prompt. 

## Create an Azure Database for MySQL
In this step, you create an [Azure Database for MySQL](../mysql/quickstart-create-mysql-server-database-using-azure-cli.md). Later, you will configure your Java application to connect to this database.

### Log in to Azure
Use the Azure CLI 2.0 in a terminal window to create the resources needed to host your Java application in Azure appservice. Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions. 

```azurecli 
az login 
``` 

### Create a resource group
Create a [resource group](../azure-resource-manager/resource-group-overview.md) with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical container into which Azure resources like web apps, databases, and storage accounts are deployed and managed. 

The following example creates a resource group in the North Europe region:

```azurecli
az group create --name myResourceGroup  --location "North Europe"
```

To available value for `--location`, use the [az appservice list-locations](/cli/azure/appservice#list-locations) command.

### Create the server

Create a server in Azure Database for MySQL (Preview) with the [az mysql server create](/cli/azure/mysql/server#create) command.

Substitute your own unique MySQL server name where you see the `<mysql_server_name>` placeholder. This name is part of your MySQL server's hostname, `<mysql_server_name>.mysql.database.azure.com`, so it needs to be globally unique. Also substitute `<admin_user>` and `<admin_password>` with your own values.

```azurecli
az mysql server create --name <mysql_server_name> --resource-group myResourceGroup --location "North Europe" --user <admin_user> --password <admin_password>
```

When the MySQL server is created, the Azure CLI shows information similar to the following example:

```json
{
  "administratorLogin": "admin_user",
  "administratorLoginPassword": null,
  "fullyQualifiedDomainName": "mysql_server_name.mysql.database.azure.com",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.DBforMySQL/servers/mysql_server_name",
  "location": "northeurope",
  "name": "mysql_server_name",
  "resourceGroup": "myResourceGroup",
  ...
}
```

### Configure a server firewall

Create a firewall rule for your MySQL server to allow client connections by using the [az mysql server firewall-rule create](/cli/azure/mysql/server/firewall-rule#create) command. 

```azurecli
az mysql server firewall-rule create --name allIPs --server mysql_server_name --resource-group myResourceGroup --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255
```

> [!NOTE]
> Azure Database for MySQL (Preview) does not presently enable connections from Azure services. As IP addresses in Azure are dynamically assigned, it is better to enable all IP addresses for now. As the service is in preview, better methods for securing your database will be enabled soon.

### Connect to the MySQL server

In the terminal window, connect to the MySQL server in Azure. Use the value you specified previously for `<admin_user>` and `<mysql_server_name>`.

```bash
mysql -u <admin_user>@<mysql_server_name> -h <mysql_server_name>.mysql.database.azure.com -P 3306 -p
```

### Create a database and table in the Azure MySQL Service

In the `mysql` prompt, create a database and a table for the to-do items.

```sql
CREATE DATABASE todoItemDb;
USE todoItemDb;
CREATE TABLE ITEMS ( id varchar(255), name varchar(255), category varchar(255), complete bool);
```

### Create a user with permissions

Create a database user and give it all privileges in the `todoItemDb` database. Replace the placeholders `<Javaapp_user>` and `<Javaapp_password>` with your own unique app name.

```sql
CREATE USER '<Javaapp_user>' IDENTIFIED BY '<Javaapp_password>'; 
GRANT ALL PRIVILEGES ON todoItemDb.* TO '<Javaapp_user>';
```

Exit your server connection by typing `quit`.

```sql
quit
```

### Configure the local MySQL connection with the new Azure Database for MySQL service
In this step, you connect your Java application to the MySQL database you created in Azure Database for MySQL. 

To enable access from the local application to the Azure MySQL service, Set your new MySQL endpoint, user ID, and password in WebContent/WEB-INF/jetty-env.xml:

```
<Configure id='wac' class="org.eclipse.jetty.webapp.WebAppContext">
  <New id="itemdb" class="org.eclipse.jetty.plus.jndi.Resource">
     <Arg></Arg>
     <Arg>jdbc/todoItemDb</Arg>
     <Arg>
        <New class="com.mysql.jdbc.jdbc2.optional.MysqlConnectionPoolDataSource">
           <Set name="Url">jdbc:mysql:<mysql_server_name>.mysql.database.azure.com/itemdb</Set>
           <Set name="User">Javaapp_user@mysql_server_name</Set>
           <Set name="Password">Azure MySQL Password</Set>
        </New>
     </Arg>
    </New>
</Configure>
```

Save your changes.

## Test the application

Use the same maven command as before to run the sample locally again, but this time connecting to the Azure Database for MySQL service: 

```bash
mvn package jetty:run
```

Navigate to `http://localhost:8080` in a browser. If the page loads without errors, then your Java application is connecting to the MySQL database in Azure. 

You should not have Add a few tasks in the page.

To stop the application at any time, type `Ctrl`+`C` in the terminal. 

### Secure sensitive data

Make sure that the sensitive data in `WebContent/WEB-INF/jetty-env.xml` is not committed into Git.

To do this, open `.gitignore` from the repository root and add `WebContent/WEB-INF/jetty-env.xml` in a new line. Save your changes.

Commit your changes to `.gitignore`.

```bash
git add .gitignore
git commit -m "keep sensitive data in WebContent/WEB-INF/jetty-env.xml out of git"
```

## Deploy the Java application to Azure
Next we deploy the Java application to an Azure appservice.

### Create an appservice plan

Create an appservice plan with the [az appservice plan create](/cli/azure/appservice/plan#create) command. 

> [!NOTE] 
> An appservice plan represents the collection of physical resources used to host your apps. All applications assigned to an appservice plan share the resources defined by it allowing you to save cost when hosting multiple apps. 
> 
> appservice plans define: 
>
> * Region (North Europe, East US, Southeast Asia) 
> * Instance Size (Small, Medium, Large) 
> * Scale Count (one, two, or three instances, etc.) 
> * SKU (Free, Shared, Basic, Standard, Premium) 


The following example creates an appservice plan named `myAppServicePlan` using the **FREE** pricing tier:

```azurecli
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
```

When the appservice plan is created, the Azure CLI shows information similar to the following example:

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
  <JSON data removed for brevity.>
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
} 
``` 

### Create an Azure Web app
Now that an appservice plan has been created, create an Azure Web app within the `myAppServicePlan` appservice plan. The web app gives you a hosting space to deploy your code and provides a URL for you to view the deployed application. Use the [az appservice web create](/cli/azure/appservice/web#create) command to create the web app. 

In the following command, substitute the `<app_name>` placeholder with your own unique app name. This unique name will be used as the part of the default domain name for the web app, so the name needs to be unique across all apps in Azure. You can later map any custom DNS entry to the web app before you expose it to your users. 

```azurecli
az appservice web create --name <app_name> --resource-group myResourceGroup --plan myAppServicePlan
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
  "enabledHostNames": [
    "<app_name>.azurewebsites.net",
    "<app_name>.scm.azurewebsites.net"
  ],
  "gatewaySiteName": null,
  "hostNameSslStates": [
    {
      "hostType": "Standard",
      "name": "<app_name>.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "virtualIp": null
    }
    <JSON data removed for brevity.>
}
```

### Set the Java version, the Java Application Server type, and the Application Server version
Set the Java version, Java App Server (container), and container version by using the [az appservice web config update](/cli/azure/appservice/web/config#update) command.

The following command sets the Java version to 8, the Java App Server to Jetty, and the Jetty version to Newest Jetty 9.3.

```azurecli
az appservice web config update --name <app_name> --resource-group myResourceGroup --java-version 1.8 --java-container Jetty --java-container-version 9.3
```


### Get credentials for deployment to the Web App using FTP 
You can deploy your application to Azure appservice in various ways including FTP, local Git, GitHub, Visual Studio Team Services, and BitBucket. 
For this example, we use Maven to compile a .WAR file and FTP to deploy the .WAR file to the Web App

To determine what credentials to pass along in an ftp command to the Web App, Use [az appservice web deployment list-publishing-profiles](https://docs.microsoft.com/cli/azure/appservice/web/deployment#list-publishing-profiles) command: 

```azurecli

az appservice web deployment list-publishing-profiles --name <app_name> --resource-group myResourceGroup --query "[?publishMethod=='FTP'].{URL:publishUrl, Username:userName,Password:userPWD}" --o table

```
### Compile the local application to deply to the Web App 

To prepare the local Java application to run on the Azure Web App, recompile all the resources in the Java application into a single .WAR file ready for deployment. Navigate to the directory where the applications pom.xml is located, and type:

```bash 
mvn clean package
``` 
Toward the end of the Maven package process, notice the location of the .WAR file.  The output should look like this:

```bash

[INFO] Processing war project
[INFO] Copying webapp resources [local-location\GitHub\mysql-java-todo-app\WebContent]
[INFO] Webapp assembled in [1519 msecs]
[INFO] Building war: C:\Users\your\localGitHub\mysql-java-todo-app\target\azure-appservice-mysql-java-sample-0.0.1-SNAPSHOT.war
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------

```

Note the location of the .War file, and use your favorite FTP method to deploy the .WAR file to the Jetty WebApps folder.  In this example, the Jetty WebApps folder is located at /site/wwwroot/webapps in an Azure Web App. 

### Browse to the Azure web app

Browse to `http://<app_name>.azurewebsites.net/<app_name>` and add a few tasks to the list. 

![Java app running in Azure appservice](./media/app-service-web-tutorial-java-mysql/appservice-web-app.png)

**Congratulations!** You're running a data-driven Java app in Azure appservice.
To update the app, repeat the maven clean package command and redeploy the app via FTP.

## Manage your Azure web app
Go to the Azure portal to see the web app you created by signing in to [https://portal.azure.com](https://portal.azure.com).

From the left menu, click **appservice**, then click the name of your Azure web app.

You should now be in your web app's _blade_ (a portal page that opens horizontally).

By default, your web app's blade shows the **Overview** page. This page gives you a view of how your app is doing. Here, you can also perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the blade show the different configuration pages you can open.

In the **Application Settings** page, 

![Azure appservice Web App Application Settings](./media/app-service-web-tutorial-java-mysql/appservice-web-app-application-settings.png)

These tabs in the blade show the many great features you can add to your web app. The following list gives you just a few of the possibilities:
* Map a custom DNS name
* Bind a custom SSL certificate
* Configure continuous deployment
* Scale up and out
* Add user authentication

## More resources
- [Map an existing custom DNS name to Azure Web Apps](app-service-web-tutorial-custom-domain.md)
- [Bind an existing custom SSL certificate to Azure Web Apps](app-service-web-tutorial-custom-ssl.md)
- [Web apps CLI scripts](app-service-cli-samples.md)
