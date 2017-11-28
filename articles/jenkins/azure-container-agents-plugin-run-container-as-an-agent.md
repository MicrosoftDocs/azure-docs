---
title: Run a container as an agent in Jenkins using the Azure Container Agents plugin | Microsoft Docs
description: Learn how to run a container as an agent in Jenkins using the Azure Container Agents plugin
services: multiple
documentationcenter: ''
author: tomarcher
manager: rloutlaw
editor: ''

ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 11/28/2017
ms.author: tarcher
ms.custom: jenkins
---

# Run a container as an agent in Jenkins using the Azure Container Agents plugin

In this tutorial, 

You learn how to:
> [!div class="checklist"]
> * Create and configure a Jenkins instance

## Create and configure a Jenkins instance

If you don't already have a Jenkins Master, start with the [solution template](install-jenkins-solution-template.md), which includes the Java Development Kit (JDK) version 8 and the following required Jenkins plugins:

* [Jenkins Git client plugin](https://plugins.jenkins.io/git-client) version 2.4.6 
* [Docker Commons plugin](https://plugins.jenkins.io/docker-commons) version 1.4.0
* [Azure Credentials](https://plugins.jenkins.io/azure-credentials) version 1.2
* [Azure App Service](https://plugins.jenkins.io/azure-app-server) version 0.1

## Install the Azure Container Agents plugin for Jenkins

### Install the plugin via the Jenkins dashboard
1. Open and log in to the Jenkins dashboard.

1. Select **Manage Jenkins**.
    ![](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-manage-jenkins.png)

1. Select **Manage Plugins**.

1. Select **Available**.

1. Enter `Azure Container Agents` into the **Filter** text box

You can install/update this plugin in Jenkins update center (Manage Jenkins -> Manage Plugins, search Azure Container Agents Plugin).

### Install the plugin manually
You can also manually install the plugin if you want to try the latest feature before it's officially released. To manually install the plugin:

Clone the repo and build:
 mvn package
Open your Jenkins dashboard, go to Manage Jenkins -> Manage Plugins
Go to Advanced tab, under Upload Plugin section, click Choose File.
Select azure-container-agents.hpi in target folder of your repo, click Upload.
Restart your Jenkins instance after install is completed.

## Next steps
You learned how to:

> [!div class="checklist"]
> * 