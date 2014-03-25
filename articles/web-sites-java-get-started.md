<properties linkid="develop-java-tutorials-web-site-get-started" urlDisplayName="Get started with Azure" pageTitle="Get started with Microsoft Azure Web Sites using Java" metaKeywords="" description="This tutorial shows you how to deploy a Java web site to Microsoft Azure." metaCanonical="" services="web-sites" documentationCenter="Java" title="Get started with Azure and Java" videoId="" scriptId="" authors="waltpo" solutions="" manager="keboyd" editor="mollybos" />

# Get started with Microsoft Azure Web Sites and Java

This tutorial shows how to create a web site on Microsoft Azure using Java. The example shown will use the Azure application gallery to select a Java application container, either Apache Tomcat or Jetty.

The following shows how a web site built using Tomcat from the application gallery would appear:

![Web site using Apache Tomcat](./media/web-sites-java-get-started/tomcat.png)


The following shows how a web site built using Jetty from the application gallery would appear:

![Web site using Jetty](./media/web-sites-java-get-started/jetty.png)

<div class="dev-callout"><strong>Note</strong><p>To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can <a href="/en-us/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F" target="_blank">activate your MSDN subscriber benefits</a> or <a href="/en-us/pricing/free-trial/?WT.mc_id=A261C142F" target="_blank">sign up for a free trial</a>.</p></div>
 
# Create a Java web site using the Azure application gallery

1. Login to the Microsoft Azure Management Portal.
2. Click **New**, click **Compute**, click **Web Site**, and then click **From Gallery**.
3. From the list of apps, select one of the Java application servers, such as **Apache Tomcat** or **Jetty**.
4. Click **Next**.
5. Specify the URL name.
6. Select a region. For example, **West US**.
7. Click **Complete**.

Within a few moments, your web site will be created. To view the web site, within the Azure Management Portal, in the **Web Sites** view, wait for the status to show as **Running** and then click the URL for the web site.

At this point, you have a Java application server running as your Java web site on Azure. To add in your own web page or application, see [Add a web page or application to your Java web site](../web-sites-java-add-app).


