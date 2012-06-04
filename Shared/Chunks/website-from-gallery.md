The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the Windows Azure Management Portal. 

In this tutorial, you'll learn:

- How to create a new site through the gallery.

- How to deploy the site through the Windows Azure Portal.
 
You'll build a Word press blog that uses a default template. The following illustration shows the completed application:


![Wordpress blog][13]

## Create a Windows Azure account

<div chunk="../../DevCenter/Shared/Chunks/create-azure-account.md" />

## Enable Windows Azure Web Sites

<div chunk="../../DevCenter/Shared/Chunks/antares-iaas-signup.md" />

## Create a web site in the portal

1. Login to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click the **New** icon on the bottom left of the dashboard.
	
	![Create New][5]

3. Click the **Web Site** icon, and click **From Gallery**.
	
	![Create From Gallery][6]

1. Locate and click the WordPress icon in list, and then click **Next**.
	
	![Wordpress from list][7]

4. On the **Configure Your App** page, enter or select values for all fields:
	
- Enter a URL name of your choice	
- Leave **Create a new MySQL database** selected in the **Database** field
- Select the region closest to you

	![configure your app][8]

5. Then click **Next**.

5. On the **Create New Database** page, you can specify a name for your new MySQL database or use the default name. Select the region closest to you as the hosting location. Select the box at the bottom of the screen to agree to ClearDB's usage terms for your hosted MySQL database. Then click the check to complete the site creation. 
	
	![create database][9]

After you click **Complete** Windows Azure will initiate build and deploy operations. While the web site is being built and deployed the status of these operations is displayed at the bottom of the Web Sites page. After all operations are performed,  A final status message when the site has been successfully deployed.

## Launch and manage your Wordpress site

1. Click on your new site from the **Web Sites** page to open the dashboard for the site.

	![launch dashboard][10]

7. On the **Dashboard** management page, scroll down and click the link on the left under **Site Url** to open the site’s welcome page.

	![site URL][11] 

3. Enter appropriate configuration information required by WordPress and click **Install Wordpress** to finalize configuration and open the web site’s login page.

	![login to wordpress][12]

8. Login to the new WordPress web site by entering the username and password that you specified on the **Welcome** page.

9. You'll have a new Wordpress site that looks similar to the site below.  

	![your Wordpress site][13]


[1]: ../../devcenter/dotnet/media/Dev-net-getting-started-010.png
[2]: ../../devcenter/shared/media/antares-iaas-preview-01.png
[3]: ../../devcenter/shared/media/antares-iaas-preview-02.png
[4]: ../../devcenter/shared/media/antares-iaas-preview-04.png
[5]: ../media/wordpressgallery-01.png
[6]: ../media/wordpressgallery-02.png
[7]: ../media/wordpressgallery-03.png
[8]: ../media/wordpressgallery-04.png
[9]: ../media/wordpressgallery-05.png
[10]: ../media/wordpressgallery-06.png
[11]: ../media/wordpressgallery-07.png
[12]: ../media/wordpressgallery-08.png
[13]: ../media/wordpressgallery-09.png