<properties umbracoNaviHide="0" pageTitle="Deploying Applications" metaKeywords="Windows Azure deployment, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment, Azure .NET configuration changes, Azure .NET deployment update, Windows Azure C# deployment, Azure C# deployment, Azure C# configuration changes, Azure C# deployment update, Windows Azure VB deployment, Azure VB deployment, Azure VB configuration changes, Azure VB deployment update" metaDescription="Learn how to deploy applications to Windows Azure, make configuration changes, and and make major and minor updates." linkid="dev-net-fundamentals-deploying-applications" urlDisplayName="Deploying Applications" headerExpose="" footerExpose="" disqusCohents="1" />
<div chunk="../chunks/article-left-menu.md" />
# How to Use Twilio for Voice and SMS Capabilities from Windows Azure

This guide demonstrates how to perform common programming tasks with the Twilio API service on Windows Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next steps](#NextSteps) section.

## Table of Contents
* [What is Twilio?](#WhatIs)
* [Twilio pricing](#Pricing)
* [Concepts](#Concepts)
* [Create a Twilio account](#CreateAccount)
* [Verify phone numbers](#VerifyPhoneNumbers)
* [Create a Windows Azure application](#create_app)
* [Configure your application to use Twilio libraries](#configure_app)
* [How to: Make an outgoing call](#howto_make_call)
* [How to: Send an SMS message](#howto_send_sms)
* [How to: Provide TwiML responses from your own web site](#howto_provide_twiml_responses)
* [How to: Use additional Twilio services](#AdditionalServices)
* [Next steps](#NextSteps)

<h2 id="WhatIs">What is Twilio?</h2>
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not a Windows Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

<h2 id="Pricing">Twilio pricing and special offers</h2>
Information about Twilio pricing is available at [Twilio pricing] [twilio_pricing]. Windows Azure customers receive a [special offer][special_offer]: a free credit of 1000 texts or 1000 inbound minutes. To sign up for this offer or get more information, please visit [http://ahoy.twilio.com/azure][special_offer].  

<h2 id="Concepts">Concepts</h2>
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries] [twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

<h3 id="Verbs">Twilio verbs</h3>
The API makes use of Twilio verbs; for example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call. 

The following is a list of Twilio verbs.

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Record&gt;**: Records the caller’s voice and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

<h3 id="TwiML">TwiML</h3>
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
       <Say>Hello World</Say>
    </Response>

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the **TwiMLResponse** object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML] [twiml]. For additional information about the Twilio API, see [Twilio API] [twilio_api].

<h2 id="CreateAccount">Create a Twilio account</h2>
When you’re ready to get a Twilio account, sign up at [Try Twilio] [try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you’ll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio account page] [twilio_account], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

<h2 id="VerifyPhoneNumbers">Verify phone numbers</h2>
Various phone numbers need to be verified with Twilio for your account. For example, if you want to place outbound phone calls, the phone number must be verified as an outbound caller ID with Twilio. Similarly, if you want a phone number to receive SMS messages, the receiving phone number must be verified with Twilio. For information on how to verify a phone number, see [Manage numbers] [verify_phone]. Some of the code below relies on phone numbers that you will need to verify with Twilio.

As an alternative to using an existing number for your applications, you can purchase a Twilio phone number. For information about purchasing a Twilio phone number, see [Twilio Phone Numbers Help](https://www.twilio.com/help/faq/phone-numbers).

<h2 id="create_app">Create a Windows Azure application</h2>
A Windows Azure Application that hosts a Twilio enabled application is no different from any other Windows Azure Application. You simply add the Twilio .NET library and configure the role to use the Twilio .NET libraries.
For information on creating an initial Windows Azure project, see [Creating a Windows Azure project with Visual Studio][vs_project].


<h2 id="configure_app">Configure your application to use Twilio libraries</h2>
Twilio provides a set of .NET helper libraries that wrap various aspects of Twilio to provide simple and easy ways to interact with the Twilio REST API and Twilio Client to generate TwiML responses.

Twilio provides five libraries for .NET developers:
<table border="1">
    <tr>
        <th>Library</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Twilio.API</td>
        <td>The core Twilio library that wraps the Twilio REST API in a friendly .NET library. This library is available for .NET, Silverlight, and Windows Phone 7.</td>
    </tr>
    <tr>
        <td>Twilio.TwiML</td>
        <td>Provides a .NET friendly way to generate TwiML markup.</td>
    </tr>
    <tr>
        <td>Twilio.MVC</td>
        <td>For developers using ASP.NET MVC, this library includes a TwilioController and TwiML ActionResult and request validation attribute.</td>
    </tr>
    <tr>
        <td>Twilio.WebMatrix</td>
        <td>For developers using Microsoft's free WebMatrix development tool, this library contains Razor syntax helpers for various Twilio actions.</td>
    </tr>
    <tr>
        <td>Twilio.Client.Capability</td>
        <td>Contains the Capability token generator for use with the Twilio Client JavaScript SDK.</td>
    </tr>
</table>

Note that all libraries require .NET 3.5, Silverlight 4, or Windows Phone 7 or later.

The samples provided in this guide use the Twilio.API library.

The libraries are provided in binary form on GithHub and can be installed using the NuGet package manager extension available for Visual Studio 2010. The [GitHub repo][twilio_github_repo] site also includes a Wiki that contains complete documentation for using the libraries.

By default, Microsoft Visual Studio 2010 installs version 1.2 of NuGet. Installing the Twilio libraries requires version 1.6 of NuGet or higher. For information on installing or updating NuGet, see [http://nuget.org/][nuget].

Tip: To install the latest verison of NuGet, you must first uninstall the loaded version using the Visual Studio Extension Manager. To do so, you must run Visual Studio as administrator. Otherwise, the uninstall button is disabled.

<h3 id="use_nuget">To add the Twilio libraries to your Visual Studio project</h3>

1.  Open your solution in Visual Studio.
2.  Right click on the **References**.
3.  Click **Manage NuGet Packages...**
4.  Click **Online**.
5.  In the search online box type *twilio*.
6.  Click **Install** on the Twilio package.


<h2 id="howto_make_call">How to: Make an outgoing call</h2>
The following shows how to make an outgoing call using the **TwilioRestClient** class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    string accountSID = "your_twilio_account";
    string authToken = "your_twilio_authentication_token";

    // Create an instance of the Twilio client.
    TwilioRestClient client;
    client = new TwilioRestClient(accountSID, authToken);

    // Use the Twilio-provided site for the TwiML response.
    String Url="http://twimlets.com/message";
    Url = Url + "?Message%5B0%5D=Hello%20World";

    // Instantiate the call options that are passed
    // to the outbound call
    CallOptions options = new CallOptions();


    // Set the call From, To, and URL values to use for the call.
    // This sample uses the sandbox number provided by
    // Twilio to make the call.
    options.From = "+NNNNNNNNNN";
    options.To = "NNNNNNNNNN";
    options.Url = Url;

    // Make the call.
    var call = client.InitiateOutboundCall(options);

For more information about the parameters passed in to the **client.InitiateOutboundCall** method, see [http://www.twilio.com/docs/api/rest/making-calls][twilio_rest_making_calls].

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to: Provide TwiML responses from your own web site](#howto_provide_twiml_responses).

<h2 id="howto_send_sms">How to: Send an SMS message</h2>
The following shows how to send an SMS message using the **TwilioRestClient**  class. The **From** number, **4155992671**, is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.
r
        // Use your account SID and authentication token instead
        // of the placeholders shown here.
        string accountSID = "your_twilio_account";
        string authToken = "your_twilio_authentication_token";

        // Create an instance of the Twilio client.
        TwilioRestClient client;
        client = new TwilioRestClient(accountSID, authToken);

        // Retrieve the account, used later to create an instance
        // of the client.
        Twilio.Account account = client.GetAccount();

        // Send an SMS message.
        SMSMessage result = client.SendSmsMessage(
            "+14155992671", "+12069419717", "This is my SMS message.");

        if (result.RestException != null)
        {
            //an exception occurred making the REST call
            string message = result.RestException.Message;
        }

<h2 id="howto_provide_twiml_responses">How to: Provide TwiML responses from your own web site</h2>
When your application initiates a call to the Twilio API, for example via the **client.InitiateOutboundCall** method, Twilio sends your request to a URL that is expected to return a TwiML response. The example in [How to: Make an outgoing call](#howto_make_call) uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url] to return the response. (While TwiML is designed for use by web services, you can view the TwiML in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty &lt;Response&gt; element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a &lt;Response&gt; element that contains a &lt;Say&gt; element.)

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses; this topic assumes you’ll be hosting the URL from an ASP.NET generic handler.

The following ashx page results in a TwiML response that says **Hello World** on the call.

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    namespace WebRole1
    {
        /// <summary>
        /// Summary description for Handler1
        /// </summary>
        public class Handler1 : IHttpHandler
        {

            public void ProcessRequest(HttpContext context)
            {
                context.Response.Clear();
                context.Response.ContentType = "text/xml";
                context.Response.ContentEncoding = System.Text.Encoding.UTF8;
                string twiMLResponse = "<Response><Say>Hello World</Say></Response>";
                context.Response.Write(twiMLResponse);
                context.Response.End();
            }

            public bool IsReusable
            {
                get
                {
                    return false;
                }
            }
        }
    }

The following ashx page results in a TwiML response that says some text, has several pauses, and reports the Twilio API version.

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    namespace WebRole1
    {
        /// <summary>
        /// Summary description for Handler1
        /// </summary>
        public class Handler1 : IHttpHandler
        {

            public void ProcessRequest(HttpContext context)
            {
                // Instantiate an instance of the Twilio client.
                string accountSID = "ACNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
                string authToken =  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
                var client = new Twilio.TwilioRestClient(accountSID, authToken);

                var twiml = new Twilio.TwiML.TwilioResponse();
                twiml.BeginGather()
                    .Say("Hello from Windows Azure")
                    .Pause()
                    .Say("The Twilio API version is " + client.ApiVersion + ".")
                    .Pause()
                    .Say("Good bye.");
                twiml.EndGather();

                context.Response.Clear();
                context.Response.ContentType = "text/xml";
                context.Response.Write(twiml.ToString());
                context.Response.End();
            }

            public bool IsReusable
            {
                get
                {
                    return false;
                }
            }
        }
    }

To see the available request parameters for Twilio voice and SMS requests, see [https://www.twilio.com/docs/api/twiml/twilio\_request][twilio_voice_request] and [https://www.twilio.com/docs/api/twiml/sms/twilio\_request][twilio_sms_request], respectively.

Once you have your handler set up to provide TwiML responses, use the URL of the page as the URL passed into the **client.InitiateOutboundCall** method. For example, if you have a web application named MyTwiML deployed to a Windows Azure hosted service, and the name of the cshtml page is mytwiml.ashx, the URL can be passed to **client.InitiateOutboundCall** as shown in the following:

    // Place the call From, To, and URL values into a hash map.
    // This sample uses the sandbox number provided by Twilio to make the call.
    options.From = "NNNNNNNNNN";
    options.To = "NNNNNNNNNN";
    options.Url = "http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.ashx";

    // Place the call.
    var call = client.InitiateOutboundCall(options);


For additional information about using Twilio on Windows Azure with ASP.NET, see [How to make a phone call using Twilio in a web role on Windows Azure][howto_phonecall_dotnet].

<div chunk="../../Shared/Chunks/twilio_additional_services_and_next_steps.md" />

[twilio_java]: https://github.com/twilio/twilio-java

[twilio_api_service]: https://api.twilio.com
[add_ca_cert]: add_ca_cert.md
[howto_phonecall_dotnet]: ../twilio-phone-call/
[twilio_voice_request]: https://www.twilio.com/docs/api/twiml/twilio_request
[twilio_sms_request]: https://www.twilio.com/docs/api/twiml/sms/twilio_request
[misc_role_config_settings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690945.aspx
[twimlet_message_url]: http://twimlets.com/message
[twimlet_message_url_hello_world]: http://twimlets.com/message?Message%5B0%5D=Hello%20World
[twilio_rest_making_calls]: http://www.twilio.com/docs/api/rest/making-calls
[twilio_rest_sending_sms]: http://www.twilio.com/docs/api/rest/sending-sms
[vs_project]:http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx
[nuget]:http://nuget.org/
[twilio_github_repo]:https://github.com/twilio/twilio-csharp

[twilio_pricing]: http://www.twilio.com/pricing
[special_offer]: http://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api]: http://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_account]:  https://www.twilio.com/user/account
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
