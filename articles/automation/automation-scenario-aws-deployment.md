<properties
   pageTitle="Automating deployment of a VM in Amazon Web Services | Microsoft Azure"
   description="This article demonstrates how to use Azure Automation to automate creation of an Amazon Web Service VM"
   services="automation"
   documentationCenter=""
   authors="mgoedtel"
   manager="jwhit"
   editor="" />
<tags
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/21/2016"
   ms.author="tiandert; bwren" />

# Azure Automation scenario - provision an AWS virtual machine 

In this article, we demonstrate how you can leverage Azure Automation to provision a virtual machine in your Amazon Web Service (AWS) subscription and give that VM a specific name – which AWS refers to as “tagging” the VM.

## Prerequisites

For the purposes of this article, you need to have an Azure Automation account and an AWS subscription. For more information on setting up an Azure Automation account and configuring it with your AWS subscription credentials, review [Configure Authentication with Amazon Web Services](../automation/automation-sec-configure-aws-account.md).  This account should be created or updated with your AWS subscription credentials before proceeding, as we will reference this account in the steps below.


## Deploy Amazon Web Services PowerShell Module

Our VM provisioning runbook will leverage the AWS PowerShell module to do its work. Perform the following steps to add the module to your Automation account that is configured with your AWS subscription credentials.  

1. Open your web browser and navigate to the [PowerShell Gallery](http://www.powershellgallery.com/packages/AWSPowerShell/) and click on the **Deploy to Azure Automation button**.<br> ![AWS PS Module Import](./media/automation-scenario-aws-deployment/powershell-gallery-download-awsmodule.png)

2. You are taken to the Azure login page and after authenticating, you will be routed to the Azure Portal and presented with the following blade.<br> ![Import Module Blade](./media/automation-scenario-aws-deployment/deploy-aws-powershell-module-parameters.png)

3. Select the Resource Group from the **Resource Group** drop-down list and on the Parameters blade, provide the following information:
   * From the **New or Existing Automation Account (string)** drop-down list select **Existing**.  
   * In the **Automation Account Name (string)** box, type in the exact name of the Automation account that includes the credentials for your AWS subscription.  For example, if you created a dedicated account named **AWSAutomation**, then that is what you type in the box.
   * Select the appropriate region from the **Automation Account Location** drop-down list.

4. When you have completed entering the required information, click **Create**.

    >[AZURE.NOTE] While importing a PowerShell module into Azure Automation, it is also extracting the cmdlets and these activities will not appear until the module has completely finished importing and extracting the cmdlets. This  process can take a few minutes.  
<br>
5. In the Azure Portal, open your Automation account referenced in step 3.
6. Click on the **Assets** tile and on the **Assets** blade, select the **Modules** tile.
7. On the **Modules** blade you will see the **AWSPowerShell** module in the list.

## Create AWS deploy VM runbook

Once the AWS PowerShell Module has been deployed, we can now author a runbook to automate provisioning a virtual machine in AWS using a PowerShell script. The steps below will demonstrate how to leverage native PowerShell script in Azure Automation.  

>[AZURE.NOTE] For further options and information regarding this script, please visit the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-AwsVM/DisplayScript).


1. Download the PowerShell script New-AwsVM from the PowerShell Gallery by opening a PowerShell session and typing the following:<br>
   ```
   Save-Script -Name New-AwsVM -Path \<path\>
   ```
<br>
2. From the Azure Portal, open your Automation account and click the  **Runbooks** tile.  
3. From the **Runbooks** blade, select **Add a runbook**.
4. On the **Add a runbook** blade, select **Quick Create** (Create a new runbook).
5. On the **Runbook** properties blade, type a name in the Name box for your runbook and from the **Runbook type** drop-down list select **PowerShell**, and then click **Create**.<br> ![Import Module Blade](./media/automation-scenario-aws-deployment/runbook-quickcreate-properties.png)
6. When the Edit PowerShell Runbook blade appears, copy and paste the PowerShell script into the runbook authoring canvas.<br> ![Runbook PowerShell Script](./media/automation-scenario-aws-deployment/runbook-powershell-script.png)<br>

    >[AZURE.NOTE] Please note the following when working with the example PowerShell script:
    >
    > - The runbook contains a number of default parameter values. Please evaluate all default values and update where necessary.
    > - If you have stored your AWS credentials as a credential asset named differently than **AWScred**, you will need to update the script on line 57 to match accordingly.  
    > - When working with the AWS CLI commands in PowerShell, especially with this example runbook, you must specify the AWS region. Otherwise, the cmdlets will fail.  View AWS topic [Specify AWS Region](http://docs.aws.amazon.com/powershell/latest/userguide/pstools-installing-specifying-region.html) in the AWS Tools for PowerShell document for further details.  
<br>
7. To retrieve a list of image names from your AWS subscription, launch PowerShell ISE and import the AWS PowerShell Module.  Authenticate against AWS by replacing **Get-AutomationPSCredential** in your ISE environment with **AWScred = Get-Credential**.  This will prompt you for your credentials and you can provide your **Access Key ID** for the username and **Secret Access Key** for the password.  See the example below:

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
   The following output is returned:<br>
   ![Get AWS images](./media/automation-scenario-aws-deployment/powershell-ise-output.png)  
8. Copy and paste the one of the image names in an Automation variable as referenced in the runbook as **$InstanceType**. Since in this example we are using the free AWS tiered subscription, we'll use **t2.micro** for our runbook example.
9. Save the runbook, then click **Publish** to publish the runbook and then **Yes** when prompted.


### Testing the AWS VM runbook
Before we proceed with testing the runbook, we need to verify a few things. Specifically:

   -  An asset for authenticating against AWS has been created called **AWScred** or the script has been updated to reference the name of your credential asset.  
   -  The AWS PowerShell module has been imported in Azure Automation
   -  A new runbook has been created and parameter values have been verified and updated where necessary
   -  **Log verbose records** and optionally **Log progress records** under the runbook setting **Logging and tracing** have been set to **On**.<br> ![Runbook Logging and Tracing](./media/automation-scenario-aws-deployment/runbook-settings-logging-and-tracing.png)

1. We want to start the runbook, so click **Start** and then click **OK** when the Start Runbook blade opens.
2. On the Start Runbook blade, provide a **VMname**.  Accept the default values for the other parameters that you preconfigured in the script earlier.  Click **OK** to start the runbook job.<br> ![Start New-AwsVM runbook](./media/automation-scenario-aws-deployment/runbook-start-job-parameters.png)
3. A job pane is opened for the runbook job that we just created. Close this pane.
4. We can view progress of the job and view output **Streams** by selecting the **All Logs** tile from the runbook job blade.<br> ![Stream output](./media/automation-scenario-aws-deployment/runbook-job-streams-output.png)
5. To confirm the VM is being provisioned, log into the AWS Management Console if you are not currently logged in.<br> ![AWS console deployed VM](./media/automation-scenario-aws-deployment/aws-instances-status.png)

## Next Steps
-   To get started with Graphical runbooks, see [My first graphical runbook](automation-first-runbook-graphical.md)
-	To get started with PowerShell workflow runbooks, see [My first PowerShell workflow runbook](automation-first-runbook-textual.md)
-	To know more about runbook types, their advantages and limitations, see [Azure Automation runbook types](automation-runbook-types.md)
-	For more information on PowerShell script support feature, see [Native PowerShell script support in Azure Automation](https://azure.microsoft.com/blog/announcing-powershell-script-support-azure-automation-2/)
