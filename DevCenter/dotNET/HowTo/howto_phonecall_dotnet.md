<properties umbracoNaviHide="0" pageTitle="Deploying Applications" metaKeywords="Windows Azure deployment, Azure deployment, Azure configuration changes, Azure deployment update, Windows Azure .NET deployment, Azure .NET deployment, Azure .NET configuration changes, Azure .NET deployment update, Windows Azure C# deployment, Azure C# deployment, Azure C# configuration changes, Azure C# deployment update, Windows Azure VB deployment, Azure VB deployment, Azure VB configuration changes, Azure VB deployment update" metaDescription="Learn how to deploy applications to Windows Azure, make configuration changes, and and make major and minor updates." linkid="dev-net-fundamentals-deploying-applications" urlDisplayName="Deploying Applications" headerExpose="" footerExpose="" disqusComments="1" />

<div chunk="../chunks/article-left-menu.md" />
<h1>How to make a phone call using Twilio in a web role on Windows Azure</h1>

The following example shows you how you can use Twilio to make a call from a web page hosted in Windows Azure. The resulting application will prompt the user for phone call values, as shown in the following screenshot.

![Windows Azure call form using Twilio and ASP.NET][twilio_dotnet_basic_form]

You will need to do the following to use the code in this topic:

1. Acquire a Twilio account and authentication token. To get started with Twilio, sign up at [https://www.twilio.com/try-twilio][try_twilio]. You can evaluate pricing at [http://www.twilio.com/pricing][twilio_pricing]. For information about the API provided by Twilio, see [http://www.twilio.com/api][twilio_api].
2. Verify your phone number with Twilio. For information on how to verify your phone number, see [https://www.twilio.com/user/account/phone-numbers/verified#][verify_phone]. As an alternative to using an existing number, you can purchase a Twilio phone number.<br/>
For the purposes of this example you will use the Twilio sandbox phone number to send a message to the verified phone number. You can only use the sandbox phone number to send to verified phone numbers.
3. Add the Twilio .NET libary to your web role. See "To add the Twilio libraries to your web role project," later.

You should be familiar with creating a basic web role on Windows Azure.

<h2><span class="short-header">Create a form for calling</span>Create a web form for making a call</h2>

<h3><a id="use_nuget"></a>To add the Twilio libraries to your web role project:</h3>

1.  Open your solution in Visual Studio.
2.  Right-click **References**.
3.  Click **Manage NuGet Packages...**
4.  Click **Online**.
5.  In the search online box, type *twilio*.
6.  Click **Install** on the Twilio package.

The following code shows how to create a web form to retrieve user data for making a call. For purposes of this example, an ASP.NET web role named **TwilioCloud** was created.

    <%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master"
        AutoEventWireup="true" CodeBehind="Default.aspx.cs"
        Inherits="WebRole1._Default" %>

    <asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    </asp:Content>
    <asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
        <div>
            <asp:BulletedList ID="varDisplay" runat="server" BulletStyle="NotSet">
            </asp:BulletedList>
        </div>
        <div>
            <p>Fill in all fields and click <b>Make this call</b>.</p>
            <div>
                To:<br /><asp:TextBox ID="toNumber" runat="server" /><br /><br />
                Message:<br /><asp:TextBox ID="message" runat="server" /><br /><br />
                <asp:Button ID="callpage" runat="server" Text="Make this call"
                    onclick="callpage_Click" />
            </div>
        </div>
    </asp:Content>

<h2><span class="short-header">Create the code</span>Create the code to make the call</h2>
The following code, which is called when the user completes the form, creates the call message and generates the call. For purposes of this example, the code is run in the onclick event handler of the button on the form. (Use your Twilio account and authentication token instead of the placeholder values assigned to **accountSID** and **authToken** in the code below.)

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.UI;
    using System.Web.UI.WebControls;
    using Twilio;

    namespace WebRole1
    {
        public partial class _Default : System.Web.UI.Page
        {
            protected void Page_Load(object sender, EventArgs e)
            {

            }

            protected void callpage_Click(object sender, EventArgs e)
            {
                // Call porcessing happens here.

                // Use your account SID and authentication token instead of
                // the placeholders shown here.
                string accountSID = "ACNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
                string authToken =  "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";

                // Instantiate an instance of the Twilio client.
                TwilioRestClient client;
                client = new TwilioRestClient(accountSID, authToken);

                // Retrieve the account, used later to retrieve the
                Twilio.Account account = client.GetAccount();
                string APIversuion = client.ApiVersion;
                string TwilioBaseURL = client.BaseUrl;

                this.varDisplay.Items.Clear();
                if (this.toNumber.Text == "" || this.message.Text == "")
                {
                    this.varDisplay.Items.Add(
                            "You must enter a phone number and a message.");
                }
                else
                {
                    // Retrieve the values entered by the user.
                    string to = this.toNumber.Text;
                    string myMessage = this.message.Text;

                    // Create a URL using the Twilio message and the user-entered
                    // text. You must replace spaces in the user's text with '%20'
                    // to make the text suitable for a URL.
                    String Url = "http://twimlets.com/message?Message%5B0%5D="
                            + myMessage.Replace(" ", "%20");

                    // Diplay the enpoint, API version, and the URL for the message.
                    this.varDisplay.Items.Add("Using Tilio endpoint "
                        + TwilioBaseURL);
                    this.varDisplay.Items.Add("Twilioclient API Version is "
                        + APIversuion);
                    this.varDisplay.Items.Add("The URL is " + Url);

                    // Instantiate the call options that are passed
                    // to the outbound call.
                    CallOptions options = new CallOptions();

                    // Set the call From, To, and URL values into a hash map.
                    // This sample uses the sandbox number provided by Twilio
                    // to make the call.
                    options.From = "+14155992671";
                    options.To = to;
                    options.Url = Url;

                    // Place the call.
                    var call = client.InitiateOutboundCall(options);
                    this.varDisplay.Items.Add("Call status: " + call.Status);
                }
            }
        }
    }

In addition to making the call, the Twilio endpoint, API version, and the call status are displayed. The following screenshot shows an example of the output of a sample run.

![Windows Azure call response using Twilio and ASP.NET][twilio_dotnet_basic_form_output]

More information about TwiML can be found at [http://www.twilio.com/docs/api/twiml][twiml], and more information about &lt;Say&gt; and other Twilio verbs can be found at [http://www.twilio.com/docs/api/twiml/say][twilio_say].

<h2><span class="short-header">Next steps</span>Next steps</h2>
This code was provided to show you basic functionality using Twilio in an ASP.NET web role on Windows Azure. Before deploying to Windows Azure in production, you may want to add more error handling or other features. For example:

* Instead of using a web form, you could use Windows Azure Blob storage or a Windows Azure SQL Database instance to store phone numbers and call text. For information about using blobs in Windows Azure, see [How to use the Windows Azure Blob storage service][howto_blob_storage_dotnet]. For information about using SQL Database, see [How to use SQL Database][howto_sql_azure_dotnet].
* You could use RoleEnvironment.getConfigurationSettings to retrieve the Twilio account ID and authentication token from your deployment’s configuration settings, instead of hard-coding the values in your form. For information about the RoleEnvironment class, see [Microsoft.WindowsAzure.ServiceRuntime Namespace][azure_runtime_ref_dotnet].
* Read the Twilio security guidelines at [https://www.twilio.com/docs/security][twilio_docs_security].

For additional information about Twilio, see [https://www.twilio.com/docs][twilio_docs].

<h2><span class="short-header">See also</span>See also</h2>
* [How to use Twilio for voice and SMS capabilities in a web role][howto_twilio_voice_sms_dotnet]


[twilio_pricing]: http://www.twilio.com/pricing
[try_twilio]: http://www.twilio.com/try-twilio
[twilio_api]: http://www.twilio.com/api
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#
[twilio_java]: http://github.com/twilio/twilio-java
[twilio_dotnet_basic_form]: ../media/WA_twilio_dotnet_basic_form.png
[twilio_dotnet_basic_form_output]: ../media/WA_twilio_dotnet_basic_form_output.png
[twimlet_message_url]: http://twimlets.com/message
[twiml]: http://www.twilio.com/docs/api/twiml
[twilio_api_service]: http://api.twilio.com
[add_ca_cert]: add_ca_cert.md
[azure_java_eclipse_hello_world]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690944.aspx
[howto_twilio_voice_sms_dotnet]: /en-us/develop/net/how-to-guides/twilio/
[howto_blob_storage_java]: http://www.windowsazure.com/en-us/develop/java/how-to-guides/blob-storage/
[howto_blob_storage_dotnet]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
[howto_sql_azure_java]: [http://msdn.microsoft.com/en-us/library/windowsazure/hh749029.aspx]
[howto_sql_azure_dotnet]: https://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-database/
[azure_runtime_jsp]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690948.aspx
[azure_javadoc]: http://dl.windowsazure.com/javadoc
[twilio_docs_security]: http://www.twilio.com/docs/security
[twilio_docs]: http://www.twilio.com/docs
[twilio_say]: http://www.twilio.com/docs/api/twiml/say
[twilio_java]: ../media/WA_TwilioJavaCallForm.jpg
[twilio_java_response]: ../media/WA_TwilioJavaMakeCall.jpg
[azure_runtime_ref_dotnet]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.serviceruntime.aspx