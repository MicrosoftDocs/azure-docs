<properties
   pageTitle="Continuous integration for Service Fabric | Microsoft Azure"
   description="Get an overview of how to set up continuous integration for a Service Fabric application by using Visual Studio Team Services (VSTS)."
   services="service-fabric"
   documentationCenter="na"
   authors="cawams"
   manager="timlt"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="10/16/2015"
   ms.author="cawa" />

# Set up continuous integration for a Service Fabric application using Visual Studio Team Services (VSTS)

This article takes you through setting up continuous integration (CI) for a Service Fabric application using Visual Studio Team Services (VSTS) so that your application can be built, packaged, and deployed in an automated fashion. Note that this document reflects the current experience and is expected to change as development progresses. Also, these instructions re-create the cluster from scratch every time.

## Prerequisites

To get started, set up your project on Visual Studio Team Services.

1. If you haven't already, create a Team Services account using your [Microsoft account](http://www.microsoft.com/account).

2. Create a new project on Team Services using the Microsoft account.

3. Push the source for your new or existing Service Fabric app to this project.

See [Connect to Visual Studio](https://www.visualstudio.com/get-started/setup/connect-to-visual-studio-online) for more information on working with Team Services projects.

## Set up your Service Principal

### Set up authentication for automation

Before you can set up the build machine, you need to create a [Service Principal](../resource-group-create-service-principal-portal.md) which the build agent will use to authenticate to Azure. You also need to create a certificate and upload it to a Key Vault, because Azure Key Vault does not support Service Principal authentication. You can perform these steps from any machine. Your dev machine is a good choice.

### Install Azure PowerShell and sign in

1.	Install Azure PowerShell.
    - Install PowerShellGet. To do this, install [Windows Management Framework 5.0](http://www.microsoft.com/download/details.aspx?id=48729), which includes PowerShellGet.
    >[AZURE.NOTE] You can skip this step if you are running Windows 10 with the latest updates.

2.	Install and update the AzureRM module.

    1.  If you have any previous version of Azure PowerShell installed, remove it. Right-click on start button, then select "Add/Remove Programs". Search for "Azure PowerShell" and uninstall it.

    2.  Launch a PowerShell command prompt.

    3.	Install the "AzureRM" module using the command `Install-Module AzureRM`.

    4.	Update the AzureRM module using the command `Update-AzureRM`.

3.	Disable (or enable) Azure data collection.

    Azure cmdlets will prompt you to opt in or out of data collection until you make a choice. These prompts will block automation while waiting for user input. To suppress these prompts by making a choice ahead of time, run one of the following commands:

    - Enable-AzureRmDataCollection

    - Disable-AzureRmDataCollection

4.	Sign in to Azure PowerShell.

    1. Run the command `Login-AzureRmAccount`.

    2. In the dialog that appears, enter your Azure credentials.

    3. Run the command `Get-AzureRmSubscription`.

    4. Find the subscription you want to use and then run the command `Select-AzureRmSubscription -SubscriptionId <id for your subscription>`."

### Create a Service Principal

1.	Download and extract [Manual.zip](http://go.microsoft.com/fwlink/?LinkId=703773) to a folder on this machine.

2.	In an admin PowerShell command prompt, change to the directory to which you extracted `Manual.zip`.

3.	Choose a password for the Service Principal using the following command. Remember this password, because it will be used as a build variable.

    ```
    $password = Read-Host -AsSecureString
    ```
4.	Run the PowerShell script Create-ServicePrincipal.ps1 with the following parameters:

    |Parameter|Value|
    |---|---|
    |DisplayName|Any name.|
    |HomePage|Any URI. Doesn't have to actually exist.|
    |IdentifierUri|Any unique URI. Doesn't have to actually exist.|
    |SecurePassword|$password|

    When the script finishes, it outputs the following three values. Note the values, because they are used as build variables.

    - `ServicePrincipalId`

    - `ServicePrincipalTenantId`

    - `ServicePrincipalSubscriptionId`

### Create a certificate and upload it to a new Azure Key Vault

>[AZURE.NOTE] This example script generates a self-signed certificate, which is not a secure practice and is only acceptable for experimentation. Follow your organization's guidelines to obtain a legitimate certificate instead.

1.	In an admin PowerShell prompt, change to the directory to which you extracted `Manual.zip`.

2.	Run the PowerShell script `CreateAndUpload-Certificate.ps1` with the following parameters.

    |Parameter|Value|
    |---|---|
    |KeyVaultLocation|Any value. Must match the location in which you plan to create the cluster.|
    |CertificateSecretName|Any value.|
    |SecureCertificatePassword|Any vlaue. Is used when you import the cert on your build machine.|
    |KeyVaultResourceGroupName|Any value. However, don't use the resource group name that you plan to use for your cluster.|
    |KeyVaultName|Any value.|
    |PfxFileOutputPath|Any value. This file is used to import the cert onto your build machine.|

    When the script finishes, it outputs the following three values. Note these values, because they are used as build variables.

    - `ServiceFabricCertificateThumbprint`

    - `ServiceFabricKeyVaultId`

    - `ServiceFabricCertificateSecretId`

## Set up your Build Machine

### Install Visual Studio 2015

1.	If you have already provisioned a machine (or plan to provide your own), install [Visual Studio 2015](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx) on that machine.

2.	If you don't yet have a machine, you can quickly provision an Azure virtual machine (VM) with Visual Studio 2015 pre-installed. To do this:

    1.	Log in to the [Azure Management Portal](http://portal.azure.com).

    2.	Choose the **New** command in the top-left corner of the screen.

    3.	Choose **Marketplace**.

    4.	Search for **Visual Studio 2015**.

    5.	Choose **Compute** > **Virtual Machine** > **From Gallery**.

    6.	Choose the image **Visual Studio Enterprise 2015 Update 1 With Azure SDK 2.8 on Windows Server 2012 R2**.

        >[AZURE.NOTE] Azure SDK isn't a required component, but there currently aren't any images available that have only Visual Studio 2015 installed.

    7.	Follow the instructions on the dialog to create your VM.

### Install Service Fabric SDK

Install the [Service Fabric SDK](https://azure.microsoft.com/campaigns/service-fabric/).

### Install Azure PowerShell

To install Azure PowerShell, please follow the steps in the previous section **Install Azure PowerShell and Sign-in**. Skip the **Sign in to Azure PowerShell** subsection.

### Register the Azure PowerShell modules with the Local Service account

>[AZURE.NOTE] Do this *before* you start the build agent, otherwise it will not pick up the new environment variable.

1. Press Win + R, then type **regedit** and hit enter.

2. Right-click on the node `HKEY_Users\.Default\Environment` and select **New > Expandable String Value**.

3. Enter `PSModulePath` for the name, and `%PROGRAMFILES%\WindowsPowerShell\Modules` for the value.

	1. Replace `%PROGRAMFILES%` with the value of the `PROGRAMFILES` environment variable.

### Import your Automation Certificate

1.	Import the certificate onto your build machine. To do this:

    1. Copy the PFX file created by the script CreateAndUpload-Certificate.ps1 to your build machine.

    2. Open an admin PowerShell prompt and run the following commands, using the password you passed to `CreateAndUpload-Certificate.ps1` earlier.

        ```
        $password = Read-Host -AsSecureString
        Import-PfxCertificate -FilePath <path/to/cert.pfx> -CertStoreLocation Cert:\LocalMachine\My -Password $password -Exportable
        ```

2.	Run the certificate manager.

    1. Open the Windows control panel. Right-click the Start button and choose **Control Panel**.

    2. Search for **certificate**.

    3. Choose **Administrative Tools** > **Manage computer certificates**.

3.	Grant Local Service account permission to use your automation certificate.

    1.	Under **Certificates - Local Computer**, expand **Personal**, then choose **Certificates**.

    2.	Find your certificate in the list.

    3.	Right-click your certificate and then choose **All Tasks** > **Manage Private Keys**.

    4.	Choose the **Add** button, then enter **Local Service** and click **Check Names**.

    5.	Choose the **OK** button and then close the certificate manager.

![](media/service-fabric-set-up-continuous-integration/windows-certificate-manager.png)

### Register your build agent

1.	Download agent.zip. To do this:

    1.	Log on to your team project, such as **https://[your-VSTS-account-name].visualstudio.com**.

    2.	Choose the 'gear' icon in the upper-right corner of your screen.

    3.	From the control panel, choose the **Agent pools** tab.

    4.	Choose **Download agent** to download the agent.zip file.

    5.	Copy agent.zip to the build machine you created earlier.

    6.	Unzip agent.zip to `C:\agent` (or any location with a short path) on your build machine.

        >[AZURE.NOTE] If you plan on building ASP.NET 5 Web Services, it's recommended that you  choose the shortest name possible for this folder to avoid running into **PathTooLongExceptions** errors during deployment.

2.	From an admin command prompt, run `C:\agent\ConfigureAgent.cmd`. The script prompts you for the following parameters:

    |Parameter|Value|
    |---|---|
    |Agent Name|Accept the default value, `Agent-[machine name]`.|
    |TFS Url|Enter the URL to your team project, such as, `https://[your-VSTS-account-name].visualstudio.com`.|
    |Agent Pool|Enter the name of your agent pool. (If you haven't created an agent pool, accept the default value.)|
    |Work folder|Accept the default value. This is the folder where the build agent will actually build your application. Note: If you plan on building ASP.NET 5 Web Services, it's recommended that you choose the shortest name possible for this folder to avoid running into PathTooLongExceptions errors during deployment.|
    |Install as Windows Service?|Default value is N. Change the value to **Y**.|
    |User account to run the service|Accept the default value, `NT AUTHORITY\LocalService`.|
    |Un-configure existing agent?|Accept the default value, **N**.|

3. You will be prompted for credentials. Enter the credentials for your Microsoft account that has rights to your team project.

4. Verify that your build agent was registered. To do this:

    1. Go back to your web browser (should be at page `https://[your-VSTS-account-name].visualstudio.com/_admin/_AgentPool`) and then refresh the page.

    2. Choose the agent pool that you selected when running ConfigureAgent.ps1 earlier.

    3. Verify that your build agent shows up in the list and has a green status highlight. If the highlight is red, the build agent is having trouble connecting to Team Services.

![](media/service-fabric-set-up-continuous-integration/vso-configured-agent.png)


## Create your Build Definition

>[AZURE.NOTE] The build definition you create from these instructions will not support multiple concurrent builds, even on separate machines. This is because each build would compete for the same resource group/cluster. If you want to run multiple build agents, you will need to modify the following instructions/scripts to prevent this interference.

### Add the continuous integration scripts to source control for your application.

1.	Extract [Automation.zip](http://go.microsoft.com/fwlink/?LinkId=703775) to any folder in source control.

2.	Check in the resulting files.

### Create the build definition

1.	Create an empty build definition. To do this:

    1.	Open your project in Visual Studio Team Services.

    2.	Choose the **Build** tab.

    3.	Choose the green **+** sign to create a new build definition.

    4.	Choose **Empty** and then choose the **Next** button.

    5.  Verify that the right repository and branch are selected.

    6.  Select the agent queue to which you registered your build agent, and check the **Continuous Integration** checkbox.

2.	On the **Variables** tab, create the following variables with these values.

    |Variable|Value|Secret|Allow at Queue Time|
    |---|---|---|---|
    |BuildConfiguration|Release||X|
    |BuildPlatform|x64|||
    |ServicePrincipalPassword|The password that you passed to CreateServicePrincipal.ps1|X||
    |ServicePrincipalId|From the output of CreateServicePrincipal.ps1|||
    |ServicePrincipalTenantId|From the output of CreateServicePrincipal.ps1|||
    |ServicePrincipalSubscriptionId|From the output of CreateServicePrincipal.ps1|||
    |ServiceFabricCertificateThumbprint|From the output of GenerateCertificate.ps1|||
    |ServiceFabricKeyVaultId|From the output of GenerateCertificate.ps1|||
    |ServiceFabricCertificateSecretId|From the output of GenerateCertificate.ps1|||
    |ServiceFabricClusterName|Any name you want.|||
    |ServiceFabricClusterResourceGroupName|Any name you want.|||
    |ServiceFabricClusterLocation|Any name that matches the location of your key vault.|||
    |ServiceFabricClusterAdminPassword|Any name you want.|X||
    |ServiceFabricClusterResourceGroupTemplateFilePath|`<path/to/extracted/automation/scripts/ArmTemplate-Full-3xVM-Secure.json>`|||
    |ServiceFabricPublishProfilePath|`<path/to/your/publish/profiles/MyPublishProfile.xml>` Note: The connection endpoint in your publish profile will be ignored. The connection endpoint for your temporary cluster is used instead.|||
    |ServiceFabricDeploymentScriptPath|`<path/to/Deploy-FabricApplication.ps1>`|||
    |ServiceFabricApplicationProjectPath|`<path/to/your/fabric/application/project/folder>` This should be the folder containing your .sfproj file.||||

3.	Save the build definition and give it a name. (You can change this name later if you want.)

### Add a "Build" Step

1.	On the **Build** tab, choose the **Add build step…** command."

2.	Choose **Build** > **MSBuild**.

3.	Choose the pencil icon by the build step's name and rename it to **Build**.

4.	Choose the **…** button next to the **Solution** field and then choose your .sln file.

5.	Enter `$(BuildPlatform)` for **Platform**.

6.	Enter `$(BuildConfiguration)` for **Configuration**.

7.	Select the **Restore NuGet Packages** check box (if it isn't already selected).

8.	Save the build definition.

### Add a "Package" Step

1.	On the **Build** tab, choose the **Add build step…** command.

2.	Choose **Build** > **MSBuild**.

3.	Choose the pencil icon next to the build step's name and rename it to **Package**.

4.	Choose the **…** button next to the **Solution** field and then select your application project's .sfproj file.

5.	Enter `$(BuildPlatform)` for **Platform**.

6.	Enter `$(BuildConfiguration)` for **Configuration**.

7.	Enter `/t:Package` for **MSBuild Arguments**.

8.	Clear the **Restore NuGet Packages** check box (if it isn't already cleared).

9.	Save the build definition.

### Add a "Remove Cluster Resource Group" Step

If a previous build did not clean up after itself (such as if the build was cancelled before it could clean up), there may be an existing resource group that will conflict with the new one. To avoid conflicts, clean up any leftover resource group (and its associated resources) before creating a new one.

1.	On the **Build** tab, choose the **Add build step…** command.

2.	Choose **Utility** > **PowerShell**.

3.	Choose the pencil icon next to the build step's name and then rename it to **Remove Cluster Resource Group**.

4.	Choose the **…** command next to **Script filename**. Navigate to where you extracted the automation scripts and then choose **Remove-ClusterResourceGroup.ps1**.

5.	For **Arguments**, enter `-ServicePrincipalPassword "$(ServicePrincipalPassword)"`.

6.	Save the build definition.

### Add a "Provision and Deploy to Secure Cluster" Step

1.	On the **Build** tab, choose the **Add build step…** command.

2.	Choose **Utility** > **PowerShell**.

3.	Choose the pencil icon next to the build step's name and then rename it to **Provision and Deploy to Secure Cluster**.

4.	Choose the **…** button next to **Script filename**. Navigate to where you extracted the automation scripts and then choose **ProvisionAndDeploy-SecureCluster.ps1**.

5.	For **Arguments**, enter `-ServicePrincipalPassword "$(ServicePrincipalPassword)" -ServiceFabricClusterAdminPassword "$(ServiceFabricClusterAdminPassword)"`

6.	Save the build definition.

### Add a "Remove Cluster Resource Group" Step

Now that you're done with the temporary cluster, you should clean it up. If you don't do this, you'll continue to be charged for the temporary cluster. This step removes the resource group, which removes the cluster and all other resources in the group.

>[AZURE.NOTE] There is one difference between this step and the previous "Remove Cluster Resource Group" step: This one should have "Always Run" checked.

1.	On the **Build** tab, choose the **Add build step…** command.

2.	Choose **Utility** > **PowerShell**.

3.	Choose the pencil icon next to the build step's name and then rename it to **Remove Cluster Resource Group**.

4.	Choose the **…** button next to **Script filename**. Navigate to where you extracted the automation scripts and then choose **RemoveClusterResourceGroup.ps1**.

5.	For **Arguments**, enter `-ServicePrincipalPassword "$(ServicePrincipalPassword)`."

6.	Under **Control Options**, check the **Always Run** check box.

7.	Save the build definition.

### Try it!

Click **Queue Build** to start a build. Builds will also be triggered upon push/checkin.


## Alternative Solutions

The previous instructions create a new cluster for each build and remove it at the end of the build. If you'd rather have each build perform an application upgrade (to an existing cluster) instead, do the following steps.

1.	Manually create a test cluster through the Azure Management Portal or Azure PowerShell. You can refer to the `ProvisionAndDeploy-SecureCluster.ps1` script as a reference.

2.	Configure your publish profile to support application upgrade by following [these instructions](service-fabric-visualstudio-configure-upgrade.md).

3.	Replace the **Provision and Deploy to Secure Cluster** step with a step that calls Deploy-FabricApplication.ps1 directly (and passes it your publish profile).

4.	Remove both of the **Remove Cluster Resource Group** build steps from your build definition.

## Next steps

To learn more about continuous integration with Service Fabric applications, read the following articles:

- [Build documentation home](https://msdn.microsoft.com/Library/vs/alm/Build/overview)
- [Deploy a build agent](https://msdn.microsoft.com/Library/vs/alm/Build/agents/windows)
- [Create and configure a build definition](https://msdn.microsoft.com/Library/vs/alm/Build/vs/define-build)
