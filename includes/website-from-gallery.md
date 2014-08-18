The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the Azure Management Portal. 

In this tutorial, you'll learn:

- How to create a new site through the gallery.

- How to deploy the site through the Azure Portal.
 
You'll build a WordPress blog that uses a default template. The following illustration shows the completed application:


![Wordpress blog][13]

<div class="dev-callout"><strong>Note</strong>
<p>To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/" target="_blank">Create an Azure account</a>.</p>
</div>
<br />

## Create a website in the portal

1. Login to the [Azure Management Portal](http://manage.windowsazure.com).

2. Click the **New** icon on the bottom left of the dashboard.
	
	![Create New][5]

3. Click the **Website** icon, and click **From Gallery**.
	
	![Create From Gallery][6]

4. Locate and click the WordPress icon in list, and then click **Next**.
	
	![WordPress from list][7]

5. On the **Configure Your App** page, enter or select values for all fields:
	
- Enter a URL name of your choice	
- Leave **Create a new MySQL database** selected in the **Database** field
- Select the region closest to you

	![configure your app][8]

6. Then click **Next**.

7. On the **Create New Database** page, you can specify a name for your new MySQL database or use the default name. Select the region closest to you as the hosting location. Select the box at the bottom of the screen to agree to ClearDB's usage terms for your hosted MySQL database. Then click the check to complete the site creation. 
	
	![create database][9]

After you click **Complete** Azure will initiate build and deploy operations. While the website is being built and deployed the status of these operations is displayed at the bottom of the Websites page. After all operations are performed,  A final status message when the site has been successfully deployed.

## Launch and manage your WordPress site

1. Click on your new site from the **Websites** page to open the dashboard for the site.

	![launch dashboard][10]

2. On the **Dashboard** management page, scroll down and click the link on the left under **Site Url** to open the site's welcome page.

	![site URL][11] 

3. Enter appropriate configuration information required by WordPress and click **Install WordPress** to finalize configuration and open the website's login page.

	![login to WordPress][12]

4. Login to the new WordPress website by entering the username and password that you specified on the **Welcome** page.

5. You'll have a new WordPress site that looks similar to the site below.  

	![your WordPress site][13]






[5]: ./media/website-from-gallery/wordpressgallery-01.png
[6]: ./media/website-from-gallery/wordpressgallery-02.png
[7]: ./media/website-from-gallery/wordpressgallery-03.png
[8]: ./media/website-from-gallery/wordpressgallery-04.png
[9]: ./media/website-from-gallery/wordpressgallery-05.png
[10]: ./media/website-from-gallery/wordpressgallery-06.png
[11]: ./media/website-from-gallery/wordpressgallery-07.png
[12]: ./media/website-from-gallery/wordpressgallery-08.png
[13]: ./media/website-from-gallery/wordpressgallery-09.png





