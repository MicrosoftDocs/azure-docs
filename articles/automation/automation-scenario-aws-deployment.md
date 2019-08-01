---
title: Automating deployment of a VM in Amazon Web Services
description: This article demonstrates how to use Azure Automation to automate creation of an Amazon Web Service VM
services: automation
ms.service: automation
ms.subservice: process-automation
author: bobbytreed
ms.author: robreed
ms.date: 03/16/2018
ms.topic: conceptual
manager: carmonm
---
# Azure Automation scenario - provision an AWS virtual machine
In this article, you learn how you can leverage Azure Automation to provision a virtual machine in your Amazon Web Service (AWS) subscription and give that VM a specific name – which AWS refers to as “tagging” the VM.

## Prerequisites
For the purposes of this article, you need to have an Azure Automation account and an AWS subscription. For more information on setting up an Azure Automation account and configuring it with your AWS subscription credentials, review [Configure Authentication with Amazon Web Services](automation-config-aws-account.md). This account should be created or updated with your AWS subscription credentials before proceeding, as you reference this account in the steps below.

## Deploy Amazon Web Services PowerShell Module
Your VM provisioning runbook leverages the AWS PowerShell module to do its work. Perform the following steps to add the module to your Automation account that is configured with your AWS subscription credentials.  

1. Open your web browser and navigate to the [PowerShell Gallery](https://www.powershellgallery.com/packages/AWSPowerShell/) and click on the **Deploy to Azure Automation button**.<br><br> ![AWS PS Module Import](./media/automation-scenario-aws-deployment/powershell-gallery-download-awsmodule.png)
2. You are taken to the Azure login page and after authenticating, you will be routed to the Azure portal and presented with the following page:<br><br> ![Import Module page](./media/automation-scenario-aws-deployment/deploy-aws-powershell-module-parameters.png)
3. Select the Automation Account to use and click **OK** to start deployment.

   > [!NOTE]
   > While importing a PowerShell module into Azure Automation, it is also extracting the cmdlets and these activities do not appear until the module has completely finished importing and extracting the cmdlets. This  process can take a few minutes.  
   > <br>

1. In the Azure portal, open your Automation account referenced in step 3.
2. Click on the **Assets** tile and on the **Assets** pane, select the **Modules** tile.
3. On the **Modules** page, you see the **AWSPowerShell** module in the list.

## Create AWS deploy VM runbook
Once the AWS PowerShell Module has been deployed, you can now author a runbook to automate provisioning a virtual machine in AWS using a PowerShell script. The steps below demonstrate how to leverage native PowerShell script in Azure Automation.  

> [!NOTE]
> For further options and information regarding this script, please visit the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-AwsVM/).
> 

1. Download the PowerShell script New-AwsVM from the PowerShell Gallery by opening a PowerShell session and typing the following:<br>
   ```powershell
   Save-Script -Name New-AwsVM -Path <path>
   ```
   <br>
2. From the Azure portal, open your Automation account and select **Runbooks** under the section **Process Automation** on the left.  
3. From the **Runbooks** page, select **Add a runbook**.
4. On the **Add a runbook** pane, select **Quick Create** (Create a new runbook).
5. On the **Runbook** properties pane, type a name in the Name box for your runbook and from the **Runbook type** drop-down list select **PowerShell**, and then click **Create**.<br><br> ![Create runbook pane](./media/automation-scenario-aws-deployment/runbook-quickcreate-properties.png)
6. When the Edit PowerShell Runbook page appears, copy and paste the PowerShell script into the runbook authoring canvas.<br><br> ![Runbook PowerShell Script](./media/automation-scenario-aws-deployment/runbook-powershell-script.png)<br>
   
    > [!NOTE]
    > Note the following when working with the example PowerShell script:
    > 
    > * The runbook contains a number of default parameter values. Evaluate all default values and update where necessary.
    > * If you have stored your AWS credentials as a credential asset named differently than **AWScred**, you need to update the script on line 57 to match accordingly.  
    > * When working with the AWS CLI commands in PowerShell, especially with this example runbook, you must specify the AWS region. Otherwise, the cmdlets fail. View AWS topic [Specify AWS Region](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html) in the AWS Tools for PowerShell document for further details.  
    >

7. To retrieve a list of image names from your AWS subscription, launch PowerShell ISE and import the AWS PowerShell Module. Authenticate against AWS by replacing **Get-AutomationPSCredential** in your ISE environment with **AWScred = Get-Credential**. This prompts you for your credentials and you can provide your **Access Key ID** for the username and **Secret Access Key** for the password. See the example below:  

        ```powershell
        #Sample to get the AWS VM available images
        #Please provide the path where you have downloaded the AWS PowerShell module
        Import-Module AWSPowerShell
        $AwsRegion = "us-west-2"
        $AwsCred = Get-Credential
        $AwsAccessKeyId = $AwsCred.UserName
        $AwsSecretKey = $AwsCred.GetNetworkCredential().Password
   
        # Set up the environment to access AWS
        Set-AwsCredentials -AccessKey $AwsAccessKeyId -SecretKey $AwsSecretKey -StoreAs AWSProfile
        Set-DefaultAWSRegion -Region $AwsRegion
   
        Get-EC2ImageByName -ProfileName AWSProfile
        ```
        
    The following output is returned:<br><br>
   ![Get AWS images](./media/automation-scenario-aws-deployment/powershell-ise-output.png)<br>  
8. Copy and paste the one of the image names in an Automation variable as referenced in the runbook as **$InstanceType**. Since in this example you are using the free AWS tiered subscription, you use **t2.micro** for your runbook example.  
9. Save the runbook, then click **Publish** to publish the runbook and then **Yes** when prompted.

### Testing the AWS VM runbook
Before you proceed with testing the runbook, you need to verify a few things. Specifically:  

* An asset for authenticating against AWS has been created called **AWScred** or the script has been updated to reference the name of your credential asset.    
* The AWS PowerShell module has been imported in Azure Automation  
* A new runbook has been created and parameter values have been verified and updated where necessary  
* **Log verbose records** and optionally **Log progress records** under the runbook setting **Logging and tracing** have been set to **On**.<br><br> ![Runbook Logging and Tracing](./media/automation-scenario-aws-deployment/runbook-settings-logging-and-tracing.png)  

1. You want to start the runbook, so click **Start** and then click **OK** when the Start Runbook pane opens.
2. On the Start Runbook pane, provide a **VMname**. Accept the default values for the other parameters that you preconfigured in the script earlier. Click **OK** to start the runbook job.<br><br> ![Start New-AwsVM runbook](./media/automation-scenario-aws-deployment/runbook-start-job-parameters.png)
3. A job pane is opened for the runbook job that you created. Close this pane.
4. You can view progress of the job and view output **Streams** by selecting the **All Logs** tile from the runbook job page.<br><br> ![Stream output](./media/automation-scenario-aws-deployment/runbook-job-streams-output.png)
5. To confirm the VM is being provisioned, log into the AWS Management Console if you are not currently logged in.<br><br> ![AWS console deployed VM](./media/automation-scenario-aws-deployment/aws-instances-status.png)

## Next steps
* To get started with Graphical runbooks, see [My first graphical runbook](automation-first-runbook-graphical.md)
* To get started with PowerShell workflow runbooks, see [My first PowerShell workflow runbook](automation-first-runbook-textual.md)
* To know more about runbook types, their advantages and limitations, see [Azure Automation runbook types](automation-runbook-types.md)
* For more information on PowerShell script support feature, see [Native PowerShell script support in Azure Automation](https://azure.microsoft.com/blog/announcing-powershell-script-support-azure-automation-2/)


