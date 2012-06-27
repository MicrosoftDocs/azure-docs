# Create an Orchard CMS web site from the gallery in Windows Azure

The gallery makes available a wide range of popular web applications developed by Microsoft, third party companies, and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the [Windows Azure Management Portal](http://manage.windowsazure.com). 

In this tutorial, you'll learn:

- How to create a new site through the gallery.

- How to deploy the site through the Windows Azure Portal.
 
You'll build an Orchard CMS site that uses a default template. [Orchard](http://www.orchardproject.net/) is a free, open-source,.NET-base CMS application that allows you to create customized, content-driven web sites. Orchard CMS includes an extensibility framework through which you can [download additional modules and themes](http://gallery.orchardproject.net/) to customize your site. The following illustration shows the Orchard CMS site that you will create:

![Orchard blog][13]

## Create a Windows Azure account

<div chunk="../../Shared/Chunks/create-azure-account.md" />

## Enable Windows Azure Web Sites

<div chunk="../../Shared/Chunks/antares-iaas-signup.md" />

## Create a web site in the portal

1. Login to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click the **New** icon on the bottom left of the dashboard.
	
	![Create New][1]

3. Click the **Web Site** icon, and click **From Gallery**.
	
	![Create From Gallery][2]

1. Locate and click the Orchard CMS icon in list, and then click **Next**.
	
	![Orchard from list][3]

4. On the **Configure Your App** page, enter or select values for all fields:
	
- Enter a URL name of your choice	
- Select the region closest to your users (this will ensure best performance)
- Specify the database user name of your choice in the **Database Username** field, or leave the default **orchard**.  This user will be an administrator on your database.
- Enter a database password in the **Enter Password** and **Confirm Password** boxes.

	![configure your app][4]

5. Then click the **Complete** check box.

After you click **Complete** Windows Azure will initiate build and deploy operations. While the web site is being built and deployed the status of these operations is displayed at the bottom of the Web Sites page. After all operations are performed,  A final status message when the site has been successfully deployed.

## Launch and manage your Orchard site

1. Click on your new site from the **Web Sites** page to open the dashboard for the site.

	![launch dashboard][5]

7. On the **Dashboard** management page, scroll down and click the link on the left under **Site Url** to open the site’s welcome page.

	![site URL][6] 

3. Enter appropriate configuration information required by Orchard and click **Finish Setup** to finalize configuration and open the web site’s home page.

	![login to Orchard][7]

9. You'll have a new Orchard site that looks similar to the screenshot below.  

	![your Orchard site][13]

10. Follow the details in the [Orchard Getting Started Guide](http://orcharddocs.apphb.com/Documentation/Getting-Started) to learn more about Orchard and configure your new site.

## Next Steps
* [Develop and deploy a web site with Microsoft WebMatrix](/en-us/develop/net/tutorials/website-with-webmatrix) -- Learn how to edit a Windows Azure web site in WebMatrix. 
* [Deploying an ASP.NET Web Application to a Windows Azure Web Site and SQL Database](/en-us/develop/net/tutorials/web-site-with-sql-database/)-- Learn how to creat a new web site from Visual Studio.

[1]: ../media/orchardgallery-01.png
[2]: ../media/orchardgallery-02.png
[3]: ../media/orchardgallery-03.png
[4]: ../media/orchardgallery-04.png
[5]: ../media/orchardgallery-05.png
[6]: ../media/orchardgallery-06.png
[7]: ../media/orchardgallery-07.png
[13]: ../media/orchardgallery-08.png
[http://www.windowsazure.com]: http://www.windowsazure.com
[0]: ../../devcenter/shared/media/freetrialonwindowsazurehomepage.png
[14]: ../../devcenter/shared/media/antares-iaas-preview-01.png
[15]: ../../devcenter/shared/media/antares-iaas-preview-05.png
[16]: ../../devcenter/shared/media/antares-iaas-preview-06.png