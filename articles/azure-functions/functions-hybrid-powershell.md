---
title: Manage remote on-premises resources by using PowerShell functions
description: Learn how to configure Hybrid Connections in Azure Relay to connect a PowerShell function app to on-premises resources, which can then be used to remotely manage the on-premises resource.
author: eamono

ms.topic: conceptual
ms.date: 04/26/2020
ms.author: eamono
# Customer intent: As solution architect, I want to be able to connect my function app in Azure to on-premises resources so I can remotely manage those resources by using PowerShell functions.
---

# Managing hybrid environments with PowerShell in Azure Functions and App Service Hybrid Connections

The Azure App Service Hybrid Connections feature enables access to resources in other networks. You can learn more about this capability in the [Hybrid Connections](../app-service/app-service-hybrid-connections.md) documentation. This article describes how to use this capability to run PowerShell functions that target an on-premises server. This server can then be used to manage all resources in the on-premises environment from an Azure PowerShell function.


## Configure an on-premises server for PowerShell remoting

The following script enables PowerShell remoting, and it creates a new firewall rule and a WinRM https listener. For testing purposes, a self-signed certificate is used. In a production environment, we recommend that you use a signed certificate.

```powershell
# For configuration of WinRM, see
# https://docs.microsoft.com/windows/win32/winrm/installation-and-configuration-for-windows-remote-management.

# Enable PowerShell remoting.
Enable-PSRemoting -Force

# Create firewall rule for WinRM. The default HTTPS port is 5986.
New-NetFirewallRule -Name "WinRM HTTPS" `
                    -DisplayName "WinRM HTTPS" `
                    -Enabled True `
                    -Profile "Any" `
                    -Action "Allow" `
                    -Direction "Inbound" `
                    -LocalPort 5986 `
                    -Protocol "TCP"

# Create new self-signed-certificate to be used by WinRM.
$Thumbprint = (New-SelfSignedCertificate -DnsName $env:COMPUTERNAME  -CertStoreLocation Cert:\LocalMachine\My).Thumbprint

# Create WinRM HTTPS listener.
$Cmd = "winrm create winrm/config/Listener?Address=*+Transport=HTTPS @{Hostname=""$env:COMPUTERNAME ""; CertificateThumbprint=""$Thumbprint""}"
cmd.exe /C $Cmd
```

## Create a PowerShell function app in the portal

The App Service Hybrid Connections feature is available only in Basic, Standard, and Isolated pricing plans. When you create the function app with PowerShell, create or select one of these plans.

1. From the Azure portal menu or the **Home** page, select **Create a resource**.

1. In the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the function app settings as specified in the following table.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | The subscription under which this new function app is created. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  *myResourceGroup* | Name for the new resource group in which to create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Option to publish code files or a Docker container. |
    | **Runtime stack** | Preferred language | Choose PowerShell Core. |
    |**Version**| Version number | Choose the version of your installed runtime.  |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services your functions access. |

    :::image type="content" source="./media/functions-hybrid-powershell/function-app-create-basics.png" alt-text="Create a function app - Basics." border="true":::

1. Select **Next : Hosting**. On the **Hosting** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../storage/common/storage-account-create.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters in length and can contain numbers and lowercase letters only. You can also use an existing account, which must meet the [storage account requirements](../azure-functions/functions-scale.md#storage-account-requirements). |
    |**Operating system**| Preferred operating system | An operating system is pre-selected for you based on your runtime stack selection, but you can change the setting if necessary. |
    | **[Plan type](../azure-functions/functions-scale.md)** | **App service plan** | Choose **App service plan**. When you run in an App Service plan, you must manage the [scaling of your function app](../azure-functions/functions-scale.md).  |

    :::image type="content" source="./media/functions-hybrid-powershell/function-app-create-hosting.png" alt-text="Create a function app - Hosting." border="true":::

1. Select **Next : Monitoring**. On the **Monitoring** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Application Insights](../azure-functions/functions-monitoring.md)** | Default | Creates an Application Insights resource of the same *App name* in the nearest supported region. By expanding this setting or selecting **Create new**, you can change the Application Insights name or choose a different region in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/) where you want to store your data. |

    :::image type="content" source="./media/functions-hybrid-powershell/function-app-create-monitoring.png" alt-text="Create a function app - Monitoring." border="true":::

1. Select **Review + create** to review the app configuration selections.

1. On the **Review + create** page, review your settings, and then select **Create** to provision and deploy the function app.

1. Select the **Notifications** icon in the upper-right corner of the portal and watch for the **Deployment succeeded** message.

1. Select **Go to resource** to view your new function app. You can also select **Pin to dashboard**. Pinning makes it easier to return to this function app resource from your dashboard.

## Create a hybrid connection for the function app

Hybrid connections are configured from the networking section of the function app:

1. Under **Settings** in the function app you just created, select **Networking**. 
1. Select **Configure your hybrid connections endpoints**.
   
    :::image type="content" source="./media/functions-hybrid-powershell/configure-hybrid-connection-endpoint.png" alt-text="Configure the hybrid connection endpoints." border="true":::

1. Select **Add hybrid connection**.
   
    :::image type="content" source="./media/functions-hybrid-powershell/hybrid-connection-overview.png" alt-text="Add a hybrid connection." border="true":::

1. Enter information about the hybrid connection as shown right after the following screenshot. You have the option of making the **Endpoint Host** setting match the host name of the on-premises server to make it easier to remember the server later when you're running remote commands. The port matches the default Windows remote management service port that was defined on the server earlier.
  
      :::image type="content" source="./media/functions-hybrid-powershell/add-hybrid-connection.png" alt-text="Add hybrid connection." border="true":::

    | Setting      | Suggested value  |
    | ------------ | ---------------- |
    | **Hybrid connection name** | ContosoHybridOnPremisesServer |
    | **Endpoint Host** | finance1 |
    | **Endpoint Port** | 5986 |
    | **Servicebus namespace** | Create New |
    | **Location** | Pick an available location |
    | **Name** | contosopowershellhybrid | 

1. Select **OK** to create the hybrid connection.

## Download and install the hybrid connection

1. Select **Download connection manager** to save the *.msi* file locally on your computer.

    :::image type="content" source="./media/functions-hybrid-powershell/download-hybrid-connection-installer.png" alt-text="Download the installer." border="true":::

1. Copy the *.msi* file from your local computer to the on-premises server.
1. Run the Hybrid Connection Manager installer to install the service on the on-premises server.

    :::image type="content" source="./media/functions-hybrid-powershell/hybrid-installation.png" alt-text="Install the hybrid connection." border="true":::

1. From the portal, open the hybrid connection and then copy the gateway connection string to the clipboard.

    :::image type="content" source="./media/functions-hybrid-powershell/copy-hybrid-connection.png" alt-text="Copy the hybrid connection string." border="true":::

1. Open the Hybrid Connection Manager UI on the on-premises server.

    :::image type="content" source="./media/functions-hybrid-powershell/hybrid-connection-ui.png" alt-text="Open the Hybrid Connection UI." border="true":::

1. Select **Enter Manually** and paste the connection string from the clipboard.

    :::image type="content" source="./media/functions-hybrid-powershell/enter-manual-connection.png" alt-text="Paste the hybrid connection." border="true":::

1. Restart the Hybrid Connection Manager from PowerShell if it doesn't show as connected.
    ```powershell
    Restart-Service HybridConnectionManager
    ```

## Create an app setting for the password of an administrator account

1. Under **Settings** for your function app, select **Configuration**. 
1. Select **+ New application setting**.

    :::image type="content" source="./media/functions-hybrid-powershell/select-configuration.png" alt-text="Configure a password for the administrator account." border="true":::

1. Name the setting **ContosoUserPassword**, and enter the password. Select **OK**.
1. Select **Save** to store the password in the function application.

    :::image type="content" source="./media/functions-hybrid-powershell/save-administrator-password.png" alt-text="Save the password for the administrator account." border="true":::

## Create a function HTTP trigger

1. In your function app, select **Functions**, and then select **+ Add**.

    :::image type="content" source="./media/functions-hybrid-powershell/create-http-trigger-function.png" alt-text="Create new HTTP trigger." border="true":::

1. Select the **HTTP trigger** template.

    :::image type="content" source="./media/functions-hybrid-powershell/select-http-trigger-template.png" alt-text="Select the HTTP trigger template." border="true":::

1. Name the new function and select **Create Function**.

    :::image type="content" source="./media/functions-hybrid-powershell/create-new-http-function.png" alt-text="Name and create the new HTTP trigger function." border="true":::

## Test the function

1. In the new function, select **Code + Test**. Replace the PowerShell code from the template with the following code:

    ```powershell
    # Input bindings are passed in via param block.
    param($Request, $TriggerMetadata)
    
    # Write to the Azure Functions log stream.
    Write-Output "PowerShell HTTP trigger function processed a request."
    
    # Note that ContosoUserPassword is a function app setting, so I can access it as $env:ContosoUserPassword.
    $UserName = "ContosoUser"
    $securedPassword = ConvertTo-SecureString  $Env:ContosoUserPassword -AsPlainText -Force
    $Credential = [System.management.automation.pscredential]::new($UserName, $SecuredPassword)
    
    # This is the name of the hybrid connection Endpoint.
    $HybridEndpoint = "finance1"
    
    $Script = {
        Param(
            [Parameter(Mandatory=$True)]
            [String] $Service
        )
        Get-Service $Service
    }
    
    Write-Output "Scenario 1: Running command via Invoke-Command"
    Invoke-Command -ComputerName $HybridEndpoint `
                   -Credential $Credential `
                   -Port 5986 `
                   -UseSSL `
                   -ScriptBlock $Script `
                   -ArgumentList "*" `
                   -SessionOption (New-PSSessionOption -SkipCACheck)
    ```

1. Select **Save**.

    :::image type="content" source="./media/functions-hybrid-powershell/save-http-function.png" alt-text="Change the PowerShell code and save the HTTP trigger function." border="true":::

 1. Select **Test**, and then select **Run** to test the function. Review the logs to verify that the test was successful.

     :::image type="content" source="./media/functions-hybrid-powershell/test-function-hybrid.png" alt-text="Test HTTP trigger function." border="true":::

## Managing other systems on-premises

You can use the connected on-premises server to connect to other servers and management systems in the local environment. This lets you manage your datacenter operations from Azure by using your PowerShell functions. The following script registers a PowerShell configuration session that runs under the provided credentials. These credentials must be for an administrator on the remote servers. You can then use this configuration to access other endpoints on the local server or datacenter.

```powershell
# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)

# Write to the Azure Functions log stream.
Write-Host "PowerShell HTTP trigger function processed a request."

# Note that ContosoUserPassword is a function app setting, so I can access it as $env:ContosoUserPassword.
$UserName = "ContosoUser"
$SecuredPassword = ConvertTo-SecureString  $Env:ContosoUserPassword -AsPlainText -Force
$Credential = [System.management.automation.pscredential]::new($UserName, $SecuredPassword)

# This is the name of the hybrid connection Endpoint.
$HybridEndpoint = "finance1"

# The remote server that will be connected to run remote PowerShell commands on
$RemoteServer = "finance2".

Write-Output "Use hybrid connection server as a jump box to connect to a remote machine"

# We are registering an endpoint that runs under credentials ($Credential) that has access to the remote server.
$SessionName = "HybridSession"
$ScriptCommand = {
    param (
        [Parameter(Mandatory=$True)]
        $SessionName)

    if (-not (Get-PSSessionConfiguration -Name $SessionName -ErrorAction SilentlyContinue))
    {
        Register-PSSessionConfiguration -Name $SessionName -RunAsCredential $Using:Credential
    }
}

Write-Output "Registering session on hybrid connection jumpbox"
Invoke-Command -ComputerName $HybridEndpoint `
               -Credential $Credential `
               -Port 5986 `
               -UseSSL `
               -ScriptBlock $ScriptCommand `
               -ArgumentList $SessionName `
               -SessionOption (New-PSSessionOption -SkipCACheck)

# Script to run on the jump box to run against the second machine.
$RemoteScriptCommand = {
    param (
        [Parameter(Mandatory=$True)]
        $ComputerName)
        # Write out the hostname of the hybrid connection server.
        hostname
        # Write out the hostname of the remote server.
        Invoke-Command -ComputerName $ComputerName -Credential $Using:Credential -ScriptBlock {hostname} `
                        -UseSSL -Port 5986 -SessionOption (New-PSSessionOption -SkipCACheck)
}

Write-Output "Running command against remote machine via jumpbox by connecting to the PowerShell configuration session"
Invoke-Command -ComputerName $HybridEndpoint `
               -Credential $Credential `
               -Port 5986 `
               -UseSSL `
               -ScriptBlock $RemoteScriptCommand `
               -ArgumentList $RemoteServer `
               -SessionOption (New-PSSessionOption -SkipCACheck) `
               -ConfigurationName $SessionName
```

Replace the following variables in this script with the applicable values from your environment:
* $HybridEndpoint
* $RemoteServer

In the two preceding scenarios, you can connect and manage your on-premises environments by using PowerShell in Azure Functions and Hybrid Connections. We encourage you to learn more about [Hybrid Connections](../app-service/app-service-hybrid-connections.md) and [PowerShell in functions](./functions-reference-powershell.md).

You can also use Azure [virtual networks](./functions-create-vnet.md) to connect to your on-premises environment through Azure Functions.

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about working with PowerShell functions](functions-reference-powershell.md)
