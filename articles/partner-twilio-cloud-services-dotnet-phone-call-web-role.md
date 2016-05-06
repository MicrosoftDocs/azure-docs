<properties 
	pageTitle="How to make a phone call from Twilio (.NET) | Microsoft Azure" 
	description="Learn how to make a phone call and send a SMS message with the Twilio API service on Azure. Code samples written in .NET." 
	services="" 
	documentationCenter=".net" 
	authors="devinrader" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="05/04/2016" 
	ms.author="microsofthelp@twilio.com"/>




# How to make a phone call using Twilio in a web role on Azure

This guide demonstrates how to use Twilio to make a call from a web page hosted in Azure. The resulting application prompts the user for phone call values, as shown in the following screenshot.

![Azure call form using Twilio and ASP.NET][twilio_dotnet_basic_form]

## <a name="twilio-prereqs"></a>Prerequisites

You will need to do the following to use the code in this topic:

1. Acquire a Twilio account and authentication token. To get started with Twilio, sign up at [https://www.twilio.com/try-twilio][try_twilio]. You can evaluate pricing at [http://www.twilio.com/pricing][twilio_pricing]. For information about the API provided by Twilio, see [http://www.twilio.com/voice/api][twilio_api].
2. Add the Twilio .NET libary to your web role. See "To add the Twilio libraries to your web role project," later in this topic.

You should be familiar with creating a basic web role on Azure.

## <a name="howtocreateform"></a>How to: Create a web form for making a call

<a id="use_nuget"></a>To add the Twilio libraries to your web role project:

1.  Open your solution in Visual Studio.
2.  Right-click **References**.
3.  Click **Manage NuGet Packages**.
4.  Click **Online**.
5.  In the search online box, type *twilio*.
6.  Click **Install** on the Twilio package.

The following code shows how to create a web form to retrieve user data for making a call. In this example, an ASP.NET web role named **TwilioCloud** is created.

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

## <a id="howtocreatecode"></a>How to: Create the code to make the call
The following code, which is called when the user completes the form, creates the call message and generates the call. In this example, the code is run in the onclick event handler of the button on the form. (Use your Twilio account and authentication token instead of the placeholder values assigned to **accountSID** and **authToken** in the code below.)

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

                    // Display the endpoint, API version, and the URL for the message.
                    this.varDisplay.Items.Add("Using Twilio endpoint "
                        + TwilioBaseURL);
                    this.varDisplay.Items.Add("Twilioclient API Version is "
                        + APIversuion);
                    this.varDisplay.Items.Add("The URL is " + Url);

                    // Instantiate the call options that are passed
                    // to the outbound call.
                    CallOptions options = new CallOptions();

                    // Set the call From, To, and URL values.                    
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

The call is made, and the Twilio endpoint, API version, and the call status are displayed. The following screenshot shows output from a sample run.

![Azure call response using Twilio and ASP.NET][twilio_dotnet_basic_form_output]

More information about TwiML can be found at [http://www.twilio.com/docs/api/twiml][twiml]. More information about &lt;Say&gt; and other Twilio verbs can be found at [http://www.twilio.com/docs/api/twiml/say][twilio_say].

## <a id="nextsteps"></a>Next steps
This code was provided to show you basic functionality using Twilio in an ASP.NET web role on Azure. Before deploying to Azure in production, you may want to add more error handling or other features. For example:

* Instead of using a web form, you could use Azure Blob storage or an Azure SQL Database instance to store phone numbers and call text. For information about using blobs in Azure, see [How to use the Azure Blob storage service in .NET][howto_blob_storage_dotnet]. For information about using SQL Database, see [How to use Azure SQL Database in .NET applications][howto_sql_azure_dotnet].
* You could use RoleEnvironment.getConfigurationSettings to retrieve the Twilio account ID and authentication token from your deployment's configuration settings, instead of hard-coding the values in your form. For information about the RoleEnvironment class, see [Microsoft.WindowsAzure.ServiceRuntime Namespace][azure_runtime_ref_dotnet].
* Read the Twilio security guidelines at [https://www.twilio.com/docs/security][twilio_docs_security].
* Learn more about Twilio at [https://www.twilio.com/docs][twilio_docs].

##<a name="seealso"></a>See also
* [How to use Twilio for voice and SMS capabilities from Azure](twilio-dotnet-how-to-use-for-voice-sms.md)

[twilio_pricing]: http://www.twilio.com/pricing
[try_twilio]: http://www.twilio.com/try-twilio
[twilio_api]: http://www.twilio.com/voice/api
[verify_phone]: https://www.twilio.com/user/account/phone-numbers/verified#

[twilio_dotnet_basic_form]: ./media/partner-twilio-cloud-services-dotnet-phone-call-web-role/WA_twilio_dotnet_basic_form.png
[twilio_dotnet_basic_form_output]: ./media/partner-twilio-cloud-services-dotnet-phone-call-web-role/WA_twilio_dotnet_basic_form_output.png

[twiml]: http://www.twilio.com/docs/api/twiml



[howto_twilio_voice_sms_dotnet]: /develop/net/how-to-guides/twilio/

[howto_blob_storage_dotnet]: https://www.windowsazure.com/develop/net/how-to-guides/blob-storage/

[howto_sql_azure_dotnet]: https://www.windowsazure.com/develop/net/how-to-guides/sql-database/


[twilio_docs_security]: http://www.twilio.com/docs/security
[twilio_docs]: http://www.twilio.com/docs
[twilio_say]: http://www.twilio.com/docs/api/twiml/say


[azure_runtime_ref_dotnet]: http://msdn.microsoft.com/library/windowsazure/microsoft.windowsazure.serviceruntime.aspx
