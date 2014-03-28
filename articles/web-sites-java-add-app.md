<properties linkid="develop-java-tutorials-web-site-add-app" urlDisplayName="Add an application to your Java web site" pageTitle="Add an application to your Java web site" metaKeywords="" description="This tutorial shows you how to add a page or application to your Java web site on Microsoft Azure." metaCanonical="" services="web-sites" documentationCenter="Java" title="Add an application to your Java web site" videoId="" scriptId="" authors="waltpo" solutions="" manager="keboyd" editor="mollybos" />

# Add an application to your Java web site on Azure

This tutorial shows how to add in a web page or an application to a Java web site that was previously created using the Azure gallery or the Azure configuration UI.

Note that you can use source control to upload your application or web pages, including in continuous integration scenarios. Instructions for using source control with your web site are available at [Publishing from Source Control to Azure Web Sites](../web-sites-publish-source-control). As an alternative to source control, this article will show how to use FTP to upload the application.

This tutorial assumes you have already completed the steps at [Get started with Microsoft Azure Web Sites and Java](../web-sites-java-get-started).

# Customize a web site using FTP
You'll need to determine your FTP credentials, and use them to access the the web site contents. Then, you can modify the contents to run your application. The example shown here will use File Explorer to facilitate FTP, but you can use other FTP techniques as well. 

## Use FTP credentials to access your site contents

1. Within the Microsoft Azure Management Portal, navigate to the **Web Sites** view.
2. Within the **Web Sites** view, click the name of your web site.
3. Click **Dashboard**.
4. Within the **Dashboard** view, under **Quick Glance**, click **Download the publish profile**. Save this file locally. Ensure that you keep this file secure, as it contains the user name and password that allows publishing to your site (as well as copying contents from your site).
5. Open the downloaded Publish Settings file using a text editor. Within that file, note the values for **userName** and **userPwd**. They represent the user name and password, respectively, that you will use to access the files in the site.
6. Access your web site's files, providing the user name and password when prompted. This example will use FTP from within Internet Explorer, but you can use other techniques as well. To proceed with using FTP, within the **Dashboard** view, click the URL listed under **FTP Host Name**. (You can also determine the FTP host name from within the Publish Settings file, it is the value assigned to **publishUrl**.) 
7. When prompted for the user name and password, use the values specified in the Publish Settings file for **userName** and **userPwd**. 
8. Still within Internet Explorer, to switch to File Explorer view, click **View**, and then click **Open FTP site in File Explorer**.

## Access the webapps folder for your web site

Within the File Explorer view of your web site on Azure, you can now customize your web site. You'll need to copy your application to the **webapps** folder for your web site. The navigation path to that folder differs based on how you set up your web site.

- If you set up your web site by using the Azure application gallery, within File Explorer, double-click **site**, double-click **wwwroot**, double-click **bin**, double-click the version of the application server that your web site is using, and then double-click **webapps**. 
- If you set up your web site by using the Azure configuration UI, within File Explorer, double-click **site**, double-click **wwwroot**, and then double-click **webapps**. 
- If you set up your web site by using a custom upload, navigate as needed to the **webapps** folder. 

## To add a WAR file to your web site using FTP

1. Navigate to the **webapps** folder using the technique appropriate for your web site, as described above.
2. Copy your WAR file to the **webapps** folder.

The application server will detect that you've added the WAR file, and will automatically load it. You can then run your app in the browser, via the URL for your web site with the name of the WAR file appended to it. 

For example, browse to http://*mysitename*.azurewebsites.net/*mywar*, where *mysitename* is the name you specified for your URL, and *mywar* is the case-sensitive name of the WAR that you copied (without the trailing **.war**).

## To add a web page to your web site using FTP
1. Navigate to the **webapps** folder. 
2. Create a new folder within the **webapps** folder.
3. Open the new folder.
4. Add your web page to the new folder. 
 
The application server will detect that you've added the new folder and web file, and will automatically load it. 
Then, run your JSP file using the URL in the form of http://*mysitename*.azurewebsites.net/*myfolder*/*myfile.jsp*, where *mysitename* is the name you specified for your URL, *myfolder* is the folder you created in **webapps**, and *myfile.jsp* is the name of the JSP file that you created.

Note that if you copy files (other than WAR files) to the ROOT directory, the application server will need to be restarted before those files are used. The autoload functionality for the Java web sites running on Azure is based on a new WAR file being added, or new files or directories added to the **webapps** folder.  


  