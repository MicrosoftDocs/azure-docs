---
title: How to Use Twilio for Voice and SMS (Java) | Microsoft Docs
description: Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in Java.
services: ''
documentationcenter: java
author: devinrader
manager: twilio
editor: mollybos

ms.assetid: f3508965-5527-4255-9d51-5d5f926f4d43
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 11/25/2014
ms.author: microsofthelp@twilio.com

---
# How to Use Twilio for Voice and SMS Capabilities in Java
This guide demonstrates how to perform common programming tasks with the Twilio API service on Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## <a id="WhatIs"></a>What is Twilio?
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not an Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

## <a id="Pricing"></a>Twilio Pricing and Special Offers
Information about Twilio pricing is available at [Twilio Pricing][twilio_pricing]. Azure customers receive a [special offer][special_offer]: a free credit of 1000 texts or 1000 inbound minutes. To sign up for this offer or get more information, please visit [https://ahoy.twilio.com/azure][special_offer].

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries][twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

### <a id="Verbs"></a>Twilio Verbs
The API makes use of Twilio verbs; for example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call.

The following is a list of Twilio verbs.

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Queue&gt;**: Add the to a queue of callers.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Record&gt;**: Records the caller's voice and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you.
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World!** to speech.

```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
       <Say>Hello World!</Say>
    </Response>
```

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the **TwiMLResponse** object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML][twiml]. For additional information about the Twilio API, see [Twilio API][twilio_api].

## <a id="CreateAccount"></a>Create a Twilio Account
When you're ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you'll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio Console][twilio_console], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

## <a id="create_app"></a>Create a Java Application
1. Obtain the Twilio JAR and add it to your Java build path and your WAR deployment assembly. At [https://github.com/twilio/twilio-java][twilio_java], you can download the GitHub sources and create your own JAR, or download a pre-built JAR (with or without dependencies).
2. Ensure your JDK's **cacerts** keystore contains the Equifax Secure Certificate Authority certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 (the serial number is 35:DE:F4:CF and the SHA1 fingerprint is D2:32:09:AD:23:D3:14:23:21:74:E4:0D:7F:9D:62:13:97:86:63:3A). This is the certificate authority (CA) certificate for the [https://api.twilio.com][twilio_api_service] service, which is called when you use Twilio APIs. For information about ensuring your JDK's **cacerts** keystore contains the correct CA certificate, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert].

Detailed instructions for using the Twilio client library for Java are available at [How to Make a Phone Call Using Twilio in a Java Application on Azure][howto_phonecall_java].

## <a id="configure_app"></a>Configure Your Application to Use Twilio Libraries
Within your code, you can add **import** statements at the top of your source files for the Twilio packages or classes you want to use in your application.

For Java source files:

```java
    import com.twilio.*;
    import com.twilio.rest.api.*;
    import com.twilio.type.*;
    import com.twilio.twiml.*;
```

For Java Server Page (JSP) source files:

```java
    import="com.twilio.*"
    import="com.twilio.rest.api.*"
    import="com.twilio.type.*"
    import="com.twilio.twiml.*"
 ```
 
Depending on which Twilio packages or classes you want to use, your **import** statements may be different.

## <a id="howto_make_call"></a>How to: Make an outgoing call
The following shows how to make an outgoing call using the **Call** class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **from** and **to** phone numbers, and ensure that you verify the **from** phone number for your Twilio account prior to running the code.

```java
    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    String accountSID = "your_twilio_account_SID";
    String authToken = "your_twilio_authentication_token";

    // Initialize the Twilio client.
    Twilio.init(accountSID, authToken);

    // Use the Twilio-provided site for the TwiML response.
    URI uri = new URI("https://twimlets.com/message" +
            "?Message%5B0%5D=Hello%20World%21");

    // Declare To and From numbers
    PhoneNumber to = new PhoneNumber("NNNNNNNNNN");
    PhoneNumber from = new PhoneNumber("NNNNNNNNNN");

    // Create a Call creator passing From, To and URL values
    // then make the call by executing the create() method
    Call.creator(to, from, uri).create();
```

For more information about the parameters passed in to the **Call.creator** method, see [https://www.twilio.com/docs/api/rest/making-calls][twilio_rest_making_calls].

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses in a Java Application on Azure](#howto_provide_twiml_responses).

## <a id="howto_send_sms"></a>How to: Send an SMS message
The following shows how to send an SMS message using the **Message** class. The **from** number, **4155992671**, is provided by Twilio for trial accounts to send SMS messages. The **to** number must be verified for your Twilio account prior to running the code.

```java
    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    String accountSID = "your_twilio_account_SID";
    String authToken = "your_twilio_authentication_token";

    // Initialize the Twilio client.
    Twilio.init(accountSID, authToken);

    // Declare To and From numbers and the Body of the SMS message
    PhoneNumber to = new PhoneNumber("+14159352345"); // Replace with a valid phone number for your account.
    PhoneNumber from = new PhoneNumber("+14158141829"); // Replace with a valid phone number for your account.
    String body = "Where's Wallace?";

    // Create a Message creator passing From, To and Body values
    // then send the SMS message by calling the create() method
    Message sms = Message.creator(to, from, body).create();
```

For more information about the parameters passed in to the **Message.creator** method, see [https://www.twilio.com/docs/api/rest/sending-sms][twilio_rest_sending_sms].

## <a id="howto_provide_twiml_responses"></a>How to: Provide TwiML Responses from your own Website
When your application initiates a call to the Twilio API, for example via the **CallCreator.create** method, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [https://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Web services, you can view the TwiML in your browser. For example, click [https://twimlets.com/message][twimlet_message_url] to see an empty **&lt;Response&gt;** element; as another example, click [https://twimlets.com/message?Message%5B0%5D=Hello%20World%21][twimlet_message_url_hello_world] to see a **&lt;Response&gt;** element that contains a **&lt;Say&gt;** element.)

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses; this topic assumes you'll be hosting the URL in a JSP page.

The following JSP page results in a TwiML response that says **Hello World!** on the call.

```xml
    <%@ page contentType="text/xml" %>
    <Response>
        <Say>Hello World!</Say>
    </Response>
```

The following JSP page results in a TwiML response that says some text, has several pauses, and says information about the Twilio API version and the Azure role name.

```xml
    <%@ page contentType="text/xml" %>
    <Response>
        <Say>Hello from Azure!</Say>
        <Pause></Pause>
        <Say>The Twilio API version is <%= request.getParameter("ApiVersion") %>.</Say>
        <Say>The Azure role name is <%= System.getenv("RoleName") %>.</Say>
        <Pause></Pause>
        <Say>Good bye.</Say>
    </Response>
```

The **ApiVersion** parameter is available in Twilio voice requests (not SMS requests). To see the available request parameters for Twilio voice and SMS requests, see <https://www.twilio.com/docs/api/twiml/twilio_request> and <https://www.twilio.com/docs/api/twiml/sms/twilio_request>, respectively. The **RoleName** environment variable is available as part of an Azure deployment. (If you want to add custom environment variables so they could be picked up from **System.getenv**, see the environment variables section at [Miscellaneous Role Configuration Settings][misc_role_config_settings].)

Once you have your JSP page set up to provide TwiML responses, use the URL of the JSP page as the URL passed into the **Call.creator** method. For example, if you have a Web application named MyTwiML deployed to an Azure hosted service, and the name of the JSP page is mytwiml.jsp, the URL can be passed to **Call.creator** as shown in the following:

```java
    // Declare To and From numbers and the URL of your JSP page
    PhoneNumber to = new PhoneNumber("NNNNNNNNNN");
    PhoneNumber from = new PhoneNumber("NNNNNNNNNN");
    URI uri = new URI("http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.jsp");

    // Create a Call creator passing From, To and URL values
    // then make the call by executing the create() method
    Call.creator(to, from, uri).create();
```

Another option for responding with TwiML is via the **VoiceResponse** class, which is available in the **com.twilio.twiml** package.

For additional information about using Twilio in Azure with Java, see [How to Make a Phone Call Using Twilio in a Java Application on Azure][howto_phonecall_java].

## <a id="AdditionalServices"></a>How to: Use Additional Twilio Services
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Azure application. For full details, see the [Twilio API documentation][twilio_api_documentation].

## <a id="NextSteps"></a>Next Steps
Now that you've learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines][twilio_security_guidelines]
* [Twilio HowTo's and Example Code][twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts]
* [Twilio on GitHub][twilio_on_github]
* [Talk to Twilio Support][twilio_support]

[twilio_java]: https://github.com/twilio/twilio-java
[twilio_api_service]: https://api.twilio.com
[add_ca_cert]: java-add-certificate-ca-store.md
[howto_phonecall_java]: partner-twilio-java-phone-call-example.md
[misc_role_config_settings]: https://msdn.microsoft.com/library/windowsazure/hh690945.aspx
[twimlet_message_url]: https://twimlets.com/message
[twimlet_message_url_hello_world]: https://twimlets.com/message?Message%5B0%5D=Hello%20World%21
[twilio_rest_making_calls]: https://www.twilio.com/docs/api/rest/making-calls
[twilio_rest_sending_sms]: https://www.twilio.com/docs/api/rest/sending-sms
[twilio_pricing]: https://www.twilio.com/pricing
[special_offer]: https://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: https://www.twilio.com/docs/api/twiml
[twilio_api]: https://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_console]:  https://www.twilio.com/console
[verify_phone]: https://www.twilio.com/console/phone-numbers/verified#
[twilio_api_documentation]: https://www.twilio.com/docs
[twilio_security_guidelines]: https://www.twilio.com/docs/security
[twilio_howtos]: https://www.twilio.com/docs/howto
[twilio_on_github]: https://github.com/twilio
[twilio_support]: https://www.twilio.com/help/contact
[twilio_quickstarts]: https://www.twilio.com/docs/quickstart
