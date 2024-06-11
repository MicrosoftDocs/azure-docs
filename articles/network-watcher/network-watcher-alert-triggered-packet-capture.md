---
title: Use packet capture to do proactive network monitoring with alerts - Azure Functions
description: Learn how to create an alert-triggered packet capture by using Azure Network Watcher and Azure Functions.
author: halkazwini
ms.author: halkazwini 
ms.service: network-watcher
ms.topic: how-to
ms.date: 02/14/2024
ms.custom: devx-track-azurepowershell
---

# Monitor networks proactively with alerts and Azure Functions by using packet capture

The packet capture feature of Azure Network Watcher creates capture sessions to track traffic in and out of virtual machines (VMs). The capture file can have a filter that you define to track only the traffic that you want to monitor. This data is stored in a storage blob or locally on the guest machine.

You can start this capability remotely from other automation scenarios, such as from Azure Functions. You can run proactive captures based on defined network anomalies. Other uses include gathering network statistics, getting information about network intrusions, and debugging client/server communications.

Resources that are deployed in Azure run continuously. It's difficult to actively monitor the status of all resources at all times. For example, what happens if a problem occurs at 2:00 AM?

By using Network Watcher alerts and functions from within the Azure ecosystem, you can proactively respond with the data and tools to solve problems in your network.

## Prerequisites

- The latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell).
- An existing instance of Network Watcher. If you don't already have one, [create an instance of Network Watcher](network-watcher-create.md).
- An existing virtual machine in the same region as Network Watcher with the [Windows extension](../virtual-machines/extensions/network-watcher-windows.md) or [Linux virtual machine extension](../virtual-machines/extensions/network-watcher-linux.md).

## Scenario

In this example, a virtual machine has more outgoing traffic than usual and you want to be alerted. You can use a similar process to create alerts for any condition.

When an incident triggers an alert, the packet-level data helps you analyze why the outgoing traffic increased. You can take steps to return the virtual machine to its original state.

This scenario assumes that you have an existing instance of Network Watcher and a resource group with a valid virtual machine.

Here's the workflow for packet capture:

1. An incident triggers an alert on your VM.
1. The alert calls your Azure function.
1. Your Azure function processes the alert and starts a Network Watcher packet capture session.
1. The packet capture runs on the VM and collects data.
1. The packet capture file is uploaded to a storage account for review and diagnosis.

To automate this process, you create and connect an alert on your VM to be triggered when the incident occurs. You also create a function to call Network Watcher.

This scenario:

- Creates an Azure function that starts a packet capture.
- Creates an alert rule on a virtual machine and configures the alert rule to call the Azure function.

## Create an Azure function

To create an Azure function to process the alert and create a packet capture, you first need to create a function app:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *function app*. Select **Function App** from the search results.

    :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/function-app-portal-search.png" alt-text="Screenshot that shows how to search for function apps in the Azure portal." lightbox="./media/network-watcher-alert-triggered-packet-capture/function-app-portal-search.png":::

1. Select **+ Create**.

1. On the **Basics** tab of **Create Function App**, enter or select values for the following settings:

   - Under **Project Details**, select the subscription for which you want to create the function app and the resource group to contain the app.
   - Under **Instance Details**:
      - For **Function App name**, enter the name of the function app. This name is appended with *.azurewebsites.net*.
      - For **Do you want to deploy code or container image?**, select the mode of publishing: **Code** or **Container image**.
      - For **Runtime stack**, select a runtime stack.
      - For **Version**, select the version of the runtime stack.
      - For **Region**, select the region in which you want to create the function app.
   - Under **Operating system**, select the type of operating system that you currently use. Azure recommends the type of operating system based on your runtime stack selection.
   - Under **Hosting**, select the type of plan that you want to use for the function app. Choose from the following options:
      - **Consumption (Serverless)**: For event-driven scaling for the lowest cost.
      - **Functions Premium**: For enterprise-level, serverless applications with event-based scaling and network isolation.
      - **App Service plan**: For reusing compute from an existing Azure App Service plan.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/create-function-app-basics.png" alt-text="Screenshot of the Create Function App page in the Azure portal." lightbox="./media/network-watcher-alert-triggered-packet-capture/create-function-app-basics.png":::

1. Select **Review + create** to create the app.

Now you can create a function:

1. In the function app that you created, select **Functions**, and then select **Create** to open the **Create function** pane.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/create-function.png" alt-text="Screenshot of the Create function pane.":::

2. For **Development environment**, select **Develop in portal**.
3. Under **Select a template**, select **HTTP trigger**.
4. In the **Template details** section:
   - For **New Function**, enter the name of the function.
   - For **Authorization level**, select **Function**.
5. Select **Create**.
6. Go to the function that you created and select **Code + Test**.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/code-test.png" alt-text="Screenshot of the Code + Test page for a function.":::

7. Update the [script](#add-powershell-to-the-function) and select **Save**.

### Configure authentication

To use the PowerShell cmdlets, you must configure authentication in the function app. To configure authentication, you must configure environment variables and upload an encrypted key file to the function app.

> [!NOTE]
> This scenario provides only one example of how to implement authentication with Azure Functions. There are other ways to do the same action.

The following PowerShell script creates a key file called *PassEncryptKey.key*. It also provides an encrypted version of the supplied password. This password is the same password that's defined for the Microsoft Entra application that's used for authentication.

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

Set up the following environment variables, which are necessary to access the values for authentication:

- `AzureClientID`
- `AzureTenant`
- `AzureCredPassword`

If you already have an application ID, use the `AzureClientID`, `AzureTenant`, and `AzureCredPassword` values of that application. If you don't have one, proceed to the [Store the environment variables](#store-the-environment-variables) section.

#### AzureClientID

The client ID is the ID of an application in Microsoft Entra ID. To get the client ID:

1. If you don't already have an application to use, run the following cmdlet to create an application:

    ```powershell
    $app = New-AzADApplication -DisplayName "ExampleAutomationAccount_MF" -HomePage "https://exampleapp.com" -IdentifierUris "https://exampleapp1.com/ExampleFunctionsAccount" -Password "<same password as defined earlier>"
    New-AzADServicePrincipal -ApplicationId $app.ApplicationId
    Start-Sleep 15]
    New-AzRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $app.ApplicationId
    ```

   > [!NOTE]
   > The password that you use when you create the application should be the same password that you created earlier when you saved the key file.

1. In the Azure portal, select **Subscriptions**. Select the subscription to use, and then select **Access control (IAM)**.  

1. Choose the account to use, and then select **Properties**. Copy the application ID.
  
#### AzureTenant

Get the tenant ID by running the following PowerShell cmdlet:

```powershell
(Get-AzSubscription -SubscriptionName "<subscriptionName>").TenantId
```

#### AzureCredPassword

The value of the `AzureCredPassword` environment variable is the value that you get from running the following PowerShell sample. This sample is the same one that the preceding [Configure authentication](#configure-authentication) section showed. The value that you need is the output of the `$Encryptedpassword` variable. This output is the service principal password that you encrypted by using the PowerShell script.

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

To store the environment variables:

1. Go to the function app. Select **Configurations** > **Application settings**.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/application-insights.png" alt-text="Screenshot of the tab for application settings.":::

1. Add the environment variables and their values to the app settings, and then select **Save**.

### Add PowerShell to the function

Now, make calls into Network Watcher from within the Azure function. Depending on the requirements, the implementation of this function can vary. However, the general flow of the code is as follows:

1. Process input parameters.
2. Query existing packet captures to verify limits and resolve name conflicts.
3. Create a packet capture with appropriate parameters.
4. Poll the packet capture periodically until it's complete.
5. Notify the user that the packet capture session is complete.

The following example is PowerShell code that you can use in the function. You need to replace the values for `subscriptionId`, `resourceGroupName`, and `storageAccountName`.

```powershell
# Input bindings are passed in via parameter block 
param($Request, $TriggerMetadata) 

$essentials = $Request.body.data.essentials
$alertContext = $Request.body.data.alertContext 


# Storage account ID to save captures in 
$storageaccountid = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" 

# Packet capture variables 
$packetCaptureName = "PSAzureFunction" 
$packetCaptureLimit = 100
$packetCaptureDuration = 30 

# Credentials 
# Set the credentials in the configurations
$tenant = $env:AzureTenant 
$pw = $env:AzureCredPassword 
$clientid = $env:AzureClientId 
$password = ConvertTo-SecureString $pw -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($clientid, $password)

Connect-AzAccount -ServicePrincipal -Tenant $tenant -Credential $credential #-WarningAction SilentlyContinue | out-null

if ($alertContext.condition.allOf.metricNamespace -eq "Microsoft.Compute/virtualMachines") { 

    # Get the VM firing this alert 
    $vm = Get-AzVM -ResourceId $essentials.alertTargetIDs[0] 

    # Get the Network Watcher instance in the VM's region 
    $networkWatcher = Get-AzNetworkWatcher -Location $vm.Location  

    # Get existing packet captures 
    $packetCaptures = Get-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher 

    # Remove an existing packet capture created by the function (if it exists) 
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
# Input bindings are passed in via parameter block 
param($Request, $TriggerMetadata)
$details = $Request.RawBody | ConvertFrom-Json


# Process alert request body 
$requestBody = $Request.Body.data

# Storage account ID to save captures in 
$storageaccountid = "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" 

# Packet capture variables 
$packetCaptureName = "PSAzureFunction" 
$packetCaptureLimit = 100
$packetCaptureDuration = 30 

# Credentials 
# Set the credentials in the configurations
$tenant = $env:AzureTenant 
$pw = $env:AzureCredPassword 
$clientid = $env:AzureClientId 

$password = ConvertTo-SecureString $pw -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($clientid, $password)

Connect-AzAccount -ServicePrincipal -Tenant $tenant -Credential $credential #-WarningAction SilentlyContinue | out-null

if ($requestBody.context.resourceType -eq "Microsoft.Compute/virtualMachines") { 

    # Get the VM firing this alert 
    $vm = Get-AzVM -ResourceGroupName $requestBody.context.resourceGroupName -Name $requestBody.context.resourceName 

    # Get the Network Watcher instance in the VM's region 
    $networkWatcher = Get-AzNetworkWatcher -Location $vm.Location  

    # Get existing packet captures 
    packetCaptures = Get-AzNetworkWatcherPacketCapture -NetworkWatcher $networkWatcher 

    # Remove an existing packet capture created by the function (if it exists) 
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

You can configure alerts to notify individuals when a specific metric crosses a threshold that you assigned to it. In this example, the alert is on the **Network Out Total** metric that's sent, but you can trigger the alert for many other metrics.

### Create the alert rule

Go to an existing virtual machine and [add an alert rule](../azure-monitor/alerts/alerts-classic-portal.md). On the **Create an Alert rule** page, take the following steps:

1. On the **Select a signal** pane, search for the name of the signal and select it. In this example, **Network Out Total** is the selected signal. It denotes the number of bytes out on all network interfaces by the virtual machine.

2. On the **Conditions** tab, set the following values, and then select **Next: Actions**.

   |**Setting** | **Value** |
   |---|---|
   |**Threshold**|Static|
   |**Aggregation type**|Average|
   |**Operator**|Greater than|
   |**Threshold value**|3|
   |**Check every**|1 minute|
   |**Lookback period**|5 minutes|

3. On the **Actions** tab, select **Create an action group**.
4. On the **Create action group** page, select the **Subscription**, **Resource group**, and **Region** values. Also enter the action group name and the display name, and then select **Next: Notifications**.
5. On the **Notifications** tab, for **Action type**, select **Azure Function**.
6. On the **Azure Function** pane, select the **Subscription**, **Resource group**, **Function app**, and **Azure Function** values.

   :::image type="content" source="./media/network-watcher-alert-triggered-packet-capture/action-group.png" alt-text="Screenshot of the page for creating an action group and the pane for details about an Azure function.":::
7. In **Enable the common alert schema** slider, select **No**. Then select **OK**.

## Review the results

After the criteria trigger an alert, Network Watcher creates a packet capture. Go to Network Watcher and select **Packet capture**. On this page, you can select the file link to download the packet capture.

If the capture file is stored locally, you can get it by signing in to the virtual machine.

For instructions on downloading files from Azure storage accounts, see the [quickstart for the Azure Blob Storage client library for .NET](../storage/blobs/storage-quickstart-blobs-dotnet.md). You can also use the [Azure Storage Explorer](https://storageexplorer.com/) tool.

After you download your capture, you can view it by using tools like [Wireshark](https://www.wireshark.org/) that can read a *.cap* file.

## Next step

Learn how to view your packet captures by reading [Inspect and analyze Network Watcher packet capture files](network-watcher-deep-packet-inspection.md).
