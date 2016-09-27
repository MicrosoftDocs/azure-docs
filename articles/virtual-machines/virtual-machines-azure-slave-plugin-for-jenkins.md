<properties
	pageTitle="How to use the Azure slave plug-in with Jenkins Continuous Integration | Microsoft Azure"
	description="Describes how to use the Azure slave plug-in with Jenkins Continuous Integration."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="rmcmurray"
	manager="wpickett"
	editor="" />

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="java"
	ms.topic="article"
	ms.date="06/27/2016"
	ms.author="robmcm"/>

# How to use the Azure slave plug-in with Jenkins Continuous Integration

You can use the Azure slave plug-in for Jenkins to provision slave nodes on Azure when running distributed builds.

## Install the Azure slave plug-in

1. In the Jenkins dashboard, click **Manage Jenkins**.

1. On the **Manage Jenkins** page, click **Manage Plugins**.

1. Click the **Available** tab.

1. In the filter field above the list of available plug-ins, type **Azure** to limit the list to relevant plug-ins.

    If you opt to scroll through the list of available plug-ins, you will find the Azure slave plug-in under the **Cluster Management and Distributed Build** section.

1. Select the **Azure Slave Plugin** check box.

1. Click **Install without restart** or **Download now and install after restart**.

Now that the plug-in is installed, the next steps are to configure the plug-in with your Azure subscription profile and to create a template that will be used in creating the virtual machine for the slave node.


## Configure the Azure slave plug-in with your subscription profile

A subscription profile, also referred to as publish settings, is an XML file that contains secure credentials and some additional information you'll need to work with Azure in your development environment. To configure the Azure slave plug-in, you need:

* Your subscription id
* A management certificate for your subscription

These can be found in your [subscription profile]. Below is an example of a subscription profile.

	<?xml version="1.0" encoding="utf-8"?>

		<PublishData>

  		<PublishProfile SchemaVersion="2.0" PublishMethod="AzureServiceManagementAPI">

    	<Subscription

      		ServiceManagementUrl="https://management.core.windows.net"

      		Id="<Subscription ID value>"

      		Name="Pay-As-You-Go"
			ManagementCertificate="<Management certificate value>" />

  		</PublishProfile>

	</PublishData>

After you have your subscription profile, follow these steps to configure the Azure slave plug-in:

1. In the Jenkins dashboard, click **Manage Jenkins**.

1. Click **Configure System**.

1. Scroll down the page to find the **Cloud** section.

1. Click **Add new cloud > Microsoft Azure**.

    ![cloud section][cloud section]

    This will show the fields where you need to enter your subscription details.

    ![subscription configuration][subscription configuration]

1. Copy the subscription id and management certificate values from your subscription profile and paste them in the appropriate fields.

    When copying the subscription id and management certificate, do not include the quotes that enclose the values.

1. Click **Verify Configuration**.

1. When the configuration is verified to be correct, click **Save**.

## Set up a virtual machine template for the Azure slave plug-in

A virtual machine template defines the parameters that the plug-in will use to create a slave node on Azure. In the following steps, we'll create a template for an Ubuntu virtual machine.

1. In the Jenkins dashboard, click **Manage Jenkins**.

1. Click **Configure System**.

1. Scroll down the page to find the **Cloud** section.

1. In the **Cloud** section, find **Add Azure Virtual Machine Template**, and then click **Add**.

    ![add vm template][add vm template]

    This will show the fields where you enter details about the template you are creating.

    ![blank general configuration][blank general configuration]

1. In the **Name** box, enter an Azure cloud service name. If the name you entered refers to an existing cloud service, the virtual machine will be provisioned in that service. Otherwise, Azure will create a new one.

1. In the **Description** box, enter text that describes the template you are creating. This is only for your records and is not used in provisioning a virtual machine.

1. The **Labels** box is used to identify the template you are creating and is subsequently used to reference the template when creating a Jenkins job. For our purpose, enter **linux** in this box.

1. In the **Region** list, click the region where the virtual machine will be created.

1. In the **Virtual Machine Size** list, click the appropriate size.

1. In the **Storage Account Name** box, specify a storage account where the virtual machine will be created. Make sure that it is in the same region as the cloud service you'll be using. If you want new storage to be created, you can leave this box blank.

1. Retention time specifies the number of minutes before Jenkins deletes an idle slave. Leave this at the default value of 60. You can also choose to shut down the slave instead of deleting it when it's idle. To do that, select the **Shutdown Only (Do Not Delete) After Retention Time** check box.

1. In the **Usage** list, click the appropriate condition when this slave node will be used. For now, click **Utilize this node as much as possible**.

    At this point, your form should look somewhat similar to this:

    ![checkpoint general template config][checkpoint general template config]

    The next step is to provide details about the operating system image that you want your slave to be created in.

1. In the **Image Family or Id** box, you have to specify what system image will be installed on your virtual machine. You can either select from a list of image families or specify a custom image.

    If you want to select from a list of image families, enter the first character (case-sensitive) of the image family name. For instance, typing **U** will bring up a list of Ubuntu Server families. After you select from the list, Jenkins will use the latest version of that system image from that family when provisioning your virtual machine.

    ![OS Image list sample][OS Image list sample]

    If you have a custom image that you want to use instead, enter the name of that custom image. Custom image names are not shown in a list, so you have to ensure that the name is entered correctly.

    For this tutorial, type **U** to bring up a list of Ubuntu images, and then click **Ubuntu Server 14.04 LTS**.

1. In the **Launch Method** list, click **SSH**.

1. Copy the script below and paste it in the **Init Script** box.

		# Install Java

		sudo apt-get -y update

		sudo apt-get install -y openjdk-7-jdk

		sudo apt-get -y update --fix-missing

		sudo apt-get install -y openjdk-7-jdk

		# Install git

		sudo apt-get install -y git

		#Install ant

		sudo apt-get install -y ant

		sudo apt-get -y update --fix-missing

		sudo apt-get install -y ant

    The init script will be executed after the virtual machine is created. In this example, the script installs Java, Git, and ant.

1. In the **Username** and **Password** boxes, enter your preferred values for the administrator account that will be created on your virtual machine.

1. Click **Verify Template** to check if the parameters you specified are valid.

1. Click **Save**.


## Create a Jenkins job that runs on a slave node on Azure

In this section, you'll be creating a Jenkins task that will run on a slave node on Azure. You'll need to have your own project up on GitHub to follow along.

1. In the Jenkins dashboard, click **New Item**.

1. Enter a name for the task you are creating.

1. For the project type, click **Freestyle project**.

1. Click **Ok**.

1. In the task configuration page, select **Restrict where this project can be run**.

1. In the **Label Expression** box, enter **linux**. In the previous section, we created a slave template that we named **linux**, which is what we're specifying here.

1. In the **Build** section, click **Add build step** and select **Execute shell**.

1. Edit the following script, replacing **(your GitHub account name)**, **(your project name)**, and **(your project directory)** with appropriate values, and paste the edited script in the text area that appears.

		# Clone from git repo

		currentDir="$PWD"

		if [ -e (your project directory) ]; then

  			cd (your project directory)

  			git pull origin master

		else

  			git clone https://github.com/(your GitHub account name)/(your project name).git

		fi

		# change directory to project

		cd $currentDir/(your project directory)

		#Execute build task

		ant

1. Click **Save**.

1. In the Jenkins dashboard, hover over the task you just created and click the drop-down arrow to display task options.

1. Click **Build now**.

Jenkins will then create a slave node by using the template created in the previous section and execute the script you specified in the build step for this task.

## Next Steps

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[subscription profile]: http://go.microsoft.com/fwlink/?LinkID=396395

<!-- IMG List -->

[cloud section]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-cloud-section.png
[subscription configuration]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-account-configuration-fields.png
[add vm template]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-add-vm-template.png
[blank general configuration]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-slave-template-general-configuration-blank.png
[checkpoint general template config]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-slave-template-general-configuration.png
[OS Image list sample]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-os-family-list-sample.png