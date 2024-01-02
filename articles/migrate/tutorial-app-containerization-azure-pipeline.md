---
title: Continuous Deployment for containerized applications with Azure DevOps
description: Tutorial:Continuous Deployment for containerized applications with Azure DevOps
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 12/07/2021
ms.custom: engagement-fy23
---

# Continuous deployment for containerized applications with Azure DevOps

In this step-by-step guide, you'll learn how to create a pipeline that continuously builds and deploys your containerized apps for Day 2 operations with Azure DevOps. Every time you change your code in a repository that contains a Dockerfile, the images are pushed to your Azure Container Registry, and the manifests are then deployed to either Azure Kubernetes Service or Azure App Service.

Azure DevOps enables you to host, build, plan and test your code with complimentary workflows. Using Azure Pipelines as one of these workflows allows you to deploy your application with CI/CD that works with any platform and cloud. A pipeline is defined as a YAML file in the root directory of your repository.

## Prerequisites

Before you begin this tutorial, you should:

-  Containerize and deploy your ASP.NET or Java web app using Azure Migrate App Containerization.
-  A GitHub account, where you can create a repository. If you don't have one, you can [create one for free](https://github.com/).
-  An Azure DevOps organization. If you don't have one, you can [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). (An Azure DevOps organization is different from your GitHub organization. You can give your DevOps organization and your GitHub organization the same name if you want alignment between them.) <br/> If your team already has one, then make sure you're an administrator of the Azure DevOps project that you want to use.
-  An ability to run pipelines on Microsoft-hosted agents. You can either purchase a [parallel job](/azure/devops/pipelines/licensing/concurrent-jobs) or you can request a free tier. To request a free tier, follow the instructions in [this article](/azure/devops/pipelines/licensing/concurrent-jobs). Please note that it may take us 2-3 business days to grant the free tier.


## Locate the artifacts

Azure Migrate App Containerization tool automatically generates artifacts that can be used for configuring a CI/CD workflow for your application using Azure Pipelines. The artifacts are generated once the application deployment is completed through the tool. You can find the artifacts as follows - 

1. Go to the machine running the Azure Migrate App Containerization tool. 
2. Navigate to **C:\ProgramData\Microsoft Azure Migrate App Containerization** directory. If you are unable to navigate to C:\ProgramData, make sure to select the option for showing *Hidden items* under *View* in file explorer. 
3. Select the directory corresponding to the **source machine IP/FQDN**. The source machine is the machine specified in the App Containerization tool running the application that was containerized.
4. For Java applications 
    - Navigate to **JavaTomcatWebApp\Artifacts**.    
    - Navigate to the directory **Catalina\localhost**. If you do not find this directory, then try navigating to the directory corresponding to Tomcat engine name and host name.
    - Locate the application folder within this directory. 
5. For ASP.NET applications
    - Navigate to **IISAspNetWebApp**.
    - Locate the application folder within this directory.


## Upload artifacts to GitHub

You'll need to upload the artifacts to a source repository that will be used with Azure DevOps. 

1. Sign in to your GitHub account. 
2. Follow the steps in [this article](https://docs.github.com/get-started/quickstart/create-a-repo) to create a new repository. 
3. The next step is to upload the following artifacts to this repository.
   -  For Java apps, select the following folders and files in the application folder on the machine running the App Containerization tool.
        - MandatoryArtifacts folder
        - manifests folder
        - OptionalArtifacts folder
        - Dockerfile 
        - Entryscript.sh file
        - azure-pipelines.yml file
    - For ASP.NET apps, select the following folders and files in the application folder on the machine running the App Containerization tool.
        - manifests folder
        - Build folder
        - azure-pipelines.yml file

## Sign in to Azure Pipelines

Sign in to [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines). After you sign in, your browser goes to https://dev.azure.com/my-organization-name and displays your Azure DevOps dashboard.

Within your selected organization, create a *project*. If you don't have any projects in your organization, you see a **Create a project to get started** screen. Otherwise, select the **Create Project** button in the upper-right corner of the dashboard.

## Add service connections

Before you create your pipeline, you should first create your service connections since you will be asked to choose and verify your connections in the template. A service connection will allow you to connect to your Azure Container Registry when using the task templates and to the Azure subscription where you want to deploy the application. 

1. In the bottom left corner, select **Project settings > Service connections**.
2. Select **new service connection**, select the **Docker Registry > Azure Container Registry** option for type of service connection that you need, and select Next.
3. Choose an authentication method, and select Next.
4. Enter the parameters for the service connection. The list of parameters differs for each type of service connection. For more information, see the [list of service connection types and associated parameters](/azure/devops/pipelines/library/service-endpoints?tabs=yaml#common-service-connection-types).
5. Select **Save** to create the connection.
6. **Validate** the connection, once it's created and parameters are entered. The validation link uses a REST call to the external service with the information that you entered, and indicates whether the call succeeded.
7. Repeat the same steps for creating a service connection to your Azure Subscription by selecting **new service connection > Azure Resource Manager**. 
8. Note the resource ID for both the service connections. 

## Create the pipeline

Now that you've created both the service connections, you can configure your pipeline. The pipeline YAML has automatically been created by the App Containerization tool and can be configured as follows -  

1. Go to Pipelines, and then select **New Pipeline**.
2. Walk through the steps of the wizard by first selecting **GitHub** as the location of your source code.
3. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.
4. When the list of repositories appears, select your repository.
5. You might be redirected to GitHub to install the Azure Pipelines app. If so, select Approve & install.
6. When your new pipeline appears, review the YAML to see what it does.
7. In the YAML, provide the resource ID for the Azure Container Registry service connection as the value for the **dockerRegistryServiceConnection** variable.
8. Provide the resource ID for the Azure Resource Manager service connection as the value for the **dockerRegistryServiceConnection** variable.
9. When you're ready, **Save** to commit the new pipeline into your repo. 

Your pipeline is all setup to build and deploy your containerized for Day 2 operations. You can [customize your pipeline](/azure/devops/pipelines/customize-pipeline#prerequisite) to meet your organizational needs. 