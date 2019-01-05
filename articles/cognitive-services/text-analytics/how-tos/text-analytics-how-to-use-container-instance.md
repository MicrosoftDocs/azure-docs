---
title: Run Container Instances
titleSuffix: Text Analytics -  Azure Cognitive Services
description: The following procedure demonstrates how to deploy the language detection container, with a running sample, to the Azure Kubernetes service, and test it in a web browser. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 01/03/2019
ms.author: diberry
---

# Deploy the Language detection container to Azure Kubernetes service

The following procedure demonstrates how to deploy the language detection container, with a running sample, to the Azure Kubernetes service, and test it in a web browser. 

## Prerequisites

This procedure requires several tools that must be installed and run locally. Do not use Azure Cloud shell. 

1. Have a valid Azure subscription. The trial and pay-as-you-go subscriptions will both work. 
1. Install [Git](https://git-scm.com/downloads) for your operating system so you can clone the sample used in this procedure. 
1. Install [Azure cli](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) or use integrated Azure Cloud shell's **Try it** feature next to each code snippet. 
1. Install [Docker engine](https://www.docker.com/products/docker-engine) and validate that the docker cli works in a terminal.
1. Install [kubectl](https://storage.googleapis.com/kubernetes-release/release/v1.13.1/bin/windows/amd64/kubectl.exe). 


## Running the sample 

This procedure loads and runs the Cognitive Services Container sample for language detection. 

* The sample has two container images, one for the website with its own API. This website is equivalent to your own client-side application that makes requests of the language detection endpoint. The second image is the language detection image returning the detected language of text. 
* Both these images need to be pushed to your own Azure Container Registry.
* Once they are on your own Azure Container Registry, create an Azure Kubernetes service to access these images and run the containers.
* Once the containers are running, use the kubectl cli to watch the containers performance.
* Access the website (client-application) with an HTTP request and see the results. 


## Set up the Azure cli 

If you have access to more than one subscription, make sure to set the correct subscription as the default before creating your resources.

1. Login to Azure.

    ```azurecli
    az login
    ```

1. Get list of subscriptions

    ```azurecli
    az account list -o table
    ```

1. Set Azure subscription default

    ```azurecli
    az account set --subscription <name or id>
    ```

## Create Azure Container Registry service

In order to deploy the container to the Azure Kubernetes service, the container images need to be accessible. Create your own Azure Container Registry service to host the images. 

1. Create a resource group named `cogserv-container-rg` to hold every created in this procedure.

    ```azurecli
    az group create --name cogserv-container-rg --location westus
    ```

    The result looks like: 

    ```json
    {
      "id": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourceGroups/cogserv-container-rg",
      "location": "westus",
      "managedBy": null,
      "name": "cogserv-container-rg",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ```

1. Create your own Azure Container Registry named `cogservcontainerregistry`. Prepend your login, such as `pattio`, so the name is unique such as `pattiocogservcontainerregistry`. Do not use dashes or underline characters in the name.

    ```azurecli
    az acr create --resource-group cogserv-container-rg --name pattiocogservcontainerregistry --sku Basic
    ```

    Save the results to get the **loginServer** property:

    ```json
    {
        "adminUserEnabled": false,
        "creationDate": "2019-01-02T23:49:53.783549+00:00",
        "id": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/pattiocogservcontainerregistry",
        "location": "westus",
        "loginServer": "pattiocogservcontainerregistry.azurecr.io",
        "name": "pattiocogservcontainerregistry",
        "provisioningState": "Succeeded",
        "resourceGroup": "cogserv-container-rg",
        "sku": {
            "name": "Basic",
            "tier": "Basic"
        },
        "status": null,
        "storageAccount": null,
        "tags": {},
        "type": "Microsoft.ContainerRegistry/registries"
    }
    ```

1. Login to your Container Registry. You need to login before you can push images to it.

    ```azurecli
    az acr login --name pattiocogservcontainerregistry
    ```

## Get website docker image 

1. The sample code for the language detection container is in the Cognitive Services container repository. Clone the repository to have a local copy of the sample.

    ```console
    git clone https://github.com/Azure-Samples/cognitive-services-containers-samples
    ```

    Once the repository is on your local computer, find the website in the [\dotnet\Language\FrontendService](https://github.com/Azure-Samples/cognitive-services-containers-samples/tree/master/dotnet/Language/FrontendService) directory. There is also a python version if you are comfortable with that language instead. This website acts as the client application calling the language detection API hosted in the language detection container.  

1. Build the docker image for this website. Make sure the console is in the \FrontendService directory where the Dockerfile is located when you run the following command:

    ```console
    docker build -t language-frontend  .
    ```

1. Verify the image is in the images list on your local machine:

    ```console
    docker images
    ```

    The response includes the new image:

    ```console
    PS C:\Users\pattio\repos\cognitive-services-containers-samples\dotnet\Language\FrontendService> docker images
    REPOSITORY                      TAG                      IMAGE ID            CREATED             SIZE
    language-frontend                latest                   0faab2f01682        1 minute ago        1.85GB
    ```

1. Tag image with your Azure Container registry. The format of the command is:

    `docker tag <local-repository-value>:<local-repository-tag> <your-container-registry>/<repository>:<tag>`

    Locally your image probably has the tag of latest. In order to track the version on the Container Registry, change the tag to a version format. For this simple example, use `v1`. 

    ```console
    docker tag language-frontend:latest pattiocogservcontainerregistry.azurecr.io/language-frontend:v1
    ```

1. Push the image to the Azure Container registry. 

    ```console
    docker push pattiocogservcontainerregistry.azurecr.io/language-frontend:v1
    ```

1. Verify the image is in your Container registry. On the Azure portal, on your Container registry, verify the repositories list has this new repository named **language-frontend**. 

1. Select the **language-frontend** repository, verify that the only tag in the list is **v1**.

    The first image is in your Azure Container Registry. 

    ![Verify frontend repository and tag](../media/how-tos/container-instance-sample/view-frontend-container-repository-and-tag.png)

## Get language detection docker image 

1. Pull the latest version of the docker image to the local machine. 

    ```console
    docker pull mcr.microsoft.com/azure-cognitive-services/language:1.1.006770001-amd64-preview
    ```

1. Verify the image is in the images list on your local machine:

    ```console
    docker images
    ```

    The response includes the new image:

    ```console
    PS C:\Users\pattio\repos\cognitive-services-containers-samples\dotnet\Language\FrontendService> docker images
    REPOSITORY                                               TAG                      IMAGE ID            CREATED             SIZE
    mcr.microsoft.com/azure-cognitive-services/language      latest                   aaaab2f01682        1 minute ago        843MB
    ```

1. Tag image with your Azure Container registry. Find the latest version and replace the version `1.1.006770001-amd64-preview` if you have a more recent version. 

    ```console
    docker tag mcr.microsoft.com/azure-cognitive-services/language pattiocogservcontainerregistry.azurecr.io/language:1.1.006770001-amd64-preview
    ```

    No results are returned.

1. Push the image to the Azure Container registry. 

    ```console
    docker push pattiocogservcontainerregistry.azurecr.io/language:1.1.006770001-amd64-preview
    ```

1. Verify the image is in your Container registry. On the Azure portal, on your Container registry, verify the repositories list has this new repository named **azure-cognitive-services**. 

1. Select the **azure-cognitive-services** repository, verify that the only tag in the list is **1.1.006770001-amd64-preview**.

    ![Verify the tag is in the repository](../media/how-tos/container-instance-sample/view-cognitiver-service-container-repository-and-tag.png)

    The second image is in your Azure Container Registry. 


## Get Container Registry credentials

The following steps are needed to get the required information to connect your Container Registry with the Kubernetes service you will create later in this procedure.

1. Create service principal.

    ```azurecli
    az ad sp create-for-rbac --skip-assignment
    ```

    Save the appId value for the assignee parameter in step 3, `<appId>`. Save the password for the next section's client-secret parameter `<client-secret>`.

    ```json
    {
      "appId": "55962827-4bd0-41c3-aa91-d8cc383a1025",
      "displayName": "azure-cli-2018-12-31-18-39-32",
      "name": "http://azure-cli-2018-12-31-18-39-32",
      "password": "ba839221-f513-4e86-b952-5a8fcdb9610c",
      "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47"
    }
    ```

1. Get Container Registry id.

    ```azurecli
    az acr show --resource-group cogserv-container-rg --name pattiowenscogservcontainerregistry --query "id" --o table
    ```

    Save the output for the scope parameter value, `<acrId>`, in the next step. It looks like:

    ```text
    /subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/pattiocogservcontainerregistry
    ```

    Save the full value for step 3 in this section. 

1. To grant the correct access for the AKS cluster to use images stored in your Container Registry, create a role assignment. Replace <appId> and <acrId> with the values gathered in the previous two steps.

    ```azurecli-interactive
    az role assignment create --assignee <appId> --scope <acrId> --role Reader
    ```

    The result includes the full JSON of the role assignment.

    ```JSON
    {
      "canDelegate": null,
      "id": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/diberrycontainerregistry001/providers/Microsoft.Authorization/roleAssignments/d85b34d4-b46e-4239-8eab-a10d7bdb95b0",
      "name": "d85b34d4-b46e-4239-8eab-a10d7bdb95b0",
      "principalId": "b183584b-cec4-4307-8dbc-3fa833b3e394",
      "resourceGroup": "cogserv-container-rg",
      "roleDefinitionId": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
      "scope": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourceGroups/cogserv-container-rg/providers/Microsoft.ContainerRegistry/registries/diberrycontainerregistry001",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

## Create Azure Kubernetes service

1. Create service. All the parameter values are from previous sections except the name parameter. Choose a name that indicates who created and its purpose, such as `pattio-kubernetes-languagedetection`. The container sample originally called for 2 nodes but this procedure will show 1 frontend website load-balanced across two containers for language detection. That makes a total of 3 nodes, shown in the node-count parameter. 

    ```azurecli
    az aks create --resource-group cogserv-container-rg --name pattio-kubernetes-languagedetection --node-count 3  --service-principal <appId>  --client-secret <client-secret>  --generate-ssh-keys
    ```

    This step may take a few minutes. The result is: 

    ```json
    {
      "aadProfile": null,
      "addonProfiles": null,
      "agentPoolProfiles": [
        {
          "count": 3,
          "dnsPrefix": null,
          "fqdn": null,
          "maxPods": 110,
          "name": "nodepool1",
          "osDiskSizeGb": 30,
          "osType": "Linux",
          "ports": null,
          "storageProfile": "ManagedDisks",
          "vmSize": "Standard_DS1_v2",
          "vnetSubnetId": null
        }
      ],
      "dnsPrefix": "pattio-ku-cogserv--65a101",
      "enableRbac": true,
      "fqdn": "pattio-ku-cogserv--65a101-341f1f54.hcp.westus.azmk8s.io",
      "id": "/subscriptions/333d9379-a62c-4b5d-84ab-52f2b0fc40ac/resourcegroups/cogserv-container-rg/providers/Microsoft.ContainerService/managedClusters/pattio-kubernetes-languagedetection",
      "kubernetesVersion": "1.9.11",
      "linuxProfile": {
        "adminUsername": "azureuser",
        "ssh": {
          "publicKeys": [
            {
              "keyData": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyXd/YyBKx50GNV5WKxqehxR7qrihRjITjKyAvMqOT5IPxlPssJdVQAFgdYOaJnavJke1BbgR1lXZ49pgDSMeasdIWIQa6qW/15sG/G1/1pHBR0krzQTQtvDfLlablgGUbKVYOlVGtEq2jRsmKsNJWLxvohR2d81mFCAAAAB3NzaC1yc2EAAAADAQABAAABAQCyXd/YyBKx50GNV5WKxqehxR7qrihRjITjKyAvMqOT5IPxlPssJdVQAFgdYOaJnavJke1BbgR1lXZ49pgDSMeasdIWIQa6qW/15sG/G1/1pHBR0krzQTQtvDfLlablgGUbKVYOlVGtEq2jRsmKsNJWLxvohR2d81mFC
            }
          ]
        }
      },
      "location": "westus",
      "name": "pattio-kubernetes-languagedetection",
      "networkProfile": {
        "dnsServiceIp": "10.0.0.10",
        "dockerBridgeCidr": "172.17.0.1/16",
        "networkPlugin": "kubenet",
        "networkPolicy": null,
        "podCidr": "10.244.0.0/16",
        "serviceCidr": "10.0.0.0/16"
      },
      "nodeResourceGroup": "MC_pattio-cogserv-container-rg_pattio-kubernetes-languagedetection_westus",
      "provisioningState": "Succeeded",
      "resourceGroup": "cogserv-container-rg",
      "servicePrincipalProfile": {
        "clientId": "7778a1cc-8fbb-4daf-800f-2320c2fc6ae1",
        "keyVaultSecretRef": null,
        "secret": null
      },
      "tags": null,
      "type": "Microsoft.ContainerService/ManagedClusters"
    }
    ```

    The service is created but it doesn't have the website container or language detection container yet. When the containers are eventually up and running, later in the procedure, you access the frontend website using the `fqdn` property. 

1. Get credentials of Kubernetes service. 

    ```azurecli
    az aks get-credentials --resource-group cogserv-container-rg --name pattio-kubernetes-languagedetection
    ```

## Load the orchestration definition into the Kubernetes service

This section uses the kubectl cli to talk with the Azure Kubernetes service. 

1. Before loading the orchestration definition, check the kubectl has access to the nodes.

    ```console
    kubectl get nodes
    ```

    The response looks like:

    ```console
    NAME                       STATUS    ROLES     AGE       VERSION
    aks-nodepool1-13756812-0   Ready     agent     11m       v1.9.11
    aks-nodepool1-13756812-1   Ready     agent     11m       v1.9.11
    aks-nodepool1-13756812-2   Ready     agent     11m       v1.9.11
    ```

1. Modify the `language.yml` orchestration definition file found in the Cognitive Samples Repository folder downloaded in a [previous section](#get-website-docker-image). It is located in the subdirectory `\Kubernetes\language\`. The file has a `service` section and a `deployment` section for the two container types, the `language-frontend` website and the `language` detection container. The language detection deployment section specifies 1 replica. Change this to 

    |Change|Purpose|Value example|
    |--|--|
    |Line 32, `image` property|Image location for the frontend image in your Container Registry|<container-registry-name>.azurecr.io/language:latest|
    |Line 44, `name` property|Container Registry secret for the image, referred to as `<client-secret>` in a previous section.|GUID|
    |Line 78, `image` property|Image location for the language image in your Container Registry||
    |Line 95, `name` property|Container Registry secret for the image, referred to as `<client-secret>` in a previous section.|GUID|
    |Line 91, `apiKey` property|Your text analytics resource key|GUID|
    |Line 92, `billing` property|The billing endpoint for your text analytics resource.|`https://westus.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |Line 70, `replicas` property|Change the value from 1 to 2 so that the website can request across two load-balanced containers.|2|

    Because the apiKey and billing endpoint are set as part of the Kubernetes orchestration definition, the website container doesn't need to know about these or pass them as part of the request. 


    The altered `language.yml` file  is:

    ```console
    # A service which exposes the .net frontend app container through a dependable hostname: http://language-frontend:5000
    apiVersion: v1
    kind: Service
    metadata:
      name: language-frontend
      labels:
        run: language-frontend
    spec:
      selector:
        app: language-frontend
      type: LoadBalancer
      ports:
      - name: front
        port: 80
        targetPort: 80
        protocol: TCP
    ---
    # A deployment declaratively indicating how many instances of the .net frontend app container we want up
    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: language-frontend
    spec:
      replicas: 1
      template:
        metadata:
          labels:
            app: language-frontend
        spec:
          containers:
          - name: language-frontend
            image: diberrycogservcontainerregistry.azurecr.io/ta-lang-frontend:v1
            ports:
            - name: public-port
              containerPort: 80
            livenessProbe:
              httpGet:
                path: /status
                port: public-port
              initialDelaySeconds: 30
              timeoutSeconds: 1
              periodSeconds: 10
          imagePullSecrets:
            - name: <client-password>
          automountServiceAccountToken: false
    ---
    # A service which exposes the cognitive-service containers through a dependable hostname: http://language:5000
    apiVersion: v1
    kind: Service
    metadata:
      name: language
      labels:
        run: language
    spec:
      selector:
        app: language
      type: LoadBalancer
      ports:
      - name: face
        port: 5000
        targetPort: 5000
        protocol: TCP
    ---
    # A deployment declaratively indicating how many instances of the cognitive-service container we want up
    apiVersion: apps/v1beta1
    kind: Deployment
    metadata:
      name: language
    spec:
      replicas: 1
      template:
        metadata:
          labels:
            app: language
        spec:
          containers:
          - name: language
            image: diberrycogservcontainerregistry.azurecr.io/azure-cognitive-services/language
            ports:
            - name: public-port
              containerPort: 5000
            livenessProbe:
              httpGet:
                path: /status
                port: public-port
              initialDelaySeconds: 30
              timeoutSeconds: 1
              periodSeconds: 10
            args:
                - "eula=accept"
                - "apikey=<apiKey>" 
                - "billing=https://westus.api.cognitive.microsoft.com/text/analytics/v2.0" 
                - "Logging:Console:LogLevel:Default=Debug"
    
          imagePullSecrets:
            - name: <client-password>
    
          automountServiceAccountToken: false
    ```

1. Load the orchestration definition file for this sample. Make sure the console is in the Cognitive Samples Repository folder downloaded in a [previous section](#get-website-docker-image), in the subdirectory `\Kubernetes\language\`, where the `language.yml` file is located. 

    ```console
    kubectl apply -f language.yml
    ```

    The response is:

    ```console
    deployment "azure-vote-back" created
    service "azure-vote-back" created
    deployment "azure-vote-front" created
    service "azure-vote-front" created
    ```

## Test the application

1. For the frontend web application, verify the service is running and get the external IP address.

```console
kubectl get service <name-from-language.yml> --watch
```

Response is: 

```console
NAME       TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
language   LoadBalancer   10.0.196.26   168.62.220.174   5000:31834/TCP   22m
```

_Initially_ the EXTERNAL-IP for the service is shown as pending. Wait until the IP address is show before testing the service in the browser. 

1. For the language detection container, verify the service is running and get the external IP address.

```console
kubectl get service <name-from-language.yml> --watch
```

Response is: 

```console
NAME       TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
language   LoadBalancer   10.0.196.26   168.62.220.174   5000:31834/TCP   22m
```

_Initially_ the EXTERNAL-IP for the service is shown as pending. Wait until the IP address is show before testing the service in the browser. 

1. To see the web frontend app in action, open a web browser to the external IP address of your service.

<!--
### Configure basic settings

container name: sentiment-{username}
container image type: public
container image: mcr.microsoft.com/azure-cognitive-services/sentiment
Subscription: {your subscription}
Resource group: {your resource group}
Location: West US

### Specify container requirements

OS type: Linux
Number of cores: 1
Memory (GB): 2
Networking, Public IP address: yes
DNS name label: sentiment-{username}
Port: 5000
Open additional ports: No
Port protocol: TCP
Advanced, restart policy: Always
Environment variable: "Eula":"accept"
Add Additional environment variables: Yes
Environment variable: "Billing"="{Billing Endpoint URI}"
Environment variable: "ApiKey"="{Billing Key}"

![](../media/how-tos/container-instance/setting-container-environment-variables.png)
![](../media/how-tos/container-instance/container-instance-overview.png)
![](../media/how-tos/container-instance/running-instance-container-log.png)
![](../media/how-tos/container-instance/swagger-docs-on-container.png)

-->
