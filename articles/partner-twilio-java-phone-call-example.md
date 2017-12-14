---
title: How to Make a phone call from Twilio (Java) | Microsoft Docs
description: Learn how to make a phone call from a web page using Twilio in a Java application on Azure.
services: ''
documentationcenter: java
author: devinrader
manager: twilio
editor: mollybos

ms.assetid: 0381789e-e775-41a0-a784-294275192b1d
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 11/25/2014
ms.author: microsofthelp@twilio.com

---
# How to Make a Phone Call Using Twilio in a Java Application on Azure
The following example shows you how you can use Twilio to make a call from a web page hosted in Azure. The resulting application will prompt the user for phone call values, as shown in the following screen shot.

![Azure Call Form Using Twilio and Java][twilio_java]

You'll need to do the following to use the code in this topic:

1. Acquire a Twilio account and authentication token. To get started with Twilio, evaluate pricing at [http://www.twilio.com/pricing][twilio_pricing]. You can sign up at [https://www.twilio.com/try-twilio][try_twilio]. For information about the API provided by Twilio, see [http://www.twilio.com/docs][twilio_api].

  When you sign up for a Twilio account, you'll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio Console][twilio_console], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.
1. Obtain the Twilio JAR. At [https://github.com/twilio/twilio-java][twilio_java_github], you can download the GitHub sources and create your own JAR, download it from the [public repository][twilio-java-maven-repo] or configure it as a dependency on your favorite build tool.
   The code in this topic was written using the twilio-7.5.0 JAR.
1. Add the JAR to your Java build path.
1. If you are using Eclipse to create this Java application, include the Twilio JAR in your application deployment file (WAR) using Eclipse's deployment assembly feature. If you are not using Eclipse to create this Java application, ensure the Twilio JAR is included within the same Azure role as your Java application, and added to the class path of your application.
1. Ensure your cacerts keystore contains the Equifax Secure Certificate Authority certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 (the serial number is 35:DE:F4:CF and the SHA1 fingerprint is D2:32:09:AD:23:D3:14:23:21:74:E4:0D:7F:9D:62:13:97:86:63:3A). This is the certificate authority (CA) certificate for the [https://api.twilio.com][twilio_api_service] service, which is called when you use Twilio APIs. For information about adding this CA certificate to your JDK's cacert store, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert].

Additionally, familiarity with the information at [Creating a Hello World Application Using the Azure Toolkit for Eclipse][azure_java_eclipse_hello_world], or with other techniques for hosting Java applications in Azure if you are not using Eclipse, is highly recommended.

## Create a web form for making a call
The following code shows how to create a web form to retrieve user data for making a call. For purposes of this example, a new dynamic web project, named **TwilioCloud**, was created, and **callform.jsp** was added as a JSP file.

```html
    <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
        pageEncoding="ISO-8859-1" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
```

## Create the code to make the call
The following code, which is called when the user completes the form displayed by callform.jsp, creates the call message and generates the call. For purposes of this example, the JSP file is named **makecall.jsp** and was added to the **TwilioCloud** project. (Use your Twilio account and authentication token instead of the placeholder values assigned to **accountSID** and **authToken** in the code below.)

```java
    <%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    import="java.util.*"
    import="java.net.URI"
    import="com.twilio.Twilio"
    import="com.twilio.exception.TwilioException"
    import="com.twilio.rest.api.v2010.account.Call"
    import="com.twilio.type.PhoneNumber"
    pageEncoding="ISO-8859-1" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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
         String accountSID = "your_twilio_account_SID";
         String authToken = "your_twilio_authentication_token";

         // Initialize the Twilio client.
         Twilio.init(accountSID, authToken);

         // Retrieve the values entered by the user.
         PhoneNumber callTo = new PhoneNumber(request.getParameter("callTo"));
         // The Outgoing Caller ID, used for the From parameter,
         // must have previously been verified with Twilio.
         PhoneNumber callFrom = new PhoneNumber(request.getParameter("callFrom"));
         String userText = request.getParameter("callText");

         // Replace spaces in the user's text with '%20',
         // to make the text suitable for a URL.
         userText = userText.replace(" ", "%20");

         // Create a URL using the Twilio message and the user-entered text.
         URI url = new URI("http://twimlets.com/message?Message%5B0%5D=" + userText);

         // Display the message URL.
         out.println("<p>");
         out.println("The URL is " + url.toString());
         out.println("</p>");

         Call call = Call.creator(callTo, callFrom, url).create();
         out.println("<p>Call status: " + call.getStatus()  + "</p>");

         // Display the API version.
         out.println("<p>Twilio client API version is " + call.getApiVersion() + ".</p>");
     }
     catch (TwilioException e)
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
```
In addition to making the call, makecall.jsp displays the Twilio API version and the call status. An example is the following screen shot:

![Azure Call Response Using Twilio and Java][twilio_java_response]

## Run the application
Following are the high-level steps to run your application; details for these steps can be found at [Creating a Hello World Application Using the Azure Toolkit for Eclipse][azure_java_eclipse_hello_world].

1. Export your TwilioCloud WAR to the Azure **approot** folder.
2. Modify **startup.cmd** to unzip your TwilioCloud WAR.
3. Compile your application for the compute emulator.
4. Start your deployment in the compute emulator.
5. Open a browser, and run **http://localhost:8080/TwilioCloud/callform.jsp**.
6. Enter values in the form, click **Make this call**, and then see the results in **makecall.jsp**.

When you are ready to deploy to Azure, recompile for deployment to the cloud, deploy to Azure, and run http://*your_hosted_name*.cloudapp.net/TwilioCloud/callform.jsp in the browser (substitute your value for *your_hosted_name*).

## Next steps
This code was provided to show you basic functionality using Twilio in Java on Azure. Before deploying to Azure in production, you may want to add more error handling or other features. For example:

* Instead of using a web form, you could use Azure storage blobs or SQL Database to store phone numbers and call text. For information about using Azure storage blobs in Java, see [How to Use the Blob Storage Service from Java][howto_blob_storage_java].
* You could use **RoleEnvironment.getConfigurationSettings** to retrieve the Twilio account SID and authentication token from your deployment's configuration settings, instead of hard-coding the values in makecall.jsp. For information about the **RoleEnvironment** class, see the Azure Service Runtime package documentation at [http://dl.windowsazure.com/javadoc][azure_javadoc].
* The makecall.jsp code assigns a Twilio-provided URL, [http://twimlets.com/message][twimlet_message_url], to the **url** variable. This URL provides a Twilio Markup Language (TwiML) response that informs Twilio how to proceed with the call. For example, the TwiML that is returned can contain a **&lt;Say&gt;** verb that results in text being spoken to the call recipient. Instead of using the Twilio-provided URL, you could build your own service to respond to Twilio's request; for more information, see [How to Use Twilio for Voice and SMS Capabilities in Java][howto_twilio_voice_sms_java]. More information about TwiML can be found at [http://www.twilio.com/docs/api/twiml][twiml], and more information about **&lt;Say&gt;** and other Twilio verbs can be found at [http://www.twilio.com/docs/api/twiml/say][twilio_say].
* Read the Twilio security guidelines at [https://www.twilio.com/docs/security][twilio_docs_security].

For additional information about Twilio, see [https://www.twilio.com/docs][twilio_docs].

## See Also
* [How to Use Twilio for Voice and SMS Capabilities in Java][howto_twilio_voice_sms_java]
* [Adding a Certificate to the Java CA Certificate Store][add_ca_cert]

[twilio_pricing]: http://www.twilio.com/pricing
[try_twilio]: http://www.twilio.com/try-twilio
[twilio_api]: http://www.twilio.com/docs
[verify_phone]: https://www.twilio.com/console/phone-numbers/verified#
[twilio_java_github]: http://github.com/twilio/twilio-java
[twimlet_message_url]: http://twimlets.com/message
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api_service]: http://api.twilio.com
[add_ca_cert]: java-add-certificate-ca-store.md
[azure_java_eclipse_hello_world]: https://docs.microsoft.com/en-us/azure/azure-toolkit-for-eclipse-creating-a-hello-world-application
[howto_twilio_voice_sms_java]: partner-twilio-java-how-to-use-voice-sms.md
[howto_blob_storage_java]: https://docs.microsoft.com/en-us/azure/storage/storage-java-how-to-use-blob-storage
[azure_runtime_jsp]: http://msdn.microsoft.com/library/windowsazure/hh690948.aspx
[azure_javadoc]: http://azure.github.io/azure-sdk-for-java/
[twilio_docs_security]: http://www.twilio.com/docs/api/security
[twilio_docs]: http://www.twilio.com/docs
[twilio_say]: http://www.twilio.com/docs/api/twiml/say
[twilio_java]: ./media/partner-twilio-java-phone-call-example/WA_TwilioJavaCallForm.jpg
[twilio_java_response]: ./media/partner-twilio-java-phone-call-example/WA_TwilioJavaMakeCall.jpg
[twilio-java-maven-repo]: http://mvnrepository.com/artifact/com.twilio.sdk/twilio
[twilio_console]:  https://www.twilio.com/console
