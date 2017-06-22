---
title: Manage Service Fabric applications using Azure CLI 2.0
description: Describes the process of deploying and removing applications from a Service Fabric cluster using
Azure CLI 2.0
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: article
ms.date: 06/21/2017
ms.author: edwardsa
---
# Prerequisites

Be sure to install the Azure CLI 2.0 and select your Service Fabric cluster. More information can be found in the
[getting started with Azure CLI 2.0 documentation](service-fabric-azure-cli-2.0).

You should also have a Service Fabric application package ready to be deployed. More information about how to author
and package an application can be found in the [application model documentation](service-fabric-application-model).

# Overview

Deploying a new application consists of four steps:

1. Upload an application package to the Service Fabric image store
1. Provision an application type
1. Specify and create an application
1. Specify and create services

Removing an existing application requires three steps:

1. Delete application
1. Unprovision associated application type
1. Delete image store content

# Deploy a new application

To deploy a new application, follow these steps

## Upload a new application package to the image store

Before creating an application, the application package needs to be uploaded to the Service Fabric image store.
Suppose then your application package exists in the `app_package_dir` directory. Use the following commands to upload
the directory:

```azurecli
az sf application upload --path ~/app_package_dir
```

For large application packages, you can specify the `--show-progress` option to display the progress of the upload.

## Provision application type

Once the upload completes, the application needs to be provisioned. To provision the application, use the following command

```azurecli
az sf application provision --application-type-build-path app_package_dir
```

The `application-type-build-path` is the same as the name of the directory containing your application package
that was previously uploaded

## Create application from application type

After the application has been provisioned, you can name and create your application using the following command:

```azurecli
az sf application create --app-name fabric:/TestApp --app-type TestAppType --app-version 1.0
```

Here `app-name` is the name you would like to give to the instance of the application. The other parameters can be found
from the application manifest that was previously provisioned.

The application name should start with the `fabric:/` prefix.

## Create services for the new application

After an application has been created, you can create services from the application. For this example, we create a
new stateless service from our application. The services you can create from an application is defined in a service
manifest inside the previously provisioned application package.

```azurecli
az sf service create --app-id TestApp --name fabric:/TestApp/TestSvc --service-type TestServiceType \
--stateless --instance-count 1 --singleton-scheme
```

# Verify application creation and health

To verify an application and service were successfully deployed, you can check that the application and service are
listed using the following commands:

```azurecli
az sf application list
az sf service list --application-list TestApp
```

To verify the service is healthy, use similar commands to retrieve the health of both the service and application

```azurecli
az sf application health --application-id TestApp
az sf service health --service-id TestApp/TestSvc
```

Healthy services and applications should have a `HealthState` value of `Ok`.

# Remove an existing application

To remove an application, follow these steps

## Delete the application

Delete the application by running the following command

```azurecli
az sf application delete --application-id TestEdApp
```

## Unprovision the application type

Once the application is deleted, the application type can be unprovisioned if no longer needed. Use the following
command to unprovision the application type

```azurecli
az sf application unprovision --application-type-name TestAppTye --application-type-version 1.0
```

Here, the type name and type version should match the name and version in the application manifest previously
provisioned

## Delete application package

After the application type has been unprovisioned, the application package can be deleted from the image store if no
longer needed. Deleting application packages helps reclaim disk space. Use the following command to delete the
application package from the image store:

```azurecli
az sf application package-delete --content-path app_package_dir
```

Here, the `content-path` should be the same name as the directory that initially was uploaded when creating the
application