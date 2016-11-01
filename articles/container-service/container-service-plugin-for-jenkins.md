<properties
	pageTitle="Azure Container Service Plugin for Jenkins | Microsoft Azure"
	description="Deploy a docker container to an Azure Container Service cluster service by using the Azure Container Service Plugin for Jenkins."
	services="container-service"
	documentationCenter=""
	authors="rmcmurray"
	manager="erikre"
	editor=""
	tags="azure-container-service, jenkins"
	keywords="Azure, Containers, Jenkins"/>

<tags
	ms.service="container-service"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="10/19/2016" 
	ms.author="robmcm"/>

# Azure Container Service Plugin for Jenkins

The Azure Container Service Plugin for Jenkins helps simplify the process of deploying [Docker] containers using [Marathon] to an Azure Container Cluster running a distributed processing system like [Mesosphere's Datacenter Operating System (DC/OS)][mesosphere] or [Apache Mesos][mesos].

This tutorial will show you how to install the Azure Container Service Plugin for Jenkins, and how to configure a Jenkins project which will create an Azure Container Service with Marathon and a DC/OS orchestrator and use Marathon to deploy a Docker container to the cluster. If the Azure Container Service cluster does not exist, Jenkins will create the container cluster and use Marathon to deploy your docker container to the cluster when it is created; otherwise, Jenkins will deploy your docker container to the existing Azure Container Service cluster using Marathon.

For more information about the Azure Container Service, see the [Azure Container Service introduction][acs-intro] article.

### Prerequisites

Before working through the steps in this article, you will need to register and authorize your client application, and then retrieve your Client ID and Client Secret which will be sent to Azure Active Directory during authentication. For more information on these prerequisites, see the following articles:

* [Integrating applications with Azure Active Directory][integrate-apps-with-AAD]
* [Register a Client App][register-client-app]

In addition, you will need to download the **azure-acs-plugin.hpi** file from the following URL:

* [https://github.com/Microsoft/azure-acs-plugin/tree/master/install](https://github.com/Microsoft/azure-acs-plugin/tree/master/install)

## How to Install the Azure Container Service Plugin for Jenkins

1. [Download the **azure-acs-plugin.hpi** file from GitHub][azure-acs-plugin-install]

1. Log into your Jenkins dashboard.

1. In the dashboard, click **Manage Jenkins**.

    ![Manage Jenkins][jenkins-dashboard]

1. In the **Manage Jenkins** page, click **Manage Plugins**.

    ![Manage Plugins][manage-jenkins]

1. Click the **Advanced** tab, and click **Browse** in the **Upload Plugin** section. Navigate to the location where you downloaded the **azure-acs-plugin.hpi** file in the **Prerequisites**, and click the **Upload** once you have selected the file.

    ![Upload Plugin][upload-plugin]

1. Restart Jenkins if necessary.
 
## Configure the Azure Container Service Plugin

1. In your Jenkins dashboard, click one of your projects.

    ![Select Project][select-project]

1. When your project's page appears, click **Configure** in the left-side menu.

    ![Configure Project][configure-project]

1. In the **Post-build Actions** section, click the **Add post-build action** drop down menu and select **Azure Container Service Configuration**. 

    ![Advanced Options][advanced-options]

1. When the **Azure Container Service Configuration** section appears, enter your subscription ID, Client ID, Client Secret and OAuth 2.0 Token Endpoint information.

    ![Azure Container Service Config][azure-container-service-config]

1. In the **ACS Profile Configuration** section, enter your Region, DNS Name Prefix, Agent Count, Agent VM Size, Admin Username, Master Count, and SSH RSA Public Key.

    ![ACS Profile Configuration][acs-profile-configuration]

1. In the **Marathon Profile Configuration** section, enter path to your the Marathon config file, your SSH RSA private file path, and your SSH RSA private file password.

    ![Marathon Profile Configuration][marathon-profile-configuration]

1. Click **Save** to save the settings for your project.

    ![Save Project][save-project]

1. Click **Build Now** in the left-side menu.

    ![Build Project][build-project]

After the build has completed, the logs will be available in the builds console logs.

> [AZURE.NOTE] If the Azure Container Service cluster does not exist, Jenkins will create the container cluster and use Marathon to deploy your docker container to the cluster when it is created; otherwise, Jenkins will deploy your docker container to the existing Azure Container Service cluster using Marathon.

<a name="see-also"></a>
## See Also

For more information about working with Azure Container Service and DC/OS clusters, see the following articles:

* [Azure Container Service Introduction][acs-intro]
* [Deploy an Azure Container Service Cluster][acs-deploy]
* [Connect to an Azure Container Service Cluster][acs-connect]
* [Container Management through the Web UI][acs-webui-management]

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[azure-acs-plugin-install]: https://github.com/Microsoft/azure-acs-plugin/tree/master/install
[acs-intro]: ./container-service-intro.md
[acs-deploy]: ./container-service-deployment.md
[acs-connect]: ./container-service-connect.md
[acs-webui-management]: ./container-service-mesos-marathon-ui.md
[integrate-apps-with-AAD]: http://msdn.microsoft.com/library/azure/dn132599.aspx
[register-client-app]: http://msdn.microsoft.com/dn877542.aspx

[Marathon]: https://mesosphere.github.io/marathon/
[Docker]: http://docker.io/
[mesosphere]: https://mesosphere.com/products/
[mesos]: https://mesos.apache.org/

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/

<!-- IMG List -->

[jenkins-dashboard]: ./media/container-service-plugin-for-jenkins/jenkins-dashboard.png
[manage-jenkins]: ./media/container-service-plugin-for-jenkins/manage-jenkins.png
[search-plugins]: ./media/container-service-plugin-for-jenkins/search-for-azure-plugin.png
[install-plugin]: ./media/container-service-plugin-for-jenkins/install-plugin.png
[select-project]: ./media/container-service-plugin-for-jenkins/select-project.png
[configure-project]: ./media/container-service-plugin-for-jenkins/configure-project.png
[advanced-options]: ./media/container-service-plugin-for-jenkins/advanced-options.png
[azure-container-service-config]: ./media/container-service-plugin-for-jenkins/azure-container-service-configuration.png
[acs-profile-configuration]: ./media/container-service-plugin-for-jenkins/acs-profile-configuration.png
[marathon-profile-configuration]: ./media/container-service-plugin-for-jenkins/marathon-profile-configuration.png
[save-project]: ./media/container-service-plugin-for-jenkins/save-project.png
[build-project]: ./media/container-service-plugin-for-jenkins/build-project.png
[upload-plugin]: ./media/container-service-plugin-for-jenkins/upload-plugin.png
