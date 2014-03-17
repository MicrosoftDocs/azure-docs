
<a name="bkmk_configsharedmode"></a><h2>Configure your web sites for shared or standard mode</h2>

Setting a custom domain name on a web site is only available for the Shared and Standard modes for Windows Azure web sites. Before switching a web site from the Free web site mode to the Shared or Standard web site mode, you must first remove spending caps in place for your Web Site subscription. For more information on Shared and Standard mode pricing, see [Pricing Details][PricingDetails].

1. In your browser, open the [Management Portal][portal].
2. In the **Web Sites** tab, click the name of your site.

	![][standardmode1]

3. Click the **SCALE** tab.

	![][standardmode2]

	
4. In the **general** section, set the web site mode by clicking **SHARED**.

	![][standardmode3]

	> [WACOM.NOTE] If you will be using Traffic Manager with this web site, you must use select Standard mode instead of Shared.

5. Click **Save**.
6. When prompted about the increase in cost for Shared mode (or for Standard mode if you choose Standard), click **Yes** if you agree.

	<!--![][standardmode4]-->

	**Note**<br /> 
	If you receive a "Configuring scale for web site 'web site name' failed" error, you can use the details button to get more information. 