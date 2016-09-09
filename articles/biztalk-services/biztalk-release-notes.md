<properties
	pageTitle="Release Notes for Azure BizTalk Services | Microsoft Azure BizTalk Services"
	description="Lists the known issues for Azure BizTalk Services" 
	services="biztalk-services"
	documentationCenter=""
	authors="msftman"
	manager="erikre"
	editor=""/>

<tags
	ms.service="biztalk-services"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/29/2016"
	ms.author="deonhe"/>

# Release Notes for Azure BizTalk Services

The release notes for the Microsoft Azure BizTalk Services contain the known issues in this release.

## What’s new in the November update of BizTalk Services
* Encryption at Rest can be enabled in the BizTalk Services Portal. See [Enable Encryption at Rest in BizTalk Services Portal](https://msdn.microsoft.com/library/azure/dn874052.aspx).

## Update History

### October Update

* Organizational accounts are supported:  
 * **Scenario**: You registered a BizTalk Service deployment using a Microsoft account (like user@live.com). In this scenario, only Microsoft Account users can manage the BizTalk Service using the BizTalk Services portal. An organizational account cannot be used.  
 * **Scenario**: You registered a BizTalk Service deployment using an organizational account in an Azure Active Directory (like user@fabrikam.com or user@contoso.com). In this scenario, only Azure Active Directory users within the same organization can manage the BizTalk Service using the BizTalk Services portal. A Microsoft account cannot be used.  
* When you create a BizTalk Service in the Azure classic portal, you are automatically registered in the BizTalk Services Portal.
 * **Scenario**: You sign into the Azure classic portal, create a BizTalk Service, and then select **Manage** for the very first time. When the BizTalk Services portal opens, the BizTalk Service automatically registers and is ready for your deployments.  
 See [Registering and Updating a BizTalk Service Deployment on the BizTalk Services Portal](https://msdn.microsoft.com/library/azure/hh689837.aspx).  

### August 14 Update
* Agreement and bridge decoupling – Trading partner agreements and bridges are now decoupled in the BizTalk Services Portal. You now create agreements and bridges separately, and at runtime bridges resolve to an agreement based on the values in the EDI message. See [Create Agreements in Azure BizTalk Services](https://msdn.microsoft.com/library/azure/hh689908.aspx), [Create an EDI bridge using BizTalk Services Portal](https://msdn.microsoft.com/library/azure/dn793986.aspx), [Create an AS2 bridge using BizTalk Services Portal](https://msdn.microsoft.com/library/azure/dn793993.aspx), and [How do bridges resolve agreements at runtime?](https://msdn.microsoft.com/library/azure/dn794001.aspx)  
* The option to create templates for agreements is discontinued.  
* For the send-side agreement, you can now specify different delimiter sets for each schema. This configuration is specified under protocol settings for send side agreement. For more information, see [Create an X12 Agreement in Azure BizTalk Services](https://msdn.microsoft.com/library/azure/hh689847.aspx) and [Create an EDIFACT Agreement in Azure BizTalk Services](https://msdn.microsoft.com/library/azure/dn606267.aspx). Two new entities are also added to the TPM OM API for the same purpose. See [X12DelimiterOverrides](https://msdn.microsoft.com/library/azure/dn798749.aspx) and [EDIFACTDelimiterOverride](https://msdn.microsoft.com/library/azure/dn798748.aspx).  
* Standard XSD constructs, including Derived Types, are now supported. See [Use standard XSD constructs in your maps](https://msdn.microsoft.com/library/azure/dn793987.aspx) and [Use Derived Types in Mapping Scenarios and Examples](https://msdn.microsoft.com/library/azure/dn793997.aspx).  
* AS2 supports new MIC algorithms for message signing and new encryption algorithms. See [Create an AS2 Agreement in Azure BizTalk Services](https://msdn.microsoft.com/library/azure/hh689890.aspx).  
## Know Issues

### Connectivity Issues after BizTalk Services Portal Update

  If you have the BizTalk Services Portal open while BizTalk Services is upgraded to roll in changes to the service, you might face connectivity issues with the BizTalk Services Portal.  
  As a workaround, you may restart the browser, delete the browser cache, or start the portal in private mode.  

### Visual Studio IDE cannot locate the artifact if you click an error or warning in a BizTalk Services project
Install the Visual Studio 2012 Update 3 RC 1 to fix the issue.  

### Custom binding project reference
Consider the following situations with a BizTalk Services project in a Visual Studio solution:  
* In the same Visual Studio solution, there is a BizTalk Services project and a custom binding project. The BizTalk Service project has a reference to this custom binding project file.
* The BizTalk Service project has a reference to a custom binding/behavior DLL.

You ‘Build’ the solution in Visual Studio successfully. Then, you ‘Rebuild’ or ‘Clean’ the solution. After that, when you rebuild or clean again, the following error occurs:  
  Unable to copy file <Path to DLL> to “bin\Debug\FileName.dll”. The process cannot access the file ‘bin\Debug\FileName.dll’ because it is being used by another process.  

#### Workaround
* If [Visual Studio 2012 Update 3](https://www.microsoft.com/download/details.aspx?id=39305) is installed, you have the following two options:

  * Restart Visual Studio, or

  * Restart the solution. Then, perform only a Build on the solution.  

* If [Visual Studio 2012 Update 3](https://www.microsoft.com/download/details.aspx?id=39305) is not installed, open Task Manager, click the Processes tab, click the MSBuild.exe process, and then click the End Process button.  

### Routing to BasicHttpRelay endpoints is not supported from bridges and BizTalk Services Portal if non-printable characters are promoted as HTTP headers

If you use non-printable characters as part of promoted properties for messages, those messages cannot be routed to relay destinations that use the BasicHttpRelay binding. Also, the promoted properties that are available as part of tracking are URL-encoded for blobs and un-encoded for destinations.  

### MDN is sent asynchronously even if the Send asynchronous MDN option is unchecked  
Consider this scenario – If you select the **Send asynchronous MDN** checkbox and, specify a URL to send the async MDN to, and then uncheck the **Send asynchronous MDN** checkbox again, the MDN is still sent to the specified URL even though the option to send async MDNs is not selected.  
As a workaround, you must clear the specified URL before unchecking the **Send asynchronous MDN** checkbox and then deploy the AS2 agreement.  

### Whitespace characters beyond a valid interchange cause an empty message to be sent to the suspend endpoint  
If there are whitespaces beyond an IEA segment, the disassembler treats this as end of current interchange and looks at the next set of whitespaces as a next message. Since this is not valid interchange, you might observe that one successful message is sent to the route destination and one empty message is sent the suspend endpoint.  
### Tracking in BizTalk Services Portal  
Tracking events are captured up to the EDI message processing and any correlation. If a message fails outside of the Protocol stage, Tracking will show as successful. In this situation, refer to the LOG section under the **Details** column in **Tracking** for error details.
The X12 Receive and Send settings ([Create an X12 Agreement in Azure BizTalk Services](https://msdn.microsoft.com/library/azure/hh689847.aspx)) provide information on the Protocol stage.  

### Update Agreement  
The BizTalk Services Portal allows you to modify the Qualifier of an Identity when an agreement is configured. This can result in inconsistence properties. For example, there is an agreement using ZZ:1234567 and ZZ:7654321 the Qualifier. In the BizTalk Services Portal profile settings, you change ZZ:1234567 to be 01:ChangedValue. You open the agreement and 01:ChangedValue is displayed instead of ZZ:1234567.
To modify the Qualifier of an identity, delete the agreement, update **Identities** in the partner profile and then recreate the agreement.  
> AZURE.WARNING This behavior impacts X12 and AS2.  

### AS2 Attachments  
Attachments for AS2 messages are not supported in send or receive. Specifically, attachments are silently ignored and the message body is processed as a regular AS2 message.  
### Resources: Remembering Path  
When adding **Resources**, the dialog window may not remember the path previously used to add a resource. To remember the previously-used path, try adding the BizTalk Services Portal web site to **Trusted Sites** in Internet Explorer.  
### If you rename the entity name of a bridge and close the project without saving changes, opening the entity again results in an error
Consider a scenario in the following order:  
* Add a bridge (for example an XML One-Way Bridge) to a BizTalk Service project  

* Rename the bridge by specifying a value for the Entity Name property. This renames the associated .bridgeconfig file with the name you specified.  

* Close the .bcs file (by closing the tab in Visual Studio) without saving the changes.  

* Open the .bcs file again from the Solution Explorer.  
You will notice that while the associated .bridgeconfig file has the new name you specified, the entity name on the design surface is still the old name. If you try to open the Bridge Configuration by double-clicking the bridge component, you get the following error:  
  ‘<old name>’ Entity’s associated file ‘<old name>.bridgeconfig’ does not exist  
To avoid running into this scenario, make sure you save changes after you rename the entities in a BizTalk Service project.  
### BizTalk Service project builds successfully even if an artifact has been excluded from a Visual Studio project
Consider a scenario where you add an artifact (for example, an XSD file) to a BizTalk Service project, include that artifact in the Bridge Configuration (for example, by specifying it as a Request message type), and then exclude it from the Visual Studio project. In such a case, building the project will not give any error as long as the deleted artifact is available on the disk at the same location from where it was included in the Visual Studio project.
### The BizTalk Service project does not check for schema availability while configuring the bridges
In a BizTalk Service project, if a schema that is added to the project imports another schema, the BizTalk Service project does not check whether the imported schema is added to the project. If you try to build such a project, you do not get any build errors.
### The response message for a XML Request-Reply Bridge is always of charset UTF-8
For this release, the charset of the response message from an XML Request-Reply Bridge is always set to UTF-8.
### User-Defined Datatypes
The BizTalk Adapter Pack adapters within the BizTalk Adapter Service feature can utilize user-defined datatypes for adapter operations.
When using user-defined datatypes, copy the files (.dll) to drive:\Program Files\Microsoft BizTalk Adapter Service\BAServiceRuntime\bin\ or to the Global Assembly Cache (GAC) on the server hosting the BizTalk Adapter Service service. Otherwise, the following error may occur on the client:  
```<s:Fault xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <faultcode>s:Client</faultcode>
  <faultstring xml:lang="en-US">The UDT with FullName "File, FileUDT, Version=Value, Culture=Value, PublicKeyToken=Value" could not be loaded. Try placing the assembly containing the UDT definition in the Global Assembly Cache.</faultstring>
  <detail>
    <AFConnectRuntimeFault xmlns="http://Microsoft.ApplicationServer.Integration.AFConnect/2011" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
      <ExceptionCode>ERROR_IN_SENDING_MESSAGE</ExceptionCode>
    </AFConnectRuntimeFault>
  </detail>
</s:Fault> ```  
> [AZURE.IMPORTANT] It is recommended to use GACUtil.exe to install a file into the Global Assembly Cache. GACUtil.exe documents how to use this tool and the Visual Studio command line options.  

### Restarting the BizTalk Adapter Service Web Site
Installing the **BizTalk Adapter Service Runtime*** creates the **BizTalk Adapter Service** web site in IIS that contains the **BAService** application. **BAService** application internally uses relay binding to extend the reach of on-premise service endpoint to the cloud. For a service hosted on-premises, the corresponding relay endpoint will be registered on the Service Bus only when the on-premises service starts.  

If you stop and start an application, the configuration for auto-starting an application is not honored. So when **BAService** is stopped, you must always restart the **BizTalk Adapter Service** web site instead. Do not start or stop the **BAService** application.
### Special characters should not be used for address and entity names of LOB components
You should not use special characters for address and entity names of LOB components. If you do so, you will get an error while deploying the BizTalk Service project. For certain characters like ‘%’, the BizTalk Adapter Service website might go into a stopped state and you will have to manually start it.
### Test Map with Get Context Property
If a Transform contains a **Get Context Property** Map Operation, **Test Map** will fail. As a temporary workaround, replace the **Get Context Property** Map Operation with a String Concatenate Map Operation containing dummy data. This will populate the target schema and allow you test other Transform functionality.
### Test Map Property does not display
The **Test Map** properties do not display in Visual Studio. This can occur if the **Properties** window and the **Solution Explorer** window are not simultaneously docked. To resolve this, dock the **Properties** and the **Solution Explorer** windows.  
### DateTime Reformat drop-down is grayed out
When a DateTime Reformat Map Operation is added to the design surface and configured, the Format drop-down list may be grayed out. This can happen if the computer Display is set **Medium – 125%** or **Larger – 150%**. To resolve, set the display to **Smaller – 100% (default)** using the steps below:  
1. Open the **Control Panel** and click **Appearance and Personalization**.
2. Click **Display**.
3. Click **Smaller – 100% (default)** and click **Apply**.

The **Format** drop-down list should now work as expected.
### Duplicate agreements in the BizTalk Services Portal
Consider the following scenario:
1. Create an agreement using the Trading Partner Management OM API.
2. Open the agreement in the BizTalk Services Portal in two different tabs.
3. Deploy the agreement from both the tabs.
4. As a result, both the agreements get deployed resulting in duplicate entries in the BizTalk Services Portal

**Workaround**. Open any one of the duplicate agreements in the BizTalk Services Portal, and undeploy.  

### Bridges do not use updated certificate even after a certificate has been updated in the artifact store
Consider the following scenarios:  

**Scenario 1: Using thumbprint-based certificates for securing message transfer from a bridge to a service endpoint**  
Consider a scenario where you use thumbprint-based certificates in your BizTalk Service project. You update the certificate in the BizTalk Services Portal with the same name but a different thumbprint, but do not update the BizTalk Service project accordingly. In such a scenario, the bridge might continue to process the messages because the older certificate data might still be in the channel cache. After that, message processing fails.  

**Workaround**: Update the certificate in the BizTalk Service project and redeploy the project.  

**Scenario 2: Using name-based behaviors to identify certificates for securing message transfer from a bridge to a service endpoint**

Consider a scenario where you use name-based behaviors to identify certificates in your BizTalk Service project. You update the certificate in the BizTalk Services Portal but do not update the BizTalk Service project accordingly. In such a scenario, the bridge might continue to process the messages because the older certificate data might still be in the channel cache. After that, message processing fails.  

**Workaround**: Update the certificate in the BizTalk Service project and redeploy the project.  

### Bridges continue to process messages even when the SQL database is offline
The BizTalk Services bridges continue to process messages for a while, even if the Microsoft Azure SQL Database (which stores the running information like deployed artifacts and pipelines), is offline. This is because BizTalk Services uses the cached artifacts and bridge configuration.
If you do not want the bridges to process any messages when the SQL Database is offline, you can use the BizTalk Services PowerShell cmdlets to stop or suspend the BizTalk Service. See [Azure BizTalk Service Management Sample](http://go.microsoft.com/fwlink/p/?LinkID=329019) for the Windows PowerShell cmdlets to manage operations.  
### Reading the XML message within a bridge’s custom code component includes an extra BOM character
Consider a scenario where you want to read an XML message within a bridge’s custom code. If you use the .NET API System.Text.Encoding.UTF8.GetString(bytes) an extra BOM character is included in the output at the beginning of the message. So, if you do not want the output to include the extra BOM character, you must use ```System.IO.StreamReader().ReadToEnd()```.
### Sending messages to a bridge using WCF does not scale
Messages sent to a bridge using WCF does not scale. You should instead use HttpWebRequest if you want a scalable client.
### UPGRADE: Token Provider error after upgrading from BizTalk Services Preview to General Availability (GA)
There is an EDI or AS2 Agreement with active batches. When the BizTalk Service is upgraded from Preview to GA, the following may occur:
* Error: The token provider was unable to provide a security token. Token provider returned message: The remote name could not be resolved.

* Batch tasks are canceled.

**Workaround**: After the BizTalk Service is updated to General Availability (GA), redeploy the agreement.  

### UPGRADE: Toolbox shows the old bridge icons after upgrading the BizTalk Services SDK
After you upgrade an earlier version of the BizTalk Services SDK, which had old icons representing the bridges, the toolbox continues to show the old icons for the bridges. However, if you add a bridge to BizTalk Service project designer surface, the surface shows the new icon.  

**Workaround**. You can work around this issue by deleting the .tbd files under <system drive>:\Users\<user>\AppData\Local\Microsoft\VisualStudio\11.0.  

### UPGRADE: BizTalk Portal update from Preview to GA might show an error indicating that the EDI capability is not available
If you are logged into the BizTalk Services Portal while the BizTalk Services is upgraded from Preview to GA, you might get the following error on the portal:  

This capability is not available as part of this edition of Microsoft Azure BizTalk Services. To use these capabilities switch to an appropriate edition.  

**Resolution**: Log out from the portal, close and open the browser, and then log into the portal.  
### UPGRADE: New tracking data does not show up after BizTalk Services is upgraded to GA
Assume a scenario where you have an XML bridge deployed on BizTalk Services Preview subscription. You send messages to the bridge and the corresponding tracking data is available on the BizTalk Services Portal. Now, if the BizTalk Services Portal and BizTalk Services runtime bits are upgraded to GA, and you send a message to the same bridge endpoint deployed earlier, the tracking data does not show up for messages sent after upgrade.  

### Pipelines v/s Bridges
Throughout this document, the term ‘pipelines’ and ‘bridges’ are used interchangeably. Both essentially mean the same thing, which is, a message processing unit deployed on BizTalk Services.  

### Concepts  

[BizTalk Services](https://msdn.microsoft.com/library/azure/hh689864.aspx)   
