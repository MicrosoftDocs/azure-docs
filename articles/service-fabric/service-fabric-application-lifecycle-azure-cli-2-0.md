---
title: Manage Azure Service Fabric applications using Azure CLI 2.0
description: Learn how to deploy and remove applications from an Azure Service Fabric cluster by using Azure CLI 2.0.
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: article
ms.date: 06/21/2017
ms.author: edwardsa
---
# Manage an Azure Service Fabric application by using Azure CLI 2.0

Learn how to create and delete applications that are running in an Azure Service Fabric cluster.

## Prerequisites

* Install Azure CLI 2.0. Then, select your Service Fabric cluster. For more information, see 
[Get started with Azure CLI 2.0](service-fabric-azure-cli-2-0.md).

* Have a Service Fabric application package ready to be deployed. For more information about how to author and package an application, read about the [Service Fabric application model](service-fabric-application-model.md).

## Overview

To deploy a new application, complete these steps:

1. Upload an application package to the Service Fabric image store.
2. Provision an application type.
3. Specify and create an application.
4. Specify and create services.

To remove an existing application, complete these steps:

1. Delete the application.
2. Unprovision the associated application type.
3. Delete the image store content.

## Deploy a new application

To deploy a new application, complete the following tasks.

### Upload a new application package to the image store

Before you create an application, upload the application package to the Service Fabric image store. 

For example, if your application package is in the `app_package_dir` directory, use the following commands to upload the directory:

```azurecli
az sf application upload --path ~/app_package_dir
```

For large application packages, you can specify the `--show-progress` option to display the progress of the upload.

### Provision the application type

When the upload is finished, provision the application. To provision the application, use the following command:

```azurecli
az sf application provision --application-type-build-path app_package_dir
```

The value for `application-type-build-path` is the name of the directory where you uploaded your application package.

### Create an application from an application type

After you provision the application, use the following command to name and create your application:

```azurecli
az sf application create --app-name fabric:/TestApp --app-type TestAppType --app-version 1.0
```

`app-name` is the name that you want to use for the application instance. You can get additional parameters from the previously provisioned application manifest.

The application name must start with the prefix `fabric:/`.

### Create services for the new application

After you have created an application, create services from the application. In the following example, we create a new stateless service from our application. The services that you can create from an application are defined in a service manifest in the previously provisioned application package.

```azurecli
az sf service create --app-id TestApp --name fabric:/TestApp/TestSvc --service-type TestServiceType \
--stateless --instance-count 1 --singleton-scheme
```

## Verify application deployment and health

To verify that an application and service were successfully deployed, check that the application and service are listed:

```azurecli
az sf application list
az sf service list --application-list TestApp
```

To verify that the service is healthy, use similar commands to retrieve the health of both the service and the application:

```azurecli
az sf application health --application-id TestApp
az sf service health --service-id TestApp/TestSvc
```

Healthy services and applications have a `HealthState` value of `Ok`.

## Remove an existing application

To remove an application, complete the following tasks.

### Delete the application

To delete the application, use the following command:

```azurecli
az sf application delete --application-id TestEdApp
```

### Unprovision the application type

After you delete the application, you can unprovision the application type if you no longer need it. To unprovision the application type, use the following command:

```azurecli
az sf application unprovision --application-type-name TestAppTye --application-type-version 1.0
```

The type name and type version must match the name and version in the previously provisioned application manifest.

### Delete the application package

After you have unprovisioned the application type, you can delete the application package from the image store if you no longer need it. Deleting application packages helps reclaim disk space. 

To delete the application package from the image store, use the following command:

```azurecli
az sf application package-delete --content-path app_package_dir
```

`content-path` must be the name of the directory that you uploaded when you created the application.

## Related articles

* [Get started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md)
* [Get started with Service Fabric XPlat CLI](service-fabric-azure-cli.md)
