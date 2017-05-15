---
title: Continuous build and integration for your Azure Service Fabric Linux Java application by using Jenkins | Microsoft Docs
description: Continuous build and integration for your Linux Java application by using Jenkins
services: service-fabric
documentationcenter: java
author: sayantancs
manager: timlt
editor: ''

ms.assetid: 02b51f11-5d78-4c54-bb68-8e128677783e
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/27/2017
ms.author: saysa

---
# Use Jenkins to build and deploy your Linux Java application
Jenkins is a popular tool for continuous integration and deployment of your apps. Here's how to build and deploy your Azure Service Fabric application by using Jenkins.

## General prerequisites
- Have Git installed locally. You can install the appropriate Git version from [the Git downloads page](https://git-scm.com/downloads), based on your operating system. If you are new to Git, learn more about it from the [Git documentation](https://git-scm.com/docs).
- Have the Service Fabric Jenkins plug-in handy. You can download it from [Service Fabric downloads](https://servicefabricdownloads.blob.core.windows.net/jenkins/serviceFabric.hpi).

## Set up Jenkins inside a Service Fabric cluster

You can set up Jenkins either inside or outside a Service Fabric cluster. The following sections show how to set it up inside a cluster.

### Prerequisites
1. Have a Service Fabric Linux cluster ready. A Service Fabric cluster created from the Azure portal already has Docker installed. If you are running the cluster locally, check if Docker is installed by using the command ``docker info``. If it is not installed, install it accordingly by using the following commands:

  ```sh
  sudo apt-get install wget
  wget -qO- https://get.docker.io/ | sh
  ```
2. Have the Service Fabric container application deployed on the cluster, by using the following steps:

  ```sh
git clone https://github.com/Azure-Samples/service-fabric-java-getting-started.git -b JenkinsDocker
cd service-fabric-java-getting-started/Services/JenkinsDocker/
azure servicefabric cluster connect http://PublicIPorFQDN:19080   # Azure CLI cluster connect command
bash Scripts/install.sh
```
This installs a Jenkins container on the cluster, and can be monitored by using the Service Fabric Explorer.

### Steps
1. From your browser, go to ``http://PublicIPorFQDN:8081``. It provides the path of the initial admin password required to sign in. You can continue to use Jenkins as an admin user. Or you can create and change the user, after you sign in with the initial admin account.

   > [!NOTE]
   > Ensure that the 8081 port is specified as the application endpoint port while you are creating the cluster.
   >

2. Get the container instance ID by using ``docker ps -a``.
3. Secure Shell (SSH) sign in to the container, and paste the path you were shown on the Jenkins portal. For example, if in the portal it shows the path `PATH_TO_INITIAL_ADMIN_PASSWORD`, run the following:

  ```sh
  docker exec -t -i [first-four-digits-of-container-ID] /bin/bash   # This takes you inside Docker shell
  cat PATH_TO_INITIAL_ADMIN_PASSWORD
  ```

4. Set up GitHub to work with Jenkins, by using the steps mentioned in [Generating a new SSH key and adding it to the SSH agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
	* Use the instructions provided by GitHub to generate the SSH key, and to add the SSH key to the GitHub account that is hosting your repository.
	* Run the commands mentioned in the preceding link in the Jenkins Docker shell (and not on your host).
	* To sign in to the Jenkins shell from your host, use the following command:

  ```sh
  docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
  ```

## Set up Jenkins outside a Service Fabric cluster

You can set up Jenkins either inside or outside of a Service Fabric cluster. The following sections show how to set it up outside a cluster.

### Prerequisites
You need to have Docker installed. The following commands can be used to install Docker from the terminal:

  ```sh
  sudo apt-get install wget
  wget -qO- https://get.docker.io/ | sh
  ```

Now when you run ``docker info`` in the terminal, you should see in the output that the Docker service is running.

### Steps
  1. Pull the Service Fabric Jenkins container image: ``docker pull raunakpandya/jenkins:v1``
  2. Run the container image: ``docker run -itd -p 8080:8080 raunakpandya/jenkins:v1``
  3. Get the ID of the container image instance. You can list all the Docker containers with the command ``docker ps –a``
  4. Sign in to the Jenkins portal by using the following steps:

    * ```sh
    docker exec [first-four-digits-of-container-ID] cat /var/jenkins_home/secrets/initialAdminPassword
    ```
    If container ID is 2d24a73b5964, use 2d24.
    * This password is required for signing in to the Jenkins dashboard from portal, which is ``http://<HOST-IP>:8080``
    * After you sign in for the first time, you can create your own user account and use that for future purposes, or you can continue to use the administrator account. After you create a user, you need to continue with that.
  5. Set up GitHub to work with Jenkins, by using the steps mentioned in [Generating a new SSH key and adding it to the SSH agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
    	* Use the instructions provided by GitHub to generate the SSH key, and to add the SSH key to the GitHub account that is hosting the repository.
    	* Run the commands mentioned in the preceding link in the Jenkins Docker shell (and not on your host).
  	  * To sign in to the Jenkins shell from your host, use the following commands:

      ```sh
      docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
      ```

Ensure that the cluster or machine where the Jenkins container image is hosted has a public-facing IP. This enables the Jenkins instance to receive notifications from GitHub.

## Install the Service Fabric Jenkins plug-in from the portal

1. Go to ``http://PublicIPorFQDN:8081``
2. From the Jenkins dashboard, select **Manage Jenkins** > **Manage Plugins** > **Advanced**.
Here, you can upload a plug-in. Select **Choose file**, and then select the **serviceFabric.hpi** file, which you downloaded under prerequisites. When you select **Upload**, Jenkins automatically installs the plug-in. Allow a restart if requested.

## Create and configure a Jenkins job

1. Create a **new item** from dashboard.
2. Enter an item name (for example, **MyJob**). Select **free-style project**, and click **OK**.
3. Go the job page, and click **Configure**.

   a. In the general section, under **GitHub project**, specify your GitHub project URL. This URL hosts the Service Fabric Java application that you want to integrate with the Jenkins continuous integration, continuous deployment (CI/CD) flow (for example, ``https://github.com/sayantancs/SFJenkins``).

   b. Under the **Source Code Management** section, select **Git**. Specify the repository URL that hosts the Service Fabric Java application that you want to integrate with the Jenkins CI/CD flow (for example, ``https://github.com/sayantancs/SFJenkins.git``). Also, you can specify here which branch to build (for example, **/master**).
4. Configure your *GitHub* (which is hosting the repository) so that it is able to talk to Jenkins. Use the following steps:

   a. Go to your GitHub repository page. Go to **Settings** > **Integrations and Services**.

   b. Select **Add Service**, type **Jenkins**, and select the **Jenkins-GitHub plugin**.

   c. Enter your Jenkins webhook URL (by default, it should be ``http://<PublicIPorFQDN>:8081/github-webhook/``). Click **add/update service**.

   d. A test event is sent to your Jenkins instance. You should see a green check by the webhook in GitHub, and your project will build.

   e. Under the **Build Triggers** section, select which build option you want. For this example, you want to trigger a build whenever some push to the repository happens. So you select **GitHub hook trigger for GITScm polling**. (Previously, this option was called **Build when a change is pushed to GitHub**.)

   f. Under the **Build section**, from the drop-down **Add build step**, select the option **Invoke Gradle Script**. In the widget that comes, specify the path to **Root build script** for your application. It picks up build.gradle from the path specified, and works accordingly. If you create a project named ``MyActor`` (using the Eclipse plug-in or Yeoman generator), the root build script should contain ``${WORKSPACE}/MyActor``. See the following screenshot for an example of what this looks like:

    ![Service Fabric Jenkins Build action][build-step]

   g. From the **Post-Build Actions** drop-down, select **Deploy Service Fabric Project**. Here you need to provide cluster details where the Jenkins compiled Service Fabric application would be deployed. You can also provide additional application details used to deploy the application. See the following screenshot for an example of what this looks like:

    ![Service Fabric Jenkins Build action][post-build-step]

   > [!NOTE]
   > The cluster here could be same as the one hosting the Jenkins container application, in case you are using Service Fabric to deploy the Jenkins container image.
   >

## Next steps
GitHub and Jenkins are now configured. Consider making some sample change in your ``MyActor`` project in the repository example, https://github.com/sayantancs/SFJenkins. Push your changes to a remote ``master`` branch (or any branch that you have configured to work with). This triggers the Jenkins job, ``MyJob``, that you configured. It fetches the changes from GitHub, builds them, and deploys the application to the cluster endpoint you specified in post-build actions.  

  <!-- Images -->
  [build-step]: ./media/service-fabric-cicd-your-linux-java-application-with-jenkins/build-step.png
  [post-build-step]: ./media/service-fabric-cicd-your-linux-java-application-with-jenkins/post-build-step.png
