The Web Sites gallery makes available a wide range of popular web applications developed by Microsoft, third party companies and open source software initiatives. Web applications created from the gallery do not require installation of any software other than the browser used to connect to the Windows Azure portal. When creating web sites from the gallery you should be able to create, deploy, and have a fully operational web site running in 3 to 5 minutes.

This topic describes how to create and publish a WordPress blog web site from the gallery to a web site.

###Create and publish a web site from the gallery to Windows Azure###
Follow these steps to create, deploy and run a WordPress blog web site on Windows Azure:

1. Login to the Windows Azure portal.
2. Click the **Create New** icon on the bottom left of the Windows Azure portal.
3. Click the **Web Site** icon, click **From Gallery**, locate and click the WordPress icon in the A-Z list displayed under Find Apps for Azure and then click **Next**.
4. On the Configure Your App/Site Settings page enter or select appropriate values for all fields and click **Next**.

	**Note**
	When choosing a region, select the region that is closest to your target audience. Selecting the region that is closest to the geographical location of your target audience will minimize latency for their connections to your web site. If you have not determined the geographical location of your target audience then consider selecting a region in the central U.S. so that latency will be similar for users on both the east and west coasts.
5. On the **Configure Your App/Database Settings** page select **New Database**, enter appropriate values for all fields and then click **Complete**. After you click **Complete** Windows Azure will initiate build and deploy operations. While the web site is being built and deployed the status of these operations is displayed at the bottom of the Web Sites page. After all operations are performed a final status message indicates whether the operations succeeded. When this message indicates that operations were successful click **Ok**.
6. Open the web site's **Dashboard** management page.
7. On the **Dashboard** management page click the link under **Site Url** to open the site’s welcome page. Enter appropriate configuration information required by WordPress and click **Install Wordpress** to finalize configuration and open the web site’s login page.
8. Login to the new WordPress web site by entering the username and password that you specified on the **Welcome** page.