<properties 
   pageTitle="Troubleshooting Roles That Fail to Start"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="kevingw"
   manager="jroley"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="10/14/2015"
   ms.author="kwill" />

# How to Troubleshoot Roles that Fail to Start

Here are some common problems and solutions related to Azure cloud service roles that fail to start.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Missing DLLs or dependencies
Unresponsive roles and roles that are cycling between **initializing**, **busy**, and **stopping** states can be caused by missing DLLs or assemblies.

**Symptom:**  Symptoms of missing DLLs or assemblies can be:

- Your role instance is cycling between **initializing** / **busy** / **stopping**
- Your role instance has moved to **ready** but navigating to your web application the page does not come up

Resolution:  There are three recommended methods for investigating these issues.

## Diagnosing missing DLL issues in a web role

When you navigate to a web site that is deployed in a web role and the browser displays a server error similar to the one below:

![Server Error in '/' Application.](./media/cloud-services-troubleshoot-roles-that-fail-start/IC503388.png)

## Diagnose issues by turning off custom errors

More complete errors can be viewed by configuring the web.config for the web role to set the custom error mode to off and redeploying the service.

To view more complete errors without using Remote Desktop:

1. Open the solution in Visual Studio.

2. In the **Solution Explorer**, locate the web.config file and open it.

3. In the web.config file, locate the system.web section and add the following line:  
   ```xml
   <customErrors mode="Off" />
   ```

4. Save the file.

5. Repackage and redeploy the service.

Once the service is redeployed you will see the error below with the name of the missing assembly or DLL.

## Diagnose issues by viewing the error remotely

You can use remote desktop to access the role and view more complete errors remotely. Use the following steps to view the errors using Remote Desktop:

1. Ensure that Azure SDK 1.3 or higher is installed.

2. During the deployment of the solution using Visual Studio, choose to “Configure Remote Desktop connections…” For more information on configuring the Remote Desktop connection, see [Using Remote Desktop with Azure Roles](https://msdn.microsoft.com/library/gg443832.aspx).

3. In the Microsoft Azure Management Portal, once the instance shows a status of **Ready**, click on one of the role instances.

4. Click the **Connect** icon in the **Remote Access** area of the ribbon

5. Log into the virtual machine using the credentials specified during the Remote Desktop configuration.

6. Open a command prompt.

7. Type `IPconfig`.

8. Note the IPV4 Address value.

9. Open Internet Explorer.

10. Type the address and the name of the web application. For example, `http://<IPV4 Address>/default.aspx`.

Navigating to the web site will return more explicit error messages.

* Server Error in '/' Application

* Description: An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.

* Exception Details: System.IO.FIleNotFoundException: Could not load file or assembly ‘Microsoft.WindowsAzure.StorageClient, Version=1.1.0.0, Culture=neutral, PublicKeyToken=31bf856ad364e35’ or one of its dependencies. The system cannot find the file specified.

For example:

![Explicit Server Error in '/' Application](./media/cloud-services-troubleshoot-roles-that-fail-start/IC503389.png)

## Diagnose issues using the Compute Emulator

You can use the Azure Microsoft Azure compute emulator to diagnose and troubleshoot issues of missing dependencies and web.config errors.

For best results in using this method of diagnosis, you should use a computer or virtual machine that has a clean installation of Windows. To best simulate the Azure environment you should use Windows Server 2008 R2 x64.

1. Install the standalone version of the [Azure SDK](https://azure.microsoft.com/downloads)

2. On the development machine build the cloud service project.

3. In Windows Explorer, navigate to the bin\debug folder of the Cloud Service project.

4. Copy the .csx folder and .cscfg file to the computer you are using to debug the issues.

5. On the clean machine open a Azure SDK Command Prompt and type `csrun.exe /devstore:start`.

6. In the Command Prompt type `run csrun <path to .csx folder> <path to .cscfg file> /launchBrowser`.

7. When the role starts you will see detailed error information in Internet Explorer.  You can also use standard Windows troubleshooting tools to further diagnose the problem.

## Diagnose issues using IntelliTrace

For worker and web roles that use .NET Framework 4, you can use [IntelliTrace](https://msdn.microsoft.com/library/dd264915.aspx) which is available in [Microsoft Visual Studio Ultimate](https://www.visualstudio.com/products/visual-studio-ultimate-with-MSDN-vs).

Follow these steps to deploy the service with IntelliTrace enabled:

1. Confirm that Azure SDK 1.3 or higher is installed.

2. Deploy the solution using Visual Studio. During deployment, check the **Enable IntelliTrace for .NET 4 roles** checkbox.

3. Once the instance starts, open the **Server Explorer**.

4. Expand the **Azure\\Cloud Services** node and locate the deployment.

5. Expand the deployment until you see the role instances.   
	Right click on one of the instances.

6. Choose **View IntelliTrace logs**. The **IntelliTrace Summary** will open.

7. Locate the exceptions section of the summary. If there are exceptions it will be labeled **Exception Data**.

8. Expand the **Exception Data** and look for **System.IO.FileNotFoundException** errors similar to the following:

![Exception data, missing file or assembly](./media/cloud-services-troubleshoot-roles-that-fail-start/IC503390.png)

## Addressing missing DLLs and assemblies

To address missing DLL and assembly errors, follow these steps:

1. Open the solution in Visual Studio.

2. In the **Solution Explorer**, open the **References** folder.

3. Click on the assembly identified in the error.

4. In the **Properties** pane and Locate the Copy Local property and set the value to **True**.

5. Redeploy the hosted service.

Once it has been verified that all errors have been corrected, the service can be deployed without the **Enable IntelliTrace for .NET 4 roles** setting checked.

## Next steps

View more [troubleshooting articles](/documentation/articles/?tag=top-support-issue&service=cloud-services) for cloud services.

