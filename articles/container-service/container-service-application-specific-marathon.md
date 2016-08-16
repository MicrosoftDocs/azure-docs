<properties
   pageTitle="Application or user-specific Marathon service | Microsoft Azure"
   description="Create an application or user-specific Marathon service"
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Containers, Marathon, Micro-services, DC/OS, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/12/2016"
   ms.author="rogardle"/>

# Create an application or user-specific Marathon service

Azure Container Service provides a set of master servers on which we preconfigure Apache Mesos and Marathon. These can be used to orchestrate your applications on the cluster, but it's best not to use the master servers for this purpose. For example, tweaking the configuration of Marathon requires logging into the master servers themselves and making changes--this encourages unique master servers that are a little different from the standard and need to be cared for and managed independently. Additionally, the configuration required by one team might not be the optimal configuration for another team.

In this article, we'll explain how to add an application or user-specific Marathon service.

Because this service will belong to a single user or team, they are free to configure it in any way that they desire. Also, Azure Container Service will ensure that the service continues to run. If the service fails, Azure Container Service will restart it for you. Most of the time you won't even notice it had downtime.

## Prerequisites

[Deploy an instance of Azure Container Service](container-service-deployment.md) with orchestrator type DC/OS and  [ensure that your client can connect to your cluster](container-service-connect.md). Also, do the following steps.

[AZURE.INCLUDE [install the DC/OS CLI](../../includes/container-service-install-dcos-cli-include.md)]

## Create an application or user-specific Marathon service

Begin by creating a JSON configuration file that defines the name of the application service that you want to create. Here we use `marathon-alice` as the framework name. Save the file as something like `marathon-alice.json`:

```json
{"marathon": {"framework-name": "marathon-alice" }}
```

Next, use the DC/OS CLI to install the Marathon instance with the options that are set in your configuration file:

```bash
dcos package install --options=marathon-alice.json marathon
```

You should now see your `marathon-alice` service running in the Services tab of your DC/OS UI. The UI will be `http://<hostname>/service/marathon-alice/` if you want to access it directly.

## Set the DC/OS CLI to access the service

You can optionally configure your DC/OS CLI to access this new service by setting the `marathon.url` property to point to the `marathon-alice` instance as follows:

```bash
dcos config set marathon.url http://<hostname>/service/marathon-alice/
```

You can verify which instance of Marathon that your CLI is working against with the `dcos config show` command. You can revert to using your master Marathon service with the command `dcos config unset marathon.url`.
