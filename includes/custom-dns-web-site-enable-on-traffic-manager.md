---
author: cephalin
ms.service: app-service-web
ms.topic: include
ms.date: 11/09/2018
ms.author: cephalin
---
After the records for your domain name have propagated, you should be able to use your browser to verify that your custom domain name can be used to access your web app in Azure App Service.

> [!NOTE]
> It can take some time for your CNAME to propagate through the DNS system. You can use a service such as <a href="https://www.digwebinterface.com/">https://www.digwebinterface.com/</a> to verify that the CNAME is available.
> 
> 

If you have not already added your web app as a Traffic Manager endpoint, you must do this before name resolution will work, as the custom domain name routes to Traffic Manager. Traffic Manager then routes to your web app. Use the information in [Add or Delete Endpoints](../articles/traffic-manager/traffic-manager-endpoints.md) to add your web app as an endpoint in your Traffic Manager profile.

> [!NOTE]
> If your web app is not listed when adding an endpoint, verify that it is configured for **Standard** App Service plan mode. You must use **Standard** mode for your web app in order to work with Traffic Manager.
> 
> 

1. In your browser, open the [Azure Portal](https://portal.azure.com).
2. In the **Web Apps** tab, click the name of your web app, select **Settings**, and then select **Custom domains**
   
    ![](./media/custom-dns-web-site/dncmntask-cname-6.png)
3. In the **Custom domains** blade, click **Add hostname**.
4. Use the **Hostname** text boxes to enter the Traffic Manager domain name to associate with this web app.
   
    ![](./media/custom-dns-web-site/dncmntask-cname-8.png)
5. Click **Validate** to save the domain name configuration.
6. Upon clicking **Validate** Azure will kick off Domain Verification workflow. This will check for Domain ownership as well as Hostname availability and report success or detailed error with prescriptive guidance on how to fix the error.    
7. Upon successful validation **Add hostname** button will become active and you will be able to the assign hostname. Now navigate to your custom domain name in a browser. You should
   now see your app running using your custom domain name. 
   
   Once configuration has completed, the custom domain name will be listed in the **domain names** section of your web app.

At this point, you should be able to enter the Traffic Manager domain name in your browser and see that it successfully takes you to your web app.

