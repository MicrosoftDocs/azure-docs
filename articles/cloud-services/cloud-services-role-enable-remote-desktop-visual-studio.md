---
title: Using Visual Studio, enable Remote Desktop for a Role (Azure Cloud Services classic)
description: How to configure your Azure cloud service application to allow remote desktop connections through Visual Studio.
ms.topic: article
ms.service: azure-cloud-services-classic
ms.date: 07/23/2024
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Enable Remote Desktop Connection for a Role in Azure Cloud Services (classic) using Visual Studio

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

> [!div class="op_single_selector"]
> * [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md)
> * [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md)
> * [Visual Studio](cloud-services-role-enable-remote-desktop-visual-studio.md)

Remote Desktop enables you to access the desktop of a role running in Azure, using Remote Desktop Protocol (RDP). You can use a Remote Desktop connection to troubleshoot and diagnose problems with your application while it runs.

The publish wizard that Visual Studio provides for cloud services includes an option to enable Remote Desktop during the publishing process, using credentials that you provide. Using this option is suitable when using Visual Studio 2017 version 15.4 and earlier.

With Visual Studio 2017 version 15.5 and later, we recommend you avoid enabling Remote Desktop through the publish wizard unless you're working as a single developer. For any situation in which multiple developers open the project, you should instead enable Remote Desktop through the Azure portal, through PowerShell, or from a release pipeline in a continuous deployment workflow. This recommendation is due to a change in how Visual Studio communicates with Remote Desktop on the cloud service virtual machine (VM), as is explained in this article.

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

7. Choose a date on which the account will expire. An expired account automatically blocks further Remote Desktop connections.

8. After you provide all the required information, select **OK**. Visual Studio adds the Remote Desktop settings to your project's `.cscfg` and `.csdef` files, including the password that's encrypted using the chosen certificate.

9. Complete any remaining steps using the **Next** button, then select **Publish** when you’re ready to publish your cloud service. If you're not ready to publish, select **Cancel** and answer **Yes** when prompted to save changes. You can publish your cloud service later with these settings.

## Configure Remote Desktop when using Visual Studio 2017 version 15.5 and later

With Visual Studio 2017 version 15.5 and later, you can still use the publish wizard with a cloud service project. You can also use the **Enable Remote Desktop for all roles** option if you're working only as a single developer.

If you're working as part of a team, you should instead enable remote desktop on the Azure cloud service by using either the [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md) or [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md).

This recommendation is due to a change in how Visual Studio 2017 version 15.5 and later communicates with the cloud service VM. When you enable Remote Desktop through the publish wizard, earlier versions of Visual Studio communicate with the VM through the "RDP plugin." Visual Studio 2017 version 15.5 and later communicates instead using the "RDP extension" that is more secure and more flexible. This change also aligns with the fact that the Azure portal and PowerShell methods to enable Remote Desktop also use the RDP extension.

When Visual Studio communicates with the RDP extension, it transmits a plain text password over Transport Layer Security (TLS). However, the project's configuration files store only an encrypted password, which can be decrypted into plain text only with the local certificate that was originally used to encrypt it.

If you deploy the cloud service project from the same development computer each time, then that local certificate is available. In this case, you can still use the **Enable Remote Desktop for all roles** option in the publish wizard.

However, if you or other developers want to deploy the cloud service project from different computers, then those other computers lack the necessary certificate to decrypt the password. As a result, you see the following error message:

```output
Applying remote desktop protocol extension.
Certificate with thumbprint [thumbprint] doesn't exist.
```

You could change the password every time you deploy the cloud service, but that action becomes inconvenient for everyone who needs to use Remote Desktop.

If you're sharing the project with a team, then it's best to clear the option in the publish wizard and instead enable Remote Desktop directly through the [Azure portal](cloud-services-role-enable-remote-desktop-new-portal.md) or by using [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md).

### Deploying from a build server with Visual Studio 2017 version 15.5 and later

You can deploy a cloud service project from a build server (for example, with Azure DevOps Services) on which Visual Studio 2017 version 15.5 or later is installed in the build agent. With this arrangement, deployment happens from the same computer on which the encryption certificate is available.

To use the RDP extension from Azure DevOps Services, include the following details in your build pipeline:

1. Include `/p:ForceRDPExtensionOverPlugin=true` in your MSBuild arguments to make sure the deployment works with the RDP extension rather than the RDP plugin. For example:

    ```
    msbuild AzureCloudService5.ccproj /t:Publish /p:TargetProfile=Cloud /p:DebugType=None
        /p:SkipInvalidConfigurations=true /p:ForceRDPExtensionOverPlugin=true
    ```

1. After your build steps, add the **Azure Cloud Service Deployment** step and set its properties.

1. After the deployment step, add an **Azure PowerShell** step, set its **Display name** property to "Azure Deployment: Enable RDP Extension" (or another suitable name), and select your appropriate Azure subscription.

1. Set **Script Type** to "Inline" and paste the following below into the **Inline Script** field. (You can also create a `.ps1` file in your project with this script, set **Script Type** to "Script File Path", and set **Script Path** to point to the file.)

    ```ps
    Param(
        [Parameter(Mandatory=$True)]
        [string]$username,

        [Parameter(Mandatory=$True)]
        [string]$password,

        [Parameter(Mandatory=$True)]
        [string]$serviceName,

        [Datetime]$expiry = ($(Get-Date).AddYears(1))
    )

    Write-Host "Service Name: $serviceName"
    Write-Host "User Name: $username"
    Write-Host "Expiry: $expiry"

    $securepassword = ConvertTo-SecureString -String $password -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential $username,$securepassword

    # Try to remote existing RDP Extensions
    try
    {
        $existingRDPExtension = Get-AzureServiceRemoteDesktopExtension -ServiceName $servicename
        if ($existingRDPExtension -ne $null)
        {
            Remove-AzureServiceRemoteDesktopExtension -ServiceName $servicename -UninstallConfiguration
        }
    }
    catch
    {
    }

    Set-AzureServiceRemoteDesktopExtension -ServiceName $servicename -Credential $credential -Expiration $expiry -Verbose
    ```

## Connect to an Azure Role by using Remote Desktop

After you publish your cloud service on Azure and enable Remote Desktop, you can use Visual Studio Server Explorer to log into the cloud service VM:

1. In Server Explorer, expand the **Azure** node, and then expand the node for a cloud service and one of its roles to display a list of instances.

2. Right-click an instance node and select **Connect Using Remote Desktop**.

3. Enter the user name and password that you created previously. You're now signed into your remote session.

## Next steps

* [How to Configure Cloud Services](cloud-services-how-to-configure-portal.md)
