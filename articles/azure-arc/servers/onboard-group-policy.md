---
title: Connect machines at scale using group policy
description: In this article, you learn how to connect machines to Azure using Azure Arc-enabled servers using group policy. 
ms.date: 04/29/2022
ms.topic: conceptual
ms.custom: template-how-to
---

# Connect machines at scale using Group Policy

You can onboard Active Directory–joined Windows machines to Azure Arc-enabled servers at scale using Group Policy.

You'll first need to set up a local remote share with the Connected Machine Agent and define a configuration file specifying the Arc-enabled server's landing zone within Azure. You will then define a Group Policy Object to run an onboarding script using a scheduled task. This Group Policy can be applied at the site, domain, or organizational unit level. Assignment can also use Access Control List (ACL) and other security filtering native to Group Policy. Machines in the scope of the Group Policy will be onboarded to Azure Arc-enabled servers.

Before you get started, be sure to review the [prerequisites](prerequisites.md) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions). Also review our [at-scale planning guide](plan-at-scale-deployment.md) to understand the design and deployment criteria, as well as our management and monitoring recommendations.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prepare a remote share

The Group Policy to onboard Azure Arc-enabled servers requires a remote share with the Connected Machine Agent. You will need to:

1. Prepare a remote share to host the Azure Connected Machine agent package for Windows and the configuration file. You need to be able to add files to the distributed location.

1. Download the latest version of the [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center and save it to the remote share. 

## Generate an onboarding script and configuration file from Azure portal

Before you can run the script to connect your machines, you'll need to do the following:

1. Follow the steps to [create a service principal for onboarding at scale](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

    * Assign the Azure Connected Machine Onboarding role to your service principal and limit the scope of the role to the target Azure landing zone.
    * Make a note of the Service Principal Secret; you'll need this value later.

1. Modify and save the following configuration file to the remote share as `ArcConfig.json`. Edit the file with your Azure subscription, resource group, and location details. Use the service principal details from step 1 for the last two fields:

```
{ 
        "tenant-id": "INSERT AZURE TENANTID", 
        "subscription-id": "INSERT AZURE SUBSCRIPTION ID", 
        "resource-group": "INSERT RESOURCE GROUP NAME", 
        "location": "INSERT REGION", 
        "service-principal-id": "INSERT SPN ID", 
        "service-principal-secret": "INSERT SPN Secret" 
    } 
```

The group policy will project machines as Arc-enabled servers in the Azure subscription, resource group, and region specified in this configuration file.

## Modify and save the onboarding script

Before you can run the script to connect your machines, you'll need to modify and save the onboarding script:

1. Edit the field for `remotePath` to reflect the distributed share location with the configuration file and Connected Machine Agent.

1. Edit the `localPath` with the local path where the logs generated from the onboarding to Azure Arc-enabled servers will be saved per machine.

1. Save the modified onboarding script locally and note its location. This will be referenced when creating the Group Policy Object.

```
[string] $remotePath = "\\dc-01.contoso.lcl\Software\Arc"
[string] $localPath = "$env:HOMEDRIVE\ArcDeployment"

[string] $RegKey = "HKLM\SOFTWARE\Microsoft\Azure Connected Machine Agent"
[string] $logFile = "installationlog.txt"
[string] $InstallationFolder = "ArcDeployment"
[string] $configFilename = "ArcConfig.json"

if (!(Test-Path $localPath) ) {
    $BitsDirectory = new-item -path C:\ -Name $InstallationFolder -ItemType Directory 
    $logpath = new-item -path $BitsDirectory -Name $logFile -ItemType File
}
else{
    $BitsDirectory = "C:\ArcDeployment"
 }

function Deploy-Agent {
    [bool] $isDeployed = Test-Path $RegKey
    if ($isDeployed) {
        $logMessage = "Azure Arc Serverenabled agent is deployed , exit process"
        $logMessage >> $logpath
        exit
    }
    else { 
        Copy-Item -Path "$remotePath\*" -Destination $BitsDirectory -Recurse -Verbose
        $exitCode = (Start-Process -FilePath msiexec.exe -ArgumentList @("/i", "$BitsDirectory\AzureConnectedMachineAgent.msi" , "/l*v", "$BitsDirectory\$logFile", "/qn") -Wait -Passthru).ExitCode
        
        if($exitCode -eq 0){
            Start-Sleep -Seconds 120
            $x=   & "$env:ProgramW6432\AzureConnectedMachineAgent\azcmagent.exe" connect --config "$BitsDirectory\$configFilename"
            $msg >> $logpath 
            }
        else {
             $message = (net helpmsg $exitCode)
             $message >> $logpath 
            }
        }
}

Deploy-Agent
```

## Create a Group Policy Object

Create a new Group Policy Object (GPO) to run the onboarding script using the configuration file details: 

1. Open the Group Policy Management Console (GPMC). 

1. Navigate to the Organization Unit (OU), Domain, or Security Group in your AD forest that contains the machines you want to onboard to Azure Arc-enabled servers. 

1. Right-click on this set of resources and select **Create a GPO in this domain, and Link it here.**  

1. Assign the name “Onboard servers to Azure Arc-enabled servers” to this new Group Policy Object (GPO).

## Create a scheduled task

The newly created GPO needs to be modified to run the onboarding script at the appropriate cadence. Use Group Policy’s built-in Scheduled Task capabilities to do so: 

1. Select **Computer Configuration > Preferences > Control Panel Settings > Scheduled Tasks**.

1. Right-click in the blank area and select **New > Scheduled Task**. 

Your workstation must be running Windows 7 or higher to be able to create a Scheduled Task from Group Policy Management Console. 

### Assign general parameters for the task

In the **General** tab, set the following parameters under **Security Options**:

1. In the field **When running the task, use the following user account:**, enter "NT AUTHORITY\System". 

1. Select **Run whether user is logged on or not**. 

1. Check the box for **Run with highest privileges**. 

1. In the field **Configure for**, select **Windows Vista or Window 2008**. 

:::image type="content" source="media/onboard-group-policy/general-properties.png" alt-text="Screenshot of the Azure Arc agent Deployment and Configuration properties window." :::

### Assign trigger parameters for the task

In the **Triggers** tab, select **New**, then enter the following parameters in the **New Trigger** window:

1. In the field **Begin the task**, select **On a schedule**. 

1. Under **Settings**, select **One time** and enter the date and time for the task to run.  

1. Under **Advanced Settings**, check the box for **Enabled**.  

1. Once you've set the trigger parameters, select **OK**. 

:::image type="content" source="media/onboard-group-policy/new-trigger.png" alt-text="Screenshot of the New Trigger window." :::

### Assign action parameters for the task

In the **Actions** tab, select **New**, then enter the follow parameters in the **New Action** window: 

1. For **Action**, select **Start a program** from the dropdown.  

1. For **Program/script**, enter `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`.

1. For **Add arguments (optional)**, enter `-ExecutionPolicy Bypass -command <Path to Deployment Script>`. 

    Note that you must enter the location of the deployment script, modified earlier with the `DeploymentPath` and `LocalPath`, instead of the placeholder "Path to Deployment Script". 

1. For **Start In (Optional)**, enter `C:\`. 

1. Once you've set the action parameters, select **OK**.

:::image type="content" source="media/onboard-group-policy/new-action.png" alt-text="Screenshot of the New Action window." :::

## Apply the Group Policy Object 

On the Group Policy Management Console, right-click on the desired Organizational Unit and select the option to link an existent GPO. Choose the Group Policy Object defined in the Scheduled Task. After 10 or 20 minutes, the Group Policy Object will be replicated to the respective domain controllers. Learn more about [creating and managing group policy in Azure AD Domain Services](../../active-directory-domain-services/manage-group-policy.md). 

After you have successfully installed the agent and configured it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the servers in your Organizational Unit have successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal). 

## Next steps

- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
- Review connection troubleshooting information in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).
- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md) for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying that the machine is reporting to the expected Log Analytics workspace, enabling monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
- Learn more about [Group Policy](/troubleshoot/windows-server/group-policy/group-policy-overview).
