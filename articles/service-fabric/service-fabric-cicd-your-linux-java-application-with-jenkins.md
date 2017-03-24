---
title: Continuous build and deploy for your Linux java application Linux using Jenkins | Microsoft Docs
description: Continuous build and deploy for your Linux java application Linux using Jenkins
services: service-fabric
documentationcenter: java
author: sayantancs
manager: raunakp
editor: ''

ms.assetid: 02b51f11-5d78-4c54-bb68-8e128677783e
ms.service: service-fabric
ms.devlang: java
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/27/2017
ms.author: sayantancs

---
# Build and deploy your Linux Java application using Jenkins
Jenkins is a popular tool for continuous integration and deployment. In this document, we walk you through building and deploying your Service Fabric application using Jenkins.

## General Prerequisites
1. You need to have git installed locally. You can install the appropriate git version from [here](https://git-scm.com/downloads) based on your OS. If you are new to git, you can follow the steps mentioned in the [documentions](https://git-scm.com/docs) to get yourself acquainted with git.
2. You need to have the Service Fabric Jenkins plugin handy. Download the Service Fabric Jenkins plugin from [here](https://servicefabricdownloads.blob.core.windows.net/jenkins/serviceFabric.hpi).

## Setting up Jenkins inside a Service Fabric Cluster

### Prerequisites
1. Have a Service Fabric Linux cluster ready. Service Fabric clusters created from azure portal already has Docker installed. If you running the local cluster please check if Docker is installed or not using the command ``docker info`` and if it is not installed then install it accordingly using -
```sh
sudo apt-get install wget
wget -qO- https://get.docker.io/ | sh
```
2. Have the Service Fabric container application deployed on the cluster ``http://PublicIPorFQDN:19080``. You can follow the steps below -
```sh
git clone https://github.com/Azure-Samples/service-fabric-java-getting-started.git -b JenkinsDocker && cd service-fabric-java-getting-started/Services/JenkinsDocker/
azure servicefabric cluster connect http://PublicIPorFQDN:19080 # Azure CLI cluster connect command
bash Scripts/install.sh
```
  This  will install the Jenkins container to the cluster you connected. You can monitor your container application using the Service Fabric explorer.

### Steps
1. Go to the URL ``http://PublicIPorFQDN:8081`` from your browser. It will provide you the path of the initial admin password required to login. You can continue to use Jenkins as admin user or you can create and change the user, once you login with the initial admin account.
> [!NOTE]
> You need to ensure 8081 port is specified as application endpoint port while creating the cluster
>

2. Get the container instance id using ``docker ps -a``.
3. SSH login to the container using and paste the path you were shown on the Jenkins portal. For example, if in the portal it shows the path `PATH_TO_INITIAL_ADMIN_PASSWORD`, you can do -  
  ```sh
  docker exec -t -i [first-four-digits-of-container-ID] /bin/bash # This takes you inside docker shell
  cat PATH_TO_INITIAL_ADMIN_PASSWORD
  ```

4. Setup GitHub to work with Jenkins using [this](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
	* Use the instructions provided from GitHub to generate the SSH key and add the ssh key to the GitHub-account which is (would be) hosting the repository.
	* Run the commands mentioned in the above link in the Jenkins-docker shell (and not on your host)
	* To log on to the Jenkins shell from your host, you need to do -
  ```sh
  docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
  ```

## Setting up Jenkins outside a Service Fabric Cluster

### Prerequisites
1. You need to have docker installed. If not you can type in the following commands in the terminal to install docker.
```sh
sudo apt-get install wget
wget -qO- https://get.docker.io/ | sh
```
Now when you run ``docker info`` in the terminal, you would see in the output that docker service is running.

### Steps
  1. Pull the Service Fabric Jenkins container: ``docker pull IMAGE_NAME ``
  2. Run the container image: ``docker run -itd -p 8080:8080 IMAGE_NAME``
  3. Get the id of your docker container which has the jenkins image (which you just installed). You can list all the docker containers with the command ``docker ps –a``
  4. Get the admin password for the Jenkins account. For that you can do the following -
    * ```sh
    docker exec [first-four-digits-of-container-ID] cat /var/jenkins_home/secrets/initialAdminPassword
    ```
    Here if container id is 2d24a73b5964, you need to insert just 2d24
    * This password will be required for logging into the Jenkins dashboard from portal which is ``http://<HOST-IP>:8080``
    * Once you login for the first time, you can create your own user-account and use that for future purpose or you can continue to use the administrator account. Once you create a new user, you need to continue with that.
  5. Setup GitHub to work with Jenkins using [this](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
  	* Use the instructions provided from GitHub to generate the SSH key and add the ssh key to the GitHub account which is (would be) hosting the repository.
  	* Run the commands mentioned in the above link in the Jenkins-docker shell (and not on your host)
  	* To log on to the Jenkins shell from your host, you need to do -
    ```sh
    docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
    ```

> [!NOTE]
> Ensure that the cluster / machine where the Jenkins container image is hosted has a public facing IP such that notifications from GitHub are received by the Jenkins instance.
>

## Install the Service Fabric Jenkins Plugin from portal

1. Go to ``http://PublicIPorFQDN:8081``
2. From the Jenkins dashboard, select ``Manage Jenkins`` -> ``Manage Plugins`` -> ``Advanced``.
Here, you can upload a plugin. Select the ``Choose file`` option, then select the serviceFabric.hpi file, which you have downloaded under Prerequisites. Once you select upload, Jenkins will automatically install the plugin for you. It might also ask for a restart, please allow it.

## Creating and configuring a Jenkins job

1. Create a ``new item`` from dashboard
2. Enter a new item name - say ``MyJob``, select free-style project and click ok
3. Then go the job page and click ``Configure`` -
  * In the general section, under ``Github project`` specify your GitHub project URL which hosts the Service Fabric Java application that you wish to integrate with the Jenkins CI/CD flow (e.g. - ``https://github.com/sayantancs/SFJenkins``).
  * Under the ``Source Code Management`` Section, select ``Git``. Specify the repository URL which hosts the Service Fabric Java application that you wish to integrate with the Jenkins CI/CD flow (e.g. - ``https://github.com/sayantancs/SFJenkins.git``). Also you can specify here which branch to build, e.g. - ``*/master``.
4. Configure your *Github* (i.e. which is hosting the repository) so that it is able to talk to Jenkins, using the following steps -
  - Go to your GitHub repository page. Go to ``Settings`` -> ``Integrations and Services``.
  - Select ``Add Service``, type in Jenkins, select the ``Jenkins-Github plugin``.
  - Enter your Jenkins webhook URL (by default, it should be ``http://<PublicIPorFQDN>:8081/github-webhook/``). Click on add/update service.
  - A test event will be sent to your Jenkins instance. You should see a green check by the webhook in GitHub, and your project will build!
  - Under the ``Build Triggers`` section select which build option do you want - for this use case we plan to trigger a build whenever some push to the repository happens - so the corresponding option would be - ``GitHub hook trigger for GITScm polling`` (previously it was 'Build when a change is pushed to GitHub')
  - Under the ``Build section`` - from the drop-down ``Add build step``, select the option ``Invoke Gradle Script``. In the widget that comes, specify the path to ``Root build script``, for your application. It picks up the build.gradle from the path specified and works accordingly. Please note that - if you create a project named ``MyActor``(using Eclipse plugin or Yeoman generator), then the root build script should contain - ``${WORKSPACE}/MyActor``. As an example, this section mostly looks like -

    ![Service Fabric Jenkins Build action][build-step]
  - Under the ``Post-Build Actions`` drop-down, select ``Deploy Service Fabric Project``. Here you need to provide cluster details where the Jenkins compiled Service Fabric application would be deployed and additional application details used to deploy the application. Following screenshot can be used as a reference:

    ![Service Fabric Jenkins Build action][post-build-step]

 >[!Note]
 > The cluster here could be same as the one hosting the Jenkins container application in case you are using Service Fabric to deploy the Jenkins container image.
 >

### End to end scenario
By now, your GitHub and Jenkins are configured and you can now make some sample change in your ``MyActor`` project in the repository e.g. https://github.com/sayantancs/SFJenkins and push your changes to remote ``master`` branch(or any branch that you have configured to work with). This will now trigger the Jenkins job ``MyJob``, you configured. What it would do is basically - fetch the changes from GitHub, build them and deploy the application to the cluster endpoint you specified in post-build actions.  

  <!-- Images -->
  [build-step]: ./media/service-fabric-cicd-your-linux-java-application-with-jenkins/build-step.png
  [post-build-step]: ./media/service-fabric-cicd-your-linux-java-application-with-jenkins/post-build-step.png
