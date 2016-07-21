<properties
    pageTitle="Configure Azure Run As Account | Microsoft Azure"
    description="Tutorial that walks you through the creation, testing, and example use of security principal authentication in Azure Automation."
    services="automation"
    documentationCenter=""
    authors="mgoedtel"
    manager="jwhit"
    editor=""
	keywords="service principal name, setspn, azure authentication"/>
<tags
    ms.service="automation"
    ms.workload="tbd"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.date="07/20/2016"
    ms.author="magoedte"/>

# Authenticate Runbooks with Azure Run As account

This topic will show you how to configure an Automation account from the Azure portal using the  Run As account feature to authenticate runbooks managing resources in either Azure Resource Manager or Azure Service Management for Classic resource.

When you create a new Automation account in the Azure portal, it automatically creates:

- A new service principal in Azure Active Directory and assigns the Contributor role-based access control (RBAC), which will be used to manage Resource Manager resources using runbooks.  
- Classic Run As account by uploading a management certificate, which will be used to manage Azure Service Management or classic resources using runbooks.  

This simplifies the process for you and helps you quickly start building and deploying runbooks to support your automation needs.      

Using a service principal and classic Run As account, you can:

- Provide a standardized way to authenticate with Azure when managing Azure Resource Manager or Azure Service Management resources from runbooks in the Azure portal
- Automate the use of global runbooks configured in Azure Alerts


>[AZURE.NOTE] The Azure [Alert integration feature](../azure-portal/insights-receive-alert-notifications.md) with Automation Global Runbooks requires an Automation account that is configured with a service principal and classic Run As account. You can either select an Automation account that already has a service principal user and classic Run As account defined or choose to create a new one.

We will cover the following topics:

- Create a new Automation account from the portal
- Upgrade an existing Automation account and create the service principal using PowerShell
- Demonstrate with sample code, how to authenticate with Resource Manager resources
- Update an existing Automation account and create a classic Run As account using PowerShell
- Demonstrate with sample code, how to authenticate with Service Management resources

Before we do that, there are a few things that you should understand and consider before proceeding.

1. This does not impact existing Automation accounts already created in either the classic or Resource Manager deployment model.  
2. This will only work for Automation accounts created through the Azure portal.  Attempting to create an account from the classic portal will not replicate the Run As account configuration.
3. If you currently have runbooks and assets (i.e. schedules, variables, etc.) created for runbooks to manage classic resources, you will either need to migrate them from the current account to the new Run As account or update the Automation account with the classic Run As account using PowerShell.  
4. To authenticate using the new Automation account, you will need to modify your existing runbooks with the sample code.  **Please note** that the service principal is for authentication against Resource Manager resources, and the classic Run As account is for authenticating against Service Management resources.     


## Create a new Automation Account from the Azure Portal

In this section, you will perform the following steps to create a new Azure Automation account and service principal from the Azure portal.  This creates both the service principal and classic Run As account.  

>[AZURE.NOTE] The user performing these steps *must* be a member of the Subscription Admins role and co-administrator of the subscription which is granting access to the subscription for the user.  The user must also be added as a User to that subscriptions default Active Directory; the account does not need to be assigned to a privileged role. 

1. Log in to the Azure portal as a service administrator for the Azure subscription you want to manage.
2. Select **Automation Accounts**.
3. In the Automation Accounts blade, click **Add**.<br>![Add Automation Account](media/automation-sec-configure-azure-runas-account/create-automation-account-properties.png)

    >[AZURE.NOTE] If you see the following warning in the **Add Automation Account** blade, this is because your account is not a member of the Subscription admins role and co-admin of the subcription.<br>![Add Automation Account Warning](media/automation-sec-configure-azure-runas-account/create-account-without-perms.png)

4. In the **Add Automation Account** blade, in the **Name** box type in a name for your new Automation account.
5. If you have more than one subscription, specify one for the new account, as well as a new or existing **Resource group** and an Azure datacenter **Location**.
6. Verify the value **Yes** is selected for the **Create Azure Run As account** option, and click the **Create** button.  

    >[AZURE.NOTE] If you choose to not create the Run As account by selecting the option **No**, you will be presented with a warning message in the **Add Automation Account** blade.  While the account is created in the Azure portal and and assigned to the **Contributor** role in the subscription, it will not have a corresponding authentication identity within your classic or Resource Manager subscription directory service and therefore, no access to resources in your subscription.  This will prevent any runbooks referencing this account from being able to authenticate and perform tasks against resources in those deployment models.
    >
    >![Add Automation Account Warning](media/automation-sec-configure-azure-runas-account/create-account-decline-create-runas-msg.png)

7. While Azure creates the Automation account, you can track the progress under **Notifications** from the menu.

### Resources included

When the Run As account is successfully created, several resources are automatically created for you.  For the service principal, they are summarized in the following table.<br>

Resource|Description 
----|----
AzureAutomationTutorial Runbook|An example PowerShell runbook that demonstrates how to authenticate using the Run As account and gets all the Resource Manager resources.
AzureAutomationTutorialScript Runbook|An example PowerShell runbook that demonstrates how to authenticate using the Run As account and gets all the Resource Manager resources. 
AzureRunAsCertificate|Certificate asset automatically created during Automation account creation or using the PowerShell script below for an existing account.  It allows you to authenticate with Azure so that you can manage Azure Resource Manager resources from runbooks.  This certificate has a one-year lifespan. 
AzureRunAsConnection|Connection asset automatically created during Automation account creation or using the PowerShell script below for an existing account.

The following table summarizes resources for the classic Run As account.<br>

Resource|Description 
----|----
AzureClassicAutomationTutorial Runbook|An example runbook which gets all the Classic VMs in a subscription using the Classic Run As Account (certificate) and then outputs the VM name and status.
AzureClassicAutomationTutorial Script Runbook|An example runbook  which gets all the Classic VMs in a subscription using the Classic Run As Account (certificate) and then outputs the VM name and status.
AzureClassicRunAsCertificate|Certificate asset automatically created that is used to authenticate with Azure so that you can manage Azure classic resources from runbooks.  This certificate has a one-year lifespan. 
AzureClassicRunAsConnection|Connection asset automatically created that is used to authenticate with Azure so that you can manage Azure classic resources from runbooks.  


## Update an Automation Account using PowerShell

Here we provide you with the option to use PowerShell to update your existing Automation account if:

1. You created an Automation account, but declined to create the Run As account 
2. You already have an Automation account to manage Resource Manager resources and you want to update it to include the service principal for runbook authentication 
2. You already have an Automation account to manage classic resources and you want to update it to use the classic Run As instead of creating a new account and migrating your runbooks and assets to it   

Before proceeding, please verify the following:

1. You have downloaded and installed [Windows Management Framework (WMF) 4.0](https://www.microsoft.com/download/details.aspx?id=40855) if you are running Windows 7.   
    If you are running Windows Server 2012 R2, Windows Server 2012, Windows 2008 R2, Windows 8.1, and Windows 7 SP1, [Windows Management Framework 5.0](https://www.microsoft.com/download/details.aspx?id=50395) is available for installation.
2. Azure PowerShell 1.0. For information about this release and how to install it, see [How to install and configure Azure PowerShell](../powershell-install-configure.md). 
3. You have created an automation account.  This account will be referenced as the value for parameters –AutomationAccountName and -ApplicationDisplayName in both scripts below.

To get the values for *SubscriptionID*, *ResourceGroup*, and *AutomationAccountName*, which are required parameters for the scripts, in the Azure portal select your Automation account from the **Automation account** blade and select **All settings**.  From the **All settings** blade, under **Account Settings** select **Properties**.  In the **Properties** blade, you can note these values.<br> ![Automation Account properties](media/automation-sec-configure-azure-runas-account/automation-account-properties.png)  

### Create Service Principal PowerShell script

The PowerShell script below will configure the following:

- An Azure AD application that will be authenticated with the self-signed cert, create a service principal account for this application in Azure AD, and assigned the Contributor role (you could change this to Owner or any other role) for this account in your current subscription.  For further information, please review the [Role-based access control in Azure Automation](../automation/automation-role-based-access-control.md) article.
- An Automation certificate asset in the specified automation account named **AzureRunAsCertificate**, which holds the certificate used by the service principal.
- An Automation connection asset in the specified automation account named **AzureRunAsConnection**, which holds the applicationId, tenantId, subscriptionId, and certificate thumbprint.

<br>
1. Save the following script on your computer.  In this example, save it with the filename **New-AzureServicePrincipal.ps1**.

        #Requires -RunAsAdministrator
        Param (
        [Parameter(Mandatory=$true)]
        [String] $ResourceGroup,

        [Parameter(Mandatory=$true)]
        [String] $AutomationAccountName,

        [Parameter(Mandatory=$true)]
        [String] $ApplicationDisplayName,

        [Parameter(Mandatory=$true)]
        [String] $SubscriptionId,

        [Parameter(Mandatory=$true)]
        [String] $CertPlainPassword,

        [Parameter(Mandatory=$false)]
        [int] $NoOfMonthsUntilExpired = 12
        )

        Login-AzureRmAccount
        Import-Module AzureRM.Resources
        Select-AzureRmSubscription -SubscriptionId $SubscriptionId

        $CurrentDate = Get-Date
        $EndDate = $CurrentDate.AddMonths($NoOfMonthsUntilExpired)
        $KeyId = (New-Guid).Guid
        $CertPath = Join-Path $env:TEMP ($ApplicationDisplayName + ".pfx")

        $Cert = New-SelfSignedCertificate -DnsName $ApplicationDisplayName -CertStoreLocation cert:\LocalMachine\My -KeyExportPolicy Exportable -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider"

        $CertPassword = ConvertTo-SecureString $CertPlainPassword -AsPlainText -Force
        Export-PfxCertificate -Cert ("Cert:\localmachine\my\" + $Cert.Thumbprint) -FilePath $CertPath -Password $CertPassword -Force | Write-Verbose

        $PFXCert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate -ArgumentList @($CertPath, $CertPlainPassword)
        $KeyValue = [System.Convert]::ToBase64String($PFXCert.GetRawCertData())

        $KeyCredential = New-Object  Microsoft.Azure.Commands.Resources.Models.ActiveDirectory.PSADKeyCredential
        $KeyCredential.StartDate = $CurrentDate
        $KeyCredential.EndDate= $EndDate
        $KeyCredential.KeyId = $KeyId
        $KeyCredential.Type = "AsymmetricX509Cert"
        $KeyCredential.Usage = "Verify"
        $KeyCredential.Value = $KeyValue

        # Use Key credentials
        $Application = New-AzureRmADApplication -DisplayName $ApplicationDisplayName -HomePage ("http://" + $ApplicationDisplayName) -IdentifierUris ("http://" + $KeyId) -KeyCredentials $keyCredential

        New-AzureRMADServicePrincipal -ApplicationId $Application.ApplicationId | Write-Verbose
        Get-AzureRmADServicePrincipal | Where {$_.ApplicationId -eq $Application.ApplicationId} | Write-Verbose

        $NewRole = $null
        $Retries = 0;
        While ($NewRole -eq $null -and $Retries -le 2)
        {
          # Sleep here for a few seconds to allow the service principal application to become active (should only take a couple of seconds normally)
         Sleep 5
         New-AzureRMRoleAssignment -RoleDefinitionName Contributor -ServicePrincipalName $Application.ApplicationId | Write-Verbose -ErrorAction SilentlyContinue
         Sleep 5
         $NewRole = Get-AzureRMRoleAssignment -ServicePrincipalName $Application.ApplicationId -ErrorAction SilentlyContinue
         $Retries++;
        }

        # Get the tenant id for this subscription
        $SubscriptionInfo = Get-AzureRmSubscription -SubscriptionId $SubscriptionId
        $TenantID = $SubscriptionInfo | Select TenantId -First 1

        # Create the automation resources
        New-AzureRmAutomationCertificate -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Path $CertPath -Name AzureRunAsCertificate -Password $CertPassword -Exportable | write-verbose

        # Create a Automation connection asset named AzureRunAsConnection in the Automation account. This connection uses the service principal.
        $ConnectionAssetName = "AzureRunAsConnection"
        Remove-AzureRmAutomationConnection -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Name $ConnectionAssetName -Force -ErrorAction SilentlyContinue
        $ConnectionFieldValues = @{"ApplicationId" = $Application.ApplicationId; "TenantId" = $TenantID.TenantId; "CertificateThumbprint" = $Cert.Thumbprint; "SubscriptionId" = $SubscriptionId}
        New-AzureRmAutomationConnection -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Name $ConnectionAssetName -ConnectionTypeName AzureServicePrincipal -ConnectionFieldValues $ConnectionFieldValues
 
<br>
2. On your computer, start **Windows PowerShell** from the **Start** screen with elevated user rights.  
3. From the elevated PowerShell command-line shell, navigate to the folder which contains the script created in Step 1 and execute the script changing the values for parameters *–ResourceGroup*, *-AutomationAccountName*, *-ApplicationDisplayName*, *-SubscriptionId*, and *-CertPlainPassword*.
    
   >[AZURE.NOTE] You will be prompted to authenticate with Azure after you execute the script.  You *must* log in with an account that is a Service administrator and co-admin of the subscription.   
    
    .\New-AzureServicePrincipal.ps1 -ResourceGroup <ResourceGroupName> 
    -AutomationAccountName <NameofAutomationAccount> `
    -ApplicationDisplayName <DisplayNameofAutomationAccount> `
    -SubscriptionId <SubscriptionId> `
    -CertPlainPassword "<StrongPassword>"  
<br>
After the script completes successfully, proceed to the next section to test and verify the new credential configuration.

### Verify authentication

Next we will perform a small test to confirm you are able to successfully authenticate using the new service principal. If you’re unable to successfully authenticate, go back to Step 1 and confirm each of the previous steps again.    

1. In the Azure Portal, open the Automation account created earlier.  
2. Click on the **Runbooks** tile to open the list of runbooks.
3. Select the **AzureAutomationTutorialScript** runbook and then click **Start** to to start the runbook.  You will receive a prompt verifying you wish to start the runbook.
4. A [runbook job](automation-runbook-execution.md) is created, the Job blade is displayed, and the job status displayed in the **Job Summary** tile.  
5. The job status will start as *Queued* indicating that it is waiting for a runbook worker in the cloud to become available. It will then move to *Starting* when a worker claims the job, and then *Running* when the runbook actually starts running.  
6. When the runbook job completes, we should see a status of **Completed**.<br> ![Security Principal Runbook Test](media/automation-sec-configure-azure-runas-account/job-summary-automationtutorialscript.png)<br>
7. To see the detailed results of the runbook, click on the **Output** tile.
8. In the **Output** blade, you should see it has successfully authenticated and returned a list of all resources available in the resource group. 
9. Close the **Output** blade to return to the **Job Summary** blade.
13. Close the **Job Summary** and the corresponding **AzureAutomationTutorialScript** runbook blade.

### Create classic Run As account PowerShell script

The PowerShell script below will configure the following:

- An Automation certificate asset in the specified automation account named **AzureClassicRunAsCertificate**, which holds the certificate used to authenticate your runbooks.
- An Automation connection asset in the specified automation account named **AzureClassicRunAsConnection**, which holds the subscriptionId and certificate asset name.

The script will create a self-signed management certificate and save it to the temporary files folder on your computer under the user profile used to execute the PowerShell session - *%USERPROFILE%\AppData\Local\Temp*.  After script execution, you will need to upload the Azure management certificate into the management store for the subscription the Automation account was created in.  The steps below will walk you through the process of executing the script and uploading the certificate.  

1. Save the following script on your computer.  In this example, save it with the filename **New-AzureClassicRunAsAccount.ps1**.

        #Requires -RunAsAdministrator
        Param (
        [Parameter(Mandatory=$true)]
        [String] $ResourceGroup,

        [Parameter(Mandatory=$true)]
        [String] $AutomationAccountName,

        [Parameter(Mandatory=$true)]
        [String] $ApplicationDisplayName,

        [Parameter(Mandatory=$true)]
        [String] $SubscriptionId,

        [Parameter(Mandatory=$true)]
        [String] $CertPlainPassword,

        [Parameter(Mandatory=$false)]
        [int] $NoOfMonthsUntilExpired = 12
        )

        Login-AzureRmAccount
        Import-Module AzureRM.Resources
        $Subscription = Select-AzureRmSubscription -SubscriptionId $SubscriptionId
        $SubscriptionName = $subscription.Subscription.SubscriptionName

        $CurrentDate = Get-Date
        $EndDate = $CurrentDate.AddMonths($NoOfMonthsUntilExpired)
        $KeyId = (New-Guid).Guid
        $CertPath = Join-Path $env:TEMP ($ApplicationDisplayName + ".pfx")
        $CertPathCer = Join-Path $env:TEMP ($ApplicationDisplayName + ".cer")

        $Cert = New-SelfSignedCertificate -DnsName $ApplicationDisplayName -CertStoreLocation cert:\LocalMachine\My -KeyExportPolicy Exportable -Provider "Microsoft Enhanced RSA and AES Cryptographic Provider"

        $CertPassword = ConvertTo-SecureString $CertPlainPassword -AsPlainText -Force
        Export-PfxCertificate -Cert ("Cert:\localmachine\my\" + $Cert.Thumbprint) -FilePath $CertPath -Password $CertPassword -Force | Write-Verbose
        Export-Certificate -Cert ("Cert:\localmachine\my\" + $Cert.Thumbprint) -FilePath $CertPathCer -Type CERT | Write-Verbose

        # Create the automation resources
        $ClassicCertificateAssetName = "AzureClassicRunAsCertificate"
        New-AzureRmAutomationCertificate -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Path $CertPath -Name $ClassicCertificateAssetName  -Password $CertPassword -Exportable | write-verbose

        # Create a Automation connection asset named AzureClassicRunAsConnection in the Automation account. This connection uses the ClassicCertificateAssetName.
        $ConnectionAssetName = "AzureClassicRunAsConnection"
        Remove-AzureRmAutomationConnection -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Name $ConnectionAssetName -Force -ErrorAction SilentlyContinue
        $ConnectionFieldValues = @{"SubscriptionName" = $SubscriptionName; "SubscriptionId" = $SubscriptionId; "CertificateAssetName" = $ClassicCertificateAssetName}
        New-AzureRmAutomationConnection -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Name $ConnectionAssetName -ConnectionTypeName AzureClassicCertificate -ConnectionFieldValues $ConnectionFieldValues 

        Write-Host -ForegroundColor red "Please upload the cert $CertPathCer to the Management store by following the steps below."
        Write-Host -ForegroundColor red "Log in to the Microsoft Azure Management portal (https://manage.windowsazure.com) and select Settings -> Management Certificates."
        Write-Host -ForegroundColor red "Then click Upload and upload the certificate $CertPathCer"

2. On your computer, start **Windows PowerShell** from the **Start** screen with elevated user rights.  
3. From the elevated PowerShell command-line shell, navigate to the folder which contains the script created in Step 1 and execute the script changing the values for parameters *–ResourceGroup*, *-AutomationAccountName*, *-ApplicationDisplayName*, *-SubscriptionId*, and *-CertPlainPassword*.<br>

   >[AZURE.NOTE] You will be prompted to authenticate with Azure after you execute the script.  You *must* log in with an account that is a Service administrator and co-admin of the subscription.
   
    .\New-AzureClassicRunAsAccount.ps1 -ResourceGroup <ResourceGroupName> 
    -AutomationAccountName <NameofAutomationAccount> `
    -ApplicationDisplayName <DisplayNameofAutomationAccount> `
    -SubscriptionId <SubscriptionId> `
    -CertPlainPassword "<StrongPassword>" 

After the script completes successfully, you will need to copy the certificate created in your user profile **Temp** folder.  Follow the steps for [uploading a management API certificate](../azure-api-management-certs.md) to the Azure classic portal.  Then proceed to the next section to test and verify the new credential configuration.  


### Verify authentication

Next we will perform a small test to confirm you are able to successfully authenticate using the new classic Run As account. If you’re unable to successfully authenticate, go back to Step 1 and confirm each of the previous steps again.    

1. In the Azure Portal, open the Automation account created earlier.  
2. Click on the **Runbooks** tile to open the list of runbooks.
3. Select the **AzureClassicAutomationTutorialScript** runbook and then click **Start** to to start the runbook.  You will receive a prompt verifying you wish to start the runbook.
4. A [runbook job](automation-runbook-execution.md) is created, the Job blade is displayed, and the job status displayed in the **Job Summary** tile.  
5. The job status will start as *Queued* indicating that it is waiting for a runbook worker in the cloud to become available. It will then move to *Starting* when a worker claims the job, and then *Running* when the runbook actually starts running.  
6. When the runbook job completes, we should see a status of **Completed**.<br> ![Security Principal Runbook Test](media/automation-sec-configure-azure-runas-account/job-summary-automationclassictutorialscript.png)<br>
7. To see the detailed results of the runbook, click on the **Output** tile.
8. In the **Output** blade, you should see it has successfully authenticated and returned a list of all resources available in the resource group. 
9. Close the **Output** blade to return to the **Job Summary** blade.
13. Close the **Job Summary** and the corresponding **AzureClassicAutomationTutorialScript** runbook blade.

## Sample code to authenticate with Resource Manager resources

You can use the updated sample code below, taken from the **AzureAutomationTutorialScript** example runbook, to authenticate using the Run As account to manage Resource Manager resources with your runbooks. 

    $connectionName = "AzureRunAsConnection"
    $SubId = Get-AutomationVariable -Name 'SubscriptionId'
    try
    {
       # Get the connection "AzureRunAsConnection "
       $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         
       
       "Logging in to Azure..."
       Add-AzureRmAccount `
         -ServicePrincipal `
         -TenantId $servicePrincipalConnection.TenantId `
         -ApplicationId $servicePrincipalConnection.ApplicationId `
         -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
	   "Setting context to a specific subscription"	 
	   Set-AzureRmContext -SubscriptionId $SubId	 		 
    }
    catch {
        if (!$servicePrincipalConnection)
        {
           $ErrorMessage = "Connection $connectionName not found."
           throw $ErrorMessage
         } else{
            Write-Error -Message $_.Exception
            throw $_.Exception
         }
    } 
   

The script includes two additional lines of code to support referencing a subscription context so you can easily work between multiple subscriptions. A variable asset named SubscriptionId contains the ID of the subscription, and after the Add-AzureRmAccount cmdlet statement, the [Set-AzureRmContext cmdlet](https://msdn.microsoft.com/library/mt619263.aspx) is stated with the parameter set *-SubscriptionId*. If the variable name is too generic, you can revise the name of the variable to include a prefix or other naming convention to make it easier to identify for your purposes. Alternatively, you can use the parameter set -SubscriptionName instead of -SubscriptionId with a corresponding variable asset.  


## Sample code to authenticate with Service Management resources

You can use the updated sample code below, taken from the **AzureClassicAutomationTutorialScript** example runbook, to authenticate using the Run As account to manage classic resources with your runbooks. 
    
    $ConnectionAssetName = "AzureClassicRunAsConnection"
    # Get the connection
    $connection = Get-AutomationConnection -Name $connectionAssetName        
    
    # Authenticate to Azure with certificate
    Write-Verbose "Get connection asset: $ConnectionAssetName" -Verbose
    $Conn = Get-AutomationConnection -Name $ConnectionAssetName
    if ($Conn -eq $null)
    {
       throw "Could not retrieve connection asset: $ConnectionAssetName. Assure that this asset exists in the Automation account."
    }
      
    $CertificateAssetName = $Conn.CertificateAssetName
    Write-Verbose "Getting the certificate: $CertificateAssetName" -Verbose
    $AzureCert = Get-AutomationCertificate -Name $CertificateAssetName
    if ($AzureCert -eq $null)
    {
       throw "Could not retrieve certificate asset: $CertificateAssetName. Assure that this asset exists in the Automation account."
    }
      
    Write-Verbose "Authenticating to Azure with certificate." -Verbose
    Set-AzureSubscription -SubscriptionName $Conn.SubscriptionName -SubscriptionId $Conn.SubscriptionID -Certificate $AzureCert 
    Select-AzureSubscription -SubscriptionId $Conn.SubscriptionID


## Next steps

- For more information about Service Principals, refer to [Application Objects and Service Principal Objects](../active-directory/active-directory-application-objects.md).
- For more information about Role-based Access Control in Azure Automation, refer to [Role-based access control in Azure Automation](../automation/automation-role-based-access-control.md).
- For more information about certificates and Azure services, refer to [Certificates overview for Azure Cloud Services](../cloud-services/cloud-services-certs-create.md)
