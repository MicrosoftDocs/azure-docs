<properties
   pageTitle="ACS container management with the REST API | Microsoft Azure"
   description="Deploy containers to an Azure Container Service Mesos cluster, using the Marathon REST API."
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
   
# Container management with the REST API

Mesos provides an environment for deploying and scaling clustered workload while abstracting the underlying hardware. On top of Mesos, frameworks manage scheduling and executing compute workload. While frameworks are available for many popular workloads, this document will detail creating and scaling container deployments with Marathon.

Before working through these examples, you will need a Mesos cluster configured in ACS and have remote connectivity to this cluster. For more information on these items, see the following articles.

- [Deploying an Azure Container Service Cluster](./container-service-deployment.md) 
- [Connecting to an ACS Cluster](./container-service-connect.md)


Once connected to the ACS cluster, the Mesos and related REST APIs can be accessed through http://localhost:local-port. The examples in this document assume that you are tunneling on port 80. For example, the Marathon endpoint can be reached at `http://localhost/marathon/v2/`.  For more information on the various APIs, see the Mesosphere documentation for the [Marathon
API](https://mesosphere.github.io/marathon/docs/rest-api.html) and the
[Chronos API](https://mesos.github.io/chronos/docs/api.html), and the
Apache documentation for the [Mesos Scheduler
API](http://mesos.apache.org/documentation/latest/scheduler-http-api/)

## Gather information from Mesos and Marathon

Before deploying containers to the Mesos cluster, gather some
information about the Mesos cluster such as the names and current
status of the Mesos agents. To do so, query the `master/slaves`
endpoint of the Mesos REST API. If everything goes well, you will see
a list of Mesos agents and several properties for each.

```bash
curl http://localhost/mesos/master/slaves
```

Now, use the Marathon `/apps` endpoint to check for current application deployments to the Mesos cluster. If this is a new cluster, you will see an empty array for apps.

```
curl localhost/marathon/v2/apps

{"apps":[]}
```

## Deploying a Docker Formated Container

Docker formatted containers are deployed through Marathon using a json
file that describes the intended deployment. The following sample will
deploy the nginx container, binding port 80 of the Mesos agent to port
80 of the container.

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

In order to deploy a Docker formatted container, create your own json file, or use the sample provided here - [Azure ACS Demo](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json), and store it in an accessible location. Next, run the following command, specifying the name of the json file, to deploy the container.

```
curl -X POST http://localhost/marathon/v2/groups -d @marathon.json -H "Content-type: application/json"
```

The output will be similar to the following:

```json
{"version":"2015-11-20T18:59:00.494Z","deploymentId":"b12f8a73-f56a-4eb1-9375-4ac026d6cdec"}
```

Now, if you query Marathon for applications, this new application will show in the output.

```
curl localhost/marathon/v2/apps
```

## Scale Your Containers

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text, and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://localhost/marathon/v2/apps/ and then the ID of the application to scale. If using the nginx sample provided here, the URI would be http://localhost/v2/nginx.

```json
curl http://localhost/marathon/v2/apps/nginx -H "Content-type: application/json" -X PUT -d @scale.json
```

Finally, query the Marathon endpoint for applications, you will notice that there are now three of the nginx container.

```
curl localhost/marathon/v2/apps
```

## Marathon REST API interaction with PowerShell

These same action can be performed using PowerShell on a Windows system. This quick exercise will complete similar tasks as the last exercise, this time using PowerShell commands.

To gather information about the Mesos cluster such as agent names and agent status run the following command. 

```powershell
Invoke-WebRequest -Uri http://localhost/mesos/master/slaves
```

Docker format containers are deployed through Marathon using a json file that describes the intended deployment. The following sample will deploy the nginx container, binding port 80 of the Mesos agent to port 80 of the container.

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

Create your own json file, or use the sample provided here - [Azure ACS Demo](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json), and store it in an accessible location. Next, run the following command, specifying the name of the json file, to deploy the container.

```powershell
Invoke-WebRequest -Method Post -Uri http://localhost/marathon/v2/apps -ContentType application/json -InFile 'c:\marathon.json'
```

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://loclahost/marathon/v2/apps/ and then the ID of the application to scale. If using the nginx sample provided here, the URI would be http://localhost/v2/nginx.

```powershell
Invoke-WebRequest -Method Put -Uri http://localhost/marathon/v2/apps/nginx -ContentType application/json -InFile 'c:\scale.json'
```



