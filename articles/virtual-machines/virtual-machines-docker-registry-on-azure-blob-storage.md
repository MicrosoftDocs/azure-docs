<properties title="Deploying Your Own Private Docker Registry on Azure"
  pageTitle="Deploying Your Own Private Docker Registry on Azure"
  description="Describes how you can use Docker Registry to host your container images on the Azure Blob Storage service."
  services="virtual-machines"
  documentationCenter="virtual-machines"
  authors="ahmetalpbalkan"
  editor="squillace"
  manager="" 
  tags="" />

<tags
  ms.service="virtual-machines"
  ms.devlang="multiple"
  ms.topic="article"
  ms.tgt_pltfrm="vm-linux"
  ms.workload="infrastructure-services"
  ms.date="06/17/2015" 
  ms.author="ahmetb" />

# Deploying Your Own Private Docker Registry on Azure

This document describes what a Docker private registry is and shows how you can deploy a Docker Registry 2.0
container image to a Docker private registry on Microsoft Azure using Azure Blob Storage.

This document assumes:

1. You know how to use Docker and have Docker images to store. (You don't? [Learn about Docker](https://www.docker.com))
2. You have a server that has Docker engine installed. (You don't? [Do it quickly on Azure.](http://azure.microsoft.com/documentation/templates/docker-simple-on-ubuntu/))


## What is a Private Docker Registry?

In order to ship your containerized applications to the cloud,
you construct a Docker container image and store it somewhere so that it can be
used by yourself and by others. 

While creating a container image and shipping it to the cloud is easy,
it is a challenge to store the generated image reliably. For that reason,
Docker offers a centralized service called [Docker Hub][docker-hub] to store
container images on the cloud and allows you to create containers
anytime using those images.

Although the [Docker Hub][docker-hub] is a paid service for storing
your private application container images, Docker respects developers’ needs and
provides an open-source toolset to store your images in your own private Docker
registry behind a firewall or on-premises without hitting the public Internet.
Because Azure Blob storage is easy to secure, you can quickly use it to create
and use a private Docker registry in Azure that you control yourself.

## Why should you Host a Docker Registry on Azure?

By hosting your Docker Registry instance on Microsoft Azure and storing your
images on Azure Blob Storage, you can have several benefits:

**Security:** Your Docker images do not leave Azure datacenters, so they do
  not cross the public Internet as they would if you were using Docker Hub.
  
**Performance:** Your Docker images are stored are stored within the same
datacenter or region as your applications. This means the images will be
pulled faster and more reliably compared to Docker Hub.

**Reliability:** By using Microsoft Azure Blob Storage, you can make use
of many storage properties like high availability, redundancy, premium
storage (SSDs), and so on.

## Configuring Docker Registry to use Azure Blob Storage

(It's recommended to read the [Docker Registry 2.0 documentation][registry-docs]
before proceeding.)

You can [configure][registry-config] your Docker Registry in two different ways.
You can:

1. Use a `config.yml` file. In this case you will need to create a
  separate Docker image on top of `registry` image.
2. Override the default configuration file through environment variables:
  gets things done without creating and maintaining a separate Docker image.

For the sake of simplicity, this topic follows option 2, using
the environment variables.

In order to run a Docker Registry instance which:
* uses your Azure Storage Account for storing the images
* listens on the Virtual Machine's port 5000
* has no authentication configured (not recommended, see the note below)

you need to run the following Docker command in your bash
terminal (replace `<storage-account>` and `<storage-key>` 
with your credentials):

```sh
$ docker run -d -p 5000:5000 \
     -e REGISTRY_STORAGE=azure \
     -e REGISTRY_STORAGE_AZURE_ACCOUNTNAME="<storage-account>" \
     -e REGISTRY_STORAGE_AZURE_ACCOUNTKEY="<storage-key>" \
     -e REGISTRY_STORAGE_AZURE_CONTAINER="registry" \
     --name=registry \
     registry:2
```

Once the command exits, you can see the container hosting
your private Docker Registry instance by running the `docker ps`
command on your host:

```sh
$ docker ps
CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS                    NAMES
3698ddfebc6f        registry:2          "registry cmd/regist   2 seconds ago       Up 1 seconds        0.0.0.0:5000->5000/tcp   registry
```

> [AZURE.IMPORTANT] Configuring security for the Docker Registry
is not covered in this document and your registry will be accessible
to anyone without authentication by default if you open up the port to
the registry port on the Virtual Machine endpoint or load balancer if you
use the deployment command above.
>
> Please read the [Configuring Docker
Registry][registry-config] documentation to learn how to secure the
registry instance and your images.

## Next Steps

Once you have your registry set up, it's time to go use it some more. Start with the docker [registry-docs]. 

[docker-hub]: https://hub.docker.com/
[registry]: https://github.com/docker/distribution
[registry-docs]: http://docs.docker.com/registry/
[registry-config]: http://docs.docker.com/registry/configuration/
 