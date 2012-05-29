<properties umbracoNaviHide="0" pageTitle="Twilio Voice and SMS Service" metaKeywords="Azure Twilio Java" metaDescription="This guide demonstrates how to perform common programming tasks with the Twilio API service on Windows Azure." linkid="develop-java-how-to-twilio-sms-service" urlDisplayName="Twilio Voice/SMS Service" headerExpose="" footerExpose="" disqusComments="1" />

# How to Use Twilio for Voice and SMS Capabilities in Java
<div chunk="../../Shared/Chunks/how_to_use_twilio_opening_and_common_toc.md" />
* [Create a Java Application](#create_app)
* [Configure Your Application to Use Twilio Libraries](#configure_app)
* [How to: Make an outgoing call](#howto_make_call)
* [How to: Send an SMS message](#howto_send_sms)
* [How to: Provide TwiML Responses from your own Web site](#howto_provide_twiml_responses)

<div chunk="../../Shared/Chunks/how_to_use_twilio_for_voice_and_sms_capabilities.md" />

<h2 id="create_app">Create a Java Application</h2>
1. Obtain the Twilio JAR and add it to your Java build path and your WAR deployment assembly. At [https://github.com/twilio/twilio-java][twilio_java], you can download the GitHub sources and create your own JAR, or download a pre-built JAR (with or without dependencies).
2. Ensure your JDK’s **cacerts** keystore contains the Equifax Secure Certificate Authority certificate with MD5 fingerprint 67:CB:9D:C0:13:24:8A:82:9B:B2:17:1E:D1:1B:EC:D4 (the serial number is 35:DE:F4:CF and the SHA1 fingerprint is D2:32:09:AD:23:D3:14:23:21:74:E4:0D:7F:9D:62:13:97:86:63:3A). This is the certificate authority (CA) certificate for the [https://api.twilio.com][twilio_api_service] service, which is called when you use Twilio APIs. For information about ensuring your JDK’s **cacerts** keystore contains the correct CA certificate, see [Adding a Certificate to the Java CA Certificate Store][add_ca_cert].

Detailed instructions for using the Twilio client library for Java are available at [How to Make a Phone Call Using Twilio in a Java Application on Windows Azure][howto_phonecall_java].

<h2 id="configure_app">Configure Your Application to Use Twilio Libraries</h2>
Within your code, you can add **import** statements at the top of your Java files for the Twilio packages or classes you want to use in your application. For example:

    import com.twilio.*;
    import com.twilio.sdk.*;
    import com.twilio.sdk.resource.factory.*;
    import com.twilio.sdk.resource.instance.*;

For JSP:

    import="com.twilio.*"
    import="com.twilio.sdk.*"
    import="com.twilio.sdk.resource.factory.*"
    import="com.twilio.sdk.resource.instance.*"
Depending on which Twilio packages or classes you want to use, your **import** statements may be different.

<h2 id="howto_make_call">How to: Make an outgoing call</h2>
The following shows how to make an outgoing call using the **CallFactory** class. This code also uses a Twilio-provided site to return the Twilio Markup Language (TwiML) response. Substitute your values for the **From** and **To** phone numbers, and ensure that you verify the **From** phone number for your Twilio account prior to running the code.

    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    String accountSID = "your_twilio_account";
    String authToken = "your_twilio_authentication_token";

    // Create an instance of the Twilio client.
    TwilioRestClient client;
    client = new TwilioRestClient(accountSID, authToken);

    // Retrieve the account, used later to create an instance of the CallFactory.
    Account account = client.getAccount();

    // Use the Twilio-provided site for the TwiML response.
    String Url="http://twimlets.com/message";
    Url = Url + "?Message%5B0%5D=Hello%20World";

    // Place the call From, To and URL values into a hash map. 
    HashMap<String, String> params = new HashMap<String, String>();
    params.put("From", "NNNNNNNNNN"); // Use your own value for the second parameter.
    params.put("To", "NNNNNNNNNN");   // Use your own value for the second parameter.
    params.put("Url", Url);

    // Create an instance of the CallFactory class.
    CallFactory callFactory = account.getCallFactory();

    // Make the call.
    Call call = callFactory.create(params);

For more information about the parameters passed in to the **CallFactory.create** method, see [http://www.twilio.com/docs/api/rest/making-calls][twilio_rest_making_calls].

As mentioned, this code uses a Twilio-provided site to return the TwiML response. You could instead use your own site to provide the TwiML response; for more information, see [How to Provide TwiML Responses in a Java Application on Windows Azure](#howto_provide_twiml_responses).

<h2 id="howto_send_sms">How to: Send an SMS message</h2>
The following shows how to send an SMS message using the **SmsFactory** class. The **From** number, **4155992671**, is provided by Twilio for trial accounts to send SMS messages. The **To** number must be verified for your Twilio account prior to running the code.

    // Use your account SID and authentication token instead
    // of the placeholders shown here.
    String accountSID = "your_twilio_account";
    String authToken = "your_twilio_authentication_token";

    // Create an instance of the Twilio client.
    TwilioRestClient client;
    client = new TwilioRestClient(accountSID, authToken);

    // Retrieve the account, used later to create an instance of the SmsFactory.
    Account account = client.getAccount();

    // Send an SMS message.
    // Place the call From, To and Body values into a hash map. 
    HashMap<String, String> smsParams = new HashMap<String, String>();
    smsParams.put("From", "4155992671"); // The second parameter is a phone number provided
                                         // by Twilio for trial accounts.
    smsParams.put("To", "NNNNNNNNNN");   // Use your own value for the second parameter.
    smsParams.put("Body", "This is my SMS message.");

    // Create an instance of the SmsFactory class.
    SmsFactory smsFactory = account.getSmsFactory();

    // Send the message.
    Sms sms = smsFactory.create(smsParams);

For more information about the parameters passed in to the **SmsFactory.create** method, see [http://www.twilio.com/docs/api/rest/sending-sms][twilio_rest_sending_sms].

<h2 id="howto_provide_twiml_responses">How to: Provide TwiML Responses from your own Web site</h2>
When your application initiates a call to the Twilio API, for example via the **CallFactory.create** method, Twilio will send your request to a URL that is expected to return a TwiML response. The example above uses the Twilio-provided URL [http://twimlets.com/message][twimlet_message_url]. (While TwiML is designed for use by Web services, you can view the TwiML in your browser. For example, click [http://twimlets.com/message][twimlet_message_url] to see an empty **&lt;Response&gt;** element; as another example, click [http://twimlets.com/message?Message%5B0%5D=Hello%20World][twimlet_message_url_hello_world] to see a **&lt;Response&gt;** element that contains a **&lt;Say&gt;** element.)

Instead of relying on the Twilio-provided URL, you can create your own URL site that returns HTTP responses. You can create the site in any language that returns HTTP responses; this topic assumes you’ll be hosting the URL in a JSP page.

The following JSP page results in a TwiML response that says **Hello World** on the call.

    <%@ page contentType="text/xml" %>
    <Response> 
        <Say>Hello World</Say>
    </Response>

The following JSP page results in a TwiML response that says some text, has several pauses, and says information about the Twilio API version and the Windows Azure role name.


    <%@ page contentType="text/xml" %>
    <Response> 
        <Say>Hello from Windows Azure</Say>
        <Pause></Pause>
        <Say>The Twilio API version is <%= request.getParameter("ApiVersion") %>.</Say>
        <Say>The Windows Azure role name is <%= System.getenv("RoleName") %>.</Say>
        <Pause></Pause>
        <Say>Good bye.</Say>
    </Response>

The **ApiVersion** parameter is available in Twilio voice requests (not SMS requests). To see the available request parameters for Twilio voice and SMS requests, see [https://www.twilio.com/docs/api/twiml/twilio\_request][twilio_voice_request] and [https://www.twilio.com/docs/api/twiml/sms/twilio\_request][twilio_sms_request], respectively. The **RoleName** environment variable is available as part of a Windows Azure deployment. (If you want to add custom environment variables so they could be picked up from **System.getenv**, see the environment variables section at [Miscellaneous Role Configuration Settings][misc_role_config_settings].)

Once you have your JSP page set up to provide TwiML responses, use the URL of the JSP page as the URL passed into the **CallFactory.create** method. For example, if you have a Web application named MyTwiML deployed to a Windows Azure hosted service, and the name of the JSP page is mytwiml.jsp, the URL can be passed to **CallFactory.create** as shown in the following:

    // Place the call From, To and URL values into a hash map. 
    HashMap<String, String> params = new HashMap<String, String>();
    params.put("From", "NNNNNNNNNN");
    params.put("To", "NNNNNNNNNN");
    params.put("Url", "http://<your_hosted_service>.cloudapp.net/MyTwiML/mytwiml.jsp");

    CallFactory callFactory = account.getCallFactory();
    Call call = callFactory.create(params);

Another option for responding with TwiML is via the **TwiMLResponse** class, which is available in the **com.twilio.sdk.verbs** package.

For additional information about using Twilio in Windows Azure with Java, see [How to Make a Phone Call Using Twilio in a Java Application on Windows Azure][howto_phonecall_java].

<div chunk="../../Shared/Chunks/twilio_additional_services_and_next_steps.md" />

[twilio_java]: https://github.com/twilio/twilio-java
[twilio_api_service]: https://api.twilio.com
[add_ca_cert]: add_ca_cert.md
[howto_phonecall_java]: howto_phonecall_java.md
[twilio_voice_request]: https://www.twilio.com/docs/api/twiml/twilio_request
[twilio_sms_request]: https://www.twilio.com/docs/api/twiml/sms/twilio_request
[misc_role_config_settings]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690945.aspx
[twimlet_message_url]: http://twimlets.com/message
[twimlet_message_url_hello_world]: http://twimlets.com/message?Message%5B0%5D=Hello%20World
[twilio_rest_making_calls]: http://www.twilio.com/docs/api/rest/making-calls
[twilio_rest_sending_sms]: http://www.twilio.com/docs/api/rest/sending-sms