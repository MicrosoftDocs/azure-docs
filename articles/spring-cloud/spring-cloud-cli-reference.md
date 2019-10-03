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
| [az spring-cloud app create](#az-spring-cloud-app-create) | Create a new app with a default deployment in the Azure Spring Cloud. |
| [az spring-cloud app delete](#az-spring-cloud-app-delete) | Deleate an app in the Azure Spring Cloud. | 
| [az spring-cloud app deploy](#az-spring-cloud-app-deploy) | Deploy from source code or a pre-built binary to an app and update related configurations. |
| [az spring-cloud app list](#az-spring-cloud-app-list) | List all apps in the Azure Spring Cloud. |
| [az spring-cloud app restart](#az-spring-cloud-app-restart) | Restart instances of the app using production deployment defaults. | 
| [az spring-cloud app scale](#az-spring-cloud-app-scale) | Manually scale an app or its deployments. | 
| [az spring-cloud app set-deployment](#az-spring-cloud-app-set-deployment) | Set production deployment of an app. |
| [az spring-cloud app show](#az-spring-cloud-app-show) | Show the details of an app in the Azure Spring Cloud. |
| [az spring-cloud app show-deploy-log](#az-spring-cloud-app-deploy-log) | Show build logs for the latest deployment from source using production deployment defaults. |
| [az spring-cloud app start](#az-spring-cloud-app-start) | Start instances of the app using production deployment defaults. |
| [az spring-cloud app stop](#az-spring-cloud-app-stop) | Stop instances of the app using production deployment defaults. |
| [az spring-cloud app update](#az-spring-cloud-app-update) | Update the specified app's configuration. |

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

## az spring-cloud create

Create a new app with a default deployment in the Azure Spring Cloud.

```cli
az spring-cloud create  --name -n
                        --resource-group -g
                        --location -l
                        --no-wait
                        
```

| Required Parameters | |
| --- | ---: |
| `--name -n` | Name for this Azure Spring Cloud instance. |
| `--resource-group -g` | Specifies the resource group for this app.  Configure the default group using `az configure --defaults group=<name>` |

| Optional Parameters | |
| --- | ---: |
| `--location -l` | Specifies server location for this app.  Find valid locations using `az account list-locations` |
| `--no-wait` | Do not for long running operations to complete.

### Examples

Create a new Azure Spring Cloud in WestUS
```cli
az spring-cloud create -n MyService -g MyResourceGroup -l westus
```

## az spring-cloud delete

Delete an Azure Spring Cloud instance.

```cli
az spring cloud --name -n
                --resource-group -g
                --no-wait
```

| Required Parameters | | 
| --- | ---: |
| `--name -n` | Name of the Azure Spring Cloud instance to be deleted. |
| `--resource-group -g` | Name of the resource group to which the Azure Spring Cloud belongs. |

| Optional Parameters | | 
| --- | ---: |
| `-no-wait` | Do not wait for long running operations to finish. |

### Example

Delete an Azure Spring Cloud instance called 'MyService' from 'MyResourceGroup'.

```cli
az spring-cloud delete -n MyService -g MyResourceGroup
```

## az spring-cloud list

List all Azure Spring Cloud instances associated with the given resource group. If no resource group is specified, list the subscription IDs.

```cli
az spring-cloud list --resource-group -g
```

| Required Parameters | |
| --- | ---: |
| --resource-group -g | Name of the resource group. |

## az spring-cloud show

Show the details for the specified Azure Spring Cloud instance.

```cli
az spring-cloud show --name -n
                     -- resource-group -g
```

| Required Parameters | |
| --- | ---: |
| --name -n | Name of the Azure Spring Cloud instance. |
| --resource-group -g | Name of the Resource Group to which the Azure Spring Cloud instance belongs.

## az spring-cloud show app create

Create a new app in an Azure Spring Cloud.

```cli
az spring-cloud appp create --name -n
                            --resource-group -g
                            --service -s
                            --cpu
                            --enable-persistent-storage
                            --instance-count
                            --is-public
                            --memory
```

| Required Parameters | |
| --- | ---: |
| --name -n | Name of the app. |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

| Optional Parameters | |
| --- | ---: |
| --cpu | Number of virtual cores per instance.  Default: 1. |
| --enable-persistent-storage | Boolean value.  If true, mounts a 50GB disk with default path. |
| --instance-count | Number of instance.  Default: 1. |
| --is-public | Boolean value.  If true, assigns a public domain. |
| --memory | Number of GB of memory per instance.  Default: 1. |

### Examples

Create an app with the default configuration.

```cli
az spring-cloud app create -n MyApp -s MyService
```

Create a publicly accessible app with 3 instances.  Each instance has 3 GB of memory and 2 CPU cores.

```cli
az spring-cloud app create -n MyApp -s MyService --is-public true --cpu 2 --memory 3
```

## az spring-cloud app delete

Deletes an app in the Azure Spring Cloud.

```cli
az spring cloud app delete  --name -n
                            --resource-group -g
                            --service -s
```

| Required Parameters | |
| --- | ---: |
| --name -n | Name of the app. |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

## az spring-cloud app deploy

Deploy an app to the Azure Spring Cloud from source code or a pre-built binary, and update related configurations.

```cli
az spring cloud app deploy  --name -n
                            --resource-group -g
                            --service -s
                            --cpu
                            --deployment -d
                            --env
                            --instance-count
                            --jar-path
                            --jvm-options
                            --memory
                            --no-wait
                            --runtime-version
                            --target-module
                            --version
```

| Required Parameters | |
| --- | ---: |
| --name -n | Name of the app. |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

| Optional Parameters | |
| --- | ---: |
| --cpu | Number of virtual CPI cores per instance. |
| --deployment -d | Name of an existing app deployment.  Defaults to the production deployment if not specified. |
| --env | Space-separated environment variables in 'key[=value]' format. |
| --instance-count | Number of instances. |
| --jar-path | If provided, deploy jar from given path. Otherwise, deploy current folder as a tar. |
| --jvm-options | A string containing JVM options.  Use '=' instead of ' ' to avoid shell parsing errors. E.g.,  `--jvm-options='-Xms1024m -Xmx2048m`. |
| --memory | Number of GB of memory per instance. |
| --no-wait | Do not wait for long running operations to finish. |
| --runtime-version | Runtime version of the language used in the app.  Allowed values: `Java_11`, `Java_8`. |
| --target-module | Child module to be deployed.  Required when multiple jar packages are built from the source code. |
| --version | Deployment version.  Unchanged if not set. |

### Examples

Deploy source code to an app. This will pack the current directory, build a binary using the Pivotal Build Service, and then deploy to the app.

```cli
az spring-cloud app deploy -n MyApp -s MyService
```

Deploy a pre-built jar to an app using JVM options and environment variables.

```cli
az spring-cloud app deploy -n MyApp -s MyService --jar-path app.jar --jvm-options="-XX:+UseG1GC -XX:+UseStringDeduplication" --env foo=bar
```

Deploy source code to a specific deployment of an app.
```cli
az spring-cloud app deploy -n MyApp -s Myspring-cloud -d green-deployment
```

## az spring-cloud app list

List all apps in the Azure Spring Cloud instance.

```cli
az spring-cloud app list --resource-group -g
                         --service -s
```

|Required Parameters | |
| --- | ---: |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

## az spring-cloud app restart

Restart instances of the app.  Defaults to the production deployment.

```cli
az spring-cloud app restart --name -n
                            --resource-group -g
                            --service -s
                            --deployment -d
                            --no-wait
```

| Required Parameters | |
| --- | ---: |
| --name -n | Name of the app. |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

| Optional Parameters | |
| --- | ---: |
| --deployment -d | Name of the existing deployment of the app.  Defaults to the production deployment if not specified. |
| --no-wait | Do not wait for long running operations to finish. |

## az spring-cloud app scale 

Manually scale an app or its deployments.

```cli
az spring-cloud app scale --name -n
                          --resource-group -g
                          --service -s
                          --cpu
                          --deployment -d
                          --instance-count
                          --memory
                          --no-wait
```


| Required Parameters | |
| --- | ---: |
| --name -n | Name of the app. |
| --resource-group -g | Name of the resource group.  You can configure the default group using `az configure --defaults group=<name>`. |
| --service -s | Name of the Azure Spring Cloud.  You can configure the default service using `az configure --defaults spring-cloud=<name>`. |

| Optional Parameters | |
| --- | ---: |
| --cpu | Number of virtual CPU cores per app instance. |
| --deployment -d | Name of the existing deployment of the app.  Defaults to the production deployment if not specified. |
| --instance-count | Number of instances of this app. |
| --memory | Number of GB of memory per app instance. |
| --no-wait | Do not wait for long-running operations to finish. |

### Examples

Scale up an app to 4 CPU cores and 8 GB of memory per instance. 

```cli
az spring-cloud app scale -n MyApp -s MyService --cpu 3 --memory 8
```

Scale out a deployment of the app to 5 instances.

```cli
az spring-cloud app scale -n MyApp -s MyService -d green-deployment --instance-count 5
```