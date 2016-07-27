<properties
   pageTitle="Tutorial: Process EDIFACT Invoices Using Azure BizTalk Services | Microsoft Azure BizTalk Services"
   description="How to create and configure the Box Connector or API app and use it in a logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="msftman"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="deonhe"/>

# Tutorial: Process EDIFACT invoices using Azure BizTalk Services
You can use the BizTalk Services Portal to configure and deploy X12 and EDIFACT agreements. In this tutorial, we look at how to create an EDIFACT agreement for exchanging invoices between trading partners. This tutorial is written around an end-to-end business solution involving two trading partners, Northwind and Contoso that exchange EDIFACT messages.  

## Sample based on this tutorial
This tutorial is written around a sample, **Sending EDIFACT Invoices Using BizTalk Services**, which is available to download from the [MSDN Code Gallery](http://go.microsoft.com/fwlink/?LinkId=401005). You could use the sample and go through this tutorial to understand how the sample was built. Or, you could use this tutorial to create your own solution ground-up. This tutorial is targeted towards the second approach so that you understand how this solution was built. Also, as much as possible, the tutorial is consistent with the sample and uses the same names for artifacts (for example, schemas, transforms) as used in the sample.  

>[AZURE.NOTE] Because this solution involves sending a message from an EAI bridge to an EDI bridge, it reuses the [BizTalk Services Bridge chaining sample](http://code.msdn.microsoft.com/BizTalk-Bridge-chaining-2246b104) sample.  

## What does the solution do?

In this solution, Northwind receives EDIFACT invoices from Contoso. These invoices are not in a standard EDI format. So, before sending the invoice to Northwind, it must be transformed to an EDIFACT invoice (also called INVOIC) document. On receipt, Northwind must process the EDIFACT invoice, and return a control message (also called CONTRL) to Contoso.

![][1]  

To achieve this business scenario, Contoso uses the features provided with Microsoft Azure BizTalk Services.

*   Contoso uses EAI bridges to transform the original invoice to EDIFACT INVOIC.

*   The EAI bridge then sends the message to an EDI send bridge deployed as part of an agreement configured in the BizTalk Services Portal.

*   The EDI send bridge processes the EDIFACT INVOIC and routes it to Northwind.

*   After receiving the invoice, Northwind returns a CONTRL message to the EDI receive bridge deployed as part of the agreement.  

> [AZURE.NOTE] Optionally, this solution also demonstrates how to use batching to send the invoices in batches, instead of sending each invoice separately.  

To complete the scenario, we use Service Bus queues to send invoice from Contoso to Northwind or receive acknowledgement from Northwind. These queues can be created using a client application, which is available as a download and is included in the sample package that is available as part of this tutorial.  

## Prerequisites

*   You must have a Service Bus namespace. For instructions on creating a namespace, see [How To: Create or Modify a Service Bus Service Namespace](https://msdn.microsoft.com/library/azure/hh674478.aspx). Let us assume that you already have a Service Bus namespace provisioned, called **edifactbts**.

*   You must have a BizTalk Services subscription. For instructions, see [Create a BizTalk Service using Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=302280). For this tutorial, let us assume you have a BizTalk Services subscription, called **contosowabs**.

*   Register your BizTalk Services subscription on the BizTalk Services Portal. For instructions, see [Registering a BizTalk Service Deployment on the BizTalk Services Portal](https://msdn.microsoft.com/library/hh689837.aspx)

*   You must have Visual Studio installed.

*   You must have BizTalk Services SDK installed. You can download the SDK from [http://go.microsoft.com/fwlink/?LinkId=235057](http://go.microsoft.com/fwlink/?LinkId=235057)  

## Step 1: Create the Service Bus queues  
This solution uses Service Bus queues to exchange messages between trading partners. Contoso and Northwind send messages to the queues from where the EAI and/or EDI bridges consume them. For this solution, you need three Service Bus queues:

*   **northwindreceive** – Northwind receives the invoice from Contoso over this queue.

*   **contosoreceive** – Contoso receives the acknowledgement from Northwind over this queue.

*   **suspended** – All suspended messages are routed to this queue. Messages are suspended if they fail during processing.

You can create these Service Bus queues by using a client application included in the sample package.  

1.  From the location where you downloaded the sample, open **Tutorial Sending Invoices Using BizTalk Services EDI Bridges.sln**.

2.  Press **F5** to build and start the **Tutorial Client** application.

3.  In the screen, enter the Service Bus ACS namespace, issuer name, and issuer key.

    ![][2]  
4.  A message box prompts that three queues will be created in your Service Bus namespace. Click **OK**.

5.  Leave the Tutorial Client running. Open the , click **Service Bus** > **_your Service Bus namespace_** > **Queues**, and verify that the three queues are created.  

## Step 2: Create and deploy trading partner agreement
Create a trading partner agreement between Contoso and Northwind. A trading partner agreement defines a trade contract between the two business partners, such as which message schema to use, which messaging protocol to use, etc. A trading partner agreement includes two EDI bridges, one to send messages to trading partners (called the **EDI Send bridge**) and one to receive messages from trading partners (called the **EDI Receive bridge**).

In the context of this solution, the EDI send bridge corresponds to the send-side of the agreement and is used to send the EDIFACT invoice from Contoso to Northwind. Similarly, the EDI receive bridge corresponds to the receive-side of the agreement and is used to receive acknowledgements from Northwind.  

### Create the trading partners

To start with, create trading partners for Contoso and Northwind.  

1.  In the BizTalk Services Portal, on the **Partners** tab, click **Add**.

2.  In the New partner page, enter **Contoso** as a partner name, and then click **Save**.

3.  Repeat the step to create the second partner, **Northwind**.  

### Create the agreement
Trading partner agreements are created between business profiles of trading partners. This solution uses the default partner profiles that are automatically created when we created the partners.  

1.  In the BizTalk Services Portal, click **Agreements** > **Add**.

2.  In the new agreement’s **General Settings** page, specify the values as shown in the image below, and then click **Continue**.

    ![][3]  

    After you click **Continue**, two tabs, **Receive Settings** and **Send Settings** become available.

3.  Create the send agreement between Contoso and Northwind. This agreement governs how Contoso sends the EDIFACT invoice to Northwind.

    1.  Click **Send Settings**.

    2.  Retain the default values on the **Inbound URL**, **Transform**, and **Batching** tabs.

    3.  On the **Protocol** tab, under the **Schemas** section, upload the **EFACT_D93A_INVOIC.xsd** schema. This schema is available with the sample package.

        ![][4]  
    4.  On the **Transport** tab, specify the details for the Service Bus queues. For the send-side agreement, we use the **northwindreceive** queue to send the EDIFACT invoice to Northwind, and the **suspended** queue to route any messages that fail during processing and are suspended. You created these queues in **Step 1: Create the Service Bus queues** (in this topic).

        ![][5]  

        Under **Transport Settings > Transport type** and **Message Suspension Settings > Transport type**, select Azure Service Bus and provide the values as shown in the image.

4.  Create the receive agreement between Contoso and Northwind. This agreement governs how Contoso receives the acknowledgement from Northwind.

    1.  Click **Receive Settings**.

    2.  Retain the default values on the **Transport** and **Transform** tabs.

    3.  On the **Protocol** tab, under the **Schemas** section, upload the **EFACT_4.1_CONTRL.xsd** schema. This schema is available with the sample package.

    4.  On the **Route** tab, create a filter to ensure that only acknowledgements from Northwind are routed to Contoso. Under **Route Settings**, click **Add** to create the routing filter.

        ![][6]  
        1.  Provide values for **Rule Name**, **Route rule**, and **Route destination** as shown in the image.

        2.  Click **Save**.

    5.  On the **Route** tab again, specify where suspended acknowledgements (acknowledgements that fail during processing) are routed to. Set the transport type to Azure Service Bus, route destination type to **Queue**, authentication type to **Shared Access Signature** (SAS), provide the SAS connection string for the Service Bus namespace, and then enter the queue name as **suspended**.

5.  Finally, click **Deploy** to deploy the agreement. Note the endpoints where the send and receive agreements get deployed.

    *   On the **Send Settings** tab, under **Inbound URL**, note the endpoint. To send a message from Contoso to Northwind using the EDI send bridge, you must send a message to this endpoint.

    *   On the **Receive Settings** tab, under **Transport**, note the endpoint. To send a message from Northwind to Contoso using the EDI receive bridge, you must send a message to this endpoint.  

## Step 3: Create and deploy the BizTalk Services project

In the previous step, you deployed the EDI send and receive agreements to process EDIFACT invoices and acknowledgements. These agreements can only process messages that conform to the standard EDIFACT message schema. However, per the scenario for this solution, Contoso sends an invoice to Northwind in an in-house proprietary schema. So, before the message is sent to the EDI send bridge, it must be transformed from the in-house schema to the standard EDIFACT invoice schema. The BizTalk Services EAI project does that.

The BizTalk Services project, **InvoiceProcessingBridge**, that transforms the message is also included as part of the sample you downloaded. The project includes the following artifacts:

*   **INHOUSEINVOICE.XSD** – Schema of the in-house invoice that is sent to Northwind.

*   **EFACT_D93A_INVOIC.XSD** – Schema of the standard EDIFACT invoice.

*   **EFACT_4.1_CONTRL.XSD** – Schema of the EDIFACT acknowledgement that Northwind sends to Contoso.

*   **INHOUSEINVOICE_to_D93AINVOIC.TRFM** – The transform that maps the in-house invoice schema to the standard EDIFACT invoice schema.  

### Create the BizTalk Services project
1.  In the Visual Studio solution, expand the InvoiceProcessingBridge project, and then open the **MessageFlowItinerary.bcs** file.

2.  Click anywhere on the canvas and set the **BizTalk Service URL** in the property box to specify your BizTalk Services subscription name. For example, `https://contosowabs.biztalk.windows.net`.

    ![][7]  
3.  From the toolbox, drag an **Xml One-Way Bridge** to the canvas. Set the **Entity Name** and **Relative Address** properties of the bridge to **ProcessInvoiceBridge**. Double-click **ProcessInvoiceBridge** to open the bridge configuration surface.

4.  Within the **Message Types** box, click the plus (**+**) button to specify the schema of the incoming message. Because the incoming message for the EAI bridge is always the in-house invoice, set this to **INHOUSEINVOICE**.

    ![][8]  
5.  Click the **Xml Transform** shape, and in the property box, for the **Maps** property, click the ellipsis (**...**) button. In the **Maps Selection** dialog box, select the **INHOUSEINVOICE_to_D93AINVOIC** transform file, and then click **OK**.

    ![][9]  
6.  Go back to **MessageFlowItinerary.bcs**, and from the toolbox, drag a **Two-Way External Service Endpoint** to the right of the **ProcessInvoiceBridge**. Set its **Entity Name** property to **EDIBridge**.

7.  In the Solution Explorer, expand the **MessageFlowItinerary.bcs** and double-click the **EDIBridge.config** file. Replace the content of the **EDIBridge.config** with the following.

    > [AZURE.NOTE] Why do I need to edit the .config file? The external service endpoint that we added to the bridge designer canvas represents the EDI bridges that we deployed earlier. EDI bridges are two-way bridges, with a send and receive side. However, the EAI bridge that we added to the bridge designer is a one-way bridge. So, to handle the different message exchange patterns of the two bridges, we use a custom bridge behavior by including its configuration in the .config file. Additionally, the custom behavior also handles the authentication to the EDI send bridge endpoint.This custom behavior is available as a separate sample at [BizTalk Services Bridge chaining sample - EAI to EDI](http://code.msdn.microsoft.com/BizTalk-Bridge-chaining-2246b104). This solution reuses the sample.  
    
    ```
<?xml version="1.0" encoding="utf-8"?>
    <configuration>
      <system.serviceModel>
        <extensions>
          <behaviorExtensions>
            <add name="BridgeAuthentication" 
                  type="Microsoft.BizTalk.Bridge.Behaviour.BridgeBehaviorElement, Microsoft.BizTalk.Bridge.Behaviour, Version=1.0.0.0, Culture=neutral, PublicKeyToken=ae58f69b69495c05" />
          </behaviorExtensions>
        </extensions>
        <behaviors>
          <endpointBehaviors>
            <behavior name="BridgeAuthenticationConfiguration">
              <!-- Enter the ACS namespace, issuer name and issuer secret of the BizTalk Services deployment -->
              <BridgeAuthentication acsnamespace="[YOUR ACS NAMESPACE]" 
                                    issuername="owner" 
                                    issuersecret="[YOUR ACS SECRET]" />
              <webHttp />
            </behavior>
          </endpointBehaviors>
        </behaviors>
        <bindings>
          <webHttpBinding>
            <binding name="BridgeBindingConfiguration">
              <security mode="Transport" />
            </binding>
          </webHttpBinding>
        </bindings>
        <client>
          <clear />
          <!--
            Go BizTalk Portal > Agreement > Send Settings > Inbound URL
            Copy the Endpoint URL and paste it in the below address field
          -->
          <endpoint name="TwoWayExternalServiceEndpointReference1" 
                    address="[YOUR EDI BRIDGE SEND URI]" 
                    behaviorConfiguration="BridgeAuthenticationConfiguration" 
                    binding="webHttpBinding" 
                    bindingConfiguration="BridgeBindingConfiguration" 
                    contract="System.ServiceModel.Routing.IRequestReplyRouter" />
        </client>
      </system.serviceModel>
    </configuration>

    ```
8.  Update the EDIBridge.config file to include configuration details

    *   Under _<behaviors>_, provide the ACS namespace and key associated with the BizTalk Services subscription.

    *   Under _<client>_, provide the endpoint where the EDI send agreement is deployed.

    Save changes and close the configuration file.

9.  From the Toolbox, click the **Connector** and join the **ProcessInvoiceBridge** and **EDIBridge** components. Select the connector, and in Properties box, set **Filter Condition** to **Match All**. This ensures that all messages processed by the EAI bridge are routed to the EDI bridge.

    ![][10]  
10.  Save changes to the solution.  

### Deploy the project

1.  On the computer where you created the BizTalk Services project, download and install the SSL certificate for your BizTalk Services subscription. From , under BizTalk Services, click **Dashboard**, and then click **Download SSL Certificate**. Double-click the certificate and follow the prompt to complete the installation. Make sure you install the certificate under **Trusted Root Certification Authorities** certificate store.

2.  In Visual Studio Solution Explorer, right-click the **InvoiceProcessingBridge** project, and then click **Deploy**.

3.  Provide the values as shown in the image, and then click **Deploy**. You can get the ACS credentials for BizTalk Services by clicking **Connection Information** from the BizTalk Services dashboard.

    ![][11]  

    From the output pane, copy the endpoint where the EAI bridge is deployed, for example, `https://contosowabs.biztalk.windows.net/default/ProcessInvoiceBridge`. You will need this endpoint URL later.  

## Step 4: Test the solution


In this topic, we look at how to test the solution by using the **Tutorial Client** application provided as part of the sample.  

1.  In Visual Studio, press F5 to start the **Tutorial Client**.

2.  The screen must have the values prepopulated from the step where we created the Service Bus queues. Click **Next**.

3.  In the next window, provide ACS credentials for BizTalk Services subscription, and the endpoints where EAI and EDI (receive) bridges are deployed.

    You had copied the EAI bridge endpoint in the previous step. For EDI receive bridge endpoint, in the BizTalk Services Portal, go to the agreement > Receive Settings > Transport > Endpoint.

    ![][12]  
4.  In the next window, under Contoso, click the **Send In-house Invoice** button. In the File open dialog box, open the INHOUSEINVOICE.txt file. Examine the content of the file and then click **OK** to send the invoice.

    ![][13]  
5.  In a few seconds the invoice is received at Northwind. Click the **View Message** link to see the invoice received by Northwind. Notice how the invoice received by Northwind is in standard EDIFACT schema while the one sent by Contoso was an in-house schema.

    ![][14]  
6.  Select the invoice and then click **Send Acknowledgement**. In the dialog box that pops up, notice that the interchange ID is same in the received invoice and the acknowledgement being sent. Click OK in the **Send Acknowledgement** dialog box.

    ![][15]  
7.  In a few seconds, the acknowledgement is successfully received at Contoso.

    ![][16]  

## Step 5 (optional): Send EDIFACT invoice in batches 
BizTalk Services EDI bridges also supports batching of outgoing messages. This feature is useful for receiving partners that prefer to receive a batch of messages (meeting certain criterion) instead of individual messages.

The most important aspect when working with batches is the actual release of the batch, also called the release criteria. The release criteria can be based on how the receiving partner wants to receive messages. If batching is enabled, the EDI bridge does not send the outgoing message to the receiving partner until the release criteria is fulfilled. For example, a batching criteria based on message size dispatches a batch only when ‘n’ messages are batched. A batch criteria can also be time-based, such that a batch is sent at a fixed time every day. In this solution, we try the message-size based criteria.

1.  In the BizTalk Services Portal, click the agreement you created earlier. Click Send Settings > Batching > Add Batch.

2.  For batch name, enter **InvoiceBatch**, provide a description, and then click **Next**.

3.  Specify a batch criteria, that defines which messages must be batched. In this solution, we batch all messages. So, select the Use advanced definitions option, and enter **1 = 1**. This is a condition which will always be true, and hence all messages will be batched. Click **Next**.

    ![][17]  
4.  Specify a batch release criteria. From the drop-box, select **MessageCountBased**, and for **Count**, specify **3**. This means that a batch of three messages will be sent to Northwind. Click **Next**.

    ![][18]  
5.  Review the summary and then click **Save**. Click **Deploy** to redeploy the agreement.

6.  Go back to the **Tutorial Client**, click **Send In-house Invoice**, and follow the prompts to send the invoice. You will notice that no invoice is received at Northwind because the batch size is not met. Repeat this step two more times, so that you have three invoice messages sent to Northwind. This satisfies the batch release criteria of 3 messages and you should now see an invoice at Northwind.


<!--Image references-->
[1]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-1.PNG  
[2]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-2.PNG  
[3]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-3.PNG
[4]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-4.PNG  
[5]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-5.PNG  
[6]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-6.PNG  
[7]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-7.PNG  
[8]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-8.PNG
[9]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-9.PNG  
[10]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-10.PNG  
[11]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-11.PNG  
[12]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-12.PNG  
[13]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-13.PNG
[14]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-14.PNG  
[15]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-15.PNG  
[16]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-16.PNG  
[17]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-17.PNG  
[18]: ./media/biztalk-process-edifact-invoice/process-edifact-invoices-with-auzure-bts-18.PNG

