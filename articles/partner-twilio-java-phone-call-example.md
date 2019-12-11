---
title: How to Make a phone call from Twilio (Java) | Microsoft Docs
description: Learn how to make a phone call from a web page using Twilio in a Java application on Azure.
services: ''
documentationcenter: java
author: georgewallace

ms.assetid: 0381789e-e775-41a0-a784-294275192b1d
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 11/25/2014
ms.author: gwallace

---
# How to Make a Phone Call Using Twilio in a Java Application on Azure
The following example shows you how you can use Twilio to make a call from a web page hosted in Azure. The resulting application will prompt the user for phone call values, as shown in the following screenshot.

![Azure Call Form Using Twilio and Java][twilio_java]

You'll need to do the following to use the code in this topic:

1. Acquire a Twilio account and authentication token. To get started with Twilio, evaluate pricing at [https://www.twilio.com/pricing][twilio_pricing]. You can sign up at [https://www.twilio.com/try-twilio][try_twilio]. For information about the API provided by Twilio, see [https://www.twilio.com/api][twilio_api].
2. Obtain the Twilio JAR. At [https://github.com/twilio/twilio-java][twilio_java_github], you can download the GitHub sources and create your own JAR, or download a pre-built JAR (with or without dependencies).
   The code in this topic was written using the pre-built TwilioJava-3.3.8-with-dependencies JAR.
3. Add the JAR to your Java build path.
4. If you are using Eclipse to create this Java application, include the Twilio JAR in your application deployment file (WAR) using Eclipse's deployment assembly feature. If you are not using Eclipse to create this Java application, ensure the Twilio JAR is included within the same Azure role as your Java application, and added to the class path of your application.
5. Ensure your cacerts keystore contains the Equifax Secure Certificate Authority certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 (the serial number is 35:DE:F4:CF and the SHA1 fingerprint is D2:32:09:AD:23:D3:14:23:21:74:E4:0D:7F:9D:62:13:97:86:63:3A). This is the certificate authority (CA) certificate for the [https://api.twilio.com][twilio_api_service] service, which is called when you use Twilio APIs. For information about adding this CA certificate to your JDK's cacert store, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert].

Additionally, familiarity with the information at [Creating a Hello World Application Using the Azure Toolkit for Eclipse][azure_java_eclipse_hello_world], or with other techniques for hosting Java applications in Azure if you are not using Eclipse, is highly recommended.

## Create a web form for making a call
The following code shows how to create a web form to retrieve user data for making a call. For purposes of this example, a new dynamic web project, named **TwilioCloud**, was created, and **callform.jsp** was added as a JSP file.

    <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
        pageEncoding="ISO-8859-1" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "https://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>Automated call form</title>
    </head>
    <body>
     <p>Fill in all fields and click <b>Make this call</b>.</p>
     <br/>
      <form action="makecall.jsp" method="post">
       <table>
         <tr>
           <td>To:</td>
           <td><input type="text" size=50 name="callTo" value="" />
           </td>
         </tr>
         <tr>
           <td>From:</td>
           <td><input type="text" size=50 name="callFrom" value="" />
           </td>
         </tr>
         <tr>
           <td>Call message:</td>
           <td><input type="text" size=400 name="callText" value="Hello. This is the call text. Good bye." />
           </td>
         </tr>
         <tr>
           <td colspan=2><input type="submit" value="Make this call" />
           </td>
         </tr>
       </table>
     </form>
     <br/>
    </body>
    </html>

## Create the code to make the call
The following code, which is called when the user completes the form displayed by callform.jsp, creates the call message and generates the call. For purposes of this example, the JSP file is named **makecall.jsp** and was added to the **TwilioCloud** project. (Use your Twilio account and authentication token instead of the placeholder values assigned to **accountSID** and **authToken** in the code below.)

    <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    import="java.util.*"
    import="com.twilio.*"
    import="com.twilio.sdk.*"
    import="com.twilio.sdk.resource.factory.*"
    import="com.twilio.sdk.resource.instance.*"
    pageEncoding="ISO-8859-1" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "https://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>Call processing happens here</title>
    </head>
    <body>
        <b>This is my make call page.</b><p/>
     <%
    try 
    {
         // Use your account SID and authentication token instead
         // of the placeholders shown here.
         String accountSID = "your_twilio_account";
         String authToken = "your_twilio_authentication_token";

         // Instantiate an instance of the Twilio client.     
         TwilioRestClient client;
         client = new TwilioRestClient(accountSID, authToken);

         // Retrieve the account, used later to retrieve the CallFactory.
         Account account = client.getAccount();

         // Display the client endpoint. 
         out.println("<p>Using Twilio endpoint " + client.getEndpoint() + ".</p>");

         // Display the API version.
         String APIVERSION = TwilioRestClient.DEFAULT_VERSION;
         out.println("<p>Twilio client API version is " + APIVERSION + ".</p>");

         // Retrieve the values entered by the user.
         String callTo = request.getParameter("callTo");  
         // The Outgoing Caller ID, used for the From parameter,
         // must have previously been verified with Twilio.
         String callFrom = request.getParameter("callFrom");
         String userText = request.getParameter("callText");

         // Replace spaces in the user's text with '%20', 
         // to make the text suitable for a URL.
         userText = userText.replace(" ", "%20");

         // Create a URL using the Twilio message and the user-entered text.
         String Url="https://twimlets.com/message";
         Url = Url + "?Message%5B0%5D=" + userText;

         // Display the message URL.
         out.println("<p>");
         out.println("The URL is " + Url);
         out.println("</p>");

         // Place the call From, To and URL values into a hash map. 
         HashMap<String, String> params = new HashMap<String, String>();
         params.put("From", callFrom);
         params.put("To", callTo);
         params.put("Url", Url);

         CallFactory callFactory = account.getCallFactory();
         Call call = callFactory.create(params);
         out.println("<p>Call status: " + call.getStatus()  + "</p>"); 
    } 
    catch (TwilioRestException e) 
    {
        out.println("<p>TwilioRestException encountered: " + e.getMessage() + "</p>");
        out.println("<p>StackTrace: " + e.getStackTrace().toString() + "</p>");
    }
    catch (Exception e) 
    {
        out.println("<p>Exception encountered: " + e.getMessage() + "");
        out.println("<p>StackTrace: " + e.getStackTrace().toString() + "</p>");
    }
    %>
    </body>
    </html>

In addition to making the call, makecall.jsp displays the Twilio endpoint, API version, and the call status. An example is the following screenshot:

![Azure Call Response Using Twilio and Java][twilio_java_response]

## Run the application
Following are the high-level steps to run your application; details for these steps can be found at [Creating a Hello World Application Using the Azure Toolkit for Eclipse][azure_java_eclipse_hello_world].

1. Export your TwilioCloud WAR to the Azure **approot** folder. 
2. Modify **startup.cmd** to unzip your TwilioCloud WAR.
3. Compile your application for the compute emulator.
4. Start your deployment in the compute emulator.
5. Open a browser, and run `http://localhost:8080/TwilioCloud/callform.jsp`.
6. Enter values in the form, click **Make this call**, and then see the results in makecall.jsp.

When you are ready to deploy to Azure, recompile for deployment to the cloud, deploy to Azure, and run http://*your_hosted_name*.cloudapp.net/TwilioCloud/callform.jsp in the browser (substitute your value for *your_hosted_name*).

## Next steps
This code was provided to show you basic functionality using Twilio in Java on Azure. Before deploying to Azure in production, you may want to add more error handling or other features. For example:

* Instead of using a web form, you could use Azure storage blobs or SQL Database to store phone numbers and call text. For information about using Azure storage blobs in Java, see [How to Use the Blob Storage Service from Java][howto_blob_storage_java]. 
* You could use **RoleEnvironment.getConfigurationSettings** to retrieve the Twilio account ID and authentication token from your deployment's configuration settings, instead of hard-coding the values in makecall.jsp. For information about the **RoleEnvironment** class, see [Using the Azure Service Runtime Library in JSP][azure_runtime_jsp].
* The makecall.jsp code assigns a Twilio-provided URL, [https://twimlets.com/message][twimlet_message_url], to the **Url** variable. This URL provides a Twilio Markup Language (TwiML) response that informs Twilio how to proceed with the call. For example, the TwiML that is returned can contain a **&lt;Say&gt;** verb that results in text being spoken to the call recipient. Instead of using the Twilio-provided URL, you could build your own service to respond to Twilio's request; for more information, see [How to Use Twilio for Voice and SMS Capabilities in Java][howto_twilio_voice_sms_java]. More information about TwiML can be found at [https://www.twilio.com/docs/api/twiml][twiml], and more information about **&lt;Say&gt;** and other Twilio verbs can be found at [https://www.twilio.com/docs/api/twiml/say][twilio_say].
* Read the Twilio security guidelines at [https://www.twilio.com/docs/security][twilio_docs_security].

For additional information about Twilio, see [https://www.twilio.com/docs][twilio_docs].

## See Also
* [How to Use Twilio for Voice and SMS Capabilities in Java][howto_twilio_voice_sms_java]
* [Adding a Certificate to the Java CA Certificate Store][add_ca_cert]

[twilio_pricing]: https://www.twilio.com/pricing
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_api]: https://www.twilio.com/api
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
[twilio_java_github]: https://github.com/twilio/twilio-java
[twimlet_message_url]: https://twimlets.com/message
[twiml]: https://www.twilio.com/docs/api/twiml
[twilio_api_service]: https://api.twilio.com
[add_ca_cert]: java-add-certificate-ca-store.md
[azure_java_eclipse_hello_world]: https://docs.microsoft.com/java/azure/eclipse/azure-toolkit-for-eclipse-create-hello-world-web-app 
[howto_twilio_voice_sms_java]: partner-twilio-java-how-to-use-voice-sms.md
[howto_blob_storage_java]: https://www.windowsazure.com/develop/java/how-to-guides/blob-storage/
[howto_sql_azure_java]: https://msdn.microsoft.com/library/windowsazure/hh749029.aspx
[azure_runtime_jsp]: https://msdn.microsoft.com/library/windowsazure/hh690948.aspx
[twilio_docs_security]: https://www.twilio.com/docs/security
[twilio_docs]: https://www.twilio.com/docs
[twilio_say]: https://www.twilio.com/docs/api/twiml/say
[twilio_java]: ./media/partner-twilio-java-phone-call-example/WA_TwilioJavaCallForm.jpg
[twilio_java_response]: ./media/partner-twilio-java-phone-call-example/WA_TwilioJavaMakeCall.jpg
