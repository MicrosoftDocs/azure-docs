---
title: Github Actions for Azure Database for MySQL Flexible Server using CLI
description: Github Actions for Azure Database for MySQL Flexible Server using CLI
ms.topic: how-to
ms.service: mysql
ms.custom: seodec18, devx-track-azurecli
ms.author: sumuth
author: mksuni
ms.date: 08/16/2021
---

# Github Actions for Azure Database for MySQL Flexible Server using CLI

**APPLIES TO**: :::image type="icon" source="./media/applies-to/yes.png" border="false":::Azure Database for MySQL - Flexible Server

This guide shows your how to setup and run [GitHub Actions](https://docs.github.com/en/actions). Github action workflows can be used to deploy database updates to [Azure Database for MySQL Flexible Server](https://azure.microsoft.com/services/mysql/).


## Prerequisites

You will need: 
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub repository for this quickstart. If you don't have a GitHub account, [sign up for free](https://github.com/join).  
- Install or upgrade Azure CLI
- An Azure Database for MySQL server 


## Create an MySQL Flexible server 

Run the following command to create a MySQL flexible server and a new database.

```azurecli
az mysql flexible-server create --name demoserver --database-name demodb --public-access all
```

## Create a Sample script 
Create a new file called `data.sql` and copy the schema and script below.  Upload this file to your Github repository. 

```sql
CREATE TABLE `customers` (
  `customerNumber` int(11) NOT NULL,
  `customerName` varchar(50) NOT NULL,
  `contactLastName` varchar(50) NOT NULL,
  `contactFirstName` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) NOT NULL,
  PRIMARY KEY (`customerNumber`),
);

/*Data for the table `customers` */

insert  into `customers`(`customerNumber`,`customerName`,`contactLastName`,`contactFirstName`,`city`,`state`,`postalCode`,`country`) values 

(103,'John Smith','Smith','John ','Paris',NULL,'44000','France'),

(112,'Jane Smith','Smith','Jane','Redmond','WA','98052'USA'),
```

## Generate deployment credentials

You can create a [service principal](../active-directory/develop/app-objects-and-service-principals.md) with the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac&preserve-view=true) command in the [Azure CLI](/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal or by selecting the **Try it** button.

Replace the placeholders `server-name` with the name of your MySQL server hosted on Azure. Replace the `subscription-id` and `resource-group` with the subscription ID and resource group connected to your MySQL server.  

```azurecli-interactive
   az ad sp create-for-rbac --name {server-name} --role contributor \
                            --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                            --sdk-auth
```

The output is a JSON object with the role assignment credentials that provide access to your database similar to below. Copy this output JSON object for later.

```output 
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

## Configure the GitHub secret

1. In [GitHub](https://github.com/), browse your repository.

2. Select **Settings > Secrets > New secret**.

3. Paste the entire JSON output from the Azure CLI command ``` az ad sp create``` into the secret's value field. Give the secret the name `AZURE_CREDENTIALS`. 

The workflow generated with CLI commands or if using custom workflows you need to use to provide this secret for Azure Login action to successfully login on your behalf.


## Run your workflow

Go to your local clone of the github repository folder. Run the ```deploy setup``` command to which will generate the workflow file for your server . See [reference docs](/cli/azure/mysql/flexible-server/deploy?view=azure-cli-latest#az_mysql_flexible_server_deploy_setup) to learn more about the command.

```azurecli 
c:\mygithubproject>az mysql flexible-server deploy setup --admin-password "<your_password>" --admin-user <your-username> --repo <repo-url> --sql-file data.sql --server-name servername> -- database-name <dbname>
```
Example:

```azurecli
C:\demo-github-action>az mysql flexible-server deploy setup --admin-password "password" --admin-user dbuser --repo https://github.com/user/demo-github-action --sql-file data.sql --server-name demoserver -- database-name demodb
```


## Run custom Github Action workflows 

You may have custom github actions that your database. To run any such workflows you can execute the ```deploy  run``` command against those workflows. See [reference docs](/cli/azure/mysql/flexible-server/deploy?view=azure-cli-latest#az_mysql_flexible_server_deploy_run) to learn more about the command.


```azurecli 
az mysql deploy run
```


## Review your deployment

1. Go to **Actions** for your GitHub repository. 

2. Open the first result to see detailed logs of your workflow's run. 
 
    :::image type="content" source="./media/quickstart-mysql-github-actions/github-actions-run-mysql.png" alt-text="Log of GitHub actions run":::


## Deployment best practices 

In order to consider database updates as part of continuous integration, you must keep the following practices in mind:

- Make a backup of the database before triggering a github action. 
- Avoid triggering the workflow for any change to the repository but limit it to changes in specific file or folder. 
- Add comments to document your database scripts on what changes will they make. 
- Do not include DROP , DELETE statements in your scripts.  All script must be forward-only. 
- Create separate workflows for different databases if using the same repository.
- Use task based approach to database updates which can help better version control to limit scope of the changes. 
- When fixing issues due to daatbase deployments, you can fix forward. This is lower-risk method to get the database back to the old state.  Alternatively, you can roll back changes from a backup of the database or deploy roll back scripts. Note backup and rollback scripts can be time consuming. 
- Define an internal  process to avoid conflicting updates in scripts across different commits to the repository. 

## Clean up resources

When your Azure MySQL database and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps

> [!div class="nextstepaction"]
> [Learn about Azure and GitHub integration](/azure/developer/github/)
  
 




