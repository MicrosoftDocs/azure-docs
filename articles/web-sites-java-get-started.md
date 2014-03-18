<properties linkid="develop-java-tutorials-web-site-get-started" urlDisplayName="Get started with Windows Azure" pageTitle="Get started with Microsoft Azure Web Sites using Java" metaKeywords="" description="This tutorial shows you how to deploy a Java web site to Microsoft Azure." metaCanonical="" services="web-sites" documentationCenter="Java" title="Get started with Windows Azure and Java" videoId="" scriptId="" authors="waltpo" solutions="" manager="keboyd" editor="mollybos" />

# Get started with Microsoft Azure Web Sites and Java

This tutorial shows how to create a web site on Microsoft Azure using Java. The example shown will use Apache Tomcat as the application container, and FTP as the transfer protocol to add in your custom web page or application.

<div class="dev-callout"><strong>Note</strong><p>To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can <a href="/en-us/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F" target="_blank">activate your MSDN subscriber benefits</a> or <a href="/en-us/pricing/free-trial/?WT.mc_id=A261C142F" target="_blank">sign up for a free trial</a>.</p></div>
 
# Create a web site

1. Login to the Microsoft Azure Management Portal.
2. Click **New**, click **Compute**, click **Web Site**, and then click **From Gallery**.
3. From the list of apps, select **Apache Tomcat** and then click **Next**.
4. Specify the URL name.
5. Select a region. For example, **West US**.
6. Click **Complete**.

Within a few moments, your web site will be created. To view the web site, within the Azure Management Portal, in the **Web Sites** view, wait for the status to show as **Running** and then click the URL.

What you have installed so far is a web site running an Apache Tomcat application container. The next section shows how to customize the web site.

# Customize a web site running in the application container

1. Within the Microsoft Azure Management Portal, navigate to the **Web Sites** view.
2. Within the **Web Sites** view, click the name of your web site.
3. Click **Dashboard**.
4. Within the **Dashboard** view, under **Quick Glance**, click **Download the publish profile**. Save this file locally. Ensure that you keep this file secure, as it contains the user name and password that allows publishing to the site (as well as copying from the site).
5. Open the downloaded Publish Settings file using a text editor. Within that file, note that values for **userName** and **userPwd**. They represent the user name and password, respectively, that you will use to access the files in the site.
6. Access your web sites files, providing the user name and password when prompted. This example will use FTP from within Internet Explorer, but you can use other techniques as well. To proceed with using FTP, within the **Dashboard** view, click the URL listed under **FTP Host Name**.
7. When prompted for the user name and password, use the values specified in the Publish Settings file for **userName** and **userPwd**. 
8. Still in Internet Explorer, to switch to File Explorer view, click **View**, then click **Open FTP site in File Explorer**.

Within the File Explorer view of your web site on Windows Azure, you can now customize your web site. For example, if you have built a WAR file, you can run it as part of your web site:

1. Navigate to the **webapps** folder: Click **site**, click **wwwroot**, click **bin**, click **tomcat**, and then click **webapps**.
2. Copy your WAR file to the **webapps** folder.

Tomcat will detect that you've added the WAR file, and will automatically load it. You can then run your app in the browser, via the URL for your web site with the name of the WAR file appended to it. 

For example, browse to http://*mysitename*.azurewebsites.net/*mywar*, where *mysitename* is the name you specified for your URL, *mywar* is the name of the WAR that you copied (without the trailing **.war**).

Similarly, if you want to upload a basic JSP page but don't want to create a WAR file, create a new folder within **webapps**, and then add your JSP file to the new folder. Then, run your JSP file using the URL in the form of http://*mysitename*.azurewebsites.net/*myfolder*/*myfile.jsp*, where *mysitename* is the name you specified for your URL, *myfolder* is the folder you created in **webapps**, and *myfile.jsp* is the name of the JSP file that you created.

