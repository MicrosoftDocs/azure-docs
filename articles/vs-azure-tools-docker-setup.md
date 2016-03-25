<properties
   pageTitle="Configure the Docker client | Microsoft Azure"
   description="Step-by-step instructions to configure and test the default instance of the Docker machine"
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="03/25/2016"
   ms.author="tarcher" />

# Configure the Docker client

## Overview
This article will guide you through making sure that the default instance of Docker machine is configured and running.

## Prerequisites
The following tools need to be installed.

- [Docker Toolbox](https://www.docker.com/products/overview#/docker_toolbox)

## Configuring and testing the Docker client 

1. Create a default docker host instance by issuing the following command at a command prompt.

		docker-machine create --driver virtualbox default
 
1. Verify the default instance is configured and running by issuing the following command at the command prompt. (You should see an instance named `default' running.

		docker-machine ls 
		
	![][0]
 
1. Set default as the current host by issuing the following command at the command prompt.

		docker-machine env default

1. Issue the following command to configure your shell.

		FOR /f "tokens=*" %i IN ('docker-machine env default') DO %i

1. The following command should display an empty response of active containers running.

		docker ps

	![][1]
 
> [AZURE.NOTE] Each time you reboot your development machine, you’ll need to restart your local docker host. To do this, issue the following command at a command prompt: `docker-machine start default`

[0]: ./media/vs-azure-tools-docker-setup/docker-machine-ls.png
[1]: ./media/vs-azure-tools-docker-setup/docker-ps.png