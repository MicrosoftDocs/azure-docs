---
title: Create a PostgreSQL Hyperscale server group using Kubernetes tools
description: Create a PostgreSQL Hyperscale server group using Kubernetes tools
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create a PostgreSQL Hyperscale server group using Kubernetes tools

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Prerequisites

You should have already created an [Azure Arc data controller](./create-data-controller.md).

To create a PostgreSQL Hyperscale server group using Kubernetes tools, you will need to have the Kubernetes tools installed.  The examples in this article will use `kubectl`, but similar approaches could be used with other Kubernetes tools such as the Kubernetes dashboard, `oc`, or `helm` if you are familiar with those tools and Kubernetes yaml/json.

[Install the kubectl tool](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Overview

To create a PostgreSQL Hyperscale server group, you need to create a Kubernetes secret to store your postgres administrator login and password securely and a PostgreSQL Hyperscale server group custom resource based on the postgresql-12 or postgresql-11 custom resource definitions.

## Create a yaml file

You can use the [template yaml](https://raw.githubusercontent.com/microsoft/azure_arc/main/arc_data_services/deploy/yaml/postgresql.yaml) file as a starting point to create your own custom PostgreSQL Hyperscale server group yaml file.  Download this file to your local computer and open it in a text editor.  It is useful to use a text editor such as [VS Code](https://code.visualstudio.com/download) that support syntax highlighting and linting for yaml files.

This is an example yaml file:

```yaml
apiVersion: v1
data:
  password: <your base64 encoded password>
kind: Secret
metadata:
  name: pg1-login-secret
type: Opaque
---
apiVersion: arcdata.microsoft.com/v1alpha1
kind: postgresql-12
metadata:
  generation: 1
  name: pg1
spec:
  engine:
    extensions:
    - name: citus
  scale:
    shards: 3
  scheduling:
    default:
      resources:
        limits:
          cpu: "4"
          memory: 4Gi
        requests:
          cpu: "1"
          memory: 2Gi
  service:
    type: LoadBalancer
  storage:
    backups:
      className: default
      size: 5Gi
    data:
      className: default
      size: 5Gi
    logs:
      className: default
      size: 1Gi
```

### Customizing the login and password.
A Kubernetes secret is stored as a base64 encoded string - one for the username and one for the password.  You will need to base64 encode a administrator login and password and place them in the placeholder location at `data.password` and `data.username`.  Do not include the `<` and `>` symbols provided in the template.

You can use an online tool to base64 encode your desired username and password or you can use built in CLI tools depending on your platform.

PowerShell

```console
[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('<your string to encode here>'))

#Example
#[Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes('example'))

```

Linux/macOS

```console
echo -n '<your string to encode here>' | base64

#Example
# echo -n 'example' | base64
```

### Customizing the name

The template has a value of 'pg1' for the name attribute.  You can change this but it must be characters that follow the DNS naming standards.  You must also change the name of the secret to match.  For example, if you change the name of the PostgreSQL Hyperscale server group to 'pg2', you must change the name of the secret from 'pg1-login-secret' to 'pg2-login-secret'

### Customizing the engine version

You can change the engine version to be either postgresql-11 or postgresql-12 by editing the `kind` attribute.

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

### Customizing service type

The service type can be changed to NodePort if desired.  A random port number will be assigned.

### Customizing storage

You can customize the storage classes for storage to match your environment.  If you are not sure which storage classes are available you can run the command `kubectl get storageclass` to view them.  The template has a default value of 'default'.  This means that there is a storage class _named_ 'default' not that there is a storage class that _is_ the default.  You can also optionally change the size of your storage.  You can read more about [storage configuration](./storage-configuration.md).

## Creating the PostgreSQL Hyperscale server group

Now that you have customized the PostgreSQL Hyperscale server group yaml file, you can create the PostgreSQL Hyperscale server group by running the following command:

```console
kubectl create -n <your target namespace> -f <path to your yaml file>

#Example
#kubectl create -n arc -f C:\arc-data-services\postgres.yaml
```


## Monitoring the creation status

Creating the PostgreSQL Hyperscale server group will take a few minutes to complete. You can monitor the progress in another terminal window with the following commands:

> [!NOTE]
>  The example commands below assume that you created a PostgreSQL Hyperscale server group named 'pg1' and Kubernetes namespace with the name 'arc'.  If you used a different namespace/PostgreSQL Hyperscale server group name, you can replace 'arc' and 'pg1' with your names.

```console
kubectl get postgresql-12/pg1 --namespace arc
```

```console
kubectl get pods --namespace arc
```

You can also check on the creation status of any particular pod by running a command like below.  This is especially useful for troubleshooting any issues.

```console
kubectl describe po/<pod name> --namespace arc

#Example:
#kubectl describe po/pg1-0 --namespace arc
```

## Troubleshooting creation problems

If you encounter any troubles with creation, please see the [troubleshooting guide](troubleshoot-guide.md).