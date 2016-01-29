<properties 
   pageTitle="Troubleshooting tips for common errors in Azure Automation| Microsoft Azure"
   description="This article provides basic troubleshooting steps to fix common errors you might hit when working with Azure Automation."
   services="automation"
   documentationCenter=""
   authors="SnehaGunda"
   manager="stevenka"
   editor="tysonn" 
   tags="top-support-issue"/>
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="01/25/2016"
   ms.author="sngun"/>

# Troubleshooting tips for common errors in Azure Automation

When you encounter a problem while working with Automation resources such as runbooks, modules and Automation assets, you need to discover what went wrong. This article explains some of the common errors you might hit when working with Azure Automation and suggests possible remediation.

## Troubleshoot authentication errors when working with Azure Automation runbooks  


**Scenario: Login to Azure Account failed**

**Error:** 
If you receive the error "Unknown_user_type: Unknown User Type" when working with Add-AzureAccount or Login-AzureRmAccount cmdlets, then use the following troubleshooting steps.

**Troubleshooting tips:** 
In order to determine what is wrong, use the following steps:  

1. Make sure that you don’t have any special characters including the **@** character in the Automation credential asset name that you are using to connect to Azure.  

2. Check that you can use the username and password that you have stored in the Azure Automation credential in your local PowerShell ISE editor, you can do this by running the following cmdlets in the PowerShell ISE:  

        $Cred = Get-Credential  
        #Using Azure Service Management   
        Add-AzureAccount –Credential $Cred  
        #Using Azure Resource Manager  
        Login-AzureRmAccount – Credential $Cred

3. If your authentication fails locally, this means that you haven’t set up your Azure Active Directory credentials properly, refer to [Authenticating to Azure using Azure Active Directory](https://azure.microsoft.com/blog/azure-automation-authenticating-to-azure-using-azure-active-directory/) blog post to get the Active Directory account set up correctly.    


**Scenario: Unable to find the Azure subscription**

**Error:**
If you receive the error "The subscription named ``<subscription name>`` cannot be found" when working with Select-AzureSubscription or Select-AzureRmSubscription cmdlets, then use the following troubleshooting steps.
 
**Troubleshooting tips:** 
In order to determine if you have properly authenticated and have access to the subscription you are trying to select, use the following steps:  

1. Make sure that you run **Add-AzureAccount** before running **Select-AzureSubscription.**  

2. If you still see this error message, modify your code by adding **Get-AzureSubscription** cmdlet following the **Add-AzureAccount** cmdlet and execute the code.  Now verify if the output of Get-AzureSubscription contains your subscription details.  
    * If you don't get any subscription details in the output, this means the subscription isn’t initialized yet.  
    * If you see the subscription details in the output, confirm that you are using the proper subscription name or ID with the **Select-AzureSubscription** cmdlet.   



**Scenario: Authentication to Azure failed as multi-factor authentication is enabled**

**Error:** 
If you receive the error “Add-AzureAccount: AADSTS50079: Strong authentication enrollment (proof-up) is required” when authenticating to Azure using your Azure username and password, then use the following troubleshooting steps.

**Reason:** 
You will not be able to use an Active Directory user to authenticate to Azure if you have multi-factor authentication on your Azure account.  Instead, you can use a certificate or a service principal to authenticate to Azure.

**Troubleshooting tips:** 
To use a certificate with the Azure Service Management cmdlets, refer to [creating and adding a certificate to manage Azure services.](http://blogs.technet.com/b/orchestrator/archive/2014/04/11/managing-azure-services-with-the-microsoft-azure-automation-preview-service.aspx) To use a service principal with Azure Resource Manager cmdlets, refer to [creating service principal using Azure portal](./resource-group-create-service-principal-portal.md) and [authenticating a service principal with Azure Resource Manager.](./resource-group-authenticate-service-principal.md)



## Troubleshoot common errors when working with runbooks 

**Scenario: Cannot bind parameters when executing a runbook**

**Error:** 
If your runbook fails with the error "Cannot bind parameter ``<ParameterName>``. Cannot convert the ``<ParameterType>`` value of type Deserialized ``<ParameterType>`` to type ``<ParameterType>``" then use the following troubleshooting steps. 

**Reason:** 
If your runbook is a PowerShell Workflow, it stores complex objects in a deserialized format in order to persist your runbook state if the workflow is suspended.  

**Troubleshooting tips:**  
Any of the following three solutions will fix this problem:

1. If you are piping complex objects from one cmdlet to another, wrap these cmdlets in an InlineScript.  
2. Pass the name or value that you need from the complex object instead of passing the entire object.  

3. You can use a PowerShell runbook instead of a PowerShell Workflow runbook.  


**Scenario: Runbook job failed as allocated quota exceeded**

**Error:** 
If your runbook job fails with the error "The quota for the monthly total job run time have been reached for this subscription" then use the following troubleshooting steps. 

**Reason:** 
This occurs when the job execution exceeds the 500-minute free quota for your account. Runbooks are priced per job execution minute that are based on the number of job run time minutes used in a given month. This quota applies to all types of job execution (such as testing a job, starting a job from the portal, executing a job using webhooks and scheduling a job to execute) using either Azure portal or running then in your datacenter. To learn more about pricing for Automation see [Automation pricing](https://azure.microsoft.com/pricing/details/automation/).

**Troubleshooting tips:** 
If you want to use more than 500 minutes of processing per month you will need to change your subscription from the Free tier to the Basic tier. You can upgrade to the Basic tier using the following steps:  

1. Login to your Azure subscription  
2. Select the Automation account you wish to upgrade  
3. Click on Settings > Pricing tier and Usage > Pricing tier  
4. In Choose your pricing tier blade, select **Basic**    


**Scenario: Cmdlet not recognized when executing a runbook**

**Error:** 
If your runbook job fails with the error "``<cmdlet name>``: The term ``<cmdlet name>`` is not recognized as the name of a cmdlet, function, script file, or operable program." then use the following troubleshooting steps. 

**Reason:** 
This error is caused when the PowerShell engine cannot find the cmdlet you are using in your runbook.  This could be because the module containing the cmdlet is missing from the account, there is a name conflict with a runbook name, or the cmdlet also exists in another module and Automation cannot resolve the name. 

**Troubleshooting tips:** 
Any of the following solutions will fix the problem:  

- Check if you have entered the cmdlet name correctly, and verify that the path to the cmdlet is correct.  

- Make sure the cmdlet exists in your Automation account and there are no conflicts. To verify if the cmdlet is present, open a runbook in edit mode and search for the cmdlet you want to find in the library or run **Get-Command ``<CommandName>``**.  Once you have validated that the cmdlet is available to the account, and that there are no name conflicts with other cmdlets or runbooks, add it to the canvas and ensure that you are using a valid parameter set in your runbook.  

- If you do have a name conflict and the cmdlet is available in two different modules, you can resolve this by using the fully qualified name for the cmdlet, for example, you can use **ModuleName\CmdletName**.  


## Troubleshoot common errors when working with importing modules 

**Scenario: Module fails to import or cmdlets can't be executed after importing**

**Error:** 
My module fails to import or imports successfully, but no cmdlets are extracted.

**Reason:** 
Some common reasons that a module might not successfully import to Azure Automation are:  

- If the structure does not match the structure Automation needs it to be in.  

- If the module is dependent on another module that has not been deployed to your Automation account.  

- If the module is missing its dependencies in the folder.  

- You are using the **New-AzureRmAutomationModule** cmdlet to upload the module and have not given the full storage path or have not loaded the module using a publicly accessible URL.  

**Troubleshooting tips:**  

- Make sure that the module follows the following format:  
ModuleName.Zip **->** ModuleName or Version Number **->** (ModuleName.psm1, ModuleName.psd1)

- Open up the .psd1 file and check if the module has any dependencies.  If it does, upload these modules to the Automation account first.  

- Make sure that any referenced .dlls are present in the module folder.  



## Next steps

If you have followed the above troubleshooting steps and need additional help at any point in this article, you can:

- Get help from Azure experts. Submit your issue to the [MSDN Azure or Stack Overflow forums.](https://azure.microsoft.com/support/forums/)

- File an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click **Get support** under **Technical and billing support**.

- If you are looking for an Azure Automation runbook solution or an integration module, post a Script Request on Script Center. If you have feedback or feature requests for Azure Automation, post them on [User Voice](https://feedback.azure.com/forums/34192--general-feedback).