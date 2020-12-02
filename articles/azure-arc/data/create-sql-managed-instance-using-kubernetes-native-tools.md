---
title: Create a SQL managed instance using Kubernetes tools
description: Create a SQL managed instance using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create Azure SQL managed instance using Kubernetes tools

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

You should have already created an [Azure Arc data controller](./create-data-controller.md).

To create a SQL managed instance using Kubernetes tools, you will need to have the Kubernetes tools installed.  The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Overview

To create a SQL managed instance, you need to create a Kubernetes secret to store your system administrator login and password securely and a SQL managed instance custom resource based on the sqlmanagedinstance custom resource definition.

## Create a yaml file

You can use the [template yaml](https://raw.githubusercontent.com/microsoft/azure_arc/master/arc_data_services/deploy/yaml/sqlmi.yaml) file as a starting point to create your own custom SQL managed instance yaml file.  Download this file to your local computer and open it in a text editor.  It is useful to use a text editor such as [VS Code](https://code.visualstudio.com/download) that support syntax highlighting and linting for yaml files.

This is an example yaml file:

```yaml
apiVersion: v1
data:
  password: <your base64 encoded password>
  username: <your base64 encoded user name. 'sa' is not allowed>
kind: Secret
metadata:
  name: example-login-secret
type: Opaque
---
apiVersion: sql.arcdata.microsoft.com/v1alpha1
kind: sqlmanagedinstance
metadata:
  name: example
spec:
  limits:
    memory: 4Gi
    vcores: "4"
  requests:
    memory: 2Gi
    vcores: "1"
  service:
    type: LoadBalancer
  storage:
    backups:
      className: default
      size: 5Gi
    data:
      className: default
      size: 5Gi
    datalogs:
      className: default
      size: 5Gi
    logs:
      className: default
      size: 1Gi
```

### Customizing the login and password

A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password.  You will need to base64 encode a system administrator login and password and place them in the placeholder location at `data.password` and `data.username`.  Do not include the `<` and `>` symbols provided in the template.

> [!NOTE]
> For optimum security, using the value 'sa' is not allowed for the login .
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
echo '<your string to encode here>' | base64

#Example
# echo 'example' | base64
```

### Customizing the name

The template has a value of 'example' for the name attribute.  You can change this but it must be characters that follow the DNS naming standards.  You must also change the name of the secret to match.  For example, if you change the name of the SQL managed instance to 'sql1', you must change the name of the secret from 'example-login-secret' to 'sql1-login-secret'

### Customizing the resource requirements

You can change the resource requirements - the RAM and core limits and requests - as needed.  

> [!NOTE]
> You can learn more about [Kubernetes resource governance](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-units-in-kubernetes).

Requirements for resource limits and requests:
- The cores limit value is **required** for billing purposes.
- The rest of the resource requests and limits are optional.
- The cores limit and request must be a positive integer value, if specified.
- The minimum of 2 cores is required for the cores request, if specified.
- The memory value format follows the Kubernetes notation.  
- A minimum of 2Gi is required for memory request, if specified.
- As a general guideline, you should have 4GB of RAM for each 1 core for production use cases.

### Customizing service type

The service type can be changed to NodePort if desired.  A random port number will be assigned.

### Customizing storage

You can customize the storage classes for storage to match your environment.  If you are not sure which storage classes are available you can run the command `kubectl get storageclass` to view them.  The template has a default value of 'default'.  This means that there is a storage class _named_ 'default' not that there is a storage class that _is_ the default.  You can also optionally change the size of your storage.  You can read more about [storage configuration](./storage-configuration.md).

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
>  The example commands below assume that you created a SQL managed instance named 'sql1' and Kubernetes namespace with the name 'arc'.  If you used a different namespace/SQL managed instance name, you can replace 'arc' and 'sqlmi' with your names.

```console
kubectl get sqlmi/sql1 --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/sql1-0 --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).

## Next steps

[Connect to Azure Arc enabled SQL Managed Instance](connect-managed-instance.md)
