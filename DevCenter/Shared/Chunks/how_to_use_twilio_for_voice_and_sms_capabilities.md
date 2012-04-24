<!-- Language-specific TOC entries go here -->
<h2 id="WhatIs">What is Twilio?</h2>
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not a Windows Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

<h2 id="Pricing">Twilio Pricing</h2>
Information about Twilio pricing is available at [Twilio Pricing] [twilio_pricing]. For a Twilio special offer for Windows Azure customers, see [To be determined – the link doesn’t exist yet].

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

As an alternative to using an existing number for your applications, you can purchase a Twilio phone number.

[twilio_pricing]: http://www.twilio.com/pricing
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api]: http://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_account]:  https://www.twilio.com/user/account
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
