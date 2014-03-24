<properties linkid="develop-dotnet-website-with-webmatrix" urlDisplayName="Website with WebMatrix" pageTitle=".NET web site with WebMatrix - Azure tutorials" metaKeywords="WebMatrix Azure, WebMatrix Azure, Azure web site WebMatrix, Azure website WebMatrix, Web Matrix Azure, WebMatrix Azure" description="Learn how to develop and deploy an Azure web site with WebMatrix." metaCanonical="" services="web-sites" documentationCenter=".NET" title="Develop and deploy a web site with Microsoft WebMatrix" authors="" solutions="" manager="" editor="" />





#Develop and deploy a web site with Microsoft WebMatrix
This guide describes how to use Microsoft WebMatrix to create and deploy a web site to Azure.  You will use a sample application from a WebMatrix site template.

You will learn:

* How to sign into Azure from within WebMatrix
* How to create a site using a built in template with WebMatrix 
* How to deploy the customized web site directly from WebMatrix to Azure.


[WACOM.INCLUDE [create-account-and-websites-note](../includes/create-account-and-websites-note.md)]

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

3. If you are signed into Azure, you now have the option to create an Azure Web Site for your local site.  Choose a unique name, and select the data cetner where you would like your site to be created: 

	![Create site on Azure][sitefromtemplateazure]

	After WebMatrix finishes building the web site, the WebMatrix IDE is displayed:

	![WebMatrix IDE][howtowebmatrixide] 

## Test the web site

The bakery sample includes a simulated order form that sends an email message with the item ordered to a Windows Live Hotmail account that you provide.

1. In the left hand navigation pane of WebMatrix, expand the **bakerysample** folder.

	![][modify1]

2. Open the *Order.cshtml* page by double-clicking the file name.

	![][modify2]

3. Find the comment that says //SMTP Configuration for Hotmail.

	![][modify3]

4. Change the values in the following lines to match your own email provider:

		WebMail.SmtpServer = "smtp.live.com";
		WebMail.SmtpPort  = 25;
		WebMail.EnableSsl = true; 

		//Enter your Hotmail credentials for UserName/Password and a "From" address for the e-mail
        WebMail.UserName = "";
        WebMail.Password = "";
        WebMail.From = "";

	Change the value of WebMail.SmtpServer to the name of the email server you normally use to send email. Then fill in values for the user name and password. Set the From property to your email address.

4. On the WebMatrix ribbon click **Run** to test the site.

	![][modify4]

5. Click **Order Now** on one of the products and send an order to yourself.

6. Check your email and make sure you got the order confirmation. If you have difficulties sending email, see [Issues with Sending Email][sendmailissues] in the ASP.NET Web Pages (Razor) Troubleshooting Guide.
 

## Deploy the customized web site from WebMatrix to Azure

1. In WebMatrix, click  **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the web site.

	![WebMatrix Publish Preview][howtopublishpreview]

2. Click to select the checkbox next to bakery.sdf and then click **Continue**.  When publishing is completed the URL for the updated web site on Azure is displayed at the bottom of the WebMatrix IDE.  

	![Publishing Complete][publishcomplete]

3. Click on the link to open the web site in your browser:

	![Bakery Sample Site][bakerysample]

	The URL for the web site can also be found in the Azure portal by clicking **Web Sites** to display all web sites for your subscription. The URL for each web site is displayed in the URL column on the web sites page.

## Modify the web site and republish it to the Azure web site

You can use WebMatrix to modify the site and republish it to your Azure web site. In the following procedure you will add a check box to indicate that the order is a gift.

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

8. Click on the link to open the web site in your browser and test the update on your Azure web site.

# Next Steps

You've seen how to create and deploy a web site from WebMatrix to Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409)

* [WebMatrix web site](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)





[howtowebmatrixide]: ./media/web-sites-dotnet-using-webmatrix/howtowebmatrixide.png
[howtopublishpreview]: ./media/web-sites-dotnet-using-webmatrix/howtopublishpreview.png

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
