<properties linkid="issuer-name-issuer-key" urlDisplayName="BizTalk Services Issuer Name and Issuer Key" pageTitle="BizTalk Services: Issuer Name and Issuer Key" metaKeywords="Get started Azure biztalk services, Issuer Name, Issuer Key, Azure unstructured data" metaDescription="Lists the steps to retrieve the ACS Issuer Name and Issuer Key and the Service Bus Issuer Name and Issuer Key." metaCanonical="http://www.windowsazure.com/en-us/manage/services/biztalk-services/issuer-name-issuer-key" umbracoNaviHide="0" disqusComments="1" writer="mandia" editor="susanjo" manager="paulettm" /> 

<div chunk="../chunks/biztalk-services-left-nav.md"/> 

# **BizTalk Services: Issuer Name and Issuer Key**

Windows Azure BizTalk Services uses the Service Bus Issuer Name and Issuer Key, and the Access Control (ACS) Issuer Name and Issuer Key. Specifically:


<table border="1">
<tr bgcolor="FAF9F9">
<td><b>Task</b></td>
<td><b>Which Issuer Name and Issuer Key</b></td>
</tr>
<tr>
<td>Deploying your application from Visual Studio</td>
<td>ACS Issuer Name and Issuer Key</td>
</tr>
<tr>
<td>Configuring the Windows Azure BizTalk Services Portal</td>
<td>ACS Issuer Name and Issuer Key</td>
</tr>
<tr>
<td>Creating LOB Relays with the BizTalk Adapter Services in Visual Studio</td>
<td>Service Bus Issuer Name and Issuer Key</td>
</tr>
</table>


This topic lists the steps to retrieve the Issuer Name and Issuer Key. 

## **ACS Issuer Name and Issuer Key**
The ACS Issuer Name and Issuer Key are used by the following:

- Your Windows Azure BizTalk Service application created in Visual Studio: To successfully deploy your BizTalk Service application in Visual Studio to Windows Azure, you enter the ACS Issuer Name and Issuer Key. 
- The Windows Azure BizTalk Services  Portal: The first time you log in to the BizTalk Services Portal, you enter your BizTalk Service name as the service provider,  enter the ACS Issuer Name, and the ACS Issuer Key.

### To retrieve the ACS Issuer Name and Issuer Key

1. Log in to the [Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, click **Active Directory**.
3. Click the **Access Control Namespaces** tab. 
4. Click your ACS namespace and click **Manage**. The **Access Control Service** portal opens.
5. Under **Service Settings**, click **Service Identities**. This displays your Service Identity, which is your ACS Issuer Name value. Click your Service Identity link to see the Password, which is your Issuer Key value. Their values can be copied.<br/><br/>
For example, in **Service Identities**, you see "owner". "Owner" is your ACS Issuer Name. When you click the "owner" link, you see the **Password**. When you click the "Password" link, you see the value. This Password value is your ACS Issuer Key. <br/><br/>
To summarize:<br/>
Issuer Name = Service Identity name<br/>
Issuer Key = Password value

**Important**<br/>
When the ACS Namespace is created, a Service Identity is **not** automatically created. When you provision a BizTalk Service in the Windows Azure Management Portal, you specify an existing ACS Namespace. *If* an existing  Service Identity does not exist, provisioning a BizTalk Service automatically creates a Service Identity named "owner". 

If the Service Identity already exists when you provision a BizTalk Service, that Service Identity Password **and** Symmetric Key must be generated. Only the Service Identity Name (Issuer Name) and Password (Issuer Key) are entered but the Symmetric Key must also be generated. 


[How to: Use ACS Management Service to Configure Service Identities](http://go.microsoft.com/fwlink/p/?LinkID=303942) provides more information on ACS Service Identities.


## **Service Bus Issuer Name and Issuer Key**
Service Bus Issuer Name and Issuer Key are used by BizTalk Adapter Services. In your BizTalk Services project in Visual Studio, you use the BizTalk Adapter Services to connect to an on-premise Line-of-Business (LOB) system. To connect, you create the LOB Relay and enter your LOB system details. When doing this, you also enter the Service Bus Issuer Name and Issuer Key.

### To retrieve the Service Bus Issuer Name and Issuer Key

1. Log in to the [Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=213885).
2. In the left navigation pane, click **Service Bus**.
3. Click your namespace. In the task bar, click **Connection Information**. This displays the **Default Issuer** (Issuer Name) and **Default Key** (Issuer Key). Their values can be copied.<br/><br/>
To summarize:<br/>
Issuer Name = Default Issuer<br/>
Issuer Key = Default Key

## **Next**
Additional Windows Azure BizTalk Services topics:

[Installing the Windows Azure BizTalk Services SDK - June 2013 Preview](http://go.microsoft.com/fwlink/p/?LinkID=241589)<br/>
[Tutorials: Windows Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=236944)<br/>
[How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)<br/>
[Windows Azure BizTalk Services](http://go.microsoft.com/fwlink/p/?LinkID=303664)<br/>
[Business to Business Messaging](http://go.microsoft.com/fwlink/p/?LinkID=303670)<br/>
[Rich Messaging Endpoints](http://go.microsoft.com/fwlink/p/?LinkID=303671)<br/>
[Message Transforms](http://go.microsoft.com/fwlink/p/?LinkID=303672)<br/>
[BizTalk Adapter Service](http://go.microsoft.com/fwlink/p/?LinkID=303673)<br/>

## **See Also**
[How to: Use ACS Management Service to Configure Service Identities](http://go.microsoft.com/fwlink/p/?LinkID=303942)