<properties
	pageTitle="Troubleshooting Azure Diagnostics"
	description="Troubleshoot problems using Azure diagnostics "
	services="multiple"
	documentationCenter=".net"
	authors="rboucher"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/26/2016"
	ms.author="robb"/>


# Azure Diagnostics Troubleshooting and FAQ


## Azure Diagnostics is not Starting
Diagnostics is comprised of two components: A guest agent plugin and the monitoring agent. Log files for the guest agent plugin are located in the file:

*%SystemDrive%\ WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.PaaSDiagnostics\<DiagnosticsVersion>*\CommandExecution.log

The following error codes are returned by the plugin:

Exit Code|Description
---|---
0|Success.
-1|Generic Error.
-2|Unable to load the rcf file.<p>This is an internal error that should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM.
-3|Cannot load the Diagnostics configuration file.<p><p>Solution: This is the result of a configuration file not passing schema validation. The solution is to provide a configuration file that complies with the schema.
-4|Another instance of the monitoring agent Diagnostics is already using the local resource directory.<p><p>Solution: Specify a different value for **LocalResourceDirectory**.
-6|The guest agent plugin launcher attempted to launch Diagnostics with an invalid command line.<p><p>This is an internal error that should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM.
-10|The Diagnostics plugin exited with an unhandled exception.
-11|The guest agent was unable to create the process responsible for launching and monitoring the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available to launch new processes.<p>
-101|Invalid arguments when calling the Diagnostics plugin.<p><p>This is an internal error that should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM.
-102|The plugin process is unable to initialize itself.<p><p>Solution: Verify that sufficient system resources are available to launch new processes.
-103|The plugin process is unable to initialize itself. Specifically it is unable to create the logger object.<p><p>Solution: Verify that sufficient system resources are available to launch new processes.
-104|Unable to load the rcf file provided by the guest agent.<p><p>This is an internal error that should only happen if the guest agent plugin launcher is manually invoked, incorrectly, on the VM.
-105|The Diagnostics plugin cannot open the Diagnostics configuration file.<p><p>This is an internal error that should only happen if the Diagnostics plugin is manually invoked, incorrectly, on the VM.
-106|Cannot read the Diagnostics configuration file.<p><p>Solution: This is the result of a configuration file not passing schema validation. So the solution is to provide a configuration file that complies with the schema. You can find the XML that is delivered to the Diagnostics extension in the folder *%SystemDrive%\WindowsAzure\Config* on the VM. Open the appropriate XML file and search for **Microsoft.Azure.Diagnostics**, then for the **xmlCfg** field. The data is base64 encoded so you’ll need to [decode it](http://www.bing.com/search?q=base64+decoder) to see the XML that was loaded by Diagnostics.<p>
-107|The resource directory pass to the monitoring agent is invalid.<p><p>This is an internal error that should only happen if the monitoring agent is manually invoked, incorrectly, on the VM.</p>
-108	|Unable to convert the Diagnostics configuration file into the monitoring agent configuration file.<p><p>This is an internal error that should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file.
-110|General Diagnostics configuration error.<p><p>This is an internal error that should only happen if the Diagnostics plugin is manually invoked with an invalid configuration file.
-111|Unable to start the monitoring agent.<p><p>Solution: Verify that sufficient system resources are available.
-112|General error


### Diagnostics Data is Not Logged to Storage
The most common cause of missing event data is incorrectly defined storage account information.

Solution: Correct your Diagnostics configuration file and re-install Diagnostics.
Before event data is uploaded to your storage account it is stored in the folder. See above for details on **LocalResourceDirectory**.

If there are no files in this folder the monitoring agent is unable to launch. This is typically caused by an invalid configuration file and should have been reported in the CommandExecution.log. If the Monitoring Agent is successfully collecting event data you will see .tsf files for each event defined in your configuration file.

The Monitoring Agent logs any errors it experiences in the file MaEventTable.tsf. To inspect the contents of this file run the following command:

		%SystemDrive%\Packages\Plugins\Microsoft.Azure.Diagnostics.[IaaS | PaaS]Diagnostics\1.3.0.0\Monitor\x64\table2csv maeventtable.tsf

The tool generates a file named maeventtable.csv that you may open and inspect the logs for failures.


## Frequently Asked Questions
The following are some frequently asked questions and their answers:

**Q.** How are tables named?

**A.** Tables are named according to the following:

		if (String.IsNullOrEmpty(eventDestination)) {
		    if (e == "DefaultEvents")
		        tableName = "WADDefault" + MD5(provider);
		    else
		        tableName = "WADEvent" + MD5(provider) + eventId;
		}
		else
		    tableName = "WAD" + eventDestination;

Here is an example:

		<EtwEventSourceProviderConfiguration provider=”prov1”>
		  <Event id=”1” />
		  <Event id=”2” eventDestination=”dest1” />
		  <DefaultEvents />
		</EtwEventSourceProviderConfiguration>
		<EtwEventSourceProviderConfiguration provider=”prov2”>
		  <DefaultEvents eventDestination=”dest2” />
		</EtwEventSourceProviderConfiguration>

That will generate 4 tables:

Event|Table Name
---|---
provider=”prov1” &lt;Event id=”1” /&gt;|WADEvent+MD5(“prov1”)+”1”
provider=”prov1” &lt;Event id=”2” eventDestination=”dest1” /&gt;|WADdest1
provider=”prov1” &lt;DefaultEvents /&gt;|WADDefault+MD5(“prov1”)
provider=”prov2” &lt;DefaultEvents eventDestination=”dest2” /&gt;|WADdest2
