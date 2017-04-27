---
title: Create a CiCd pipeline in Azure with Jenkins | Microsoft Docs
description: Learn how to create a Jenkins instance in Azure that pulls from GitHub on each code commit and builds a new Docker container to test your app
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/27/2017
ms.author: iainfou
---

# Create a CiCd infrastructure in Azure that uses Jenkins, GitHub, and Docker

## Create Jenkins instance
Create a cloud-init file named `cloud-init-jenkins.txt` and paste the following contents:

```yaml
#cloud-config
package_upgrade: true
runcmd:
  - wget -q -O - https://jenkins-ci.org/debian/jenkins-ci.org.key | apt-key add -
  - sh -c 'echo deb http://pkg.jenkins-ci.org/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
  - apt-get update && apt-get install jenkins -y
```

Create a resource group:

```azurecli
az group create --name myResourceGroupJenkins --location westus
```

Create a VM that uses the cloud-init file to install Jenkins:

```azurecli
az vm create --resource-group myResourceGroupJenkins \
    --name myJenkinsVM \
	  --image UbuntuLTS \
	  --admin-username azureuser \
	  --generate-ssh-keys \
	  --vnet-name myVnet \
	  --subnet mySubnet \
	  --custom-data cloud-init-jenkins.txt
```

Open port 8080 to access your Jenkins instance in a web browser:

```azurecli
az vm open-port --resource-group myResourceGroupJenkins --name myJenkinsVM --port 8080
```

SSH to your VM using the `publicIpAddress` noted in the output of VM create:

```bash
ssh azureuser@<publicIpAddress>
```

View and copy the `initialAdminPassword` for your Jenkins install:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```


## Configure Jenkins
Open a web browser and go to `http://<publicIpAddress>:8080` to access your Jenkins instance. Follow through the initial Jenkins set up:

- Enter `initialAdminPassword` copied from the VM in the previous step
- Click **Select plugins to install**
- Search for and select **GitHub plugin**, then click **Install**
- Create first admin user
- Click **Start using Jenkins**


## Fork GitHub repo for Node.js app
In a new browser tab or window, open the [Node.js Hello Worlds sample app](https://github.com/Azure-Samples/nodejs-docs-hello-world). Fork the repo to your own GitHub account.

Inside your fork, configure the Jenkins integration:

- Click on **Settings**, then select **Integrations & services**
- Click **Add service** and enter **Jenkins** in filter
- Select **Jenkins (GitHub plugin)**
- For the **Jenkins hook URL**, enter `http://<publicIpAddress>:8080/github-webhook/**

You now have your GitHub repo ready to notify Jenkins of updates within the repo.


## Create Jenkins job
Back in Jenkins, click **Create new job**:

- Enter **Hello World** as job name. Select **Freestyle project**, then click **OK**
- Under the **General** section, select **GitHub** project and enter your forked repo URL, such as `https://github.com/iainfoulds/nodejs-docs-hello-world`
- Under the **Source code management** section, select **Git**, enter your forked repo **.git** URL, such as `https://github.com/iainfoulds/nodejs-docs-hello-world.git`
- Under the **Build Triggers** section, select **GitHub hook trigger for GITscm polling**
- Under the **Build** section, click **Add build step**. Select **Execute shell**, then enter `echo "Testing"` in to command window
- Click **Save** at the bottom of the jobs window


## Test GitHub integration
Back in GitHub, select you forked repo, and then click the **index.js** file. Edit this file so line 6 reads `response.end("Hello Azure!");`.
Commit youur changes.

In Jenkins, a new build should start. Click on the build and select **Console output**. Your code is pulled from GitHub, and then the build action triggers the message `Testing` to appear in the console.


## Create Docker virtual machine
To run your app and allow Jenkins to build new versions, create a Docker VM in Azure. Create a cloud-init file named `cloud-init-docker.txt` and paste the following contents:

```yaml
#cloud-config
package_upgrade: true
runcmd:
  - curl -sSL https://get.docker.com/ | sh
  - sudo usermod -aG docker azureuser
```

Create a VM that uses the cloud-init file to install Docker:

```azurecli
az vm create --resource-group myResourceGroupJenkins \
	  --name myDockerVM \
	  --image UbuntuLTS \
	  --admin-username azureuser \
	  --generate-ssh-keys \
	  --vnet-name myVnet \
	  --subnet mySubnet \
	  --custom-data cloud-init-docker.txt
```

Open port 1337 to access your app in a web browser after each build:

```azurecli
az vm open-port --resource-group myResourceGroupJenkins --name myDockerVM --port 1337
```


## Configure Jenkins to use Docker
In your Jenkins browser, install the required Docker plugins to allow Jenkins to build Docker images and manage containers:

- Click **Manage Jenkins**, select **Manage plugins**, then click the **Available** tab
- In the filter box, enter **Docker**, then select both **Docker plugin** and **Docker build step**
- Click **Download and restart**

Once Jenkins restarts, log back in to Jenkins. Now create the connection between Jenkins and Docker:

- Click on **Manage Jenkins**, then click **Configure System**
- Under the **Docker builder** section, enter the URL to your host:
  - **URL**: tcp://myDockerVM:2375
- Click **Test Connection** and it should return `Connected to tcp://myDockerVM:2375`
- Under the **Cloud** section, click **Add a new cloud** and then select **Docker**. Enter the following info:
  - **Name**: docker-agent
	- **URL**: tcp://myDockerVM:2375
- Click **Test Connection** and it should return your Docker info, such as `Version = 17.04.0-ce, API Version = 1.28`


## Define Docker build image
For Jenkins to build an image that incorporates the latest code updates for GitHub, you use a Dockerfile. SSH to your Jenkins VM and create a directory to store the Dockerfile:

```bash
sudo mkdir /var/lib/jenkins/Dockerfiles
```

Now create a file named `Dockerfile` in this new directory and paste the following contents:

```yaml
FROM ubuntu

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y nodejs npm git

RUN mkdir /var/www
RUN cd /var/www/ && git clone https://github.com/iainfoulds/nodejs-docs-hello-world.git
```



## Next steps
In this tutorial, you have learned how to configure Jenkins to pull from a GitHub repo and deploy a Docker container to test your app