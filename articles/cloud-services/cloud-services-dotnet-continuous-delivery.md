---
title: Continuous delivery for cloud services with Team Foundation Server in Azure | Microsoft Docs
description: Learn how to set up continuous delivery for Azure cloud apps. Code samples for MSBuild command-line statements and PowerShell scripts.
services: cloud-services
documentationcenter: ''
author: kraigb
manager: ghogen
editor: ''

ms.assetid: 4f3c93c6-5c82-4779-9d19-7404a01e82ca
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 06/12/2017
ms.author: kraigb

---
# Continuous delivery for cloud services in Azure
The process described in this article shows you how to set up continuous delivery for Azure cloud apps. You can use this process to automatically create packages and deploy the package to Azure after every code check-in. The package build process described in this article is equivalent to the **Package** command in Visual Studio. The publishing steps are equivalent to the **Publish** command in Visual Studio.

The article covers the methods you use to create a build server with MSBuild command-line statements and Windows PowerShell scripts. It also demonstrates how to optionally configure Visual Studio Team
Foundation Server Team Build definitions to use the MSBuild commands and PowerShell scripts. You can customize the process for your build environment and Azure target environments.

You also can use Visual Studio Team Services, a version of Team Foundation Server that is hosted in Azure, to do this more easily. 

Before you start, publish your application from Visual Studio. This step ensures that all the resources are available and initialized when you attempt to automate the publication process.

## 1: Configure the Build Server
Before you can create an Azure package by using MSBuild, install the required software and tools on the build server.

Visual Studio is not required to be installed on the build server. If you want to use Team Foundation Build Service to manage your build server, follow the instructions in the [Team Foundation Build Service][Team Foundation Build Service] documentation.

1. On the build server, install [.NET Framework 4.5.2][.NET Framework 4.5.2], which includes MSBuild.

2. Install the latest [Azure Authoring Tools for .NET](https://azure.microsoft.com/develop/net/).

3. Install the [Azure Libraries for .NET](http://go.microsoft.com/fwlink/?LinkId=623519).

4. Copy the Microsoft.WebApplication.targets file from a Visual Studio installation to the build server.

   On a computer with Visual Studio installed, this file is located in the directory C:\\Program Files(x86)\\MSBuild\\Microsoft\\VisualStudio\\v14.0\\WebApplications. You should copy it to the same directory on the build server.

5. Install the [Azure Tools for Visual Studio](https://www.visualstudio.com/features/azure-tools-vs.aspx).

## 2: Build a package by using MSBuild commands
This section describes how to construct an MSBuild command that builds an Azure package. Run this step on the build server to verify that everything is configured correctly and that the MSBuild command does what you want it to do. You can either add this command line to existing build scripts on the build server or you can use the command line in a Team Foundation Server build definition, as described in the next section. For more information about command-line parameters and MSBuild, see the [MSBuild Command-Line Reference](https://msdn.microsoft.com/library/ms164311%28v=vs.140%29.aspx).

1. If Visual Studio is installed on the build server, locate and choose **Visual Studio Command Prompt** in the **Visual Studio Tools** folder in Windows.

   If Visual Studio is not installed on the build server, open a command prompt and make sure that MSBuild.exe is accessible on the path. MSBuild is installed with the .NET Framework in the path
   %WINDIR%\\Microsoft.NET\\Framework\\*Version*. For example, to add MSBuild.exe to the PATH environment variable when you have .NET Framework 4 installed, type the following command at the command
   prompt:

       set PATH=%PATH%;"C:\Windows\Microsoft.NET\Framework\v4.0.30319"

2. At the command prompt, go to the folder that contains the Azure project file that you want to build.

3. Run MSBuild with the /target:Publish option, as shown in the following example:

       MSBuild /target:Publish

   This option can be abbreviated as /t:Publish. The /t:Publish option
   in MSBuild should not be confused with the Publish commands
   available in Visual Studio when you have the Azure SDK
   installed. The /t:Publish option only builds the Azure
   packages. It doesn't deploy the packages as the Publish commands in
   Visual Studio do.

   Optionally, you can specify the project name as an MSBuild parameter. If not specified, the current directory is used. For more information about MSBuild command-line options, see the [MSBuild Command-Line Reference](https://msdn.microsoft.com/library/ms164311%28v=vs.140%29.aspx).

4. Locate the output. By default, this command creates a directory in
   relation to the root folder for the project, such as
   *ProjectDir*\\bin\\*Configuration*\\app.publish\\. When you
   build an Azure project, you generate two files, the package
   file itself and the accompanying configuration file:

   * Project.cspkg
   * ServiceConfiguration.*TargetProfile*.cscfg

   By default, each Azure project includes one
   service configuration file (.cscfg file) for local (debugging)
   builds and another for cloud (staging or production) builds. You
   can add or remove service configuration files as needed. When you
   build a package within Visual Studio, you're asked which
   service configuration file to include alongside the package.

5. Specify the service configuration file. When you build a package by
   using MSBuild, the local service configuration file is included by
   default. To include a different service configuration file, set the
   TargetProfile property of the MSBuild command, as shown in the following
   example:

       MSBuild /t:Publish /p:TargetProfile=Cloud

6. Specify the location for the output. Set the path by using the
   /p:PublishDir=*Directory*\\ option, including the trailing
   backslash separator, as shown in the following example:

       MSBuild /target:Publish /p:PublishDir=\\myserver\drops\

   After you construct and test an appropriate MSBuild command
   line to build your projects and combine them into an Azure package,
   you can add this command line to your build scripts. If your build
   server uses custom scripts, this process depends on the
   specifics of your custom build process. If you use Team Foundation Server as a
   build environment, follow the instructions in the following step to add the Azure package build to your build process.

## 3: Build a package by using Team Foundation Server Team Build
If you have Team Foundation Server set up as a build controller
and the build server set up as a Team Foundation Server build machine, you can optionally set up
an automated build for your Azure package. For information on
how to set up and use Team Foundation Server as a build system, see
[Scale out your build system][Scale out your build system]. In particular, the
following procedure assumes that you configured your build server
as described in [Deploy and configure a build server][Deploy and configure a build server]. It also assumes  that you created a team project and created a cloud service project in the team project.

To configure Team Foundation Server to build Azure packages, perform the following steps:

1. In Visual Studio on your development computer, on the **View**
   menu, choose **Team Explorer**. Or you can press Ctrl+\\ and then press Ctrl+M. In the
   Team Explorer window, expand the **Builds** node. Or you can choose the **Builds**
   page, and select **New Build Definition**.

   ![New Build Definition option][0]

2. Choose the **Trigger** tab, and specify the desired conditions for
   when you want the package to be built. For example, specify
   **Continuous Integration** to build the package whenever a source
   control check-in occurs.

3. Choose the **Source Settings** tab. Make sure your project folder is listed
   in the **Source Control Folder** column and that the status is **Active**.

4. Choose the **Build Defaults** tab, and under **Build controller**, verify
   the name of the build server. Also, select the option **Copy build
   output to the following drop folder**, and specify the desired drop
   location.

5. Choose the **Process** tab, and select the default template. Under **Build**, select the project if it's not already selected. Expand the **Advanced** section in the **Build** section of the grid.

6. Choose **MSBuild Arguments**, and set the appropriate MSBuild command-line arguments as described in step 2. For example, enter **/t:Publish /p:PublishDir=\\\\myserver\\drops\\** to build a package, and copy the package files to the location

   \\\\myserver\\drops\\:

   ![MSBuild arguments][2]

   > [!NOTE]
   > Copying the files to a public share makes it easier to manually deploy the packages
   > from your development computer.

7. Test the success of your build step by checking in a change to your
   project, or queue up a new build. To queue up a new build, in the
   Team Explorer, right-click **All Build Definitions** and then
   choose **Queue New Build**.

## 4: Publish a package by using a PowerShell script
This section describes how to construct a Windows PowerShell script that publishes the Cloud Services app package output to Azure by using optional parameters. This script can be called after the build step in
your custom build automation. It also can be called from Process Template workflow activities in Visual Studio Team Foundation Server Team Build.

1. Install the [Azure PowerShell cmdlets][Azure PowerShell cmdlets] (v0.6.1 or higher).
   During the cmdlet setup phase, choose to install them as a snap-in. Note
   that this officially supported version replaces the older version
   offered through CodePlex, although the previous versions were numbered 2.x.x.
2. Start Azure PowerShell by using the Start menu or Start page. If you start in this way,
   the PowerShell cmdlets are loaded.
3. At the PowerShell prompt, verify that the PowerShell cmdlets are loaded
   by entering the partial command `Get-Azure` and then pressing the Tab key for statement
   completion.

   If you press the Tab key repeatedly, you should see various Azure PowerShell commands.

4. Verify that you can connect to your Azure subscription by
   importing your subscription information from the .publishsettings file.

   `Import-AzurePublishSettingsFile c:\scripts\WindowsAzure\default.publishsettings`

   Then enter the command

   `Get-AzureSubscription`

   This command shows information about your subscription. Verify that everything is correct.

5. Save the script template provided at the end of this article to
   your scripts folder as
   c:\\scripts\\WindowsAzure\\**PublishCloudService.ps1**.

6. Review the parameters section of the script. Add or modify any
   default values. These values can always be overridden by passing in
   explicit parameters.

7. Ensure there are valid cloud service and storage accounts created
   in your subscription that can be targeted by the publish script. The
   storage account (blob storage) is used to upload and
   temporarily store the deployment package and config file while the
   deployment is being created.

   * To create a new cloud service, you can call this script or use
     the [Azure portal](https://portal.azure.com). The cloud service name
     is used as a prefix in a fully qualified domain name, so it must be unique.

         New-AzureService -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"

   * To create a new storage account, you can call this script or use the [Azure portal](https://portal.azure.com). The storage account name is used as a prefix in a fully qualified domain name, so it must be unique. You can try using the same name as the cloud service.

         New-AzureStorageAccount -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"

8. Call the script directly from Azure PowerShell, or wire up this
   script to your host build automation to occur after the package
   build.

   > [!IMPORTANT]
   > The script always deletes or replaces your existing
   > deployments by default if they are detected. This function is necessary to
   > enable continuous delivery from automation where no user prompting
   > is possible.
   >
   >

   **Example scenario 1:** Continuous deployment to the staging
   environment of a service:

       PowerShell c:\scripts\windowsazure\PublishCloudService.ps1 -environment Staging -serviceName mycloudservice -storageAccountName mystoragesaccount -packageLocation c:\drops\app.publish\ContactManager.Azure.cspkg -cloudConfigLocation c:\drops\app.publish\ServiceConfiguration.Cloud.cscfg -subscriptionDataFile c:\scripts\default.publishsettings

   This scenario is typically followed up by test run verification and a VIP
   swap. The VIP swap can be done via the [Azure portal](https://portal.azure.com) or
   by using the Move-Deployment cmdlet.

   **Example scenario 2:** Continuous deployment to the production
   environment of a dedicated test service:

       PowerShell c:\scripts\windowsazure\PublishCloudService.ps1 -environment Production -enableDeploymentUpgrade 1 -serviceName mycloudservice -storageAccountName mystorageaccount -packageLocation c:\drops\app.publish\ContactManager.Azure.cspkg -cloudConfigLocation c:\drops\app.publish\ServiceConfiguration.Cloud.cscfg -subscriptionDataFile c:\scripts\default.publishsettings

   **Remote Desktop:**

   If Remote Desktop is enabled in your Azure project, you
   need to perform additional one-time steps to ensure the correct
   Cloud Services certificate is uploaded to all cloud services
   targeted by this script.

   Locate the certificate thumbprint values expected by your roles. The
   thumbprint values are visible in the Certificates section of the
   cloud config file (that is, ServiceConfiguration.Cloud.cscfg). It's
   also visible in the **Remote Desktop Configuration** dialog box in Visual
   Studio when you select **Show Options** and view the selected certificate.

       <Certificates>
             <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="C33B6C432C25581601B84C80F86EC2809DC224E8" thumbprintAlgorithm="sha1" />
       </Certificates>

   Upload Remote Desktop certificates as a one-time setup step by using
   the following cmdlet script:

       Add-AzureCertificate -serviceName <CLOUDSERVICENAME> -certToDeploy (get-item cert:\CurrentUser\MY\<THUMBPRINT>)

   For example:

       Add-AzureCertificate -serviceName 'mytestcloudservice' -certToDeploy (get-item cert:\CurrentUser\MY\C33B6C432C25581601B84C80F86EC2809DC224E8

   Alternatively, you can export the certificate file PFX with a private
   key and upload certificates to each target cloud service by using the
   [Azure portal](https://portal.azure.com).

   <!---
   Fixing broken links for Azure content migration from ACOM to DOCS. I'm unable to find a replacement links, so I'm commenting out this reference for now. The author can investigate in the future. "Read the following article to learn more: http://msdn.microsoft.com/library/windowsazure/gg443832.aspx.
   -->
   **Upgrade Deployment vs. Delete Deployment -\> New Deployment**

   By default, the script performs an Upgrade Deployment
   ($enableDeploymentUpgrade = 1) when no parameter is passed in or the
   value 1 is passed explicitly. For single instances, this capability has the
   advantage of taking less time than a full deployment. For instances
   that require high availability, this capability also has the advantage of
   leaving some instances running while others are upgraded (walking
   your update domain), plus your VIP isn't deleted.

   Upgrade Deployment can be disabled in the script
   ($enableDeploymentUpgrade = 0) or by passing
   *-enableDeploymentUpgrade 0* as a parameter, which alters the
   script behavior to first delete any existing deployment and then
   create a new deployment.

   > [!IMPORTANT]
   > The script always deletes or replaces your existing
   > deployments by default if they're detected. This function is necessary to
   > enable continuous delivery from automation where no user/operator
   > prompting is possible.
   >
   >

## 5: Publish a package by using Team Foundation Server Team Build
This optional step connects Team Foundation Server Team Build to the script created in step 4,
which handles publishing of the package build to Azure. This step 
entails modifying the Process Template used by your build definition so
that it runs a Publish activity at the end of the workflow. The Publish
activity executes your PowerShell command by passing in parameters from
the build. Output of the MSBuild targets and publish script is piped into the standard build output.

1. Edit the build definition responsible for continuous deploy.

2. Select the **Process** tab.

3. Follow [these instructions](http://msdn.microsoft.com/library/dd647551.aspx) to add an
   Activity project for the build process template, download the default template, add it to
   the project, and check it in. Give the build process template a new name, such as
   AzureBuildProcessTemplate.

4. Return to the **Process** tab, and use **Show Details** to show a list of available
   build process templates. Select **New**, and go to the project you
   just added and checked in. Locate the template you just created, and select **OK**.

5. Open the selected Process Template for editing. You can open it 
   directly in the workflow designer or in the XML editor to work with
   the XAML.

6. Add the following list of new arguments as separate line items in
   the arguments tab of the workflow designer. All arguments should
   have direction=In and type=String. These arguments are used to flow
   parameters from the build definition into the workflow, which then
   get used to call the publish script.

       SubscriptionName
       StorageAccountName
       CloudConfigLocation
       PackageLocation
       Environment
       SubscriptionDataFileLocation
       PublishScriptLocation
       ServiceName

   ![List of arguments][3]

   The corresponding XAML looks like this:

       <Activity  _ />
         <x:Members>
           <x:Property Name="BuildSettings" Type="InArgument(mtbwa:BuildSettings)" />
           <x:Property Name="TestSpecs" Type="InArgument(mtbwa:TestSpecList)" />
           <x:Property Name="BuildNumberFormat" Type="InArgument(x:String)" />
           <x:Property Name="CleanWorkspace" Type="InArgument(mtbwa:CleanWorkspaceOption)" />
           <x:Property Name="RunCodeAnalysis" Type="InArgument(mtbwa:CodeAnalysisOption)" />
           <x:Property Name="SourceAndSymbolServerSettings" Type="InArgument(mtbwa:SourceAndSymbolServerSettings)" />
           <x:Property Name="AgentSettings" Type="InArgument(mtbwa:AgentSettings)" />
           <x:Property Name="AssociateChangesetsAndWorkItems" Type="InArgument(x:Boolean)" />
           <x:Property Name="CreateWorkItem" Type="InArgument(x:Boolean)" />
           <x:Property Name="DropBuild" Type="InArgument(x:Boolean)" />
           <x:Property Name="MSBuildArguments" Type="InArgument(x:String)" />
           <x:Property Name="MSBuildPlatform" Type="InArgument(mtbwa:ToolPlatform)" />
           <x:Property Name="PerformTestImpactAnalysis" Type="InArgument(x:Boolean)" />
           <x:Property Name="CreateLabel" Type="InArgument(x:Boolean)" />
           <x:Property Name="DisableTests" Type="InArgument(x:Boolean)" />
           <x:Property Name="GetVersion" Type="InArgument(x:String)" />
           <x:Property Name="PrivateDropLocation" Type="InArgument(x:String)" />
           <x:Property Name="Verbosity" Type="InArgument(mtbw:BuildVerbosity)" />
           <x:Property Name="Metadata" Type="mtbw:ProcessParameterMetadataCollection" />
           <x:Property Name="SupportedReasons" Type="mtbc:BuildReason" />
           <x:Property Name="SubscriptionName" Type="InArgument(x:String)" />
           <x:Property Name="StorageAccountName" Type="InArgument(x:String)" />
           <x:Property Name="CloudConfigLocation" Type="InArgument(x:String)" />
           <x:Property Name="PackageLocation" Type="InArgument(x:String)" />
           <x:Property Name="Environment" Type="InArgument(x:String)" />
           <x:Property Name="SubscriptionDataFileLocation" Type="InArgument(x:String)" />
           <x:Property Name="PublishScriptLocation" Type="InArgument(x:String)" />
           <x:Property Name="ServiceName" Type="InArgument(x:String)" />
         </x:Members>

         <this:Process.MSBuildArguments>

7. Add a new sequence at the end of Run On Agent:

   a. Start by adding an If Statement activity to check for a valid
      script file. Set the condition to this value:

          Not String.IsNullOrEmpty(PublishScriptLocation)

   b. In the Then case of the If Statement, add a new Sequence
      activity. Set the display name to "Start publish."

   c. With the Start publish sequence still selected, add the
      following list of new variables as separate line items in the
      variables tab of the workflow designer. All variables should
      have Variable type =String and Scope=Start publish. These will
      be used to flow parameters from the build definition into the
      workflow, which then get used to call the publish script.

      * SubscriptionDataFilePath, of type String
      * PublishScriptFilePath, of type String

        ![New variables][4]
   d. If you use Team Foundation Server 2012 or earlier, add a ConvertWorkspaceItem activity at the beginning of the new
      Sequence. If you use Team Foundation Server 2013 or later, add a GetLocalPath activity at the beginning of the new sequence. For a ConvertWorkspaceItem, set the properties as follows: Direction=ServerToLocal, DisplayName='Convert publish
      script filename', Input=' PublishScriptLocation',
      Result='PublishScriptFilePath', Workspace='Workspace'. For a GetLocalPath activity, set the property IncomingPath to 'PublishScriptLocation', and the Result to 'PublishScriptFilePath'. This
      activity converts the path to the publish script from Team Foundation Server locations (if applicable) to a standard local disk path.

   e. If you are using Team Foundation Server 2012 or earlier, add another ConvertWorkspaceItem activity at the end of the new
      Sequence. Direction=ServerToLocal, DisplayName='Convert
      subscription filename', Input=' SubscriptionDataFileLocation',
      Result= 'SubscriptionDataFilePath', Workspace='Workspace'. If you are using Team Foundation Server 2013 or later, add another GetLocalPath. IncomingPath='SubscriptionDataFileLocation', and Result='SubscriptionDataFilePath.'

   f. Add an InvokeProcess activity at the end of the new Sequence.
      This activity calls PowerShell.exe with the arguments passed in
      by the build definition.

      + Arguments = String.Format(" -File ""{0}"" -serviceName {1}
         -storageAccountName {2} -packageLocation ""{3}""
         -cloudConfigLocation ""{4}"" -subscriptionDataFile ""{5}""
         -selectedSubscription {6} -environment ""{7}""",
         PublishScriptFilePath, ServiceName, StorageAccountName,
         PackageLocation, CloudConfigLocation,
         SubscriptionDataFilePath, SubscriptionName, Environment)
      + DisplayName = Execute publish script
      + FileName = "PowerShell" (include the quotes)
      + OutputEncoding=
         System.Text.Encoding.GetEncoding(System.Globalization.CultureInfo.InstalledUICulture.TextInfo.OEMCodePage)

   g. In the **Handle Standard Output** section textbox of the
      InvokeProcess, set the textbox value to 'data'. This is a
      variable to store the standard output data.

   h. Add a WriteBuildMessage activity just below the **Handle Standard Output**
      section. Set the Importance =
      'Microsoft.TeamFoundation.Build.Client.BuildMessageImportance.High'
      and the Message='data'. This ensures the standard output of the
      script will get written to the build output.

   i. In the **Handle Error Output** section textbox of the
      InvokeProcess, set the textbox value to 'data'. This is a
      variable to store the standard error data.

   j. Add a WriteBuildError activity just below the **Handle Error Output**
       section. Set the Message='data'. This ensures the standard
       errors of the script will get written to the build error output.

   k. Correct any errors, indicated by blue exclamation marks. Hover over the
       exclamation marks to get a hint about the error. Save the workflow to
       clear errors.

   The final result of the publish workflow activities look like this in the designer:

   ![Workflow activities][5]

   The final result of the publish workflow activities looks like this in XAML:

       <If Condition="[Not String.IsNullOrEmpty(PublishScriptLocation)]" sap2010:WorkflowViewState.IdRef="If_1">
           <If.Then>
             <Sequence DisplayName="Start Publish" sap2010:WorkflowViewState.IdRef="Sequence_4">
               <Sequence.Variables>
                 <Variable x:TypeArguments="x:String" Name="SubscriptionDataFilePath" />
                 <Variable x:TypeArguments="x:String" Name="PublishScriptFilePath" />
               </Sequence.Variables>
               <mtbwa:ConvertWorkspaceItem DisplayName="Convert publish script filename" sap2010:WorkflowViewState.IdRef="ConvertWorkspaceItem_1" Input="[PublishScriptLocation]" Result="[PublishScriptFilePath]" Workspace="[Workspace]" />
               <mtbwa:ConvertWorkspaceItem DisplayName="Convert subscription filename" sap2010:WorkflowViewState.IdRef="ConvertWorkspaceItem_2" Input="[SubscriptionDataFileLocation]" Result="[SubscriptionDataFilePath]" Workspace="[Workspace]" />
               <mtbwa:InvokeProcess Arguments="[String.Format(&quot; -File &quot;&quot;{0}&quot;&quot; -serviceName {1}&#xD;&#xA;            -storageAccountName {2} -packageLocation &quot;&quot;{3}&quot;&quot;&#xD;&#xA;            -cloudConfigLocation &quot;&quot;{4}&quot;&quot; -subscriptionDataFile &quot;&quot;{5}&quot;&quot;&#xD;&#xA;            -selectedSubscription {6} -environment &quot;&quot;{7}&quot;&quot;&quot;,&#xD;&#xA;            PublishScriptFilePath, ServiceName, StorageAccountName,&#xD;&#xA;            PackageLocation, CloudConfigLocation,&#xD;&#xA;            SubscriptionDataFilePath, SubscriptionName, Environment)]" DisplayName="'Execute Publish Script'" FileName="[PowerShell]" sap2010:WorkflowViewState.IdRef="InvokeProcess_1">
                 <mtbwa:InvokeProcess.ErrorDataReceived>
                   <ActivityAction x:TypeArguments="x:String">
                     <ActivityAction.Argument>
                       <DelegateInArgument x:TypeArguments="x:String" Name="data" />
                     </ActivityAction.Argument>
                     <mtbwa:WriteBuildError Message="{x:Null}" sap2010:WorkflowViewState.IdRef="WriteBuildError_1" />
                   </ActivityAction>
                 </mtbwa:InvokeProcess.ErrorDataReceived>
                 <mtbwa:InvokeProcess.OutputDataReceived>
                   <ActivityAction x:TypeArguments="x:String">
                     <ActivityAction.Argument>
                       <DelegateInArgument x:TypeArguments="x:String" Name="data" />
                     </ActivityAction.Argument>
                     <mtbwa:WriteBuildMessage sap2010:WorkflowViewState.IdRef="WriteBuildMessage_2" Importance="[Microsoft.TeamFoundation.Build.Client.BuildMessageImportance.High]" Message="[data]" mva:VisualBasic.Settings="Assembly references and imported namespaces serialized as XML namespaces" />
                   </ActivityAction>
                 </mtbwa:InvokeProcess.OutputDataReceived>
               </mtbwa:InvokeProcess>
             </Sequence>
           </If.Then>
         </If>
       </Sequence>
8. Save the build process template workflow and Check In this file.

9. Edit the build definition (close it if it is already open), and select
   the **New** button if you do not yet see the new template in the list of Process Templates.

10. Set the parameter property values in the Misc section as follows:

    a. CloudConfigLocation ='c:\\drops\\app.publish\\ServiceConfiguration.Cloud.cscfg'
       *This value is derived from:
       ($PublishDir)ServiceConfiguration.Cloud.cscfg*

    b. PackageLocation = 'c:\\drops\\app.publish\\ContactManager.Azure.cspkg'
       *This value is derived from: ($PublishDir)($ProjectName).cspkg*

    c. PublishScriptLocation = 'c:\\scripts\\WindowsAzure\\PublishCloudService.ps1'

    d. ServiceName = 'mycloudservicename'
       *Use the appropriate cloud service name here*

    e. Environment = 'Staging'

    f. StorageAccountName = 'mystorageaccountname'
       *Use the appropriate storage account name here*

    g. SubscriptionDataFileLocation =
       'c:\\scripts\\WindowsAzure\\Subscription.xml'

    h. SubscriptionName = 'default'

    ![Parameter property values][6]

11. Save the changes to the build definition.

12. Queue a Build to execute both the package build and publish. If you
    have a trigger set to Continuous Integration, you execute this
    behavior on every check-in.

### PublishCloudService.ps1 script template
```powershell
Param(  $serviceName = "",
        $storageAccountName = "",
        $packageLocation = "",
        $cloudConfigLocation = "",
        $environment = "Staging",
        $deploymentLabel = "ContinuousDeploy to $servicename",
        $timeStampFormat = "g",
        $alwaysDeleteExistingDeployments = 1,
        $enableDeploymentUpgrade = 1,
        $selectedsubscription = "default",
        $subscriptionDataFile = ""
     )


function Publish()
{
    $deployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot -ErrorVariable a -ErrorAction silentlycontinue
    if ($a[0] -ne $null)
    {
        Write-Output "$(Get-Date -f $timeStampFormat) - No deployment is detected. Creating a new deployment. "
    }
    #check for existing deployment and then either upgrade, delete + deploy, or cancel according to $alwaysDeleteExistingDeployments and $enableDeploymentUpgrade boolean variables
    if ($deployment.Name -ne $null)
    {
        switch ($alwaysDeleteExistingDeployments)
        {
            1
            {
                switch ($enableDeploymentUpgrade)
                {
                    1  #Update deployment inplace (usually faster, cheaper, won't destroy VIP)
                    {
                        Write-Output "$(Get-Date -f $timeStampFormat) - Deployment exists in $servicename.  Upgrading deployment."
                        UpgradeDeployment
                    }
                    0  #Delete then create new deployment
                    {
                        Write-Output "$(Get-Date -f $timeStampFormat) - Deployment exists in $servicename.  Deleting deployment."
                        DeleteDeployment
                        CreateNewDeployment

                    }
                } # switch ($enableDeploymentUpgrade)
            }
            0
            {
                Write-Output "$(Get-Date -f $timeStampFormat) - ERROR: Deployment exists in $servicename.  Script execution cancelled."
                exit
            }
        } #switch ($alwaysDeleteExistingDeployments)
    } else {
            CreateNewDeployment
    }
}

function CreateNewDeployment()
{
    write-progress -id 3 -activity "Creating New Deployment" -Status "In progress"
    Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: In progress"

    $opstat = New-AzureDeployment -Slot $slot -Package $packageLocation -Configuration $cloudConfigLocation -label $deploymentLabel -ServiceName $serviceName

    $completeDeployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    $completeDeploymentID = $completeDeployment.deploymentid

    write-progress -id 3 -activity "Creating New Deployment" -completed -Status "Complete"
    Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: Complete, Deployment ID: $completeDeploymentID"

    StartInstances
}

function UpgradeDeployment()
{
    write-progress -id 3 -activity "Upgrading Deployment" -Status "In progress"
    Write-Output "$(Get-Date -f $timeStampFormat) - Upgrading Deployment: In progress"

    # perform Update-Deployment
    $setdeployment = Set-AzureDeployment -Upgrade -Slot $slot -Package $packageLocation -Configuration $cloudConfigLocation -label $deploymentLabel -ServiceName $serviceName -Force

    $completeDeployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    $completeDeploymentID = $completeDeployment.deploymentid

    write-progress -id 3 -activity "Upgrading Deployment" -completed -Status "Complete"
    Write-Output "$(Get-Date -f $timeStampFormat) - Upgrading Deployment: Complete, Deployment ID: $completeDeploymentID"
}

function DeleteDeployment()
{

    write-progress -id 2 -activity "Deleting Deployment" -Status "In progress"
    Write-Output "$(Get-Date -f $timeStampFormat) - Deleting Deployment: In progress"

    #WARNING - always deletes with force
    $removeDeployment = Remove-AzureDeployment -Slot $slot -ServiceName $serviceName -Force

    write-progress -id 2 -activity "Deleting Deployment: Complete" -completed -Status $removeDeployment
    Write-Output "$(Get-Date -f $timeStampFormat) - Deleting Deployment: Complete"

}

function StartInstances()
{
    write-progress -id 4 -activity "Starting Instances" -status "In progress"
    Write-Output "$(Get-Date -f $timeStampFormat) - Starting Instances: In progress"

    $deployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    $runstatus = $deployment.Status

    if ($runstatus -ne 'Running')
    {
        $run = Set-AzureDeployment -Slot $slot -ServiceName $serviceName -Status Running
    }
    $deployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    $oldStatusStr = @("") * $deployment.RoleInstanceList.Count

    while (-not(AllInstancesRunning($deployment.RoleInstanceList)))
    {
        $i = 1
        foreach ($roleInstance in $deployment.RoleInstanceList)
        {
            $instanceName = $roleInstance.InstanceName
            $instanceStatus = $roleInstance.InstanceStatus

            if ($oldStatusStr[$i - 1] -ne $roleInstance.InstanceStatus)
            {
                $oldStatusStr[$i - 1] = $roleInstance.InstanceStatus
                Write-Output "$(Get-Date -f $timeStampFormat) - Starting Instance '$instanceName': $instanceStatus"
            }

            write-progress -id (4 + $i) -activity "Starting Instance '$instanceName'" -status "$instanceStatus"
            $i = $i + 1
        }

        sleep -Seconds 1

        $deployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    }

    $i = 1
    foreach ($roleInstance in $deployment.RoleInstanceList)
    {
        $instanceName = $roleInstance.InstanceName
        $instanceStatus = $roleInstance.InstanceStatus

        if ($oldStatusStr[$i - 1] -ne $roleInstance.InstanceStatus)
        {
            $oldStatusStr[$i - 1] = $roleInstance.InstanceStatus
            Write-Output "$(Get-Date -f $timeStampFormat) - Starting Instance '$instanceName': $instanceStatus"
        }

        $i = $i + 1
    }

    $deployment = Get-AzureDeployment -ServiceName $serviceName -Slot $slot
    $opstat = $deployment.Status

    write-progress -id 4 -activity "Starting Instances" -completed -status $opstat
    Write-Output "$(Get-Date -f $timeStampFormat) - Starting Instances: $opstat"
}

function AllInstancesRunning($roleInstanceList)
{
    foreach ($roleInstance in $roleInstanceList)
    {
        if ($roleInstance.InstanceStatus -ne "ReadyRole")
        {
            return $false
        }
    }

    return $true
}

#configure powershell with Azure 1.7 modules
Import-Module Azure

#configure powershell with publishsettings for your subscription
$pubsettings = $subscriptionDataFile
Import-AzurePublishSettingsFile $pubsettings
Set-AzureSubscription -CurrentStorageAccountName $storageAccountName -SubscriptionName $selectedsubscription
Select-AzureSubscription $selectedsubscription

#set remaining environment variables for Azure cmdlets
$subscription = Get-AzureSubscription $selectedsubscription
$subscriptionname = $subscription.subscriptionname
$subscriptionid = $subscription.subscriptionid
$slot = $environment

#main driver - publish & write progress to activity log
Write-Output "$(Get-Date -f $timeStampFormat) - Azure Cloud Service deploy script started."
Write-Output "$(Get-Date -f $timeStampFormat) - Preparing deployment of $deploymentLabel for $subscriptionname with Subscription ID $subscriptionid."

Publish

$deployment = Get-AzureDeployment -slot $slot -serviceName $servicename
$deploymentUrl = $deployment.Url

Write-Output "$(Get-Date -f $timeStampFormat) - Created Cloud Service with URL $deploymentUrl."
Write-Output "$(Get-Date -f $timeStampFormat) - Azure Cloud Service deploy script finished."
```

## Next steps
To enable remote debugging when you use continuous delivery, see [Enable remote debugging when you use continuous delivery to publish to Azure](cloud-services-virtual-machines-dotnet-continuous-delivery-remote-debugging.md).

[Team Foundation Build Service]: https://msdn.microsoft.com/library/ee259687.aspx
[.NET Framework 4]: https://www.microsoft.com/download/details.aspx?id=17851
[.NET Framework 4.5]: https://www.microsoft.com/download/details.aspx?id=30653
[.NET Framework 4.5.2]: https://www.microsoft.com/download/details.aspx?id=42643
[Scale out your build system]: https://msdn.microsoft.com/library/dd793166.aspx
[Deploy and configure a build server]: https://msdn.microsoft.com/library/ms181712.aspx
[Azure PowerShell cmdlets]: /powershell/azureps-cmdlets-docs
[0]: ./media/cloud-services-dotnet-continuous-delivery/tfs-01bc.png
[2]: ./media/cloud-services-dotnet-continuous-delivery/tfs-02.png
[3]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-03.png
[4]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-04.png
[5]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-05.png
[6]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-06.png
