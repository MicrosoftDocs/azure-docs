<properties 
	pageTitle="Use Azure CDN in Azure App Service" 
	description="A tutorial that teaches you how to deploy a web app to Azure App Service that serves content from an integrated Azure CDN endpoint" 
	services="app-service\web,cdn" 
	documentationCenter=".net" 
	authors="cephalin" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/01/2016" 
	ms.author="cephalin"/>


# Use Azure CDN in Azure App Service

[App Service](http://go.microsoft.com/fwlink/?LinkId=529714) can be integrated with [Azure CDN](/services/cdn/), adding to the global scaling capabilities inherent in [App Service Web Apps](http://go.microsoft.com/fwlink/?LinkId=529714) by serving your web app content globally from server nodes near your customers (an updated list of all current node locations can be found [here](http://msdn.microsoft.com/library/azure/gg680302.aspx)). In scenarios like serving static images, this integration can dramatically increase the performance of your Azure App Service Web Apps and significantly improves your web app's user experience worldwide. 

Integrating Web Apps with Azure CDN gives you the following advantages:

- Integrate content deployment (images, scripts, and stylesheets) as part of your web app's [continuous deployment](web-sites-publish-source-control.md) process
- Easily upgrade the NuGet packages in your web app in Azure App Service, such as jQuery or Bootstrap versions 
- Manage your Web application and your CDN-served content from the same Visual Studio interface
- Integrate ASP.NET bundling and minification with Azure CDN

[AZURE.INCLUDE [app-service-web-to-api-and-mobile](../../includes/app-service-web-to-api-and-mobile.md)] 

## What you will build ##

You will deploy a web app to Azure App Service using the default ASP.NET MVC template in Visual Studio, add code to serve content from an integrated Azure CDN, such as an image, controller action results, and the default JavaScript and CSS files, and also write code to configure the fallback mechanism for bundles served in the event that the CDN is offline.

## What you will need ##

This tutorial has the following prerequisites:

-	An active [Microsoft Azure account](/account/)
-	Visual Studio 2015 with the [Azure SDK for .NET](http://go.microsoft.com/fwlink/p/?linkid=323510&clcid=0x409). If you use Visual Studio, the steps may vary.

> [AZURE.NOTE] You need an Azure account to complete this tutorial:
> + You can [open an Azure account for free](/pricing/free-trial/) - You get credits you can use to try out paid Azure services, and even after they're used up you can keep the account and use free Azure services, such as Web Apps.
> + You can [activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/) - Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.
>
> If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

## Deploy a web app to Azure with an integrated CDN endpoint ##

In this section, you will deploy the default ASP.NET MVC application template in Visual Studio 2015 to App Service, and then integrate it with a new CDN endpoint. Follow the instructions below:

1. In Visual Studio 2015, create a new ASP.NET web application from the menu bar by going to **File > New > Project > Web > ASP.NET Web Application**. Give it a name and click **OK**.

	![](media/cdn-websites-with-cdn/1-new-project.png)

3. Select **MVC** and click **OK**.

	![](media/cdn-websites-with-cdn/2-webapp-template.png)

4. If you haven't logged into your Azure account yet, click the account icon in the upper-right corner and follow the dialog to log into your Azure account. Once you're done, configure your app as shown below, then click **New** to create a new App Service plan for your app.  

	![](media/cdn-websites-with-cdn/3-configure-webapp.png)

5. Configure a new App Service plan in the dialog as shown below and click **OK**. 

	![](media/cdn-websites-with-cdn/4-app-service-plan.png)

8. Click **Create** to create the web app.

	![](media/cdn-websites-with-cdn/5-create-website.png)

9. Once your ASP.NET application is created, publish it to Azure in the Azure App Service Activity pane by clicking **Publish `<app name>` to this Web App now**. Click **Publish** to complete the process.

	![](media/cdn-websites-with-cdn/6-publish-website.png)

	You will see your published web app in the browser when publishing is complete. 

1. To create a CDN endpoint, log into the [Azure portal](https://portal.azure.com). 
2. Click **+ New** > **Media + CDN** > **CDN**.

	![](media/cdn-websites-with-cdn/create-cdn-profile.png)

3. Specify the **CDN**, **Location**, **Resource group**,  **Pricing tier**, then click **Create**

	![](media/cdn-websites-with-cdn/7-create-cdn.png)	

4. In the **CDN Profile** blade click on **+ Endpoint** button. Give it a name, select **Web App** in the **Origin Type** dropdown and your web app in the **Origin hostname** dropdown, then click **Add**.  

	![](media/cdn-websites-with-cdn/cdn-profile-blade.png)



	> [AZURE.NOTE] Once your CDN endpoint is created, the **Endpoint** blade will show you its CDN URL and the origin domain that it's integrated with. However, it can take a while for the new CDN endpoint's configuration to be fully propagated to all the CDN node locations. 

3. Back in the **Endpoint** blade, click the name of the CDN endpoint you just created.

	![](media/cdn-websites-with-cdn/8-select-cdn.png)

3. Click the **Configure** button. In the **Configure** blade, select **Cache every unique URL** in **Query string caching behavior** dropdown, then click the **Save** button.


	![](media/cdn-websites-with-cdn/9-enable-query-string.png)

Once you enable this, the same link accessed with different query strings will be cached as separate entries.

>[AZURE.NOTE] While enabling the query string is not necessary for this tutorial section, you want to do this as early as possible for convenience since any change here is going to take time to propagate to all the CDN nodes, and you don't want any non-query-string-enabled content to clog up the CDN cache (updating CDN content will be discussed later).

2. Now, navigate to the CDN endpoint address. If the endpoint is ready, you should see your web app displayed. If you get an **HTTP 404** error, the CDN endpoint is not ready. You may need to wait up to an hour for the CDN configuration to be propagated to all the edge nodes. 

	![](media/cdn-websites-with-cdn/11-access-success.png)

1. Next, try to access the **~/Content/bootstrap.css** file in your ASP.NET project. In the browser window, navigate to **http://*&lt;cdnName>*.azureedge.net/Content/bootstrap.css**. In my setup, this URL is:

		http://az673227.azureedge.net/Content/bootstrap.css

	Which corresponds to the following origin URL at the CDN endpoint:

		http://cdnwebapp.azurewebsites.net/Content/bootstrap.css

	When you navigate to **http://*&lt;cdnName>*.azureedge.net/Content/bootstrap.css**, you will be prompted to download the bootstrap.css that came from your web app in Azure. 

	![](media/cdn-websites-with-cdn/12-file-access.png)

You can similarly access any publicly accessible URL at **http://*&lt;serviceName>*.cloudapp.net/**, straight from your CDN endpoint. For example:

-	A .js file from the /Script path
-	Any content file from the /Content path
-	Any controller/action 
-	If the query string is enabled at your CDN endpoint, any URL with query strings
-	The entire Azure web app, if all content is public

Note that it may not be always a good idea (or generally a good idea) to serve an entire Azure web app through Azure CDN. Some of the caveats are:

-	This approach requires your entire site to be public, because Azure CDN cannot serve any private content.
-	If the CDN endpoint goes offline for any reason, whether scheduled maintenance or user error, your entire web app goes offline unless the customers can be redirected to the origin URL **http://*&lt;sitename>*.azurewebsites.net/**. 
-	Even with the custom Cache-Control settings (see [Configure caching options for static files in your Azure web app](#configure-caching-options-for-static-files-in-your-azure-web-app)), a CDN endpoint does not improve the performance of highly-dynamic content. If you tried to load the home page from your CDN endpoint as shown above, notice that it took at least 5 seconds to load the default home page the first time, which is a fairly simple page. Imagine what would happen to the client experience if this page contains dynamic content that must update every minute. Serving dynamic content from a CDN endpoint requires short cache expiration, which translates to frequent cache misses at the CDN endpoint. This hurts the performance of your Azure web app and defeats the purpose of a CDN.

The alternative is to determine which content to serve from Azure CDN on a case-by-case basis in your Azure web app. To that end, you have already seen how to access individual content files from the CDN endpoint. I will show you how to serve a specific controller action through the CDN endpoint in [Serve content from controller actions through Azure CDN](#serve-content-from-controller-actions-through-azure-cdn).

## Configure caching options for static files in your Azure web app ##

With Azure CDN integration in your Azure web app, you can specify how you want static content to be cached in the CDN endpoint. To do this, open *Web.config* from your ASP.NET project (e.g. **cdnwebapp**) and add a `<staticContent>` element to `<system.webServer>`. The XML below configures the cache to expire in 3 days.  

    <system.webServer>
      <staticContent>
        <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="3.00:00:00"/>
      </staticContent>
      ...
    </system.webServer>

Once you do this, all static files in your Azure web app will observe the same rule in your CDN cache. For more granular control of cache settings, add a *Web.config* file into a folder and add your settings there. For example, add a *Web.config* file to the *\Content* folder and replace the content with the following XML:

	<?xml version="1.0"?>
	<configuration>
	  <system.webServer>
	    <staticContent>
	      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="15.00:00:00"/>
	    </staticContent>
	  </system.webServer>
	</configuration>

This setting causes all static files from the *\Content* folder to be cached for 15 days.

For more information on how to configure the `<clientCache>` element, see [Client Cache &lt;clientCache>](http://www.iis.net/configreference/system.webserver/staticcontent/clientcache).

In the next section, I will also show you how you can configure cache settings for controller action results in the CDN cache.

## Serve content from controller actions through Azure CDN ##

When you integrate Web Apps with Azure CDN, it is relatively easy to serve content from controller actions through the Azure CDN. Again, if you decide to serve the entire Azure web app through your CDN, you don't need to do this at all since all the controller actions are reachable through the CDN already. But for the reasons I already pointed out in [Deploy an Azure web app with an integrated CDN endpoint](#deploy-a-web-app-to-azure-with-an-integrated-cdn-endpoint), you may decide against this and choose instead to select the controller action you want to serve from Azure CDN. [Maarten Balliauw](https://twitter.com/maartenballiauw) shows you how to do it with a fun MemeGenerator controller in [Reducing latency on the web with the Azure CDN](http://channel9.msdn.com/events/TechDays/Techdays-2014-the-Netherlands/Reducing-latency-on-the-web-with-the-Windows-Azure-CDN). I will simply reproduce it here.

Suppose in your web app you want to generate memes based on a young Chuck Norris image (photo by [Alan Light](http://www.flickr.com/photos/alan-light/218493788/)) like this:

![](media/cdn-websites-with-cdn/cdn-5-memegenerator.PNG)

You have a simple `Index` action that allows the customers to specify the superlatives in the image, then generates the meme once they post to the action. Since it's Chuck Norris, you would expect this page to become wildly popular globally. This is a good example of serving semi-dynamic content with Azure CDN. 

Follow the steps above to setup this controller action:

1. In the *\Controllers* folder, create a new .cs file called *MemeGeneratorController.cs* and replace the content with the following code. Substitute your file path for `~/Content/chuck.bmp` and your CDN name for `yourCDNName`.


        using System;
        using System.Collections.Generic;
        using System.Diagnostics;
        using System.Drawing;
        using System.IO;
        using System.Net;
        using System.Web.Hosting;
        using System.Web.Mvc;
        using System.Web.UI;

        namespace cdnwebapp.Controllers
        {
          public class MemeGeneratorController : Controller
          {
            static readonly Dictionary<string, Tuple<string ,string>> Memes = new Dictionary<string, Tuple<string, string>>();

            public ActionResult Index()
            {
              return View();
            }

            [HttpPost, ActionName("Index")]
            public ActionResult Index_Post(string top, string bottom)
            {
              var identifier = Guid.NewGuid().ToString();
              if (!Memes.ContainsKey(identifier))
              {
                Memes.Add(identifier, new Tuple<string, string>(top, bottom));
              }

              return Content("<a href=\"" + Url.Action("Show", new {id = identifier}) + "\">here's your meme</a>");
            }

            [OutputCache(VaryByParam = "*", Duration = 1, Location = OutputCacheLocation.Downstream)]
            public ActionResult Show(string id)
            {
              Tuple<string, string> data = null;
              if (!Memes.TryGetValue(id, out data))
              {
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);
              }

              if (Debugger.IsAttached) // Preserve the debug experience
              {
                return Redirect(string.Format("/MemeGenerator/Generate?top={0}&bottom={1}", data.Item1, data.Item2));
              }
              else // Get content from Azure CDN
              {
                return Redirect(string.Format("http://<yourCDNName>.azureedge.net/MemeGenerator/Generate?top={0}&bottom={1}", data.Item1, data.Item2));
              }
            }

            [OutputCache(VaryByParam = "*", Duration = 3600, Location = OutputCacheLocation.Downstream)]
            public ActionResult Generate(string top, string bottom)
            {
              string imageFilePath = HostingEnvironment.MapPath("~/Content/chuck.bmp");
              Bitmap bitmap = (Bitmap)Image.FromFile(imageFilePath);

              using (Graphics graphics = Graphics.FromImage(bitmap))
              {
                SizeF size = new SizeF();
                using (Font arialFont = FindBestFitFont(bitmap, graphics, top.ToUpperInvariant(), new Font("Arial Narrow", 100), out size))
                {
                    graphics.DrawString(top.ToUpperInvariant(), arialFont, Brushes.White, new PointF(((bitmap.Width - size.Width) / 2), 10f));
                }
                using (Font arialFont = FindBestFitFont(bitmap, graphics, bottom.ToUpperInvariant(), new Font("Arial Narrow", 100), out size))
                {
                    graphics.DrawString(bottom.ToUpperInvariant(), arialFont, Brushes.White, new PointF(((bitmap.Width - size.Width) / 2), bitmap.Height - 10f - arialFont.Height));
                }
              }
              MemoryStream ms = new MemoryStream();
              bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
              return File(ms.ToArray(), "image/png");
            }

            private Font FindBestFitFont(Image i, Graphics g, String text, Font font, out SizeF size)
            {
              // Compute actual size, shrink if needed
              while (true)
              {
                size = g.MeasureString(text, font);

                // It fits, back out
                if (size.Height < i.Height &&
                     size.Width < i.Width) { return font; }

                // Try a smaller font (90% of old size)
                Font oldFont = font;
                font = new Font(font.Name, (float)(font.Size * .9), font.Style);
                oldFont.Dispose();
              }
            }
          }
        }

2. Right-click in the default `Index()` action and select **Add View**.

	![](media/cdn-websites-with-cdn/cdn-6-addview.PNG)

3.  Accept the settings below and click **Add**.

	![](media/cdn-websites-with-cdn/cdn-7-configureview.PNG)

4. Open the new *Views\MemeGenerator\Index.cshtml* and replace the content with the following simple HTML for submitting the superlatives:

		<h2>Meme Generator</h2>
		
		<form action="" method="post">
		    <input type="text" name="top" placeholder="Enter top text here" />
		    <br />
		    <input type="text" name="bottom" placeholder="Enter bottom text here" />
		    <br />
		    <input class="btn" type="submit" value="Generate meme" />
		</form>

5. Publish to the Azure web app again and navigate to **http://*&lt;serviceName>*.cloudapp.net/MemeGenerator/Index** in your browser. 

When you submit the form values to `/MemeGenerator/Index`, the `Index_Post` action method returns a link to the `Show` action method with the respective input identifier. When you click the link, you reach the following code:  

    [OutputCache(VaryByParam = "*", Duration = 1, Location = OutputCacheLocation.Downstream)]
    public ActionResult Show(string id)
    {
      Tuple<string, string> data = null;
      if (!Memes.TryGetValue(id, out data))
      {
        return new HttpStatusCodeResult(HttpStatusCode.NotFound);
      }

      if (Debugger.IsAttached) // Preserve the debug experience
      {
        return Redirect(string.Format("/MemeGenerator/Generate?top={0}&bottom={1}", data.Item1, data.Item2));
      }
      else // Get content from Azure CDN
      {
        return Redirect(string.Format("http://<yourCDNName>.azureedge.net/MemeGenerator/Generate?top={0}&bottom={1}", data.Item1, data.Item2));
      }
    }

If your local debugger is attached, then you will get the regular debug experience with a local redirect. If it's running in the Azure web app, then it will redirect to:

	http://<yourCDNName>.azureedge.net/MemeGenerator/Generate?top=<formInput>&bottom=<formInput>

Which corresponds to the following origin URL at your CDN endpoint:

	http://<yourSiteName>.azurewebsites.net/cdn/MemeGenerator/Generate?top=<formInput>&bottom=<formInput>

After URL rewrite rule previously applied, the actual file that gets cached to your CDN endpoint is:

	http://<yourSiteName>.azurewebsites.net/MemeGenerator/Generate?top=<formInput>&bottom=<formInput>

You can then use the `OutputCacheAttribute` attribute on the `Generate` method to specify how the action result should be cached, which Azure CDN will honor. The code below specify a cache expiration of 1 hour (3,600 seconds).

    [OutputCache(VaryByParam = "*", Duration = 3600, Location = OutputCacheLocation.Downstream)]

Likewise, you can serve up content from any controller action in your Azure web app through your Azure CDN, with the desired caching option.

In the next section, I will show you how to serve the bundled and minified scripts and CSS through Azure CDN. 

## Integrate ASP.NET bundling and minification with Azure CDN ##

Scripts and CSS stylesheets change infrequently and are prime candidates for the Azure CDN cache. Serving the entire web app through your Azure CDN is the easiest way to integrate bundling and minification with Azure CDN. However, as you may elect against this approach for the reasons described in [Integrate an Azure CDN endpoint with your Azure web app and serve static content in your Web pages from Azure CDN](#deploy-a-web-app-to-azure-with-an-integrated-cdn-endpoint), I will show you how to do it while preserving the desired develper experience of ASP.NET bundling and minification, such as:

-	Great debug mode experience
-	Streamlined deployment
-	Immediate updates to clients for script/CSS version upgrades
-	Fallback mechanism when your CDN endpoint fails
-	Minimize code modification

In the ASP.NET project that you created in [Integrate an Azure CDN endpoint with your Azure web app and serve static content in your Web pages from Azure CDN](#deploy-a-web-app-to-azure-with-an-integrated-cdn-endpoint), open *App_Start\BundleConfig.cs* and take a look at the `bundles.Add()` method calls.

    public static void RegisterBundles(BundleCollection bundles)
    {
        bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery-{version}.js"));
        ...
    }

The first `bundles.Add()` statement adds a script bundle at the virtual directory `~/bundles/jquery`. Then, open *Views\Shared\_Layout.cshtml* to see how the script bundle tag is rendered. You should be able to find the following line of Razor code:

    @Scripts.Render("~/bundles/jquery")

When this Razor code is run in the Azure web app, it will render a `<script>` tag for the script bundle similar to the following: 

    <script src="/bundles/jquery?v=FVs3ACwOLIVInrAl5sdzR2jrCDmVOWFbZMY6g6Q0ulE1"></script>

However, when it is run in Visual Studio by typing `F5`, it will render each script file in the bundle individually (in the case above, only one script file is in the bundle):

    <script src="/Scripts/jquery-1.10.2.js"></script>

This enables you to debug the JavaScript code in your development environment while reducing concurrent client connections (bundling) and improving file download performance (minification) in production. It's a great feature to preserve with Azure CDN integration. Furthermore, since the rendered bundle already contains an automatically generated version string, you want to replicate that functionality so that whenever you update your jQuery version through NuGet, it can be updated at the client side as soon as possible.

Follow the steps below to integration ASP.NET bundling and minification with your CDN endpoint.

1. Back in *App_Start\BundleConfig.cs*, modify the `bundles.Add()` methods to use a different [Bundle constructor](http://msdn.microsoft.com/library/jj646464.aspx), one that specifies a CDN address. To do this, replace the `RegisterBundles` method definition with the following code:  
	
        public static void RegisterBundles(BundleCollection bundles)
        {
          bundles.UseCdn = true;
          var version = System.Reflection.Assembly.GetAssembly(typeof(Controllers.HomeController))
            .GetName().Version.ToString();
          var cdnUrl = "http://<yourCDNName>.azureedge.net/{0}?" + version;

          bundles.Add(new ScriptBundle("~/bundles/jquery", string.Format(cdnUrl, "bundles/jquery")).Include(
                "~/Scripts/jquery-{version}.js"));

          bundles.Add(new ScriptBundle("~/bundles/jqueryval", string.Format(cdnUrl, "bundles/jqueryval")).Include(
                "~/Scripts/jquery.validate*"));

          // Use the development version of Modernizr to develop with and learn from. Then, when you're
          // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
          bundles.Add(new ScriptBundle("~/bundles/modernizr", string.Format(cdnUrl, "bundles/modernizr")).Include(
                "~/Scripts/modernizr-*"));

          bundles.Add(new ScriptBundle("~/bundles/bootstrap", string.Format(cdnUrl, "bundles/bootstrap")).Include(
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js"));

          bundles.Add(new StyleBundle("~/Content/css", string.Format(cdnUrl, "Content/css")).Include(
                "~/Content/bootstrap.css",
                "~/Content/site.css"));
        }


	Be sure to replace `<yourCDNName>` with the name of your Azure CDN.

	In plain words, you are setting `bundles.UseCdn = true` and added a carefully crafted CDN URL to each bundle. For example, the first constructor in the code:

		new ScriptBundle("~/bundles/jquery", string.Format(cdnUrl, "bundles/jquery"))

	is the same as: 

		new ScriptBundle("~/bundles/jquery", string.Format(cdnUrl, "http://<yourCDNName>.azureedge.net/bundles/jquery?<W.X.Y.Z>"))

	This constructor tells ASP.NET bundling and minification to render individual script files when debugged locally, but use the specified CDN address to access the script in question. However, note two important characteristics with this carefully crafted CDN URL:
	
	- The origin for this CDN URL is `http://<yourSiteName>.azurewebsites.net/bundles/jquery?<W.X.Y.Z>`, which is actually the virtual directory of the script bundle in your Web application.
	- Since you are using CDN constructor, the CDN script tag for the bundle no longer contains the automatically generated version string in the rendered URL. You must manually generate a unique version string every time the script bundle is modified to force a cache miss at your Azure CDN. At the same time, this unique version string must remain constant through the life of the deployment to maximize cache hits at your Azure CDN after the bundle is deployed.

3. The query string `<W.X.Y.Z>` pulls from *Properties\AssemblyInfo.cs* in your ASP.NET project. You can have a deployment workflow that includes incrementing the assembly version every time you publish to Azure. Or, you can just modify *Properties\AssemblyInfo.cs* in your project to automatically increment the version string every time you build, using the wildcard character '*'. For example, change `AssemblyVersion` as shown below:
	
		[assembly: AssemblyVersion("1.0.0.*")]
	
	Any other strategy to streamline generating a unique string for the life of a deployment will work here.

3. Republish the ASP.NET application and access the home page.
 
4. View the HTML code for the page. You should be able to see the CDN URL rendered, with a unique version string every time you republish changes to your Azure web app. For example:  
	
        ...
        <link href="http://az673227.azureedge.net/Content/css?1.0.0.25449" rel="stylesheet"/>
        <script src="http://az673227.azureedge.net/bundles/modernizer?1.0.0.25449"></script>
        ...
        <script src="http://az673227.azureedge.net/bundles/jquery?1.0.0.25449"></script>
        <script src="http://az673227.azureedge.net/bundles/bootstrap?1.0.0.25449"></script>
        ...

5. In Visual Studio, debug the ASP.NET application in Visual Studio by typing `F5`., 

6. View the HTML code for the page. You will still see each script file individually rendered so that you can have a consistent debug experience in Visual Studio.  
	
        ...
        <link href="/Content/bootstrap.css" rel="stylesheet"/>
        <link href="/Content/site.css" rel="stylesheet"/>
        <script src="/Scripts/modernizr-2.6.2.js"></script>
        ...
        <script src="/Scripts/jquery-1.10.2.js"></script>
        <script src="/Scripts/bootstrap.js"></script>
        <script src="/Scripts/respond.js"></script>
        ...    

## Fallback mechanism for CDN URLs ##

When your Azure CDN endpoint fails for any reason, you want your Web page to be smart enough to access your origin Web server as the fallback option for loading JavaScript or Bootstrap. It's serious enough to lose images on your web app due to CDN unavailability, but much more severe to lose crucial page functionality provided by your scripts and stylesheets.

The [Bundle](http://msdn.microsoft.com/library/system.web.optimization.bundle.aspx) class contains a property called [CdnFallbackExpression](http://msdn.microsoft.com/library/system.web.optimization.bundle.cdnfallbackexpression.aspx) that enables you to configure the fallback mechanism for CDN failure. To use this property, follow the steps below:

1. In your ASP.NET project, open *App_Start\BundleConfig.cs*, where you added a CDN URL in each [Bundle constructor](http://msdn.microsoft.com/library/jj646464.aspx), and add `CdnFallbackExpression` code in four places as shown to add a fallback mechanism to the default bundles.  
	
        public static void RegisterBundles(BundleCollection bundles)
        {
          var version = System.Reflection.Assembly.GetAssembly(typeof(BundleConfig))
            .GetName().Version.ToString();
          var cdnUrl = "http://cdnurl.azureedge.net/.../{0}?" + version;
          bundles.UseCdn = true;

          bundles.Add(new ScriptBundle("~/bundles/jquery", string.Format(cdnUrl, "bundles/jquery")) 
                { CdnFallbackExpression = "window.jquery" }
                .Include("~/Scripts/jquery-{version}.js"));

          bundles.Add(new ScriptBundle("~/bundles/jqueryval", string.Format(cdnUrl, "bundles/jqueryval")) 
                { CdnFallbackExpression = "$.validator" }
                .Include("~/Scripts/jquery.validate*"));

          // Use the development version of Modernizr to develop with and learn from. Then, when you're
          // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
          bundles.Add(new ScriptBundle("~/bundles/modernizr", string.Format(cdnUrl, "bundles/modernizer")) 
                { CdnFallbackExpression = "window.Modernizr" }
                .Include("~/Scripts/modernizr-*"));

          bundles.Add(new ScriptBundle("~/bundles/bootstrap", string.Format(cdnUrl, "bundles/bootstrap"))     
                { CdnFallbackExpression = "$.fn.modal" }
                .Include(
                        "~/Scripts/bootstrap.js",
                        "~/Scripts/respond.js"));

          bundles.Add(new StyleBundle("~/Content/css", string.Format(cdnUrl, "Content/css")).Include(
                "~/Content/bootstrap.css",
                "~/Content/site.css"));
        }

	When `CdnFallbackExpression` is not null, script is injected into the HTML to test whether the bundle is loaded successfully and, if not, access the bundle directly from the origin Web server. This property needs to be set to a JavaScript expression that tests whether the respective CDN bundle is loaded properly. The expression needed to test each bundle differs according to the content. For the default bundles above:
	
	- `window.jquery` is defined in jquery-{version}.js
	- `$.validator` is defined in jquery.validate.js
	- `window.Modernizr` is defined in modernizer-{version}.js
	- `$.fn.modal` is defined in bootstrap.js
	
	You might have noticed that I did not set CdnFallbackExpression for the `~/Cointent/css` bundle. This is because currently there is a [bug in System.Web.Optimization](https://aspnetoptimization.codeplex.com/workitem/104) that injects a `<script>` tag for the fallback CSS instead of the expected `<link>` tag.
	
	There is, however, a good [Style Bundle Fallback](https://github.com/EmberConsultingGroup/StyleBundleFallback) offered by [Ember Consulting Group](https://github.com/EmberConsultingGroup). 

2. To use the workaround for CSS, create a new .cs file in your ASP.NET project's *App_Start* folder called *StyleBundleExtensions.cs*, and replace its content with the [code from GitHub](https://github.com/EmberConsultingGroup/StyleBundleFallback/blob/master/Website/App_Start/StyleBundleExtensions.cs). 

4. In *App_Start\StyleFundleExtensions.cs*, rename the namespace to your ASP.NET application's namespace (e.g. **cdnwebapp**). 

3. Go back to `App_Start\BundleConfig.cs` and replace the last `bundles.Add` statement with the following code:  

        bundles.Add(new StyleBundle("~/Content/css", string.Format(cdnUrl, "Content/css"))
          .IncludeFallback("~/Content/css", "sr-only", "width", "1px")
          .Include(
            "~/Content/bootstrap.css",
            "~/Content/site.css"));

	This new extension method uses the same idea to inject script in the HTML to check the DOM for the a matching class name, rule name, and rule value defined in the CSS bundle, and falls back to the origin Web server if it fails to find the match.

4. Publish to your Azure web app again and access the home page. 
5. View the HTML code for the page. You should find injected scripts similar to the following:    
	
	```
	...
	<link href="http://az673227.azureedge.net/Content/css?1.0.0.25474" rel="stylesheet"/>
<script>(function() {
                var loadFallback,
                    len = document.styleSheets.length;
                for (var i = 0; i < len; i++) {
                    var sheet = document.styleSheets[i];
                    if (sheet.href.indexOf('http://az673227.azureedge.net/Content/css?1.0.0.25474') !== -1) {
                        var meta = document.createElement('meta');
                        meta.className = 'sr-only';
                        document.head.appendChild(meta);
                        var value = window.getComputedStyle(meta).getPropertyValue('width');
                        document.head.removeChild(meta);
                        if (value !== '1px') {
                            document.write('<link href="/Content/css" rel="stylesheet" type="text/css" />');
                        }
                    }
                }
                return true;
            }())||document.write('<script src="/Content/css"><\/script>');</script>

	<script src="http://az673227.azureedge.net/bundles/modernizer?1.0.0.25474"></script>
 	<script>(window.Modernizr)||document.write('<script src="/bundles/modernizr"><\/script>');</script>
	... 
	<script src="http://az673227.azureedge.net/bundles/jquery?1.0.0.25474"></script>
	<script>(window.jquery)||document.write('<script src="/bundles/jquery"><\/script>');</script>

 	<script src="http://az673227.azureedge.net/bundles/bootstrap?1.0.0.25474"></script>
 	<script>($.fn.modal)||document.write('<script src="/bundles/bootstrap"><\/script>');</script>
	...
	```

	Note that injected script for the CSS bundle still contains the errant remnant from the `CdnFallbackExpression` property in the line:

		}())||document.write('<script src="/Content/css"><\/script>');</script>

	But since the first part of the || expression will always return true (in the line directly above that), the document.write() function will never run.

6. To test whether the fallback script is working, go back to the your CDN endpoint's blade and click **Stop**.

	![](media/cdn-websites-with-cdn/13-test-fallback.png)

7. Refresh your browser window for the Azure web app. You should now see that the all scripts and stylesheets are properly loaded.

## More Information 
- [Overview of the Azure Content Delivery Network (CDN)](../cdn/cdn-overview.md)
- [Using Azure CDN](../cdn/cdn-create-new-endpoint.md)
- [Integrate a cloud service with Azure CDN](../cdn/cdn-cloud-service-with-cdn.md)
- [ASP.NET Bundling and Minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification)

