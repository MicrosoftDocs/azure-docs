---
title:  az spring cloud
description: Manage Azure Spring Cloud using the Azure CLI
author:  jpconnock

ms.service: spring-cloud
ms.topic: reference
ms.date: 10/03/2019
ms.author: jeconnoc
---

# az spring-cloud

## Manage Azure Spring Cloud using the Azure CLI

>[!Note]
> Azure Spring Cloud is currently in preview.  These commands may be changed or removed in a future release.

| az spring-cloud |  |
|------|------:|
| [az spring-cloud create](#az-spring-cloud-create) | Create an Azure Spring Cloud instance. |
| [az spring-cloud delete](#az-spring-cloud-delete) | Delete an Azure Spring Cloud instance. |
| [az spring-cloud list](#az-spring-cloud-list) | List all Azure Spring Cloud instances in the given resource group, otherwise list the subscription IDs. |
| [az spring-cloud show](#az-spring-cloud-show) | Show the details for an Azure Spring Cloud. |


| az spring-cloud app | Commands to manage apps in the Azure Spring Cloud.  |
| ---- | ----: |
| az spring-cloud app create | Create a new app with a default deployment in the Azure Spring Cloud. |
| az spring-cloud app delete | Deleate an app in the Azure Spring Cloud. | 
| az spring-cloud app deploy | Deploy from source code or a pre-built binary to an app and update related configurations. |
| az spring-cloud app list | List all apps in the Azure Spring Cloud. |
| az spring-cloud app restart | Restart instances of the app using production deployment defaults. | 
| az spring-cloud app scale | Manually scale an app or its deployments. | 
| az spring-cloud app set-deployment | Set production deployment of an app. |
| az spring-cloud app show | Show the details of an app in the Azure Spring Cloud. |
| az spring-cloud app show-deploy-log | Show build logs for the latest deployment from source using production deployment defaults. |
| az spring-cloud app start | Start instances of the app using production deployment defaults. |
| az spring-cloud app stop | Stop instances of the app using production deployment defaults. |
| az spring-cloud app update | Update the specified app's configuration. |

| az spring-cloud app binding | Commands to manage bindings with Azure Data Services.  The app must be restarted before these settings take effect. |
| --- | ---: |
| az spring-cloud app binding list | List all service bindings in an app. | 
| az spring-cloud app binding remove | Remove a service binding from the app. |
| az spring-cloud app binding show | Show the details of a service binding. |
| az spring-cloud app binding cosmos add | Bind an Azure CosmosDB with the app. |
| az spring-cloud app binding cosmos update | Update an Azure CosmosDB service binding. |
| az spring-cloud app binding mysql add | Bind an Azure Database for MySQL with the app. |
| az spring-cloud app binding mysql update | Update an Azure Database for MySQL service binding. |
| az spring-cloud app binding redis add | Bind an Azure Cache for Redis  with the app. |
| az spring-cloud app binding redis update | Update an Azure Cache for Redis service binding. |

| az spring-cloud app deployment | Commands to manage the deployment life cycle of an app in Azure Spring Cloud. |
| --- | ---: |
| az spring-cloud app deployment create | Create a staging deployment for the app. |
| az spring-cloud app deployment delete | Delete a deployment of the app. |
| az spring-cloud app deployment list | List all deployments in an app. |
| az spring-cloud app deployment show | Show details of the deployment. |

| az spring-cloud config-server | Commands to manage the Azure Spring Cloud Config Server. |
| --- | ---: |
| az spring-cloud config-server clear | Erase all settings in the Config Server. |
| az spring-cloud config-server set | Define Config Server from a YAML file. |
| az spring-cloud config-server show | Show Config Server configuration. |
| az spring-cloud config server git set | Define git properties for the Config Server.  Previous values will be overwritten. |
| az spring-cloud config server git repo add | Add a new git repository config to the Config Server. |
| az spring-cloud config server git repo list | List all git repository configs for the Config Server. |
| az spring-cloud config server git repo remove | Remove the specified git repository from the Config Server. |
| az spring-cloud config server git repo update | Update the specified git repository. |

| az spring-cloud test-endpoint | Commands to manage endpoint testing in Azure Spring Cloud |
| --- | ---: |
| az spring-cloud test-endpoint disable | Disable test endpoint. |
| az spring-cloud test-endpoint enable | Enable test endpoint. |
| az spring-cloud test-endpoint list | List test endpoint keys. |
| az spring-cloud test-endpoint renew-key | Regenerate a test-endpoint key. |

## Command Details

### az spring-cloud create

Create a new app with a default deployment in the Azure Spring Cloud.

```cli
az spring-cloud create  --name -n
                        --resource-group -g
                        --location -l
                        --no-wait
                        
```

#### Examples

Create a new Azure Spring Cloud in WestUS
```cli
az spring-cloud create -n MyService -g MyResourceGroup -l westus
```

| Required Parameters | |
| --- | --- |
| `name -n` | Name for this Azure Spring Cloud instance. |
| `resource-group -g` | Specifies the resource group for this app.  Configure the default group using `az configure --defaults group=<name>` |

| Optional Parameters | |
| --- | --- |
| `location -l` | Specifies server location for this app.  Find valid locations using `az account list-locations` |
| `no-wait` | Do not wait for long running operations to complete. |

### az spring-cloud delete

### az spring-cloud list

### az spring-cloud show
