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
ms.date: 11/29/2017
ms.author: tarcher
ms.custom: jenkins
---

# Run a container as an agent in Jenkins using the Azure Container Agents plugin

The Azure Container Agents plugin for Jenkins enables you to quickly and easily get your Jenkins build agents running in the cloud. In this tutorial, you use Azure Container agent to add on-demand capacity and use Azure Container Instances (ACI) to build the [Spring PetClinic Sample Application](https://github.com/spring-projects/spring-petclinic). 

You learn how to:
> [!div class="checklist"]
> * Add an Azure service principal to the Jenkins credentials
> * Install the Azure Container Agents plugin for Jenkins

## Prerequisites

- **Azure subscription** - You need an Azure subscription to complete this tutorial. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
 
- **Jenkins Master** - Jenkins supports the *master/slave* pattern where the workload of building projects is delegated to multiple *slave* nodes. The master/slave pattern allows a single Jenkins installation to host a large number of projects or to provide different environments needed for builds or tests. If you don't currently have a Jenkins Master, start with the [solution template](install-jenkins-solution-template.md), which includes the Java Development Kit (JDK) version 8 and other required Jenkins plugins.

## Add an Azure service principal to the Jenkins credentials

You need an Azure service principal to deploy to Azure. 

1. [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest). While creating the principal, Make note of the values for the subscription ID, tenant, appId, and password.

1. Open the Jenkins dashboard.

1. Select **Credentials**.

    ![Manage credentials option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-credentials.png)

1. Under **Credentials**, select **System**.

    ![Manage system credentials option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-credentials-system.png)

1. Select **Global credentials (unrestricted)**.

    ![Manage global system credentials option on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-credentials-global.png)

1. Select **Adding some credentials**.

    ![Add credentials on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-adding-credentials.png)

1. In the **Kind** dropdown list, select **Microsoft Azure Service Principal** to cause the page to display fields specific to adding a service principal. Then, supply the requested values as follows:

    - Scope - Select the option for **Global (Jenkins, nodes, items, all child items, etc.)**.
    - Subscription ID - Use the Azure subscription ID you specified when running `az account set`.
    - Client ID - Use the `appId` value returned from `az ad sp create-for-rbac`.
    - Client Secret - Use the `password` value returned from `az ad sp create-for-rbac`.
    - Tenant ID - Use the `tenant` value returned from `az ad sp create-for-rbac`.
    - Azure Environment - Select `Azure`.
    - ID - Enter `myTestSp`. This value is used again later in this tutorial.
    - Description - (Optional) Enter a description value for this principal.

    ![Specify new service principal properties on the Jenkins dashboard](./media/azure-container-agents-plugin-run-container-as-an-agent/jenkins-dashboard-new-principal-properties.png)

1. Once you have entered the information defining the principal, you can optionally select **Verify Service Principal** to ensure that everything is working correctly. If your service principal is correctly defined, you see a message stating, "Successfully verified the Microsoft Azure Service Principal." below the **Description** field.

1. When you are finished, select **OK** to add the principal to Jenkins. The Jenkins dashboard displays the newly added principal on the **Global Credentials** page.

## Install the Azure Container Agents plugin for Jenkins

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

    To return the main page of the Jenkins dashboard, select **Go back to the top page**.

## Next steps

