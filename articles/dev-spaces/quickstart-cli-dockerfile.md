---
title: "Deploy an application with a Dockerfile on Kubernetes using Azure Dev Spaces"
titleSuffix: Azure Dev Spaces
author: zr-msft
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.author: zarhoads
ms.date: 07/08/2019
ms.topic: quickstart
description: "Deploy a microservice with a Dockerfile on AKS with Azure Dev Spaces"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
manager: gwallace
---
# Quickstart: Develop an application with a Dockerfile on Kubernetes using Azure Dev Spaces
In this guide, you will learn how to:

- Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
- Develop and run code in containers using the command line.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create an Azure Kubernetes Service cluster

You need to create an AKS cluster in a [supported region][supported-regions]. The below commands create a resource group called *MyResourceGroup* and an AKS cluster called *MyAKS*.

```cmd
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --node-vm-size Standard_DS2_v2 --node-count 1 --disable-rbac --generate-ssh-keys
```

## Enable Azure Dev Spaces on your AKS cluster

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a *default* dev space.

```cmd
$ az aks use-dev-spaces -g MyResourceGroup -n MyAKS

'An Azure Dev Spaces Controller' will be created that targets resource 'MyAKS' in resource group 'MyResourceGroup'. Continue? (y/N): y

Creating and selecting Azure Dev Spaces Controller 'MyAKS' in resource group 'MyResourceGroup' that targets resource 'MyAKS' in resource group 'MyResourceGroup'...2m 24s

Select a dev space or Kubernetes namespace to use as a dev space.
 [1] default
Type a number or a new name: 1

Kubernetes namespace 'default' will be configured as a dev space. This will enable Azure Dev Spaces instrumentation for new workloads in the namespace. Continue? (Y/n): Y

Configuring and selecting dev space 'default'...3s

Managed Kubernetes cluster 'MyAKS' in resource group 'MyResourceGroup' is ready for development in dev space 'default'. Type `azds prep` to prepare a source directory for use with Azure Dev Spaces and `azds up` to run.
```

## Get sample application code

In this article, you use the [Azure Dev Spaces sample application](https://github.com/Azure/dev-spaces) to demonstrate using Azure Dev Spaces. The sample application is written in Go, but you can use almost any language as long as you supply a valid Dockerfile to containerize your application and run it on AKS.

Clone the application from GitHub and navigate into the *dev-spaces/samples/golang/getting-started/webfrontend* directory:

```cmd
git clone https://github.com/Azure/dev-spaces
cd dev-spaces/samples/golang/getting-started/webfrontend
```

## Prepare the application

In order to run your application on Azure Dev Spaces, you need a Dockerfile and Helm chart. For some languages, such as [Java][java-quickstart], [.NET core][netcore-quickstart], and [Node.js][nodejs-quickstart], the Azure Dev Spaces client tooling can generate all the assets you need. For many other languages, such as Go, PHP, and Python, the client tooling can generate the Helm chart as long as you can provide a valid Dockerfile.

The sample application includes a valid Dockerfile. To generate the Helm chart assets for running the application in Kubernetes, use the `azds prep` command:

```cmd
azds prep --public
```

You must run the `prep` command from the *dev-spaces/samples/golang/getting-started/webfrontend* directory to correctly generate the Helm chart assets.

# Build and run code in Kubernetes

Build and run your code in AKS using the `azds up` command:

```cmd
$ azds up
Using dev space 'default' with target 'MyAKS'
Synchronizing files...3s
Installing Helm chart...2s
Waiting for container image build...39s
Building container image...
Step 1/7 : FROM golang:1.10
Step 2/7 : EXPOSE 80
Step 3/7 : WORKDIR /go/src
Step 4/7 : COPY src .
Step 5/7 : WORKDIR /go/src/app
Step 6/7 : RUN go install app
Step 7/7 : ENTRYPOINT /go/bin/app
Built container image in 41s
Waiting for container...13s
Service 'webfrontend' port 'http' is available at http://default.webfrontend.1234567890abcdef1234.eus.azds.io/
Service 'webfrontend' port 80 (http) is available via port forwarding at http://localhost:50199
...
```

You can see the service running by opening the public URL and navigating to the `/api` path. The public URL is displayed in the output from the `azds up` command. In this example, the public URL is `http://default.webfrontend.1234567890abcdef1234.eus.azds.io/` and you would navigate to `http://default.webfrontend.1234567890abcdef1234.eus.azds.io/api`.

If you stop the `azds up` command using *Ctrl+c*, the service will continue to run in AKS, and the public URL will remain available.

## Update code

To deploy an updated version of your service, you can update any file in your project and rerun the `azds up` command. For example:

1. If `azds up` is still running, press *Ctrl+c*.
1. Update [line 29 in `src/app/main.go`](https://github.com/Azure/dev-spaces/blob/master/samples/golang/getting-started/webfrontend/src/app/main.go#L29) to:
    
    ```golang
        fmt.Fprintf(w, "Hello from webfrontend in Azure")
    ```

1. Save your changes.
1. Rerun the `azds up` command:

    ```cmd
    $ azds up
    Using dev space 'default' with target 'MyAKS'
    Synchronizing files...1s
    Installing Helm chart...3s
    Waiting for container image build...
    ...    
    ```

1. Navigate to your running service and observe your changes.
1. Press *Ctrl+c* to stop the `azds up` command.

## Clean up your Azure resources

```cmd
az group delete --name MyResourceGroup --yes --no-wait
```

## Next steps

Learn how Azure Dev Spaces helps you develop more complex applications across multiple containers, and how you can simplify collaborative development by working with different versions or branches of your code in different spaces.

> [!div class="nextstepaction"]
> [Team development in Azure Dev Spaces][team-quickstart]


[java-quickstart]: quickstart-java.md
[nodejs-quickstart]: quickstart-nodejs.md
[netcore-quickstart]: quickstart-netcore.md
[team-quickstart]: quickstart-team-development.md
[supported-regions]: about.md#supported-regions-and-configurations