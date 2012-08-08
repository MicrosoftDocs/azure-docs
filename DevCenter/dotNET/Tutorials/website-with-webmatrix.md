#Develop and deploy a web site with Microsoft WebMatrix

This guide describes how to use Microsoft WebMatrix to create and deploy a web site to Windows Azure.  You will use a sample application from a WebMatrix site template.

You will learn:

* How to create a web site from the Windows Azure portal.
* How to import the web site into WebMatrix and customize the web site to use one of the WebMatrix templates.
* How to deploy the customized web site directly from WebMatrix to Windows Azure.


<div chunk="../../Shared/Chunks/create-account-and-websites-note.md" />

## Create a web site from the Windows Azure portal

1. Login to the [Windows Azure Portal](http://manage.windowsazure.com).
2. Click **New** at the bottom left of the Windows Azure portal.
3. Click  **Web Site**, click **Quick Create**, enter a value for **URL** (e.g. *bakerysample*), select the **Region** that is closest to your intended users (this will ensure best performance) and then click the **Create Web Site** checkmark at the bottom of the page to initiate creation of the web site:

	![Create New website][createnewsite]	

4. Once the web site is created, the portal will display all of the web sites associated with your subscription. Verify that the web site you just created has a **Status** of **Running** and then open the web site's management pages by clicking the name of the web site displayed in the **Name** column to open the web site's **Dashboard** management page.

## Import the web site into WebMatrix and customize the web site using a template

1. From the **Dashboard** page click the WebMatrix icon at the bottom of the page to open the web site in WebMatrix 

	![Open web site in WebMatrix 2][opensiteinwebmatrix2]

2. If WebMatrix 2 is not installed, the Web Platform Installer 4.0 will install Microsoft WebMatrix 2 and all necessary prerequisite software and display a dialog box indicating **Empty Site Detected**. Click the option to use a built-in website template:

	![Empty Site Detected][howtodownloadsite]

3. After you click the option to use a built-in website template, select **Bakery** from the list of templates, enter **bakerysample** for the **Site Name**, and click **Next**.

	![Create Site from Template][howtositefromtemplate]

	After WebMatrix finishes building the web site, the WebMatrix IDE is displayed:

	![Web Matrix 2 IDE][howtowebmatrixide] 

## Test the web site

The bakery sample includes a simulated order form that sends an email message with the item ordered to a Windows Live Hotmail account that you provide.

1. In the left hand navigation pane of WebMatrix, expand the **bakerysample** folder.

	![][modify1]

2. Open the *Order.cshtml* page.

	![][modify2]

3. Find the comment that says //SMTP Configuration for Hotmail.

	![][modify3]

3. Change the values in the following lines to match your own email provider:

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
 

## Deploy the customized web site from WebMatrix to Windows Azure

1. In WebMatrix, click  **Publish** from the **Home** ribbon to display the **Publish Preview** dialog box for the web site.

	![WebMatrix Publish Preview][howtopublishpreview]

2. Click to select the checkbox next to bakery.sdf and then click **Continue**.  When publishing is completed the URL for the updated web site on Windows Azure is displayed at the bottom of the WebMatrix IDE.  

	![Publishing Complete][publishcomplete]

4. Click on the link to open the web site in your browser:

	![Bakery Sample Site][bakerysample]

	The URL for the web site can also be found in the Windows Azure portal by clicking **Web Sites** to display all web sites for your subscription. The URL for each web site is displayed in the URL column on the web sites page.

## Modify the web site and republish it to the Windows Azure web site

You can use WebMatrix to modify the site and republish it to your Windows Azure web site. In the following procedure you will add a check box to indicate that the order is a gift.

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

7. On the **Publish Preview** dialog box make sure both the Order.cshtml is checked and click continue.

8. Click on the link to open the web site in your browser and test the update on your Windows Azure web site.

# Next Steps

You've seen how to create and deploy a web site from WebMatrix to Windows Azure. To learn more about WebMatrix, check out these resources:

* [WebMatrix for Windows Azure](http://go.microsoft.com/fwlink/?LinkID=253622&clcid=0x409)

* [WebMatrix website](http://www.microsoft.com/click/services/Redirect2.ashx?CR_CC=200106398)

[createnewsite]: ../../../Shared/media/howtocreatenewsite.png
[opensiteinwebmatrix2]: ../../../Shared/media/howtoopensiteinWebMatrix2a.png
[howtodownloadsite]: ../../../Shared/media/howtodownloadsite.png
[howtositefromtemplate]: ../../../Shared/media/howtositefromtemplate.png
[howtowebmatrixide]: ../../../Shared/media/howtowebmatrixide.png
[howtopublishpreview]: ../../../Shared/media/howtopublishpreview.png
[bakerysampleopeninwebmatrix2]: ../../../Shared/media/howtowebmatrix2ide.png
[publishcomplete]: ../../../Shared/media/howtopublished2.png
[bakerysample]: ../../../Shared/media/howtobakerysamplesite.png

[modify1]: ../media/website-with-webmatrix-sample-mod-1-1.png
[modify2]: ../media/website-with-webmatrix-sample-mod-1-2.png
[modify3]: ../media/website-with-webmatrix-sample-mod-1-3.png
[modify4]: ../media/website-with-webmatrix-sample-mod-1-4.png
[modify5]: ../media/website-with-webmatrix-sample-mod-1-5.png
[modify6]: ../media/website-with-webmatrix-sample-mod-1-6.png
[modify7]: ../media/website-with-webmatrix-sample-mod-1-7.png
[modify8]: ../media/website-with-webmatrix-sample-mod-1-8.png

[webmatrix]: http://www.microsoft.com/web/webmatrix/
[sendmailissues]: http://go.microsoft.com/fwlink/?LinkId=253001#email
