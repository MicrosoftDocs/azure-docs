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
    ![Manage Jenkins option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-manage-jenkins.png)
1. Select **Manage Plugins**.
    ![Manage Jenkins plugins option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-manage-plugins.png)
1. Select **Available**.
    ![View available Jenkins plugins option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-view-available-plugins.png)
1. Enter `Azure Container Agents` into the **Filter** text box. (The list filters as you enter the text.)
    ![Filter the available Jenkins plugins on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-filter-available-plugins.png)
1. Select the checkbox next to the **Azure Container Agents** plugin, and one of the install options. For purposes of this demo, I've selected the **Install without restart** option.
    ![Install the Azure Container Agents plugins from the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-install-aks-agent-plugin.png)
1.  After selecting the option to install the desired plugin(s), the Jenkins dashboard displays a page detailing the status of what you're installing.

    ![Installation status of installing the Azure Container Agents plugins from the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-install-aks-agent-plugin-confirmation.png)

    Select **Go back to the top page** to return the main page of the Jenkins dashboard.

### Install the plugin manually
If you want to try the latest features for a given Jenkins plugin before it's officially released, you can also manually install the plugin using the following steps:

1. Clone the repo and build:

    ```bash
    mvn package
    ```

1. Open your Jenkins dashboard, go to Manage Jenkins -> Manage Plugins

1. Go to Advanced tab, under Upload Plugin section, click Choose File.

1. Select **azure-container-agents.hpi** in target folder of your repo, click Upload.

1. Restart your Jenkins instance after install is completed.

## Next steps
You learned how to:

> [!div class="checklist"]
> * 