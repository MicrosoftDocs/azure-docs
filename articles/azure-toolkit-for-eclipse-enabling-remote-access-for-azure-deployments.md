<properties
    pageTitle="Enabling Remote Access for Azure Deployments in Eclipse"
    description="Learn how to enable remote access for Azure deployments using the Azure Toolkit for Eclipse."
    services=""
    documentationCenter="java"
    authors="rmcmurray"
    manager="wpickett"
    editor=""/>

<tags
    ms.service="multiple"
    ms.workload="na"
    ms.tgt_pltfrm="multiple"
    ms.devlang="Java"
    ms.topic="article"
    ms.date="06/24/2016" 
    ms.author="robmcm"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh690951.aspx -->

# Enabling Remote Access for Azure Deployments in Eclipse

To help troubleshoot your deployments, you may enable and use Remote Access to connect to the virtual machine hosting your deployment. The Remote Access functionality relies on the Remote Desktop Protocol (RDP). You can configure Remote Access for your deployment after you have published it to Azure, or if you are using Eclipse with a Windows operating system, you can configure Remote Access before you publish to Azure. Note that you will need a remote desktop client that is compatible with your operating system in order to connect to your deployment's virtual machine in Azure.

## How to enable Remote Access before you deploy to Azure

> [AZURE.NOTE] To enable Remote Access before you deploy your application to Azure, you need to be running Eclipse on Windows.

The following image shows the **Remote Access** properties dialog used to enable remote access.

![][ic719494]

There are two ways to display the **Remote Access** properties dialog:

* Click the **Advanced** link in the **Remote Access** section of the **Publish to Azure** dialog.
* Open the **Properties** dialog of your Azure project.

When you create a new Azure deployment project, the project will not have Remote Access enabled by default. However, you can easily enable remote access by specifying the user name and password in the **Publish to Azure** dialog. The Remote Access password is encrypted using X.509 certificates. If you do not use provide your own certificate, the encryption relies on a self-signed certificate shipped with the Azure Plugin for Eclipse. This self-signed certificate is in the **cert** folder of your Azure project, stored both as a public certificate file (SampleRemoteAccessPublic.cer) and as a Personal Information Exchange (PFX) certificate file (SampleRemoteAccessPrivate.pfx). The latter contains the private key for the certificate, and it has a default password, **Password1**. However, since this password is public knowledge, the default certificate should be used only for learning purposes, not for a production deployment. So other than for learning purposes, when you want to enabled remote sessions for your deployments, you should click the **Advanced** link in the **Publish to Azure** dialog to specify your own certificate. Note that you'll need to upload the PFX version of the certificate to your hosted service within the Azure Management Portal, so that Azure can decrypt the user password.

The remainder of the tutorial shows you how to enable remote access for an Azure deployment project that was initially created with remote access disabled. For purposes of this tutorial, we'll create a new self-signed certificate, and its .pfx file will have a password of your choice. You also have the option of using a certificate issued by a certificate authority.

## How to enable Remote Access after you have deployed to Azure

To enable remote access after you have deployed to Azure, use the following steps:

1. Log into the Azure management portal using your Azure account
1. In your list of **Cloud Services**, select your deployed cloud service
1. In the cloud service web page, click the **Configure** link
1. On the bottom of the configuration page, click the **Remote** link
1. When the pop-up dialog box appears:
    * Specify the Role you for which you want to enable remote access
    * Click to select the **Enable Remote Desktop** checkbox
    * Specify a user name and password you want to use for remote access
    * Select the certificate to use
1. Click **OK** 

You will see a message stating that your configuration change is in progress, which may take a few minutes to complete. After the configuration change has completed, follow the steps in the **To log in remotely** section later in this article.
	
## How to enable Remote Access in your package

1. Within Eclipse's Project Explorer pane, right-click your Azure project and click **Properties**.

1. In the **Properties** dialog, expand **Azure** in the left-hand pane and click **Remote Access**.

1. In the **Remote Access** dialog, ensure **Enable all roles to accept Remote Desktop Connections with these login credentials** is checked.

1. Specify a user name for the Remote Desktop connection.

1. Specify and confirm the password for the user. The user name and password values set in this dialog will be used when you make a Remote Desktop connection. (Note that this is a separate password from your PFX password.)

1. Specify the expiration date for the user account.

1. Click **New** to create a new self-signed certificate. (Alternatively, you could select a certificate from your workspace or file system through the **Workspace** or **FileSystem** buttons, respectively, but for purposes of this tutorial we'll create a new certificate.)

    * In the **New Certificate** dialog, specify and confirm the password you'll use for your PFX file.

    * Accept the value provided for **Name (CN)**, or use a custom name.

    * Specify the path and file name where the new certificate, in .cer form, will be saved. For this step and the next step, you could use the **cert** folder of your Azure project, but you're free to choose another location. For purposes of this tutorial, we'll use **c:\mycert\mycert.cer**. (Create the **c:\mycert** folder prior to proceeding, or use an existing folder if desired.)

    * Specify the path and file name where the new certificate and its private key, in .pfx form, will be saved. For purposes of this tutorial, we'll use **c:\mycert\mycert.pfx**. Your **New Certificate** dialog should look similar to the following (update the folder paths if you did not use **c:\mycert**):

        ![][ic712275]

    * Click **OK** to close the **New Certificate** dialog.

1. Your **Remote Access** dialog should look similar to the following:</p>

    ![][ic719495]

1. Click **OK** to close the **Remote Access** dialog.
	
Rebuild your application, with the build set for deployment to cloud.

## To log in remotely

Once your role instance is ready, you can remotely log in to the virtual machine that is hosting your application.

* If are using Eclipse on Windows and you selected the **Start remote desktop on deploy** option during your deployment to Azure, you will be presented with a Remote Desktop Connection logon screen when your deployment starts. When you are prompted for the user name and password, enter the values that you specified for the remote user and will be able to log in.

* Another way to log in remotely is through the <a href="http://go.microsoft.com/fwlink/?LinkID=512959">Azure Management Portal</a>:

    * Within the **Cloud Services** view of the Azure Management portal, click your cloud service, click **Instances**, click a specific instance, and then click the **Connect** button. The **Connect** button appears as the following in the command bar:

        ![][ic659273]

    * After clicking the **Connect** button, you will be prompted to open an RDP file. Open the file and follow the prompts. (You could also save this file to your local computer, and then run the file by double-clicking it to remote log in to your virtual machine without needing to first go the management portal.)

    * When you are prompted for the user name and password, enter the values that you specified for the remote user and will be able to log in.

> [AZURE.NOTE] If you are on a non-Windows operating system, you need to use a Remote Desktop client that is compatible with your operating system and follow the steps to configure that client with the settings in the RDP file that you downloaded.

## See Also

[Azure Toolkit for Eclipse][]

[Creating a Hello World Application for Azure in Eclipse][]

[Installing the Azure Toolkit for Eclipse][] 

For more information about using Azure with Java, see the [Azure Java Developer Center][].

<!-- URL List -->

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547
[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699529
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546

<!-- IMG List -->

[ic712275]: ./media/azure-toolkit-for-eclipse-enabling-remote-access-for-azure-deployments/ic712275.png
[ic719495]: ./media/azure-toolkit-for-eclipse-enabling-remote-access-for-azure-deployments/ic719495.png
[ic719494]: ./media/azure-toolkit-for-eclipse-enabling-remote-access-for-azure-deployments/ic719494.png
[ic659273]: ./media/azure-toolkit-for-eclipse-enabling-remote-access-for-azure-deployments/ic659273.png
