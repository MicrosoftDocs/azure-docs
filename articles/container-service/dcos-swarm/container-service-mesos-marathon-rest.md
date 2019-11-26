---
title: (DEPRECATED) Manage Azure DC/OS cluster with Marathon REST API
description: Deploy containers to an Azure Container Service DC/OS cluster by using the Marathon REST API.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 04/04/2017
ms.author: iainfou
ms.custom: mvc
---

# (DEPRECATED) DC/OS container management through the Marathon REST API

[!INCLUDE [ACS deprecation](../../../includes/container-service-deprecation.md)]

DC/OS provides an environment for deploying and scaling clustered workloads, while abstracting the underlying hardware. On top of DC/OS, there is a framework that manages scheduling and executing compute workloads. Although frameworks are available for many popular workloads, this document gets you started creating and scaling container deployments by using the Marathon REST API. 

## Prerequisites

Before working through these examples, you need a DC/OS cluster that is configured in Azure Container Service. You also need to have remote connectivity to this cluster. For more information on these items, see the following articles:

* [Deploying an Azure Container Service cluster](container-service-deployment.md)
* [Connecting to an Azure Container Service cluster](../container-service-connect.md)

## Access the DC/OS APIs
After you are connected to the Azure Container Service cluster, you can access the DC/OS and related REST APIs through http:\//localhost:local-port. The examples in this document assume that you are tunneling on port 80. For example, the Marathon endpoints can be reached at URIs beginning with http:\//localhost/marathon/v2/. 

For more information on the various APIs, see the Mesosphere documentation for the [Marathon
API](https://mesosphere.github.io/marathon/docs/rest-api.html) and the
[Chronos API](https://mesos.github.io/chronos/docs/api.html), and the
Apache documentation for the [Mesos Scheduler
API](https://mesos.apache.org/documentation/latest/scheduler-http-api/).

## Gather information from DC/OS and Marathon
Before you deploy containers to the DC/OS cluster, gather some
information about the DC/OS cluster, such as the names and
status of the DC/OS agents. To do so, query the `master/slaves`
endpoint of the DC/OS REST API. If everything goes well, the query returns a list of DC/OS agents and several properties for each.

```bash
curl http://localhost/mesos/master/slaves
```

Now, use the Marathon `/apps` endpoint to check for current application deployments to the DC/OS cluster. If this is a new cluster, you see an empty array for apps.

```bash
curl localhost/marathon/v2/apps

{"apps":[]}
```

## Deploy a Docker-formatted container
You deploy Docker-formatted containers through the Marathon REST API by using a JSON file that describes the intended deployment. The following sample deploys an Nginx container to a private agent in the cluster. 

```json
{
  "id": "nginx",
  "cpus": 0.1,
  "mem": 32.0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

To deploy a Docker-formatted container, store the JSON file in an accessible location. Next, to deploy the container, run the following command. Specify the name of the JSON file (`marathon.json` in this example).

```bash
curl -X POST http://localhost/marathon/v2/apps -d @marathon.json -H "Content-type: application/json"
```

The output is similar to the following:

```json
{"version":"2015-11-20T18:59:00.494Z","deploymentId":"b12f8a73-f56a-4eb1-9375-4ac026d6cdec"}
```

Now, if you query Marathon for applications, this new application appears in the output.

```bash
curl localhost/marathon/v2/apps
```

## Reach the container

You can verify that the Nginx is running in a container on one of the private agents in the cluster. To find the host and port where the container is running, query Marathon for the running tasks: 

```bash
curl localhost/marathon/v2/tasks
```

Find the value of `host` in the output (an IP address similar to `10.32.0.x`), and the value of `ports`.


Now make an SSH terminal connection (not a tunneled connection) to the management FQDN of the cluster. Once connected, make the following request, substituting the correct values of `host` and `ports`:

```bash
curl http://host:ports
```

The Nginx server output is similar to the following:

![Nginx from container](./media/container-service-mesos-marathon-rest/nginx.png)




## Scale your containers
You can use the Marathon API to scale out or scale in application deployments. In the previous example, you deployed one instance of an application. Let's scale this out to three instances of an application. To do so, create a JSON file by using the following JSON text, and store it in an accessible location.

```json
{ "instances": 3 }
```

From your tunneled connection, run the following command to scale out the application.

> [!NOTE]
> The URI is http:\//localhost/marathon/v2/apps/ followed by the ID of the application to scale. If you are using the Nginx sample that is provided here, the URI would be http:\//localhost/marathon/v2/apps/nginx.

```bash
curl http://localhost/marathon/v2/apps/nginx -H "Content-type: application/json" -X PUT -d @scale.json
```

Finally, query the Marathon endpoint for applications. You see that there are now three Nginx containers.

```bash
curl localhost/marathon/v2/apps
```

## Equivalent PowerShell commands
You can perform these same actions by using PowerShell commands on a Windows system.

To gather information about the DC/OS cluster, such as agent names and agent status, run the following command:

```powershell
Invoke-WebRequest -Uri http://localhost/mesos/master/slaves
```

You deploy Docker-formatted containers through Marathon by using a JSON file that describes the intended deployment. The following sample deploys the Nginx container, binding port 80 of the DC/OS agent to port 80 of the container.

```json
{
  "id": "nginx",
  "cpus": 0.1,
  "mem": 32.0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

To deploy a Docker-formatted container, store the JSON file in an accessible location. Next, to deploy the container, run the following command. Specify the path to the JSON file (`marathon.json` in this example).

```powershell
Invoke-WebRequest -Method Post -Uri http://localhost/marathon/v2/apps -ContentType application/json -InFile 'c:\marathon.json'
```

You can also use the Marathon API to scale out or scale in application deployments. In the previous example, you deployed one instance of an application. Let's scale this out to three instances of an application. To do so, create a JSON file by using the following JSON text, and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale out the application:

> [!NOTE]
> The URI is http:\//localhost/marathon/v2/apps/ followed by the ID of the application to scale. If you are using the Nginx sample provided here, the URI would be http:\//localhost/marathon/v2/apps/nginx.

```powershell
Invoke-WebRequest -Method Put -Uri http://localhost/marathon/v2/apps/nginx -ContentType application/json -InFile 'c:\scale.json'
```

## Next steps
* [Read more about the Mesos HTTP endpoints](https://mesos.apache.org/documentation/latest/endpoints/)
* [Read more about the Marathon REST API](https://mesosphere.github.io/marathon/docs/rest-api.html)

