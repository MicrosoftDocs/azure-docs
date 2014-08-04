<properties linkid="develop-java-tutorials-web-site-get-started" urlDisplayName="Get started with Azure" pageTitle="Get started with Microsoft Azure Web Sites using Java" metaKeywords="" description="This tutorial shows you how to deploy a Java web site to Microsoft Azure." metaCanonical="" services="web-sites" documentationCenter="Java" title="Get started with Azure and Java" videoId="" scriptId="" authors="robmcm" solutions="" manager="wpickett" editor="mollybos" />

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="Java" ms.topic="article" ms.date="01/01/1900" ms.author="robmcm" />

# Get started with Azure web sites and Java

This tutorial shows how to create a web site on Microsoft Azure using Java, using either the Azure application gallery, or the Azure web site configuration UI. 

If you don't want to use either of those techniques, for example, if you want to customize your application container, see [Upload a custom Java web site to Azure](../web-sites-java-custom-upload).

> [WACOM.NOTE] To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can <a href="/en-us/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F" target="_blank">activate your MSDN subscriber benefits</a> or <a href="/en-us/pricing/free-trial/?WT.mc_id=A261C142F" target="_blank">sign up for a free trial</a>.

# Create a Java web site using the Azure application gallery

This information shows how to use the Azure application gallery to select a Java application container, either Apache Tomcat or Jetty, for your web site.

The following shows how a web site built using Tomcat from the application gallery would appear:

![Web site using Apache Tomcat](./media/web-sites-java-get-started/tomcat.png)

The following shows how a web site built using Jetty from the application gallery would appear:

![Web site using Jetty](./media/web-sites-java-get-started/jetty.png)

1. Log in to the Microsoft Azure Management Portal.
2. Click **New**, click **Compute**, click **Web Site**, and then click **From Gallery**.
3. From the list of apps, select one of the Java application servers, such as **Apache Tomcat** or **Jetty**.
4. Click **Next**.
5. Specify the URL name.
6. Select a region. For example, **West US**.
7. Click **Complete**.

Within a few moments, your web site will be created. To view the web site, within the Azure Management Portal, in the **Web Sites** view, wait for the status to show as **Running** and then click the URL for the web site.

Now that you've create the web site with an app container, see the **Next steps** section for information about uploading your application to the web site.

# Create a Java web site using the Azure configuration UI

This information shows how to use the Azure configuration UI to select a Java application container, either Apache Tomcat or Jetty, for your web site.

1. Log in to the Microsoft Azure Management Portal.
2. Click **New**, click **Compute**, click **Web Site**, and then click **Quick Create**.
3. Specify the URL name.
4. Select a region. For example, **West US**.
5. Click **Complete**. Within a few moments, your web site will be created. To view the web site, within the Azure Management Portal, in the **Web Sites** view, wait for the status to show as **Running** and then click the URL for the web site.
6. Still within the Azure Management Portal, in the **Web Sites** view, click the name of your web site to open the 
dashboard.
7. Click **Configure**.
8. In the **General** section, enable **Java** by clicking the available version.
9. The options for the web container are displayed, for example, Tomcat and Jetty. Select the web container that you want to use. 
10. Click **Save**. 

Within a few moments, your web site will become Java-based. To confirm it is Java-based, within the Azure Management Portal, in the **Web Sites** view, wait for the status to show as **Running** and then click the URL for the web site. Note that the page will provide text stating that the new site is a Java-base web site.

Now that you've create the web site with an app container, see the **Next steps** section for information about uploading your application to the web site.

# Next steps

At this point, you have a Java application server running as your Java web site on Azure. To add in your own application or web page, see [Add an application or web page to your Java web site](../web-sites-java-add-app).
