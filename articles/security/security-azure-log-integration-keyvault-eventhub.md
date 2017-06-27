---
title: Integrate logs from Key Vault using Event Hubs - Azure  | Microsoft Docs
description: Tutorial going over the necessary steps to make Key Vault logs available to a SIEM by using Azure Log Integration
services: security
author: barclayn
manager: MBaldwin
editor: TomShinder

ms.assetid:
ms.service: security
ms.topic: article
ms.date: 06/27/2017
ms.author: Barclayn
ms.custom: AzLog


---

# Azure Log integration tutorial - Processing Azure Key Vault events using Event Hubs

Azure Log Integration (AzLog) allows you to retrieve logged events and make them available to your Security information and event management (SIEM). This tutorial walks you through the process of taking Key Vault activity logged to an Event Hub and make it available as JSON files to your SIEM. You can then configure your SIEM to process the JSON files.

>[!NOTE]
Most of the steps involved in this tutorial involve configuring Key Vault, storage accounts and event hubs. The specific Azure Log integration steps are at the end of this document.

There is information provided along the way to help you understand the reasons behind each step and when appropriate links will be included to other articles to give you more detail on certain topics.

Please take note that most of these steps involve the configuration of the Event Hub and Key Vault.  

- [Azure Key Vault](../key-vault/key-vault-whatis.md)
- [Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md)
- [Azure Log Integration](security-azure-log-integration-overview.md)


## Initial setup

Before you can complete the steps in this article you will need the following:

1. An Azure subscription and account on that subscription with administrator rights. If you don't have a subscription you can get a [free subscription](https://azure.microsoft.com/free/)
2. A system with access to the Internet that meets the requirements for installing Azure Log Integration. The system can be on a cloud service or hosted on-premises.
3. [Azure Log Integration](https://www.microsoft.com/download/details.aspx?id=53324) Installed.
  - Use remote desktop to connect to the system mentioned in step 2.
  - Copy the Azure Log Integration installer to it. You can [download the installation files](https://www.microsoft.com/download/details.aspx?id=53324)
  - Launch the installer and accept the terms in the License Agreement.
  - Decide if you will be providing telemetry information and leave the box checked or uncheck it if you rather not send usage information to Microsoft.
  >[!NOTE]
  For detailed installation steps take a look at the article [Azure Log Integration Azure Diagnostics logging and Windows Event Forwarding](security-azure-log-integration-get-started.md) The article does not only cover the installation of Azure Log Integration but it also includes general information about it.
4. Check your PowerShell version.
   - If you have Windows Server 2016 installed then you have at least PowerShell 5.0 if you are using any other version of Windows server you may have lower versions of PowerShell installed. You can check the version by typing ```get-host``` in a PowerShell window.
   - if you don't have PowerShell 5.0 installed you can download it [here](https://www.microsoft.com/download/details.aspx?id=50395)
   - Once that you have at least PowerShell 5.0 you can proceed to install the latest version of Azure PowerShell.
    - Open a PowerShell window and type:
   </br>```Install-Module Azure``` and press the **Enter** key. Run through the installation and when it completes move on to the next step. </br>
   Then type ```Install-Module AzureRM``` and press the **Enter** key. Run through the installation steps.

At this point you have the latest version of Azure PowerShell and Azure Log Integration installed on a system and you are ready to proceed with the later steps in the tutorial.

>[!NOTE]
For detailed steps and information on installing Azure PowerShell please review the article titled [Install Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-4.0.0)


## Creating supporting infrastructure elements

1. Open an elevated PowerShell window and navigate to **c:\Program Files\Microsoft Azure Log Integration**
2. The first step you need to take is to get the AzLog Cmdlets imported. You can do that by running the script LoadAzLogModule.ps1 (notice the “.\” in the following command). Type **.\LoadAzLogModule.ps1** and press ENTER.
You should see something like what appears in the figure below. </br>

    ![Loaded modules list](./media/security-azure-log-integration-keyvault-eventhub/loaded-modules.png)

3. Type **Login-AzureRmAccount** and hit enter. This will launch a login window. Enter the credential information for the subscription that you will be using for this tutorial.

    >[!NOTE]
    If this is the first time that you log to Azure from this machine then you will see a message about allowing Microsoft to collect PowerShell usage data. We recommend that you enable this because it will be used to improve Azure PowerShell.

4. After you decide how to proceed at the data collection prompt and you successfully authenticate you will be logged on and some information will be displayed on the screen as shown below. Take note of the subscription information.

    ![Loaded modules list](./media/security-azure-log-integration-keyvault-eventhub/login-azurermaccount.png)
5. You need to create a few variables to store some values that will be used later
    - Type each of the PowerShell lines below and hit **Enter** after each one. Pay attention to the comments next to each. You may need to adjust the values to match your environment:
        - ```$subscriptionName = ‘Visual Studio Ultimate with MSDN’``` (Your subscription name may be different and you could see it as part of the output of the previous command)
        - ```$location = 'West US'``` (This variable will be used to pass the location where resources should be created. You can change this to be any other location of your choosing)
        - ```$random = Get-Random```
        - ``` $name = 'AzLogtest' + $random``` (The name could be anything but it should only include lower case letters and numbers)
        - ``` $storageName = $name``` (This will be used for the storage account name)
        - ```$rgname = $name ``` (This will be used for the resource group name)
        - ``` $eventHubNameSpaceName = $name``` (This is the event hub name space name)
6. Next you need to specify the subscription that you will be working with.
    - Type ```Select-AzureRmSubscription -SubscriptionName $subscriptionName``` and hit **Enter**
7. Next you will create a resource group
    - Type ```$rg = New-AzureRmResourceGroup -Name $rgname -Location $location``` and hit **Enter** This creates a resource group. If at this point you type $rg and hit **Enter** you should see output similar to the information shown below

        ![Loaded modules list](./media/security-azure-log-integration-keyvault-eventhub/create-rg.png)
8. Next you will create a storage account that will be used to keep track of state information.
    - ```$storage = New-AzureRmStorageAccount -ResourceGroupName $rgname -Name $storagename -Location $location -SkuName Standard_LRS```
9. Next the event hub name space. This is required to create an Event Hub.
    - ```$eventHubNameSpace = New-AzureRmEventHubNamespace -ResourceGroupName $rgname -NamespaceName $eventHubnamespaceName -Location $location```
10. Next you will get the rule ID that will be used with the insights provider
    - ```$sbruleid = $eventHubNameSpace.Id +'/authorizationrules/RootManageSharedAccessKey' ```
11. Now you will get all possible Azure locations and add the names to a variable that can be used in a later step
    - ```$locationObjects = Get-AzureRMLocation```
    - ```$locations = @('global') + $locationobjects.location```If you type $locations and hit **Enter** at this point you will see the location names without the additional information returned by get-AzureRmLocation.
12. Now you can create an Azure Resource Manager log profile. You can get more information on the Azure Log profile in the article [Overview of the Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md)
    - ```Add-AzureRmLogProfile -Name $name -ServiceBusRuleId $sbruleid -Locations $locations```

## Creating a Key Vault

First you will create the Azure Key Vault by typing:

```$kv = New-AzureRmKeyVault -VaultName $name -ResourceGroupName $rgname -Location $location ```

Next you will configure logging for Key Vault

```Set-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId -ServiceBusRuleId $sbruleid -Enabled $true ```

## Generating log activity

 Requests need to be sent to Key Vault to generate log activity. Actions like key generation, storing secrets or reading secrets from Key Vault will create log entries.

 - The next step simply displays the current storage keys.
    - ```Get-AzureRmStorageAccountKey -Name $storagename -ResourceGroupName $rgname  | ft -a```
 - The next line generates a new **key2**
    - ```New-AzureRmStorageAccountKey -Name $storagename -ResourceGroupName $rgname -KeyName key2```
 - Now you can display the keys again and see that **key2** holds a different value.
    - ```Get-AzureRmStorageAccountKey -Name $storagename -ResourceGroupName $rgname  | ft -a```
- Finally, setting and reading a secret will generate additional log entries
    - ```Set-AzureKeyVaultSecret -VaultName $name -Name TestSecret -SecretValue (ConvertTo-SecureString -String 'Hi There!' -AsPlainText -Force)```
    - ```(Get-AzureKeyVaultSecret -VaultName $name -Name TestSecret).SecretValueText```

        ![Returned secret](./media/security-azure-log-integration-keyvault-eventhub/keyvaultsecret.png)


## Configuring Azure Log Integration

Now that you have configured all of the required elements to have Key Vault logging to an event hub you need to take steps to configure Azure Log Integration.

1. ```$storage = Get-AzureRmStorageAccount -ResourceGroupName $rgname -Name $storagename```
2. ```$eventHubKey = Get-AzureRmEventHubNamespaceKey -ResourceGroupName $rgname -NamespaceName $eventHubNamespace -AuthorizationRuleName RootManageSharedAccessKey```
3. ```$storagekeys = Get-AzureRmStorageAccountKey -ResourceGroupName $rgname -Name $storagename```
4. ``` $storagekey = $storagekeys[0].Value```

You will run the AzLog command for each event hub:

1.  ```$eventhubs = Get-AzureRmEventHub -ResourceGroupName $rgname -NamespaceName $eventHubNamespaceName```
2.  ```$eventhubs.Name | %{Add-AzLogEventSource -Name $sub' - '$_ -StorageAccount $storage.StorageAccountName -StorageKey $storageKey -EventHubConnectionString $eventHubKey.PrimaryConnectionString -EventHubName $_}```

After a minute or so of running the last few commands you should see json files being generated. You can confirm that by monitoring the directory **c:\users\AzLog\EventHubJson**

## Next Steps

- [Azure Log Integration FAQ](security-azure-log-integration-faq.md)
- [Get started with Azure log integration](security-azure-log-integration-get-started.md)
- [Integrate logs from Azure resources into your SIEM systems ](security-azure-log-integration-overview.md)
