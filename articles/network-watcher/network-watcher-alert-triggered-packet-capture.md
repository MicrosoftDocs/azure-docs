---
title: Use packet capture to do proactive network monitoring with alerts - Azure Functions
description: This article describes how to create an alert triggered packet capture with Azure Network Watcher
services: network-watcher
author: halkazwini
ms.assetid: 75e6e7c4-b3ba-4173-8815-b00d7d824e11
ms.service: network-watcher
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 01/09/2023
ms.author: halkazwini 
ms.custom: devx-track-azurepowershell, engagement-fy23
---
# Monitor networks proactively with alerts and Azure Functions using Packet Capture

Network Watcher packet capture creates capture sessions to track traffic in and out of virtual machines. The capture file can have a filter that is defined to track only the traffic that you want to monitor. This data is stored in a storage blob or locally on the guest machine.

This capability can be started remotely from other automation scenarios such as Azure Functions. Packet capture gives you the capability to run proactive captures based on defined network anomalies. Other uses include gathering network statistics, getting information about network intrusions, debugging client-server communications, and more.

Resources that are deployed in Azure run 24 * 7. It's difficult to actively monitor the status of all resources 24 * 7. For example, what happens if an issue occurs at 2 AM?

By using Network Watcher alerting and functions from within the Azure ecosystem, you can proactively respond with the data and tools to solve problems in your network.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

* The latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell).
* An existing instance of Network Watcher. If you don't already have one, [create an instance of Network Watcher](network-watcher-create.md).
* An existing virtual machine in the same region as Network Watcher with the [Windows extension](../virtual-machines/extensions/network-watcher-windows.md) or [Linux virtual machine extension](../virtual-machines/extensions/network-watcher-linux.md).

## Scenario

In this example, your VM has more outgoing traffic than usual and you want to be alerted. Similarly, you can create alerts for any condition.

When an alert is triggered, the packet-level data helps to analyze why the outgoing traffic has increased. You can take steps to return the virtual machine to its original state.

This scenario assumes that you have an existing instance of Network Watcher and a resource group with a valid Virtual machine.

The following workflow that takes place when an alert is triggered:

1. An alert is triggered on your VM.
1. The alert calls your Azure function.
1. Your Azure function processes the alert and starts a Network Watcher packet capture session.
1. The packet capture runs on the VM and collects data.
1. The packet capture file is uploaded to a storage account for review and diagnosis.

To automate this process, we create and connect an alert on our VM to trigger when the incident occurs. We also create a function to call Network Watcher. 

This scenario does the following:

* Creates an Azure function that starts a packet capture.
* Creates an alert rule on a virtual machine and configures the alert rule to call the Azure function.

## Create an Azure function app

To create an Azure function to process the alert and create a packet capture, follow these steps:

1. In the [Azure portal](https://portal.azure.com), search for *function app* in **All services** and select it.

    :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/search-result.png" alt-text="Screenshot of finding the function app in Azure portal.":::

2. Select **Create** to open the **Create Function App** screen.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/create-function-app.png" alt-text="Screenshot of the Create function app screen.":::

2. In the **Basics** tab, enter the following values: 
   1. Under **Project Details**, select the **Subscription** for which you want to create the Function app and the **Resource Group** to contain the app.
   2. Under **Instance details**, do the following:
      1. Enter the name of the Function app. This name will be appended by *.azurewebsites.net*.
      2. In **Publish**, select the mode of publishing, either *Code* or *Docker Container*.
      3. Select a **Runtime stack**.
      4. Select the version of the Runtime stack in **Version**.
      5. Select the **Region** in which you want to create the function app.
   3. Select **OK** to create the app.
   3. Under **Operating System**, select the type of Operating system that you're currently using. Azure recommends the type of Operating system based on your runtime stack selection. 
   4. Under **Plan**, select the type of plan that you want to use for the function app. Choose from the following options:
      - Consumption (Serverless) - For event-driven scaling for the most minimum cost. 
      - Functions Premium - For enterprise-level, serverless applications with event-based scaling and network isolation.
      - App Service Plan - For reusing compute from an existing app service plan.
3. Select **Review + create** to create the app.

### Create an Azure function

1. In the function app that you created, in the **Functions** tab, select **Create** to open the **Create function** pane.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/create-function.png" alt-text="Screenshot of the Create function screen.":::

2. Select **Develop in portal** from the **Development environment** drop-down.
3. Under **Select a template**, select **HTTP Trigger**.
4. In the **Template details** section, do the following:
   1. Enter the name of the function in the **New function** field.
   2. Select **Function** as the **Authorization level** and select **Create**.
5. After the function is created, go to the function and select **Code + Test**.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/code-test.png" alt-text="Screenshot of the Code + Test screen.":::

6. Update the [script](#add-powershell-to-the-function) and select **Save**.

### Authentication

To use the PowerShell cmdlets, you must configure authentication in the function app. To configure authentication, you must configure environment variables and upload an encrypted key file to the function app.

> [!NOTE]
> This scenario provides only one example of how to implement authentication with Azure Functions. There are other ways to do the same action.

#### Encrypted credentials

The following PowerShell script creates a key file called **PassEncryptKey.key**. It also provides an encrypted version of the password that's supplied. This password is the same password that is defined for the Azure Active Directory application that's used for authentication.

```powershell
#Variables
$keypath = "C:\temp\PassEncryptKey.key"
$AESKey = New-Object Byte[] 32
$Password = "<insert a password here>"

#Keys
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($AESKey) 
Set-Content $keypath $AESKey

#Get encrypted password
$secPw = ConvertTo-SecureString -AsPlainText $Password -Force
$AESKey = Get-content $KeyPath
$Encryptedpassword = $secPw | ConvertFrom-SecureString -Key $AESKey
$Encryptedpassword
```

### Retrieve values for environment variables

Set up the environment variables that are necessary to access the values for authentication. The following list shows the environment variables that are created:

* AzureClientID
* AzureTenant
* AzureCredPassword

If you already have an Application ID, use the AzureClientID, AzureTenant, and AzureCredPassword of that application. If you don't have one, proceed to [store the environment variables](#store-the-environment-variables).

#### AzureClientID

The client ID is the Application ID of an application in the Azure Active Directory.

1. If you don't already have an application to use, run the following cmdlet to create an application.

    ```powershell
    $app = New-AzADApplication -DisplayName "ExampleAutomationAccount_MF" -HomePage "https://exampleapp.com" -IdentifierUris "https://exampleapp1.com/ExampleFunctionsAccount" -Password "<same password as defined earlier>"
    New-AzADServicePrincipal -ApplicationId $app.ApplicationId
    Start-Sleep 15]
    New-AzRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $app.ApplicationId
    ```

   > [!NOTE]
   > The password that you use when creating the application should be the same password that you created earlier when saving the key file.

1. In the Azure portal, select **Subscriptions**. Select the subscription to use and select **Access control (IAM)**.  

1. Choose the account to use and select **Properties**. Copy the Application ID.
  

#### AzureTenant

Obtain the tenant ID by running the following PowerShell cmdlet:

```powershell
(Get-AzSubscription -SubscriptionName "<subscriptionName>").TenantId
```

#### AzureCredPassword

The value of the AzureCredPassword environment variable is the value that you get from running the following PowerShell sample. This example is the same one that's shown in the preceding **Encrypted credentials** section. The value that's needed is the output of the `$Encryptedpassword` variable.  This is the service principal password that you encrypted by using the PowerShell script.

```powershell
#Variables
$keypath = "C:\temp\PassEncryptKey.key"
$AESKey = New-Object Byte[] 32
$Password = "<insert a password here>"

#Keys
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($AESKey) 
Set-Content $keypath $AESKey

#Get encrypted password
$secPw = ConvertTo-SecureString -AsPlainText $Password -Force
$AESKey = Get-content $KeyPath
$Encryptedpassword = $secPw | ConvertFrom-SecureString -Key $AESKey
$Encryptedpassword
```

### Store the environment variables

To store the environment variables, follow these steps:

1. Go to the function app. Select **Configurations** > **Application settings**.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/application-insights.png" alt-text="Screenshot of the Application settings screen.":::
   
1. Add the environment variables and their values to the app settings and select **Save**.

### Add PowerShell to the function

Now, make calls into Network Watcher from within the Azure function. Depending on the requirements, the implementation of this function can vary. However, the general flow of the code is as follows:

1. Process input parameters.
2. Query existing packet captures to verify limits and resolve name conflicts.
3. Create a packet capture with appropriate parameters.
4. Poll packet capture periodically until it's complete.
5. Notify the user that the packet capture session is complete.

The following example is PowerShell code that can be used in the function. There are values that need to be replaced for **subscriptionId**, **resourceGroupName**, and **storageAccountName**.

```powershell
# Input bindings are passed in via param block. 
param($Request, $TriggerMetadata) 

$essentials = $Request.body.data.essentials
$alertContext = $Request.body.data.alertContext 


# Storage account ID to save captures in 
$storageaccountid = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" 

# Packet capture vars 
$packetCaptureName = "PSAzureFunction" 
$packetCaptureLimit = 100
$packetCaptureDuration = 30 

# Credentials 
# Set the credentials in the Configurations
$tenant = $env:AzureTenant 
$pw = $env:AzureCredPassword 
$clientid = $env:AzureClientId 
$password = ConvertTo-SecureString $pw -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($clientid, $password)

Connect-AzAccount -ServicePrincipal -Tenant $tenant -Credential $credential #-WarningAction SilentlyContinue | out-null

if ($alertContext.condition.allOf.metricNamespace -eq "Microsoft.Compute/virtualMachines") { 

    # Get the VM firing this alert 
    $vm = Get-AzVM -ResourceId $essentials.alertTargetIDs[0] 

    # Get the Network Watcher in the VM's region 
    $networkWatcher = Get-AzNetworkWatcher -Location $vm.Location  

    # Get existing packetCaptures 
    $packetCaptures = Get-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher 

    # Remove existing packet capture created by the function (if it exists) 
    $packetCaptures | ForEach-Object { if ($_.Name -eq $packetCaptureName) 
        {  
            Remove-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -PacketCaptureName $packetCaptureName 
        } 
    } 
	
    # Initiate packet capture on the VM that fired the alert 
    if ($packetCaptures.Count -lt $packetCaptureLimit) { 
        Write-Output "Initiating Packet Capture" 
        New-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -TargetVirtualMachineId $vm.Id -PacketCaptureName $packetCaptureName -StorageAccountId $storageaccountid -TimeLimitInSeconds $packetCaptureDuration 
    } 
} 
 ``` 

Use the following PowerShell code if you're using the old schema:

```powershell
# Input bindings are passed in via param block. 
param($Request, $TriggerMetadata)
$details = $Request.RawBody | ConvertFrom-Json


# Process alert request body 
$requestBody = $Request.Body.data

# Storage account ID to save captures in 
$storageaccountid = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" 

# Packet capture vars 
$packetCaptureName = "PSAzureFunction" 
$packetCaptureLimit = 100
$packetCaptureDuration = 30 

# Credentials 
# Set the credentials in the Configurations
$tenant = $env:AzureTenant 
$pw = $env:AzureCredPassword 
$clientid = $env:AzureClientId 

$password = ConvertTo-SecureString $pw -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($clientid, $password)

Connect-AzAccount -ServicePrincipal -Tenant $tenant -Credential $credential #-WarningAction SilentlyContinue | out-null

if ($requestBody.context.resourceType -eq "Microsoft.Compute/virtualMachines") { 

    # Get the VM firing this alert 
    $vm = Get-AzVM -ResourceGroupName $requestBody.context.resourceGroupName -Name $requestBody.context.resourceName 

    # Get the Network Watcher in the VM's region 
    $networkWatcher = Get-AzNetworkWatcher -Location $vm.Location  

    # Get existing packetCaptures 
    packetCaptures = Get-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher 

    # Remove existing packet capture created by the function (if it exists) 
    $packetCaptures | ForEach-Object { if ($_.Name -eq $packetCaptureName) 
        {  
            Remove-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -PacketCaptureName $packetCaptureName 
        } 
    } 

    # Initiate packet capture on the VM that fired the alert 
    if ($packetCaptures.Count -lt $packetCaptureLimit) { 
        Write-Output "Initiating Packet Capture" 
        New-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher -TargetVirtualMachineId $requestBody.context.resourceId -PacketCaptureName $packetCaptureName -StorageAccountId $storageaccountid -TimeLimitInSeconds $packetCaptureDuration 
    } 
}                               
 ``` 

## Configure an alert on a VM

You can configure alerts to notify individuals when a specific metric crosses a threshold that's assigned to it. In this example, the alert is on the Network Out Total that is sent, but the alert can be triggered for many other metrics. 

### Create the alert rule

Go to an existing virtual machine and [add an alert rule](../azure-monitor/alerts/alerts-classic-portal.md). Do the following in the **Create an Alert rule** screen.

1. In the **Select a signal** pane, search for the name of the signal and select it. In this example, Network Out Total is the selected signal. It denotes the number of bytes out on all network interfaces by the Virtual Machine.

2. In the **Conditions** tab, set the following values and select **Next: Actions >**.

   |**Setting** | **Value** |
   |---|---|
   |**Threshold**|Static|
   |**Aggregation type**|Average|
   |**Operator**|Greater than| 
   |**Threshold value**|3| 
   |**Check every**|1 minute| 
   |**Lookback period**|5 minutes| 

3. In the **Actions** tab, select **Create an action group**.
4. In the **Create action group** screen, select the **Subscription**, **Resource group**, and **Region**. Also enter the Action group name and the display name and select **Next: Notifications >**.
5. In the screen that appears, select **Action type** as **Azure Function**. 
6. In the Azure Function pane, select the **Subscription**, **Resource group**, **Function app**, and **Azure Function**.
   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/action-group.png" alt-text="Screenshot of the Create action group screen.":::
7. Select **No** in **Enable the common alert schema** slider and select **OK**. 


## Review the results

After the criteria for the alert triggers, a packet capture is created. Go to Network Watcher and select **Packet capture**. On this page, you can select the packet capture file link to download the packet capture.

If the capture file is stored locally, you can retrieve it by signing in to the virtual machine.

For instructions on downloading files from Azure storage accounts, see [Get started with Azure Blob storage using .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md). You can also use the [Storage Explorer](https://storageexplorer.com/) tool.

After your capture has been downloaded, you can view it using tools like [Microsoft Message Analyzer](/message-analyzer/microsoft-message-analyzer-operating-guide) and [WireShark](https://www.wireshark.org/)that can read a **.cap** file. 

## Next steps

Learn how to view your packet captures by visiting [Packet capture analysis with Wireshark](network-watcher-deep-packet-inspection.md).