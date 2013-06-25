<properties linkhref="develop-python-how-to-twilio-sms-service" urlDisplayName="Twilio Voice/SMS Service" pageTitle="How to Use Twilio for Voice and SMS (Python) - Windows Azure" metaKeywords="Windows Azure Python Twilio, Windows Azure phone calls, Azure phone calls, Azure twilio, Windows Azure SMS, Azure SMS, Windows Azure voice calls, azure voice calls, Windows Azure text messages, Azure text messages" metaDescription="Learn how to make a phone call and send a SMS message with the Twilio API service on Windows Azure. Code samples written in Python." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />

<div chunk="../chunks/article-left-menu.md" />

# How to Use Twilio for Voice and SMS Capabilities in Python
This guide demonstrates how to perform common programming tasks with the Twilio API service on Windows Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## Table of Contents
* [What is Twilio?](#WhatIs)
* [Twilio Pricing](#Pricing)
* [Concepts](#Concepts)
* [Create a Twilio Account](#CreateAccount)
* [Verify Phone Numbers](#VerifyPhoneNumbers)
* [Create a Python Application](#create_app)
* [Configure Your Application to Use Twilio Libraries](#configure_app)
* [How to: Make an outgoing call](#howto_make_call)
* [How to: Send an SMS message](#howto_send_sms)
* [How to: Provide TwiML Responses from your own Web site](#howto_provide_twiml_responses)

<h2><a href="#WhatIs"></a>What is Twilio?</h2>
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not a Windows Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

<h2><a href="#Pricing"></a>Twilio Pricing and Special Offers</h2>
Information about Twilio pricing is available at [Twilio Pricing] [twilio_pricing]. Windows Azure customers receive a [special offer][special_offer]: a free credit of 1000 texts or 1000 inbound minutes. To sign up for this offer or get more information, please visit [http://ahoy.twilio.com/azure][special_offer].  

<h2><a href="#Concepts"></a>Concepts</h2>
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries] [twilio_libraries].

Key aspects of the Twilio API are Twilio verbs and Twilio Markup Language (TwiML).

<h3><a href="#Verbs"></a>Twilio Verbs</h3>
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

<h3><a href="#TwiML"></a>TwiML</h3>
TwiML is a set of XML-based instructions based on the Twilio verbs that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
       <Say>Hello World</Say>
    </Response>

When your application calls the Twilio API, one of the API parameters is the URL that returns the TwiML response. For development purposes, you can use Twilio-provided URLs to provide the TwiML responses used by your applications. You could also host your own URLs to produce the TwiML responses, and another option is to use the **TwiMLResponse** object.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML] [twiml]. For additional information about the Twilio API, see [Twilio API] [twilio_api].

<h2><a href="#CreateAccount"></a>Create a Twilio Account</h2>
When you’re ready to get a Twilio account, sign up at [Try Twilio] [try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you’ll receive an account ID and an authentication token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account ID and authentication token are viewable at the [Twilio account page] [twilio_account], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

<h2><a href="#VerifyPhoneNumbers"></a>Verify Phone Numbers</h2>
Various phone numbers need to be verified with Twilio for your account. For example, if you want to place outbound phone calls, the phone number must be verified as an outbound caller ID with Twilio. Similarly, if you want a phone number to receive SMS messages, the receiving phone number must be verified with Twilio. For information on how to verify a phone number, see [Manage Numbers] [verify_phone]. Some of the code below relies on phone numbers that you will need to verify with Twilio.

As an alternative to using an existing number for your applications, you can purchase a Twilio phone number. For information about purchasing a Twilio phone number, see [Twilio Phone Numbers Help](https://www.twilio.com/help/faq/phone-numbers).

<h2><a href="#create_app"></a>Create a Python Application</h2>
A Python application that uses the Twilio service and is running in Windows Azure is no different than any other Python application that uses the Twilio service. While Twilio services are REST-based and can be called from your Python app in several ways, this article will focus on how to use Twilio services with [Twilio library for Python from Github][twilio_python]. For more information about using the Twilio library for Python, see [https://twilio-python.readthedocs.org/en/latest/][the full documentation].

To set up a Python app on Azure, follow this [step-by-step guide](http://www.windowsazure.com/en-us/develop/python/tutorials/web-app-with-django/).  For the examples below, we will be using the Flask microframework.  This example will require a webserver to proxy the Flask test webserver that sits on port 5000.  For instructions on setting up an Azure VM for Flask, see this [step-by-step guide](http://sodesne.com/blog/2012/11/26/publishing-a-flask-app-with-azure).

<h2><a href="#configure_app"></a>Configure Your Application to Use Twilio Libraries</h2>
You can configure your application to use the Twilio library for Python in two ways:

1. Download the Twilio module for Python from Github ([https://github.com/twilio/twilio-python][twilio-python]). 

	-OR-

2. Install the Twilio library for Python using pip. It can be installed with the following commands:

		$ pip install twilio 

For more information on installation, see [the full installation instructions](https://twilio-python.readthedocs.org/en/latest/#installation).

<h2><a href="#howto_make_call"></a>How to: Make an outgoing call</h2>
The following shows how to make an outgoing call using the **twilio.rest** submodule.   This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

    # Import the helper class for the Twilio REST API.
    from twilio.rest import TwilioRestClient
    # import the Twilio REST client's exception for error handling.
    from twilio import TwilioRestException

    # Set your account ID and authentication token.
    ACCOUNT_SID = 'ACxxxxxxxx'
    AUTH_TOKEN = 'yyyyyyyyyyy'

    # The number of the phone initiating the the call.
    # (Must be previously validated with Twilio.)
    from_number = "+NNNNNNNNNNN";

    # The number of the phone receiving call.
    to_number = "+NNNNNNNNNNN";

    # Use the Twilio-provided site for the TwiML response.
    twiml_response = "http://twimlets.com/message?Message=Hello+World";

    # Create the call client.
    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN);

    #Make the call.
    try:
        client.calls.create(from_=from_number, to=to_number, url=twiml_response)
        print "Placing call to %s..." % from_number
    except TwilioRestException, e:
        print str(e)


As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses from Your Own Web Site](#howto_provide_twiml_responses).



<h2><a href="#howto_send_sms"></a>How to: Send an SMS message</h2>
The following shows how to send an SMS message using the **twilio.rest** submodule. The **From** number, **(415) 599-2671**, is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.

    # Import the helper class for the Twilio REST API.
    from twilio.rest import TwilioRestClient
    # import the Twilio REST client's exception for error handling.
    from twilio import TwilioRestException

    # Set your account ID and authentication token.
    ACCOUNT_SID = 'ACxxxxxxxx'
    AUTH_TOKEN = 'yyyyyyyyyyy'

    # The number of the phone initiating the the call.
    # (Must be previously validated with Twilio.)
    from_number = "+NNNNNNNNNNN";

    # The number of the phone receiving call.
    to_number = "+NNNNNNNNNNN";

    # Instantiate the Twilio REST API client.
    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN);

    # Send the SMS message.
    try:
        client.sms.messages.create(from_=from_number, to=to_number, body="Hello world!")
        print "Sending SMS to %s..." % from_number
    except TwilioRestException, e:
        print str(e)


<h2><a href="#howto_provide_twiml_responses"></a>How to: Provide TwiML Responses from your own Web site</h2>
When your application initiates a call to the Twilio API, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Web services, you can view the TwiML in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty `<Response>` element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a `<Response>` element that contains a `<Say>` element.)

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses; this topic assumes you’ll be hosting the URL in a Python app.

For this example, we'll use the popular [Flask web microframework](http://flask.pocoo.org/). However, Twilio and Microsoft Azure will work with any Python web framework you would prefer to use. 

The following Python Flask app creates a TwiML response that says **Hello World** on the endpoint `/voice`.

    # Import the Flask microframework
    from flask import Flask
    # Import Twilio's TwiML generator
    from twilio import twiml

    # Instantiate our Flask app.
    app = Flask(__name__)

    # Create an endpoint /voice that returns a TwiML response.
    @app.route('/voice', methods=['GET', 'POST'])
    def voice():
        response = twiml.Response()
        response.say("Hello World!")
        return str(response)

    # Run the Flask app
    if __name__ == "__main__":
        app.run()

**Note:** By default, Flask runs on port 5000.  To view this port on your Azure VM, be sure to set up a webserver to proxy web requests to port 5000.  For full instructions on how to do this, view this [step-by-step guide](http://sodesne.com/blog/2012/11/26/publishing-a-flask-app-with-azure).

As you can see from the example above, the TwiML response is simply an XML document. The Twilio module for Python contains classes that will generate TwiML for you. 

For more information about TwiML, see [https://www.twilio.com/docs/api/twiml][twiml_reference]. 

Once you have your Python Flask app set up to provide TwiML responses, use the URL of the Flask route returning the TwiML response  as the URL passed into the  `client.calls.create`  method. For example, if you have a Web application named **MyTwiML** deployed to a Windows Azure hosted service, and the name of the Python Flask endpoint is **/voice**, the URL can be passed to `client.calls.create` as shown in the following example:

    # Import the helper class for the Twilio REST API.
    from twilio.rest import TwilioRestClient
    # import the Twilio REST client's exception for error handling.
    from twilio import TwilioRestException

    # Set your account ID and authentication token.
    ACCOUNT_SID = 'ACxxxxxxxx'
    AUTH_TOKEN = 'yyyyyyyyyyy'

    # The number of the phone initiating the the call.
    # (Must be previously validated with Twilio.)
    from_number = "+NNNNNNNNNNN";

    # The number of the phone receiving call.
    to_number = "+NNNNNNNNNNN";

    # Use the Flask app we created above as the TwiML response.
    twiml_response = "http://<insert_name_of_azure_vm>.cloudapp.net/voice";

    # Create the call client.
    client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN);

    # Make the call.
    try:
        client.calls.create(from_=from_number, to=to_number, url=twiml_response)
        print "Placing call to %s..." % from_number
    except TwilioRestException, e:
        print str(e)

<h2><a href="#AdditionalServices"></a>How to: Use Additional Twilio Services</h2>
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Windows Azure application. For full details, see the [Twilio API documentation] [twilio_api_documentation].

<h2><a href="#NextSteps"></a>Next Steps</h2>
Now that you’ve learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines] [twilio_security_guidelines]
* [Twilio HowTo’s and Example Code] [twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts] 
* [Twilio on GitHub] [twilio_on_github]
* [Talk to Twilio Support] [twilio_support]

[twilio_python]: https://github.com/twilio/twilio-python
[twilio_lib_docs]: http://readthedocs.org/docs/twilio-php/en/latest/index.html
[twilio_github_readme]: https://github.com/twilio/twilio-python/blob/master/README.md
[twilio_api_service]: https://api.twilio.com
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
