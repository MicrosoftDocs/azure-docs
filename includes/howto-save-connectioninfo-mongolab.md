While it's possible to paste a MongoLab URI into your code, we recommend configuring it in the environment for ease of management. This way, if the URI changes, you can update it through the Azure Portal without going to the code.


1. In the Azure Portal, select **Websites**.
1. Click the name of the website in the website list.  
![WebSiteEntry][entry-website]  
The Website Dashboard displays.

1. Click **Configure** in the menu bar.  
![WebSiteDashboardConfig][focus-mongolab-websitedashboard-config]

1. Scroll down to the Connection Strings section.  
![WebSiteConnectionStrings][focus-mongolab-websiteconnectionstring]

1. For **Name**, enter MONGOLAB_URI.
1. For **Value**, paste the connection string we obtained in the previous section.
1. Select **Custom** in the **Type** drop-down list (instead of the default **SQLAzure**).
1. Click **Save** on the toolbar.  
![SaveWebSite][button-website-save]

**Note:** Azure adds the **CUSTOMCONNSTR\_** prefix to this variable, which is why the code above references **CUSTOMCONNSTR\_MONGOLAB_URI.**

[entry-website]: ./media/howto-save-connectioninfo-mongolab/entry-website.png
[focus-mongolab-websitedashboard-config]: ./media/howto-save-connectioninfo-mongolab/focus-mongolab-websitedashboard-config.png
[focus-mongolab-websiteconnectionstring]: ./media/howto-save-connectioninfo-mongolab/focus-mongolab-websiteconnectionstring.png
[button-website-save]: ./media/howto-save-connectioninfo-mongolab/button-website-save.png
