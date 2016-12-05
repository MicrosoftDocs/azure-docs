---
title: How to use the Azure slave plugin with Jenkins Continuous Integration | Microsoft Docs
description: Describes how to use the Azure slave plugin with Jenkins Continuous Integration.
services: virtual-machines-linux
documentationcenter: ''
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 09233bd4-957d-41bf-bccc-9dd2355ed1bf
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-multiple
ms.devlang: java
ms.topic: article
ms.date: 10/19/2016
ms.author: robmcm

---
# How to use the Azure Slave Plugin with Jenkins Continuous Integration
The Azure slave plugin for Jenkins makes it easy to provision slave nodes on Azure when running distributed builds, and it supports creating:

* Windows slaves on Azure Cloud using SSH and the Java Network Launch Protocol (JNLP)
  
  * To launch a Windows image via SSH, the image will need to be pre-configured with SSH.
  * For information about preparing a custom Windows image, see [How to capture a Windows virtual machine in the Resource Manager deployment model][windows-image-capture].
* Linux slaves on Azure Cloud using SSH
  
  * For information about preparing a custom linux image, see [How to capture a Linux virtual machine to use as a Resource Manager template][linux-image-capture].

### Prerequisites
Before working through the steps in this article, you will need to register and authorize your client application, and then retrieve your Client ID and Client Secret which will be sent to Azure Active Directory during authentication. For more information on these prerequisites, see the following articles:

* [Integrating applications with Azure Active Directory][integrate-apps-with-AAD]
* [Register a Client App][register-client-app]

In addition, to complete the steps in the [Create a Jenkins Job which runs on a Slave Node on Azure](#create-jenkins-project) section of this article, you will need to have a project setup on GitHub.

<a name="install-azure-slave-plugin"></a>

## Install the Azure Slave Plugin
1. In the Jenkins dashboard, click **Manage Jenkins**.
   
    ![Manage Jenkins][jenkins-dashboard-manage]
2. On the **Manage Jenkins** page, click **Manage Plugins**.
   
    ![Manage Plugins][jenkins-manage-plugins]
3. Click the **Available** tab and enter "Azure" as a filter, then select the **Azure Slave Plugin**. 
   
    ![Azure Slave Plugin][search-plugins]
   
    If you choose to scroll through the list of available plugins, you will find the Azure slave plugin listed under the **Cluster Management and Distributed Build** section.
4. Click **Install without restart** or **Download now and install after restart**.
   
    ![Install Plugin][install-plugin]

Now that the plugin is installed, the next steps are to configure the plugin with your Azure subscription profile and to create a template that will be used in creating the virtual machine for the slave node.

## Configure the Azure Slave Plugin to use your Subscription Profile
A subscription profile, also referred to as publish settings, is an XML file that contains secure credentials and some additional information you'll need to work with Azure in your development environment. To configure the Azure slave plugin, you will need:

* Your subscription id
* A management certificate for your subscription

These can be found in your [subscription profile], which may resemble the following an example:

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

After you have your subscription profile, follow these steps to configure the Azure slave plugin:

1. In the Jenkins dashboard, click **Manage Jenkins**.
   
    ![Manage Jenkins][jenkins-dashboard-manage]
2. Click **Configure System**.
   
    ![Configure System][jenkins-configure-system]
3. Scroll down the page to find the **Cloud** section.
4. Click **Add a new cloud** and then select **Microsoft Azure**.
   
    ![Add a new cloud][cloud-section]
   
    This will show the fields where you need to enter your subscription details.
   
    ![Subscription Configuration][subscription-configuration]
5. Copy the subscription id and management certificate values from your subscription profile and paste them in the appropriate fields.
   
    When copying the subscription id and management certificate, do not include the quotes that enclose the values.
6. Click **Verify Configuration** to check if the parameters you specified are valid, and then click **Save**.

## Set up a Virtual Machine Template for the Azure Slave Plugin
In this section you will add a virtual machine template which defines the parameters that the Azure slave plugin will use to create a slave node on Azure. In the following steps, you'll create a template for an Ubuntu virtual machine.

1. In the Jenkins dashboard, click **Manage Jenkins**.
   
    ![Manage Jenkins][jenkins-dashboard-manage]
2. Click **Configure System**.
   
    ![Configure System][jenkins-configure-system]
3. Scroll down the page to find the **Cloud** section.
4. In the **Cloud** section, find **Add Azure Virtual Machine Template** for the cloud which you added in the previous section, and then click **Add**.
   
    ![Add Azure Virtual Machine Template][add-vm-template]
   
    Jenkins will display a form which contains the fields where you enter details about the template you are creating.
   
    ![Blank General Configuration][blank-general-configuration]
5. Enter the **General Configuration** information for your template:
   
   1. In the **Name** box, enter provide a name for your new template; is only for your use is not used in provisioning a virtual machine.
   2. In the **Description** box, enter text that describes the template you are creating. This is only for your records and is not used in provisioning a virtual machine.
   3. The **Labels** box is used to identify the template you are creating and is subsequently used to reference the template when creating a Jenkins job. For our purpose, enter "**linux**" in this box.
   4. In the **Region** list, click the Azure region where the virtual machine will be created.
   5. In the **Virtual Machine Size** list, choose the appropriate size from the drop-down menu.
   6. In the **Storage Account Name** box, specify a storage account where the virtual machine will be created. If you want Jenkins to create a storage account by using the default value "jenkinsarmst", you can leave this box blank.
   7. **Retention Time** specifies the number of minutes before Jenkins deletes an idle slave; leave this at the default value of 60.
      
      * You can also choose to shut down the slave instead of deleting it when it's idle. To do that, select the **Shutdown Only (Do Not Delete) After Retention Time** check box.
      * You can also specify 0 if you do not want idle slaves to be deleted automatically.
   8. In the **Usage** list, you can choose from the following options:
      
      * **Utilize this node as much as possible** - Jenkins may run any job on the slave as long as it is available.
      * **Leave this node for tied jobs only** - Jenkins will only build a project (or job) on this node when that project specifically was tied to that node; this allows a slave to be reserved for certain kinds of jobs.
      
      For this tutorial, click **Utilize this node as much as possible**.
      
      At this point, your form should look somewhat similar to this:
      
      ![General Template Config][general-template-config]
6. Provide the **Image Configuration** for your template:
   
   1. For the image family, you have two options:
      
      * **Custom User Image** - this option requires you to provide the URL to a custom image which is in the same storage account where you are going to create slave nodes.
      * **Image Reference** - this option requires you to specify the *Publisher*, *Offer*, and *Sku* for an image, which you can find in the [Azure Virtual Machines Marketplace][azure-images].
        
        For this tutorial, choose **Image Reference** and use the following values:
      * **Image Publisher**: Canonical
      * **Image Offer**: UbuntuServer
      * **Image Sku**: 14.04.4-LTS
   2. For the **Launch Method** list, you have two options: **SSH** or **JNLP**. For the purpose of this tutorial, choose **SSH**. However, there are several caveats which you need to consider when choosing your launch method:
      
      * Linux slaves can only be launched using SSH.
      * Windows slaves can use either SSH or JNLP, but when SSH is used for Windows slaves, the image must be custom prepared with an SSH server.
        
        When you are using JNLP as the launch method, you need to make sure the following items are configured:
      * The Azure slave needs to be able to reach the Jenkins URL, so you need to configure any firewalls accordingly. You can find your Jenkins URL by clicking **Manage Jenkins**, then **Configure System**, and look for the **Jenkins Location** section.
   3. The Azure slave which is launched using JNLP needs to be able to reach the Jenkins TCP Port; for that reason, it is recommended that you use a fixed TCP port so you can configure any firewalls accordingly. You can specify your Jenkins TCP port by clicking **Manage Jenkins**, then **Configure Global Security**, check the options to **Enable security** and use a **Fixed** port, and then specify the port to use.
   4. For the **Init Script**, you need to provide an initialization script will be executed after the virtual machine is created, with the following considerations:
      
      * At a minimum, your script should install Java.
      * If you are using JNLP, the initialization script must be written in PowerShell.
      * If your initialization script is expected to take a long time to execute, for example to install a large series of packages, it is recommended that prepare a custom image with all the necessary software pre-installed rather than installing through you initialization script.
        
        For this tutorial, copy the script below and paste it in the **Init Script** box:
        
              # Install Java
              sudo apt-get -y update
              sudo apt-get install -y openjdk-7-jdk
              sudo apt-get -y update --fix-missing
              sudo apt-get install -y openjdk-7-jdk
              # Install git
              sudo apt-get install -y git
              # Install ant
              sudo apt-get install -y ant
              sudo apt-get -y update --fix-missing
              sudo apt-get install -y ant
        
        In the above example, the initialization script installs *Java*, *Git*, and *ant*.
   5. In the **Username** and **Password** boxes, enter your preferred values for the administrator account that will be created on your virtual machine.
      
      At this point, your form should look somewhat similar to this:
      
      ![Jenkins Image Configuration][jenkins-image-configuration]
7. Click **Verify Template** to check if the parameters you specified are valid, and then click **Save**.
   
    ![Jenkins Save Template][jenkins-save-template]

<a name="create-jenkins-project"></a>

## Create a Jenkins Job which runs on a Slave Node on Azure
In this section, you'll be creating a Jenkins task that will run on a slave node on Azure. To complete these steps, you will need to have a project up on GitHub.

1. In the Jenkins dashboard, click **New Item**.
   
    ![Jenkins Dashboard New Item][jenkins-dashboard-new-item]
2. Enter a name for the task you are creating, click **Freestyle project** for the project type, and then click **OK**.
   
    ![Jenkins Create New Iem][jenkins-create-new-item]
3. In the task configuration page, select **Restrict where this project can be run**, and enter "**linux**" in the **Label Expression** box; this value matches the label for the slave template which you created in the previous section.
   
    ![Jenkins New Item Restrict][jenkins-new-item-restrict]
4. In the **Build** section, click **Add build step** and select **Execute shell**.
   
    ![Jenkins New Item Build][jenkins-new-item-build]
5. Edit the following script, replacing **(your GitHub account name)**, **(your project name)**, and **(your project directory)** with appropriate values, and paste the edited script in the text area that appears.
   
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
   
    Your form should resemble the following example:
   
    ![Jenkins New Item Script][jenkins-new-item-script]
6. When you have completed all of the configuration steps, click **Save**.
   
    ![Jenkins New Item Save][jenkins-new-item-save]
7. In the Jenkins dashboard, click the drop-down arrow next to the project which you just created, then click **Build now**.
   
    ![Jenkins Build Now][jenkins-build-now]

Jenkins will create a slave node by using the template which you created in the previous section, and then it will execute the script which you specified in the build step for this task.

<a name="image-template-considerations"></a>

## Considerations when Working with Image Templates
The following sections contain some useful information for configuring various templates.

### When you are using Ubuntu Image Templates
* If your initialization script is expected to take a long time to execute, for example to install a large series of packages, it is recommended that prepare a custom Ubuntu image with all the necessary software pre-installed rather than installing through you initialization script.
* At a minimum, your script should install Java. As shown in earlier examples, you can use the following script to install Java, Git, and ant.
  
        # Install Java
        sudo apt-get -y update
        sudo apt-get install -y openjdk-7-jdk
        sudo apt-get -y update --fix-missing
        sudo apt-get install -y openjdk-7-jdk
        # Install git
        sudo apt-get install -y git
        # Install ant
        sudo apt-get install -y ant
        sudo apt-get -y update --fix-missing
        sudo apt-get install -y ant

### When you are using Windows Image Templates and JNLP Launch Method
* If your Jenkins master does not security configured:
  
  * Leave the **Init Script** field blank for the default script to execute on the slave.
* If your Jenkins master has security configured: 
  
  * Copy the script from [Windows Slaves Setup][windows-slaves-setup] and modify it with your Jenkins credentials.
  * At a minimum, the script needs to be modified with a Jenkins User ID and API token. To retrieve the API token for a user, use the following steps:
    
    1. In the Jenkins dashboard, click **People**.
    2. Click the appropriate user account.
    3. Click **Configure** in the left-side menu.
    4. Click **Show API Token...**.

<a name="see-also"></a>

## See Also
For more information about using Azure with Java, see the [Azure Java Developer Center].

For additional information about the Azure Slave Plugin for Jenkins, see the [Azure Slave Plugin] project on GitHub.

<!-- URL List -->

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure Slave Plugin]: https://github.com/jenkinsci/azure-slave-plugin/
[subscription profile]: http://go.microsoft.com/fwlink/?LinkID=396395
[azure-images]: https://azure.microsoft.com/marketplace/virtual-machines/all/
[integrate-apps-with-AAD]: http://msdn.microsoft.com/library/azure/dn132599.aspx
[register-client-app]: http://msdn.microsoft.com/dn877542.aspx
[windows-slaves-setup]: https://gist.github.com/snallami/5aa9ea2c57836a3b3635

<!-- IMG List -->

[jenkins-dashboard-manage]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-dashboard-manage.png
[jenkins-manage-plugins]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-manage-plugins.png
[jenkins-configure-system]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-configure-system.png
[jenkins-dashboard-new-item]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-dashboard-new-item.png
[search-plugins]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/search-for-azure-plugin.png
[install-plugin]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/install-plugin.png
[jenkins-create-new-item]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-create-new-item.png
[cloud-section]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-cloud-section.png
[subscription-configuration]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-account-configuration-fields.png
[add-vm-template]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-add-vm-template.png
[blank-general-configuration]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-slave-template-general-configuration-blank.png
[general-template-config]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-slave-template-general-configuration.png
[jenkins-new-item-restrict]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-new-item-restrict.png
[jenkins-new-item-build]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-new-item-build.png
[jenkins-new-item-script]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-new-item-script.png
[jenkins-new-item-save]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-new-item-save.png
[jenkins-build-now]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-build-now.png
[jenkins-image-configuration]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-image-configuration.png
[jenkins-save-template]: ./media/virtual-machines-azure-slave-plugin-for-jenkins/jenkins-save-template.png
[windows-image-capture]: ./virtual-machines-windows-classic-capture-image.md
[linux-image-capture]: ./virtual-machines-linux-capture-image.md
