---
title: Set up big data analytics lab
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services to teach the big data analytics using Docker deployment of Hortonworks Data Platform (HDP).
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/25/2023
---

# Set up a lab for big data analytics in Azure Lab Services using Docker deployment of HortonWorks Data Platform

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a lab to teach a big data analytics class. A big data analytics class teaches users how to handle large volumes of data. It also teaches them to apply machine and statistical learning algorithms to derive data insights. A key objective is to learn how to use data analytics tools, such as [Apache Hadoop's open-source software package](https://hadoop.apache.org/). The software package provides tools for storing, managing, and processing big data.

In this lab, lab users work with a popular commercial version of Hadoop provided by [Cloudera](https://www.cloudera.com/), called [Hortonworks Data Platform (HDP)](https://www.cloudera.com/products/hdp.html). Specifically, lab users use [HDP Sandbox 3.0.1](https://www.cloudera.com/tutorials/getting-started-with-hdp-sandbox/1.html) that's a simplified, easy-to-use version of the platform. HDP Sandbox 3.0.1 is also free of cost and is intended for learning and experimentation. Although this class may use either Windows or Linux virtual machines (VM) with HDP Sandbox deployed. This article shows you how to use Windows.

Another interesting aspect is that you deploy the HDP Sandbox on the lab VMs using [Docker](https://www.docker.com/) containers. Each Docker container provides its own isolated environment for software applications to run inside. Conceptually, Docker containers are like nested VMs and can be used to easily deploy and run a wide variety of software applications based on container images provided on [Docker Hub](https://www.docker.com/products/docker-hub). Cloudera's deployment script for HDP Sandbox automatically pulls the [HDP Sandbox 3.0.1 Docker image](https://hub.docker.com/r/hortonworks/sandbox-hdp) from Docker Hub and runs two Docker containers:

- sandbox-hdp
- sandbox-proxy

## Prerequisites

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

## Lab configuration

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

This lab uses a Windows 10 Pro Azure Marketplace images as the base VM image. You first need to enable this image in your lab plan. This lets lab creators then select the image as a base image for their lab.

Follow these steps to [enable these Azure Marketplace images available to lab creators](specify-marketplace-images.md). Select one of the **Windows 10** Azure Marketplace images.

### Lab settings

Create a lab for your lab plan. [!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

| Lab settings | Value/instructions |
| ------------ | ------------------ |
|Virtual Machine Size| **Medium (Nested Virtualization)**. This VM size is best suited for relational databases, in-memory caching, and analytics. The size also supports nested virtualization.|  
|Virtual Machine Image| **Windows 10 Pro**|
    
> [!NOTE]
> Use the Medium (Nested Virtualization) VM size because the HDP Sandbox using Docker requires Windows Hyper-V with nested virtualization and at least 10 GB of RAM.

## Template machine configuration

To set up the template machine:

1. Install Docker
1. Deploy HDP Sandbox
1. Use PowerShell and Windows Task Scheduler to automatically start the Docker containers

### Install Docker

The steps in this section are based on [Cloudera's instructions for deploying with Docker containers](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html).

To use Docker containers, you must first install Docker Desktop on the template VM:

1. Follow the steps in the [Prerequisites section](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html#prerequisites) to install [Docker for Windows](https://docs.docker.com/docker-for-windows/install/).

    > [!IMPORTANT]
    > Ensure that the **Use Windows containers instead of Linux containers** configuration option is left unchecked.

1. Ensure that **Windows Containers and Hyper-V features** are turned on.

     :::image type="content" source="./media/class-type-big-data-analytics/windows-hyperv-features.png" alt-text="Turn Windows features on or off.":::

1. Follow the steps in the [Memory for Windows](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html#memory-for-windows) section to configure Docker's memory configuration.

    > [!WARNING]
    > If you inadvertently check the **Use Windows containers instead of Linux containers** option when installing Docker, you won't see the memory configuration settings. To fix this, you can switch to using Linux containers by [clicking on the Docker icon in Windows System tray](https://docs.docker.com/docker-for-windows/#docker-settings-dialog); when the Docker Desktop menu opens, select **Switch to Linux containers**.

### Deploy HDP Sandbox

Next, deploy HDP Sandbox and then access HDP Sandbox using the browser.

1. Ensure that you have installed [Git Bash](https://gitforwindows.org/) as listed in the [Prerequisites section](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html#prerequisites) of the guide. It's recommended for completing the next steps.

1. Using [Cloudera's Deployment and Install Guide for Docker](https://www.cloudera.com/tutorials/sandbox-deployment-and-install-guide/3.html), complete the steps in the following sections:

   - Deploy HDP Sandbox
   - Verify HDP Sandbox

    > [!WARNING]
    > When you download the latest .zip file for HDP, ensure that you *don't* save the .zip file in a directory path that includes whitespace.

    > [!NOTE]
    > If you receive an exception during deployment stating **Drive has not been shared**, you need to share your C drive with Docker so that HDP's Linux containers can access local Windows files. To fix this, [click on the Docker icon in Windows System tray](https://docs.docker.com/docker-for-windows/#docker-settings-dialog) to open the Docker Desktop menu and select **Settings**. When **Docker's Settings** dialog opens, select **Resources > File Sharing** and check the **C** drive. You can then repeat the steps to deploy HDP Sandbox.

1. When the Docker containers for HDP Sandbox are deployed and running, you can access the environment by launching your browser. Follow Cloudera's instructions for opening the [Sandbox Welcome Page](https://www.cloudera.com/tutorials/learning-the-ropes-of-the-hdp-sandbox.html#welcome-page) and launching the HDP Dashboard.

    > [!NOTE]
    > These instructions assume that you have first mapped the local IP address of the sandbox environment to the sandbox-hdp.hortonworks.com in the host file on your template VM. If you **don't** do this mapping, you can access the Sandbox Welcome page by navigating to `http://localhost:8080`.

### Automatically start Docker containers when lab users sign in

To provide an easy-to-use experience for lab users, create a PowerShell script that automatically:

1. Starts the HDP Sandbox Docker containers when a lab user starts and connects to their lab VM.
1. Launches the browser and navigates to the Sandbox Welcome page.

Use Windows Task Scheduler to automatically run this script when a lab user logs into their VM. To set up a Task Scheduler, follow these steps: [Big Data Analytics scripting](https://aka.ms/azlabs/scripts/BigDataAnalytics).

## Cost estimate

This section provides a cost estimate for running this class for 25 lab users. There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Medium (Nested Virtualization)**, which is 55 lab units.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 55 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion

This article walked you through the steps necessary to create a lab for a big data analytics class. The big data analytics class uses the Hortonworks Data Platform deployed with Docker. The setup for this class type might be used for similar data analytics classes. This setup might also be applicable to other types of classes that use Docker for deployment.

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
