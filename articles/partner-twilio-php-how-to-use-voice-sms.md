---
title: How to Use Twilio for Voice and SMS (PHP) | Microsoft Docs
description: Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in PHP.
documentationcenter: php
services: ''
author: devinrader
manager: twilio
editor: mollybos

ms.assetid: 007f22e3-ac75-4868-8315-da000c2e0dd0
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 11/25/2014
ms.author: microsofthelp@twilio.com

---
# How to Use Twilio for Voice and SMS Capabilities in PHP
This guide demonstrates how to perform common programming tasks with the Twilio API service on Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## <a id="WhatIs"></a>What is Twilio?
Twilio is powering the future of business communications, enabling developers to embed voice, VoIP, and messaging into applications. They virtualize all infrastructure needed in a cloud-based, global environment, exposing it through the Twilio communications API platform. Applications are simple to build and scalable. Enjoy flexibility with pay-as-you go pricing, and benefit from cloud reliability.

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** enables your application to send and receive text messages. **Twilio Client** allows you to make VoIP calls from any phone, tablet, or browser and supports WebRTC.

## <a id="Pricing"></a>Twilio Pricing and Special Offers
Azure customers receive a [special offer](http://www.twilio.com/azure): complimentary $10 of Twilio Credit when you upgrade your Twilio Account. This Twilio Credit can be applied to any Twilio usage ($10 credit equivalent to sending as many as 1,000 SMS messages or receiving up to 1000 inbound Voice minutes, depending on the location of your phone number and message or call destination). Redeem this Twilio credit and get started at: [http://ahoy.twilio.com/azure](http://ahoy.twilio.com/azure).

Twilio is a pay-as-you-go service. There are no set-up fees and you can close your account at any time. You can find more details at [Twilio Pricing][twilio_pricing].

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries][twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

### <a id="Verbs"></a>Twilio Verbs
The API makes use of Twilio verbs; for example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call.

The following is a list of Twilio verbs. Learn about the other verbs and capabilities via [Twilio Markup Language documentation](http://www.twilio.com/docs/api/twiml).

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Queue&gt;**: Add the to a queue of callers.
* **&lt;Record&gt;**: Records the caller's voice and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Response>
   <Say>Hello World</Say>
</Response>
```

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the **TwiMLResponse** object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML][twiml]. For additional information about the Twilio API, see [Twilio API][twilio_api].

## <a id="CreateAccount"></a>Create a Twilio Account
When you're ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you'll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio Console][twilio_console], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

## <a id="create_app"></a>Create a PHP Application
A PHP application that uses the Twilio service and is running in Azure is no different than any other PHP application that uses the Twilio service. While Twilio services are REST-based and can be called from PHP in several ways, this article will focus on how to use Twilio services with [Twilio library for PHP from GitHub][twilio_php]. For more information about using the Twilio library for PHP, see [https://twilio.github.io/twilio-php/][twilio_lib_docs].

Detailed instructions for building and deploying a Twilio/PHP application to Azure are available at [How to Make a Phone Call Using Twilio in a PHP Application on Azure][howto_phonecall_php].

## <a id="configure_app"></a>Configure Your Application to Use Twilio Libraries

First, Install the Twilio library for PHP using [composer][composer], then you use composer to install the library with the following command:

```sh
$ composer install twilio/sdk
```

Once you have installed Twilio SDK, you can then use the library as follows:

```php
// Required if your environment does not handle autoloading
require __DIR__ . '/vendor/autoload.php';

// Use the REST API Client to make requests to the Twilio REST API
use Twilio\Rest\Client;

// Your Account SID and Auth Token from twilio.com/console
$sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$token = 'your_auth_token';
$client = new Client($sid, $token);
```

For more information, see [https://github.com/twilio/twilio-php/blob/master/README.md][twilio_github_readme].

## <a id="howto_make_call"></a>How to: Make an outgoing call
The following shows how to make an outgoing call using the **Services_Twilio** class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

```php
// Required if your environment does not handle autoloading
require __DIR__ . '/vendor/autoload.php';

// Use the REST API Client to make requests to the Twilio REST API
use Twilio\Rest\Client;

// Your Account SID and Auth Token from twilio.com/console
$sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$token = 'your_auth_token';
$client = new Client($sid, $token);

// The number of the phone initiating the the call.
$from_number = "NNNNNNNNNNN";

// The number of the phone receiving call.
$to_number = "NNNNNNNNNNN";

// Use the Twilio-provided site for the TwiML response.
$url = "http://twimlets.com/message";

// The phone message text.
$message = "Hello World!";

//Make the call.
try
{
    $call = $client->calls->create(
        $to_number, 
        $from_number,
        ['url' => $url.'?Message='.urlencode($message)]
    );
}
catch (Exception $e) 
{
    echo 'Error: ' . $e->getMessage();
}
```

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses from Your Own Web Site](#howto_provide_twiml_responses).

* **Note**: To troubleshoot SSL certificate validation errors, see [http://readthedocs.org/docs/twilio-php/en/latest/usage/rest.html][ssl_validation] 

## <a id="howto_send_sms"></a>How to: Send an SMS message
The following shows how to send an SMS message using the **Services_Twilio** class. The **From** number is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.

```php
// Required if your environment does not handle autoloading
require __DIR__ . '/vendor/autoload.php';

// Use the REST API Client to make requests to the Twilio REST API
use Twilio\Rest\Client;

// Your Account SID and Auth Token from twilio.com/console
$sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$token = 'your_auth_token';
$client = new Client($sid, $token);

$from_number = "NNNNNNNNNNN"; // With trial account, texts can only be sent from your Twilio number.
$to_number = "NNNNNNNNNNN";
$message = "Hello World!";

// Send the SMS message.
try
{
    $client->messages->create(
        $to_number,
        [
            'from' => $from_number,
            'body' => $message
        ]
    );
}
catch (Exception $e) 
{
    echo 'Error: ' . $e->getMessage();
}
```

## <a id="howto_provide_twiml_responses"></a>How to: Provide TwiML Responses from your own Website
When your application initiates a call to the Twilio API, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Twilio, you can view the it in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.)

Instead of relying on the Twilio-provided URL, you can create your own site that returns HTTP responses. You can create the site in any language that returns XML responses; this topic assumes you'll be using PHP to create the TwiML.

The following PHP page results in a TwiML response that says **Hello World** on the call.

```html
<?php
    header("content-type: text/xml");
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
?>
<Response>
    <Say>Hello world.</Say>
</Response>
```

As you can see from the example above, the TwiML response is simply an XML document. The Twilio library for PHP contains classes that will generate TwiML for you. The example below produces the equivalent response as shown above, but uses the **Twilio\Twiml** class in the Twilio library for PHP:

```php
$response = new Twilio\Twiml();
$response->say('Hello');
print $response;
```

For more information about TwiML, see [https://www.twilio.com/docs/api/twiml][twiml_reference]. 

Once you have your PHP page set up to provide TwiML responses, use the URL of the PHP page as the URL passed into the `Services_Twilio->account->calls->create` method. For example, if you have a Web application named **MyTwiML** deployed to an Azure hosted service, and the name of the PHP page is **mytwiml.php**, the URL can be passed to  **Client->calls->create** as shown in the following example:

```php
// Required if your environment does not handle autoloading
require __DIR__ . '/vendor/autoload.php';

// Use the REST API Client to make requests to the Twilio REST API
use Twilio\Rest\Client;

// Your Account SID and Auth Token from twilio.com/console
$sid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$token = 'your_auth_token';
$client = new Client($sid, $token);

$from_number = "NNNNNNNNNNN";
$to_number = "NNNNNNNNNNN";
$url = "http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.php";

// The phone message text.
$message = "Hello world.";

try
{
    $call = $client->calls->create(
        $to_number, 
        $from_number,
        ['url' => $url.'?Message='.urlencode($message)]
    );
}
catch (Exception $e) 
{
    echo 'Error: ' . $e->getMessage();
}
```

For additional information about using Twilio in Azure with PHP, see [How to Make a Phone Call Using Twilio in a PHP Application on Azure][howto_phonecall_php].

## <a id="AdditionalServices"></a>How to: Use Additional Twilio Services
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Azure application. For full details, see the [Twilio API documentation][twilio_api_documentation].

## <a id="NextSteps"></a>Next Steps
Now that you've learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines][twilio_security_guidelines]
* [Twilio HowTo's and Example Code][twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts]
* [Twilio on GitHub][twilio_on_github]
* [Talk to Twilio Support][twilio_support]

[twilio_php]: https://github.com/twilio/twilio-php
[twilio_lib_docs]: https://www.twilio.com/docs/libraries/php
[twilio_github_readme]: https://github.com/twilio/twilio-php/blob/master/README.md
[ssl_validation]: http://readthedocs.org/docs/twilio-php/en/latest/usage/rest.html
[twilio_api_service]: https://api.twilio.com
[howto_phonecall_php]: partner-twilio-php-make-phone-call.md
[twilio_voice_request]: https://www.twilio.com/docs/api/twiml/twilio_request
[twilio_sms_request]: https://www.twilio.com/docs/api/twiml/sms/twilio_request
[misc_role_config_settings]: http://msdn.microsoft.com/library/windowsazure/hh690945.aspx
[twimlet_message_url]: http://twimlets.com/message
[twimlet_message_url_hello_world]: http://twimlets.com/message?Message%5B0%5D=Hello%20World
[twiml_reference]: https://www.twilio.com/docs/api/twiml
[twilio_pricing]: http://www.twilio.com/pricing
[special_offer]: http://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: https://www.twilio.com/docs/api/twiml
[twilio_api]: https://www.twilio.com/docs/api/rest
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_console]: https://www.twilio.com/console
[verify_phone]: https://www.twilio.com/console/phone-numbers/verified
[twilio_api_documentation]: http://www.twilio.com/docs/api
[twilio_security_guidelines]: http://www.twilio.com/docs/security
[twilio_howtos]: http://www.twilio.com/docs/howto
[twilio_on_github]: https://github.com/twilio
[twilio_support]: http://www.twilio.com/help/contact
[twilio_quickstarts]: http://www.twilio.com/docs/quickstart
[azure_vm_setup]: https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-linux-quick-create-portal
[azure_vm_endpoint_setup]: https://docs.microsoft.com/en-us/azure/virtual-machines/virtual-machines-windows-nsg-quickstart-portal
[azure_nsg]: https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FNetworkSecurityGroups
[azure_ips]: https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Network%2FPublicIpAddresses
[composer]: https://getcomposer.org/doc/00-intro.md#system-requirements
