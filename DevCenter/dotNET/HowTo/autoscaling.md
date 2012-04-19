<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-how-to-autoscaling" urlDisplayName="Autoscaling" headerExpose="" pageTitle="Autoscaling - How To - .NET - Develop" metaKeywords="" footerExpose="" metaDescription="" umbracoNaviHide="0" disqusComments="1" />
  <h1>How to Use the Autoscaling Application Block</h1>
  <p>This guide will demonstrate how to perform common scenarios using the Autoscaling Application Block from the <a href="http://go.microsoft.com/fwlink/?LinkID=235134">Microsoft Enterprise Library 5.0 Integration Pack for Windows Azure</a>. The samples are written in C# and use the .NET API. The scenarios covered include <strong>hosting the block</strong>, <strong>using constraint rules</strong>, and <strong>using reactive rules</strong>. For more information on the Autoscaling Application Block, see the <a href="#NextSteps">Next Steps</a> section.</p>
  <h2>Table of Contents</h2>
  <p>
    <a href="#WhatIs">What is the Autoscaling Application Block?</a>
    <br />
    <a href="#Concepts">Concepts</a>
    <br />
    <a href="#PerfCounter">Collect Performance Counter Data from your Target Windows Azure Application</a>
    <br />
    <a href="#CreateHost">Set up a Host Application for the Autoscaling Application Block</a>
    <br />
    <a href="#Instantiate">How to: Instantiate and Run the Autoscaler</a>
    <a href="#DefineServiceModel">How To: Define your Service Model</a>
    <br />
    <a href="#DefineAutoscalingRules">How To: Define your Autoscaling Rules</a>
    <br />
    <a href="#Configure">How To: Configure the Autoscaling Application Block</a>
    <br />
    <a href="#NextSteps">Next Steps</a>
  </p>
  <h2>
    <a id="WhatIs">
    </a>What is the Autoscaling Application Block?</h2>
  <p>The Autoscaling Application Block can automatically scale your Windows Azure application based on rules that you define specifically for your application. You can use these rules to help your Windows Azure application maintain its throughput in response to changes in its workload, while at the same time control the costs associated with hosting your application in Windows Azure. Along with scaling by increasing or decreasing the number of role instances in your application, the block also enables you to use other scaling actions such as throttling certain functionality within your application or using custom-defined actions.</p>
  <p>You can choose to host the block in a Windows Azure role or in an on-premises application.</p>
  <p>The Autoscaling Application Block is part of the <a href="http://go.microsoft.com/fwlink/?LinkID=235134">Microsoft Enterprise Library 5.0 Integration Pack for Windows Azure</a>.</p>
  <h2>
    <a id="Concepts">
    </a>Concepts</h2>
  <p>In the following diagram, the green line shows a plot of the number of running instances of a Windows Azure role over two days. The number of instances changes automatically over time in response to a set of autoscaling rules.</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/auotscaling01.png" alt="diagram of sample autoscaling" />
  </p>
  <p>The block uses two types of rules to define the autoscaling behavior for your application:</p>
  <ul>
    <li>
      <p>
        <strong>Constraint Rules:</strong> To set upper and lower bounds on the number of instances, for example, let's say that between 8:00 and 10:00 every morning you want a minimum of four and a maximum of six instances, then you use a <strong>constraint rule</strong>. In the diagram, the red and blue lines represent constraints rules. For example, at point <strong>A</strong> in the diagram, the minimum number of role instances rises from two to four, in order to accommodate the anticipated increase in the application's workload at this time. At point <strong>B</strong> in the diagram, the number of role instances is prevented from climbing above five in order to control the running costs of the application.</p>
    </li>
    <li>
      <p>
        <strong>Reactive Rules:</strong> To enable the number of role instances to change in response to unpredictable changes in demand, you use <strong>reactive rules</strong>. At point <strong>C</strong> in the diagram, the block automatically reduces the number of role instances, from four to three, in response to a reduction in workload. At point <strong>D</strong>, the block detects an increase in workload and automatically increases the number of running role instances from three to four.</p>
    </li>
  </ul>
  <p>The block stores its configuration settings in two stores:</p>
  <ul>
    <li>
      <p>
        <strong>Rules Store:</strong> The Rules Store holds your business configuration; a list of all the autoscaling rules that you have defined for your Windows Azure application. This store is typically an XML file that is located where the Autoscaling Application Block can read it, for example in Windows Azure blob storage or in a local file.</p>
    </li>
    <li>
      <p>
        <strong>Service Information Store:</strong> The Service Information Store stores your operational configuration, which is the service model of your Windows Azure application. This service model includes all of the information about your Windows Azure application (such as role names and storage account details) that the block needs to be able to collect data points from the target Windows Azure application and to perform scaling operations.</p>
    </li>
  </ul>
  <h2>
    <a id="PerfCounter">
    </a>Collect Performance Counter Data from your Target Windows Azure Application</h2>
  <p>Reactive rules can use performance counter data from roles as part of the rule definition. For example, a reactive rule may monitor the CPU utilization of a Windows Azure role to determine whether the block should initiate a scaling operation. The block reads performance counter data from the Windows Azure Diagnostics table named <strong>WADPerformanceCountersTable</strong> in Windows Azure storage.</p>
  <p>By default, Windows Azure does not write performance counter data to the Windows Azure Diagnostics table in Windows Azure storage. Therefore, you should modify the roles from which you need to collect performance counter data to save this data. For details about how to enable performance counters in your application, see <a href="http://www.windowsazure.com/en-us/develop/net/common-tasks/performance-profiling/">Using Performance Counters in Windows Azure</a>.</p>
  <h2>
    <a id="CreateHost">
    </a>Set up a Host Application for the Autoscaling Application Block</h2>
  <p>You can host the Autoscaling Application Block either in a Windows Azure role or in an on-premises application. The Autoscaling Application Block is typically hosted in a separate application from the target application that you want to scale automatically. This section provides guidelines about how to configure your host application.</p>
  <h3>Get the Autoscaling Application Block NuGet Package</h3>
  <p>Before you can use the Autoscaling Application Block in your Visual Studio project, you will need to obtain the Autoscaling Application Block binaries and add references to them in your project. The NuGet Visual Studio extension makes it easy to install and update libraries and tools in Visual Studio and Visual Web Developer. The Autoscaling Application Block NuGet package is the easiest way to get the Autscaling Application Block APIs For more information about <strong>NuGet</strong>, and how to install and use the <strong>NuGet</strong> Visual Studio extension, see the <a href="http://nuget.org/">NuGet</a> website.</p>
  <p>Once you have the NuGet Package Manager installed, to install the NuGet package in your application, do the following:</p>
  <ol>
    <li>
      <p>Open the <strong>NuGet Package Manager Console</strong> window. In the <strong>Tools</strong> menu, select <strong>Library Package Manager</strong>, the select <strong>Package Manager Console</strong>.</p>
    </li>
    <li>
      <p>Enter the following command in the NuGet Package Manager Console window:</p>
      <pre class="prettyprint">PM&gt; Install-Package EnterpriseLibrary.WindowsAzure.Autoscaling</pre>
    </li>
  </ol>
  <p>Installing the NuGet package updates your project with all the necessary assemblies and references that you need to use the Autoscaling Application Block. Your project now includes the XML schema files for the autoscaling rule definitions and autoscaling service information. The project now also includes a readme file that contains important information about the Autoscaling Application Block:</p>
  <p>
    <img src="../../../DevCenter/dotNet/media/auotscaling02.png" alt="files configured by autoscaling NuGet package" />
  </p>
  <h3>Set the Target Framework to .NET Framework 4</h3>
  <p>Your project must target the .NET Framework 4. To change or verify the target framework:</p>
  <ol>
    <li>
      <p>In Solution Explorer, right-click on the project name and select <strong>Properties</strong>.</p>
    </li>
    <li>
      <p>In the <strong>Application</strong> tab of the Properties window, make sure Target framework is set to <strong>.NET Framework 4</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/autoscaling03.png" alt="[image]" />
      </p>
    </li>
  </ol>
  <h3>Add Namespace References</h3>
  <p>Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access the Autoscaling Application Block:</p>
  <pre class="prettyprint">using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.WindowsAzure.Autoscaling;
</pre>
  <h2>
    <a id="Instantiate">
    </a>How to: Instantiate and Run the Autoscaler</h2>
  <p>Use the <strong>IServiceLocator.GetInstance</strong> method to instantiate the Autoscaler, and then call the <strong>Autoscaler.Start</strong> method to run the <strong>Autoscaler</strong>.</p>
  <pre class="prettyprint">Autoscaler scaler =
    EnterpriseLibraryContainer.Current.GetInstance&lt;Autoscaler&gt;();
scaler.Start();
</pre>
  <h2>
    <a id="DefineServiceModel">
    </a>How To: Define your Service Model</h2>
  <p>Typically, you store your service model (a description of your Windows Azure environment that includes information about subscriptions, hosted services, roles, and storages accounts) in an XML file. You can find a copy of the schema for this XML file in the <strong>AutoscalingServiceModel.xsd</strong> file in your project. In Visual Studio, this schema provides Intellisense and validation when you edit the service model XML file.</p>
  <p>Create a new XML file called <strong>services.xml</strong> in your project.</p>
  <p>In Visual Studio, you must ensure that the service model file is copied to the output folder. To do this:</p>
  <ol>
    <li>
      <p>Right-click on the file and select <strong>Properties</strong>.</p>
    </li>
    <li>
      <p>Within the Properties pane, set the <strong>Copy to Output Directory</strong> value to <strong>Copy always</strong>.</p>
      <p>
        <img src="../../../DevCenter/dotNet/media/autoscaling04.png" alt="Set Copy to Output Directory value" />
      </p>
    </li>
  </ol>
  <p>The following code sample shows an example service model in a <strong>services.xml</strong> file:</p>
  <pre class="prettyprint">&lt;?xml version="1.0" encoding="utf-8" ?&gt;
&lt;serviceModel xmlns="http://schemas.microsoft.com/practices/2011/entlib/autoscaling/serviceModel"&gt;
  &lt;subscriptions&gt;
    &lt;subscription name="[subscriptionname]"
                  certificateThumbprint="[managementcertificatethumbprint]"
                  subscriptionId="[subscriptionid]"
                  certificateStoreLocation="CurrentUser"
                  certificateStoreName="My"&gt;
      &lt;services&gt;
        &lt;service dnsPrefix="[hostedservicednsprefix]" slot="Staging"&gt;
          &lt;roles&gt;
            &lt;role alias="AutoscalingApplicationRole"
                  roleName="[targetrolename]"
                  wadStorageAccountName="targetstorage"/&gt;
          &lt;/roles&gt;
        &lt;/service&gt;
      &lt;/services&gt;
      &lt;storageAccounts&gt;
        &lt;storageAccount alias="targetstorage"
          connectionString="DefaultEndpointsProtocol=https;AccountName=[storageaccountname];AccountKey=[storageaccountkey]"&gt;
        &lt;/storageAccount&gt;
      &lt;/storageAccounts&gt;
    &lt;/subscription&gt;
  &lt;/subscriptions&gt;
&lt;/serviceModel&gt;
</pre>
  <p>You must replace the values in square brackets with values specific to your environment and target application. To find many of these values, you will need to log in to the <a href="http://windows.azure.com">Windows Azure Management Portal</a>.</p>
  <p>Within the management portal, click <strong>Hosted Services, Storage Accounts &amp; CDN</strong>.</p>
  <ul>
    <li>
      <p>
        <strong>[subscriptionname] and [subscriptionid]:</strong> The name and ID of the Windows Azure subscription that contains the application in which you want to use auto-scaling.</p>
      <ol>
        <li>
          <p>In the <strong>Hosted Services, Storage Accounts &amp; CDN</strong> pane, click <strong>Hosted Services</strong>.</p>
        </li>
        <li>
          <p>Click on the subscription in the center results pane. The Properties pane on the right will display the <strong>Name</strong> and <strong>Subscription ID</strong>.</p>
          <p>
            <img src="../../../DevCenter/dotNet/media/autoscaling05.png" alt="[image]" />
          </p>
        </li>
      </ol>
    </li>
    <li>
      <p>
        <strong>[hostedservicednsprefix]:</strong> The DNS Prefix of the hosted service in which you want to use auto-scaling.</p>
      <ol>
        <li>
          <p>In the <strong>Hosted Services, Storage Accounts &amp; CDN</strong> pane, click <strong>Hosted Services</strong>.</p>
        </li>
        <li>
          <p>Click on the hosted service in the center results pane. The Properties pane on the right will display the <strong>DNS Prefix</strong>.</p>
          <p>
            <img src="../../../DevCenter/dotNet/media/autoscaling06.png" alt="[image]" />
          </p>
        </li>
      </ol>
    </li>
    <li>
      <p>
        <strong>[targetrolename]:</strong> The name of the role that is the target of your auto-scaling rules.</p>
      <ol>
        <li>
          <p>In the <strong>Hosted Services, Storage Accounts &amp; CDN</strong> pane, click <strong>Hosted Services</strong>.</p>
        </li>
        <li>
          <p>Click on the role in the center results pane. The Properties pane on the right will display the <strong>Name</strong>.</p>
          <p>
            <img src="../../../DevCenter/dotNet/media/autoscaling07.png" alt="[image]" />
          </p>
        </li>
      </ol>
    </li>
  </ul>
  <ul>
    <li>
      <p>
        <strong>[storageaccountname]</strong> and <strong>[storageaccountkey]:</strong> The name of the Windows Azure storage account that you are using for your target Windows Azure application.</p>
      <ol>
        <li>
          <p>In the <strong>Hosted Services, Storage Accounts &amp; CDN</strong> pane, click <strong>Storage Account</strong>.</p>
        </li>
        <li>
          <p>Click on the storage account in the center results pane. The Properties pane on the right will display the <strong>Name</strong>.</p>
        </li>
        <li>
          <p>Click the <strong>View</strong> button next to the hidden <strong>Primary access key</strong> to get the primary account key.</p>
          <p>
            <img src="../../../DevCenter/dotNet/media/autoscaling08.png" alt="[image]" />
          </p>
        </li>
      </ol>
    </li>
    <li>
      <p>
        <strong>[managementcertificatethumbprint]:</strong> The <strong>Thumbprint</strong> of the Management Certificate that the block will use to secure scaling requests to the target application.</p>
      <ol>
        <li>
          <p>In the <strong>Hosted Services, Storage Accounts &amp; CDN</strong> pane, click <strong>Management Certificates</strong>.</p>
        </li>
        <li>
          <p>Click on the certificate in the center results pane. The Properties pane on the right will display the <strong>Thumbprint</strong>.</p>
          <p>
            <img src="../../../DevCenter/dotNet/media/autoscaling09.png" alt="[image]" />
          </p>
        </li>
      </ol>
    </li>
  </ul>
  <p>To find out more about the content of the service model file, see <a href="http://msdn.microsoft.com/en-us/library/hh680878(PandP.50).aspx">Storing Your Service Information Data</a>.</p>
  <h2>
    <a id="DefineAutoscalingRules">
    </a>How To: Define your Autoscaling Rules</h2>
  <p>Typically, you store the autoscaling rules that control the number of role instances in your target application in an XML file. You can find a copy of the schema for this XML file in the <strong>AutoscalingRules.xsd</strong> file in your project. In Visual Studio, this schema provides Intellisense and validation when you edit the XML file.</p>
  <p>Create a new XML file named <strong>rules.xml</strong> in your project.</p>
  <p>In Visual Studio, you must ensure that the rules file is copied to the output folder. To do this:</p>
  <ol>
    <li>
      <p>Right-click on the file and select <strong>Properties</strong>.</p>
    </li>
    <li>
      <p>Within the Properties pane, set the <strong>Copy to Output Directory</strong> value to <strong>Copy always</strong>.</p>
    </li>
  </ol>
  <p>The following code sample shows an example rule set in a <strong>rules.xml</strong> file:</p>
  <pre class="prettyprint">&lt;?xml version="1.0" encoding="utf-8" ?&gt;
&lt;rules xmlns="http://schemas.microsoft.com/practices/2011/entlib/autoscaling/rules"&gt;
  &lt;constraintRules&gt;
    &lt;rule name="default" enabled="true" rank="1" description="The default constraint rule"&gt;
      &lt;actions&gt;
        &lt;range min="2" max="6" target="AutoscalingApplicationRole"/&gt;
      &lt;/actions&gt;
    &lt;/rule&gt;
  &lt;/constraintRules&gt;
  &lt;reactiveRules&gt;
    &lt;rule name="ScaleUpOnHighUtilization" rank="10" description="Scale up the web role" enabled="true" &gt;
      &lt;when&gt;
        &lt;any&gt;
           &lt;greaterOrEqual operand="WebRoleA_CPU_Avg_5m" than="60"/&gt;
        &lt;/any&gt;
      &lt;/when&gt;
      &lt;actions&gt;
        &lt;scale target="AutoscalingApplicationRole" by="1"/&gt;
      &lt;/actions&gt;
    &lt;/rule&gt;
    &lt;rule name="ScaleDownOnLowUtilization" rank="10" description="Scale up the web role" enabled="true" &gt;
      &lt;when&gt;
        &lt;all&gt;
          &lt;less operand="WebRoleA_CPU_Avg_5m" than="60"/&gt;
        &lt;/all&gt;
      &lt;/when&gt;
      &lt;actions&gt;
        &lt;scale target="AutoscalingApplicationRole" by="-1"/&gt;
      &lt;/actions&gt;
    &lt;/rule&gt;
  &lt;/reactiveRules&gt;
  &lt;operands&gt;
    &lt;performanceCounter alias="WebRoleA_CPU_Avg_5m"
      performanceCounterName="\Processor(_Total)\% Processor Time"
      source ="AutoscalingApplicationRole"
      timespan="00:05:00" aggregate="Average"/&gt;
  &lt;/operands&gt;
&lt;/rules&gt;
</pre>
  <p>In this example there are three autoscaling rules (one <strong>constraint rule</strong> and two <strong>reactive rules</strong>) that operate on a target named <strong>AutoscalingApplicationRole</strong> that is the alias of a role defined in the <strong>service model</strong>:</p>
  <ul>
    <li>
      <p>The constraint rule is always active and sets the minimum number of role instances to two and the maximum number of role instances to six.</p>
    </li>
    <li>
      <p>Both reactive rules use an <strong>operand</strong> named <strong>WebRoleA_CPU_Avg_5m</strong> that calculates the average CPU usage over the last five minutes for a Windows Azure role named <strong>AutoscalingApplicationRole.</strong> This role is defined in the <strong>service model</strong>.</p>
    </li>
    <li>
      <p>The reactive rule named <strong>ScaleUpOnHighUtilization</strong> increments the instance count of the target role by one if the average CPU utilization over the last five minutes has been greater than or equal to 60%.</p>
    </li>
    <li>
      <p>The reactive rule named <strong>ScaleDownOnLowUtilization</strong> decrements the instance count of the target role by one if the average CPU utilization over the last five minutes has been less than 60%.</p>
    </li>
  </ul>
  <h2>
    <a id="Configure">
    </a>How To: Configure the Autoscaling Application Block</h2>
  <p>After you have defined your service model and autoscaling rules, you must configure the Autoscaling Application Block to use them. This operational configuration information is stored in the application configuration file.</p>
  <p>By default, the Autoscaling Application Block expects the autoscaling rules and service model to be stored in Windows Azure blobs. In this example, you will configure the block to load them from the local file system.</p>
  <h3>Configure the Autoscaling Application Block in the host application</h3>
  <ol>
    <li>
      <p>Right-click on the <strong>App.config</strong> file in Solution Explorer and then click <strong>Edit Configuration File</strong>.</p>
    </li>
    <li>
      <p>In the <strong>Blocks</strong> menu, click <strong>Add Autoscaling Settings</strong>:<br /><img src="../../../DevCenter/dotNet/media/auotscaling10.png" alt="[image]" /></p>
    </li>
    <li>
      <p>Expand the <strong>Autoscaling Settings</strong> and then click the ellipsis (…) next to the <strong>Data Points Store Storage Account</strong>, add the <strong>Account name</strong> and <strong>Account key</strong> of the Windows Azure storage account where the block will store the data points that it collects (see <a href="#DefineServiceModel">How To: Define your Service Model</a> if you are unsure about where to find these values), and then click <strong>OK</strong>:<br /><img src="../../../DevCenter/dotNet/media/autoscaling11.png" alt="[image]" /></p>
    </li>
    <li>
      <p>Expand the <strong>Autoscaling Settings</strong> section to reveal the <strong>Rules Store</strong> and <strong>Service Information Store</strong> sections. By default, they are configured to use Windows Azure blob storage:<br /><img src="../../../DevCenter/dotNet/media/autoscaling12.png" alt="[image]" /></p>
    </li>
    <li>
      <p>Click the plus sign (+) next to <strong>Rules Store</strong>, point to <strong>Set Rules Store</strong>, then click <strong>Use Local File Rules Store</strong>, and then click <strong>Yes</strong>.</p>
    </li>
    <li>
      <p>In the <strong>File Name</strong> box, type <strong>rules.xml</strong>. This is the name of the file that contains your autoscaling rules:<br /><img src="../../../DevCenter/dotNet/media/autoscaling13.png" alt="[image]" /></p>
    </li>
    <li>
      <p>Click the plus sign (+) next to <strong>Service Information Store</strong>, point to <strong>Set Service Information Store</strong>, then click <strong>Use Local File Service Information Store</strong>, and then click <strong>Yes</strong>.</p>
    </li>
    <li>
      <p>In the <strong>File Name</strong> box, type <strong>services.xml</strong>. This is the name of the file that contains your autoscaling rules:<br /><img src="../../../DevCenter/dotNet/media/autoscaling14.png" alt="[image]" /></p>
    </li>
    <li>
      <p>In the Enterprise Library Configuration window, on the <strong>File</strong> menu, click <strong>Save</strong> to save your configuration changes. Then in the Enterprise Library Configuration window, on the <strong>File</strong> menu, click <strong>Exit</strong>.</p>
    </li>
  </ol>
  <p>To get detailed information about the actions that the Autoscaling Application Block is performing you need to capture the log messages that it writes. For example, if you are hosting the block in a console application, you can view the log messages in the Output window in Visual Studio. The following section shows you how to configure this behavior.</p>
  <h3>Configure logging in the Autoscaling Application Block host application</h3>
  <ol>
    <li>
      <p>In Visual Studio, double-click on the <strong>App.config</strong> file in Solution Explorer to open it in the editor. Then add the <strong>system.diagnostics</strong> section as shown in the following sample:</p>
      <pre class="prettyprint">&lt;?xml version="1.0" encoding="utf-8" ?&gt;
&lt;configuration&gt;
  …
  &lt;system.diagnostics&gt;
    &lt;sources&gt;
      &lt;sourcename="Autoscaling General" switchName="SourceSwitch" switchType="System.Diagnostics.SourceSwitch" /&gt;
      &lt;sourcename="Autoscaling Updates" switchName="SourceSwitch" switchType="System.Diagnostics.SourceSwitch" /&gt;
    &lt;/sources&gt;
    &lt;switches&gt;
      &lt;addname="SourceSwitch" value="Verbose, Information, Warning, Error, Critical" /&gt;
    &lt;/switches&gt;
  &lt;/system.diagnostics&gt;
&lt;/configuration&gt;
</pre>
    </li>
    <li>
      <p>Save your changes.</p>
    </li>
  </ol>
  <p>You can now run your Autoscaling Application Block host console application and observe how the autoscaling rules work with your target Windows Azure application. When you run the host console application, you should see messages similar to the following in the Output window in Visual Studio. These log messages help you to understand the behavior of the block. For example, they indicate which rules are being matched by the block and what actions the block is taking.</p>
  <pre class="prettyprint">Autoscaling General Verbose: 1002 : Rule match.
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
</pre>
  <h2>
    <a id="NextSteps">
    </a>Next Steps</h2>
  <p>Now that you've learned the basics of using the Autoscaling Application Block, follow these links to learn how to implement more complex autoscaling scenarios:</p>
  <ul>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680914(PandP.50).aspx">Hosting the Autoscaling Application Block in a Worker Role</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680896(PandP.50).aspx">Implementing Throttling Behavior</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680923(PandP.50).aspx">Understanding Rule Ranks and Reconciliation</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680889(PandP.50).aspx">Extending and Modifying the Autoscaling Application Block</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680951(PandP.50).aspx">Using the Optimizing Stabilizer to prevent high frequency oscillation and to optimize costs</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680885(PandP.50).aspx">Using Notifications and Manual Scaling</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680902(PandP.50).aspx">Defining Scale Groups</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680938(PandP.50).aspx">Using the WASABiCmdlets for manipulating the block via Windows PowerShell</a>
    </li>
    <li>
      <a href="http://msdn.microsoft.com/en-us/library/hh680949(PandP.50).aspx">Developer's Guide to the Enterprise Library 5.0 Integration Pack for Windows Azure</a>
    </li>
  </ul>
</body>