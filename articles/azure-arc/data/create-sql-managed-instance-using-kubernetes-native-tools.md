---
title: Create a SQL Managed Instance using Kubernetes tools
description: Deploy Azure Arc-enabled SQL Managed Instance using Kubernetes tools.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 02/28/2022
ms.topic: how-to
---

# Create Azure Arc-enabled SQL Managed Instance using Kubernetes tools 

This article demonstrates how to deploy Azure SQL Managed Instance for Azure Arc with Kubernetes tools.

## Prerequisites

You should have already created a [data controller](plan-azure-arc-data-services.md).

To create a SQL managed instance using Kubernetes tools, you will need to have the Kubernetes tools installed. The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Overview

To create a SQL Managed Instance, you need to:
1. Create a Kubernetes secret to store your system administrator login and password securely
1. Create a SQL Managed Instance custom resource based on the `SqlManagedInstance` custom resource definition

Define both of these items in a yaml file.

## Create a yaml file

Use the [template yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/sqlmi.yaml) file as a starting point to create your own custom SQL managed instance yaml file. Download this file to your local computer and open it in a text editor. Use a text editor such as [VS Code](https://code.visualstudio.com/download) that support syntax highlighting and linting for yaml files.

> [!NOTE]
> Beginning with the February, 2022 release, `ReadWriteMany` (RWX) capable storage class needs to be specified for backups. Learn more about [access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes).
> If no storage class is specified for backups, the default storage class in Kubernetes is used. If the default is not RWX capable, the SQL Managed Instance installation may not succeed. 

### Example yaml file

See the following example of a yaml file:

:::code language="yaml" source="~/azure_arc_sample/arc_data_services/deploy/yaml/sqlmi.yaml":::

### Customizing the login and password

A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password. You will need to base64 encode a system administrator login and password and place them in the placeholder location at `data.password` and `data.username`. Do not include the `<` and `>` symbols provided in the template.

> [!NOTE]
> For optimum security, using the value `sa` is not allowed for the login .
> Follow the [password complexity policy](/sql/relational-databases/security/password-policy#password-complexity).

You can use an online tool to base64 encode your desired username and password or you can use built in CLI tools depending on your platform.

PowerShell

```console
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('<your string to encode here>'))

#Example
#[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('example'))
```

Linux/macOS

```console
echo -n '<your string to encode here>' | base64

#Example
# echo -n 'example' | base64
```

### Customizing the name

The template has a value of `sql1` for the name attribute. You can change this value, but it must include characters that follow the DNS naming standards. You must also change the name of the secret to match. For example, if you change the name of the SQL managed instance to `sql2`, you must change the name of the secret from `sql1-login-secret` to `sql2-login-secret`

### Customizing the resource requirements

You can change the resource requirements - the RAM and core limits and requests - as needed. 

> [!NOTE]
> You can learn more about [Kubernetes resource governance](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-units-in-kubernetes).

Requirements for resource limits and requests:
- The cores limit value is **required** for billing purposes.
- The rest of the resource requests and limits are optional.
- The cores limit and request must be a positive integer value, if specified.
- The minimum of 1 core is required for the cores request, if specified.
- The memory value format follows the Kubernetes notation. 
- A minimum of 2 Gi is required for memory request, if specified.
- As a general guideline, you should have 4 GB of RAM for each 1 core for production use cases.

### Customizing service type

The service type can be changed to NodePort if desired. A random port number will be assigned.

### Customizing storage

You can customize the storage classes for storage to match your environment. If you are not sure which storage classes are available, run the command `kubectl get storageclass` to view them. 

The template has a default value of `default`. 

For example

```yml
storage:
    data:
      volumes:
      - className: default 
```

This example means that there is a storage class named `default` - not that there is a storage class that is the default. You can also optionally change the size of your storage. For more information, see [storage configuration](./storage-configuration.md).

## Creating the SQL managed instance

Now that you have customized the SQL managed instance yaml file, you can create the SQL managed instance by running the following command:

```console
kubectl create -n <your target namespace> -f <path to your yaml file>

#Example
#kubectl create -n arc -f C:\arc-data-services\sqlmi.yaml
```

## Monitoring the creation status

Creating the SQL managed instance will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a SQL managed instance named `sql1` and Kubernetes namespace with the name `arc`. If you used a different namespace/SQL managed instance name, you can replace `arc` and `sqlmi` with your names.

```console
kubectl get sqlmi/sql1 --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod. Run `kubectl describe pod ...`. Use this command to troubleshoot any issues. For example:

```console
kubectl describe pod/<pod name> --namespace arc

#Example:
#kubectl describe pod/sql1-0 --namespace arc
```

## Troubleshoot deployment problems

If you encounter any troubles with the deployment, please see the [troubleshooting guide](troubleshoot-guide.md).

## Related content

[Connect to Azure Arc-enabled SQL Managed Instance](connect-managed-instance.md)
