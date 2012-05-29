<properties umbracoNaviHide="0" pageTitle="How to Use Twilio for Voice and SMS Capabilities in PHP" metaKeywords="Windows Azure, Azure, Twilio, Telephony, PHP" metaDescription="Learn how to use Twilio for voice and SMS messages from PHP in Windows Azure." linkid="dev-php-howto-twilio-voice-and-sms-service" urlDisplayName="Twilio Voice/SMS Service" headerExpose="" footerExpose="" disqusComments="1" />

# How to Use Twilio for Voice and SMS Capabilities in PHP
This guide demonstrates how to perform common programming tasks with the Twilio API service on Windows Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## Table of Contents
* [What is Twilio?](#WhatIs)
* [Twilio Pricing](#Pricing)
* [Concepts](#Concepts)
* [Create a Twilio Account](#CreateAccount)
* [Verify Phone Numbers](#VerifyPhoneNumbers)
* [Create a PHP Application](#create_app)
* [Configure Your Application to Use Twilio Libraries](#configure_app)
* [How to: Make an outgoing call](#howto_make_call)
* [How to: Send an SMS message](#howto_send_sms)
* [How to: Provide TwiML Responses from your own Web site](#howto_provide_twiml_responses)

<h2 id="WhatIs">What is Twilio?</h2>
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not a Windows Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

<h2 id="Pricing">Twilio Pricing and Special Offers</h2>
Information about Twilio pricing is available at [Twilio Pricing] [twilio_pricing]. Windows Azure customers receive a [special offer][special_offer]: a free credit of 1000 texts or 1000 inbound minutes. To sign up for this offer or get more information, please visit [http://ahoy.twilio.com/azure][special_offer].  

<h2 id="Concepts">Concepts</h2>
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries] [twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

<h3 id="Verbs">Twilio Verbs</h3>
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

<h2 id="CreateAccount">Create a Twilio Account</h2>
When you’re ready to get a Twilio account, sign up at [Try Twilio] [try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you’ll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio account page] [twilio_account], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

<h2 id="VerifyPhoneNumbers">Verify Phone Numbers</h2>
Various phone numbers need to be verified with Twilio for your account. For example, if you want to place outbound phone calls, the phone number must be verified as an outbound caller ID with Twilio. Similarly, if you want a phone number to receive SMS messages, the receiving phone number must be verified with Twilio. For information on how to verify a phone number, see [Manage Numbers] [verify_phone]. Some of the code below relies on phone numbers that you will need to verify with Twilio.

As an alternative to using an existing number for your applications, you can purchase a Twilio phone number. For information about purchasing a Twilio phone number, see [Twilio Phone Numbers Help](https://www.twilio.com/help/faq/phone-numbers).

<h2 id="create_app">Create a PHP Application</h2>
A PHP application that uses the Twilio service and is running in Windows Azure is no different than any other PHP application that uses the Twilio service. While Twilio services are REST-based and can be called from PHP in several ways, this article will focus on how to use Twilio services with [Twilio library for PHP from Github][twilio_php]. For more information about using the Twilio library for PHP, see [http://readthedocs.org/docs/twilio-php/en/latest/index.html][twilio_lib_docs].

Detailed instructions for building and deploying a Twilio/PHP application to Windows Azure are available at [How to Make a Phone Call Using Twilio in a PHP Application on Windows Azure][howto_phonecall_php].

<h2 id="configure_app">Configure Your Application to Use Twilio Libraries</h2>
You can configure your application to use the Twilio library for PHP in two ways:

1. Download the Twilio library for PHP from Github ([https://github.com/twilio/twilio-php][twilio_php]) and add the **Services** directory to your application.

	-OR-

2. Install the  Twilio library for PHP as a PEAR package. It can be installed with the following commands:

		$ pear channel-discover twilio.github.com/pear
		$ pear install twilio/Services_Twilio

Once you have installed the Twilio library for PHP, you can then add a **require_once** statement at the top of your PHP files to reference the library:

    	require_once 'Services/Twilio.php';

For more information, see [https://github.com/twilio/twilio-php/blob/master/README.md][twilio_github_readme].

<h2 id="howto_make_call">How to: Make an outgoing call</h2>
The following shows how to make an outgoing call using the **Services_Twilio** class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

	// Include the Twilio PHP library.
	require_once 'Services/Twilio.php';

	// Library version.
	$version = "2010-04-01"

	// Set your account ID and authentication token.
	$sid = "your_twilio_account_sid";
	$token = "your_twilio_authentication_token";

	// The number of the phone initiating the the call.
	// (Must be previously validated with Twilio.)
	$from_number = "NNNNNNNNNNN";

	// The number of the phone receiving call.
	$to_number = "NNNNNNNNNNN";

	// Use the Twilio-provided site for the TwiML response.
    $url = "http://twimlets.com/message";
	
	// The phone message text.
	$message = "Hello world.";

	// Create the call client.
	$client = new Services_Twilio($sid, $token, $version);

	//Make the call.
	try
	{
		$call = $client->account->calls->create(
			$from_number, 
			$to_number,
  			$url.'?Message='.urlencode($message)
		);
	}
	catch (Exception $e) 
	{
		echo 'Error: ' . $e->getMessage();
	}

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses from Your Own Website](#howto_provide_twiml_responses).


- **Note**: To troubleshoot SSL certificate validation errors, see [http://readthedocs.org/docs/twilio-php/en/latest/usage/rest.html][ssl_validation] 


<h2 id="howto_send_sms">How to: Send an SMS message</h2>
The following shows how to send an SMS message using the **Services_Twilio** class. The **From** number, **4155992671**, is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.

	// Include the Twilio PHP library.
	require_once 'Services/Twilio.php';

	// Library version.
	$version = "2010-04-01"

	// Set your account ID and authentication token.
	$sid = "your_twilio_account_sid";
	$token = "your_twilio_authentication_token";


    $from_number = "4155992671"; // With trial account, texts can only be sent from this number.
	$to_number = "NNNNNNNNNNN";
	$message = "Hello world.";

	// Create the call client.
	$client = new Services_Twilio($sid, $token, $version);

	// Send the SMS message.
	try
	{
		$client->account->sms_messages->create($from_number, $to_number, $message);
	}
	catch (Exception $e) 
	{
		echo 'Error: ' . $e->getMessage();
	}

<h2 id="howto_provide_twiml_responses">How to: Provide TwiML Responses from your own Web site</h2>
When your application initiates a call to the Twilio API, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Web services, you can view the TwiML in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.)

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses; this topic assumes you’ll be hosting the URL in a PHP page.

The following PHP page results in a TwiML response that says **Hello World** on the call.

    <?php    
		header("content-type: text/xml");    
		echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	?>
	<Response>    
		<Say>Hello world.</Say>
	</Response>

As you can see from the example above, the TwiML response is simply an XML document. The Twilio library for PHP contains classes that will generate TwiML for you. The example below produces the equivalent response as shown above, but uses the **Services_Twilio_Twiml** class in the Twilio library for PHP:

	require_once('Services/Twilio.php');
	
	$response = new Services_Twilio_Twiml();
	$response->say("Hello world.");
	print $response;

For more information about TwiML, see [https://www.twilio.com/docs/api/twiml][twiml_reference]. 

Once you have your PHP page set up to provide TwiML responses, use the URL of the PHP page as the URL passed into the  `Services_Twilio->account->calls->create`  method. For example, if you have a Web application named **MyTwiML** deployed to a Windows Azure hosted service, and the name of the PHP page is **mytwiml.php**, the URL can be passed to  **Services_Twilio->account->calls->create**  as shown in the following example:

	require_once 'Services/Twilio.php';

	$sid = "your_twilio_account_sid";
	$token = "your_twilio_authentication_token";
	$from_number = "NNNNNNNNNNN";
	$to_number = "NNNNNNNNNNN";
    $url = "http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.php";

	$client = new Services_Twilio($sid, $token, "2010-04-01");

	try
	{
		$call = $client->account->calls->create(
			$from_number, 
			$to_number,
  			$url.'?Message='.urlencode($message)
		);
	}
	catch (Exception $e) 
	{
		echo 'Error: ' . $e->getMessage();
	}

For additional information about using Twilio in Windows Azure with PHP, see [How to Make a Phone Call Using Twilio in a PHP Application on Windows Azure][howto_phonecall_php].

<h2 id="AdditionalServices">How to: Use Additional Twilio Services</h2>
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Windows Azure application. For full details, see the [Twilio API documentation] [twilio_api_documentation].

<h2 id="NextSteps">Next Steps</h2>
Now that you’ve learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines] [twilio_security_guidelines]
* [Twilio HowTo’s and Example Code] [twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts] 
* [Twilio on GitHub] [twilio_on_github]
* [Talk to Twilio Support] [twilio_support]

[twilio_php]: https://github.com/twilio/twilio-php
[twilio_lib_docs]: http://readthedocs.org/docs/twilio-php/en/latest/index.html
[twilio_github_readme]: https://github.com/twilio/twilio-php/blob/master/README.md
[ssl_validation]: http://readthedocs.org/docs/twilio-php/en/latest/usage/rest.html
[twilio_api_service]: https://api.twilio.com
[howto_phonecall_php]: howto_phonecall_php.md
[twilio_voice_request]: https://www.twilio.com/docs/api/twiml/twilio_request
[twilio_sms_request]: https://www.twilio.com/docs/api/twiml/sms/twilio_request
[misc_role_config_settings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690945.aspx
[twimlet_message_url]: http://twimlets.com/message
[twimlet_message_url_hello_world]: http://twimlets.com/message?Message%5B0%5D=Hello%20World
[twiml_reference]: https://www.twilio.com/docs/api/twiml
[twilio_pricing]: http://www.twilio.com/pricing
[special_offer]: http://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api]: http://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_account]:  https://www.twilio.com/user/account
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
[twilio_api_documentation]: http://www.twilio.com/api
[twilio_security_guidelines]: http://www.twilio.com/docs/security
[twilio_howtos]: http://www.twilio.com/docs/howto
[twilio_on_github]: https://github.com/twilio
[twilio_support]: http://www.twilio.com/help/contact
[twilio_quickstarts]: http://www.twilio.com/docs/quickstart