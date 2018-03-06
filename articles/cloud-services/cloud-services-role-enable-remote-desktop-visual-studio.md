---
title: Enable Remote Desktop Connection for a Role in Azure Cloud Services | Microsoft Docs
description: How to configure your Azure cloud service application to allow remote desktop connections
services: cloud-services
documentationcenter: na
author: kraigb
manager: ghogen
editor: ''

ms.assetid: f5727ebe-9f57-4d7d-aff1-58761e8de8c1
ms.service: multiple
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/06/2018
ms.author: kraigb

---
# Enable Remote Desktop Connection for a Role in Azure Cloud Services using Visual Studio

> [!div class="op_single_selector"]
> * [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md)
> * [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md)
> * [Visual Studio](cloud-services-role-enable-remote-desktop-visual-studio.md)

Remote Desktop enables you to access the desktop of a role running in Azure. You can use a Remote Desktop connection to troubleshoot and diagnose problems with your application while it is running.

The publish wizard that Visual Studio provides for cloud services includes an option to enable Remote Desktop during the publishing process, using credentials that you provide. Using this option is suitable when using Visual Studio 2017 version 15.4 and earlier.

With Visual Studio 2017 version 15.5 and later, however, it's recommended that you avoid enabling Remote Desktop through the publish wizard unless you're working only as a single developer. For any situation in which the project might be opened by other developers, you instead enable Remote Desktop through the Azure portal, through PowerShell, or from a release definition in a continuous deployment workflow. This recommendation is due to a change in how Visual Studio communicates with Remote Desktop on the cloud service VM, as is explained in this article.

## Configure Remote Desktop through Visual Studio 2017 version 15.4 and earlier

When using Visual Studio 2017 version 15.4 and earlier, you can use the **Enable Remote Desktop for all roles** option in the publish wizard. You can still use the wizard with Visual Studio 2017 version 15.5 and later, but don't use the Remote Desktop option.

1. In Visual Studio, start the publish wizard by right-clicking your cloud service project in Solution Explorer and choosing **Publish**.

2. Sign into your Azure subscription if needed and select **Next**.

3. On the **Settings** page, select **Enable Remote Desktop for all roles**, then select the **Settings...** link to open the **Remote Desktop Configuration** dialog box.

4. At the bottom of the dialog box, select **More Options**. This command displays a drop-down list in which you create or choose a certificate so that you can encrypt credentials information when connecting via remote desktop.

   > [!Note]
   > The certificates that you need for a remote desktop connection are different from the certificates that you use for other Azure operations. The remote access certificate must have a private key.

5. Select a certificate from the list or choose **&lt;Create...&gt;**. If creating a new certificate, provide a friendly name for the new certificate when prompted and select **OK**. The new certificate appears in the drop-down list box.

6. Provide a user name and a password. You can’t use an existing account. Don’t use "Administrator" as the user name for the new account.

7. Choose a date on which the account will expire and after which Remote Desktop connections will be blocked.

8. After you've provided all the required information, select **OK**. Visual Studio adds the Remote Desktop settings to your project's `.cscfg` and `.csdef` files, including the password that's encrypted using the chosen certificate.

9. Complete any remaining steps using the **Next** button, then select **Publish** when you’re ready to publish your cloud service. If you're not ready to publish, select **Cancel** and answer **Yes** when prompted to save changes. You can publish your cloud service later with these settings.

## Configure Remote Desktop when using Visual Studio 2017 version 15.5 and later

With Visual Studio 2017 version 15.5 and later, you can still use the publish wizard with a cloud service project. You can also use the **Enable Remote Desktop for all roles** option if you're working only as a single developer.

If you're working as part of a team, on the other hand, you should instead enable remote desktop on the Azure cloud service by using either the [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md) or [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md).

This recommendation is due to a change in how Visual Studio 2017 version 15.5 and later communicates with the cloud service VM. When enabling Remote Desktop through the publish wizard, earlier versions of Visual Studio communicate with the VM through what's called the "RDP plugin." The plugin forces the VM to run an installer than can potentially hang the computer. Visual Studio 2017 version 15.5 and later communicates instead using the "RDP extension" that doesn't use and installer and thus doesn't risk hanging the VM. This change was also introduced because the Azure portal and PowerShell methods to enable Remote Desktop also use the RDP extension.

The caveat is that when Visual Studio communicates with the RDP extension, it must transmit a plain text password over SSL. However, the project's configuration files store only an encrypted password, which can be decrypted into plain text only with the local certificate that was originally used to encrypt it.

If you deploy the cloud service project from the same development computer each time, then that local certificate is available. In this case you can still use the **Enable Remote Desktop for all roles** option in the publish wizard.

If you or other developers want to deploy the cloud service project from different computers, however, then those other computers won't have the necessary certificate to decrypt the password. As a result, you see the following error message:

```output
Applying remote desktop protocol (RDP) extension.
Certificate with thumbprint [thumbprint] doesn't exist.
```

You can, of course, change the password every time you deploy the cloud service, but that action becomes inconvenient for everyone who needs to use Remote Desktop.

If you're sharing the project with a team, then, it's best to clear the option in the publish wizard and instead enable Remote Desktop directly through the [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md) or by using [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md).

> [!Tip]
> When deploying the cloud service through a release definition (as with on Visual Studio Team Services), set the `ForceRDPExtensionOverPlugin` variable to `true` to make sure the deployment works with the RDP extension rather than the RDP plugin.

## Connect to an Azure Role by using Remote Desktop

After you publish your cloud service on Azure and have enabled Remote Desktop, you can use Visual Studio Server Explorer to log into the cloud service VM:

1. In Server Explorer, expand the **Azure** node, and then expand the node for a cloud service and one of its roles to display a list of instances.

2. Right-click an instance node and select **Connect Using Remote Desktop**.

3. Enter the user name and password that you created previously. You are now logged into your remote session.
