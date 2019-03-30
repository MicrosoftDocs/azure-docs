---
title: How to use the Azure slave plug-in with Hudson Continuous Integration | Microsoft Docs
description: Describes how to use the Azure slave plug-in with Hudson Continuous Integration.
services: virtual-machines-linux
documentationcenter: ''
author: rmcmurray
manager: wpickett
editor: ''

ms.assetid: b2083d1c-4de8-4a19-a615-ccc9d9b6e1d9
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-multiple
ms.devlang: java
ms.topic: article
ms.date: 04/25/2017
ms.author: robmcm

---
# How to use the Azure slave plug-in with Hudson Continuous Integration
The Azure slave plug-in for Hudson enables you to provision slave nodes on Azure when running distributed builds.

## Install the Azure Slave plug-in
1. In the Hudson dashboard, click **Manage Hudson**.
2. In the **Manage Hudson** page, click on **Manage Plugins**.
3. Click the **Available** tab.
4. Click **Search** and type **Azure** to limit the list to relevant plug-ins.
   
    If you opt to scroll through the list of available plug-ins, you will find the Azure slave plug-in under the **Cluster Management and Distributed Build** section in the **Others** tab.
5. Select the checkbox for **Azure Slave Plugin**.
6. Click **Install**.
7. Restart Hudson.

Now that the plug-in is installed, the next steps would be to configure the plug-in with your Azure subscription profile and to create a template that will be used in creating the VM for the slave node.

## Configure the Azure Slave plug-in with your subscription profile
A subscription profile, also referred to as publish settings, is an XML file that contains secure credentials and some additional information you'll need to work with Azure in your development environment. To configure the Azure slave plug-in, you need:

* Your subscription id
* A management certificate for your subscription

These can be found in your [subscription profile]. Below is an example of a subscription profile.

    <?xml version="1.0" encoding="utf-8"?>

        <PublishData>

          <PublishProfile SchemaVersion="2.0" PublishMethod="AzureServiceManagementAPI">

        <Subscription

              ServiceManagementUrl="https://management.core.windows.net"

              Id="<Subscription ID>"

              Name="Pay-As-You-Go"
            ManagementCertificate="<Management certificate value>" />

          </PublishProfile>

    </PublishData>

Once you have your subscription profile, follow these steps to configure the Azure slave plug-in.

1. In the Hudson dashboard, click **Manage Hudson**.
2. Click **Configure System**.
3. Scroll down the page to find the **Cloud** section.
4. Click **Add new cloud > Microsoft Azure**.
   
    ![add new cloud][add new cloud]
   
    This will show the fields where you need to enter your subscription details.
   
    ![configure profile][configure profile]
5. Copy the subscription id and management certificate from your subscription profile and paste them in the appropriate fields.
   
    When copying the subscription id and management certificate, **do not** include the quotes that enclose the values.
6. Click on **Verify configuration**.
7. When the configuration is verified successfully, click **Save**.

## Set up a virtual machine template for the Azure Slave plug-in
A virtual machine template defines the parameters the plug-in will use to create a slave node on Azure. In the following steps we'll be creating template for an Ubuntu VM.

1. In the Hudson dashboard, click **Manage Hudson**.
2. Click on **Configure System**.
3. Scroll down the page to find the **Cloud** section.
4. Within the **Cloud** section, find **Add Azure Virtual Machine Template** and click the **Add** button.
   
    ![add vm template][add vm template]
5. Specify a cloud service name in the **Name** field. If the name you specify refers to an existing cloud service, the VM will be provisioned in that service. Otherwise, Azure will create a new one.
6. In the **Description** field, enter text that describes the template you are creating. This information is only for documentary purposes and is not used in provisioning a VM.
7. In the **Labels** field, enter **linux**. This label is used to identify the template you are creating and is subsequently used to reference the template when creating a Hudson job.
8. Select a region where the VM will be created.
9. Select the appropriate VM size.
10. Specify a storage account where the VM will be created. Make sure that it is in the same region as the cloud service you'll be using. If you want new storage to be created, you can leave this field blank.
11. Retention time specifies the number of minutes before Hudson deletes an idle slave. Leave this at the default value of 60.
12. In **Usage**, select the appropriate condition when this slave node will be used. For now, select **Utilize this node as much as possible**.
    
     At this point, your form would look somewhat similar to this:
    
     ![template config][template config]
13. In **Image Family or Id** you have to specify what system image will be installed on your VM. You can either select from a list of image families or specify a custom image.
    
     If you want to select from a list of image families, enter the first character (case-sensitive) of the image family name. For instance, typing **U** will bring up a list of Ubuntu Server families. Once you select from the list, Jenkins will use the latest version of that system image from that family when provisioning your VM.
    
     ![OS family list][OS family list]
    
     If you have a custom image that you want to use instead, enter the name of that custom image. Custom image names are not shown in a list so you have to ensure that the name is entered correctly.    
    
     For this tutorial, type **U** to bring up a list of Ubuntu images and select **Ubuntu Server 14.04 LTS**.
14. For **Launch method**, select **SSH**.
15. Copy the script below and paste in the **Init script** field.
    
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
    
     The **Init script** will be executed after the VM is created. In this example, the script installs Java, git, and ant.
16. In the **Username** and **Password** fields, enter your preferred values for the administrator account that will be created on your VM.
17. Click on **Verify Template** to check if the parameters you specified are valid.
18. Click on **Save**.

## Create a Hudson job that runs on a slave node on Azure
In this section, you'll be creating a Hudson task that will run on a slave node on Azure.

1. In the Hudson dashboard, click **New Job**.
2. Enter a name for the job you are creating.
3. For the job type, select **Build a free-style software job**.
4. Click **OK**.
5. In the job configuration page, select **Restrict where this project can be run**.
6. Select **Node and label menu** and select **linux** (we specified this label when creating the virtual machine template in the previous section).
7. In the **Build** section, click **Add build step** and select **Execute shell**.
8. Edit the following script, replacing **{your github account name}**, **{your project name}**, and **{your project directory}** with appropriate values, and paste the edited script in the text area that appears.
   
        # Clone from git repo
   
        currentDir="$PWD"
   
        if [ -e {your project directory} ]; then
   
              cd {your project directory}
   
              git pull origin master
   
        else
   
              git clone https://github.com/{your github account name}/{your project name}.git
   
        fi
   
        # change directory to project
   
        cd $currentDir/{your project directory}
   
        #Execute build task
   
        ant
9. Click on **Save**.
10. In the Hudson dashboard, find the job you just created and click on the **Schedule a build** icon.

Hudson will then create a slave node using the template created in the previous section and execute the script you specified in the build step for this task.

## Next Steps
For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[subscription profile]: https://go.microsoft.com/fwlink/?LinkID=396395

<!-- IMG List -->

[add new cloud]: ./media/virtual-machines-azure-slave-plugin-for-hudson/hudson-setup-addcloud.png
[configure profile]: ./media/virtual-machines-azure-slave-plugin-for-hudson/hudson-setup-configureprofile.png
[add vm template]: ./media/virtual-machines-azure-slave-plugin-for-hudson/hudson-setup-addnewvmtemplate.png
[template config]: ./media/virtual-machines-azure-slave-plugin-for-hudson/hudson-setup-templateconfig1-withdata.png
[OS family list]: ./media/virtual-machines-azure-slave-plugin-for-hudson/hudson-oslist.png

