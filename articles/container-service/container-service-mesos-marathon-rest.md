<properties
   pageTitle=""
   description=""
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="nepeters"
   editor=""
   tags="acs, azure-container-service"
   keywords="Docker, Containers, Micro-services, Mesos, Azure"/>
   
<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="home-page"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/02/2015"
   ms.author="rogardle"/>
   
# Application Management through the REST API

Mesos provides an environment for deploying and scaling clustered workload while abstracting the underlying hardware. On top of Mesos, a framework manages scheduling and executing compute workload. While frameworks are available for many popular workloads, this document will detail creating and scaling container deployments with Marathon.
Before working through these examples, you will need a Mesos cluster configured in ACS and have remote connectivity to this cluster. For more information in these items see the following articles.

- [Deploying an Azure Container Service Cluster](./contianer-service-deployment.md) 
- [Connecting to an ACS Cluster](./container-service-connect.md)

<TODO> Add Info about Mesos and Marthon API and include links.


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

Docker containers are deployed through Marathon using a json file that describes the intended deployment. The following sample will deploy the Docker hello world container, binding port 80 of the Mesos agent to port 80 of the container.
```json
{
  "id": "helloworld",
  "cpus": 0.1,
  "mem": 16.0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "hello-world",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "hostPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

In order to deploy a Docker container, create your own json file or use the sample provided here - <insert Ross sample>, and store it in an accessible location. When ready run the following command to deploy the container.


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

<insert output>
```

## Scaling a Docker Container

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://loclahost:8080/v2/apps/ and then the ID of the application to scale. If using the hello world sample provided here, the URI would be http://localhost:8080/v2/helloworld.

```json
curl http://localhost:8080/v2/apps/helloworld -H "Content-type: application/json" -X PUT -d @scale.json
```

Finally, query the Marathon endpoint for application instance. You will notice that there are now three.

```
curl localhost:8080/v2/apps
```

## Marathon REST API PowerShell

Just like the Mesos and Marathon endpoints can be initiated using curl, we can also perform the same actions on a Windows system using PowerShell. This quick exercise will complete similar tasks as the last exercise, this time using PowerShell commands.

To gather information about the Mesos cluster such as agent names and agent status run the following command. 

```powershell
Invoke-WebRequest -Uri http://localhost:5050/master/slaves
```

Docker containers are deployed through Marathon using a json file that describes the intended deployment. The following sample will deploy the Docker hello world container, binding port 80 of the Mesos agent to port 80 of the container.

```json
{
  "id": "helloworld",
  "cpus": 0.1,
  "mem": 16.0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "hello-world",
      "network": "BRIDGE",
      "portMappings": [
        { "containerPort": 80, "hostPort": 80, "servicePort": 9000, "protocol": "tcp" }
      ]
    }
  }
}
```

Create your own json file or use the sample provided here - <insert Ross sample>, and store it in an accessible location. When ready run the following command to deploy the container.

```powershell
Invoke-WebRequest -Method Post -Uri http://localhost:8080/v2/apps -ContentType application/json -InFile 'c:\marathon.json'
```

The Marathon API can also be used to scale application deployments out or in. In the previous example one instance of an application was deployed, let's scale this out to three instances. To do so, create a json file with the following json text and store it in an accessible location.

```json
{ "instances": 3 }
```

Run the following command to scale the application out.

> Note – the URI will be http://loclahost:8080/v2/apps/ and then the ID of the application to scale. If using the hello world sample provided here, the URI would be http://localhost:8080/v2/helloworld.

```powershell
Invoke-WebRequest -Method Put -Uri http://localhost:8080/v2/apps/helloworld -ContentType application/json -InFile 'c:\scale.json'
```

