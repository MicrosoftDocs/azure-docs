<properties
   pageTitle="ACS container management with the REST API | Microsoft Azure"
   description="Deploy containers to an Azure Container Service cluster service using the Marathon REST API."
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
   ms.date="2/15/2016"
   ms.author="nepeters"/>
   
# Container management with the REST API

Mesos provides an environment for deploying and scaling clustered workload while abstracting the underlying hardware. On top of Mesos, frameworks manage scheduling and executing compute workload. While frameworks are available for many popular workloads, this document will detail creating and scaling container deployments with Marathon.
Before working through these examples, you will need a Mesos cluster configured in ACS and have remote connectivity to this cluster. For more information in these items see the following articles.

- [Deploying an Azure Container Service Cluster](./container-service-deployment.md) 
- [Connecting to an ACS Cluster](./container-service-connect.md)

Your Mesos cluster in ACS will be accessible through several endpoints depending on the desired request.
- Mesos – http://master:5050
- Marathon – http://master:8080

For more information on the Mesos REST endpoint see [Mesos Endpoint on mesos.apache.org](http://mesos.apache.org/documentation/latest/endpoints/).  
For more information on Marathon REST API see [Marathon REST API on mesosphere.github.io]( mesosphere.github.io).

## Gather information from Mesos and Marathon

Before deploying containers to the Mesos cluster, gather some information about the Mesos cluster such as the name and current status of the Mesos agents. To do so, query the `master/slaves` endpoint on a Mesos master. If everything goes well, you will see a list of Mesos agents and several properties for each.   

```bash
curl http://localhost:5050/master/slaves
```

Now, use the Marathon `/apps` endpoint to check for and current Marathon deployments to the Mesos cluster. If this is a new cluster, you will see an empty array for apps.

```
curl localhost:8080/v2/apps

{"apps":[]}
```

## Deploying a Docker Container

Docker containers are deployed through Marathon using a json file that describes the intended deployment. The following sample will deploy the nginx container, binding port 80 of the Mesos agent to port 80 of the container.
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

In order to deploy a Docker container, create your own json file, or use the sample provided here - [Azure ACS Demo](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json), and store it in an accessible location. Next, run the following command, specifying the name of the json file, to deploy the container.

```
curl -X POST http://localhost:8080/v2/groups -d @marathon.json -H "Content-type: application/json"
```

The output will be similar the following:

```json
{"version":"2015-11-20T18:59:00.494Z","deploymentId":"b12f8a73-f56a-4eb1-9375-4ac026d6cdec"}
```

Now if you query Marathon for running application, this new application will show in the output.

```
curl localhost:8080/v2/apps
```

## Scale a Docker Container

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text, and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://loclahost:8080/v2/apps/ and then the ID of the application to scale. If using the nginx sample provided here, the URI would be http://localhost:8080/v2/nginx.

```json
curl http://localhost:8080/v2/apps/nginx -H "Content-type: application/json" -X PUT -d @scale.json
```

Finally, query the Marathon endpoint for application instance. You will notice that there are now three.

```
curl localhost:8080/v2/apps
```

## Marathon REST API PowerShell

These same action can be performed using PowerShell on a Windows system. This quick exercise will complete similar tasks as the last exercise, this time using PowerShell commands.

To gather information about the Mesos cluster such as agent names and agent status run the following command. 

```powershell
Invoke-WebRequest -Uri http://localhost:5050/master/slaves
```

Docker containers are deployed through Marathon using a json file that describes the intended deployment. The following sample will deploy the nginx container, binding port 80 of the Mesos agent to port 80 of the container.

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
Invoke-WebRequest -Method Post -Uri http://localhost:8080/v2/apps -ContentType application/json -InFile 'c:\marathon.json'
```

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://loclahost:8080/v2/apps/ and then the ID of the application to scale. If using the nginx sample provided here, the URI would be http://localhost:8080/v2/nginx.

```powershell
Invoke-WebRequest -Method Put -Uri http://localhost:8080/v2/apps/nginx -ContentType application/json -InFile 'c:\scale.json'
```

