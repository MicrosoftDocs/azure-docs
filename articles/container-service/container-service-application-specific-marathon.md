<properties
   pageTitle="Application or user specific Marathon service | Microsoft Azure"
   description="Create an application or user specific Marathon service"
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

# Create an application or user specific marathon service

Azure Container Service provides a set of masters on which we preconfigure Apache Mesos and Marathon. These can be used to orchestrate your applications on the cluster, but it is best not to use the Masters for this purpose. For example, tweaking the configuration of Marathon requires logging into the masters themselves and making changes; this encourages "snowflake" master servers that are a little different from the "standard" and need to be cared for and managed independently. Furthermore, the configuration required by one team may not be the optimal configuration for another team. In this post we'll explain how to add a user or application specific Marathon service.

Since this service will belong to a single user or team, they are free to configure it in any way they desire. Furthermore, Azure Container Service will ensure that the service continues to run; should the service fail, Azure Container Service will restart it for you. Most of the time you won't even notice it had downtime.

## Prerequisites

[Deploy an instance of Azure Container Service](container-service-deployment.md) with orchestrator type DCOS, [ensure your client can connect to your cluster](container-service-connect.md), and [install the DC/OS CLI](container-service-install-dcos-cli.md).

## Creating an application or user specific Marathon service.

Begin by creating a JSON configuration file that defines the name of the application service you want to create. Here we use `marathon-alice` as the framework name. Save the file as something like `marathon-alice.json`:

```json
{"marathon": {"framework-name": "marathon-alice" }}
```

Next, use the DC/OS CLI to install the Marathon instance with the options set in your configuration file:

```bash
dcos package install --options=marathon-alice.json marathon
```

You should now see your `marathon-alice` service running in the services tab of your DC/OS UI. The UI will be `http://<hostname>/service/marathon-alice/` if you want to access it directly.

## Setting the DC/OS CLI to access the service

You can optionally configure your DC/OS CLI to access this new service by setting the `marathon.url` property to point to the `marathon-alice` instance as follows:

```bash
dcos config set marathon.url http://<hostname>/service/marathon-alice/
```

You can verify which instance of Marathon your CLI is working against with the `dcos config show` command, and you can revert to using your master Marathon service with the command `dcos config unset marathon.url`.