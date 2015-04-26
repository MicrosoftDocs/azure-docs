<properties 
	pageTitle="Develop and deploy a web app with Microsoft WebMatrix" 
	description="Learn how to develop and deploy an ASP.NET web application to Azure App Service Web Apps with Microsoft WebMatrix." 
	services="app-service\web" 
	documentationCenter=".net" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="tomfitz"/>


# Develop and deploy a web app with Microsoft WebMatrix

## Overview

This guide describes how to use Microsoft WebMatrix to create and deploy a .NET website to [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps. You will use a sample application from a WebMatrix site template.

You will learn:

* How to sign into Azure from within WebMatrix
* How to create a site using a built in template with WebMatrix 
* How to deploy the customized website directly from WebMatrix to Azure.

[AZURE.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Sign into Azure

1. Launch WebMatrix.
2. If this is the first time you've used WebMatrix 3, you will be prompted to sign into Azure.  Otherwise, you can click on the **Sign In** button, and choose **Add Account**.  Choose to **Sign in** using your Microsoft Account.

	![Add Account][addaccount]

3. If you have signed up for an Azure account, you may log in using your Microsoft Account:

	![Sign into Azure][signin]	


## Create a site using a built in template for Azure

1. On the start screen, click the **New** button, and choose **Template Gallery** to create a new site from the Template Gallery:

	![New site from Template Gallery][sitefromtemplate]

2. The Template Gallery will show a list of available templates that can run locally or on Azure.  Select **Bakery** from the list of templates, enter **bakerysample** for the **Site Name**, and click **Next**.

	![Create Site from Template][sitefromtemplatedetails]

3. If you are signed into Azure, you now have the option to create an Azure App Service Web Apps instance for your local site. Choose a unique name, and select the data center where you would like your Web Apps instance to be created: 

	![Create site on Azure][sitefromtemplateazure]

	After WebMatrix finishes building the local site and the Web Apps instance in Azure, the WebMatrix IDE is displayed:

	![WebMatrix IDE][howtowebmatrixide] 

## Set up email

The bakery sample includes a simulated order form that sends an email message with the item ordered. You will use the SendGrid email service on Azure to send emails from your site.

1. Follow the steps in the [How to Send Email Using SendGrid with Azure][sendgridexample] tutorial to set up a SendGrid account and retrieve the connection information. You do not need to do the entire tutorial - just to the point getting connection information.

2. Add the SendGrid NuGet package to your WebMatrix project. First, click the NuGet button.

    ![Add SendGrid][addsendgrid]

    Search for SendGrid and install it.

    ![Install SendGrid][installsendgrid]

    After the package has finished intalling, notice that the SendGrid assemblies have been added to bin.

    ![SendGrid added][binsendgrid]

3. Open the *Order.cshtml* page by double-clicking the file name.

	![][modify2]

4. At the top of the file, add the following code:

        @using SendGrid;
        @using System.Net.Mail;

4. Find the comment that says //SMTP Configuration for Hotmail, and delete or comment out all of the code for using WebMail.

        /*
        //SMTP Configuration for Hotmail
        WebMail.SmtpServer = "smtp.live.com";
        WebMail.SmtpPort = 25;
        WebMail.EnableSsl = true;

        //Enter your Hotmail credentials for UserName/Password and a "From" address for the e-mail
        WebMail.UserName = "";
        WebMail.Password = "";
        WebMail.From = "";

        if (WebMail.UserName.IsEmpty() || WebMail.Password.IsEmpty() || WebMail.From.IsEmpty()) {
            Response.Redirect("~/OrderSuccess?NoEmail=1");
        } 
        else {
            try {
                WebMail.Send(to: customerEmail, subject: "Fourth Coffee - New Order", body: body);
                Response.Redirect("~/OrderSuccess");
            } catch {
                ModelState.AddFormError("There was an error and your order could not be processed at this time");
            }
        }*/


5. Add code to use SendGrid for sending emails instead of WebMail. Add the following code in place of the code you deleted in the previous step.

		 if (email.IsEmpty()) {
            Response.Redirect("~/OrderSuccess?NoEmail=1");
        }
        else {
            // Create the email object first, then add the properties.
            SendGridMessage myMessage = new SendGridMessage();
            myMessage.AddTo(email);
            myMessage.From = new MailAddress("FourthCoffee@example.com", "Fourth Coffee");
            myMessage.Subject = "Fourth Coffee - New Order";
            myMessage.Text = body;

            // Create credentials, specifying your user name and password.
            var credentials = new NetworkCredential("[your user name", "[your password]");

            // Create an Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email.
            try {
                transportWeb.Deliver(myMessage);
                Response.Redirect("~/OrderSuccess");
            } catch {
                ModelState.AddFormError("There was an error and your order could not be processed at this time");
            }
        }


6. On the WebMatrix ribbon click **Run** to test the site.

	![][modify4]

7. Click **Order Now** on one of the products and send an order to yourself.

8. Check your email and make sure you got the order confirmation. If you have difficulties sending email, see [Issues with Sending Email][sendmailissues] in the ASP.NET Web Pages (Razor) Troubleshooting Guide.
 

## Deploy the customized website from WebMatrix to Azure

1. In WebMatrix, click  **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the website.

	![WebMatrix Publish Preview][howtopublishpreview]

2. Click to select the checkbox next to bakery.sdf and then click **Continue**.  When publishing is completed the URL for the updated web app in Azure App Service is displayed at the bottom of the WebMatrix IDE.  

	![Publishing Complete][publishcomplete]

3. Click on the link to open the website (a Web Apps instance in Azure) in your browser:

	![Bakery Sample Site][bakerysample]

	The URL for the Web Apps instance can also be found in the [Azure Portal](https://portal.azure.com) by clicking **Browse** > **Web Apps** to display all Web Apps instances for your subscription, then select a web app. The URL for the web app is displayed the web app's blade.

## Modify the website and republish it to Web Apps

You can use WebMatrix to modify the site and republish it to your Web Apps instance. In the following procedure you will add a check box to indicate that the order is a gift.

1. Open the *Order.cshtml* page.

2. Locate the "shiping" class form definition. Insert the following code just after the &lt;li&gt; block.
		
		<li class="gift">
		    <div class="fieldcontainer" data-role="fieldcontain">
		        <label for="isGift">This is a gift</label>           
		        <div>@Html.CheckBox("isGift")</div>
		    </div>
		</li>

	![][modify5]

3. Locate "var shipping = Request["orderShipping"];" line in the file and insert the following line of code just following it.

		var gift = Request["isGift"];

4. Just after the block of code that validates that the shipping address is not empty in the following code snippet.

		if(gift != null) {
			body += "This is a gift." + "<br/>";
		}

	Your *order.cshtml* file should look similar to the following image.

	![][modify6]

5. Save the file and run the site locally and send yourself a test order. Make sure to test the new check box.

	![][modify7]

6. Republish the site by clicking **Publish** on the **Home** ribbon.

7. On the **Publish Preview** dialog box, make sure both the Order.cshtml is checked, and click continue.

8. Click on the link to open the website in your browser and test the update on your Web Apps instance.

## Next Steps

* [WebMatrix web site](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)




[howtowebmatrixide]: ./media/web-sites-dotnet-using-webmatrix/howtowebmatrixide2.png
[howtopublishpreview]: ./media/web-sites-dotnet-using-webmatrix/howtopublishpreview.png
[addsendgrid]: ./media/web-sites-dotnet-using-webmatrix/addsendgridpackage.png
[installsendgrid]: ./media/web-sites-dotnet-using-webmatrix/installsendgrid.png
[binsendgrid]: ./media/web-sites-dotnet-using-webmatrix/sendgridbin.png

[publishcomplete]: ./media/web-sites-dotnet-using-webmatrix/howtopublished2.png
[bakerysample]: ./media/web-sites-dotnet-using-webmatrix/howtobakerysamplesite.png
[addaccount]: ./media/web-sites-dotnet-using-webmatrix/webmatrix-add-account.png
[signin]: ./media/web-sites-dotnet-using-webmatrix/webmatrix-sign-in.png
[sitefromtemplate]: ./media/web-sites-dotnet-using-webmatrix/webmatrix-site-from-template.png
[sitefromtemplatedetails]: ./media/web-sites-dotnet-using-webmatrix/webmatrix-site-from-template-details.png
[sitefromtemplateazure]: ./media/web-sites-dotnet-using-webmatrix/webmatrix-site-from-template-azure.png

[modify1]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-1.png
[modify2]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-2.png
[modify3]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-3.png
[modify4]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-4.png
[modify5]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-5.png
[modify6]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-6.png
[modify7]: ./media/web-sites-dotnet-using-webmatrix/website-with-webmatrix-sample-mod-1-7.png



[sendmailissues]: http://go.microsoft.com/fwlink/?LinkId=253001#email
[sendgridexample]: http://azure.microsoft.com/documentation/articles/sendgrid-dotnet-how-to-send-email/
