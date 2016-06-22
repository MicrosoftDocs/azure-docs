<properties
   pageTitle="Azure Container Service container management through the REST API | Microsoft Azure"
   description="Deploy containers to an Azure Container Service Mesos cluster by using the Marathon REST API."
   services="container-service"
   documentationCenter=""
   authors="neilpeterson"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="nepeters"/>

# Container management through the REST API

DC/OS provides an environment for deploying and scaling clustered workloads, while abstracting the underlying hardware. On top of DC/OS, there is a framework that manages scheduling and executing compute workloads.

Although frameworks are available for many popular workloads, this document describes how you can create and scale container deployments by using Marathon. Before working through these examples, you need a DC/OS cluster that is configured in Azure Container Service. You also need to have remote connectivity to this cluster. For more information on these items, see the following articles:

- [Deploying an Azure Container Service cluster](container-service-deployment.md)
- [Connecting to an Azure Container Service cluster](container-service-connect.md)

After you are connected to the Azure Container Service cluster, you can access the DC/OS and related REST APIs through http://localhost:local-port. The examples in this document assume that you are tunneling on port 80. For example, the Marathon endpoint can be reached at `http://localhost/marathon/v2/`. For more information on the various APIs, see the Mesosphere documentation for the [Marathon
API](https://mesosphere.github.io/marathon/docs/rest-api.html) and the
[Chronos API](https://mesos.github.io/chronos/docs/api.html), and the
Apache documentation for the [Mesos Scheduler
API](http://mesos.apache.org/documentation/latest/scheduler-http-api/).

## Gather information from DC/OS and Marathon

Before you deploy containers to the DC/OS cluster, gather some
information about the DC/OS cluster, such as the names and current
status of the DC/OS agents. To do so, query the `master/slaves`
endpoint of the DC/OS REST API. If everything goes well, you will see a list of DC/OS agents and several properties for each.

```bash
curl http://localhost/mesos/master/slaves
```

Now, use the Marathon `/apps` endpoint to check for current application deployments to the DC/OS cluster. If this is a new cluster, you will see an empty array for apps.

```
curl localhost/marathon/v2/apps

{"apps":[]}
```

## Deploy a Docker-formatted container

You deploy Docker-formatted containers through Marathon by using a JSON file that describes the intended deployment. The following sample will deploy the Nginx container, binding port 80 of the DC/OS agent to port 80 of the container. Also note that the ‘acceptedResourceRoles’ property is set to ‘slave_public’. This will deploy the container to an agent in the public-facing agent scale set.

```json
{
  "id": "nginx",
  "cpus": 0.1,
  "mem": 16.0,
  "instances": 1,
    "acceptedResourceRoles": [
    "slave_public"
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "hostPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

In order to deploy a Docker-formatted container, create your own JSON file, or use the sample provided at [Azure Container Service demo](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json). Store it in an accessible location. Next, to deploy the container, run the following command. Specify the name of the JSON file.

```
# deploy container

curl -X POST http://localhost/marathon/v2/apps -d @marathon.json -H "Content-type: application/json"
```

The output will be similar to the following:

```json
{"version":"2015-11-20T18:59:00.494Z","deploymentId":"b12f8a73-f56a-4eb1-9375-4ac026d6cdec"}
```

Now, if you query Marathon for applications, this new application will show in the output.

```
curl localhost/marathon/v2/apps
```

## Scale your containers

You can also use the Marathon API to scale out or scale in application deployments. In the previous example, you deployed one instance of an application. Let's scale this out to three instances of an application. To do so, create a JSON file by using the following JSON text, and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale out the application.

>[AZURE.NOTE] The URI will be http://localhost/marathon/v2/apps/ and then the ID of the application to scale. If you are using the Nginx sample that is provided here, the URI would be http://localhost/marathon/v2/apps/nginx.

```json
# scale container

curl http://localhost/marathon/v2/apps/nginx -H "Content-type: application/json" -X PUT -d @scale.json
```

Finally, query the Marathon endpoint for applications. You will see that there are now three of the Nginx containers.

```
curl localhost/marathon/v2/apps
```

## Use PowerShell for this exercise: Marathon REST API interaction with PowerShell

You can perform these same actions by using PowerShell commands on a Windows system.

To gather information about the DC/OS cluster, such as agent names and agent status, run the following command.

```powershell
Invoke-WebRequest -Uri http://localhost/mesos/master/slaves
```

You deploy Docker-formatted containers through Marathon by using a JSON file that describes the intended deployment. The following sample will deploy the Nginx container, binding port 80 of the DC/OS agent to port 80 of the container.

```json
{
  "id": "nginx",
  "cpus": 0.1,
  "mem": 16.0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "nginx",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "hostPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

Create your own JSON file, or use the sample provided at [Azure Container Service demo](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json). Store it in an accessible location. Next, to deploy the container, run the following command. Specify the name of the JSON file.

```powershell
# deploy container

Invoke-WebRequest -Method Post -Uri http://localhost/marathon/v2/apps -ContentType application/json -InFile 'c:\marathon.json'
```

You can also use the Marathon API to scale out or scale in application deployments. In the previous example, you deployed one instance of an application. Let's scale this out to three instances of an application. To do so, create a JSON file by using the following JSON text, and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale out the application.

> [AZURE.NOTE] The URI will be http://localhost/marathon/v2/apps/ and then the ID of the application to scale. If you are using the Nginx sample provided here, the URI would be http://localhost/marathon/v2/apps/nginx.

```powershell
# scale container

Invoke-WebRequest -Method Put -Uri http://localhost/marathon/v2/apps/nginx -ContentType application/json -InFile 'c:\scale.json'
```

## Next steps

- [Read more about the Mesos HTTP endpoints]( http://mesos.apache.org/documentation/latest/endpoints/).
- [Read more about the Marathon REST API]( https://mesosphere.github.io/marathon/docs/rest-api.html).
