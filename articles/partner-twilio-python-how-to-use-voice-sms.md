---
title: How to Use Twilio for Voice and SMS (Python) | Microsoft Docs
description: Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in Python.
services: ''
documentationcenter: python
author: devinrader
manager: twilio
editor: ''

ms.assetid: 561bc75b-4ac4-40ba-bcba-48e901f27cc3
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 02/19/2015
ms.author: MicrosoftHelp@twilio.com

---
# How to Use Twilio for Voice and SMS Capabilities in Python
This guide demonstrates how to perform common programming tasks with the Twilio API service on Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## <a id="WhatIs"></a>What is Twilio?
Twilio is powering the future of business communications, enabling developers to embed voice, VoIP, and messaging into applications. They virtualize all infrastructure needed in a cloud-based, global environment, exposing it through the Twilio communications API platform. Applications are simple to build and scalable. Enjoy flexibility with pay-as-you go pricing, and benefit from cloud reliability.

**Twilio Voice** allows your applications to make and receive phone calls.
**Twilio SMS** enables your application to send and receive text messages.
**Twilio Client** allows you to make VoIP calls from any phone, tablet, or browser and supports WebRTC.

## <a id="Pricing"></a>Twilio Pricing and Special Offers
Azure customers receive a [special offer][special_offer] $10 of Twilio Credit when you upgrade your Twilio Account. This Twilio Credit can be applied to any Twilio usage ($10 credit equivalent to sending as many as 1,000 SMS messages or receiving up to 1000 inbound Voice minutes, depending on the location of your phone number and message or call destination). Redeem this [Twilio credit][special_offer] and get started.

Twilio is a pay-as-you-go service. There are no set-up fees and you can close your account at any time. You can find more details at [Twilio Pricing][twilio_pricing].

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries][twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

### <a id="Verbs"></a>Twilio Verbs
The API makes use of Twilio verbs; for example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call.

The following is a list of Twilio verbs. Learn about the other verbs and capabilities via [Twilio Markup Language documentation][twiml].

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Queue&gt;**: Add the to a queue of callers.
* **&lt;Record&gt;**: Records the voice of the caller and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you.
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
      <Say>Hello World</Say>
    </Response>

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the `TwiMLResponse` object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML][twiml]. For additional information about the Twilio API, see [Twilio API][twilio_api].

## <a id="CreateAccount"></a>Create a Twilio Account
When you are ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you receive an account SID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account SID and authentication token are viewable in the [Twilio Console][twilio_console], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

## <a id="create_app"></a>Create a Python Application
A Python application that uses the Twilio service and is running in Azure is no different than any other Python application that uses the Twilio service. While Twilio services are REST-based and can be called from Python in several ways, this article will focus on how to use Twilio services with [Twilio library for Python from GitHub][twilio_python]. For more information about using the Twilio library for Python, see [https://www.twilio.com/docs/libraries/python][twilio_lib_docs].

First, [set-up a new Azure Linux VM][azure_vm_setup] to act as a host for your new Python web application. Once the Virtual Machine is running, you will need to expose your application on a public port as described below.

### Add An Incoming Rule
  1. Go to the [Network Security Group][azure_nsg] page.
  2. Select the Network Security Group that corresponds with your Virtual Machine.
  3. Add and **Outgoing Rule** for **port 80**. Be sure to allow incoming from any address.

### Set the DNS Name Label
  1. Go to the [The Public IP Addresses][azure_ips] page.
  2. Select the Public IP that corresponds with your Virtual Machine.
  3. Set the **DNS Name Label** in the **Configuration** section. In the case of this example it will look something like this *your-domain-label*.centralus.cloudapp.azure.com

Once you are able to connect through SSH to the Virtual Machine you can install the Web Framework of your choice (the two most well known in Python being [Flask](http://flask.pocoo.org/) and [Django](https://www.djangoproject.com)). You can install either of them just by running the `pip install` command.

Keep in mind that we configured the Virtual Machine to allow traffic only on port 80. So make sure to configure the application to use this port.

## <a id="configure_app"></a>Configure Your Application to Use Twilio Libraries
You can configure your application to use the Twilio library for Python in two ways:

* Install the Twilio library for Python as a Pip package. It can be installed with the following commands:
   
        $ pip install twilio

    -OR-

* Download the Twilio library for Python from GitHub ([https://github.com/twilio/twilio-python][twilio_python]) and install it like this:

        $ python setup.py install

Once you have installed the Twilio library for Python, you can then `import` it in your Python files:

        import twilio

For more information, see [twilio_github_readme](https://github.com/twilio/twilio-python/blob/master/README.rst).

## <a id="howto_make_call"></a>How to: Make an outgoing call
The following shows how to make an outgoing call. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **from_number** and **to_number** phone numbers, and ensure that you've verified the **from_number** phone number for your Twilio account before running the code.

    from urllib.parse import urlencode

    # Import the Twilio Python Client.
    from twilio.rest import TwilioRestClient

    # Set your account ID and authentication token.
    account_sid = "your_twilio_account_sid"
    auth_token = "your_twilio_authentication_token"

    # The number of the phone initiating the call.
    # This should either be a Twilio number or a number that you've verified
    from_number = "NNNNNNNNNNN"

    # The number of the phone receiving call.
    to_number = "NNNNNNNNNNN"

    # Use the Twilio-provided site for the TwiML response.
    url = "https://twimlets.com/message?"

    # The phone message text.
    message = "Hello world."

    # Initialize the Twilio client.
    client = TwilioRestClient(account_sid, auth_token)

    # Make the call.
    call = client.calls.create(to=to_number,
                               from_=from_number,
                               url=url + urlencode({'Message': message}))
    print(call.sid)

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses from Your Own Web Site](#howto_provide_twiml_responses).

## <a id="howto_send_sms"></a>How to: Send an SMS message
The following shows how to send an SMS message using the `TwilioRestClient` class. The **from_number** number is provided by Twilio for trial accounts to send SMS messages. The **to_number** number must be verified for your Twilio account before running the code.

    # Import the Twilio Python Client.
    from twilio.rest import TwilioRestClient

    # Set your account ID and authentication token.
    account_sid = "your_twilio_account_sid"
    auth_token = "your_twilio_authentication_token"

    from_number = "NNNNNNNNNNN"  # With trial account, texts can only be sent from your Twilio number.
    to_number = "NNNNNNNNNNN"
    message = "Hello world."

    # Initialize the Twilio client.
    client = TwilioRestClient(account_sid, auth_token)

    # Send the SMS message.
    message = client.messages.create(to=to_number,
                                     from_=from_number,
                                     body=message)

## <a id="howto_provide_twiml_responses"></a>How to: Provide TwiML Responses from your own Website
When your application initiates a call to the Twilio API, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [https://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Twilio, you can view it in your browser. For example, click [https://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element; as another example, click [https://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.)

Instead of relying on the Twilio-provided URL, you can create your own site that returns HTTP responses. You can create the site in any language that returns XML responses; this topic assumes you will be using Python to create the TwiML.

The following examples will output a TwiML response that says **Hello World** on the call.

With Flask:

    from flask import Response
    @app.route("/")
    def hello():
        xml = '<Response><Say>Hello world.</Say></Response>'
        return Response(xml, mimetype='text/xml')

With Django:

    from django.http import HttpResponse
    def hello(request):
        xml = '<Response><Say>Hello world.</Say></Response>'
        return HttpResponse(xml, content_type='text/xml')

As you can see from the example above, the TwiML response is simply an XML document. The Twilio library for Python contains classes that will generate TwiML for you. The example below produces the equivalent response as shown above, but uses the `twiml` module in the Twilio library for Python:

    from twilio import twiml

    response = twiml.Response()
    response.say("Hello world.")
    print(str(response))

For more information about TwiML, see [https://www.twilio.com/docs/api/twiml][twiml_reference].

Once you have your Python application set up to provide TwiML responses, use the URL of the application as the URL passed into the `client.calls.create`  method. For example, if you have a Web application named **MyTwiML** deployed to an Azure hosted service, you can use its url as webhook as shown in the following example:

    from twilio.rest import TwilioRestClient

    account_sid = "your_twilio_account_sid"
    auth_token = "your_twilio_authentication_token"
    from_number = "NNNNNNNNNNN"
    to_number = "NNNNNNNNNNN"
    url = "http://your-domain-label.centralus.cloudapp.azure.com/MyTwiML/"

    # Initialize the Twilio client.
    client = TwilioRestClient(account_sid, auth_token)

    # Make the call.
    call = client.calls.create(to=to_number,
                               from_=from_number,
                               url=url)
    print(call.sid)

## <a id="AdditionalServices"></a>How to: Use Additional Twilio Services
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Azure application. For full details, see the [Twilio API documentation][twilio_api].

## <a id="NextSteps"></a>Next Steps
Now that you have learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines][twilio_security_guidelines]
* [Twilio HowTo Guides and Example Code][twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts]
* [Twilio on GitHub][twilio_on_github]
* [Talk to Twilio Support][twilio_support]

[special_offer]: https://ahoy.twilio.com/azure
[twilio_python]: https://github.com/twilio/twilio-python
[twilio_lib_docs]: https://www.twilio.com/docs/libraries/python
[twilio_github_readme]: https://github.com/twilio/twilio-python/blob/master/README.md

[twimlet_message_url]: https://twimlets.com/message
[twimlet_message_url_hello_world]: https://twimlets.com/message?Message%5B0%5D=Hello%20World
[twiml_reference]: https://www.twilio.com/docs/api/twiml
[twilio_pricing]: https://www.twilio.com/pricing

[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: https://www.twilio.com/docs/api/twiml
[twilio_api]: https://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_console]:  https://www.twilio.com/console
[twilio_security_guidelines]: https://www.twilio.com/docs/security
[twilio_howtos]: https://www.twilio.com/docs/howto
[twilio_on_github]: https://github.com/twilio
[twilio_support]: https://www.twilio.com/help/contact
[twilio_quickstarts]: https://www.twilio.com/docs/quickstart
