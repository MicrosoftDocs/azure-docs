---
title: Jenkins Integration with Azure Container Service and Kubernetes | Microsoft Docs
description: How to automate a CI/CD process with Jenkins to deploy and upgrade a containerized app on ACS Kubernetes
services: container-service
documentationcenter: ''
author: briar
manager: johny
editor: ''
tags: acs, azure-container-service, jenkins
keywords: Docker, Containers, Kubernetes, Azure, Jenkins

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/16/2017
ms.author: briar

---

# Jenkins Integration with Azure Container Service and Kubernetes 
In this tutorial, we will walk through the process to setup continuous integration of a multi-container application into Azure Container Service Kubernetes using the Jenkins platform. The workflow will update the container image in Docker Hub and upgrade the Kubernetes pods using a deployment rollout. 

## High Level Process
The basic steps that will be detailed in this article are: 
- Install an ACS Kubernetes cluster
- Setup Jenkins and configure access to ACS
- Create a Jenkins workflow
- Test the CI/CD process end to end

## Install an ACS Kubernetes cluster
    
Deploy the ACS Kubernetes cluster using the steps below. Full documentation is located [here](https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough)

* Step 1: Create a RG
    ```console
    RESOURCE_GROUP=my-resource-group
    LOCATION=westus
    az group create --name=$RESOURCE_GROUP --location=$LOCATION
    ```

* Step 2: Deploy the cluster
    > The below steps require a local SSH key being created and stored in ~/.ssh

    ```console
    DNS_PREFIX=some-unique-value
    CLUSTER_NAME=any-acs-cluster-name
    az acs create --orchestrator-type=kubernetes --resource-group $RESOURCE_GROUP --name=$CLUSTER_NAME --dns-prefix=$DNS_PREFIX --ssh-key-value ~/.ssh/id_rsa.pub --admin-username=azureuser --master-count=1 --agent-count=5 --agent-vm-size=Standard_D1_v2
    ```

## Setup Jenkins and configure access to ACS

* Step 1: Install Jenkins
    - Create an Azure VM with Ubuntu 16.04 LTS 
    - Install Jenkins via these [instructions.](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)
    - More detailed tutorial here: [https://www.howtoforge.com/tutorial/how-to-install-jenkins-with-apache-on-ubuntu-16-04](https://www.howtoforge.com/tutorial/how-to-install-jenkins-with-apache-on-ubuntu-16-04)
    - Update the Azure network security group to allow port 8080 and then browse the public IP at port 8080 to manage Jenkins in your browser.
    - Intial Jenkins admin password is stored at /var/lib/jenkins/secrets/initialAdminPassword
    - Install Docker on Jenkins machine via these [instructions](https://docs.docker.com/cs-engine/1.13/#install-on-ubuntu-1404-lts-or-1604-lts). This allows for docker commands to be run in Jenkins jobs
    - Configure docker permissions to allow Jenkins to access endpoint

        ```
        sudo chmod 777 /run/docker.sock
        ```
    - Install kubectl CLI on Jenkins. Instructions: [https://kubernetes.io/docs/user-guide/prereqs](https://kubernetes.io/docs/user-guide/prereqs)

        ```
        curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
        chmod +x ./kubectl
        sudo mv ./kubectl /usr/local/bin/kubectl
        ```

* Step 2: Setup access to ACS Kubernetes cluster

    > NOTE: There are multiple approaches to accomplishing the below steps. Use the approach that is easiest for you.

    - Copy kube config to Jenkins machine

        ```
        export KUBE_MASTER=<your_cluster_master_fqdn>
        
        sudo scp -3 -i ~/.ssh/id_rsa azureuser@$KUBE_MASTER:.kube/config user@<your_jenkins_server>:~/.kube/config
        
        sudo ssh user@<your_jenkins_server> sudo chmod 777 /home/user/.kube/config

        sudo ssh -i ~/.ssh/id_rsa user@<your_jenkins_server> sudo chmod 777 /home/user/.kube/config
        
        sudo ssh -i ~/.ssh/id_rsa user@<your_jenkins_server> sudo cp /home/user/.kube/config /var/lib/jenkins/config
        ```
        
    - Validate from Jenkins that Kubernetes cluster is accessible
    

## Create a Jenkins workflow

* Prerequisites

    - Github account for code repo
    - Docker Hub account to store and update images
    - Containerized application that can be rebuilt and updated. 
    - Can use this sample container app written in Golang: https://github.com/chzbrgr71/go-web 

    > Note: The steps below must be performed in your own Github account. Feel free to clone the above repo, but you must use your own account to configure the webhooks and Jenkins access.

* Step 1: Deploy inital v1 of application
    - Build app from developer machine. Replace "myrepo" below with your own.
    
        ```
        git clone https://github.com/chzbrgr71/go-web.git
        cd go-web
        docker build -t myrepo/go-web .
        ```

    - Push image to Docker Hub

        ```
        docker login
        docker push myrepo/go-web
        ```

    - Deploy to Kubernetes cluster
    
        > Edit go-web.yaml file to update your container image and repo
        
        ```
        kubectl create -f ./go-web.yaml --record
        ```
* Step 2: Configure Jenkins System
    - Click on "Manage Jenkins" and "Configure System"
    - Under Github, select Add Github Server
    - Leave API URL as default
    - Under credentials, add a Jenkins credential using "Secret text"
    - Recommend using Github "Personal access tokens" which are configured in your Github user account settings. More details on this [here.](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
    - Click "Test connection" to ensure this is configured correctly
    - Under "Global Properties" add an environment variable "DOCKER_HUB" and provide your Docker Hub password. Note: This is useful in this demo, but a production scenario would require a more secure approach.
    - Save.

* Step 3: Create the Jenkins Workflow
    - Create a new Jenkins item
    - Provide a name (eg - "go-web") and select "Freestyle Project" 
    - Check Github project and provide the URL to your Github repo
    - In 'Source Code Management' provide the Github repo URL and credentials. 
    - Add a Build Step of type "Execute shell" and use the below text:

        ```
        WEB_IMAGE_NAME="myrepo/go-web:kube${BUILD_NUMBER}"
        docker build -t $WEB_IMAGE_NAME .
        docker login -u <your-dockerhub-username> -p ${DOCKER_HUB}
        docker push $WEB_IMAGE_NAME
        ```

    - Add another Build Step of type "Execute shell" and use the below text:

        ```
        WEB_IMAGE_NAME="myrepo/go-web:kube${BUILD_NUMBER}"
        kubectl set image deployment/go-web go-web=$WEB_IMAGE_NAME --kubeconfig /var/lib/jenkins/config
        ```
    
    - Save Jenkins item and test with "Build Now"

* Step 4: Connect Github Webhook
    - In Jenkins item created above, click "Configure"
    - Under "Build Triggers," select "GitHub hook trigger for GITScm polling" and Save. This will automatically configure the Github webhook.
    - In your Github repo for go-web, click Settings and then Webhooks
    - Verify the Jenkins webhook URL was added successfully. URL should end in "github-webhook"

## Test the CI/CD process end to end

1. Update code for the repo and push/synch with the Github repository
2. From the Jenkins console, check the "Build History" and validate job has run. Can view console output to see details.
3. From Kubernetes, view details of upgraded deployment:

```
kubectl rollout history deployment/go-web
```
