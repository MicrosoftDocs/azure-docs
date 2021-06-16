---
title: Use Twilio for voice and SMS (Python) | Microsoft Docs
description: Learn how to make a phone call and send an SMS message with the Twilio API service on Azure. Code samples written in Python.
services: ''
documentationcenter: python
author: georgewallace

ms.assetid: 561bc75b-4ac4-40ba-bcba-48e901f27cc3
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: python
ms.topic: article
ms.date: 02/19/2015
ms.author: gwallace
ms.custom: devx-track-python

---
# Use Twilio for voice and SMS capabilities in Python
This article demonstrates how to perform common programming tasks with the Twilio API service on Azure. The covered scenarios include making a phone call and sending a Short Message Service (SMS) message. 

For more information on Twilio and using voice and SMS in your applications, see the [Next steps](#NextSteps) section.

## <a id="WhatIs"></a>What is Twilio?
Twilio enables developers to embed voice, voice over IP (VoIP), and messaging into applications. Developers virtualize all the needed infrastructure in a cloud-based, global environment, exposing it through the Twilio API platform. Applications are simple to build and scalable.

Twilio components include:

- **Twilio Voice**: Allows your applications to make and receive phone calls.
- **Twilio SMS**: Enables your application to send and receive text messages.
- **Twilio Client**: Allows you to make VoIP calls from any phone, tablet, or browser. It supports the WebRTC specification for real-time communication.

## <a id="Pricing"></a>Twilio pricing and special offers
Azure customers receive a [special offer][special_offer]: a $10 Twilio credit when you upgrade your Twilio account. This credit can be applied to any Twilio usage. A $10 credit is equivalent to sending as many as 1,000 SMS messages or receiving up to 1,000 inbound voice minutes, depending on the location of your phone number and message or call destination.

Twilio is a pay-as-you-go service. There are no setup fees, and you can close your account at any time. You can find more details at [Twilio Pricing][twilio_pricing].

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages. For a list, see the [Twilio API libraries][twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

### <a id="Verbs"></a>Twilio verbs
The API uses verbs like these that tell Twilio what to do:

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Queue&gt;**: Adds to a queue of callers.
* **&lt;Record&gt;**: Records the voice of the caller and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you.
* **&lt;Say&gt;**: Converts text to speech that's made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

Learn about the other verbs and capabilities via the [Twilio Markup Language documentation][twiml].

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions based on the Twilio verbs that tell Twilio how to process a call or SMS message.

As an example, the following TwiML would convert the text **Hello World** to speech:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
  <Response>
    <Say>Hello World</Say>
  </Response>
```

When your application calls the [Twilio API][twilio_api], one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to supply the TwiML responses that your applications will use. You can also host your own URLs to produce the TwiML responses, and another option is to use the `TwiMLResponse` object.

## <a id="CreateAccount"></a>Create a Twilio account
When you're ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account and upgrade your account later.

When you sign up for a Twilio account, you receive an account security ID (SID) and an authentication token. You'll need both to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account SID and authentication token are viewable in the [Twilio Console][twilio_console], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**.

## <a id="create_app"></a>Create a Python application
A Python application that uses Twilio and is running in Azure is no different from any other Python application that uses Twilio. Although Twilio services are REST-based and can be called from Python in several ways, this article will focus on how to use Twilio services with the [Twilio library for Python from GitHub][twilio_python]. For more information about using this library, see the [Twilio Python library documentation][twilio_lib_docs].

First, [set up a new Azure Linux virtual machine][azure_vm_setup] to act as a host for your new Python web application. After the virtual machine is running, you'll need to expose your application on a public port.

To add an incoming rule:
  1. Go to the [network security group][azure_nsg] page.
  2. Select the network security group that corresponds with your virtual machine.
  3. Add **Outgoing Rule** information for **port 80**. Be sure to allow incoming calls from any address.

To set the DNS name label:
  1. Go to the [public IP addresses][azure_ips] page.
  2. Select the public IP that corresponds with your virtual machine.
  3. Set the **DNS Name Label** information in the **Configuration** section. In this example, it looks something like *\<your-domain-label\>.centralus.cloudapp.azure.com*.

After you're able to connect through SSH to the virtual machine, you can install the web framework of your choice. The two most well known in Python are [Flask](http://flask.pocoo.org/) and [Django](https://www.djangoproject.com). You can install either of them by running the `pip install` command.

Keep in mind that we configured the virtual machine to allow traffic only on port 80. So be sure to configure the application to use this port.

## <a id="configure_app"></a>Configure your application to use the Twilio library
You can configure your application to use the Twilio library for Python in two ways:

* Install the Twilio library for Python as a Pip package by using the following command:
   
  `$ pip install twilio`

* Download the [Twilio library for Python from GitHub][twilio_python] and install it like this:

  `$ python setup.py install`

After you've installed the Twilio library for Python, you can then import it in your Python files:

`import twilio`

For more information, see the [Twilio GitHub readme](https://github.com/twilio/twilio-python/blob/master/README.md).

## <a id="howto_make_call"></a>Make an outgoing call
The following example shows how to make an outgoing call. This code also uses a Twilio-provided site to return the TwiML response. Substitute your values for the `from_number` and `to_number` phone numbers. Ensure that you've verified the `from_number` phone number for your Twilio account before running the code.

```python
from urllib.parse import urlencode

# Import the Twilio Python Client.
from twilio.rest import TwilioRestClient

# Set your account ID and authentication token.
account_sid = "your_twilio_account_sid"
auth_token = "your_twilio_authentication_token"

# The number of the phone initiating the call.
# This should either be a Twilio number or a number that you've verified.
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
```

> [!IMPORTANT]
> Phone numbers should be formatted with a plus sign and a country code. An example is `+16175551212` (E.164 format). Twilio will also accept unformatted US numbers, such as `(415) 555-1212` or `415-555-1212`.

This code uses a Twilio-provided site to return the TwiML response. You can instead use your own site to provide the TwiML response. For more information, see [Provide TwiML responses from your own website](#howto_provide_twiml_responses).

## <a id="howto_send_sms"></a>Send an SMS message
The following example shows how to send an SMS message by using the `TwilioRestClient` class. Twilio provides the `from_number` number for trial accounts to send SMS messages. The `to_number` number must be verified for your Twilio account before you run the code.

```python
# Import the Twilio Python Client.
from twilio.rest import TwilioRestClient

# Set your account ID and authentication token.
account_sid = "your_twilio_account_sid"
auth_token = "your_twilio_authentication_token"

from_number = "NNNNNNNNNNN"  # With a trial account, texts can only be sent from your Twilio number.
to_number = "NNNNNNNNNNN"
message = "Hello world."

# Initialize the Twilio client.
client = TwilioRestClient(account_sid, auth_token)

# Send the SMS message.
message = client.messages.create(to=to_number,
                                    from_=from_number,
                                    body=message)
```

## <a id="howto_provide_twiml_responses"></a>Provide TwiML responses from your own website
When your application starts a call to the Twilio API, Twilio sends your request to a URL that's expected to return a TwiML response. The preceding example uses the Twilio-provided URL [https://twimlets.com/message][twimlet_message_url]. 

> [!NOTE]
> Although TwiML is designed for use by Twilio, you can view it in your browser. For example, select [https://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element. As another example, select [https://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.

Instead of relying on the Twilio-provided URL, you can create your own site that returns HTTP responses. You can create the site in any language that returns XML responses. This article assumes you'll use Python to create the TwiML.

The following examples will output a TwiML response that says **Hello World** on the call.

With Flask:

```python
from flask import Response
@app.route("/")
def hello():
    xml = '<Response><Say>Hello world.</Say></Response>'
    return Response(xml, mimetype='text/xml')
```

With Django:

```python
from django.http import HttpResponse
def hello(request):
    xml = '<Response><Say>Hello world.</Say></Response>'
    return HttpResponse(xml, content_type='text/xml')
```

As you can see from the preceding example, the TwiML response is simply an XML document. The Twilio library for Python contains classes that will generate TwiML for you. The following example produces the equivalent response as shown earlier, but it uses the `twiml` module in the Twilio library for Python:

```python
from twilio import twiml

response = twiml.Response()
response.say("Hello world.")
print(str(response))
```

For more information about TwiML, see the [TwiML reference][twiml_reference].

After your Python application is set up to provide TwiML responses, use the URL of the application as the URL passed into the `client.calls.create`  method. For example, if you have a web application named *MyTwiML* deployed to an Azure-hosted service, you can use its URL as a webhook, as shown in the following example:

```python
from twilio.rest import TwilioRestClient

account_sid = "your_twilio_account_sid"
auth_token = "your_twilio_authentication_token"
from_number = "NNNNNNNNNNN"
to_number = "NNNNNNNNNNN"
url = "http://your-domain-label.centralus.cloudapp.azure.com/MyTwiML/"

# Initialize the Twilio Client.
client = TwilioRestClient(account_sid, auth_token)

# Make the call.
call = client.calls.create(to=to_number,
                           from_=from_number,
                           url=url)
print(call.sid)
```

## <a id="AdditionalServices"></a>Use additional Twilio services
In addition to the examples shown here, Twilio offers web-based APIs that you can use to get more Twilio functionality from your Azure application. For full details, see the [Twilio API documentation][twilio_api].

## <a id="NextSteps"></a>Next steps
Now that you've learned the basics of the Twilio service, follow these links to learn more:

* [Twilio security guidelines][twilio_security_guidelines]
* [Twilio how-to guides and example code][twilio_howtos]
* [Twilio quickstart tutorials][twilio_quickstarts]
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
[twilio_howtos]: https://www.twilio.com/docs/all
[twilio_on_github]: https://github.com/twilio
[twilio_support]: https://www.twilio.com/help/contact
[twilio_quickstarts]: https://www.twilio.com/docs/quickstart
[azure_ips]: ./virtual-network/virtual-network-public-ip-address.md
[azure_vm_setup]: ./virtual-machines/linux/quick-create-portal.md
[azure_nsg]: ./virtual-network/manage-network-security-group.md