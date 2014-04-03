After the records for your domain name have propagated, you should be able to use your browser to verify that your custom domain name can be used to access your web site.

> [WACOM.NOTE] It can take some time for your CNAME to propagate through the DNS system. You can use a service such as <a href="http://www.digwebinterface.com/">http://www.digwebinterface.com/</a> to verify that the CNAME is available.

If you have not already added your web site as a Traffic Manager endpoint, you must do this before name resolution will work, as the custom domain name routes to Traffic Manager. Traffic Manager then routes to your web site. Use the information in [Add or Delete Endpoints](http://msdn.microsoft.com/en-us/library/windowsazure/hh744839.aspx) to add your web site as an endpoint in your Traffic Manager profile.

> [WACOM.NOTE] If your web site is not listed when adding an endpoint, verify that it is configured for Standard mode. You must use Standard mode for your web site in order to work with Traffic Manager.