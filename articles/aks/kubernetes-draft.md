---
title: Use Draft with AKS and Azure Container Registry | Microsoft Docs
description: Use Draft with AKS and Azure Container Registry
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: draft, helm, aks, azure-container-service
keywords: Docker, Containers, microservices, Kubernetes, Draft, Azure


ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: nepeters
ms.custom: mvc
---

# Use Draft with Azure Container Service (AKS)

Draft is an open-source tool that helps package and run code in a Kubernetes cluster. Draft is targeted at the development iteration cycle; as the code is being developed, but before committing to version control. With Draft, you can quickly redeploy an application to Kubernetes as code changes occur. For more information on Draft, see the [Draft documentation on Github](https://github.com/Azure/draft/tree/master/docs).

This document details using Draft with a Kubernetes cluster on AKS.

## Prerequisites

The steps detailed in this document assume that you have created an AKS cluster and have established a kubectl connection with the cluster. If you need these items, see the [AKS quickstart](./kubernetes-walkthrough.md).

You also need a private Docker registry in Azure Container Registry (ACR). For instructions on deploying an ACR instance, see the [Azure Container Registry Quickstart](../container-registry/container-registry-get-started-azure-cli.md).

## Install Helm

The Helm CLI is a client that runs on your development system and allows you to start, stop, and manage applications with Helm charts.

To install the Helm CLI on a Mac, use `brew`. For additional installation options, see [Installing Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md).

```console
brew install kubernetes-helm
```

Output:

```
==> Downloading https://homebrew.bintray.com/bottles/kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring kubernetes-helm-2.6.2.sierra.bottle.1.tar.gz
==> Caveats
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
🍺  /usr/local/Cellar/kubernetes-helm/2.6.2: 50 files, 132.4MB
```

## Install Draft

The Draft CLI is a client that runs on your development system and allows you to quicky deploy code into a Kubernetes cluster.

To install the Draft CLI on a Mac use `brew`. For additional installation options see, the [Draft Install guide](https://github.com/Azure/draft/blob/master/docs/install.md).

```console
brew install draft
```

Output:

```
==> Installing draft from azure/draft
==> Downloading https://azuredraft.blob.core.windows.net/draft/draft-v0.7.0-darwin-amd64.tar.gz
Already downloaded: /Users/neilpeterson/Library/Caches/Homebrew/draft-0.7.0.tar.gz
==> /usr/local/Cellar/draft/0.7.0/bin/draft init --client-only
🍺  /usr/local/Cellar/draft/0.7.0: 6 files, 61.2MB, built in 1 second
```

## Configure Draft

When configuring Draft, a container registry needs to be specified. In this example Azure Container Registry is used.

Run the following command to get the name and login server name of your ACR instance. Update the command with the name of the resource group containing your ACR instance.

```console
az acr list --resource-group <resource group> --query "[].{Name:name,LoginServer:loginServer}" --output table
```

The ACR instance password is also needed.

Run the following command to return the ACR password. Update the command with the name of the ACR instance.

```console
az acr credential show --name <acr name> --query "passwords[0].value" --output table
```

Initialize Draft with the `draft init` command.

```console
draft init
```

During this process, you are prompted for the container registry credentials. When using an Azure Container Registry, the registry URL is the ACR login server name, the username is the ACR instance name, and the password is the ACR password.

```console
1. Enter your Docker registry URL (e.g. docker.io/myuser, quay.io/myuser, myregistry.azurecr.io): <ACR Login Server>
2. Enter your username: <ACR Name>
3. Enter your password: <ACR Password>
```

Once complete, Draft is configured in the Kubernetes cluster and is ready to use.

```
Draft has been installed into your Kubernetes Cluster.
Happy Sailing!
```

## Run an application

The Draft repository includes several sample applications that can be used to demo Draft. Create a cloned copy of the repo.

```console
git clone https://github.com/Azure/draft
```

Change to the Java examples directory.

```console
cd draft/examples/java/
```

Use the `draft create` command to start the process. This command creates the artifacts that are used to run the application in a Kubernetes cluster. These items include a Dockerfile, a Helm chart, and a `draft.toml` file, which is the Draft configuration file.

```console
draft create
```

Output:

```
--> Draft detected the primary language as Java with 92.205567% certainty.
--> Ready to sail
```

To run the application on a Kubernetes cluster, use the `draft up` command. This command uploads the application code and configuration files to the Kubernetes cluster. It then runs the Dockerfile to create a container image, pushes the image to the container registry, and finally runs the Helm chart to start the application.

```console
draft up
```

Output:

```
Draft Up Started: 'open-jaguar'
open-jaguar: Building Docker Image: SUCCESS ⚓  (28.0342s)
open-jaguar: Pushing Docker Image: SUCCESS ⚓  (7.0647s)
open-jaguar: Releasing Application: SUCCESS ⚓  (4.5056s)
open-jaguar: Build ID: 01BW3VVNZYQ5NQ8V1QSDGNVD0S
```

## Test the application

To test the application, use the `draft connect` command. This command proxies a connection to the Kubernetes pod allowing a secure local connection. When complete, the application can be accessed on the provided URL.

In some cases, it can take a few minutes for the container image to be downloaded and the application to start. If you receive an error when accessing the application, retry the connection.

```console
draft connect
```

Output:

```
Connecting to your app...SUCCESS...Connect to your app on localhost:46143
Starting log streaming...
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
== Spark has ignited ...
>> Listening on 0.0.0.0:4567
```

When finished testing the application use `Control+C` to stop the proxy connection.

## Expose application

When testing an application in Kubernetes, you may want to make the application available on the internet. This can be done using a Kubernetes service with a type of [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer) or an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress/). This document details using a Kubernetes service.


First, the Draft pack needs to be updated to specify that a service with a type `LoadBalancer` should be created. To do so, update the service type in the `values.yaml` file.

```console
vi chart/java/values.yaml
```

Locate the `service.type` property and update the value from `ClusterIP` to `LoadBalancer`.

```yaml
replicaCount: 2
image:
  repository: openjdk
  tag: 8-jdk-alpine
  pullPolicy: IfNotPresent
service:
  name: java
  type: LoadBalancer
  externalPort: 80
  internalPort: 4567
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
  ```

Run `draft up` to re-run the application.

```console
draft up
```

It can take few minutes for the Service to return a public IP address. To monitor progress use the `kubectl get service` command with a watch.

```console
kubectl get service -w
```

Initially, the *EXTERNAL-IP* for the service appears as `pending`.

```
deadly-squid-java   10.0.141.72   <pending>     80:32150/TCP   14m
```

Once the EXTERNAL-IP address has changed from `pending` to an `IP address`, use `Control+C` to stop the kubectl watch process.

```
deadly-squid-java   10.0.141.72   52.175.224.118   80:32150/TCP   17m
```

To see the application, browse to the external IP address.

```console
curl 52.175.224.118
```

Output:

```
Hello World, I'm Java
```

## Iterate on the application

Now that Draft has been configured and the application is running in Kubernetes, you are set for code iteration. Each time you would like to test updated code, run the `draft up` command to update the running application.

For this example, update the Java hello world application.

```console
vi src/main/java/helloworld/Hello.java
```

Update the Hello World text.

```java
package helloworld;

import static spark.Spark.*;

public class Hello {
    public static void main(String[] args) {
        get("/", (req, res) -> "Hello World, I'm Java - Draft Rocks!");
    }
}
```

Run the `draft up` command to redeploy the application.

```console
draft up
```

Output

```
Draft Up Started: 'deadly-squid'
deadly-squid: Building Docker Image: SUCCESS ⚓  (18.0813s)
deadly-squid: Pushing Docker Image: SUCCESS ⚓  (7.9394s)
deadly-squid: Releasing Application: SUCCESS ⚓  (6.5005s)
deadly-squid: Build ID: 01BWK8C8X922F5C0HCQ8FT12RR
```

Finally, view the application to see the updates.

```console
curl 52.175.224.118
```

Output:

```
Hello World, I'm Java - Draft Rocks!
```

## Next steps

For more information about using Draft, see the Draft documentation on GitHub.

> [!div class="nextstepaction"]
> [Draft documentation](https://github.com/Azure/draft/tree/master/docs)