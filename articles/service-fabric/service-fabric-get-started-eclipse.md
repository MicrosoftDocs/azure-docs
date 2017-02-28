---
title: Set up your eclipse development environment | Microsoft Docs
description: Set up your eclipse development environment.
services: service-fabric
documentationcenter: java
author: saysa
manager: raunakp
editor: ''

ms.assetid: bf84458f-4b87-4de1-9844-19909e368deb
ms.service: service-fabric
ms.devlang: java
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/27/2016
ms.author: saysa

---

# Set up Eclipse development environment for Service Fabric Java application
Eclipse is one of the most used IDEs for Java Developers. In this article we discuss how you can set up your eclipse development environment to work with Service Fabric. Here we will show you - how you can install the plugin, create Service fabric applications and deploy your service-fabric application to local or remote Service Fabric cluster.

## Install Service Fabric Plugin Eclipse Neon
Service Fabric provides a plugin for the Eclipse Neon IDE that can simplify the process of building and deploying Java services.

1. In Eclipse, ensure that you have latest eclipse Neon and latest Buildship version (1.0.17 or later) installed. You can check the versions of installed components by choosing ``Help => Installation Details``. You can update Buildship using the instructions [here][buildship-update]. To check and update if your eclipse neon is on latest version, you can go to ``Help => Check for Updates``.
2. To install the Service Fabric plugin, choose ``Help => Install New Software...``.
  * In the "Work with" textbox, enter: http://dl.windowsazure.com/eclipse/servicefabric.
  * Click Add.
    ![Eclipse Neon plugin for Service Fabric][sf-eclipse-plugin-install]
  * Choose the Service Fabric plugin and click next.
  * Proceed through the installation and accept the end-user license agreement.
3. If you already have the Service Fabric eclipse plugin installed, make sure you are on the latest version. You can check if it can be updated any further be following - ``Help => Installation Details``. Then search for Service fabric in the list of installed plugin and click on update. If there is any pending update, it will be fetched and installed.

## Create Service Fabric application using Eclipse
1. Go to ``File => New => Other``. Select  ``Service Fabric Project``. Click ``Next``.
    ![Service Fabric New Project Page 1][create-application/p1]
2. Give a name to your project. Click ``Next``.
    ![Service Fabric New Project Page 2][create-application/p2]
3. Select Service Template from the available set of templates (Actor, Stateless, Container or Guest-executable). Click ``Next``.
    ![Service Fabric New Project Page 3][create-application/p3]
4. Enter the Service Name and/or the relevant Service details on this page and click ``Finish``.
    ![Service Fabric New Project Page 4][create-application/p4]
5. When you create your first Service fabric project, it will as if it would set the Service-fabric perspective, please select ``yes`` to continue.
    ![Service Fabric New Project Page 5][create-application/p5]
6. After successful creation the project looks like -
    ![Service Fabric New Project Page 6][create-application/p6]

## Build the Service Fabric Application using Eclipse


## Deploy the Service Fabric application using Eclipse


## Add new Service Fabric Service to your Service Fabric Application
