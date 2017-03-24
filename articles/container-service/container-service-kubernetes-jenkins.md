---
title: Jenkins CI/CD with Kubernetes in Azure Container Service | Microsoft Docs
description: How to automate a CI/CD process with Jenkins to deploy and upgrade a containerized app on Kubernetes in Azure Container Service
services: container-service
documentationcenter: ''
author: chzbrgr71
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
ms.date: 03/23/2017
ms.author: briar

---

# Jenkins integration with Azure Container Service and Kubernetes 
In this tutorial, we will walk through the process to set up continuous integration of a multi-container application into Azure Container Service Kubernetes using the Jenkins platform. The workflow updates the container image in Docker Hub and upgrades the Kubernetes pods using a deployment rollout. 

## High level process
The basic steps detailed in this article are: 
- Install a Kubernetes cluster in Container Service
- Set up Jenkins and configure access to Container Service
- Create a Jenkins workflow
- Test the CI/CD process end to end

## Install a Kubernetes cluster
    
Deploy the Kubernetes cluster in Azure Container Service using the following steps. Full documentation is located [here](container-service-kubernetes-walkthrough.md).

### Step 1: Create a resource group
```azurecli
RESOURCE_GROUP=my-resource-group
LOCATION=westus

az group create --name=$RESOURCE_GROUP --location=$LOCATION
```

### Step 2: Deploy the cluster
> **NOTE:** The following steps require a local SSH public key stored in the ~/.ssh folder.
>

```azurecli
DNS_PREFIX=some-unique-value
CLUSTER_NAME=any-acs-cluster-name

az acs create \
--orchestrator-type=kubernetes \
--resource-group $RESOURCE_GROUP \ 
--name=$CLUSTER_NAME \
--dns-prefix=$DNS_PREFIX \ 
--ssh-key-value ~/.ssh/id_rsa.pub \
--admin-username=azureuser \
--master-count=1 \
--agent-count=5 \
--agent-vm-size=Standard_D1_v2
```

## Set up Jenkins and configure access to Container Service

### Step 1: Install Jenkins
- Create an Azure VM with Ubuntu 16.04 LTS. 
- Install Jenkins via these [instructions](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu).
- More detailed tutorial at [howtoforge.com](https://www.howtoforge.com/tutorial/how-to-install-jenkins-with-apache-on-ubuntu-16-04).
- Update the Azure network security group to allow port 8080 and then browse the public IP at port 8080 to manage Jenkins in your browser.
- Initial Jenkins admin password is stored at /var/lib/jenkins/secrets/initialAdminPassword
- Install Docker on the Jenkins machine via these [instructions](https://docs.docker.com/cs-engine/1.13/#install-on-ubuntu-1404-lts-or-1604-lts). This allows for Docker commands to be run in Jenkins jobs.
- Configure Docker permissions to allow Jenkins to access endpoint.

    ```bash
    sudo chmod 777 /run/docker.sock
    ```
- Install `kubectl` CLI on Jenkins. More details are at [Installing and Setting up kubectl](https://kubernetes.io/docs/tasks/kubectl/install/)

    ```bash
    curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl

    chmod +x ./kubectl

    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

### Step 2: Set up access to the Kubernetes cluster

> **NOTE:** There are multiple approaches to accomplishing the following steps. Use the approach that is easiest for you.

- Copy the `kubectl` config file to the Jenkins machine.

    ```bash
    export KUBE_MASTER=<your_cluster_master_fqdn>
        
    sudo scp -3 -i ~/.ssh/id_rsa azureuser@$KUBE_MASTER:.kube/config user@<your_jenkins_server>:~/.kube/config
        
    sudo ssh user@<your_jenkins_server> sudo chmod 777 /home/user/.kube/config

    sudo ssh -i ~/.ssh/id_rsa user@<your_jenkins_server> sudo chmod 777 /home/user/.kube/config
        
    sudo ssh -i ~/.ssh/id_rsa user@<your_jenkins_server> sudo cp /home/user/.kube/config /var/lib/jenkins/config
    ```
        
- Validate from Jenkins that the Kubernetes cluster is accessible.
    

## Create a Jenkins workflow

### Prerequisites

- Github account for code repo.
- Docker Hub account to store and update images.
- Containerized application that can be rebuilt and updated. You can use this sample container app written in Golang: https://github.com/chzbrgr71/go-web 

> **NOTE:** The following steps must be performed in your own GitHub account. Feel free to clone the above repo, but you must use your own account to configure the webhooks and Jenkins access.
>

### Step 1: Deploy initial v1 of application
- Build the app from the developer machine with the following commands. Replace `myrepo` with your own.
    
    ```bash
    git clone https://github.com/chzbrgr71/go-web.git
    cd go-web
    docker build -t myrepo/go-web .
    ```

- Push image to Docker Hub.

    ```bash
    docker login
    docker push myrepo/go-web
    ```

- Deploy to the Kubernetes cluster.
    
    > **NOTE:** Edit the `go-web.yaml` file to update your container image and repo.
        
    ```bash
    kubectl create -f ./go-web.yaml --record
    ```
### Step 2: Configure Jenkins system
- Click **Manage Jenkins** > **Configure System**.
- Under **GitHub**, select **Add Github Server**.
- Leave **API URL** as default.
- Under **Credentials**, add a Jenkins credential using **Secret text**. We recommend using GitHub personal access tokens which are configured in your GitHub user account settings. More details on this [here.](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
- Click **Test connection** to ensure this is configured correctly
- Under **Global Properties**, add an environment variable `DOCKER_HUB` and provide your Docker Hub password. (This is useful in this demo, but a production scenario would require a more secure approach.)
- Save.

![Jenkins Github access](media/container-service-kubernetes-jenkins/jenkins-github-access.png)

### Step 3: Create the Jenkins Workflow
- Create a new Jenkins item
- Provide a name (eg - "go-web") and select **Freestyle Project**. 
- Check **GitHub project** and provide the URL to your GitHub repo.
- In **Source Code Management**, provide the Github repo URL and credentials. 
- Add a **Build Step** of type **Execute shell** and use the following text:

    ```bash
    WEB_IMAGE_NAME="myrepo/go-web:kube${BUILD_NUMBER}"
    docker build -t $WEB_IMAGE_NAME .
    docker login -u <your-dockerhub-username> -p ${DOCKER_HUB}
    docker push $WEB_IMAGE_NAME
    ```

- Add another **Build Step** of type **Execute shell** and use the following text:

    ```bash
    WEB_IMAGE_NAME="myrepo/go-web:kube${BUILD_NUMBER}"
    kubectl set image deployment/go-web go-web=$WEB_IMAGE_NAME --kubeconfig /var/lib/jenkins/config
    ```

![Jenkins build steps](media/container-service-kubernetes-jenkins/jenkins-build-steps.png)
    
- Save the Jenkins item and test with **Build Now**.

### Step 4: Connect GitHub webhook
- In the Jenkins item you created, click **Configure**.
- Under **Build Triggers**, select **GitHub hook trigger for GITScm polling** and **Save**. This automatically configures the GitHub webhook.
- In your GitHub repo for go-web, click **Settings > Webhooks**.
- Verify that the Jenkins webhook URL was added successfully. The URL should end in "github-webhook"

![Jenkins webhook configuration](media/container-service-kubernetes-jenkins/jenkins-webhook.png)

## Test the CI/CD process end to end

1. Update code for the repo and push/synch with the GitHub repository.
2. From the Jenkins console, check the **Build History** and validate that the job has run. View console output to see details.
3. From Kubernetes, view details of the upgraded deployment:

    ```bash
    kubectl rollout history deployment/go-web
    ```

## Next steps

- Deploy Azure Container Registry and store images in a secure repository. [Azure Container Registry docs](https://docs.microsoft.com/en-us/azure/container-registry).
- Build a more complex workflow that includes side-by-side deployment and automated tests in Jenkins.
- For more information about CI/CD with Jenkins and Kubernetes, see the [Jenkins blog](https://jenkins.io/blog/2015/07/24/integrating-kubernetes-and-jenkins/).