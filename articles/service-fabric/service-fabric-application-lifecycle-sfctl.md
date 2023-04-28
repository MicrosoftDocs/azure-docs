---
title: Manage Azure Service Fabric applications using sfctl
description: Learn how to deploy and remove applications from an Azure Service Fabric cluster by using Azure Service Fabric CLI
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Manage an Azure Service Fabric application by using Azure Service Fabric CLI (sfctl)

Learn how to create and delete applications that are running in an Azure Service Fabric cluster.

## Prerequisites

* Install Service Fabric CLI. Then, select your Service Fabric cluster. For more information, see [Get started with Service Fabric CLI](service-fabric-cli.md).

* Have a Service Fabric application package ready to be deployed. For more information about how to author and package an application, read about the [Service Fabric application model](service-fabric-application-model.md).

## Overview

To deploy a new application, complete these steps:

1. Upload an application package to the Service Fabric image store.
2. Provision an application type.
3. Delete the image store content.
4. Specify and create an application.
5. Specify and create services.

To remove an existing application, complete these steps:

1. Delete the application.
2. Unprovision the associated application type.

## Deploy a new application

To deploy a new application, complete the following tasks:

### Upload a new application package to the image store

Before you create an application, upload the application package to the Service Fabric image store.

For example, if your application package is in the `app_package_dir` directory, use the following commands to upload
the directory:

```shell
sfctl application upload --path ~/app_package_dir
```

For large application packages, you can specify the `--show-progress` option to display the progress of the upload.

### Provision the application type

When the upload is finished, provision the application. To provision the application, use the following command:

```shell
sfctl application provision --application-type-build-path app_package_dir
```

The value for `application-type-build-path` is the name of the directory where you uploaded your application package.

### Delete the application package

It's recommended that you remove the application package after the application is successfully registered.  Deleting application packages from the image store frees up system resources.  Keeping unused application packages consumes disk storage and leads to application performance issues. 

To delete the application package from the image store, use the following command:

```shell
sfctl store delete --content-path app_package_dir
```

`content-path` must be the name of the directory that you uploaded when you created the application.

### Create an application from an application type

After you provision the application, use the following command to name and create your application:

```shell
sfctl application create --app-name fabric:/TestApp --app-type TestAppType --app-version 1.0
```

`app-name` is the name that you want to use for the application instance. You can get additional parameters from the
previously provisioned application manifest.

The application name must start with the prefix `fabric:/`.

### Create services for the new application

After you have created an application, create services from the application. In the following example, we create a new
stateless service from our application. The services that you can create from an application are defined in a service
manifest in the previously provisioned application package.

```shell
sfctl service create --app-id TestApp --name fabric:/TestApp/TestSvc --service-type TestServiceType \
--stateless --instance-count 1 --singleton-scheme
```

## Verify application deployment and health

To verify everything is healthy, use the following health commands:

```shell
sfctl application list
sfctl service list --application-id TestApp
```

To verify that the service is healthy, use similar commands to retrieve the health of both the service and the
application:

```shell
sfctl application health --application-id TestApp
sfctl service health --service-id TestApp/TestSvc
```

Healthy services and applications have a `HealthState` value of `Ok`.

## Remove an existing application

To remove an application, complete the following tasks:

### Delete the application

To delete the application, use the following command:

```shell
sfctl application delete --application-id TestEdApp
```

### Unprovision the application type

After you delete the application, you can unprovision the application type if you no longer need it. To unprovision
the application type, use the following command:

```shell
sfctl application unprovision --application-type-name TestAppType --application-type-version 1.0
```

The type name and type version must match the name and version in the previously provisioned application manifest.

## Upgrade application

After creating your application, you can repeat the same set of steps to provision a second version of your
application. Then, with a Service Fabric application upgrade you can transition to running the second version
of the application. For more information, see the documentation on
[Service Fabric application upgrades](service-fabric-application-upgrade.md).

To perform an upgrade, first provision the next version of the application using the same commands as before:

```shell
sfctl application upload --path ~/app_package_dir_2
sfctl application provision --application-type-build-path app_package_dir_2
sfctl store delete --content-path app_package_dir_2
```

It is recommended then to perform a monitored automatic upgrade, launch the upgrade by running the following command:

```shell
sfctl application upgrade --app-id TestApp --app-version 2.0.0 --parameters "{\"test\":\"value\"}" --mode Monitored
```

Upgrades override existing parameters with whatever set is specified. Application parameters should be passed as
arguments to the upgrade command, if necessary. Application parameters should be encoded as a JSON object.

To retrieve any parameters previously specified, you can use the `sfctl application info` command.

When an application upgrade is in progress, the status can be retrieved using the
`sfctl application upgrade-status` command.

Finally, if an upgrade is in progress and needs to be canceled, you can use
the `sfctl application upgrade-rollback` to roll back the upgrade.

## Next steps

* [Service Fabric CLI basics](service-fabric-cli.md)
* [Getting started with Service Fabric on Linux](service-fabric-get-started-linux.md)
* [Launching a Service Fabric application upgrade](service-fabric-application-upgrade.md)
