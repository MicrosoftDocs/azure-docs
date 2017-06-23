---
title: Azure Container Service tutorial - Update Application | Microsoft Docs
description: Azure Container Service tutorial - Update Application
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/21/2017
ms.author: nepeters
---

# Update an application in Kubernetes

Once an application has been deployed in a Kubernetes, it can be updated by specifying a new container image or image version. When updating an application, the update rollout is staged such that only a portion of the deployment is concurrently updated. This staged update allows the application to stay running during the update, and provides a rollback mechanism if a deployment failure occurs. 

In this tutorial, the sample Azure Vote app is updated. Tasks completed include:

> [!div class="checklist"]
> * Updating the front-end application code
> * Creating an updated container image
> * Pushing the container image to ACR
> * Deploying updated application

## Before you begin

In previous tutorials, an application was packaged into container images, these images uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster. If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images](./container-service-tutorial-kubernetes-prepare-app.md). 

At minimum, this tutorial requires a Kubernetes cluster with a running application.

## Update application

To complete the steps in this tutorial, you must have cloned a copy of the Azure Vote application. If needed, do so with the following command:

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

Open the `config_file.cfg` file with any code or text editor. This file is found under the following directory of the cloned repo.

```bash
 /azure-voting-app/azure-vote/azure-vote/config_file.cfg
```

Change the values for `VOTE1VALUE` and `VOTE2VALUE`, and save the file.

```bash
# UI Configurations
TITLE = 'Azure Voting App'
VOTE1VALUE = 'Half Full'
VOTE2VALUE = 'Half Empty'
SHOWHOST = 'false'
```

Use `docker-compose` to re-create the front-end image and run the application.

```bash
docker-compose up --build -d
```

## Test application

Browse to `http://localhost:8080` to see the updated application. The application takes a few seconds to initialize. If an error is encountered, try again.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app-updated.png)

## Tag and push images

Tag the *azure-vote-front* image with the loginServer of the container registry.

If using ACR, get the login server name with the [az acr list](/cli/azure/acr#list) command.

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to tag the image, making sure to update the command with your ACR login server or public registry hostname.

```bash
docker tag azure-vote-front <acrLoginServer>/azure-vote-front:v2
```

Push the image to your registry. Replace `<acrLoginServer>` with your ACR login server name or public registry hostname.

```bash
docker push <acrLoginServer>/azure-vote-front:v2
```

## Deploy updated application

### Verify multiple replicas

To ensure maximum uptime, multiple instances of the application pod must be running. Verify this configuration with the [kubectl get pod](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#get) command.

```bash
kubectl get pod
```

If needed, scale the front-end deployment so that multiple instances are running.

```bash
kubectl scale --replicas=3 deployment/azure-vote-front
```

In a state where the front-end deployment has been scaled to three, the pods should look like the following.

```bash
kubectl get pod
```

Output:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-217588096-5w632    1/1       Running   0          10m
azure-vote-front-233282510-b5pkz   1/1       Running   0          10m
azure-vote-front-233282510-dhrtr   1/1       Running   0          10m
azure-vote-front-233282510-pqbfk   1/1       Running   0          10m
```

### Update application

To update the application, run the following command. Update `<acrLoginServer>` with the login server or host name of your container registry.

```bash
kubectl set image deployment azure-vote-front azure-vote-front=<acrLoginServer>/azure-vote-front:v2 --record
```

To monitor the deployment, run the following command:

```bash
kubectl get pod
```

Output:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2978095810-gq9g0   1/1       Running   0          5m
azure-vote-front-1297194256-tpjlg   1/1       Running   0         1m
azure-vote-front-1297194256-tptnx   1/1       Running   0         5m
azure-vote-front-1297194256-zktw9   1/1       Terminating   0         1m
```

Get the external IP address of the service.

```bash
kubectl get service
```

Browse to the IP address to see the updated application.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app-updated-external.png)

## Next steps

In this tutorial, an application was updated and this update rolled out to a Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Updating the front-end application code
> * Creating an updated container image
> * Pushing the container image to ACR
> * Deploying updated application
Advance to the next tutorial to learn about monitoring Kubernetes with Operations Management Suite.

> [!div class="nextstepaction"]
> [Monitor Kubernetes with OMS](./container-service-tutorial-kubernetes-monitor.md)