The Azure Marketplace makes available a wide range of popular web apps developed by Microsoft, third party companies, and open source software initiatives. Web apps created from the Azure Marketplace do not require installation of any software other than the browser used to connect to the Azure Portal. 

In this tutorial, you'll learn:

- How to create a new web app through the Azure Marketplace.

- How to deploy the web app through the Azure Portal.
 
You'll build a WordPress blog that uses a default template. The following illustration shows the completed application:


![Wordpress blog][13]

> [AZURE.IMPORTANT] To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](/develop/php/tutorials/create-a-windows-azure-account/).

## Create a web app in the portal

1. Log in to the [Azure Portal](https://portal.azure.com).

2. Click the **New** icon on the bottom left of the dashboard.
	
	<!--todo:![Create New][5]-->

3. Click the **Web + Mobile** blade. 
	<!--todo:screenshot-->
	
4. Click the **WordPress** icon.

	<!--todo:![WordPress from list][7]-->
	
5. Click on each part (**WEB APP**, **DATABASE**, and **SUBSCRIPTION**) and enter or select values for the required fields:
	
- Enter a URL name of your choice	
- Select the region closest to you

	<!--todo:![configure your app][8]-->

6. When finished defining the web app, click **Create**.

## Launch and manage your WordPress web app
	
1. From the **Web Apps** blade, click on your new web app to open the dashboard.

	<!--todo:![launch dashboard][10]-->

2. On the **Essentials** page, click the link under **Url** to open the web app's welcome page.

	<!--todo:![site URL][11]--> 

3. If you have not installed WordPress, enter the appropriate configuration information required by WordPress and click **Install WordPress** to finalize configuration and open the web app's login page.

	<!--todo:![login to WordPress][12]-->

4. Click **Login** and enter your credentials.  
	<!--todo:screenshot-->

5. You'll have a new WordPress web app that looks similar to the web app below.    

	<!--todo:![your WordPress site][13]-->






[5]: ./media/website-from-gallery/wordpressgallery-01.png
[6]: ./media/website-from-gallery/wordpressgallery-02.png
[7]: ./media/website-from-gallery/wordpressgallery-03.png
[8]: ./media/website-from-gallery/wordpressgallery-04.png
[9]: ./media/website-from-gallery/wordpressgallery-05.png
[10]: ./media/website-from-gallery/wordpressgallery-06.png
[13]: ./media/website-from-gallery/wordpressgallery-09.png
