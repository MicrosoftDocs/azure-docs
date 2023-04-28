---
title: Trace the flow in Cloud Services (classic) Application with Azure Diagnostics
description: Add tracing messages to an Azure application to help debugging, measuring performance, monitoring, traffic analysis, and more.
ms.topic: article
ms.service: cloud-services
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Trace the flow of a Cloud Services (classic) application with Azure Diagnostics

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

Tracing is a way for you to monitor the execution of your application while it is running. You can use the [System.Diagnostics.Trace](/dotnet/api/system.diagnostics.trace), [System.Diagnostics.Debug](/dotnet/api/system.diagnostics.debug), and [System.Diagnostics.TraceSource](/dotnet/api/system.diagnostics.tracesource) classes to record information about errors and application execution in logs, text files, or other devices for later analysis. For more information about tracing, see [Tracing and Instrumenting Applications](/dotnet/framework/debug-trace-profile/tracing-and-instrumenting-applications).

## Use trace statements and trace switches
Implement tracing in your Cloud Services application by adding the [DiagnosticMonitorTraceListener](/previous-versions/azure/reference/ee758610(v=azure.100)) to the application configuration and making calls to System.Diagnostics.Trace or System.Diagnostics.Debug in your application code. Use the configuration file *app.config* for worker roles and the *web.config* for web roles. When you create a new hosted service using a Visual Studio template, Azure Diagnostics is automatically added to the project and the DiagnosticMonitorTraceListener is added to the appropriate configuration file for the roles that you add.

For information on placing trace statements, see [How to: Add Trace Statements to Application Code](/dotnet/framework/debug-trace-profile/how-to-add-trace-statements-to-application-code).

By placing [Trace Switches](/dotnet/framework/debug-trace-profile/trace-switches) in your code, you can control whether tracing occurs and how extensive it is. This lets you monitor the status of your application in a production environment. This is especially important in a business application that uses multiple components running on multiple computers. For more information, see [How to: Configure Trace Switches](/dotnet/framework/debug-trace-profile/how-to-create-initialize-and-configure-trace-switches).

## Configure the trace listener in an Azure application
Trace, Debug and TraceSource, require you set up "listeners" to collect and record the messages that are sent. Listeners collect, store, and route tracing messages. They direct the tracing output to an appropriate target, such as a log, window, or text file. Azure Diagnostics uses the [DiagnosticMonitorTraceListener](/previous-versions/azure/reference/ee758610(v=azure.100)) class.

Before you complete the following procedure, you must initialize the Azure diagnostic monitor. To do this, see [Enabling Diagnostics in Microsoft Azure](cloud-services-dotnet-diagnostics.md).

Note that if you use the templates that are provided by Visual Studio, the configuration of the listener is added automatically for you.

### Add a trace listener

1. Open the web.config or app.config file for your role.

2. Add the following code to the file. Change the Version attribute to use the version number of the assembly you are referencing. The assembly version does not necessarily change with each Azure SDK release unless there are updates to it.

   ```xml
   <system.diagnostics>
       <trace>
           <listeners>
               <add type="Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener,
                 Microsoft.WindowsAzure.Diagnostics,
                 Version=2.8.0.0,
                 Culture=neutral,
                 PublicKeyToken=31bf3856ad364e35"
                 name="AzureDiagnostics">
                   <filter type="" />
               </add>
           </listeners>
       </trace>
   </system.diagnostics>
   ```

   > [!IMPORTANT]
   > Make sure you have a project reference to the Microsoft.WindowsAzure.Diagnostics assembly. Update the version number in the xml above to match the version of the referenced Microsoft.WindowsAzure.Diagnostics assembly.

3. Save the config file.

For more information about listeners, see [Trace Listeners](/dotnet/framework/debug-trace-profile/trace-listeners).

After you complete the steps to add the listener, you can add trace statements to your code.

### To add trace statement to your code
1. Open a source file for your application. For example, the \<RoleName>.cs file for the worker role or web role.
2. Add the following using directive if it has not already been added:
    ```
        using System.Diagnostics;
    ```
3. Add Trace statements where you want to capture information about the state of your application. You can use a variety of methods to format the output of the Trace statement. For more information, see [How to: Add Trace Statements to Application Code](/dotnet/framework/debug-trace-profile/how-to-add-trace-statements-to-application-code).
4. Save the source file.




