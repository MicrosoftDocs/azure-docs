# How to Use Twilio for Voice and SMS Capabilities in a Web Role
<div chunk="././Shared/Chunks/how_to_use_twilio_opening_and_common_toc" />

* [Create a Windows Azure Web role](#create_app)
* [Configure Your Application to Use Twilio Libraries](#configure_app)
* [How to: Make an outgoing call](#howto_make_call)
* [How to: Send an SMS message](#howto_send_sms)
* [How to: Provide TwiML Responses from your own Web site](#howto_provide_twiml_responses)

<div chunk="././Shared/Chunks/how_to_use_twilio_for_voice_and_sms_capabilities" />

<h2 id="create_app">Create a Windows Azure Web role</h2>
A Web role that hosts a Twilio enabled application is no different from any other Windows Azure Web role. You simply add the Twilio .NET library and configure the role to use the Twilio .NET libraries.
For information on creating an intial Windows Azure project implementing a Web role, see [http://msdn.microsoft.com/en-us/library/ee405487.aspx][vs_project].


<h2 id="configure_app">Configure Your Application to Use Twilio Libraries</h2>
Twilio provides a set of .NET helper libraries that wrap various aspects of Twilio to provide simple and easy ways to interact with the Twilio REST API, Twilio Client and to generate TwiML responses.

Twilio provides five libraries for .NET developers:
<table border="1">
    <tr>
        <th>Library</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>
    <tr>
        <td>Twilio.API</td>
        <td>The core Twilio library that wraps the Twilio REST API in a friendly .NET library. This library is available in .NET, Silverlight and Windows Phone 7 flavors.</td>
    </tr>        
    <tr>
        <td>Twilio.TwiML</td>
        <td>Provides a .NET friendly way to generate TwiML markup</td>
    </tr>  
    <tr>
        <td>Twilio.MVC</td>
        <td>For developers using ASP.NET MVC, this library includes a TwilioController and TwiML ActionResult and request validation attribute</td>
    </tr>  
    <tr>
        <td>Twilio.WebMatrix</td>
        <td>For developers using Microsoft free WebMatrix development tool, this library contains Razor syntax helpers for various Twilio actions</td>
    </tr>  
    <tr>
        <td>Twilio.Client.Capability</td>
        <td>Contains the Capability token generator for use with the Twilio Client JavaScript SDK</td>
    </tr>  
</table>  

Note that all libraries require .NET 3.5, Silverlight 4 or Windows Phone 7 or later.

The samples provided in this guide use the Twilio.API library.

The libraries are provided in binary form on GithHub and can be installed using through the NuGet package manager extension available for Visual Studio 2010. The GitHub site also includes a Wiki that contains complete documentation for using the libraries. 
Installing the Twilio libraries requires version 1.6 of NuGet or higher. For information on installing or updating NuGet, see [http://nuget.org/][nuget].

Tip: If you try to uninstall NuGet via the Visual Studio Extension Manager, you may notice that the Uninstall button is disabled. NuGet requires admin access to install and uninstall. Relaunch Visual Studio as an administrator to uninstall the extension. NuGet does not require admin access to use it.

<h3 id="use_nuget">To add the Twilio libraries to your Web role Visual Studio solution.</h3>

1.	Open your solution in Visual Studio.
2.	Right click on the References.
3.	Click Manage NuGet Packages...
4.	Click Online.
5.	In the search online box type twilio.
6.	Click Install on the Twilio package.


<h2 id="howto_make_call">How to: Make an outgoing call</h2>
The following shows how to make an outgoing call using the `TwilioRestClient` class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    string accountSID = "your_twilio_account";
    string authToken = "your_twilio_authentication_token";

    // Create an instance of the Twilio client.
    TwilioRestClient client;
    client = new TwilioRestClient(accountSID, authToken);

    // Retrieve the account, used later to create an instance of the CallFactory.
    Twilio.Account account = client.GetAccount();

    // Use the Twilio-provided site for the TwiML response.
    String Url="http://twimlets.com/message";
    Url = Url + "?Message%5B0%5D=Hello%20World";

    // Place the call From, To, and URL values into a hash map.
    // This sample uses the sandbox number provided by Twilio to make the call.
    options.From = "+NNNNNNNNNN";
    options.To = "NNNNNNNNNN";
    options.Url = Url;

    // Make the call.
	var call = client.InitiateOutboundCall(options);

For more information about the parameters passed in to the `client.InitiateOutboundCall` method, see [http://www.twilio.com/docs/api/rest/making-calls][twilio_rest_making_calls].

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to: TwiML Responses from your own Web site](#howto_provide_twiml_responses).

<h2 id="howto_send_sms">How to: Send an SMS message</h2>
The following shows how to send an SMS message using the `SmsFactory` class. The **From** number, **4155992671**, is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.

	    // Use your account SID and authentication token instead of the placeholders shown here.
   	 	string accountSID = "your_twilio_account";
	    string authToken = "your_twilio_authentication_token";
	
	    // Create an instance of the Twilio client.
	    TwilioRestClient client;
	    client = new TwilioRestClient(accountSID, authToken);
	
	    // Retrieve the account, used later to create an instance of the SmsFactory.
	    Twilio.Account account = client.GetAccount();
	
	    // Send an SMS message.
	    SMSMessage result = client.SendSmsMessage("+14155992671", "+12069419717", "This is my SMS message.");
	
	    if (result.RestException != null)
	    {
	        //an exception occurred making the REST call
	        string message = result.RestException.Message;
	    }

<h2 id="howto_provide_twiml_responses">How to: TwiML Responses from your own Web site</h2>
When your application initiates a call to the Twilio API, for example via the `client.InitiateOutboundCall` method, Twilio sends your request to a URL that is expected to return a TwiML response. The example in [How to: Make an outgoing call](#howto_make_call) uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url] to return the response. (While TwiML is designed for use by Web services, you can view the TwiML in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.)

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
	            string authToken = 	"NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
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

Once you have your handler set up to provide TwiML responses, use the URL of the page as the URL passed into the `CallFactory.create` method. For example, if you have a Web application named MyTwiML deployed to a Windows Azure hosted service, and the name of the cshtml page is mytwiml.ashx, the URL can be passed to `CallFactory.create` as shown in the following:

    // Place the call From, To, and URL values into a hash map.
    // This sample uses the sandbox number provided by Twilio to make the call.
    options.From = "NNNNNNNNNN";
    options.To = "NNNNNNNNNN";
    options.Url = "http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.ashx";

    // Place the call.
    var call = client.InitiateOutboundCall(options);


For additional information about using Twilio on Windows Azure with ASP.NET, see [How to Make a Phone Call Using Twilio in a Web Role on Windows Azure][howto_phonecall_dotnet].

<div chunk="././Shared/Chunks/twilio_additional_services_and_next_steps" />

[twilio_java]: https://github.com/twilio/twilio-java

[twilio_api_service]: https://api.twilio.com
[add_ca_cert]: add_ca_cert.md
[howto_phonecall_dotnet]: howto_phonecall_dotnet.md
[twilio_voice_request]: https://www.twilio.com/docs/api/twiml/twilio_request
[twilio_sms_request]: https://www.twilio.com/docs/api/twiml/sms/twilio_request
[misc_role_config_settings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690945.aspx
[twimlet_message_url]: http://twimlets.com/message
[twimlet_message_url_hello_world]: http://twimlets.com/message?Message%5B0%5D=Hello%20World
[twilio_rest_making_calls]: http://www.twilio.com/docs/api/rest/making-calls
[twilio_rest_sending_sms]: http://www.twilio.com/docs/api/rest/sending-sms
[vs_project]:http://msdn.microsoft.com/en-us/library/ee405487.aspx
[nuget]:http://nuget.org/