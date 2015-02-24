<properties 
	pageTitle="Use the autoscaling application block (.NET) - Azure" 
	description="Learn how to use the Autoscaling Application for Azure. Code samples are written in C# and use the .NET API." 
	services="cloud-services" 
	documentationCenter=".net" 
	authors="squillace" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="11/14/2014" 
	ms.author="rasquill"/>







# How to Use the Autoscaling Application Block

This guide will demonstrate how to perform common scenarios using the
Autoscaling Application Block from the [Microsoft Enterprise Library 5.0
Integration Pack for Azure][]. The samples are written in C\#
and use the .NET API. The scenarios covered include **hosting the
block**, **using constraint rules**, and **using reactive rules**. For
more information on the Autoscaling Application Block, see the [Next Steps][] section.

## Table of Contents

[What is the Autoscaling Application Block?][]   
 [Concepts][]   
 [Collect Performance Counter Data from your Target Azure Application][]   
 [Set up a Host Application for the Autoscaling Application Block][]   
 [How to: Instantiate and Run the Autoscaler][] [How To: Define your Service Model][]   
 [How To: Define your Autoscaling Rules][]   
 [How To: Configure the Autoscaling Application Block][]   
 [Next Steps][]

## <a id="WhatIs"> </a>What is the Autoscaling Application Block?

The Autoscaling Application Block can automatically scale your Windows
Azure application based on rules that you define specifically for your
application. You can use these rules to help your Azure
application maintain its throughput in response to changes in its
workload, while at the same time control the costs associated with
hosting your application in Azure. Along with scaling by
increasing or decreasing the number of role instances in your
application, the block also enables you to use other scaling actions
such as throttling certain functionality within your application or
using custom-defined actions.

You can choose to host the block in an Azure role or in an
on-premises application.

The Autoscaling Application Block is part of the [Microsoft Enterprise Library 5.0 Integration Pack for Azure][].

## <a id="Concepts"> </a>Concepts

In the following diagram, the green line shows a plot of the number of
running instances of an Azure role over two days. The number of
instances changes automatically over time in response to a set of
autoscaling rules.

![diagram of sample autoscaling](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling01.png)

The block uses two types of rules to define the autoscaling behavior for
your application:

-   **Constraint Rules:** To set upper and lower bounds on the number of
    instances, for example, let's say that between 8:00 and 10:00 every
    morning you want a minimum of four and a maximum of six instances,
    then you use a **constraint rule**. In the diagram, the red and blue
    lines represent constraint rules. For example, at point **A** in
    the diagram, the minimum number of role instances rises from two to
    four, in order to accommodate the anticipated increase in the
    application's workload at this time. At point **B** in the diagram,
    the number of role instances is prevented from climbing above five
    in order to control the running costs of the application.

-   **Reactive Rules:** To enable the number of role instances to change
    in response to unpredictable changes in demand, you use **reactive
    rules**. At point **C** in the diagram, the block automatically
    reduces the number of role instances, from four to three, in
    response to a reduction in workload. At point **D**, the block
    detects an increase in workload and automatically increases the
    number of running role instances from three to four.

The block stores its configuration settings in two stores:

-   **Rules Store:** The Rules Store holds your business configuration;
    a list of all the autoscaling rules that you have defined for your
    Azure application. This store is typically an XML file that
    is located where the Autoscaling Application Block can read it, for
    example in Azure blob storage or in a local file.

-   **Service Information Store:** The Service Information Store stores
    your operational configuration, which is the service model of your
    Azure application. This service model includes all of the
    information about your Azure application (such as role names
    and storage account details) that the block needs to be able to
    collect data points from the target Azure application and to
    perform scaling operations.

## <a id="PerfCounter"> </a>Collect Performance Counter Data from your Target Azure Application

Reactive rules can use performance counter data from roles as part of
the rule definition. For example, a reactive rule may monitor the CPU
utilization of an Azure role to determine whether the block
should initiate a scaling operation. The block reads performance counter
data from the Azure Diagnostics table named
**WADPerformanceCountersTable** in Azure storage.

By default, Azure does not write performance counter data to the
Azure Diagnostics table in Azure storage. Therefore, you
should modify the roles from which you need to collect performance
counter data to save this data. For details about how to enable
performance counters in your application, see [Using performance counters in Azure][].

## <a id="CreateHost"> </a>Set up a Host Application for the Autoscaling Application Block

You can host the Autoscaling Application Block either in an Azure
role or in an on-premises application. The Autoscaling Application Block
is typically hosted in a separate application from the target
application that you want to scale automatically. This section provides
guidelines about how to configure your host application.

### Get the Autoscaling Application Block NuGet Package

Before you can use the Autoscaling Application Block in your Visual
Studio project, you will need to obtain the Autoscaling Application
Block binaries and add references to them in your project. The NuGet
Visual Studio extension makes it easy to install and update libraries
and tools in Visual Studio and Visual Web Developer. The Autoscaling
Application Block NuGet package is the easiest way to get the Autscaling
Application Block APIs. For more information about **NuGet**, and how to
install and use the **NuGet** Visual Studio extension, see the [NuGet][]
website.

Once you have the NuGet Package Manager installed, to install the Autoscaling NuGet
package in your application, do the following:

1.  Open the **NuGet Package Manager Console** window. In the **Tools**
    menu, select **Library Package Manager**, the select **Package
    Manager Console**.

2.  Enter the following command in the NuGet Package Manager Console
    window:

        PM> Install-Package EnterpriseLibrary.WindowsAzure.Autoscaling

Installing the NuGet package updates your project with all the necessary
assemblies and references that you need to use the Autoscaling
Application Block. Your project now includes the XML schema files for
the autoscaling rule definitions and autoscaling service information.
The project now also includes a readme file that contains important
information about the Autoscaling Application Block:

![files configured by autoscaling NuGet package](./media/cloud-services-dotnet-autoscaling-application-block/auotscaling02.png)


### Set the Target Framework to .NET Framework 4

Your project must target the .NET Framework 4. To change or verify the
target framework:

1.  In Solution Explorer, right-click on the project name and select
    **Properties**.

2.  In the **Application** tab of the Properties window, make sure Target framework is set to **.NET Framework 4**.

	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling03.png)


### Add Namespace References

Add the following code namespace declarations to the top of any C\# file
in which you wish to programmatically access the Autoscaling Application
Block:

    using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
    using Microsoft.Practices.EnterpriseLibrary.WindowsAzure.Autoscaling;

## <a id="Instantiate"> </a>How to: Instantiate and Run the Autoscaler

Use the **IServiceLocator.GetInstance** method to instantiate the
Autoscaler, and then call the **Autoscaler.Start** method to run the
**Autoscaler**.

    Autoscaler scaler =
        EnterpriseLibraryContainer.Current.GetInstance<Autoscaler>();
    scaler.Start();

## <a id="DefineServiceModel"> </a>How To: Define your Service Model

Typically, you store your service model (a description of your Windows
Azure environment that includes information about subscriptions, hosted
services, roles, and storages accounts) in an XML file. You can find a
copy of the schema for this XML file in the
**AutoscalingServiceModel.xsd** file in your project. In Visual Studio,
this schema provides Intellisense and validation when you edit the
service model XML file.

Create a new XML file called **services.xml** in your project.

In Visual Studio, you must ensure that the service model file is copied
to the output folder. To do this:

1.  Right-click on the file and select **Properties**.

2.  Within the Properties pane, set the **Copy to Output Directory**
    value to **Copy always**.

    ![Set Copy to Output Directory value](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling04.png)


	The following code sample shows an example service model in a **services.xml** file:

    <?xml version="1.0" encoding="utf-8" ?>
    <serviceModel xmlns="http://schemas.microsoft.com/practices/2011/entlib/autoscaling/serviceModel">
      <subscriptions>
        <subscription name="[subscriptionname]"
                      certificateThumbprint="[managementcertificatethumbprint]"
                      subscriptionId="[subscriptionid]"
                      certificateStoreLocation="CurrentUser"
                      certificateStoreName="My">
          <services>
            <service dnsPrefix="[hostedservicednsprefix]" slot="Staging">
              <roles>
                <role alias="AutoscalingApplicationRole"
                      roleName="[targetrolename]"
                      wadStorageAccountName="targetstorage"/>
              </roles>
            </service>
          </services>
          <storageAccounts>
            <storageAccount alias="targetstorage"
              connectionString="DefaultEndpointsProtocol=https;AccountName=[storageaccountname];AccountKey=[storageaccountkey]">
            </storageAccount>
          </storageAccounts>
        </subscription>
      </subscriptions>
    </serviceModel>

You must replace the values in square brackets with values specific to
your environment and target application. To find many of these values,
you will need to log in to the [Azure Management Portal][].

Sign in to the management portal.

-   **[subscriptionname]:** Choose a friendly name to refer to the
    Azure subscription that contains the application in which
    you want to use auto-scaling.

-   **[subscriptionid]:** The unique ID of the
    Azure subscription that contains the application in which
    you want to use auto-scaling.

    1.  In the Azure Management Portal, click
        **Cloud Services**.

    2.  In the list of Cloud Services, click on the service that hosts the
        application in which you want to use autoscaling. The
        Quick Glance pane on the right will display the
        **Subscription ID**.

        ![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling05.png)

  
	-   **[hostedservicednsprefix]:** The DNS Prefix of the hosted service in which you want to use auto-scaling.

    1.  In the Azure Management Portal, click
        **Cloud Services**.

    2.  In the list of Cloud Services, locate the service that hosts the
        application in which you want to use autoscaling. The name of
        the cloud serviceClick is the **DNS Prefix**.

        ![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling06.png)
 
	-   **[targetrolename]:** The name of the role that is the target of your auto-scaling rules.

    1.  In the Azure Management Portal, click
        **Cloud Services**.

    2.  In the list of Cloud Services, click on the service that hosts the
        application in which you want to use autoscaling, then click
        **Instances**. The **Role* column displays the name of your target
        role.

        ![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling07.png)


	-   **[storageaccountname]** and **[storageaccountkey]:** The name of the Azure storage account that you are using for your target Azure application.

    1.  In the Azure Management Portal, click
        **Storage**.

    2.  In the list of Storage Accounts, select  the storage account you are using. The
        **Name** column will display the **Name**.

    3.  Click the **Manage Keys** button at the bottom of the screen
        to get the primary access key.

        ![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling08.png)
  
 
	-   **[managementcertificatethumbprint]:** The **Thumbprint** of the Management Certificate that the block will use to secure scaling requests to the target application.

    1.  In the Azure Management Portal, click
        **Settings**.

    2.  The **Thumbprint** column will display the **Thumbprint**.

        ![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling09.png)
 

To find out more about the content of the service model file, see
[Storing Your Service Information Data][].

## <a id="DefineAutoscalingRules"> </a>How To: Define your Autoscaling Rules

Typically, you store the autoscaling rules that control the number of
role instances in your target application in an XML file. You can find a
copy of the schema for this XML file in the **AutoscalingRules.xsd**
file in your project. In Visual Studio, this schema provides
Intellisense and validation when you edit the XML file.

Create a new XML file named **rules.xml** in your project.

In Visual Studio, you must ensure that the rules file is copied to the
output folder. To do this:

1.  Right-click on the file and select **Properties**.

2.  Within the Properties pane, set the **Copy to Output Directory**
    value to **Copy always**.

The following code sample shows an example rule set in a **rules.xml**
file:

    <?xml version="1.0" encoding="utf-8" ?>
    <rules xmlns="http://schemas.microsoft.com/practices/2011/entlib/autoscaling/rules">
      <constraintRules>
        <rule name="default" enabled="true" rank="1" description="The default constraint rule">
          <actions>
            <range min="2" max="6" target="AutoscalingApplicationRole"/>
          </actions>
        </rule>
      </constraintRules>
      <reactiveRules>
        <rule name="ScaleUpOnHighUtilization" rank="10" description="Scale up the web role" enabled="true" >
          <when>
            <any>
               <greaterOrEqual operand="WebRoleA_CPU_Avg_5m" than="60"/>
            </any>
          </when>
          <actions>
            <scale target="AutoscalingApplicationRole" by="1"/>
          </actions>
        </rule>
        <rule name="ScaleDownOnLowUtilization" rank="10" description="Scale up the web role" enabled="true" >
          <when>
            <all>
              <less operand="WebRoleA_CPU_Avg_5m" than="60"/>
            </all>
          </when>
          <actions>
            <scale target="AutoscalingApplicationRole" by="-1"/>
          </actions>
        </rule>
      </reactiveRules>
      <operands>
        <performanceCounter alias="WebRoleA_CPU_Avg_5m"
          performanceCounterName="\Processor(_Total)\% Processor Time"
          source ="AutoscalingApplicationRole"
          timespan="00:05:00" aggregate="Average"/>
      </operands>
    </rules>

In this example there are three autoscaling rules (one **constraint
rule** and two **reactive rules**) that operate on a target named
**AutoscalingApplicationRole** that is the alias of a role defined in
the **service model**:

-   The constraint rule is always active and sets the minimum number of
    role instances to two and the maximum number of role instances to
    six.

-   Both reactive rules use an **operand** named
    **WebRoleA\_CPU\_Avg\_5m** that calculates the average CPU usage
    over the last five minutes for an Azure role named
    **AutoscalingApplicationRole.** This role is defined in the
    **service model**.

-   The reactive rule named **ScaleUpOnHighUtilization** increments the
    instance count of the target role by one if the average CPU
    utilization over the last five minutes has been greater than or
    equal to 60%.

-   The reactive rule named **ScaleDownOnLowUtilization** decrements the
    instance count of the target role by one if the average CPU
    utilization over the last five minutes has been less than 60%.

## <a id="Configure"> </a>How To: Configure the Autoscaling Application Block

After you have defined your service model and autoscaling rules, you
must configure the Autoscaling Application Block to use them. This
operational configuration information is stored in the application
configuration file.

By default, the Autoscaling Application Block expects the autoscaling
rules and service model to be stored in Azure blobs. In this
example, you will configure the block to load them from the local file
system.

### Configure the Autoscaling Application Block in the host application

1.  Right-click on the **App.config** file in Solution Explorer and then
    click **Edit Configuration File**.

2.  In the **Blocks** menu, click **Add Autoscaling Settings**:  
	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling10.png)
  
3.  Expand the **Autoscaling Settings** and then click the ellipsis (...)
    next to the **Data Points Store Storage Account**, add the **Account
    name** and **Account key** of the Azure storage account
    where the block will store the data points that it collects (see
    [How To: Define your Service Model][] if you are unsure about where
    to find these values), and then click **OK**:  

	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling11.png)

4.  Expand the **Autoscaling Settings** section to reveal the **Rules
    Store** and **Service Information Store** sections. By default, they
    are configured to use Azure blob storage:  
	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling12.png)


5.  Click the plus sign (+) next to **Rules Store**, point to **Set
    Rules Store**, then click **Use Local File Rules Store**, and then
    click **Yes**.

6.  In the **File Name** box, type **rules.xml**. This is the name of
    the file that contains your autoscaling rules:  
	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling13.png)


7.  Click the plus sign (+) next to **Service Information Store**, point
    to **Set Service Information Store**, then click **Use Local File
    Service Information Store**, and then click **Yes**.

8.  In the **File Name** box, type **services.xml**. This is the name of
    the file that contains your autoscaling rules:  
	![image](./media/cloud-services-dotnet-autoscaling-application-block/autoscaling14.png)


9.  In the Enterprise Library Configuration window, on the **File**
    menu, click **Save** to save your configuration changes. Then in the
    Enterprise Library Configuration window, on the **File** menu, click
    **Exit**.

To get detailed information about the actions that the Autoscaling
Application Block is performing you need to capture the log messages
that it writes. For example, if you are hosting the block in a console
application, you can view the log messages in the Output window in
Visual Studio. The following section shows you how to configure this
behavior.

### Configure logging in the Autoscaling Application Block host application

1.  In Visual Studio, double-click on the **App.config** file in
    Solution Explorer to open it in the editor. Then add the
    **system.diagnostics** section as shown in the following sample:

        <?xml version="1.0" encoding="utf-8" ?>
        <configuration>
          ...
          <system.diagnostics>
            <sources>
              <sourcename="Autoscaling General" switchName="SourceSwitch" switchType="System.Diagnostics.SourceSwitch" />
              <sourcename="Autoscaling Updates" switchName="SourceSwitch" switchType="System.Diagnostics.SourceSwitch" />
            </sources>
            <switches>
              <addname="SourceSwitch" value="Verbose, Information, Warning, Error, Critical" />
            </switches>
          </system.diagnostics>
        </configuration>

2.  Save your changes.

You can now run your Autoscaling Application Block host console
application and observe how the autoscaling rules work with your target
Azure application. When you run the host console application,
you should see messages similar to the following in the Output window in
Visual Studio. These log messages help you to understand the behavior of
the block. For example, they indicate which rules are being matched by
the block and what actions the block is taking.

    Autoscaling General Verbose: 1002 : Rule match.
    [BEGIN DATA]{"EvaluationId":"6b27dfa0-b671-44a3-adf1-bb1e0b7c3726",
    "MatchingRules":[{"RuleName":"default","RuleDescription":"The default constraint rule",
    "Targets":["AutoscalingApplicationRole"]},{"RuleName":"ScaleUp","RuleDescription":"Scale up the web role",
    "Targets":[]},{"RuleName":"ScaleDown","RuleDescription":"Scale up the web role","Targets":[]}]}

    Autoscaling Updates Verbose: 3001 : The current deployment configuration for a hosted service is about to be checked
    to determine if a change is required (for role scaling or changes to settings).
    [BEGIN DATA]{"EvaluationId":"6b27dfa0-b671-44a3-adf1-bb1e0b7c3726",
    "HostedServiceDetails":{"Subscription":"AutoscalingHowTo","HostedService":"autoscalingtarget",
    "DeploymentSlot":"Staging"},"ScaleRequests":{"AutoscalingApplicationRole":{"Min":2,"Max":6,"AbsoluteDelta":0,
    "RelativeDelta":0,"MatchingRules":"default"}},"SettingChangeRequests":{}}

    Autoscaling Updates Verbose: 3003 : Role scaling requests for hosted service about to be submitted.
    [BEGIN DATA]{"EvaluationId":"6b27dfa0-b671-44a3-adf1-bb1e0b7c3726",
    "HostedServiceDetails":{"Subscription":"AutoscalingHowTo","HostedService":"autoscalingtarget",
    "DeploymentSlot":"Staging"},
    "ScaleRequests":{"AutoscalingApplicationRole":
    {"Min":2,"Max":6,"AbsoluteDelta":0,"RelativeDelta":0,"MatchingRules":"default"}},
    "SettingChangeRequests":{},"InstanceChanges":{"AutoscalingApplicationRole":{"CurrentValue":1,"DesiredValue":2}},
    "SettingChanges":{}}

    Autoscaling Updates Information: 3002 : Role configuration changes for deployment were submitted.
    [BEGIN DATA]{"EvaluationId":"6b27dfa0-b671-44a3-adf1-bb1e0b7c3726",
    "HostedServiceDetails":{"Subscription":"AutoscalingHowTo","HostedService":"autoscalingtarget",
    "DeploymentSlot":"Staging"},"ScaleRequests":{"AutoscalingApplicationRole":{"Min":2,"Max":6,"AbsoluteDelta":0,
    "RelativeDelta":0,"MatchingRules":"default"}},"SettingChangeRequests":{},
    "InstanceChanges":{"AutoscalingApplicationRole":{"CurrentValue":1,"DesiredValue":2}},
    "SettingChanges":{},"RequestID":"f8ca3ada07c24559b1cb075534f02d44"}

## <a id="NextSteps"> </a>Next Steps

Now that you've learned the basics of using the Autoscaling Application
Block, follow these links to learn how to implement more complex
autoscaling scenarios:

-   [Hosting the Autoscaling Application Block in a Worker Role][]
-   [Implementing Throttling Behavior][]
-   [Understanding Rule Ranks and Reconciliation][]
-   [Extending and Modifying the Autoscaling Application Block][]
-   [Using the Optimizing Stabilizer to prevent high frequency oscillation and to optimize costs][]
-   [Using Notifications and Manual Scaling][]
-   [Defining Scale Groups][]
-   [Using the WASABiCmdlets for manipulating the block via Windows PowerShell][]
-   [Developer's Guide to the Enterprise Library 5.0 Integration Pack for Azure][]
-   [How Sage Reduces Azure Hosting Costs Using Autoscaling][]
-   [Reducing TechNet and MSDN hosting costs and environmental impact with autoscaling on Azure][]

  [Microsoft Enterprise Library 5.0 Integration Pack for Azure]:
    http://go.microsoft.com/fwlink/?LinkID=235134
  [Next Steps]: #NextSteps
  [What is the Autoscaling Application Block?]: #WhatIs
  [Concepts]: #Concepts
  [Collect Performance Counter Data from your Target Azure Application]: #PerfCounter
  [Set up a Host Application for the Autoscaling Application Block]: #CreateHost
  [How to: Instantiate and Run the Autoscaler]: #Instantiate
  [How To: Define your Service Model]: #DefineServiceModel
  [How To: Define your Autoscaling Rules]: #DefineAutoscalingRules
  [How To: Configure the Autoscaling Application Block]: #Configure
  [Using performance counters in Azure]: http://www.windowsazure.com/develop/net/common-tasks/performance-profiling/
  [NuGet]: http://nuget.org/
  [Azure Management Portal]: http://manage.windowsazure.com
  [Storing Your Service Information Data]: http://msdn.microsoft.com/library/hh680878(PandP.50).aspx		
  [Hosting the Autoscaling Application Block in a Worker Role]: http://msdn.microsoft.com/library/hh680914(PandP.50).aspx
  [Implementing Throttling Behavior]: http://msdn.microsoft.com/library/hh680896(PandP.50).aspx
  [Understanding Rule Ranks and Reconciliation]: http://msdn.microsoft.com/library/hh680923(PandP.50).aspx
  [Extending and Modifying the Autoscaling Application Block]: http://msdn.microsoft.com/library/hh680889(PandP.50).aspx
  [Using the Optimizing Stabilizer to prevent high frequency oscillation and to optimize costs]: http://msdn.microsoft.com/library/hh680951(PandP.50).aspx
  [Using Notifications and Manual Scaling]: http://msdn.microsoft.com/library/hh680885(PandP.50).aspx
  [Defining Scale Groups]: http://msdn.microsoft.com/library/hh680902(PandP.50).aspx
  [Using the WASABiCmdlets for manipulating the block via Windows PowerShell]: http://msdn.microsoft.com/library/hh680938(PandP.50).aspx
  [Developer's Guide to the Enterprise Library 5.0 Integration Pack for Azure]: http://msdn.microsoft.com/library/hh680949(PandP.50).aspx
  [How Sage Reduces Azure Hosting Costs Using Autoscaling]: http://msdn.microsoft.com/library/jj838716(PandP.50).aspx
  [Reducing TechNet and MSDN hosting costs and environmental impact with autoscaling on Azure]: http://msdn.microsoft.com/library/jj838718(PandP.50).aspx
