<properties
   pageTitle="Getting started with Azure Automation DSC"
   description="Article description that will be displayed on landing pages and in most search results"
   services="automation" 
   documentationCenter="na" 
   authors="eslesar" 
   manager="dongill" 
   editor="tysonn"/>

<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="na" 
   ms.date="05/05/2016"
   ms.author="eslesar"/>
   

# Getting started with Azure Automation DSC

This topic explains how to do the most common tasks with Azure Automation Desired State Configuration (DSC), such as creating, importing, and compiling configurations, onboarding VMs to 
manage, and viewing reports. For an overview of what Azure Automation DSC is, see [Azure Automation DSC Overview](automation-dsc-overview.md). For DSC documentation, see 
[Windows PowerShell Desired State Configuration Overview](Windows PowerShell Desired State Configuration Overview).

This topic provides a step-by-step guide to using Azure Automation DSC. If you want a sample environment that is already set up without following the steps described in this topic,
you can use the ARM template at https://github.com/azureautomation/automation-packs/tree/master/102-sample-automation-setup. This template sets up a completed Azure Automation DSC
environment, including an Azure VM that is managed by Azure Automation DSC.
 
## Prerequisites

To complete the examples in this topic, the following are required:

- An Azure Automation account. For instructions on creating an Azure Automation account, see [Configuring Azure Automation](automation-configuring.md).
- An Azure Resource Manager VM (not Classic). For instructions on creating a VM, see 
[Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)

## Creating a DSC configuration

We will create a simple [DSC configuration](https://msdn.microsoft.com/en-us/powershell/dsc/configurations) that ensures the presence of the **Web-Server** Windows Feature (IIS). 

1. Start the Windows PowerShell ISE (or any text editor).

2. Type the following text:
```powershell
configuration WebServer
{
    Node localhost
    {
        WindowsFeature IIS
        {
            Ensure               = 'Present'
            Name                 = 'Web-Server'
            IncludeAllSubFeature = $true

        }
    }
}
```
3. Save the file as `TestConfig.psm1`.

This configuration calls one resource, the [WindowsFeature resource](https://msdn.microsoft.com/en-us/powershell/dsc/windowsfeatureresource), that ensures the presence of the 
**Web-Server** feature.

## Importing a configuration into Azure Automation

Next, we'll import the configuration into the Automation account.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Configurations**.

4. On the **DSC Configurations blade, click **Add a configuration**.

5. On the **Import Configuration** blade, browse to the `TestConfig.ps1` file on your computer.
    
    ![Screenshot of the **Import Configuration** blade](./media/automation-dsc-getting-started/AddConfig.png)
    
    Notice that the **Name** is populated with the name of the configuration in the script ("WebServer") and not the name of the file ("TestConfig.ps.1")

6. Click **OK**.

## Viewing a configuration in Azure Automation

After you have imported a configuration, you can view it in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Configurations**

4. On the **DSC Configurations blade, click **WebServer** (this is the name of the configuration you imported in the previous procedure).

5. On the **WebServer Configuration** blade, click **View configuration source**.

    ![Screenshot of the WebServer configuration blade](./media/automation-dsc-getting-started/ViewConfigSource.png)
    
    A **WebServer Configuration source** blade opens, displaying the PowerShell code for the configuration.
    
## Compiling a configuration in Azure Automation

Before you can apply a configuration to a node, it has to be compiled into a node configuration (MOF document), and placed on the Pull server. For more information about compiling 
configurations, see [DSC Configurations](https://msdn.microsoft.com/en-us/PowerShell/DSC/configurations).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Configurations**

4. On the **DSC Configurations blade, click **WebServer** (the name of the previously imported configuration).

5. On the **WebServer Configuration** blade, click **Compile**, and then click **Yes**. This starts a compilation job.
    
    ![Screenshot of the WebServer configuration blade highlighting compile button](./media/automation-dsc-getting-started/CompileConfig.png)
    
> [AZURE.NOTE] When you compile a configuration in Azure Automation, it automatically deploys it to the pull server.

## Viewing a compilation job

After you start a compilation, you can view it in the **Compilation jobs** tile in the **Configuration** blade. The **Compilation jobs** tile shows currently running, completed, and
failed jobs. When you open a compilation job blade, it shows information about that job including any errors or warnings encountered, input parameters used in the configuration, and 
compilation logs.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Configurations**.

4. On the **DSC Configurations blade, click **WebServer** (the name of the previously imported configuration).

5. On the **Compilation jobs** tile of the **WebServer Configuration** blade, click on any of the jobs listed. A **Compilation Job** blade opens, labeled with the date that the 
compilation job was started.

    ![Screenshot of the Compilation Job blade](./media/automation-dsc-getting-started/CompilationJob.png)
  
6. Click on any tile in the **Compilation Job** blade to see further details about the job.

## Viewing node configurations

Successful completion of a compilation job creates a new node configuration. A node configuration is a MOF document that is deployed to the pull server and ready to be applied to a
node. You can view the node configurations in your Automation account in the **DSC Node Configurations** blade. A node configuration has a name with the form *ConfigurationName*.*NodeName*.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Node Configurations**.

    ![Screenshot of the DSC Node Configurations blade](./media/automation-dsc-getting-started/NodeConfigs.png)
    
## Onboarding an Azure VM for managment with Azure Automation DSC

You can use Azure Automation DSC to manage Azure VMs (both Classic and Resource Manager), on-premises VMs, and on-premises physical computers. In this topic, we cover how to onboard only
Azure Resource Manager VMs. For information about onboarding other types of computers, see [Onboarding machines for management by Azure Automation DSC](automation-dsc-onboarding.md).

### To onboard an Azure Resource Manager VM for management by Azure Automation DSC

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Nodes**.

4. In the **DSC Nodes** blade, click **Add Azure VM**.

    ![Screenshot of the DSC Nodes blade highlighting the Add Azure VM button](./media/automation-dsc-getting-started/OnboardVM.png)

5. In the **Add Azure VMs** blade, clidk **Select virtual machines to onboard**.

6. In the **Select VMs** blade, select the VM you want to onboard, and click **OK**.

    >[AZURE.IMPORTANT] This must be an Azure Resource Manager VM.
    
7. In the **Add Azure VMs** blade, click **Configure registration data**.

8. In the **Registration** blade, enter the name of the node configuration you want to apply to the VM in the **Node Configuration Name** box. This must exactly match the name
of a node configuration in the Automation account. Check **Reboot Node if Needed**, and then click **OK**.
    
    ![Screenshot of the Registration blade](./media/automation-dsc-getting-started/RegisterVM.png)
    
    The node configuration you specified will be applied to the VM at intervals specified by the **Configuration Mode Frequency**,
and the VM will check for updates to the node configuratoin at intervals specified by the **Refresh Frequency**.
    
9. In the **Add Azure VMs** blade, click **Create**.

Azure will start the process of onboarding the VM. When it is complete, the VM will show up in the **DSC Nodes** blade in the Automation account.

## Viewing the list of DSC nodes

You can view the list of all computers that have been onboarded for management in your Automation account in the **DSC Nodes** blade.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **All resources** and then the name of your Automation account.

3. On the **Automation account** blade, click **DSC Nodes**.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibul ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic](storage-whatis-account.md).

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    

