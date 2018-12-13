---
title: How to Use Twilio for Voice and SMS (Ruby) | Microsoft Docs
description: Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in Ruby.
services: ''
documentationcenter: ruby
author: devinrader
manager: twilio
editor: ''

ms.assetid: 60e512f6-fa47-47c0-aedc-f19bb72a1158
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: ruby
ms.topic: article
ms.date: 11/25/2014
ms.author: MicrosoftHelp@twilio.com

---
# How to Use Twilio for Voice and SMS Capabilities in Ruby
This guide demonstrates how to perform common programming tasks with the Twilio API service on Azure. The scenarios covered include making a phone call and sending a Short Message Service (SMS) message. For more information on Twilio and using voice and SMS in your applications, see the [Next Steps](#NextSteps) section.

## <a id="WhatIs"></a>What is Twilio?
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. Twilio is a third-party service (not an Azure feature and not a Microsoft product).

**Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections.

## <a id="Pricing"></a>Twilio Pricing and Special Offers
Information about Twilio pricing is available at [Twilio Pricing][twilio_pricing]. Azure customers receive a [special offer][special_offer]: a free credit of 1000 texts or 1000 inbound minutes. To sign up for this offer or get more information, please visit [https://ahoy.twilio.com/azure][special_offer].  

## <a id="Concepts"></a>Concepts
The Twilio API is a RESTful API that provides voice and SMS functionality for applications. Client libraries are available in multiple languages; for a list, see [Twilio API Libraries][twilio_libraries].

### <a id="TwiML"></a>TwiML
TwiML is a set of XML-based instructions that inform Twilio of how to process a call or SMS.

As an example, the following TwiML would convert the text **Hello World** to speech.

    <?xml version="1.0" encoding="UTF-8" ?>
    <Response>
       <Say>Hello World</Say>
    </Response>

All TwiML documents have `<Response>` as their root element. From there, you use Twilio Verbs to define the behavior of your application.

### <a id="Verbs"></a>TwiML Verbs
Twilio Verbs are XML tags that tell Twilio what to **do**. For example, the **&lt;Say&gt;** verb instructs Twilio to audibly deliver a message on a call. 

The following is a list of Twilio verbs.

* **&lt;Dial&gt;**: Connects the caller to another phone.
* **&lt;Gather&gt;**: Collects numeric digits entered on the telephone keypad.
* **&lt;Hangup&gt;**: Ends a call.
* **&lt;Play&gt;**: Plays an audio file.
* **&lt;Pause&gt;**: Waits silently for a specified number of seconds.
* **&lt;Record&gt;**: Records the caller's voice and returns a URL of a file that contains the recording.
* **&lt;Redirect&gt;**: Transfers control of a call or SMS to the TwiML at a different URL.
* **&lt;Reject&gt;**: Rejects an incoming call to your Twilio number without billing you
* **&lt;Say&gt;**: Converts text to speech that is made on a call.
* **&lt;Sms&gt;**: Sends an SMS message.

For more information about Twilio verbs, their attributes, and TwiML, see [TwiML][twiml]. For additional information about the Twilio API, see [Twilio API][twilio_api].

## <a id="CreateAccount"></a>Create a Twilio Account
When you're ready to get a Twilio account, sign up at [Try Twilio][try_twilio]. You can start with a free account, and upgrade your account later.

When you sign up for a Twilio account, you'll get a free phone number for your application. You'll also receive an account SID and an auth token. Both will be needed to make Twilio API calls. To prevent unauthorized access to your account, keep your authentication token secure. Your account SID and auth token are viewable at the [Twilio account page][twilio_account], in the fields labeled **ACCOUNT SID** and **AUTH TOKEN**, respectively.

### <a id="VerifyPhoneNumbers"></a>Verify Phone Numbers
In addition to the number you are given by Twilio, you can also verify numbers that you control (i.e. your cell phone or home phone number) for use in your applications. 

For information on how to verify a phone number, see [Manage Numbers][verify_phone].

## <a id="create_app"></a>Create a Ruby Application
A Ruby application that uses the Twilio service and is running in Azure is no different than any other Ruby application that uses the Twilio service. While Twilio services are RESTful and can be called from Ruby in several ways, this article will focus on how to use Twilio services with [Twilio helper library for Ruby][twilio_ruby].

First, [set-up a new Azure Linux VM][azure_vm_setup] to act as a host for your new Ruby web application. Ignore the steps involving the creation of a Rails app, just set-up the VM. Make sure you create an Endpoint with an external port of 80 and an internal port of 5000.

In the examples below, we will be using [Sinatra][sinatra], a very simple web framework for Ruby. But you can certainly use the Twilio helper library for Ruby with any other web framework, including Ruby on Rails.

SSH into your new VM and create a directory for your new app. Inside that directory, create a file called Gemfile and copy the following code into it:

    source 'https://rubygems.org'
    gem 'sinatra'
    gem 'thin'

On the command line run `bundle install`. This will install the dependencies above. Next create a file called `web.rb`. This will be where the code for your web app lives. Paste the following code into it:

    require 'sinatra'

    get '/' do
        "Hello Monkey!"
    end

At this point you should be able the run the command `ruby web.rb -p 5000`. This will spin-up a small web server on port 5000. You should be able to browse to this app in your browser by visiting the URL you set-up for your Azure VM. Once you can reach your web app in the browser, you're ready to start building a Twilio app.

## <a id="configure_app"></a>Configure Your Application to Use Twilio
You can configure your web app to use the Twilio library by updating your `Gemfile` to include this line:

    gem 'twilio-ruby'

On the command line, run `bundle install`. Now open `web.rb` and including this line at the top:

    require 'twilio-ruby'

You're now all set to use the Twilio helper library for Ruby in your web app.

## <a id="howto_make_call"></a>How to: Make an outgoing call
The following shows how to make an outgoing call. Key concepts include using the Twilio helper library for Ruby to make REST API calls and rendering TwiML. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

Add this function to `web.md`:

    # Set your account ID and authentication token.
    sid = "your_twilio_account_sid";
    token = "your_twilio_authentication_token";

    # The number of the phone initiating the call.
    # This should either be a Twilio number or a number that you've verified
    from = "NNNNNNNNNNN";

    # The number of the phone receiving call.
    to = "NNNNNNNNNNN";

    # Use the Twilio-provided site for the TwiML response.
    url = "http://yourdomain.cloudapp.net/voice_url";

    get '/make_call' do
      # Create the call client.
      client = Twilio::REST::Client.new(sid, token);

      # Make the call
      client.account.calls.create(to: to, from: from, url: url)
    end

    post '/voice_url' do
      "<Response>
         <Say>Hello Monkey!</Say>
       </Response>"
    end

If you open-up `http://yourdomain.cloudapp.net/make_call` in a browser, that will trigger the call to the Twilio API to make the phone call. The first two parameters in `client.account.calls.create` are fairly self-explanatory: the number the call is `from` and the number the call is `to`. 

The third parameter (`url`) is the URL that Twilio requests to get instructions on what to do once the call is connected. In this case we set-up a URL (`http://yourdomain.cloudapp.net`) that returns a simple TwiML document and uses the `<Say>` verb to do some text-to-speech and say "Hello Monkey" to the person receiving the call.

## <a id="howto_receive_sms"></a>How to: Receive an SMS message
In the previous example we initiated an **outgoing** phone call. This time, let's use the phone number that Twilio gave us during sign-up to process an **incoming** SMS message.

First, log-in to your [Twilio dashboard][twilio_account]. Click on "Numbers" in the top nav and then click on the Twilio number you were provided. You'll see two URLs that you can configure. A Voice Request URL and an SMS Request URL. These are the URLs that Twilio calls whenever a phone call is made or an SMS is sent to your number. The URLs are also known as "web hooks".

We would like to process incoming SMS messages, so let's update the URL to `http://yourdomain.cloudapp.net/sms_url`. Go ahead and click Save Changes at the bottom of the page. Now, back in `web.rb` let's program our application to handle this:

    post '/sms_url' do
      "<Response>
         <Message>Hey, thanks for the ping! Twilio and Azure rock!</Message>
       </Response>"
    end

After making the change, make sure to re-start your web app. Now, take out your phone and send an SMS to your Twilio number. You should promptly get an SMS response that says "Hey, thanks for the ping! Twilio and Azure rock!".

## <a id="additional_services"></a>How to: Use Additional Twilio Services
In addition to the examples shown here, Twilio offers web-based APIs that you can use to leverage additional Twilio functionality from your Azure application. For full details, see the [Twilio API documentation][twilio_api_documentation].

### <a id="NextSteps"></a>Next Steps
Now that you've learned the basics of the Twilio service, follow these links to learn more:

* [Twilio Security Guidelines][twilio_security_guidelines]
* [Twilio HowTos and Example Code][twilio_howtos]
* [Twilio Quickstart Tutorials][twilio_quickstarts] 
* [Twilio on GitHub][twilio_on_github]
* [Talk to Twilio Support][twilio_support]

[twilio_ruby]: https://www.twilio.com/docs/ruby/install





[twilio_pricing]: https://www.twilio.com/pricing
[special_offer]: https://ahoy.twilio.com/azure
[twilio_libraries]: https://www.twilio.com/docs/libraries
[twiml]: https://www.twilio.com/docs/api/twiml
[twilio_api]: https://www.twilio.com/api
[try_twilio]: https://www.twilio.com/try-twilio
[twilio_account]:  https://www.twilio.com/user/account
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
[twilio_api_documentation]: https://www.twilio.com/api
[twilio_security_guidelines]: https://www.twilio.com/docs/security
[twilio_howtos]: https://www.twilio.com/docs/howto
[twilio_on_github]: https://github.com/twilio
[twilio_support]: https://www.twilio.com/help/contact
[twilio_quickstarts]: https://www.twilio.com/docs/quickstart
[sinatra]: http://www.sinatrarb.com/
[azure_vm_setup]: https://docs.microsoft.com/azure/virtual-machines/linux/classic/ruby-rails-web-app
