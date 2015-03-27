<properties 
	pageTitle="Continuous delivery for cloud services with TFS in Azure" 
	description="Learn how to set up continuous delivery for Azure cloud apps. Code samples for MSBuild command-line statements and PowerShell scripts." 
	services="cloud-services" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="kempb"/>

# Continuous Delivery for Cloud Services in Azure

The process described in this article shows you how to set up continuous
delivery for Azure cloud apps. This process enables you to
automatically create packages and deploy the package to Azure
after every code check-in. The package build process described in this
article is equivalent to the Package command in Visual Studio, and the
publishing steps are equivalent to the Publish command in Visual Studio.
The article covers the methods you would use to create a build server
with MSBuild command-line statements and Windows PowerShell scripts, and
it also demonstrates how to optionally configure Visual Studio Team
Foundation Server - Team Build definitions to use the MSBuild commands
and PowerShell scripts. The process is customizable for your build
environment and Azure target environments.

You can also use Visual Studio Online, a version of TFS that is hosted in Azure, to do this more easily. For more information, see [Continuous Delivery to Azure by Using Visual Studio Online][].

Before you start, you should publish your application from Visual Studio.
This will ensure that all the resources are available and initialized when you 
attempt to automate the publication process.

This task includes the following steps:

-   [Step 1: Configure the Build Server][]
-   [Step 2: Build a Package using MSBuild Commands][]
-   [Step 3: Build a Package using TFS Team Build (Optional)][]
-   [Step 4: Publish a Package using a PowerShell Script][]
-   [Step 5: Publish a Package using TFS Team Build (Optional)][]

<h2> <a name="step1"> </a>Step 1: Configure the Build Server</h2>

Before you can create an Azure package by using MSBuild, you must
install the required software and tools on the build server.

Visual Studio is not required to be installed on the build server. If
you want to use Team Foundation Build Service to manage your build
server, follow the instructions in the [Team Foundation Build Service][]
documentation.

1.  On the build server, install the [.NET Framework 4][], [.NET Framework 4.5][], or [.NET Framework 4.5.2][], which include MSBuild.
2.  Install the [Azure Authoring Tools][] (look for MicrosoftAzureAuthoringTools-x86.msi or MicrosoftAzureAuthoringTools-x64.msi, depending on your build server's processor). Older versions of the files might have WindowsAzure in the filename.
3. Install the [Azure Libraries][] (look for MicrosoftAzureLibsForNet-x86.msi or MicrosoftAzureLibsForNet-x64.msi).
4.  Copy the Microsoft.WebApplication.targets file from a Visual Studio installation to the build server.On a computer with Visual Studio installed, the file is located in the directory C:\\Program Files(x86)\\MSBuild\\Microsoft\\VisualStudio\\v11.0\\WebApplications (v12.0 for Visual Studio 2013). You should copy it to the same directory on the build server.
5.  Install the [Azure Tools for Visual Studio][]. Look for MicrosoftAzureTools.VS110.exe to build Visual Studio 2012 projects, and MicrosoftAzureTools.VS120.exe to build Visual Studio 2013 projects, and MicrosoftAzureTools.VS140.exe to build Visual Studio 2015 Preview projects.

<h2><a name="step2"> </a>Step 2: Build a Package using MSBuild Commands</h2>

This section describes how to construct an MSBuild command that builds an
Azure package. Run this step on the build server to verify that
everything is configured correctly and that the MSBuild command does
what you want it to do. You can either add this command line to existing
build scripts on the build server, or you can use the command line in a
TFS Build Definition, as described in the next section. For more
information about command-line parameters and MSBuild, see [MSBuild Command Line Reference][].

1.  If Visual Studio is installed on the build server, click
    **Start**, click **All Programs**, and then locate and click
    **Visual Studio Commmand Prompt** in the **Visual Studio Tools**
    folder.

    If Visual Studio is not installed on the build server, open a
    command prompt and make sure that MSBuild.exe is accessible on the
    path. MSBuild is installed with the .NET Framework in the path   
    %WINDIR%\\Microsoft.NET\\Framework\\*Version*. For example, to
    add MSBuild.exe to the PATH environment variable when you have .NET
    Framework 4 installed, type the following command at the command
    prompt:

        set PATH=%PATH%;"C:\Windows\Microsoft.NET\Framework\v4.0.30319"

2.  At the command prompt, navigate to the folder containing the Windows
    Azure project file that you want to build.

3.  Run msbuild with the /target:Publish option as in the following
    example:

        MSBuild /target:Publish

    This option can be abbreviated as /t:Publish. The /t:Publish option
    in MSBuild should not be confused with the Publish commands
    available in Visual Studio when you have the Azure SDK
    installed. The /t:Publish option only builds the Azure
    packages. It does not deploy the packages as the Publish commands in
    Visual Studio do.

    Optionally, you can specify the project name as an MSBuild
    parameter. If not specified, the current directory is used. For more
    information about MSBuild command line options, see [MSBuild Command
    Line Reference][1].

4.  Locate the output. By default, this command creates a directory in
    relation to the root folder for the project, such as
    *ProjectDir*\\bin\\*Configuration*\\app.publish\\. When you
    build an Azure project, you generate two files, the package
    file itself and the accompanying configuration file:

    -   Project.cspkg
    -   ServiceConfiguration.*TargetProfile*.cscfg

    By default, each Azure project includes one
    service configuration file (.cscfg file) for local (debugging)
    builds and another for cloud (staging or production) builds, but you
    can add or remove service configuration files as needed. When you
    build a package within Visual Studio, you will be asked which
    service configuration file to include alongside the package.

5.  Specify the service configuration file. When you build a package by
    using MSBuild, the local service configuration file is included by
    default. To include a different service configuration file, set the
    TargetProfile property of the MSBuild command, as in the following
    example:

        MSBuild /t:Publish /p:TargetProfile=Cloud

6.  Specify the location for the output. Set the path by using the
    /p:PublishDir=*Directory*\\ option, including the trailing
    backslash separator, as in the following example:

        MSBuild /target:Publish /p:PublishDir=\\myserver\drops\

    Once you've constructed and tested an appropriate MSBuild command
    line to build your projects and combine them into an Azure package,
    you can add this command line to your build scripts. If your build
    server uses custom scripts, this process will depend on the
    specifics of your custom build process. If you are using TFS as a
    build environment, then you can follow the instructions in the next
    step to add the Azure package build to your build process.

<h2> <a name="step3"> </a>Step 3: Build a Package using TFS Team Build (Optional)</h2>

If you have Team Foundation Server (TFS) set up as a build controller
and the build server set up as a TFS build machine, then you can set up
an automated build for your Azure package. For information on
how to set up and use Team Foundation server as a build system, see
[Understanding the Team Foundation Build System][]. In particular, the
following procedure assumes that you have configured your build server
as described in [Configure a Build Machine][], and that you have created
a team project, created a cloud service project in the team project.

To configure TFS to build Azure packages, perform the following
steps:

1.  In Visual Studio on your development computer, on the View
    menu, choose **Team Explorer**, or choose Ctrl+\\, Ctrl+M. In the
    Team Explorer window, expand the **Builds** node or choose the **Builds**
    page, and choose **New Build Definition**.

    ![][0]

2.  Click the **Trigger** tab, and specify the desired conditions for
    when you want the package to be built. For example, specify
    **Continuous Integration** to build the package whenever a source
    control check-in occurs.

3.	Choose the **Source Settings** tab, and make sure your project folder is listed
	in the **Source Control Folder** column, and the status is **Active**.

4.  Choose the **Build Defaults** tab, and under Build controller, verify
    the name of the build server.  Also, choose the option **Copy build 
    output to the following drop folder** and specify the desired drop
    location.

5.  Click the **Process** tab. On the Process tab, choose the default
    template, under **Build**, choose the project if it is not already selected,
    and expand the **Advanced** section in the **Build** section of the grid. 

6.  Choose **MSBuild Arguments**, and set the appropriate MSBuild
    command line arguments as described in Step 2 above. For example,
    enter **/t:Publish /p:PublishDir=\\\\myserver\\drops\\** to build a
    package and copy the package files to the location
    \\\\myserver\\drops\\:

    ![][2]

    **Note:** Copying the files to a public share makes it easier to
    manually deploy the packages from your development computer.

5.  Test the success of your build step by checking in a change to your
    project, or queue up a new build. To queue up a new build, in the
    Team Explorer, right-click **All Build Definitions,** and then
    choose **Queue New Build**.

<h2> <a name="step4"> </a>Step 4: Publish a Package using a PowerShell Script</h2>

This section describes how to construct a Windows PowerShell script that
will publish the Cloud app package output to Azure using
optional parameters. This script can be called after the build step in
your custom build automation. It can also be called from Process
Template workflow activities in Visual Studio TFS Team Build.

1.  Install the [Azure PowerShell cmdlets][] (v0.6.1 or higher).
    During the cmdlet setup phase choose to install as a snap-in. Note
    that this officially supported version replaces the older version
    offered through CodePlex, although the previous versions were numbered 2.x.x.

2.  Start Azure PowerShell using the Start menu or Start page. If you start in this way,
    the Azure PowerShell cmdlets will be loaded.

3.  At the PowerShell prompt, verify that the PowerShell cmdlets are loaded
    by typing the partial command Get-Azure and then pressing tab for statement
    completion.

    If you press tab repeatedly, you should see various Azure PowerShell commands.

4.  Verify that you can connect to your Azure subscription by
    importing your subscription information from the .publishsettings file.

    Import-AzurePublishSettingsFile c:\scripts\WindowsAzure\default.publishsettings

    Then give the command

    Get-AzureSubscription

    This will display information about your subscription. Verify that everything is correct.

4.  Save the script template provided at the [end of this article][] to
    your scripts folder as
    c:\\scripts\\WindowsAzure\\**PublishCloudService.ps1**.

5.  Review the parameters section of the script. Add or modify any
    default values. These values can always be overridden by passing in
    explicit parameters.

6.  Ensure there are valid cloud service and storage accounts created
    in your subscription that can be targeted by the publish script. The
    storage account (blob storage) will be used to upload and
    temporarily store the deployment package and config file while the
    deployment is being created.

    -   To create a new cloud service, you can call this script or use
        the Azure Management Portal. The cloud service name
        will be used as a prefix in a fully qualified domain name and
        hence it must be unique.

            New-AzureService -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"

    -   To create a new storage account, you can call this script or use
        the Azure Management Portal. The storage account name
        will be used as a prefix in a fully qualified domain name and
        hence it must be unique. You can try using the same name as the
        cloud service.

            New-AzureStorageAccount -ServiceName "mytestcloudservice" -Location "North Central US" -Label "mytestcloudservice"

7.  Call the script directly from Azure PowerShell, or wire up this
    script to your host build automation to occur after the package
    build.

    **WARNING:** The script will always delete or replace your existing
    deployments by default if they are detected. This is necessary to
    enable continuous delivery from automation where no user prompting
    is possible.

    **Example scenario 1:** continuous deployment to the staging
    environment of a service:

        PowerShell c:\scripts\windowsazure\PublishCloudService.ps1 -environment Staging -serviceName mycloudservice -storageAccountName mystoragesaccount -packageLocation c:\drops\app.publish\ContactManager.Azure.cspkg -cloudConfigLocation c:\drops\app.publish\ServiceConfiguration.Cloud.cscfg -subscriptionDataFile c:\scripts\default.publishsettings

    This is typically followed up by test run verification and a VIP
    swap. The VIP swap can be done via the Azure Management
    Portal or by using the Move-Deployment cmdlet.

    **Example scenario 2:** continuous deployment to the production
    environment of a dedicated test service

        PowerShell c:\scripts\windowsazure\PublishCloudService.ps1 -environment Production -enableDeploymentUpgrade 1 -serviceName mycloudservice -storageAccountName mystorageaccount -packageLocation c:\drops\app.publish\ContactManager.Azure.cspkg -cloudConfigLocation c:\drops\app.publish\ServiceConfiguration.Cloud.cscfg -subscriptionDataFile c:\scripts\default.publishsettings

    **Remote Desktop:**

    If Remote Desktop is enabled in your Azure project you will
    need to perform additional one-time steps to ensure the correct
    Cloud Service Certificate is uploaded to all cloud services
    targeted by this script.

    Locate the certificate thumbprint values expected by your roles. The
    thumbprint values are visible in the Certificates section of the
    cloud config file (i.e. ServiceConfiguration.Cloud.cscfg). It is
    also visible in the Remote Desktop Configuration dialog in Visual
    Studio when you Show Options and view the selected certificate.

        <Certificates>
              <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="C33B6C432C25581601B84C80F86EC2809DC224E8" thumbprintAlgorithm="sha1" />
        </Certificates>

    Upload Remote Desktop certificates as a one-time setup step using
    the following cmdlet script:

        Add-AzureCertificate -serviceName <CLOUDSERVICENAME> -certToDeploy (get-item cert:\CurrentUser\MY\<THUMBPRINT>)

    For example:

        Add-AzureCertificate -serviceName 'mytestcloudservice' -certToDeploy (get-item cert:\CurrentUser\MY\C33B6C432C25581601B84C80F86EC2809DC224E8

    Alternatively you can export the certificate file PFX with private
    key and upload certificates to each target cloud service using the
    Azure Management Portal. Read the following article to learn
    more:
    [http://msdn.microsoft.com/library/windowsazure/gg443832.aspx][].

    **Upgrade Deployment vs. Delete Deployment -\> New Deployment**

    The script will by default perform an Upgrade Deployment
    ($enableDeploymentUpgrade = 1) when no parameter is passed in or the
    value 1 is passed explicitly. For single instances this has the
    advantage of taking less time than a full deployment. For instances
    that require high availability this also has the advantage of
    leaving some instances running while others are upgraded (walking
    your update domain), plus your VIP will not be deleted.

    Upgrade Deployment can be disabled in the script
    ($enableDeploymentUpgrade = 0) or by passing
    -enableDeploymentUpgrade 0 as a parameter, which will alter the
    script behavior to first delete any existing deployment and then
    create a new deployment.

    **Warning:** The script will always delete or replace your existing
    deployments by default if they are detected. This is necessary to
    enable continuous delivery from automation where no user/operator
    prompting is possible.

<h2><a name="step5"> </a>Step 5: Publish a Package using TFS Team Build (Optional)</h2>

This step will wire up TFS Team Build to the script created in step 4,
which handles publishing of the package build to Azure. This
entails modifying the Process Template used by your build definition so
that it runs a Publish activity at the end of the workflow. The Publish
activity will execute your PowerShell command passing in parameters from
the build. Output of the MSBuild targets and publish script will be
piped into the standard build output.

1.  Edit the Build Definition responsible for continuous deploy.

2.  Select the **Process** tab.

3.	Follow [these instructions](http://msdn.microsoft.com/library/dd647551.aspx) to add an
    Activity project for the build process template, download the default template, add it to
	the project and check it in. Give the build process template a new name, such as
	AzureBuildProcessTemplate.

3.  Return to the **Process** tab, and use **Show Details** to show a list of available
	build process templates. Choose the **New...** button, and navigate to the project you
	just added and checked in. Locate the template you just created and choose **OK**.

4.  Open the selected Process Template for editing. You can open
    directly in the Workflow designer or in the XML editor to work with
    the XAML.

5.  Add the following list of new arguments as separate line items in
    the arguments tab of the workflow designer. All arguments should
    have direction=In and type=String. These will be used to flow
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

    ![][3]

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

6.  Add a new sequence at the end of Run On Agent:

    1.  Start by adding an If Statement activity to check for a valid
        script file. Set the condition to this value:

            Not String.IsNullOrEmpty(PublishScriptLocation)

    2.  In the Then case of the If Statement, add a new Sequence
        activity. Set the display name to 'Start publish'

    3.  With the Start publish sequence still selected, add the
        following list of new variables as separate line items in the
        variables tab of the workflow designer. All variables should
        have Variable type =String and Scope=Start publish. These will
        be used to flow parameters from the build definition into the
        workflow, which then get used to call the publish script.

        -   SubscriptionDataFilePath, of type String

        -   PublishScriptFilePath, of type String

            ![][4]

    4.  If you are using TFS 2012 or earlier, add a ConvertWorkspaceItem activity at the beginning of the new
        Sequence. If you are using TFS 2013 or later, add a GetLocalPath activity at the beginning of the new sequence. For a ConvertWorkspaceItem, set the properties as follows: Direction=ServerToLocal, DisplayName='Convert publish
        script filename', Input=' PublishScriptLocation',
        Result='PublishScriptFilePath', Workspace='Workspace'. For a GetLocalPath activity, set the property IncomingPath to 'PublishScriptLocation', and the Result to 'PublishScriptFilePath'. This
        activity converts the path to the publish script from TFS server
        locations (if applicable) to a standard local disk path.

    5.  If you are using TFS 2012 or earlier, add another ConvertWorkspaceItem activity at the end of the new
        Sequence. Direction=ServerToLocal, DisplayName='Convert
        subscription filename', Input=' SubscriptionDataFileLocation',
        Result= 'SubscriptionDataFilePath', Workspace='Workspace'. If you are using TFS 2013 or later, add another GetLocalPath. IncomingPath='SubscriptionDataFileLocation', and Result='SubscriptionDataFilePath.'

    6.  Add an InvokeProcess activity at the end of the new Sequence.
        This activity calls PowerShell.exe with the arguments passed in
        by the Build Definition.

        1.  Arguments = String.Format(" -File ""{0}"" -serviceName {1}
            -storageAccountName {2} -packageLocation ""{3}""
            -cloudConfigLocation ""{4}"" -subscriptionDataFile ""{5}""
            -selectedSubscription {6} -environment ""{7}""",
            PublishScriptFilePath, ServiceName, StorageAccountName,
            PackageLocation, CloudConfigLocation,
            SubscriptionDataFilePath, SubscriptionName, Environment)

        2.  DisplayName = Execute publish script

        3.  FileName = "PowerShell" (include the quotes)

        4.  OutputEncoding=
            System.Text.Encoding.GetEncoding(System.Globalization.CultureInfo.InstalledUICulture.TextInfo.OEMCodePage)

    7.  In the **Handle Standard Output** section textbox of the
        InvokeProcess, set the textbox value to 'data'. This is a
        variable to store the standard output data.

    8.  Add a WriteBuildMessage activity just below the **Handle Standard Output**
        section. Set the Importance =
        'Microsoft.TeamFoundation.Build.Client.BuildMessageImportance.High'
        and the Message='data'. This ensures the standard output of the
        script will get written to the build output.

    9.  In the **Handle Error Output** section textbox of the
        InvokeProcess, set the textbox value to 'data'. This is a
        variable to store the standard error data.

    10. Add a WriteBuildError activity just below the **Handle Error Output**
        section. Set the Message='data'. This ensures the standard
        errors of the script will get written to the build error output.

	11. Correct any errors, indicated by blue exclamation marks. Hover over the
		exclamation marks to get a hint about the error. Save the workflow to 
		clear errors.

    The final result of the publish workflow activities will look like
    this in the designer:

    ![][5]

    The final result of the publish workflow activities will look like
    this in XAML:

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


7.  Save the build process template workflow and Check In this file.

8.  Edit the build definition (close it if it is already open), and select
	the **New** button if you do not yet see the new template in the list of Process Templates.

9.  Set the parameter property values in the Misc section as follows:

    1.  CloudConfigLocation ='c:\\drops\\app.publish\\ServiceConfiguration.Cloud.cscfg'   
        *This value is derived from:
        ($PublishDir)ServiceConfiguration.Cloud.cscfg*

    2.  PackageLocation = 'c:\\drops\\app.publish\\ContactManager.Azure.cspkg'   
        *This value is derived from: ($PublishDir)($ProjectName).cspkg*

    3.  PublishScriptLocation = 'c:\\scripts\\WindowsAzure\\PublishCloudService.ps1'

    4.  ServiceName = 'mycloudservicename'   
        *Use the appropriate cloud service name here*

    5.  Environment = 'Staging'

    6.  StorageAccountName = 'mystorageaccountname'   
        *Use the appropriate storage account name here*

    7.  SubscriptionDataFileLocation =
        'c:\\scripts\\WindowsAzure\\Subscription.xml'

    8.  SubscriptionName = 'default'

    ![][6]

10. Save the changes to the Build Definition.

11. Queue a Build to execute both the package build and publish. If you
    have a trigger set to Continuous Integration, you will execute this
    behavior on every check-in.

### <a name="script"> </a>PublishCloudService.ps1 script template

<pre>
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
</pre>

## Next steps

To enable remote debugging when using continuous delivery, see [these instructions](http://go.microsoft.com/fwlink/p/?LinkID=402354). 

  [Continuous Delivery to Azure by Using Visual Studio Online]: cloud-services-continuous-delivery-use-vso.md
  [Step 1: Configure the Build Server]: #step1
  [Step 2: Build a Package using MSBuild Commands]: #step2
  [Step 3: Build a Package using TFS Team Build (Optional)]: #step3
  [Step 4: Publish a Package using a PowerShell Script]: #step4
  [Step 5: Publish a Package using TFS Team Build (Optional)]: #step5
  [Team Foundation Build Service]: http://go.microsoft.com/fwlink/p/?LinkId=239963
  [.NET Framework 4]: http://go.microsoft.com/fwlink/?LinkId=239538
  [.NET Framework 4.5]: http://go.microsoft.com/fwlink/?LinkId=245484
  [.NET Framework 4.5.2]: http://go.microsoft.com/fwlink/?LinkId=521668
  [Azure Authoring Tools]: http://go.microsoft.com/fwlink/?LinkId=239600
  [Azure Libraries]: http://go.microsoft.com/fwlink/?LinkId=257862
  [Azure Tools for Visual Studio]: http://go.microsoft.com/fwlink/?LinkId=257862
  [MSBuild Command Line Reference]: http://msdn.microsoft.com/library/ms164311(v=VS.90).aspx
  [1]: http://go.microsoft.com/fwlink/p/?LinkId=239966
  [Understanding the Team Foundation Build System]: http://go.microsoft.com/fwlink/?LinkId=238798
  [Configure a Build Machine]: http://go.microsoft.com/fwlink/?LinkId=238799
  [0]: ./media/cloud-services-dotnet-continuous-delivery/tfs-01.png
  [2]: ./media/cloud-services-dotnet-continuous-delivery/tfs-02.png
  [Azure PowerShell cmdlets]: http://go.microsoft.com/fwlink/?LinkId=256262
  [the .publishsettings file]: https://manage.windowsazure.com/download/publishprofile.aspx?wa=wsignin1.0
  [end of this article]: #script
  
  [3]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-03.png
  [4]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-04.png
  [5]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-05.png
  [6]: ./media/cloud-services-dotnet-continuous-delivery/common-task-tfs-06.png
