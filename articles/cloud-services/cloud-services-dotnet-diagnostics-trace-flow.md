<properties
	pageTitle="Trace the flow in a Cloud Services Application with Azure Diagnostics"
	description="Add tracing messages to an Azure application to help debugging, measuring performance, monitoring, traffic analysis, and more."
	services="cloud-services"
	documentationCenter=".net"
	authors="rboucher"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="09/25/2015"
	ms.author="robb"/>



# Trace the flow of a Cloud Services application with Azure Diagnostics

Tracing is a way for you to monitor the execution of your application while it is running. You can use the [System.Diagnostics.Trace](https://msdn.microsoft.com/library/system.diagnostics.trace.aspx), [System.Diagnostics.Debug](https://msdn.microsoft.com/library/system.diagnostics.debug.aspx), and [System.Diagnostics.TraceSource](https://msdn.microsoft.com/library/system.diagnostics.tracesource.aspx) classes to record information about errors and application execution in logs, text files, or other devices for later analysis. For more information about tracing, see [Tracing and Instrumenting Applications](https://msdn.microsoft.com/library/zs6s4h68.aspx).


## Use Trace Statements and Trace Switches

Implement tracing in your Cloud Services application by adding the [DiagnosticMonitorTraceListener](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx) to the application configuration and making calls to System.Diagnostics.Trace or System.Diagnostics.Debug in your application code. Use the configuration file *app.config* for worker roles and the *web.config* for web roles. When you create a new hosted service using a Visual Studio template, Azure Diagnostics is automatically added to the project and the DiagnosticMonitorTraceListener is added to the appropriate configuration file for the roles that you add.

For information on placing trace statements, see [How to: Add Trace Statements to Application Code](https://msdn.microsoft.com/library/zd83saa2.aspx).

By placing [Trace Switches](https://msdn.microsoft.com/library/3at424ac.aspx) in your code, you can control whether tracing occurs and how extensive it is. This lets you monitor the status of your application in a production environment. This is especially important in a business application that uses multiple components running on multiple computers. For more information, see [How to: Configure Trace Switches](https://msdn.microsoft.com/library/t06xyy08.aspx).

## Configure the TraceListener in an Azure application

Trace, Debug and TraceSource, require you set up "listeners" to collect and record the messages that are sent. Listeners collect, store, and route tracing messages. They direct the tracing output to an appropriate target, such as a log, window, or text file. Azure Diagnostics uses the [DiagnosticMonitorTraceListener](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx) class.

Before you complete the following procedure, you must initialize the Azure diagnostic monitor. To do this, see [Enabling Diagnostics in Microsoft Azure](cloud-services-dotnet-diagnostics.md). Note that if you use the templates that are provided by Visual Studio, the configuration of the listener is added automatically for you.


### Add a Trace Listener

1. Open the web.config or app.config file for your role.
2. Add the following code to the file:

	```
	<system.diagnostics>
		<trace>
			<listeners>
				<add type="Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener,
		          Microsoft.WindowsAzure.Diagnostics,
		          Version=1.0.0.0,
		          Culture=neutral,
		          PublicKeyToken=31bf3856ad364e35"
		          name="AzureDiagnostics">
			  	  <filter type="" />
				</add>
			</listeners>
		</trace>
	</system.diagnostics>
	```
3. Save the config file.

For more information about listeners, see [Trace Listeners](https://msdn.microsoft.com/library/4y5y10s7.aspx).

After you complete the steps to add the listener, you can add trace statements to your code.


### To add trace statement to your code

1. Open a source file for your application. For example, the <RoleName>.cs file for the worker role or web role.
2. Add the following using statement if it has not already been added:
	```
	    using System.Diagnostics;
	```
3. Add Trace statements where you want to capture information about the state of your application. You can use a variety of methods to format the output of the Trace statement. For more information, see [How to: Add Trace Statements to Application Code](https://msdn.microsoft.com/library/zd83saa2.aspx).
4. Save the source file.
