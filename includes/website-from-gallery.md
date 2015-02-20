The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the Azure Management Portal. 

In this tutorial, you'll learn:

- How to create a new site through the gallery.

- How to deploy the site through the Azure Management Portal.
 
You'll build a WordPress blog that uses a default template. The following illustration shows the completed application:


![Wordpress blog][13]

> [AZURE.IMPORTANT] To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/"%20target="_blank").

## Create a website in the portal

1. Login to the [Azure Management Portal](http://manage.windowsazure.com).

2. Click the **New** icon on the bottom left of the dashboard.
	
	![Create New][5]

3. Click the **Website** icon, and click **From Gallery**.
	
	![Create From Gallery][6]

4. Click **CMS**, then select **WordPress**. Click **Next**.
	
	![WordPress from list][7]

5. On the **Configure Your App** page, enter or select values for all fields:
	
- Enter a URL name of your choice	
- Leave **Create a new MySQL database** selected in the **Database** field
- Select the web scale group

	![configure your app][8]

6. Then click **Next**.

7. On the **Create New Database** page, you can specify a name for your new MySQL database or use the default name. Select the region closest to your website as the hosting location. Select the box at the bottom of the screen to agree to ClearDB's usage terms for your hosted MySQL database. Then click the check to complete the site creation. 
	
	![create database][9]

After you click **Complete** Azure will initiate build and deploy operations. While the website is being built and deployed the status of these operations is displayed at the bottom of the Websites page. After all operations are performed,  A final status message when the site has been successfully deployed.

## Launch and manage your WordPress site

1. Click on the URL of your new website from the **Websites** page to open its welcome page.

	![site URL][10]

3. Enter appropriate configuration information required by WordPress and click **Install WordPress** to finalize configuration and open the website's login page.

4. Login to the new WordPress website by entering the username and password that you specified on the **Welcome** page.

5. You'll have a new WordPress site that looks similar to the site below.  

	![your WordPress site][13]






[5]: ./media/website-from-gallery/wordpressgallery-01.png
[6]: ./media/website-from-gallery/wordpressgallery-02.png
[7]: ./media/website-from-gallery/wordpressgallery-03.png
[8]: ./media/website-from-gallery/wordpressgallery-04.png
[9]: ./media/website-from-gallery/wordpressgallery-05.png
[10]: ./media/website-from-gallery/wordpressgallery-06.png
[13]: ./media/website-from-gallery/wordpressgallery-09.png





