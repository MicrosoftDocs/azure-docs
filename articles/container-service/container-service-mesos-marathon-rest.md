<properties
   pageTitle=""
   description=""
   services="virtual-machines"
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

ACS exposes the Mesos and Marathon REST endpoints, but they are not open to the outside world. In order to use these endpoints you must first create an SSH tunnel through which calls will be made, see [Connecting to the ACS Cluster](./container-service-connect.md).

## Marathon REST API Bash

Once you have a tunnel open you can run commands on your local machine to interact with the Mesos and [Marathon API](https://mesosphere.github.io/marathon/docs/generated/api.html).

Query Mesos for agent status:

```bash
<insert code>
```

To query Marathon for application deployments, run the following. 

```
curl localhost:8080/v2/apps
```

Running this against a cluster with no deployments will return the following.

```json
{"apps":[]}
```

## Deploying a Docker Container

To deploy a Docker container using Marathon, you first need to create a `marathon.json` file. You can create your own or use this sample -[Azure Test Deploy](https://raw.githubusercontent.com/rgardler/AzureDevTestDeploy/master/marathon/marathon.json). Copy the .json file to your system and run:

```
curl -X POST <http://master0:8080/v2/groups> -d @marathon.json -H "Content-type: application/json"
```

The output will be similar the following:

```json
{"version":"2015-11-20T18:59:00.494Z","deploymentId":"b12f8a73-f56a-4eb1-9375-4ac026d6cdec"}
```

Now if you query Marathon for running application, this new application will show in the output.

```
curl localhost:8080/v2/apps
```

## Scaling a Docker Container

The Marathon API can also be used to scale application deployment out, and scale them back in. In the previous example one instance of an application was deployed. Let's scale this out to three instances. to do so, create a json file with the following json text.

```json
<insert json>
```

Run the following command to scale the application out.

```json
<insert json
```

Finally, query the Marathon endpoint for application instance. You will notice that there are now three.

```
curl localhost:8080/v2/apps
```

## Marathon REST API PowerShell