---
title: "Develop an application with an existing Helm chart on Kubernetes"
services: azure-dev-spaces
ms.date: 04/21/2020
ms.topic: quickstart
description: "This quickstart shows you how to use Azure Dev Spaces and the command line to develop an application with an existing Helm chart on Azure Kubernetes Service"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
manager: gwallace
---
# Quickstart: Develop an application with an existing Helm chart on Kubernetes - Azure Dev Spaces
In this guide, you will learn how to:

- Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
- Run an application with an existing Helm chart in AKS using Azure Dev Spaces on the command line.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli?view=azure-cli-latest).

## Create an Azure Kubernetes Service cluster

You need to create an AKS cluster in a [supported region][supported-regions]. The below commands create a resource group called *MyResourceGroup* and an AKS cluster called *MyAKS*.

```azurecli
az group create --name MyResourceGroup --location eastus
az aks create -g MyResourceGroup -n MyAKS --location eastus --generate-ssh-keys
```

## Enable Azure Dev Spaces on your AKS cluster

Use the `use-dev-spaces` command to enable Dev Spaces on your AKS cluster and follow the prompts. The below command enables Dev Spaces on the *MyAKS* cluster in the *MyResourceGroup* group and creates a dev space called *dev*.

> [!NOTE]
> The `use-dev-spaces` command will also install the Azure Dev Spaces CLI if its not already installed. You cannot install the Azure Dev Spaces CLI in the Azure Cloud Shell.

```azurecli
az aks use-dev-spaces -g MyResourceGroup -n MyAKS --space dev --yes
```

## Get sample application code

In this article, you use the [Azure Dev Spaces sample application](https://github.com/Azure/dev-spaces) to demonstrate using Azure Dev Spaces.

Clone the application from GitHub and navigate into the *dev-spaces/samples/python/getting-started/webfrontend* directory:

```cmd
git clone https://github.com/Azure/dev-spaces
cd dev-spaces/samples/python/getting-started/webfrontend
```

## Prepare the application

In order to run your application on Azure Dev Spaces, you need a Dockerfile and Helm chart. For some languages, such as [Java][java-quickstart], [.NET core][netcore-quickstart], and [Node.js][nodejs-quickstart], the Azure Dev Spaces client tooling can generate all the assets you need. For many other languages, such as Go, PHP, and Python, the client tooling can generate the Helm chart as long as you can provide a valid Dockerfile. In this case, the sample application has an existing Dockerfile and Helm chart

Generate the configuration for running the application with Azure Dev Spaces with the existing Helm chart and Dockerfile using the `azds prep` command:

```cmd
azds prep --enable-ingress --chart webfrontend/
```

You must run the `prep` command from the *dev-spaces/samples/python/getting-started/webfrontend* directory and specify the location of the Helm chart using `--chart`.

> [!NOTE]
> You may see the warning: *WARNING: Dockerfile could not be generated due to unsupported language.* when running `azds prep`. The `azds prep` command attempts to generate [a Dockerfile and Helm chart](how-dev-spaces-works-prep.md#prepare-your-code) for your project, but will not overwrite any existing Dockerfiles or Helm charts.

## Build and run code in Kubernetes

Build and run your code in AKS using the `azds up` command:

```cmd
$ azds up
Using dev space 'dev' with target 'MyAKS'
Synchronizing files...14s
Installing Helm chart...2s
Waiting for container image build...3s
Building container image...
Step 1/7 : FROM python:3
Step 2/7 : WORKDIR /python/webfrontend
Step 3/7 : RUN pip install flask
Step 4/7 : COPY webfrontend.py webfrontend.py
Step 5/7 : COPY public/ public/
Step 6/7 : EXPOSE 80
Step 7/7 : CMD ["python", "./webfrontend.py"]
Built container image in 45s
Waiting for container...25s
Service 'azds-543eae-dev-webfrontend' port 'http' is available at http://dev.service.1234567890abcdef1234.eus.azds.io/
Service 'azds-543eae-dev-webfrontend' port 80 (http) is available via port forwarding at http://localhost:52382
Press Ctrl+C to detach
...
```

You can see the service running by opening the public URL, which is displayed in the output from the `azds up` command. In this example, the public URL is `http://dev.service.1234567890abcdef1234.eus.azds.io/`.

> [!NOTE]
> When you navigate to your service while running `azds up`, the HTTP request traces are also displayed in the output of the `azds up` command. These traces can help you troubleshoot and debug your service. You can disable these traces using `--disable-http-traces` when running `azds up`.

If you stop the `azds up` command using *Ctrl+c*, the service will continue to run in AKS, and the public URL will remain available.

## Update code

To deploy an updated version of your service, you can update any file in your project and rerun the `azds up` command. For example:

1. If `azds up` is still running, press *Ctrl+c*.
1. Update [line 13 in `webfrontend.py`](https://github.com/Azure/dev-spaces/blob/master/samples/python/getting-started/webfrontend/webfrontend.py#L13) to:
    
    ```javascript
        res.send('Hello from webfrontend in Azure');
    ```

1. Save your changes.
1. Rerun the `azds up` command:

    ```cmd
    $ azds up
    Using dev space 'dev' with target 'MyAKS'
    Synchronizing files...11s
    Installing Helm chart...3s
    Waiting for container image build...
    ...    
    ```

1. Navigate to your running service and observe your changes.
1. Press *Ctrl+c* to stop the `azds up` command.

## Clean up your Azure resources

```azurecli
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
[supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service