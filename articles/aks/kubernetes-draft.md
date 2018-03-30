---
title: Use Draft with AKS and Azure Container Registry
description: Use Draft with AKS and Azure Container Registry
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 03/29/2018
ms.author: nepeters
ms.custom: mvc
---

# Use Draft with Azure Container Service (AKS)

Draft is an open-source tool that helps contain and deploy those containers in a Kubernetes cluster, leaving you free to concentrate on the dev cycle -- the "inner loop" of concentrated development. Draft works as the code is being developed, but before committing to version control. With Draft, you can quickly redeploy an application to Kubernetes as code changes occur. For more information on Draft, see the [Draft documentation on Github][draft-documentation].

This document details using Draft with a Kubernetes cluster on AKS.

## Prerequisites

The steps detailed in this document assume that you have created an AKS cluster and have established a kubectl connection with the cluster. If you need these items, see the [AKS quickstart][aks-quickstart].

You also need a private Docker registry in Azure Container Registry (ACR). For instructions on deploying an ACR instance, see the [Azure Container Registry Quickstart][acr-quickstart].

Helm must also be installed in your AKS cluster. For more information on installing helm, see [Use Helm with Azure Container Service (AKS)][aks-helm].

Finally, you must install [Docker](https://www.docker.com).

## Install Draft

The Draft CLI is a client that runs on your development system and allows you to quicky deploy code into a Kubernetes cluster. 

> [!NOTE] 
> If you've installed Draft prior to version 0.12, you should first delete Draft from your cluster using `helm delete --purge draft` and then remove your local configuration by running `rm -rf ~/.draft`. If you are on MacOS, you can run `brew upgrade draft`.

To install the Draft CLI on a Mac use `brew`. For additional installation options see, the [Draft Install guide][install-draft].

```console
brew tap azure/draft
brew install draft
```

Now initialize Draft with the `draft init` command.

```console
draft init
```

## Configure Draft

Draft builds the container images locally, and then either deploys them from the local registry (in the case of Minikube), or you must specify the image registry to use. This example uses the Azure Container Registry (ACR), so you must establish a trust relationship between your AKS cluster and the ACR registry and configure Draft to push the container to ACR.

### Create trust between AKS cluster and ACR

To establish trust between an AKS cluster and an ACR registry, you modify the Azure Active Directory Service Prinicipal used with AKS by adding the Contributor role to it with the scope of the ACR repository. To do so, run the following commands, replacing _&lt;aks-rg-name&gt;_ and _&lt;aks-cluster-name&gt;_ with the resource group and name of your AKS cluster, and _&lt;acr-rg-nam&gt;_ and _&lt;acr-repo-name&gt;_ with the resource group and repository name of your ACR repository with which you want to create trust.

```console
export AKS_SP_ID=$(az aks show -g <aks-rg-name> -n <aks-cluster-name> --query "servicePrincipalProfile.clientId" -o tsv)
export ACR_RESOURCE_ID=$(az acr show -g <acr-rg-name> -n <acr-repo-name> --query "id" -o tsv)
az role assignment create --assignee $AKS_SP_ID --scope $ACR_RESOURCE_ID --role contributor
```

(These steps and other authentication mechanisms to access ACR are at [authenticating with ACR](../container-registry/container-registry-auth-aks.md).)

### Configure Draft to push to and deploy from ACR

Now that there is a trust relationship between AKS and ACR, the following steps enable the use of ACR from your AKS cluster.
1. Set the Draft configuration `registry` value by running `draft config set registry <registry name>.azurecr.io`, where _&lt;registry name&lt;_ is the name of your ACR registry.
2. Log on to the ACR registry by running `az acr login -n <registry name>`. 

Because you are now logged on locally to ACR and you created a trust relationship with AKS and ACR, no passwords or secrets are required to push to or pull from ACR into AKS. Authentication happens at the Azure Resource Manager level, using Azure Active Directory. 

## Run an application

The Draft repository includes several sample applications that can be used to demo Draft. Create a cloned copy of the repo.

```console
git clone https://github.com/Azure/draft
```

Change to the Java examples directory.

```console
cd draft/examples/example-java/
```

Use the `draft create` command to start the process. This command creates the artifacts that are used to run the application in a Kubernetes cluster. These items include a Dockerfile, a Helm chart, and a `draft.toml` file, which is the Draft configuration file.

```console
draft create
```

Output:

```console
--> Draft detected the primary language as Java with 92.205567% certainty.
--> Ready to sail
```

To run the application on a Kubernetes cluster, use the `draft up` command. This command builds the Dockerfile to create a container image, pushes the image to ACR, and finally installs the Helm chart to start the application in AKS.

The first time this is run, pushing and pulling the container image may take some time; once the base layers are cached, the time taken is dramatically reduced.

```console
draft up
```

Output:

```console
Draft Up Started: 'example-java'
example-java: Building Docker Image: SUCCESS ⚓  (1.0003s)
example-java: Pushing Docker Image: SUCCESS ⚓  (3.0007s)
example-java: Releasing Application: SUCCESS ⚓  (0.9322s)
example-java: Build ID: 01C9NPDYQQH2CZENDMZW7ESJAM
Inspect the logs with `draft logs 01C9NPDYQQH2CZENDMZW7ESJAM`
```

## Test the application

To test the application, use the `draft connect` command. This command proxies a connection to the Kubernetes pod allowing a secure local connection. When complete, the application can be accessed on the provided URL.

In some cases, it can take a few minutes for the container image to be downloaded and the application to start. If you receive an error when accessing the application, retry the connection.

```console
draft connect
```

Output:

```console
Connecting to your app...SUCCESS...Connect to your app on localhost:46143
Starting log streaming...
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
== Spark has ignited ...
>> Listening on 0.0.0.0:4567
```

You can now test your application by browsing to http://localhost:46143 (for the preceding example; your port may be different). When finished testing the application use `Control+C` to stop the proxy connection.

> [!NOTE]
> You can also use the `draft up --auto-connect` command to build and deploy your application and immediately connect to the first running container to make the iteration cycle even faster.

## Expose application

When testing an application in Kubernetes, you may want to make the application available on the internet. This can be done using a Kubernetes service with a type of [LoadBalancer][kubernetes-service-loadbalancer] or an [ingress controller][kubernetes-ingress]. This document details using a Kubernetes service.


First, the Draft pack needs to be updated to specify that a service with a type `LoadBalancer` should be created. To do so, update the service type in the `values.yaml` file.

```console
vi charts/java/values.yaml
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
example-java-java   10.0.141.72   <pending>     80:32150/TCP   14m
```

Once the EXTERNAL-IP address has changed from `pending` to an `IP address`, use `Control+C` to stop the kubectl watch process.

```
example-java-java   10.0.141.72   52.175.224.118   80:32150/TCP   17m
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
        get("/", (req, res) -> "Hello World, I'm Java in AKS!");
    }
}
```

Run the `draft up --auto-connect` command to redeploy the application just as soon as a pod is ready to respond.

```console
draft up --auto-connect
```

Output

```
Draft Up Started: 'example-java'
example-java: Building Docker Image: SUCCESS ⚓  (1.0003s)
example-java: Pushing Docker Image: SUCCESS ⚓  (4.0010s)
example-java: Releasing Application: SUCCESS ⚓  (1.1336s)
example-java: Build ID: 01C9NPMJP6YM985GHKDR2J64KC
Inspect the logs with `draft logs 01C9NPMJP6YM985GHKDR2J64KC`
Connect to java:4567 on localhost:39249
Your connection is still active.
Connect to java:4567 on localhost:39249
[java]: SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
[java]: SLF4J: Defaulting to no-operation (NOP) logger implementation
[java]: SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
[java]: == Spark has ignited ...
[java]: >> Listening on 0.0.0.0:4567

```

Finally, view the application to see the updates.

```console
curl 52.175.224.118
```

Output:

```
Hello World, I'm Java in AKS!
```

## Next steps

For more information about using Draft, see the Draft documentation on GitHub.

> [!div class="nextstepaction"]
> [Draft documentation][draft-documentation]

<!-- LINKS - external -->
[draft-documentation]: https://github.com/Azure/draft/tree/master/docs
[install-draft]: https://github.com/Azure/draft/blob/master/docs/install.md
[kubernetes-ingress]: ./ingress.md
[kubernetes-service-loadbalancer]: https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer

<!-- LINKS - internal -->
[acr-quickstart]: ../container-registry/container-registry-get-started-azure-cli.md
[aks-helm]: ./kubernetes-helm.md
[aks-quickstart]: ./kubernetes-walkthrough.md
